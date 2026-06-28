import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Ø§ÙØ±Ø£ - ÙÙØµØ© Ø§ÙÙØ¹Ø±ÙØ© Ø§ÙØ¹Ø±Ø¨ÙØ©', description: 'ÙÙØµØ© ÙØ¹Ø±ÙÙØ© ÙØªØ¹ÙÙÙÙØ© ÙØ§Ø¬ØªÙØ§Ø¹ÙØ© Ø¹Ø±Ø¨ÙØ©' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-cairo">{children}</body>
    </html>
  );
}
