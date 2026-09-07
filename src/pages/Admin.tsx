import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, User, Briefcase, Wrench, History, Inbox, MessageSquareQuote,
  Plus, Pencil, Trash2, Check, X, Loader2, ArrowLeft, Eye, Heart, MailOpen,
  KeyRound, LogOut, Save, Github, RefreshCw,
} from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete, type Profile, type Project, type ToolItem, type TimelineYear, type MessageItem, type Testimonial, type Stats, type GithubPayload } from '../lib/api';

type Tab = 'overview' | 'profile' | 'projects' | 'tools' | 'timeline' | 'messages' | 'testimonials' | 'github';

const PASSCODE = 'vijay2026';
const inputCls = 'w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#ff2b1f]/70';
const labelCls = 'mb-1 block text-[11px] uppercase tracking-[0.2em] text-white/50';
const btnPrimary = 'inline-flex items-center gap-2 rounded-full bg-[#ff2b1f] px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-black hover:bg-[#ff4a3d] transition-colors disabled:opacity-60';
const btnGhost = 'inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[12px] uppercase tracking-[0.16em] text-white/70 hover:border-white/50 hover:text-white transition-colors';

function toArr(v: unknown): string[] {
  if (Array.isArray(v)) return v as string[];
  if (typeof v === 'string') return v.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
}
function toStr(v: unknown): string { return Array.isArray(v) ? (v as string[]).join(', ') : ''; }
function toLines(v: unknown): string { return Array.isArray(v) ? (v as string[]).join('\n') : ''; }

export default function Admin() {
  const [authed, setAuthed] = useState(() => { try { return localStorage.getItem('vu_admin') === '1'; } catch { return false; } });
  const [code, setCode] = useState('');
  const [codeErr, setCodeErr] = useState('');
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [years, setYears] = useState<TimelineYear[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [testis, setTestis] = useState<Testimonial[]>([]);
  const [github, setGithub] = useState<GithubPayload | null>(null);
  const [syncingGh, setSyncingGh] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingTool, setEditingTool] = useState<Partial<ToolItem> | null>(null);
  const [editingYear, setEditingYear] = useState<Partial<TimelineYear> | null>(null);
  const [editingTesti, setEditingTesti] = useState<Partial<Testimonial> | null>(null);
  const [profileDraft, setProfileDraft] = useState<Partial<Profile>>({});

  const refreshAll = async () => {
    setLoading(true);
    try {
      const s = await apiGet<Stats>('/api/stats').catch(() => null);
      const p = await apiGet<Profile | null>('/api/profile').catch(() => null);
      const pr = await apiGet<Project[]>('/api/projects').catch(() => []);
      const t = await apiGet<ToolItem[]>('/api/tools').catch(() => []);
      const y = await apiGet<TimelineYear[]>('/api/timeline').catch(() => []);
      const m = await apiGet<MessageItem[]>('/api/messages').catch(() => []);
      const te = await apiGet<Testimonial[]>('/api/testimonials').catch(() => []);
      const gh = await apiGet<GithubPayload>('/api/github').catch(() => null);
      if (s) setStats(s);
      if (p) { setProfile(p); setProfileDraft(p); }
      setProjects(pr); setTools(t); setYears(y); setMessages(m); setTestis(te);
      if (gh) setGithub(gh);
    } finally { setLoading(false); }
  };

  useEffect(() => { if (authed) refreshAll(); }, [authed]);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 3500);
    return () => clearTimeout(t);
  }, [notice]);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === PASSCODE) { try { localStorage.setItem('vu_admin', '1'); } catch { /* ignore */ } setAuthed(true); setCodeErr(''); }
    else setCodeErr('Wrong passcode. Hint for the demo: vijay2026');
  };

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const updated = await apiPut<Profile>('/api/profile', { ...profileDraft, id: profile.id });
      setProfile(updated); setProfileDraft(updated);
      setNotice('Profile saved — the live site updates instantly.');
    } catch (e) { setNotice(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  };

  const saveProject = async () => {
    if (!editingProject?.title) { setNotice('Project needs a title'); return; }
    setSaving(true);
    try {
      if (editingProject.id) await apiPut('/api/projects', { ...editingProject, tags: toArr(editingProject.tags) });
      else await apiPost('/api/projects', { ...editingProject, tags: toArr(editingProject.tags) });
      setEditingProject(null);
      setProjects(await apiGet<Project[]>('/api/projects'));
      setNotice('Project saved.');
    } catch (e) { setNotice(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  };

  const saveTool = async () => {
    if (!editingTool?.name) { setNotice('Tool needs a name'); return; }
    setSaving(true);
    try {
      if (editingTool.id) await apiPut('/api/tools', editingTool);
      else await apiPost('/api/tools', editingTool);
      setEditingTool(null);
      setTools(await apiGet<ToolItem[]>('/api/tools'));
      setNotice('Tool saved.');
    } catch (e) { setNotice(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  };

  const saveYear = async () => {
    if (!editingYear?.year) { setNotice('Year is required'); return; }
    setSaving(true);
    try {
      const payload = { ...editingYear, highlights: toArr(editingYear.highlights) };
      if (editingYear.id) await apiPut('/api/timeline', payload);
      else await apiPost('/api/timeline', payload);
      setEditingYear(null);
      setYears(await apiGet<TimelineYear[]>('/api/timeline'));
      setNotice('Timeline entry saved.');
    } catch (e) { setNotice(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  };

  const saveTesti = async () => {
    if (!editingTesti?.name || !editingTesti?.quote) { setNotice('Name and quote required'); return; }
    setSaving(true);
    try {
      if (editingTesti.id) await apiPut('/api/testimonials', editingTesti);
      else await apiPost('/api/testimonials', editingTesti);
      setEditingTesti(null);
      setTestis(await apiGet<Testimonial[]>('/api/testimonials'));
      setNotice('Testimonial saved.');
    } catch (e) { setNotice(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  };

  const remove = async (kind: string, id: number) => {
    if (!confirm('Delete this entry?')) return;
    try {
      if (kind === 'projects') { await apiDelete('/api/projects', { id }); setProjects(await apiGet<Project[]>('/api/projects')); }
      if (kind === 'tools') { await apiDelete('/api/tools', { id }); setTools(await apiGet<ToolItem[]>('/api/tools')); }
      if (kind === 'timeline') { await apiDelete('/api/timeline', { id }); setYears(await apiGet<TimelineYear[]>('/api/timeline')); }
      if (kind === 'messages') { await apiDelete('/api/messages', { id }); setMessages(await apiGet<MessageItem[]>('/api/messages')); }
      if (kind === 'testimonials') { await apiDelete('/api/testimonials', { id }); setTestis(await apiGet<Testimonial[]>('/api/testimonials')); }
      setNotice('Deleted.');
    } catch (e) { setNotice(e instanceof Error ? e.message : 'Delete failed'); }
  };

  const syncGithub = async (refresh = false) => {
    setSyncingGh(true);
    try {
      if (refresh) await apiPost('/api/github', {});
      const gh = await apiGet<GithubPayload>(refresh ? '/api/github?refresh=true' : '/api/github');
      setGithub(gh);
      const s = await apiGet<Stats>('/api/stats').catch(() => null);
      if (s) setStats(s);
      setNotice(refresh ? 'GitHub re-synced — ' + gh.repos.length + ' repos in the database.' : 'GitHub loaded — ' + gh.repos.length + ' repos cached.');
    } catch (e) { setNotice(e instanceof Error ? e.message : 'GitHub sync failed'); }
    finally { setSyncingGh(false); }
  };

  const toggleRead = async (m: MessageItem) => {
    try {
      const u = await apiPut<MessageItem>('/api/messages', { id: m.id, read: !m.read });
      setMessages((prev) => prev.map((x) => (x.id === m.id ? u : x)));
    } catch { /* ignore */ }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'profile', label: 'Profile' },
    { id: 'projects', label: 'Projects' },
    { id: 'github', label: 'GitHub' },
    { id: 'tools', label: 'Tools' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'messages', label: 'Inbox' },
    { id: 'testimonials', label: 'Voices' },
  ];

  if (!authed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <form onSubmit={login} className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.04] p-8">
          <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-[#ff6a5e]"><KeyRound size={14} /> Studio access</p>
          <h1 className="mt-2 font-display text-3xl text-white">Director&apos;s cut</h1>
          <p className="mt-2 text-[13px] text-white/55">Enter the studio passcode to manage everything. Demo passcode: <code className="text-white">vijay2026</code></p>
          <input value={code} onChange={(e) => setCode(e.target.value)} type="password" placeholder="Passcode" className={inputCls + ' mt-5'} />
          {codeErr && <p className="mt-2 text-[13px] text-red-300">{codeErr}</p>}
          <button className={btnPrimary + ' mt-4 w-full justify-center'} type="submit">Unlock studio</button>
          <Link to="/" className="mt-4 flex items-center justify-center gap-2 text-[12px] uppercase tracking-[0.2em] text-white/50 hover:text-white"><ArrowLeft size={13} /> Back to site</Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0909] text-white">
      <div className="border-b border-white/10 bg-black/70 sticky top-0 z-40 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className={btnGhost}><ArrowLeft size={14} /> Site</Link>
            <span className="font-display text-lg tracking-[0.2em]">STUDIO <span className="text-[#ff2b1f]">-</span> VIJAY</span>
          </div>
          <div className="flex items-center gap-2">
            {stats && stats.unread > 0 && <span className="rounded-full bg-[#ff2b1f] px-3 py-1 text-[11px] font-semibold text-black">{stats.unread} new</span>}
            <button onClick={() => { try { localStorage.removeItem('vu_admin'); } catch { /* ignore */ } setAuthed(false); }} className={btnGhost}><LogOut size={14} /> Lock</button>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-3 flex gap-2 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={'flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[12px] uppercase tracking-[0.16em] border transition-colors ' + (tab === t.id ? 'bg-white text-black border-white' : 'border-white/15 text-white/60 hover:text-white hover:border-white/40')}>
              {t.label}
              {t.id === 'messages' && stats && stats.unread > 0 && <span className="grid h-5 w-5 place-items-center rounded-full bg-[#ff2b1f] text-[10px] text-black font-bold">{stats.unread}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {notice && <div className="mb-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-200">{notice}</div>}
        {loading ? (
          <div className="flex items-center gap-3 text-white/60 py-20 justify-center"><Loader2 className="animate-spin" /> Loading studio...</div>
        ) : (
          <>
            {tab === 'overview' && stats && (
              <div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { l: 'Projects', v: stats.projects, icon: <Briefcase size={16} /> },
                    { l: 'Total views', v: stats.totalViews, icon: <Eye size={16} /> },
                    { l: 'Total likes', v: stats.totalLikes, icon: <Heart size={16} /> },
                    { l: 'Unread inbox', v: stats.unread, icon: <Inbox size={16} /> },
                    { l: 'Tools', v: stats.tools, icon: <Wrench size={16} /> },
                    { l: 'Years', v: stats.years, icon: <History size={16} /> },
                    { l: 'Voices', v: stats.testimonials, icon: <MessageSquareQuote size={16} /> },
                    { l: 'Messages', v: stats.messages, icon: <MailOpen size={16} /> },
                    { l: 'GitHub repos', v: stats.githubRepos ?? 0, icon: <Github size={16} /> },
                  ].map((c) => (
                    <div key={c.l} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                      <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/45">{c.icon} {c.l}</p>
                      <p className="mt-2 font-display text-4xl">{c.v}</p>
                    </div>
                  ))}
                </div>
                <h3 className="mt-8 font-display text-xl flex items-center gap-2"><LayoutDashboard size={17} /> Latest inbox</h3>
                <div className="mt-3 space-y-2">
                  {messages.slice(0, 5).map((m) => (
                    <div key={m.id} className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm flex items-center justify-between gap-3">
                      <span><b>{m.name}</b> <span className="text-white/40">- {m.subject}</span></span>
                      {!m.read && <span className="rounded-full bg-[#ff2b1f] px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-black">new</span>}
                    </div>
                  ))}
                  {messages.length === 0 && <p className="text-white/40 text-sm">Inbox zero. Beautiful.</p>}
                </div>
              </div>
            )}

            {tab === 'profile' && profile && (
              <div className="max-w-3xl rounded-xl border border-white/10 bg-white/[0.02] p-6">
                <h3 className="font-display text-2xl flex items-center gap-2"><User size={19} /> Site identity</h3>
                <div className="mt-5 grid sm:grid-cols-2 gap-4">
                  <label className="block"><span className={labelCls}>Display name (hero line 1)</span><input className={inputCls} value={profileDraft.display_name || ''} onChange={(e) => setProfileDraft({ ...profileDraft, display_name: e.target.value })} /></label>
                  <label className="block"><span className={labelCls}>Full name</span><input className={inputCls} value={profileDraft.full_name || ''} onChange={(e) => setProfileDraft({ ...profileDraft, full_name: e.target.value })} /></label>
                  <label className="block"><span className={labelCls}>Email</span><input className={inputCls} value={profileDraft.email || ''} onChange={(e) => setProfileDraft({ ...profileDraft, email: e.target.value })} /></label>
                  <label className="block"><span className={labelCls}>Phone</span><input className={inputCls} value={profileDraft.phone || ''} onChange={(e) => setProfileDraft({ ...profileDraft, phone: e.target.value })} /></label>
                  <label className="block"><span className={labelCls}>Location</span><input className={inputCls} value={profileDraft.location || ''} onChange={(e) => setProfileDraft({ ...profileDraft, location: e.target.value })} /></label>
                  <label className="block"><span className={labelCls}>Roles (comma separated)</span><input className={inputCls} value={(profileDraft.roles || []).join(', ')} onChange={(e) => setProfileDraft({ ...profileDraft, roles: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} /></label>
                </div>
                <div className="mt-4 space-y-4">
                  <label className="block"><span className={labelCls}>Tagline</span><input className={inputCls} value={profileDraft.tagline || ''} onChange={(e) => setProfileDraft({ ...profileDraft, tagline: e.target.value })} /></label>
                  <label className="block"><span className={labelCls}>Bio</span><textarea className={inputCls + ' resize-none'} rows={4} value={profileDraft.bio || ''} onChange={(e) => setProfileDraft({ ...profileDraft, bio: e.target.value })} /></label>
                  <label className="block"><span className={labelCls}>Quote</span><input className={inputCls} value={profileDraft.quote || ''} onChange={(e) => setProfileDraft({ ...profileDraft, quote: e.target.value })} /></label>
                  <label className="flex items-center gap-2 text-sm text-white/70"><input type="checkbox" checked={!!profileDraft.availability} onChange={(e) => setProfileDraft({ ...profileDraft, availability: e.target.checked })} className="h-4 w-4 accent-[#ff2b1f]" /> Open for work badge</label>
                </div>
                <button onClick={saveProfile} disabled={saving} className={btnPrimary + ' mt-6'}>{saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save profile</button>
              </div>
            )}

            {tab === 'projects' && (
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl">{projects.length} projects</h3>
                  <button onClick={() => setEditingProject({ title: '', category: 'Design', description: '', long_description: '', image_url: '', tags: [], year: 2026, featured: false, client: '', role: '', link_url: '', order_index: projects.length })} className={btnPrimary}><Plus size={14} /> New project</button>
                </div>
                {editingProject && (
                  <div className="mt-4 rounded-xl border border-[#ff2b1f]/40 bg-white/[0.03] p-5 grid sm:grid-cols-2 gap-4">
                    <label className="block"><span className={labelCls}>Title *</span><input className={inputCls} value={editingProject.title || ''} onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })} /></label>
                    <label className="block"><span className={labelCls}>Category</span><input className={inputCls} value={editingProject.category || ''} onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })} /></label>
                    <label className="block"><span className={labelCls}>Client</span><input className={inputCls} value={editingProject.client || ''} onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })} /></label>
                    <label className="block"><span className={labelCls}>Role</span><input className={inputCls} value={editingProject.role || ''} onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })} /></label>
                    <label className="block"><span className={labelCls}>Year</span><input type="number" className={inputCls} value={editingProject.year ?? 2026} onChange={(e) => setEditingProject({ ...editingProject, year: Number(e.target.value) })} /></label>
                    <label className="block"><span className={labelCls}>Order</span><input type="number" className={inputCls} value={editingProject.order_index ?? 0} onChange={(e) => setEditingProject({ ...editingProject, order_index: Number(e.target.value) })} /></label>
                    <label className="block sm:col-span-2"><span className={labelCls}>Image URL</span><input className={inputCls} value={editingProject.image_url || ''} onChange={(e) => setEditingProject({ ...editingProject, image_url: e.target.value })} /></label>
                    <label className="block sm:col-span-2"><span className={labelCls}>Short description</span><textarea className={inputCls + ' resize-none'} rows={2} value={editingProject.description || ''} onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })} /></label>
                    <label className="block sm:col-span-2"><span className={labelCls}>Long description</span><textarea className={inputCls + ' resize-none'} rows={4} value={editingProject.long_description || ''} onChange={(e) => setEditingProject({ ...editingProject, long_description: e.target.value })} /></label>
                    <label className="block"><span className={labelCls}>Tags (comma separated)</span><input className={inputCls} value={toStr(editingProject.tags)} onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) as unknown as string[] })} /></label>
                    <label className="block"><span className={labelCls}>Live link</span><input className={inputCls} value={editingProject.link_url || ''} onChange={(e) => setEditingProject({ ...editingProject, link_url: e.target.value })} /></label>
                    <label className="flex items-center gap-2 text-sm text-white/70 self-end pb-1"><input type="checkbox" checked={!!editingProject.featured} onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })} className="h-4 w-4 accent-[#ff2b1f]" /> Featured</label>
                    <div className="sm:col-span-2 flex gap-2">
                      <button onClick={saveProject} disabled={saving} className={btnPrimary}>{saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save</button>
                      <button onClick={() => setEditingProject(null)} className={btnGhost}><X size={14} /> Cancel</button>
                    </div>
                  </div>
                )}
                <div className="mt-4 space-y-2">
                  {projects.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3">
                      <img src={p.image_url} alt="" className="h-12 w-16 rounded object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{p.title} <span className="text-white/35">- {p.category} - {p.year}</span></p>
                        <p className="text-[11px] text-white/40 flex gap-3"><span className="flex items-center gap-1"><Eye size={11} />{p.views}</span><span className="flex items-center gap-1"><Heart size={11} />{p.likes}</span>{p.featured && <span className="text-[#ffb3ab]">FEATURED</span>}</p>
                      </div>
                      <button onClick={() => setEditingProject(p)} className="p-2 text-white/60 hover:text-white" aria-label="Edit"><Pencil size={15} /></button>
                      <button onClick={() => remove('projects', p.id)} className="p-2 text-white/60 hover:text-red-400" aria-label="Delete"><Trash2 size={15} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'github' && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl flex items-center gap-2"><Github size={20} /> GitHub · @vijayummalraju-star</h3>
                    <p className="mt-1 text-[13px] text-white/50">
                      {github?.profile ? (
                        <>{github.profile.name || github.profile.login} · {github.profile.public_repos} public repos · {github.profile.followers} followers · source: {github.source}</>
                      ) : ('Live public profile + repos, cached in the github_repos table.')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => syncGithub(false)} disabled={syncingGh} className={btnGhost}>{syncingGh ? <Loader2 size={14} className="animate-spin" /> : <Github size={14} />} Load</button>
                    <button onClick={() => syncGithub(true)} disabled={syncingGh} className={btnPrimary}>{syncingGh ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Re-sync now</button>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {(github?.repos || []).map((r) => (
                    <a key={r.github_id || r.name} href={r.html_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3 hover:border-[#ff2b1f]/40 transition-colors">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5"><Github size={16} /></span>
                      <span className="flex-1 min-w-0">
                        <span className="block truncate text-sm font-medium">{r.name}</span>
                        <span className="block truncate text-[11px] text-white/40">{r.description || 'No description'} · {r.language || '—'} · ★ {r.stargazers_count} · ⑂ {r.forks_count}</span>
                      </span>
                    </a>
                  ))}
                  {(!github || !github.repos.length) && <p className="text-white/40 text-sm">No cached repos yet — hit “Re-sync now”. Empty is fine: the public site handles it gracefully.</p>}
                </div>
                <p className="mt-4 text-[12px] text-white/40">Backend: <code>GET /api/github</code> (auto-refresh, 6h cache) · <code>POST /api/github</code> (force sync into <code>github_repos</code>). Add a <code>GITHUB_TOKEN</code> secret to raise the API rate limit.</p>
              </div>
            )}

            {tab === 'tools' && (
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl">{tools.length} tools</h3>
                  <button onClick={() => setEditingTool({ name: '', category: 'Craft', description: '', proficiency: 85, icon_emoji: '✨', color: '#ff2b1f', order_index: tools.length })} className={btnPrimary}><Plus size={14} /> New tool</button>
                </div>
                {editingTool && (
                  <div className="mt-4 rounded-xl border border-[#ff2b1f]/40 bg-white/[0.03] p-5 grid sm:grid-cols-2 gap-4">
                    <label className="block"><span className={labelCls}>Name *</span><input className={inputCls} value={editingTool.name || ''} onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })} /></label>
                    <label className="block"><span className={labelCls}>Category</span><input className={inputCls} value={editingTool.category || ''} onChange={(e) => setEditingTool({ ...editingTool, category: e.target.value })} /></label>
                    <label className="block"><span className={labelCls}>Icon (emoji)</span><input className={inputCls} value={editingTool.icon_emoji || ''} onChange={(e) => setEditingTool({ ...editingTool, icon_emoji: e.target.value })} /></label>
                    <label className="block"><span className={labelCls}>Accent color</span><input className={inputCls} value={editingTool.color || ''} onChange={(e) => setEditingTool({ ...editingTool, color: e.target.value })} /></label>
                    <label className="block"><span className={labelCls}>Proficiency (0-100)</span><input type="number" min={0} max={100} className={inputCls} value={editingTool.proficiency ?? 80} onChange={(e) => setEditingTool({ ...editingTool, proficiency: Number(e.target.value) })} /></label>
                    <label className="block"><span className={labelCls}>Order</span><input type="number" className={inputCls} value={editingTool.order_index ?? 0} onChange={(e) => setEditingTool({ ...editingTool, order_index: Number(e.target.value) })} /></label>
                    <label className="block sm:col-span-2"><span className={labelCls}>Description</span><textarea className={inputCls + ' resize-none'} rows={2} value={editingTool.description || ''} onChange={(e) => setEditingTool({ ...editingTool, description: e.target.value })} /></label>
                    <div className="sm:col-span-2 flex gap-2">
                      <button onClick={saveTool} disabled={saving} className={btnPrimary}>{saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save</button>
                      <button onClick={() => setEditingTool(null)} className={btnGhost}><X size={14} /> Cancel</button>
                    </div>
                  </div>
                )}
                <div className="mt-4 grid sm:grid-cols-2 gap-2">
                  {tools.map((t) => (
                    <div key={t.id} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3">
                      <span className="text-2xl">{t.icon_emoji}</span>
                      <div className="flex-1 min-w-0"><p className="truncate text-sm font-medium">{t.name}</p><p className="text-[11px] text-white/40">{t.category} - {t.proficiency}%</p></div>
                      <button onClick={() => setEditingTool(t)} className="p-2 text-white/60 hover:text-white" aria-label="Edit"><Pencil size={15} /></button>
                      <button onClick={() => remove('tools', t.id)} className="p-2 text-white/60 hover:text-red-400" aria-label="Delete"><Trash2 size={15} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'timeline' && (
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl">{years.length} years</h3>
                  <button onClick={() => setEditingYear({ year: 2027, title: '', subtitle: '', description: '', highlights: [], image_url: '', color: '#ff2b1f', order_index: 2027 })} className={btnPrimary}><Plus size={14} /> New year</button>
                </div>
                {editingYear && (
                  <div className="mt-4 rounded-xl border border-[#ff2b1f]/40 bg-white/[0.03] p-5 grid sm:grid-cols-2 gap-4">
                    <label className="block"><span className={labelCls}>Year *</span><input type="number" className={inputCls} value={editingYear.year ?? 2026} onChange={(e) => setEditingYear({ ...editingYear, year: Number(e.target.value) })} /></label>
                    <label className="block"><span className={labelCls}>Title</span><input className={inputCls} value={editingYear.title || ''} onChange={(e) => setEditingYear({ ...editingYear, title: e.target.value })} /></label>
                    <label className="block"><span className={labelCls}>Subtitle</span><input className={inputCls} value={editingYear.subtitle || ''} onChange={(e) => setEditingYear({ ...editingYear, subtitle: e.target.value })} /></label>
                    <label className="block"><span className={labelCls}>Accent color</span><input className={inputCls} value={editingYear.color || ''} onChange={(e) => setEditingYear({ ...editingYear, color: e.target.value })} /></label>
                    <label className="block sm:col-span-2"><span className={labelCls}>Image URL</span><input className={inputCls} value={editingYear.image_url || ''} onChange={(e) => setEditingYear({ ...editingYear, image_url: e.target.value })} /></label>
                    <label className="block sm:col-span-2"><span className={labelCls}>Description</span><textarea className={inputCls + ' resize-none'} rows={3} value={editingYear.description || ''} onChange={(e) => setEditingYear({ ...editingYear, description: e.target.value })} /></label>
                    <label className="block sm:col-span-2"><span className={labelCls}>Highlights (one per line)</span><textarea className={inputCls + ' resize-none'} rows={3} value={toLines(editingYear.highlights)} onChange={(e) => setEditingYear({ ...editingYear, highlights: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) as unknown as string[] })} /></label>
                    <div className="sm:col-span-2 flex gap-2">
                      <button onClick={saveYear} disabled={saving} className={btnPrimary}>{saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save</button>
                      <button onClick={() => setEditingYear(null)} className={btnGhost}><X size={14} /> Cancel</button>
                    </div>
                  </div>
                )}
                <div className="mt-4 space-y-2">
                  {years.map((y) => (
                    <div key={y.id} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3">
                      <img src={y.image_url} alt="" className="h-12 w-16 rounded object-cover shrink-0" />
                      <div className="flex-1 min-w-0"><p className="truncate text-sm font-medium">{y.year} - {y.title}</p><p className="truncate text-[11px] text-white/40">{y.subtitle}</p></div>
                      <button onClick={() => setEditingYear(y)} className="p-2 text-white/60 hover:text-white" aria-label="Edit"><Pencil size={15} /></button>
                      <button onClick={() => remove('timeline', y.id)} className="p-2 text-white/60 hover:text-red-400" aria-label="Delete"><Trash2 size={15} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'messages' && (
              <div>
                <h3 className="font-display text-2xl">Inbox - {messages.length}</h3>
                <div className="mt-4 space-y-3">
                  {messages.map((m) => (
                    <div key={m.id} className={'rounded-xl border p-4 ' + (m.read ? 'border-white/10 bg-white/[0.02]' : 'border-[#ff2b1f]/40 bg-[#ff2b1f]/[0.06]')}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm"><b>{m.name}</b> <span className="text-white/40">- {m.email}</span></p>
                        <span className="text-[11px] text-white/35">{new Date(m.created_at).toLocaleString()}</span>
                      </div>
                      <p className="mt-1 text-[13px] uppercase tracking-[0.18em] text-[#ffb3ab]">{m.subject}</p>
                      <p className="mt-2 text-sm text-white/70 whitespace-pre-wrap">{m.message}</p>
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => toggleRead(m)} className={btnGhost}>{m.read ? 'Mark unread' : 'Mark read'}</button>
                        <button onClick={() => remove('messages', m.id)} className={btnGhost}><Trash2 size={13} /> Delete</button>
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && <p className="text-white/40 text-sm">No messages yet — share the contact form to get the first one.</p>}
                </div>
              </div>
            )}

            {tab === 'testimonials' && (
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl">{testis.length} voices</h3>
                  <button onClick={() => setEditingTesti({ name: '', role: '', company: '', quote: '', avatar_url: '', rating: 5, featured: true })} className={btnPrimary}><Plus size={14} /> New voice</button>
                </div>
                {editingTesti && (
                  <div className="mt-4 rounded-xl border border-[#ff2b1f]/40 bg-white/[0.03] p-5 grid sm:grid-cols-2 gap-4">
                    <label className="block"><span className={labelCls}>Name *</span><input className={inputCls} value={editingTesti.name || ''} onChange={(e) => setEditingTesti({ ...editingTesti, name: e.target.value })} /></label>
                    <label className="block"><span className={labelCls}>Role</span><input className={inputCls} value={editingTesti.role || ''} onChange={(e) => setEditingTesti({ ...editingTesti, role: e.target.value })} /></label>
                    <label className="block"><span className={labelCls}>Company</span><input className={inputCls} value={editingTesti.company || ''} onChange={(e) => setEditingTesti({ ...editingTesti, company: e.target.value })} /></label>
                    <label className="block"><span className={labelCls}>Rating (1-5)</span><input type="number" min={1} max={5} className={inputCls} value={editingTesti.rating ?? 5} onChange={(e) => setEditingTesti({ ...editingTesti, rating: Number(e.target.value) })} /></label>
                    <label className="block sm:col-span-2"><span className={labelCls}>Quote *</span><textarea className={inputCls + ' resize-none'} rows={3} value={editingTesti.quote || ''} onChange={(e) => setEditingTesti({ ...editingTesti, quote: e.target.value })} /></label>
                    <div className="sm:col-span-2 flex gap-2">
                      <button onClick={saveTesti} disabled={saving} className={btnPrimary}>{saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save</button>
                      <button onClick={() => setEditingTesti(null)} className={btnGhost}><X size={14} /> Cancel</button>
                    </div>
                  </div>
                )}
                <div className="mt-4 space-y-2">
                  {testis.map((t) => (
                    <div key={t.id} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3">
                      <div className="flex-1 min-w-0"><p className="truncate text-sm font-medium">{t.name} <span className="text-white/35">- {t.company}</span></p><p className="truncate text-[12px] text-white/50">{t.quote}</p></div>
                      <button onClick={() => setEditingTesti(t)} className="p-2 text-white/60 hover:text-white" aria-label="Edit"><Pencil size={15} /></button>
                      <button onClick={() => remove('testimonials', t.id)} className="p-2 text-white/60 hover:text-red-400" aria-label="Delete"><Trash2 size={15} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
