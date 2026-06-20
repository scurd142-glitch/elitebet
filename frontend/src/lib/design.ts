export const ACCENT_COLORS = [
  "red",
  "green",
  "blue",
  "orange",
  "yellow",
  "pink",
] as const;

export type AccentColor = (typeof ACCENT_COLORS)[number];

export const STAT_CARD_CLASS: Record<AccentColor, string> = {
  red: "stat-card stat-card-red",
  green: "stat-card stat-card-green",
  blue: "stat-card stat-card-blue",
  orange: "stat-card stat-card-orange",
  yellow: "stat-card stat-card-yellow",
  pink: "stat-card stat-card-pink",
};

export const NAV_ACCENT_CLASS: Record<AccentColor | "violet", string> = {
  violet: "nav-accent-violet",
  red: "nav-accent-red",
  green: "nav-accent-green",
  blue: "nav-accent-blue",
  orange: "nav-accent-orange",
  yellow: "nav-accent-yellow",
  pink: "nav-accent-pink",
};

export const FEATURE_CARD_CLASS: Record<AccentColor, string> = {
  red: "feature-card-red",
  green: "feature-card-green",
  blue: "feature-card-blue",
  orange: "feature-card-orange",
  yellow: "feature-card-yellow",
  pink: "feature-card-pink",
};

export const ICON_COLOR_CLASS: Record<AccentColor | "violet", string> = {
  violet: "text-accent-violet",
  red: "text-accent-red",
  green: "text-accent-green",
  blue: "text-accent-blue",
  orange: "text-accent-orange",
  yellow: "text-accent-yellow",
  pink: "text-accent-pink",
};
