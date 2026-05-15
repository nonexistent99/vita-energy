import { useEffect, useRef, useState, useCallback } from 'react';

// To optimize loading, we will only load every 2nd frame (40 frames instead of 80).
// This cuts the download size in half, making it load much faster on mobile networks.
const TOTAL_ORIGINAL_FRAMES = 80;
const SKIP_FRAMES = 2; 
const TOTAL_FRAMES = Math.floor(TOTAL_ORIGINAL_FRAMES / SKIP_FRAMES);

const FRAME_PREFIX = '/animation/VITA_ENERGY_bottle_202603311622_';

function padFrame(n: number): string {
  return String(n).padStart(3, '0');
}

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef(0);
  const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const rafRef = useRef<number>(0);
  const directionRef = useRef(1);

  // Draw a specific frame to the canvas
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = imagesRef.current[index];
    if (!img) return;

    const cw = canvas.parentElement?.clientWidth || window.innerWidth;
    const ch = canvas.parentElement?.clientHeight || window.innerHeight;
    canvas.width = cw;
    canvas.height = ch;

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cw / ch;
    
    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      // Desktop: canvas is wider than image
      drawWidth = cw;
      drawHeight = cw / imgRatio;
      offsetX = 0;
      offsetY = (ch - drawHeight) / 2;
    } else {
      // Mobile: canvas is taller than image
      drawHeight = ch;
      drawWidth = ch * imgRatio;
      
      // Bottle is at ~75% of original image width
      const focalPointX = drawWidth * 0.75;
      offsetX = (cw / 2) - focalPointX;
      
      offsetY = 0;
    }

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // Preload frames
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      // Skip frames to reduce load size (e.g. 0, 2, 4, 6...)
      const originalFrameIndex = i * SKIP_FRAMES;
      img.src = `${FRAME_PREFIX}${padFrame(originalFrameIndex)}.jpg`;
      
      img.onload = () => {
        loadedCount++;
        
        // As soon as the first frame loads, we can display it!
        if (i === 0) {
          setFirstFrameLoaded(true);
        }
        
        // Once ALL frames are loaded, we can start the animation loop
        if (loadedCount === TOTAL_FRAMES) {
          setAllLoaded(true);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;
  }, []);

  // Handle immediate draw of the first frame once it's ready
  useEffect(() => {
    if (firstFrameLoaded && !allLoaded) {
      drawFrame(0);
      const handleResize = () => drawFrame(0);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [firstFrameLoaded, allLoaded, drawFrame]);

  // Handle the animation loop once ALL frames are loaded
  useEffect(() => {
    if (!allLoaded) return;

    const handleResize = () => drawFrame(frameRef.current);
    window.addEventListener('resize', handleResize);

    let lastTime = 0;
    // Lower FPS slightly because we halved the frames
    const fps = 12; 
    const interval = 1000 / fps;

    const animate = (time: number) => {
      rafRef.current = requestAnimationFrame(animate);
      const delta = time - lastTime;
      if (delta < interval) return;
      lastTime = time - (delta % interval);

      const frame = frameRef.current;
      drawFrame(frame);

      // Bounce at edges
      if (frame >= TOTAL_FRAMES - 1) directionRef.current = -1;
      if (frame <= 0) directionRef.current = 1;
      frameRef.current += directionRef.current;
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [allLoaded, drawFrame]);

  const scrollToBuilder = () => {
    document.getElementById('pedido')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen w-full flex flex-col justify-end items-center overflow-hidden pb-20 md:pb-32">
      {/* Background Canvas */}
      <div className="absolute inset-0 z-0 bg-[#83187b]">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
          style={{
            filter: firstFrameLoaded ? 'none' : 'blur(10px)',
            transition: 'filter 0.5s ease',
            opacity: 0.95
          }}
        />
        {/* Loading spinner only shows until the VERY FIRST frame loads */}
        {!firstFrameLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20">
            <div className="w-12 h-12 border-4 border-white/20 border-t-brand-glow rounded-full" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        )}
      </div>

      {/* Gradient Overlays for Text Readability */}
      <div className="absolute inset-0 z-0 bg-black/20" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-brand-deep via-brand-deep/80 to-transparent h-full" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-brand-deep/60 via-transparent to-transparent h-1/3" />

      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6"
        style={{ animation: 'fadeInUp 1s ease-out both', animationDelay: '0.3s' }}>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md bg-black/40 border border-white/10 shadow-2xl">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-glow" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
          <span className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-white/90">Sinta a Diferença</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white drop-shadow-2xl">
          ENERGIA<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-glow to-purple-400">
            PURA.
          </span>
        </h1>

        <p className="text-base md:text-lg text-white/80 font-medium max-w-lg leading-relaxed drop-shadow-md">
          Açaí de alta performance com ingredientes premium. Montagem personalizada, entrega expressa.
        </p>

        <button 
          onClick={scrollToBuilder} 
          className="mt-4 flex items-center gap-3 px-10 py-5 rounded-full font-black text-lg text-brand-deep bg-white hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]"
        >
          MONTE O SEU AÇAÍ
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>

      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/50 animate-bounce flex flex-col items-center gap-2 hidden md:flex">
        <span className="text-[0.6rem] font-bold tracking-widest uppercase">Rolar</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
      </div>
    </section>
  );
}
