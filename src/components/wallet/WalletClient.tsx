'use client';
import { useState } from 'react';
import { Wallet, Clap, CLAP_EMOJIS } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Props { wallet: Wallet | null; earned: Clap[]; spent: Clap[]; }

export default function WalletClient({ wallet, earned, spent }: Props) {
  const [tab, setTab] = useState<'earned'|'spent'>('earned');
  const list = tab === 'earned' ? earned : spent;
  return (
    <div className='h-full overflow-y-auto p-4'>
      <div className='bg-gradient-to-br from-purple-500/15 to-indigo-500/10 border border-purple-500/20 rounded-3xl p-6 text-center mb-5'>
        <div className='text-xs text-[#777] mb-1'>Ø±ØµÙØ¯Ù Ø§ÙØ­Ø§ÙÙ</div>
        <div className='text-4xl font-black text-gradient'>{formatCurrency(wallet?.balance||0)}</div>
        <div className='flex justify-center gap-6 mt-3'>
          <div><div className='text-green-400 font-bold text-sm'>{formatCurrency(wallet?.total_earned||0)}</div><div className='text-[10px] text-[#555]'>Ø¥Ø¬ÙØ§ÙÙ Ø§ÙÙÙØ§Ø³Ø¨</div></div>
          <div className='w-px bg-white/10'/>
          <div><div className='text-red-400 font-bold text-sm'>{formatCurrency(wallet?.total_spent||0)}</div><div className='text-[10px] text-[#555]'>Ø¥Ø¬ÙØ§ÙÙ Ø§ÙØ¥ÙÙØ§Ù</div></div>
        </div>
      </div>
      <div className='bg-purple-500/[0.07] border border-purple-500/20 rounded-2xl p-3 mb-4 text-xs'><div className='font-bold text-purple-400 mb-1'>ð¡ ÙØ¸Ø§Ù Ø§ÙØªØµÙÙÙ</div><div className='text-[#666]'>ð¥ 10 Â· ð¥ 20 Â· ð¥ 50 Â· ð 100 Ø±.Ø³ | 75% ÙÙÙÙØ´Ø¦ Â· 25% ÙÙÙÙØµØ©</div></div>
      <div className='flex gap-1 bg-white/[0.04] rounded-xl p-1 mb-4'>
        {([['earned','Ø§ÙÙÙØ§Ø³Ø¨'],['spent','Ø§ÙÙØµØ±ÙÙØ§Øª']] as [string,string][]).map(([k,l])=>(<button key={k} onClick={()=>setTab(k as any)} className={'flex-1 py-2 rounded-lg text-xs font-semibold transition-all '+(tab===k?'bg-purple-500/20 text-purple-400':'text-[#666]')}>{l}</button>))}
      </div>
      {list.length===0 ? <div className='text-center py-10 text-[#444]'><div className='text-4xl mb-2'>ð</div><div className='text-sm'>{tab==='earned'?'ÙÙ ØªØªÙÙÙ ØªØµÙÙÙØ§Ù Ø¨Ø¹Ø¯':'ÙÙ ØªØ±Ø³Ù ØªØµÙÙÙØ§Ù Ø¨Ø¹Ø¯'}</div></div>
      : <div className='bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden'>{list.map((c,i)=>(<div key={c.id} className={'flex items-center justify-between py-3 px-3 '+(i<list.length-1?'border-b border-white/[0.05]':'')}><div className='flex items-center gap-2.5'><span className='text-2xl'>{CLAP_EMOJIS[c.clap_type]}</span><div><div className='text-sm font-bold'>{tab==='earned'?(c.sender as any)?.full_name||'ÙØ¬ÙÙÙ':(c.receiver as any)?.full_name||'ÙØ¬ÙÙÙ'}</div><div className='text-[10px] text-[#555]'>{(c.stream as any)?.title||'Ø¨Ø«'} Â· {formatDate(c.created_at)}</div></div></div><div className={'font-bold text-sm '+(tab==='earned'?'text-green-400':'text-red-400')}>{tab==='earned'?'+':'-'}{formatCurrency(tab==='earned'?c.amount*0.75:c.amount)}</div></div>))}</div>}
    </div>
  );
}