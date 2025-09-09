import {
  getCategoryColorClasses,
  getCategoryColorOptions,
  ROADMAP_COLORS,
} from "@changes-page/utils";
import { MenuIcon } from "@heroicons/react/outline";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/solid";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState, type JSX } from "react";
import AuthLayout from "../../../../../components/layout/auth-layout.component";
import Page from "../../../../../components/layout/page.component";
import usePageSettings from "../../../../../utils/hooks/usePageSettings";
import { getPageUrl } from "../../../../../utils/hooks/usePageUrl";
import { withSupabase } from "../../../../../utils/supabase/withSupabase";
import { createOrRetrievePageSettings } from "../../../../../utils/useDatabase";
import { getPage } from "../../../../../utils/useSSR";
import { useUserData } from "../../../../../utils/useUser";

export const getServerSideProps = withSupabase(async (ctx, { supabase }) => {
  const { page_id } = ctx.params;
  if (!page_id || Array.isArray(page_id)) {
    return { notFound: true };
  }

  const { board_id } = ctx.params;
  if (!board_id || Array.isArray(board_id)) {
    return { notFound: true };
  }

  const { tab = "board" } = ctx.query;

  const page = await getPage(supabase, page_id).catch((e) => {
    console.error("Failed to get page", e);
    return null;
  });

  if (!page) {
    return {
      notFound: true,
    };
  }

  const settings = await createOrRetrievePageSettings(page_id);

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
      categories: categories || [],
      initialTab: tab,
    },
  };
});

export default function BoardSettings({
  page,
  page_id,
  settings: serverSettings,
  board,
  columns,
  categories,
  initialTab,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { supabase, user } = useUserData();
  const { settings: clientSettings } = usePageSettings(page_id, false);
  const isPageOwner = useMemo(() => page?.user_id === user?.id, [page, user]);

  const settings = useMemo(
    () => clientSettings ?? serverSettings,
    [serverSettings, clientSettings]
  );

  // Active tab state
  const [activeTab, setActiveTab] = useState(initialTab || "board");

  // Update activeTab when URL changes
  useEffect(() => {
    const { tab } = router.query;
    if (tab && typeof tab === "string") {
      setActiveTab(tab);
    }
  }, [router.query]);

  // Board form state
  const [boardForm, setBoardForm] = useState({
    title: board.title,
    description: board.description || "",
    slug: board.slug,
    is_public: board.is_public,
  });
  const [isSavingBoard, setIsSavingBoard] = useState(false);
  const [slugError, setSlugError] = useState("");

  // Categories state
  const [boardCategories, setBoardCategories] = useState(categories);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("blue");
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToEdit, setCategoryToEdit] = useState("");
  const [categoryColorToEdit, setCategoryColorToEdit] = useState("blue");

  // Columns state
  const [boardColumns, setBoardColumns] = useState(columns);
  const [newColumn, setNewColumn] = useState("");
  const [editingColumn, setEditingColumn] = useState(null);
  const [columnToEdit, setColumnToEdit] = useState("");

  // Drag and drop state for columns
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const tabs = [
    {
      name: "Settings",
      current: activeTab === "board",
      href: `/pages/${page_id}/roadmap/${board.id}/settings?tab=board`,
    },
    {
      name: "Stages",
      current: activeTab === "columns",
      href: `/pages/${page_id}/roadmap/${board.id}/settings?tab=columns`,
    },
    {
      name: "Categories",
      current: activeTab === "categories",
      href: `/pages/${page_id}/roadmap/${board.id}/settings?tab=categories`,
    },
  ];

  // Slug validation function
  const validateSlug = (slug: string) => {
    if (!slug.trim()) {
      return "Slug is required";
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return "Slug can only contain lowercase letters, numbers, and hyphens";
    }
    if (slug.length < 3) {
      return "Slug must be at least 3 characters long";
    }
    if (slug.length > 50) {
      return "Slug must be less than 50 characters";
    }
    return "";
  };

  // Auto-generate slug from title
  const generateSlugFromTitle = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // Handle slug input changes
  const handleSlugChange = (newSlug: string) => {
    setBoardForm((prev) => ({ ...prev, slug: newSlug }));
    const error = validateSlug(newSlug);
    setSlugError(error);
  };

  // Board settings functions
  const handleUpdateBoard = async (e) => {
    e.preventDefault();
    if (!isPageOwner) return;

    // Validate slug
    const slugValidationError = validateSlug(boardForm.slug);
    if (slugValidationError) {
      setSlugError(slugValidationError);
      return;
    }

    setIsSavingBoard(true);
    try {
      const { error } = await supabase
        .from("roadmap_boards")
        .update({
          title: boardForm.title.trim(),
          description: boardForm.description.trim() || null,
          slug: boardForm.slug.trim(),
          is_public: boardForm.is_public,
        })
        .eq("id", board.id);

      if (error) {
        if (error.code === "23505") {
          setSlugError("This slug is already in use");
          return;
        }
        throw error;
      }

      // Refresh the page to show updated settings
      window.location.reload();
    } catch (error) {
      console.error("Error updating board:", error);
      alert("Failed to update board settings");
    } finally {
      setIsSavingBoard(false);
    }
  };

  // Category functions
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim() || !isPageOwner) return;

    try {
      const { data, error } = await supabase
        .from("roadmap_categories")
        .insert({
          board_id: board.id,
          name: newCategory.trim(),
          color: newCategoryColor,
        })
        .select()
        .single();

      if (error) throw error;

      setBoardCategories([...boardCategories, data]);
      setNewCategory("");
      setNewCategoryColor("blue");
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category");
    }
  };

  const handleUpdateCategory = async (categoryId) => {
    if (!categoryToEdit.trim() || !isPageOwner) return;

    try {
      const { error } = await supabase
        .from("roadmap_categories")
        .update({
          name: categoryToEdit.trim(),
          color: categoryColorToEdit,
        })
        .eq("id", categoryId);

      if (error) throw error;

      setBoardCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                name: categoryToEdit.trim(),
                color: categoryColorToEdit,
              }
            : cat
        )
      );
      setEditingCategory(null);
      setCategoryToEdit("");
      setCategoryColorToEdit("blue");
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    // Check if category has items
    try {
      const { data: itemsWithCategory, error: checkError } = await supabase
        .from("roadmap_items")
        .select("id")
        .eq("category_id", categoryId);

      if (checkError) throw checkError;

      const itemCount = itemsWithCategory?.length || 0;
      let confirmMessage = "Are you sure you want to delete this category?";

      if (itemCount > 0) {
        confirmMessage = `This category is used by ${itemCount} item(s). Items will become uncategorized. Are you sure?`;
      }

      if (!confirm(confirmMessage)) return;

      const { error } = await supabase
        .from("roadmap_categories")
        .delete()
        .eq("id", categoryId);

      if (error) throw error;

      setBoardCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    }
  };

  // Column functions
  const handleAddColumn = async (e) => {
    e.preventDefault();
    if (!newColumn.trim() || !isPageOwner) return;

    try {
      const maxPosition =
        Math.max(...boardColumns.map((col) => col.position)) + 1;

      const { data, error } = await supabase
        .from("roadmap_columns")
        .insert({
          board_id: board.id,
          name: newColumn.trim(),
          position: maxPosition,
        })
        .select()
        .single();

      if (error) throw error;

      setBoardColumns([...boardColumns, data]);
      setNewColumn("");
    } catch (error) {
      console.error("Error adding column:", error);
      alert("Failed to add column");
    }
  };

  const handleUpdateColumn = async (columnId) => {
    if (!columnToEdit.trim() || !isPageOwner) return;

    try {
      const { error } = await supabase
        .from("roadmap_columns")
        .update({ name: columnToEdit.trim() })
        .eq("id", columnId);

      if (error) throw error;

      setBoardColumns((prev) =>
        prev.map((col) =>
          col.id === columnId ? { ...col, name: columnToEdit.trim() } : col
        )
      );
      setEditingColumn(null);
      setColumnToEdit("");
    } catch (error) {
      console.error("Error updating column:", error);
      alert("Failed to update column");
    }
  };

  const handleDeleteColumn = async (columnId) => {
    // Check if stage has items
    try {
      const { data: itemsInColumn, error: checkError } = await supabase
        .from("roadmap_items")
        .select("id")
        .eq("column_id", columnId);

      if (checkError) throw checkError;

      const itemCount = itemsInColumn?.length || 0;

      if (itemCount > 0) {
        alert(
          `Cannot delete this stage because it contains ${itemCount} item(s).\n\nTo delete this stage, first move or delete all items from it.`
        );
        return;
      } else {
        if (!confirm("Are you sure you want to delete this stage?")) return;
      }

      const { error } = await supabase
        .from("roadmap_columns")
        .delete()
        .eq("id", columnId);

      if (error) throw error;

      setBoardColumns((prev) => prev.filter((col) => col.id !== columnId));
    } catch (error) {
      console.error("Error deleting column:", error);
      alert("Failed to delete column");
    }
  };

  // Drag and drop handlers for columns
  const handleColumnDragStart = (e, column, index) => {
    setDraggedColumn({ column, index });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleColumnDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleColumnDragLeave = (e) => {
    // Only clear drag over if leaving the entire container
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverIndex(null);
    }
  };

  const handleColumnDrop = async (e, dropIndex) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (!draggedColumn || draggedColumn.index === dropIndex) {
      setDraggedColumn(null);
      return;
    }

    try {
      // Create new array with reordered columns
      const newColumns = [...boardColumns];
      const [movedColumn] = newColumns.splice(draggedColumn.index, 1);
      newColumns.splice(dropIndex, 0, movedColumn);

      // Update positions in database
      const updatePromises = newColumns.map((column, index) =>
        supabase
          .from("roadmap_columns")
          .update({ position: index + 1 })
          .eq("id", column.id)
      );

      await Promise.all(updatePromises);

      // Update local state
      setBoardColumns(
        newColumns.map((column, index) => ({
          ...column,
          position: index + 1,
        }))
      );
    } catch (error) {
      console.error("Error reordering stages:", error);
      alert("Failed to reorder stages");
    }

    setDraggedColumn(null);
  };

  const handleColumnDragEnd = () => {
    setDraggedColumn(null);
    setDragOverIndex(null);
  };

  if (!page_id || !board || !isPageOwner) {
    return <div>Access denied</div>;
  }

  return (
    <Page
      title="Settings"
      subtitle={board.title}
      showBackButton={true}
      backRoute={`/pages/${page_id}/roadmap/${board.id}`}
      tabs={tabs}
    >
      <div className="max-w-4xl mx-auto">
        {/* Board Settings Tab */}
        {activeTab === "board" && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <form onSubmit={handleUpdateBoard} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Board Title
                </label>
                <input
                  type="text"
                  value={boardForm.title}
                  onChange={(e) =>
                    setBoardForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={boardForm.description}
                  onChange={(e) =>
                    setBoardForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Roadmap Slug
                </label>
                <div className="mt-1 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={boardForm.slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      className={`flex-1 rounded-md shadow-sm focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 ${
                        slugError
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:border-indigo-500"
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const generatedSlug = generateSlugFromTitle(
                          boardForm.title
                        );
                        if (generatedSlug) {
                          handleSlugChange(generatedSlug);
                        }
                      }}
                      className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Auto
                    </button>
                  </div>
                  {slugError && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {slugError}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Public URL:{" "}
                    <a
                      href={`${getPageUrl(page, settings)}/roadmap/${
                        boardForm.slug
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 underline"
                    >
                      {getPageUrl(page, settings)}/roadmap/{boardForm.slug}
                    </a>
                  </p>
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={boardForm.is_public}
                    onChange={(e) =>
                      setBoardForm((prev) => ({
                        ...prev,
                        is_public: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Make this board public (users can view and vote on items)
                  </span>
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingBoard}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSavingBoard ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            {/* Existing Categories List */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="space-y-3">
                {boardCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    {editingCategory === category.id ? (
                      <div className="flex-1 space-y-3">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={categoryToEdit}
                            onChange={(e) => setCategoryToEdit(e.target.value)}
                            className="flex-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300"
                            autoFocus
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Color
                          </label>
                          <div className="flex gap-2 flex-wrap">
                            {getCategoryColorOptions().map((color) => (
                              <button
                                key={color.value}
                                type="button"
                                onClick={() =>
                                  setCategoryColorToEdit(color.value)
                                }
                                className={`w-6 h-6 rounded-full border-2 transition-all ${
                                  categoryColorToEdit === color.value
                                    ? "border-gray-400 ring-2 ring-offset-1 ring-gray-300"
                                    : "border-gray-200 hover:border-gray-300"
                                } ${color.preview}`}
                                title={color.label}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={() => handleUpdateCategory(category.id)}
                            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => {
                              setEditingCategory(null);
                              setCategoryToEdit("");
                              setCategoryColorToEdit("blue");
                            }}
                            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full ${
                              ROADMAP_COLORS[category.color || "blue"]
                                ?.preview || "bg-blue-500"
                            }`}
                          ></div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColorClasses(
                              category.color || "blue"
                            )}`}
                          >
                            {category.name}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingCategory(category.id);
                              setCategoryToEdit(category.name);
                              setCategoryColorToEdit(category.color || "blue");
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Category Form */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Add New Category
              </h3>

              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter category name..."
                    className="flex-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {getCategoryColorOptions().map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setNewCategoryColor(color.value)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          newCategoryColor === color.value
                            ? "border-gray-400 ring-2 ring-offset-2 ring-gray-300"
                            : "border-gray-200 hover:border-gray-300"
                        } ${color.preview}`}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stages Tab */}
        {activeTab === "columns" && (
          <div className="space-y-6">
            {/* Existing Stages List */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="space-y-3">
                {boardColumns.map((column, index) => (
                  <div
                    key={column.id}
                    draggable={editingColumn !== column.id}
                    onDragStart={(e) => handleColumnDragStart(e, column, index)}
                    onDragOver={(e) => handleColumnDragOver(e, index)}
                    onDragLeave={handleColumnDragLeave}
                    onDrop={(e) => handleColumnDrop(e, index)}
                    onDragEnd={handleColumnDragEnd}
                    className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                      dragOverIndex === index
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    } ${draggedColumn?.index === index ? "opacity-50" : ""} ${
                      editingColumn === column.id ? "" : "cursor-move"
                    }`}
                  >
                    {editingColumn === column.id ? (
                      <div className="flex-1 flex gap-3">
                        <input
                          type="text"
                          value={columnToEdit}
                          onChange={(e) => setColumnToEdit(e.target.value)}
                          className="flex-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300"
                          autoFocus
                        />
                        <button
                          onClick={() => handleUpdateColumn(column.id)}
                          className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingColumn(null);
                            setColumnToEdit("");
                          }}
                          className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <MenuIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              #{index + 1}
                            </span>
                          </div>
                          <span className="text-gray-900 dark:text-gray-100">
                            {column.name}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingColumn(column.id);
                              setColumnToEdit(column.name);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteColumn(column.id)}
                            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Stage Form */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Add New Stage
              </h3>

              <form onSubmit={handleAddColumn} className="flex gap-3">
                <input
                  type="text"
                  value={newColumn}
                  onChange={(e) => setNewColumn(e.target.value)}
                  placeholder="Enter stage name..."
                  className="flex-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300"
                />
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
}

BoardSettings.getLayout = function getLayout(page: JSX.Element) {
  return <AuthLayout>{page}</AuthLayout>;
};
