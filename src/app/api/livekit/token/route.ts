import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateToken, generateRoomName } from '@/lib/livekit';

export async function POST(request: NextRequest) {
  try {
    const { streamId } = await request.json();
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data: profile } = await supabase.from('users').select('full_name').eq('id', user.id).single();
    const { data: stream } = await supabase.from('live_streams').select('user_id').eq('id', streamId).single();
    const isHost = stream?.user_id === user.id;
    const { data: participant } = await supabase.from('stream_participants').select('role').eq('stream_id', streamId).eq('user_id', user.id).single();
    const canPublish = isHost || participant?.role === 'speaker';
    const roomName = generateRoomName(streamId);
    const token = await generateToken(roomName, user.id, profile?.full_name || user.id, canPublish);
    return NextResponse.json({ token, roomName, wsUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
