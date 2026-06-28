import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import LiveRoomPage from '@/components/live/LiveRoomPage';

export default async function LivePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: stream } = await supabase
    .from('live_streams')
    .select('*, users(id,full_name,username,avatar_url,is_verified,role)')
    .eq('id', params.id)
    .single();
  if (!stream) notFound();
  const { data: profile } = await supabase.from('users').select('*').eq('id', user!.id).single();
  return <LiveRoomPage stream={stream} currentUser={profile} />;
}
