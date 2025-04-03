import { useState, useEffect } from "react";
import "./App.css";
import { CatBot } from "./components/CatBot/CatBot.tsx";
import CoderGirl from "./components/CoderGirl/CoderGirl.tsx";
import Particles from "./components/Particles";
import wavingHand from "./assets/waving_hand.webp";
import { Testimonials } from "./components/Testimonials/Testimonials.tsx";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

function App() {
  const [error, setError] = useState<Error | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const words = `I've been crafting custom web solutions and sharing insights about freelance development for the past 15 years. I'm passionate about designing web apps, from UI/UX concepts to solving real-life  complex problems with code. 🚀 Feel free to contact me !
`;
  // Hook pour détecter la taille de l'écran
  useEffect(() => {
    const handleResize = () => {
      try {
        setWindowWidth(window.innerWidth);
      } catch (error) {
        console.error("Error handling resize:", error);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Personnaliser les options de particules
  const particleOptions = {
    particleCount: 50,
    particleBaseHue: 240,
    particleHueRange: 60,
    particleBaseRadius: 4.8,
    particleRadiusRange: 1,
    glowBrightness: 100,
    backgroundColor: "hsl(293deg 100% 90%)",
  };

  // Error boundary pattern using hooks
  useEffect(() => {
    try {
      // Component initialization logic (if needed)
    } catch (error) {
      console.error("Error initializing App:", error);
      setError(error instanceof Error ? error : new Error(String(error)));
    }
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
      <div className="absolute top-0 z-[-2] h-screen w-screen  transform bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]">
        <div
          className="wrapper"
          style={{
            display: "flex",
            flexDirection: windowWidth <= 1000 ? "column" : "row",
            width: "100%",
            gap: "20px",
            padding: "20px",
          }}
        >
          <div
            className="column"
            style={{
              flex: 1,
              padding: "20px",
              textAlign: "left",
              width: windowWidth <= 1000 ? "100%" : "auto",
            }}
          >
            <h1>
              Hi there!{" "}
              <img
                src={wavingHand}
                alt="Waving Hand"
                style={{
                  width: "54px",
                  height: "54px",
                  display: "inline",
                }}
              />
            </h1>
            <h2>I'm Vanessa.</h2>
            <TextGenerateEffect duration="2" words={words} />;
          </div>
          <div
            className="column"
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: windowWidth <= 1000 ? "300px" : "auto",
            }}
          >
            <div className="cover">
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "100%",
                  height: "100%",
                  zIndex: 5,
                }}
              >
                <CoderGirl size="100%" />
              </div>
            </div>
          </div>
        </div>
        <CatBot />
        <Testimonials />
        <Particles options={particleOptions}></Particles>
      </div>
    );
  } catch (error) {
    console.error("Error rendering App:", error);
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }
}

export default App;
