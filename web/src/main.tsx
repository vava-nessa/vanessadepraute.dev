import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// import { Pointer } from "@/components/magicui/pointer";

function PasswordProtection({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem("isAuthenticated") === "true";
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return false;
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const authenticated = password === "vava";
      setIsAuthenticated(authenticated);
      if (authenticated) {
        localStorage.setItem("isAuthenticated", "true");
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center max-w-2xl">
        Vanessa Depraute : Personal portfolio - Développeuse fullstack JS et
        Designer UI UX
      </h1>
      <div className="p-8 bg-white shadow-md rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Site en développement</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Accéder au site
          </button>
        </form>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PasswordProtection>
      <App />
      <Analytics />
      <SpeedInsights />
    </PasswordProtection>
  </StrictMode>
);
