'use client';
import { useState } from 'react';
import { LiveStream, User, STREAM_CATEGORIES } from '@/types';
import Avatar from '@/components/ui/Avatar';
import { Heart, Share2, Play } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface Props { stream: LiveStream; currentUser: User | null; onOpen: () => void; }

export default function FeedCard({ stream, currentUser, onOpen }: Props) {
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const catEmoji = Object.entries(STREAM_CATEGORIES).find(([k]) => k === stream.category)?.[1]?.split(' ')[0] || 'ð¡';

  const handleFollow = async () => {
    if (!currentUser || following) return;
    setFollowing(true);
    await fetch('/api/follow', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({targetId:stream.user_id}) });
  };

  return (
    <div className="snap-start snap-always relative h-full flex flex-col overflow-hidden" style={{height:'calc(100vh - 128px)'}}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d20] to-[#180d2e]" />
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        <div className="text-center"><span style={{fontSize:80}}>{catEmoji}</span><p className="text-sm text-[#555] mt-2">Ø¨Ø« ÙØ¨Ø§Ø´Ø± Â· {stream.category}</p></div>
        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse-live" />ÙØ¨Ø§Ø´Ø±
          </span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4" style={{background:'linear-gradient(transparent,rgba(0,0,0,0.9))'}}>
        <div className="flex items-center gap-3 mb-2">
          <Avatar user={stream.users} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5"><span className="font-bold text-sm truncate">{stream.users?.full_name}</span>{stream.users?.is_verified&&<span className="text-purple-400 text-xs">â</span>}</div>
            <div className="text-xs text-[#666]">@{stream.users?.username}</div>
          </div>
          <button onClick={handleFollow} disabled={following} className="text-xs font-bold px-3 py-1.5 rounded-xl border border-purple-500 text-purple-400 hover:bg-purple-500/10 transition-colors disabled:opacity-50">
            {following?'ÙØªØ§Ø¨ÙØ¹':'ÙØªØ§Ø¨Ø¹Ø©'}
          </button>
        </div>
        <p className="font-bold mb-2 truncate">{stream.title}</p>
        <div className="flex items-center gap-4 text-xs text-[#666]">
          <span>ð {formatNumber(stream.viewer_count)} ÙØ´Ø§ÙØ¯</span>
          <span>ð {formatNumber(stream.clap_count)} ØªØµÙÙÙ</span>
        </div>
      </div>
      <div className="absolute right-3 bottom-32 flex flex-col gap-4 items-center">
        {[{icon:<Play size={22}/>,label:'Ø§ÙØ¶Ù',action:onOpen},{icon:<Heart size={22} fill={liked?'#ef4444':'none'} stroke={liked?'#ef4444':'white'}/>,label:'',action:()=>setLiked(l=>!l)},{icon:<Share2 size={22}/>,label:'',action:()=>{}}].map((btn,i) => (
          <button key={i} onClick={btn.action} className="flex flex-col items-center gap-1 bg-black/50 border border-white/10 text-white backdrop-blur-lg p-2.5 rounded-full font-cairo text-xs">
            {btn.icon}{btn.label&&<span>{btn.label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
