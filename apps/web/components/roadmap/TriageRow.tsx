import { IRoadmapTriageItem } from "@changes-page/supabase/types/page";
import { useState } from "react";
import { httpPost } from "../../utils/http";
import TriageItemCard from "./TriageItemCard";
import { RoadmapItemWithRelations } from "./types";

type TriageItemForAdmin = Omit<IRoadmapTriageItem, "visitor_id">;

interface TriageRowProps {
  triageItems: TriageItemForAdmin[];
  onItemMoved: (newItem: RoadmapItemWithRelations) => void;
  onItemDeleted?: () => void;
}

export default function TriageRow({
  triageItems,
  onItemMoved,
  onItemDeleted,
}: TriageRowProps) {
  const [localTriageItems, setLocalTriageItems] = useState(triageItems);

  const handleMoveToBoard = async (triageItemId: string) => {
    try {
      const response = await httpPost({
        url: "/api/roadmap/triage/move-to-board",
        data: { triage_item_id: triageItemId },
      });

      if (response.success && response.item) {
        setLocalTriageItems((prev) => prev.filter((item) => item.id !== triageItemId));
        onItemMoved(response.item);
      }
    } catch (error) {
      console.error("Error moving triage item:", error);
      alert("Failed to move item to board");
    }
  };

  const handleDelete = async (triageItemId: string) => {
    try {
      const response = await httpPost({
        url: "/api/roadmap/triage/delete",
        data: { triage_item_id: triageItemId },
      });

      if (response.success) {
        setLocalTriageItems((prev) => prev.filter((item) => item.id !== triageItemId));
        onItemDeleted?.();
      }
    } catch (error) {
      console.error("Error deleting triage item:", error);
      alert("Failed to delete item");
    }
  };

  if (localTriageItems.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 px-4 md:px-0">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Triage
              <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                {localTriageItems.length}
              </span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              User-submitted ideas waiting for review
            </p>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {localTriageItems.map((item) => (
              <TriageItemCard
                key={item.id}
                item={item}
                onMoveToBoard={handleMoveToBoard}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
