'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LiveStream, User } from '@/types';
import FeedCard from './FeedCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Props { initialStreams: LiveStream[]; currentUser: User | null; }

export default function FeedClient({ initialStreams, currentUser }: Props) {
  const [streams, setStreams] = useState(initialStreams);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch('/api/streams');
      const { data } = await res.json();
      if (data) setStreams(data);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  if (streams.length === 0) return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-[#444]">
      <span className="text-6xl">📡</span>
      <p className="font-bold text-white text-lg">لا توجد بثوث مباشرة الآن</p>
      <p className="text-sm">ابدأ بثاً أو تحقق لاحقاً</p>
      <button onClick={()=>router.push('/live/create')} className="gradient-purple text-white font-bold px-6 py-3 rounded-2xl mt-2">
        ابدأ بثاً الآن
      </button>
    </div>
  );

  return (
    <div className="h-full overflow-y-scroll snap-y-mandatory" style={{scrollbarWidth:'none'}}>
      {streams.map(stream => (
        <FeedCard key={stream.id} stream={stream} currentUser={currentUser} onOpen={()=>router.push(`/live/${stream.id}`)} />
      ))}
    </div>
  );
}
