import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { TerminalDemo } from "./TerminalDemo.tsx";
import { CatBot } from "./components/CatBot/CatBot.tsx";

function App() {
  const [count, setCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);

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
        <h1>Vite + React</h1>
        <TerminalDemo />
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
