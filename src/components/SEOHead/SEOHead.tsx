/**
 * @file SEOHead.tsx
 * @description 🔍 SEO component for multilingual hreflang tags
 *
 * This component dynamically manages hreflang tags in the document <head>.
 * It tells Google about language alternatives for each page, which:
 * - Prevents duplicate content issues
 * - Shows the right language version in search results
 * - Improves international SEO
 *
 * 🌐 How it works:
 * 1. Detects current page from React Router location
 * 2. Strips language prefix (/fr) to get base path
 * 3. Generates URLs for both English and French versions
 * 4. Creates <link rel="alternate" hreflang="..."> tags
 * 5. Updates tags on every route change
 *
 * 📖 Example generated tags:
 * ```html
 * <link rel="alternate" hreflang="en" href="https://vanessadepraute.dev/" />
 * <link rel="alternate" hreflang="fr" href="https://vanessadepraute.dev/fr" />
 * <link rel="alternate" hreflang="x-default" href="https://vanessadepraute.dev/" />
 * ```
 *
 * @functions
 *   → SEOHead → Component that injects hreflang tags into document head
 *
 * @exports default - SEOHead component
 *
 * @see https://developers.google.com/search/docs/specialty/international/localized-versions
 * @see ../pages/HomePage.tsx - Usage example
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * 📖 SEO Head component - Dynamically manages hreflang tags
 * This component renders nothing visible but manipulates the document <head>
 */
const SEOHead = () => {
  // 📖 React Router location for tracking page changes
  const location = useLocation();

  // 📖 Effect: Update hreflang tags on every route change
  useEffect(() => {
    // 📖 Base URL for constructing absolute URLs (required for hreflang)
    const baseUrl = "https://vanessadepraute.dev";

    // 📖 Determine current page path without language prefix
    // Examples: /fr/blog → /blog, /fr → /, /blog → /blog
    const isFrench = location.pathname.startsWith("/fr");
    const basePath = isFrench
      ? location.pathname.replace(/^\/fr/, "") || "/"
      : location.pathname;

    // 📖 Build absolute URLs for both language versions
    const enUrl = `${baseUrl}${basePath}`;
    const frUrl = basePath === "/"
      ? `${baseUrl}/fr`
      : `${baseUrl}/fr${basePath}`;

    // 📖 Remove existing hreflang tags to avoid duplicates
    const existingTags = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingTags.forEach(tag => tag.remove());

    // 📖 Add English version hreflang tag
    const enLink = document.createElement("link");
    enLink.rel = "alternate";
    enLink.hreflang = "en";
    enLink.href = enUrl;
    document.head.appendChild(enLink);

    // 📖 Add French version hreflang tag
    const frLink = document.createElement("link");
    frLink.rel = "alternate";
    frLink.hreflang = "fr";
    frLink.href = frUrl;
    document.head.appendChild(frLink);

    // 📖 Add x-default hreflang (fallback for users with no matching language)
    // Google shows this version when no language matches user preference
    const defaultLink = document.createElement("link");
    defaultLink.rel = "alternate";
    defaultLink.hreflang = "x-default";
    defaultLink.href = enUrl; // Default to English
    document.head.appendChild(defaultLink);

    // 📖 Cleanup: Remove tags when component unmounts or location changes
    return () => {
      document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(tag => tag.remove());
    };
  }, [location.pathname]);

  // 📖 This component doesn't render anything visible - it only manipulates <head>
  return null;
};

export default SEOHead;
