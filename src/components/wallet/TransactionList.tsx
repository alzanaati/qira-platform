'use client';
interface Transaction { id: string; clap_type?: string; amount: number; created_at: string; clapper_id: string; recipient_id: string; }
interface TransactionListProps { transactions: Transaction[]; currentUserId: string; }
const CLAP_LABELS: Record<string, string> = { bronze: 'ð¥ Ø¨Ø±ÙÙØ²Ù', silver: 'ð¥ ÙØ¶Ù', gold: 'ð¥ Ø°ÙØ¨Ù', diamond: 'ð Ø§ÙÙØ§Ø³' };
export default function TransactionList({ transactions, currentUserId }: TransactionListProps) {
  if (transactions.length === 0) return <div className="text-center text-gray-400 py-12 text-sm">ÙØ§ ØªÙØ¬Ø¯ ÙØ¹Ø§ÙÙØ§Øª</div>;
  return (
    <div className="space-y-2">
      {transactions.map(t => {
        const isReceived = t.recipient_id === currentUserId;
        return (
          <div key={t.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
            <div className="flex items-center gap-3">
              <div className={'w-10 h-10 rounded-full flex items-center justify-center ' + (isReceived ? 'bg-green-900/50' : 'bg-red-900/50')}>
                <span className="text-lg">{isReceived ? 'â¬ï¸' : 'â¬ï¸'}</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{CLAP_LABELS[t.clap_type || ''] || 'ØªØµÙÙÙ'}</p>
                <p className="text-gray-400 text-xs">{new Date(t.created_at).toLocaleDateString('ar-SA')}</p>
              </div>
            </div>
            <span className={'text-sm font-bold ' + (isReceived ? 'text-green-400' : 'text-red-400')}>
              {isReceived ? '+' : '-'}{t.amount} Ø±.Ø³
            </span>
          </div>
        );
      })}
    </div>
  );
}