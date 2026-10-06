/** Attach decorative media only after the motion preference has been checked.
 * SSR/no-JS keeps the poster without downloading either video format.
 */
export function loadMotionVideo(video: HTMLVideoElement) {
  const sources = video.querySelectorAll<HTMLSourceElement>(
    "source[data-src]:not([src])",
  );
  if (!sources.length) return;
  for (const source of sources) source.src = source.dataset.src!;
  video.load();
}
