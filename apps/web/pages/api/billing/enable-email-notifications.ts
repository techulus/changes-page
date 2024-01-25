import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { IErrorResponse } from "@changes-page/supabase/types/api";
import { getSupabaseServerClient } from "../../../utils/supabase/supabase-admin";
import { getUserById } from "../../../utils/useDatabase";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const enableEmailNotifications = async (
  req: NextApiRequest,
  res: NextApiResponse<{ status: string } | IErrorResponse>
) => {
  if (req.method === "PUT") {
    try {
      const { user } = await getSupabaseServerClient({ req, res });

      const { stripe_subscription_id, stripe_subscription } = await getUserById(
        user.id
      );

      if (
        !stripe_subscription ||
        (stripe_subscription as unknown as Stripe.Subscription)?.status ===
          "canceled"
      ) {
        return res.status(400).json({
          error: {
            statusCode: 400,
            message:
              "You have canceled your subscription. Please reactivate it to continue using this feature.",
          },
        });
      }

      const subscription = await stripe.subscriptions.retrieve(
        stripe_subscription_id
      );

      // Ignore if already added to subscription
      if (
        subscription.items.data.find(
          (item) =>
            item.price.id === process.env.EMAIL_NOTIFICATION_STRIPE_PRICE_ID
        )
      ) {
        return res.status(200).json({ status: "ok" });
      }

      await stripe.subscriptionItems.create({
        subscription: stripe_subscription_id,
        price: process.env.EMAIL_NOTIFICATION_STRIPE_PRICE_ID,
      });

      return res.status(201).json({ status: "ok" });
    } catch (err) {
      console.log("createBillingSession", err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "PUT");
    res.status(405).end("Method Not Allowed");
  }
};

export default enableEmailNotifications;
