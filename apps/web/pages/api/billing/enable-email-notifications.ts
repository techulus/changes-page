import Stripe from "stripe";
import { getUserById } from "../../../utils/useDatabase";
import { withAuth } from "../../../utils/withAuth";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const enableEmailNotifications = withAuth<{ status: string }>(
  async (req, res, { user }) => {
    if (req.method === "PUT") {
      try {
        const priceId = process.env.EMAIL_NOTIFICATION_STRIPE_PRICE_ID;
        if (!priceId) {
          return res.status(500).json({
            error: {
              statusCode: 500,
              message: "Internal error: Price ID not configured.",
            },
          });
        }

        const { stripe_subscription_id, stripe_subscription, pro_gifted } =
          await getUserById(user.id);

        if (pro_gifted) {
          return res.status(200).json({ status: "ok" });
        }

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

        if (!stripe_subscription_id) {
          return res.status(400).json({
            error: {
              statusCode: 400,
              message: "Missing Stripe subscription",
            },
          });
        }

        const subscription = await stripe.subscriptions.retrieve(
          stripe_subscription_id
        );

        // Ignore if already added to subscription
        if (
          subscription.items.data.find(
            (item: Stripe.SubscriptionItem) => item.price.id === priceId
          )
        ) {
          return res.status(200).json({ status: "ok" });
        }

        await stripe.subscriptionItems.create(
          {
            subscription: stripe_subscription_id,
            price: priceId,
          },
          {
            idempotencyKey: `sub:${stripe_subscription_id}:price:${priceId}`,
          }
        );

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
  }
);

export default enableEmailNotifications;
