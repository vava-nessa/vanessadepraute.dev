import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Analytics } from "@vercel/analytics/react";

// import { Pointer } from "@/components/magicui/pointer";

function PasswordProtection({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsAuthenticated(password === "vava");
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Site en développement</h1>
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
    </PasswordProtection>
  </StrictMode>
);
