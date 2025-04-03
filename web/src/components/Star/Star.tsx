import React, { useEffect, useState } from "react";
import "./Star.css";

interface StarProps {
  /** Delay in milliseconds before the star animation is triggered */
  delay?: number;
  /** Optional color for the star */
  color?: string;
  /** Callback function when star activates */
  onActivate?: () => void;
  /** Initial active state */
  initialActive?: boolean;
  /** Whether clicking should toggle the star (default: false) */
  clickable?: boolean;
}

const Star: React.FC<StarProps> = ({
  delay = 0,
  color,
  onActivate,
  initialActive = false,
  clickable = false,
}) => {
  const [active, setActive] = useState(initialActive);

  useEffect(() => {
    if (delay > 0) {
      try {
        const timer = setTimeout(() => {
          setActive(true);
          if (onActivate) {
            onActivate();
          }
        }, delay);

        return () => clearTimeout(timer);
      } catch (error) {
        console.error("Error in Star component timer:", error);
      }
    }
  }, [delay, onActivate]);

  const handleClick = () => {
    if (!clickable) return;

    try {
      setActive(!active);
      if (!active && onActivate) {
        onActivate();
      }
    } catch (error) {
      console.error("Error handling star click:", error);
    }
  };

  const starStyle = color
    ? ({ "--star-color": color } as React.CSSProperties)
    : {};

  return (
    <div
      title="Star"
      className={`star ${active ? "active" : ""} ${
        clickable ? "clickable" : ""
      }`}
      style={starStyle}
      onClick={handleClick}
    >
      <div className="svg-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="svg-outline"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.5L9.45 8.5L3 9.06L7.725 13.39L6.25 19.82L12 16.5L17.75 19.82L16.275 13.39L21 9.06L14.55 8.5L12 2.5ZM12 4.75L14 9.33L18.7 9.75L15 13.07L16.18 17.75L12 15.16L7.82 17.75L9 13.07L5.3 9.75L10 9.33L12 4.75Z"></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="svg-filled"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.5L9.45 8.5L3 9.06L7.725 13.39L6.25 19.82L12 16.5L17.75 19.82L16.275 13.39L21 9.06L14.55 8.5L12 2.5Z"></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="100"
          width="100"
          className="svg-celebrate"
        >
          <circle r="2" cy="50" cx="50" className="particle"></circle>
          <circle r="2" cy="50" cx="50" className="particle"></circle>
          <circle r="2" cy="50" cx="50" className="particle"></circle>
          <circle r="2" cy="50" cx="50" className="particle"></circle>
          <circle r="2" cy="50" cx="50" className="particle"></circle>
          <circle r="2" cy="50" cx="50" className="particle"></circle>
          <circle r="2" cy="50" cx="50" className="particle"></circle>
          <circle r="2" cy="50" cx="50" className="particle"></circle>
        </svg>
      </div>
    </div>
  );
};

export default Star;
