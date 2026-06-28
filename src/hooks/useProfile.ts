import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@/types';
export function useProfile(username?: string) {
  const supabase = createClient();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!username) { setLoading(false); return; }
    setLoading(true);
    supabase.from('users').select('*').eq('username', username).single()
      .then(({ data, error: err }) => { if (err) setError(err.message); else setProfile(data as User); setLoading(false); });
  }, [username]);
  return { profile, loading, error };
}