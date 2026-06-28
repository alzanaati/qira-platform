import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; }
const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className, ...props }, ref) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm text-gray-300">{label}</label>}
    <input ref={ref} className={cn('bg-gray-800 border text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-500', error ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-blue-500', className)} {...props} />
    {error && <span className="text-red-400 text-xs">{error}</span>}
  </div>
));
Input.displayName = 'Input';
export default Input;