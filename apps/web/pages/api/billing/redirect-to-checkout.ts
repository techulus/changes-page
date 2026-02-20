import { getAppBaseURL } from "../../../utils/helpers";
import {
  createOrRetrieveCustomer,
  getUserById,
} from "../../../utils/useDatabase";
import { withAuth } from "../../../utils/withAuth";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const redirectToCheckout = withAuth(async (req, res, { user }) => {
  if (req.method === "GET") {
    const { return_url } = req.query;

    try {
      const {
        stripe_customer_id,
        stripe_subscription,
        has_active_subscription,
      } = await getUserById(user.id);

      const customer = await createOrRetrieveCustomer(user.id, user.email);

      if (
        stripe_customer_id &&
        stripe_subscription &&
        has_active_subscription
      ) {
        console.log(
          "createCheckout",
          user?.id,
          "create billing session for existing user"
        );

        const { url } = await stripe.billingPortal.sessions.create({
          customer,
          return_url: return_url || `${getAppBaseURL()}/pages`,
        });

        res.redirect(307, url);
        return;
      }

      console.log(
        "createCheckout",
        user?.id,
        "create new checkout session for  user"
      );

      const subscription_data: { metadata: any; trial_period_days?: number } = {
        metadata: {
          user_id: user?.id,
        },
      };
      const discounts = [];

      if (!stripe_subscription) {
        // allow trial for new users
        subscription_data.trial_period_days = 14;
      }

      const { url } = await stripe.checkout.sessions.create({
        customer,
        metadata: {
          user_id: user.id,
        },
        billing_address_collection: "auto",
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID,
          },
        ],
        mode: "subscription",
        subscription_data,
        discounts,
        allow_promotion_codes: true, // allow promo codes
        success_url: `${return_url || getAppBaseURL()}?payment_success=true`,
        cancel_url: return_url || getAppBaseURL(),
      });

      res.redirect(307, url);
      return;
    } catch (err) {
      console.log("createCheckout", err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end("Method Not Allowed");
  }
});

export default redirectToCheckout;
