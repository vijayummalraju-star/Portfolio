import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Star, GitFork, Loader2, RefreshCw, BookMarked, ArrowUpRight } from 'lucide-react';
import { apiGet, apiPost, CINEMA_EASE, type GithubPayload } from '../lib/api';

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Go: '#00ADD8',
  Rust: '#dea584',
  Dart: '#00B4AB',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
};

function langColor(l: string) {
  return LANG_COLORS[l] || '#ff2b1f';
}

function timeAgo(iso: string | null) {
  if (!iso) return '—';
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  if (s < 86400 * 30) return Math.floor(s / 86400) + 'd ago';
  if (s < 86400 * 365) return Math.floor(s / (86400 * 30)) + 'mo ago';
  return Math.floor(s / (86400 * 365)) + 'y ago';
}

export default function GithubSpotlight() {
  const [data, setData] = useState<GithubPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');

  const load = async (refresh = false) => {
    try {
      if (refresh) setSyncing(true);
      else {
        setLoading(true);
        setError('');
      }
      const d = await apiGet<GithubPayload>(refresh ? '/api/github?refresh=true' : '/api/github');
      setData(d);
      if (!d.repos.length && !d.profile) setError('NO_REPOS');
    } catch (e) {
      if (!refresh) setError(e instanceof Error ? e.message : 'GitHub is unreachable right now');
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const profile = data?.profile;
  const repos = (data?.repos || []).slice(0, 6);

  return (
    <section id="github" className="relative overflow-hidden bg-[#070606] py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(55% 40% at 50% 0%, rgba(255,43,31,0.13), transparent 70%)' }} />
      <div className="pointer-events-none absolute inset-0 film-grain opacity-25" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 44 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [...CINEMA_EASE] }}
          className="reveal-smooth overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
        >
          <div className="grid items-stretch lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            {/* Portrait side — Vijay, named + credited */}
            <div className="relative min-h-[420px] overflow-hidden lg:min-h-[560px]">
              <motion.img
                src="/jog.png"
                alt="Vijay Ummalraju — portrait"
                className="absolute inset-0 h-full w-full object-cover object-top"
                loading="lazy"
                initial={{ scale: 1.12 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 1.6, ease: [...CINEMA_EASE] }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
              <div className="absolute inset-0" style={{ background: 'radial-gradient(70% 45% at 50% 88%, rgba(255,43,31,0.28), transparent 70%)' }} />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="text-[11px] uppercase tracking-[0.4em] text-[#ffb3ab]">The artist — on camera</p>
                <h3 className="mt-2 font-display text-4xl leading-none text-white sm:text-5xl">
                  VIJAY
                  <span className="block text-transparent outline-text">UMMALRAJU</span>
                </h3>
                <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-white/65">
                  Designer, creative developer, storyteller — the face behind every frame of this portfolio.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <a
                    href="https://github.com/vijayummalraju-star"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-[#ffb3ab]"
                  >
                    <Github size={14} /> @vijayummalraju-star
                  </a>
                  {profile && (
                    <span className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-black/60 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white/70 backdrop-blur">
                      <span><b className="text-white">{profile.followers}</b> followers</span>
                      <span><b className="text-white">{profile.public_repos}</b> repos</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* GitHub side */}
            <div className="p-6 sm:p-10">
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.4em] text-[#ff6a5e]">
                <Github size={14} /> Scene — Open Source · Live from GitHub
              </p>
              <h2 className="mt-3 font-display text-3xl text-[#f5f1e8] sm:text-5xl">Code, in the open.</h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/55">
                Public profile and repositories for <b className="text-white">Vijay Ummalraju</b>, synced from GitHub into the studio
                database and refreshed automatically.
              </p>

              {loading ? (
                <div className="mt-10 flex items-center gap-3 py-14 text-white/60">
                  <Loader2 className="animate-spin" /> Pulling the latest from GitHub…
                </div>
              ) : error === 'NO_REPOS' ? (
                <div className="mt-10 rounded-xl border border-white/10 bg-black/40 p-8 text-center">
                  <BookMarked size={28} className="mx-auto text-[#ff6a5e]" />
                  <p className="mt-3 font-display text-2xl text-white">The repo shelf is empty — for now.</p>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-white/55">
                    This GitHub account has no public repositories yet. New work lands here automatically the moment it is pushed.
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-3">
                    <a href="https://github.com/vijayummalraju-star" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#ff2b1f] px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-black hover:bg-[#ff4a3d]">
                      <Github size={14} /> Visit GitHub
                    </a>
                    <button onClick={() => load(true)} disabled={syncing} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2.5 text-[12px] uppercase tracking-[0.2em] text-white hover:border-white/60 disabled:opacity-60">
                      {syncing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Re-sync
                    </button>
                  </div>
                </div>
              ) : error ? (
                <div className="mt-10 rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-200">
                  {error} <button onClick={() => load()} className="ml-2 underline">Retry</button>
                </div>
              ) : (
                <>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {repos.map((r, i) => (
                      <motion.a
                        key={r.github_id || r.name}
                        href={r.html_url}
                        target="_blank"
                        rel="noreferrer"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.7, delay: (i % 2) * 0.1, ease: [...CINEMA_EASE] }}
                        className="motion-card group rounded-xl border border-white/10 bg-black/50 p-5 transition-colors hover:border-[#ff2b1f]/50 hover:bg-black/70"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="truncate font-display text-lg tracking-wide text-white group-hover:text-[#ffb3ab]">
                            {r.name}
                          </p>
                          <ArrowUpRight size={15} className="shrink-0 text-white/30 transition-colors group-hover:text-[#ff2b1f]" />
                        </div>
                        <p className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-[13px] leading-relaxed text-white/55">
                          {r.description || 'No description yet — the code speaks for itself.'}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-white/50">
                          {r.language && (
                            <span className="inline-flex items-center gap-1.5">
                              <span className="h-2.5 w-2.5 rounded-full" style={{ background: langColor(r.language) }} />
                              {r.language}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1"><Star size={12} /> {r.stargazers_count}</span>
                          <span className="inline-flex items-center gap-1"><GitFork size={12} /> {r.forks_count}</span>
                          <span className="ml-auto text-[11px] text-white/35">pushed {timeAgo(r.pushed_at)}</span>
                        </div>
                        {(r.topics?.length ?? 0) > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {r.topics.slice(0, 3).map((t) => (
                              <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white/50">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.a>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={async () => {
                        setSyncing(true);
                        try {
                          await apiPost('/api/github', {});
                          await load(true);
                        } catch {
                          setSyncing(false);
                        }
                      }}
                      disabled={syncing}
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-white/75 hover:border-white/60 hover:text-white disabled:opacity-60"
                    >
                      {syncing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                      {data?.source === 'live' ? 'Synced live' : 'Sync now'}
                    </button>
                    <a href="https://github.com/vijayummalraju-star?tab=repositories" target="_blank" rel="noreferrer" className="text-[11px] uppercase tracking-[0.24em] text-white/50 hover:text-white">
                      All repositories →
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
