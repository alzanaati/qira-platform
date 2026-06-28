import { createClient } from '@/lib/supabase/server';
import FeedClient from '@/components/feed/FeedClient';

export default async function FeedPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: streams } = await supabase
    .from('live_streams')
    .select('*, users(id,full_name,username,avatar_url,is_verified,role)')
    .eq('status', 'live')
    .order('started_at', { ascending: false })
    .limit(20);
  const { data: profile } = await supabase.from('users').select('*').eq('id', user!.id).single();
  return <FeedClient initialStreams={streams || []} currentUser={profile} />;
}
