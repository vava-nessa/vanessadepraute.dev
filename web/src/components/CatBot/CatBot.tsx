import { useState, useEffect } from "react";
import catImage from "../../assets/cat.webp";
import "./CatBot.css";

export default const CatBot = () => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    try {
      setIsVisible((prev) => !prev);
    } catch (error) {
      console.error("Error toggling CatBot visibility:", error);
    }
  };

  useEffect(() => {
    try {
      // Component initialization logic (if needed)
    } catch (error) {
      console.error("Error initializing CatBot:", error);
    }
  }, []);

  try {
    return (
      <div className={`catbot-container ${isVisible ? "visible" : "hidden"}`}>
        <img
          src={catImage}
          alt="CatBot"
          className="catbot-image"
          onClick={toggleVisibility}
        />
      </div>
    );
  } catch (error) {
    console.error("Error rendering CatBot:", error);
    return null;
  }
};


