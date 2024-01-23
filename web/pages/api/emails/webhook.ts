import { NextApiRequest, NextApiResponse } from "next";
import { removeSubscriber } from "../../../utils/email";

const postmarkWebhook = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      if (req?.headers["x-webhook-key"] !== process.env.POSTMARK_WEBHOOK_KEY) {
        return res
          .status(400)
          .json({ error: { statusCode: 500, message: "Invalid webhook key" } });
      }

      const { Type, RecordType, Metadata, Email, Recipient, SuppressSending } =
        req.body;
      const { page_id } = Metadata;

      if (!page_id) {
        return res
          .status(400)
          .json({ error: { statusCode: 500, message: "Invalid Metadata" } });
      }

      if (
        Type === "SpamComplaint" ||
        Type === "HardBounce" ||
        (RecordType === "SubscriptionChange" && SuppressSending)
      ) {
        console.log(
          "Unsubscribe",
          Email || Recipient,
          "from",
          page_id,
          "for reason",
          Type || RecordType
        );

        await removeSubscriber(Email || Recipient, page_id);
      }

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.log("Trigger postmarkWebhook: Error:", err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "POST,PUT");
    res.status(405).end("Method Not Allowed");
  }
};

export default postmarkWebhook;
