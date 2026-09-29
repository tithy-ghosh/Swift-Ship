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
      className="bg-brand-surface-inverse-deep py-20 text-white md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* header */}
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-accent-bright">
            Our network
          </span>
          <h2 className="mt-4 max-w-xl text-4xl font-bold leading-[1.05] tracking-tight">
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
                  "py-4",
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
      <div className="text-4xl font-bold leading-none tracking-tight tabular-nums md:text-5xl">
        {n.toLocaleString("en-US")}
      </div>
      <div className="mt-2 text-sm text-white/60">{label}</div>
    </>
  );
}
