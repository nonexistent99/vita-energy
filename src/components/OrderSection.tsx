import { useState, useMemo } from 'react';
import { openWhatsApp } from '../utils/config';

/* ============================================
   DATA
   ============================================ */
interface Size { id: string; label: string; ml: string; price: number; }
interface Extra { id: string; label: string; price: number; emoji: string; }

const SIZES: Size[] = [
  { id: '300', label: 'Pequeno', ml: '300ml', price: 16.9 },
  { id: '500', label: 'Grande', ml: '500ml', price: 21.9 },
];

const BASES = ['Açaí Tradicional', 'Açaí Zero'];

const ACCOMPANIMENTS = [
  { name: 'Leite em Pó', emoji: '🥛' },
  { name: 'Amendoim', emoji: '🥜' },
  { name: 'Granola', emoji: '🌾' },
  { name: 'Leite Condensado', emoji: '🍯' },
  { name: 'Oreo', emoji: '🍪' },
  { name: 'Ovomaltine', emoji: '🍫' },
  { name: 'Mel', emoji: '🍯' },
  { name: 'Banana', emoji: '🍌' },
  { name: 'Morango', emoji: '🍓' },
  { name: 'Abacaxi', emoji: '🍍' },
  { name: 'Manga', emoji: '🥭' },
  { name: 'Mousse de Maracujá', emoji: '💛' },
  { name: 'Mousse de Morango', emoji: '💗' },
];

const PAID_EXTRAS: Extra[] = [
  { id: 'nutella', label: 'Nutella', price: 2.5, emoji: '🍫' },
  { id: 'whey', label: 'Whey Protein', price: 3.5, emoji: '💪' },
];

/* ============================================
   COMPONENT
   ============================================ */
export default function OrderSection() {
  const [size, setSize] = useState<Size | null>(null);
  const [base, setBase] = useState<string | null>(null);
  const [accompaniments, setAccompaniments] = useState<string[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [notes, setNotes] = useState('');
  const [delivery, setDelivery] = useState<'retirada' | 'entrega' | null>(null);
  const [address, setAddress] = useState('');

  const total = useMemo(() => {
    let t = size ? size.price : 0;
    extras.forEach(e => t += e.price);
    return t;
  }, [size, extras]);

  const toggleAccompaniment = (name: string) => {
    setAccompaniments(prev => {
      if (prev.includes(name)) return prev.filter(x => x !== name);
      if (prev.length >= 3) return prev;
      return [...prev, name];
    });
  };

  const toggleExtra = (e: Extra) => {
    setExtras(prev => prev.some(x => x.id === e.id) ? prev.filter(x => x.id !== e.id) : [...prev, e]);
  };

  const isFormValid = size !== null && base !== null && delivery !== null && (delivery === 'entrega' ? address.trim().length > 0 : true);

  const submit = () => {
    if (!size || !base || !delivery) {
      alert('Por favor, preencha todos os campos obrigatórios (Tamanho, Sabor e Entrega).');
      return;
    }
    if (delivery === 'entrega' && !address.trim()) {
      alert('Por favor, informe seu endereço para entrega.');
      return;
    }
    openWhatsApp({
      size: size.label + ' (' + size.ml + ')',
      base,
      accompaniments,
      extras: extras.map(e => e.label),
      notes,
      deliveryType: delivery === 'entrega' ? 'Entrega' : 'Retirada no local',
      address: delivery === 'entrega' ? address : undefined,
      total,
    });
  };

  return (
    <section id="pedido" className="relative py-16 md:py-24" style={{ background: 'linear-gradient(180deg, #0f071a 0%, #1a0533 50%, #0f071a 100%)' }}>
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] max-w-[800px] max-h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <div className="max-w-3xl mx-auto px-5 md:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10" style={{ animation: 'fadeInUp 0.6s ease-out both' }}>
          <div className="section-label justify-center">Faça Seu Pedido</div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-3">
            Monte o seu <span className="text-brand-glow">Vita Energy</span>
          </h2>
          <p className="text-text-muted text-sm md:text-base max-w-md mx-auto">
            Escolha tudo que quiser abaixo e envie pelo WhatsApp. Simples assim! ✨
          </p>
        </div>

        {/* === STEP 1: SIZE === */}
        <OrderBlock number="1" title="Escolha o tamanho" subtitle="Obrigatório" delay="0.1s">
          <div className="grid grid-cols-2 gap-3">
            {SIZES.map(s => {
              const isSelected = size?.id === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSize(s)}
                  className={`relative p-5 md:p-6 rounded-2xl text-left transition-all duration-300 border-2 ${
                    isSelected
                      ? 'border-brand-violet bg-brand-violet/15 shadow-lg'
                      : 'border-white/8 bg-white/3 hover:border-white/20'
                  }`}
                  style={isSelected ? { boxShadow: '0 0 25px rgba(124,58,237,0.15)' } : {}}
                >
                  <div className="text-2xl md:text-3xl font-black text-white">{s.ml}</div>
                  <div className="text-sm text-text-muted font-semibold mt-1">{s.label}</div>
                  <div className={`text-lg font-black mt-2 ${isSelected ? 'text-brand-glow' : 'text-text-soft'}`}>
                    R$ {s.price.toFixed(2)}
                  </div>
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-brand-violet flex items-center justify-center">
                      <CheckIcon />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </OrderBlock>

        {/* === STEP 2: BASE === */}
        <OrderBlock number="2" title="Sabor do Açaí" subtitle="Obrigatório" delay="0.15s">
          <div className="grid grid-cols-1 gap-3">
            {BASES.map(b => {
              const isSelected = base === b;
              return (
                <button
                  key={b}
                  onClick={() => setBase(b)}
                  className={`flex items-center gap-4 p-4 md:p-5 rounded-xl text-left font-bold transition-all duration-300 border-2 ${
                    isSelected
                      ? 'border-brand-violet bg-brand-violet/15 text-white'
                      : 'border-white/8 bg-white/3 text-text-muted hover:text-white hover:border-white/15'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? 'bg-brand-violet border-brand-violet' : 'border-white/20'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className="text-base">{b === 'Açaí Tradicional' ? '🟣' : '⚪'} {b}</span>
                </button>
              );
            })}
          </div>
        </OrderBlock>

        {/* === STEP 3: ACCOMPANIMENTS === */}
        <OrderBlock number="3" title="Acompanhamentos" subtitle="Escolha até 3 (grátis!)" delay="0.2s">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
              accompaniments.length === 3
                ? 'bg-brand-glow/20 text-brand-glow'
                : 'bg-white/5 text-text-muted'
            }`}>
              {accompaniments.length}/3 selecionados
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ACCOMPANIMENTS.map(({ name, emoji }) => {
              const sel = accompaniments.includes(name);
              const disabled = !sel && accompaniments.length >= 3;
              return (
                <button
                  key={name}
                  onClick={() => toggleAccompaniment(name)}
                  disabled={disabled}
                  className={`flex items-center gap-2 p-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                    sel
                      ? 'border-brand-violet bg-brand-violet/15 text-white'
                      : disabled
                        ? 'opacity-30 cursor-not-allowed border-transparent bg-white/2'
                        : 'border-white/6 bg-white/3 text-text-muted hover:bg-white/6 hover:text-white'
                  }`}
                >
                  <span className="text-base">{emoji}</span>
                  <span className="truncate text-xs sm:text-sm">{name}</span>
                  {sel && <CheckIcon />}
                </button>
              );
            })}
          </div>
        </OrderBlock>

        {/* === STEP 4: EXTRAS === */}
        <OrderBlock number="4" title="Adicionais" subtitle="Opcional" delay="0.25s">
          <div className="grid grid-cols-1 gap-3">
            {PAID_EXTRAS.map(e => {
              const sel = extras.some(x => x.id === e.id);
              return (
                <button
                  key={e.id}
                  onClick={() => toggleExtra(e)}
                  className={`flex items-center gap-4 p-4 md:p-5 rounded-xl text-left font-bold transition-all duration-300 border-2 ${
                    sel
                      ? 'border-brand-violet bg-brand-violet/15 text-white'
                      : 'border-white/8 bg-white/3 text-text-muted hover:text-white hover:border-white/15'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                    sel ? 'bg-brand-violet border-brand-violet' : 'border-white/15'
                  }`}>
                    {sel && <CheckIcon />}
                  </div>
                  <span className="text-lg">{e.emoji}</span>
                  <div className="flex-1">
                    <div className="text-base">{e.label}</div>
                  </div>
                  <div className={`text-sm font-black ${sel ? 'text-brand-glow' : 'text-text-muted'}`}>
                    + R$ {e.price.toFixed(2)}
                  </div>
                </button>
              );
            })}
          </div>
        </OrderBlock>

        {/* === STEP 5: DELIVERY === */}
        <OrderBlock number="5" title="Como receber?" subtitle="Obrigatório" delay="0.3s">
          <div className="grid grid-cols-2 gap-3 mb-4">
            {([
              { v: 'entrega' as const, icon: '🏍️', label: 'Entrega', sub: 'No seu endereço' },
              { v: 'retirada' as const, icon: '🏪', label: 'Retirada', sub: 'Na loja' },
            ]).map(o => {
              const isSelected = delivery === o.v;
              return (
                <button
                  key={o.v}
                  onClick={() => setDelivery(o.v)}
                  className={`p-5 rounded-2xl text-center transition-all duration-300 border-2 ${
                    isSelected
                      ? 'border-brand-violet bg-brand-violet/15'
                      : 'border-white/8 bg-white/3 hover:border-white/15'
                  }`}
                >
                  <div className="text-2xl mb-2">{o.icon}</div>
                  <div className="font-black text-white text-sm">{o.label}</div>
                  <div className="text-[0.65rem] text-text-muted mt-1">{o.sub}</div>
                </button>
              );
            })}
          </div>

          {delivery === 'entrega' && (
            <div className="mt-4" style={{ animation: 'fadeInUp 0.3s ease-out both' }}>
              <label className="block text-xs font-bold text-brand-glow mb-2 uppercase tracking-wider">📍 Endereço Completo</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Rua, Número, Bairro e Referência"
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-brand-violet/50 transition-all placeholder:text-white/20"
              />
            </div>
          )}

          <div className="mt-4">
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">📝 Alguma observação?</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex: Sem muito gelo, mandar troco para 50..."
              rows={2}
              className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-brand-violet/50 transition-all resize-none placeholder:text-white/20"
            />
          </div>
        </OrderBlock>

        {/* === TOTAL + SUBMIT === */}
        <div className="mt-8 p-6 md:p-8 rounded-3xl text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(168,85,247,0.08))',
            border: '1px solid rgba(124,58,237,0.2)',
            animation: 'fadeInUp 0.6s ease-out both',
            animationDelay: '0.35s'
          }}>
          
          {/* Summary mini */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4 text-xs text-text-muted">
            {size && <span className="px-2 py-1 rounded-lg bg-white/5 font-bold">{size.ml}</span>}
            {base && <span className="px-2 py-1 rounded-lg bg-white/5 font-bold">{base}</span>}
            {accompaniments.map(a => (
              <span key={a} className="px-2 py-1 rounded-lg bg-brand-violet/15 text-brand-glow font-bold">{a}</span>
            ))}
            {extras.map(e => (
              <span key={e.id} className="px-2 py-1 rounded-lg bg-brand-violet/15 text-brand-glow font-bold">{e.label}</span>
            ))}
          </div>

          <div className="text-sm text-text-muted font-bold uppercase tracking-widest mb-1">Total</div>
          <div className="text-4xl md:text-5xl font-black text-white mb-6">
            R$ <span className="text-brand-glow">{total.toFixed(2)}</span>
          </div>

          <button 
            onClick={submit} 
            disabled={!isFormValid}
            className={`w-full sm:w-auto text-lg transition-all duration-300 ${isFormValid ? 'btn-whatsapp' : 'inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold bg-white/10 text-white/50 cursor-not-allowed border-none'}`}
          >
            <WhatsAppIcon />
            {isFormValid ? 'Enviar Pedido pelo WhatsApp' : 'Preencha os campos para pedir'}
          </button>

          <p className="text-xs text-text-muted mt-4 opacity-50">
            💳 Pagamento na entrega · Pix, cartão ou dinheiro
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   SUB-COMPONENTS
   ============================================ */
function OrderBlock({ number, title, subtitle, delay, children }: {
  number: string;
  title: string;
  subtitle?: string;
  delay: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6" style={{ animation: 'fadeInUp 0.6s ease-out both', animationDelay: delay }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl bg-brand-violet/20 flex items-center justify-center text-sm font-black text-brand-glow shrink-0">
          {number}
        </div>
        <div>
          <h3 className="text-lg font-black text-white leading-tight">{title}</h3>
          {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
        </div>
      </div>
      <div className="ml-11">
        {children}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
