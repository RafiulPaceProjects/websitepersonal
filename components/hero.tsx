"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { profile } from "@/content/site";
import { GameMenu } from "@/components/game-menu";

const MAX_TILT = 10;

export function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const drift = gsap.fromTo(
      ".hero-cut",
      { scale: 1 },
      {
        scale: 1.06,
        duration: 14,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      },
    );
    return () => {
      drift.kill();
    };
  }, []);

  function onMove(event: React.MouseEvent) {
    const stage = stageRef.current;
    const tilt = tiltRef.current;
    if (!stage || !tilt) return;
    const rect = stage.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    tilt.style.transform = `rotateY(${px * MAX_TILT * 2}deg) rotateX(${-py * MAX_TILT * 2}deg)`;
  }

  function onLeave() {
    if (tiltRef.current)
      tiltRef.current.style.transform = "rotateY(0deg) rotateX(0deg)";
  }

  return (
    <section className="hero-stage" aria-label="Introduction">
      <div className="hero-copy">
        <p className="hero-meta">SCENE 01 · PLAYER 01 — {profile.role}</p>
        <h1 className="display-xxl rise">
          Rafiul <span className="accent">Haider</span>
        </h1>
        <p className="hero-title">{profile.tagline}</p>
        <p className="hero-lede">{profile.intro}</p>
        <p className="hero-cta">
          <a className="hero-cta-link" href={`mailto:${profile.email}`}>
            Start an email ↗
          </a>
          <a className="row-link" href={profile.linkedin}>
            LinkedIn
          </a>
        </p>
        <p className="hero-meta">{profile.location}</p>
      </div>
      <div
        ref={stageRef}
        className="stage"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <div ref={tiltRef} className="tilt">
          <span className="tick tl" aria-hidden="true" />
          <span className="tick tr" aria-hidden="true" />
          <span className="tick bl" aria-hidden="true" />
          <span className="tick br" aria-hidden="true" />
          <span className="kenburns">
            <Image
              className="hero-cut"
              src="/profile-cut.png"
              alt="Portrait of Rafiul Haider holding a coffee cup in an office"
              width={768}
              height={960}
              priority
            />
          </span>
          <div className="stage-shadow" aria-hidden="true" />
        </div>
        <p className="coffee-chip" aria-hidden="true">
          <span className="steam" aria-hidden="true">
            <i className="s1" />
            <i className="s2" />
            <i className="s3" />
          </span>
          COFFEE: HOT
        </p>
      </div>
      <GameMenu />
    </section>
  );
}
