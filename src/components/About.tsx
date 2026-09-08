import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserRound, Sparkles } from 'lucide-react';
import { apiGet, CINEMA_EASE, type Profile } from '../lib/api';

const ABOUT_IMAGE = '/portfolio/photo-2.jpg';
const EASE = [...CINEMA_EASE] as unknown as [number, number, number, number];

export default function About() {
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => { apiGet<Profile | null>('/api/profile').then(setProfile).catch(() => {}); }, []);

  return (
    <section id="about" className="relative overflow-hidden bg-[#0a0808] py-24 sm:py-32">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(55% 45% at 10% 50%, rgba(255,43,31,0.12), transparent 70%)' }} />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div initial={{ opacity: 0, x: -36 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease: EASE }} className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-5 rounded-[2rem] border border-white/5 bg-white/[0.02] rotate-2" />
          <figure className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black shadow-2xl">
            <div className="aspect-[4/5]"><img src={ABOUT_IMAGE} alt="Vijay Ummalraju — personal introduction portrait" width="1400" height="1750" loading="lazy" className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.025]" /></div>
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/65 to-transparent p-6 pt-20"><p className="text-[10px] uppercase tracking-[0.35em] text-[#ffb3ab]">Scene 03 · The person</p><p className="mt-1 font-display text-2xl tracking-[0.14em] text-white">VIJAY UMMALRAJU</p></figcaption>
          </figure>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease: EASE }}>
          <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.4em] text-[#ff6a5e]"><UserRound size={14} /> About me</p>
          <h2 className="mt-3 font-display text-4xl leading-none text-[#f5f1e8] sm:text-6xl">A developer with<br /><span className="text-transparent outline-text-red">a maker&apos;s eye.</span></h2>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">{profile?.bio || 'I build thoughtful digital experiences where technology, design and real-world problem solving meet.'}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">{(profile?.roles?.length ? profile.roles : ['AI / ML', 'Full-stack Development', 'IoT', 'Creative Technology']).slice(0, 4).map((role) => <div key={role} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur"><div className="flex items-center gap-2 text-sm font-medium text-white"><Sparkles size={13} className="text-[#ff6a5e]" />{role}</div></div>)}</div>
          <div className="mt-8 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.2em] text-white/45"><span>{profile?.location || 'Hyderabad · India'}</span><span>•</span><span>Building · Learning · Shipping</span></div>
        </motion.div>
      </div>
    </section>
  );
}
