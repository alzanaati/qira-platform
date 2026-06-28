'use client'; import { useState } from 'react';
export function useFollow(targetId: string, initial=false) {
  const [following, setFollowing] = useState(initial);
  const toggle = async()=>{ const r=await fetch('/api/follow',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({targetId})});const{following:f}=await r.json();setFollowing(f); };
  return {following,toggle};
}
