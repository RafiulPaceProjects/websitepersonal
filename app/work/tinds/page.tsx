import type { Metadata } from "next";
import { TindsCase } from "@/components/tinds-case";
import { tinds } from "@/content/tinds";
import "./tinds.css";

export const metadata: Metadata = {
  title: `TINDS — ${tinds.role} — Rafiul Haider`,
  description:
    "Rafiul Haider at TINDS Media: diaspora stories, entrepreneur spotlights, and the B2B promotion packages that fund the journalism.",
};

export default function TindsPage() {
  return <TindsCase />;
}
