import { IPage, IPageSettings } from "@changes-page/supabase/types/page";
import { Spinner } from "@changes-page/ui";
import {
  BellIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  RssIcon,
} from "@heroicons/react/solid";
import classNames from "classnames";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import * as Yup from "yup";
import { getPageUrl } from "../lib/url";
import { httpPost } from "../utils/http";

export default function SubscribePrompt({
  settings,
  page,
}: {
  settings: IPageSettings;
  page: IPage;
}) {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const pageUrl = useMemo(() => getPageUrl(page, settings), [page, settings]);

  const InputSchema = Yup.object().shape({
    email: Yup.string().email().required("Enter a valid email"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: InputSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await httpPost({
          url: "/api/notifications/subscribe-email",
          data: values,
        });
        setShowSuccess(true);
        setLoading(false);
      } catch (e: any) {
        console.log("Error", e);
        if (e?.message) {
          setErrorMessage(e?.message);
        } else {
          setErrorMessage("Something went wrong");
        }

        setLoading(false);
        console.error("/api/notification/email: error", e);
      }
    },
  });

  if (!settings?.email_notifications && !settings?.rss_notifications) {
    return null;
  }

  if (!settings?.email_notifications && settings?.rss_notifications) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col pb-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <a
            href={`${pageUrl}/rss.xml`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RssIcon className="h-4 w-4 mr-1" />
            RSS
          </a>
          <a
            href={`${pageUrl}/atom.xml`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RssIcon className="h-4 w-4 mr-1" />
            Atom
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto flex flex-col pb-12 px-4 sm:px-6 lg:px-8">
        {!showForm && !showSuccess ? (
          <div className="flex items-center space-x-3">
            {settings?.email_notifications && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition-colors"
              >
                <BellIcon className="h-4 w-4 mr-2" />
                Subscribe
              </button>
            )}
            {settings?.rss_notifications && (
              <>
                <a
                  href={`${pageUrl}/rss.xml`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <RssIcon className="h-4 w-4 mr-1" />
                  RSS
                </a>
                <a
                  href={`${pageUrl}/atom.xml`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <RssIcon className="h-4 w-4 mr-1" />
                  Atom
                </a>
              </>
            )}
          </div>
        ) : null}

        {errorMessage && (
          <div
            className={classNames(
              "rounded-md bg-red-50 p-2 mt-6 max-w-xl",
              "dark:bg-red-900 dark:text-red-100"
            )}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <InformationCircleIcon
                  className="h-5 w-5 text-red-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <p
                  className={classNames(
                    "text-sm font-medium text-red-800",
                    "dark:text-red-200"
                  )}
                >
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {showForm && !showSuccess && (
          <div className="mt-2">
            <p className="px-4 sm:px-0 text-base mb-3">
              Subscribe to get future posts via email
            </p>
            <form className="flex" onSubmit={formik.handleSubmit}>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={classNames(
                  "w-full rounded-l-full border border-gray-300 px-5 py-1.5 placeholder-gray-400 shadow-sm sm:max-w-md",
                  "dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-500 dark:text-gray-100"
                )}
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              <div className="sm:flex-shrink-0">
                <button
                  type="submit"
                  className={classNames(
                    "flex w-full items-center justify-center rounded-r-full border border-transparent bg-slate-600 py-1.5 px-5 text-base font-base text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2",
                    "disabled:opacity-50"
                  )}
                  disabled={loading}
                >
                  {loading && <Spinner />} Subscribe
                </button>
              </div>
            </form>
          </div>
        )}

        {showSuccess && (
          <div
            className={classNames(
              "rounded-md bg-green-50 p-2 mt-6 max-w-xl",
              "dark:bg-green-900 dark:text-green-100"
            )}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon
                  className="h-5 w-5 text-green-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <p
                  className={classNames(
                    "text-sm font-medium text-green-800",
                    "dark:text-green-200"
                  )}
                >
                  To complete your subscription, please click the verification
                  link we sent you. If you don&apos;t see it in your inbox,
                  please check your spam folder.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
