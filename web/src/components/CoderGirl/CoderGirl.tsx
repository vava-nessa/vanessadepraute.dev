import React, { useState, useEffect, CSSProperties } from "react";
import "./CoderGirl.css";
import girlImage from "../../assets/girl.png";
import TerminalDemo from "../../TerminalDemo";

interface CoderGirlProps {
  // Propriétés optionnelles pour personnaliser le contenu
  backgroundColor?: string;
  size?: number | "100%";
  containerClassName?: string;
}

// Base dimensions (original size)
const BASE_DIMENSIONS = {
  containerWidth: 1024,
  containerHeight: 1024,
  screenTop: 89,
  screenLeft: 194,
  screenWidth: 247,
  screenHeight: 204,
  fontSize: 10,
  padding: 20,
};

const CoderGirl: React.FC<CoderGirlProps> = ({
  backgroundColor = "rgb(109 5 70)",
  size = 1,
  containerClassName = "",
}) => {
  // État pour gérer les erreurs de rendu
  const [renderError, setRenderError] = useState<Error | null>(null);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Calculate scale factor based on size
  const getScaleFactor = () => {
    try {
      if (size === "100%" && containerRef && containerWidth > 0) {
        return containerWidth / BASE_DIMENSIONS.containerWidth;
      }
      return typeof size === "number" ? size : 1;
    } catch (error) {
      console.error("Error calculating scale factor:", error);
      return 1;
    }
  };

  // Scale a value based on the current size prop
  const scaleValue = (value: number): number => {
    try {
      const scaleFactor = getScaleFactor();
      return value * scaleFactor;
    } catch (error) {
      console.error("Error scaling value:", error);
      return value;
    }
  };

  // Observe container width for responsive sizing
  useEffect(() => {
    try {
      if (containerRef && size === "100%") {
        const observer = new ResizeObserver((entries) => {
          for (let entry of entries) {
            setContainerWidth(entry.contentRect.width);
          }
        });

        observer.observe(containerRef);
        return () => observer.disconnect();
      }
    } catch (error) {
      console.error("Error setting up resize observer:", error);
      setRenderError(error instanceof Error ? error : new Error(String(error)));
    }
  }, [containerRef, size]);

  // Generate container styles
  const getContainerStyles = (): CSSProperties => {
    try {
      // const scaleFactor = getScaleFactor(); // Removed unused variable

      if (size === "100%") {
        return {
          position: "relative",
          width: "100%",
          height: "auto",
          aspectRatio: `${BASE_DIMENSIONS.containerWidth} / ${BASE_DIMENSIONS.containerHeight}`,
          margin: "0 auto",
          display: "block",
          zIndex: 2,
        };
      }

      return {
        position: "absolute",
        top: 0,
        width: `${scaleValue(BASE_DIMENSIONS.containerWidth)}px`,
        height: `${scaleValue(BASE_DIMENSIONS.containerHeight)}px`,
        margin: "0 auto",
        display: "block",
        zIndex: 2,
      };
    } catch (error) {
      console.error("Error generating container styles:", error);
      return {};
    }
  };

  // Generate screen content styles
  const getScreenStyles = (): CSSProperties => {
    try {
      return {
        position: "absolute",
        top: `${scaleValue(BASE_DIMENSIONS.screenTop)}px`,
        left: `${scaleValue(BASE_DIMENSIONS.screenLeft)}px`,
        width: `${scaleValue(BASE_DIMENSIONS.screenWidth)}px`,
        height: `${scaleValue(BASE_DIMENSIONS.screenHeight)}px`,
        zIndex: -1,
        overflow: "hidden",
        transformOrigin: "center center",
        transform: "skew(0deg, 349deg) rotate3d(10, 100, 1, 9deg)",
        boxShadow: "inset 100px 0 100px rgba(0, 0, 0, 0.548)",
        backgroundColor: backgroundColor,
        backfaceVisibility: "hidden",
      };
    } catch (error) {
      console.error("Error generating screen styles:", error);
      return {};
    }
  };

  // Generate image styles
  const getImageStyles = (): CSSProperties => {
    try {
      return {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 3,
        perspective: "3000px",
        transformStyle: "preserve-3d",
        imageRendering: "auto",
        backfaceVisibility: "hidden",
        transform: "translateZ(0)",
        willChange: "transform",
      };
    } catch (error) {
      console.error("Error generating image styles:", error);
      return {};
    }
  };

  // Generate text styles
  const getTextStyles = (): CSSProperties => {
    try {
      return {
        width: "100%",
        height: "100px",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
        fontSize: `${scaleValue(BASE_DIMENSIONS.fontSize)}px`,
        fontWeight: "bold",
        textAlign: "center",
        padding: `${scaleValue(BASE_DIMENSIONS.padding)}px`,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        textRendering: "optimizeLegibility",
        letterSpacing: "0.02em",
      };
    } catch (error) {
      console.error("Error generating text styles:", error);
      return {};
    }
  };

  // Fonction pour rendre le contenu de l'écran
  const renderScreenContent = () => {
    try {
      return (
        <div style={getTextStyles()}>
          <TerminalDemo />
        </div>
      );
    } catch (error) {
      console.error("Error rendering screen content:", error);
      setRenderError(error instanceof Error ? error : new Error(String(error)));
      return <div style={{ color: "red" }}>Error displaying content</div>;
    }
  };

  // Afficher un message d'erreur si le rendu échoue
  if (renderError) {
    return (
      <div style={{ color: "red", textAlign: "center" }}>
        Component Error: {renderError.message}
      </div>
    );
  }

  try {
    return (
      <div
        ref={(ref) => setContainerRef(ref)}
        className={containerClassName}
        style={getContainerStyles()}
      >
        <div style={getScreenStyles()}>{renderScreenContent()}</div>
        <img src={girlImage} alt="Coder Girl" style={getImageStyles()} />
      </div>
    );
  } catch (error) {
    console.error("Error rendering CoderGirl component:", error);
    return (
      <div style={{ color: "red", textAlign: "center" }}>
        Component Error:{" "}
        {error instanceof Error ? error.message : String(error)}
      </div>
    );
  }
};

export default CoderGirl;
