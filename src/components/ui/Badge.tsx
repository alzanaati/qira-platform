import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
interface BadgeProps { children: ReactNode; variant?: 'default' | 'live' | 'verified' | 'success' | 'warning'; className?: string; }
export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = { default: 'bg-gray-700 text-gray-200', live: 'bg-red-600 text-white animate-pulse', verified: 'bg-blue-600 text-white', success: 'bg-green-600 text-white', warning: 'bg-yellow-600 text-white' };
  return <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>{children}</span>;
}