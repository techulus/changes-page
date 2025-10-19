import { IRoadmapTriageItem } from "@changes-page/supabase/types/page";
import { TrashIcon } from "@heroicons/react/outline";
import { useState } from "react";

type TriageItemForAdmin = Omit<IRoadmapTriageItem, "visitor_id">;

interface TriageItemCardProps {
  item: TriageItemForAdmin;
  onMoveToBoard: (itemId: string) => Promise<void>;
  onDelete: (itemId: string) => Promise<void>;
}

function getTimeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);

  if (isNaN(past.getTime())) {
    return "";
  }

  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return past.toLocaleDateString();
}

export default function TriageItemCard({
  item,
  onMoveToBoard,
  onDelete,
}: TriageItemCardProps) {
  const [isMoving, setIsMoving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleMove = async () => {
    setIsMoving(true);
    try {
      await onMoveToBoard(item.id);
    } catch (error) {
      console.error("Failed to move item:", error);
      alert("Failed to move item to board. Please try again.");
    } finally {
      setIsMoving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this submission?")) return;

    setIsDeleting(true);
    try {
      await onDelete(item.id);
    } catch (error) {
      console.error("Failed to delete item:", error);
      alert("Failed to delete item. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col h-full">
        <div className="flex-1 mb-3">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
            {item.title}
          </h4>
          {item.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
              {item.description}
            </p>
          )}
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {getTimeAgo(item.created_at)}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleMove}
            disabled={isMoving || isDeleting}
            className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMoving ? "Moving..." : "Move to Board"}
          </button>
          <button
            onClick={handleDelete}
            disabled={isMoving || isDeleting}
            className="px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
