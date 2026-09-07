import { motion } from 'framer-motion';
import { Activity, ArrowUpRight, Cpu, Radio } from 'lucide-react';
import { CINEMA_EASE } from '../lib/api';

const PROJECT_IMAGE = '/images/profile-projects.webp';
const EASE = [...CINEMA_EASE] as unknown as [number, number, number, number];

export default function RealTimeProjectInterface() {
  return (
    <section id="real-time-project" className="relative overflow-hidden bg-[#080707] py-20 sm:py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-70px' }} transition={{ duration: 0.8, ease: EASE }} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[320px] overflow-hidden lg:min-h-[430px]">
              <img src={PROJECT_IMAGE} alt="Vijay Ummalraju — project interface portrait" width="1400" height="1750" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-1000 hover:scale-[1.025]" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-black/70" />
              <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-[#ffb3ab] backdrop-blur">Real-time interface</div>
            </div>
            <div className="p-6 sm:p-9 lg:p-12">
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.4em] text-[#ff6a5e]"><Radio size={14} /> Project lab · Live systems</p>
              <h2 className="mt-3 font-display text-3xl leading-none text-white sm:text-5xl">Build. Observe.<br /><span className="text-transparent outline-text-red">Respond in real time.</span></h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60">A dedicated visual layer for real-time projects keeps the technology and interface in focus while the portrait establishes the maker behind the system.</p>
              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-black/30 p-4"><Cpu size={17} className="text-[#ff6a5e]" /><p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/40">Architecture</p><p className="mt-1 text-sm text-white">AI · IoT · APIs</p></div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-4"><Activity size={17} className="text-emerald-300" /><p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/40">Interface</p><p className="mt-1 text-sm text-white">Signals · State · Insight</p></div>
              </div>
              <a href="#work" className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-white/75 hover:border-[#ff2b1f]/70 hover:text-white">Explore projects <ArrowUpRight size={14} /></a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
