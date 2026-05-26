import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { useStoreConfig } from '../hooks/useStoreConfig';
import { openWhatsApp } from '../utils/config';
import { calculateCouponDiscount, findActiveCoupon, formatCurrency } from '../utils/storeConfig';

export default function OrderSection() {
  const { config } = useStoreConfig();
  const [sizeId, setSizeId] = useState<string | null>(null);
  const [baseId, setBaseId] = useState<string | null>(null);
  const [accompanimentIds, setAccompanimentIds] = useState<string[]>([]);
  const [extraIds, setExtraIds] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [notes, setNotes] = useState('');
  const [delivery, setDelivery] = useState<'retirada' | 'entrega' | null>(null);
  const [address, setAddress] = useState('');

  const sizes = useMemo(() => config.sizes.filter((item) => item.active), [config.sizes]);
  const bases = useMemo(() => config.bases.filter((item) => item.active), [config.bases]);
  const accompaniments = useMemo(
    () => config.accompaniments.filter((item) => item.active),
    [config.accompaniments],
  );
  const paidExtras = useMemo(() => config.paidExtras.filter((item) => item.active), [config.paidExtras]);
  const maxAccompaniments = Math.max(0, config.business.freeAccompanimentsLimit);

  const size = sizes.find((item) => item.id === sizeId) ?? null;
  const base = bases.find((item) => item.id === baseId) ?? null;
  const selectedAccompanimentIds = useMemo(
    () => accompanimentIds
      .filter((id) => accompaniments.some((item) => item.id === id))
      .slice(0, maxAccompaniments),
    [accompanimentIds, accompaniments, maxAccompaniments],
  );
  const selectedExtraIds = useMemo(
    () => extraIds.filter((id) => paidExtras.some((item) => item.id === id)),
    [extraIds, paidExtras],
  );
  const selectedAccompaniments = accompaniments.filter((item) => selectedAccompanimentIds.includes(item.id));
  const selectedExtras = paidExtras.filter((item) => selectedExtraIds.includes(item.id));

  const subtotal = useMemo(() => {
    const sizePrice = size ? size.price : 0;
    const extrasPrice = selectedExtras.reduce((sum, item) => sum + item.price, 0);
    return sizePrice + extrasPrice;
  }, [size, selectedExtras]);

  const activeCoupon = useMemo(
    () => findActiveCoupon(config.coupons, couponCode),
    [config.coupons, couponCode],
  );
  const couponDiscount = calculateCouponDiscount(activeCoupon, subtotal);
  const total = Math.max(0, subtotal - couponDiscount);
  const hasCouponCode = couponCode.trim().length > 0;
  const couponMinNotMet = activeCoupon !== null && subtotal < activeCoupon.minOrder;
  const couponError = hasCouponCode && !activeCoupon
    ? 'Cupom não encontrado'
    : couponMinNotMet
      ? `Pedido mínimo de ${formatCurrency(activeCoupon.minOrder)}`
      : '';
  const couponSuccess = activeCoupon && !couponError && couponDiscount > 0
    ? `${activeCoupon.code} aplicado: -${formatCurrency(couponDiscount)}`
    : '';

  const toggleAccompaniment = (id: string) => {
    setAccompanimentIds((current) => {
      const visibleCurrent = current.filter((item) => accompaniments.some((acc) => acc.id === item));
      if (visibleCurrent.includes(id)) return visibleCurrent.filter((item) => item !== id);
      if (visibleCurrent.length >= maxAccompaniments) return visibleCurrent;
      return [...visibleCurrent, id];
    });
  };

  const toggleExtra = (id: string) => {
    setExtraIds(selectedExtraIds.includes(id)
      ? selectedExtraIds.filter((item) => item !== id)
      : [...selectedExtraIds, id]);
  };

  const isFormValid = size !== null
    && base !== null
    && delivery !== null
    && !couponError
    && (delivery === 'entrega' ? address.trim().length > 0 : true);

  const submit = () => {
    if (!size || !base || !delivery) {
      alert('Por favor, preencha todos os campos obrigatórios (Tamanho, Sabor e Entrega).');
      return;
    }
    if (delivery === 'entrega' && !address.trim()) {
      alert('Por favor, informe seu endereço para entrega.');
      return;
    }
    if (couponError) {
      alert(couponError);
      return;
    }

    openWhatsApp({
      size: `${size.label} (${size.ml})`,
      base: base.label,
      accompaniments: selectedAccompaniments.map((item) => item.name),
      extras: selectedExtras.map((item) => item.label),
      couponCode: couponDiscount > 0 ? activeCoupon?.code : undefined,
      couponDiscount,
      notes,
      deliveryType: delivery === 'entrega' ? 'Entrega' : 'Retirada no local',
      address: delivery === 'entrega' ? address : undefined,
      subtotal,
      total,
    }, config.business.whatsappPhone);
  };

  return (
    <section id="pedido" className="relative py-16 md:py-24" style={{ background: 'linear-gradient(180deg, #0f071a 0%, #1a0533 50%, #0f071a 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] max-w-[800px] max-h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <div className="max-w-3xl mx-auto px-5 md:px-8 relative z-10">
        <div className="text-center mb-10" style={{ animation: 'fadeInUp 0.6s ease-out both' }}>
          <div className="section-label justify-center">Faça Seu Pedido</div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-3">
            Monte o seu <span className="text-brand-glow">{config.business.brandName}</span>
          </h2>
          <p className="text-text-muted text-sm md:text-base max-w-md mx-auto">
            Escolha tudo que quiser abaixo e envie pelo WhatsApp. Simples assim! ✨
          </p>
        </div>

        <OrderBlock number="1" title="Escolha o tamanho" subtitle="Obrigatório" delay="0.1s">
          <div className="grid grid-cols-2 gap-3">
            {sizes.map((item) => {
              const isSelected = size?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSizeId(item.id)}
                  className={`relative p-5 md:p-6 rounded-2xl text-left transition-all duration-300 border-2 ${
                    isSelected
                      ? 'border-brand-violet bg-brand-violet/15 shadow-lg'
                      : 'border-white/8 bg-white/3 hover:border-white/20'
                  }`}
                  style={isSelected ? { boxShadow: '0 0 25px rgba(124,58,237,0.15)' } : {}}
                >
                  <div className="text-2xl md:text-3xl font-black text-white">{item.ml}</div>
                  <div className="text-sm text-text-muted font-semibold mt-1">{item.label}</div>
                  <div className={`text-lg font-black mt-2 ${isSelected ? 'text-brand-glow' : 'text-text-soft'}`}>
                    {formatCurrency(item.price)}
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

        <OrderBlock number="2" title="Sabor do Açaí" subtitle="Obrigatório" delay="0.15s">
          <div className="grid grid-cols-1 gap-3">
            {bases.map((item) => {
              const isSelected = base?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setBaseId(item.id)}
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
                  <span className="text-base">{item.emoji} {item.label}</span>
                </button>
              );
            })}
          </div>
        </OrderBlock>

        <OrderBlock number="3" title="Acompanhamentos" subtitle={`Escolha até ${maxAccompaniments} (grátis!)`} delay="0.2s">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
              selectedAccompanimentIds.length === maxAccompaniments
                ? 'bg-brand-glow/20 text-brand-glow'
                : 'bg-white/5 text-text-muted'
            }`}>
              {selectedAccompanimentIds.length}/{maxAccompaniments} selecionados
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {accompaniments.map((item) => {
              const selected = selectedAccompanimentIds.includes(item.id);
              const disabled = !selected && selectedAccompanimentIds.length >= maxAccompaniments;
              return (
                <button
                  key={item.id}
                  onClick={() => toggleAccompaniment(item.id)}
                  disabled={disabled}
                  className={`flex items-center gap-2 p-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                    selected
                      ? 'border-brand-violet bg-brand-violet/15 text-white'
                      : disabled
                        ? 'opacity-30 cursor-not-allowed border-transparent bg-white/2'
                        : 'border-white/6 bg-white/3 text-text-muted hover:bg-white/6 hover:text-white'
                  }`}
                >
                  <span className="text-base">{item.emoji}</span>
                  <span className="truncate text-xs sm:text-sm">{item.name}</span>
                  {selected && <CheckIcon />}
                </button>
              );
            })}
          </div>
        </OrderBlock>

        <OrderBlock number="4" title="Adicionais" subtitle="Opcional" delay="0.25s">
          <div className="grid grid-cols-1 gap-3">
            {paidExtras.map((item) => {
              const selected = selectedExtraIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleExtra(item.id)}
                  className={`flex items-center gap-4 p-4 md:p-5 rounded-xl text-left font-bold transition-all duration-300 border-2 ${
                    selected
                      ? 'border-brand-violet bg-brand-violet/15 text-white'
                      : 'border-white/8 bg-white/3 text-text-muted hover:text-white hover:border-white/15'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                    selected ? 'bg-brand-violet border-brand-violet' : 'border-white/15'
                  }`}>
                    {selected && <CheckIcon />}
                  </div>
                  <span className="text-lg">{item.emoji}</span>
                  <div className="flex-1">
                    <div className="text-base">{item.label}</div>
                  </div>
                  <div className={`text-sm font-black ${selected ? 'text-brand-glow' : 'text-text-muted'}`}>
                    + {formatCurrency(item.price)}
                  </div>
                </button>
              );
            })}
          </div>
        </OrderBlock>

        <OrderBlock number="5" title="Como receber?" subtitle="Obrigatório" delay="0.3s">
          <div className="grid grid-cols-2 gap-3 mb-4">
            {([
              { value: 'entrega' as const, icon: '🏍️', label: 'Entrega', sub: 'No seu endereço' },
              { value: 'retirada' as const, icon: '🏪', label: 'Retirada', sub: 'Na loja' },
            ]).map((option) => {
              const isSelected = delivery === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setDelivery(option.value)}
                  className={`p-5 rounded-2xl text-center transition-all duration-300 border-2 ${
                    isSelected
                      ? 'border-brand-violet bg-brand-violet/15'
                      : 'border-white/8 bg-white/3 hover:border-white/15'
                  }`}
                >
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className="font-black text-white text-sm">{option.label}</div>
                  <div className="text-[0.65rem] text-text-muted mt-1">{option.sub}</div>
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
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Rua, Número, Bairro e Referência"
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-brand-violet/50 transition-all placeholder:text-white/20"
              />
            </div>
          )}

          <div className="mt-4">
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">📝 Alguma observação?</label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Ex: Sem muito gelo, mandar troco para 50..."
              rows={2}
              className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-brand-violet/50 transition-all resize-none placeholder:text-white/20"
            />
          </div>
        </OrderBlock>

        <div className="mt-8 p-6 md:p-8 rounded-3xl text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(168,85,247,0.08))',
            border: '1px solid rgba(124,58,237,0.2)',
            animation: 'fadeInUp 0.6s ease-out both',
            animationDelay: '0.35s',
          }}>
          <div className="mb-5 text-left">
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Cupom</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                placeholder="Digite seu cupom"
                className="flex-1 px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-brand-violet/50 transition-all placeholder:text-white/20 uppercase"
              />
              {hasCouponCode && (
                <button
                  type="button"
                  onClick={() => setCouponCode('')}
                  className="px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm font-bold hover:text-white hover:bg-white/10 transition-all"
                >
                  Limpar
                </button>
              )}
            </div>
            {couponError && <p className="text-xs text-red-300 mt-2 font-bold">{couponError}</p>}
            {couponSuccess && <p className="text-xs text-brand-glow mt-2 font-bold">{couponSuccess}</p>}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-4 text-xs text-text-muted">
            {size && <span className="px-2 py-1 rounded-lg bg-white/5 font-bold">{size.ml}</span>}
            {base && <span className="px-2 py-1 rounded-lg bg-white/5 font-bold">{base.label}</span>}
            {selectedAccompaniments.map((item) => (
              <span key={item.id} className="px-2 py-1 rounded-lg bg-brand-violet/15 text-brand-glow font-bold">{item.name}</span>
            ))}
            {selectedExtras.map((item) => (
              <span key={item.id} className="px-2 py-1 rounded-lg bg-brand-violet/15 text-brand-glow font-bold">{item.label}</span>
            ))}
          </div>

          {couponDiscount > 0 && (
            <div className="flex items-center justify-center gap-3 text-sm font-bold text-text-muted mb-2">
              <span>Subtotal {formatCurrency(subtotal)}</span>
              <span className="text-brand-glow">Desconto -{formatCurrency(couponDiscount)}</span>
            </div>
          )}

          <div className="text-sm text-text-muted font-bold uppercase tracking-widest mb-1">Total</div>
          <div className="text-4xl md:text-5xl font-black text-white mb-6">
            <span className="text-brand-glow">{formatCurrency(total)}</span>
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

function OrderBlock({ number, title, subtitle, delay, children }: {
  number: string;
  title: string;
  subtitle?: string;
  delay: string;
  children: ReactNode;
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
