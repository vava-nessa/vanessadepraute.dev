# Project TODO

> [!IMPORTANT]
> This document must be kept up-to-date. As tasks are completed, mark them with `[x]`.
> Break down large tasks into smaller sub-tasks where appropriate to make them easy to follow.

## 🎯 10 Critical Major Ideas to Finish Perfectly

### 1. Replace ALL Placeholder Content 🚨
**Critical Issue**: Multiple placeholder texts and links are currently visible to visitors.
- [x] Update `outOfBurn` description in `en.json` (currently contains Lorem Ipsum)
- [x] Update `outOfBurn` description in `fr.json` (currently contains Lorem Ipsum)
- [x] Update `Footer.tsx` social links (currently pointing to google.com or example)
    - [x] LinkedIn (`https://linkedin.com/in/YOUR_PROFILE`)
    - [x] GitHub (`https://github.com/YOUR_USERNAME`)
    - [x] WhatsApp (`https://wa.me/YOUR_PHONE_NUMBER`)
    - [x] Email (`mailto:YOUR_REAL_EMAIL`)

### 2. Remove Development/Debug Elements 🐛
**Warning**: Production Blocker - Debug buttons are visible.
- [x] Remove or hide "🐛 Break the world" button in `HomePage.tsx`
- [x] Remove or hide "⚡ Async Error" button in `HomePage.tsx`
- [ ] (Recommendation) Create a separate debug page at `/:lang/debug`

### 3. Add Real Project Visuals 🎨
**Important**: "Out Of Burn" section has a black placeholder box.
- [x] Replace black box in `HomePage.tsx` (lines 313-315) with real image (`out_of_burn_ui.png`)
- [ ] Add screenshots/mockups for "Out Of Burn" (Additional views if needed)
- [ ] Add logo/branding visual
- [ ] Consider adding visuals to Projects section cards to replace text-only look

### 4. Enhance SEO & Meta Tags 🔍
**Important**: Missing critical SEO elements.
- [ ] Add Meta Tags to `index.html`
    - [ ] `og:type` (website)
    - [ ] `og:url`
    - [ ] `og:title`
    - [ ] `og:description`
    - [ ] `og:image`
    - [ ] Twitter Card metadata (`twitter:card`, `twitter:site`, etc.)
- [ ] Add Structured Data (JSON-LD) for Person schema in `index.html` head
- [ ] Create and add OG image (1200x630px) to `/public`
- [ ] Implement dynamic meta tags per language route (using `react-helmet-async` or similar if needed for dynamic head updates)

### 5. Improve Projects Section Presentation 📊
**Note**: Enhance engagement by adding visuals to the projects list.
- [ ] Update Data Structure in `en.json` & `fr.json`
    - [ ] Add `image` field to project items
    - [ ] Add `link` field (demo/github) to project items
- [ ] Update `ProjectCard.tsx` component
    - [ ] Render project image/icon
    - [ ] Render "View Project" or GitHub links
    - [ ] Add hover effects (lift animation, overlay)
- [ ] (Optional) Add Filters (by status, tech, year)

### 6. Add Analytics & Performance Monitoring 📈
**Note**: Track visitor behavior.
- [ ] Verify Vercel Analytics setup in `main.tsx` (Confirm `<Analytics />` present)
- [ ] (Optional) Add Google Analytics 4
    - [ ] Create generic `AnalyticsProvider` component
    - [ ] Implement tracking for custom events (e.g., Contact button clicks)
- [ ] Perform Web Vitals tracking (LCP, CLS, FID checks)

### 7. Optimize Performance & Loading ⚡
**Tip**: Ensure fast load times.
- [ ] Optimize 3D Model loading
    - [ ] Implement skeleton screens / loading spinner for Three.js canvas
    - [ ] Progressive loading for heavy assets
- [ ] Optimize Images
    - [ ] Ensure all images use WebP/AVIF
    - [ ] Add blur placeholders
    - [ ] Implement responsive images with `srcset`
- [ ] Implement Code Splitting
    - [ ] Lazy load `ModelViewer` component
    - [ ] Lazy load `TechStackExtended` component
- [ ] Optimize Font Loading (adjust `font-display`)

### 8. Enhance Accessibility (a11y) ♿
**Important**: Inclusive Design.
- [ ] Improve Focus Management
    - [ ] Add visible focus indicators for keyboard users
    - [ ] Ensure logical tab order
- [ ] Enhance Screen Reader Support
    - [ ] Add ARIA labels to icon-only buttons
    - [ ] Ensure all images have meaningful `alt` text
- [ ] Check Color Contrast (WCAG AA compliance for text/backgrounds)
- [ ] Respect Motion Preferences (disable animations if `prefers-reduced-motion` is set)

### 9. Add Contact Form or Booking System 📧
**Note**: Lead Generation.
- [ ] Decide on approach: Simple Form vs Calendly vs Hybrid
- [ ] Task: Implement "Let's Talk" modal content
    - [ ] Create `ContactForm` component
    - [ ] Add fields: Name, Email, Message, Project Type
    - [ ] Connect to backend/service (Supabase or EmailJS)
    - [ ] Add spam protection (suggested: Turnstile or hCaptcha)

### 10. Create a Blog/Content Strategy ✍️
**Tip**: Thought Leadership.
- [ ] Decide on content strategy (Technical, Case Studies, etc.)
- [ ] Technical Setup
    - [ ] Choose implementation (MDX recommended for dev blogs)
    - [ ] Create `posts` directory
    - [ ] Install MDX parser dependencies
- [ ] Create first blog post (e.g., "Hello World" or "My Tech Stack")
- [ ] Update `/:lang/blog` route to list real posts
