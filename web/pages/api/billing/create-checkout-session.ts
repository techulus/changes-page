import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { IErrorResponse } from "../../../data/api.interface";
import { getSupabaseServerClient } from "../../../utils/supabase/supabase-admin";
import {
  createOrRetrieveCustomer,
  getUserById,
} from "../../../utils/useDatabase";
import { getAppBaseURL } from "./../../../utils/helpers";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createCheckout = async (
  req: NextApiRequest,
  res: NextApiResponse<{ url: string } | IErrorResponse>
) => {
  if (req.method === "POST") {
    const { return_url } = req.body;

    try {
      const { user } = await getSupabaseServerClient({ req, res });

      const { stripe_customer_id, stripe_subscription } = await getUserById(
        user.id
      );

      const customer = await createOrRetrieveCustomer(user.id, user.email);

      if (
        stripe_customer_id &&
        stripe_subscription &&
        ["trialing", "active"].includes(
          (stripe_subscription as unknown as Stripe.Subscription).status
        )
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

        return res.status(201).json({ url });
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

      return res.status(201).json({ url });
    } catch (err) {
      console.log("createCheckout", err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default createCheckout;
