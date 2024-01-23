import type { NextApiRequest, NextApiResponse } from "next";
import { IErrorResponse } from "../../../data/api.interface";
import { getSupabaseServerClient } from "../../../utils/supabase/supabase-admin";
import { createOrRetrieveCustomer } from "../../../utils/useDatabase";
import { getAppBaseURL } from "./../../../utils/helpers";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createBillingSession = async (
  req: NextApiRequest,
  res: NextApiResponse<{ url: string } | IErrorResponse>
) => {
  if (req.method === "POST") {
    const { return_url } = req.body;

    try {
      const { user } = await getSupabaseServerClient({ req, res });
      const customer = await createOrRetrieveCustomer(user.id, user.email);

      console.log(
        "createBillingSession",
        user?.id,
        "create billing session for existing user"
      );

      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: return_url || `${getAppBaseURL()}/account/billing`,
      });

      return res.status(201).json({ url });
    } catch (err) {
      console.log("createBillingSession", err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default createBillingSession;
