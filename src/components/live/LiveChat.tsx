'use client';
import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Send } from 'lucide-react';
interface Message { id: string; user_id: string; content: string; created_at: string; users?: { username: string; avatar_url?: string }; }
interface LiveChatProps { streamId: string; userId: string; }
export default function LiveChat({ streamId, userId }: LiveChatProps) {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    supabase.from('live_messages').select('*, users(username, avatar_url)').eq('stream_id', streamId).order('created_at').then(({ data }) => { if (data) setMessages(data as Message[]); });
    const ch = supabase.channel('chat-' + streamId)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'live_messages', filter: 'stream_id=eq.' + streamId },
        async (payload: any) => {
          const { data } = await supabase.from('users').select('username,avatar_url').eq('id', payload.new.user_id).single();
          setMessages(prev => [...prev, { ...payload.new, users: data }]);
        }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [streamId]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  const send = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    await supabase.from('live_messages').insert({ stream_id: streamId, user_id: userId, content: text.trim() });
    setText('');
    setSending(false);
  };
  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="p-3 border-b border-gray-700"><h3 className="text-white font-medium text-sm">الدردشة المباشرة</h3></div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map(m => (
          <div key={m.id} className={`flex gap-2 ${m.user_id === userId ? 'flex-row-reverse' : ''}`}>
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs shrink-0">
              {m.users?.username?.[0]?.toUpperCase() || '؟'}
            </div>
            <div className={`max-w-[75%] ${m.user_id === userId ? 'items-end' : 'items-start'} flex flex-col`}>
              <span className="text-gray-400 text-xs mb-1">{m.users?.username || 'مجهول'}</span>
              <div className={`px-3 py-2 rounded-2xl text-sm text-white ${m.user_id === userId ? 'bg-blue-600 rounded-tr-sm' : 'bg-gray-700 rounded-tl-sm'}`}>
                {m.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t border-gray-700 flex gap-2">
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="اكتب رسالة..." className="flex-1 bg-gray-800 text-white text-sm rounded-full px-4 py-2 outline-none border border-gray-600 focus:border-blue-500 text-right" />
        <button onClick={send} disabled={!text.trim() || sending}
          className="w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-full flex items-center justify-center transition-colors">
          <Send size={14} className="text-white" />
        </button>
      </div>
    </div>
  );
}
