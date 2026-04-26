import { WHATSAPP_PHONE } from '../utils/config';

export default function Footer() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="pt-20 pb-10" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <span className="text-xl font-black tracking-tight text-white">VITA <span className="text-brand-violet">ENERGY</span></span>
            <p className="text-sm text-text-muted mt-4 leading-relaxed max-w-xs">
              Açaí funcional de performance. Energia, sabor e presença em cada gole.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-text-muted mb-5">Navegação</h4>
            <div className="flex flex-col gap-3">
              {[{ label: 'Sobre a marca', id: 'manifesto' }, { label: 'Monte o seu', id: 'builder' }, { label: 'Galeria', id: 'gallery' }].map(l => (
                <button key={l.id} onClick={() => scrollTo(l.id)} className="text-sm text-text-soft hover:text-white transition-colors duration-300 text-left">{l.label}</button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-text-muted mb-5">Contato</h4>
            <div className="flex flex-col gap-3">
              <a href={`https://wa.me/${WHATSAPP_PHONE}`} target="_blank" rel="noopener noreferrer" className="text-sm text-text-soft hover:text-white transition-colors inline-flex items-center gap-2">
                <IconWhatsApp /> WhatsApp
              </a>
              <a href="https://instagram.com/vitaenergy" target="_blank" rel="noopener noreferrer" className="text-sm text-text-soft hover:text-white transition-colors inline-flex items-center gap-2">
                <IconInstagram /> Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
          <span className="text-xs text-text-muted opacity-50">
            &copy; {new Date().getFullYear()} Vita Energy. Todos os direitos reservados.
          </span>
          <span className="text-[0.6rem] font-bold tracking-[0.1em] uppercase text-text-muted opacity-30">
            Açaí de Performance
          </span>
        </div>
      </div>
    </footer>
  );
}

const IconWhatsApp = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
);
const IconInstagram = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
);
