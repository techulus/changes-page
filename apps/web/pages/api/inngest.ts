import { serve } from "inngest/next";
import { handleSubscriptionChange } from "../../inngest/billing/handle-subscription";
import { reportUsageForStripeInvoice } from "../../inngest/billing/report-pages-usage-invoice";
import { sendConfirmEmailNotification } from "../../inngest/email/send-confirm-email-notification";
import { sendRoadmapTriageNotification } from "../../inngest/email/send-roadmap-triage-notification";
import { sendTeamInviteEmail } from "../../inngest/email/send-team-invite";
import { sendWelcomeEmail } from "../../inngest/email/send-welcome-email";
import { sendVisitorMagicLink } from "../../inngest/email/send-visitor-magic-link";
import { deleteImagesJob } from "../../inngest/jobs/delete-images";
import { processGitHubChangelog } from "../../inngest/jobs/process-github-changelog";
import { sendPostNotification } from "./../../inngest/email/send-post-notification";

export default serve("changes-page", [
  reportUsageForStripeInvoice,
  handleSubscriptionChange,
  sendConfirmEmailNotification,
  sendPostNotification,
  sendRoadmapTriageNotification,
  sendWelcomeEmail,
  sendTeamInviteEmail,
  sendVisitorMagicLink,
  deleteImagesJob,
  processGitHubChangelog,
]);
