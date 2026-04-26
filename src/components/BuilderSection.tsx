import { useState, useMemo, useEffect, useRef } from 'react';
import { gsap } from '../hooks/useScrollAnimation';
import { openWhatsApp } from '../utils/config';

/* ============================================
   SVG ICONS
   ============================================ */
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const IconChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
);
const IconChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
);
const IconStore = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>
);
const IconTruck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
);
const IconWhatsApp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
);

/* ============================================
   DATA
   ============================================ */
interface Size { id: string; label: string; price: number; }
interface Extra { id: string; label: string; price: number; }

const SIZES: Size[] = [
  { id: '300', label: '300 ML', price: 16.9 },
  { id: '500', label: '500 ML', price: 21.9 },
];

const BASES = ['Açaí Tradicional', 'Açaí Zero'];

const ACCOMPANIMENTS = [
  'Leite em Pó', 'Amendoim', 'Granola', 'Leite Condensado', 'Oreo', 
  'Ovomaltine', 'Mel', 'Banana', 'Morango', 'Abacaxi', 'Manga', 
  'Mousse de Maracujá', 'Mousse de Morango'
];

const PAID_EXTRAS: Extra[] = [
  { id: 'nutella', label: 'Nutella', price: 2.5 },
  { id: 'whey', label: 'Whey Protein', price: 3.5 },
];

const STEPS = [
  { n: 1, label: 'Tamanho', k: 'size' },
  { n: 2, label: 'Sabor', k: 'base' },
  { n: 3, label: 'Acompanhamentos', k: 'accompaniments' },
  { n: 4, label: 'Adicionais', k: 'extras' },
  { n: 5, label: 'Finalizar', k: 'finish' },
];

/* ============================================
   COMPONENT
   ============================================ */
export default function BuilderSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [size, setSize] = useState(SIZES[0]);
  const [base, setBase] = useState(BASES[0]);
  const [accompaniments, setAccompaniments] = useState<string[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [notes, setNotes] = useState('');
  const [delivery, setDelivery] = useState<'retirada' | 'entrega'>('entrega');
  const [address, setAddress] = useState('');

  const total = useMemo(() => {
    let t = size.price;
    extras.forEach(e => t += e.price);
    return t;
  }, [size, extras]);

  const togAccompaniment = (t: string) => {
    setAccompaniments(p => {
      if (p.includes(t)) return p.filter(x => x !== t);
      if (p.length >= 3) return p; // Limit to 3
      return [...p, t];
    });
  };

  const togExtra = (e: Extra) => {
    setExtras(p => p.some(x => x.id === e.id) ? p.filter(x => x.id !== e.id) : [...p, e]);
  };

  const submit = () => {
    if (delivery === 'entrega' && !address.trim()) {
      alert('Por favor, informe seu endereço para entrega.');
      return;
    }
    openWhatsApp({
      size: size.label,
      base,
      accompaniments,
      extras: extras.map(e => e.label),
      notes,
      deliveryType: delivery === 'entrega' ? 'Entrega' : 'Retirada no local',
      address: delivery === 'entrega' ? address : undefined,
      total,
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.builder-reveal', { 
        y: 30, 
        opacity: 0, 
        duration: 0.7, 
        stagger: 0.1, 
        ease: 'power3.out', 
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } 
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="builder" ref={sectionRef} className="relative py-40 md:py-52 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 relative z-10">

        {/* Header */}
        <div className="max-w-xl mb-14 builder-reveal">
          <div className="section-label">Faça seu Pedido</div>
          <h2 className="text-3xl md:text-[2.75rem] font-extrabold tracking-tight leading-tight text-white mb-5">
            Monte o seu <span className="text-brand-glow">Açaí Perfeito.</span>
          </h2>
          <p className="text-base text-text-muted leading-relaxed">
            Siga os passos e personalize cada detalhe do seu Vita Energy.
          </p>
        </div>

        {/* Steps Progress */}
        <div className="flex gap-2 mb-12 overflow-x-auto pb-4 builder-reveal scrollbar-hide">
          {STEPS.map((s, i) => (
            <button 
              key={s.k} 
              onClick={() => step > i && setStep(i)} 
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-500 ${
                step === i ? 'bg-brand-violet/20 border-brand-violet/40 text-white shadow-[0_0_20px_rgba(124,58,237,0.1)]' :
                step > i ? 'bg-white/5 border-white/10 text-brand-glow' :
                'bg-white/2 border-white/5 text-text-muted/40 cursor-not-allowed'
              }`}
              style={{ border: '1px solid' }}
            >
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[0.65rem] font-black shrink-0 ${
                step === i ? 'bg-brand-violet text-white' : step > i ? 'bg-brand-violet/20 text-brand-glow' : 'bg-white/5'
              }`}>
                {step > i ? <IconCheck /> : s.n}
              </span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-16 items-start builder-reveal">
          {/* LEFT — Selection */}
          <div className="min-h-[450px] p-8 md:p-10 rounded-[2.5rem] bg-white/[0.015] border border-white/[0.05] backdrop-blur-sm">
            {step === 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Qual o tamanho da sua sede?</h3>
                <p className="text-sm text-text-muted mb-8">Escolha a opção que melhor te atende hoje.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {SIZES.map(s => (
                    <div 
                      key={s.id} 
                      onClick={() => setSize(s)} 
                      className={`group relative overflow-hidden p-8 rounded-3xl cursor-pointer transition-all duration-500 border ${
                        size.id === s.id ? 'bg-brand-violet/10 border-brand-violet/40 ring-1 ring-brand-violet/20' : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      <div className="relative z-10">
                        <div className="text-3xl font-black text-white mb-2">{s.label}</div>
                        <div className={`text-xl font-bold ${size.id === s.id ? 'text-brand-glow' : 'text-text-muted'}`}>R$ {s.price.toFixed(2)}</div>
                      </div>
                      <div className={`absolute bottom-6 right-6 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${size.id === s.id ? 'bg-brand-violet text-white scale-110' : 'bg-white/5 text-transparent scale-75'}`}>
                        <IconCheck />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Escolha o seu Açaí</h3>
                <p className="text-sm text-text-muted mb-8">Base de alta qualidade para o seu mix.</p>
                <div className="grid grid-cols-1 gap-4">
                  {BASES.map(b => (
                    <button 
                      key={b} 
                      onClick={() => setBase(b)} 
                      className={`flex items-center gap-4 p-6 rounded-2xl text-left font-bold transition-all duration-300 border ${
                        base === b ? 'bg-brand-violet/10 border-brand-violet/40 text-white' : 'bg-white/[0.02] border-white/[0.08] text-text-muted hover:text-white'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${base === b ? 'bg-brand-violet border-brand-violet' : 'border-white/10'}`}>
                        {base === b && <IconCheck />}
                      </div>
                      <span className="text-lg">{b}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-white mb-1 tracking-tight">Acompanhamentos</h3>
                    <p className="text-sm text-text-muted">Você tem direito a 3 itens grátis.</p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${accompaniments.length === 3 ? 'bg-brand-glow/20 text-brand-glow' : 'bg-white/5 text-text-muted'}`}>
                    {accompaniments.length} / 3 Selecionados
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ACCOMPANIMENTS.map(t => {
                    const sel = accompaniments.includes(t);
                    const disabled = !sel && accompaniments.length >= 3;
                    return (
                      <button 
                        key={t} 
                        onClick={() => togAccompaniment(t)} 
                        disabled={disabled}
                        className={`flex items-center justify-between p-4 rounded-xl text-sm font-bold transition-all duration-300 border ${
                          sel ? 'bg-brand-violet/15 border-brand-violet/40 text-white shadow-lg' : 
                          disabled ? 'opacity-30 grayscale cursor-not-allowed border-transparent' : 'bg-white/[0.02] border-white/[0.06] text-text-muted hover:bg-white/[0.05]'
                        }`}
                      >
                        {t}
                        {sel && <IconCheck />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Deseja adicionar algo mais?</h3>
                <p className="text-sm text-text-muted mb-8">Itens premium para deixar seu açaí ainda melhor.</p>
                <div className="grid grid-cols-1 gap-4">
                  {PAID_EXTRAS.map(e => {
                    const sel = extras.some(x => x.id === e.id);
                    return (
                      <button 
                        key={e.id} 
                        onClick={() => togExtra(e)} 
                        className={`flex items-center gap-5 p-6 rounded-2xl text-left font-bold transition-all duration-300 border ${
                          sel ? 'bg-brand-violet/10 border-brand-violet/40 text-white' : 'bg-white/[0.02] border-white/[0.08] text-text-muted hover:text-white'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${sel ? 'bg-brand-violet border-brand-violet shadow-[0_0_10px_rgba(124,58,237,0.5)]' : 'border-white/10'}`}>
                          {sel && <IconCheck />}
                        </div>
                        <div className="flex-1">
                          <div className="text-lg">{e.label}</div>
                          <div className={`text-sm ${sel ? 'text-brand-glow' : 'text-text-muted'}`}>+ R$ {e.price.toFixed(2)}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Quase lá!</h3>
                <p className="text-sm text-text-muted mb-10">Como você prefere receber seu pedido?</p>
                
                <div className="grid grid-cols-2 gap-4 mb-10">
                  {([
                    { v: 'entrega' as const, icon: <IconTruck />, label: 'Entrega', sub: 'No seu endereço' },
                    { v: 'retirada' as const, icon: <IconStore />, label: 'Retirada', sub: 'Na nossa loja' }
                  ]).map(o => (
                    <div 
                      key={o.v} 
                      onClick={() => setDelivery(o.v)} 
                      className={`relative p-8 rounded-3xl cursor-pointer text-center flex flex-col items-center gap-3 transition-all duration-500 border ${
                        delivery === o.v ? 'bg-brand-violet/10 border-brand-violet/40 ring-1 ring-brand-violet/20' : 'bg-white/[0.02] border-white/[0.08]'
                      }`}
                    >
                      <div className={`transition-transform duration-500 ${delivery === o.v ? 'text-brand-glow scale-110' : 'text-white/20'}`}>{o.icon}</div>
                      <div className="font-black text-white uppercase tracking-wider text-sm">{o.label}</div>
                      <div className="text-[0.65rem] text-text-muted font-bold opacity-60 uppercase">{o.sub}</div>
                    </div>
                  ))}
                </div>

                {delivery === 'entrega' && (
                  <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
                    <label className="block text-[0.65rem] font-black tracking-widest uppercase text-brand-glow mb-3">Endereço Completo</label>
                    <input 
                      type="text"
                      value={address} 
                      onChange={e => setAddress(e.target.value)} 
                      placeholder="Rua, Número, Bairro e Referência" 
                      className="w-full px-6 py-5 rounded-2xl bg-white/[0.03] border border-white/[0.1] text-white text-sm outline-none focus:border-brand-violet/50 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[0.65rem] font-black tracking-widest uppercase text-text-muted mb-3">Alguma Observação?</label>
                  <textarea 
                    value={notes} 
                    onChange={e => setNotes(e.target.value)} 
                    placeholder="Ex: Sem muito gelo, mandar troco para 50..." 
                    rows={3} 
                    className="w-full px-6 py-5 rounded-2xl bg-white/[0.03] border border-white/[0.1] text-white text-sm outline-none focus:border-brand-violet/50 focus:bg-white/[0.05] transition-all"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-12 pt-8 border-t border-white/5">
              {step > 0 ? (
                <button 
                  onClick={() => setStep(p => p - 1)} 
                  className="flex items-center gap-2 text-white/50 hover:text-white font-bold text-sm transition-colors"
                >
                  <IconChevronLeft /> Voltar
                </button>
              ) : <div></div>}
              
              {step < 4 ? (
                <button 
                  onClick={() => setStep(p => p + 1)} 
                  className="btn-primary !px-10 !py-4 rounded-2xl group shadow-[0_10px_30px_rgba(124,58,237,0.2)]"
                >
                  Próximo <IconChevronRight />
                </button>
              ) : (
                <button 
                  onClick={submit} 
                  className="btn-primary !px-10 !py-5 rounded-2xl !bg-[#25D366] !border-[#25D366] !text-white !font-black !text-lg shadow-[0_15px_40px_rgba(37,211,102,0.3)] hover:scale-105 active:scale-95 transition-all"
                >
                  <IconWhatsApp /> Finalizar no WhatsApp
                </button>
              )}
            </div>
          </div>

          {/* RIGHT — Summary Sticky */}
          <div className="hidden lg:block sticky top-32">
            <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.06] backdrop-blur-md shadow-2xl">
              <h4 className="text-xl font-black text-white tracking-tight mb-8 border-b border-white/5 pb-4">Resumo do Pedido</h4>
              
              <div className="space-y-6">
                <SummaryRow label="Tamanho" value={size.label} price={`R$ ${size.price.toFixed(2)}`} />
                <SummaryRow label="Sabor" value={base} />
                
                {accompaniments.length > 0 && (
                  <div>
                    <span className="text-[0.65rem] font-black tracking-widest uppercase text-text-muted mb-3 block">Acompanhamentos (Grátis)</span>
                    <div className="flex flex-wrap gap-2">
                      {accompaniments.map(t => (
                        <span key={t} className="px-4 py-2 rounded-xl text-[0.7rem] font-bold text-white bg-brand-violet/10 border border-brand-violet/20">{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                {extras.length > 0 && (
                  <div>
                    <span className="text-[0.65rem] font-black tracking-widest uppercase text-text-muted mb-3 block">Adicionais Pagos</span>
                    <div className="space-y-2">
                      {extras.map(e => (
                        <div key={e.id} className="flex justify-between items-center text-sm">
                          <span className="text-white/80 font-bold">{e.label}</span>
                          <span className="text-brand-glow font-black">+ R$ {e.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-10 pt-8 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-[0.7rem] font-black tracking-widest uppercase text-text-muted">Total Final</span>
                  <div className="text-right">
                    <div className="text-3xl font-black text-white tracking-tighter">R$ <span className="text-brand-glow">{total.toFixed(2)}</span></div>
                    <div className="text-[0.6rem] text-text-muted font-bold uppercase mt-1">Pague na Entrega/Retirada</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
        <div className="p-1 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          <button 
            onClick={step === 4 ? submit : () => setStep(p => p + 1)} 
            className={`w-full flex items-center justify-between px-8 py-5 rounded-[1.8rem] transition-all duration-500 ${
              step === 4 ? 'bg-[#25D366] text-white' : 'bg-brand-violet text-white'
            }`}
          >
            <div className="flex flex-col items-start gap-0">
              <span className="text-[0.6rem] font-black uppercase opacity-70 tracking-widest">Total</span>
              <span className="text-2xl font-black">R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 font-black uppercase tracking-widest text-sm">
              {step === 4 ? 'Finalizar' : 'Próximo'}
              <IconChevronRight />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}

function SummaryRow({ label, value, price }: { label: string; value: string; price?: string }) {
  return (
    <div className="flex justify-between items-start">
      <div className="flex flex-col gap-1">
        <span className="text-[0.65rem] font-black tracking-widest uppercase text-text-muted">{label}</span>
        <span className="text-white font-black text-lg leading-none">{value}</span>
      </div>
      {price && <span className="text-brand-glow font-black text-sm">{price}</span>}
    </div>
  );
}
