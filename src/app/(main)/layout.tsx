import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import MainLayoutClient from '@/components/layout/MainLayoutClient';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();
  return <MainLayoutClient user={profile}>{children}</MainLayoutClient>;
}
