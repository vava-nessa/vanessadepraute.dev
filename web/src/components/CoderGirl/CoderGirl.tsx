import React, { useState, useEffect } from "react";
import "./CoderGirl.css";
import girlImage from "../../assets/girl.png";
import TerminalDemo from "../../TerminalDemo";
interface CoderGirlProps {
  // Propriétés optionnelles pour personnaliser le contenu
  backgroundColor?: string;
  textColor?: string;
  size?: number;
}

const CoderGirl: React.FC<CoderGirlProps> = ({
  backgroundColor = "#000",
  textColor = "#fff",
  size = 1,
}) => {
  // État pour suivre les animations si nécessaire
  const [isAnimating, setIsAnimating] = useState(false);
  // État pour gérer les erreurs de rendu
  const [renderError, setRenderError] = useState<Error | null>(null);

  // Effet pour démarrer les animations au chargement
  useEffect(() => {
    try {
      setIsAnimating(true);
      // Vous pouvez ajouter ici d'autres logiques d'animation
    } catch (error) {
      console.error("Error during animation setup:", error);
      setRenderError(error instanceof Error ? error : new Error(String(error)));
    }
  }, []);

  // Fonction pour rendre le contenu de l'écran
  const renderScreenContent = () => {
    try {
      return (
        <div className={`screen-text`}>
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
      <div className="coder-container" style={{ transform: `scale(${size})` }}>
        <div
          className="screen-content"
          style={{
            backgroundColor: backgroundColor,
          }}
        >
          {renderScreenContent()}
        </div>
        <img src={girlImage} alt="Coder Girl" className="coder-image" />
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
