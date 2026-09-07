import supabase from './db-client.js';

function isEmail(v) { return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(200);
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const b = req.body || {};
      if (!b.name || String(b.name).trim().length < 2) return res.status(400).json({ error: 'Please enter your name' });
      if (!isEmail(b.email)) return res.status(400).json({ error: 'Please enter a valid email' });
      if (!b.message || String(b.message).trim().length < 10) return res.status(400).json({ error: 'Message must be at least 10 characters' });
      const { data, error } = await supabase.from('messages').insert({
        name: String(b.name).trim().slice(0, 120),
        email: String(b.email).trim().slice(0, 160),
        subject: String(b.subject || 'New enquiry').slice(0, 200),
        message: String(b.message).trim().slice(0, 5000),
        read: false
      }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const b = req.body || {};
      if (!b.id) return res.status(400).json({ error: 'id is required' });
      const { data, error } = await supabase.from('messages').update({ read: !!b.read }).eq('id', b.id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const id = (req.body && req.body.id) || req.query.id;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { error } = await supabase.from('messages').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API messages error:', err);
    return res.status(500).json({ error: err.message });
  }
}
