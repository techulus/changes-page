import { Stripe } from "stripe";
import { Database } from "@changes-page/supabase/types";

export type IUser = Database["public"]["Tables"]["users"]["Row"];

export interface IBillingInfo {
  // custom
  hasActiveSubscription?: boolean;

  // from stripe
  invoice: {
    amount_remaining: string;
    due_date: number;
    period_end: number;
    period_start: number;
  } | null;
  subscription: {
    status: Stripe.Subscription.Status;
    cancel_at: number;
    canceled_at: number;
    current_period_start: number;
    current_period_end: number;
    created: number;
    ended_at: number;
  } | null;
  price: {
    unit_amount: number | null;
  } | null;
  usage: string[] | null;
}
