import { supabaseAdmin } from "@changespage/supabase/admin";
import { IPage, IPageSettings, IPost } from "@changespage/supabase/types/page";
import {
  convertMarkdownToHtml,
  convertMarkdownToPlainText,
} from "@changespage/utils";
import { getPageUrl, getPostUrl } from "./hooks/usePageUrl";
import inngestClient from "./inngest";
import { getUserById } from "./useDatabase";

const BATCH_SIZE = 50;

const fetchAllSubscribers = async (page_id: string) => {
  const subscribers: { email: string }[][] = [];

  // cursor
  let total = 0;

  const { count } = await supabaseAdmin
    .from("page_email_subscribers")
    .select("email", { count: "exact" })
    .eq("page_id", page_id)
    .eq("status", "verified");

  console.log("fetchAllSubscribers: Count: ", count);

  while (total < count) {
    const { data, error } = await supabaseAdmin
      .from("page_email_subscribers")
      .select("email")
      .eq("page_id", page_id)
      .eq("status", "verified")
      .range(total, total + BATCH_SIZE);

    if (error) throw error;

    total += data.length;
    subscribers.push(data);

    if (!data.length) break;
  }

  console.log("fetchAllSubscribers: Got Subscribers: ", total);

  return subscribers;
};

export const sendPostEmailToSubscribers = async (
  post: IPost,
  page: IPage,
  settings: IPageSettings
) => {
  if (!settings?.email_notifications) {
    console.log("sendPostEmailToSubscribers: Email notifications disabled");
    return;
  }

  if (!settings?.email_physical_address) {
    console.log("sendPostEmailToSubscribers: Email physical address not set");
    return;
  }

  const user = await getUserById(page.user_id);
  if (!user?.has_active_subscription) {
    console.log(
      "sendPostEmailToSubscribers: Account not subscribed to email notifications"
    );
    return;
  }

  const subscriberChunks = (await fetchAllSubscribers(page.id)) ?? [];

  console.log(
    "sendPostEmailToSubscribers: Batch size: ",
    subscriberChunks.length
  );

  for (const subscribers of subscriberChunks) {
    const events = await Promise.all(
      subscribers.map(async ({ email }) => ({
        name: "email/page.publish",
        data: {
          email,
          payload: {
            // page
            page_url: getPageUrl(page, settings),
            page_title: page.title,
            page_logo:
              settings.page_logo ?? "https://changes.page/images/logo.png",
            // post
            post_title: post.title,
            post_content: convertMarkdownToHtml(post.content),
            post_content_plain: convertMarkdownToPlainText(post.content),
            post_link: getPostUrl(getPageUrl(page, settings), post),
            // legal
            email_physical_address: settings?.email_physical_address,
          },
          metadata: {
            campaign: "post",
            page_id: page.id,
            post_id: post.id,
          },
          replyTo: !!settings?.email_reply_to
            ? settings.email_reply_to
            : "support@changes.page",
        },
        user: {
          id: page.user_id,
        },
      }))
    );

    if (!events.length) continue;

    console.log(
      "sendPostEmailToSubscribers: Pushing events to inngest: ",
      events.length
    );

    await inngestClient.send(events);
  }

  // Mark post as notified
  await supabaseAdmin
    .from("posts")
    .update({ email_notified: true })
    .match({ id: post.id });
};

export const removeSubscriber = async (email: string, page_id: string) => {
  await supabaseAdmin
    .from("page_email_subscribers")
    .delete()
    .eq("email", email)
    .eq("page_id", page_id);
};
