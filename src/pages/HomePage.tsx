/**
 * @file HomePage.tsx
 * @description 🏠 Main homepage component - Portfolio landing page
 *
 * This is the primary landing page of the portfolio site, showcasing:
 * - Hero section with animated role typing effect
 * - Bio section with CoderGirl 3D illustration
 * - Featured projects (Out Of Burn, etc.)
 * - Tech stack visualizations (scrolling bands + extended grid)
 * - Interactive 3D cat model with gyroscope/mouse control
 * - Testimonials and social proof
 * - FAQ section
 * - MetaBalls decoration
 *
 * 🌐 Multilingual Support:
 * Language is detected from URL path (/fr = French, otherwise = English)
 * and applied via i18next's changeLanguage().
 *
 * 🎨 Theme Support:
 * The page adapts to dark/light mode with dynamic Aurora background colors.
 * Brand colors are fetched from CSS variables for consistency.
 *
 * 🎮 Easter Eggs:
 * - 15 rapid clicks on the 3D model toggles debug mode (shows camera controls)
 * - Click sparks follow cursor with brand color
 *
 * 🔧 Key Features:
 *   → Role shuffling algorithm (2 important, 1 secondary pattern)
 *   → Dynamic brand color injection from CSS variables
 *   → Lazy loading of heavy components (ModelViewer)
 *   → Error boundaries around critical sections
 *   → Responsive layout with mobile/tablet/desktop breakpoints
 *
 * @functions
 *   → HomePage → Main component rendering the portfolio page
 *
 * @exports default - HomePage component
 *
 * @see ../components/CoderGirl/CoderGirl.tsx - 3D coder illustration
 * @see ../components/ModelViewer/ModelViewer.tsx - Interactive 3D model viewer
 * @see ../contexts/ThemeContext.tsx - Theme management
 */

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import "../App.css";
import CoderGirl from "../components/CoderGirl/CoderGirl.tsx";
// import TechStack from "../components/TechStack/TechStack.tsx";
// import TechStackExtended from "../components/TechStackExtended/TechStackExtended.tsx";
import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher.tsx";
import ControlsBar from "../components/ControlsBar/ControlsBar.tsx";
import { AnimatedThemeToggler } from "../components/ui/animated-theme-toggler";
import { AnimatedSoundToggler } from "../components/ui/animated-sound-toggler";
// import { Testimonials } from "../components/Testimonials/Testimonials.tsx";
// import Star from "../components/Star/Star.tsx";
import TextType from "../components/TextType";
// import ContactButton from "../components/ContactButton";
import { ClickSpark } from "../components/ClickSpark";
import { HandWrittenTitle } from "../components/ui/hand-writing-text";
import Aurora from "../components/Aurora";
import profilePicture from "../assets/profilepicture.webp";
import { useErrorHandler } from "@/hooks/useErrorHandler";
// import * as Sentry from "@sentry/react";
// import LightRays from "../components/LightRays/LightRays";
// import FAQ from "../components/FAQ";
import Footer from "../components/Footer/Footer";
import { ErrorBoundary } from "../components/ErrorBoundary/ErrorBoundary";
// 📖 Lazy load ModelViewer (heavy 3D component) - Reduces initial bundle size
// const ModelViewer = lazy(() => import("../components/ModelViewer/ModelViewer"));
// import ProjectCard from "../components/ProjectCard/ProjectCard";
import { useContactModal } from "@/contexts/ContactModalContext";
// import outOfBurnImage from "../assets/out_of_burn_ui.png";
import MetaBalls from "../components/ui/MetaBalls";
import SEOHead from "../components/SEOHead/SEOHead";

// 📖 Project images mapping - Maps project IDs to imported image assets (removed)
// const projectImages: Record<string, string> = {
//   // outOfBurn: outOfBurnImage,
// };

function HomePage() {
  // 📖 Error handling integration for Sentry reporting
  const { handleError } = useErrorHandler("HomePage");
  // 📖 Contact modal controls (opens the contact form overlay)
  const { openModal } = useContactModal();
  // 📖 i18n translation hook for multilingual content
  const { t, i18n } = useTranslation();
  // 📖 React Router location for URL-based language detection
  const location = useLocation();
  // 📖 Track current theme mode for Aurora background color adaptation
  const [isDarkMode, setIsDarkMode] = useState(true);
  // 📖 Debug mode shows camera controls on 3D model (activated via easter egg)
  // const [debugMode, setDebugMode] = useState(false);
  // 📖 Click counter for easter egg detection (15 rapid clicks)
  // const clickCountRef = useState({ count: 0, timeout: null as NodeJS.Timeout | null })[0];

  // 📖 Effect: Detect language from URL path and apply i18n change
  // URL structure: /fr/* → French, otherwise → English
  useEffect(() => {
    try {
      const isFrench = location.pathname.startsWith("/fr");
      const detectedLang = isFrench ? "fr" : "en";

      if (i18n.language !== detectedLang) {
        i18n.changeLanguage(detectedLang);
      }
    } catch (error) {
      handleError(error, { action: "change_language" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // 📖 Memoized: Randomize role display pattern (2 important, 1 secondary)
  // First role is ALWAYS "Developer"/"Développeuse" for brand consistency
  // Then cycles through shuffled roles to show variety without repetition
  const shuffledRoles = useMemo(() => {
    try {
      const important = t("header.important_roles", { returnObjects: true }) as string[];
      const secondary = t("header.secondary_roles", { returnObjects: true }) as string[];

      if (!Array.isArray(important) || !Array.isArray(secondary)) return [];

      // 📖 Shuffle important roles using Fisher-Yates algorithm
      // (excluding the first one which is always "Developer"/"Développeuse")
      const shuffledImportant = [...important];
      for (let i = shuffledImportant.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledImportant[i], shuffledImportant[j]] = [shuffledImportant[j], shuffledImportant[i]];
      }

      // 📖 Shuffle secondary roles (same algorithm)
      const shuffledSecondary = [...secondary];
      for (let i = shuffledSecondary.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledSecondary[i], shuffledSecondary[j]] = [shuffledSecondary[j], shuffledSecondary[i]];
      }

      const result: string[] = [];

      // 📖 ALWAYS start with the FIRST important role (Developer/Développeuse)
      if (important.length > 0) {
        result.push(important[0]);
      }

      // 📖 Then follow the 2 important / 1 secondary pattern with randomized roles
      // This creates variety while maintaining emphasis on primary skills
      let importantIndex = 0;
      let secondaryIndex = 0;

      // 📖 Cycle through all roles, showing at least 10 cycles for long typing animation
      const totalCycles = Math.max(shuffledSecondary.length, 10);

      for (let i = 0; i < totalCycles; i++) {
        // 📖 Add 2 important roles (cycles through shuffled list)
        result.push(shuffledImportant[importantIndex % shuffledImportant.length]);
        importantIndex++;
        result.push(shuffledImportant[importantIndex % shuffledImportant.length]);
        importantIndex++;

        // 📖 Add 1 secondary role (cycles through shuffled list)
        result.push(shuffledSecondary[secondaryIndex % shuffledSecondary.length]);
        secondaryIndex++;
      }

      return result;
    } catch (error) {
      handleError(error, { action: "shuffle_roles" });
      return [];
    }
  }, [t, i18n.language, handleError]);

  // 📖 Effect: Detect and track theme changes from ThemeContext
  // Watches for class changes on <html> element (dark-mode / light-mode)
  useEffect(() => {
    try {
      const checkTheme = () => {
        const isLight = document.documentElement.classList.contains('light-mode');
        setIsDarkMode(!isLight);
      };

      // 📖 Check initial theme on mount
      checkTheme();

      // 📖 Observer watches for theme toggle via ThemeContext
      const observer = new MutationObserver(checkTheme);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });

      return () => observer.disconnect();
    } catch (error) {
      handleError(error, { action: "theme_observer" });
    }
  }, [handleError]);

  /**
   * 📖 Easter egg: 15 rapid clicks on 3D model toggles debug mode
   * Debug mode shows camera controls and position info for development
   */
  /*
  const handleModelClick = () => {
    try {
      clickCountRef.count++;

      // 📖 Clear previous timeout to allow rapid clicking
      if (clickCountRef.timeout) {
        clearTimeout(clickCountRef.timeout);
      }

      // 📖 Check if we reached 15 clicks - toggle debug mode!
      if (clickCountRef.count >= 15) {
        setDebugMode((prev) => !prev);
        clickCountRef.count = 0;
        clickCountRef.timeout = null;
      } else {
        // 📖 Reset counter after 2 seconds of inactivity
        clickCountRef.timeout = setTimeout(() => {
          clickCountRef.count = 0;
          clickCountRef.timeout = null;
        }, 2000);
      }
    } catch (error) {
      handleError(error, { action: "model_click_easter_egg" });
    }
  };
  */

  // 📖 Primary brand color state - initialized empty to avoid flash of wrong color
  // Will be populated by effect below after DOM is ready
  const [primaryColor, setPrimaryColor] = useState('');

  // 📖 Effect: Read brand color from CSS variable for dynamic use
  // Used by ClickSpark and MetaBalls for consistent branding
  useEffect(() => {
    const updateColor = () => {
      const color = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
      if (color) {
        setPrimaryColor(color);
      }
    };

    // 📖 Read initial color
    updateColor();
    // 📖 Re-check on theme/style changes (defensive, color should be constant)
    const observer = new MutationObserver(updateColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
    return () => observer.disconnect();
  }, []);


  return (
    <ClickSpark
      sparkColor={primaryColor}
      sparkSize={14}
      sparkRadius={30}
      sparkCount={3}
      duration={1100}
      extraScale={1.8}
    >
      <SEOHead />
      <ControlsBar>
        <LanguageSwitcher />
        <div className="controls-separator" />
        <AnimatedThemeToggler />
        <div className="controls-separator" />
        <AnimatedSoundToggler />
      </ControlsBar>
      <div id="app-main" className="min-h-screen w-full bg-black text-white overflow-x-hidden">
        {/* Aurora Background */}
        <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden pointer-events-none z-0">
          <Aurora
            colorStops={isDarkMode ? ["#0c003d", "#5c0075", "#0c003d"] : ["#a855f7", "#ec4899", "#f0abfc"]}
            amplitude={0.5}
            blend={0.75}
            speed={2.5}
            lightMode={!isDarkMode}
          />
        </div>

        <div id="app-content-wrapper" className="relative z-10">
          <div id="app-wrapper" className="wrapper w-full flex flex-col px-5 pb-5">
            {/* Header Section */}
            <div id="header-section" className="w-full max-w-[1200px] mx-auto px-5 pt-12">
              <div id="header-content" className="flex flex-col lg:flex-row items-center gap-8 mb-8">
                {/* Avatar on the left */}
                <div id="header-avatar-container" className="flex-shrink-0">
                  <div id="header-avatar" className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-brand-primary overflow-hidden">
                    <img
                      src={profilePicture}
                      alt={t("profile.altText")}
                      className="w-full h-full object-cover"
                      style={{ userSelect: 'none', pointerEvents: 'none' }}
                      draggable={false}
                    />
                  </div>
                </div>

                {/* Text content on the right */}
                <div id="header-text-container" className="flex flex-col">
                  {/* Greeting */}
                  <p
                    id="header-greeting"
                    className="text-neutral-400 text-lg md:text-xl mb-3 font-normal tracking-wide"
                  >
                    {i18n.language === 'fr' ? 'Hello ! Je suis' : "Hi there! I'm"}{' '}
                    <span className="text-neutral-400">&lt;</span>
                    <span className="text-brand-primary font-semibold">Vanessa</span>
                    <span className="text-neutral-400"> /&gt;</span>
                  </p>

                  {/* Title */}
                  <h1 id="header-title" className={`text-2xl md:text-3xl lg:text-4xl font-extrabold m-0 tracking-tight flex items-center gap-3 ${isDarkMode ? 'text-[#ccff66]' : 'text-white'}`}>
                    <span className={`${isDarkMode ? 'text-[#ccff66]' : 'text-brand-primary'} font-mono flex-shrink-0`} aria-hidden="true">➜</span>
                    <span className={`${isDarkMode ? 'text-[#ccff66]' : 'text-brand-primary'} font-mono flex-shrink-0`} aria-hidden="true">~</span>
                    <TextType
                      key={i18n.language}
                      text={shuffledRoles}
                      typingSpeed={65}
                      pauseDuration={800}
                      deletingSpeed={100}
                      cursorBlinkDuration={0.5}
                      showCursor={true}
                      cursorCharacter="_"
                      variableSpeed={{ min: 10, max: 105 }}
                      className={isDarkMode ? 'text-[#ccff66]' : ''}
                    />
                  </h1>
                </div>
              </div>
            </div>

            {/* Bio & CoderGirl Section */}
            <div id="bio-section" className="w-full max-w-[1200px] mx-auto px-5">
              <div id="bio-content" className="flex flex-col lg:flex-row gap-12 items-center lg:items-start mb-12">
                {/* Bio text on the left */}
                <div id="bio-text-container" className="flex-1 mt-8 lg:mt-16">
                  {(t("bio.paragraphs", { returnObjects: true }) as string[]).map((paragraph, index, arr) => {
                    const isLastParagraph = index === arr.length - 1;
                    const hasBold = paragraph.includes("**");

                    if (isLastParagraph && hasBold) {
                      // Don't render the last paragraph here as it will be displayed centered below
                      return null;
                    }

                    return (
                      <p
                        key={index}
                        className="text-neutral-300 text-sm md:text-base leading-relaxed font-light mb-6"
                        dangerouslySetInnerHTML={{
                          __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-brand-primary font-semibold">$1</strong>')
                        }}
                      />
                    );
                  })}

                  {/* Centered Let's Talk inside left column */}
                  {(() => {
                    const paragraphs = t("bio.paragraphs", { returnObjects: true }) as string[];
                    const lastParagraph = paragraphs[paragraphs.length - 1];
                    const match = lastParagraph.match(/\*\*(.*?)\*\*/);
                    const title = match ? match[1] : null;

                    if (title && match && typeof match.index === 'number') {
                      return (
                        <div id="lets-talk-centered" className="w-full flex flex-col justify-center items-center py-6 mt-8">
                          {lastParagraph.substring(0, match.index).trim() && (
                            <p className="text-neutral-300 text-sm md:text-base leading-relaxed font-light mb-2 z-10 text-center">
                              {lastParagraph.substring(0, match.index).trim()}
                            </p>
                          )}
                          <div className="relative w-full max-w-lg" style={{ height: '160px' }}>
                            <div
                              className="absolute inset-0 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300"
                              style={{ transform: 'scale(0.6)', transformOrigin: 'center center' }}
                              onClick={openModal}
                            >
                              <HandWrittenTitle title={title} subtitle="" textSize="text-4xl md:text-5xl font-bold" />
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>

                {/* CoderGirl on the right */}
                <div id="coder-girl-container" className="flex-shrink-0 relative w-full lg:w-[500px] h-[500px] flex items-center justify-center">
                  <div id="coder-girl-wrapper" className="absolute inset-0 z-5 flex items-center justify-center">
                    <ErrorBoundary>
                      <CoderGirl size="100%" />
                    </ErrorBoundary>
                  </div>
                </div>
              </div>


            </div>
          </div>

          {/* Out Of Burn Project Section - REMOVED */}
          {/* TechStack Band - REMOVED */}

          {/* Light Rays Section removed */}
          {/* Booking Section - REMOVED */}

          {/* Toon Cat Section - REMOVED */}

          {/* Tech Stack Extended - REMOVED */}

          {/* FAQ Section - REMOVED */}

          {/* MetaBalls Decoration Section */}
          <div className={`w-full md:max-w-[500px] md:mx-auto h-[400px] my-20 rounded-2xl overflow-hidden ${isDarkMode ? 'bg-transparent' : 'bg-white'}`}>
            <ErrorBoundary>
              <MetaBalls
                color={primaryColor}
                cursorBallColor={primaryColor}
                speed={0.8}
                animationSize={39}
                ballCount={22}
                clumpFactor={1.5}
                hoverSmoothness={0.205}
                cursorBallSize={3}
                enableTransparency={true}
              />
            </ErrorBoundary>
          </div>

          {/* Sentry Test Error Button - Development Only */}
          {/* Sentry Test Error Button - Removed for Production */
          /*
          {import.meta.env.DEV && (
            <div className="w-full flex justify-center gap-4 pb-10">
              <button
                onClick={() => {
                  Sentry.logger.info("User triggered test error");
                  throw new Error("This is your first error!");
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                🐛 Break the world (Sync Error)
              </button>
              <button
                onClick={() => {
                  Sentry.logger.info("User triggered async test error");
                  // Async IIFE that throws - will be caught as unhandled rejection
                  (async () => {
                    throw new Error("This is an unhandled promise rejection!");
                  })();
                }}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                ⚡ Async Error (Promise Rejection)
              </button>
            </div>
          )}
          */}

          {/* Footer with social icons */}
          <Footer />
        </div>
      </div>
    </ClickSpark>
  );
}

export default HomePage;
