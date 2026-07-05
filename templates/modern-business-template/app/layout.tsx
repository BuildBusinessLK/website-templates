import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BuildBusinessLK SME Website',
  description: 'Public SME microsite powered by BuildBusinessLK',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
