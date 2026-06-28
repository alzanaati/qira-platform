import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
export const formatNumber = (n: number) => n >= 1000000 ? (n/1000000).toFixed(1)+'Ù' : n >= 1000 ? (n/1000).toFixed(1)+'Ù' : n.toString();
export const formatDate = (d: string) => new Date(d).toLocaleDateString('ar-SA', { year:'numeric', month:'short', day:'numeric' });
export const formatCurrency = (n: number) => n.toFixed(2) + ' Ø±.Ø³';


export function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `ÙÙØ° ${days} ÙÙÙ`;
  if (hours > 0) return `ÙÙØ° ${hours} Ø³Ø§Ø¹Ø©`;
  if (minutes > 0) return `ÙÙØ° ${minutes} Ø¯ÙÙÙØ©`;
  return 'Ø§ÙØ¢Ù';
}