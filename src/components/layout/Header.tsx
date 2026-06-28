'use client';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { LogOut, Bell } from 'lucide-react';

export default function Header({ user }: { user: User | null }) {
  const router = useRouter();
  const supabase = createClient();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login'); router.refresh();
  };
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[#08080f]/92 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-4 z-50">
      <button onClick={()=>router.push('/profile')} className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/10 transition-colors">
        <Bell size={20} className="text-gray-400" />
      </button>
      <h1 className="text-2xl font-black text-gradient">Ø§ÙØ±Ø£</h1>
      {user && (
        <button onClick={handleLogout} className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/10 transition-colors">
          <LogOut size={18} className="text-gray-400" />
        </button>
      )}
    </header>
  );
}
