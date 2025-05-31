import { useState, useEffect } from "react";
import "./App.css";
import { CatBot } from "./components/CatBot/CatBot.tsx";
import CoderGirl from "./components/CoderGirl/CoderGirl.tsx";
// Preserved for future use: Particles component for background effects.
// import Particles from "./components/Particles";
import wavingHand from "./assets/waving_hand.webp";
import { ErrorBoundary } from "../components/ErrorBoundary.tsx";

import rocket from "./assets/rocket.webp";
import { Testimonials } from "./components/Testimonials/Testimonials.tsx";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import Star from "./components/Star/Star.tsx";

// Preserved for future use: BackgroundGradientAnimation for dynamic backgrounds.
// import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import ContactButton from "./components/ContactButton";

function App() {
  const [error, setError] = useState<Error | null>(null);
  const words = `I've been crafting custom web solutions and sharing insights about freelance development for the past 15 years. I'm passionate about designing web apps, from UI/UX concepts to solving real-life complex problems with code. Feel free to contact me !`;

  // Configuration for Particles component (preserved for future use).
  /* const particleOptions = {
    particleCount: 50,
    particleBaseHue: 240, // Example: Blue-ish hue
    particleHueRange: 60, // Example: Range from blue to purple/cyan
    particleBaseRadius: 4.8, // Example: Base size of particles
    particleRadiusRange: 1, // Example: Variation in particle size
    glowBrightness: 100, // Example: Intensity of the glow effect
    backgroundColor: "hsl(293deg 100% 90%)", // Example: Light purple background
  }; */

  // useEffect for component initialization logic (if any was needed).
  // Currently empty, consider removing if no specific initialization logic for App component itself is planned here.
  useEffect(() => {
    // Component initialization logic can go here if needed in the future
  }, []);

  // If an error occurs in the App component's main logic, display a fallback UI.
  // Errors within CatBot, CoderGirl, or Testimonials are caught by their respective ErrorBoundary.
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
      <>
        <ErrorBoundary fallback={<p>CatBot is currently unavailable. Meow-be later?</p>}>
          <CatBot />
        </ErrorBoundary>
        <div className="absolute top-0 z-[-2] h-screen w-screen transform ">
          {/* Preserved for future use: BackgroundGradientAnimation wrapper for visual effects. */}
          {/* <BackgroundGradientAnimation> */}
          <div className="z-0 ">
            <div
              className="wrapper flex flex-col lg:flex-row w-full gap-5 p-5"
            >
              <div
                className="column flex-1 p-5 text-left w-full lg:w-auto"
              >
                <h1>
                  Hi there!{" "}
                  <img
                    src={wavingHand}
                    alt="Waving Hand"
                    className="w-[54px] h-[54px] inline"
                    loading="lazy"
                  />
                </h1>
                <h2>I'm Vanessa.</h2>
                <TextGenerateEffect words={words} />
                <div className="flex mt-4 mb-2"></div>
                <img src={rocket} width="80px" height="80px" loading="lazy" />
              </div>
              <div
                className="column flex-1 flex justify-center items-center min-h-[300px] lg:min-h-0"
              >
                <div className="cover relative w-full h-full">
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-[5]"
                  >
                    <ErrorBoundary fallback={<p>CoderGirl component failed to load.</p>}>
                      <CoderGirl size="100%" />
                    </ErrorBoundary>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <ErrorBoundary fallback={<p>Could not load testimonials at this time.</p>}>
                <Testimonials />
              </ErrorBoundary>
            </div>
            {/* Preserved for future use: Renders the Particles component. */}
            {/* <Particles options={particleOptions}></Particles> */}
            <p>TS JS React logos etc...</p>

            <div className="flex justify-center items-center mb-4">
              <ContactButton />
              <div className="flex ml-4"></div>
            </div>
            <div className="flex justify-center items-center mb-4">
              <Star delay={1800} color="rgb(235, 190, 68)" />
              <Star delay={2100} color="rgb(245, 180, 105)" />
              <Star delay={2400} color="rgb(238, 175, 92)" />
              <Star delay={2700} color="rgb(201, 126, 64)" />
              <Star delay={3000} color="rgb(180, 79, 39)" />
            </div>
            <div className="w-full">
              <iframe
                src="https://cal.com/vanessa-depraute-g3wudh/15min?user=vanessa-depraute-g3wudh"
                className="w-full h-[500px] border-0"
                title="Embedded content"
                loading="lazy"
              />
            </div>
          </div>
          {/* </BackgroundGradientAnimation> */} {/* Closing tag for BackgroundGradientAnimation (preserved for future use) */}
        </div>
      </>
    );
  } catch (e) { // Renamed error to e to avoid conflict with useState's error
    const appError = e instanceof Error ? e : new Error(String(e));
    console.error("Error rendering App:", appError);
    setError(appError);
    // Fallback UI for errors caught by the App component's main try-catch
    return (
      <div className="error-container p-4 text-center">
        <h2 className="text-xl font-bold text-red-600">Something went wrong in the application.</h2>
        <p className="text-red-500">{appError.message}</p>
      </div>
    );
  }
}

export default App;
