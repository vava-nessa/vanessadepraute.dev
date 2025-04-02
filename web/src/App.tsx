import { useState, useEffect } from "react";
import "./App.css";
import { CatBot } from "./components/CatBot/CatBot.tsx";
import CoderGirl from "./components/CoderGirl/CoderGirl.tsx";
import Particles from "./components/Particles";

function App() {
  const [error, setError] = useState<Error | null>(null);

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
        <h1
          style={{
            color: "purple",
            fontSize: "2.5em",
            marginTop: "20px",
            fontWeight: "bold",
          }}
        >
          Vanessa Depraute
        </h1>
        <h2 style={{ color: "purple", fontSize: "1.2em" }}>
          Designer + Developer
        </h2>
        <p style={{ color: "purple", fontSize: "1em" }}>coming soon...</p>
        <div className="cover">
          <div
            style={{
              zoom: 0.5,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              height: "100%",
              zIndex: 5,
            }}
          >
            <CoderGirl size={1} />
          </div>
        </div>
        <CatBot />
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
