export const CATEGORY_COLORS: Record<string, string> = {
  Housing: "#4edea3",
  "Food & Dining": "#F97316",
  Transport: "#3B82F6",
  Entertainment: "#8B5CF6",
  Shopping: "#EC4899",
  Health: "#EF4444",
  Education: "#F59E0B",
  Salary: "#10B981",
  Freelance: "#06B6D4",
  Utilities: "#6B7280",
  Investment: "#84CC16",
  Other: "#9CA3AF",
};

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || "#9CA3AF";
}
