import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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
        {/* Regular script tag - remove strategy */}
        <script 
          src="https://cdn.tailwindcss.com" 
          defer
        />
        <style>
          {`
            .bg-netflix-red { background-color: #E50914; }
            .bg-netflix-red:hover { background-color: #F6121D; }
            .text-netflix-red { color: #E50914; }
            .border-netflix-red { border-color: #E50914; }
            .bg-netflix-dark { background-color: #141414; }
            .bg-netflix-darker { background-color: #0a0a0a; }
            .text-netflix-gray { color: #808080; }
          `}
        </style>
      </head>
      <body className={`${inter.className} min-h-screen bg-[#141414] text-white antialiased`}>
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