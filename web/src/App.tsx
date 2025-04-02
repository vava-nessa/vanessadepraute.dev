import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { TerminalDemo } from "./TerminalDemo.tsx";
import { CatBot } from "./components/CatBot/CatBot.tsx";
import CoderGirl from "./components/CoderGirl/CoderGirl.tsx";
import Particles from "./components/Particles";
import girlImage from "./assets/girl.png";

function App() {
  const [count, setCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  // Example size value

  // Personnaliser les options de particules
  const particleOptions = {
    particleCount: 200,
    particleBaseHue: 240,
    particleHueRange: 100,
    particleBaseRadius: 0.8,
    particleRadiusRange: 10.5,
    glowBrightness: 150,
    backgroundColor: "hsl(293, 100.00%, 94.70%)",
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

  const incrementCount = () => {
    try {
      setCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error("Error incrementing count:", error);
      setError(error instanceof Error ? error : new Error(String(error)));
    }
  };

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
      <>
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
          <Particles options={particleOptions}>
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
              <CoderGirl size={1} />
            </div>
          </Particles>
        </div>
        <CatBot />
      </>
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
