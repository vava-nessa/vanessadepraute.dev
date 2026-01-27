/**
 * @file BlogPage.tsx
 * @description 📝 Blog page component - Currently showing "Coming Soon" placeholder
 *
 * This page will eventually display blog posts about web development, tech, and projects.
 * For now, it serves as a placeholder with multilingual support and SEO optimization.
 *
 * 🌐 Multilingual Support:
 * Language is detected from URL path:
 *   - /blog → English
 *   - /fr/blog → French
 *
 * 🎨 Features:
 *   → SEO Head with hreflang tags for Google indexing
 *   → ControlsBar with language and theme switchers
 *   → Responsive design matching the main site aesthetic
 *   → "Coming Soon" message in both languages
 *
 * @functions
 *   → BlogPage → Main blog page component
 *
 * @exports default - BlogPage component
 *
 * @see ../components/SEOHead/SEOHead.tsx - SEO metadata management
 * @see ../components/ControlsBar/ControlsBar.tsx - Top navigation controls
 */

import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../App.css";
import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher.tsx";
import ControlsBar from "../components/ControlsBar/ControlsBar.tsx";
import { AnimatedThemeToggler } from "../components/ui/animated-theme-toggler";
import { useEffect } from "react";
import SEOHead from "../components/SEOHead/SEOHead";

function BlogPage() {
  // 📖 i18n translation hook for multilingual content
  const { t, i18n } = useTranslation();
  // 📖 React Router location for URL-based language detection
  const location = useLocation();

  // 📖 Effect: Detect language from URL path and apply i18n change
  // URL structure: /fr/blog → French, /blog → English
  useEffect(() => {
    const isFrench = location.pathname.startsWith("/fr");
    const detectedLang = isFrench ? "fr" : "en";

    if (i18n.language !== detectedLang) {
      i18n.changeLanguage(detectedLang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      <SEOHead />
      <ControlsBar>
        <LanguageSwitcher />
        <div className="controls-separator" />
        <AnimatedThemeToggler />
      </ControlsBar>
      <div id="app-main" className="min-h-screen w-full bg-black text-white overflow-x-hidden">
        <div id="app-content-wrapper" className="relative z-10">
          <div id="app-wrapper" className="wrapper w-full flex flex-col gap-20 p-5">
            {/* Blog Header Section */}
            <div id="blog-header-section" className="w-full max-w-[1200px] mx-auto pt-16 md:pt-24 px-5">
              <div id="blog-header-content" className="flex flex-col items-center gap-8">
                <h1 id="blog-title" className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white text-center">
                  {t("blog.title")}
                </h1>
                <p id="blog-description" className="text-neutral-400 text-lg md:text-xl text-center max-w-2xl">
                  {t("blog.description")}
                </p>
              </div>
            </div>

            {/* Coming Soon Section */}
            <div id="coming-soon-section" className="w-full flex flex-col items-center py-20">
              <div className="text-center">
                <p className="text-neutral-500 text-2xl uppercase tracking-widest font-medium">
                  {t("blog.comingSoon")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BlogPage;
