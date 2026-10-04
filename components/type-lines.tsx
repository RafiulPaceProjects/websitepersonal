"use client";

import { useEffect, useRef } from "react";

// Rotating typed lines. The first set renders on the server so no-JS and
// reduced motion readers get everything; JS cycles through the sets only
// when motion is allowed, starting once the loader lifts so it is seen.
const HOLD_MS = 2300;
export function TypeLines({
  sets,
  className,
  charMs = 26,
}: {
  sets: readonly (readonly string[])[];
  className?: string;
  charMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-typed]"));
    let cancelled = false;
    let started = false;
    let timer = 0;
    const start = () => {
      if (started || cancelled) return;
      started = true;
      let si = 0;
      let li = 0;
      let ci = 0;
      const tick = () => {
        if (cancelled) return;
        const set = sets[si];
        if (li >= set.length) {
          si = (si + 1) % sets.length;
          li = 0;
          ci = 0;
          timer = window.setTimeout(() => {
            if (cancelled) return;
            els.forEach((el) => {
              el.textContent = "";
            });
            root.classList.remove("is-done");
            tick();
          }, HOLD_MS);
          root.classList.add("is-done");
          return;
        }
        const el = els[li];
        if (!el) return;
        const full = set[li];
        ci += 1;
        el.textContent = full.slice(0, ci);
        if (ci >= full.length) {
          li += 1;
          ci = 0;
          timer = window.setTimeout(tick, 240);
        } else {
          timer = window.setTimeout(tick, charMs);
        }
      };
      els.forEach((el) => {
        el.textContent = "";
      });
      tick();
    };
    // type only once the hero blur has landed, so words arrive on softness
    window.addEventListener("film:blurred", start, { once: true });
    timer = window.setTimeout(start, 12000);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("film:blurred", start);
    };
  }, [sets, charMs]);

  return (
    <div ref={ref} className={className}>
      {sets[0].map((line) => (
        <p key={line} data-typed>
          {line}
        </p>
      ))}
      <span className="type-caret" aria-hidden="true" />
    </div>
  );
}
