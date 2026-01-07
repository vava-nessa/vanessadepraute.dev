import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/registry/magicui/terminal";

// Array of cat GIFs to randomly select from
const CAT_GIFS = [
  "https://i.giphy.com/rj5LtFB78DKAb0y3aR.webp",
  "https://i.giphy.com/JIX9t2j0ZTN9S.webp",
  "https://i.giphy.com/VbnUQpnihPSIgIXuZv.webp",
  "https://i.giphy.com/mlvseq9yvZhba.webp",
  "https://i.giphy.com/3oriO0OEd9QIDdllqo.webp",
  "https://i.giphy.com/ICOgUNjpvO0PC.webp",
  "https://i.giphy.com/nR4L10XlJcSeQ.webp",
  "https://i.giphy.com/vFKqnCdLPNOKc.webp",
];

// Define the sequence of screens to display in order
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

export default function TerminalDemo() {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [screenElapsedTime, setScreenElapsedTime] = useState(0); // Time elapsed since the current screen started
  const [showScreen, setShowScreen] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [currentGifUrl, setCurrentGifUrl] = useState(() =>
    CAT_GIFS[Math.floor(Math.random() * CAT_GIFS.length)]
  );

  const screenStartTimeRef = useRef<number>(0); // Timestamp when the current screen started
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const screenTransitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Define all screen sequences
  const screenSequences: ScreenSequence[] = [
    // Screen 1: Initial shadcn init
    {
      id: "init",
      command: "pnpm dlx shadcn@latest init",
      typingDuration: 1200,
      duration: 5000,
      content: (elapsed, typingComplete) => (
        <>
          {/* Command appears almost instantly */}
          <TypingAnimation delay={100} className="block text-left">
            &gt; pnpm dlx shadcn@latest init
          </TypingAnimation>

          {/* Content appears after typing animation is complete */}
          {typingComplete &&
            elapsed >= 1500 - 1200 && ( // Adjusted timing relative to typing end
              <AnimatedSpan className="text-green-500 block text-left">
                <span>✔ Preflight checks.</span>
              </AnimatedSpan>
            )}

          {typingComplete && elapsed >= 1900 - 1200 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✔ Verifying framework. Found Next.js.</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2300 - 1200 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✔ Validating Tailwind CSS.</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2700 - 1200 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✔ Validating import alias.</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3100 - 1200 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✔ Writing components.json.</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3500 - 1200 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✔ Checking registry.</span>
            </AnimatedSpan>
          )}
        </>
      ),
    },

    // Screen 2: Button installation
    {
      id: "button",
      command: "pnpm dlx shadcn@latest install button",
      typingDuration: 1500,
      duration: 9000,
      content: (elapsed, typingComplete) => (
        <>
          <TypingAnimation delay={100} className="block text-left">
            &gt; pnpm dlx shadcn@latest install button
          </TypingAnimation>

          {typingComplete && elapsed >= 1800 - 1500 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✔ Updating tailwind.config.ts</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2600 - 1500 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✔ Updating app/globals.css</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3400 - 1500 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✔ Installing dependencies.</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 4200 - 1500 && (
            <AnimatedSpan className="text-blue-500 block text-left">
              <span>ℹ Added components:</span>
              <span className="pl-2">- Button</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 5000 - 1500 && (
            <TypingAnimation
              delay={500} // Short delay after previous line
              className="text-muted-foreground block text-left"
            >
              Success! Component installation completed.
            </TypingAnimation>
          )}

          {typingComplete && elapsed >= 6500 - 1500 && (
            <TypingAnimation
              delay={500} // Short delay after previous line
              className="text-muted-foreground block text-left"
            >
              You may now use the Button component.
            </TypingAnimation>
          )}
        </>
      ),
    },
    // --- NEW GIF SCREEN ---
    {
      id: "gif-display",
      command: "cat reaction.gif", // Example command
      typingDuration: 800,
      duration: 5000, // Show GIF for 5 seconds
      content: (elapsed, typingComplete, randomGif) => (
        <>
          <TypingAnimation delay={100} className="block text-left">
            &gt; cat reaction.gif
          </TypingAnimation>

          {typingComplete &&
            elapsed > 200 && ( // Show GIF shortly after typing completes
              <AnimatedSpan className="block text-left w-full h-full flex items-center justify-center">
                {/* Ensure the image scales reasonably within the terminal */}
                <img
                  src={randomGif || CAT_GIFS[0]}
                  alt="Reaction GIF"
                  className="max-w-full max-h-48 object-contain" // Adjust size as needed
                />
              </AnimatedSpan>
            )}
        </>
      ),
    },
    // ---------------------

    // Screen 3: Object Viewing/Debugging (Adjusted timings)
    {
      id: "data-objects",
      command: "node inspect src/utils/dataUtils.js",
      typingDuration: 1300,
      duration: 7000,
      content: (elapsed, typingComplete) => (
        <>
          <TypingAnimation delay={100} className="block text-left">
            &gt; node inspect src/utils/dataUtils.js
          </TypingAnimation>

          {typingComplete && elapsed >= 1600 - 1300 && (
            <AnimatedSpan className="block text-left text-white">
              <span>{"< Debugger listening on ws://127.0.0.1:9229/..."}</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2100 - 1300 && (
            <AnimatedSpan className="block text-left text-white">
              <span>{"debug> const data = getInitialData();"}</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2600 - 1300 && (
            <AnimatedSpan className="block text-left text-white">
              <span>{"debug> data"}</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3100 - 1300 && (
            <AnimatedSpan className="block text-left text-yellow-300">
              <pre className="whitespace-pre-wrap">
                {`[
  {
    id: "item-1",
    name: "First data item",
    value: 42,
    metadata: { created: "2023-05-12", type: "number" }
  },
  {
    id: "item-2",
    name: "Second data item",
    value: "string value",
    metadata: { created: "2023-05-13", type: "string" }
  }
]`}
              </pre>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 4200 - 1300 && (
            <AnimatedSpan className="block text-left text-white">
              <span>{"debug> data[0].metadata"}</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 4700 - 1300 && (
            <AnimatedSpan className="block text-left text-yellow-300">
              <pre className="whitespace-pre-wrap">
                {`{
  created: "2023-05-12",
  type: "number"
}`}
              </pre>
            </AnimatedSpan>
          )}
        </>
      ),
    },

    // Screen 4: Code editor part 1 (Adjusted timings)
    {
      id: "code-part1",
      command: "vim src/components/DataProcessor.tsx",
      typingDuration: 1300,
      duration: 6000,
      content: (elapsed, typingComplete) => (
        <>
          <TypingAnimation delay={100} className="block text-left">
            &gt; vim src/components/DataProcessor.tsx
          </TypingAnimation>

          {typingComplete && elapsed >= 1600 - 1300 && (
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

          {typingComplete && elapsed >= 2200 - 1300 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap">
                <span className="text-blue-400">import</span>
                <span className="text-white"> </span>
                <span className="text-purple-400">
                  {"{ processData, DataItem }"}
                </span>
                <span className="text-white"> from </span>
                <span className="text-yellow-300">"../utils/dataUtils"</span>
                <span className="text-white">;</span>
              </pre>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2800 - 1300 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap">
                <span className="text-green-400">
                  // Advanced data processing component
                </span>
              </pre>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3400 - 1300 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap">
                <span className="text-blue-400">interface</span>
                <span className="text-yellow-200"> DataProcessorProps </span>
                <span className="text-white">{"{"}</span>
              </pre>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 4000 - 1300 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap pl-4">
                <span className="text-blue-300">initialData</span>
                <span className="text-white">: </span>
                <span className="text-yellow-200">DataItem[]</span>
                <span className="text-white">;</span>
              </pre>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 4600 - 1300 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap pl-4">
                <span className="text-blue-300">processingOptions</span>
                <span className="text-white">?: </span>
                <span className="text-yellow-200">
                  {"{ depth: number; recursive: boolean }"}
                </span>
                <span className="text-white">;</span>
              </pre>
            </AnimatedSpan>
          )}
        </>
      ),
    },

    // Screen 5: Code editor part 2 (Adjusted timings)
    {
      id: "code-part2",
      command: "vim src/components/DataProcessor.tsx",
      typingDuration: 1000,
      duration: 7000,
      content: (elapsed, typingComplete) => (
        <>
          <TypingAnimation delay={100} className="block text-left">
            &gt; vim src/components/DataProcessor.tsx (continued)
          </TypingAnimation>

          {typingComplete && elapsed >= 1300 - 1000 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap">
                <span className="text-blue-400">const</span>
                <span className="text-yellow-100"> DataProcessor</span>
                <span className="text-white">: </span>
                <span className="text-blue-300">React.FC</span>
                <span className="text-purple-300">
                  {"<DataProcessorProps>"}
                </span>
                <span className="text-white"> = </span>
                <span className="text-purple-300">{"({"}</span>
              </pre>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2100 - 1000 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap pl-4">
                <span className="text-blue-300">initialData</span>
                <span className="text-white">,</span>
              </pre>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2700 - 1000 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap pl-4">
                <span className="text-blue-300">processingOptions</span>
                <span className="text-white"> = </span>
                <span className="text-purple-300">
                  {"{ depth: 2, recursive: true }"}
                </span>
              </pre>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3500 - 1000 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap">
                <span className="text-purple-300">{"}) => {"}</span>
              </pre>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 4100 - 1000 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap pl-4">
                <span className="text-blue-400">const</span>
                <span className="text-white"> [</span>
                <span className="text-blue-300">data</span>
                <span className="text-white">, </span>
                <span className="text-yellow-100">setData</span>
                <span className="text-white">] = </span>
                <span className="text-blue-400">useState</span>
                <span className="text-purple-300">{"<DataItem[]>"}</span>
                <span className="text-white">(initialData);</span>
              </pre>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 5100 - 1000 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap pl-4">
                <span className="text-blue-400">try</span>
                <span className="text-white"> {"{"}</span>
                <span className="text-white"> // Processing logic... </span>
                <span className="text-white">{"}"}</span>
                <span className="text-blue-400"> catch </span>
                <span className="text-white">(error) {"{"}</span>
                <span className="text-white"> // Error handling... </span>
                <span className="text-white">{"}"}</span>
              </pre>
            </AnimatedSpan>
          )}
        </>
      ),
    },

    // Screen 6: npm run dev (Adjusted timings)
    {
      id: "dev",
      command: "npm run dev",
      typingDuration: 900,
      duration: 5500,
      content: (elapsed, typingComplete) => (
        <>
          <TypingAnimation delay={100} className="block text-left">
            &gt; npm run dev
          </TypingAnimation>

          {typingComplete && elapsed >= 1200 - 900 && (
            <AnimatedSpan className="block text-left text-green-400">
              <span>Started development server on http://localhost:3000</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 1800 - 900 && (
            <AnimatedSpan className="block text-left text-blue-400">
              <span>
                ready - started server on 0.0.0.0:3000, url:
                http://localhost:3000
              </span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2400 - 900 && (
            <AnimatedSpan className="block text-left text-yellow-400">
              <span>info - Loaded env from .env.local</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3000 - 900 && (
            <AnimatedSpan className="block text-left text-green-400">
              <span>✓ Ready in 1.8s</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3600 - 900 && (
            <AnimatedSpan className="block text-left text-gray-400">
              <span>● Compiling /_error (client and server)...</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 4200 - 900 && (
            <AnimatedSpan className="block text-left text-green-400">
              <span>✓ Compiled successfully</span>
            </AnimatedSpan>
          )}
        </>
      ),
    },

    // --- SECOND CAT GIF SCREEN ---
    {
      id: "gif-display-2",
      command: "cat celebration.gif",
      typingDuration: 800,
      duration: 4000, // Show GIF for 4 seconds
      content: (elapsed, typingComplete, randomGif) => (
        <>
          <TypingAnimation delay={100} className="block text-left">
            &gt; cat celebration.gif
          </TypingAnimation>

          {typingComplete &&
            elapsed > 200 && (
              <AnimatedSpan className="block text-left w-full h-full flex items-center justify-center">
                <img
                  src={randomGif || CAT_GIFS[0]}
                  alt="Celebration GIF"
                  className="max-w-full max-h-48 object-contain"
                />
              </AnimatedSpan>
            )}
        </>
      ),
    },
    // ---------------------

    // Screen 7: Error messages (Adjusted timings)
    {
      id: "error",
      command: "npm run build",
      typingDuration: 800,
      duration: 5500,
      content: (elapsed, typingComplete) => (
        <>
          <TypingAnimation delay={100} className="block text-left">
            &gt; npm run build
          </TypingAnimation>

          {typingComplete && elapsed >= 1100 - 800 && (
            <AnimatedSpan className="block text-left text-red-500 font-bold">
              <span>ERROR in ./src/components/DataProcessor.tsx</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 1600 - 800 && (
            <AnimatedSpan className="block text-left text-red-500">
              <span>
                Module build failed (from
                ./node_modules/babel-loader/lib/index.js):
              </span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2100 - 800 && (
            <AnimatedSpan className="block text-left text-red-500">
              <span>
                SyntaxError: ./src/components/DataProcessor.tsx: Unexpected
                token (42:18)
              </span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2600 - 800 && (
            <AnimatedSpan className="block text-left text-red-500">
              <span>{"> 42 |       setData(result.map(item => {{"}</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3100 - 800 && (
            <AnimatedSpan className="block text-left text-red-500 font-bold">
              <span>Failed to compile.</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3600 - 800 && (
            <AnimatedSpan className="block text-left text-red-500">
              <span>
                Error: TypeScript error: Property 'map' does not exist on type
                'unknown'.
              </span>
            </AnimatedSpan>
          )}
        </>
      ),
    },

    // Screen 8: Bug fixed (Adjusted timings)
    {
      id: "fixed",
      command: "npm run build",
      typingDuration: 800,
      duration: 3500,
      content: (elapsed, typingComplete) => (
        <>
          <TypingAnimation delay={100} className="block text-left">
            &gt; npm run build
          </TypingAnimation>

          {typingComplete && elapsed >= 1100 - 800 && (
            <AnimatedSpan className="block text-left text-green-500 font-bold">
              <span>✓ Bug fixed.</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 1800 - 800 && (
            <AnimatedSpan className="block text-left text-green-500">
              <span>✓ Creating an optimized production build...</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2500 - 800 && (
            <AnimatedSpan className="block text-left text-green-500">
              <span>✓ Compiled successfully.</span>
            </AnimatedSpan>
          )}
        </>
      ),
    },
  ];

  // Function to handle screen transitions
  const transitionToNextScreen = useCallback(() => {
    // Clear timers related to the current screen
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }

    try {
      // Hide the current screen first for a blank transition
      setShowScreen(false);

      // Schedule showing the next screen after a short delay
      setTimeout(() => {
        try {
          const nextIndex = (currentScreenIndex + 1) % screenSequences.length;
          setCurrentScreenIndex(nextIndex);
          // Reset state for the new screen
          setScreenElapsedTime(0);
          setIsTypingComplete(false);
          // Pick a new random GIF for the next cycle
          setCurrentGifUrl(CAT_GIFS[Math.floor(Math.random() * CAT_GIFS.length)]);
          screenStartTimeRef.current = Date.now(); // Record start time for the new screen
          setShowScreen(true); // Show the new screen
        } catch (error) {
          console.error("Error setting up next screen:", error);
          // Handle error, maybe try to recover or show an error state
        }
      }, 500); // 0.5 second blank screen between transitions
    } catch (error) {
      console.error("Error initiating screen transition:", error);
      // Handle error if hiding fails
    }
  }, [currentScreenIndex]); // screenSequences.length is constant

  // Initialize the animation only once on mount
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
    // Cleanup function to clear timers when the component unmounts
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (screenTransitionTimerRef.current)
        clearTimeout(screenTransitionTimerRef.current);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, [isInitialized]);

  // Update screen elapsed time and handle typing/transitions for the current screen
  useEffect(() => {
    // Only run effects if initialized and the screen is visible
    if (!isInitialized || !showScreen) return;

    let localIntervalRef: NodeJS.Timeout | null = null;
    let localTypingTimerRef: NodeJS.Timeout | null = null;
    let localScreenTransitionTimerRef: NodeJS.Timeout | null = null;

    try {
      const currentScreen = screenSequences[currentScreenIndex];
      if (!currentScreen) {
        console.error("Current screen data is missing.");
        return; // Avoid further execution if screen data is invalid
      }

      // --- Screen Elapsed Time Update Interval ---
      localIntervalRef = setInterval(() => {
        try {
          setScreenElapsedTime(Date.now() - screenStartTimeRef.current);
        } catch (error) {
          console.error("Error updating screen elapsed time:", error);
          if (localIntervalRef) clearInterval(localIntervalRef); // Stop interval on error
        }
      }, 50); // Update elapsed time every 50ms
      intervalRef.current = localIntervalRef;

      // --- Typing Completion Timer ---
      // Clear previous timer before setting a new one
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      localTypingTimerRef = setTimeout(() => {
        try {
          setIsTypingComplete(true);
        } catch (error) {
          console.error("Error setting typing complete:", error);
        }
      }, currentScreen.typingDuration);
      typingTimerRef.current = localTypingTimerRef;

      // --- Screen Transition Timer ---
      // Clear previous timer before setting a new one
      if (screenTransitionTimerRef.current)
        clearTimeout(screenTransitionTimerRef.current);
      localScreenTransitionTimerRef = setTimeout(() => {
        // Ensure transition logic is wrapped in try...catch
        try {
          transitionToNextScreen();
        } catch (error) {
          console.error("Error executing screen transition:", error);
        }
      }, currentScreen.duration);
      screenTransitionTimerRef.current = localScreenTransitionTimerRef;
    } catch (error) {
      console.error(
        "Error setting up timers for screen:",
        currentScreenIndex,
        error
      );
      // Clear any timers that might have been set before the error
      if (localIntervalRef) clearInterval(localIntervalRef);
      if (localTypingTimerRef) clearTimeout(localTypingTimerRef);
      if (localScreenTransitionTimerRef)
        clearTimeout(localScreenTransitionTimerRef);
    }

    // Cleanup function for this effect cycle
    return () => {
      if (localIntervalRef) clearInterval(localIntervalRef);
      if (localTypingTimerRef) clearTimeout(localTypingTimerRef);
      if (localScreenTransitionTimerRef)
        clearTimeout(localScreenTransitionTimerRef);
    };
  }, [currentScreenIndex, isInitialized, showScreen, transitionToNextScreen]); // Add transitionToNextScreen dependency

  // --- Render Logic ---
  try {
    // Ensure we have a valid screen to render
    const currentScreen = screenSequences[currentScreenIndex];
    if (!currentScreen) {
      // Handle the case where the screen data might be invalid or index out of bounds
      console.error(
        "Attempting to render an invalid screen index:",
        currentScreenIndex
      );
      return <div>Error: Invalid screen configuration.</div>;
    }

    return (
      <>
        {/* Conditionally render the Terminal based on showScreen */}
        {showScreen && (
          <Terminal className="bg-black text-white">
            {/* Render the content of the current screen */}
            {currentScreen.content(screenElapsedTime, isTypingComplete, currentGifUrl)}
          </Terminal>
        )}
        {/* Render nothing during the blank transition period */}
        {!showScreen && <div className="w-full h-full bg-black"></div>}
      </>
    );
  } catch (error) {
    console.error("Error rendering TerminalDemo component:", error);
    // Render a fallback UI in case of a critical rendering error
    return (
      <div className="text-red-500 p-4">
        An error occurred while rendering the terminal demo. Please check the
        console.
      </div>
    );
  }
}
