# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Juno AI landing page — a Next.js 15 app (App Router) built with TypeScript, React 19, and Tailwind CSS v4. Single-page marketing site for an education AI startup. No backend, database, or auth.

## Commands

- **Dev server**: `pnpm dev`
- **Build**: `pnpm build`
- **Lint**: `pnpm lint` (ESLint)
- **Start prod**: `pnpm start`

## Architecture

- **`app/`** — Next.js App Router. `page.tsx` is a single client component containing the entire landing page (banner, hero with animated markdown, contact form, footer).
- **`components/ui/`** — shadcn/ui components (new-york style). Add new ones via `npx shadcn@latest add <component>`.
- **`components/theme-provider.tsx`** — next-themes wrapper for dark/light mode.
- **`lib/utils.ts`** — `cn()` helper (clsx + tailwind-merge).
- **`hooks/`** — `use-mobile.ts` (breakpoint detection), `use-toast.ts`.

## Key Technical Details

- **Tailwind CSS v4** with `@theme inline` syntax in `app/globals.css`. Design tokens defined as CSS custom properties (primary: #3366FF, accent: #33A9FF).
- **Path alias**: `@/*` maps to project root.
- **`next.config.mjs`**: `typescript.ignoreBuildErrors: true`, `images.unoptimized: true`.
- **Contact form** submits to Web3Forms API (`https://api.web3forms.com/submit`).
- **Notable libraries**: `flowtoken` (animated markdown streaming), `@paper-design/shaders-react` (dithering background effect), Radix UI primitives.
- **Fonts**: Geist Sans, Geist Mono, JetBrains Mono, Silkscreen (loaded via `next/font`).
