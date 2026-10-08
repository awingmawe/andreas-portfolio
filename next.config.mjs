import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root to this project. Without it Next walks up to the
  // parent repo (which contains sibling git worktrees) and scans far more of
  // the filesystem than it needs to.
  outputFileTracingRoot: projectRoot,
  images: {
    // AVIF first, then WebP — Next serves the best format the browser
    // accepts and generates responsive widths for both the local event
    // photography and the remote stock imagery.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // /programmes was renamed to /experiences in the pre-launch pass. Keep
  // the old paths resolving so any link already shared stays alive.
  async redirects() {
    return [
      { source: "/programmes", destination: "/experiences", permanent: false },
      { source: "/programmes/:slug", destination: "/experiences/:slug", permanent: false },
      { source: "/apply", destination: "/contact", permanent: false },
      { source: "/apply/:path*", destination: "/contact", permanent: false },
      // The dossier request form was withdrawn — there is no dossier to send
      // while no programme is confirmed. Send the traffic to the contact form
      // instead of returning a 404.
      { source: "/request-dossier", destination: "/contact", permanent: false },
      // The previous site on this domain (the andreas-portfolio repo) used
      // next-intl with a locale prefix: its only pages were /en and /de, and
      // its sitemap listed both. Bookmarks, search results and browser
      // autocomplete still point there, so send them — permanently — to the
      // same page without the prefix (/en -> /, /de/about -> /about).
      { source: "/:locale(en|de)", destination: "/", permanent: true },
      { source: "/:locale(en|de)/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
