import { MessageCircle } from 'lucide-react';
import { useStoreConfig } from '../hooks/useStoreConfig';

export default function Footer() {
  const { config } = useStoreConfig();
  const brandParts = config.business.brandName.trim().split(/\s+/);
  const accent = brandParts.pop() ?? 'Energy';
  const mainBrand = brandParts.join(' ') || 'Vita';

  return (
    <footer className="py-12" style={{ background: '#0f071a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="max-w-3xl mx-auto px-5 md:px-8 text-center">
        <span className="text-xl font-black tracking-tight text-white mb-4 block uppercase">
          {mainBrand} <span className="text-brand-glow">{accent}</span>
        </span>

        <p className="text-sm text-text-muted mb-8 max-w-sm mx-auto">
          Açaí de performance com ingredientes premium. Sabor e energia para o seu dia.
        </p>

        <div className="flex justify-center gap-6 mb-10">
          <a
            href={`https://wa.me/${config.business.whatsappPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-brand-whatsapp hover:scale-110 transition-all"
          >
            <MessageCircle size={18} />
          </a>
          <a
            href={config.business.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-brand-glow hover:scale-110 transition-all"
          >
            <InstagramIcon />
          </a>
        </div>

        <div className="text-xs text-text-muted opacity-50">
          &copy; {new Date().getFullYear()} {config.business.brandName}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5"/>
      <circle cx="12" cy="12" r="5"/>
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}
