'use client';
import { useState } from 'react';
import { Gift } from 'lucide-react';
import ClapButton from './ClapButton';
interface ClapPanelProps { streamId: string; hostId: string; onClap: (type: string) => void; }
const CLAP_TYPES = [
  { type: 'bronze' as const, emoji: '🥉', price: 10, label: 'برونزي' },
  { type: 'silver' as const, emoji: '🥈', price: 20, label: 'فضي' },
  { type: 'gold' as const, emoji: '🥇', price: 50, label: 'ذهبي' },
  { type: 'diamond' as const, emoji: '💎', price: 100, label: 'الماس' },
];
export default function ClapPanel({ streamId, hostId, onClap }: ClapPanelProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(p => !p)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white rounded-full text-sm font-medium transition-all active:scale-95">
        <Gift size={16} />
        <span>تصفيق</span>
      </button>
      {open && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur border border-gray-700 rounded-3xl p-4 shadow-2xl">
          <p className="text-gray-400 text-xs text-center mb-3">اختر نوع التصفيق</p>
          <div className="grid grid-cols-2 gap-2">
            {CLAP_TYPES.map(ct => (
              <ClapButton key={ct.type} streamId={streamId} hostId={hostId}
                clapType={ct.type} price={ct.price} emoji={ct.emoji}
                onClap={() => { onClap(ct.type); setOpen(false); }} />
            ))}
          </div>
          <p className="text-gray-500 text-xs text-center mt-3">75% للمضيف · 25% للمنصة</p>
        </div>
      )}
    </div>
  );
}
