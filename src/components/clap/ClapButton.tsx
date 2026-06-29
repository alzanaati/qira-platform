'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
interface ClapButtonProps {
  streamId: string;
  hostId: string;
  clapType: 'bronze' | 'silver' | 'gold' | 'diamond';
  price: number;
  emoji: string;
  onClap: () => void;
}
export default function ClapButton({ streamId, hostId, clapType, price, emoji, onClap }: ClapButtonProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const handleClap = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: wallet } = await supabase.from('wallets').select('balance').eq('user_id', user.id).single();
      if (!wallet || wallet.balance < price) { alert('رصيدك غير كافٍ'); return; }
      const { error } = await supabase.from('claps').insert({
        stream_id: streamId,
        clapper_id: user.id,
        recipient_id: hostId,
        clap_type: clapType,
        amount: price,
      });
      if (!error) {
        setSuccess(true);
        onClap();
        setTimeout(() => setSuccess(false), 1000);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  return (
    <button onClick={handleClap} disabled={loading}
      className={`flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all disabled:opacity-50
        ${success ? 'bg-yellow-500/20 border-yellow-400 scale-110' : 'bg-gray-800/80 border-gray-600 hover:border-yellow-400 hover:bg-yellow-500/10 active:scale-95'}`}>
      <span className="text-2xl">{emoji}</span>
      <span className="text-white text-xs font-medium">{price} ر.س</span>
    </button>
  );
}
