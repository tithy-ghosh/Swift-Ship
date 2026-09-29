"use client";

import { useEffect, useMemo, useState } from "react";
import { normalizeWinding, projectOutline } from "@/app/utils/geoOutline";
import {
  BRANCH_COORDINATES,
  BRANCHES,
  HUBS,
  MAP_COLORS,
  MAP_HEIGHT,
  MAP_PADDING,
  MAP_WIDTH,
  OUTLINE_URL,
  SIZES,
} from "@/app/data/networkMap.data";

const { branch: GREEN, routeGlow: ROUTE_GLOW, hub: AMBER } = MAP_COLORS;

/**
 * Curved quadratic routes from the main hub out to every other hub.
 * The dashes travel along these; the geometry itself is decorative, which is why
 * the section caption says the routes are illustrative.
 */
function useRoutes(hubs) {
  return useMemo(() => {
    const origin = hubs.find((hub) => hub.main);
    if (!origin) return [];

    return hubs
      .filter((hub) => !hub.main)
      .map((hub, i) => {
        const mx = (origin.x + hub.x) / 2;
        const my = (origin.y + hub.y) / 2;
        const dx = hub.x - origin.x;
        const dy = hub.y - origin.y;
        const len = Math.hypot(dx, dy) || 1;
        const bend = len * 0.18;
        const cx = mx - (dy / len) * bend;
        const cy = my + (dx / len) * bend;
        return {
          key: hub.name,
          d: `M${origin.x},${origin.y} Q${cx},${cy} ${hub.x},${hub.y}`,
          delay: i * 0.9,
        };
      });
  }, [hubs]);
}

export default function NetworkMapCanvas() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // `response.ok` is checked explicitly. The old code called r.json()
        // straight away, so a 404 produced a JSON parse error rather than a clear
        // message about the file being missing.
        const response = await fetch(OUTLINE_URL);
        if (!response.ok) {
          throw new Error(`${OUTLINE_URL} returned ${response.status}`);
        }

        const outline = normalizeWinding(await response.json());

        const { projection, outlinePath } = projectOutline({
          outline,
          width: MAP_WIDTH,
          height: MAP_HEIGHT,
          padding: MAP_PADDING,
          fallbackPoints: BRANCH_COORDINATES,
        });

        // Real branch coordinates, not synthetic upazila centroids.
        const dots = BRANCHES.map((warehouse, i) => {
          const [lng, lat] = [warehouse.longitude, warehouse.latitude];
          const projected = projection([lng, lat]);
          if (!projected) return null;

          return {
            key: warehouse.district,
            x: projected[0],
            y: projected[1],
            label: warehouse.district,
            twinkle: i % 6 === 0, // ~1 in 6 dots gently twinkles
            delay: (i % 17) * 0.35,
          };
        }).filter(Boolean);

        const hubs = HUBS.map((hub) => {
          const [x, y] = projection(hub.coord);
          return { ...hub, x, y };
        });

        if (!cancelled) setData({ outlinePath, dots, hubs });
      } catch (err) {
        console.error("Network map failed to load", err);
        if (!cancelled) setError(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // `hubs` is undefined until the fetch resolves, and this runs before the
  // loading/error guards below, so it has to tolerate a missing list.
  const routes = useRoutes(data?.hubs ?? []);

  if (error) {
    return (
      <div className="flex aspect-[13/15] items-center justify-center text-sm text-white/50">
        Map unavailable right now.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="aspect-[13/15] w-full animate-pulse rounded-2xl bg-white/[0.03]" />
    );
  }

  return (
    <svg
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      className="mx-auto h-auto w-full max-w-[250px]"
      role="img"
      aria-label={`Map of Bangladesh showing ${BRANCHES.length} SwiftShip branches plotted at their real coordinates, plus the ${HUBS.length} divisional hubs`}
    >
      {/* country outline */}
      <path
        d={data.outlinePath}
        fill={GREEN}
        fillOpacity="0.07"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth={SIZES.outlineStroke}
        strokeLinejoin="round"
      />

      {/* branch dots */}
      <g fill={GREEN}>
        {data.dots.map((dot) => (
          <circle
            key={dot.key}
            cx={dot.x}
            cy={dot.y}
            r={SIZES.branch}
            opacity="0.9"
            className={dot.twinkle ? "network-twinkle" : undefined}
            style={dot.twinkle ? { animationDelay: `${dot.delay}s` } : undefined}
          >
            <title>{dot.label} branch</title>
          </circle>
        ))}
      </g>

      {/* faint base routes + travelling dash */}
      <g fill="none" strokeLinecap="round">
        {routes.map((route) => (
          <g key={route.key}>
            <path
              d={route.d}
              stroke={GREEN}
              strokeOpacity="0.1"
              strokeWidth={SIZES.routeStroke}
            />
            <path
              d={route.d}
              pathLength="1"
              stroke={ROUTE_GLOW}
              strokeWidth={SIZES.routeGlowStroke}
              className="network-route"
              style={{ animationDelay: `${route.delay}s` }}
            />
          </g>
        ))}
      </g>

      {/* divisional hubs */}
      {data.hubs.map((hub) => (
        <g key={hub.name}>
          <title>{hub.name} hub</title>
          <circle
            cx={hub.x}
            cy={hub.y}
            r={hub.main ? SIZES.hubMain : SIZES.hub}
            fill="none"
            stroke={AMBER}
            strokeOpacity="0.35"
            strokeWidth={SIZES.hubStroke}
          />
          <circle
            cx={hub.x}
            cy={hub.y}
            r={hub.main ? SIZES.hubMain : SIZES.hub}
            fill="none"
            stroke={AMBER}
            strokeWidth={SIZES.hubStroke}
            className="network-pulse-ring"
            style={{
              animationDelay: `${hub.main ? 0 : (hub.name.length % 5) * 0.4}s`,
            }}
          />
          <circle
            cx={hub.x}
            cy={hub.y}
            r={hub.main ? SIZES.hubDotMain : SIZES.hubDot}
            fill={AMBER}
          />
        </g>
      ))}
    </svg>
  );
}
