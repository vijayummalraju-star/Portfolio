import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle2, AlertCircle, Mail, MapPin, Phone } from 'lucide-react';
import { apiGet, apiPost, CINEMA_EASE, type Profile } from '../lib/api';

const EASE = [...CINEMA_EASE] as unknown as [number, number, number, number];

export default function Contact() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => { apiGet<Profile | null>('/api/profile').then((p) => setProfile(p)).catch(() => {}); }, []);

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = 'Please enter your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (form.message.trim().length < 10) e.message = 'Tell me a little more (10+ characters)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setApiError('');
    if (!validate()) return;
    setSending(true);
    try {
      await apiPost('/api/messages', { ...form, subject: form.subject || ('New enquiry from ' + form.name) });
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (e) { setApiError(e instanceof Error ? e.message : 'Something went wrong'); }
    finally { setSending(false); }
  };

  const inputCls = (bad?: string) => 'w-full rounded-lg border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors ' + (bad ? 'border-red-500/70' : 'border-white/15 focus:border-[#ff2b1f]/70');

  return (
    <section id="contact" className="relative bg-[#0b0908] py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(50% 40% at 50% 100%, rgba(255,43,31,0.14), transparent 70%)' }} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12">
        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#ff6a5e]">Final scene - Contact</p>
          <h2 className="mt-3 font-display text-4xl sm:text-6xl text-[#f5f1e8] leading-[0.95]">Let&apos;s make<br />something <span className="text-[#ff2b1f]">loud.</span></h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60">{profile?.bio || 'Open for freelance, collaborations and full-time roles. Tell me about your story — I will bring the cinema.'}</p>
          <div className="mt-8 space-y-4 text-sm">
            <p className="flex items-center gap-3 text-white/75"><Mail size={16} className="text-[#ff2b1f]" /> {profile?.email || 'hello@vijayummalraju.studio'}</p>
            <p className="flex items-center gap-3 text-white/75"><Phone size={16} className="text-[#ff2b1f]" /> {profile?.phone || '+91 90000 00000'}</p>
            <p className="flex items-center gap-3 text-white/75"><MapPin size={16} className="text-[#ff2b1f]" /> {profile?.location || 'Hyderabad - India'}</p>
          </div>
          {(profile?.socials && profile.socials.length > 0) && (
            <div className="mt-6 flex flex-wrap gap-2">
              {profile.socials.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-white/65 hover:border-[#ff2b1f]/70 hover:text-white transition-colors">{s.label}</a>
              ))}
            </div>
          )}
          <blockquote className="mt-10 border-l-2 border-[#ff2b1f] pl-5 font-display text-2xl leading-snug text-white/90">
            &ldquo;{profile?.quote || 'Good design smokes louder.'}&rdquo;
          </blockquote>
        </div>
        <motion.div initial={{ opacity: 0, y: 44 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.9, ease: EASE }} className="reveal-smooth rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur">
          {sent ? (
            <div className="py-10 text-center">
              <CheckCircle2 size={44} className="mx-auto text-emerald-400" />
              <h3 className="mt-4 font-display text-2xl text-white">Cut! Message received.</h3>
              <p className="mt-2 text-sm text-white/60">Thanks for reaching out — I usually reply within 24 hours.</p>
              <button onClick={() => setSent(false)} className="mt-6 rounded-full border border-white/20 px-6 py-2.5 text-[12px] uppercase tracking-[0.2em] text-white hover:border-white/60">Send another</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <h3 className="font-display text-2xl text-white">Roll the cameras</h3>
              <p className="mt-1 text-[13px] text-white/50">This form writes straight into the studio inbox database.</p>
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div>
                  <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name *" className={inputCls(errors.name)} />
                  {errors.name && <p className="mt-1 text-[12px] text-red-300">{errors.name}</p>}
                </div>
                <div>
                  <input value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="Email *" type="email" className={inputCls(errors.email)} />
                  {errors.email && <p className="mt-1 text-[12px] text-red-300">{errors.email}</p>}
                </div>
              </div>
              <div className="mt-4">
                <input value={form.subject} onChange={(e) => set('subject', e.target.value)} placeholder="Subject (e.g. Brand film website)" className={inputCls()} />
              </div>
              <div className="mt-4">
                <textarea value={form.message} onChange={(e) => set('message', e.target.value)} placeholder="Your story, timeline, budget... *" rows={5} className={inputCls(errors.message) + ' resize-none'} />
                {errors.message && <p className="mt-1 text-[12px] text-red-300">{errors.message}</p>}
              </div>
              {apiError && <p className="mt-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-200"><AlertCircle size={15} /> {apiError}</p>}
              <button type="submit" disabled={sending} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ff2b1f] px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.24em] text-black hover:bg-[#ff4a3d] disabled:opacity-60 transition-colors">
                {sending ? <><Loader2 size={15} className="animate-spin" /> Sending...</> : <><Send size={15} /> Send message</>}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
