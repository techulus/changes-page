import { useRouter } from "next/router";
import { useEffect } from "react";
import { httpPost } from "../../utils/http";
import { useUserData } from "../../utils/useUser";
import {
  notifyError,
  notifyInfo,
  notifySuccess,
} from "../core/toast.component";

export default function BillingBanner() {
  const router = useRouter();
  const { billingDetails } = useUserData();

  const { payment_success } = router.query;

  useEffect(() => {
    if (payment_success === "true") {
      notifySuccess("Upgrade completed!");
    }
  }, [payment_success]);

  async function startPlan() {
    try {
      notifyInfo("Redirecting to checkout...");

      const session = await httpPost({
        url: `/api/billing/create-checkout-session`,
        data: {
          return_url: window?.location?.href,
        },
      });

      window.location.href = session.url;
    } catch (e) {
      notifyError();
    }
  }

  if (billingDetails?.has_active_subscription || !billingDetails?.price) {
    return null;
  }

  if (router.pathname !== "/pages") return null;

  if (!billingDetails?.subscription)
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pb-0">
        <div className="rounded-md bg-white dark:bg-black p-4 my-2 border-2 border-yellow-400 dark:border-yellow-700">
          <div className="flex flex-col md:flex-row">
            <div className="ml-3">
              <h3 className="text-lg font-bold text-black dark:text-white">
                Upgrade your account
              </h3>
              <div className="mt-2 text-md text-black dark:text-white">
                <p className="text-md">
                  14 days free trial, then pay{" "}
                  <b>${Number(billingDetails?.price?.unit_amount) / 100}</b>{" "}
                  /page /month
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-2 ml-4 md:ml-auto mr-4 mb-2">
              <div className="-mx-2 -my-1.5 flex">
                <button
                  type="button"
                  className="bg-yellow-300 px-3 py-2 rounded-md text-md border border-yellow-200 text-black hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600 font-bold"
                  onClick={startPlan}
                >
                  Start free trial
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  if (billingDetails?.subscription)
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pb-0">
        <div className="rounded-md bg-red-50 dark:bg-red-900 p-4 mt-2 border border-red-200 dark:border-red-700">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-100">
                Your subscription has expired
              </h3>
              <div className="mt-2 text-md text-red-700 dark:text-red-200">
                <p>
                  Please subscribe at{" "}
                  <b>${Number(billingDetails?.price?.unit_amount) / 100}</b>{" "}
                  /page /month to continue uninterrupted usage.
                </p>
              </div>
              <div className="mt-4 mb-2">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    type="button"
                    className="bg-yellow-300 px-3 py-2 rounded-md text-md border border-yellow-200 text-black hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600 font-bold"
                    onClick={startPlan}
                  >
                    Subscribe now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  return null;
}
