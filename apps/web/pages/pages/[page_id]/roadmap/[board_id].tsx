import { Dialog, Transition } from "@headlessui/react";
import {
  DotsVerticalIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { Fragment, useMemo, useState, type JSX } from "react";
import { SecondaryButton } from "../../../../components/core/buttons.component";
import AuthLayout from "../../../../components/layout/auth-layout.component";
import Page from "../../../../components/layout/page.component";
import usePageSettings from "../../../../utils/hooks/usePageSettings";
import { getSupabaseServerClient } from "../../../../utils/supabase/supabase-admin";
import { createOrRetrievePageSettings } from "../../../../utils/useDatabase";
import { getPage } from "../../../../utils/useSSR";
import { useUserData } from "../../../../utils/useUser";
import { getCategoryColorClasses } from "@changes-page/utils";

export async function getServerSideProps({ req, res, params }) {
  const { page_id, board_id } = params;

  const { supabase } = await getSupabaseServerClient({ req, res });
  const page = await getPage(supabase, page_id).catch((e) => {
    console.error("Failed to get page", e);
    return null;
  });

  if (!page) {
    return {
      notFound: true,
    };
  }

  const settings = await createOrRetrievePageSettings(String(page_id));

  // Fetch the specific roadmap board
  const { data: board, error: boardError } = await supabase
    .from("roadmap_boards")
    .select("*")
    .eq("id", board_id)
    .eq("page_id", page_id)
    .single();

  if (boardError || !board) {
    console.error("Failed to fetch roadmap board", boardError);
    return {
      notFound: true,
    };
  }

  // Fetch columns for this board
  const { data: columns, error: columnsError } = await supabase
    .from("roadmap_columns")
    .select("*")
    .eq("board_id", board.id)
    .order("position", { ascending: true });

  if (columnsError) {
    console.error("Failed to fetch columns", columnsError);
  }

  // Fetch items for this board with category information and vote counts
  const { data: items, error: itemsError } = await supabase
    .from("roadmap_items")
    .select(
      `
      *,
      roadmap_categories (
        id,
        name,
        color
      ),
      roadmap_votes (
        id
      )
    `
    )
    .eq("board_id", board.id)
    .order("position", { ascending: true });

  if (itemsError) {
    console.error("Failed to fetch items", itemsError);
  }

  // Fetch categories for this board
  const { data: categories, error: categoriesError } = await supabase
    .from("roadmap_categories")
    .select("*")
    .eq("board_id", board.id)
    .order("created_at", { ascending: true });

  if (categoriesError) {
    console.error("Failed to fetch categories", categoriesError);
  }

  return {
    props: {
      page_id,
      page,
      settings,
      board,
      columns: columns || [],
      items: items || [],
      categories: categories || [],
    },
  };
}

export default function RoadmapBoardDetails({
  page,
  page_id,
  settings: serverSettings,
  board,
  columns,
  items,
  categories,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { user } = useUserData();

  const { settings: clientSettings } = usePageSettings(page_id, false);
  const isPageOwner = useMemo(() => page?.user_id === user?.id, [page, user]);

  const settings = useMemo(
    () => clientSettings ?? serverSettings,
    [serverSettings, clientSettings]
  );

  const { supabase } = useUserData();

  // Item states
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [itemForm, setItemForm] = useState({
    title: "",
    description: "",
    category_id: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Data states
  const [boardItems, setBoardItems] = useState(items);
  const [boardCategories] = useState(categories);

  // Drag and drop states
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [dragOverPosition, setDragOverPosition] = useState(null);

  // Organize items by column
  const itemsByColumn = useMemo(() => {
    const organized = {};
    columns.forEach((column) => {
      organized[column.id] = boardItems
        .filter((item) => item.column_id === column.id)
        .sort((a, b) => (a.position || 0) - (b.position || 0));
    });
    return organized;
  }, [columns, boardItems]);

  // CRUD Functions
  const handleAddItem = (columnId: string) => {
    setSelectedColumnId(columnId);
    setEditingItem(null);
    setItemForm({
      title: "",
      description: "",
      category_id: boardCategories[0]?.id || "",
    });
    setFormErrors({});
    setShowItemModal(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setSelectedColumnId(item.column_id);
    setItemForm({
      title: item.title,
      description: item.description || "",
      category_id: item.category_id || "",
    });
    setFormErrors({});
    setShowItemModal(true);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const { error } = await supabase
        .from("roadmap_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;

      setBoardItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item");
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!itemForm.title.trim()) errors.title = "Title is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitItem = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (editingItem) {
        // Update existing item
        const { data, error } = await supabase
          .from("roadmap_items")
          .update({
            title: itemForm.title.trim(),
            description: itemForm.description.trim() || null,
            category_id: itemForm.category_id || null,
          })
          .eq("id", editingItem.id)
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
          .single();

        if (error) throw error;

        setBoardItems((prev) =>
          prev.map((item) => (item.id === editingItem.id ? data : item))
        );
      } else {
        // Create new item
        const columnItems = itemsByColumn[selectedColumnId] || [];
        const maxPosition =
          columnItems.length > 0
            ? Math.max(...columnItems.map((item) => item.position || 0))
            : 0;

        const { data, error } = await supabase
          .from("roadmap_items")
          .insert({
            board_id: board.id,
            column_id: selectedColumnId,
            title: itemForm.title.trim(),
            description: itemForm.description.trim() || null,
            category_id: itemForm.category_id || null,
            position: maxPosition + 1,
          })
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
          .single();

        if (error) throw error;

        setBoardItems((prev) => [...prev, data]);
      }

      setShowItemModal(false);
    } catch (error) {
      console.error("Error saving item:", error);
      setFormErrors({ general: "Failed to save item" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowItemModal(false);
    setEditingItem(null);
    setFormErrors({});
  };

  // Drag and Drop Functions
  const handleDragStart = (e, item) => {
    if (!isPageOwner) return;
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
    e.target.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDraggedItem(null);
    setDragOverColumn(null);
    setDragOverPosition(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e) => {
    // Only clear drag over if leaving the column container
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverColumn(null);
      setDragOverPosition(null);
    }
  };

  const handleItemDragOver = (e, columnId, itemId, position) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverColumn(columnId);
    setDragOverPosition({ itemId, position });
  };

  const handleDrop = async (e, targetColumnId) => {
    e.preventDefault();
    setDragOverColumn(null);
    const currentDragOverPosition = dragOverPosition;
    setDragOverPosition(null);

    if (!draggedItem || !isPageOwner) return;

    try {
      const sourceColumnId = draggedItem.column_id;
      const sourceColumnItems = itemsByColumn[sourceColumnId] || [];
      const targetColumnItems = itemsByColumn[targetColumnId] || [];

      if (sourceColumnId === targetColumnId) {
        // Same column reordering
        if (!currentDragOverPosition) {
          setDraggedItem(null);
          return;
        }

        const draggedIndex = sourceColumnItems.findIndex(
          (item) => item.id === draggedItem.id
        );
        const targetIndex = sourceColumnItems.findIndex(
          (item) => item.id === currentDragOverPosition.itemId
        );

        if (
          draggedIndex === -1 ||
          targetIndex === -1 ||
          draggedIndex === targetIndex
        ) {
          setDraggedItem(null);
          return;
        }

        // Create new ordered array
        const reorderedItems = [...sourceColumnItems];
        const [draggedItemData] = reorderedItems.splice(draggedIndex, 1);

        // Calculate new insert position
        let insertIndex = targetIndex;
        if (currentDragOverPosition.position === "after") {
          insertIndex = targetIndex + 1;
        }
        if (
          draggedIndex < targetIndex &&
          currentDragOverPosition.position === "before"
        ) {
          insertIndex = targetIndex - 1;
        }
        if (
          draggedIndex < targetIndex &&
          currentDragOverPosition.position === "after"
        ) {
          insertIndex = targetIndex;
        }

        reorderedItems.splice(insertIndex, 0, draggedItemData);

        // Update local state first for immediate UI feedback
        setBoardItems((prev) => {
          return prev.map((item) => {
            const updatedIndex = reorderedItems.findIndex(
              (reorderedItem) => reorderedItem.id === item.id
            );
            if (updatedIndex !== -1) {
              return { ...item, position: updatedIndex + 1 };
            }
            return item;
          });
        });

        // Update database with a single batch operation
        // First, temporarily set all positions to very high numbers to avoid conflicts
        const tempUpdates = reorderedItems.map((item, index) =>
          supabase
            .from("roadmap_items")
            .update({ position: 1000 + index })
            .eq("id", item.id)
        );
        await Promise.all(tempUpdates);

        // Then set final positions
        const finalUpdates = reorderedItems.map((item, index) =>
          supabase
            .from("roadmap_items")
            .update({ position: index + 1 })
            .eq("id", item.id)
        );
        await Promise.all(finalUpdates);
      } else {
        // Moving between different columns
        let newPosition = 1;

        if (!currentDragOverPosition) {
          // Drop at end of target column
          newPosition =
            targetColumnItems.length > 0
              ? Math.max(
                  ...targetColumnItems.map((item) => item.position || 0)
                ) + 1
              : 1;
        } else {
          // Drop at specific position
          const targetItem = targetColumnItems.find(
            (item) => item.id === currentDragOverPosition.itemId
          );
          if (targetItem) {
            if (currentDragOverPosition.position === "before") {
              newPosition = targetItem.position;
              // Shift items down that are at or after this position
              const itemsToShift = targetColumnItems.filter(
                (item) => item.position >= targetItem.position
              );
              if (itemsToShift.length > 0) {
                const shiftPromises = itemsToShift.map((item) =>
                  supabase
                    .from("roadmap_items")
                    .update({ position: item.position + 1 })
                    .eq("id", item.id)
                );
                await Promise.all(shiftPromises);
              }
            } else {
              newPosition = targetItem.position + 1;
              // Shift items down that are after this position
              const itemsToShift = targetColumnItems.filter(
                (item) => item.position > targetItem.position
              );
              if (itemsToShift.length > 0) {
                const shiftPromises = itemsToShift.map((item) =>
                  supabase
                    .from("roadmap_items")
                    .update({ position: item.position + 1 })
                    .eq("id", item.id)
                );
                await Promise.all(shiftPromises);
              }
            }
          } else {
            newPosition = targetColumnItems.length + 1;
          }
        }

        // Update the dragged item
        const { error } = await supabase
          .from("roadmap_items")
          .update({
            column_id: targetColumnId,
            position: newPosition,
          })
          .eq("id", draggedItem.id);

        if (error) throw error;

        // Update local state
        setBoardItems((prev) =>
          prev.map((item) => {
            if (item.id === draggedItem.id) {
              return {
                ...item,
                column_id: targetColumnId,
                position: newPosition,
              };
            }
            // Update positions of shifted items in target column
            if (item.column_id === targetColumnId && currentDragOverPosition) {
              const targetItem = targetColumnItems.find(
                (ti) => ti.id === currentDragOverPosition.itemId
              );
              if (targetItem) {
                if (
                  currentDragOverPosition.position === "before" &&
                  item.position >= targetItem.position
                ) {
                  return { ...item, position: item.position + 1 };
                }
                if (
                  currentDragOverPosition.position === "after" &&
                  item.position > targetItem.position
                ) {
                  return { ...item, position: item.position + 1 };
                }
              }
            }
            return item;
          })
        );
      }
    } catch (error) {
      console.error("Error moving item:", error);
      alert("Failed to move item");
    }

    setDraggedItem(null);
  };

  if (!page_id || !board) return null;

  return (
    <>
      <Page
        title={board.title}
        subtitle={`${board.is_public ? "Public" : "Private"} Roadmap • ${
          board.description || "No description"
        }`}
        showBackButton={true}
        backRoute={`/pages/${page_id}/roadmap`}
        containerClassName="lg:pb-0"
        fullWidth={true}
        buttons={
          isPageOwner && (
            <SecondaryButton
              label="Settings"
              icon={<DotsVerticalIcon className="-ml-1 mr-2 h-5 w-5" />}
              onClick={() =>
                (window.location.href = `/pages/${page_id}/roadmap/${board.id}/settings`)
              }
            />
          )
        }
      >
        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex justify-center">
            <div
              className="flex space-x-6 pb-6 h-full"
              style={{ minHeight: "calc(100vh - 300px)" }}
            >
              {columns.map((column) => (
                <div
                  key={column.id}
                  className={`flex-shrink-0 w-80 flex flex-col transition-colors ${
                    dragOverColumn === column.id
                      ? "bg-indigo-50 dark:bg-indigo-900/20 rounded-lg"
                      : ""
                  }`}
                  onDragOver={handleDragOver}
                  onDragEnter={(e) => handleDragEnter(e, column.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, column.id)}
                >
                  {/* Stage Header */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {column.name}
                        {dragOverColumn === column.id && (
                          <span className="ml-2 text-indigo-600 dark:text-indigo-400">
                            <svg
                              className="inline h-4 w-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        )}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                        {itemsByColumn[column.id]?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* Stage Items */}
                  <div className="flex-1 overflow-y-auto pr-2">
                    {itemsByColumn[column.id]?.map((item, itemIndex) => (
                      <div key={item.id}>
                        {/* Drop zone before item */}
                        <div
                          onDragOver={(e) =>
                            handleItemDragOver(e, column.id, item.id, "before")
                          }
                          onDrop={(e) => handleDrop(e, column.id)}
                          className={`h-1 transition-colors ${
                            dragOverPosition?.itemId === item.id &&
                            dragOverPosition?.position === "before"
                              ? "bg-indigo-400 dark:bg-indigo-600 rounded"
                              : ""
                          }`}
                        />

                        {/* Item */}
                        <div
                          draggable={isPageOwner}
                          onDragStart={(e) => handleDragStart(e, item)}
                          onDragEnd={handleDragEnd}
                          className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group mb-2 ${
                            isPageOwner ? "cursor-move" : ""
                          } ${draggedItem?.id === item.id ? "opacity-50" : ""}`}
                        >
                          <div className="flex items-start justify-between">
                            <h4
                              className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 cursor-pointer flex-1"
                              onClick={() => setSelectedItem(item)}
                            >
                              {item.title}
                            </h4>
                            {isPageOwner && (
                              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditItem(item);
                                  }}
                                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                  <PencilIcon className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteItem(item.id);
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                >
                                  <TrashIcon className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </div>


                          {/* Bottom row with category and votes */}
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center">
                              {item.roadmap_categories && (
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryColorClasses(item.roadmap_categories.color || 'blue')}`}>
                                  {item.roadmap_categories.name}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
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
                              <span>{item.roadmap_votes?.length || 0}</span>
                            </div>
                          </div>
                        </div>

                        {/* Drop zone after the last item */}
                        {itemIndex ===
                          (itemsByColumn[column.id]?.length || 0) - 1 && (
                          <div
                            onDragOver={(e) =>
                              handleItemDragOver(e, column.id, item.id, "after")
                            }
                            onDrop={(e) => handleDrop(e, column.id)}
                            className={`h-1 transition-colors ${
                              dragOverPosition?.itemId === item.id &&
                              dragOverPosition?.position === "after"
                                ? "bg-indigo-400 dark:bg-indigo-600 rounded"
                                : ""
                            }`}
                          />
                        )}
                      </div>
                    ))}

                    {/* Drop zone at the end when column has items */}
                    {itemsByColumn[column.id]?.length > 0 && (
                      <div
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, column.id)}
                        className={`h-1 transition-colors ${
                          dragOverColumn === column.id && !dragOverPosition
                            ? "bg-indigo-400 dark:bg-indigo-600 rounded"
                            : ""
                        }`}
                      />
                    )}

                    {/* Add Item Button */}
                    {isPageOwner && (
                      <button
                        onClick={() => handleAddItem(column.id)}
                        className="mt-3 w-full flex items-center justify-center px-3 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                      >
                        <PlusIcon className="mr-1 h-4 w-4" />
                        Add item
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Empty state when no columns */}
        {columns.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              No stages configured
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              This board doesn&apos;t have any stages set up yet.
            </p>
          </div>
        )}
      </Page>

      {/* Item Create/Edit Modal */}
      <Transition appear show={showItemModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    {editingItem ? "Edit Item" : "Add New Item"}
                  </Dialog.Title>

                  <form onSubmit={handleSubmitItem} className="mt-4 space-y-4">
                    {formErrors.general && (
                      <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                        <div className="text-sm text-red-700 dark:text-red-400">
                          {formErrors.general}
                        </div>
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="item-title"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Title *
                      </label>
                      <input
                        type="text"
                        id="item-title"
                        value={itemForm.title}
                        onChange={(e) =>
                          setItemForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 sm:text-sm"
                        placeholder="Enter item title..."
                      />
                      {formErrors.title && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {formErrors.title}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="item-description"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Description
                      </label>
                      <textarea
                        id="item-description"
                        rows={3}
                        value={itemForm.description}
                        onChange={(e) =>
                          setItemForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 sm:text-sm"
                        placeholder="Describe this item..."
                      />
                    </div>

                    {boardCategories.length > 0 && (
                      <div>
                        <label
                          htmlFor="item-category"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Category
                        </label>
                        <select
                          id="item-category"
                          value={itemForm.category_id}
                          onChange={(e) =>
                            setItemForm((prev) => ({
                              ...prev,
                              category_id: e.target.value,
                            }))
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 sm:text-sm"
                        >
                          <option value="">No category</option>
                          {boardCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting
                          ? "Saving..."
                          : editingItem
                          ? "Update"
                          : "Create"}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

RoadmapBoardDetails.getLayout = function getLayout(page: JSX.Element) {
  return <AuthLayout>{page}</AuthLayout>;
};
