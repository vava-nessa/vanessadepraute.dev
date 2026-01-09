import { useRef, useEffect, Suspense, useState } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { captureError, ErrorSeverity } from "@/utils/errorHandling";

// Camera configuration
const CAMERA_CONFIG = {
  // Basic properties
  position: [5, 40, 80] as [number, number, number],
  rotation: [100, 100, 100] as [number, number, number],
  fov: 18,
  near: 0.1,
  far: 500,
  lookAt: [5, 0, 0] as [number, number, number],

  // Additional properties
  zoom: 1,
  quaternion: new THREE.Quaternion(),

  // Camera control
  autoRotate: true,
  autoRotateSpeed: 10,
  enableDamping: true,
  dampingFactor: 0.55,

  // Oscillation settings (new)
  oscillation: {
    enabled: true,
    amplitude: Math.PI / 4, // 45 degrees (quarter circle)
    period: 5000, // 5 seconds for a complete oscillation
    axis: "y", // oscillate around y-axis
  },

  // Camera animation
  enableAnimation: false,
  animationPath: {
    points: [
      [10, 50, 50],
      [50, 30, 20],
      [0, 20, 80],
      [-50, 40, 30],
    ] as [number, number, number][],
    duration: 10000, // milliseconds
    loop: true,
  },

  // Motion limits
  minPolarAngle: 0,
  maxPolarAngle: Math.PI,
  minAzimuthAngle: -Infinity,
  maxAzimuthAngle: Infinity,

  // Distance limits
  minDistance: 5,
  maxDistance: 300,
};

// Lighting configuration
const LIGHT_CONFIG = {
  ambient: {
    intensity: 0.8,
  },
  spot: {
    position: [10, 10, 10] as [number, number, number],
    angle: 0.35,
    penumbra: 1,
    intensity: 1,
    castShadow: true,
  },
  directional: {
    position: [-5, 5, 5] as [number, number, number],
    intensity: 0.5,
    castShadow: true,
  },
  hemispheric: {
    color: 0xffffff,
    groundColor: 0x444444,
    intensity: 0.5,
  },
  point: {
    position: [0, 10, 0] as [number, number, number],
    intensity: 0.5,
    distance: 100,
    decay: 2,
  },
};

interface ModelViewerProps {
  modelPath: string;
  playAnimation: boolean;
  width?: string;
  height?: string;
  onClick?: () => void;
  cameraConfig?: Partial<typeof CAMERA_CONFIG>;
  lightConfig?: Partial<typeof LIGHT_CONFIG>;
  enableOrbitControls?: boolean;
  enableZoom?: boolean;
  autoFit?: boolean;
  autoFitMargin?: number;
  debug?: boolean;
}

// Camera animation system
function AnimatedCamera({
  cameraConfig,
}: {
  cameraConfig: Partial<typeof CAMERA_CONFIG>;
}) {
  const { camera } = useThree();
  const mergedConfig = { ...CAMERA_CONFIG, ...cameraConfig };
  const animationRef = useRef({
    startTime: Date.now(),
    enabled: mergedConfig.enableAnimation,
    oscillationStartTime: Date.now(),
    basePosition: [...mergedConfig.position] as [number, number, number],
    oscillating: mergedConfig.oscillation?.enabled ?? false,
  });

  useFrame(() => {
    // Handle path animation if enabled
    if (mergedConfig.enableAnimation) {
      const { points, duration, loop } = mergedConfig.animationPath;
      const elapsedTime = Date.now() - animationRef.current.startTime;

      // Reset time if looping
      const normalizedTime = loop
        ? (elapsedTime % duration) / duration
        : Math.min(elapsedTime / duration, 1);

      // Calculate position along path
      const segmentCount = points.length - 1;
      const segmentIndex = Math.min(
        Math.floor(normalizedTime * segmentCount),
        segmentCount - 1
      );
      const segmentProgress = (normalizedTime * segmentCount) % 1;

      const start = points[segmentIndex];
      const end = points[segmentIndex + 1];

      // Interpolate position
      camera.position.set(
        start[0] + (end[0] - start[0]) * segmentProgress,
        start[1] + (end[1] - start[1]) * segmentProgress,
        start[2] + (end[2] - start[2]) * segmentProgress
      );

      // Look at target
      camera.lookAt(new THREE.Vector3(...mergedConfig.lookAt));

      // Store as base position for oscillation
      animationRef.current.basePosition = [
        camera.position.x,
        camera.position.y,
        camera.position.z,
      ];
    }

    // Handle oscillation if enabled
    if (mergedConfig.oscillation?.enabled) {
      const { amplitude, period, axis } = mergedConfig.oscillation;
      const elapsedTime =
        Date.now() - animationRef.current.oscillationStartTime;

      // Calculate oscillation using sine wave (0 to 1 to 0 to -1 to 0)
      // This will move right, then left, in a smooth motion
      const oscillationFactor = Math.sin(
        ((elapsedTime % period) / period) * Math.PI * 2
      );

      // If not doing path animation, use the initial position as base
      const basePosition = animationRef.current.basePosition;

      // Create a radius vector from the lookAt point to the camera base position
      const lookAtPoint = new THREE.Vector3(...mergedConfig.lookAt);
      const baseVector = new THREE.Vector3(
        basePosition[0],
        basePosition[1],
        basePosition[2]
      );

      // Create orbit position by rotating around the lookAt point
      const orbitPosition = baseVector.clone();

      // Calculate rotation angle based on oscillation
      const rotationAngle = amplitude * oscillationFactor;

      // Apply rotation based on the selected axis
      if (axis === "y") {
        // Rotate around Y axis (horizontal movement)
        orbitPosition.sub(lookAtPoint); // Move to origin

        // Apply rotation matrix
        const rotMatrix = new THREE.Matrix4().makeRotationY(rotationAngle);
        orbitPosition.applyMatrix4(rotMatrix);

        orbitPosition.add(lookAtPoint); // Move back
      } else if (axis === "x") {
        // Rotate around X axis (vertical movement)
        orbitPosition.sub(lookAtPoint);
        const rotMatrix = new THREE.Matrix4().makeRotationX(rotationAngle);
        orbitPosition.applyMatrix4(rotMatrix);
        orbitPosition.add(lookAtPoint);
      }

      // Update camera position
      camera.position.copy(orbitPosition);

      // Always look at the target
      camera.lookAt(lookAtPoint);
    }
  });

  // Set up initial values
  useEffect(() => {
    if (mergedConfig.oscillation?.enabled) {
      animationRef.current.oscillationStartTime = Date.now();
      animationRef.current.basePosition = [...mergedConfig.position];
      animationRef.current.oscillating = true;
    }
  }, [mergedConfig.oscillation?.enabled, mergedConfig.position]);

  return null;
}

// Debug data updater (runs inside Canvas)
function DebugDataUpdater({
  onUpdate
}: {
  onUpdate: (data: {
    cameraPosition: [number, number, number];
    cameraRotation: [number, number, number];
    fov: number;
    zoom: number;
  }) => void;
}) {
  const { camera } = useThree();

  useFrame(() => {
    const pos = camera.position;
    const rot = camera.rotation;
    const fov = (camera as THREE.PerspectiveCamera).fov || 0;
    const zoom = camera.zoom;

    onUpdate({
      cameraPosition: [pos.x, pos.y, pos.z],
      cameraRotation: [rot.x, rot.y, rot.z],
      fov,
      zoom,
    });
  });

  return null;
}

function CameraController({
  cameraConfig = CAMERA_CONFIG,
  enableZoom = true,
}: {
  cameraConfig?: Partial<typeof CAMERA_CONFIG>;
  enableZoom?: boolean;
}) {
  const controlsRef = useRef<any>(null);
  const mergedConfig = { ...CAMERA_CONFIG, ...cameraConfig };

  useEffect(() => {
    if (controlsRef.current) {
      // Apply orbit controls configuration
      const controls = controlsRef.current;

      // If using oscillation, disable standard autoRotate
      if (mergedConfig.oscillation?.enabled) {
        controls.autoRotate = false;
      } else {
        controls.autoRotate = mergedConfig.autoRotate;
        controls.autoRotateSpeed = mergedConfig.autoRotateSpeed;
      }

      // Damping settings
      controls.enableDamping = mergedConfig.enableDamping;
      controls.dampingFactor = mergedConfig.dampingFactor;

      // Motion limits
      controls.minPolarAngle = mergedConfig.minPolarAngle;
      controls.maxPolarAngle = mergedConfig.maxPolarAngle;
      controls.minAzimuthAngle = mergedConfig.minAzimuthAngle;
      controls.maxAzimuthAngle = mergedConfig.maxAzimuthAngle;

      // Distance limits
      controls.minDistance = mergedConfig.minDistance;
      controls.maxDistance = mergedConfig.maxDistance;

      // Set target (lookAt)
      controls.target.set(...mergedConfig.lookAt);

      // Update controls
      controls.update();
    }
  }, [cameraConfig, mergedConfig]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableZoom={enableZoom}
      enablePan={false}
      enableRotate={false}
    />
  );
}

function Model({
  modelPath,
  playAnimation,
  autoFit,
  autoFitMargin = 1.2,
  cameraConfig,
}: {
  modelPath: string;
  playAnimation: boolean;
  cameraConfig?: Partial<typeof CAMERA_CONFIG>;
  autoFit?: boolean;
  autoFitMargin?: number;
}) {
  const { handleError } = useErrorHandler("ModelViewer.Model");
  const modelRef = useRef<THREE.Group>(null);
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const { camera, controls } = useThree();

  // useLoader throws promises during suspense - let Suspense handle it, don't catch
  const gltf = useLoader(GLTFLoader, modelPath);

  // Handle manual lookAt when autoFit is false
  useEffect(() => {
    if (!autoFit && controls && cameraConfig?.lookAt) {
      const target = new THREE.Vector3(...cameraConfig.lookAt);
      // @ts-ignore
      controls.target.copy(target);
      // @ts-ignore
      controls.update();
    }
  }, [autoFit, controls, cameraConfig?.lookAt]);

  // Auto-fit logic
  useEffect(() => {
    try {
      if (autoFit && gltf.scene) {
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const sphere = new THREE.Sphere();
        box.getBoundingSphere(sphere);
        const { center, radius } = sphere;

        const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);

        // Calculate distance to fit the sphere radius within the FOV
        // Using radius / sin(fov/2) ensures the sphere is fully contained vertically
        const distance = (radius / Math.sin(fov / 2)) * autoFitMargin;

        // Position camera
        const currentPos = camera.position.clone();
        const direction = currentPos.sub(center).normalize(); // Direction from center to camera

        // If direction is zero (camera at center), default to Z axis
        if (direction.lengthSq() === 0) {
          direction.set(0, 0, 1);
        }

        const newPos = center.clone().add(direction.multiplyScalar(distance));

        // Update camera
        camera.position.copy(newPos);
        camera.lookAt(center);

        // Update controls target if available
        if (controls) {
          // @ts-ignore
          controls.target.copy(center);
          // @ts-ignore
          controls.update();
        }
      }
    } catch (error) {
      captureError(error, {
        component: "ModelViewer.Model",
        action: "auto_fit_model"
      }, ErrorSeverity.Warning);
    }
  }, [gltf, autoFit, autoFitMargin, camera, controls]);

  useEffect(() => {
    try {
      if (gltf.scene) {
        // Create a new animation mixer
        mixer.current = new THREE.AnimationMixer(gltf.scene);

        // Check if the model has animations
        if (gltf.animations && gltf.animations.length > 0) {
          // Create an action from the first animation
          const action = mixer.current.clipAction(gltf.animations[0]);

          if (playAnimation) {
            action.play();
          } else {
            action.stop();
          }
        }
      }
    } catch (error) {
      captureError(error, {
        component: "ModelViewer.Model",
        action: "setup_animation_mixer",
        additionalData: { modelPath }
      }, ErrorSeverity.Error);
    }
  }, [gltf, playAnimation, modelPath, handleError]);

  // Update animations
  useFrame((_, delta) => {
    try {
      if (mixer.current) {
        mixer.current.update(delta);
      }
    } catch (error) {
      captureError(error, {
        component: "ModelViewer.Model",
        action: "update_animation_frame"
      }, ErrorSeverity.Warning);
    }
  });

  useEffect(() => {
    try {
      if (mixer.current && gltf.animations && gltf.animations.length > 0) {
        const action = mixer.current.clipAction(gltf.animations[0]);

        if (playAnimation) {
          action.play();
        } else {
          action.stop();
        }
      }
    } catch (error) {
      captureError(error, {
        component: "ModelViewer.Model",
        action: "toggle_animation",
        additionalData: { playAnimation }
      }, ErrorSeverity.Warning);
    }
  }, [playAnimation, gltf.animations]);

  return (
    <>
      <primitive ref={modelRef} object={gltf.scene} position={[0, 0, 0]} />
    </>
  );
}

export default function ModelViewer({
  modelPath,
  playAnimation,
  width = "100%",
  height = "100%",
  onClick,
  cameraConfig,
  lightConfig = LIGHT_CONFIG,
  enableOrbitControls = false,
  enableZoom = true,
  autoFit = false,
  autoFitMargin = 1.2,
  debug = false,
}: ModelViewerProps) {
  const { handleError, isError, getErrorMessage } = useErrorHandler("ModelViewer");
  const mergedLightConfig = { ...LIGHT_CONFIG, ...lightConfig };
  const mergedCameraConfig = { ...CAMERA_CONFIG, ...cameraConfig };
  const canvasRef = useRef<HTMLDivElement>(null);
  const [debugInfo, setDebugInfo] = useState({
    cameraPosition: [0, 0, 0] as [number, number, number],
    cameraRotation: [0, 0, 0] as [number, number, number],
    fov: 0,
    zoom: 0,
  });

  // Detect light/dark mode for debug overlay
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const isLight = document.documentElement.classList.contains('light-mode');
      setIsLightMode(isLight);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Update debug info with throttling
  const updateDebugInfo = useRef((data: typeof debugInfo) => {
    setDebugInfo((prev) => {
      // Only update if values changed significantly
      if (
        Math.abs(prev.cameraPosition[0] - data.cameraPosition[0]) > 0.01 ||
        Math.abs(prev.cameraPosition[1] - data.cameraPosition[1]) > 0.01 ||
        Math.abs(prev.cameraPosition[2] - data.cameraPosition[2]) > 0.01 ||
        Math.abs(prev.cameraRotation[0] - data.cameraRotation[0]) > 0.01 ||
        Math.abs(prev.cameraRotation[1] - data.cameraRotation[1]) > 0.01 ||
        Math.abs(prev.cameraRotation[2] - data.cameraRotation[2]) > 0.01
      ) {
        return data;
      }
      return prev;
    });
  }).current;

  const formatNumber = (num: number) => num.toFixed(2);

  // Handle click event separately from the canvas
  const handleClick = (e: React.MouseEvent) => {
    try {
      // Prevent event from affecting Three.js camera controls
      e.stopPropagation();

      // Call the provided onClick function if it exists
      if (onClick) {
        onClick();
      }
    } catch (error) {
      handleError(error, { action: "handle_click" });
    }
  };

  // Error fallback
  if (isError) {
    return (
      <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b6b', textAlign: 'center', padding: '20px' }}>
        <div>
          <div>Failed to load 3D model</div>
          <div style={{ fontSize: '0.8em', marginTop: '8px' }}>{getErrorMessage()}</div>
        </div>
      </div>
    );
  }

  return (
    <>

      <div
        ref={canvasRef}
        style={{
          width,
          height,
          cursor: onClick ? "pointer" : "default",
          position: "relative",
          border: debug
            ? `2px solid ${isLightMode ? '#00cc00' : '#00ff00'}`
            : '2px solid transparent'
        }}
        onClick={handleClick}
      >
        {/* Debug overlay - Compact and centered */}
        {debug && (
          <div
            style={{
              position: 'absolute',
              bottom: '6px',
              left: '50%',
              transform: 'translateX(-50%)',
              height: 'auto',
              background: isLightMode
                ? 'rgba(255, 255, 255, 0.75)'
                : 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              border: `1px solid ${isLightMode ? '#00cc00' : '#00ff00'}`,
              borderRadius: '3px',
              color: isLightMode ? '#00aa00' : '#00ff00',
              padding: '3px 6px',
              fontFamily: '"Courier New", monospace',
              fontSize: '9px',
              fontWeight: 'bold',
              pointerEvents: 'none',
              userSelect: 'none',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
              gap: '1px',
              lineHeight: '1.2',
              whiteSpace: 'nowrap'
            }}
          >
            <div style={{ display: 'flex', gap: '4px', fontSize: '8px', opacity: 0.6, marginBottom: '1px' }}>
              <span>DEBUG</span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <span style={{ opacity: 0.7, minWidth: '24px' }}>POS</span>
              <span style={{ fontSize: '8px' }}>
                [{formatNumber(debugInfo.cameraPosition[0])},{formatNumber(debugInfo.cameraPosition[1])},{formatNumber(debugInfo.cameraPosition[2])}]
              </span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <span style={{ opacity: 0.7, minWidth: '24px' }}>ROT</span>
              <span style={{ fontSize: '8px' }}>
                [{formatNumber(debugInfo.cameraRotation[0])},{formatNumber(debugInfo.cameraRotation[1])},{formatNumber(debugInfo.cameraRotation[2])}]
              </span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <span style={{ opacity: 0.7, minWidth: '24px' }}>FOV</span>
              <span style={{ fontSize: '8px' }}>{formatNumber(debugInfo.fov)}°</span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <span style={{ opacity: 0.7, minWidth: '24px' }}>ZM</span>
              <span style={{ fontSize: '8px' }}>{formatNumber(debugInfo.zoom)}</span>
            </div>
          </div>
        )}

        {/* Canvas wrapper - ensures it's not pushed by overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}>
          <Canvas
        // Canvas configuration
        gl={{
          antialias: true,
          pixelRatio: window.devicePixelRatio,
          alpha: true,
        }}
        onCreated={({ gl }) => {
          try {
            gl.setClearColor(0x000000, 0); // Transparent background
          } catch (error) {
            captureError(error, { component: "ModelViewer", action: "canvas_created" }, ErrorSeverity.Warning);
          }
        }}
      >
        {/* Camera setup using drei's PerspectiveCamera for more control */}
        <PerspectiveCamera
          makeDefault
          position={mergedCameraConfig.position}
          rotation={mergedCameraConfig.rotation}
          fov={mergedCameraConfig.fov}
          near={mergedCameraConfig.near}
          far={mergedCameraConfig.far}
          zoom={mergedCameraConfig.zoom}
          quaternion={mergedCameraConfig.quaternion}
        />

        {/* Camera controllers - only if orbit controls are disabled */}
        {!enableOrbitControls && (
          <>
            <CameraController cameraConfig={mergedCameraConfig} enableZoom={enableZoom} />
            {(mergedCameraConfig.enableAnimation ||
              mergedCameraConfig.oscillation?.enabled) && (
                <AnimatedCamera cameraConfig={mergedCameraConfig} />
              )}
          </>
        )}

        {/* Lighting */}
        <ambientLight intensity={mergedLightConfig.ambient.intensity} />
        <spotLight
          position={mergedLightConfig.spot.position}
          angle={mergedLightConfig.spot.angle}
          penumbra={mergedLightConfig.spot.penumbra}
          intensity={mergedLightConfig.spot.intensity}
          castShadow={mergedLightConfig.spot.castShadow}
        />
        <directionalLight
          position={mergedLightConfig.directional.position}
          intensity={mergedLightConfig.directional.intensity}
          castShadow={mergedLightConfig.directional.castShadow}
        />
        <hemisphereLight
          color={mergedLightConfig.hemispheric.color}
          groundColor={mergedLightConfig.hemispheric.groundColor}
          intensity={mergedLightConfig.hemispheric.intensity}
        />
        <pointLight
          position={mergedLightConfig.point.position}
          intensity={mergedLightConfig.point.intensity}
          distance={mergedLightConfig.point.distance}
          decay={mergedLightConfig.point.decay}
        />

        {/* Model with Suspense for loading state */}
        <Suspense fallback={null}>
          <Model
            modelPath={modelPath}
            playAnimation={playAnimation}
            autoFit={autoFit}
            autoFitMargin={autoFitMargin}
            cameraConfig={mergedCameraConfig}
          />
        </Suspense>

        {/* Debug data updater */}
        {debug && <DebugDataUpdater onUpdate={updateDebugInfo} />}

        {/* Optional orbit controls if explicitly enabled */}
        {enableOrbitControls && (
          <OrbitControls
            makeDefault
            enableZoom={enableZoom}
            enablePan={true}
            enableRotate={true}
            target={mergedCameraConfig.lookAt}
            minDistance={mergedCameraConfig.minDistance}
            maxDistance={mergedCameraConfig.maxDistance}
            minPolarAngle={mergedCameraConfig.minPolarAngle}
            maxPolarAngle={mergedCameraConfig.maxPolarAngle}
            minAzimuthAngle={mergedCameraConfig.minAzimuthAngle}
            maxAzimuthAngle={mergedCameraConfig.maxAzimuthAngle}
            autoRotate={mergedCameraConfig.autoRotate}
            autoRotateSpeed={mergedCameraConfig.autoRotateSpeed}
            enableDamping={mergedCameraConfig.enableDamping}
            dampingFactor={mergedCameraConfig.dampingFactor}
          />
        )}
          </Canvas>
        </div>
      </div>
    </>
  );
}
