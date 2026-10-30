import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { cookies } from 'next/headers'
import './globals.css'
import { ThemeScript } from '@/components/theme-script'

export const metadata: Metadata = {
  title: 'Noted — A community tech journal',
  description: 'A calm place to share and discover thoughtful notes about technology.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const theme = (await cookies()).get('theme')?.value
  const themeClass = theme === 'light' ? 'light' : theme === 'dark' ? 'dark' : undefined

  return (
    <html lang="en" className={themeClass}>
      <body className="antialiased">
        <ThemeScript />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
