'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push('/feed');
    router.refresh();
  };

  return (
    <div className="w-full max-w-md bg-white/[0.04] border border-white/[0.08] rounded-3xl p-8">
      <h1 className="text-3xl font-black text-center text-gradient mb-1">Ø§ÙØ±Ø£</h1>
      <p className="text-center text-[#666] text-sm mb-6">ÙÙØµØ© Ø§ÙÙØ¹Ø±ÙØ© Ø§ÙØ¹Ø±Ø¨ÙØ©</p>
      {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 text-red-400 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#777] mb-2">Ø§ÙØ¨Ø±ÙØ¯ Ø§ÙØ¥ÙÙØªØ±ÙÙÙ</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@example.com" required
            className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-500 transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#777] mb-2">ÙÙÙØ© Ø§ÙÙØ±ÙØ±</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="â¢â¢â¢â¢â¢â¢â¢â¢" required minLength={6}
            className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-500 transition-colors" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full gradient-purple text-white font-bold py-3 rounded-xl mt-2 disabled:opacity-50 transition-opacity">
          {loading ? 'Ø¬Ø§Ø±Ù Ø§ÙØ¯Ø®ÙÙ...' : 'Ø¯Ø®ÙÙ'}
        </button>
      </form>
      <p className="text-center text-sm text-[#666] mt-4">
        ÙÙØ³ ÙØ¯ÙÙ Ø­Ø³Ø§Ø¨Ø{' '}
        <Link href="/register" className="text-purple-400 hover:text-purple-300">Ø¥ÙØ´Ø§Ø¡ Ø­Ø³Ø§Ø¨</Link>
      </p>
    </div>
  );
}
