'use client';
import { useState } from 'react';
import BottomNav from './BottomNav';
import Header from './Header';
import { User } from '@/types';

interface Props { children: React.ReactNode; user: User | null; }

export default function MainLayoutClient({ children, user }: Props) {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#08080f]">
      <Header user={user} />
      <main className="flex-1 overflow-hidden pt-14 pb-[68px]">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
