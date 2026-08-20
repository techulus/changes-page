import { IRoadmapColumn } from "@changespage/supabase/types/page";
import { PlusIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import RoadmapItem from "./RoadmapItem";
import { getColumnAccent } from "./columnAccents";
import { DragOverPosition, RoadmapItemWithRelations } from "./types";

interface RoadmapColumnProps {
  column: IRoadmapColumn;
  index: number;
  collapsed: boolean;
  onExpand: (columnId: string) => void;
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
  index,
  collapsed,
  onExpand,
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
  const accent = getColumnAccent(index);
  const isDropTarget = dragOverColumn === column.id;

  const dragHandlers = {
    onDragOver,
    onDragEnter: (e: React.DragEvent) => onDragEnter(e, column.id),
    onDragLeave,
    onDrop: (e: React.DragEvent) => onDrop(e, column.id),
  };

  return (
    // Both the pill and the full column stay mounted so opening and closing can
    // animate as a max-width change. Below md the board stays a swipeable
    // carousel, so every column renders at full width with the pill hidden.
    <div
      className={classNames(
        "flex-shrink-0 snap-center flex w-[calc(100vw-3rem)] transition-[max-width] duration-300 ease-in-out",
        "md:w-auto md:flex-1 md:min-w-0 md:overflow-hidden",
        collapsed ? "md:max-w-[2.25rem]" : "md:max-w-[26rem]"
      )}
    >
      <div
        className={classNames(
          "hidden md:flex flex-col items-center flex-shrink-0 overflow-hidden pt-9 transition-[width,opacity] duration-300 ease-in-out",
          collapsed ? "md:w-9 opacity-100" : "md:w-0 opacity-0 pointer-events-none"
        )}
      >
        <button
          type="button"
          onClick={() => onExpand(column.id)}
          title={`${column.name} (${items.length})`}
          {...dragHandlers}
          className={classNames(
            "w-9 flex-shrink-0 min-h-[8rem] rounded-full border flex flex-col items-center gap-2 pt-2 pb-3 transition-colors",
            accent.chip,
            isDropTarget
              ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
              : "hover:opacity-80"
          )}
        >
          <span className="text-xs font-medium">{items.length}</span>
          <span className="text-xs font-medium [writing-mode:vertical-rl] whitespace-nowrap">
            {column.name}
          </span>
        </button>
        <div className="w-px flex-1 bg-gradient-to-b from-gray-200 to-transparent dark:from-gray-700" />
      </div>

      <div
        className={classNames(
          "flex flex-col w-full transition-[width,opacity] duration-300 ease-in-out md:min-w-[16rem]",
          collapsed
            ? "md:w-0 md:opacity-0 md:pointer-events-none"
            : "md:w-full md:opacity-100"
        )}
        {...dragHandlers}
      >
        <div className="mb-4 flex items-center justify-center gap-2">
          <span
            className={classNames("h-2 w-2 rounded-full flex-shrink-0", accent.dot)}
          />
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {column.name}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
            {items.length}
          </span>
        </div>

        <div
          className={classNames(
            "flex-1 overflow-y-auto rounded-lg px-2 transition-colors",
            isDropTarget ? "bg-indigo-50 dark:bg-indigo-900/20" : ""
          )}
        >
          {items.map((item, itemIndex) => (
            <div key={item.id}>
              <div
                onDragOver={(e) =>
                  onItemDragOver(e, column.id, item.id, "before")
                }
                onDrop={(e) => onDrop(e, column.id)}
                className={classNames(
                  "h-1 transition-colors",
                  dragOverPosition?.itemId === item.id &&
                    dragOverPosition?.position === "before"
                    ? "bg-indigo-400 dark:bg-indigo-600 rounded"
                    : ""
                )}
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
                  className={classNames(
                    "h-1 transition-colors",
                    dragOverPosition?.itemId === item.id &&
                      dragOverPosition?.position === "after"
                      ? "bg-indigo-400 dark:bg-indigo-600 rounded"
                      : ""
                  )}
                />
              )}
            </div>
          ))}

          {items.length > 0 && (
            <div
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, column.id)}
              className={classNames(
                "h-1 transition-colors",
                isDropTarget && !dragOverPosition
                  ? "bg-indigo-400 dark:bg-indigo-600 rounded"
                  : ""
              )}
            />
          )}

          {items.length === 0 && (
            <div
              className={classNames(
                "flex items-center justify-center rounded-md border-2 border-dashed py-8 text-sm transition-colors",
                isDropTarget
                  ? "border-indigo-400 text-indigo-600 dark:border-indigo-600 dark:text-indigo-400"
                  : "border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400"
              )}
            >
              No items in this stage yet
            </div>
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
    </div>
  );
}
