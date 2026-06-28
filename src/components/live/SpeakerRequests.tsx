'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Check, X, Hand } from 'lucide-react';
interface SpeakerRequest { id: string; user_id: string; status: string; users?: { username: string; avatar_url?: string }; }
interface SpeakerRequestsProps { streamId: string; isHost: boolean; onApprove?: (userId: string) => void; }
export default function SpeakerRequests({ streamId, isHost, onApprove }: SpeakerRequestsProps) {
  const supabase = createClient();
  const [requests, setRequests] = useState<SpeakerRequest[]>([]);
  useEffect(() => {
    if (!isHost) return;
    supabase.from('speaker_requests').select('*, users(username,avatar_url)').eq('stream_id', streamId).eq('status', 'pending')
      .then(({ data }) => { if (data) setRequests(data as SpeakerRequest[]); });
    const ch = supabase.channel('sr-' + streamId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'speaker_requests', filter: 'stream_id=eq.' + streamId },
        async (payload: any) => {
          if (payload.eventType === 'INSERT' && payload.new.status === 'pending') {
            const { data } = await supabase.from('users').select('username,avatar_url').eq('id', payload.new.user_id).single();
            setRequests(prev => [...prev, { ...payload.new, users: data }]);
          } else if (payload.eventType === 'UPDATE' || payload.eventType === 'DELETE') {
            setRequests(prev => prev.filter(r => r.id !== (payload.new?.id || payload.old?.id)));
          }
        }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [streamId, isHost]);
  const handleRequest = async (req: SpeakerRequest, approve: boolean) => {
    const status = approve ? 'approved' : 'rejected';
    await supabase.from('speaker_requests').update({ status }).eq('id', req.id);
    setRequests(prev => prev.filter(r => r.id !== req.id));
    if (approve && onApprove) onApprove(req.user_id);
  };
  if (!isHost || requests.length === 0) return null;
  return (
    <div className="p-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg space-y-2">
      <div className="flex items-center gap-2 text-yellow-400 text-sm font-medium">
        <Hand size={16} /><span>Ø·ÙØ¨Ø§Øª Ø±ÙØ¹ Ø§ÙÙØ¯ ({requests.length})</span>
      </div>
      {requests.map(req => (
        <div key={req.id} className="flex items-center justify-between bg-gray-800 rounded-lg p-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center text-white text-xs">
              {req.users?.username?.[0]?.toUpperCase() || 'Ø'}
            </div>
            <span className="text-white text-sm">{req.users?.username || 'ÙØ¬ÙÙÙ'}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleRequest(req, true)}
              className="w-8 h-8 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors">
              <Check size={14} className="text-white" />
            </button>
            <button onClick={() => handleRequest(req, false)}
              className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors">
              <X size={14} className="text-white" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
