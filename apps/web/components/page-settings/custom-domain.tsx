import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { IPageSettings } from "@changes-page/supabase/types/page";
import { httpGet, httpPost } from "../../utils/helpers";
import { Spinner } from "@changes-page/ui";
import { notifyError } from "../core/toast.component";
import ConfirmDeleteDialog from "../dialogs/confirm-delete-dialog.component";
import { InfoMessage } from "../forms/notification.component";

const DNS_RECORD_TYPE = "CNAME";
const DNS_TARGET = "domains.changes.page";

const HOST_NAME_REGEX = new RegExp(
  "^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]).)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$"
);

export default function CustomDomainSettings({
  pageId,
  settings,
  updatePageSettings,
}: {
  pageId: string;
  settings: IPageSettings;
  updatePageSettings: (values) => any;
}) {
  const [addingCustomDomain, setAddingCustomDomain] = useState(false);

  const [openRemoveDomainConfirmation, setOpenRemoveDomainConfirmation] =
    useState(false);
  const [removingDomain, setRemovingDomain] = useState(false);

  const CustomDomainSchema = Yup.object().shape({
    domain_name: Yup.string().required(),
  });

  const customDomainFormik = useFormik({
    initialValues: {
      domain_name: settings?.custom_domain || "",
    },
    validationSchema: CustomDomainSchema,
    onSubmit: async (values) => {
      const { domain_name } = values;

      // Validate domain name
      if (
        !HOST_NAME_REGEX.test(domain_name) ||
        !domain_name.includes(".") ||
        domain_name.endsWith("changes.page") // IMPORTANT
      )
        return notifyError(
          "Enter a valid domain name (ex: updates.yourcompany.com)"
        );

      setAddingCustomDomain(true);

      try {
        if (settings?.custom_domain) {
          await httpPost({
            url: `/api/pages/settings/remove-domain`,
            data: {
              domain: settings?.custom_domain,
            },
          });
        }

        const verifyResult = await httpGet({
          url: `/api/pages/settings/check-domain?domain=${domain_name}`,
        });

        if (!verifyResult.valid) {
          setAddingCustomDomain(false);
          return notifyError(
            "Your domain name has not been configured properly, please verify DNS and try again."
          );
        }

        const addResult = await httpPost({
          url: `/api/pages/settings/add-domain`,
          data: {
            domain: domain_name,
          },
        });

        if (!addResult.success) {
          setAddingCustomDomain(false);

          switch (addResult.error) {
            case "forbidden":
            case "domain_taken":
              return notifyError(
                "This domain is already being used by a different project, please verify and try again."
              );
            default:
              return notifyError(
                "Your domain name has not been configured properly, please verify DNS and try again."
              );
          }
        }

        await updatePageSettings({ custom_domain: domain_name });

        setAddingCustomDomain(false);
      } catch (e) {
        console.log("error", e);
        setAddingCustomDomain(false);
        notifyError(
          "Updating custom domain failed, please try again or contact support."
        );
      }
    },
  });

  async function removeCustomDomain() {
    try {
      setRemovingDomain(true);
      if (settings?.custom_domain) {
        await httpPost({
          url: `/api/pages/settings/remove-domain`,
          data: {
            domain: settings?.custom_domain,
            page_id: pageId,
          },
        });
      }

      await updatePageSettings({ custom_domain: null });

      setOpenRemoveDomainConfirmation(false);
      setRemovingDomain(false);
    } catch (e) {
      console.log("error", e);
      setRemovingDomain(false);
      notifyError(
        "Removing custom domain failed, please try again or contact support."
      );
    }
  }

  return (
    <>
      <ConfirmDeleteDialog
        itemName={`custom domain ${settings?.custom_domain}`}
        open={openRemoveDomainConfirmation}
        setOpen={setOpenRemoveDomainConfirmation}
        processing={removingDomain}
        deleteCallback={removeCustomDomain}
      />

      <div className="mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-50">
                Custom domain
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Deploy your page to a custom domain for a branded experience.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={customDomainFormik.handleSubmit}>
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-3 bg-white dark:bg-gray-900 sm:p-3">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6">
                      <label
                        htmlFor="domain_name"
                        className="block text-sm text-gray-900 dark:text-gray-50 font-semibold"
                      >
                        Domain Name
                      </label>

                      <input
                        type="text"
                        name="domain_name"
                        id="domain_name"
                        onChange={customDomainFormik.handleChange}
                        value={customDomainFormik.values.domain_name}
                        disabled={!!settings?.custom_domain}
                        autoComplete="url"
                        className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                      />

                      <InfoMessage
                        className={"mt-4"}
                        message={
                          <>
                            <span>
                              Please point{" "}
                              <b>
                                {customDomainFormik.values.domain_name ||
                                  "your domain"}{" "}
                              </b>
                              to changes.page by configuring the following CNAME
                              records. Using CloudFlare? Please use the DNS-only
                              mode.
                            </span>

                            <div className="block lg:hidden shadow overflow-hidden border-b bg-white dark:bg-gray-900 border-gray-200 rounded-lg mt-2 p-2">
                              <p>
                                <b>Record Type:</b> {DNS_RECORD_TYPE}
                              </p>
                              <p>
                                <b>Host:</b>{" "}
                                {customDomainFormik.values.domain_name ||
                                  "your domain"}
                              </p>
                              <p>
                                <b>Target:</b> {DNS_TARGET}
                              </p>
                            </div>

                            <div className="hidden lg:block shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg mt-2">
                              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                    >
                                      Record Type
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                    >
                                      Host
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                    >
                                      Target
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="bg-white dark:bg-gray-900">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-50">
                                      {DNS_RECORD_TYPE}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-50">
                                      {customDomainFormik.values.domain_name ||
                                        "your domain"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-50">
                                      {DNS_TARGET}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-right sm:px-6">
                  {settings?.custom_domain ? (
                    <>
                      <a
                        href={`https://${settings?.custom_domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
                      >
                        Visit custom domain
                      </a>

                      <button
                        type="button"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        disabled={removingDomain}
                        onClick={() => setOpenRemoveDomainConfirmation(true)}
                      >
                        Remove domain
                      </button>
                    </>
                  ) : (
                    <button
                      type="submit"
                      disabled={addingCustomDomain}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {addingCustomDomain ? (
                        <Spinner message="Verifying" />
                      ) : (
                        "Verify & Save"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
