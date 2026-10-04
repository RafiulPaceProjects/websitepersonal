import { profile } from "@/content/site";
import { brand } from "@/content/brand";

const links = [
  { label: "Work", href: "#work" },
  { label: "Background", href: "#background" },
  { label: "Contact", href: "#contact" },
];

export function Masthead() {
  return (
    <header className="nav-mast">
      <p className="mast-line">Portfolio · 2026 · {profile.location}</p>
      <p className="mast-name">{brand.wordmark}</p>
      <nav className="mast-nav" aria-label="Primary">
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <hr className="mast-rule double" aria-hidden="true" />
    </header>
  );
}
