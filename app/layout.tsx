import type { Metadata } from 'next';
import './globals.css';
import { buildMetadata, defaultMetadata, siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...buildMetadata({
    title: defaultMetadata.title,
    description: defaultMetadata.description,
    path: '/',
  }),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
