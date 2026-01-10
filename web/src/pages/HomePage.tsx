import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import "../App.css";
import CoderGirl from "../components/CoderGirl/CoderGirl.tsx";
import TechStack from "../components/TechStack/TechStack.tsx";
import TechStackExtended from "../components/TechStackExtended/TechStackExtended.tsx";
import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher.tsx";
import ControlsBar from "../components/ControlsBar/ControlsBar.tsx";
import { AnimatedThemeToggler } from "../components/ui/animated-theme-toggler";
import { Testimonials } from "../components/Testimonials/Testimonials.tsx";
import Star from "../components/Star/Star.tsx";
import TextType from "../components/TextType";
import ContactButton from "../components/ContactButton";
import { ClickSpark } from "../components/ClickSpark";
import { HandWrittenTitle } from "../components/ui/hand-writing-text";
import Aurora from "../components/Aurora";
import profilePicture from "../assets/profilepicture.webp";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import * as Sentry from "@sentry/react";
import LightRays from "../components/LightRays/LightRays";
import GitHubCalendar from "../components/GitHubCalendar/GitHubCalendar";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer/Footer";
import { ErrorBoundary } from "../components/ErrorBoundary/ErrorBoundary";
import ModelViewer from "../components/ModelViewer/ModelViewer";

function HomePage() {
  const { handleError } = useErrorHandler("HomePage");
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const clickCountRef = useState({ count: 0, timeout: null as NodeJS.Timeout | null })[0];

  // Initialiser la langue basée sur la route
  useEffect(() => {
    try {
      if (lang === "fr" || lang === "en") {
        i18n.changeLanguage(lang);
      }
    } catch (error) {
      handleError(error, { action: "change_language" });
    }
  }, [lang, i18n, handleError]);

  // Randomize roles: 2 important, 1 secondary (except first is always "Developer"/"Développeuse")
  const shuffledRoles = useMemo(() => {
    try {
      const important = t("header.important_roles", { returnObjects: true }) as string[];
      const secondary = t("header.secondary_roles", { returnObjects: true }) as string[];

      if (!Array.isArray(important) || !Array.isArray(secondary)) return [];

      // Shuffle important roles (excluding the first one which is always "Developer"/"Développeuse")
      const shuffledImportant = [...important];
      for (let i = shuffledImportant.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledImportant[i], shuffledImportant[j]] = [shuffledImportant[j], shuffledImportant[i]];
      }

      // Shuffle secondary roles
      const shuffledSecondary = [...secondary];
      for (let i = shuffledSecondary.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledSecondary[i], shuffledSecondary[j]] = [shuffledSecondary[j], shuffledSecondary[i]];
      }

      const result: string[] = [];

      // ALWAYS start with the FIRST important role (Developer/Développeuse)
      if (important.length > 0) {
        result.push(important[0]);
      }

      // Then follow the 2 important / 1 secondary pattern with randomized roles
      let importantIndex = 0;
      let secondaryIndex = 0;

      // We want to cycle through all roles, giving priority to showing variety
      const totalCycles = Math.max(shuffledSecondary.length, 10); // Show at least 10 cycles

      for (let i = 0; i < totalCycles; i++) {
        // Add 2 important roles (random from shuffled list)
        result.push(shuffledImportant[importantIndex % shuffledImportant.length]);
        importantIndex++;
        result.push(shuffledImportant[importantIndex % shuffledImportant.length]);
        importantIndex++;

        // Add 1 secondary role (random from shuffled list)
        result.push(shuffledSecondary[secondaryIndex % shuffledSecondary.length]);
        secondaryIndex++;
      }

      return result;
    } catch (error) {
      handleError(error, { action: "shuffle_roles" });
      return [];
    }
  }, [t, i18n.language, handleError]);

  // Détecter le thème
  useEffect(() => {
    try {
      const checkTheme = () => {
        const isLight = document.documentElement.classList.contains('light-mode');
        setIsDarkMode(!isLight);
      };

      // Check initial theme
      checkTheme();

      // Observer les changements de thème
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

  // Easter egg: 15 rapid clicks to toggle debug mode
  const handleModelClick = () => {
    try {
      clickCountRef.count++;

      // Clear previous timeout
      if (clickCountRef.timeout) {
        clearTimeout(clickCountRef.timeout);
      }

      // Check if we reached 15 clicks
      if (clickCountRef.count >= 15) {
        setDebugMode((prev) => !prev);
        clickCountRef.count = 0;
        clickCountRef.timeout = null;
      } else {
        // Reset counter after 2 seconds of inactivity
        clickCountRef.timeout = setTimeout(() => {
          clickCountRef.count = 0;
          clickCountRef.timeout = null;
        }, 2000);
      }
    } catch (error) {
      handleError(error, { action: "model_click_easter_egg" });
    }
  };

  return (
    <ClickSpark
      sparkColor="#ff3d9a"
      sparkSize={14}
      sparkRadius={30}
      sparkCount={3}
      duration={1100}
      extraScale={1.8}
    >
      <ControlsBar>
        <LanguageSwitcher />
        <div className="controls-separator" />
        <AnimatedThemeToggler />
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
          <div id="app-wrapper" className="wrapper w-full flex flex-col gap-20 px-5 pt-2 pb-5">
            {/* Header Section */}
            <div id="header-section" className="w-full max-w-[1200px] mx-auto pt-4 md:pt-6 px-5">
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
                  <h1 id="header-title" className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white m-0 tracking-tight flex items-center gap-3">
                    <span className="text-brand-primary font-mono flex-shrink-0" aria-hidden="true">➜</span>
                    <span className="text-brand-primary font-mono flex-shrink-0" aria-hidden="true">~</span>
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
                    />
                  </h1>
                </div>
              </div>
            </div>

            {/* Bio & CoderGirl Section */}
            <div id="bio-section" className="w-full max-w-[1200px] mx-auto px-5">
              <div id="bio-content" className="flex flex-col lg:flex-row gap-12 items-center lg:items-start mb-12">
                {/* Bio text on the left */}
                <div id="bio-text-container" className="flex-1">
                  {(t("bio.paragraphs", { returnObjects: true }) as string[]).map((paragraph, index, arr) => {
                    const isLastParagraph = index === arr.length - 1;
                    const hasBold = paragraph.includes("**");

                    if (isLastParagraph && hasBold) {
                      // Extract the text BEFORE the bold part to show it as a normal paragraph
                      const beforeBold = paragraph.split("**")[0].trim();

                      return beforeBold ? (
                        <p
                          key={index}
                          className="text-neutral-300 text-sm md:text-base leading-relaxed font-light mb-6"
                          dangerouslySetInnerHTML={{
                            __html: beforeBold.replace(/\*\*(.*?)\*\*/g, '<strong class="text-brand-primary font-semibold">$1</strong>')
                          }}
                        />
                      ) : null;
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

              {/* Centered Let's Talk / Parlons-en section */}
              {(() => {
                const paragraphs = t("bio.paragraphs", { returnObjects: true }) as string[];
                const lastParagraph = paragraphs[paragraphs.length - 1];
                const match = lastParagraph.match(/\*\*(.*?)\*\*/);
                const title = match ? match[1] : null;

                if (title) {
                  return (
                    <div id="lets-talk-centered" className="w-full flex justify-center items-center py-10">
                      <div className="relative w-full max-w-lg" style={{ height: '160px' }}>
                        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'scale(0.6)', transformOrigin: 'center center' }}>
                          <HandWrittenTitle title={title} subtitle="" textSize="text-4xl md:text-5xl font-bold" />
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            {/* Out Of Burn Project Section */}
            <div id="out-of-burn-section" className="w-full max-w-[1200px] mx-auto px-5 py-20">
              <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
                {/* Image placeholder on the left */}
                <div className="flex-shrink-0 w-full lg:w-[400px] h-[400px]">
                  <div className="w-full h-full bg-black rounded-3xl" style={{ borderRadius: '24px' }} />
                </div>

                {/* Text content on the right */}
                <div className="flex-1 flex flex-col gap-6">
                  <p
                    className="text-neutral-300 text-base md:text-lg leading-relaxed font-light"
                    dangerouslySetInnerHTML={{
                      __html: t("outOfBurn.title").replace(/\*\*(.*?)\*\*/g, '<strong class="text-brand-primary font-semibold">$1</strong>')
                    }}
                  />
                  <p className="text-neutral-300 text-base md:text-lg leading-relaxed font-light">
                    {t("outOfBurn.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* TechStack Band */}
          <ErrorBoundary>
            <TechStack />
          </ErrorBoundary>

          {/* Social Proof & Contact */}
          <div id="social-proof-section" className="w-full flex flex-col items-center py-10">
            <div id="testimonials-container" className="flex justify-center mb-10">
              <ErrorBoundary>
                <Testimonials />
              </ErrorBoundary>
            </div>

            <p id="expert-text" className="text-neutral-500 text-center my-8 uppercase tracking-widest font-medium">
              {t("expert")}
            </p>

            <div id="contact-button-container" className="flex justify-center items-center mb-8">
              <ContactButton />
            </div>

            <div id="stars-container" className="flex justify-center items-center mb-12">
              <Star delay={1800} color="rgb(235, 190, 68)" />
              <Star delay={2100} color="rgb(245, 180, 105)" />
              <Star delay={2400} color="rgb(238, 175, 92)" />
              <Star delay={2700} color="rgb(201, 126, 64)" />
              <Star delay={3000} color="rgb(180, 79, 39)" />
            </div>

            {/* Light Rays Section */}
            <div className="w-full relative" style={{ height: '100vh', minHeight: '600px' }}>
              <ErrorBoundary>
                <LightRays
                  raysOrigin="top-center"
                  raysColor="#00ffff"
                  raysSpeed={1.5}
                  lightSpread={0.8}
                  rayLength={1.2}
                  followMouse={true}
                  mouseInfluence={0.1}
                  noiseAmount={0.1}
                  distortion={0.05}
                />
              </ErrorBoundary>

              {/* Projects TODO */}
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="max-w-2xl mx-auto px-5 text-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                    projets (todo)
                  </h2>
                  <ul className="text-neutral-300 text-lg md:text-xl space-y-4">
                    <li>Likely</li>
                    <li>Out Of burn</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Booking Section */}


            {/* GitHub Calendar - Before Tech Stack */}
            <div id="github-calendar-section" className="w-full mb-20">
              <ErrorBoundary>
                <GitHubCalendar username="vavanesssa" theme={isDarkMode ? "dark" : "light"} />
              </ErrorBoundary>
            </div>

            {/* IBM Terminal Section */}
            <div id="ibm-terminal-section" className="w-full mb-20 flex justify-center">
              <div className="w-[300px] h-[300px]">
                <ErrorBoundary>
                  <ModelViewer
                    modelPath="/isomatrix_glitch.glb"
                    playAnimation={true}
                    width="100%"
                    height="100%"
                    enableOrbitControls={true}
                    enableZoom={false}
                    autoFit={false}
                    debug={debugMode}
                    onClick={handleModelClick}
                    cameraConfig={{
                      position: [-5.11, 2.48, -10.84],
                      rotation: [-2.93, -0.45, -3.05],
                      lookAt: [-0.22, 0.32, -0.88],
                      fov: 18.00,
                      zoom: 1.00,
                      autoRotate: false,
                      oscillation: { enabled: false, amplitude: 0, period: 0, axis: "y" },
                      followMouse: true,
                      mouseFollowSpeed: 0.2,
                      mouseFollowRange: 0.45,
                      mouseFollowAxis: 'both'
                    }}
                  />
                </ErrorBoundary>
              </div>
            </div>

            {/* Tech Stack Extended - Displayed directly */}
            <div id="tech-stack-extended-section" className="w-full max-w-4xl mx-auto mt-20 mb-20 px-4">
              <ErrorBoundary>
                <TechStackExtended />
              </ErrorBoundary>
            </div>

            {/* FAQ Section */}
            <ErrorBoundary>
              <FAQ />
            </ErrorBoundary>

            {/* Sentry Test Error Button - Development Only */}
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

            {/* Footer with social icons */}
            <Footer />
          </div>
        </div>
      </div>
    </ClickSpark>
  );
}

export default HomePage;
