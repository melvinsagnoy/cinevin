import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { siteConfig } from '@/config/site'
import { ReactQueryProvider } from '@/providers/react-query-provider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MobileNavigation } from '@/components/layout/MobileNavigation'
import { RouteLoader } from '@/components/ui/RouteLoader'
import { ToastProvider } from '@/components/ui/Toast'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Watch Movies & TV Shows`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} bg-cinevin-dark`}>
      <head>
        <meta name="referrer" content="no-referrer" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0F0F0F" />
      </head>
      <body className={`${inter.className} min-h-screen bg-cinevin-dark text-cinevin-text antialiased`}>
        <ReactQueryProvider>
          <ToastProvider>
            <RouteLoader />
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 page-offset pb-20 md:pb-0">
                {children}
              </main>
              <Footer />
              <MobileNavigation />
            </div>
          </ToastProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}