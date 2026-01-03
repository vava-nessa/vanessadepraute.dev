import { useState, useEffect } from "react";
import "./App.css";
import CoderGirl from "./components/CoderGirl/CoderGirl.tsx";

import { Testimonials } from "./components/Testimonials/Testimonials.tsx";
import Star from "./components/Star/Star.tsx";
import TextType from "./components/TextType";

// import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import ContactButton from "./components/ContactButton";
import FloatingLines from "./components/FloatingLines/FloatingLines";

function App() {
  const [error, setError] = useState<Error | null>(null);



  // Personnaliser les options de particules
  /* const particleOptions = {
    particleCount: 50,
    particleBaseHue: 240,
    particleHueRange: 60,
    particleBaseRadius: 4.8,
    particleRadiusRange: 1,
    glowBrightness: 100,
    backgroundColor: "hsl(293deg 100% 90%)",
  }; */

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
      <div className="min-h-screen w-full bg-[rgb(16,16,16)] text-white overflow-x-hidden">
        {/* FloatingLines Background */}
        <div className="fixed inset-0 w-full h-full z-0">
          <FloatingLines
            linesGradient={["#2F4BC0", "#E945F5"]}
            enabledWaves={['middle']}
            lineCount={2}
            lineDistance={38}
            animationSpeed={1.8}
            interactive
            bendRadius={5}
            bendStrength={-0.5}
            mouseDamping={0.03}
            parallax
            parallaxStrength={0.2}
          />
        </div>

        <div className="relative z-10">
          <div className="wrapper w-full flex flex-col gap-20 p-5">
            {/* Header Section */}
            <div className="w-full max-w-[1200px] mx-auto pt-16 md:pt-24 px-5">
              {/* Greeting */}
              <p className="text-neutral-400 text-lg md:text-xl mb-4 font-normal tracking-wide">
                Hi there! I'm Vanessa.
              </p>

              {/* Title and Avatar row */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-8">
                <div className="flex-shrink-0">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white m-0 tracking-tight">
                    <TextType
                      text={["Developer", "Designer", "Coder", "UI/UX Designer"]}
                      typingSpeed={75}
                      pauseDuration={1500}
                      showCursor={true}
                      cursorCharacter="|"
                    />
                  </h1>
                </div>

                {/* Avatar on the right */}
                <div className="flex-shrink-0 lg:ml-auto">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-violet-500 overflow-hidden">
                    <img
                      src="/avatar.png"
                      alt="Vanessa Depraute"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Description paragraph below */}
              <div className="max-w-2xl">
                <p className="text-neutral-400 text-lg md:text-xl leading-relaxed font-light m-0">
                  I've been crafting custom web solutions and sharing insights about freelance development since 2006. I'm passionate about designing web apps, from <span className="text-violet-400 font-semibold">UI/UX</span> concepts to solving real-life complex problems with <span className="text-violet-400 font-semibold">code</span>. Feel free to contact me !
                </p>
              </div>
            </div>

            {/* CoderGirl Section */}
            <div className="w-full flex justify-center items-center min-h-[300px] lg:min-h-auto">
              <div className="cover relative w-[600px] h-[600px] flex items-center justify-center">
                <div className="absolute inset-0 z-5 flex items-center justify-center">
                  <CoderGirl size="100%" />
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof & Contact */}
          <div className="w-full flex flex-col items-center py-10">
            <div className="flex justify-center mb-10">
              <Testimonials />
            </div>

            <p className="text-neutral-500 text-center my-8 uppercase tracking-widest font-medium">
              Expert in TS + JS + React + UI/UX Design
            </p>

            <div className="flex justify-center items-center mb-8">
              <ContactButton />
            </div>

            <div className="flex justify-center items-center mb-12">
              <Star delay={1800} color="rgb(235, 190, 68)" />
              <Star delay={2100} color="rgb(245, 180, 105)" />
              <Star delay={2400} color="rgb(238, 175, 92)" />
              <Star delay={2700} color="rgb(201, 126, 64)" />
              <Star delay={3000} color="rgb(180, 79, 39)" />
            </div>

            {/* Booking Section */}
            <div className="w-full max-w-4xl mx-auto mb-20 px-4">
              <iframe
                src="https://cal.com/vanessa-depraute-g3wudh/15min?user=vanessa-depraute-g3wudh"
                className="w-full h-[600px] border border-neutral-800 rounded-2xl shadow-2xl bg-neutral-900/50"
                title="Embedded content"
              />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering App:", error);
    setError(error instanceof Error ? error : new Error(String(error)));
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }
}

export default App;
