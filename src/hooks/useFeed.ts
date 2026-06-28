'use client'; import { useEffect, useState } from 'react'; import { LiveStream } from '@/types';
export function useFeed() {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ const load=async()=>{const r=await fetch('/api/streams');const{data}=await r.json();setStreams(data||[]);setLoading(false);};load();const i=setInterval(load,15000);return()=>clearInterval(i); },[]);
  return {streams,loading};
}
