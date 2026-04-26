import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setIsOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const links = [
    { label: 'Sobre', id: 'manifesto' },
    { label: 'Monte o Seu', id: 'builder' },
    { label: 'Galeria', id: 'gallery' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-3 bg-brand-deep/60 backdrop-blur-xl border-b border-white/[0.04]'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="cursor-pointer">
            <span className="text-xl font-black tracking-tight text-white">
              VITA <span className="text-brand-violet">ENERGY</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            {links.map(link => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-[0.7rem] font-bold tracking-[0.12em] uppercase text-text-muted hover:text-white transition-colors duration-300"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <button onClick={() => scrollTo('builder')} className="btn-primary !px-6 !py-2.5 text-sm">
              <IconShoppingBag />
              <span>Monte o Seu</span>
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2.5 rounded-xl text-white"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] bg-brand-deep/97 backdrop-blur-3xl flex flex-col items-center justify-center gap-8">
          <button onClick={() => setIsOpen(false)} className="absolute top-5 right-5 p-3 text-white">
            <IconX />
          </button>
          {links.map(link => (
            <button key={link.id} onClick={() => scrollTo(link.id)} className="text-2xl font-black text-white">
              {link.label}
            </button>
          ))}
          <button onClick={() => scrollTo('builder')} className="btn-primary mt-8 text-lg !px-10 !py-4">
            Monte o Seu Vita
          </button>
        </div>
      )}
    </>
  );
}


/* SVG Icons */
const IconShoppingBag = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="4" x2="20" y1="7" y2="7"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="17" y2="17"/>
  </svg>
);

const IconX = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/>
  </svg>
);
