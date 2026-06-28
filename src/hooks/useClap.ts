'use client'; import { CLAP_PRICES, ClapType } from '@/types';
export function useClap(streamId: string, receiverId: string) {
  const send=async(clapType:ClapType)=>{const r=await fetch('/api/claps',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({streamId,receiverId,clapType})});return r.json();};
  return {send};
}
