import { User } from '@/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
interface Props { user?: User | null; size?: 'sm'|'md'|'lg'|'xl'; className?: string; }
const sizes = { sm:{w:32,f:13}, md:{w:40,f:16}, lg:{w:72,f:28}, xl:{w:96,f:36} };
export default function Avatar({ user, size='md', className }: Props) {
  const { w, f } = sizes[size];
  const letter = user?.full_name?.[0] || user?.username?.[0] || '؟';
  return (
    <div className={cn('rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold bg-gradient-to-br from-purple-500 to-indigo-500', className)} style={{width:w,height:w,fontSize:f}}>
      {user?.avatar_url ? <Image src={user.avatar_url} alt={user.full_name} width={w} height={w} className="object-cover w-full h-full" /> : <span className="text-white">{letter}</span>}
    </div>
  );
}
