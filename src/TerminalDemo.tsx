/**
 * @file TerminalDemo.tsx
 * @description 🖥️ Animated terminal component that cycles through coding scenarios
 * 
 * This component creates an immersive terminal experience by displaying:
 * - Various coding scenarios (SSH, shadcn init, vim editing, pnpm commands)
 * - Random cat GIFs as "reward" screens between coding sequences
 * - Typing animations that simulate real terminal interactions
 * 
 * 🎬 Screen Pattern:
 * The component follows a pattern: Code → Code → GIF → repeat
 * This creates variety while ensuring the coding theme dominates.
 * 
 * ⏱️ Timing System:
 * Each screen has:
 *   - typingDuration: How long the typing animation takes
 *   - duration: Total time the screen is visible
 *   - content: Function that renders based on elapsed time
 * 
 * 🔧 Key Features:
 *   → Memoized screen definitions to prevent re-renders
 *   → Pattern-based random screen selection
 *   → Smooth blank transitions between screens
 *   → Error boundaries for robustness
 * 
 * @functions
 *   → TerminalDemo → Main component managing the screen carousel
 *   → transitionToNextScreen → Handles screen changes with pattern logic
 * 
 * @exports default - TerminalDemo component
 * 
 * @see ./registry/magicui/terminal.tsx - Terminal UI primitives
 */

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/registry/magicui/terminal";

// 📖 Array of cat GIFs - randomly selected for the "reward" screens
// Mix of local files and Giphy URLs for variety
const CAT_GIFS = [
  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjQxNG81cHZmOGdlZGl1NmdjYWdybDlrNnY0aHRrOGhrYXJiZDd5OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/65n8RPEa3r65q/giphy.gif",
  "/gifs/cat-celebrate.gif",
  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHpwZzFxb204eDM3M2Q3dmVhcnpuYWIzbnA1b2hxNThzbHl2NTk5YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TIejJSkHLZh4s/giphy.gif",
  "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDhpemJyaTFqNW9kdHRjb2g0Zms4NTdzdjJucHkxZzBsZDBmc3V1YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/nZ9OnDVJoEaLPlVRc1/giphy.gif",
  "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2ZhOW5seDFhem4wNDcwcDZzemQycmt1cTdzY3VvdWhxZnR5NWJyYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YTzh3zw4mj1XpjjiIb/giphy.gif",
  "/gifs/cat-curious.gif",
  "/gifs/cat-jump.gif",
  "/gifs/cat-play.gif",
];

/**
 * 📖 Screen sequence type definition
 * Each screen defines a terminal "scenario" with timing and content.
 * 
 * @property id - Unique identifier for the screen
 * @property command - The command shown in the terminal (empty for GIF screens)
 * @property typingDuration - Time (ms) for the typing animation to complete
 * @property duration - Total time (ms) the screen is displayed
 * @property maxVisibleLines - Optional: for scrolling terminal implementations
 * @property content - Function that returns JSX based on timing state
 */
type ScreenSequence = {
  id: string;
  command: string;
  typingDuration: number; // Duration of the typing animation (relative to screen start)
  duration: number; // Total duration of the screen
  maxVisibleLines?: number; // Maximum visible lines before clearing (unused in current implementation)
  content: (
    screenElapsedTime: number,
    isTypingComplete: boolean,
    randomGif?: string
  ) => React.ReactNode;
};

/**
 * 📖 Main Terminal Demo Component
 * 
 * Manages a carousel of terminal screens with:
 * - Pattern-based cycling (code → code → gif → repeat)
 * - Smooth transitions with 500ms blank screen between
 * - Typing animations that reveal content progressively
 * - Error handling for robustness
 */
export default function TerminalDemo() {
  // 📖 Core state for screen management
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [screenElapsedTime, setScreenElapsedTime] = useState(0); // 📖 Time since current screen started
  const [showScreen, setShowScreen] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  
  // 📖 GIF state - tracks current GIF URL and display pattern
  const [currentGifUrl, setCurrentGifUrl] = useState(() =>
    CAT_GIFS[Math.floor(Math.random() * CAT_GIFS.length)]
  );
  const [patternPosition, setPatternPosition] = useState(0); // 📖 0, 1 = code screens, 2 = gif screen

  // 📖 Refs for timer management - prevents memory leaks
  const screenStartTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const screenTransitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 📖 Memoized screen definitions - prevents recreation on every render
  // Separated into code screens and gif screens for pattern-based selection
  const { codeScreens, gifScreens } = useMemo(() => {
    // 📖 Code screens: Various terminal scenarios
    const code: ScreenSequence[] = [
    // 📖 Screen 1: SSH connect to server
    {
      id: "ssh",
      command: "ssh deploy@site.dev",
      typingDuration: 800,
      duration: 6000,
      content: (elapsed, typingComplete) => (
        <>
          <TypingAnimation delay={20} className="block text-left">
            &gt; ssh deploy@site.dev
          </TypingAnimation>

          {typingComplete && elapsed >= 1200 - 800 && (
            <AnimatedSpan className="text-gray-400 block text-left">
              <span>Authenticity of host 'site.dev' can't be established.</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 1700 - 800 && (
            <AnimatedSpan className="text-gray-400 block text-left">
              <span>ECDSA key fingerprint: SHA256:h8n2K9xL5mP7qR3wV1sT8yU9</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2300 - 800 && (
            <AnimatedSpan className="text-gray-400 block text-left">
              <span>Continue connecting (yes/no)? yes</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2900 - 800 && (
            <AnimatedSpan className="text-green-400 block text-left">
              <span>✓ Added 'site.dev' to known_hosts.</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3500 - 800 && (
            <AnimatedSpan className="text-blue-400 block text-left">
              <span>Last login: Tue Jan 7 14:32:18 2026</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 4100 - 800 && (
            <AnimatedSpan className="text-green-400 block text-left">
              <span>deploy@site:~$</span>
            </AnimatedSpan>
          )}
        </>
      ),
    },

    // 📖 Screen 3: Initial shadcn init
    {
      id: "init",
      command: "shadcn-ui init",
      typingDuration: 900,
      duration: 5000,
      content: (elapsed, typingComplete) => (
        <>
          <TypingAnimation delay={20} className="block text-left">
            &gt; shadcn-ui init
          </TypingAnimation>

          {typingComplete && elapsed >= 1200 - 900 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✔ Preflight checks.</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 1600 - 900 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✔ Verifying framework. Found Next.js.</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2000 - 900 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✔ Validating Tailwind CSS.</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2400 - 900 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✔ Validating import alias.</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2800 - 900 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✔ Writing components.json.</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3200 - 900 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✔ Checking registry.</span>
            </AnimatedSpan>
          )}
        </>
      ),
    },

    // 📖 Screen 4: Button installation
    {
      id: "button",
      command: "shadcn-ui add button",
      typingDuration: 1000,
      duration: 9000,
      content: (elapsed, typingComplete) => (
        <>
          <TypingAnimation delay={20} className="block text-left">
            &gt; shadcn-ui add button
          </TypingAnimation>

          {typingComplete && elapsed >= 1400 - 1000 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✔ Updating tailwind.config.ts</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2100 - 1000 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✔ Updating app/globals.css</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2800 - 1000 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✔ Installing dependencies.</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3500 - 1000 && (
            <AnimatedSpan className="text-blue-500 block text-left">
              <span>ℹ Added components:</span>
              <span className="pl-2">- Button</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 4200 - 1000 && (
            <TypingAnimation
              delay={20}
              className="text-green-500 block text-left"
            >
              ✓ Setup complete!
            </TypingAnimation>
          )}
        </>
      ),
    },

    // 📖 Screen 5: Object Viewing/Debugging
    {
      id: "data-objects",
      command: "node inspect types.ts",
      typingDuration: 900,
      duration: 7000,
      content: (elapsed, typingComplete) => (
        <>
          <TypingAnimation delay={20} className="block text-left">
            &gt; node inspect types.ts
          </TypingAnimation>

          {typingComplete && elapsed >= 1200 - 900 && (
            <AnimatedSpan className="block text-left text-blue-400">
              <span>Debugger listening on ws://127.0.0.1:9229/8zcjf3d</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 1700 - 900 && (
            <AnimatedSpan className="block text-left text-cyan-400">
              <span>debug&gt; const portfolio = require('./portfolio.ts');</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2200 - 900 && (
            <AnimatedSpan className="block text-left text-cyan-400">
              <span>debug&gt; portfolio</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2700 - 900 && (
            <AnimatedSpan className="block text-left text-yellow-300">
              <pre className="whitespace-pre-wrap text-xs">
                {`PortfolioData {
  name: 'Vanessa Depraute',
  title: 'Full-stack Developer',
  skills: [ 'React', 'Next.js', 'TypeScript' ],
  experience: 5
}`}
              </pre>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3600 - 900 && (
            <AnimatedSpan className="block text-left text-cyan-400">
              <span>debug&gt; portfolio.skills</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 4100 - 900 && (
            <AnimatedSpan className="block text-left text-yellow-300">
              <pre className="whitespace-pre-wrap text-xs">
                {`[ 'React', 'Next.js', 'TypeScript' ]`}
              </pre>
            </AnimatedSpan>
          )}
        </>
      ),
    },

    // 📖 Screen 7: Code editor
    {
      id: "code-part1",
      command: "vim App.tsx",
      typingDuration: 900,
      duration: 6000,
      content: (elapsed, typingComplete) => (
        <>
          <TypingAnimation delay={20} className="block text-left">
            &gt; vim App.tsx
          </TypingAnimation>

          {typingComplete && elapsed >= 1200 - 900 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap">
                <span className="text-blue-400">import</span>
                <span className="text-white"> React, </span>
                <span className="text-purple-400">
                  {"{ useEffect, useState }"}
                </span>
                <span className="text-white"> from </span>
                <span className="text-yellow-300">"react"</span>
                <span className="text-white">;</span>
              </pre>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 1700 - 900 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap">
                <span className="text-blue-400">import</span>
                <span className="text-white">{" { "}</span>
                <span className="text-purple-400">ReactNode </span>
                <span className="text-white">{"} from "}</span>
                <span className="text-yellow-300">"react"</span>
                <span className="text-white">;</span>
              </pre>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2200 - 900 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap">
                <span className="text-green-400">
                  // Main application component
                </span>
              </pre>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2800 - 900 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap">
                <span className="text-blue-400">export default</span>
                <span className="text-white"> </span>
                <span className="text-yellow-100">App</span>
                <span className="text-white">(): </span>
                <span className="text-blue-300">ReactNode</span>
                <span className="text-white">{" {"}</span>
              </pre>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3400 - 900 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap pl-4">
                <span className="text-blue-400">return</span>
                <span className="text-white"> (</span>
              </pre>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 4000 - 900 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap pl-8">
                <span className="text-purple-300">&lt;div&gt;</span>
              </pre>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 4500 - 900 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap pl-12">
                <span className="text-purple-300">&lt;h1&gt;</span>
                <span className="text-white">Hello World</span>
                <span className="text-purple-300">&lt;/h1&gt;</span>
              </pre>
            </AnimatedSpan>
          )}
        </>
      ),
    },

    // 📖 Screen 8: pnpm dev
    {
      id: "dev",
      command: "pnpm dev",
      typingDuration: 700,
      duration: 5500,
      content: (elapsed, typingComplete) => (
        <>
          <TypingAnimation delay={20} className="block text-left">
            &gt; pnpm dev
          </TypingAnimation>

          {typingComplete && elapsed >= 1100 - 700 && (
            <AnimatedSpan className="block text-left text-gray-400">
              <span>▲ Next.js 14.0.3</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 1600 - 700 && (
            <AnimatedSpan className="block text-left text-blue-400">
              <span>  Local:        http://localhost:3000</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2100 - 700 && (
            <AnimatedSpan className="block text-left text-blue-400">
              <span>  Environments: .env.local</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2700 - 700 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✓ Ready in 2.1s</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3300 - 700 && (
            <AnimatedSpan className="block text-left text-gray-400">
              <span>○ Compiling / ...</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3900 - 700 && (
            <AnimatedSpan className="text-green-400 block text-left">
              <span>✓ Compiled in 1.4s</span>
            </AnimatedSpan>
          )}
        </>
      ),
    },

    // 📖 Screen 9: pnpm build - Success
    {
      id: "fixed",
      command: "pnpm build",
      typingDuration: 700,
      duration: 4500,
      content: (elapsed, typingComplete) => (
        <>
          <TypingAnimation delay={20} className="block text-left">
            &gt; pnpm build
          </TypingAnimation>

          {typingComplete && elapsed >= 1100 - 700 && (
            <AnimatedSpan className="text-gray-400 block text-left">
              <span>▲ Next.js 14.0.3</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 1700 - 700 && (
            <AnimatedSpan className="text-blue-400 block text-left">
              <span>Creating optimized production build...</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2400 - 700 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✓ Compiled successfully</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3000 - 700 && (
            <AnimatedSpan className="text-blue-400 block text-left">
              <span>✓ Linting and type checking...</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3700 - 700 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✓ Build completed successfully</span>
            </AnimatedSpan>
          )}
        </>
      ),
    },

    ];

    // 📖 GIF screens: Reward/break screens with random cat GIFs
    const gif: ScreenSequence[] = [
    // 📖 Fullscreen GIF - Display moment 1
    {
      id: "fullscreen-gif-1",
      command: "",
      typingDuration: 0,
      duration: 3000,
      content: (_elapsed, _typingComplete, randomGif) => (
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={randomGif || CAT_GIFS[0]}
            alt="Fullscreen GIF"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      ),
    },

    // 📖 Fullscreen GIF - Display moment 2
    {
      id: "fullscreen-gif-2",
      command: "",
      typingDuration: 0,
      duration: 3500,
      content: (_elapsed, _typingComplete, randomGif) => (
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={randomGif || CAT_GIFS[0]}
            alt="Fullscreen GIF"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      ),
    },
    ];

    // Return both arrays
    return { codeScreens: code, gifScreens: gif };
  }, []); // 📖 Empty dependencies - screens never change during component lifetime

  // 📖 Combined screen sequences - built by concatenating code and gif arrays
  const screenSequences: ScreenSequence[] = useMemo(
    () => codeScreens.concat(gifScreens),
    [codeScreens, gifScreens]
  );

  /**
   * 📖 Handles transition to the next screen with pattern-based selection
   * 
   * Pattern: 0 → 1 → 2 → 0 (code → code → gif → repeat)
   * - Positions 0, 1: Random code screen
   * - Position 2: Random GIF screen with new random GIF URL
   * 
   * Transition includes a 500ms blank screen for visual separation.
   */
  const transitionToNextScreen = useCallback(() => {
    // 📖 Clear all timers related to the current screen
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }

    try {
      // 📖 Hide the current screen first for a blank transition
      setShowScreen(false);

      // 📖 Schedule showing the next screen after a short delay
      setTimeout(() => {
        try {
          // 📖 Determine next screen based on pattern (0, 1 = code; 2 = gif)
          const nextPatternPos = (patternPosition + 1) % 3; // Pattern cycles: 0 → 1 → 2 → 0
          let nextScreenIndex: number;

          if (nextPatternPos === 0 || nextPatternPos === 1) {
            // 📖 Pick a random code screen
            const randomCodeIndex = Math.floor(Math.random() * codeScreens.length);
            nextScreenIndex = randomCodeIndex;
          } else {
            // 📖 Pick a random GIF screen (pattern position === 2)
            const randomGifIndex = Math.floor(Math.random() * gifScreens.length);
            nextScreenIndex = codeScreens.length + randomGifIndex;
            // 📖 Pick a new random GIF URL for variety
            setCurrentGifUrl(CAT_GIFS[Math.floor(Math.random() * CAT_GIFS.length)]);
          }

          // 📖 Set the new screen index and update pattern
          setCurrentScreenIndex(nextScreenIndex);
          setPatternPosition(nextPatternPos);

          // 📖 Reset state for the new screen
          setScreenElapsedTime(0);
          setIsTypingComplete(false);
          screenStartTimeRef.current = Date.now();
          setShowScreen(true);
        } catch (error) {
          console.error("Error setting up next screen:", error);
        }
      }, 500); // 📖 500ms blank screen between transitions
    } catch (error) {
      console.error("Error initiating screen transition:", error);
    }
  }, [patternPosition]); // 📖 Only patternPosition changes, screen counts are constant

  // 📖 Initialize the animation only once on mount
  useEffect(() => {
    if (!isInitialized) {
      try {
        screenStartTimeRef.current = Date.now(); // Set start time for the very first screen
        setIsInitialized(true);
        // No need to call setShowScreen(true) here as it's the default state
      } catch (error) {
        console.error("Error during initial setup:", error);
      }
    }
    // 📖 Cleanup function to clear timers when the component unmounts
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (screenTransitionTimerRef.current)
        clearTimeout(screenTransitionTimerRef.current);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, [isInitialized]);

  // 📖 Update screen elapsed time and handle typing/transitions for the current screen
  useEffect(() => {
    // 📖 Only run effects if initialized and the screen is visible
    if (!isInitialized || !showScreen) return;

    let localIntervalRef: NodeJS.Timeout | null = null;
    let localTypingTimerRef: NodeJS.Timeout | null = null;
    let localScreenTransitionTimerRef: NodeJS.Timeout | null = null;

    try {
      const currentScreen = screenSequences[currentScreenIndex];
      if (!currentScreen) {
        console.error("Current screen data is missing.");
        return;
      }

      // 📖 Screen Elapsed Time Update Interval - updates every 50ms
      localIntervalRef = setInterval(() => {
        try {
          setScreenElapsedTime(Date.now() - screenStartTimeRef.current);
        } catch (error) {
          console.error("Error updating screen elapsed time:", error);
          if (localIntervalRef) clearInterval(localIntervalRef);
        }
      }, 50);
      intervalRef.current = localIntervalRef;

      // 📖 Typing Completion Timer - marks when typing animation should finish
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      localTypingTimerRef = setTimeout(() => {
        try {
          setIsTypingComplete(true);
        } catch (error) {
          console.error("Error setting typing complete:", error);
        }
      }, currentScreen.typingDuration);
      typingTimerRef.current = localTypingTimerRef;

      // 📖 Screen Transition Timer - triggers move to next screen after duration
      if (screenTransitionTimerRef.current)
        clearTimeout(screenTransitionTimerRef.current);
      localScreenTransitionTimerRef = setTimeout(() => {
        try {
          transitionToNextScreen();
        } catch (error) {
          console.error("Error executing screen transition:", error);
        }
      }, currentScreen.duration);
      screenTransitionTimerRef.current = localScreenTransitionTimerRef;
    } catch (error) {
      console.error("Error setting up timers for screen:", currentScreenIndex, error);
      // 📖 Clear any timers that might have been set before the error
      if (localIntervalRef) clearInterval(localIntervalRef);
      if (localTypingTimerRef) clearTimeout(localTypingTimerRef);
      if (localScreenTransitionTimerRef)
        clearTimeout(localScreenTransitionTimerRef);
    }

    // 📖 Cleanup function for this effect cycle
    return () => {
      if (localIntervalRef) clearInterval(localIntervalRef);
      if (localTypingTimerRef) clearTimeout(localTypingTimerRef);
      if (localScreenTransitionTimerRef)
        clearTimeout(localScreenTransitionTimerRef);
    };
  }, [currentScreenIndex, isInitialized, showScreen, transitionToNextScreen, screenSequences]);

  // 📖 --- Render Logic ---
  try {
    // 📖 Ensure we have a valid screen to render
    const currentScreen = screenSequences[currentScreenIndex];
    if (!currentScreen) {
      console.error("Attempting to render an invalid screen index:", currentScreenIndex);
      return <div>Error: Invalid screen configuration.</div>;
    }

    return (
      <>
        {/* 📖 Conditionally render the Terminal based on showScreen */}
        {showScreen && (
          <Terminal className="bg-black text-white">
            {/* 📖 Render the content of the current screen */}
            {currentScreen.content(screenElapsedTime, isTypingComplete, currentGifUrl)}
          </Terminal>
        )}
        {/* 📖 Render blank black screen during the transition period */}
        {!showScreen && <div className="w-full h-full bg-black"></div>}
      </>
    );
  } catch (error) {
    console.error("Error rendering TerminalDemo component:", error);
    // 📖 Fallback UI for critical rendering errors
    return (
      <div className="text-red-500 p-4">
        An error occurred while rendering the terminal demo. Please check the
        console.
      </div>
    );
  }
}
