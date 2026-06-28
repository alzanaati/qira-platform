'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LiveStream, STREAM_CATEGORIES } from '@/types';
import Avatar from '@/components/ui/Avatar';
import { Search } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export default function ExploreClient({ initialStreams }: { initialStreams: LiveStream[] }) {
  const [streams, setStreams] = useState(initialStreams);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const router = useRouter();

  const handleCategory = async (cat: string) => {
    setCategory(cat);
    const res = await fetch(`/api/streams${cat!=='all'?`?category=${cat}`:''}  `);
    const { data } = await res.json();
    if (data) setStreams(data);
  };

  const filtered = streams.filter(s => !search || s.title?.includes(search) || s.users?.full_name?.includes(search));

  return (
    <div className="h-full overflow-y-auto">
      <h2 className="text-base font-bold text-[#ddd] px-4 py-3">Ø§Ø³ØªÙØ´Ù Ø§ÙØ¨Ø«ÙØ«</h2>
      <div className="relative mx-4 mb-3">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Ø§Ø¨Ø­Ø« Ø¹Ù Ø¨Ø«..." className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-purple-500 pr-10 transition-colors" />
        <Search size={17} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555]" />
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-3" style={{scrollbarWidth:'none'}}>
        {[['all','Ø§ÙÙÙ'],...Object.entries(STREAM_CATEGORIES)].map(([k,v]) => (
          <button key={k} onClick={()=>handleCategory(k)} className={`whitespace-nowrap px-4 py-1.5 rounded-2xl text-xs font-semibold border transition-all ${category===k?'border-purple-500 bg-purple-500/15 text-purple-400':'border-white/10 bg-white/[0.04] text-[#888]'}`}>{v}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10 text-[#444]"><span className="text-5xl">ð</span><p>ÙØ§ ØªÙØ¬Ø¯ ÙØªØ§Ø¦Ø¬</p></div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 px-4 pb-4">
          {filtered.map(stream => (
            <div key={stream.id} onClick={()=>router.push(`/live/${stream.id}`)} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden cursor-pointer hover:border-purple-500/30 transition-all">
              <div className="h-28 bg-gradient-to-br from-[#1a0d2e] to-[#0d1a2e] flex items-center justify-center relative">
                <span style={{fontSize:36}}>{Object.entries(STREAM_CATEGORIES).find(([k])=>k===stream.category)?.[1]?.split(' ')[0]||'ð¡'}</span>
                <div className="absolute top-2 right-2"><span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-lg flex items-center gap-1"><span className="w-1.5 h-1.5 bg-white rounded-full"/>ÙØ¨Ø§Ø´Ø±</span></div>
              </div>
              <div className="p-2.5">
                <p className="text-xs font-bold truncate mb-1">{stream.title}</p>
                <div className="flex items-center gap-1.5">
                  <Avatar user={stream.users} size="sm" />
                  <span className="text-[10px] text-[#666] truncate">{stream.users?.full_name}</span>
                </div>
                <p className="text-[10px] text-[#555] mt-1">ð {formatNumber(stream.viewer_count)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
