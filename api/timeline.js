import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('timeline_years').select('*').order('year', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const b = req.body || {};
      if (!b.year) return res.status(400).json({ error: 'year is required' });
      const { data, error } = await supabase.from('timeline_years').insert({
        year: Number(b.year),
        title: b.title || '',
        subtitle: b.subtitle || '',
        description: b.description || '',
        highlights: Array.isArray(b.highlights) ? b.highlights : [],
        image_url: b.image_url || '',
        color: b.color || '#ff2b1f',
        order_index: Number(b.order_index) || Number(b.year)
      }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const b = req.body || {};
      if (!b.id) return res.status(400).json({ error: 'id is required' });
      const allowed = ['year','title','subtitle','description','highlights','image_url','color','order_index'];
      const patch = {};
      for (const k of allowed) if (b[k] !== undefined) patch[k] = b[k];
      const { data, error } = await supabase.from('timeline_years').update(patch).eq('id', b.id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const id = (req.body && req.body.id) || req.query.id;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { error } = await supabase.from('timeline_years').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API timeline error:', err);
    return res.status(500).json({ error: err.message });
  }
}
