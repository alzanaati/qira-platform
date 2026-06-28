import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ProfileClient from '@/components/profile/ProfileClient';

export default async function UserProfilePage({ params }: { params: { username: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('users').select('*').eq('username', params.username).single();
  if (!profile) notFound();
  const { data: currentUser } = await supabase.from('users').select('*').eq('id', user!.id).single();
  const isOwn = user?.id === profile.id;
  return <ProfileClient profile={profile} currentUser={currentUser} isOwn={isOwn} />;
}
