import { IErrorResponse } from "@changes-page/supabase/types/api";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { IBillingInfo } from "../../../data/user.interface";
import { getSupabaseServerClientForAPI } from "../../../utils/supabase/supabase-admin";
import { getUserById } from "../../../utils/useDatabase";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const getBillingStatus = async (
  req: NextApiRequest,
  res: NextApiResponse<IBillingInfo | IErrorResponse>
) => {
  if (req.method === "GET") {
    try {
      const { user } = await getSupabaseServerClientForAPI({ req, res });

      const {
        pro_gifted,
        stripe_customer_id,
        stripe_subscription,
        has_active_subscription,
      } = await getUserById(user.id);

      const { unit_amount } = await stripe.prices.retrieve(
        process.env.STRIPE_PRICE_ID
      );

      if (pro_gifted) {
        console.log(
          "getBillingStatus",
          user?.id,
          "user has gifted pro subscription"
        );

        return res.status(200).json({
          invoice: null,
          subscription: null,
          price: {
            unit_amount,
          },
          usage: null,
          has_active_subscription: true,
        });
      }

      if (!stripe_customer_id || !stripe_subscription) {
        console.log(
          "getBillingStatus",
          user?.id,
          "user has no stripe customer / subscription"
        );

        return res.status(200).json({
          invoice: null,
          subscription: null,
          price: {
            unit_amount,
          },
          usage: null,
          has_active_subscription: false,
        });
      }

      const {
        status,
        cancel_at,
        canceled_at,
        current_period_start,
        current_period_end,
        created,
        ended_at,
      } = stripe_subscription as unknown as Stripe.Subscription;

      let invoice = null;

      if (has_active_subscription) {
        try {
          invoice = await stripe.invoices.retrieveUpcoming({
            customer: stripe_customer_id,
          });

          const { amount_remaining, due_date, period_end, period_start } =
            invoice;

          const usage = (invoice?.lines?.data ?? []).map(
            (line) => line.description
          );

          return res.status(200).json({
            invoice: {
              amount_remaining,
              due_date,
              period_end,
              period_start,
            },
            subscription: {
              status,
              cancel_at,
              canceled_at,
              current_period_start,
              current_period_end,
              created,
              ended_at,
            },
            price: {
              unit_amount,
            },
            has_active_subscription,
            usage,
          });
        } catch (e) {
          if (e?.code !== "invoice_upcoming_none") {
            console.error("Stripe: failed to fetch invoice", e?.code);
          }
        }
      }

      return res.status(200).json({
        invoice,
        subscription: {
          status,
          cancel_at,
          canceled_at,
          current_period_start,
          current_period_end,
          created,
          ended_at,
        },
        price: {
          unit_amount,
        },
        has_active_subscription,
        usage: null,
      });
    } catch (err) {
      console.log("getBillingStatus", err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end("Method Not Allowed");
  }
};

export default getBillingStatus;
