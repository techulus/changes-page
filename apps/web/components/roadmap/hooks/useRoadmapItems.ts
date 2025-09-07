import {
  IRoadmapBoard,
  IRoadmapCategory,
} from "@changes-page/supabase/types/page";
import { useState } from "react";
import { useUserData } from "../../../utils/useUser";
import {
  FormErrors,
  ItemForm,
  ItemsByColumn,
  RoadmapItemWithRelations,
} from "../types";

export function useRoadmapItems({
  board,
  categories,
  itemsByColumn,
}: {
  board: IRoadmapBoard;
  categories: IRoadmapCategory[];
  itemsByColumn: ItemsByColumn;
}) {
  const { supabase } = useUserData();
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [editingItem, setEditingItem] =
    useState<RoadmapItemWithRelations | null>(null);
  const [itemForm, setItemForm] = useState<ItemForm>({
    title: "",
    description: "",
    category_id: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleAddItem = (columnId: string) => {
    setSelectedColumnId(columnId);
    setEditingItem(null);
    setItemForm({
      title: "",
      description: "",
      category_id: categories[0]?.id || "",
    });
    setFormErrors({});
    setShowItemModal(true);
  };

  const handleEditItem = (item: RoadmapItemWithRelations) => {
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

  const handleDeleteItem = async (
    itemId: string,
    setBoardItems: React.Dispatch<
      React.SetStateAction<RoadmapItemWithRelations[]>
    >
  ) => {
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
    const errors: FormErrors = {};
    if (!itemForm.title.trim()) {
      errors.title = "Title is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitItem = async (
    e: React.FormEvent<HTMLFormElement>,
    setBoardItems: React.Dispatch<
      React.SetStateAction<RoadmapItemWithRelations[]>
    >
  ) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (editingItem) {
        const { data, error } = await supabase
          .from("roadmap_items")
          .update({
            title: itemForm.title.trim(),
            description: itemForm.description.trim() || null,
            category_id: itemForm.category_id || null,
          })
          .eq("id", editingItem.id)
          .select(
            `*,
              roadmap_categories (
                id,
                name,
                color
              ),
              roadmap_votes (
                id
              )`
          )
          .single();

        if (error) throw error;

        setBoardItems((prev) =>
          prev.map((item) => (item.id === editingItem.id ? data : item))
        );
      } else {
        if (!selectedColumnId) return;

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
            `*,
              roadmap_categories (
                id,
                name,
                color
              ),
              roadmap_votes (
                id
              )`
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

  return {
    showItemModal,
    selectedColumnId,
    editingItem,
    itemForm,
    setItemForm,
    isSubmitting,
    formErrors,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleSubmitItem,
    closeModal,
  };
}
