import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data, error } = await supabase.from('speaker_requests').insert({ stream_id:params.id, user_id:user.id, status:'pending', created_at:new Date().toISOString() }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { requestId, status, userId } = await request.json();
  await supabase.from('speaker_requests').update({ status, responded_at:new Date().toISOString() }).eq('id',requestId);
  if (status === 'approved') await supabase.from('stream_participants').update({ role:'speaker' }).eq('stream_id',params.id).eq('user_id',userId);
  return NextResponse.json({ success: true });
}
