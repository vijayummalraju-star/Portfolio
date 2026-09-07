import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('testimonials').select('*').order('id', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const b = req.body || {};
      if (!b.name || !b.quote) return res.status(400).json({ error: 'name and quote are required' });
      const { data, error } = await supabase.from('testimonials').insert({
        name: b.name,
        role: b.role || '',
        company: b.company || '',
        quote: b.quote,
        avatar_url: b.avatar_url || '',
        rating: Number(b.rating) || 5,
        featured: !!b.featured
      }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const b = req.body || {};
      if (!b.id) return res.status(400).json({ error: 'id is required' });
      const allowed = ['name','role','company','quote','avatar_url','rating','featured'];
      const patch = {};
      for (const k of allowed) if (b[k] !== undefined) patch[k] = b[k];
      const { data, error } = await supabase.from('testimonials').update(patch).eq('id', b.id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const id = (req.body && req.body.id) || req.query.id;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API testimonials error:', err);
    return res.status(500).json({ error: err.message });
  }
}
