import {
  IRoadmapCategory,
  IRoadmapItem,
  IRoadmapVote,
} from "@changespage/supabase/types/page";

export interface RoadmapItemWithRelations extends IRoadmapItem {
  roadmap_categories?: Pick<IRoadmapCategory, "id" | "name" | "color">;
  roadmap_votes?: Pick<IRoadmapVote, "id">[];
}

export interface ItemsByColumn {
  [columnId: string]: RoadmapItemWithRelations[];
}

export interface ItemForm {
  title: string;
  description: string;
  category_id: string;
}

export interface DragOverPosition {
  itemId: string;
  position: "before" | "after";
}

export interface FormErrors {
  [key: string]: string;
}
