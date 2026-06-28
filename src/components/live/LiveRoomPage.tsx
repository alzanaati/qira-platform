'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Stream, User } from '@/types';
import { useLiveChat } from '@/hooks/useLiveChat';
import { useSpeakerRequests } from '@/hooks/useSpeakerRequests';
import { useContentState } from '@/hooks/useContentState';

interface LiveRoomPageProps {
  stream: Stream;
  currentUser: User | null;
}

export default function LiveRoomPage({ stream, currentUser }: LiveRoomPageProps) {
  const router = useRouter();
  const [livekitToken, setLivekitToken] = useState<string | null>(null);
  const [livekitWsUrl, setLivekitWsUrl] = useState<string | null>(null);
  const [livekitError, setLivekitError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage } = useLiveChat(stream.id, currentUser);
  const { speakerRequests, raiseHand, approveSpeaker } = useSpeakerRequests(stream.id, currentUser);
  const { contentState, updateContentState } = useContentState(stream.id);

  const isHost = currentUser?.id === stream.user_id;

  // Fix 2 & 3: Auto-fetch LiveKit token on mount by calling /api/livekit/token
  useEffect(() => {
    if (!currentUser) return;
    
    const fetchToken = async () => {
      setIsConnecting(true);
      try {
        const res = await fetch('/api/livekit/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ streamId: stream.id }),
        });
        
        if (!res.ok) {
          const err = await res.json();
          setLivekitError(err.error || 'Failed to get LiveKit token');
          return;
        }
        
        const data = await res.json();
        setLivekitToken(data.token);
        setLivekitWsUrl(data.wsUrl);
        setIsConnected(true);
      } catch (err) {
        setLivekitError('Connection failed');
      } finally {
        setIsConnecting(false);
      }
    };

    fetchToken();
  }, [stream.id, currentUser]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentUser) return;
    await sendMessage(message.trim());
    setMessage('');
  };

  const handleEndStream = async () => {
    if (!isHost) return;
    await fetch('/api/streams/' + stream.id + '/end', { method: 'POST' });
    router.push('/');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
        <h1 className="text-lg font-bold truncate">{stream.title}</h1>
        <div className="flex items-center gap-2">
          {isConnecting && <span className="text-yellow-400 text-sm">جارٍ الاتصال...</span>}
          {isConnected && <span className="text-green-400 text-sm">LiveKit ✓</span>}
          {livekitError && <span className="text-red-400 text-xs">{livekitError}</span>}
          {isHost && (
            <button onClick={handleEndStream} className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded-lg">
              إنهاء البث
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-950">
          {livekitToken ? (
            <div className="text-center">
              <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4">
                {currentUser?.full_name?.[0] || 'U'}
              </div>
              <p className="text-green-400 text-sm">متصل بـ LiveKit WebRTC</p>
              <p className="text-gray-400 text-xs mt-1">{livekitWsUrl}</p>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <div className="text-5xl mb-4">📡</div>
              <p>{isConnecting ? 'جارٍ الاتصال بـ LiveKit...' : 'انتظر ربط LiveKit'}</p>
            </div>
          )}
        </div>

        <div className="w-72 flex flex-col bg-gray-900 border-l border-gray-800">
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg: any, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {msg.user_name?.[0] || 'U'}
                </div>
                <div>
                  <p className="text-xs text-purple-400 font-medium">{msg.user_name}</p>
                  <p className="text-sm text-gray-200">{msg.content}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-800">
            <div className="flex gap-2">
              <input type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="اكتب رسالة..." className="flex-1 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg outline-none" />
              <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-2 rounded-lg">إرسال</button>
            </div>
          </form>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 py-4 bg-gray-900 border-t border-gray-800">
        <button onClick={() => !isHost && raiseHand()} className="flex flex-col items-center gap-1 text-gray-400 hover:text-white">
          <span className="text-2xl">✋</span><span className="text-xs">رفع يد</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white">
          <span className="text-2xl">🎤</span><span className="text-xs">صوت</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white">
          <span className="text-2xl">📷</span><span className="text-xs">كاميرا</span>
        </button>
      </div>
    </div>
  );
}
