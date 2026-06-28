import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}
export default function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';
  const variants = { primary: 'bg-blue-600 hover:bg-blue-700 text-white', secondary: 'bg-gray-700 hover:bg-gray-600 text-white', danger: 'bg-red-600 hover:bg-red-700 text-white', ghost: 'bg-transparent hover:bg-gray-700 text-gray-300' };
  const sizes = { sm: 'text-xs px-3 py-1.5 gap-1.5', md: 'text-sm px-4 py-2 gap-2', lg: 'text-base px-6 py-3 gap-2.5' };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props}>{children}</button>;
}