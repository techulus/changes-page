import { IRoadmapColumn } from "@changespage/supabase/types/page";
import { PlusIcon } from "@heroicons/react/solid";
import RoadmapItem from "./RoadmapItem";
import { DragOverPosition, RoadmapItemWithRelations } from "./types";

interface RoadmapColumnProps {
  column: IRoadmapColumn;
  items: RoadmapItemWithRelations[];
  onAddItem: (columnId: string) => void;
  onEditItem: (item: RoadmapItemWithRelations) => void;
  onDeleteItem: (itemId: string) => void;
  onDragStart: (e: React.DragEvent, item: RoadmapItemWithRelations) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnter: (e: React.DragEvent, columnId: string) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onItemDragOver: (
    e: React.DragEvent,
    columnId: string,
    itemId: string,
    position: "before" | "after"
  ) => void;
  draggedItem: RoadmapItemWithRelations | null;
  dragOverColumn: string | null;
  dragOverPosition: DragOverPosition | null;
}

export default function RoadmapColumn({
  column,
  items,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  onItemDragOver,
  draggedItem,
  dragOverColumn,
  dragOverPosition,
}: RoadmapColumnProps) {
  return (
    <div
      className={`flex-shrink-0 snap-center w-[calc(100vw-3rem)] md:w-80 flex flex-col transition-colors ${
        dragOverColumn === column.id
          ? "bg-indigo-50 dark:bg-indigo-900/20 rounded-lg"
          : ""
      }`}
      onDragOver={onDragOver}
      onDragEnter={(e) => onDragEnter(e, column.id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, column.id)}
    >
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
            {items.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {items.map((item, itemIndex) => (
          <div key={item.id}>
            <div
              onDragOver={(e) =>
                onItemDragOver(e, column.id, item.id, "before")
              }
              onDrop={(e) => onDrop(e, column.id)}
              className={`h-1 transition-colors ${
                dragOverPosition?.itemId === item.id &&
                dragOverPosition?.position === "before"
                  ? "bg-indigo-400 dark:bg-indigo-600 rounded"
                  : ""
              }`}
            />

            <RoadmapItem
              item={item}
              onEdit={onEditItem}
              onDelete={onDeleteItem}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              isDragged={draggedItem?.id === item.id}
            />

            {itemIndex === items.length - 1 && (
              <div
                onDragOver={(e) =>
                  onItemDragOver(e, column.id, item.id, "after")
                }
                onDrop={(e) => onDrop(e, column.id)}
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

        {items.length > 0 && (
          <div
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, column.id)}
            className={`h-1 transition-colors ${
              dragOverColumn === column.id && !dragOverPosition
                ? "bg-indigo-400 dark:bg-indigo-600 rounded"
                : ""
            }`}
          />
        )}

        <button
          type="button"
          onClick={() => onAddItem(column.id)}
          className="mt-3 w-full flex items-center justify-center px-3 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          <PlusIcon className="mr-1 h-4 w-4" />
          Add item
        </button>
      </div>
    </div>
  );
}
