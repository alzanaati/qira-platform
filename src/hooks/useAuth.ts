'use client'; import { useEffect, useState } from 'react'; import { createClient } from '@/lib/supabase/client'; import { User } from '@/types';
export function useAuth() {
  const [user, setUser] = useState<User|null>(null); const [loading, setLoading] = useState(true);
  useEffect(() => { const s = createClient(); s.auth.getUser().then(async({data:{user}})=>{ if(user){const{data}=await s.from('users').select('*').eq('id',user.id).single();setUser(data);} setLoading(false); }); }, []);
  return { user, loading };
}
