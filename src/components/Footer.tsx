import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { apiGet, type Profile } from '../lib/api';

export default function Footer() {
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => { apiGet<Profile | null>('/api/profile').then((p) => setProfile(p)).catch(() => {}); }, []);
  const socials = profile?.socials?.length ? profile.socials : [
    { label: 'Instagram', url: '#' }, { label: 'Behance', url: '#' }, { label: 'LinkedIn', url: '#' },
  ];
  return (
    <footer className="relative overflow-hidden bg-black border-t border-white/10">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(70% 60% at 50% 120%, rgba(255,43,31,0.22), transparent 70%)' }} />
      <div className="absolute inset-0 film-grain opacity-25 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-8">
        <p className="text-center font-display leading-none text-[16vw] sm:text-[9rem] text-transparent outline-text-faint select-none">VIJAY</p>
        <div className="mt-2 flex flex-col sm:flex-row items-center justify-between gap-5 border-t border-white/10 pt-6">
          <a href="#contact" className="font-display text-lg tracking-[0.2em] text-white hover:text-[#ffb3ab] transition-colors">CONTACT</a>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Social">
            {socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="text-[12px] uppercase tracking-[0.24em] text-white/55 hover:text-white transition-colors">{s.label}</a>
            ))}
          </nav>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 hover:border-[#ff2b1f]/70 hover:text-white transition-colors" aria-label="Back to top">
            <ArrowUp size={16} />
          </button>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] uppercase tracking-[0.24em] text-white/35">
          <span>© 2026 {profile?.full_name || 'Vijay Ummalraju'} - All rights reserved</span>
          <span>Shot on the web - Cut in the browser</span>
        </div>
      </div>
    </footer>
  );
}
