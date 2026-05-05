# soom-www — hansoom.dev landing page

## Stack
- **Astro 5** (static output) + **Svelte 5** islands
- TypeScript strict
- Deployed to **Cloudflare Pages** (static, no SSR)
- Tests: Vitest (unit) + Playwright (visual regression)

## Commands
```bash
bun dev          # Dev server at localhost:4321
bun run build    # Production build → dist/
bun run preview  # Preview production build
bun run check    # Astro + Svelte type checking
bun test         # Vitest unit tests
bun run test:e2e # Playwright visual regression
```

## Visual contract
All colors come from the **Sapphire Nightfall** palette defined in `src/styles/global.css` as CSS custom properties. The canonical source is `~/ObsidianVault/hansoom/_context/DESIGN.md`. Do not introduce colors outside this palette.

## Architecture
- `src/pages/index.astro` — single landing page
- `src/layouts/BaseLayout.astro` — HTML shell with OG/meta
- `src/components/` — Svelte islands (interactive) and Astro components (static)
- `src/lib/` — shared utilities (theme, scroll helpers)
- `src/assets/diagrams/` — inline SVG diagram data
- `public/` — static assets (OG image, favicon)

## Rules
- No AI attribution in commits, PRs, or code comments.
- No colors outside the Sapphire Nightfall palette.
- All scroll animations must honor `prefers-reduced-motion`.
- Page weight ≤ 100 KB initial JS.
- All outbound links use UTM tags.
