# web

Frontend app for vanessadepraute.dev (Vite + React + TypeScript).

## Quick start (pnpm only)

```bash
pnpm install
pnpm dev
```

## Scripts

- `pnpm dev` - local dev server
- `pnpm build` - typecheck + production build
- `pnpm lint` - lint the codebase
- `pnpm preview` - preview production build

## Architecture (high level)

- App root: this folder (`web/` at repo root)
- Entry point: `src/main.tsx` (RouterProvider, ThemeProvider, Vercel Analytics)
- Routing: `src/routes.tsx`
  - `/` redirects to `/en`
  - `/:lang` renders `HomePage`
  - `/:lang/blog` renders `BlogPage`
  - `*` renders `NotFoundPage`
- Layout: `src/components/Layout/Layout.tsx` wraps pages and adds a global blur layer.
- i18n: `src/i18n/config.ts` + `src/locales/en.json` and `src/locales/fr.json`.
- Theme: `src/contexts/ThemeContext.tsx` toggles `dark-mode` / `light-mode` on `documentElement`.
- Styling: Tailwind v4 + custom CSS (`src/index.css`, `src/App.css`, and component CSS files).
- Assets:
  - `public/` for static files served as-is.
  - `src/assets/` for bundled assets imported by components.

## Project map

- `src/pages/` - route-level pages (Home, Blog, NotFound)
- `src/components/` - site-specific UI
- `src/components/ui/` - shared UI primitives and effects
- `src/components/magicui/` and `src/registry/magicui/` - animated UI elements
- `src/TerminalDemo.tsx` and `src/components/TerminalInterests.tsx` - terminal-style content blocks
- `src/contexts/ThemeContext.tsx` - theme state and persistence
- `src/i18n/config.ts` - language setup (route-driven)

## Tooling and config

- Vite config: `vite.config.ts` (alias `@` -> `src`, `.glb` asset handling).
- Tailwind config: `tailwind.config.js`.
- shadcn/ui config: `components.json`.
- ESLint config: `eslint.config.js`.

## Deployment

- `../vercel.json` disables git deployments and sets a Basic-Auth header for all routes.

## Notes

- Use pnpm only (this repo has a `pnpm-lock.yaml`).
- `src/App.tsx` exists but is not wired to the router; use `src/pages/` instead.
- Read `AGENTS.md` before starting any task.
