import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Paartha: GITAM exam prep",
    short_name: "Paartha",
    description: "Notes, important questions, flashcards and quizzes for GITAM exams.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#14204a",
    theme_color: "#14204a",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
