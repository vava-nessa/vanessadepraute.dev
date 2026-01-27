/**
 * @file vite.config.ts
 * @description Vite configuration for the vanessadepraute.dev portfolio site.
 * @functions
 *   → sitemapPlugin: Custom plugin that generates sitemap.xml with current build date
 * @exports Vite configuration object
 * @see src/vite-env.d.ts for BUILD_DATE type declaration
 *
 * 📖 This config handles:
 * - React + Tailwind CSS compilation
 * - Path aliases (@ → src)
 * - GLB/SVG asset handling for 3D models
 * - BUILD_DATE injection for "Last update" display in Footer
 * - Automatic sitemap.xml generation with fresh lastmod dates
 */
import { defineConfig, type Plugin } from "vite";
import path from "path"; // Assurez-vous que @types/node est installé (pnpm add -D @types/node) si vous avez des erreurs TypeScript ici
import { fileURLToPath } from "url";
import fs from "fs";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

/**
 * 📖 sitemapPlugin - Generates sitemap.xml at build time with the current date
 * This ensures Google sees fresh lastmod dates on every deploy,
 * signaling that the site is actively maintained.
 */
function sitemapPlugin(): Plugin {
  return {
    name: "generate-sitemap",
    // 📖 closeBundle runs after the bundle is written to disk
    closeBundle() {
      const outputPath = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "./dist/sitemap.xml"
      );

      // 📖 Format: YYYY-MM-DD (ISO 8601 date format required by sitemaps)
      const today = new Date().toISOString().split("T")[0];

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <!-- Homepage (English default) -->
  <url>
    <loc>https://www.vanessadepraute.dev/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.vanessadepraute.dev/"/>
    <xhtml:link rel="alternate" hreflang="fr" href="https://www.vanessadepraute.dev/fr"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.vanessadepraute.dev/"/>
  </url>

  <!-- French Homepage -->
  <url>
    <loc>https://www.vanessadepraute.dev/fr</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.vanessadepraute.dev/"/>
    <xhtml:link rel="alternate" hreflang="fr" href="https://www.vanessadepraute.dev/fr"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.vanessadepraute.dev/"/>
  </url>

  <!-- English Blog -->
  <url>
    <loc>https://www.vanessadepraute.dev/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.vanessadepraute.dev/blog"/>
    <xhtml:link rel="alternate" hreflang="fr" href="https://www.vanessadepraute.dev/fr/blog"/>
  </url>

  <!-- French Blog -->
  <url>
    <loc>https://www.vanessadepraute.dev/fr/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.vanessadepraute.dev/blog"/>
    <xhtml:link rel="alternate" hreflang="fr" href="https://www.vanessadepraute.dev/fr/blog"/>
  </url>

</urlset>`;

      fs.writeFileSync(outputPath, sitemap, "utf-8");
      console.log(`✅ Sitemap generated with lastmod: ${today}`);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), sitemapPlugin()],
  // 📖 BUILD_DATE is injected at compile time for the Footer "Last update" display
  define: {
    BUILD_DATE: JSON.stringify(new Date().toISOString()),
  },
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
      },
    },
    // Increase chunk size warning limit to 6000 kB (large bundles are acceptable for this project)
    chunkSizeWarningLimit: 6000,
  },
});
