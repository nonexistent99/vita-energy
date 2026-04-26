import { useEffect, useRef } from 'react';
import { gsap } from '../hooks/useScrollAnimation';

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cta-reveal', { y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true } });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative py-32 md:py-44 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(15,7,26,1) 0%, var(--color-brand-deep) 100%)' }} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="max-w-[1400px] mx-auto px-6 md:px-8 relative z-10 text-center">
        <div className="max-w-2xl mx-auto">
          {/* Badge */}
          <div className="cta-reveal inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-glow" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
            <span className="text-[0.6rem] font-bold tracking-[0.12em] uppercase text-brand-glow">Peça agora</span>
          </div>

          {/* Headline */}
          <h2 className="cta-reveal text-4xl md:text-6xl font-black tracking-tight leading-[1.05] text-white mb-6">
            Seu próximo pré-treino<br/><span className="text-brand-glow">começa aqui.</span>
          </h2>

          <p className="cta-reveal text-base md:text-lg text-text-muted leading-relaxed max-w-lg mx-auto mb-10">
            Monte agora o seu Vita Energy. Escolha cada detalhe, personalize e receba direto pelo WhatsApp.
          </p>

          <div className="cta-reveal flex flex-col items-center gap-4">
            <button onClick={() => document.getElementById('builder')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary text-lg !px-10 !py-5 !font-extrabold" style={{ boxShadow: '0 0 60px rgba(124,58,237,0.3)' }}>
              Monte o Seu Vita Energy
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
            <span className="text-[0.65rem] font-bold tracking-widest uppercase text-text-muted opacity-50">
              Finalização rápida pelo WhatsApp
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
