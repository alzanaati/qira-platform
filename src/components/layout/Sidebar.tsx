'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Radio, User, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
const NAV = [
  { href: '/feed', icon: Home, label: 'Ø§ÙØ±Ø¦ÙØ³ÙØ©' },
  { href: '/explore', icon: Compass, label: 'Ø§Ø³ØªÙØ´Ø§Ù' },
  { href: '/live/create', icon: Radio, label: 'Ø¨Ø« ÙØ¨Ø§Ø´Ø±' },
  { href: '/profile', icon: User, label: 'ÙÙÙÙ' },
  { href: '/wallet', icon: Wallet, label: 'Ø§ÙÙØ­ÙØ¸Ø©' },
];
export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-800 p-4 gap-2">
      <div className="mb-6 px-2"><h1 className="text-2xl font-bold text-white">Ø§ÙØ±Ø£</h1><p className="text-gray-500 text-xs">ÙÙØµØ© ÙØ¹Ø±ÙÙØ© Ø¹Ø±Ø¨ÙØ©</p></div>
      {NAV.map(item => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link key={item.href} href={item.href}
            className={cn('flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium',
              active ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white')}>
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </aside>
  );
}