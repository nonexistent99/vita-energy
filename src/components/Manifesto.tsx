import { useEffect, useRef } from 'react';
import { gsap } from '../hooks/useScrollAnimation';

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.manifesto-reveal', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="manifesto" ref={sectionRef} className="relative py-40 md:py-52 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute -left-[20%] top-[20%] w-[40vw] h-[40vw] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="max-w-[1400px] mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div className="max-w-xl">
            <div className="section-label manifesto-reveal">Manifesto da marca</div>

            <h2 className="manifesto-reveal text-3xl md:text-[2.75rem] font-extrabold tracking-tight leading-tight text-white mb-8">
              No meio de tanta marca parecida, a Vita Energy nasce para ocupar{' '}
              <span className="text-brand-glow">outro espaço.</span>
            </h2>

            <div className="flex flex-col gap-5">
              <p className="manifesto-reveal text-base text-text-muted leading-relaxed">
                Aqui, o açaí ganha linguagem de produto premium, montagem autoral e uma proposta que
                conversa com treino, foco e rotina ativa. É sabor com função. É energia com desejo visual.
              </p>
              <p className="manifesto-reveal text-base text-text-muted leading-relaxed">
                Não é só matar a vontade. É entrar no treino com outra energia.
                É transformar o açaí em ritual. É uma marca que tem presença.
              </p>
              <p className="manifesto-reveal text-lg font-bold text-brand-glow">
                Vita Energy. Uma nova forma de consumir açaí.
              </p>
            </div>
          </div>

          {/* Visual */}
          <div className="manifesto-reveal">
            <div className="relative rounded-3xl overflow-hidden" style={{ aspectRatio: '4/5' }}>
              <img
                src="/bottle-studio.png"
                alt="Vita Energy product in studio lighting"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,3,13,0.5) 0%, transparent 50%)' }} />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full text-[0.75rem] font-bold"
                  style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="w-2 h-2 rounded-full bg-brand-pink" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
                  Textura premium &bull; Montagem autoral
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
