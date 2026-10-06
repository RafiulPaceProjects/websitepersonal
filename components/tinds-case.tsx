"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { ArrowDown, ArrowUpRight, Play, Pause, X } from "lucide-react";
import { asset } from "@/lib/env";
import { loadMotionVideo } from "@/lib/video";
import { profile } from "@/content/site";
import { tinds, type TindsArticle } from "@/content/tinds";
import media from "@/content/media.json";

function LogoVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    loadMotionVideo(video);
    const onVisibility = () => {
      if (document.hidden) video.pause();
      else if (!paused) void video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [paused]);
  return (
    <div className="tinds-brand">
      <video
        ref={ref}
        className="tinds-logo-motion"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={asset(media.tindsLogo.still)}
        aria-label="Animated TINDS logo"
        width={960}
        height={960}
      >
        <source data-src={asset(media.tindsLogo.motion)} type="video/mp4" />
      </video>
      <picture className="contents">
        <source srcSet={asset(media.tindsLogo.still)} type="image/webp" />
        <img
          className="tinds-logo-still"
          src={asset("/work/tinds-logo-video-poster.jpg")}
          alt="TINDS — Media, Story, Impact"
          width={800}
          height={800}
        />
      </picture>
      <button
        className="tinds-logo-toggle"
        type="button"
        aria-label={paused ? "Play logo animation" : "Pause logo animation"}
        onClick={() => {
          const video = ref.current;
          if (!video) return;
          if (paused) void video.play().catch(() => {});
          else video.pause();
          setPaused(!paused);
        }}
      >
        {paused ? (
          <Play size={14} aria-hidden="true" />
        ) : (
          <Pause size={14} aria-hidden="true" />
        )}
        {paused ? "Play motion" : "Pause motion"}
      </button>
    </div>
  );
}

// Only the requested piece is mounted. No Instagram scripts or iframes are
// requested while browsing the case study itself.
function InstagramEmbed({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const process = () => window.instgrm?.Embeds.process();
    let script = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.instagram.com/embed.js"]',
    );
    if (!script) {
      script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
    const failed = () => setStatus("unavailable");
    script.addEventListener("load", process);
    script.addEventListener("error", failed);
    const observer = new MutationObserver(() => {
      if (el.querySelector("iframe")) setStatus("ready");
    });
    observer.observe(el, { childList: true, subtree: true });
    process();
    const timeout = window.setTimeout(
      () =>
        setStatus((current) => (current === "ready" ? current : "unavailable")),
      10000,
    );
    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
      script.removeEventListener("load", process);
      script.removeEventListener("error", failed);
    };
  }, [url]);
  return (
    <div className="tinds-embed-window">
      {status !== "ready" && (
        <p className="tinds-embed-status" role="status">
          {status === "loading"
            ? "Loading the Instagram preview…"
            : "Preview taking a while? You can open the original on Instagram below."}
        </p>
      )}
      <div ref={ref} className="tinds-reel">
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
        >
          <a href={url} target="_blank" rel="noopener noreferrer">
            View this piece on Instagram
          </a>
        </blockquote>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    instgrm?: { Embeds: { process(): void } };
  }
}

function MediaLink({
  url,
  title,
  description,
  prominent = false,
}: {
  url: string;
  title: string;
  description: string;
  prominent?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <article
      className={
        prominent ? "tinds-media-item tinds-media-lead" : "tinds-media-item"
      }
    >
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="tinds-media-actions">
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger
            className="tinds-preview-button"
            aria-label={`Preview ${title}`}
          >
            <Play size={16} aria-hidden="true" /> Preview
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop className="tinds-modal-backdrop" />
            <Dialog.Popup className="tinds-viewer">
              <div className="tinds-viewer-head">
                <div>
                  <Dialog.Title>{title}</Dialog.Title>
                  <Dialog.Description>{description}</Dialog.Description>
                </div>
                <Dialog.Close
                  className="tinds-close"
                  aria-label="Close preview"
                >
                  <X size={20} aria-hidden="true" />
                </Dialog.Close>
              </div>
              {open && <InstagramEmbed key={url} url={url} />}
              <a
                className="tinds-source-link"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open original on Instagram{" "}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${title} on Instagram`}
        >
          <ArrowUpRight size={18} aria-hidden="true" />
          <span className="sr-only">Instagram</span>
        </a>
      </div>
    </article>
  );
}

function StoryImage({
  article,
  lead = false,
}: {
  article: TindsArticle;
  lead?: boolean;
}) {
  const prefix = `/work/tinds-stories/${article.image}`;
  return (
    <picture>
      <source
        srcSet={`${asset(`${prefix}-480.webp`)} 480w, ${asset(`${prefix}-960.webp`)} 960w`}
        sizes={
          lead
            ? "(max-width: 760px) calc(100vw - 40px), (max-width: 1200px) 55vw, 650px"
            : "(max-width: 760px) calc(100vw - 40px), 360px"
        }
        type="image/webp"
      />
      <img
        src={asset(`${prefix}-960.webp`)}
        alt={article.imageAlt}
        width={960}
        height={480}
        loading="lazy"
      />
    </picture>
  );
}

export function TindsCase() {
  const [lead, ...stories] = tinds.articles;
  const contact = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}`;
  return (
    <div className="tinds">
      <a className="tinds-skip" href="#tinds-work">
        Skip to selected work
      </a>
      <main>
        <header className="tinds-hero">
          <div className="tinds-shell tinds-hero-shell">
            <nav className="tinds-case-nav" aria-label="Case study navigation">
              <a href={asset("/")} aria-label="Back to the homepage">
                ← Rafiul Haider
              </a>
              <a href="#tinds-work">
                Selected work <ArrowDown size={16} aria-hidden="true" />
              </a>
            </nav>
            <div className="tinds-hero-grid">
              <div className="tinds-intro">
                <p className="tinds-context">TINDS · South Asian stories</p>
                <h1 className="tinds-headline">{tinds.headline}</h1>
                <p className="tinds-introduction">{tinds.introduction}</p>
                <p className="tinds-role">
                  {tinds.role}
                  <span>
                    {tinds.period} · {tinds.place}
                  </span>
                </p>
                <a className="tinds-primary" href="#tinds-work">
                  Explore the work <ArrowDown size={16} aria-hidden="true" />
                </a>
              </div>
              <LogoVideo />
            </div>
          </div>
        </header>
        <div className="tinds-paper">
          {lead && (
            <section
              id="tinds-work"
              className="tinds-shell tinds-stories"
              aria-label="Selected stories"
            >
              <div className="tinds-section-heading">
                <h2>Selected stories</h2>
                <p>{tinds.articleCredit}</p>
              </div>
              <article className="tinds-article tinds-story-lead">
                <a
                  className="tinds-story-image"
                  href={lead.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Read ${lead.title}`}
                >
                  <StoryImage article={lead} lead />
                </a>
                <div className="tinds-story-copy">
                  <p className="tinds-topic">{lead.topic}</p>
                  <h3>
                    <a
                      href={lead.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {lead.title}
                    </a>
                  </h3>
                  <p>{lead.dek}</p>
                  <a
                    className="tinds-text-link"
                    href={lead.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read the story <ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                </div>
              </article>
              <div className="tinds-story-grid">
                {stories.map((article) => (
                  <article className="tinds-article" key={article.url}>
                    <a
                      className="tinds-story-image"
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Read ${article.title}`}
                    >
                      <StoryImage article={article} />
                    </a>
                    <p className="tinds-topic">{article.topic}</p>
                    <h3>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {article.title}
                      </a>
                    </h3>
                    <p>{article.dek}</p>
                    <a
                      className="tinds-text-link"
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read the story{" "}
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </a>
                  </article>
                ))}
              </div>
            </section>
          )}
          <section
            className="tinds-shell tinds-overview"
            aria-label="What I did at TINDS"
          >
            <div>
              <h2>Stories, and the relationships behind them.</h2>
              <p>Two sides of my work at TINDS.</p>
            </div>
            <div className="tinds-tracks">
              {tinds.tracks.map((track) => (
                <article key={track.title} className="tinds-track">
                  <h3>{track.title}</h3>
                  <p>{track.text}</p>
                </article>
              ))}
            </div>
          </section>
          {tinds.reels.length > 0 && (
            <section
              className="tinds-shell tinds-media-section"
              aria-label="TINDS reels"
            >
              <div className="tinds-section-heading">
                <h2>Beyond the page</h2>
                <p>Conversations, reels and moments from TINDS.</p>
              </div>
              <div className="tinds-media-layout">
                <div className="tinds-media-feature">
                  <p className="tinds-topic">In conversation</p>
                  <MediaLink
                    url={tinds.reels[0].url}
                    title="Rafiul, on TINDS"
                    description="A conversation from @tindsofficial, featuring me."
                    prominent
                  />
                  <p className="tinds-media-note">
                    Open a preview here, or watch the original on Instagram.
                  </p>
                </div>
                <div className="tinds-media-list">
                  {tinds.reels.slice(1, 3).map((reel, index) => (
                    <MediaLink
                      key={reel.url}
                      url={reel.url}
                      title={
                        index === 0
                          ? "Another conversation with Rafiul"
                          : "From the TINDS reel collection"
                      }
                      description={reel.label}
                    />
                  ))}
                  <details className="tinds-more">
                    <summary>
                      More reels <span>{tinds.reels.length - 3} more</span>
                    </summary>
                    {tinds.reels.slice(3).map((reel, index) => (
                      <MediaLink
                        key={reel.url}
                        url={reel.url}
                        title={`TINDS reel ${index + 4}`}
                        description={reel.label}
                      />
                    ))}
                  </details>
                </div>
              </div>
              {(tinds.feature || tinds.slides.length > 0) && (
                <div className="tinds-posts">
                  <h3>From the TINDS feed</h3>
                  <div className="tinds-post-grid">
                    {tinds.feature?.url && (
                      <MediaLink
                        url={tinds.feature.url}
                        title="Featured TINDS post"
                        description={tinds.feature.caption}
                      />
                    )}
                    {tinds.slides
                      .filter((slide) => slide.url)
                      .map((slide, index) => (
                        <MediaLink
                          key={slide.url}
                          url={slide.url!}
                          title={`TINDS gallery ${index + 1}`}
                          description={
                            slide.caption ??
                            slide.label ??
                            "A post from @tindsofficial."
                          }
                        />
                      ))}
                  </div>
                </div>
              )}
            </section>
          )}
          <section
            className="tinds-shell tinds-contact"
            aria-label="Contact Rafiul"
          >
            <div>
              <p className="tinds-topic">Let’s work together</p>
              <h2>Have a story worth telling?</h2>
              <p>
                Let’s talk about the words, the visuals, and the people you want
                to reach.
              </p>
            </div>
            <div>
              <a
                className="tinds-primary"
                href={contact}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact Rafiul in Gmail (opens in new tab)"
              >
                Get in touch <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <a className="tinds-email" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </div>
          </section>
          <footer className="tinds-shell tinds-case-footer">
            <a href={asset("/")} aria-label="Back to the homepage">
              ← Home
            </a>
            <p>{tinds.subhead}</p>
            <a href={asset("/work/ez-living")}>Next: EZ Living Home Care →</a>
          </footer>
        </div>
      </main>
    </div>
  );
}
