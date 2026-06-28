'use client'; import { useEffect, useState } from 'react'; import { createClient } from '@/lib/supabase/client'; import { SpeakerRequest } from '@/types';
export function useSpeakerRequests(streamId: string, isHost: boolean) {
  const [requests, setRequests] = useState<SpeakerRequest[]>([]);
  useEffect(()=>{ if(!isHost)return; const load=async()=>{const{data}=await createClient().from('speaker_requests').select('*,users(id,full_name,username,avatar_url)').eq('stream_id',streamId).eq('status','pending');if(data)setRequests(data as any);}; load(); const i=setInterval(load,5000); return()=>clearInterval(i); },[streamId,isHost]);
  const approve=async(requestId:string,userId:string)=>fetch('/api/streams/'+streamId+'/speaker-request',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({requestId,status:'approved',userId})});
  const reject=async(requestId:string,userId:string)=>fetch('/api/streams/'+streamId+'/speaker-request',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({requestId,status:'rejected',userId})});
  return{requests,approve,reject};
}
