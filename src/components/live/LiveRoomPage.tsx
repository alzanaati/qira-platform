'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LiveStream, User, LiveMessage, SpeakerRequest } from '@/types';
import Avatar from '@/components/ui/Avatar';
import { ArrowRight, Mic, Video, Hand, MessageCircle, Users } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export default function LiveRoomPage({ stream, currentUser }: { stream: LiveStream; currentUser: User | null }) {
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [speakerRequests, setSpeakerRequests] = useState<SpeakerRequest[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [chatText, setChatText] = useState('');
  const [tab, setTab] = useState<'chat'|'participants'|'requests'>('chat');
  const [handRaised, setHandRaised] = useState(false);
  const [viewerCount, setViewerCount] = useState(stream.viewer_count || 0);
  const [myRole, setMyRole] = useState('viewer');
  const [isMic, setIsMic] = useState(false);
  const [isCam, setIsCam] = useState(false);
  const router = useRouter();
  const isHost = currentUser?.id === stream.user_id;

  const loadData = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const s = createClient();
      const [msgRes, partRes, reqRes] = await Promise.all([

  // Fix 2 & 3: Auto-connect to /api/livekit/token on mount
  const [livekitToken, setLivekitToken] = useState<string | null>(null);
  const [livekitConnected, setLivekitConnected] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    fetch('/api/livekit/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ streamId: stream.id })
    }).then(r => r.json()).then(data => {
      if (data.token) { setLivekitToken(data.token); setLivekitConnected(true); }
    }).catch(() => {});
  }, [stream.id, currentUser]);

        s.from('live_messages').select('*,users(id,full_name,username,avatar_url)').eq('stream_id',stream.id).order('created_at',{ascending:true}).limit(100),
        s.from('stream_participants').select('*,users(id,full_name,username,avatar_url)').eq('stream_id',stream.id),
        isHost ? s.from('speaker_requests').select('*,users(id,full_name,username,avatar_url)').eq('stream_id',stream.id).eq('status','pending') : Promise.resolve({data:[]}),
      ]);
      if (msgRes.data) setMessages(msgRes.data as any);
      if (partRes.data) { setParticipants(partRes.data as any); setViewerCount(partRes.data.length); }
      if (reqRes.data) setSpeakerRequests(reqRes.data as any);
      const me = partRes.data?.find((p:any) => p.user_id === currentUser?.id);
      if (me) setMyRole(me.role);
    } catch {}
  };

  const handleLeave = async () => { await fetch('/api/streams/'+stream.id+'/leave',{method:'POST'}); router.push('/feed'); };
  const handleEnd = async () => { await fetch('/api/streams/'+stream.id+'/end',{method:'POST'}); router.push('/feed'); };
  const raiseHand = async () => { if(handRaised) return; setHandRaised(true); await fetch('/api/streams/'+stream.id+'/speaker-request',{method:'POST'}); };
  const lowerHand = async () => { setHandRaised(false); };

  const sendMsg = async (e: React.FormEvent) => {
    e.preventDefault(); if (!chatText.trim() || !currentUser) return;
    const c = chatText.trim(); setChatText('');
    try { const {createClient} = await import('@/lib/supabase/client'); await createClient().from('live_messages').insert({stream_id:stream.id,user_id:currentUser.id,content:c,message_type:'text'}); } catch {}
  };

  const approveRequest = async (r: any) => {
    await fetch('/api/streams/'+stream.id+'/speaker-request',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({requestId:r.id,status:'approved',userId:r.user_id})});
    setSpeakerRequests(x => x.filter(q => q.id !== r.id));
  };
  const rejectRequest = async (r: any) => {
    await fetch('/api/streams/'+stream.id+'/speaker-request',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({requestId:r.id,status:'rejected',userId:r.user_id})});
    setSpeakerRequests(x => x.filter(q => q.id !== r.id));
  };

  useEffect(() => {
    fetch('/api/streams/'+stream.id+'/join', {method:'POST'});
    loadData();
    const i = setInterval(loadData, 4000);
    return () => { clearInterval(i); fetch('/api/streams/'+stream.id+'/leave',{method:'POST'}); };
  }, []);

  const canPublish = isHost || myRole === 'speaker';
  const host = participants.find((p:any)=>p.role==='host') || { users: stream.users };
  const speakers = participants.filter((p:any)=>p.role==='speaker');

  return (
    <div className='flex flex-col h-full bg-[#07070e] overflow-hidden'>
      <div className='flex items-center gap-2.5 px-3 py-2.5 bg-black/50 border-b border-white/[0.06] flex-shrink-0'>
        <button onClick={handleLeave} className='p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10'><ArrowRight size={18}/></button>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2'><span className='flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md'><span className='w-1.5 h-1.5 bg-white rounded-full animate-pulse-live'/>ÙØ¨Ø§Ø´Ø±</span><span className='text-sm font-bold truncate'>{stream.title}</span></div>
          <div className='text-[10px] text-[#666]'>ð {formatNumber(viewerCount)} ÙØ´Ø§ÙØ¯ Â· {stream.category}</div>
        </div>
        {isHost && <button onClick={handleEnd} className='text-xs font-bold px-3 py-1.5 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30'>Ø¥ÙÙØ§Ø¡ Ø§ÙØ¨Ø«</button>}
      </div>
      <div className='flex flex-1 overflow-hidden'>
        <div className='flex-1 flex flex-col overflow-hidden'>
          <div className='flex-1 bg-[#0d0d1a] flex items-center justify-center text-[#333] text-sm'>
            <div className='text-center'><div className='text-5xl mb-2'>ð¡</div><div>ÙÙØ·ÙØ© Ø§ÙÙØ­ØªÙÙ Â· Ø§Ø±Ø¨Ø· LiveKit ÙÙØ¨Ø« Ø§ÙØ­ÙÙÙÙ</div></div>
          </div>
          <div className='flex gap-2 p-2 bg-[#09091a] border-t border-white/[0.06] overflow-x-auto flex-shrink-0' style={{height:148}}>
            <div className='w-32 h-full bg-[#111] rounded-xl flex items-center justify-center border-2 border-purple-500 relative flex-shrink-0'>
              <Avatar user={host?.users || stream.users} size='lg'/><div className='absolute bottom-1 inset-x-1 bg-black/70 rounded text-center text-[9px] px-1 truncate'>ð ÙØ¶ÙÙ</div>
            </div>
            {speakers.map((sp:any) => <div key={sp.id} className='w-32 h-full bg-[#111] rounded-xl flex items-center justify-center border-2 border-yellow-500 relative flex-shrink-0'><Avatar user={sp.users} size='lg'/><div className='absolute bottom-1 inset-x-1 bg-black/70 rounded text-center text-[9px] px-1 truncate'>ð¤ {sp.users?.full_name}</div></div>)}
          </div>
          <div className='flex gap-2 p-2 justify-center flex-wrap bg-black/60 border-t border-white/[0.06] flex-shrink-0'>
            {canPublish && <><button onClick={()=>setIsMic(m=>!m)} className={'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] border '+(isMic?'border-purple-500 bg-purple-500/20 text-purple-400':'border-white/10 bg-white/[0.06] text-[#ccc]')}><Mic size={15}/>ØµÙØª</button><button onClick={()=>setIsCam(c=>!c)} className={'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] border '+(isCam?'border-purple-500 bg-purple-500/20 text-purple-400':'border-white/10 bg-white/[0.06] text-[#ccc]')}><Video size={15}/>ÙØ§ÙÙØ±Ø§</button></>}
            {!isHost && myRole!=='speaker' && <button onClick={handRaised?lowerHand:raiseHand} className={'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] border '+(handRaised?'border-yellow-500 bg-yellow-500/20 text-yellow-400':'border-white/10 bg-white/[0.06] text-[#ccc]')}><Hand size={15}/>{handRaised?'Ø¥ÙØ²Ø§Ù Ø§ÙÙØ¯':'Ø±ÙØ¹ Ø§ÙÙØ¯'}</button>}
          </div>
        </div>
        <div className='w-72 flex flex-col border-r border-white/[0.06] bg-black/40 overflow-hidden flex-shrink-0'>
          <div className='flex border-b border-white/[0.06] flex-shrink-0'>
            {([['chat','ð¬'],['participants','ð¥'],...(isHost?[['requests','â']]:[])] as [string,string][]).map(([t,ic])=>(<button key={t} onClick={()=>setTab(t as any)} className={'flex-1 py-2 text-xs font-semibold border-b-2 transition-all '+(tab===t?'border-purple-500 text-purple-400':'border-transparent text-[#666]')}>{ic} {t==='requests'&&speakerRequests.length>0&&<span className='inline-flex items-center justify-center w-4 h-4 bg-red-500 rounded-full text-[9px] text-white'>{speakerRequests.length}</span>}</button>))}
          </div>
          {tab==='chat' && <>
            <div className='flex-1 overflow-y-auto p-2.5 flex flex-col gap-2'>
              {messages.map((m,i)=>(<div key={i} className='flex gap-2 items-start'><Avatar user={(m as any).users} size='sm'/><div className='bg-white/[0.05] rounded-xl rounded-tl-sm px-2.5 py-1.5 max-w-[90%]'><div className='text-[10px] text-purple-400 font-bold mb-0.5'>{(m as any).users?.full_name||'ÙØ¬ÙÙÙ'}</div><div className='text-xs leading-relaxed'>{m.content}</div></div></div>))}
            </div>
            <form onSubmit={sendMsg} className='flex gap-2 p-2 border-t border-white/[0.06] flex-shrink-0'>
              <input value={chatText} onChange={e=>setChatText(e.target.value)} placeholder='Ø§ÙØªØ¨ Ø±Ø³Ø§ÙØ©...' className='flex-1 bg-white/[0.06] border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs outline-none focus:border-purple-500'/>
              <button type='submit' className='gradient-purple text-white px-3 py-1.5 rounded-xl text-xs font-bold disabled:opacity-50' disabled={!chatText.trim()}>Ø¥Ø±Ø³Ø§Ù</button>
            </form>
          </>}
          {tab==='participants' && <div className='flex-1 overflow-y-auto p-2'>{participants.map((p:any)=>(<div key={p.id} className='flex items-center gap-2 p-2 border-b border-white/[0.05]'><Avatar user={p.users} size='sm'/><div className='flex-1 min-w-0'><div className='text-xs truncate'>{p.users?.full_name}</div><div className='text-[10px] text-[#666]'>{p.role==='host'?'ð ÙØ¶ÙÙ':p.role==='speaker'?'ð¤ ÙØªØ­Ø¯Ø«':'ð ÙØ´Ø§ÙØ¯'}</div></div></div>))}</div>}
          {tab==='requests' && <div className='flex-1 overflow-y-auto p-2'>{speakerRequests.map((r:any)=>(<div key={r.id} className='flex items-center gap-2 p-2 mb-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl'><Avatar user={r.users} size='sm'/><span className='flex-1 text-xs truncate'>{r.users?.full_name}</span><button onClick={()=>approveRequest(r)} className='text-[10px] font-bold px-2 py-1 rounded-lg bg-green-500/15 text-green-400 border border-green-500/30'>ÙØ¨ÙÙ</button><button onClick={()=>rejectRequest(r)} className='text-[10px] font-bold px-2 py-1 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 mr-1'>Ø±ÙØ¶</button></div>))}</div>}
        </div>
      </div>
    </div>
  );
}