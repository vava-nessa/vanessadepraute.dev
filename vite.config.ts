import { defineConfig } from "vite";
import path from "path"; // Assurez-vous que @types/node est installé (pnpm add -D @types/node) si vous avez des erreurs TypeScript ici
import { fileURLToPath } from "url";
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
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
    },
  },
  // Ajout de l'option pour inclure les fichiers .glb et .svg comme assets
  assetsInclude: ["**/*.glb", "**/*.svg"], // Indique à Vite de traiter les .glb et .svg comme des assets

  // Configuration supplémentaire pour les assets .glb
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Conserve les noms de fichiers originaux pour les modèles 3D .glb
          if (assetInfo.name && assetInfo.name.endsWith(".glb")) {
            // Ne pas ajouter de hash pour les fichiers .glb
            console.log(`Asset préservé sans hash: ${assetInfo.name}`);
            return "assets/[name].[ext]";
          }
          // Configuration par défaut pour les autres fichiers
          return "assets/[name].[hash].[ext]";
        },
        // Manual chunks for better code-splitting
        manualChunks: (id) => {
          // Vendor chunks - separate large libraries
          if (id.includes("node_modules")) {
            // React ecosystem
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router")) {
              return "vendor-react";
            }
            // Three.js and 3D libraries
            if (id.includes("three") || id.includes("@react-three")) {
              return "vendor-three";
            }
            // i18n
            if (id.includes("i18next") || id.includes("react-i18next")) {
              return "vendor-i18n";
            }
            // Sentry
            if (id.includes("@sentry")) {
              return "vendor-sentry";
            }
            // Vercel analytics
            if (id.includes("@vercel")) {
              return "vendor-vercel";
            }
            // Framer Motion
            if (id.includes("framer-motion")) {
              return "vendor-framer";
            }
            // Other vendors
            return "vendor-other";
          }
        },
      },
    },
    // Increase chunk size warning limit to 6000 kB (vendor-other is large due to dependency tree)
    chunkSizeWarningLimit: 6000,
  },
});
