import { useState } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { RoadmapItemWithRelations, ItemsByColumn, DragOverPosition } from "../types";

interface UseRoadmapDragDropProps {
  supabase: SupabaseClient;
  itemsByColumn: ItemsByColumn;
  setBoardItems: React.Dispatch<React.SetStateAction<RoadmapItemWithRelations[]>>;
}

export function useRoadmapDragDrop({
  supabase,
  itemsByColumn,
  setBoardItems,
}: UseRoadmapDragDropProps) {
  const [draggedItem, setDraggedItem] = useState<RoadmapItemWithRelations | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [dragOverPosition, setDragOverPosition] = useState<DragOverPosition | null>(null);

  const handleDragStart = (e: React.DragEvent, item: RoadmapItemWithRelations) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
    (e.target as HTMLElement).style.opacity = "0.5";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = "1";
    setDraggedItem(null);
    setDragOverColumn(null);
    setDragOverPosition(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
      setDragOverPosition(null);
    }
  };

  const handleItemDragOver = (
    e: React.DragEvent,
    columnId: string,
    itemId: string,
    position: "before" | "after"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverColumn(columnId);
    setDragOverPosition({ itemId, position });
  };

  const handleDrop = async (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    const currentDragOverPosition = dragOverPosition;
    setDragOverPosition(null);

    if (!draggedItem) return;

    try {
      const sourceColumnId = draggedItem.column_id;
      const sourceColumnItems = itemsByColumn[sourceColumnId] || [];
      const targetColumnItems = itemsByColumn[targetColumnId] || [];

      if (sourceColumnId === targetColumnId) {
        await handleSameColumnReorder(sourceColumnItems, currentDragOverPosition);
      } else {
        await handleCrossColumnMove(targetColumnItems, targetColumnId, currentDragOverPosition);
      }
    } catch (error) {
      console.error("Error moving item:", error);
      alert("Failed to move item");
    }

    setDraggedItem(null);
  };

  const handleSameColumnReorder = async (
    sourceColumnItems: RoadmapItemWithRelations[],
    currentDragOverPosition: DragOverPosition | null
  ) => {
    if (!currentDragOverPosition || !draggedItem) {
      return;
    }

    const draggedIndex = sourceColumnItems.findIndex(item => item.id === draggedItem.id);
    const targetIndex = sourceColumnItems.findIndex(item => item.id === currentDragOverPosition.itemId);

    if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) {
      return;
    }

    const reorderedItems = [...sourceColumnItems];
    const [draggedItemData] = reorderedItems.splice(draggedIndex, 1);

    let insertIndex = targetIndex;
    if (currentDragOverPosition.position === "after") {
      insertIndex = targetIndex + 1;
    }
    if (draggedIndex < targetIndex && currentDragOverPosition.position === "before") {
      insertIndex = targetIndex - 1;
    }
    if (draggedIndex < targetIndex && currentDragOverPosition.position === "after") {
      insertIndex = targetIndex;
    }

    reorderedItems.splice(insertIndex, 0, draggedItemData);

    setBoardItems(prev => {
      return prev.map(item => {
        const updatedIndex = reorderedItems.findIndex(reorderedItem => reorderedItem.id === item.id);
        if (updatedIndex !== -1) {
          return { ...item, position: updatedIndex + 1 };
        }
        return item;
      });
    });

    const tempUpdates = reorderedItems.map((item, index) =>
      supabase
        .from("roadmap_items")
        .update({ position: 1000 + index })
        .eq("id", item.id)
    );
    await Promise.all(tempUpdates);

    const finalUpdates = reorderedItems.map((item, index) =>
      supabase
        .from("roadmap_items")
        .update({ position: index + 1 })
        .eq("id", item.id)
    );
    await Promise.all(finalUpdates);
  };

  const handleCrossColumnMove = async (
    targetColumnItems: RoadmapItemWithRelations[],
    targetColumnId: string,
    currentDragOverPosition: DragOverPosition | null
  ) => {
    if (!draggedItem) return;

    let newPosition = 1;

    if (!currentDragOverPosition) {
      newPosition = targetColumnItems.length > 0 
        ? Math.max(...targetColumnItems.map(item => item.position || 0)) + 1 
        : 1;
    } else {
      const targetItem = targetColumnItems.find(item => item.id === currentDragOverPosition.itemId);
      if (targetItem) {
        if (currentDragOverPosition.position === "before") {
          newPosition = targetItem.position;
          const itemsToShift = targetColumnItems.filter(item => item.position >= targetItem.position);
          if (itemsToShift.length > 0) {
            // Sort items in descending position order to avoid uniqueness conflicts
            const sortedItems = itemsToShift.sort((a, b) => (b.position || 0) - (a.position || 0));
            for (const item of sortedItems) {
              await supabase
                .from("roadmap_items")
                .update({ position: item.position + 1 })
                .eq("id", item.id);
            }
          }
        } else {
          newPosition = targetItem.position + 1;
          const itemsToShift = targetColumnItems.filter(item => item.position > targetItem.position);
          if (itemsToShift.length > 0) {
            // Sort items in descending position order to avoid uniqueness conflicts
            const sortedItems = itemsToShift.sort((a, b) => (b.position || 0) - (a.position || 0));
            for (const item of sortedItems) {
              await supabase
                .from("roadmap_items")
                .update({ position: item.position + 1 })
                .eq("id", item.id);
            }
          }
        }
      } else {
        newPosition = targetColumnItems.length + 1;
      }
    }

    const { error } = await supabase
      .from("roadmap_items")
      .update({
        column_id: targetColumnId,
        position: newPosition,
      })
      .eq("id", draggedItem.id);

    if (error) throw error;

    setBoardItems(prev =>
      prev.map(item => {
        if (item.id === draggedItem.id) {
          return {
            ...item,
            column_id: targetColumnId,
            position: newPosition,
          };
        }
        if (item.column_id === targetColumnId && currentDragOverPosition) {
          const targetItem = targetColumnItems.find(ti => ti.id === currentDragOverPosition.itemId);
          if (targetItem) {
            if (currentDragOverPosition.position === "before" && item.position >= targetItem.position) {
              return { ...item, position: item.position + 1 };
            }
            if (currentDragOverPosition.position === "after" && item.position > targetItem.position) {
              return { ...item, position: item.position + 1 };
            }
          }
        }
        return item;
      })
    );
  };

  return {
    draggedItem,
    dragOverColumn,
    dragOverPosition,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleItemDragOver,
    handleDrop,
  };
}