'use client'; import { useEffect, useState } from 'react'; import { Wallet } from '@/types';
export function useWallet() {
  const [wallet, setWallet] = useState<Wallet|null>(null);
  useEffect(()=>{ fetch('/api/wallet').then(r=>r.json()).then(({data})=>setWallet(data)); },[]);
  return{wallet};
}
