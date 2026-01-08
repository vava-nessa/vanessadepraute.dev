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
  // Ajout de l'option pour inclure les fichiers .glb comme assets
  assetsInclude: ["**/*.glb"], // Indique à Vite de traiter les .glb comme des assets

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
      },
    },
  },
});
