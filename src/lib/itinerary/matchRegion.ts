/**
 * Both the AI-generated itinerary's `region` field and Sanity's `tour.regions[]`
 * are free-text strings with no shared taxonomy, so matching is done via a small
 * alias table + substring matching rather than exact equality.
 */
export type RegionGroup = {
  key: string;
  /** Set only for the known accommodation-affiliate cities. */
  accommodationLabel?: string;
  /** Set only for the regions our own tours are matched against. */
  tourRegionLabel?: string;
  aliases: string[];
};

export const REGION_GROUPS: RegionGroup[] = [
  { key: "tbilisi", accommodationLabel: "Tbilisi", aliases: ["tbilisi"] },
  {
    key: "kazbegi",
    accommodationLabel: "Stepantsminda / Kazbegi",
    tourRegionLabel: "Kazbegi",
    aliases: ["kazbegi", "stepantsminda", "gudauri"],
  },
  {
    key: "mestia",
    accommodationLabel: "Mestia",
    tourRegionLabel: "Svaneti",
    aliases: ["mestia", "svaneti", "ushguli"],
  },
  {
    key: "sighnaghi",
    accommodationLabel: "Sighnaghi",
    tourRegionLabel: "Kakheti",
    aliases: ["sighnaghi", "signagi", "kakheti", "telavi", "kvareli"],
  },
  { key: "batumi", accommodationLabel: "Batumi", aliases: ["batumi", "adjara"] },
  { key: "kutaisi", accommodationLabel: "Kutaisi", aliases: ["kutaisi", "imereti"] },
  {
    key: "mtskheta-gori",
    tourRegionLabel: "Mtskheta / Gori",
    aliases: ["mtskheta", "gori", "uplistsikhe", "jvari"],
  },
];

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

export function regionTextMatchesGroup(regionText: string, group: RegionGroup): boolean {
  const normalized = normalize(regionText);
  if (!normalized) return false;
  return group.aliases.some((alias) => normalized.includes(alias));
}

/** Finds the known region group (if any) that a free-text region string belongs to. */
export function findRegionGroup(regionText: string): RegionGroup | null {
  const normalized = normalize(regionText);
  if (!normalized) return null;
  return REGION_GROUPS.find((group) => group.aliases.some((alias) => normalized.includes(alias))) ?? null;
}
