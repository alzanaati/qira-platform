import { createClient } from '@/lib/supabase/server';
import ExploreClient from '@/components/feed/ExploreClient';

export default async function ExplorePage() {
  const supabase = createClient();
  const { data: streams } = await supabase
    .from('live_streams')
    .select('*, users(id,full_name,username,avatar_url,is_verified)')
    .eq('status', 'live')
    .order('viewer_count', { ascending: false })
    .limit(50);
  return <ExploreClient initialStreams={streams || []} />;
}
