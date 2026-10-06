// Regenerate delivery files without changing the originals. Requires ffmpeg.
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const output = path.join(root, "public/media");
const manifest = {};
const savings = [];

async function save(name, extension, buffer, original) {
  const hash = createHash("sha256").update(buffer).digest("hex").slice(0, 12);
  const filename = `${name}.${hash}.${extension}`;
  await fs.writeFile(path.join(output, filename), buffer);
  savings.push({ name: filename, bytes: buffer.length, original });
  return `/media/${filename}`;
}

async function images(name, source, widths) {
  const input = path.join(root, "public", source);
  const original = (await fs.stat(input)).size;
  const variants = [];
  for (const width of widths) {
    const { data, info } = await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 90, effort: 6 })
      .toBuffer({ resolveWithObject: true });
    variants.push({
      src: await save(`${name}-${info.width}`, "webp", data, original),
      width: info.width,
    });
  }
  return variants;
}

async function video(name, source, codecArgs) {
  const input = path.join(root, "public", source);
  const extension = path.extname(source).slice(1);
  const temporary = path.join(output, `${name}.encoding.${extension}`);
  const encoded = spawnSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-i",
      input,
      "-map",
      "0:v:0",
      "-an",
      "-map_metadata",
      "-1",
      ...codecArgs,
      "-threads",
      "2",
      temporary,
    ],
    { encoding: "utf8" },
  );
  if (encoded.error || encoded.status !== 0)
    throw new Error(encoded.stderr || String(encoded.error));
  const original = await fs.readFile(input);
  const optimized = await fs.readFile(temporary);
  // A second encode is only useful if it actually saves bytes.
  const selected = optimized.length < original.length ? optimized : original;
  const src = await save(name, extension, selected, original.length);
  await fs.unlink(temporary);
  return src;
}

async function copyDelivery(name, source) {
  const input = path.join(root, "public", source);
  const data = await fs.readFile(input);
  return save(name, path.extname(source).slice(1), data, data.length);
}

(async () => {
  await fs.mkdir(output, { recursive: true });
  manifest.portraitMobile = await images(
    "portrait-mobile",
    "album/ward-rain-wide-4k.jpg",
    [480, 960, 1440],
  );
  manifest.portraitDesktop = await images(
    "portrait-desktop",
    "album/ward-rain-tall-4k.jpg",
    [480, 960, 1428],
  );
  manifest.tindsLogo = {
    motion: await copyDelivery("tinds-logo-video", "work/tinds-logo-loop.mp4"),
    still: await copyDelivery(
      "tinds-logo-still",
      "work/tinds-logo-video-poster.webp",
    ),
  };
  // Preserve both existing codecs, dimensions, frame rate and palindrome duration.
  manifest.hero = {
    webm: await video("harbor-loop", "hero/main-homepage-loop.web.webm", [
      "-c:v",
      "libvpx-vp9",
      "-crf",
      "32",
      "-b:v",
      "0",
      "-deadline",
      "good",
      "-cpu-used",
      "2",
      "-row-mt",
      "1",
    ]),
    mp4: await video("harbor-loop", "hero/main-homepage-loop.web.mp4", [
      "-c:v",
      "libx264",
      "-crf",
      "26",
      "-preset",
      "slow",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
    ]),
  };
  // The 69–81 KB loader and 72 KB poster are already small; retain them as-is.
  await fs.writeFile(
    path.join(root, "content/media.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
  console.log(JSON.stringify(savings, null, 2));
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
