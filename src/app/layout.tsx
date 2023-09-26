import './globals.css'
import type { Metadata } from 'next'
import { Fraunces } from 'next/font/google'
import ConvexClientProvider from './ConvexClientProvider'
import Head from 'next/head';

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
});

export const metadata: Metadata = {
  title: 'Chat DnD',
  description: 'A chat based D&D game',
}

export default function RootLayout({
  children,
} : {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${fraunces.className} font-sans`}>
      <Head>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
      <link rel="manifest" href="/site.webmanifest"/>
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
      <meta name="msapplication-TileColor" content="#da532c"/>
      <meta name="theme-color" content="#ffffff"/>
      </Head>
        <body className='relative'>
          <div className="absolute w-screen h-screen bg-cover bg-center" style={{backgroundImage: `url(/dnd-bg-min.jpg)`}}></div>
        <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
    </html>
  )
}
