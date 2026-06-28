import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateRoomName } from '@/lib/livekit';

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  let q = supabase.from('live_streams').select('*, users(id,full_name,username,avatar_url,is_verified)').eq('status','live').order('viewer_count',{ascending:false}).limit(50);
  if (category && category !== 'all') q = q.eq('category', category);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const streamId = crypto.randomUUID();
  const roomName = generateRoomName(streamId);
  const { data, error } = await supabase.from('live_streams').insert({
    id: streamId, user_id: user.id, title: body.title, description: body.description,
    category: body.category || 'educational', status: 'live',
    allow_screen_share: body.allow_screen_share ?? true,
    allow_file_share: body.allow_file_share ?? true,
    livekit_room_name: roomName, viewer_count: 0, clap_count: 0,
    started_at: new Date().toISOString(),
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await supabase.from('stream_participants').insert({ stream_id: streamId, user_id: user.id, role: 'host', joined_at: new Date().toISOString() });
  await supabase.from('stream_content_state').insert({ stream_id: streamId, content_type: 'none', current_page: 0, zoom_level: 1, screen_share_active: false });
  return NextResponse.json({ data });
}
