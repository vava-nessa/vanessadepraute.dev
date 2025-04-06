import { defineConfig } from "vite";
import path from "path"; // Assurez-vous que @types/node est installé (pnpm add -D @types/node) si vous avez des erreurs TypeScript ici
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Assurez-vous que __dirname fonctionne ou utilisez import.meta.url pour les modules ES
      // Pour Vite avec ES Modules, préférez :
      // "@": path.resolve(new URL('.', import.meta.url).pathname, "./src"),
      // Ou si __dirname est défini (par exemple avec CommonJS interop) :
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          "react-three-fiber": ["@react-three/fiber", "@react-three/drei"],
          vendor: ["react", "react-dom"],
        },
      },
    },
    // Optionnel: augmenter la limite d'avertissement pour les chunks
    chunkSizeWarningLimit: 700,
  },
  // Ajout de l'option pour inclure les fichiers .glb comme assets
  assetsInclude: ["**/*.glb"], // Indique à Vite de traiter les .glb comme des assets
});
