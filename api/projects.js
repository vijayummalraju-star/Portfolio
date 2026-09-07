import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const q = req.query || {};
      if (q.id) {
        const { data, error } = await supabase.from('projects').select('*').eq('id', q.id).single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (q.slug) {
        const { data, error } = await supabase.from('projects').select('*').eq('slug', q.slug).single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      let query = supabase.from('projects').select('*').order('order_index', { ascending: true });
      if (q.category && q.category !== 'All') query = query.eq('category', q.category);
      if (q.featured === 'true') query = query.eq('featured', true);
      if (q.search) {
        const s = String(q.search).replace(/[%_,]/g, '');
        query = query.or('title.ilike.%' + s + '%,description.ilike.%' + s + '%,category.ilike.%' + s + '%');
      }
      if (q.limit) query = query.limit(Number(q.limit));
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const b = req.body || {};
      if (!b.title) return res.status(400).json({ error: 'title is required' });
      const slug = (b.slug || String(b.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36)).slice(0, 80);
      const { data, error } = await supabase.from('projects').insert({
        slug: slug,
        title: b.title,
        category: b.category || 'Design',
        description: b.description || '',
        long_description: b.long_description || b.description || '',
        image_url: b.image_url || '',
        tags: Array.isArray(b.tags) ? b.tags : [],
        year: Number(b.year) || 2026,
        featured: !!b.featured,
        client: b.client || '',
        role: b.role || '',
        link_url: b.link_url || '',
        views: 0,
        likes: 0,
        order_index: Number(b.order_index) || 0
      }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const b = req.body || {};
      if (!b.id) return res.status(400).json({ error: 'id is required' });
      if (b.action === 'view' || b.action === 'like' || b.action === 'unlike') {
        const cur = await supabase.from('projects').select('views,likes').eq('id', b.id).single();
        if (cur.error) throw cur.error;
        const patch = {};
        if (b.action === 'view') patch.views = (cur.data.views || 0) + 1;
        if (b.action === 'like') patch.likes = (cur.data.likes || 0) + 1;
        if (b.action === 'unlike') patch.likes = Math.max(0, (cur.data.likes || 0) - 1);
        const { data, error } = await supabase.from('projects').update(patch).eq('id', b.id).select().single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      const allowed = ['slug','title','category','description','long_description','image_url','tags','year','featured','client','role','link_url','views','likes','order_index'];
      const patch = {};
      for (const k of allowed) if (b[k] !== undefined) patch[k] = b[k];
      const { data, error } = await supabase.from('projects').update(patch).eq('id', b.id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const id = (req.body && req.body.id) || req.query.id;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API projects error:', err);
    return res.status(500).json({ error: err.message });
  }
}
