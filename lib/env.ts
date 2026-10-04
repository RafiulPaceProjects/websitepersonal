// Public values are inlined at build time; server values are read only on the server.
const trimSlash = (value: string) => value.replace(/\/+$/, "");

export const publicEnv = {
  siteUrl: trimSlash(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  mediaBaseUrl: trimSlash(process.env.NEXT_PUBLIC_MEDIA_BASE_URL || ""),
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "",
};

/** Resolves a media path against the media CDN, or /public when none is set. */
export const mediaUrl = (path: string) =>
  `${publicEnv.mediaBaseUrl}/${path.replace(/^\/+/, "")}`;

/** Contact delivery settings, or null when the form should fall back to mailto. */
export function getContactEnv() {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  return apiKey && to && from ? { apiKey, to, from } : null;
}

/** Prefixes a /public path with the deploy base path (GitHub Pages serves the
 *  site under /websitepersonal). Empty locally, so dev paths are unchanged. */
export const asset = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
