export const ROADMAP_COLORS = {
  blue: {
    name: 'Blue',
    light: 'bg-blue-100 text-blue-800 border-blue-200',
    dark: 'dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800',
    preview: 'bg-blue-500',
  },
  indigo: {
    name: 'Indigo',
    light: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    dark: 'dark:bg-indigo-900 dark:text-indigo-200 dark:border-indigo-800',
    preview: 'bg-indigo-500',
  },
  purple: {
    name: 'Purple',
    light: 'bg-purple-100 text-purple-800 border-purple-200',
    dark: 'dark:bg-purple-900 dark:text-purple-200 dark:border-purple-800',
    preview: 'bg-purple-500',
  },
  pink: {
    name: 'Pink',
    light: 'bg-pink-100 text-pink-800 border-pink-200',
    dark: 'dark:bg-pink-900 dark:text-pink-200 dark:border-pink-800',
    preview: 'bg-pink-500',
  },
  red: {
    name: 'Red',
    light: 'bg-red-100 text-red-800 border-red-200',
    dark: 'dark:bg-red-900 dark:text-red-200 dark:border-red-800',
    preview: 'bg-red-500',
  },
  orange: {
    name: 'Orange',
    light: 'bg-orange-100 text-orange-800 border-orange-200',
    dark: 'dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800',
    preview: 'bg-orange-500',
  },
  yellow: {
    name: 'Yellow',
    light: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    dark: 'dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800',
    preview: 'bg-yellow-500',
  },
  green: {
    name: 'Green',
    light: 'bg-green-100 text-green-800 border-green-200',
    dark: 'dark:bg-green-900 dark:text-green-200 dark:border-green-800',
    preview: 'bg-green-500',
  },
  emerald: {
    name: 'Emerald',
    light: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dark: 'dark:bg-emerald-900 dark:text-emerald-200 dark:border-emerald-800',
    preview: 'bg-emerald-500',
  },
  cyan: {
    name: 'Cyan',
    light: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    dark: 'dark:bg-cyan-900 dark:text-cyan-200 dark:border-cyan-800',
    preview: 'bg-cyan-500',
  },
} as const;

export type RoadmapColor = keyof typeof ROADMAP_COLORS;

export function getCategoryColorClasses(color: string = 'blue') {
  const colorKey = color as RoadmapColor;
  const colorConfig = ROADMAP_COLORS[colorKey] || ROADMAP_COLORS.blue;
  return `${colorConfig.light} ${colorConfig.dark}`;
}

export function getCategoryColorOptions() {
  return Object.entries(ROADMAP_COLORS).map(([key, value]) => ({
    value: key,
    label: value.name,
    preview: value.preview,
  }));
}