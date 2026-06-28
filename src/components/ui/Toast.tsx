'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
export type ToastType = 'success' | 'error' | 'info';
interface ToastProps { message: string; type?: ToastType; duration?: number; onClose: () => void; }
export default function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onClose, 300); }, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);
  const icons = { success: <CheckCircle size={18} className="text-green-400" />, error: <XCircle size={18} className="text-red-400" />, info: <AlertCircle size={18} className="text-blue-400" /> };
  const colors = { success: 'border-green-700', error: 'border-red-700', info: 'border-blue-700' };
  return (
    <div className={cn('fixed bottom-6 right-4 z-[100] flex items-center gap-3 px-4 py-3 bg-gray-900 border rounded-2xl shadow-2xl transition-all duration-300 max-w-sm', colors[type], visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2')}>
      {icons[type]}
      <p className="text-white text-sm flex-1">{message}</p>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="text-gray-400 hover:text-white"><X size={16} /></button>
    </div>
  );
}