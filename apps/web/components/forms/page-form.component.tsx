import {
  IPage,
  PageType,
  PageTypeToLabel
} from "@changespage/supabase/types/page";
import { Spinner, SpinnerWithSpacing } from "@changespage/ui";
import classNames from "classnames";
import { FormikProps, useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import slugify from "slugify";
import { InferType } from "yup";
import { NewPageSchema } from "../../data/schema";
import { PrimaryButton, SecondaryButton } from "../core/buttons.component";
import { InfoMessage, InlineErrorMessage } from "./notification.component";

export type PageFormikForm = FormikProps<InferType<typeof NewPageSchema>>;

export default function PageFormComponent({
  page,
  mode,
  validatingUrl,
  saving,
  loading,
  onSubmit,
}: {
  mode: "create" | "edit";
  page?: IPage;
  validatingUrl: boolean;
  saving: boolean;
  loading?: boolean;
  onSubmit: (formik: PageFormikForm, values: any) => Promise<boolean | void>;
}) {
  const router = useRouter();

  const [showUrlEditWarning, setShowUrlEditWarning] = useState(false);

  const formik = useFormik<InferType<typeof NewPageSchema>>({
    initialValues: {
      url_slug: "",
      title: "",
      description: "",
      type: Object.keys(PageType)[0],
    },
    validationSchema: NewPageSchema,
    onSubmit: (values) => {
      return onSubmit(formik, values);
    },
  });

  useEffect(() => {
    if (page) {
      for (let key in page) {
        formik.setFieldValue(key, page[key]);
      }
    }
  }, [page]);

  if (loading) {
    return <SpinnerWithSpacing />;
  }

  return (
    <form className="space-y-8" onSubmit={formik.handleSubmit}>
      <div className="mt-2 sm:mt-2 space-y-6 sm:space-y-5">
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
          <label
            htmlFor="url_slug"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 sm:mt-px sm:pt-2"
          >
            Page URL
          </label>

          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <div className="max-w-lg relative flex rounded-md shadow-sm">
              <input
                type="text"
                id="url_slug"
                autoCapitalize="off"
                autoComplete="off"
                className={classNames(
                  "flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-l-md sm:text-sm dark:bg-gray-800 border-gray-300 dark:border-gray-700",
                  "dark:text-gray-100"
                )}
                name="url_slug"
                onChange={(e) => {
                  const { value } = e?.target;

                  if (
                    mode === "edit" &&
                    value !== formik.initialValues.url_slug
                  ) {
                    setShowUrlEditWarning(true);
                  } else {
                    setShowUrlEditWarning(false);
                  }

                  if (value.slice(-1) === "-") {
                    return formik.setFieldValue("url_slug", value);
                  }

                  formik.setFieldValue(
                    "url_slug",
                    slugify(value, {
                      replacement: "-",
                      lower: true,
                      strict: true,
                    })
                  );
                }}
                value={formik.values.url_slug}
              />

              {validatingUrl && (
                <div className="absolute inset-y-0 right-0 pr-32 flex items-center pointer-events-none">
                  <Spinner />
                </div>
              )}

              <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-700 bg-gray-50 text-gray-500 dark:text-gray-400 sm:text-sm dark:bg-gray-800">
                .changes.page
              </span>
            </div>
          </div>

          {formik.errors.url_slug && formik.touched.url_slug && (
            <div className="max-w-lg mt-1 sm:mt-0 sm:col-start-2 sm:col-span-2">
              <InlineErrorMessage message={formik.errors.url_slug} />
            </div>
          )}

          {showUrlEditWarning && (
            <div className="max-w-lg mt-1 sm:mt-0 sm:col-start-2 sm:col-span-2">
              <InfoMessage message="If you make changes to the URL, it is important that you update the widget integration to ensure that it continues to work as intended." />
            </div>
          )}
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 dark:sm:border-gray-700 sm: sm:pt-5">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300  sm:mt-px sm:pt-2"
          >
            Title
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <div className="max-w-lg flex rounded-md shadow-sm">
              <input
                type="text"
                id="title"
                name="title"
                autoComplete="off"
                className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                onChange={formik.handleChange}
                value={formik.values.title}
              />
            </div>
          </div>
          {formik.errors.title && formik.touched.title && (
            <div className="max-w-lg mt-1 sm:mt-0 sm:col-start-2 sm:col-span-2">
              <InlineErrorMessage message={formik.errors.title} />
            </div>
          )}
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 dark:sm:border-gray-700 sm:pt-5">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 sm:mt-px sm:pt-2"
          >
            Description
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <textarea
              id="description"
              name="description"
              rows={3}
              autoComplete="off"
              className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md dark:text-gray-100"
              defaultValue={formik.values.description}
              onChange={formik.handleChange}
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Write a few sentences about the page.
            </p>
            {formik.errors.description && formik.touched.description && (
              <div className="max-w-lg mt-2 sm:mt-0 sm:col-start-2 sm:col-span-2">
                <InlineErrorMessage message={formik.errors.description} />
              </div>
            )}
          </div>
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 dark:sm:border-gray-700 sm: sm:pt-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 sm:mt-px sm:pt-2">
            Type
          </label>

          <select
            id="type"
            name="type"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base dark:text-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={formik.values.type}
            onChange={formik.handleChange}
          >
            {Object.keys(PageType).map((option) => (
              <option key={option} value={option}>
                {PageTypeToLabel[option]}
              </option>
            ))}
          </select>

          {formik.errors.type && formik.touched.type && (
            <div className="mt-2">
              <InlineErrorMessage message={formik.errors.type} />
            </div>
          )}
        </div>
      </div>

      <div className="pt-5 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-end">
          <SecondaryButton label="Cancel" onClick={router.back} />

          <PrimaryButton
            label={(saving && <Spinner message="Saving" />) || "Save"}
            type="submit"
            className="ml-3"
            disabled={validatingUrl || saving}
          />
        </div>
      </div>
    </form>
  );
}
