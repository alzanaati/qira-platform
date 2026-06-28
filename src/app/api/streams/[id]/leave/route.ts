import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await supabase.from('stream_participants').delete().eq('stream_id',params.id).eq('user_id',user.id);
  const { count } = await supabase.from('stream_participants').select('*',{count:'exact',head:true}).eq('stream_id',params.id);
  await supabase.from('live_streams').update({ viewer_count: Math.max(0, count || 0) }).eq('id',params.id);
  return NextResponse.json({ success: true });
}
