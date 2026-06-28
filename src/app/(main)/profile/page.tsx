import { createClient } from '@/lib/supabase/server';
import ProfileClient from '@/components/profile/ProfileClient';

export default async function MyProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('users').select('*').eq('id', user!.id).single();
  return <ProfileClient profile={profile} currentUser={profile} isOwn={true} />;
}
