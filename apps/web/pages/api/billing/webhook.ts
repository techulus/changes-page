const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
import type { NextApiRequest, NextApiResponse } from "next";
import inngestClient from "../../../utils/inngest";

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const buffer = (req) => {
  return new Promise((resolve, reject) => {
    const body = [];
    req
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        resolve(Buffer.concat(body));
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

const relevantEvents = new Set([
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.created",
]);

const webhookHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<{ received: boolean } | string>
) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      // On error, log and return the error message.
      console.log(`❌ Error message: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (relevantEvents.has(event.type)) {
      try {
        switch (event.type) {
          case "customer.subscription.created":
          case "customer.subscription.updated":
          case "customer.subscription.deleted":
            await inngestClient.send({
              name: "stripe/subscription",
              data: {
                subscription: event.data.object,
              },
            });

            return res.json({ received: true });
          case "invoice.created":
            await inngestClient.send({
              name: "stripe/invoice.created",
              data: {
                invoice: event.data.object,
              },
            });

            return res.json({ received: true });
          default:
            throw new Error("Unhandled relevant event!");
        }
      } catch (error) {
        console.log(error);
        return res.status(400).send("Webhook handler failed. View logs.");
      }
    }

    // Return a response to acknowledge receipt of the event.
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default webhookHandler;
