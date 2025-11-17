// app/layout.tsx
import { Inter } from 'next/font/google';
import './globals.css';
import { NotificationProvider } from '@/components/notifications/NotificationContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Task Management System',
  description: 'Full-Stack Task Management Assessment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-white `}>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}