import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '../styles/calculator.css'
import '../styles/Index.css'
import Script from 'next/script'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import dynamic from 'next/dynamic'
import { ReactNode } from 'react'
import ClientNavbarWrapper from './components/ClientNavbarWrapper'

const inter = Inter({ subsets: ['latin'] })

const LazyFABSpeedDial = dynamic(() => import('./components/FABSpeedDial'), { ssr: false })

export const metadata: Metadata = {
  title: 'Structured Settlement Calculator',
  description: 'Calculate and manage your structured settlement payments',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link rel="icon" href="/assets/images/favicon_without_text.ico" type="image/x-icon" />
        <title>SmarterPayouts – The First Real-Time Structured Settlement Calculator</title>
        <meta name="description" content="Instantly calculate your structured settlement lump sum payout with the industry's first real-time, logic-driven calculator. No sales calls, no personal info required." />
        <meta property="og:title" content="SmarterPayouts – The First Real-Time Structured Settlement Calculator" />
        <meta property="og:description" content="Instantly calculate your structured settlement lump sum payout with the industry's first real-time, logic-driven calculator. No sales calls, no personal info required." />
        <meta property="og:image" content="/assets/images/og-image.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://smarterpayouts.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/assets/images/og-image.png" />
        <link
          rel="preload"
          as="video"
          href="/assets/videos/promos/counting-cash.mp4"
          type="video/mp4"
        />
        <link
          rel="preload"
          as="image"
          href="/assets/images/fallback.jpg"
        />
      </head>
      <body className={inter.className}>
        {/* Only render Navbar if not hidden by page config */}
        <ClientNavbarWrapper />
        <main className="main-content" style={{ width: '100vw', maxWidth: '100vw', margin: 0, padding: 0 }}>
          {children}
        </main>
        <Footer />
        <LazyFABSpeedDial />
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
} 