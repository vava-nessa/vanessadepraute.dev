/// <reference types="vite/client" />

// Declare GLB file modules
declare module "*.glb" {
  const src: string;
  export default src;
}
