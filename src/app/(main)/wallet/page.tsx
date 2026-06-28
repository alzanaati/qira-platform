import { createClient } from '@/lib/supabase/server';
import WalletClient from '@/components/wallet/WalletClient';

export default async function WalletPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [walletRes, clapsEarnedRes, clapsSpentRes] = await Promise.all([
    supabase.from('wallets').select('*').eq('user_id', user!.id).single(),
    supabase.from('claps').select('*, sender:sender_id(full_name,username,avatar_url), stream:stream_id(title)').eq('receiver_id', user!.id).order('created_at', { ascending: false }).limit(50),
    supabase.from('claps').select('*, receiver:receiver_id(full_name,username,avatar_url), stream:stream_id(title)').eq('sender_id', user!.id).order('created_at', { ascending: false }).limit(50),
  ]);
  return <WalletClient wallet={walletRes.data} earned={clapsEarnedRes.data || []} spent={clapsSpentRes.data || []} />;
}
