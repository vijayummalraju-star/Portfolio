import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, Loader2 } from 'lucide-react';
import { apiGet, CINEMA_EASE, type Testimonial } from '../lib/api';

const EASE = [...CINEMA_EASE] as unknown as [number, number, number, number];

export default function Voices() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await apiGet<Testimonial[]>('/api/testimonials');
        if (alive) setItems(data);
      } catch { /* silent */ } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);
  if (!loading && items.length === 0) return null;
  return (
    <section id="voices" className="relative bg-[#080607] py-24 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#ff6a5e] flex items-center gap-2"><Quote size={14} /> Voices from the set</p>
        <h2 className="mt-3 font-display text-4xl sm:text-5xl text-[#f5f1e8]">What collaborators say</h2>
        {loading ? (
          <div className="mt-10 flex items-center gap-3 text-white/60"><Loader2 className="animate-spin" /> Loading voices...</div>
        ) : (
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {items.slice(0, 6).map((t, i) => (
              <motion.figure key={t.id} initial={{ opacity: 0, y: 36, scale: 0.98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: (i % 3) * 0.09, ease: EASE }} className="motion-card rounded-xl border border-white/10 bg-white/[0.03] p-6 flex flex-col">
                <div className="flex gap-1 text-[#e8b34b]">{Array.from({ length: t.rating || 5 }).map((_, k) => <Star key={k} size={13} fill="currentColor" />)}</div>
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-white/70">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#ff2b1f]/15 text-[#ffb3ab] font-display text-lg overflow-hidden">
                    {t.avatar_url ? <img src={t.avatar_url} alt={t.name} className="h-full w-full object-cover" /> : t.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-sm text-white font-medium">{t.name}</span>
                    <span className="block text-[11px] uppercase tracking-[0.18em] text-white/40">{t.role}{t.company ? ' - ' + t.company : ''}</span>
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
