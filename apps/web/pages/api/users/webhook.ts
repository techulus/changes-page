import { NextApiRequest, NextApiResponse } from "next";
import inngestClient from "../../../utils/inngest";

const databaseWebhook = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      if (req?.headers["x-webhook-key"] !== process.env.SUPABASE_WEBHOOK_KEY) {
        return res
          .status(400)
          .json({ error: { statusCode: 500, message: "Invalid webhook key" } });
      }

      const { type, record, old_record } = req.body;
      const user: {
        id: string;
        email?: string;
        raw_user_meta_data?: {
          name?: string;
          full_name?: string;
        };
      } = record || old_record;

      const { id, email } = user;
      console.log("Trigger databaseWebhook [Users]: Record:", type, id);

      if (type === "INSERT") {
        await inngestClient.send({
          name: "email/user.welcome",
          data: {
            email,
            payload: {
              first_name:
                user.raw_user_meta_data?.full_name ??
                user.raw_user_meta_data?.name ??
                "there",
            },
          },
          user: {
            id,
          },
        });
      }

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.log("Trigger databaseWebhook [Users]: Error:", err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "POST,PUT");
    res.status(405).end("Method Not Allowed");
  }
};

export default databaseWebhook;
