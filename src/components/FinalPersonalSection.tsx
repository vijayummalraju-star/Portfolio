import { motion } from 'framer-motion';
import { ArrowDown, Mail } from 'lucide-react';
import { CINEMA_EASE } from '../lib/api';

const CONTACT_IMAGE = '/portfolio/photo-4.jpg';
const EASE = [...CINEMA_EASE] as unknown as [number, number, number, number];

export default function FinalPersonalSection() {
  return (
    <section id="final-personal" className="relative overflow-hidden bg-[#0b0908] py-20 sm:py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-70px' }} transition={{ duration: 0.85, ease: EASE }} className="grid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="order-2 flex flex-col justify-center p-7 sm:p-10 lg:order-1 lg:p-14">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#ff6a5e]">Final scene · Let&apos;s connect</p>
            <h2 className="mt-3 font-display text-4xl leading-none text-[#f5f1e8] sm:text-6xl">One more frame<br /><span className="text-[#ff2b1f]">together.</span></h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/60">A quieter closing portrait before the contact form — personal, minimal and intentionally different from the hero.</p>
            <a href="#contact" className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-[#ff2b1f] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-black hover:bg-[#ff4a3d]"><Mail size={14} /> Let&apos;s connect</a>
            <span className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-white/35"><ArrowDown size={12} /> Contact below</span>
          </div>
          <div className="relative order-1 min-h-[360px] lg:order-2 lg:min-h-[470px]">
            <img src={CONTACT_IMAGE} alt="Vijay Ummalraju — final personal portrait" width="1400" height="1750" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-1000 hover:scale-[1.02]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 lg:bg-gradient-to-l lg:from-black/40 lg:via-transparent lg:to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
