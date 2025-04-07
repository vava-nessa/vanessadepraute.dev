import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

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
  maxDistance: 100,
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

function CameraController({
  cameraConfig = CAMERA_CONFIG,
}: {
  cameraConfig?: Partial<typeof CAMERA_CONFIG>;
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
      enableZoom={false}
      enablePan={false}
      enableRotate={false}
    />
  );
}

function Model({
  modelPath,
  playAnimation,
}: {
  modelPath: string;
  playAnimation: boolean;
  cameraConfig?: Partial<typeof CAMERA_CONFIG>;
}) {
  const gltf = useLoader(GLTFLoader, modelPath);
  const modelRef = useRef<THREE.Group>(null);
  const mixer = useRef<THREE.AnimationMixer | null>(null);

  useEffect(() => {
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
  }, [gltf, playAnimation]);

  // Update animations
  useFrame((_, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
    }
  });

  useEffect(() => {
    if (mixer.current && gltf.animations && gltf.animations.length > 0) {
      const action = mixer.current.clipAction(gltf.animations[0]);

      if (playAnimation) {
        action.play();
      } else {
        action.stop();
      }
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
}: ModelViewerProps) {
  const mergedLightConfig = { ...LIGHT_CONFIG, ...lightConfig };
  const mergedCameraConfig = { ...CAMERA_CONFIG, ...cameraConfig };
  const canvasRef = useRef<HTMLDivElement>(null);

  // Handle click event separately from the canvas
  const handleClick = (e: React.MouseEvent) => {
    // Prevent event from affecting Three.js camera controls
    e.stopPropagation();

    // Call the provided onClick function if it exists
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      ref={canvasRef}
      style={{ width, height, cursor: onClick ? "pointer" : "default" }}
      onClick={handleClick}
    >
      <Canvas
        // Canvas configuration
        gl={{
          antialias: true,
          pixelRatio: window.devicePixelRatio,
          alpha: true,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0); // Transparent background
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

        {/* Camera controllers - always apply oscillation */}
        <CameraController cameraConfig={mergedCameraConfig} />
        {(mergedCameraConfig.enableAnimation ||
          mergedCameraConfig.oscillation?.enabled) && (
          <AnimatedCamera cameraConfig={mergedCameraConfig} />
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

        {/* Model */}
        <Model modelPath={modelPath} playAnimation={playAnimation} />

        {/* Optional orbit controls if explicitly enabled */}
        {enableOrbitControls && (
          <OrbitControls
            enableZoom={true}
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
  );
}
