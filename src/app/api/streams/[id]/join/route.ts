import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data: existing } = await supabase.from('stream_participants').select('id').eq('stream_id',params.id).eq('user_id',user.id).single();
  if (!existing) {
    await supabase.from('stream_participants').insert({ stream_id:params.id, user_id:user.id, role:'viewer', joined_at:new Date().toISOString() });
    await supabase.from('live_streams').update({ viewer_count: supabase.rpc('increment',{x:1}) as any }).eq('id',params.id);
  }
  return NextResponse.json({ success: true });
}
