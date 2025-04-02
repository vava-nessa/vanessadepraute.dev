import React, { useEffect, useState, useRef } from "react";

// Terminal component
export function Terminal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-2 text-white font-mono overflow-hidden ${className}`}>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

// Typing Animation component
export function TypingAnimation({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [content, setContent] = useState("");
  const text = children ? children.toString() : "";

  useEffect(() => {
    try {
      const timeoutId = setTimeout(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
          try {
            if (currentIndex <= text.length) {
              setContent(text.substring(0, currentIndex));
              currentIndex++;
            } else {
              clearInterval(interval);
            }
          } catch (error) {
            console.error("Error in typing animation interval:", error);
            clearInterval(interval);
          }
        }, 50);

        return () => clearInterval(interval);
      }, delay);

      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.error("Error in typing animation effect:", error);
    }
  }, [text, delay]);

  return <div className={className}>{content}</div>;
}

// Animated Span component
export function AnimatedSpan({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const timeoutId = setTimeout(() => {
        setVisible(true);
      }, delay);

      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.error("Error in animated span effect:", error);
    }
  }, [delay]);

  return (
    <div
      ref={elementRef}
      className={`transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
