import { profile } from "@/content/site";

export function Footer() {
  return (
    <footer className="foot-mast">
      <p className="wordmark">{profile.name}</p>
      <p className="tagline">{profile.tagline}</p>
      <p className="links">
        <a href={`mailto:${profile.email}`}>Email</a>
        {" · "}
        <a href={profile.linkedin}>LinkedIn</a>
        {" · © 2026"}
      </p>
    </footer>
  );
}
