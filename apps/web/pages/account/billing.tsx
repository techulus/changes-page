import { CurrencyDollarIcon } from "@heroicons/react/outline";
import { CalendarIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { useEffect } from "react";
import { SecondaryButton } from "../../components/core/buttons.component";
import { SpinnerWithSpacing } from "@changes-page/ui";
import { notifyError, notifyInfo } from "../../components/core/toast.component";
import AuthLayout from "../../components/layout/auth-layout.component";
import Page from "../../components/layout/page.component";
import { ROUTES } from "../../data/routes.data";
import { track } from "../../utils/analytics";
import { DateTime } from "../../utils/date";
import { httpPost } from "../../utils/helpers";
import { useUserData } from "../../utils/useUser";

export default function Billing() {
  const { billingDetails, fetchBilling } = useUserData();

  async function openBillingPortal() {
    try {
      notifyInfo("Redirecting to billing portal...");

      track("OpenBillingPortal");

      const session = await httpPost({
        url: "/api/billing/create-billing-portal",
        data: {
          return_url: window?.location?.href,
        },
      });

      window.location.href = session.url;
    } catch (e) {
      notifyError(
        "Oops! Something went wrong, we're unable to fetch billing information."
      );
    }
  }

  useEffect(() => {
    fetchBilling();
  }, [fetchBilling]);

  return (
    <Page title="Billing" backRoute={ROUTES.PAGES} showBackButton={true}>
      <div className="mt-4 mb-6 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-50">
                Manage Subscription
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                We partner with Stripe to manage billing.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            {!billingDetails && <SpinnerWithSpacing />}

            {billingDetails && (
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-3 bg-white dark:bg-black sm:p-3">
                  <h2
                    id="billing-history-heading"
                    className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100"
                  >
                    Subscription is{" "}
                    {billingDetails?.subscription?.status.toUpperCase()}
                    {billingDetails?.subscription?.cancel_at && (
                      <span className="text-red-700 dark:text-red-300 font-semibold">
                        {" "}
                        (cancels{" "}
                        {DateTime.fromSeconds(
                          billingDetails?.subscription?.cancel_at
                        ).toDateString()}
                        )
                      </span>
                    )}
                    {billingDetails?.subscription?.ended_at && (
                      <span className="text-gray-700 dark:text-gray-300 font-semibold">
                        , expired{" "}
                        {DateTime.fromSeconds(
                          billingDetails?.subscription?.ended_at
                        ).toRelative()}
                      </span>
                    )}
                  </h2>
                </div>

                {billingDetails?.subscription && billingDetails?.invoice ? (
                  <div className="p-4 bg-white dark:bg-black overflow-hidden border-t border-gray-200 dark:border-gray-800">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Upcoming invoice
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <CurrencyDollarIcon
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="text-gray-700 dark:text-gray-300 text-md">
                        Amount due: $
                        {Number(billingDetails?.invoice?.amount_remaining) /
                          100}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <CalendarIcon
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="text-gray-700 dark:text-gray-300 text-md">
                        Billing period:{" "}
                        {DateTime.fromSeconds(
                          billingDetails?.invoice?.period_start
                        ).toDateString()}
                        {" - "}
                        {DateTime.fromSeconds(
                          billingDetails?.invoice?.period_end
                        ).toDateString()}
                      </span>
                    </div>
                  </div>
                ) : null}

                {billingDetails?.usage?.length && (
                  <div className="p-4 bg-white dark:bg-black overflow-hidden border-t border-gray-200 dark:border-gray-800">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      Usage
                    </h3>
                    <dl className="mt-2 divide-y divide-gray-200 border-t border-b border-gray-200 dark:border-gray-800 dark:divide-gray-700">
                      {billingDetails?.usage.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between py-3 text-sm font-medium"
                        >
                          <dt className="text-gray-500 dark:text-gray-400">
                            {item}
                          </dt>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                <div className="flex justify-between px-4 py-3 bg-gray-50 dark:bg-black text-right sm:px-6">
                  {billingDetails?.hasActiveSubscription &&
                    (!billingDetails?.subscription?.cancel_at ? (
                      <SecondaryButton
                        label={"Cancel Subscription"}
                        onClick={openBillingPortal}
                      />
                    ) : (
                      <SecondaryButton
                        label={"Resume Subscription"}
                        onClick={openBillingPortal}
                      />
                    ))}

                  <SecondaryButton
                    className={classNames(
                      billingDetails?.hasActiveSubscription && "ml-3"
                    )}
                    label={"Update payment method"}
                    onClick={openBillingPortal}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}

Billing.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};
