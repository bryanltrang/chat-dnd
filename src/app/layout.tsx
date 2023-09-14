import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ConvexClientProvider from './ConvexClientProvider'

const inter = Inter({
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
    <html lang="en" className={inter.className}>
      <body>
      <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
    </html>
  )
}
