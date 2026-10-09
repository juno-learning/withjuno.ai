/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Next 16.4 writes an AGENTS.md into the repo on `next dev`; this project
  // already documents itself in CLAUDE.md.
  agentRules: false,
}

export default nextConfig
