import { supabaseAdmin } from "@changes-page/supabase/admin";
import { Database } from "@changes-page/supabase/types";
import { IPage, IPageSettings } from "@changes-page/supabase/types/page";
import { getCategoryColorClasses } from "@changes-page/utils";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { useTheme } from "next-themes";
import { Fragment, useEffect, useMemo, useState } from "react";
import Footer from "../../../../components/footer";
import PageHeader from "../../../../components/page-header";
import SeoTags from "../../../../components/seo-tags";
import {
  BLACKLISTED_SLUGS,
  fetchRenderData,
  isSubscriptionActive,
} from "../../../../lib/data";
import { getPageUrl } from "../../../../lib/url";

type RoadmapBoard = Database["public"]["Tables"]["roadmap_boards"]["Row"];
type RoadmapColumn = Database["public"]["Tables"]["roadmap_columns"]["Row"];
type RoadmapCategory =
  Database["public"]["Tables"]["roadmap_categories"]["Row"];
type RoadmapItem = Database["public"]["Tables"]["roadmap_items"]["Row"] & {
  roadmap_categories?: RoadmapCategory | null;
  vote_count?: number;
};

interface RoadmapPageProps {
  page: IPage;
  settings: IPageSettings;
  board: RoadmapBoard;
  columns: RoadmapColumn[];
  items: RoadmapItem[];
  roadmaps: Array<{
    id: string;
    title: string;
    slug: string;
    description?: string;
  }>;
}

export default function RoadmapPage({
  page,
  settings,
  board,
  columns,
  items,
  roadmaps,
}: RoadmapPageProps) {
  const { setTheme } = useTheme();
  const [selectedItem, setSelectedItem] = useState<RoadmapItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [votes, setVotes] = useState<
    Record<string, { count: number; voted: boolean }>
  >({});
  const [votingItems, setVotingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (settings?.color_scheme != "auto") {
      setTheme(settings?.color_scheme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.color_scheme]);

  // Organize items by column
  const itemsByColumn = useMemo(() => {
    const organized: Record<string, RoadmapItem[]> = {};
    columns.forEach((column) => {
      organized[column.id] = items
        .filter((item) => item.column_id === column.id)
        .sort((a, b) => (a.position || 0) - (b.position || 0));
    });
    return organized;
  }, [columns, items]);

  const openItemModal = (item: RoadmapItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeItemModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleVote = async (itemId: string) => {
    // Prevent voting if already in progress or if user has already voted and we're not toggling
    if (votingItems.has(itemId)) return;

    setVotingItems((prev) => new Set(prev).add(itemId));

    // Optimistic update
    const currentVoteState = votes[itemId];
    const newVotedState = !currentVoteState?.voted;
    const newCount = currentVoteState?.count
      ? newVotedState
        ? currentVoteState.count + 1
        : currentVoteState.count - 1
      : newVotedState
      ? 1
      : 0;

    setVotes((prev) => ({
      ...prev,
      [itemId]: {
        count: newCount,
        voted: newVotedState,
      },
    }));

    try {
      const response = await fetch("/api/roadmap/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item_id: itemId }),
      });

      const data = await response.json();

      if (data.ok) {
        // Update with server response to ensure consistency
        setVotes((prev) => ({
          ...prev,
          [itemId]: {
            count: data.vote_count || 0,
            voted: newVotedState,
          },
        }));
      } else {
        console.error("Voting error:", data.error || "Failed to vote");
        // Revert optimistic update on error
        setVotes((prev) => ({
          ...prev,
          [itemId]: {
            count: currentVoteState?.count || 0,
            voted: currentVoteState?.voted || false,
          },
        }));
      }
    } catch (error) {
      console.error("Error voting:", error);
      // Revert optimistic update on error
      setVotes((prev) => ({
        ...prev,
        [itemId]: {
          count: currentVoteState?.count || 0,
          voted: currentVoteState?.voted || false,
        },
      }));
    } finally {
      setVotingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  // Initialize vote data for items
  useEffect(() => {
    const fetchVotes = async () => {
      if (items.length === 0) return;

      try {
        const response = await fetch("/api/roadmap/votes/bulk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            item_ids: items.map((item) => item.id),
          }),
        });

        const data = await response.json();

        if (data.ok) {
          // Transform API response to match expected frontend structure
          const transformedVotes: Record<
            string,
            { count: number; voted: boolean }
          > = {};
          Object.entries(data.votes).forEach(
            ([itemId, voteData]: [string, any]) => {
              transformedVotes[itemId] = {
                count: voteData.vote_count,
                voted: voteData.user_voted,
              };
            }
          );
          setVotes(transformedVotes);
        }
      } catch (error) {
        console.error("Error fetching votes:", error);
      }
    };

    fetchVotes();
  }, [items]);

  return (
    <>
      <SeoTags
        page={page}
        settings={settings}
        title={`${board.title} - ${page.title}`}
        description={board.description || `Public roadmap for ${page.title}`}
        url={`${getPageUrl(page, settings)}/roadmap/${board.slug}`}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <PageHeader page={page} settings={settings} roadmaps={roadmaps} />

        {/* Kanban Board Container */}
        <main className="flex-1 overflow-hidden px-4 md:px-0 bg-gray-100 dark:bg-gray-950 -mt-8 py-6">
          <div className="h-full overflow-y-auto">
            {/* Roadmap Header */}
            <div className="pb-6 text-left">
              <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-left">
                  {board.title}
                </h1>
                {board.description && (
                  <p className="mt-2 text-gray-600 dark:text-gray-400 text-left">
                    {board.description}
                  </p>
                )}
              </div>
            </div>

            <div className="overflow-x-auto snap-x snap-mandatory md:overflow-x-visible h-full">
              <div className="flex md:justify-center h-full">
                <div className="flex space-x-4 md:space-x-6 pb-6 h-full">
                  {columns.map((column) => (
                    <div
                      key={column.id}
                      className="flex-shrink-0 snap-center bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 w-[calc(100vw-3rem)] md:w-80 max-h-[70vh] flex flex-col"
                    >
                      {/* Column Header */}
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {column.name}
                          </h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                            {itemsByColumn[column.id]?.length || 0}
                          </span>
                        </div>
                      </div>

                      {/* Column Items */}
                      <div className="flex-1 p-3 space-y-3 overflow-y-auto min-h-0">
                        {itemsByColumn[column.id]?.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => openItemModal(item)}
                            className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                              {item.title}
                            </h4>

                            {/* Bottom row with category and votes */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                {item.roadmap_categories && (
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryColorClasses(
                                      item.roadmap_categories.color || "blue"
                                    )}`}
                                  >
                                    {item.roadmap_categories.name}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVote(item.id);
                                }}
                                disabled={votingItems.has(item.id)}
                                className={`flex items-center text-xs px-2 py-1 rounded transition-colors ${
                                  votes[item.id]?.voted
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                                } ${
                                  votingItems.has(item.id)
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                              >
                                <svg
                                  className="mr-1 h-4 w-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span>
                                  {votes[item.id]?.count ??
                                    (item.vote_count || 0)}
                                </span>
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Empty state */}
                        {(!itemsByColumn[column.id] ||
                          itemsByColumn[column.id].length === 0) && (
                          <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                            No items in this stage yet
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Empty state for no columns */}
            {columns.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400">
                  <p className="text-lg font-medium">
                    This roadmap is being set up
                  </p>
                  <p className="text-sm mt-2">Check back soon for updates!</p>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer settings={settings} />
      </div>

      {/* Item Details Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeItemModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 dark:text-white pr-4"
                    >
                      {selectedItem?.title}
                    </Dialog.Title>
                    <button
                      type="button"
                      className="rounded-md bg-white dark:bg-gray-900 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onClick={closeItemModal}
                    >
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {selectedItem?.description && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {selectedItem.description}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {selectedItem?.roadmap_categories && (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColorClasses(
                            selectedItem.roadmap_categories.color || "blue"
                          )}`}
                        >
                          {selectedItem.roadmap_categories.name}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        selectedItem && handleVote(selectedItem.id)
                      }
                      disabled={
                        !selectedItem || votingItems.has(selectedItem.id)
                      }
                      className={`flex items-center text-sm px-3 py-1.5 rounded-lg transition-colors ${
                        selectedItem && votes[selectedItem.id]?.voted
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                      } ${
                        !selectedItem || votingItems.has(selectedItem.id)
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      <svg
                        className="mr-1 h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        {selectedItem
                          ? votes[selectedItem.id]?.count ??
                            (selectedItem.vote_count || 0)
                          : 0}{" "}
                        votes
                      </span>
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export async function getServerSideProps({
  params: { site, roadmap_slug },
}: {
  params: { site: string; roadmap_slug: string };
}) {
  console.log("handle roadmap ->", site, roadmap_slug);

  if (!site || !roadmap_slug) {
    return {
      notFound: true,
    };
  }

  if (BLACKLISTED_SLUGS.includes(site)) {
    return {
      notFound: true,
    };
  }

  const { page, settings } = await fetchRenderData(site);

  if (!page || !settings || !(await isSubscriptionActive(page?.user_id))) {
    return {
      notFound: true,
    };
  }

  // Fetch the roadmap board
  const { data: board, error: boardError } = await supabaseAdmin
    .from("roadmap_boards")
    .select("*")
    .eq("page_id", page.id)
    .eq("slug", roadmap_slug)
    .eq("is_public", true)
    .single();

  if (boardError || !board) {
    console.error("Failed to fetch roadmap board", boardError);
    return {
      notFound: true,
    };
  }

  // Fetch columns for this board
  const { data: columns, error: columnsError } = await supabaseAdmin
    .from("roadmap_columns")
    .select("*")
    .eq("board_id", board.id)
    .order("position", { ascending: true });

  if (columnsError) {
    console.error("Failed to fetch columns", columnsError);
  }

  // Fetch items for this board with category information
  const { data: items, error: itemsError } = await supabaseAdmin
    .from("roadmap_items")
    .select(
      `
      *,
      roadmap_categories (
        id,
        name,
        color
      )
    `
    )
    .eq("board_id", board.id)
    .order("position", { ascending: true });

  if (itemsError) {
    console.error("Failed to fetch items", itemsError);
  }

  // Fetch all public roadmaps for navigation
  const { data: roadmaps } = await supabaseAdmin
    .from("roadmap_boards")
    .select("id, title, slug, description")
    .eq("page_id", page.id)
    .eq("is_public", true)
    .order("created_at", { ascending: true });

  return {
    props: {
      page,
      settings,
      board,
      columns: columns || [],
      items: items || [],
      roadmaps: roadmaps || [],
    },
  };
}
