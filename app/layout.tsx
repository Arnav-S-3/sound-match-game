import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sound Match! - Accessible Audio Memory Game",
  description:
    "An inclusive, audio-first memory game designed for children with visual impairments. Find matching pairs of sounds using only keyboard navigation and audio cues.",
  keywords: [
    "accessibility",
    "audio game",
    "memory game",
    "visual impairment",
    "inclusive design",
    "keyboard navigation",
    "screen reader compatible",
  ],
  authors: [{ name: "Arnav-S-3" }],
  creator: "Arnav-S-3",
  openGraph: {
    title: "Sound Match! - Accessible Audio Memory Game",
    description:
      "An inclusive, audio-first memory game designed for children with visual impairments.",
    type: "website",
    url: "https://github.com/Arnav-S-3/sound-match-game",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sound Match! - Accessible Audio Memory Game",
    description:
      "An inclusive, audio-first memory game designed for children with visual impairments.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
