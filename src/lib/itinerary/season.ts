const SEASON_BY_MONTH = [
  "Winter",
  "Winter",
  "Spring",
  "Spring",
  "Spring",
  "Summer",
  "Summer",
  "Summer",
  "Autumn",
  "Autumn",
  "Autumn",
  "Winter",
] as const;

/**
 * Reduces an exact travel date down to a season + month label (e.g. "Spring (April)")
 * so public gallery pages never surface a real user's specific travel dates.
 */
export function deriveSeasonLabel(isoDateTime?: string): string | null {
  if (!isoDateTime) return null;

  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return null;

  const month = date.getUTCMonth();
  const monthName = date.toLocaleString("en-US", { month: "long", timeZone: "UTC" });

  return `${SEASON_BY_MONTH[month]} (${monthName})`;
}
