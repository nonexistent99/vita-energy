import { useEffect, useRef } from 'react';
import { gsap } from '../hooks/useScrollAnimation';

const GALLERY = [
  { src: '/acai-closeup.png',       tag: 'textura',       title: 'Cremosidade que impressiona',                    span: 'row-span-2' },
  { src: '/gym-lifestyle.png',      tag: 'pré-treino',    title: 'Energia que acompanha o treino',                 span: 'col-span-2' },
  { src: '/ingredients-premium.png', tag: 'ingredientes',  title: 'Whey, frutas frescas e complementos funcionais', span: '' },
  { src: '/bottle-hero.png',        tag: 'produto',       title: 'Identidade visual autoral',                      span: '' },
  { src: '/bottle-studio.png',      tag: 'estúdio',       title: 'Iluminação premium, produto real',               span: 'col-span-2' },
  { src: '/bottles-lineup.png',     tag: 'lineup',        title: 'Linha completa de sabores',                      span: 'row-span-2' },
];

export default function GallerySection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gallery-item', {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="gallery" ref={sectionRef} className="relative py-40 md:py-52 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 text-[0.6rem] font-extrabold tracking-[0.15em] uppercase text-text-muted mb-5">
            <span className="w-8 h-px bg-white/15" />Galeria Editorial<span className="w-8 h-px bg-white/15" />
          </div>
          <h2 className="text-3xl md:text-[2.75rem] font-extrabold tracking-tight text-white leading-tight mb-5">
            A experiência por trás<br/><span className="text-brand-glow">de cada detalhe.</span>
          </h2>
          <p className="text-base text-text-muted leading-relaxed">
            Close de textura. Contexto de treino. Produto em estúdio. Cada imagem é proposital.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[280px] gap-4">
          {GALLERY.map((item, i) => (
            <div key={i} className={`gallery-item group relative rounded-2xl overflow-hidden cursor-pointer ${item.span}`} style={{ border: '1px solid rgba(255,255,255,0.03)' }}>
              <img src={item.src} alt={item.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-y-0">
                <span className="inline-block px-3 py-1 rounded-full text-[0.5rem] font-bold tracking-widest uppercase mb-2" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)' }}>{item.tag}</span>
                <p className="text-sm font-semibold text-white leading-snug">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
