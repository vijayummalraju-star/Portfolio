import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Eye, Heart, Loader2, ExternalLink, X } from 'lucide-react';
import { apiGet, apiPut, CINEMA_EASE, type Project } from '../lib/api';

const FALLBACK_IMAGES = [
  '/portfolio/drink_water.jpg',
  '/portfolio/unique_calculator_design.jpg',
  '/portfolio/portrait_2.jpg',
  '/portfolio/portrait_1.jpg',
];

// Real-project-only image overrides. Journey/timeline assets are intentionally untouched.
const REAL_PROJECT_IMAGES: Record<string, string> = {
  'Water Reminder': '/portfolio/drink_water.jpg',
  'Water Remainder': '/portfolio/drink_water.jpg',
  'Calculator': '/portfolio/unique_calculator_design.jpg',
  'Personal Portfolio': '/portfolio/portrait_2.jpg',
  'Portfolio 2': '/portfolio/portrait_2.jpg',
};

const EASE = [...CINEMA_EASE] as unknown as [number, number, number, number];

function resolveImage(project: Project | undefined, index: number) {
  if (project) {
    const titleMatch = REAL_PROJECT_IMAGES[project.title.trim()];
    if (titleMatch) return titleMatch;
    if (project.image_url) {
      if (project.image_url.startsWith('http://') || project.image_url.startsWith('https://') || project.image_url.startsWith('/')) return project.image_url;
      return `/${project.image_url.replace(/^\/+/, '')}`;
    }
  }
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

export default function ProjectsGallery() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Project | null>(null);
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const fetchProjects = async () => {
    try {
      setLoading(true); setError('');
      const data = await apiGet<Project[]>('/api/projects');
      setProjects(data);
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to load projects'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchProjects(); }, []);

  const cats = useMemo(() => ['All', ...Array.from(new Set(projects.map((p) => p.category)))], [projects]);
  const list = useMemo(() => {
    const s = search.trim().toLowerCase();
    return projects.filter((p) =>
      (cat === 'All' || p.category === cat) &&
      (!s || p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s) || (p.tags || []).some((t) => t.toLowerCase().includes(s)))
    );
  }, [projects, cat, search]);

  const openProject = async (p: Project) => {
    setSelected(p);
    try {
      const updated = await apiPut<Project>('/api/projects', { id: p.id, action: 'view' });
      setProjects((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
      setSelected(updated);
    } catch { /* best effort */ }
  };

  const toggleLike = async (p: Project) => {
    const has = liked.has(p.id);
    try {
      const updated = await apiPut<Project>('/api/projects', { id: p.id, action: has ? 'unlike' : 'like' });
      setProjects((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
      if (selected && selected.id === p.id) setSelected(updated);
      setLiked((prev) => { const n = new Set(prev); if (has) n.delete(p.id); else n.add(p.id); return n; });
    } catch { /* ignore */ }
  };

  return (
    <section id="work" className="relative bg-black py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(45% 30% at 50% 20%, rgba(255,43,31,0.12), transparent 70%)' }} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#ff6a5e]">Scene 04 - The Project Universe</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-4xl sm:text-6xl text-[#f5f1e8] leading-none">Real Projects.<br /><span className="text-transparent outline-text-red">Real Stories.</span></h2>
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search the universe..." className="w-full rounded-full border border-white/15 bg-white/5 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#ff2b1f]/70" />
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={'rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] border transition-colors ' + (cat === c ? 'bg-white text-black border-white' : 'border-white/15 text-white/60 hover:border-white/40 hover:text-white')}>{c}</button>
          ))}
        </div>
        {loading ? (
          <div className="mt-12 flex items-center justify-center gap-3 text-white/60 py-16"><Loader2 className="animate-spin" /> Assembling the deck...</div>
        ) : error ? (
          <div className="mt-12 rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-200">{error} <button onClick={fetchProjects} className="underline ml-2">Retry</button></div>
        ) : list.length === 0 ? (
          <p className="mt-12 text-white/50 text-sm">Nothing in this corner of the universe. Try another search.</p>
        ) : (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.map((p, i) => (
              <motion.article key={p.id} initial={{ opacity: 0, y: 44, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.8, delay: (i % 3) * 0.09, ease: EASE }} className="motion-card group cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-[#0d0c0c] hover:border-[#ff2b1f]/50 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(255,43,31,0.18)] transition-all" onClick={() => openProject(p)}>
                <div className="relative h-52 overflow-hidden">
                  <img src={resolveImage(p, i)} alt={p.title} loading="lazy" onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]; }} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0c] via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-black/70 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/85 border border-white/15">{p.category}</span>
                  {p.featured && <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#ff2b1f] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-black font-semibold"><Star size={11} /> Featured</span>}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3"><h3 className="font-display text-xl tracking-wide text-white group-hover:text-[#ffb3ab] transition-colors">{p.title}</h3><span className="text-[11px] text-white/35 font-mono shrink-0">{p.year}</span></div>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/55 line-clamp-2">{p.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">{(p.tags || []).slice(0, 3).map((t) => <span key={t} className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white/50">{t}</span>)}</div>
                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[12px] text-white/45"><span className="flex items-center gap-1.5"><Eye size={13} /> {p.views ?? 0}</span><button onClick={(e) => { e.stopPropagation(); toggleLike(p); }} className={'flex items-center gap-1.5 transition-colors ' + (liked.has(p.id) ? 'text-[#ff2b1f]' : 'hover:text-white')} aria-label="Like project"><Heart size={13} fill={liked.has(p.id) ? 'currentColor' : 'none'} /> {p.likes ?? 0}</button><span className="uppercase tracking-[0.2em] text-[10px] group-hover:text-white transition-colors">Open case -&gt;</span></div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
      {selected && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <motion.div initial={{ opacity: 0, y: 60, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: EASE }} className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-white/15 bg-[#111010]">
            <div className="relative h-64 sm:h-80"><img src={resolveImage(selected, projects.findIndex((p) => p.id === selected.id))} alt={selected.title} className="h-full w-full object-cover" onError={(e) => { const index = projects.findIndex((p) => p.id === selected.id); e.currentTarget.src = FALLBACK_IMAGES[(index < 0 ? 0 : index) % FALLBACK_IMAGES.length]; }} /><div className="absolute inset-0 bg-gradient-to-t from-[#111010] via-transparent to-transparent" /><button onClick={() => setSelected(null)} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-white hover:bg-[#ff2b1f] hover:text-black transition-colors" aria-label="Close"><X size={18} /></button><div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.3em] text-[#ffb3ab]">{selected.category} - {selected.year}</p><h3 className="font-display text-3xl sm:text-4xl text-white">{selected.title}</h3></div>{selected.featured && <span className="flex items-center gap-1 rounded-full bg-[#ff2b1f] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-black font-semibold"><Star size={11} /> Featured</span>}</div></div>
            <div className="p-5 sm:p-8"><p className="text-sm leading-relaxed text-white/70">{selected.long_description || selected.description}</p><div className="mt-4 flex flex-wrap gap-2">{(selected.tags || []).map((t) => <span key={t} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/60">{t}</span>)}</div><div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]"><div className="rounded-lg bg-white/5 p-3"><p className="uppercase tracking-[0.2em] text-white/40 text-[10px]">Client</p><p className="text-white mt-1">{selected.client || '-'}</p></div><div className="rounded-lg bg-white/5 p-3"><p className="uppercase tracking-[0.2em] text-white/40 text-[10px]">Role</p><p className="text-white mt-1">{selected.role || '-'}</p></div><div className="rounded-lg bg-white/5 p-3"><p className="uppercase tracking-[0.2em] text-white/40 text-[10px]">Views</p><p className="text-white mt-1">{selected.views ?? 0}</p></div><div className="rounded-lg bg-white/5 p-3"><p className="uppercase tracking-[0.2em] text-white/40 text-[10px]">Likes</p><p className="text-white mt-1">{selected.likes ?? 0}</p></div></div><div className="mt-6 flex flex-wrap gap-3"><button onClick={() => toggleLike(selected)} className={'inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[12px] uppercase tracking-[0.2em] transition-colors ' + (liked.has(selected.id) ? 'bg-[#ff2b1f] text-black' : 'border border-white/20 text-white hover:border-[#ff2b1f]/70')}><Heart size={14} fill={liked.has(selected.id) ? 'currentColor' : 'none'} /> {liked.has(selected.id) ? 'Liked' : 'Like'} - {selected.likes ?? 0}</button>{selected.link_url && <a href={selected.link_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2.5 text-[12px] uppercase tracking-[0.2em] text-white hover:border-white/60"><ExternalLink size={14} /> Visit live</a>}</div></div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
