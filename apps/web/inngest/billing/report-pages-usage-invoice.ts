import { supabaseAdmin } from "@changes-page/supabase/admin";
import Stripe from "stripe";
import { v4 } from "uuid";
import inngestClient from "../../utils/inngest";
import { getPagesCount } from "../../utils/useDatabase";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const VALID_STRIPE_PRICE_IDS = [
  process.env.STRIPE_PRICE_ID,
  "price_1MLFQuANshKlWJZhewDi9zsm",
  "price_1KSYX4ANshKlWJZhXewQ7dKI",
  "price_1LMs7rANshKlWJZhNfiBHdpx",
];

export const reportUsageForStripeInvoice = inngestClient.createFunction(
  { name: "Billing: Report pages usage" },
  { event: "stripe/invoice.created" },
  async ({ event }) => {
    const jobId = v4();

    const { invoice } = event.data;
    console.log("reportUsageJob started for invoice: ", invoice.id);

    const { subscription: stripe_subscription_id } = invoice;
    console.log(`Reporting usage for subscription: ${stripe_subscription_id}`);

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id,stripe_subscription")
      .eq("stripe_subscription_id", stripe_subscription_id)
      .maybeSingle();

    if (error) throw new Error(error.message);

    if (!user) {
      console.log(`No user found for subscription: ${stripe_subscription_id}`);
      return { body: "Job skipped" };
    }

    const subscription =
      user.stripe_subscription as unknown as Stripe.Subscription;

    if (
      subscription.status !== "active" &&
      subscription.status !== "trialing"
    ) {
      console.log(
        `Subscription is ${subscription.status} for user: ${user.id}`
      );
      return { body: "Job skipped" };
    }

    const timestamp = parseInt(`${Date.now() / 1000}`);
    const idempotencyKey = `${user.id}-report-job-${jobId}`;
    const usageQuantity = await getPagesCount(user.id);

    console.log(
      `Update usage count for user: ${user.id} to ${usageQuantity}`,
      idempotencyKey
    );

    const pagesSubscriptionItem = subscription.items?.data.find((item) =>
      VALID_STRIPE_PRICE_IDS.includes(item.price.id)
    );

    if (!pagesSubscriptionItem) {
      console.log(`No page subscription item found for user: ${user.id}`);
      return { body: "Job skipped" };
    }

    console.log(
      `Found subscription item for user: ${user.id}`,
      pagesSubscriptionItem.id
    );

    const result = await stripe.subscriptionItems.createUsageRecord(
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

    return { body: "Job completed", result };
  }
);
