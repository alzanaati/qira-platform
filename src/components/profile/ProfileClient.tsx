'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, LiveStream } from '@/types';
import Avatar from '@/components/ui/Avatar';
import { formatDate, formatNumber } from '@/lib/utils';

interface Props { profile: User; currentUser: User | null; isOwn: boolean; }

export default function ProfileClient({ profile, currentUser, isOwn }: Props) {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [stats, setStats] = useState({ followers:0, following:0, streams:0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const { createClient } = await import('@/lib/supabase/client');
      const s = createClient();
      const [streamsRes, followersRes, followingRes] = await Promise.all([
        s.from('live_streams').select('*').eq('user_id',profile.id).order('started_at',{ascending:false}).limit(20),
        s.from('follows').select('id').eq('following_id',profile.id),
        s.from('follows').select('id').eq('follower_id',profile.id),
      ]);
      setStreams(streamsRes.data||[]);
      setStats({followers:(followersRes.data||[]).length,following:(followingRes.data||[]).length,streams:(streamsRes.data||[]).length});
      if (currentUser && !isOwn) {
        const {data} = await s.from('follows').select('id').eq('follower_id',currentUser.id).eq('following_id',profile.id).single();
        setIsFollowing(!!data);
      }
    };
    load();
  }, [profile.id]);

  const toggleFollow = async () => {
    if (!currentUser || isOwn) return;
    const res = await fetch('/api/follow',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({targetId:profile.id})});
    const { following } = await res.json();
    setIsFollowing(following);
    setStats(s=>({...s,followers:following?s.followers+1:Math.max(0,s.followers-1)}));
  };

  return (
    <div className='h-full overflow-y-auto'>
      <div className='h-36 bg-gradient-to-br from-purple-500/20 to-indigo-500/10 relative'/>
      <div className='px-4 -mt-10 pb-4'>
        <div className='flex items-end justify-between mb-3'>
          <div className='w-20 h-20 rounded-full border-4 border-[#08080f] overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-3xl font-bold'>
            {profile.avatar_url ? <img src={profile.avatar_url} alt='' className='w-full h-full object-cover'/> : profile.full_name?.[0]||'Ø'}
          </div>
          {isOwn ? <button className='text-sm font-semibold px-4 py-2 rounded-xl bg-white/[0.06] border border-white/10'>ØªØ¹Ø¯ÙÙ Ø§ÙÙÙÙ</button>
                 : <button onClick={toggleFollow} className={'text-sm font-semibold px-4 py-2 rounded-xl transition-all '+(isFollowing?'bg-white/[0.06] border border-white/10':'gradient-purple text-white')}>{isFollowing?'Ø¥ÙØºØ§Ø¡ Ø§ÙÙØªØ§Ø¨Ø¹Ø©':'ÙØªØ§Ø¨Ø¹Ø©'}</button>}
        </div>
        <div className='font-bold text-lg'>{profile.full_name} {profile.is_verified&&<span className='text-purple-400 text-sm'>â ÙÙØ«Ù</span>}</div>
        <div className='text-[#666] text-sm mb-2'>@{profile.username}</div>
        {profile.bio && <p className='text-sm text-[#aaa] mb-3'>{profile.bio}</p>}
        <div className='flex border-y border-white/[0.06] my-3'>
          {[['ÙØªØ§Ø¨Ø¹',stats.followers],['ÙØªØ§Ø¨ÙØ¹',stats.following],['Ø¨Ø«',stats.streams]].map(([l,n])=><div key={l as string} className='flex-1 py-3 text-center border-l border-white/[0.06] last:border-l-0'><div className='text-lg font-bold text-purple-400'>{formatNumber(n as number)}</div><div className='text-[11px] text-[#555]'>{l}</div></div>)}
        </div>
        <h3 className='text-sm font-bold text-[#ddd] mb-3'>Ø§ÙØ¨Ø«ÙØ«</h3>
        {streams.length===0 ? <div className='text-center py-8 text-[#444] text-sm'>ÙØ§ ØªÙØ¬Ø¯ Ø¨Ø«ÙØ«</div> : streams.map(s=>(
          <div key={s.id} onClick={()=>s.status==='live'&&router.push('/live/'+s.id)} className={'flex gap-3 py-3 border-b border-white/[0.05] '+(s.status==='live'?'cursor-pointer':'')}>
            <div className='w-14 h-14 rounded-xl bg-gradient-to-br from-[#1a0d2e] to-[#0d1a2e] flex items-center justify-center text-2xl flex-shrink-0'>ð¡</div>
            <div className='flex-1 min-w-0'>
              <div className='text-sm font-bold truncate'>{s.title}</div>
              <div className='text-xs text-[#666]'>{formatDate(s.started_at)}</div>
              <div className='flex items-center gap-2 mt-1'>{s.status==='live'?<span className='text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-lg'>ð´ ÙØ¨Ø§Ø´Ø±</span>:<span className='text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-lg'>ÙÙØªÙÙ</span>}<span className='text-[10px] text-[#555]'>ð {s.viewer_count||0}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}