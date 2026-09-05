import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { siteConfig } from '@/config/site'
import { ReactQueryProvider } from '@/providers/react-query-provider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MobileNavigation } from '@/components/layout/MobileNavigation'
import { RouteLoader } from '@/components/ui/RouteLoader'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-black">
      <head>
        <meta name="referrer" content="no-referrer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} min-h-screen bg-[#141414] text-white antialiased`}>
        {/* Use Next.js Script component for better loading */}
        <Script
          src="https://cdn.tailwindcss.com"
          strategy="beforeInteractive"
        />
        <ReactQueryProvider>
          <RouteLoader />
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 pt-14 md:pt-16">{children}</main>
            <Footer />
            <MobileNavigation />
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  )
}