import { useEffect, useRef, ReactNode } from "react";
import "./Particles.css";

// Import the SimplexNoise code directly
const SimplexNoiseCode = `!function(){"use strict";var r=.5*(Math.sqrt(3)-1),e=(3-Math.sqrt(3))/6,t=1/6,a=(Math.sqrt(5)-1)/4,o=(5-Math.sqrt(5))/20;function i(r){var e;e="function"==typeof r?r:r?function(){var r=0,e=0,t=0,a=1,o=(i=4022871197,function(r){r=r.toString();for(var e=0;e<r.length;e++){var t=.02519603282416938*(i+=r.charCodeAt(e));t-=i=t>>>0,i=(t*=i)>>>0,i+=4294967296*(t-=i)}return 2.3283064365386963e-10*(i>>>0)});var i;r=o(" "),e=o(" "),t=o(" ");for(var n=0;n<arguments.length;n++)(r-=o(arguments[n]))<0&&(r+=1),(e-=o(arguments[n]))<0&&(e+=1),(t-=o(arguments[n]))<0&&(t+=1);return o=null,function(){var o=2091639*r+2.3283064365386963e-10*a;return r=e,e=t,t=o-(a=0|o)}}(r):Math.random,this.p=n(e),this.perm=new Uint8Array(512),this.permMod12=new Uint8Array(512);for(var t=0;t<512;t++)this.perm[t]=this.p[255&t],this.permMod12[t]=this.perm[t]%12}function n(r){var e,t=new Uint8Array(256);for(e=0;e<256;e++)t[e]=e;for(e=0;e<255;e++){var a=e+~~(r()*(256-e)),o=t[e];t[e]=t[a],t[a]=o}return t}i.prototype={grad3:new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]),grad4:new Float32Array([0,1,1,1,0,1,1,-1,0,1,-1,1,0,1,-1,-1,0,-1,1,1,0,-1,1,-1,0,-1,-1,1,0,-1,-1,-1,1,0,1,1,1,0,1,-1,1,0,-1,1,1,0,-1,-1,-1,0,1,1,-1,0,1,-1,-1,0,-1,1,-1,0,-1,-1,1,1,0,1,1,1,0,-1,1,-1,0,1,1,-1,0,-1,-1,1,0,1,-1,1,0,-1,-1,-1,0,1,-1,-1,0,-1,1,1,1,0,1,1,-1,0,1,-1,1,0,1,-1,-1,0,-1,1,1,0,-1,1,-1,0,-1,-1,1,0,-1,-1,-1,0]),noise2D:function(t,a){var o,i,n=this.permMod12,f=this.perm,s=this.grad3,v=0,h=0,l=0,u=(t+a)*r,d=Math.floor(t+u),p=Math.floor(a+u),M=(d+p)*e,m=t-(d-M),c=a-(p-M);m>c?(o=1,i=0):(o=0,i=1);var y=m-o+e,w=c-i+e,g=m-1+2*e,A=c-1+2*e,x=255&d,q=255&p,D=.5-m*m-c*c;if(D>=0){var S=3*n[x+f[q]];v=(D*=D)*D*(s[S]*m+s[S+1]*c)}var U=.5-y*y-w*w;if(U>=0){var b=3*n[x+o+f[q+i]];h=(U*=U)*U*(s[b]*y+s[b+1]*w)}var F=.5-g*g-A*A;if(F>=0){var N=3*n[x+1+f[q+1]];l=(F*=F)*F*(s[N]*g+s[N+1]*A)}return 70*(v+h+l)},noise3D:function(r,e,a){var o,i,n,f,s,v,h,l,u,d,p=this.permMod12,M=this.perm,m=this.grad3,c=(r+e+a)*(1/3),y=Math.floor(r+c),w=Math.floor(e+c),g=Math.floor(a+c),A=(y+w+g)*t,x=r-(y-A),q=e-(w-A),D=a-(g-A);x>=q?q>=D?(s=1,v=0,h=0,l=1,u=1,d=0):x>=D?(s=1,v=0,h=0,l=1,u=0,d=1):(s=0,v=0,h=1,l=1,u=0,d=1):q<D?(s=0,v=0,h=1,l=0,u=1,d=1):x<D?(s=0,v=1,h=0,l=0,u=1,d=1):(s=0,v=1,h=0,l=1,u=1,d=0);var S=x-s+t,U=q-v+t,b=D-h+t,F=x-l+2*t,N=q-u+2*t,C=D-d+2*t,P=x-1+.5,T=q-1+.5,_=D-1+.5,j=255&y,k=255&w,z=255&g,B=.6-x*x-q*q-D*D;if(B<0)o=0;else{var E=3*p[j+M[k+M[z]]];o=(B*=B)*B*(m[E]*x+m[E+1]*q+m[E+2]*D)}var G=.6-S*S-U*U-b*b;if(G<0)i=0;else{var H=3*p[j+s+M[k+v+M[z+h]]];i=(G*=G)*G*(m[H]*S+m[H+1]*U+m[H+2]*b)}var I=.6-F*F-N*N-C*C;if(I<0)n=0;else{var J=3*p[j+l+M[k+u+M[z+d]]];n=(I*=I)*I*(m[J]*F+m[J+1]*N+m[J+2]*C)}var K=.6-P*P-T*T-_*_;if(K<0)f=0;else{var L=3*p[j+1+M[k+1+M[z+1]]];f=(K*=K)*K*(m[L]*P+m[L+1]*T+m[L+2]*_)}return 32*(o+i+n+f)},noise4D:function(r,e,t,i){var n,f,s,v,h,l,u,d,p,M,m,c,y,w,g,A,x,q=this.perm,D=this.grad4,S=(r+e+t+i)*a,U=Math.floor(r+S),b=Math.floor(e+S),F=Math.floor(t+S),N=Math.floor(i+S),C=(U+b+F+N)*o,P=r-(U-C),T=e-(b-C),_=t-(F-C),j=i-(N-C),k=0,z=0,B=0,E=0;P>T?k++:z++,P>_?k++:B++,P>j?k++:E++,T>_?z++:B++,T>j?z++:E++,_>j?B++:E++;var G=P-(l=k>=3?1:0)+o,H=T-(u=z>=3?1:0)+o,I=_-(d=B>=3?1:0)+o,J=j-(p=E>=3?1:0)+o,K=P-(M=k>=2?1:0)+2*o,L=T-(m=z>=2?1:0)+2*o,O=_-(c=B>=2?1:0)+2*o,Q=j-(y=E>=2?1:0)+2*o,R=P-(w=k>=1?1:0)+3*o,V=T-(g=z>=1?1:0)+3*o,W=_-(A=B>=1?1:0)+3*o,X=j-(x=E>=1?1:0)+3*o,Y=P-1+4*o,Z=T-1+4*o,$=_-1+4*o,rr=j-1+4*o,er=255&U,tr=255&b,ar=255&F,or=255&N,ir=.6-P*P-T*T-_*_-j*j;if(ir<0)n=0;else{var nr=q[er+q[tr+q[ar+q[or]]]]%32*4;n=(ir*=ir)*ir*(D[nr]*P+D[nr+1]*T+D[nr+2]*_+D[nr+3]*j)}var fr=.6-G*G-H*H-I*I-J*J;if(fr<0)f=0;else{var sr=q[er+l+q[tr+u+q[ar+d+q[or+p]]]]%32*4;f=(fr*=fr)*fr*(D[sr]*G+D[sr+1]*H+D[sr+2]*I+D[sr+3]*J)}var vr=.6-K*K-L*L-O*O-Q*Q;if(vr<0)s=0;else{var hr=q[er+M+q[tr+m+q[ar+c+q[or+y]]]]%32*4;s=(vr*=vr)*vr*(D[hr]*K+D[hr+1]*L+D[hr+2]*O+D[hr+3]*Q)}var lr=.6-R*R-V*V-W*W-X*X;if(lr<0)v=0;else{var ur=q[er+w+q[tr+g+q[ar+A+q[or+x]]]]%32*4;v=(lr*=lr)*lr*(D[ur]*R+D[ur+1]*V+D[ur+2]*W+D[ur+3]*X)}var dr=.6-Y*Y-Z*Z-$*$-rr*rr;if(dr<0)h=0;else{var pr=q[er+1+q[tr+1+q[ar+1+q[or+1]]]]%32*4;h=(dr*=dr)*dr*(D[pr]*Y+D[pr+1]*Z+D[pr+2]*$+D[pr+3]*rr)}return 27*(n+f+s+v+h)}},i._buildPermutationTable=n,"undefined"!=typeof define&&define.amd&&define(function(){return i}),"undefined"!=typeof exports?exports.SimplexNoise=i:"undefined"!=typeof window&&(window.SimplexNoise=i),"undefined"!=typeof module&&(module.exports=i)}();`;

// Util functions
const utils = {
  PI: Math.PI,
  cos: Math.cos,
  sin: Math.sin,
  abs: Math.abs,
  sqrt: Math.sqrt,
  pow: Math.pow,
  round: Math.round,
  random: Math.random,
  atan2: Math.atan2,
  HALF_PI: 0.5 * Math.PI,
  TAU: 2 * Math.PI,
  TO_RAD: Math.PI / 180,
  floor: (n: number) => n | 0,
  rand: (n: number) => n * Math.random(),
  randIn: (min: number, max: number) => utils.rand(max - min) + min,
  randRange: (n: number) => n - utils.rand(2 * n),
  fadeIn: (t: number, m: number) => t / m,
  fadeOut: (t: number, m: number) => (m - t) / m,
  fadeInOut: (t: number, m: number) => {
    const hm = 0.5 * m;
    return utils.abs(((t + hm) % m) - hm) / hm;
  },
  dist: (x1: number, y1: number, x2: number, y2: number) =>
    utils.sqrt(utils.pow(x2 - x1, 2) + utils.pow(y2 - y1, 2)),
  angle: (x1: number, y1: number, x2: number, y2: number) =>
    utils.atan2(y2 - y1, x2 - x1),
  lerp: (n1: number, n2: number, speed: number) =>
    (1 - speed) * n1 + speed * n2,
};

// Configurable options interface
export interface ParticlesOptions {
  // Particle count & properties
  particleCount?: number;
  particleBaseRadius?: number;
  particleRadiusRange?: number;
  particleBaseSpeed?: number;
  particleSpeedRange?: number;

  // Particle lifetime
  particleBaseTTL?: number;
  particleTTLRange?: number;

  // Color options
  particleBaseHue?: number;
  particleHueRange?: number;
  backgroundColor?: string;

  // Noise settings
  noiseSteps?: number;
  noiseXOffset?: number;
  noiseYOffset?: number;
  noiseZOffset?: number;

  // Distribution settings
  particleRangeY?: number;

  // Glow settings
  glowEnabled?: boolean;
  glowBlurLarge?: number;
  glowBlurSmall?: number;
  glowBrightness?: number;
}

// Default options
const defaultOptions: ParticlesOptions = {
  particleCount: 700,
  particleBaseRadius: 1,
  particleRadiusRange: 4,
  particleBaseSpeed: 0.1,
  particleSpeedRange: 2,
  particleBaseTTL: 50,
  particleTTLRange: 150,
  particleBaseHue: 220,
  particleHueRange: 100,
  backgroundColor: "hsl(0, 0.00%, 0.00%)",
  noiseSteps: 8,
  noiseXOffset: 0.00125,
  noiseYOffset: 0.00125,
  noiseZOffset: 0.0005,
  particleRangeY: 100,
  glowEnabled: true,
  glowBlurLarge: 8,
  glowBlurSmall: 4,
  glowBrightness: 200,
};

interface ParticlesProps {
  className?: string;
  children?: ReactNode;
  options?: ParticlesOptions;
}

const Particles: React.FC<ParticlesProps> = ({
  className,
  children,
  options = {},
}) => {
  // Merge default options with provided options
  const opts = { ...defaultOptions, ...options };

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasARef = useRef<HTMLCanvasElement | null>(null);
  const canvasBRef = useRef<HTMLCanvasElement | null>(null);
  const ctxARef = useRef<CanvasRenderingContext2D | null>(null);
  const ctxBRef = useRef<CanvasRenderingContext2D | null>(null);
  const centerRef = useRef<number[]>([]);
  const tickRef = useRef<number>(0);
  const simplexRef = useRef<any>(null);
  const particlePropsRef = useRef<Float32Array | null>(null);
  const rafRef = useRef<number | null>(null);

  // Constants based on options
  const particleCount = opts.particleCount!;
  const particlePropCount = 9; // Fixed, x, y, vx, vy, life, ttl, speed, radius, hue
  const particlePropsLength = particleCount * particlePropCount;

  // Initialize the particle effect
  useEffect(() => {
    try {
      // Inject the noise script
      const script = document.createElement("script");
      script.textContent = SimplexNoiseCode;
      document.body.appendChild(script);

      // Create canvases
      const container = containerRef.current;
      if (!container) return;

      // Create canvas A
      const canvasA = document.createElement("canvas");
      canvasARef.current = canvasA;

      // Create canvas B
      const canvasB = document.createElement("canvas");
      canvasBRef.current = canvasB;

      // Style canvas B
      canvasB.style.position = "absolute";
      canvasB.style.top = "0";
      canvasB.style.left = "0";
      canvasB.style.width = "100%";
      canvasB.style.height = "100%";
      canvasB.style.pointerEvents = "none"; // Make sure clicks pass through to content
      canvasB.style.zIndex = "0"; // Ensure canvas stays behind other content

      // Append to the container
      container.appendChild(canvasB);

      // Get contexts
      const ctxA = canvasA.getContext("2d");
      const ctxB = canvasB.getContext("2d");

      if (!ctxA || !ctxB) return;

      ctxARef.current = ctxA;
      ctxBRef.current = ctxB;

      // Initialize center array
      centerRef.current = [];

      // Handle resize to set canvas dimensions
      const handleResize = () => {
        try {
          if (!container) return;

          const rect = container.getBoundingClientRect();
          const width = rect.width;
          const height = rect.height;

          // Set explicit dimensions based on container size
          canvasA.width = width;
          canvasA.height = height;

          if (ctxA && ctxB && canvasB) {
            // Transfer content during resize
            ctxA.drawImage(canvasB, 0, 0);

            canvasB.width = width;
            canvasB.height = height;

            ctxB.drawImage(canvasA, 0, 0);
          }

          centerRef.current[0] = 0.5 * width;
          centerRef.current[1] = 0.5 * height;
        } catch (error) {
          console.error("Error during resize:", error);
        }
      };

      // Initialize particles
      const initParticles = () => {
        try {
          tickRef.current = 0;
          // @ts-ignore - SimplexNoise comes from injected script
          simplexRef.current = new SimplexNoise();
          particlePropsRef.current = new Float32Array(particlePropsLength);

          for (let i = 0; i < particlePropsLength; i += particlePropCount) {
            initParticle(i);
          }
        } catch (error) {
          console.error("Error initializing particles:", error);
        }
      };

      // Initialize a single particle
      const initParticle = (i: number) => {
        try {
          if (
            !particlePropsRef.current ||
            !canvasARef.current ||
            !centerRef.current
          )
            return;

          const x = utils.rand(canvasARef.current.width);
          const y =
            centerRef.current[1] + utils.randRange(opts.particleRangeY!);
          const vx = 0;
          const vy = 0;
          const life = 0;
          const ttl =
            opts.particleBaseTTL! + utils.rand(opts.particleTTLRange!);
          const speed =
            opts.particleBaseSpeed! + utils.rand(opts.particleSpeedRange!);
          const radius =
            opts.particleBaseRadius! + utils.rand(opts.particleRadiusRange!);
          const hue =
            opts.particleBaseHue! + utils.rand(opts.particleHueRange!);

          particlePropsRef.current.set(
            [x, y, vx, vy, life, ttl, speed, radius, hue],
            i
          );
        } catch (error) {
          console.error("Error initializing particle:", error);
        }
      };

      // Check if particle is within bounds
      const checkBounds = (x: number, y: number) => {
        try {
          if (!canvasARef.current) return true;

          return (
            x > canvasARef.current.width ||
            x < 0 ||
            y > canvasARef.current.height ||
            y < 0
          );
        } catch (error) {
          console.error("Error checking bounds:", error);
          return true;
        }
      };

      // Draw a particle
      const drawParticle = (
        x: number,
        y: number,
        x2: number,
        y2: number,
        life: number,
        ttl: number,
        radius: number,
        hue: number
      ) => {
        try {
          if (!ctxARef.current) return;

          ctxARef.current.save();
          ctxARef.current.lineCap = "round";
          ctxARef.current.lineWidth = radius;
          ctxARef.current.strokeStyle = `hsla(${hue},100%,60%,${utils.fadeInOut(
            life,
            ttl
          )})`;
          ctxARef.current.beginPath();
          ctxARef.current.moveTo(x, y);
          ctxARef.current.lineTo(x2, y2);
          ctxARef.current.stroke();
          ctxARef.current.closePath();
          ctxARef.current.restore();
        } catch (error) {
          console.error("Error drawing particle:", error);
        }
      };

      // Update a particle
      const updateParticle = (i: number) => {
        try {
          if (!particlePropsRef.current || !simplexRef.current) return;

          const i2 = 1 + i,
            i3 = 2 + i,
            i4 = 3 + i,
            i5 = 4 + i,
            i6 = 5 + i,
            i7 = 6 + i,
            i8 = 7 + i,
            i9 = 8 + i;

          const x = particlePropsRef.current[i];
          const y = particlePropsRef.current[i2];
          const n =
            simplexRef.current.noise3D(
              x * opts.noiseXOffset!,
              y * opts.noiseYOffset!,
              tickRef.current * opts.noiseZOffset!
            ) *
            opts.noiseSteps! *
            utils.TAU;

          const vx = utils.lerp(
            particlePropsRef.current[i3],
            utils.cos(n),
            0.5
          );

          const vy = utils.lerp(
            particlePropsRef.current[i4],
            utils.sin(n),
            0.5
          );

          const life = particlePropsRef.current[i5];
          const ttl = particlePropsRef.current[i6];
          const speed = particlePropsRef.current[i7];
          const x2 = x + vx * speed;
          const y2 = y + vy * speed;
          const radius = particlePropsRef.current[i8];
          const hue = particlePropsRef.current[i9];

          drawParticle(x, y, x2, y2, life, ttl, radius, hue);

          particlePropsRef.current[i] = x2;
          particlePropsRef.current[i2] = y2;
          particlePropsRef.current[i3] = vx;
          particlePropsRef.current[i4] = vy;
          particlePropsRef.current[i5] = life + 1;

          if (checkBounds(x, y) || life > ttl) {
            initParticle(i);
          }
        } catch (error) {
          console.error("Error updating particle:", error);
        }
      };

      // Draw all particles
      const drawParticles = () => {
        try {
          for (let i = 0; i < particlePropsLength; i += particlePropCount) {
            updateParticle(i);
          }
        } catch (error) {
          console.error("Error drawing particles:", error);
        }
      };

      // Render glow effect
      const renderGlow = () => {
        try {
          if (!ctxBRef.current || !canvasARef.current || !opts.glowEnabled)
            return;

          ctxBRef.current.save();
          ctxBRef.current.filter = `blur(${opts.glowBlurLarge}px) brightness(${opts.glowBrightness}%)`;
          ctxBRef.current.globalCompositeOperation = "lighter";
          ctxBRef.current.drawImage(canvasARef.current, 0, 0);
          ctxBRef.current.restore();

          ctxBRef.current.save();
          ctxBRef.current.filter = `blur(${opts.glowBlurSmall}px) brightness(${opts.glowBrightness}%)`;
          ctxBRef.current.globalCompositeOperation = "lighter";
          ctxBRef.current.drawImage(canvasARef.current, 0, 0);
          ctxBRef.current.restore();
        } catch (error) {
          console.error("Error rendering glow:", error);
        }
      };

      // Render to screen
      const renderToScreen = () => {
        try {
          if (!ctxBRef.current || !canvasARef.current) return;

          ctxBRef.current.save();
          ctxBRef.current.globalCompositeOperation = "lighter";
          ctxBRef.current.drawImage(canvasARef.current, 0, 0);
          ctxBRef.current.restore();
        } catch (error) {
          console.error("Error rendering to screen:", error);
        }
      };

      // Main draw function
      const draw = () => {
        try {
          if (!ctxARef.current || !ctxBRef.current || !canvasARef.current)
            return;

          tickRef.current++;

          ctxARef.current.clearRect(
            0,
            0,
            canvasARef.current.width,
            canvasARef.current.height
          );

          ctxBRef.current.fillStyle = opts.backgroundColor!;
          ctxBRef.current.fillRect(
            0,
            0,
            canvasARef.current.width,
            canvasARef.current.height
          );

          drawParticles();
          renderGlow();
          renderToScreen();

          rafRef.current = window.requestAnimationFrame(draw);
        } catch (error) {
          console.error("Error in draw function:", error);
        }
      };

      // Create a resize observer to handle container size changes
      const resizeObserver = new ResizeObserver(() => {
        handleResize();
      });

      // Observe the container element
      resizeObserver.observe(container);

      // Initialize everything
      handleResize();
      initParticles();
      draw();

      // Cleanup on unmount
      return () => {
        try {
          if (rafRef.current) {
            window.cancelAnimationFrame(rafRef.current);
          }

          resizeObserver.disconnect();

          if (canvasBRef.current && container) {
            container.removeChild(canvasBRef.current);
          }

          document.body.removeChild(script);
        } catch (error) {
          console.error("Error during cleanup:", error);
        }
      };
    } catch (error) {
      console.error("Error in Particles component:", error);
    }
  }, [
    opts.particleCount,
    opts.particleBaseRadius,
    opts.particleRadiusRange,
    opts.particleBaseSpeed,
    opts.particleSpeedRange,
    opts.particleBaseTTL,
    opts.particleTTLRange,
    opts.particleBaseHue,
    opts.particleHueRange,
    opts.backgroundColor,
    opts.noiseSteps,
    opts.noiseXOffset,
    opts.noiseYOffset,
    opts.noiseZOffset,
    opts.particleRangeY,
    opts.glowEnabled,
    opts.glowBlurLarge,
    opts.glowBlurSmall,
    opts.glowBrightness,
  ]);

  return (
    <div
      ref={containerRef}
      className={`particles-container ${className || ""}`}
    >
      {children}
    </div>
  );
};

export default Particles;
