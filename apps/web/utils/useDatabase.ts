import { Json } from "@changes-page/supabase/types";
import { Stripe } from "stripe";

import { supabaseAdmin } from "@changes-page/supabase/admin";
import { IAnalyticsData } from "@changes-page/supabase/types/api";
import { IPage } from "@changes-page/supabase/types/page";
import { IUser } from "../data/user.interface";
import { VALID_STRIPE_PRICE_IDS } from "../pages/api/billing/jobs/report-usage";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const getUserById = async (user_id: string): Promise<IUser> => {
  const { data: user, error: getUserError } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("id", user_id)
    .single();

  if (getUserError) throw getUserError;

  return {
    ...user,
    has_active_subscription:
      user.pro_gifted === true
        ? true
        : ["trialing", "active"].includes(
            (user?.stripe_subscription as unknown as Stripe.Subscription)
              ?.status
          ),
  } as unknown as IUser;
};

export const getPagesCount = async (user_id: string) => {
  const { error: getPageCountError, count: usageQuantity } = await supabaseAdmin
    .from("pages")
    .select("id", { count: "exact", head: true })
    .match({ user_id: user_id });

  if (getPageCountError) throw getPageCountError;

  return usageQuantity;
};

export const validatePageByUrl = async (url_slug: string, page_id?: string) => {
  const { data: page } = await supabaseAdmin
    .from("pages")
    .select("id")
    .eq("url_slug", url_slug)
    .single();

  return !page || page?.id == page_id;
};

export const createPage = async ({
  user_id,
  url_slug,
  title,
  description,
  type,
}) => {
  const { data, error } = await supabaseAdmin
    .from("pages")
    .insert([{ user_id, url_slug, title, description, type }])
    .select();

  if (error) throw error;

  console.log(`New page created and inserted for ${user_id}.`);
  return data[0];
};

export const createPost = async (post) => {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .insert([{ ...post }])
    .select();

  if (error) throw error;

  console.log(`New post created and inserted for page ${post.page_id}.`);
  return data[0];
};

export const createOrRetrieveCustomer = async (
  user_id: string,
  email: string
) => {
  const user = await getUserById(user_id);

  if (user.stripe_customer_id) {
    return user.stripe_customer_id;
  }

  const customer = await stripe.customers.create({
    email,
    metadata: {
      user_id,
    },
  });

  // Now insert the customer ID into our Supabase mapping table.
  const { error: updateUserError } = await supabaseAdmin
    .from("users")
    .update({ stripe_customer_id: customer.id })
    .match({ id: user.id });

  if (updateUserError) throw updateUserError;

  console.log(`New customer created and inserted for user: ${user.id}.`);
  return customer.id;
};

export const updateUserSubscription = async (
  subscription: Stripe.Subscription,
  eventKey: number
) => {
  const { data: user, error: getUserError } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("stripe_customer_id", String(subscription.customer))
    .single();

  if (getUserError) throw getUserError;

  const { error: updateUserError } = await supabaseAdmin
    .from("users")
    .update({
      stripe_subscription_id: subscription.id,
      stripe_subscription: subscription as unknown as Json,
    })
    .match({ id: user.id });

  if (updateUserError) throw updateUserError;

  console.log(`Update subscription for user: ${user.id}.`);

  await updateSubscriptionUsage(
    user.id,
    `subscription-${subscription.id}-change-${eventKey ?? Date.now()}`
  );
};

export const updateSubscriptionUsage = async (
  user_id: string,
  idempotencyKey: string
) => {
  const user = await getUserById(user_id);

  if (!user.stripe_customer_id || !user.stripe_subscription_id) {
    return false;
  }

  const timestamp = parseInt(`${Date.now() / 1000}`);

  const subscription = await stripe.subscriptions.retrieve(
    user.stripe_subscription_id
  );

  // return subscription if it's canceled
  if (subscription.status === "canceled") {
    console.log(
      `Update page usage count for user: ${user_id} canceled. Subscription is canceled.`
    );
    return subscription;
  }

  const usageQuantity = await getPagesCount(user_id);

  const pagesSubscriptionItem = (
    user.stripe_subscription as unknown as Stripe.Subscription
  ).items?.data.find((item) => VALID_STRIPE_PRICE_IDS.includes(item.price.id));

  if (!pagesSubscriptionItem) {
    console.log(
      `Update page usage count for user: ${user_id} canceled. Page subscription item not found.`
    );
    return subscription;
  }

  console.log(
    `Update usage count for user: ${user_id} to ${usageQuantity}`,
    idempotencyKey
  );
  try {
    await stripe.subscriptionItems.createUsageRecord(
      pagesSubscriptionItem.id,
      {
        quantity: usageQuantity,
        timestamp: timestamp,
        action: "set",
      },
      {
        idempotencyKey,
      }
    );

    return subscription;
  } catch (error) {
    console.error(
      `Page usage report failed for idempotency key ${idempotencyKey}: ${error.toString()}`
    );
  }
};

export const createOrRetrievePageSettings = async (
  user_id: string,
  page_id: string
) => {
  const { data: pageSettings } = await supabaseAdmin
    .from("page_settings")
    .select("*")
    .eq("page_id", page_id)
    .eq("user_id", user_id)
    .single();

  if (pageSettings) return pageSettings;

  const { data: newPageSettings, error: createPageSettingsError } =
    await supabaseAdmin
      .from("page_settings")
      .insert([{ user_id, page_id }])
      .select();

  if (createPageSettingsError) throw createPageSettingsError;

  return newPageSettings[0];
};

export const getPageByIntegrationSecret = async (
  secret_key: string
): Promise<IPage> => {
  const { data: settings, error: settingsError } = await supabaseAdmin
    .from("page_settings")
    .select("page_id")
    .eq("integration_secret_key", secret_key)
    .single();

  if (settingsError) throw new Error("Invalid secret key");

  const { data: page, error: pageError } = await supabaseAdmin
    .from("pages")
    .select("*")
    .eq("id", settings.page_id)
    .single();

  if (pageError) throw pageError;

  if (page) return page;
};

export const getPageById = async (id: string): Promise<IPage> => {
  const { error, data } = await supabaseAdmin
    .from("pages")
    .select("*")
    .match({ id })
    .single();

  if (error) throw error;

  return data;
};

export const reportEmailUsage = async (
  user_id: string,
  page_id: string,
  post_id: string
) => {
  const user = await getUserById(user_id);

  if (!user.stripe_customer_id || !user.stripe_subscription_id) {
    return false;
  }

  const timestamp = parseInt(`${Date.now() / 1000}`);

  const subscription: Stripe.Subscription = await stripe.subscriptions.retrieve(
    user.stripe_subscription_id
  );

  // return subscription if it's canceled
  if (subscription.status === "canceled") {
    console.log(
      `Update usage count for user: ${user_id} canceled. Subscription is canceled.`
    );
    return subscription;
  }

  const emailSubscriptionItem = subscription.items?.data.find(
    (item) => item.price.id === process.env.EMAIL_NOTIFICATION_STRIPE_PRICE_ID
  );

  // return is email subscription is not found
  if (!emailSubscriptionItem) {
    console.log(
      `Update usage count for user: ${user_id} canceled. Email subscription is not found.`
    );
    return subscription;
  }

  const { count } = await supabaseAdmin
    .from("page_email_subscribers")
    .select("page_id", { count: "exact" })
    .eq("page_id", page_id)
    .eq("status", "verified");

  const idempotencyKey = `email-usage-${page_id}-${post_id}`;

  console.log(
    `Update email usage count for user: ${user_id} to ${count}`,
    idempotencyKey
  );
  try {
    await stripe.subscriptionItems.createUsageRecord(
      emailSubscriptionItem.id,
      {
        quantity: count,
        timestamp: timestamp,
        action: "increment",
      },
      {
        idempotencyKey,
      }
    );

    return subscription;
  } catch (error) {
    console.error(
      `Email usage report failed for idempotency key ${idempotencyKey}: ${error.toString()}`
    );
  }
};

export async function getPageAnalytics(
  page_id: string,
  metric: string,
  range: string
) {
  let functionName:
    | "page_view_browsers"
    | "page_view_os"
    | "page_view_referrers" = "page_view_browsers";

  switch (metric) {
    case "browsers":
      functionName = "page_view_browsers";
      break;
    case "os":
      functionName = "page_view_os";
      break;
    case "referrers":
      functionName = "page_view_referrers";
      break;
    default:
      functionName = "page_view_browsers";
      break;
  }

  // date {range} days ago
  const date = new Date(
    Date.now() - (Number(range) || 7) * 24 * 60 * 60 * 1000
  );
  console.log(
    `Fetching ${metric} for page ${page_id} for last ${range} days: ${date.toISOString()}`
  );

  const args = {
    pageid: String(page_id),
    date: date.toISOString(),
  };

  const { data } = await supabaseAdmin.rpc(functionName, args).throwOnError();

  return data as unknown as IAnalyticsData[];
}
