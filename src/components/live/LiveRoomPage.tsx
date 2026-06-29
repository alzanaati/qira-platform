'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LiveStream, User, LiveMessage, SpeakerRequest } from '@/types';
import Avatar from '@/components/ui/Avatar';
import { ArrowRight, Mic, MicOff, Video, VideoOff, Hand, PhoneOff } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useParticipants,
  useTracks,
  VideoTrack,
  useLocalParticipant,
  useRoomContext,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track, RoomEvent, type TrackReference } from 'livekit-client';
import { isTrackReference } from '@livekit/components-core';

// ---- inner room UI (rendered inside <LiveKitRoom>) ----
function RoomInner({ stream, currentUser, isHost, canPublish }: { stream: LiveStream; currentUser: User | null; isHost: boolean; canPublish: boolean }) {
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  const room = useRoomContext();
  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(false);

  const toggleMic = async () => {
    if (!canPublish) return;
    await localParticipant.setMicrophoneEnabled(!micOn);
    setMicOn(m => !m);
  };
  const toggleCam = async () => {
    if (!canPublish) return;
    await localParticipant.setCameraEnabled(!camOn);
    setCamOn(c => !c);
  };

  // All camera tracks from all participants
  const allCameraTracks = useTracks([{ source: Track.Source.Camera, withPlaceholder: false }]);
const cameraTracks = allCameraTracks.filter(isTrackReference) as TrackReference[];

  return (
    <>
      <RoomAudioRenderer />
      {/* Video grid */}
      <div className='flex-1 bg-[#0d0d1a] overflow-y-auto'>
        {cameraTracks.length === 0 ? (
          <div className='flex items-center justify-center h-full text-[#444] text-sm flex-col gap-2'>
            <span className='text-4xl'>📷</span>
            <span>لا توجد كاميرا نشطة</span>
          </div>
        ) : (
          <div className='grid gap-2 p-2' style={{ gridTemplateColumns: `repeat(auto-fill, minmax(280px, 1fr))` }}>
            {cameraTracks.map(t => (
              <div key={t.participant.sid} className='relative bg-black rounded-xl overflow-hidden aspect-video'>
                <VideoTrack trackRef={t} className='w-full h-full object-cover' />
                <div className='absolute bottom-1 left-1 right-1 bg-black/60 rounded px-2 py-0.5 text-[10px] text-white truncate'>
                  {t.participant.name || t.participant.identity}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Controls */}
      {canPublish && (
        <div className='flex gap-3 p-3 justify-center bg-black/60 border-t border-white/[0.06] flex-shrink-0'>
          <button
            onClick={toggleMic}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-[11px] border ${micOn ? 'border-purple-500 bg-purple-500/20 text-purple-300' : 'border-white/10 bg-white/[0.06] text-[#999]'}`}
          >
            {micOn ? <Mic size={18}/> : <MicOff size={18}/>}
            {micOn ? 'صوت مفعّل' : 'صوت'}
          </button>
          <button
            onClick={toggleCam}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-[11px] border ${camOn ? 'border-purple-500 bg-purple-500/20 text-purple-300' : 'border-white/10 bg-white/[0.06] text-[#999]'}`}
          >
            {camOn ? <Video size={18}/> : <VideoOff size={18}/>}
            {camOn ? 'كاميرا مفعّلة' : 'كاميرا'}
          </button>
        </div>
      )}
    </>
  );
}

// ---- main page ----
export default function LiveRoomPage({ stream, currentUser }: { stream: LiveStream; currentUser: User | null }) {
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [speakerRequests, setSpeakerRequests] = useState<SpeakerRequest[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [chatText, setChatText] = useState('');
  const [tab, setTab] = useState<'chat'|'participants'|'requests'>('chat');
  const [handRaised, setHandRaised] = useState(false);
  const [viewerCount, setViewerCount] = useState(stream.viewer_count || 0);
  const [myRole, setMyRole] = useState('viewer');
  const [livekitToken, setLivekitToken] = useState<string | null>(null);
  const [wsUrl, setWsUrl] = useState<string>('');
  const router = useRouter();
  const isHost = currentUser?.id === stream.user_id;
  const canPublish = isHost || myRole === 'speaker';

  // Fetch LiveKit token on mount
  useEffect(() => {
    if (!currentUser) return;
    fetch('/api/livekit/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ streamId: stream.id })
    })
      .then(r => r.json())
      .then(d => {
        if (d.token) { setLivekitToken(d.token); setWsUrl(d.wsUrl || process.env.NEXT_PUBLIC_LIVEKIT_URL || ''); }
      })
      .catch(() => {});
  }, [stream.id, currentUser]);

  const loadData = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const s = createClient();
      const [msgRes, partRes, reqRes] = await Promise.all([
        s.from('live_messages').select('*,users(id,full_name,username,avatar_url)').eq('stream_id', stream.id).order('created_at', { ascending: true }).limit(100),
        s.from('stream_participants').select('*,users(id,full_name,username,avatar_url)').eq('stream_id', stream.id),
        isHost ? s.from('speaker_requests').select('*,users(id,full_name,username,avatar_url)').eq('stream_id', stream.id).eq('status', 'pending') : Promise.resolve({ data: [] }),
      ]);
      if (msgRes.data) setMessages(msgRes.data as any);
      if (partRes.data) { setParticipants(partRes.data as any); setViewerCount(partRes.data.length); }
      if (reqRes.data) setSpeakerRequests(reqRes.data as any);
      const me = partRes.data?.find((p: any) => p.user_id === currentUser?.id);
      if (me) setMyRole(me.role);
    } catch {}
  };

  useEffect(() => {
    fetch('/api/streams/' + stream.id + '/join', { method: 'POST' });
    loadData();
    const i = setInterval(loadData, 4000);
    return () => { clearInterval(i); fetch('/api/streams/' + stream.id + '/leave', { method: 'POST' }); };
  }, []);

  const handleLeave = async () => { await fetch('/api/streams/' + stream.id + '/leave', { method: 'POST' }); router.push('/feed'); };
  const handleEnd = async () => { await fetch('/api/streams/' + stream.id + '/end', { method: 'POST' }); router.push('/feed'); };
  const raiseHand = async () => { if (handRaised) return; setHandRaised(true); await fetch('/api/streams/' + stream.id + '/speaker-request', { method: 'POST' }); };
  const lowerHand = () => setHandRaised(false);

  const sendMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim() || !currentUser) return;
    const c = chatText.trim(); setChatText('');
    try {
      const { createClient } = await import('@/lib/supabase/client');
      await createClient().from('live_messages').insert({ stream_id: stream.id, user_id: currentUser.id, content: c, message_type: 'text' });
    } catch {}
  };

  const approveRequest = async (r: any) => {
    await fetch('/api/streams/' + stream.id + '/speaker-request', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ requestId: r.id, status: 'approved', userId: r.user_id }) });
    setSpeakerRequests(x => x.filter(q => q.id !== r.id));
  };
  const rejectRequest = async (r: any) => {
    await fetch('/api/streams/' + stream.id + '/speaker-request', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ requestId: r.id, status: 'rejected', userId: r.user_id }) });
    setSpeakerRequests(x => x.filter(q => q.id !== r.id));
  };

  return (
    <div className='flex flex-col h-full bg-[#07070e] overflow-hidden'>
      {/* Header */}
      <div className='flex items-center gap-2.5 px-3 py-2.5 bg-black/50 border-b border-white/[0.06] flex-shrink-0'>
        <button onClick={handleLeave} className='p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10'><ArrowRight size={18}/></button>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2'>
            <span className='flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md'>
              <span className='w-1.5 h-1.5 bg-white rounded-full animate-pulse'/>مباشر
            </span>
            <span className='text-sm font-bold truncate'>{stream.title}</span>
          </div>
          <div className='text-[10px] text-[#666]'>👁 {formatNumber(viewerCount)} مشاهد · {stream.category}</div>
        </div>
        {isHost && <button onClick={handleEnd} className='text-xs font-bold px-3 py-1.5 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30'>إنهاء البث</button>}
      </div>

      <div className='flex flex-1 overflow-hidden'>
        {/* Main: LiveKit video area */}
        <div className='flex-1 flex flex-col overflow-hidden'>
          {livekitToken && wsUrl ? (
            <LiveKitRoom
              token={livekitToken}
              serverUrl={wsUrl}
              connect={true}
              video={false}
              audio={false}
              className='flex flex-col flex-1 overflow-hidden'
              onDisconnected={() => {}}
            >
              <RoomInner stream={stream} currentUser={currentUser} isHost={isHost} canPublish={canPublish} />
            </LiveKitRoom>
          ) : (
            <div className='flex-1 flex items-center justify-center text-[#444] text-sm flex-col gap-2'>
              <span className='text-4xl'>⏳</span>
              <span>جارٍ الاتصال بخادم البث...</span>
            </div>
          )}

          {/* Raise hand for viewers */}
          {!isHost && myRole !== 'speaker' && (
            <div className='flex justify-center p-2 bg-black/60 border-t border-white/[0.06] flex-shrink-0'>
              <button
                onClick={handRaised ? lowerHand : raiseHand}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs border ${handRaised ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400' : 'border-white/10 bg-white/[0.06] text-[#ccc]'}`}
              >
                <Hand size={14}/>{handRaised ? 'إنزال اليد' : 'رفع اليد'}
              </button>
            </div>
          )}
        </div>

        {/* Sidebar: chat / participants / requests */}
        <div className='w-72 flex flex-col border-r border-white/[0.06] bg-black/40 overflow-hidden flex-shrink-0'>
          <div className='flex border-b border-white/[0.06] flex-shrink-0'>
            {([['chat', '💬'], ['participants', '👥'], ...(isHost ? [['requests', '✋']] : [])] as [string, string][]).map(([t, ic]) => (
              <button key={t} onClick={() => setTab(t as any)} className={`flex-1 py-2 text-xs font-semibold border-b-2 transition-all ${tab === t ? 'border-purple-500 text-purple-400' : 'border-transparent text-[#666]'}`}>
                {ic} {t === 'requests' && speakerRequests.length > 0 && <span className='inline-flex items-center justify-center w-4 h-4 bg-red-500 rounded-full text-[9px] text-white'>{speakerRequests.length}</span>}
              </button>
            ))}
          </div>
          {tab === 'chat' && <>
            <div className='flex-1 overflow-y-auto p-2.5 flex flex-col gap-2'>
              {messages.map((m, i) => (
                <div key={i} className='flex gap-2 items-start'>
                  <Avatar user={(m as any).users} size='sm'/>
                  <div className='bg-white/[0.05] rounded-xl rounded-tl-sm px-2.5 py-1.5 max-w-[90%]'>
                    <div className='text-[10px] text-purple-400 font-bold mb-0.5'>{(m as any).users?.full_name || 'مجهول'}</div>
                    <div className='text-xs leading-relaxed'>{m.content}</div>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={sendMsg} className='flex gap-2 p-2 border-t border-white/[0.06] flex-shrink-0'>
              <input value={chatText} onChange={e => setChatText(e.target.value)} placeholder='اكتب رسالة...' className='flex-1 bg-white/[0.06] border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs outline-none focus:border-purple-500'/>
              <button type='submit' className='gradient-purple text-white px-3 py-1.5 rounded-xl text-xs font-bold disabled:opacity-50' disabled={!chatText.trim()}>إرسال</button>
            </form>
          </>}
          {tab === 'participants' && (
            <div className='flex-1 overflow-y-auto p-2'>
              {participants.map((p: any) => (
                <div key={p.id} className='flex items-center gap-2 p-2 border-b border-white/[0.05]'>
                  <Avatar user={p.users} size='sm'/>
                  <div className='flex-1 min-w-0'>
                    <div className='text-xs truncate'>{p.users?.full_name}</div>
                    <div className='text-[10px] text-[#666]'>{p.role === 'host' ? '🎙 مضيف' : p.role === 'speaker' ? '🎤 متحدث' : '👁 مشاهد'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === 'requests' && (
            <div className='flex-1 overflow-y-auto p-2'>
              {speakerRequests.map((r: any) => (
                <div key={r.id} className='flex items-center gap-2 p-2 mb-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl'>
                  <Avatar user={r.users} size='sm'/>
                  <span className='flex-1 text-xs truncate'>{r.users?.full_name}</span>
                  <button onClick={() => approveRequest(r)} className='text-[10px] font-bold px-2 py-1 rounded-lg bg-green-500/15 text-green-400 border border-green-500/30'>قبول</button>
                  <button onClick={() => rejectRequest(r)} className='text-[10px] font-bold px-2 py-1 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 mr-1'>رفض</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
