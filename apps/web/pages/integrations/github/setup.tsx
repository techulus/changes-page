import { CheckCircleIcon, LinkIcon, TrashIcon } from "@heroicons/react/solid";
import type { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { type JSX, useEffect, useState } from "react";
import { PrimaryButton } from "../../../components/core/buttons.component";
import { notifyError, notifySuccess } from "../../../components/core/toast.component";
import WarningDialog from "../../../components/dialogs/warning-dialog.component";
import AuthLayout from "../../../components/layout/auth-layout.component";
import Page from "../../../components/layout/page.component";
import { withSupabase } from "../../../utils/supabase/withSupabase";

interface PageOption {
  id: string;
  title: string;
  url_slug: string;
  type: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  private: boolean;
}

interface ExistingConnection {
  id: string;
  page_id: string;
  installation_id: number;
  repository_owner: string;
  repository_name: string;
  enabled: boolean;
  page_title?: string;
}

export const getServerSideProps = withSupabase(async (context, { supabase }) => {
  const { installation_id } = context.query;

  if (!installation_id) {
    return {
      redirect: {
        destination: "/pages",
        permanent: false,
      },
    };
  }

  const { data: pages } = await supabase
    .from("pages")
    .select("id, title, url_slug, type")
    .order("updated_at", { ascending: false });

  return {
    props: {
      pages: pages ?? [],
      installationId: Number(installation_id),
    },
  };
});

export default function GitHubSetup({
  pages,
  installationId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [selectedPage, setSelectedPage] = useState<PageOption | null>(null);
  const [linking, setLinking] = useState(false);
  const [linked, setLinked] = useState(false);
  const [existingConnections, setExistingConnections] = useState<ExistingConnection[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<ExistingConnection | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/integrations/github/repos?installation_id=${installationId}`).then((res) => res.json()),
      ...pages.map((page) =>
        fetch(`/api/integrations/github/installations?page_id=${page.id}`)
          .then((res) => res.json())
          .then((data) =>
            Array.isArray(data)
              ? data.map((d) => ({ ...d, page_title: page.title }))
              : []
          )
      ),
    ])
      .then(([reposData, ...installationsData]) => {
        if (reposData.error) {
          setError(reposData.error.message);
        } else {
          setRepos(reposData.repositories || []);
        }
        setExistingConnections(installationsData.flat());
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [installationId, pages]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/integrations/github/installations?id=${deleteTarget.id}&page_id=${deleteTarget.page_id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.error) {
        notifyError(data.error.message);
      } else {
        setExistingConnections((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        notifySuccess("Connection removed");
      }
    } catch (err) {
      notifyError("Failed to remove connection");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  const handleLink = async () => {
    if (!selectedRepo || !selectedPage) return;

    setLinking(true);
    try {
      const res = await fetch("/api/integrations/github/installations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_id: selectedPage.id,
          installation_id: installationId,
          repository_owner: selectedRepo.owner.login,
          repository_name: selectedRepo.name,
        }),
      });

      const data = await res.json();
      if (data.error) {
        notifyError(data.error.message);
      } else {
        setLinked(true);
        setExistingConnections((prev) => [
          ...prev,
          { ...data, page_title: selectedPage.title },
        ]);
        notifySuccess("Repository linked successfully!");
      }
    } catch (err) {
      notifyError("Failed to link repository");
    } finally {
      setLinking(false);
    }
  };

  if (linked) {
    return (
      <Page title="GitHub Connected">
        <div className="max-w-2xl mx-auto text-center py-12">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Successfully Connected!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            <strong>{selectedRepo?.full_name}</strong> is now linked to{" "}
            <strong>{selectedPage?.title}</strong>
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-left mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              How to use:
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              On any PR in <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{selectedRepo?.full_name}</code>,
              comment:
            </p>
            <pre className="mt-2 bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
              @changespage please write a changelog for this PR
            </pre>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
              You can add instructions after the mention to customize the changelog.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <PrimaryButton
              label="Go to Page"
              onClick={() => router.push(`/pages/${selectedPage?.id}`)}
            />
            <button
              onClick={() => {
                setLinked(false);
                setSelectedRepo(null);
                setSelectedPage(null);
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            >
              Link Another Repo
            </button>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Connect GitHub Repository">
      <WarningDialog
        title="Remove Connection"
        message={`Are you sure you want to disconnect ${deleteTarget?.repository_owner}/${deleteTarget?.repository_name} from ${deleteTarget?.page_title}?`}
        open={!!deleteTarget}
        setOpen={(open) => !open && setDeleteTarget(null)}
        confirmCallback={handleDelete}
        processing={deleting}
      />

      <div className="max-w-2xl mx-auto">
        {existingConnections.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Existing Connections
            </h2>
            <div className="space-y-3">
              {existingConnections.map((connection) => (
                <div
                  key={connection.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className="h-6 w-6 text-gray-600 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {connection.repository_owner}/{connection.repository_name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Connected to <span className="font-medium">{connection.page_title}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        connection.enabled
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {connection.enabled ? "Active" : "Disabled"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(connection)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {existingConnections.length > 0 ? "Add Another Connection" : "Link a repository to your page"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Select a repository and a page to connect them. Once connected, you can
            mention <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">@changespage</code> in
            PR comments to generate changelog drafts.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
            <p className="text-red-800 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              1. Select Repository
            </label>
            {loading ? (
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-20 rounded-md" />
            ) : (() => {
              const connectedRepoKeys = new Set(
                existingConnections.map((c) => `${c.repository_owner}/${c.repository_name}`)
              );
              const availableRepos = repos.filter(
                (repo) => !connectedRepoKeys.has(repo.full_name)
              );

              if (availableRepos.length === 0) {
                return (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    All available repositories are already connected.
                  </p>
                );
              }

              return (
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {availableRepos.map((repo) => (
                    <button
                      key={repo.id}
                      type="button"
                      onClick={() => setSelectedRepo(repo)}
                      className={`flex items-center justify-between p-3 rounded-md border text-left transition-colors ${
                        selectedRepo?.id === repo.id
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {repo.full_name}
                        </p>
                        {repo.private && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Private
                          </span>
                        )}
                      </div>
                      {selectedRepo?.id === repo.id && (
                        <CheckCircleIcon className="h-5 w-5 text-indigo-500" />
                      )}
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              2. Select Page
            </label>
            {pages.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No pages found.{" "}
                <a href="/pages/new" className="text-indigo-600 hover:underline">
                  Create a page
                </a>{" "}
                first.
              </p>
            ) : (
              <div className="grid gap-2 max-h-60 overflow-y-auto">
                {pages.map((page) => (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => setSelectedPage(page)}
                    className={`flex items-center justify-between p-3 rounded-md border text-left transition-colors ${
                      selectedPage?.id === page.id
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {page.title}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {page.url_slug}.changes.page
                      </span>
                    </div>
                    {selectedPage?.id === page.id && (
                      <CheckCircleIcon className="h-5 w-5 text-indigo-500" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4">
            <PrimaryButton
              label={linking ? "Linking..." : "Link Repository"}
              icon={<LinkIcon className="h-4 w-4 mr-2" />}
              onClick={handleLink}
              disabled={!selectedRepo || !selectedPage || linking}
            />
          </div>
        </div>
      </div>
    </Page>
  );
}

GitHubSetup.getLayout = (page: JSX.Element) => <AuthLayout>{page}</AuthLayout>;
