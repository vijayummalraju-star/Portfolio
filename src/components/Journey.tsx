import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hourglass, ChevronLeft, ChevronRight, Loader2, Check } from 'lucide-react';
import { apiGet, CINEMA_EASE, type TimelineYear } from '../lib/api';

const EASE = [...CINEMA_EASE] as unknown as [number, number, number, number];

export default function Journey() {
  const [years, setYears] = useState<TimelineYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [active, setActive] = useState(0);

  const fetchYears = async () => {
    try {
      setLoading(true); setError('');
      const data = await apiGet<TimelineYear[]>('/api/timeline');
      setYears(data);
      setActive(0);
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to load journey'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchYears(); }, []);

  const cur = years[active];

  return (
    <section id="journey" className="relative bg-[#0b0908] py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(55% 40% at 50% 100%, rgba(212,162,78,0.12), transparent 70%)' }} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#e8b34b] flex items-center gap-2"><Hourglass size={14} /> Scene 03 - A Journey Through Time</p>
        <h2 className="mt-3 font-display text-4xl sm:text-6xl text-[#f5f1e8] leading-none">2021 <span className="text-white/30">-&gt;</span> 2026</h2>
        <p className="mt-3 max-w-xl text-sm text-white/55">Move through time — pick a year on the rail. The hand of the clock follows, the story follows faster.</p>
        {loading ? (
          <div className="mt-12 flex items-center gap-3 text-white/60 py-16"><Loader2 className="animate-spin" /> Winding the clock...</div>
        ) : error ? (
          <div className="mt-12 rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-200">{error} <button onClick={fetchYears} className="underline ml-2">Retry</button></div>
        ) : years.length === 0 ? (
          <p className="mt-12 text-white/50 text-sm">The timeline is still being written.</p>
        ) : (
          <>
            <div className="mt-10 relative">
              <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#e8b34b]/50 to-transparent" />
              <div className="relative flex justify-between gap-1 overflow-x-auto pb-2 pt-2">
                {years.map((y, i) => (
                  <button key={y.id} onClick={() => setActive(i)} className="group flex flex-col items-center gap-2 min-w-[64px] sm:min-w-[96px]" aria-label={'Show ' + y.year}>
                    <span className={'grid h-11 w-11 sm:h-14 sm:w-14 place-items-center rounded-full border font-display text-sm sm:text-base transition-all ' + (i === active ? 'border-[#ff2b1f] bg-[#ff2b1f] text-black shadow-[0_0_28px_rgba(255,43,31,0.6)] scale-110' : 'border-white/20 bg-black/60 text-white/60 group-hover:border-white/50 group-hover:text-white')}>
                      {String(y.year).slice(2)}
                    </span>
                    <span className={'text-[10px] sm:text-[11px] uppercase tracking-[0.24em] ' + (i === active ? 'text-white' : 'text-white/40')}>{y.year}</span>
                    <span className={'hidden sm:block text-[10px] uppercase tracking-[0.18em] ' + (i === active ? 'text-[#ffb3ab]' : 'text-white/30')}>{y.title}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-8 min-h-[320px]">
              <AnimatePresence mode="wait">
                {cur && (
                  <motion.div
                    key={cur.id}
                    initial={{ opacity: 0, y: 36, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -24, scale: 0.99 }}
                    transition={{ duration: 0.65, ease: EASE }}
                    className="reveal-smooth grid md:grid-cols-2 gap-6 rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
                  >
                    <div className="relative h-64 md:h-auto min-h-[260px]">
                      <img src={cur.image_url} alt={cur.year + ' - ' + cur.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <span className="absolute left-4 top-4 rounded-full bg-black/70 backdrop-blur px-4 py-1.5 font-display text-lg tracking-widest text-[#ffb3ab] border border-white/15">{cur.year}</span>
                    </div>
                    <div className="p-6 sm:p-10">
                      <p className="text-[11px] uppercase tracking-[0.34em]" style={{ color: cur.color || '#e8b34b' }}>{cur.subtitle}</p>
                      <h3 className="mt-2 font-display text-3xl sm:text-4xl text-white">{cur.title}</h3>
                      <p className="mt-4 text-sm leading-relaxed text-white/65">{cur.description}</p>
                      {(cur.highlights && cur.highlights.length > 0) && (
                        <ul className="mt-5 space-y-2">
                          {cur.highlights.map((h) => (
                            <li key={h} className="flex items-start gap-2 text-[13px] text-white/75"><Check size={14} className="mt-0.5 text-emerald-400 shrink-0" /> {h}</li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-7 flex items-center gap-3">
                        <button onClick={() => setActive((a) => (a - 1 + years.length) % years.length)} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 hover:border-white/50 hover:text-white" aria-label="Previous year"><ChevronLeft size={18} /></button>
                        <button onClick={() => setActive((a) => (a + 1) % years.length)} className="grid h-10 w-10 place-items-center rounded-full bg-[#ff2b1f] text-black hover:bg-[#ff4a3d]" aria-label="Next year"><ChevronRight size={18} /></button>
                        <span className="ml-2 text-[11px] uppercase tracking-[0.3em] text-white/40">{active + 1} / {years.length}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
