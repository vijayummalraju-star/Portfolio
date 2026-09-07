import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('profile').select('*').order('id', { ascending: true }).limit(1);
      if (error) throw error;
      return res.status(200).json(data && data[0] ? data[0] : null);
    }
    if (req.method === 'POST') {
      const body = req.body || {};
      const payload = {
        display_name: body.display_name || 'VIJAY',
        full_name: body.full_name || 'Vijay Ummalraju',
        tagline: body.tagline || '',
        bio: body.bio || '',
        email: body.email || '',
        phone: body.phone || '',
        location: body.location || '',
        availability: body.availability !== undefined ? !!body.availability : true,
        roles: Array.isArray(body.roles) ? body.roles : [],
        socials: body.socials !== undefined ? body.socials : [],
        hero_title: body.hero_title || '',
        hero_subtitle: body.hero_subtitle || '',
        quote: body.quote || '',
        showreel_url: body.showreel_url || ''
      };
      const { data, error } = await supabase.from('profile').insert(payload).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const body = req.body || {};
      const { id, ...rest } = body;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const allowed = ['display_name','full_name','tagline','bio','email','phone','location','availability','roles','socials','hero_title','hero_subtitle','quote','showreel_url'];
      const patch = {};
      for (const k of allowed) if (rest[k] !== undefined) patch[k] = rest[k];
      patch['updated_at'] = new Date().toISOString();
      const { data, error } = await supabase.from('profile').update(patch).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API profile error:', err);
    return res.status(500).json({ error: err.message });
  }
}
