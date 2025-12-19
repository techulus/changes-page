import { Database } from "@changespage/supabase/types";
import { Stripe } from "stripe";

export type IUser = Database["public"]["Tables"]["users"]["Row"] & {
  stripe_subscription: Stripe.Subscription | null;
  has_active_subscription: boolean;
};

export interface IBillingInfo {
  has_active_subscription: boolean;
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
