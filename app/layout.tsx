import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '../styles/calculator.css'
import '../styles/Index.css'
import Script from 'next/script'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FABSpeedDial from './components/FABSpeedDial'

const inter = Inter({ subsets: ['latin'] })

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
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          as="style"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
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
      </head>
      <body className={inter.className}>
        <Navbar />
        <main className="main-content" style={{ width: '100vw', maxWidth: '100vw', margin: 0, padding: 0 }}>
          {children}
        </main>
        <Footer />
        <FABSpeedDial />
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  )
} 