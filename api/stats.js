import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const results = await Promise.all([
      supabase.from('projects').select('id,views,likes,featured'),
      supabase.from('tools').select('id'),
      supabase.from('timeline_years').select('id'),
      supabase.from('messages').select('id,read'),
      supabase.from('testimonials').select('id'),
      supabase.from('github_repos').select('id')
    ]);
    for (const r of results) if (r.error) throw r.error;
    const projects = results[0].data || [];
    const messages = results[3].data || [];
    let totalViews = 0, totalLikes = 0, featured = 0;
    for (const p of projects) {
      totalViews += p.views || 0;
      totalLikes += p.likes || 0;
      if (p.featured) featured += 1;
    }
    return res.status(200).json({
      projects: projects.length,
      tools: (results[1].data || []).length,
      years: (results[2].data || []).length,
      testimonials: (results[4].data || []).length,
      messages: messages.length,
      unread: messages.filter(function (m) { return !m.read; }).length,
      totalViews: totalViews,
      totalLikes: totalLikes,
      featured: featured,
      githubRepos: ((results[5] && results[5].data) || []).length
    });
  } catch (err) {
    console.error('API stats error:', err);
    return res.status(500).json({ error: err.message });
  }
}
