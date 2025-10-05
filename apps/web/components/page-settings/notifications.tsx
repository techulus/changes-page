import { IPageSettings } from "@changes-page/supabase/types/page";
import { Spinner } from "@changes-page/ui";
import { InformationCircleIcon } from "@heroicons/react/solid";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import validator from "validator";
import * as Yup from "yup";
import { httpGet, httpPut } from "../../utils/http";
import { notifyError } from "../core/toast.component";
import { InlineErrorMessage } from "../forms/notification.component";
import SwitchComponent from "../forms/switch.component";

export default function NotificationsSettings({
  settings,
  updatePageSettings,
}: {
  settings: IPageSettings;
  updatePageSettings: (values) => any;
}) {
  const [rssNotifications, setRssNotifications] = useState(
    settings?.rss_notifications
  );

  const [loading, setLoading] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);

  useEffect(() => {
    if (settings?.page_id && settings?.email_notifications) {
      setLoading(true);
      httpGet({
        url: "/api/emails/subscribers?page_id=" + settings?.page_id,
      })
        .then((res) => {
          if (res?.count) setSubscribersCount(res.count);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          notifyError(err);
        });
    }
  }, [settings]);

  const EmailSettingsSchema = Yup.object().shape({
    email_reply_to: Yup.string().email("Enter a valid email").optional(),
    email_physical_address: Yup.string().optional(),
  });

  const keyToLabel = {
    email_reply_to: "Reply To",
    email_physical_address: "Physical Address",
  };

  const emailFormik = useFormik({
    initialValues: {
      email_notifications: settings?.email_notifications || false,
      email_reply_to: settings?.email_reply_to || "",
      email_physical_address: settings?.email_physical_address || "",
    },
    validationSchema: EmailSettingsSchema,
    onSubmit: async (values) => {
      if (values.email_notifications) {
        // validate reply_to and physical_address is set
        if (!values.email_reply_to || !values.email_physical_address) {
          notifyError(
            "Please fill in the required fields to enable email notifications"
          );
          return;
        }

        if (!validator.isEmail(values.email_reply_to)) {
          notifyError("Please enter a valid reply-to email address");
          return;
        }
      }

      try {
        setLoading(true);

        if (values.email_notifications) {
          await httpPut({
            url: "/api/billing/enable-email-notifications",
          });
        }

        await updatePageSettings(values);
        setLoading(false);
      } catch (err) {
        notifyError("Failed to update settings");
        setLoading(false);
      }
    },
  });

  const requestCsvExport = useCallback(() => {
    if (settings?.page_id && settings?.email_notifications) {
      window.open(
        "/api/emails/subscribers/export-csv?page_id=" + settings?.page_id
      );
    }
  }, [settings]);

  return (
    <>
      <div className="mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-50">
                Email Notifications
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Even when your users are not actively using your website or
                product, you can still keep them informed about the latest
                updates by sending notifications directly to their email inbox.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white dark:bg-black space-y-6 sm:p-6">
                <form onSubmit={emailFormik.handleSubmit}>
                  {settings?.email_notifications && !loading && (
                    <div className="rounded-md bg-blue-50 dark:bg-blue-800 p-4 mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <InformationCircleIcon
                            className="h-5 w-5 text-blue-400"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="ml-3 flex-1 md:flex md:justify-between">
                          <p className="text-sm text-blue-700 dark:text-blue-100">
                            You&apos;ve {subscribersCount} subscriber(s) for
                            this page.
                          </p>

                          <button
                            type="button"
                            className="rounded bg-white dark:bg-black px-2 py-1 text-xs font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                            onClick={requestCsvExport}
                          >
                            Export (CSV)
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <SwitchComponent
                    title="Allow users to subscribe to email notifications"
                    message="Please note that once enabled, you will be charged for each email that is sent."
                    enabled={emailFormik.values.email_notifications}
                    onChange={(val) => {
                      emailFormik.setFieldValue("email_notifications", val);
                    }}
                  />

                  <div className="mt-5">
                    <div className="overflow-hidden sm:rounded-md">
                      {Object.keys(emailFormik.values)
                        .filter((x) => x !== "email_notifications")
                        .map((key) => {
                          return (
                            <div
                              key={key}
                              className="bg-white dark:bg-black mb-4"
                            >
                              <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6">
                                  <label
                                    htmlFor="twitter_url"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                  >
                                    {keyToLabel[key]}
                                  </label>
                                  <input
                                    type="text"
                                    name={key}
                                    id={key}
                                    onChange={emailFormik.handleChange}
                                    value={emailFormik.values[key]}
                                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                  />
                                </div>
                              </div>

                              {emailFormik.errors[key] &&
                                emailFormik.touched[key] && (
                                  <div className="mt-2">
                                    <InlineErrorMessage
                                      message={emailFormik.errors[key]}
                                    />
                                  </div>
                                )}
                            </div>
                          );
                        })}

                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Why address? The anti-spam legislation of several
                        countries requires organizations sending marketing
                        emails to include a valid, physical postal address.
                      </p>

                      <div className="text-right mt-3">
                        <button
                          type="submit"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          {loading ? <Spinner message="Saving" /> : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200 dark:border-gray-800" />
        </div>
      </div>

      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-50">
                RSS/Atom Feed
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Users can subscribe to your RSS feed.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white dark:bg-black space-y-6 sm:p-6">
                <SwitchComponent
                  title="Allow users to subscribe to RSS feed"
                  message="Users will be able to subscribe to RSS feed and Atom feed."
                  enabled={rssNotifications}
                  setEnabled={setRssNotifications}
                  onChange={async (val) => {
                    try {
                      await updatePageSettings({
                        rss_notifications: val,
                      });
                    } catch (err) {
                      notifyError("Failed to update settings");
                      setRssNotifications(!val);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
