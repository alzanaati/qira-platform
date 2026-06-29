import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CLAP_PRICES } from '@/types';
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { streamId, receiverId, clapType } = await request.json();
  const amount = CLAP_PRICES[clapType as keyof typeof CLAP_PRICES];
  if (!amount) return NextResponse.json({ error: 'Invalid clap type' }, { status: 400 });
  const { data: wallet } = await supabase.from('wallets').select('balance').eq('user_id',user.id).single();
  if (!wallet || wallet.balance < amount) return NextResponse.json({ error: 'رصيدك غير كافٍ' }, { status: 400 });
  const { data, error } = await supabase.from('claps').insert({ stream_id:streamId, sender_id:user.id, receiver_id:receiverId, clap_type:clapType, amount }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
