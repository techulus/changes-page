import {
  IPage,
  IPageSettings,
  IRoadmapBoard,
  IRoadmapCategory,
  IRoadmapColumn,
  IRoadmapItem,
} from "@changes-page/supabase/types/page";
import { getCategoryColorClasses } from "@changes-page/utils";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { Fragment, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import Footer from "../../../../components/footer";
import PageHeader from "../../../../components/page-header";
import SeoTags from "../../../../components/seo-tags";
import { usePageTheme } from "../../../../hooks/usePageTheme";
import {
  BLACKLISTED_SLUGS,
  fetchRenderData,
  getRoadmapBySlug,
} from "../../../../lib/data";
import { getPageUrl } from "../../../../lib/url";
import { httpPost } from "../../../../utils/http";

type RoadmapItem = IRoadmapItem & {
  roadmap_categories?: IRoadmapCategory | null;
  vote_count?: number;
};

export default function RoadmapPage({
  page,
  settings,
  board,
  columns,
  items,
  roadmaps,
}: {
  page: IPage;
  settings: IPageSettings;
  board: IRoadmapBoard;
  columns: IRoadmapColumn[];
  items: RoadmapItem[];
  roadmaps: IRoadmapBoard[];
}) {
  usePageTheme(settings?.color_scheme);

  const [selectedItem, setSelectedItem] = useState<RoadmapItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [votes, setVotes] = useState<
    Record<string, { count: number; voted: boolean }>
  >({});
  const [votingItems, setVotingItems] = useState<Set<string>>(new Set());

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
      const data = await httpPost({
        url: "/api/roadmap/vote",
        data: { item_id: itemId },
      });

      // Update with server response to ensure consistency
      setVotes((prev) => ({
        ...prev,
        [itemId]: {
          count: data.vote_count || 0,
          voted: newVotedState,
        },
      }));
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
        const data = await httpPost({
          url: "/api/roadmap/votes",
          data: { item_ids: items.map((item) => item.id) },
        });

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
        <PageHeader
          page={page}
          settings={settings}
          roadmaps={roadmaps}
          isRoadmapPage={true}
        />

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
                              {item.description && item.description.trim() && (
                                <svg
                                  className="inline h-4 w-4 text-gray-400 ml-1 align-text-bottom"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
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
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-0 text-center sm:items-center sm:p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <div className="relative">
                  <button
                    type="button"
                    className="absolute -top-4 -right-4 z-10 rounded-full bg-white dark:bg-gray-700 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg border border-gray-200 dark:border-gray-600"
                    onClick={closeItemModal}
                  >
                    <XIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white dark:bg-gray-900 p-8 text-left align-middle shadow-xl transition-all min-h-[50vh] sm:min-h-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
                      {/* Column Divider */}
                      <div className="hidden lg:block absolute left-2/3 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700 transform -translate-x-1/2 z-10"></div>

                      {/* Left side - Content */}
                      <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
                          {selectedItem?.title}
                        </h3>
                        {selectedItem?.description && (
                          <div>
                            <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                              <ReactMarkdown
                                rehypePlugins={[
                                  rehypeRaw,
                                  // @ts-ignore
                                  rehypeSanitize,
                                ]}
                                remarkPlugins={[remarkGfm]}
                              >
                                {selectedItem.description}
                              </ReactMarkdown>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right side - Metadata */}
                      <div className="lg:col-span-1 space-y-6">
                        {/* Votes */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Votes
                          </span>
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
                                : 0}
                            </span>
                          </button>
                        </div>

                        {/* Status (Column) */}
                        {selectedItem?.column_id && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Status
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                              {columns.find(
                                (col) => col.id === selectedItem.column_id
                              )?.name || "Unknown"}
                            </span>
                          </div>
                        )}

                        {/* Category */}
                        {selectedItem?.roadmap_categories && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Category
                            </span>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColorClasses(
                                selectedItem.roadmap_categories.color || "blue"
                              )}`}
                            >
                              {selectedItem.roadmap_categories.name}
                            </span>
                          </div>
                        )}

                        {/* Board */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Board
                          </span>
                          <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                            {board.title}
                          </span>
                        </div>

                        {/* Created Date */}
                        {selectedItem?.created_at && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Created
                            </span>
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                              {new Date(
                                selectedItem.created_at
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Dialog.Panel>
                </div>
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

  const { page, settings, roadmaps } = await fetchRenderData(site);

  if (!page || !settings) {
    return {
      notFound: true,
    };
  }

  const { board, columns, items } = await getRoadmapBySlug(
    page.id,
    roadmap_slug
  );

  if (!board) {
    return {
      notFound: true,
    };
  }

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
