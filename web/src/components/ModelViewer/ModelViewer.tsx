/**
 * ModelViewerFiber Component
 *
 * A 3D model viewer component using React Three Fiber to display and animate GLTF models.
 * This component plays the animation for 1 complete cycle before adopting the provided
 * playAnimation state. When playAnimation becomes false, the animation finishes the current
 * cycle and then stops at the final pose. The component includes a global mouse tracking
 * feature that rotates the model based on the mouse position anywhere on the page.
 * The camera is positioned slightly higher to provide a better view angle.
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

// --- Hook pour la rotation suivant la souris ---
const useGlobalMouseRotation = (
  camera: THREE.Camera,
  targetLookAt: THREE.Vector3,
  basePosition: THREE.Vector3
) => {
  const mousePosition = useRef({ x: 0, y: 0 });
  const initialCameraPosition = useRef(new THREE.Vector3().copy(basePosition));

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      mousePosition.current = { x, y };
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useFrame(() => {
    const rotX = (mousePosition.current.x * Math.PI) / 6; // ±30 degrés max
    const rotY = (mousePosition.current.y * Math.PI) / 8; // ±22.5 degrés max

    const radius = initialCameraPosition.current.distanceTo(targetLookAt);
    const newX = Math.sin(rotX) * radius;
    const newY = basePosition.y + rotY * radius * 0.5;
    const newZ = Math.cos(rotX) * radius;

    camera.position.set(basePosition.x + newX, newY, basePosition.z + newZ);
    camera.lookAt(targetLookAt);
  });
};

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

  // Clone la scène pour éviter des problèmes de référence mémoire
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // Refs pour l'animation
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  const [isPlaying, setIsPlaying] = useState(playAnimation);

  // Centrer et mettre à l'échelle le modèle - UNE SEULE FOIS après le clone
  useEffect(() => {
    if (!clonedScene) return;

    // Centrer
    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = box.getCenter(new THREE.Vector3());
    clonedScene.position.sub(center);

    // Mise à l'échelle
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1.6 / maxDim;
    clonedScene.scale.multiplyScalar(scale);

    console.log("[ModelViewer] Modèle centré et mis à l'échelle:", {
      center: center.toArray(),
      size: size.toArray(),
      scale,
    });
  }, [clonedScene]);

  // Initialiser le mixer d'animation UNE SEULE FOIS
  useEffect(() => {
    if (!clonedScene) return;

    mixer.current = new THREE.AnimationMixer(clonedScene);

    // Nettoyage
    return () => {
      mixer.current = null;
      actionRef.current = null;
    };
  }, [clonedScene]);

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
      object={clonedScene}
      onClick={(event: any) => {
        event.stopPropagation();
        onAnimationToggleRequest?.();
        if (onExternalClick && event.nativeEvent) {
          onExternalClick(event.nativeEvent as React.MouseEvent);
        }
      }}
    />
  );
};

// --- Fallback simple ---
const FallbackMesh: React.FC = () => {
  return <Box args={[1, 1, 1]} position={[0, 0, 0]} />;
};

// --- Hook pour la rotation
const RotationController: React.FC<{
  basePosition: THREE.Vector3;
  targetPosition: THREE.Vector3;
}> = ({ basePosition, targetPosition }) => {
  const { camera } = useThree();
  useGlobalMouseRotation(camera, targetPosition, basePosition);
  return null;
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

  // Positions de caméra fixes
  const baseCameraPosition = useMemo(() => new THREE.Vector3(0, 1.5, 5), []);
  const targetLookAt = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  // Gestion des erreurs
  const [hasError, setHasError] = useState(false);

  const handleError = (error: Error) => {
    console.error("[ModelViewer] Erreur capturée:", modelPath, error);
    setHasError(true);
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
      <div style={innerStyle}>
        <ErrorBoundary onError={handleError}>
          <Canvas
            gl={{ antialias: true, alpha: true }}
            camera={{
              position: baseCameraPosition.toArray() as [
                number,
                number,
                number
              ],
              fov: 25,
              near: 0.1,
              far: 1000,
            }}
            style={{ background: "#f0f0f0" }} // Couleur de fond temporaire pour debug
          >
            {/* Éclairage simplifié */}
            <ambientLight intensity={1.0} />
            <directionalLight position={[0, 5, 5]} intensity={2.0} />

            {/* Rotation avec la souris */}
            <RotationController
              basePosition={baseCameraPosition}
              targetPosition={targetLookAt}
            />

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

            {/* Contrôles désactivés (on utilise notre propre système) */}
            <OrbitControls
              enabled={false}
              enableZoom={false}
              enablePan={false}
              target={targetLookAt.toArray() as [number, number, number]}
            />
          </Canvas>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default ModelViewer;
