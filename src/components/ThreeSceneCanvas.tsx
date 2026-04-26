import { Suspense, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import ProductModel from './three/ProductModel';
import CameraRig from './three/CameraRig';
import SceneLights from './three/SceneLights';
import FloatingElements from './three/FloatingElements';
import Floor from './three/Floor';
import { useScrollProgress } from '../hooks/useScrollAnimation';


/**
 * ThreeSceneCanvas — Fixed canvas with scroll-driven 3D experience
 * Placed behind all content, driven by the scroll-story container.
 */
export default function ThreeSceneCanvas() {
  const [progress, setProgress] = useState(0);

  const handleProgress = useCallback((p: number) => {
    setProgress(p);
  }, []);

  // The scroll container ref must exist outside Canvas
  const scrollRef = useScrollProgress(handleProgress, {
    start: 'top top',
    end: 'bottom bottom',
  });

  return (
    <>
      {/* Scroll driver element — this is what drives the 3D scene */}
      <div
        ref={scrollRef}
        id="scroll-story"
        className="relative"
        style={{ height: '400vh' }}
      >
        {/* Fixed canvas behind the scroll content */}
        <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ zIndex: 0 }}>
          <Canvas
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'transparent',
            }}
          >
            <Suspense fallback={null}>
              <fog attach="fog" args={['#2A0835', 1, 10]} />

              <CameraRig scrollProgress={progress} />

              <SceneLights />
              <ProductModel scrollProgress={progress} />
              <FloatingElements scrollProgress={progress} />
              <Floor />
              <Preload all />
            </Suspense>
          </Canvas>


          {/* Content overlays for each scene */}
          <ScrollStoryOverlays progress={progress} />
        </div>
      </div>
    </>
  );
}


/* ============================================
   SCROLL OVERLAY TEXT — positioned over the 3D canvas
   ============================================ */
function ScrollStoryOverlays({ progress }: { progress: number }) {
  // Scene thresholds
  // unused scene variable removed

  const fadeIn = (start: number, end: number) => {
    if (progress < start) return 0;
    if (progress > end) return 0;
    const mid = (start + end) / 2;
    if (progress < mid) return (progress - start) / (mid - start);
    return 1 - (progress - mid) / (end - mid);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 h-full relative">

        {/* Scene 0 — HERO TEXT */}
        <div
          className="absolute left-0 top-0 h-full flex items-center"
          style={{
            opacity: fadeIn(0, 0.28),
            transform: `translateY(${(1 - fadeIn(0, 0.28)) * 20}px)`,
            transition: 'none',
          }}
        >
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-glow" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
              <span className="text-[0.6rem] font-bold tracking-[0.12em] uppercase text-brand-glow">Açaí de Performance</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95] text-white mb-6">
              Não é só açaí.<br />
              <span className="text-brand-glow">É energia com presença.</span>
            </h1>

            <p className="text-base md:text-lg text-text-muted font-normal leading-relaxed max-w-md mb-8">
              Uma experiência pensada para quem quer mais do que matar a vontade.
              Mais textura. Mais performance. Mais impacto.
            </p>

            <div className="flex flex-wrap gap-4 pointer-events-auto">
              <button
                onClick={() => document.getElementById('builder')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary text-sm"
              >
                Monte o Seu Vita
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
              <button
                onClick={() => document.getElementById('manifesto')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary text-sm"
              >
                Conheça a Marca
              </button>
            </div>
          </div>
        </div>


        {/* Scene 1 — APPROACH: Detail text */}
        <div
          className="absolute right-0 top-0 h-full flex items-center justify-end"
          style={{
            opacity: fadeIn(0.22, 0.52),
            transform: `translateX(${(1 - fadeIn(0.22, 0.52)) * 30}px)`,
          }}
        >
          <div className="max-w-md text-right">
            <div className="section-label justify-end mb-4">
              <span>Textura & Sabor</span>
              <span className="block w-8 h-0.5 bg-brand-violet" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Cada detalhe importa.<br />
              <span className="text-brand-pink">Cremosidade real.</span>
            </h2>
            <p className="text-sm md:text-base text-text-muted leading-relaxed">
              Açaí com densidade, temperatura controlada e textura que impressiona
              desde a primeira colherada. Nada de produto genérico.
            </p>
          </div>
        </div>

        {/* Scene 2 — FUNCTIONAL: Feature highlights */}
        <div
          className="absolute left-0 top-0 h-full flex items-center"
          style={{
            opacity: fadeIn(0.48, 0.78),
            transform: `translateY(${(1 - fadeIn(0.48, 0.78)) * 20}px)`,
          }}
        >
          <div className="max-w-lg">
            <div className="section-label mb-4">Energia & Performance</div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Whey protein. Pré-treino.<br />
              <span className="text-brand-cyan">Função com sabor.</span>
            </h2>

            <div className="flex flex-col gap-4">
              {[
                { icon: <IconZap />, title: 'Whey integrado', desc: 'Proteína de alta qualidade em cada porção' },
                { icon: <IconFlame />, title: 'Pré-treino natural', desc: 'Guaraná, maca peruana e complementos funcionais' },
                { icon: <IconTarget />, title: 'Montagem autoral', desc: 'Cada copo é único como sua rotina' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-brand-glow"
                    style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.18)' }}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-0.5">{item.title}</h3>
                    <p className="text-xs text-text-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scene 3 — TRANSITION: conversion nudge */}
        <div
          className="absolute left-0 top-0 h-full flex items-center"
          style={{
            opacity: fadeIn(0.72, 1.0),
            transform: `translateY(${(1 - fadeIn(0.72, 1.0)) * 20}px)`,
          }}
        >
          <div className="max-w-lg">
            <div className="section-label mb-4">Pronto para montar?</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6 leading-[1.05]">
              Seu Vita Energy,<br />
              <span className="text-brand-glow">do seu jeito.</span>
            </h2>
            <p className="text-base text-text-muted leading-relaxed mb-8 max-w-md">
              Escolha o tamanho, a base, adicione whey, configure cada detalhe.
              Finalização direto no WhatsApp.
            </p>
            <button
              onClick={() => document.getElementById('builder')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary pointer-events-auto"
            >
              Monte o Seu Vita
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}


/* ============================================
   SVG ICONS — inline, consistent stroke
   ============================================ */
const IconZap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
);

const IconFlame = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

const IconTarget = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
