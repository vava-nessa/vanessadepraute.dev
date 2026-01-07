import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import "../App.css";
import CoderGirl from "../components/CoderGirl/CoderGirl.tsx";
import TechStack from "../components/TechStack/TechStack.tsx";
import TechStackExtended from "../components/TechStackExtended/TechStackExtended.tsx";
import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher.tsx";
import { AnimatedThemeToggler } from "../components/ui/animated-theme-toggler";
import { Testimonials } from "../components/Testimonials/Testimonials.tsx";
import Star from "../components/Star/Star.tsx";
import TextType from "../components/TextType";
import ContactButton from "../components/ContactButton";
import { ClickSpark } from "../components/ClickSpark";
import { Accordion } from "../components/ui/Accordion.tsx";

function HomePage() {
  const [error, setError] = useState<Error | null>(null);
  const { t, i18n } = useTranslation();
  const { lang } = useParams();

  // Initialiser la langue basée sur la route
  useEffect(() => {
    if (lang === "fr" || lang === "en") {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  // Error boundary pattern using hooks
  useEffect(() => {
    // Component initialization logic (if needed)
  }, []);

  // If there was an error, show error fallback UI
  if (error) {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  try {
    return (
      <ClickSpark
        sparkColor="#ff7cfdec"
        sparkSize={14}
        sparkRadius={30}
        sparkCount={6}
        duration={1100}
        extraScale={1.8}
      >
        <LanguageSwitcher />
        <AnimatedThemeToggler />
        <div id="app-main" className="min-h-screen w-full bg-black text-white overflow-x-hidden">

          <div id="app-content-wrapper" className="relative z-10">
            <div id="app-wrapper" className="wrapper w-full flex flex-col gap-20 p-5">
              {/* Header Section */}
              <div id="header-section" className="w-full max-w-[1200px] mx-auto pt-16 md:pt-24 px-5">
                <div id="header-content" className="flex flex-col lg:flex-row items-center gap-8 mb-8">
                  {/* Avatar on the left */}
                  <div id="header-avatar-container" className="flex-shrink-0">
                    <div id="header-avatar" className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-violet-500 overflow-hidden">
                      <img
                        src="/avatar.png"
                        alt="Vanessa Depraute"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Text content on the right */}
                  <div id="header-text-container" className="flex flex-col">
                    {/* Greeting */}
                    <p id="header-greeting" className="text-neutral-400 text-lg md:text-xl mb-3 font-normal tracking-wide">
                      Hi there! I'm <span className="text-brand-primary font-semibold">Vanessa</span>.
                    </p>

                    {/* Title */}
                    <h1 id="header-title" className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white m-0 tracking-tight">
                      <TextType
                        text={t("header.roles", { returnObjects: true }) as string[]}
                        typingSpeed={75}
                        pauseDuration={1500}
                        showCursor={true}
                        cursorCharacter="|"
                      />
                    </h1>
                  </div>
                </div>
              </div>

              {/* Bio & CoderGirl Section */}
              <div id="bio-section" className="w-full max-w-[1200px] mx-auto px-5">
                <div id="bio-content" className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">
                  {/* Bio text on the left */}
                  <div id="bio-text-container" className="flex-1">
                    {(t("bio.paragraphs", { returnObjects: true }) as string[]).map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-neutral-300 text-sm md:text-base leading-relaxed font-light mb-6"
                        dangerouslySetInnerHTML={{
                          __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-brand-primary font-semibold">$1</strong>')
                        }}
                      />
                    ))}
                  </div>

                  {/* CoderGirl on the right */}
                  <div id="coder-girl-container" className="flex-shrink-0 relative w-full lg:w-[500px] h-[500px] flex items-center justify-center">
                    <div id="coder-girl-wrapper" className="absolute inset-0 z-5 flex items-center justify-center">
                      <CoderGirl size="100%" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TechStack Band */}
            <TechStack />

            {/* Social Proof & Contact */}
            <div id="social-proof-section" className="w-full flex flex-col items-center py-10">
              <div id="testimonials-container" className="flex justify-center mb-10">
                <Testimonials />
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

              {/* Booking Section */}
              {false && (
                <div id="booking-section" className="w-full max-w-4xl mx-auto mb-20 px-4">
                  <iframe
                    src="https://cal.com/vanessa-depraute-g3wudh/15min?user=vanessa-depraute-g3wudh"
                    className="w-full h-[600px] border border-neutral-800 rounded-2xl shadow-2xl bg-neutral-900/50"
                    title="Embedded content"
                  />
                </div>
              )}

              {/* Tech Stack Extended Accordion - At the end */}
              <div id="tech-stack-accordion" className="w-full max-w-4xl mx-auto mt-20 mb-20 px-4">
                <Accordion title={t("techStack.title")} defaultOpen={false}>
                  <TechStackExtended />
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </ClickSpark>
    );
  } catch (error) {
    console.error("Error rendering HomePage:", error);
    setError(error instanceof Error ? error : new Error(String(error)));
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }
}

export default HomePage;
