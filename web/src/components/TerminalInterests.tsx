import React, { useState, useEffect, useRef, useMemo } from "react";

interface TerminalLine {
    type: "command" | "output" | "loader" | "error" | "clear";
    text: string;
    prefix?: string;
    delay?: number;
}

const AsciiLoader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [frame, setFrame] = useState(0);
    const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

    useEffect(() => {
        const interval = setInterval(() => {
            setFrame(f => {
                if (f + 1 >= 10) {
                    clearInterval(interval);
                    setTimeout(onComplete, 100);
                    return f;
                }
                return f + 1;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [onComplete]);

    return <span className="text-cyan-400">{frames[frame]}</span>;
};

const TerminalInterests: React.FC = () => {
    const [started, setStarted] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [visibleLines, setVisibleLines] = useState<TerminalLine[]>([]);
    const [showInterests, setShowInterests] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const interests = [
        { label: "making electronic music", emoji: "🎸" },
        { label: "ableton live", emoji: "🎹" },
        { label: "cuddling cats", emoji: "🐈" },
        { label: "photography", emoji: "📸" },
        { label: "gaming", emoji: "🎮" },
        { label: "training", emoji: "💪" },
        { label: "kickboxing", emoji: "🥊" },
        { label: "weird music instruments", emoji: "🪕" },
        { label: "chicken", emoji: "🍗" },
        { label: "green tea", emoji: "🍵" },
        { label: "a.i research papers", emoji: "🧠" },
        { label: "video editing", emoji: "🎬" },
        { label: "astronomy", emoji: "🔭" },
        { label: "cooking", emoji: "🍳" },
        { label: "my kids", emoji: "🧒" },
        { label: "hitch hiking", emoji: "🎒" },
        { label: "raves", emoji: "🔊" },
        { label: "drawing", emoji: "✏️" },
        { label: "painting", emoji: "🎨" },
        { label: "vr", emoji: "🥽" }
    ];

    const steps = useMemo(() => [
        { type: "command", text: "mcp connect ai.vanessa.dev --neuralink-bridge", prefix: ">" },
        { type: "output", text: "initializing neural handshake...", delay: 500 },
        { type: "output", text: "scanning brainwaves... ████████████ 100%", delay: 1000 },
        { type: "error", text: "[CRITICAL ERROR]", delay: 800 },
        { type: "error", text: ">> FIREWALL DETECTED: consciousness access denied", delay: 300 },
        { type: "error", text: ">> reason: unauthorized soul intrusion attempt", delay: 300 },
        { type: "error", text: ">> connection terminated.", delay: 800 },
        { type: "command", text: "bypass --protocol=empathy --auth=good-vibes-only", prefix: ">" },
        { type: "output", text: "bypassing security layers...", delay: 500 },
        { type: "output", text: "injecting mass amounts of coffee... ☕", delay: 800 },
        { type: "output", text: "bribing cat guardians... 🐱", delay: 800 },
        { type: "output", text: "accessing vanessa's creative cortex...", delay: 800 },
        { type: "output", text: "access granted ✓", delay: 600 },
        { type: "output", text: "welcome to vanessa's brain v4.2.0 (unstable build)", delay: 400 },
        { type: "command", text: "cat passions.txt", prefix: "guest@vanessa:~/neurons $", delay: 800 },
        { type: "clear", text: "", delay: 500 }
    ] as TerminalLine[], []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !started) {
                    setStarted(true);
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [started]);

    // Handle adding the next step to visible lines
    useEffect(() => {
        if (!started) return;

        // Don't add steps that are already visible (except for clear)
        if (steps[currentStep]?.type !== "clear" && visibleLines.length > currentStep) {
            return;
        }

        // Don't go beyond the steps array
        if (currentStep >= steps.length) {
            // Show interests when all steps are done
            if (!showInterests) {
                const timer = setTimeout(() => setShowInterests(true), 600);
                return () => clearTimeout(timer);
            }
            return;
        }

        const currentStepObj = steps[currentStep];

        // Handle clear type specially - clear the terminal and move to next step
        if (currentStepObj.type === "clear") {
            setVisibleLines([]);
            const clearDelay = currentStepObj.delay || 500;
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, clearDelay);
            return () => clearTimeout(timer);
        }

        // Add the step to visible lines for other types
        setVisibleLines(prev => [...prev, currentStepObj]);

        // Auto-advance to next step after its delay
        const nextDelay = currentStepObj.delay || 500;
        const timer = setTimeout(() => {
            setCurrentStep(prev => prev + 1);
        }, nextDelay);

        return () => clearTimeout(timer);
    }, [started, currentStep, steps, showInterests]);

    // Scroll to bottom when new lines appear
    useEffect(() => {
        if (scrollContainerRef.current) {
            // Use requestAnimationFrame to ensure DOM is updated before scrolling
            requestAnimationFrame(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
                }
            });
        }
    }, [visibleLines]);


    return (
        <div className="w-full max-w-5xl mx-auto mb-32 px-4" ref={containerRef}>
            <div className="bg-[#0c0c0c] rounded-xl border border-neutral-800 shadow-2xl overflow-hidden h-[700px] flex flex-col font-mono">
                {/* macOS Terminal Header */}
                <div className="bg-neutral-900/80 px-4 py-3 flex items-center justify-between border-b border-neutral-800 backdrop-blur-md flex-shrink-0">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                    </div>
                    <div className="text-neutral-500 text-xs select-none">vanessa —- shell —- 80×24</div>
                    <div className="w-12"></div>
                </div>

                {/* Terminal Content */}
                <div ref={scrollContainerRef} className="p-6 md:p-10 flex-grow overflow-y-auto">
                    {/* Render Lines */}
                    {visibleLines.map((line, i) => {
                        // Check if this is the current loader being animated
                        const isCurrentLoader = i === visibleLines.length - 1 && line.type === "loader";

                        return (
                            <div key={i} className="mb-2 flex flex-wrap gap-x-3 items-start">
                                {line.prefix && (
                                    <span className={line.prefix.includes("$") ? "text-green-500 font-bold" : "text-neutral-500"}>
                                        {line.prefix}
                                    </span>
                                )}
                                {isCurrentLoader ? (
                                    <div className="flex items-center gap-2 text-neutral-400">
                                        <AsciiLoader onComplete={() => {}} />
                                        <span>{line.text}</span>
                                    </div>
                                ) : (
                                    <span className={
                                        line.type === "command" ? "text-white" :
                                        line.type === "error" ? "text-orange-500 font-semibold" :
                                        line.type === "output" && line.text.includes("✓") ? "text-green-400 font-semibold" :
                                        "text-neutral-400 italic"
                                    }>
                                        {line.text}
                                    </span>
                                )}
                            </div>
                        );
                    })}

                    {/* Interests 3-Column Grid */}
                    {showInterests && (
                        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            {interests.map((interest, i) => (
                                <div key={i} className="flex items-center gap-2 text-neutral-300 hover:text-white transition-all duration-300 group cursor-default">
                                    <span className="text-neutral-300 group-hover:text-white transition-colors font-bold">-</span>
                                    <span className="text-sm md:text-base lowercase tracking-wide">{interest.label}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Final fake prompt if everything is shown */}
                    {showInterests && (
                        <div className="mt-6 flex gap-x-3 items-center">
                            <span className="text-green-500 font-bold">guest@home ~/vanessa/whatvanessaloves $</span>
                            <span className="w-2.5 h-5 bg-white animate-pulse"></span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TerminalInterests;
