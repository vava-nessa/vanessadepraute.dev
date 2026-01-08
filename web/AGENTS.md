# AGENTS

Always read this file before starting any task in this repo.

## Non-negotiables

- **CRITICAL**: It is very important to read the README files and strictly follow their indications.
- **ALWAYS** read the README and **ALWAYS** use pnpm only (no npm, no yarn).
- This repo can host multiple apps; this file documents the website in this folder.
- Paths below are relative to this `web/` folder unless they start with `../`.

## Architecture summary

- Entry point: `src/main.tsx` (RouterProvider, ThemeProvider, Vercel Analytics).
- Routing: `src/routes.tsx`.
  - `/` redirects to `/en`.
  - `/:lang` renders `HomePage`.
  - `/:lang/blog` renders `BlogPage`.
  - `*` renders `NotFoundPage`.
- Layout: `src/components/Layout/Layout.tsx` wraps pages and adds a global blur layer.
- i18n: `src/i18n/config.ts` with `src/locales/en.json` and `src/locales/fr.json`.
- Theme: `src/contexts/ThemeContext.tsx` toggles `dark-mode` / `light-mode` on `documentElement`.
- Styling: Tailwind v4 plus custom CSS in `src/index.css`, `src/App.css`, and per-component CSS.
- Assets:
  - `public/` for static files served as-is.
  - `src/assets/` for bundled imports used by components.
- Alias: `@` resolves to `src` (see `vite.config.ts`).

## Project map

- `src/pages/` - route-level pages.
- `src/components/` - site-specific components.
- `src/components/ui/` - shared UI primitives/effects.
- `src/components/magicui/` and `src/registry/magicui/` - animated UI elements.
- `src/TerminalDemo.tsx` and `src/components/TerminalInterests.tsx` - terminal-style content blocks.

## Content and copy

- Most copy lives in `src/locales/en.json` and `src/locales/fr.json`.
- Keep both locales in sync when editing user-facing text.

## Tooling and config

- Vite config: `vite.config.ts`.
- Tailwind config: `tailwind.config.js`.
- shadcn/ui config: `components.json`.
- ESLint config: `eslint.config.js`.

## Documentation

- **ALWAYS** document new features directly in `README.md`.
- **NEVER** create separate `.md` files for documentation unless the user explicitly requests it.
- Keep documentation concise but complete with usage examples.

## Testing

- **IMPORTANT**: Always run `pnpm build` at the end of each task to verify that the code compiles correctly and there are no type errors.

## Deployment

- `../vercel.json` disables git deployments and sets a Basic-Auth header for all routes.
