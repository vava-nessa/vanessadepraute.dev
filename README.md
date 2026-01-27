# vanessadepraute.dev

Portfolio website for **Vanessa Depraute** - Senior Full-Stack JavaScript Developer with 19+ years of experience. Specializing in React, TypeScript, WebGL, and real-time systems. Based in Paris, France.

> 💼 For complete professional profile, experience, and client portfolio, see [VAVA_PROFILE.md](./VAVA_PROFILE.md)

Frontend app built with Vite + React + TypeScript.

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

- Entry point: `src/main.tsx` (RouterProvider, ThemeProvider, Vercel Analytics)
- Routing: `src/routes.tsx`
  - `/` renders `HomePage` (English version, no redirect)
  - `/fr` renders `HomePage` (French version)
  - `/blog` renders `BlogPage` (English version)
  - `/fr/blog` renders `BlogPage` (French version)
  - `/en` and `/en/blog` redirect to `/` and `/blog` (301 permanent redirects for SEO compatibility)
  - `*` renders `NotFoundPage`
- Layout: `src/components/Layout/Layout.tsx` wraps pages and adds a global blur layer.
- i18n: `src/i18n/config.ts` + `src/locales/en.json` and `src/locales/fr.json`.
  - Language detection: based on URL path (`/fr/*` = French, otherwise = English)
  - No automatic redirects (SEO-friendly approach)
- SEO: `src/components/SEOHead/SEOHead.tsx` manages multilingual SEO
  - Automatically generates `hreflang` tags for language alternatives
  - Helps Google understand and index both language versions
  - Included in `HomePage` and `BlogPage`
- Theme: `src/contexts/ThemeContext.tsx` toggles `dark-mode` / `light-mode` on `documentElement`.
- Styling: Tailwind v4 + custom CSS (`src/index.css`, `src/App.css`, and component CSS files).
  - **Brand Colors**: defined in `src/index.css` as `--color-primary` and `--color-secondary`.
  - **Single Source of Truth**: These CSS variables are the ONLY source of truth for brand colors. Do not hardcode hex values in components or CSS. Change them in `index.css` to update the entire app.
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

## Internationalization & SEO

### URL Structure

The site uses a clean, SEO-friendly URL structure:

- **English (default)**: `/` and `/blog`
- **French**: `/fr` and `/fr/blog`
- **Legacy redirects**: `/en/*` → `/*` (301 permanent redirects)

### Language Detection

Language is detected from the URL path in each page component:
- Pages use `useLocation()` to detect if the path starts with `/fr`
- If detected, `i18n.changeLanguage("fr")` is called
- Otherwise, defaults to English

### SEO Implementation

**Component**: `src/components/SEOHead/SEOHead.tsx`

Automatically generates `hreflang` tags for multilingual SEO:

```html
<link rel="alternate" hreflang="en" href="https://vanessadepraute.dev/" />
<link rel="alternate" hreflang="fr" href="https://vanessadepraute.dev/fr" />
<link rel="alternate" hreflang="x-default" href="https://vanessadepraute.dev/" />
```

This tells Google:
- The relationship between language versions
- Which version to show for each language preference
- The default version for unmatched languages

### Benefits

- ✅ No redirect on root path (Google can index `/`)
- ✅ Clean URLs without language prefixes for English
- ✅ Proper `hreflang` tags for international SEO
- ✅ 301 redirects preserve existing `/en` links
- ✅ Standard web convention (root = primary language)

## Dynamic Sitemap & Build Date

The site automatically generates SEO metadata at build time.

### Sitemap Generation

**File**: `vite.config.ts` (sitemapPlugin)

A Vite plugin generates `sitemap.xml` during each build with the current date as `lastmod`. This signals to Google that the site is actively maintained.

- Automatically updates `lastmod` to the build date
- Includes all pages with proper `hreflang` tags
- No manual maintenance required

### Last Update Display

**Files**: `src/components/Footer/Footer.tsx`, `src/components/Layout/Layout.tsx`

The footer displays a discrete "Last update" timestamp that updates on every build:
- English: "Last update: [Month Day, Year at Time]"
- French: "Dernière mise à jour : [Jour Mois Année à Heure]"

The build date is injected via Vite's `define` option (`BUILD_DATE` constant) and automatically formatted based on the current language.

## Layout Effects

### Blur Fade on Scroll

**File**: `src/components/Layout/Layout.tsx`

The bottom blur effect (`GradualBlur` component) fades out progressively when approaching the end of the page:
- Full opacity when far from bottom
- Starts fading at 400px from bottom
- Fully invisible at 100px from bottom

This creates a smoother experience and reveals the footer content without overlay.

## Tooling and config

- Vite config: `vite.config.ts` (alias `@` -> `src`, `.glb` asset handling).
- Tailwind config: `tailwind.config.js`.
- shadcn/ui config: `components.json`.
- ESLint config: `eslint.config.js`.

## Deployment

- `vercel.json` disables git deployments and sets a Basic-Auth header for all routes.

## Error Handling

The project uses a comprehensive error handling strategy with Sentry for monitoring.

### Architecture

- **Sentry**: Configured in `src/main.tsx` for error tracking, session replays, and performance monitoring
- **ErrorBoundary**: `src/components/ErrorBoundary/ErrorBoundary.tsx` catches React rendering errors
- **Hooks**: `src/hooks/useErrorHandler.ts` provides `useErrorHandler` and `useAsyncError`
- **Utilities**: `src/utils/errorHandling.ts` provides `captureError`, `safeAsync`, `safeSync`, `logMessage`

### Usage

#### useErrorHandler Hook

```tsx
import { useErrorHandler } from "@/hooks/useErrorHandler";

function MyComponent() {
  const { handleError, isError, getErrorMessage } = useErrorHandler("MyComponent");

  useEffect(() => {
    try {
      // Your code
    } catch (error) {
      handleError(error, { action: "fetch_data" });
    }
  }, [handleError]);
}
```

#### useAsyncError Hook

```tsx
import { useAsyncError } from "@/hooks/useErrorHandler";

function MyComponent() {
  const { executeAsync, isLoading, isError } = useAsyncError("MyComponent");

  const fetchData = async () => {
    const result = await executeAsync(
      async () => await fetch("/api/data").then(r => r.json()),
      { action: "fetch_data" }
    );
  };
}
```

#### Utility Functions

```typescript
import { captureError, safeAsync, safeSync, logMessage, ErrorSeverity } from "@/utils/errorHandling";

// Manual error capture
captureError(error, { component: "MyComponent", action: "user_action" }, ErrorSeverity.Error);

// Safe wrappers
const result = await safeAsync(() => fetchData(), { action: "fetch" });
const value = safeSync(() => JSON.parse(data), { action: "parse" });

// Logging
logMessage("User completed action", ErrorSeverity.Info, { userId: "123" });
```

### Best Practices

1. **Wrap risky operations** in try-catch (localStorage, JSON.parse, API calls)
2. **Use hooks** (`useErrorHandler`, `useAsyncError`) in React components
3. **Add context** to errors (action, component, relevant data)
4. **Don't over-catch**: Let ErrorBoundary handle rendering errors

### Translations

Error UI messages are in `src/locales/{en,fr}.json` under the `errors` key.

## Projects Section

The homepage features a dedicated projects section showcasing featured work.

### Architecture

- **Component**: `src/components/ProjectCard/ProjectCard.tsx` - Reusable project card with Apple Card design
- **Data**: Project information stored in `src/locales/{en,fr}.json` under the `projects` key
- **Integration**: Rendered in `HomePage.tsx` within the LightRays section

### Project Data Structure

```json
{
  "projects": {
    "title": "Featured Projects",
    "subtitle": "Recent work and ongoing projects",
    "items": [
      {
        "id": "projectId",
        "link": "https://example.com",
        "github": "https://github.com/user/repo",
        "name": "Project Name",
        "year": "2025",
        "status": "In Development",
        "description": "Project description...",
        "techStack": ["React", "Next.js", "..."],
        "highlights": ["Feature 1", "Feature 2", "..."]
      }
    ]
  }
}
```

### Features

- **Dark/Light Mode**: Automatic theme detection and styling
- **Responsive Design**: 3-column desktop, 2-column tablet, 1-column mobile
- **Status Badges**: Color-coded badges (In Development, Production, etc.)
- **Tech Stack Tags**: Display technologies used in each project
- **Glassmorphism**: Apple Card-inspired design with backdrop blur
- **Project Images**: Optional image display with zoom hover effect
- **Project Links**: "View Project" and "Source Code" buttons with icons (Lucide React)
- **Hover Effects**: Card lift animation and image zoom on hover

### Adding a New Project

1. Add project data to `src/locales/en.json` and `src/locales/fr.json` under `projects.items`
2. Include all required fields: `name`, `year`, `status`, `description`, `techStack`, `highlights`
3. (Optional) Add `id`, `link`, and `github` fields:
   - `id`: Unique identifier used to map to images in `HomePage.tsx` (e.g., `"outOfBurn"`)
   - `link`: External project URL (displays "View Project" button)
   - `github`: GitHub repository URL (displays "Source Code" button)
4. If adding an image, import it in `HomePage.tsx` and add to the `projectImages` mapping
5. The component will automatically render the new project with all features

## 3D Model Viewer

The website features an interactive 3D model viewer (`src/components/ModelViewer/ModelViewer.tsx`) that adapts to the user's device.

### Features

- **Adaptive Input**: Automatically detects device type and uses appropriate input method
  - **Desktop**: Mouse movement controls model rotation
  - **Mobile**: Gyroscope/device orientation controls model rotation
- **Smooth Interpolation**: Both input methods use smooth lerp-based transitions
- **Permission Handling**: Automatically requests DeviceOrientation permission on iOS 13+ devices
- **Configurable**: Extensive camera and interaction configuration options

### Usage Example

```tsx
<ModelViewer
  modelPath="/toon_cat_free.glb"
  playAnimation={true}
  cameraConfig={{
    followMouse: true,           // Enable mouse/gyroscope following
    mouseFollowSpeed: 0.2,       // Interpolation speed (0-1)
    mouseFollowRange: 0.45,      // Max rotation range in radians
    mouseFollowAxis: 'both'      // 'x', 'y', or 'both'
  }}
/>
```

### Mobile Gyroscope

On mobile devices, the component:
1. Detects mobile via user agent and screen width
2. Requests DeviceOrientation permission (required for iOS 13+)
3. Maps device tilt angles (beta/gamma) to model rotation
4. Uses the same smooth interpolation as desktop mouse movement

The gyroscope sensitivity is automatically calibrated for natural interaction.

## Documentation

The codebase follows a comprehensive documentation strategy:

### JSDoc Headers

All source files include JSDoc headers with:
- `@file` - Filename and emoji identifier
- `@description` - Comprehensive explanation of what the file does and why
- `@functions` - List of exported functions (using `→` bullets)
- `@exports` - What the file exports
- `@see` - Related files when relevant

### Inline Comments

Code is annotated with inline comments using the 📖 emoji prefix:
- Explain the "why" and "how" of complex logic
- Document configuration options and their purpose
- Clarify architectural decisions
- Note gotchas and edge cases

### Documentation Standards

- **Language**: All documentation is in English
- **Format**: Plain english sentences, not terse abbreviations
- **Purpose**: Focus on explaining context and reasoning, not just describing what code does
- **Consistency**: Use 📖 emoji for all inline comments

Example:
```tsx
/**
 * @file HomePage.tsx
 * @description 🏠 Main homepage component - Portfolio landing page
 *
 * This is the primary landing page showcasing projects, skills, and bio.
 *
 * @functions
 *   → HomePage → Main component rendering the portfolio page
 *
 * @exports default - HomePage component
 */

// 📖 Error handling integration for Sentry reporting
const { handleError } = useErrorHandler("HomePage");
```

## Notes

- Use pnpm only (this repo has a `pnpm-lock.yaml`).
- `src/App.tsx` exists but is not wired to the router; use `src/pages/` instead.
- Read `AGENTS.md` before starting any task.

## About This Portfolio


This portfolio site is built with modern web technologies and best practices:

- **Tech Stack**: Vite + React + TypeScript + Tailwind CSS v4
- **Features**: Multilingual (EN/FR), Dark/Light mode, 3D models, SEO optimized
- **Performance**: Code-splitting, lazy loading, optimized assets
- **Quality**: Sentry error tracking, comprehensive error handling
- **Documentation**: All code documented with JSDoc and inline comments

For questions or collaboration inquiries, visit the website to get in touch!
