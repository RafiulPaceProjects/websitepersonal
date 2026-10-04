"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Floating album: four turnaround portraits drop into a fanned corner stack
// when scrolled into view, once. Reduced motion keeps the settled fan.
const PHOTOS = [
  { src: "/album/rafiul-front-1.jpg", alt: "Rafiul, front view" },
  {
    src: "/album/rafiul-threequarter-right-1.jpg",
    alt: "Rafiul, three-quarter view",
  },
  { src: "/album/rafiul-profile-right-1.jpg", alt: "Rafiul, profile view" },
  { src: "/album/rafiul-low-angle-1.jpg", alt: "Rafiul, low angle view" },
] as const;

export function Album() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.from(".album-photo", {
        y: -220,
        opacity: 0,
        rotation: "+=50",
        duration: 0.9,
        ease: "bounce.out",
        stagger: 0.14,
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          once: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="album" aria-label="Portrait album">
      <div className="album-copy">
        <h2 className="album-title">Same man, many angles.</h2>
        <p className="album-sub">
          Turnaround portraits from the likeness study. Proof the face holds.
        </p>
      </div>
      <div className="album-fan">
        {PHOTOS.map((photo) => (
          <div key={photo.src} className="album-photo">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 40vw, 220px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
