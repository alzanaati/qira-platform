import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { targetId } = await request.json();
  const { data: existing } = await supabase.from('follows').select('id').eq('follower_id',user.id).eq('following_id',targetId).single();
  if (existing) {
    await supabase.from('follows').delete().eq('follower_id',user.id).eq('following_id',targetId);
    return NextResponse.json({ following: false });
  }
  await supabase.from('follows').insert({ follower_id:user.id, following_id:targetId });
  return NextResponse.json({ following: true });
}
