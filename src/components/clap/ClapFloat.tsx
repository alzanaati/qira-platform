'use client';
import { useEffect, useState } from 'react';
interface FloatItem { id: string; emoji: string; x: number; }
interface ClapFloatProps { clapType?: string; trigger: number; }
const CLAP_EMOJIS: Record<string, string> = { bronze: '🥉', silver: '🥈', gold: '🥇', diamond: '💎' };
export default function ClapFloat({ clapType = 'bronze', trigger }: ClapFloatProps) {
  const [items, setItems] = useState<FloatItem[]>([]);
  useEffect(() => {
    if (trigger === 0) return;
    const id = Date.now().toString();
    const x = 20 + Math.random() * 60;
    setItems(prev => [...prev, { id, emoji: CLAP_EMOJIS[clapType] || '👏', x }]);
    const t = setTimeout(() => setItems(prev => prev.filter(i => i.id !== id)), 2500);
    return () => clearTimeout(t);
  }, [trigger]);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map(item => (
        <div key={item.id} style={{ left: `${item.x}%`, bottom: '10%' }}
          className="absolute text-4xl animate-float-up select-none">
          {item.emoji}
        </div>
      ))}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          80% { transform: translateY(-200px) scale(1.3); opacity: 0.8; }
          100% { transform: translateY(-280px) scale(0.5); opacity: 0; }
        }
        .animate-float-up { animation: floatUp 2.5s ease-out forwards; }
      `}</style>
    </div>
  );
}
