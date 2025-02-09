import { IPage } from "@changes-page/supabase/types/page";
import { SpinnerWithSpacing } from "@changes-page/ui";
import { CheckCircleIcon, UserIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../components/core/buttons.component";
import { notifyError } from "../../components/core/toast.component";
import ConfirmDeleteDialog from "../../components/dialogs/confirm-delete-dialog.component";
import ManageTeamDialog from "../../components/dialogs/manage-team-dialog.component";
import { EntityEmptyState } from "../../components/entity/empty-state";
import AuthLayout from "../../components/layout/auth-layout.component";
import Page from "../../components/layout/page.component";
import Changelog from "../../components/marketing/changelog";
import { httpPost } from "../../utils/http";
import { useUserData } from "../../utils/useUser";

export default function Teams() {
  const { billingDetails } = useUserData();
  const router = useRouter();
  const { user, supabase } = useUserData();

  const [teams, setTeams] = useState([]);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [pages, setPages] = useState([]);
  const [showAssignPage, setShowAssignPage] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState(null);
  const [assigningPage, setAssigningPage] = useState(false);

  const fetchTeams = async () => {
    setIsLoading(true);

    const [
      { data: teams, error: fetchError },
      { data: pages, error: pagesError },
    ] = await Promise.all([
      supabase
        .from("teams")
        .select(
          `
          *,
          pages (
            id,
            title,
            created_at
          ),
          team_members (
            id,
            user_id,
            role
          ),
          team_invitations (
            id,
            email,
            role,
            created_at
          )
        `
        )
        .order("created_at", { ascending: false }),

      supabase.from("pages").select("*"),
    ]);

    setTeams(teams ?? []);
    setPages(pages ?? []);

    if (fetchError) {
      notifyError("Failed to fetch teams");
    }
    if (pagesError) {
      notifyError("Failed to fetch pages");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useHotkeys(
    "n",
    () => {
      setSelectedTeam(null);
      setShowTeamModal(true);
    },
    [router]
  );

  const deleteTeam = async (teamId: string) => {
    setIsDeleting(true);
    const { error } = await supabase
      .from("teams")
      .delete()
      .match({ id: teamId });

    if (error) {
      notifyError("Failed to delete team");
      return;
    }

    fetchTeams();
    setTeamToDelete(null);
    setIsDeleting(false);
  };

  return (
    <>
      <Page
        title={"My Teams"}
        buttons={
          <PrimaryButton
            keyboardShortcut="N"
            label="New"
            onClick={() => setShowTeamModal(true)}
            disabled={!billingDetails?.has_active_subscription}
          />
        }
      >
        {billingDetails?.has_active_subscription ? <Changelog /> : null}

        <div className="overflow-hidden sm:rounded-md">
          {isLoading ? (
            <SpinnerWithSpacing />
          ) : !teams.length ? (
            <EntityEmptyState
              title="No teams yet!"
              message="Get started by creating your first team."
              disabled={!billingDetails?.has_active_subscription}
              buttonLabel={
                billingDetails?.has_active_subscription
                  ? "Create New Team"
                  : "Start Free Trial"
              }
              onButtonClick={() => setShowTeamModal(true)}
            />
          ) : (
            <div>
              {teams.map((team) =>
                team.owner_id === user?.id ? (
                  <div
                    key={team.id}
                    className="overflow-hidden bg-white dark:bg-gray-800 shadow sm:rounded-lg mb-8"
                  >
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-center gap-4">
                        {team.image ? (
                          <img
                            src={team.image}
                            alt={team.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-base/7 font-semibold text-gray-900 dark:text-gray-100">
                            {team.name}
                          </h3>
                          <div className="flex space-x-4 mt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTeam(team);
                                setShowTeamModal(true);
                              }}
                              className="inline-flex items-center rounded-md bg-white dark:bg-gray-700 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setTeamToDelete(team)}
                              className="inline-flex items-center rounded-md bg-red-50 dark:bg-red-900/20 px-2.5 py-1.5 text-sm font-semibold text-red-700 dark:text-red-400 shadow-sm ring-1 ring-inset ring-red-600/10 dark:ring-red-500/20 hover:bg-red-100 dark:hover:bg-red-900/30"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 dark:border-gray-700">
                      <dl className="divide-y divide-gray-100 dark:divide-gray-700">
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm/6 font-semibold text-gray-900 dark:text-gray-100">
                            Pages
                          </dt>
                          <dd className="mt-2 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">
                            <div className="text-gray-500 dark:text-gray-400">
                              {team.pages?.length > 0 ? (
                                <ul
                                  role="list"
                                  className="divide-y divide-gray-100 dark:divide-gray-700 rounded-md border border-gray-200 dark:border-gray-700"
                                >
                                  {team.pages?.map(
                                    (page: Pick<IPage, "title" | "id">) => (
                                      <li
                                        key={page.id}
                                        className="flex items-center justify-between p-2 text-sm/6"
                                      >
                                        <div className="flex w-0 flex-1 items-center">
                                          <CheckCircleIcon
                                            aria-hidden="true"
                                            className="size-5 shrink-0 text-green-500 dark:text-green-400"
                                          />
                                          <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                            <span className="truncate font-medium">
                                              {page.title}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="ml-4 shrink-0">
                                          <button
                                            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            onClick={async () => {
                                              await supabase
                                                .from("pages")
                                                .update({
                                                  team_id: null,
                                                })
                                                .match({ id: page.id });

                                              fetchTeams();
                                            }}
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      </li>
                                    )
                                  )}
                                </ul>
                              ) : (
                                <p>
                                  No pages yet, add one to share with your team.
                                  <br />
                                  Once shared, all team members will have
                                  complete access to the page.
                                </p>
                              )}

                              <div className="mt-2">
                                {showAssignPage === team.id ? (
                                  <div className="flex">
                                    <select
                                      id="type"
                                      name="type"
                                      className="block w-full pl-3 pr-10 py-2 text-base dark:text-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md max-w-sm"
                                      onChange={(e) =>
                                        setSelectedPage(e.target.value)
                                      }
                                    >
                                      <option value="">Select a page</option>
                                      {pages
                                        .filter(
                                          (page) =>
                                            !team.pages.some(
                                              (p: Pick<IPage, "id">) =>
                                                p.id === page.id
                                            )
                                        )
                                        .filter(
                                          (page) => page.user_id === user?.id
                                        )
                                        .map((page) => (
                                          <option key={page.id} value={page.id}>
                                            {page.title}
                                          </option>
                                        ))}
                                    </select>

                                    <PrimaryButton
                                      label={
                                        assigningPage
                                          ? "Assigning..."
                                          : "Assign"
                                      }
                                      disabled={assigningPage}
                                      className="ml-2 h-8"
                                      onClick={async () => {
                                        if (!selectedPage) {
                                          return;
                                        }

                                        setAssigningPage(true);

                                        await supabase
                                          .from("pages")
                                          .update({
                                            team_id: team.id,
                                          })
                                          .match({ id: selectedPage });

                                        fetchTeams();
                                        setAssigningPage(null);
                                        setShowAssignPage(null);
                                        setSelectedPage(null);
                                      }}
                                    />

                                    <SecondaryButton
                                      label="Cancel"
                                      className="ml-2 h-8"
                                      onClick={() => setShowAssignPage(null)}
                                    />
                                  </div>
                                ) : (
                                  <PrimaryButton
                                    label="Add page to team"
                                    className="h-8"
                                    onClick={() => setShowAssignPage(team.id)}
                                  />
                                )}
                              </div>
                            </div>
                          </dd>

                          <dt className="text-sm/6 font-semibold text-gray-900 dark:text-gray-100 mt-4">
                            Members
                          </dt>
                          {team.team_members?.length > 0 ? (
                            <dd className="mt-2 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-4">
                              <ul
                                role="list"
                                className="divide-y divide-gray-100 dark:divide-gray-700 rounded-md border border-gray-200 dark:border-gray-700"
                              >
                                {team.team_members?.map(
                                  (member: {
                                    id: string;
                                    user_id: string;
                                    role: string;
                                  }) => (
                                    <li
                                      key={member.id}
                                      className="flex items-center justify-between p-2 text-sm/6"
                                    >
                                      <div className="flex w-0 flex-1 items-center">
                                        <UserIcon
                                          aria-hidden="true"
                                          className="size-5 shrink-0 text-gray-400 dark:text-gray-500"
                                        />
                                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                          <span className="truncate font-medium">
                                            {member.user_id}
                                          </span>
                                          <span className="shrink-0 text-gray-400 dark:text-gray-500 uppercase font-semibold">
                                            {member.role}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="ml-4 shrink-0">
                                        <a
                                          href="#"
                                          className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                                        >
                                          Remove
                                        </a>
                                      </div>
                                    </li>
                                  )
                                )}
                              </ul>
                            </dd>
                          ) : (
                            <dd className="mt-2 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-4">
                              No members yet
                            </dd>
                          )}

                          <dt className="text-sm/6 font-semibold text-gray-900 dark:text-gray-100 mt-4">
                            Invites
                          </dt>
                          <dd className="mt-2 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-4">
                            {team.team_invitations?.length > 0 ? (
                              <ul
                                role="list"
                                className="divide-y divide-gray-100 dark:divide-gray-700 rounded-md border border-gray-200 dark:border-gray-700 mb-4"
                              >
                                {team.team_invitations?.map(
                                  (invite: {
                                    id: string;
                                    email: string;
                                    role: string;
                                  }) => (
                                    <li
                                      key={invite.id}
                                      className="flex items-center justify-between p-2 text-sm/6"
                                    >
                                      <div className="flex w-0 flex-1 items-center">
                                        <UserIcon
                                          aria-hidden="true"
                                          className="size-5 shrink-0 text-gray-400 dark:text-gray-500"
                                        />
                                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                          <span className="truncate font-medium">
                                            {invite.email}
                                          </span>
                                          <span className="shrink-0 text-gray-400 dark:text-gray-500 uppercase font-semibold">
                                            {invite.role}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="ml-4 shrink-0">
                                        <button
                                          className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                                          onClick={async () => {
                                            await supabase
                                              .from("team_invitations")
                                              .delete()
                                              .match({ id: invite.id });

                                            fetchTeams();
                                          }}
                                        >
                                          Revoke
                                        </button>
                                      </div>
                                    </li>
                                  )
                                )}
                              </ul>
                            ) : null}

                            <PrimaryButton
                              label="Invite team member"
                              className="h-8"
                              onClick={async () => {
                                const email = prompt("Enter email address");
                                if (!email) {
                                  return;
                                }

                                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                                  notifyError("Invalid email address");
                                  return;
                                }

                                await toast.promise(
                                  httpPost({
                                    url: "/api/teams/invite",
                                    data: {
                                      team_id: team.id,
                                      email,
                                    },
                                  }),
                                  {
                                    loading: "Sending invitation...",
                                    success: "Invitation sent",
                                    error: "Failed to send invitation",
                                  }
                                );

                                fetchTeams();
                              }}
                            />
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                ) : (
                  <div
                    key={team.id}
                    className="overflow-hidden bg-white dark:bg-gray-800 shadow sm:rounded-lg mb-8"
                  >
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-center gap-4">
                        {team.image ? (
                          <img
                            src={team.image}
                            alt={team.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-base/7 font-semibold text-gray-900 dark:text-gray-100">
                            {team.name} (
                            {team.team_members?.[0]?.role
                              ? team.team_members?.[0]?.role?.toUpperCase()
                              : "Would you like to join?"}
                            )
                          </h3>
                          <div className="flex space-x-4 mt-1">
                            {team.team_invitations?.length > 0 ? (
                              <button
                                type="button"
                                className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/20 px-2.5 py-1.5 text-sm font-semibold text-green-700 dark:text-green-400 shadow-sm ring-1 ring-inset ring-green-600/10 dark:ring-green-500/20 hover:bg-green-100 dark:hover:bg-green-900/30"
                                onClick={async () => {
                                  await toast.promise(
                                    httpPost({
                                      url: "/api/teams/invite/accept",
                                      data: {
                                        invite_id: team.team_invitations[0].id,
                                      },
                                    }),
                                    {
                                      loading: "Joining team...",
                                      success: "Joined team",
                                      error: "Failed to join team",
                                    }
                                  );

                                  fetchTeams();
                                }}
                              >
                                Join
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="inline-flex items-center rounded-md bg-red-50 dark:bg-red-900/20 px-2.5 py-1.5 text-sm font-semibold text-red-700 dark:text-red-400 shadow-sm ring-1 ring-inset ring-red-600/10 dark:ring-red-500/20 hover:bg-red-100 dark:hover:bg-red-900/30"
                                onClick={async () => {
                                  if (
                                    confirm(
                                      "Are you sure you want to leave this team?"
                                    )
                                  ) {
                                    await supabase
                                      .from("team_members")
                                      .delete()
                                      .match({
                                        team_id: team.id,
                                        user_id: user?.id,
                                      });

                                    fetchTeams();
                                  }
                                }}
                              >
                                Leave
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </Page>

      <ManageTeamDialog
        open={showTeamModal}
        setOpen={setShowTeamModal}
        team={selectedTeam}
        onSuccess={() => {
          fetchTeams();
          setShowTeamModal(false);
          setSelectedTeam(null);
        }}
        onCancel={() => {
          setSelectedTeam(null);
        }}
      />

      <ConfirmDeleteDialog
        open={!!teamToDelete}
        setOpen={() => setTeamToDelete(null)}
        deleteCallback={() => deleteTeam(teamToDelete?.id)}
        itemName={teamToDelete?.name}
        highRiskAction
        riskVerificationText={teamToDelete?.name}
        processing={isDeleting}
      />
    </>
  );
}

Teams.getLayout = (page: JSX.Element) => <AuthLayout>{page}</AuthLayout>;
