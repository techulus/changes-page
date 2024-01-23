import inngestClient from "../../utils/inngest";
import { updateUserSubscription } from "../../utils/useDatabase";

export const handleSubscriptionChange = inngestClient.createFunction(
  { name: "Billing: Subscription change" },
  { event: "stripe/subscription" },
  async ({ event }) => {
    const { subscription } = event.data;
    console.log(
      "handleSubscriptionChange started for subscription: ",
      subscription.id
    );

    await updateUserSubscription(subscription, event.ts);
    return { body: "Job completed" };
  }
);
