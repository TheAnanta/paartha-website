import type { NextConfig } from "next";

const config: NextConfig = {
  // The app's legal screens load `<LEGAL_BASE_URL>/terms.html` and `/privacy.html`; serve those from the same live pages, chromeless.
  async rewrites() {
    return [
      { source: "/terms.html", destination: "/terms?embed=1" },
      { source: "/privacy.html", destination: "/privacy?embed=1" },
    ];
  },
};
export default config;
