"use client";

import { useRef } from "react";
import NetworkMapCanvas from "./NetworkMapCanvas";
import { useCountUp } from "@/app/hooks/useCountUp";
import { useInView } from "@/app/hooks/useInView";
import { STATS } from "@/app/data/networkMap.data";

export default function NetworkMapSection() {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <section
      ref={ref}
      className="bg-brand-surface-inverse-deep py-12 text-white sm:py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* header */}
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-accent-bright">
            Our network
          </span>
          {/* `text-4xl` at the base was 36px on a 375px screen, which is the same
              size this section uses on a 27" monitor. */}
          <h2 className="mt-4 max-w-xl text-2xl font-bold leading-[1.15] tracking-tight sm:text-4xl sm:leading-[1.05]">
            A branch in every district we serve.
          </h2>
        </div>

       
        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-10">
          <div className="mx-auto w-fit rounded-3xl border border-white/10 bg-white/[0.03] p-3">
            <NetworkMapCanvas />

            <p className="mt-2 text-[11px] text-white/40">
              Route lines are illustrative. Boundaries © geoBoundaries, CC BY
              4.0
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={[
                  // `min-w-0` so a long label can shrink and wrap. As a grid
                  // item it defaults to `min-width: auto`, which makes it refuse
                  // to shrink below its min-content width and can push the
                  // second column past the container.
                  "min-w-0 py-4",
                  i % 2 === 1 ? "border-l border-white/10 pl-6" : "",
                  i >= 2 ? "border-t border-white/10" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <Stat {...stat} start={inView} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label, start }) {
  const n = useCountUp(value, start);

  return (
    <>
      <div className="text-3xl font-bold leading-none tracking-tight tabular-nums sm:text-4xl md:text-5xl">
        {n.toLocaleString("en-US")}
      </div>
      <div className="mt-2 text-sm leading-5 text-white/60">{label}</div>
    </>
  );
}
