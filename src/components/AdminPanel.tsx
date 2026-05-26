import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  Check,
  Image,
  LogOut,
  Package,
  Plus,
  RotateCcw,
  Save,
  Store,
  TicketPercent,
  Trash2,
} from 'lucide-react';
import { useStoreConfig } from '../hooks/useStoreConfig';
import {
  formatCurrency,
  makeId,
  normalizeStoreConfig,
  type Accompaniment,
  type Coupon,
  type DiscountType,
  type PaidExtra,
  type ProductBase,
  type ProductSize,
  type PromotionBanner,
  type StoreConfig,
} from '../utils/storeConfig';

type AdminTab = 'products' | 'coupons' | 'banners' | 'business';

interface AdminPanelProps {
  onLogout: () => void;
}

const TABS: Array<{ id: AdminTab; label: string; icon: LucideIcon }> = [
  { id: 'products', label: 'Produtos', icon: Package },
  { id: 'coupons', label: 'Cupons', icon: TicketPercent },
  { id: 'banners', label: 'Banners', icon: Image },
  { id: 'business', label: 'Loja', icon: Store },
];

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const { config, setConfig, resetConfig } = useStoreConfig();
  const [draft, setDraft] = useState<StoreConfig>(config);
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(config);
  }, [config]);

  const isDirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(config), [draft, config]);
  const activeCounts = useMemo(() => ({
    sizes: draft.sizes.filter((item) => item.active).length,
    bases: draft.bases.filter((item) => item.active).length,
    accompaniments: draft.accompaniments.filter((item) => item.active).length,
    extras: draft.paidExtras.filter((item) => item.active).length,
    coupons: draft.coupons.filter((item) => item.active).length,
    banners: draft.banners.filter((item) => item.active).length,
  }), [draft]);

  const saveChanges = () => {
    setConfig(normalizeStoreConfig(draft));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const restoreDefaults = () => {
    if (window.confirm('Restaurar a configuração padrão da loja?')) {
      resetConfig();
      setSaved(false);
    }
  };

  const logout = () => {
    onLogout();
  };

  const openStorefront = () => {
    if (window.location.pathname === '/admin') {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateBusiness = (patch: Partial<StoreConfig['business']>) => {
    setDraft((current) => ({
      ...current,
      business: { ...current.business, ...patch },
    }));
  };

  const updateSize = (id: string, patch: Partial<ProductSize>) => {
    setDraft((current) => ({
      ...current,
      sizes: current.sizes.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const updateBase = (id: string, patch: Partial<ProductBase>) => {
    setDraft((current) => ({
      ...current,
      bases: current.bases.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const updateAccompaniment = (id: string, patch: Partial<Accompaniment>) => {
    setDraft((current) => ({
      ...current,
      accompaniments: current.accompaniments.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const updateExtra = (id: string, patch: Partial<PaidExtra>) => {
    setDraft((current) => ({
      ...current,
      paidExtras: current.paidExtras.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const updateCoupon = (id: string, patch: Partial<Coupon>) => {
    setDraft((current) => ({
      ...current,
      coupons: current.coupons.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const updateBanner = (id: string, patch: Partial<PromotionBanner>) => {
    setDraft((current) => ({
      ...current,
      banners: current.banners.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const addSize = () => {
    setDraft((current) => ({
      ...current,
      sizes: [...current.sizes, { id: makeId('size'), label: 'Novo tamanho', ml: '400ml', price: 19.9, active: true }],
    }));
  };

  const addBase = () => {
    setDraft((current) => ({
      ...current,
      bases: [...current.bases, { id: makeId('base'), label: 'Novo sabor', emoji: '🟣', active: true }],
    }));
  };

  const addAccompaniment = () => {
    setDraft((current) => ({
      ...current,
      accompaniments: [...current.accompaniments, { id: makeId('acc'), name: 'Novo acompanhamento', emoji: '✨', active: true }],
    }));
  };

  const addExtra = () => {
    setDraft((current) => ({
      ...current,
      paidExtras: [...current.paidExtras, { id: makeId('extra'), label: 'Novo adicional', emoji: '➕', price: 2, active: true }],
    }));
  };

  const addCoupon = () => {
    setDraft((current) => ({
      ...current,
      coupons: [
        ...current.coupons,
        {
          id: makeId('coupon'),
          code: 'PROMO',
          description: 'Novo cupom',
          type: 'percent',
          value: 10,
          minOrder: 0,
          active: true,
        },
      ],
    }));
  };

  const addBanner = () => {
    setDraft((current) => ({
      ...current,
      banners: [
        ...current.banners,
        {
          id: makeId('banner'),
          badge: 'Nova promoção',
          title: 'Título da promoção',
          description: 'Descrição curta da promoção.',
          ctaLabel: 'Ver pedido',
          targetId: 'pedido',
          active: true,
        },
      ],
    }));
  };

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-[#151423]">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openStorefront}
              className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-all"
              aria-label="Voltar para vitrine"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] font-black text-violet-700">Painel admin</p>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">{draft.business.brandName}</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {saved && (
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-bold">
                <Check size={16} />
                Salvo
              </span>
            )}
            <button
              type="button"
              onClick={restoreDefaults}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-bold hover:bg-slate-100 transition-all"
            >
              <RotateCcw size={16} />
              Restaurar
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-bold hover:bg-slate-100 transition-all"
            >
              <LogOut size={16} />
              Sair
            </button>
            <button
              type="button"
              onClick={saveChanges}
              disabled={!isDirty}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-black transition-all ${
                isDirty
                  ? 'bg-violet-700 text-white hover:bg-violet-800'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Save size={16} />
              Salvar alterações
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 grid lg:grid-cols-[220px_1fr] gap-6">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav className="grid gap-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-black transition-all ${
                    selected
                      ? 'bg-[#151423] text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="grid gap-5">
          {activeTab === 'products' && (
            <>
              <div className="grid md:grid-cols-4 gap-3">
                <Metric label="Tamanhos ativos" value={activeCounts.sizes} />
                <Metric label="Sabores ativos" value={activeCounts.bases} />
                <Metric label="Acomp. ativos" value={activeCounts.accompaniments} />
                <Metric label="Extras ativos" value={activeCounts.extras} />
              </div>

              <AdminSection title="Tamanhos" actionLabel="Adicionar tamanho" onAction={addSize}>
                <div className="grid gap-3">
                  {draft.sizes.map((item) => (
                    <PanelRow key={item.id}>
                      <TextField label="Nome" value={item.label} onChange={(value) => updateSize(item.id, { label: value })} />
                      <TextField label="Volume" value={item.ml} onChange={(value) => updateSize(item.id, { ml: value })} />
                      <NumberField label="Preço" value={item.price} onChange={(value) => updateSize(item.id, { price: value })} />
                      <RowActions
                        active={item.active}
                        onToggle={() => updateSize(item.id, { active: !item.active })}
                        onDelete={() => setDraft((current) => ({ ...current, sizes: current.sizes.filter((size) => size.id !== item.id) }))}
                      />
                    </PanelRow>
                  ))}
                </div>
              </AdminSection>

              <AdminSection title="Sabores" actionLabel="Adicionar sabor" onAction={addBase}>
                <div className="grid gap-3">
                  {draft.bases.map((item) => (
                    <PanelRow key={item.id}>
                      <TextField label="Emoji" value={item.emoji} onChange={(value) => updateBase(item.id, { emoji: value })} />
                      <TextField label="Nome" value={item.label} onChange={(value) => updateBase(item.id, { label: value })} wide />
                      <RowActions
                        active={item.active}
                        onToggle={() => updateBase(item.id, { active: !item.active })}
                        onDelete={() => setDraft((current) => ({ ...current, bases: current.bases.filter((base) => base.id !== item.id) }))}
                      />
                    </PanelRow>
                  ))}
                </div>
              </AdminSection>

              <AdminSection title="Acompanhamentos grátis" actionLabel="Adicionar acompanhamento" onAction={addAccompaniment}>
                <div className="grid gap-3">
                  {draft.accompaniments.map((item) => (
                    <PanelRow key={item.id}>
                      <TextField label="Emoji" value={item.emoji} onChange={(value) => updateAccompaniment(item.id, { emoji: value })} />
                      <TextField label="Nome" value={item.name} onChange={(value) => updateAccompaniment(item.id, { name: value })} wide />
                      <RowActions
                        active={item.active}
                        onToggle={() => updateAccompaniment(item.id, { active: !item.active })}
                        onDelete={() => setDraft((current) => ({ ...current, accompaniments: current.accompaniments.filter((acc) => acc.id !== item.id) }))}
                      />
                    </PanelRow>
                  ))}
                </div>
              </AdminSection>

              <AdminSection title="Adicionais pagos" actionLabel="Adicionar adicional" onAction={addExtra}>
                <div className="grid gap-3">
                  {draft.paidExtras.map((item) => (
                    <PanelRow key={item.id}>
                      <TextField label="Emoji" value={item.emoji} onChange={(value) => updateExtra(item.id, { emoji: value })} />
                      <TextField label="Nome" value={item.label} onChange={(value) => updateExtra(item.id, { label: value })} />
                      <NumberField label="Preço" value={item.price} onChange={(value) => updateExtra(item.id, { price: value })} />
                      <RowActions
                        active={item.active}
                        onToggle={() => updateExtra(item.id, { active: !item.active })}
                        onDelete={() => setDraft((current) => ({ ...current, paidExtras: current.paidExtras.filter((extra) => extra.id !== item.id) }))}
                      />
                    </PanelRow>
                  ))}
                </div>
              </AdminSection>
            </>
          )}

          {activeTab === 'coupons' && (
            <>
              <div className="grid md:grid-cols-2 gap-3">
                <Metric label="Cupons cadastrados" value={draft.coupons.length} />
                <Metric label="Cupons ativos" value={activeCounts.coupons} />
              </div>

              <AdminSection title="Cupons" actionLabel="Adicionar cupom" onAction={addCoupon}>
                <div className="grid gap-3">
                  {draft.coupons.map((item) => (
                    <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-4 grid gap-3">
                      <div className="grid md:grid-cols-[1fr_1.5fr_130px_120px_140px_auto] gap-3 items-end">
                        <TextField
                          label="Código"
                          value={item.code}
                          onChange={(value) => updateCoupon(item.id, { code: value.toUpperCase() })}
                        />
                        <TextField
                          label="Descrição"
                          value={item.description}
                          onChange={(value) => updateCoupon(item.id, { description: value })}
                        />
                        <SelectField
                          label="Tipo"
                          value={item.type}
                          options={[
                            { value: 'percent', label: '%' },
                            { value: 'fixed', label: 'R$' },
                          ]}
                          onChange={(value) => updateCoupon(item.id, { type: value as DiscountType })}
                        />
                        <NumberField label="Valor" value={item.value} onChange={(value) => updateCoupon(item.id, { value })} />
                        <NumberField label="Pedido mín." value={item.minOrder} onChange={(value) => updateCoupon(item.id, { minOrder: value })} />
                        <RowActions
                          active={item.active}
                          onToggle={() => updateCoupon(item.id, { active: !item.active })}
                          onDelete={() => setDraft((current) => ({ ...current, coupons: current.coupons.filter((coupon) => coupon.id !== item.id) }))}
                        />
                      </div>
                      <div className="text-sm font-bold text-slate-500">
                        Prévia: {item.type === 'percent' ? `${item.value}%` : formatCurrency(item.value)} de desconto
                      </div>
                    </div>
                  ))}
                </div>
              </AdminSection>
            </>
          )}

          {activeTab === 'banners' && (
            <>
              <div className="grid md:grid-cols-2 gap-3">
                <Metric label="Banners cadastrados" value={draft.banners.length} />
                <Metric label="Banners ativos" value={activeCounts.banners} />
              </div>

              <AdminSection title="Banners promocionais" actionLabel="Adicionar banner" onAction={addBanner}>
                <div className="grid gap-3">
                  {draft.banners.map((item) => (
                    <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-4 grid gap-3">
                      <div className="grid md:grid-cols-[1fr_1.5fr_auto] gap-3 items-end">
                        <TextField label="Selo" value={item.badge} onChange={(value) => updateBanner(item.id, { badge: value })} />
                        <TextField label="Título" value={item.title} onChange={(value) => updateBanner(item.id, { title: value })} />
                        <RowActions
                          active={item.active}
                          onToggle={() => updateBanner(item.id, { active: !item.active })}
                          onDelete={() => setDraft((current) => ({ ...current, banners: current.banners.filter((banner) => banner.id !== item.id) }))}
                        />
                      </div>
                      <TextAreaField
                        label="Descrição"
                        value={item.description}
                        onChange={(value) => updateBanner(item.id, { description: value })}
                      />
                      <div className="grid md:grid-cols-2 gap-3">
                        <TextField label="Texto do botão" value={item.ctaLabel} onChange={(value) => updateBanner(item.id, { ctaLabel: value })} />
                        <TextField label="Destino" value={item.targetId} onChange={(value) => updateBanner(item.id, { targetId: value })} />
                      </div>
                    </div>
                  ))}
                </div>
              </AdminSection>
            </>
          )}

          {activeTab === 'business' && (
            <AdminSection title="Dados da loja">
              <div className="grid md:grid-cols-2 gap-4">
                <TextField label="Nome da marca" value={draft.business.brandName} onChange={(value) => updateBusiness({ brandName: value })} />
                <TextField label="WhatsApp" value={draft.business.whatsappPhone} onChange={(value) => updateBusiness({ whatsappPhone: value })} />
                <TextField label="Instagram" value={draft.business.instagramUrl} onChange={(value) => updateBusiness({ instagramUrl: value })} />
                <NumberField
                  label="Limite de acompanhamentos grátis"
                  value={draft.business.freeAccompanimentsLimit}
                  onChange={(value) => updateBusiness({ freeAccompanimentsLimit: Math.max(0, Math.round(value)) })}
                />
              </div>
            </AdminSection>
          )}
        </section>
      </div>
    </main>
  );
}

function AdminSection({ title, actionLabel, onAction, children }: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between mb-4">
        <h2 className="text-lg font-black tracking-tight">{title}</h2>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#151423] text-white text-sm font-black hover:bg-violet-800 transition-all"
          >
            <Plus size={16} />
            {actionLabel}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function PanelRow({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 grid md:grid-cols-[1fr_1fr_120px_auto] gap-3 items-end">
      {children}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-2xl font-black text-[#151423]">{value}</div>
      <div className="text-xs uppercase tracking-[0.14em] text-slate-500 font-black mt-1">{label}</div>
    </div>
  );
}

function TextField({ label, value, onChange, wide = false }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  wide?: boolean;
}) {
  return (
    <label className={`grid gap-1 ${wide ? 'md:col-span-2' : ''}`}>
      <span className="text-xs uppercase tracking-[0.12em] text-slate-500 font-black">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-violet-500"
      />
    </label>
  );
}

function NumberField({ label, value, onChange }: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs uppercase tracking-[0.12em] text-slate-500 font-black">{label}</span>
      <input
        type="number"
        step="0.01"
        min="0"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-violet-500"
      />
    </label>
  );
}

function SelectField({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs uppercase tracking-[0.12em] text-slate-500 font-black">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-violet-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({ label, value, onChange }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs uppercase tracking-[0.12em] text-slate-500 font-black">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-violet-500 resize-none"
      />
    </label>
  );
}

function RowActions({ active, onToggle, onDelete }: {
  active: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onToggle}
        className={`inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-black transition-all ${
          active
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-slate-100 text-slate-500 border border-slate-200'
        }`}
      >
        <Check size={14} />
        {active ? 'Ativo' : 'Inativo'}
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="w-10 h-10 rounded-lg border border-red-100 bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-all"
        aria-label="Remover"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
