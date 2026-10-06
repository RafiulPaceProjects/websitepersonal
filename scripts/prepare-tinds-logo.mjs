// Rebuild the selected MP4 loop; original tinds-logo.mp4 stays untouched.
// Requires ffmpeg and the installed sharp dependency. No GIF is wired in.
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const input = path.join(root, "public/work/tinds-logo.mp4");
const output = path.join(root, "public/work/tinds-logo-loop.mp4");
const scratch = await fs.mkdtemp(path.join(os.tmpdir(), "tinds-video-loop-"));
const still = path.join(scratch, "wordmark.png");
function ffmpeg(args) {
  const result = spawnSync(
    "ffmpeg",
    ["-hide_banner", "-loglevel", "error", "-y", ...args],
    { encoding: "utf8" },
  );
  if (result.error || result.status !== 0)
    throw new Error(result.stderr || String(result.error));
}

ffmpeg(["-ss", "0.5", "-i", input, "-frames:v", "1", still]);
// Preserve the supplied wordmark from the selected video frame. Blend only
// the flame region at the wrap; blending whole frames doubled the lettering.
ffmpeg([
  "-i",
  input,
  "-loop",
  "1",
  "-i",
  still,
  "-filter_complex",
  "[0:v:0]fps=24,crop=100:430:250:0,split=2[body][head];[body]trim=start=0.5:end=5,setpts=PTS-STARTPTS[b];[head]trim=start=0:end=0.541667,setpts=PTS-STARTPTS[h];[b][h]xfade=transition=fade:duration=0.5:offset=4[flame];[1:v]fps=24[base];[base][flame]overlay=250:0:shortest=1,format=yuv420p[out]",
  "-map",
  "[out]",
  "-an",
  "-c:v",
  "libx264",
  "-crf",
  "18",
  "-preset",
  "slow",
  "-threads",
  "2",
  "-movflags",
  "+faststart",
  output,
]);
const first = path.join(scratch, "poster.png");
ffmpeg(["-i", output, "-frames:v", "1", first]);
await sharp(first)
  .resize({ width: 800 })
  .jpeg({ quality: 90 })
  .toFile(path.join(root, "public/work/tinds-logo-video-poster.jpg"));
await sharp(first)
  .resize({ width: 800 })
  .webp({ quality: 90, effort: 6 })
  .toFile(path.join(root, "public/work/tinds-logo-video-poster.webp"));
console.log(
  "Prepared smooth MP4 loop and matching full-frame posters. Run optimize-media.mjs to refresh fingerprinted delivery paths.",
);
