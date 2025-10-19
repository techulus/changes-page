import {
  IRoadmapBoard,
  IRoadmapCategory,
  IRoadmapColumn,
  IRoadmapTriageItem,
} from "@changes-page/supabase/types/page";
import { useMemo, useState } from "react";
import RoadmapColumn from "./RoadmapColumn";
import RoadmapItemModal from "./RoadmapItemModal";
import TriageRow from "./TriageRow";
import { useRoadmapDragDrop } from "./hooks/useRoadmapDragDrop";
import { useRoadmapItems } from "./hooks/useRoadmapItems";
import { ItemsByColumn, RoadmapItemWithRelations } from "./types";

type TriageItemForAdmin = Omit<IRoadmapTriageItem, "visitor_id">;

export default function RoadmapBoard({
  board,
  columns,
  items,
  categories,
  triageItems = [],
}: {
  board: IRoadmapBoard;
  columns: IRoadmapColumn[];
  items: RoadmapItemWithRelations[];
  categories: IRoadmapCategory[];
  triageItems?: TriageItemForAdmin[];
}) {
  const [boardItems, setBoardItems] = useState(items);

  const itemsByColumn: ItemsByColumn = useMemo(() => {
    const organized: ItemsByColumn = {};
    columns.forEach((column) => {
      organized[column.id] = boardItems
        .filter((item) => item.column_id === column.id)
        .sort((a, b) => (a.position || 0) - (b.position || 0));
    });
    return organized;
  }, [columns, boardItems]);

  const dragDropHandlers = useRoadmapDragDrop({
    itemsByColumn,
    setBoardItems,
    board,
  });

  const itemHandlers = useRoadmapItems({
    board,
    categories,
    itemsByColumn,
  });

  const handleTriageItemMoved = (newItem: RoadmapItemWithRelations) => {
    setBoardItems((prev) => {
      const itemsWithoutDuplicate = prev.filter((item) => item.id !== newItem.id);

      const itemsInTargetColumn = itemsWithoutDuplicate.filter(
        (item) => item.column_id === newItem.column_id
      );

      const hasPositionConflict = itemsInTargetColumn.some(
        (item) => item.position === newItem.position
      );

      if (hasPositionConflict) {
        const adjustedItems = itemsWithoutDuplicate.map((item) => {
          if (item.column_id === newItem.column_id && item.position >= newItem.position) {
            return { ...item, position: item.position + 1 };
          }
          return item;
        });
        return [...adjustedItems, newItem];
      }

      return [...itemsWithoutDuplicate, newItem];
    });
  };

  const handleTriageItemDeleted = () => {
  };

  return (
    <>
      {triageItems.length > 0 && (
        <TriageRow
          triageItems={triageItems}
          onItemMoved={handleTriageItemMoved}
          onItemDeleted={handleTriageItemDeleted}
        />
      )}

      <div className="overflow-x-auto snap-x snap-mandatory md:overflow-x-auto h-full">
        <div className="flex md:justify-center h-full">
          <div
            className="flex space-x-4 md:space-x-6 pb-6 px-4 md:px-0 h-full"
            style={{ minHeight: "calc(100vh - 300px)" }}
          >
            {columns.map((column) => (
              <RoadmapColumn
                key={column.id}
                column={column}
                items={itemsByColumn[column.id] || []}
                onAddItem={itemHandlers.handleAddItem}
                onEditItem={itemHandlers.handleEditItem}
                onDeleteItem={(itemId) =>
                  itemHandlers.handleDeleteItem(itemId, setBoardItems)
                }
                onDragStart={dragDropHandlers.handleDragStart}
                onDragEnd={dragDropHandlers.handleDragEnd}
                onDragOver={dragDropHandlers.handleDragOver}
                onDragEnter={dragDropHandlers.handleDragEnter}
                onDragLeave={dragDropHandlers.handleDragLeave}
                onDrop={dragDropHandlers.handleDrop}
                onItemDragOver={dragDropHandlers.handleItemDragOver}
                draggedItem={dragDropHandlers.draggedItem}
                dragOverColumn={dragDropHandlers.dragOverColumn}
                dragOverPosition={dragDropHandlers.dragOverPosition}
              />
            ))}
          </div>
        </div>
      </div>

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

      <RoadmapItemModal
        isOpen={itemHandlers.showItemModal}
        onClose={itemHandlers.closeModal}
        onSubmit={(e) => itemHandlers.handleSubmitItem(e, setBoardItems)}
        itemForm={itemHandlers.itemForm}
        setItemForm={itemHandlers.setItemForm}
        formErrors={itemHandlers.formErrors}
        isSubmitting={itemHandlers.isSubmitting}
        editingItem={itemHandlers.editingItem}
        categories={categories}
        board={board}
      />
    </>
  );
}
