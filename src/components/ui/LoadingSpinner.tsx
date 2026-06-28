import { cn } from '@/lib/utils';
export default function LoadingSpinner({ size=32, className }: { size?: number; className?: string }) {
  return <div className={cn('border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin-slow', className)} style={{width:size,height:size}} />;
}
