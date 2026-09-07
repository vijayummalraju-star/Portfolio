import supabase from './db-client.js';

const USERNAME = 'vijayummalraju-star';
const GH_API = 'https://api.github.com/users/' + USERNAME;
const GH_HEADERS = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'vijay-portfolio',
  ...(process.env.GITHUB_TOKEN ? { Authorization: 'Bearer ' + process.env.GITHUB_TOKEN } : {}),
};

async function ghFetch(url) {
  const r = await fetch(url, { headers: GH_HEADERS });
  if (r.status === 404) return null;
  if (!r.ok) {
    const t = await r.text().catch(() => '');
    throw new Error('GitHub API ' + r.status + ': ' + t.slice(0, 200));
  }
  return r.json();
}

function mapRepo(r) {
  return {
    github_id: r.id,
    name: r.name,
    full_name: r.full_name,
    description: r.description || '',
    html_url: r.html_url,
    homepage: r.homepage || '',
    language: r.language || '',
    stargazers_count: r.stargazers_count || 0,
    forks_count: r.forks_count || 0,
    open_issues: r.open_issues_count || 0,
    topics: Array.isArray(r.topics) ? r.topics : [],
    is_fork: !!r.fork,
    is_archived: !!r.archived,
    default_branch: r.default_branch || 'main',
    pushed_at: r.pushed_at || null,
    repo_created_at: r.created_at || null,
    synced_at: new Date().toISOString(),
  };
}

async function syncFromGitHub() {
  const [profile, repos] = await Promise.all([
    ghFetch(GH_API),
    ghFetch(GH_API + '/repos?sort=updated&per_page=100&type=owner'),
  ]);
  const list = Array.isArray(repos) ? repos.filter((r) => !r.fork || true) : [];
  const rows = list.map(mapRepo);
  if (rows.length) {
    // Replace the cache wholesale (avoids needing a UNIQUE constraint for upsert)
    const { error: delError } = await supabase.from('github_repos').delete().neq('id', 0);
    if (delError) throw delError;
    for (let i = 0; i < rows.length; i += 50) {
      const chunk = rows.slice(i, i + 50);
      const { error } = await supabase.from('github_repos').insert(chunk);
      if (error) throw error;
    }
  }
  return { profile, rows };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'POST') {
      const { profile, rows } = await syncFromGitHub();
      if (!profile) return res.status(404).json({ error: 'GitHub user not found: ' + USERNAME });
      return res.status(200).json({ profile, repos: rows, synced: rows.length, source: 'live' });
    }
    if (req.method === 'GET') {
      const force = (req.query && req.query.refresh === 'true') || false;
      const { data: cached, error } = await supabase
        .from('github_repos')
        .select('*')
        .order('pushed_at', { ascending: false, nullsFirst: false })
        .limit(100);
      if (error) throw error;
      const stale = !cached || !cached.length || force || (cached[0] && cached[0].synced_at && Date.now() - new Date(cached[0].synced_at).getTime() > 6 * 3600 * 1000);
      if (stale) {
        try {
          const { profile, rows } = await syncFromGitHub();
          if (!profile && (!cached || !cached.length)) return res.status(404).json({ error: 'GitHub user not found: ' + USERNAME });
          const { data: fresh } = await supabase.from('github_repos').select('*').order('pushed_at', { ascending: false, nullsFirst: false }).limit(100);
          return res.status(200).json({ profile, repos: fresh && fresh.length ? fresh : rows, source: 'live', username: USERNAME });
        } catch (e) {
          if (cached && cached.length) {
            let profile = null;
            try { profile = await ghFetch(GH_API); } catch { profile = null; }
            return res.status(200).json({ profile, repos: cached, source: 'cache', username: USERNAME, warning: e.message });
          }
          throw e;
        }
      }
      let profile = null;
      try { profile = await ghFetch(GH_API); } catch { profile = null; }
      return res.status(200).json({ profile, repos: cached, source: 'cache', username: USERNAME });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API github error:', err);
    return res.status(500).json({ error: err.message });
  }
}
