import { v4 } from "uuid";
import { IPageEmailSubscriber } from "@changespage/supabase/types/page";
import { supabaseAdmin } from "@changespage/supabase/admin";

async function subscribeViaEmail(
  pageId: string,
  email: string
): Promise<IPageEmailSubscriber> {
  const { count, error: countError } = await supabaseAdmin
    .from("page_email_subscribers")
    .select("*", { count: "exact" })
    .eq("page_id", pageId)
    .eq("email", email);

  if (countError) throw countError;

  if (count) throw new Error("You're already subscribed.");

  const { data, error } = await supabaseAdmin
    .from("page_email_subscribers")
    .insert([
      {
        page_id: pageId,
        recipient_id: v4(),
        email,
        // valid_till is set to 60 minutes from now
        valid_till: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        status: "not_verified",
      },
    ])
    .select();

  if (error) throw error;

  if (!data) throw new Error("No data returned");

  console.log(`New email token created and inserted for ${pageId}.`);
  return data[0];
}

async function verifyPageEmailToken(
  pageId: string,
  email: string,
  recipientId: string
): Promise<IPageEmailSubscriber> {
  console.log("verifyPageEmailToken", { pageId, email, recipientId });

  const { data, error } = await supabaseAdmin
    .from("page_email_subscribers")
    .update({ status: "verified" })
    .eq("page_id", pageId)
    .eq("email", email)
    .eq("recipient_id", recipientId)
    .select();

  if (error) throw error;

  if (!data?.length) throw new Error("No data returned");

  console.log(`Email token verified for ${pageId}.`);

  return data[0];
}

export { subscribeViaEmail, verifyPageEmailToken };
