import React, { useState, useEffect, CSSProperties } from "react";
import "./CoderGirl.css";
import girlImage from "../../assets/girl.png";
import girlLightImage from "../../assets/girlw.png";
import { useTheme } from "../../contexts/ThemeContext";
import TerminalDemo from "../../TerminalDemo";

interface CoderGirlProps {
  // Propriétés optionnelles pour personnaliser le contenu
  backgroundColor?: string;
  size?: number | "100%";
  containerClassName?: string;
}

// Screen corner coordinates (on 1024x1024 base image)
// Coordinates are X from left, Y from top
// With 8px inward margin to prevent overflow
const SCREEN_CORNERS = {
  topLeft: { x: 208, y: 108 },
  topRight: { x: 452, y: 83 },
  bottomLeft: { x: 208, y: 302 },
  bottomRight: { x: 452, y: 252 },
};

// Base dimensions (original size)
const BASE_DIMENSIONS = {
  containerWidth: 1024,
  containerHeight: 1024,
  fontSize: 10,
  padding: 8,
};

// Compute matrix3d for perspective transformation
// Maps a rectangle to an arbitrary quadrilateral defined by 4 corners
function computeMatrix3d(
  w: number, // source width
  h: number, // source height
  x0: number, y0: number, // top-left destination
  x1: number, y1: number, // top-right destination
  x2: number, y2: number, // bottom-right destination
  x3: number, y3: number  // bottom-left destination
): string {
  // Compute the transformation matrix using projective geometry
  // Based on: https://math.stackexchange.com/questions/296794

  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const dy3 = y0 - y1 + y2 - y3;

  const det = dx1 * dy2 - dx2 * dy1;
  if (Math.abs(det) < 1e-10) {
    // Fallback if degenerate
    return 'none';
  }

  const a13 = (dx3 * dy2 - dx2 * dy3) / det;
  const a23 = (dx1 * dy3 - dx3 * dy1) / det;

  const a11 = x1 - x0 + a13 * x1;
  const a21 = x3 - x0 + a23 * x3;
  const a31 = x0;
  const a12 = y1 - y0 + a13 * y1;
  const a22 = y3 - y0 + a23 * y3;
  const a32 = y0;

  // Scale to source dimensions
  const scaleX = 1 / w;
  const scaleY = 1 / h;

  // Build matrix3d (column-major order for CSS)
  // The CSS matrix3d format is:
  // matrix3d(a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3, a4, b4, c4, d4)
  const m11 = a11 * scaleX;
  const m12 = a12 * scaleX;
  const m14 = a13 * scaleX;
  const m21 = a21 * scaleY;
  const m22 = a22 * scaleY;
  const m24 = a23 * scaleY;
  const m41 = a31;
  const m42 = a32;

  return `matrix3d(${m11}, ${m12}, 0, ${m14}, ${m21}, ${m22}, 0, ${m24}, 0, 0, 1, 0, ${m41}, ${m42}, 0, 1)`;
}

const CoderGirl: React.FC<CoderGirlProps> = ({
  backgroundColor = "transparent",
  size = 1,
  containerClassName = "",
}) => {
  // État pour gérer les erreurs de rendu
  const [renderError, setRenderError] = useState<Error | null>(null);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const { theme } = useTheme();

  // Choose image based on theme
  const currentImage = theme === "light" ? girlLightImage : girlImage;

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

  // Generate screen content styles with matrix3d transform
  const getScreenStyles = (): CSSProperties => {
    try {
      const scale = getScaleFactor();

      // Scale the corner coordinates
      const tl = { x: SCREEN_CORNERS.topLeft.x * scale, y: SCREEN_CORNERS.topLeft.y * scale };
      const tr = { x: SCREEN_CORNERS.topRight.x * scale, y: SCREEN_CORNERS.topRight.y * scale };
      const bl = { x: SCREEN_CORNERS.bottomLeft.x * scale, y: SCREEN_CORNERS.bottomLeft.y * scale };
      const br = { x: SCREEN_CORNERS.bottomRight.x * scale, y: SCREEN_CORNERS.bottomRight.y * scale };

      // Calculate the div dimensions (we use the bounding box size)
      const divWidth = tr.x - tl.x;
      const divHeight = Math.max(bl.y, br.y) - Math.min(tl.y, tr.y);

      // Compute matrix3d to map rectangle to the 4 corners
      // The matrix will transform from (0,0)-(divWidth,divHeight) to the 4 corners
      const matrix = computeMatrix3d(
        divWidth, divHeight,
        tl.x, tl.y,  // top-left
        tr.x, tr.y,  // top-right
        br.x, br.y,  // bottom-right
        bl.x, bl.y   // bottom-left
      );

      return {
        position: "absolute",
        top: "1px",
        left: "-9px",
        width: `${divWidth}px`,
        height: `${divHeight}px`,
        zIndex: -1,
        overflow: "hidden",
        transformOrigin: "0 0",
        transform: matrix,
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

  // Generate steam effect styles
  const getSteamStyles = (): CSSProperties => {
    try {
      const scale = getScaleFactor();
      const baseX = 200 * scale;
      const baseY = 420 * scale;
      const width = 50 * scale;
      const height = 150 * scale;

      return {
        position: "absolute",
        left: `${baseX}px`,
        top: `${baseY - height}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: 10,
        pointerEvents: "none",
      };
    } catch (error) {
      console.error("Error generating steam styles:", error);
      return {};
    }
  };

  try {
    return (
      <div
        ref={(ref) => setContainerRef(ref)}
        className={containerClassName}
        style={getContainerStyles()}
      >
        <div style={getScreenStyles()}>{renderScreenContent()}</div>
        <img src={currentImage} alt="Coder Girl" style={getImageStyles()} />

        {/* Steam effect */}
        <div style={getSteamStyles()} className="steam-container">
          <div className="steam-particle steam-particle-1"></div>
          <div className="steam-particle steam-particle-2"></div>
          <div className="steam-particle steam-particle-3"></div>
          <div className="steam-particle steam-particle-4"></div>
          <div className="steam-particle steam-particle-5"></div>
          <div className="steam-particle steam-particle-6"></div>
          <div className="steam-particle steam-particle-7"></div>
          <div className="steam-particle steam-particle-8"></div>
          <div className="steam-particle steam-particle-9"></div>
          <div className="steam-particle steam-particle-10"></div>
          <div className="steam-particle steam-particle-11"></div>
          <div className="steam-particle steam-particle-12"></div>
        </div>
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
