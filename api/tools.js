import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('tools').select('*').order('order_index', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const b = req.body || {};
      if (!b.name) return res.status(400).json({ error: 'name is required' });
      const { data, error } = await supabase.from('tools').insert({
        name: b.name,
        category: b.category || 'Craft',
        description: b.description || '',
        proficiency: Number(b.proficiency) || 80,
        icon_emoji: b.icon_emoji || '✨',
        color: b.color || '#ff2b1f',
        order_index: Number(b.order_index) || 0
      }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const b = req.body || {};
      if (!b.id) return res.status(400).json({ error: 'id is required' });
      const allowed = ['name','category','description','proficiency','icon_emoji','color','order_index'];
      const patch = {};
      for (const k of allowed) if (b[k] !== undefined) patch[k] = b[k];
      const { data, error } = await supabase.from('tools').update(patch).eq('id', b.id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const id = (req.body && req.body.id) || req.query.id;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { error } = await supabase.from('tools').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API tools error:', err);
    return res.status(500).json({ error: err.message });
  }
}
