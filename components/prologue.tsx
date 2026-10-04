"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Screen 1, Prologue: Mainamati. One sticky stage, three same-shot frames
// dissolving afternoon into dusk as scroll passes through. Reduced motion
// keeps the first frame as a still.
const FRAMES = [
  {
    src: "/scenes/prologue/f01a-mainamati-empty.jpg",
    alt: "Flowering cantonment road in Mainamati, empty",
  },
  {
    src: "/scenes/prologue/f01b-mainamati-walk.jpg",
    alt: "A small figure in a white shirt walks away down the road",
  },
  {
    src: "/scenes/prologue/f01c-mainamati-dusk.jpg",
    alt: "The same road at blue hour, one window glowing teal",
  },
] as const;

export function Prologue() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      const frames = gsap.utils.toArray<HTMLElement>(".prologue-frame");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
      frames.forEach((frame, i) => {
        if (i === 0) {
          tl.fromTo(
            frame,
            { scale: 1 },
            { scale: 1.07, ease: "none", duration: 1 },
            0,
          );
          return;
        }
        tl.fromTo(
          frame,
          { opacity: 0, scale: 1.07 },
          { opacity: 1, scale: 1.12, ease: "none", duration: 1 },
          (i - 0.5) / (frames.length - 1),
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="prologue" aria-label="Prologue: Mainamati">
      <div className="prologue-stage">
        {FRAMES.map((frame, i) => (
          <Image
            key={frame.src}
            className={`prologue-frame${i === 0 ? " is-first" : ""}`}
            src={frame.src}
            alt={frame.alt}
            fill
            sizes="100vw"
            priority={i === 0}
          />
        ))}
        <div className="prologue-shade" aria-hidden="true" />
        <div className="prologue-caption">
          <p className="prologue-kicker">SCREEN 01 - MAINAMATI, BAIUST</p>
          <h2 className="prologue-headline">Four years start here.</h2>
          <p className="prologue-sub">
            Same direction of travel as the walk you just watched.
          </p>
        </div>
      </div>
    </section>
  );
}
