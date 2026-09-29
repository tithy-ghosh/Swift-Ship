import { geoArea, geoMercator, geoPath } from "d3-geo";

/** Area of a hemisphere in steradians. Anything larger is "more than half the planet". */
const HEMISPHERE = 2 * Math.PI;

/**
 * Repairs ring winding so d3-geo reads a shape as the shape, not its complement.
 *
 * WHY THIS EXISTS — this is the bug that made the homepage map look empty while
 * rendering without a single console error.
 *
 * The geoBoundaries ADM0 file for Bangladesh winds its exterior rings clockwise.
 * d3-geo follows the spherical convention that exterior rings wind
 * counter-clockwise, so it interpreted every ring as "the entire planet MINUS
 * Bangladesh". Measured on the shipped file:
 *
 *   geoArea()    201.058 sr   (the real country is 0.003463 sr = 147,570 km2)
 *   geoBounds()  [-180, -90, 180, 90]   (the whole globe)
 *
 * `fitExtent` dutifully scaled the globe to the viewBox, which shrank the actual
 * country by ~64x. Bangladesh drew as a 2px speck and all 64 branch dots
 * collapsed into a 1.5 x 2.8 unit area of a 520 x 600 viewBox. The section was
 * there, the DOM was complete, the fetch had succeeded — it was just scaled to
 * nothing.
 *
 * Recursion handles the whole GeoJSON container chain (FeatureCollection ->
 * Feature -> geometry) so callers can hand this a whole file and forget.
 *
 * @param {object} geojson Any GeoJSON object, or a geometry.
 * @returns {object} The same shape, with ring order reversed where needed.
 */
export function normalizeWinding(geojson) {
  if (geojson?.type === "FeatureCollection") {
    return {
      ...geojson,
      features: geojson.features.map((feature) => ({
        ...feature,
        geometry: normalizeWinding(feature.geometry),
      })),
    };
  }

  if (geojson?.type === "Feature") {
    return { ...geojson, geometry: normalizeWinding(geojson.geometry) };
  }

  // No coordinates, or already correctly wound — leave it alone.
  if (!geojson?.coordinates || geoArea(geojson) <= HEMISPHERE) return geojson;

  const polygons =
    geojson.type === "MultiPolygon" ? geojson.coordinates : [geojson.coordinates];

  return {
    ...geojson,
    coordinates: polygons.map((polygon) =>
      polygon.map((ring) => ring.slice().reverse())
    ),
  };
}

/**
 * Fits a Mercator projection to an outline, with a fallback that cannot fail the
 * same way.
 *
 * A malformed or badly wound outline still produces a projection — just a
 * useless one, and nothing throws. So we check the result: if the country does
 * not fill a sensible share of the viewBox, we refit against `fallbackPoints`
 * instead. A point cloud has no winding order to get wrong, so this path always
 * yields a usable scale.
 *
 * @param {object}   options
 * @param {object}   options.outline        GeoJSON to draw.
 * @param {number}   options.width          viewBox width.
 * @param {number}   options.height         viewBox height.
 * @param {number}   options.padding        Inset from the viewBox edge.
 * @param {Array<[number, number]>} [options.fallbackPoints] [lon, lat] pairs.
 * @returns {{ projection: Function, outlinePath: string, refit: boolean }}
 */
export function projectOutline({
  outline,
  width,
  height,
  padding,
  fallbackPoints = [],
}) {
  const fitBox = [
    [padding, padding],
    [width - padding, height - padding],
  ];

  const path = geoPath();
  let projection = geoMercator().fitExtent(fitBox, outline);
  path.projection(projection);

  const [[x0, y0], [x1, y1]] = path.bounds(outline);
  const collapsed = x1 - x0 < width * 0.25 || y1 - y0 < height * 0.25;

  let refit = false;
  if (collapsed && fallbackPoints.length) {
    projection = geoMercator().fitExtent(fitBox, {
      type: "MultiPoint",
      coordinates: fallbackPoints,
    });
    path.projection(projection);
    refit = true;
  }

  return { projection, outlinePath: path(outline), refit };
}
