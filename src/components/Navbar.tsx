import { Settings, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useStoreConfig } from '../hooks/useStoreConfig';

export default function Navbar() {
  const { config } = useStoreConfig();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const brandParts = config.business.brandName.trim().split(/\s+/);
  const accent = brandParts.pop() ?? 'Energy';
  const mainBrand = brandParts.join(' ') || 'Vita';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-3 backdrop-blur-xl border-b border-white/[0.05]'
          : 'py-4 bg-transparent'
      }`}
      style={isScrolled ? { background: 'rgba(15,7,26,0.85)' } : {}}
    >
      <div className="max-w-3xl mx-auto px-5 md:px-8 flex items-center justify-between gap-3">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="cursor-pointer min-w-0">
          <span className="block truncate text-lg font-black tracking-tight text-white uppercase">
            {mainBrand} <span className="text-brand-glow">{accent}</span>
          </span>
        </button>

        <div className="flex items-center gap-2">
          <a
            href="#/admin"
            aria-label="Abrir painel admin"
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all"
          >
            <Settings size={16} />
          </a>
          <button
            onClick={() => scrollTo('pedido')}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all duration-300 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Pedir Agora</span>
            <span className="sm:hidden">Pedir</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
