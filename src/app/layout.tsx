import { Metadata } from 'next';
import * as React from 'react';

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
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: `/favicon/site.webmanifest`,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [`${siteConfig.url}/images/og.jpg`],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/og.jpg`],
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
          <div className='relative h-screen overflow-hidden'>
            <div className='absolute inset-0 -z-10'>
              <div className='absolute inset-0 bg-[url("/images/bg.png")] bg-cover bg-center' />
            </div>

            <div className='relative z-10 h-[100dvh] flex flex-col'>
              <Header />

              <main className='flex-1 flex justify-center items-center'>{children}</main>

              {/* <div className='pointer-events-none z-0'>
                <img
                  src='/svg/footer-text.svg'
                  alt='Footer Text'
                  className='w-full h-auto object-cover object-bottom'
                />
              </div> */}
                            
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
