import './globals.css'
import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import ConvexClientProvider from './ConvexClientProvider'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Chat DnD',
  description: 'A chat based D&D game',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={fraunces.className}>
      <body className='relative'>
        <div className="absolute w-screen h-screen bg-cover bg-center" style={{backgroundImage: `url(/dnd-bg-min.jpg)`}}></div>
      <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  )
}
