import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-3 backdrop-blur-xl border-b border-white/[0.05]'
          : 'py-4 bg-transparent'
      }`}
      style={isScrolled ? { background: 'rgba(15,7,26,0.85)' } : {}}
    >
      <div className="max-w-3xl mx-auto px-5 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="cursor-pointer">
          <span className="text-lg font-black tracking-tight text-white">
            VITA <span className="text-brand-glow">ENERGY</span>
          </span>
        </button>

        {/* CTA */}
        <button
          onClick={() => scrollTo('pedido')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all duration-300 hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          Pedir Agora
        </button>
      </div>
    </nav>
  );
}
