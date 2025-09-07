import {
  IRoadmapBoard,
  IRoadmapCategory,
  IRoadmapColumn,
} from "@changes-page/supabase/types/page";
import { useMemo, useState } from "react";
import RoadmapColumn from "./RoadmapColumn";
import RoadmapItemModal from "./RoadmapItemModal";
import { useRoadmapDragDrop } from "./hooks/useRoadmapDragDrop";
import { useRoadmapItems } from "./hooks/useRoadmapItems";
import { ItemsByColumn, RoadmapItemWithRelations } from "./types";

export default function RoadmapBoard({
  board,
  columns,
  items,
  categories,
}: {
  board: IRoadmapBoard;
  columns: IRoadmapColumn[];
  items: RoadmapItemWithRelations[];
  categories: IRoadmapCategory[];
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
  });

  const itemHandlers = useRoadmapItems({
    board,
    categories,
    itemsByColumn,
  });

  return (
    <>
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex justify-center">
          <div
            className="flex space-x-6 pb-6 h-full"
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
