# vanessadepraute.dev

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
- English: "Last update: January 27, 2026 at 3:45 PM"
- French: "Dernière mise à jour : 27 janvier 2026 à 15h45"

The build date is injected via Vite's `define` option (`BUILD_DATE` constant).

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





Contenu brouillon (à ne pas prendre en compte mais informer l'utilisatrice qu'il faut se pencher dessus)




Vanessa Depraute

designer - coder

UI/UX Design & Front End Developer

interessant, tickets, chefs de projets, insights analytics etc 

40 ans

French : Native
English level : B2
Espagnol : A1
learning portuguese and chineese
Expérience

Full Stack Web Developer
Freelance Work
Paris, France
2010-Present
Worked for many customers blablah



Front-end & WebGL Developer
Kogama
Stockholm, Sweden
2020-2022
Engineered real-time multiplayer gaming features using React.js and WebGL, driving performance improvements and user experience enhancements.



Video Broadcast & Stream Technician
Livee & other video broadcast companies
2005-Present

Total, Orange, Canal +, Airbus, DELL, L'oréal, Carrefour, SNCF,
Renault, AXA, La Poste, TF1, SPIE, SENSIOLABS, Auchan, BPCE, 
Radio France, Vinci, Allianz, Caisse des Dépôts and many more…



Pas de formation, j’ai appris par le graphisme to dev
j’ai pas un parcours classique je m’y suis interessée et j’ai progressivement migré vers ce métier, années aprés années
mission que j’ai fait petit à petit j’ai travaillé avec des developpeurs chauds qui m’ont appris puis j’ai été ensuite autonome pour faire des projets seule, notamment avec livee


Factuel : mission / clients
webinar, networking, SPIE / Total / Labos pharmaceutiques / CRM : petites applis, youtuble - like pour EDF, google keep like, etc…
pour certains projets je collaborais avec des designers et d’autres dev, pour d’autres je fais tout.

Likely

Suéde : abox/kogama : composants sur la monétisation, les menus d’options du jeu, un menu de selection de briques et de modéles 3D, optimisation du rendu (fort gain de FPS) du aux draw calls, et une mauvaise config, migration vers babylonjs, standardisé l’utilisation de prettier, etc,

 travail en équipe à l’étranger

Likely : emojis reactions : admin/client/messages/stats

réactions emojis en overlay sur un live vidéo, un peu comme sur twitch, tiktok etc…

analyse des stats via ia


appli de scan d’event livee conf.app

CRM 

et event app

Chat system, event app : entiérement developpé seule, utilisée parfois par des grands groupes, par le biais de boite de vidéo pour qui je travaille, je suis actuellement en train de la refaire entiérement sur nextjs, tailwind, shadcn


projet perso en cours sur 
deck.gl  / mapbox  / maplibre / 




VERCEL

Technos utilisées, front ?

poser des questions intelligentes sur l’indexation des data 

Pouvez-vous décrire l'architecture sous-jacente de l'indexation des data dans votre plateforme ? Quelles technologies ou algorithmes utilisez-vous pour garantir une recherche rapide et précise ?"
"Comment gérez-vous la synchronisation des données provenant de sources multiples (Notion, Slack, GitHub, etc.) pour les indexer de manière cohérente ?"
"Comment assurez-vous l’actualisation en temps réel de l’index des données lorsque des modifications sont apportées aux documents ou aux flux de travail ?"
"Quelles stratégies mettez-vous en œuvre pour optimiser la performance et minimiser la latence lors de l’interrogation de grands volumes de données ?"


problématique de données française avec des IA agnostic etc

des missions qui ressemblent à ce qu’il me demande : 
j’utilise bcp cursor/copilot/windsurf

petite friction au démarrage de votre projet mais un gain de temps ensuite monstrueux, je pense que les efforts devraient se focus un petit peu sur la réduction de cette friction pour réduire le drop d’utilisation en début de projet



Amélioration de l’UI notamment sur ci et ça

idées démo/wizard

peut etre créer des custom buttons ou autre chose que le language naturel pour interagir avec ces données : morning overview, weekly overview, “ou en est ce projet?” etc 

Intégration d’un système de suggestions proactives
👉 L’interface pourrait analyser l’historique et le contexte pour proposer automatiquement des actions ou des améliorations à l’utilisateur (ex. “Essayez de consulter vos rapports de performance via l’onglet Analytics”). l’ia pourrait, aprés indexation des données, réfléchir a quelque chose de pertinent et le proposer aux users lors des premiers jours d’utilisation de dust

Gamification pour personnes non technique


Texte d’intro 

Hello World! 👋🏻 
Web developer with over 10 years of experience, I have had the opportunity to participate in numerous back-end and front-end projects for both large corporations and small startups. I help you develop your tech product: Specialized in web/mobile app development challenges, I support you through all stages of your application creation, and I can also assist with your existing projects. Self-taught, I am always seeking new challenges to expand my knowledge and continuously train myself in the latest technologies to improve the products I develop. 
Diligent and thorough, I take pride in delivering quality work within allocated timeframes. Creative and highly attentive to your expectations and needs, I bring strong proposals to help improve your project and its implementation. 




Contact me to connect via Google Meet over a nice coffee to discuss your project or just talk tech - it's always a pleasure! ☕️



clients pour qui j’ai bossé a classer

2014 
2015
2016
2017
2018
Fortunéo
Orange
Malakoff Médéric
Conseil Général du Val d’oise
P.M.U
Nétinéo 
Renault
Eurohealth
Otsuka
Arsep
ADIE
Cegos
Allianz
Formations Buralistes
GL Events
Janssen
Axis
Radio France
Barreau de Paris
La Tribune
Total
CNES
Smart Pitchfork Festival


Larena Santé
Satis
CapCom
Terre d’Azur
Caisse d’epargne
Look Voyages
Caldeyris
SNCF
Heavent
Ibis
La Poste Immobilier
BabyMoov
Bordeaux Chesnel
Ministére des finances
CNAV
Canal +
Invivo
ENGIE
Daher
DLL Athlon
EPMA
AFER
TF1
ING DIRECT
UCANNS
ERDF
PILEJE
SPIE
SENSIOLABS
OPERA DE PARIS


CNAF
CSC
ECHOSENS
ARRAHLM
CARE-INSIGHTS
CITYA
SANOFLORE
ROYAL CANIN
AUCHAN
CAISSE DES DEPOTS
BPCE


Renault Alpine
CNIEL
Carrefour
Conseil Général  Pays de la loire
Ville d’Antony
Vinci
DELL
Azilis
EDHEC (Amsterdam)


Loréal
TDF
Synerpa
Suez
Just’ Debout
AXA
Pole Emploi
Airbus
Epson






Parcours 
mettre sur quoi j’ai bossé



Travaillé dans la vidéo  / Evenementiel / Graphiste depuis 2005

2012 J’ai commencé à évoluer vers le code en commençant par des sites wordpress / ecommerce

2015 

2016 USA Orlando etc

2021 *




derniéres missions




---

**Vanessa Depraute**
