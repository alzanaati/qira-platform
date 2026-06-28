'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterForm() {
  const [form, setForm] = useState({ email: '', password: '', full_name: '', username: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();
  const set = (k: string, v: string) => setForm(f => ({...f, [k]: v}));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');

    try {
      console.log('[RegisterForm] Attempting signUp with email:', form.email);

      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.full_name, username: form.username } }
      });

      console.log('[RegisterForm] signUp response:', { data, error: authError });

      if (authError) {
        console.error('[RegisterForm] Supabase Auth Error:', authError);
        console.error('[RegisterForm] Auth Error message:', authError.message);
        console.error('[RegisterForm] Auth Error status:', authError.status);
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        console.log('[RegisterForm] User created:', data.user.id);

        const { error: insertUserError } = await supabase.from('users').insert({
          id: data.user.id,
          email: form.email,
          full_name: form.full_name,
          username: form.username,
          role: 'user',
          is_verified: false,
          is_active: true
        });

        if (insertUserError) {
          console.error('[RegisterForm] DB insert users error:', insertUserError);
          console.error('[RegisterForm] DB insert users error message:', insertUserError.message);
          console.error('[RegisterForm] DB insert users error code:', insertUserError.code);
          console.error('[RegisterForm] DB insert users error details:', insertUserError.details);
          console.error('[RegisterForm] DB insert users error hint:', insertUserError.hint);
          setError('DB Error (users): ' + insertUserError.message + ' | code: ' + insertUserError.code);
          setLoading(false);
          return;
        }

        const { error: insertWalletError } = await supabase.from('wallets').insert({
          user_id: data.user.id,
          balance: 0,
          total_earned: 0,
          total_spent: 0
        });

        if (insertWalletError) {
          console.error('[RegisterForm] DB insert wallets error:', insertWalletError);
          console.error('[RegisterForm] DB insert wallets error message:', insertWalletError.message);
          console.error('[RegisterForm] DB insert wallets error code:', insertWalletError.code);
          setError('DB Error (wallets): ' + insertWalletError.message + ' | code: ' + insertWalletError.code);
          setLoading(false);
          return;
        }

        console.log('[RegisterForm] Registration complete â redirecting to /feed');
        router.push('/feed');
        router.refresh();
      } else {
        console.warn('[RegisterForm] signUp returned no user and no error. data:', data);
        setError('ØªØ­ÙÙ ÙÙ Ø¨Ø±ÙØ¯Ù Ø§ÙØ¥ÙÙØªØ±ÙÙÙ ÙØªØ£ÙÙØ¯ Ø§ÙØªØ³Ø¬ÙÙ');
        setLoading(false);
      }
    } catch (unexpectedError: unknown) {
      const err = unexpectedError as Error;
      console.error('[RegisterForm] UNEXPECTED EXCEPTION:', err);
      console.error('[RegisterForm] UNEXPECTED message:', err?.message);
      console.error('[RegisterForm] UNEXPECTED stack:', err?.stack);
      setError('Exception: ' + (err?.message ?? String(unexpectedError)));
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/[0.04] border border-white/[0.08] rounded-3xl p-8">
      <h1 className="text-3xl font-black text-center text-gradient mb-1">Ø§ÙØ±Ø£</h1>
      <p className="text-center text-[#666] text-sm mb-6">Ø¥ÙØ´Ø§Ø¡ Ø­Ø³Ø§Ø¨ Ø¬Ø¯ÙØ¯</p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 text-red-400 text-sm font-mono whitespace-pre-wrap break-all">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Ø§ÙØ§Ø³Ù Ø§ÙÙØ§ÙÙ"
          value={form.full_name}
          onChange={e => set('full_name', e.target.value)}
          required
          className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-[#555] outline-none focus:border-purple-500/50 text-sm"
        />
        <input
          type="text"
          placeholder="Ø§Ø³Ù Ø§ÙÙØ³ØªØ®Ø¯Ù"
          value={form.username}
          onChange={e => set('username', e.target.value)}
          required
          className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-[#555] outline-none focus:border-purple-500/50 text-sm"
        />
        <input
          type="email"
          placeholder="Ø§ÙØ¨Ø±ÙØ¯ Ø§ÙØ¥ÙÙØªØ±ÙÙÙ"
          value={form.email}
          onChange={e => set('email', e.target.value)}
          required
          className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-[#555] outline-none focus:border-purple-500/50 text-sm"
        />
        <input
          type="password"
          placeholder="ÙÙÙØ© Ø§ÙÙØ±ÙØ±"
          value={form.password}
          onChange={e => set('password', e.target.value)}
          required
          minLength={6}
          className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-[#555] outline-none focus:border-purple-500/50 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl py-3 font-bold text-sm disabled:opacity-50 hover:opacity-90 transition"
        >
          {loading ? 'Ø¬Ø§Ø±Ù Ø§ÙØªØ³Ø¬ÙÙ...' : 'Ø¥ÙØ´Ø§Ø¡ Ø­Ø³Ø§Ø¨'}
        </button>
      </form>

      <p className="text-center text-[#666] text-sm mt-4">
        ÙØ¯ÙÙ Ø­Ø³Ø§Ø¨Ø{' '}
        <Link href="/login" className="text-purple-400 hover:text-purple-300">ØªØ³Ø¬ÙÙ Ø§ÙØ¯Ø®ÙÙ</Link>
      </p>
    </div>
  );
}
