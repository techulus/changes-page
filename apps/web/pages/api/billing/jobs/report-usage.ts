import type { NextApiRequest, NextApiResponse } from "next";
import { Stripe } from "stripe";
import { v4 } from "uuid";
import { IErrorResponse } from "@changes-page/supabase/types/api";
import { supabaseAdmin } from "../../../../utils/supabase/supabase-admin";
import { getPagesCount } from "../../../../utils/useDatabase";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const VALID_STRIPE_PRICE_IDS = [
  process.env.STRIPE_PRICE_ID,
  "price_1MLFQuANshKlWJZhewDi9zsm",
  "price_1KSYX4ANshKlWJZhXewQ7dKI",
  "price_1LMs7rANshKlWJZhNfiBHdpx",
];

const reportUsageJob = async (
  req: NextApiRequest,
  res: NextApiResponse<{ status: string } | IErrorResponse>
) => {
  try {
    const jobId = v4();

    console.log(`[${jobId}] Starting report usage job`);

    const { data: users, error } = await supabaseAdmin
      .from("users")
      .select("id,stripe_subscription,stripe_subscription->>status")
      .filter("stripe_subscription->>status", "in", '("active","trialing")');

    if (error) throw error;

    console.log(`Job ${jobId} - Found ${users?.length} users`);

    for (const user of users ?? []) {
      const subscription =
        user.stripe_subscription as unknown as Stripe.Subscription;

      console.log(
        `Job ${jobId} - Processing user ${user.id} with status ${subscription.status}`
      );

      if (
        subscription.status !== "active" &&
        subscription.status !== "trialing"
      ) {
        continue;
      }

      console.log(`Reporting usage for user: ${user.id}`);

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
        continue;
      }

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
    }

    console.log(`Job ${jobId} - Finished`);

    return res.status(200).json({ status: "ok" });
  } catch (err) {
    console.log("reportUsageJob", err);
    res.status(500).json({ error: { statusCode: 500, message: err.message } });
  }
};

export default reportUsageJob;
