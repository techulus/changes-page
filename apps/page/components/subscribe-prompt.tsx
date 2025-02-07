import { IPage, IPageSettings } from "@changes-page/supabase/types/page";
import { Spinner } from "@changes-page/ui";
import { CheckCircleIcon, InformationCircleIcon } from "@heroicons/react/solid";
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
        // alert("Something went wrong. Please try again later.");
        console.error("/api/notification/email: error", e);
      }
    },
  });

  if (!settings?.email_notifications && !settings?.rss_notifications) {
    return null;
  }

  if (!settings?.email_notifications && settings) {
    return (
      <div className="flex flex-col items-center justify-center pb-8">
        <div className="mb-2 h-0.5 w-[64px] bg-gray-400 dark:bg-gray-700" />

        <p className="text-md text-center">
          Get posts via
          <span>
            {" "}
            <a
              className="text-bold underline"
              href={`${pageUrl}/rss.xml`}
              target="_blank"
              rel="noreferrer"
            >
              RSS
            </a>{" "}
            /{" "}
            <a
              className="text-bold underline"
              href={`${pageUrl}/atom.xml`}
              target="_blank"
              rel="noreferrer"
            >
              Atom
            </a>{" "}
            feed
          </span>
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center pb-8">
        <div className="mb-2 h-0.5 w-[64px] bg-gray-400 dark:bg-gray-700" />

        <p className="px-4 sm:px-0 text-base text-center">
          Subscribe to get future posts via email
        </p>
        {settings.rss_notifications ? (
          <p className="px-4 sm:px-0 text-base text-center">
            <span>
              {" "}
              (or grab the{" "}
              <a
                className="text-bold underline"
                href={`${pageUrl}/rss.xml`}
                target="_blank"
                rel="noreferrer"
              >
                RSS
              </a>{" "}
              /{" "}
              <a
                className="text-bold underline"
                href={`${pageUrl}/atom.xml`}
                target="_blank"
                rel="noreferrer"
              >
                Atom
              </a>{" "}
              feed)
            </span>
          </p>
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

        {showSuccess ? (
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
        ) : (
          <form className="mt-3 flex" onSubmit={formik.handleSubmit}>
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
        )}
      </div>
    </>
  );
}
