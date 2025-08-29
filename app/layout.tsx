import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import {TrpcProvider} from "@/app/providers/trpc-provider";
import { LanguageProvider } from '@/context/language-context';

export const metadata: Metadata = {
  title: 'Frosto Core',
  description: 'Created by Futurio',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
      <LanguageProvider>
        <TrpcProvider>{children}</TrpcProvider>
      </LanguageProvider>
      </body>
    </html>
  )
}
