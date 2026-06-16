import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Event Calendar System',
  description: 'A premium, interactive event management application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased`}>
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-grow container mx-auto p-4 md:p-8 animate-fade-in z-10 relative">
          {children}
        </main>

        {/* Premium Footer */}
        <footer className="w-full bg-slate-900/80 backdrop-blur-md border-t border-slate-800 py-6 mt-auto">
          <div className="container mx-auto text-center">
            <p className="text-slate-400 font-medium tracking-wide text-sm">
              Developed by <span className="text-violet-400 font-bold">Stackup Development Team</span>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
