/**
 * ModelViewerFiber Component
 *
 * A 3D model viewer component using React Three Fiber to display and animate GLTF models.
 * This component plays the animation for 1 complete cycle before adopting the provided
 * playAnimation state. When playAnimation becomes false, the animation finishes the current
 * cycle and then stops at the final pose. It provides a subtle rotation effect when clicking
 * and dragging on the model, and positions the model at 80% zoom with some margin. The camera
 * is positioned slightly higher to provide a better view angle.
 */

// Dependencies:
// - React (useState, useRef, useEffect, useMemo)
// - @react-three/fiber (Canvas, useFrame, useThree)
// - @react-three/drei (OrbitControls, useGLTF, Box)
// - three (THREE)
//
// Props:
// - modelPath: string - Path to the GLTF model file
// - playAnimation?: boolean - Whether to play the animation (after initial 3s period)
// - onToggleAnimation?: () => void - Callback when animation is toggled
// - width?: number | string - Width of the viewer container
// - fallbackBackgroundColor?: string - Background color to show while loading
// - onClick?: (event: React.MouseEvent) => void - Click callback
// - rotateFactor?: number - How responsive the rotation is to mouse movement when clicked

import React, { Suspense, useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Box } from "@react-three/drei";
import * as THREE from "three";

// --- Hook personnalisé pour l'effet de rotation lors du clic maintenu ---
const useDragRotateCamera = (
  basePosition: THREE.Vector3,
  targetPosition: THREE.Vector3,
  rotateFactor: number = 0.5,
  lerpFactor: number = 0.05
) => {
  const { camera } = useThree();
  const targetCameraPosition = useMemo(() => new THREE.Vector3(), []);
  const isDraggingRef = useRef(false);

  // Set up mouse down/up detection
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const handleMouseDown = () => {
        isDraggingRef.current = true;
      };
      const handleMouseUp = () => {
        isDraggingRef.current = false;
      };
      const handleMouseLeave = () => {
        isDraggingRef.current = false;
      };

      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mouseup", handleMouseUp);
      canvas.addEventListener("mouseleave", handleMouseLeave);

      // Also add touch events for mobile support
      canvas.addEventListener("touchstart", handleMouseDown);
      canvas.addEventListener("touchend", handleMouseUp);
      canvas.addEventListener("touchcancel", handleMouseLeave);

      return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mouseup", handleMouseUp);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
        canvas.removeEventListener("touchstart", handleMouseDown);
        canvas.removeEventListener("touchend", handleMouseUp);
        canvas.removeEventListener("touchcancel", handleMouseLeave);
      };
    }
  }, []);

  useFrame((state) => {
    // Only apply rotation effect when mouse button is pressed
    if (isDraggingRef.current) {
      const effectiveRotateFactor = rotateFactor;
      const offsetX = state.pointer.x * effectiveRotateFactor;
      const offsetY = -state.pointer.y * effectiveRotateFactor;

      targetCameraPosition.set(
        basePosition.x + offsetX,
        basePosition.y + offsetY,
        basePosition.z
      );
    } else {
      // When not dragging, return to the base position
      targetCameraPosition.copy(basePosition);
    }

    // Smooth transition
    camera.position.lerp(targetCameraPosition, lerpFactor);
    camera.lookAt(targetPosition);
  });
};

// --- Composant Modèle ---
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
  const { scene, animations } = useGLTF(modelPath);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  const [initialPlaybackDone, setInitialPlaybackDone] = useState(false);
  const animationDurationRef = useRef(0);

  // Center and scale the model properly
  useEffect(() => {
    if (clonedScene) {
      // Center the model
      const box = new THREE.Box3().setFromObject(clonedScene);
      const center = box.getCenter(new THREE.Vector3());
      clonedScene.position.sub(center);

      // Scale to fit with margin (80% zoom)
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.6 / maxDim; // Scale to make it 80% of view (1/0.8 = 1.25, with a bit more margin = 1.6)
      clonedScene.scale.multiplyScalar(scale);
    }
  }, [clonedScene]);

  // Initialize animation mixer
  useEffect(() => {
    if (clonedScene) {
      mixer.current = new THREE.AnimationMixer(clonedScene);
    }

    // No need for setTimeout anymore, we'll track animation cycles instead

    // Cleanup
    return () => {
      mixer.current = null;
      actionRef.current = null;
    };
  }, [clonedScene]);

  // Handle animation setup and state changes
  useEffect(() => {
    if (mixer.current && animations && animations.length > 0) {
      // Initialize action if not already done
      if (!actionRef.current) {
        const clip = animations[0];
        actionRef.current = mixer.current.clipAction(clip);

        // Store the duration of the animation for cycle tracking
        animationDurationRef.current = clip.duration;

        // Set up the animation to loop only once initially
        actionRef.current.setLoop(THREE.LoopOnce, 1);
        actionRef.current.clampWhenFinished = true; // Keep the final pose when finished

        // Add an event listener to track animation completion
        const onFinishEvent = (e: any) => {
          // After 1 complete cycle, mark initial playback as done
          if (!initialPlaybackDone) {
            setInitialPlaybackDone(true);

            // If playAnimation is true, configure for continuous play
            if (playAnimation) {
              actionRef.current?.setLoop(THREE.LoopRepeat, Infinity);
              actionRef.current?.reset().play();
            }
          }
        };

        mixer.current.addEventListener("finished", onFinishEvent);

        // Start the animation
        actionRef.current.reset().play();

        return () => {
          mixer.current?.removeEventListener("finished", onFinishEvent);
        };
      }

      // After initial cycle playback, respond to playAnimation prop changes
      if (initialPlaybackDone) {
        const action = actionRef.current;

        if (playAnimation) {
          // If it was paused or clamped at the end, reset and play again
          if (action.paused || action.loop === THREE.LoopOnce) {
            action.setLoop(THREE.LoopRepeat, Infinity);
            action.reset().play();
          }
        } else {
          // When playAnimation becomes false, let the current cycle finish and then stop
          if (action.loop !== THREE.LoopOnce) {
            action.setLoop(THREE.LoopOnce, 1);
            action.clampWhenFinished = true;

            // Ensure it keeps playing until the end of the current cycle
            if (action.paused) {
              action.paused = false;
            }
          }
        }
      }
    }
  }, [mixer, animations, playAnimation, initialPlaybackDone]);

  // Update animation on each frame
  useFrame((state, delta) => {
    // Always play during first 2 cycles, then follow playAnimation prop
    if (!initialPlaybackDone || (playAnimation && !actionRef.current?.paused)) {
      mixer.current?.update(delta);
    } else if (!playAnimation && !initialPlaybackDone) {
      // Still update during transition to paused state
      mixer.current?.update(delta);
    }
  });

  return (
    <primitive
      object={clonedScene}
      onClick={(event) => {
        event.stopPropagation();
        onAnimationToggleRequest?.();
        onExternalClick?.(event);
      }}
    />
  );
};

// --- Props principales ---
interface ModelViewerFiberProps {
  modelPath: string;
  playAnimation?: boolean;
  onToggleAnimation?: () => void;
  width?: number | string;
  fallbackBackgroundColor?: string;
  onClick?: (event: React.MouseEvent) => void;
  rotateFactor?: number;
}

// --- Fallback component when model is loading ---
const FallbackMesh: React.FC = () => {
  return <Box args={[1, 1, 1]} position={[0, 0, 0]} />;
};

// --- Hook for drag rotation camera effect ---
interface DragRotateCameraEffectHookProps {
  basePosition: THREE.Vector3;
  targetPosition: THREE.Vector3;
  rotateFactor: number;
}

const DragRotateCameraEffectHook: React.FC<DragRotateCameraEffectHookProps> = ({
  basePosition,
  targetPosition,
  rotateFactor,
}) => {
  useDragRotateCamera(basePosition, targetPosition, rotateFactor);
  return null;
};

// --- Composant principal ---
const ModelViewerFiber: React.FC<ModelViewerFiberProps> = ({
  modelPath,
  playAnimation = false,
  onToggleAnimation,
  width = "100%",
  fallbackBackgroundColor = "transparent",
  onClick,
  rotateFactor = 0.5, // Facteur de rotation modéré lors du clic maintenu
}) => {
  useEffect(() => {
    useGLTF.preload(modelPath);
  }, [modelPath]);

  // Position de caméra pour une vue de face légèrement relevée avec un zoom à 80% (pour avoir une marge autour du modèle)
  const baseCameraPosition = useMemo(
    () => new THREE.Vector3(0, 1.5, 5), // Position frontale légèrement relevée
    []
  );
  const targetLookAt = useMemo(
    () => new THREE.Vector3(0, 0, 0), // Centre du modèle
    []
  );

  return (
    <div style={{ width, height: width, position: "relative" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          background: fallbackBackgroundColor,
          cursor: "pointer",
        }}
      >
        <Canvas
          gl={{ antialias: true, alpha: true }}
          camera={{
            position: baseCameraPosition.toArray() as [number, number, number],
            fov: 30,
            near: 0.2,
            far: 1000,
          }}
          style={{ background: "transparent", touchAction: "none" }}
        >
          {/* Effet de rotation au clic maintenu */}
          <DragRotateCameraEffectHook
            basePosition={baseCameraPosition}
            targetPosition={targetLookAt}
            rotateFactor={rotateFactor}
          />

          <ambientLight intensity={1.0} />
          <directionalLight
            position={[5, 10, 7.5]}
            intensity={1.5}
            castShadow
          />
          <directionalLight position={[-5, -5, -5]} intensity={0.5} />
          <hemisphereLight intensity={0.5} groundColor="black" />

          <Suspense fallback={<FallbackMesh />}>
            <Model
              modelPath={modelPath}
              playAnimation={playAnimation}
              onAnimationToggleRequest={onToggleAnimation}
              onExternalClick={onClick}
            />
          </Suspense>

          <OrbitControls
            enabled={true}
            enableZoom={false}
            enablePan={false}
            target={targetLookAt.toArray() as [number, number, number]}
            minPolarAngle={Math.PI / 2.4} // Limite l'angle vers le bas
            maxPolarAngle={Math.PI / 1.6} // Limite l'angle vers le haut
            minAzimuthAngle={-Math.PI / 6} // Limite la rotation horizontale à gauche (environ -30 degrés)
            maxAzimuthAngle={Math.PI / 6} // Limite la rotation horizontale à droite (environ +30 degrés)
            rotateSpeed={0.6} // Vitesse de rotation modérée
          />
        </Canvas>
      </div>
    </div>
  );
};

export default ModelViewerFiber;
