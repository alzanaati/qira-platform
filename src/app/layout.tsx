import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'اقرأ - منصة المعرفة العربية', description: 'منصة معرفية وتعليمية واجتماعية عربية' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-cairo">{children}</body>
    </html>
  );
}
