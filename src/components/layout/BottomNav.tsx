'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, Plus, Wallet, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { path:'/feed', icon:Home, label:'الرئيسية' },
  { path:'/explore', icon:Search, label:'استكشف' },
  { path:'/live/create', icon:Plus, label:'بث', isCreate:true },
  { path:'/wallet', icon:Wallet, label:'المحفظة' },
  { path:'/profile', icon:User, label:'حسابي' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[68px] bg-[#08080f]/95 backdrop-blur-xl border-t border-white/[0.06] flex items-center justify-around z-50">
      {items.map(({ path, icon:Icon, label, isCreate }) => {
        const active = pathname === path || pathname.startsWith(path + '/');
        return (
          <button key={path} onClick={()=>router.push(path)}
            className={cn('flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all', isCreate ? 'bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg shadow-purple-500/40 py-3 px-4' : active ? 'text-purple-400' : 'text-[#555]')}>
            <Icon size={22} />
            {!isCreate && <span className="text-[10px] font-semibold">{label}</span>}
          </button>
        );
      })}
    </nav>
  );
}
