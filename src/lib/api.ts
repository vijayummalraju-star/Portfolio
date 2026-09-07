export interface Profile {
  id: number;
  display_name: string;
  full_name: string;
  tagline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  availability: boolean;
  roles: string[];
  socials: { label: string; url: string }[];
  hero_title: string;
  hero_subtitle: string;
  quote: string;
  showreel_url: string;
}

export interface ToolItem {
  id: number;
  name: string;
  category: string;
  description: string;
  proficiency: number;
  icon_emoji: string;
  color: string;
  order_index: number;
}

export interface TimelineYear {
  id: number;
  year: number;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  image_url: string;
  color: string;
  order_index: number;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  description: string;
  long_description: string;
  image_url: string;
  tags: string[];
  year: number;
  featured: boolean;
  client: string;
  role: string;
  link_url: string;
  views: number;
  likes: number;
  order_index: number;
}

export interface MessageItem {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar_url: string;
  rating: number;
  featured: boolean;
}

export interface Stats {
  projects: number;
  tools: number;
  years: number;
  testimonials: number;
  messages: number;
  unread: number;
  totalViews: number;
  totalLikes: number;
  featured: number;
  githubRepos?: number;
}

export interface GithubRepo {
  id: number;
  github_id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  homepage: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  open_issues: number;
  topics: string[];
  is_fork: boolean;
  is_archived: boolean;
  default_branch: string;
  pushed_at: string | null;
  repo_created_at: string | null;
  synced_at: string | null;
}

export interface GithubProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GithubPayload {
  profile: GithubProfile | null;
  repos: GithubRepo[];
  source: 'live' | 'cache';
  username: string;
  warning?: string;
}

/** Buttery cinematic easing shared by every scroll reveal */
export const CINEMA_EASE = [0.22, 1, 0.36, 1] as const;

async function handle<T>(res: Response): Promise<T> {
  const text = await res.text();
  let data: unknown = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const msg = (data as { error?: string })?.error || ('Request failed (' + res.status + ')');
    throw new Error(msg);
  }
  return data as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(path);
  return handle<T>(res);
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return handle<T>(res);
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return handle<T>(res);
}

export async function apiDelete<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return handle<T>(res);
}
