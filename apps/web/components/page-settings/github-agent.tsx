import { IGitHubInstallations } from "@changes-page/supabase/types/github";
import { Spinner } from "@changes-page/ui";
import { ExternalLinkIcon, TrashIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { notifyError, notifySuccess } from "../core/toast.component";
import WarningDialog from "../dialogs/warning-dialog.component";

export default function GitHubAgentSettings({ pageId }: { pageId: string }) {
  const [installations, setInstallations] = useState<IGitHubInstallations[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IGitHubInstallations | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchInstallations();
  }, [pageId]);

  async function fetchInstallations() {
    try {
      const res = await fetch(
        `/api/integrations/github/installations?page_id=${pageId}`,
      );
      const data = await res.json();
      if (data.error) {
        notifyError(data.error.message);
      } else {
        setInstallations(data);
      }
    } catch (err) {
      notifyError("Failed to load GitHub installations");
    } finally {
      setLoading(false);
    }
  }

  async function updateInstallation(
    installation: IGitHubInstallations,
    updates: { enabled?: boolean; ai_instructions?: string | null },
  ) {
    setSaving(installation.id);
    try {
      const res = await fetch("/api/integrations/github/installations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: installation.id,
          page_id: pageId,
          ...updates,
        }),
      });
      const data = await res.json();
      if (data.error) {
        notifyError(data.error.message);
      } else {
        setInstallations((prev) =>
          prev.map((i) => (i.id === installation.id ? data : i)),
        );
        notifySuccess("Settings saved");
      }
    } catch (err) {
      notifyError("Failed to update settings");
    } finally {
      setSaving(null);
    }
  }

  async function deleteInstallation() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/integrations/github/installations?id=${deleteTarget.id}&page_id=${pageId}`,
        { method: "DELETE" },
      );
      const data = await res.json();
      if (data.error) {
        notifyError(data.error.message);
      } else {
        setInstallations((prev) =>
          prev.filter((i) => i.id !== deleteTarget.id),
        );
        notifySuccess("Repository disconnected");
      }
    } catch (err) {
      notifyError("Failed to disconnect repository");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  const githubAppUrl =
    process.env.NEXT_PUBLIC_GITHUB_APP_URL ||
    "https://github.com/apps/changes-page";

  return (
    <>
      <WarningDialog
        title="Disconnect Repository"
        message={`Are you sure you want to disconnect ${deleteTarget?.repository_owner}/${deleteTarget?.repository_name}? The changelog agent will no longer respond to mentions on this repository.`}
        open={!!deleteTarget}
        setOpen={(open) => !open && setDeleteTarget(null)}
        confirmCallback={deleteInstallation}
        processing={deleting}
      />

      <div className="mb-6 mt-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-50">
                GitHub Changelog Agent
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Automatically generate changelog drafts from your PRs by
                mentioning @changespage.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 bg-white dark:bg-black sm:p-6">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Spinner message="Loading..." />
                  </div>
                ) : installations.length === 0 ? (
                  <div className="text-center py-8">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                      No repositories connected
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Connect a GitHub repository to start generating changelogs
                      from PRs.
                    </p>
                    <div className="mt-6">
                      <a
                        href={githubAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <ExternalLinkIcon className="h-4 w-4 mr-2" />
                        Install GitHub App
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {installations.map((installation) => (
                      <div
                        key={installation.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <svg
                              className="h-6 w-6 text-gray-700 dark:text-gray-300"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {installation.repository_owner}/
                                {installation.repository_name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Connected{" "}
                                {new Date(
                                  installation.created_at,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <label className="flex items-center cursor-pointer">
                              <span className="mr-2 text-sm text-gray-600 dark:text-gray-400">
                                {installation.enabled ? "Enabled" : "Disabled"}
                              </span>
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  className="sr-only"
                                  checked={installation.enabled}
                                  onChange={(e) =>
                                    updateInstallation(installation, {
                                      enabled: e.target.checked,
                                    })
                                  }
                                  disabled={saving === installation.id}
                                />
                                <div
                                  className={`w-10 h-6 rounded-full shadow-inner transition-colors ${
                                    installation.enabled
                                      ? "bg-indigo-500"
                                      : "bg-gray-300 dark:bg-gray-600"
                                  }`}
                                />
                                <div
                                  className={`absolute w-4 h-4 bg-white rounded-full shadow top-1 transition-transform ${
                                    installation.enabled
                                      ? "translate-x-5"
                                      : "translate-x-1"
                                  }`}
                                />
                              </div>
                            </label>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(installation)}
                              className="p-1 text-gray-400 hover:text-red-500"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            AI Instructions (optional)
                          </label>
                          <textarea
                            rows={3}
                            className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="e.g., Focus on user-facing changes. Use simple language. Always include the PR author's name."
                            defaultValue={installation.ai_instructions || ""}
                            onBlur={(e) => {
                              const newValue = e.target.value.trim() || null;
                              if (newValue !== installation.ai_instructions) {
                                updateInstallation(installation, {
                                  ai_instructions: newValue,
                                });
                              }
                            }}
                          />
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            These instructions will be included with every
                            changelog generation request.
                          </p>
                        </div>
                      </div>
                    ))}

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <a
                        href={githubAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                      >
                        <ExternalLinkIcon className="h-4 w-4 mr-1" />
                        Connect another repository
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
