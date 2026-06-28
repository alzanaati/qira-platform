import { createClient } from '@/lib/supabase/server';
import CreateLiveClient from '@/components/live/CreateLiveClient';

export default async function CreateLivePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('users').select('*').eq('id', user!.id).single();
  return <CreateLiveClient currentUser={profile} />;
}
