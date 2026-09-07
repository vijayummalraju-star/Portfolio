import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Orbit, Loader2 } from 'lucide-react';
import { apiGet, CINEMA_EASE, type ToolItem } from '../lib/api';

const EASE = [...CINEMA_EASE] as unknown as [number, number, number, number];

export default function ToolsUniverse() {
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cat, setCat] = useState('All');

  const fetchTools = async () => {
    try {
      setLoading(true); setError('');
      const data = await apiGet<ToolItem[]>('/api/tools');
      setTools(data);
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to load tools'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchTools(); }, []);

  const cats = useMemo(() => ['All', ...Array.from(new Set(tools.map((t) => t.category)))], [tools]);
  const list = cat === 'All' ? tools : tools.filter((t) => t.category === cat);

  return (
    <section id="universe" className="relative bg-[#080607] py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(50% 35% at 50% 0%, rgba(255,43,31,0.14), transparent 70%)' }} />
      <div className="absolute inset-0 film-grain opacity-30 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#ff6a5e] flex items-center gap-2"><Orbit size={14} /> Scene 02 - The Creative Universe</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-4xl sm:text-6xl text-[#f5f1e8] leading-none">Tools - Ideas -<br /><span className="text-transparent outline-text-red">People - Impact</span></h2>
          <p className="max-w-sm text-sm text-white/55 leading-relaxed">Every card materialises as one event — the full arsenal behind every frame, managed live from the studio database.</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={'rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] border transition-colors ' + (cat === c ? 'bg-[#ff2b1f] text-black border-[#ff2b1f]' : 'border-white/15 text-white/60 hover:border-white/40 hover:text-white')}>{c}</button>
          ))}
        </div>
        {loading ? (
          <div className="mt-12 flex items-center justify-center gap-3 text-white/60 py-16"><Loader2 className="animate-spin" /> Loading the universe...</div>
        ) : error ? (
          <div className="mt-12 rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-200">{error} <button onClick={fetchTools} className="underline ml-2">Retry</button></div>
        ) : list.length === 0 ? (
          <p className="mt-12 text-white/50 text-sm">No tools in this orbit yet.</p>
        ) : (
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {list.map((t, i) => (
              <motion.article
                key={t.id}
                initial={{ opacity: 0, y: 44, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, delay: (i % 4) * 0.08, ease: EASE }}
                className="motion-card group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:border-white/25 hover:bg-white/[0.06] transition-all"
              >
                <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full blur-3xl opacity-25 group-hover:opacity-50 transition-opacity" style={{ background: t.color }} />
                <div className="text-3xl" aria-hidden>{t.icon_emoji}</div>
                <h3 className="mt-3 font-display text-lg tracking-wide text-white">{t.name}</h3>
                <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: t.color }}>{t.category}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-white/55 line-clamp-2">{t.description}</p>
                <div className="mt-4">
                  <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-white/40"><span>Mastery</span><span>{t.proficiency}%</span></div>
                  <div className="mt-1 h-1 rounded-full bg-white/10 overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: t.proficiency + '%' }} viewport={{ once: true }} transition={{ duration: 1.1, delay: 0.25, ease: EASE }} className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,' + t.color + ',#ffb3ab)' }} />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
