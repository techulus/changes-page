import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { IPageSettings } from "@changes-page/supabase/types/page";
import { Spinner } from "@changes-page/ui";
import { InlineErrorMessage } from "../forms/notification.component";

const SOCIAL_KEY_TO_LABEL = {
  product_url: "Link for Page Title/Logo",
  facebook_url: "Facebook URL",
  twitter_url: "Twitter URL",
  github_url: "GitHub URL",
  instagram_url: "Instagram URL",
  youtube_url: "YouTube URL",
  linkedin_url: "LinkedIn URL",
  tiktok_url: "TikTok URL",
  app_store_url: "App Store URL (Displayed as badge)",
  play_store_url: "Play Store URL (Displayed as badge)",
};

export default function SocialLinksSettings({
  settings,
  updatePageSettings,
}: {
  settings: IPageSettings;
  updatePageSettings: (values) => any;
}) {
  const [processing, setProcessing] = useState(false);

  const PageSettingsSchema = Yup.object().shape({
    facebook_url: Yup.string().url().optional(),
    twitter_url: Yup.string().url().optional(),
    github_url: Yup.string().url().optional(),
    instagram_url: Yup.string().url().optional(),
    app_store_url: Yup.string().url().optional(),
    play_store_url: Yup.string().url().optional(),
  });

  const headerLinksFormik = useFormik({
    initialValues: {
      product_url: settings?.product_url || "",
    },
    validationSchema: PageSettingsSchema,
    onSubmit: async (values) => {
      setProcessing(true);
      await updatePageSettings(values);
      setProcessing(false);
    },
  });

  const socialLinksFormik = useFormik({
    initialValues: {
      twitter_url: settings?.twitter_url || "",
      github_url: settings?.github_url || "",
      linkedin_url: settings?.linkedin_url || "",
      youtube_url: settings?.youtube_url || "",
      instagram_url: settings?.instagram_url || "",
      facebook_url: settings?.facebook_url || "",
      tiktok_url: settings?.tiktok_url || "",
    },
    validationSchema: PageSettingsSchema,
    onSubmit: async (values) => {
      setProcessing(true);
      await updatePageSettings(values);
      setProcessing(false);
    },
  });

  const appLinksFormik = useFormik({
    initialValues: {
      app_store_url: settings?.app_store_url || "",
      play_store_url: settings?.play_store_url || "",
    },
    validationSchema: PageSettingsSchema,
    onSubmit: async (values) => {
      setProcessing(true);
      await updatePageSettings(values);
      setProcessing(false);
    },
  });

  return (
    <>
      <div className="mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-50">
                Header links
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                These links handle redirection when the users interact with the
                elements in page header such as the logo or the page title.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={headerLinksFormik.handleSubmit}>
              <div className="shadow overflow-hidden sm:rounded-md">
                {Object.keys(headerLinksFormik.values).map((key) => {
                  return (
                    <div
                      key={key}
                      className="px-4 py-3 bg-white dark:bg-gray-900 sm:p-3"
                    >
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6">
                          <label
                            htmlFor="twitter_url"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            {SOCIAL_KEY_TO_LABEL[key]}
                          </label>
                          <input
                            type="text"
                            name={key}
                            id={key}
                            onChange={headerLinksFormik.handleChange}
                            value={headerLinksFormik.values[key]}
                            autoComplete="url"
                            className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                          />
                        </div>
                      </div>

                      {headerLinksFormik.errors[key] &&
                        headerLinksFormik.touched[key] && (
                          <div className="mt-2">
                            <InlineErrorMessage
                              message={headerLinksFormik.errors[key]}
                            />
                          </div>
                        )}
                    </div>
                  );
                })}

                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {processing ? <Spinner message="Saving" /> : "Save"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200 dark:border-gray-600" />
        </div>
      </div>

      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-50">
                Footer links
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                These links will be displayed in page footer.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={socialLinksFormik.handleSubmit}>
              <div className="shadow overflow-hidden sm:rounded-md">
                {Object.keys(socialLinksFormik.values).map((key) => {
                  return (
                    <div
                      key={key}
                      className="px-4 py-3 bg-white dark:bg-gray-900 sm:p-3"
                    >
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6">
                          <label
                            htmlFor="twitter_url"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            {SOCIAL_KEY_TO_LABEL[key]}
                          </label>
                          <input
                            type="text"
                            name={key}
                            id={key}
                            onChange={socialLinksFormik.handleChange}
                            value={socialLinksFormik.values[key]}
                            autoComplete="url"
                            className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                          />
                        </div>
                      </div>

                      {socialLinksFormik.errors[key] &&
                        socialLinksFormik.touched[key] && (
                          <div className="mt-2">
                            <InlineErrorMessage
                              message={socialLinksFormik.errors[key]}
                            />
                          </div>
                        )}
                    </div>
                  );
                })}

                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {processing ? <Spinner message="Saving" /> : "Save"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200 dark:border-gray-600" />
        </div>
      </div>

      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-50">
                App links
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                These links will be displayed as badges in page footer.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={appLinksFormik.handleSubmit}>
              <div className="shadow overflow-hidden sm:rounded-md">
                {Object.keys(appLinksFormik.values).map((key) => {
                  return (
                    <div
                      key={key}
                      className="px-4 py-3 bg-white dark:bg-gray-900 sm:p-3"
                    >
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6">
                          <label
                            htmlFor="twitter_url"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            {SOCIAL_KEY_TO_LABEL[key]}
                          </label>
                          <input
                            type="text"
                            name={key}
                            id={key}
                            onChange={appLinksFormik.handleChange}
                            value={appLinksFormik.values[key]}
                            autoComplete="url"
                            className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                          />
                        </div>
                      </div>

                      {appLinksFormik.errors[key] &&
                        appLinksFormik.touched[key] && (
                          <div className="mt-2">
                            <InlineErrorMessage
                              message={appLinksFormik.errors[key]}
                            />
                          </div>
                        )}
                    </div>
                  );
                })}

                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {processing ? <Spinner message="Saving" /> : "Save"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
