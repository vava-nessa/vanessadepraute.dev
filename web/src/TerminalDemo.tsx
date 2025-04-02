import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/registry/magicui/terminal";

// Define the sequence of screens to display in order
type ScreenSequence = {
  id: string;
  command: string;
  typingDuration: number; // Duration of the typing animation
  duration: number; // Total duration of the screen
  maxVisibleLines?: number; // Maximum visible lines before clearing
  content: (elapsedTime: number, isTypingComplete: boolean) => React.ReactNode;
};

export default function TerminalDemo() {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showScreen, setShowScreen] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Define all screen sequences
  const screenSequences: ScreenSequence[] = [
    // Screen 1: Initial shadcn init
    {
      id: "init",
      command: "pnpm dlx shadcn@latest init",
      typingDuration: 1200, // Time to complete typing the command
      duration: 5000,
      maxVisibleLines: 7,
      content: (elapsed, typingComplete) => (
        <>
          <TypingAnimation delay={800} className="block text-left">
            &gt; pnpm dlx shadcn@latest init
          </TypingAnimation>

          {typingComplete && elapsed >= 1500 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✔ Preflight checks.</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 1900 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✔ Verifying framework. Found Next.js.</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2300 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✔ Validating Tailwind CSS.</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2700 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✔ Validating import alias.</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3100 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✔ Writing components.json.</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3500 && (
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
      maxVisibleLines: 7,
      content: (elapsed, typingComplete) => (
        <>
          <TypingAnimation delay={800} className="block text-left">
            &gt; pnpm dlx shadcn@latest install button
          </TypingAnimation>

          {typingComplete && elapsed >= 1800 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✔ Updating tailwind.config.ts</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2600 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✔ Updating app/globals.css</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3400 && (
            <AnimatedSpan className="text-green-500 block text-left">
              <span>✔ Installing dependencies.</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 4200 && (
            <AnimatedSpan className="text-blue-500 block text-left">
              <span>ℹ Added components:</span>
              <span className="pl-2">- Button</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 5000 && (
            <TypingAnimation
              delay={1000}
              className="text-muted-foreground block text-left"
            >
              Success! Component installation completed.
            </TypingAnimation>
          )}

          {typingComplete && elapsed >= 6500 && (
            <TypingAnimation
              delay={1000}
              className="text-muted-foreground block text-left"
            >
              You may now use the Button component.
            </TypingAnimation>
          )}
        </>
      ),
    },

    // NEW SCREEN: Object Viewing/Debugging
    {
      id: "data-objects",
      command: "node inspect src/utils/dataUtils.js",
      typingDuration: 1300,
      duration: 7000,
      maxVisibleLines: 7,
      content: (elapsed, typingComplete) => (
        <>
          <TypingAnimation delay={800} className="block text-left">
            &gt; node inspect src/utils/dataUtils.js
          </TypingAnimation>

          {typingComplete && elapsed >= 1600 && (
            <AnimatedSpan className="block text-left text-white text-xs">
              <span>{"< Debugger listening on ws://127.0.0.1:9229/..."}</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2100 && (
            <AnimatedSpan className="block text-left text-white text-xs">
              <span>{"debug> const data = getInitialData();"}</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2600 && (
            <AnimatedSpan className="block text-left text-white text-xs">
              <span>{"debug> data"}</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3100 && (
            <AnimatedSpan className="block text-left text-yellow-300 text-xs">
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

          {typingComplete && elapsed >= 4200 && (
            <AnimatedSpan className="block text-left text-white text-xs">
              <span>{"debug> data[0].metadata"}</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 4700 && (
            <AnimatedSpan className="block text-left text-yellow-300 text-xs">
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

    // Screen 3: Code editor with DataProcessor (split into 2 parts to avoid too many lines)
    {
      id: "code-part1",
      command: "vim src/components/DataProcessor.tsx",
      typingDuration: 1300,
      duration: 6000,
      maxVisibleLines: 7,
      content: (elapsed, typingComplete) => (
        <>
          <TypingAnimation delay={800} className="block text-left">
            &gt; vim src/components/DataProcessor.tsx
          </TypingAnimation>

          {typingComplete && elapsed >= 1600 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap text-xs">
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

          {typingComplete && elapsed >= 2200 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap text-xs">
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

          {typingComplete && elapsed >= 2800 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap text-xs">
                <span className="text-green-400">
                  // Advanced data processing component
                </span>
              </pre>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3400 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap text-xs">
                <span className="text-blue-400">interface</span>
                <span className="text-yellow-200"> DataProcessorProps </span>
                <span className="text-white">{"{"}</span>
              </pre>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 4000 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap text-xs pl-4">
                <span className="text-blue-300">initialData</span>
                <span className="text-white">: </span>
                <span className="text-yellow-200">DataItem[]</span>
                <span className="text-white">;</span>
              </pre>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 4600 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap text-xs pl-4">
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

    // Code editor part 2
    {
      id: "code-part2",
      command: "vim src/components/DataProcessor.tsx",
      typingDuration: 1000,
      duration: 7000,
      maxVisibleLines: 7,
      content: (elapsed, typingComplete) => (
        <>
          <TypingAnimation delay={800} className="block text-left">
            &gt; vim src/components/DataProcessor.tsx (continued)
          </TypingAnimation>

          {typingComplete && elapsed >= 1300 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap text-xs">
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

          {typingComplete && elapsed >= 2100 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap text-xs pl-4">
                <span className="text-blue-300">initialData</span>
                <span className="text-white">,</span>
              </pre>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2700 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap text-xs pl-4">
                <span className="text-blue-300">processingOptions</span>
                <span className="text-white"> = </span>
                <span className="text-purple-300">
                  {"{ depth: 2, recursive: true }"}
                </span>
              </pre>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3500 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap text-xs">
                <span className="text-purple-300">{"}) => {"}</span>
              </pre>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 4100 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap text-xs pl-4">
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

          {typingComplete && elapsed >= 5100 && (
            <AnimatedSpan className="block text-left">
              <pre className="whitespace-pre-wrap text-xs pl-4">
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

    // Screen 4: npm run dev
    {
      id: "dev",
      command: "npm run dev",
      typingDuration: 900,
      duration: 5500,
      maxVisibleLines: 7,
      content: (elapsed, typingComplete) => (
        <>
          <TypingAnimation delay={800} className="block text-left">
            &gt; npm run dev
          </TypingAnimation>

          {typingComplete && elapsed >= 1200 && (
            <AnimatedSpan className="block text-left text-green-400">
              <span>Started development server on http://localhost:3000</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 1800 && (
            <AnimatedSpan className="block text-left text-blue-400">
              <span>
                ready - started server on 0.0.0.0:3000, url:
                http://localhost:3000
              </span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2400 && (
            <AnimatedSpan className="block text-left text-yellow-400">
              <span>info - Loaded env from .env.local</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3000 && (
            <AnimatedSpan className="block text-left text-green-400">
              <span>✓ Ready in 1.8s</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3600 && (
            <AnimatedSpan className="block text-left text-gray-400">
              <span>● Compiling /_error (client and server)...</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 4200 && (
            <AnimatedSpan className="block text-left text-green-400">
              <span>✓ Compiled successfully</span>
            </AnimatedSpan>
          )}
        </>
      ),
    },

    // Screen 5: Error messages in red
    {
      id: "error",
      command: "npm run build",
      typingDuration: 800,
      duration: 5500,
      maxVisibleLines: 7,
      content: (elapsed, typingComplete) => (
        <>
          <TypingAnimation delay={800} className="block text-left">
            &gt; npm run build
          </TypingAnimation>

          {typingComplete && elapsed >= 1100 && (
            <AnimatedSpan className="block text-left text-red-500 font-bold">
              <span>ERROR in ./src/components/DataProcessor.tsx</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 1600 && (
            <AnimatedSpan className="block text-left text-red-500">
              <span>
                Module build failed (from
                ./node_modules/babel-loader/lib/index.js):
              </span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2100 && (
            <AnimatedSpan className="block text-left text-red-500">
              <span>
                SyntaxError: ./src/components/DataProcessor.tsx: Unexpected
                token (42:18)
              </span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2600 && (
            <AnimatedSpan className="block text-left text-red-500">
              <span>{"> 42 |       setData(result.map(item => {{"}</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3100 && (
            <AnimatedSpan className="block text-left text-red-500 font-bold">
              <span>Failed to compile.</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 3600 && (
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

    // Screen 6: Bug fixed in green
    {
      id: "fixed",
      command: "npm run build",
      typingDuration: 800,
      duration: 3500,
      maxVisibleLines: 7,
      content: (elapsed, typingComplete) => (
        <>
          <TypingAnimation delay={800} className="block text-left">
            &gt; npm run build
          </TypingAnimation>

          {typingComplete && elapsed >= 1100 && (
            <AnimatedSpan className="block text-left text-green-500 font-bold">
              <span>✓ Bug fixed.</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 1800 && (
            <AnimatedSpan className="block text-left text-green-500">
              <span>✓ Creating an optimized production build...</span>
            </AnimatedSpan>
          )}

          {typingComplete && elapsed >= 2500 && (
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
    try {
      // First hide the current screen
      setShowScreen(false);
      setIsTypingComplete(false);

      // Schedule showing the next screen
      setTimeout(() => {
        try {
          const nextIndex = (currentScreenIndex + 1) % screenSequences.length;
          setCurrentScreenIndex(nextIndex);
          setStartTime(Date.now());
          setElapsedTime(0);
          setShowScreen(true);
        } catch (error) {
          console.error("Error transitioning to next screen:", error);
        }
      }, 500); // 0.5 second blank screen between transitions
    } catch (error) {
      console.error("Error hiding current screen:", error);
    }
  }, [currentScreenIndex]);

  // Initialize the animation only once
  useEffect(() => {
    if (!isInitialized) {
      try {
        setStartTime(Date.now());
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing animation:", error);
      }
    }
  }, [isInitialized]);

  // Update elapsed time at regular intervals
  useEffect(() => {
    try {
      // Create animation interval for elapsed time updates
      intervalRef.current = setInterval(() => {
        try {
          setElapsedTime(Date.now() - startTime);
        } catch (error) {
          console.error("Error updating elapsed time:", error);
        }
      }, 50); // Update elapsed time every 50ms

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    } catch (error) {
      console.error("Error setting up animation interval:", error);
    }
  }, [startTime]);

  // Handle typing completion
  useEffect(() => {
    if (!isInitialized || !showScreen) return;

    try {
      // Clear any existing typing timer
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = null;
      }

      const currentScreen = screenSequences[currentScreenIndex];

      // Set typing to complete after the specified typing duration
      typingTimerRef.current = setTimeout(() => {
        try {
          setIsTypingComplete(true);
        } catch (error) {
          console.error("Error setting typing completion:", error);
        }
      }, currentScreen.typingDuration);

      return () => {
        if (typingTimerRef.current) {
          clearTimeout(typingTimerRef.current);
          typingTimerRef.current = null;
        }
      };
    } catch (error) {
      console.error("Error handling typing completion:", error);
    }
  }, [currentScreenIndex, isInitialized, showScreen]);

  // Handle screen transitions
  useEffect(() => {
    if (!isInitialized) return;

    try {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      // Get the current screen sequence
      const currentScreen = screenSequences[currentScreenIndex];

      // Schedule the next screen transition
      timerRef.current = setTimeout(() => {
        transitionToNextScreen();
      }, currentScreen.duration);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    } catch (error) {
      console.error("Error handling screen transitions:", error);
    }
  }, [currentScreenIndex, isInitialized, transitionToNextScreen]);

  const terminalStyle = {
    textAlign: "left",
    fontFamily: "monospace",
    paddingLeft: "8px",
    height: "250px",
    overflowY: "hidden", // Prevent scrolling
  };

  try {
    // Get the current screen sequence
    const currentScreen = screenSequences[currentScreenIndex];

    return (
      <>
        {showScreen && (
          <Terminal className="bg-black text-white border border-gray-700 shadow-lg">
            {currentScreen?.content(elapsedTime, isTypingComplete)}
          </Terminal>
        )}
      </>
    );
  } catch (error) {
    console.error("Error rendering TerminalDemo:", error);
    return <div>Error loading terminal demo</div>;
  }
}
