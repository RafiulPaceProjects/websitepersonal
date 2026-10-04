"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { asset } from "@/lib/env";
import { ArrowUpRight } from "lucide-react";
import { TypeLines } from "@/components/type-lines";
import { profile, publication, work } from "@/content/site";

const CONTACT_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}`;

// A little personality beside the factual profile; never invented results.
const WHERE_SETS = [
  ["Curiosity, with a spreadsheet."],
  ["Less busywork. More brainwork."],
  ["Weak Wi-Fi. Strong curiosity."],
  ["Good questions. Then better ones."],
  ["Turning “wait, what?” into “got it.”"],
] as const;

// Screen 0: the harbor loop runs full-bleed behind the hero UI.
// One arc per visit: sharp while it plays, then a slow blur ramp as the copy
// rises; the loop keeps running blurred until a refresh resets it.
// Quieter by construction: paused offscreen and in hidden tabs, still poster
// under reduced motion (see site.css), muted + playsinline for autoplay.
const BLUR_AT = 5.5; // seconds in, just as the loader lifts
const BLUR_PX = 12;
const PLAYBACK_RATE = 1;

export function HeroFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const driftRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const warmRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = PLAYBACK_RATE;
    video.defaultPlaybackRate = PLAYBACK_RATE;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // The file itself is a forward-then-reverse palindrome, so the element
    // just loops; the blur ramp below fires once and holds for the visit.
    const onVisibility = () => {
      if (document.hidden) video.pause();
      else void video.play().catch(() => {});
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (document.hidden) return;
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(video);
    document.addEventListener("visibilitychange", onVisibility);

    // The one-way trip: blur lands, copy rises, both stay for the visit.
    // Copy starts hidden in JS only, so no-JS and reduced motion still read it.
    let blurred = false;
    // The whole UI waits for the blur: nav, typed lines and copy arrive
    // together and stay. Hidden in JS only, so no-JS readers get everything.
    const ui = uiRef.current;
    if (!reduce && ui) gsap.set(ui, { autoAlpha: 0 });
    const copy = copyRef.current;
    if (!reduce && copy) gsap.set(copy, { opacity: 0, y: 24 });
    // Drifting contrast shade, after the reference: a soft dark mass that
    // wanders behind the copy so the text always sits on depth.
    const drift = driftRef.current;
    const driftTween =
      !reduce && drift
        ? gsap.fromTo(
            drift,
            { xPercent: -6 },
            {
              xPercent: 6,
              duration: 14,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            },
          )
        : null;
    // Filters only tween smoothly between matching function lists, so the clip
    // starts on the same list at zero; otherwise "none" -> blur snaps.
    const FILTER_FROM = "blur(0px) sepia(0) saturate(1) hue-rotate(0deg)";
    const FILTER_TO = `blur(${BLUR_PX}px) sepia(0.35) saturate(1.15) hue-rotate(-8deg)`;
    if (!reduce) {
      gsap.set(video, { filter: FILTER_FROM });
      if (cardRef.current) gsap.set(cardRef.current, { opacity: 0, y: 22 });
      if (photoRef.current)
        gsap.set(photoRef.current, {
          clipPath: "inset(100% 0% 0% 0%)",
          scale: 1.04,
        });
    }

    let arrival: gsap.core.Timeline | null = null;
    const reveal = () => {
      if (blurred || reduce) return;
      blurred = true;
      // One clock for the whole arrival: blur and warmth ease in together (the
      // cool harbor dawn turning toward the lamp-lit photo), the UI fades up
      // under them, then the copy, the card, and the photo's insert-shot wipe.
      const tl = gsap.timeline({
        onComplete: () => {
          window.dispatchEvent(new CustomEvent("film:blurred"));
        },
      });
      arrival = tl;
      tl.to(video, { filter: FILTER_TO, duration: 4, ease: "sine.inOut" }, 0);
      if (warmRef.current)
        tl.to(
          warmRef.current,
          { opacity: 1, duration: 4.4, ease: "sine.inOut" },
          0,
        );
      if (uiRef.current)
        tl.to(
          uiRef.current,
          { autoAlpha: 1, duration: 2.6, ease: "sine.out" },
          1.2,
        );
      if (copyRef.current)
        tl.to(
          copyRef.current,
          { opacity: 1, y: 0, duration: 2.2, ease: "power3.out" },
          1.5,
        );
      if (cardRef.current)
        tl.to(
          cardRef.current,
          { opacity: 1, y: 0, duration: 2, ease: "power3.out" },
          2.1,
        );
      if (photoRef.current)
        tl.to(
          photoRef.current,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            duration: 2,
            ease: "power3.inOut",
          },
          2.4,
        );
    };
    const onTime = () => {
      if (video.currentTime >= BLUR_AT) reveal();
    };
    // Low-power mode or a failed video must never strand the phone UI.
    const revealTimer = window.setTimeout(reveal, 6500);

    // Card hover (fine pointers only): a few degrees of tilt toward the cursor,
    // a slight lift, a light sheen that follows the pointer, a slow push-in on
    // the photo. Springs back on leave.
    const card = cardRef.current;
    const photoImg = photoRef.current?.querySelector("img") ?? null;
    const canHover =
      !reduce &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onMove = (event: PointerEvent) => {
      if (!card) return;
      const r = card.getBoundingClientRect();
      const px = (event.clientX - r.left) / r.width;
      const py = (event.clientY - r.top) / r.height;
      card.style.setProperty("--mx", `${px * 100}%`);
      card.style.setProperty("--my", `${py * 100}%`);
      gsap.to(card, {
        rotationY: (px - 0.5) * 7,
        rotationX: (0.5 - py) * 5,
        y: -6,
        transformPerspective: 900,
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto",
      });
    };
    const onEnter = () => {
      card?.classList.add("is-hover");
      if (photoImg)
        gsap.to(photoImg, { scale: 1.05, duration: 1.4, ease: "power2.out" });
    };
    const onLeave = () => {
      card?.classList.remove("is-hover");
      if (card)
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          y: 0,
          duration: 1,
          ease: "elastic.out(1, 0.6)",
          overwrite: "auto",
        });
      if (photoImg)
        gsap.to(photoImg, { scale: 1, duration: 1.2, ease: "power2.out" });
    };
    if (canHover && card) {
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointerleave", onLeave);
    }
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("error", reveal);
    return () => {
      window.clearTimeout(revealTimer);
      arrival?.kill();
      driftTween?.kill();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("error", reveal);
      card?.removeEventListener("pointermove", onMove);
      card?.removeEventListener("pointerenter", onEnter);
      card?.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section className="film" aria-label="Chittagong harbor at dawn">
      <Image
        className="film-poster"
        src={asset("/hero/main-homepage-poster.jpg")}
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
      />
      <video
        ref={videoRef}
        className="film-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={asset("/hero/main-homepage-poster.jpg")}
        aria-hidden="true"
        tabIndex={-1}
      >
        <source
          src={asset("/hero/main-homepage-loop.web.webm")}
          type="video/webm"
        />
        <source
          src={asset("/hero/main-homepage-loop.web.mp4")}
          type="video/mp4"
        />
      </video>
      <div ref={warmRef} className="film-warm" aria-hidden="true" />
      <div className="film-shade" aria-hidden="true" />
      <div ref={driftRef} className="film-drift" aria-hidden="true" />
      <div className="film-ui" ref={uiRef}>
        <header className="film-top">
          <nav className="film-nav" aria-label="Elsewhere">
            <a href={work[0].link ?? publication.doi}>Work</a>
            <a href={publication.doi}>Background</a>
            <a
              href={CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact Rafiul in Gmail (opens in new tab)"
            >
              Contact
            </a>
          </nav>
        </header>
        {/* Card with the lamp-lit still; arrives once the film blurs and warms.
            Upper right under the nav on desktop, in flow under the nav on phones. */}
        <div className="film-profile">
          <article ref={cardRef} className="film-card">
            <figure ref={photoRef} className="film-portrait">
              <picture>
                <source
                  media="(max-width: 599px)"
                  srcSet={asset("/album/ward-rain-wide-4k.jpg")}
                />
                <Image
                  src={asset("/album/ward-rain-tall-4k.jpg")}
                  alt="Rafiul at a rainy window, lit by a desk lamp"
                  fill
                  quality={90}
                  sizes="(max-width: 900px) 45vw, (max-width: 1180px) 480px, 36vw"
                  loading="eager"
                  fetchPriority="high"
                />
              </picture>
            </figure>
            <div className="film-card-body">
              <p className="film-card-label">{profile.location}</p>
              <h2 className="film-card-name">{profile.name}</h2>
              <p className="film-card-title">{profile.role}</p>
              {/* Short personality lines, with a fixed space to avoid layout shifts. */}
              <TypeLines
                sets={WHERE_SETS}
                className="film-where film-card-where"
              />
            </div>
            <footer className="film-card-foot">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Rafiul on LinkedIn (opens in new tab)"
              >
                LinkedIn
                <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.5} />
              </a>
              <a
                href={profile.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Rafiul on Instagram (opens in new tab)"
              >
                Instagram
                <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.5} />
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Rafiul on GitHub (opens in new tab)"
              >
                GitHub
                <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.5} />
              </a>
            </footer>
          </article>
        </div>
        <div className="film-bottom" ref={copyRef}>
          <h1 className="film-headline">I make the messy bits make sense.</h1>
          <p className="film-sub">
            Data science at Pace. A soft spot for tricky problems.
          </p>
          <p className="film-cta">
            <a
              href={CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Email Rafiul in Gmail (opens in new tab)"
            >
              Let&apos;s talk ↗
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
