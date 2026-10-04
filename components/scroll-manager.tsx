"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Smooth scroll wired into GSAP: ScrollTrigger reads Lenis position.
// Reduced motion gets native scroll, no smoothing, no pins.
export function ScrollManager() {
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;
    const lenis = new Lenis({ autoRaf: true, anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    return () => {
      lenis.destroy();
    };
  }, []);
  return null;
}
