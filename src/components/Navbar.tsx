import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clapperboard, Menu, X, ShieldCheck } from 'lucide-react';

const LINKS = [
  { label: 'Home', href: '/#home' },
  { label: 'Universe', href: '/#universe' },
  { label: 'Journey', href: '/#journey' },
  { label: 'GitHub', href: '/#github' },
  { label: 'Work', href: '/#work' },
  { label: 'Voices', href: '/#voices' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setOpen(false); }, [loc.pathname]);
  return (
    <header className={'fixed inset-x-0 top-0 z-50 transition-all duration-500 ' + (scrolled ? 'bg-black/85 backdrop-blur-md border-b border-white/10' : 'bg-gradient-to-b from-black/80 to-transparent')}>
      <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#ff2b1f]/70 to-transparent" />
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
        <Link to="/#home" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-sm bg-[#ff2b1f] text-black shadow-[0_0_24px_rgba(255,43,31,0.55)]">
            <Clapperboard size={18} strokeWidth={2.4} />
          </span>
          <span className="leading-none">
            <span className="block font-display text-lg tracking-[0.18em] text-[#f5f1e8]">VIJAY</span>
            <span className="block text-[10px] uppercase tracking-[0.34em] text-[#8a8578]">Ummalraju - MMXXVI</span>
          </span>
        </Link>
        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} className="text-[12px] uppercase tracking-[0.28em] text-[#b9b2a2] hover:text-white transition-colors">{l.label}</a>
          ))}
          <Link to="/admin" className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[12px] uppercase tracking-[0.22em] text-white/80 hover:border-[#ff2b1f]/70 hover:text-white transition-colors">
            <ShieldCheck size={14} /> Studio
          </Link>
        </nav>
        <button className="lg:hidden text-white p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-white/10 bg-black/95 backdrop-blur-md px-6 py-4 space-y-3">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="block text-sm uppercase tracking-[0.24em] text-white/80 py-1">{l.label}</a>
          ))}
          <Link to="/admin" onClick={() => setOpen(false)} className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-[#ff5a4d]"><ShieldCheck size={15} /> Studio Admin</Link>
        </div>
      )}
    </header>
  );
}
