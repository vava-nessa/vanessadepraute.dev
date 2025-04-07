/**
 * ModelViewerFiber Component
 *
 * A 3D model viewer component using React Three Fiber to display and animate GLTF models.
 * This component plays the animation for 1 complete cycle before adopting the provided
 * playAnimation state. When playAnimation becomes false, the animation finishes the current
 * cycle and then stops at the final pose.
 */

// Dependencies:
// - React (useState, useRef, useEffect, useMemo)
// - @react-three/fiber (Canvas, useFrame, useThree)
// - @react-three/drei (OrbitControls, useGLTF, Box)
// - three (THREE)
//
// Props:
// - modelPath: string - Path to the GLTF model file
// - playAnimation?: boolean - Whether to play the animation (after initial cycle)
// - onToggleAnimation?: () => void - Callback when animation is toggled
// - width?: number | string - Width of the viewer container
// - height?: number | string - Height of the viewer container
// - fallbackBackgroundColor?: string - Background color to show while loading
// - onClick?: (event: React.MouseEvent) => void - Click callback

import React, { Suspense, useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Box } from "@react-three/drei";
import * as THREE from "three";
import ErrorBoundary from "../ErrorBoundary";

// Camera parameters - Feel free to adjust these values
// ----------------------------------------------------
/**
 * CAMERA PARAMETERS GUIDE:
 *
 * - CAMERA_POSITION: [x, y, z] coordinates where the camera is positioned
 *   - x: left/right position (positive = right, negative = left)
 *   - y: up/down position (positive = up, negative = down)
 *   - z: distance from center (larger = further away)
 *
 * - CAMERA_FOV: Field of View in degrees (perspective camera)
 *   - Lower values (20-40): More zoom/telephoto effect, less distortion
 *   - Higher values (60-90): Wider angle, more can be seen but with distortion
 *
 * - CAMERA_NEAR: Closest distance the camera can see (objects closer will be clipped)
 *   - Usually set to a small positive number (0.1-1)
 *   - Too small can cause rendering artifacts
 *
 * - CAMERA_FAR: Furthest distance the camera can see (objects beyond will be clipped)
 *   - Typically large value (100-2000) depending on scene scale
 *   - Should be large enough to see all objects in your scene
 */
const CAMERA_POSITION = [0, 1.5, 5] as [number, number, number];
const CAMERA_FOV = 25;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 1000;

// Target point the camera looks at
const CAMERA_TARGET = [0, 0, 0] as [number, number, number];

// Précharger le modèle une seule fois par URL de modèle
const modelCache = new Map<string, boolean>();

const preloadModel = async (modelPath: string) => {
  if (!modelCache.has(modelPath)) {
    console.log("[ModelLoader] Préchargement du modèle:", modelPath);
    try {
      await useGLTF.preload(modelPath);
      modelCache.set(modelPath, true);
      console.log("[ModelLoader] Préchargement réussi:", modelPath);
    } catch (error) {
      console.error("[ModelLoader] Erreur de préchargement:", modelPath, error);
      modelCache.set(modelPath, false);
    }
  }
};

// --- Composant Modèle simplifié ---
interface ModelProps {
  modelPath: string;
  playAnimation: boolean;
  onAnimationToggleRequest?: () => void;
  onExternalClick?: (event: React.MouseEvent) => void;
}

const Model: React.FC<ModelProps> = ({
  modelPath,
  playAnimation,
  onAnimationToggleRequest,
  onExternalClick,
}) => {
  // On utilise le hook useGLTF qui gère le cache et la mémoire interne
  // Pas besoin de recharger à chaque render
  const gltf = useGLTF(modelPath);
  const { scene, animations } = gltf;

  // Refs pour l'animation
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  const [isPlaying, setIsPlaying] = useState(playAnimation);

  // Centrer et mettre à l'échelle le modèle - UNE SEULE FOIS
  useEffect(() => {
    if (!scene) return;

    // Centrer
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);

    // Mise à l'échelle
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1.6 / maxDim;
    scene.scale.multiplyScalar(scale);

    console.log("[ModelViewer] Modèle centré et mis à l'échelle:", {
      center: center.toArray(),
      size: size.toArray(),
      scale,
    });
  }, [scene]);

  // Initialiser le mixer d'animation UNE SEULE FOIS
  useEffect(() => {
    if (!scene) return;

    mixer.current = new THREE.AnimationMixer(scene);

    // Nettoyage
    return () => {
      mixer.current = null;
      actionRef.current = null;
    };
  }, [scene]);

  // Gestion des animations
  useEffect(() => {
    if (!mixer.current || !animations || animations.length === 0) return;

    // Si l'animation n'est pas déjà configurée
    if (!actionRef.current) {
      const clip = animations[0];
      actionRef.current = mixer.current.clipAction(clip);

      // Configurer l'animation
      actionRef.current.setLoop(THREE.LoopRepeat, Infinity);
      actionRef.current.play();

      console.log("[ModelViewer] Animation initialisée");
    }

    // Mettre à jour l'état de lecture selon la prop
    if (playAnimation && !isPlaying) {
      actionRef.current.paused = false;
      setIsPlaying(true);
    } else if (!playAnimation && isPlaying) {
      actionRef.current.paused = true;
      setIsPlaying(false);
    }
  }, [animations, mixer, playAnimation, isPlaying]);

  // Mise à jour de l'animation à chaque frame
  useFrame((_, delta) => {
    if (mixer.current && isPlaying) {
      mixer.current.update(delta);
    }
  });

  return (
    <primitive
      object={scene}
      onClick={(event: any) => {
        if (event) {
          event.stopPropagation();
          if (onAnimationToggleRequest) {
            onAnimationToggleRequest();
          }
        }
      }}
    />
  );
};

// --- Fallback simple ---
const FallbackMesh: React.FC = () => {
  return <Box args={[1, 1, 1]} position={[0, 0, 0]} />;
};

// --- Props du composant principal ---
interface ModelViewerProps {
  modelPath: string;
  playAnimation?: boolean;
  onToggleAnimation?: () => void;
  width?: number | string;
  height?: number | string;
  fallbackBackgroundColor?: string;
  onClick?: (event: React.MouseEvent) => void;
}

// --- Composant principal simplifié ---
const ModelViewer: React.FC<ModelViewerProps> = ({
  modelPath,
  playAnimation = false,
  onToggleAnimation,
  width = "100%",
  height = width,
  fallbackBackgroundColor = "transparent",
  onClick,
}) => {
  // Précharger le modèle au montage du composant - UNE SEULE FOIS
  useEffect(() => {
    preloadModel(modelPath);
  }, [modelPath]); // Dépendance uniquement sur le chemin du modèle

  // Gestion des erreurs
  const [hasError, setHasError] = useState(false);

  const handleError = (error: Error) => {
    console.error("[ModelViewer] Erreur capturée:", modelPath, error);
    setHasError(true);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    }
  };

  // Style du conteneur
  const containerStyle = useMemo(
    () => ({
      width,
      height,
      position: "relative" as const,
      background: fallbackBackgroundColor,
    }),
    [width, height, fallbackBackgroundColor]
  );

  // Style interne
  const innerStyle = useMemo(
    () => ({
      width: "100%",
      height: "100%",
      position: "relative" as const,
      overflow: "hidden",
      cursor: "pointer",
    }),
    []
  );

  return (
    <div style={containerStyle}>
      <div style={innerStyle} onClick={handleContainerClick}>
        <ErrorBoundary onError={handleError}>
          <Canvas
            gl={{ antialias: true, alpha: true }}
            camera={{
              position: CAMERA_POSITION,
              fov: CAMERA_FOV,
              near: CAMERA_NEAR,
              far: CAMERA_FAR,
            }}
            style={{ background: "#f0f0f0" }} // Couleur de fond temporaire pour debug
          >
            {/* Éclairage simplifié */}
            <ambientLight intensity={1.0} />
            <directionalLight position={[0, 5, 5]} intensity={2.0} />

            {/* Modèle 3D */}
            <Suspense fallback={<FallbackMesh />}>
              {!hasError && (
                <Model
                  modelPath={modelPath}
                  playAnimation={playAnimation}
                  onAnimationToggleRequest={onToggleAnimation}
                  onExternalClick={onClick}
                />
              )}
              {hasError && <FallbackMesh />}
            </Suspense>

            {/* Orbit controls with default settings */}
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              target={CAMERA_TARGET}
            />
          </Canvas>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default ModelViewer;
