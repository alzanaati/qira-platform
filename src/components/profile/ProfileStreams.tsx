'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { LiveStream } from '@/types';
import { Radio, Clock } from 'lucide-react';
interface ProfileStreamsProps { userId: string; }
export default function ProfileStreams({ userId }: ProfileStreamsProps) {
  const supabase = createClient();
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from('live_streams').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => { if (data) setStreams(data as LiveStream[]); setLoading(false); });
  }, [userId]);
  if (loading) return <div className="p-4 text-center text-gray-400 animate-pulse">جارٍ التحميل...</div>;
  if (streams.length === 0) return <div className="p-8 text-center text-gray-400 text-sm">لا توجد بثوث سابقة</div>;
  return (
    <div className="divide-y divide-gray-800">
      {streams.map(s => (
        <div key={s.id} className="flex items-center gap-4 p-4 hover:bg-gray-800/50 transition-colors">
          <div className={'w-12 h-12 rounded-xl flex items-center justify-center ' + (s.status === 'live' ? 'bg-red-900/50' : 'bg-gray-800')}>
            <Radio size={20} className={s.status === 'live' ? 'text-red-400' : 'text-gray-500'} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{s.title}</p>
            <div className="flex items-center gap-2 mt-1">
              {s.status === 'live'
                ? <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full animate-pulse">مباشر</span>
                : <span className="text-gray-500 text-xs flex items-center gap-1"><Clock size={10} />{new Date(s.created_at).toLocaleDateString('ar-SA')}</span>}
              <span className="text-gray-500 text-xs">{s.viewer_count || 0} مشاهد</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}