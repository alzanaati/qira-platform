'use client'; import { useEffect, useState, useRef } from 'react'; import { createClient } from '@/lib/supabase/client'; import { LiveMessage } from '@/types';
export function useLiveChat(streamId: string) {
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  useEffect(()=>{ const s=createClient(); const load=async()=>{const{data}=await s.from('live_messages').select('*,users(id,full_name,username,avatar_url)').eq('stream_id',streamId).order('created_at',{ascending:true}).limit(100);if(data)setMessages(data as any);}; load(); const i=setInterval(load,4000); return()=>clearInterval(i); },[streamId]);
  const send=async(content:string,userId:string)=>{await createClient().from('live_messages').insert({stream_id:streamId,user_id:userId,content,message_type:'text'});};
  return {messages,send};
}
