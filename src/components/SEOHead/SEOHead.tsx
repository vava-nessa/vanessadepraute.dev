import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * SEO Head component that adds hreflang tags for multilingual SEO
 * Helps Google understand language alternatives for each page
 */
const SEOHead = () => {
  const location = useLocation();

  useEffect(() => {
    const baseUrl = "https://vanessadepraute.dev";

    // Determine current page path without language prefix
    const isFrench = location.pathname.startsWith("/fr");
    const basePath = isFrench
      ? location.pathname.replace(/^\/fr/, "") || "/"
      : location.pathname;

    // Build URLs for both language versions
    const enUrl = `${baseUrl}${basePath}`;
    const frUrl = basePath === "/"
      ? `${baseUrl}/fr`
      : `${baseUrl}/fr${basePath}`;

    // Remove existing hreflang tags
    const existingTags = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingTags.forEach(tag => tag.remove());

    // Add English version hreflang
    const enLink = document.createElement("link");
    enLink.rel = "alternate";
    enLink.hreflang = "en";
    enLink.href = enUrl;
    document.head.appendChild(enLink);

    // Add French version hreflang
    const frLink = document.createElement("link");
    frLink.rel = "alternate";
    frLink.hreflang = "fr";
    frLink.href = frUrl;
    document.head.appendChild(frLink);

    // Add x-default (fallback for users with no matching language)
    const defaultLink = document.createElement("link");
    defaultLink.rel = "alternate";
    defaultLink.hreflang = "x-default";
    defaultLink.href = enUrl; // Default to English
    document.head.appendChild(defaultLink);

    // Cleanup on unmount
    return () => {
      document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(tag => tag.remove());
    };
  }, [location.pathname]);

  return null; // This component doesn't render anything visible
};

export default SEOHead;
