import type { Metadata } from "next";
import {
  Playfair_Display,
  Crimson_Pro,
  IBM_Plex_Mono,
  Lexend,
  Manrope,
} from "next/font/google";
import "./globals.css";
import "./site.css";

const display = Playfair_Display({
  variable: "--font-display-next",
  subsets: ["latin"],
  weight: "700",
});

const body = Crimson_Pro({
  variable: "--font-body-next",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono-next",
  subsets: ["latin"],
  weight: "400",
});

// TINDS lane: Lexend headings + Manrope body, scoped to the TINDS case page.
const tindsHeading = Lexend({
  variable: "--font-tinds-heading",
  subsets: ["latin"],
  weight: "500",
});

const tindsBody = Manrope({
  variable: "--font-tinds-body",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Rafiul Haider — Data Science, Research, Content",
  description:
    "Portfolio of Rafiul Haider: Pace MSc Data Science candidate. Research, data analysis, and content that people can act on.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} ${tindsHeading.variable} ${tindsBody.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
