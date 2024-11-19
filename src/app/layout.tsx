import { Metadata } from 'next';
import * as React from 'react';
import { Toaster } from 'react-hot-toast';

import '@/styles/globals.css';
import '@/styles/colors.css';

import Header from '@/components/shared/Header';

import { Providers } from '@/app/providers';
import { siteConfig } from '@/constant/config';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },

  icons: {
    icon: '/og.png',
    shortcut: '/og.png',
    apple: '/og.png',
  },
  manifest: `/favicon/site.webmanifest`,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [`${siteConfig.url}/og.png`],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Providers>
          <div className='fixed inset-0 w-screen h-screen bg-[url("/images/bg.png")] bg-cover bg-fixed' />
          
          <div className='relative z-10 min-h-screen flex flex-col'>
            <Header />
            <main className='flex-1 flex justify-center items-center'>{children}</main>
            
            <div className='fixed bottom-0 pointer-events-none z-0'>
              <img
                src='/svg/footer-text.svg'
                alt='Footer Text'
                className='w-full h-auto object-cover object-bottom'
              />
            </div>
            <div className='fixed bottom-3 px-3 flex justify-end w-full'>
              <div className='bg-white shadow-xl rounded-lg py-1 px-4'>Built with ❤️ by <a target='__blank' className='underline' href="https://warpcast.com/gayatri">@gayatri</a></div>
            </div>
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}