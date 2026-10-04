"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { asset } from "@/lib/env";
import { ThinkingOrb } from "thinking-orbs";

// Rafiul walking his short path while the site loads (Motion-Drafts.md, Package 1b).
// The clip is the Kling walk loop cropped to the figure; the wind gust and the
// loading line are live so they stay crisp. Day = black on white, night = inverted.
const MIN_MS = 4600; // long enough for the slow gust and stride to breathe
const MAX_MS = 5600; // hard cap; the page behind is a clean slate

const LINES = [
  "taking the scenic route...",
  "untangling a few things...",
  "connecting the dots...",
  "making room for ideas...",
  "almost there. probably...",
];

// Wind traced from the three keyframes (loader-wind-1-start / 2-middle / 3-end).
// Paths run right to left in the keyframes' 2688x1520 space; the viewBox crops to the figure.
const WIND = [
  {
    lag: 0,
    w: 2.6,
    d: "M1660 668 C1600 658 1540 674 1480 664 S1360 656 1300 666 S1200 674 1150 664",
  },
  {
    lag: 0.05,
    w: 2.2,
    d: "M1690 704 C1620 694 1550 714 1470 702 S1340 692 1260 704 S1180 714 1150 706 c-16 3 -22 -13 -9 -18 c8 -3 13 4 8 8",
  },
  {
    lag: 0.1,
    w: 2.8,
    d: "M1650 744 C1590 734 1520 754 1450 742 S1330 732 1250 742 S1190 750 1160 744",
  },
  {
    lag: 0.14,
    w: 2,
    d: "M1640 792 C1580 782 1500 802 1420 790 S1300 780 1230 792 c-13 2 -18 -11 -7 -15 c7 -2 11 3 7 7",
  },
  {
    lag: 0.08,
    w: 1.6,
    d: "M1600 724 C1560 718 1520 730 1470 722 S1400 716 1360 722",
  },
];

// Visible stroke between tail and head, as fractions of each path (0 = right end).
const KEYS = {
  start: [0.08, 0.4],
  middle: [0.32, 0.88],
  end: [0.7, 1],
} as const;

type Stroke = { tail: number; head: number };

export function Intro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLParagraphElement>(null);
  const windRef = useRef<SVGSVGElement>(null);

  const finish = useCallback(() => {
    const el = rootRef.current;
    if (!el || el.dataset.done === "1") return;
    el.dataset.done = "1";
    window.dispatchEvent(new CustomEvent("intro:done"));
    document.body.style.overflow = "";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.remove();
      return;
    }
    gsap.to(el, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => el.remove(),
    });
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    el.hidden = false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      // Rotating loading line.
      const line = lineRef.current;
      let i = 0;
      const rotate = window.setInterval(() => {
        if (!line) return;
        i = (i + 1) % LINES.length;
        gsap
          .timeline()
          .to(line, { opacity: 0, y: -3, duration: 0.4, ease: "power1.in" })
          .add(() => {
            line.textContent = LINES[i];
          })
          .fromTo(
            line,
            { opacity: 0, y: 4 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          );
      }, 1700);

      // One slow gust: start -> middle -> end keyframes, then it dissipates.
      const paths = Array.from(windRef.current?.querySelectorAll("path") ?? []);
      const tl = gsap.timeline({ delay: 1.0 });
      paths.forEach((path, k) => {
        const length = path.getTotalLength();
        const s: Stroke = { tail: 0, head: 0 };
        const draw = () => {
          const a = s.tail * length;
          const b = Math.max(s.head * length, a + 0.01);
          path.style.strokeDasharray = `${b - a} ${length + 10}`;
          path.style.strokeDashoffset = `${-a}`;
        };
        draw();
        const t0 = WIND[k].lag;
        tl.to(path, { opacity: 1, duration: 0.2 }, t0)
          .to(
            s,
            {
              tail: KEYS.start[0],
              head: KEYS.start[1],
              duration: 0.35,
              ease: "power3.out",
              onUpdate: draw,
            },
            t0,
          )
          .to(
            s,
            {
              tail: KEYS.middle[0],
              head: KEYS.middle[1],
              duration: 0.6,
              ease: "power2.in",
              onUpdate: draw,
            },
            t0 + 0.35,
          )
          .to(
            s,
            {
              tail: KEYS.end[0],
              head: KEYS.end[1],
              duration: 0.9,
              ease: "power2.out",
              onUpdate: draw,
            },
            t0 + 0.95,
          )
          .to(
            s,
            { tail: 1, duration: 0.7, ease: "power1.in", onUpdate: draw },
            t0 + 1.85,
          )
          .to(path, { opacity: 0, duration: 0.6, ease: "power1.in" }, t0 + 1.9);
      });
      // Walk feel, the way a human stride works: each step the hips shift over
      // the planted foot and the body rises slightly as weight passes over it,
      // then settles as the next foot takes the load. A small vertical bob with
      // a faint lateral sway reads as hinges working without bending the clip.
      tl.to(
        figureRef.current,
        {
          y: -3,
          x: 1.5,
          rotation: 0.4,
          duration: 0.45,
          ease: "sine.inOut",
          yoyo: true,
          repeat: 7,
        },
        0.2,
      );
      // The gust presses him half a step back; he yields, then walks out of it.
      tl.to(
        figureRef.current,
        { x: "-=7", duration: 0.9, ease: "sine.inOut" },
        1.0,
      ).to(
        figureRef.current,
        { x: "+=7", duration: 1.6, ease: "sine.out" },
        1.9,
      );

      return () => window.clearInterval(rotate);
    }, el);

    // Leave once the page has loaded and the gust has played, never later than MAX_MS.
    const started = performance.now();
    let minTimer = 0;
    const whenLoaded = () => {
      const wait = Math.max(0, MIN_MS - (performance.now() - started));
      minTimer = window.setTimeout(finish, wait);
    };
    if (document.readyState === "complete") whenLoaded();
    else window.addEventListener("load", whenLoaded, { once: true });
    const maxTimer = window.setTimeout(finish, MAX_MS);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      ctx.revert();
      window.removeEventListener("load", whenLoaded);
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(minTimer);
      window.clearTimeout(maxTimer);
      if (document.body.style.overflow === "hidden") {
        document.body.style.overflow = "";
      }
    };
  }, [finish]);

  return (
    <div
      ref={rootRef}
      hidden
      className="intro"
      onClick={finish}
      role="presentation"
      aria-hidden="true"
    >
      <div className="intro-walk">
        <div className="intro-status">
          <ThinkingOrb
            state="breathing"
            size={20}
            speed={0.7}
            theme="dark"
            aria-label="Loading"
          />
          <p ref={lineRef} className="intro-line">
            {LINES[0]}
          </p>
        </div>
        <div className="intro-figure">
          <div ref={figureRef} className="intro-lean">
            <video
              className="intro-video"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={asset("/loader/walk-poster.png")}
            >
              <source src={asset("/loader/walk.webm")} type="video/webm" />
              <source src={asset("/loader/walk.mp4")} type="video/mp4" />
            </video>
          </div>
          <svg
            ref={windRef}
            className="intro-wind"
            viewBox="1020 560 760 380"
            preserveAspectRatio="none"
          >
            {WIND.map((wind) => (
              <path key={wind.d} d={wind.d} strokeWidth={wind.w} />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
