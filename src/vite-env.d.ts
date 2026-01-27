/// <reference types="vite/client" />

/**
 * 📖 BUILD_DATE is injected by Vite at compile time (see vite.config.ts)
 * Used in Footer to display "Last update: [date]" formatted by language
 */
declare const BUILD_DATE: string;

// Declare GLB file modules
declare module "*.glb" {
  const src: string;
  export default src;
}

interface ViewTransition {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition(): void;
}

interface Document {
  startViewTransition(updateCallback: () => Promise<void> | void): ViewTransition;
}

interface Window {
  brandColors: {
    primary: string;
    secondary: string;
    getPrimary: () => string;
    getSecondary: () => string;
  };
}