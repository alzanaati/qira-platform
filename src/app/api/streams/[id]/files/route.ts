import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data } = await supabase.from('stream_files').select('*').eq('stream_id',params.id).order('created_at',{ascending:false});
  return NextResponse.json({ data: data || [] });
}
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const { data, error } = await supabase.from('stream_files').insert({ stream_id:params.id, uploader_id:user.id, ...body }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await supabase.from('stream_content_state').upsert({ stream_id:params.id, content_type:body.file_type, file_id:data.id, current_page:0, zoom_level:1, screen_share_active:false, updated_at:new Date().toISOString() });
  return NextResponse.json({ data });
}
