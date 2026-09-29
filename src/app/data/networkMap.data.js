import warehouses from "@/app/data/warehouse.data.json";

/**
 * Configuration and derived figures for the homepage NetworkMap section.
 *
 * Every number rendered by the section is computed here from
 * `warehouse.data.json` rather than typed in, so the section cannot advertise a
 * figure the data does not support. The previous values were 1000 delivery
 * points, 7500 delivery personnel, 495 upazilas and 330 municipalities; none of
 * those had a source anywhere in the codebase.
 */

/**
 * Country outline only. The dots used to come from a second file of upazila
 * polygons (bgd-adm3.geojson) that was never committed to /public, so both
 * fetches 404'd and the section rendered a permanent "Map unavailable right
 * now." The dots are now the real branch coordinates from warehouse.data.json,
 * which is both available and actually true.
 * Source: geoBoundaries gbOpen (commit 9469f09), CC BY 4.0.
 */
export const OUTLINE_URL = "/data/bgd-adm0.geojson";

/**
 * viewBox, sized for a half-width column beside the figures. Bangladesh is a
 * portrait country, so the map wants a portrait-ish frame: at 900x620 (tried for
 * a full-bleed band) the country only filled 48% of the width and shrank to a
 * stub once the card went back to two columns. 560x620 fills ~79% of the width
 * and 100% of the height.
 */
export const MAP_WIDTH = 560;
export const MAP_HEIGHT = 620;
export const MAP_PADDING = 24;

/**
 * Brand tokens rather than hex, so this section cannot drift from the rest of
 * the site. The previous hardcoded hexes were missed by the token migration.
 */
export const MAP_COLORS = {
  branch: "var(--color-brand-accent-bright)",
  routeGlow: "var(--color-brand-accent-lime)",
  hub: "var(--color-brand-accent-amber)",
};

/**
 * Marker sizes, expressed relative to the viewBox width rather than in absolute
 * units. Widening the viewBox from 520 to 900 without scaling these would have
 * shrunk every branch dot from ~2.6 rendered px to ~2, so they track MAP_WIDTH.
 * The ratios are the original hand-tuned values at 520 wide.
 */
const RATIO = MAP_WIDTH / 520;

export const SIZES = {
  branch: 2.6 * RATIO,
  hub: 7 * RATIO,
  hubMain: 9 * RATIO,
  hubDot: 3 * RATIO,
  hubDotMain: 3.6 * RATIO,
  outlineStroke: 0.8 * RATIO,
  routeStroke: 1 * RATIO,
  routeGlowStroke: 2 * RATIO,
  hubStroke: 1.5 * RATIO,
};

/**
 * Divisional hub coordinates, keyed by the `region` value used in
 * warehouse.data.json. Labels are corrected to the standard English spellings
 * the data itself gets wrong in places ("Barisal" -> "Barishal").
 */
const HUB_COORDS = {
  Dhaka: [90.4125, 23.8103],
  Chattogram: [91.7832, 22.3569],
  Khulna: [89.5403, 22.8456],
  Rajshahi: [88.6042, 24.3745],
  Sylhet: [91.8687, 24.8949],
  Barisal: [90.3535, 22.701],
  Rangpur: [89.2752, 25.7439],
  Mymensingh: [90.4203, 24.7471],
};

const DISPLAY_NAMES = { Barisal: "Barishal" };

export const HUBS = Object.entries(HUB_COORDS).map(([name, coord]) => ({
  name: DISPLAY_NAMES[name] || name,
  coord,
  main: name === "Dhaka",
}));

/** Branches that have usable coordinates, i.e. the ones we can actually plot. */
export const BRANCHES = warehouses.filter(
  (warehouse) => warehouse.latitude && warehouse.longitude
);

/** [lon, lat] pairs, used to refit the projection if the outline is unusable. */
export const BRANCH_COORDINATES = BRANCHES.map((warehouse) => [
  warehouse.longitude,
  warehouse.latitude,
]);

export const ACTIVE_BRANCHES = warehouses.filter(
  (warehouse) => warehouse.status === "active"
).length;

const COVERED_AREAS = warehouses.reduce(
  (total, warehouse) => total + (warehouse.covered_area?.length || 0),
  0
);

const DIVISIONS = new Set(warehouses.map((warehouse) => warehouse.region)).size;
const DISTRICTS = new Set(warehouses.map((warehouse) => warehouse.district)).size;

export const STATS = [
  { value: BRANCHES.length, label: "branches" },
  { value: COVERED_AREAS, label: "service areas" },
  { value: DIVISIONS, label: "divisions" },
  { value: DISTRICTS, label: "districts" },
];
