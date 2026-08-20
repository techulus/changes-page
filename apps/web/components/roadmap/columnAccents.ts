import {
  getCategoryColorClasses,
  ROADMAP_COLORS,
  RoadmapColor,
} from "@changespage/utils";

// Columns carry no color of their own in the database, so one is picked from the
// same palette the category chips use, keyed off the column's index so it stays
// stable across renders and reloads.
const COLUMN_COLOR_ORDER: RoadmapColor[] = [
  "blue",
  "purple",
  "orange",
  "emerald",
  "pink",
  "cyan",
  "indigo",
  "yellow",
];

export function getColumnAccent(index: number) {
  const color = COLUMN_COLOR_ORDER[index % COLUMN_COLOR_ORDER.length];

  return {
    chip: getCategoryColorClasses(color),
    dot: ROADMAP_COLORS[color].preview,
  };
}
