import type { Metadata, Viewport } from 'next'
import { Playfair_Display, DM_Sans, DM_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap'
})

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: '--font-dm-sans',
  display: 'swap'
})

const dmMono = DM_Mono({ 
  subsets: ["latin"],
  weight: ['300', '400', '500'],
  variable: '--font-dm-mono',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'AutorSelo — Certificado Digital de Autoria',
  description: 'Registre sua obra com assinatura criptográfica RSA-PSS e salve no seu Google Drive. Proteção imediata de autoria para músicas e textos.',
  generator: 'v0.app',
  keywords: ['certificado digital', 'autoria', 'direitos autorais', 'música', 'texto', 'RSA-PSS', 'SHA-256'],
  authors: [{ name: 'AutorSelo' }],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1208',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
