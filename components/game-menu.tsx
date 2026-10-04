"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const ITEMS = [
  { index: "01", label: "Selected Work", href: "#work" },
  { index: "02", label: "Background", href: "#background" },
  { index: "03", label: "Toolbox", href: "#toolbox" },
  { index: "04", label: "Contact", href: "#contact" },
];

export function GameMenu() {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [focus, setFocus] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const items = root.querySelectorAll(".game-menu-item");
    const play = () => {
      if (reduced) return;
      gsap.fromTo(
        items,
        { x: 24, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out" },
      );
    };
    // The intro loader announces itself; if it already finished, play now.
    if (!document.querySelector(".intro")) {
      play();
      return;
    }
    window.addEventListener("intro:done", play, { once: true });
    const fallback = window.setTimeout(play, 3500);
    return () => {
      window.removeEventListener("intro:done", play);
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    const targets = ITEMS.map(({ href }) =>
      document.querySelector(href),
    ).filter((el): el is Element => el !== null);
    if (targets.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    targets.forEach((target) => io.observe(target));
    return () => io.disconnect();
  }, []);

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const next =
      event.key === "ArrowDown"
        ? (focus + 1) % ITEMS.length
        : (focus - 1 + ITEMS.length) % ITEMS.length;
    setFocus(next);
    rootRef.current
      ?.querySelectorAll<HTMLAnchorElement>(".game-menu-item")
      [next]?.focus();
  }

  return (
    <nav
      ref={rootRef}
      className="game-menu"
      aria-label="Game menu — sections"
      onKeyDown={onKeyDown}
    >
      <p className="game-menu-title" aria-hidden="true">
        MENU
      </p>
      <ul>
        {ITEMS.map((item, i) => (
          <li key={item.href}>
            <a
              href={item.href}
              className={
                active === item.href
                  ? "game-menu-item is-active"
                  : "game-menu-item"
              }
              aria-current={active === item.href ? "true" : undefined}
              tabIndex={i === focus ? 0 : -1}
              onFocus={() => setFocus(i)}
            >
              <span className="game-menu-cursor" aria-hidden="true">
                ▸
              </span>
              <span className="game-menu-index">{item.index}</span>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
