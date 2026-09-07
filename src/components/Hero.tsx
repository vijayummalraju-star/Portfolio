import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, Sparkles, Play, Mail, MapPin, CircleDot, Github } from 'lucide-react';
import { apiGet, CINEMA_EASE, type Profile, type Stats } from '../lib/api';

const HERO_BG = 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1920&auto=format&fit=crop';
const HERO_IMAGE = '/images/profile-hero.webp';
const EASE = [...CINEMA_EASE] as unknown as [number, number, number, number];

export default function Hero() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 55, damping: 18, mass: 0.6 });
  const my = useSpring(rawY, { stiffness: 55, damping: 18, mass: 0.6 });
  const bgX = useTransform(mx, (v) => v * -26);
  const bgY = useTransform(my, (v) => v * -16);
  const faceX = useTransform(mx, (v) => v * 14);
  const faceY = useTransform(my, (v) => v * 10);
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.5 });
  const bgScrollY = useTransform(smoothProgress, [0, 1], [0, 120]);
  const bgFade = useTransform(smoothProgress, [0, 0.85], [1, 0.25]);
  const faceScrollY = useTransform(smoothProgress, [0, 1], [0, -60]);
  const typeScrollY = useTransform(smoothProgress, [0, 1], [0, -110]);
  const typeFade = useTransform(smoothProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const p = await apiGet<Profile | null>('/api/profile').catch(() => null);
        const s = await apiGet<Stats>('/api/stats').catch(() => null);
        if (!alive) return;
        setProfile(p); if (s) setStats(s);
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  const roles = profile?.roles?.length ? profile.roles : ['Artist', 'Creative', 'Storyteller'];
  const first = (profile?.display_name || 'VIJAY').toUpperCase();
  const full = (profile?.full_name || 'Vijay Ummalraju').trim();
  const parts = full.split(/\s+/);
  const last = (parts.length > 1 ? parts.slice(1).join(' ') : 'UMMALRAJU').toUpperCase();

  return (
    <section id="home" ref={sectionRef} className="relative flex min-h-[100svh] items-center overflow-hidden bg-black" onMouseMove={(e) => {
      const r = e.currentTarget.getBoundingClientRect();
      rawX.set((e.clientX - r.left) / r.width - 0.5); rawY.set((e.clientY - r.top) / r.height - 0.5);
    }}>
      <motion.div className="absolute inset-0" style={{ x: bgX, y: bgY, scale: 1.08 }}>
        <motion.div className="absolute inset-0" style={{ y: bgScrollY, opacity: bgFade }}><img src={HERO_BG} alt="" className="h-full w-full object-cover opacity-40" /></motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/55 to-black" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(60% 45% at 50% 62%, rgba(255,43,31,0.28), transparent 70%)' }} />
        <div className="absolute inset-0 vignette" /><div className="absolute inset-0 film-grain opacity-[0.5]" />
      </motion.div>

      <motion.div aria-hidden className="pointer-events-none absolute bottom-0 right-0 z-[5] hidden h-[86%] w-[min(58vw,760px)] select-none md:block lg:right-[4%]" style={{ x: faceX, y: faceScrollY }} initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4, delay: 0.55, ease: EASE }}>
        <motion.div style={{ y: faceY }} className="h-full w-full">
          <img src={HERO_IMAGE} alt="" className="h-full w-full object-contain object-right-bottom [mask-image:linear-gradient(to_bottom,black_72%,transparent_99%)]" draggable={false} />
        </motion.div>
        <div className="absolute inset-x-8 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
      </motion.div>

      <motion.div style={{ y: typeScrollY, opacity: typeFade }} className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 pb-20 sm:px-6">
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE }} className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#ffb3ab]"><Sparkles size={14} /> Scene 01 - The Opening - Portfolio MMXXVI</motion.p>
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3, ease: EASE }} className="mx-auto mt-8 w-fit md:hidden">
          <img src={HERO_IMAGE} alt="Vijay Ummalraju" width="360" height="360" className="h-44 w-44 rounded-full border-2 border-[#ff2b1f]/60 object-cover object-top shadow-[0_0_50px_rgba(255,43,31,0.45)]" />
          <p className="mt-3 text-center font-display text-lg tracking-[0.2em] text-white">VIJAY UMMALRAJU</p>
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 1, ease: EASE }} className="mt-8 flex items-center justify-center gap-4 text-[12px] uppercase tracking-[0.5em] text-white/70"><span className="text-[#ff2b1f]">•••</span> Welcome to my world <span className="text-[#ff2b1f]">•••</span></motion.p>
        <h1 className="mt-4 text-center font-display leading-[0.88] select-none" aria-label={first + ' ' + last}>
          <motion.span initial={{ opacity: 0, y: 90 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 1.1, ease: EASE }} className="block text-[17vw] tracking-[0.02em] text-[#f5f1e8] ember-text sm:text-[13vw] lg:text-[10rem]">{first}</motion.span>
          <motion.span initial={{ opacity: 0, y: 90 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1.1, ease: EASE }} className="block text-[11vw] tracking-[0.08em] text-transparent outline-text sm:text-[8vw] lg:text-[6.2rem]">{last}</motion.span>
        </h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75, duration: 1, ease: EASE }} className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] uppercase tracking-[0.34em] text-[#d8d1c0]">
          {roles.map((r, i) => <span key={r + i} className="flex items-center gap-6"><span>{r}</span>{i < roles.length - 1 && <CircleDot size={10} className="text-[#ff2b1f]" />}</span>)}
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 1, ease: EASE }} className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-white/65 sm:text-base">{loading ? 'Loading the story...' : (profile?.tagline || 'Designer crafting cinematic interfaces, brands and stories with real impact.')}</motion.p>
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.02, duration: 1, ease: EASE }} className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a href="#work" className="inline-flex items-center gap-2 rounded-full bg-[#ff2b1f] px-7 py-3 text-[12px] font-semibold uppercase tracking-[0.24em] text-black hover:bg-[#ff4a3d] transition-colors shadow-[0_0_36px_rgba(255,43,31,0.45)]"><Play size={14} /> Enter the work</a>
          <a href="#github" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3 text-[12px] uppercase tracking-[0.24em] text-white/85 hover:border-white/60 hover:text-white transition-colors"><Github size={14} /> GitHub</a>
          <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3 text-[12px] uppercase tracking-[0.24em] text-white/85 hover:border-white/60 hover:text-white transition-colors"><Mail size={14} /> Get in touch</a>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1, ease: EASE }} className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[11px] uppercase tracking-[0.3em] text-white/50">
          <span><b className="text-white text-base font-display tracking-widest">{stats?.projects ?? 12}</b> - Projects</span><span><b className="text-white text-base font-display tracking-widest">{stats?.years ?? 6}</b> - Years</span><span><b className="text-white text-base font-display tracking-widest">{stats?.tools ?? 12}</b> - Tools</span><span><b className="text-white text-base font-display tracking-widest">{stats?.githubRepos ?? '—'}</b> - Repos</span><span className="hidden items-center gap-2 sm:inline-flex"><MapPin size={12} /> {profile?.location || 'Hyderabad - India'}</span>{profile?.availability !== false && <span className="inline-flex items-center gap-2 text-emerald-300"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Open for work</span>}
        </motion.div>
      </motion.div>
      <a href="#universe" className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors" aria-label="Scroll to universe"><span className="text-[10px] uppercase tracking-[0.4em]">Scroll</span><ArrowDown size={16} className="animate-bounce" /></a>
    </section>
  );
}
