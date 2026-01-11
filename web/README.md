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

## Notes

- Use pnpm only (this repo has a `pnpm-lock.yaml`).
- `src/App.tsx` exists but is not wired to the router; use `src/pages/` instead.
- Read `AGENTS.md` before starting any task.




## DATA about Vanessa Depraute (this website user)

# Vanessa Depraute

## Professional Summary

**Senior Full-Stack JavaScript Developer** with 19+ years of experience, working professionally since 2006. Main expertise in full-stack JavaScript development, with strong secondary skills in UI/UX design, WebGL, real-time systems, and video/streaming technologies. Proven ability to design, build, and deliver complex applications end-to-end, from architecture to production. Extensive experience with large enterprise clients and international teams. Advanced practitioner of AI-assisted development and modern frontend/backend ecosystems.

---

## Key Information

* **Role**: Full-Stack JavaScript Developer (primary)
* **Status**: Freelance (open to contracts and full-time roles)
* **Location**: Paris / Saint-Maur-des-Fossés, Île-de-France, France
* **Experience**: 19 years (since 2006)

---

## Professional Titles

* Full-Stack JavaScript Developer (primary)
* UI/UX Designer (secondary)
* WebGL Developer (secondary)
* Video Broadcast & Stream Technician (secondary)

---

## Languages

* **French**: Native
* **English**: B2 – Professional working proficiency
* **Spanish**: A1 – Basic
* **Chinese (Mandarin)**: Currently learning

---

## Core Expertise

* Full-stack JavaScript architecture and development
* Real-time applications and event-driven systems
* High-performance frontend (WebGL, data visualization)
* Enterprise-grade applications and internal tools
* AI-assisted development workflows
* End-to-end project ownership (solo or team-based)

---

## Technical Skills

### JavaScript & Core Concepts

* JavaScript, TypeScript, ES10+
* Async/Await, Promises
* Dynamic Imports, Spread/Rest
* Generators, Memoization

### Frontend Frameworks & State Management

* React, Next.js
* Redux Saga, Redux Thunk, Recoil
* Custom Hooks, Context API
* React Query, TanStack Query

### UI, Design & Motion

* Tailwind CSS, Vite
* Figma, Storybook
* Framer Motion, shadcn/ui
* Material UI, Ant Design, Chakra UI
* Styled Components, Vue.js
* Adobe XD, Illustrator, Photoshop

### CSS Architecture

* CSS3, SASS / SCSS, LESS
* Flexbox, Responsive Design
* BEM, Atomic Design

### Build & Tooling

* Vite, Webpack, Parcel
* Gulp, Snowpack
* Storybook

### Graphics, WebGL & Visualization

* HTML5 Canvas
* SVG Animation
* WebGL, Babylon.js
* deck.gl, D3.js
* Mapbox, MapLibre

### Backend & APIs

* Node.js, Express
* PostgreSQL, MySQL, MongoDB
* Prisma
* GraphQL, tRPC
* Redis, Stripe

### DevOps, Cloud & Observability

* Vercel, Cloudflare
* AWS, Docker, Kubernetes
* Terraform
* GitHub Actions, CI/CD
* Datadog, Sentry

### Mobile & Cross-Platform

* React Native
* Expo, EAS
* Firebase, Ionic

### Testing & Quality

* Jest, Vitest
* Playwright, Cypress
* React Testing Library

### Version Control & Collaboration

* Git, GitHub, GitLab, Bitbucket
* Jira, Trello, Notion
* Agile / Scrum

---

## AI & Machine Learning Ecosystem

### LLM Providers

* OpenAI, Anthropic, Mistral AI, DeepSeek
* Google Gemini, xAI, Cohere
* Perplexity, Groq, Together AI

### AI Development Tools

* GitHub Copilot
* Cursor
* Claude Code
* AugmentCode
* Continue, Codeium, Tabnine
* Warp, Replit, v0.dev, Cody
* AntiGravity

### AI Infrastructure & Tooling

* OpenRouter
* Langfuse, LangSmith
* Pinecone, Weaviate, Qdrant, Chroma
* pgvector, Milvus
* LangChain, LlamaIndex
* Hugging Face

### Open-Source Models & Runtimes

* Meta LLaMA
* Mistral (7B)
* vLLM, Ollama
* Stability AI
* OpenRouter-hosted OSS models

---

## Professional Experience

### Full-Stack Web Developer — Freelance

**Paris, France | 2010 → Present**

Design and development of custom business applications, internal tools, CRMs, live video interfaces, real-time dashboards, websites, and e-commerce platforms. Responsible for full project lifecycle: architecture, development, deployment, and maintenance. Frequent collaboration with designers, developers, and non-technical stakeholders, as well as full autonomy on solo projects.

---

### Front-End & WebGL Developer — Kogama / ABOX

**Stockholm, Sweden | 2020 → 2022**

* Development of real-time multiplayer features using React and WebGL
* WebGL rendering optimizations (reduced draw calls, improved FPS)
* In-game monetization components
* 3D user interfaces, menus, and model selectors
* Migration and refactoring toward Babylon.js
* Tooling standardization (Prettier, coding conventions)
* Work within a fully distributed international team

---

### Video Broadcast & Stream Technician — Livee & Partners

**Paris, France | 2005 → Present**

* Professional live streaming setups
* Real-time overlays and audience interactions
* Corporate and large-scale event production
* Multi-platform live broadcasting
* Real-time technical support and audiovisual supervision

---

## Career Timeline

* **2005**: Entry into video production, event management, and graphic design
* **2006**: Self-taught web development beginnings
* **2009**: Formal JavaScript training
* **2010–2018**: Enterprise business applications, large accounts, international missions
* **2020–2022**: Front-End & WebGL Developer at Kogama (Stockholm)
* **2023–Present**: Modern stack (Next.js, Tailwind, shadcn/ui) and AI-assisted development

---

## Selected Projects

### Out Of Burn — 2025

AI-assisted wellness and burnout-prevention mobile application featuring journaling, emotional tracking, and weekly analysis.

**Tech stack**: React Native, Expo, Supabase, LLMs, RAG

---

### Real-Time Emoji Reaction Overlay

Real-time emoji reaction overlay system for live video platforms (Twitch, TikTok-style). Includes admin dashboard, spectator interface, chat system, and AI-powered analytics.

**Tech stack**: React, Next.js, WebSocket, Node.js

---

### Event Applications Suite (Livee)

Set of professional event-management applications including event scanning, CRM, and global administration tools. Production systems currently undergoing a Next.js 15 refactor.

**Tech stack**: React, Next.js, Tailwind CSS, shadcn/ui

---

### Chat System & Event Platform

End-to-end chat and event management platform designed and built independently.

**Tech stack**: React, Next.js, Node.js, MongoDB

---

### Kogama / ABOX Gaming Platform

Development of in-game monetization components, 3D menus, model selectors, and WebGL performance optimizations. Migration toward Babylon.js and codebase standardization.

**Tech stack**: React, WebGL, Babylon.js

---

### High-Performance Cartographic Data Visualization

R&D projects focused on large-scale, high-performance cartographic data visualization and dynamic overlays.

**Tech stack**: deck.gl, Mapbox, MapLibre

---

## Key Strengths

* Primary expertise in full-stack JavaScript development
* Strong secondary skills in UI/UX, WebGL, and real-time systems
* Deep experience with enterprise and institutional clients
* Full project ownership from concept to production
* High productivity enabled by AI-assisted workflows

---

## Soft Skills

* Creative problem-solving
* Fast learner with strong technical curiosity
* Team-oriented mindset
* High attention to detail and code quality
* Clear communication with technical and non-technical stakeholders
* Autonomy, reliability, and accountability

---

## Key Figures

* 19+ years of professional development
* 11+ years of full-stack JavaScript
* 20 years in video and event production
* 15 years as a freelancer
* 2 years of international experience (Stockholm)
* 50+ enterprise and institutional clients
