import { IPageSettings } from "@changespage/supabase/types/page";
import { Spinner } from "@changespage/ui";
import { useState } from "react";
import { v4 } from "uuid";
import { notifyInfo } from "../core/toast.component";
import WarningDialog from "../dialogs/warning-dialog.component";
import { ErrorMessage } from "../forms/notification.component";
import GitHubAgentSettings from "./github-agent";

export default function IntegrationsSettings({
  settings,
  updatePageSettings,
  pageId,
}: {
  settings: IPageSettings;
  updatePageSettings: (values) => any;
  pageId: string;
}) {
  const [showWarning, setShowWarning] = useState(false);
  const [processing, setProcessing] = useState(false);

  async function rotateSecret() {
    setProcessing(true);

    await updatePageSettings({
      integration_secret_key: v4(),
    });

    setProcessing(false);
    setShowWarning(false);
  }

  return (
    <>
      <WarningDialog
        title={"Are you sure?"}
        message={
          "You will NOT be able to use your old secret and all integrations will have to be updated. This action will be permanently and cannot be undone."
        }
        open={showWarning}
        setOpen={setShowWarning}
        confirmCallback={rotateSecret}
        processing={processing}
      />

      <div className="mb-6 mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-50">
                Zapier and GitHub actions
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Automate your work across 5,000+ apps.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-3 bg-white dark:bg-black sm:p-3">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6">
                    <ErrorMessage message="Do NOT share this with anyone, this is a secret key." />
                    <label className="block text-sm text-gray-900 dark:text-gray-50 font-semibold mt-4">
                      Page Secret Key
                    </label>

                    <input
                      type="text"
                      value={settings?.integration_secret_key}
                      disabled={true}
                      className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between px-4 py-3 bg-gray-50 dark:bg-black text-right sm:px-6">
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  onClick={() => setShowWarning(true)}
                >
                  {processing ? (
                    <Spinner message="Processing" />
                  ) : (
                    "Generate new secret"
                  )}
                </button>

                {navigator?.clipboard && (
                  <button
                    type="button"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        settings?.integration_secret_key
                      );
                      notifyInfo("Copied");
                    }}
                  >
                    Copy
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <GitHubAgentSettings pageId={pageId} />
    </>
  );
}
