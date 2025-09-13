import { getCategoryColorClasses } from "@changes-page/utils";
import { PencilIcon, TrashIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import type React from "react";
import { RoadmapItemWithRelations } from "./types";

interface RoadmapItemProps {
  item: RoadmapItemWithRelations;
  onEdit: (item: RoadmapItemWithRelations) => void;
  onDelete: (itemId: string) => void;
  onDragStart: (e: React.DragEvent, item: RoadmapItemWithRelations) => void;
  onDragEnd: (e: React.DragEvent) => void;
  isDragged: boolean;
}

export default function RoadmapItem({
  item,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  isDragged,
}: RoadmapItemProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item)}
      onDragEnd={onDragEnd}
      className={classNames(
        "bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group mb-2 cursor-move",
        isDragged ? "opacity-50" : ""
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1 cursor-pointer">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 flex-1">
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
        </div>
        <div className="flex space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            title="Edit item"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            title="Delete item"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
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
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-md px-2 py-1 hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
          <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
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
  );
}
