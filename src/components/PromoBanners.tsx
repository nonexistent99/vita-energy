import { ArrowRight, Sparkles } from 'lucide-react';
import { useStoreConfig } from '../hooks/useStoreConfig';

export default function PromoBanners() {
  const { config } = useStoreConfig();
  const banners = config.banners.filter((banner) => banner.active);

  if (banners.length === 0) return null;

  const scrollToTarget = (targetId: string) => {
    document.getElementById(targetId || 'pedido')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-8 bg-brand-deep border-y border-white/[0.06]">
      <div className="max-w-3xl mx-auto px-5 md:px-8 grid gap-3">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="rounded-lg border border-brand-violet/25 bg-white/[0.04] px-5 py-5 md:px-6 md:py-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-[0.14em] text-brand-glow mb-2">
                  <Sparkles size={14} />
                  {banner.badge}
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white leading-tight">{banner.title}</h2>
                <p className="text-sm text-text-muted mt-1">{banner.description}</p>
              </div>
              <button
                type="button"
                onClick={() => scrollToTarget(banner.targetId)}
                className="inline-flex shrink-0 items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-brand-deep text-sm font-black hover:scale-105 active:scale-95 transition-all"
              >
                {banner.ctaLabel}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
