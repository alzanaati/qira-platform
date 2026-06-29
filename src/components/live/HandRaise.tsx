'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Hand } from 'lucide-react';
interface HandRaiseProps { streamId: string; userId: string; isHost: boolean; }
export default function HandRaise({ streamId, userId, isHost }: HandRaiseProps) {
  const supabase = createClient();
  const [raised, setRaised] = useState(false);
  const [loading, setLoading] = useState(false);
  const toggle = async () => {
    if (isHost || loading) return;
    setLoading(true);
    try {
      if (!raised) {
        const { error } = await supabase.from('speaker_requests')
          .upsert({ stream_id: streamId, user_id: userId, status: 'pending' }, { onConflict: 'stream_id,user_id' });
        if (!error) setRaised(true);
      } else {
        await supabase.from('speaker_requests').delete().eq('stream_id', streamId).eq('user_id', userId).eq('status', 'pending');
        setRaised(false);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  if (isHost) return null;
  return (
    <button onClick={toggle} disabled={loading}
      title={raised ? 'إلغاء رفع اليد' : 'رفع اليد للتحدث'}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all disabled:opacity-50
        ${raised ? 'bg-yellow-500 hover:bg-yellow-600 text-white animate-pulse' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}>
      <Hand size={18} className={raised ? 'animate-bounce' : ''} />
      {raised ? 'يدك مرفوعة' : 'ارفع يدك'}
    </button>
  );
}
