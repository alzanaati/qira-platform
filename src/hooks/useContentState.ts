'use client'; import { useEffect, useState } from 'react'; import { StreamContentState } from '@/types';
export function useContentState(streamId: string) {
  const [state, setState] = useState<StreamContentState|null>(null);
  useEffect(()=>{ const load=async()=>{const r=await fetch('/api/streams/'+streamId+'/content-state');const{data}=await r.json();if(data)setState(data);}; load(); const i=setInterval(load,3000); return()=>clearInterval(i); },[streamId]);
  const update=async(updates:Partial<StreamContentState>)=>{await fetch('/api/streams/'+streamId+'/content-state',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(updates)});};
  return{state,update};
}
