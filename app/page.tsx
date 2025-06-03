'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
    const pulse = document.getElementById('pulseText');
    if (pulse) {
      pulse.classList.add('pulse-effect');
    }
  }, []);

  // Hide navbar only on homepage
  useEffect(() => {
    const navbar = document.querySelector('.navbar') as HTMLElement | null;
    if (navbar) {
      navbar.style.display = 'none';
    }
    return () => {
      if (navbar) {
        navbar.style.display = '';
      }
    };
  }, []);

  return (
    <main className="home-main">
      <header>
        {/* Navbar is handled globally */}
      </header>
      <Head>
        <title>SmarterPayouts - Get the Highest Early Payout for Your Future Payments</title>
        <meta
          name="description"
          content="Get the highest early payout for your future payments instantly. No pushy sales calls. No sensitive personal information required. Industry's first online self-quoting platform."
        />
        <meta
          name="keywords"
          content="structured settlement, early payout, cash now, settlement calculator"
        />
        <meta property="og:title" content="SmarterPayouts - Get Your Early Payout Today" />
        <meta
          property="og:description"
          content="Get the highest early payout for your future payments instantly. No pushy sales calls required."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
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
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SmarterPayouts - Get the Highest Early Payout for Your Future Payments" />
        <meta name="twitter:description" content="Get the highest early payout for your future payments instantly. No pushy sales calls. No sensitive personal information required. Industry's first online self-quoting platform." />
        <meta name="twitter:site" content="@SmarterPayouts" />
        <meta name="twitter:image" content="https://smarterpayouts.com/assets/images/social-preview.jpg" />

        {/* JSON-LD Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "SmarterPayouts",
              "url": "https://smarterpayouts.com",
              "logo": "https://smarterpayouts.com/assets/images/logo.png",
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "+1-954-764-9750",
                  "contactType": "customer service",
                  "areaServed": "US",
                  "availableLanguage": "English"
                }
              ],
              "sameAs": [
                "https://www.bbb.org/",
                "https://search.sunbiz.org/Inquiry/CorporationSearch/ByName"
              ]
            })
          }}
        />

        {/* JSON-LD SiteNavigationElement */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SiteNavigationElement",
              "name": [
                "Calculator",
                "About",
                "Contact",
                "Testimonials",
                "Credentials",
                "Resources"
              ],
              "url": [
                "https://smarterpayouts.com/pricing-calculator",
                "https://smarterpayouts.com/about",
                "https://smarterpayouts.com/contact",
                "https://smarterpayouts.com/testimonials",
                "https://smarterpayouts.com/credentials",
                "https://smarterpayouts.com/resources"
              ]
            })
          }}
        />

        <meta property="og:image" content="https://smarterpayouts.com/assets/images/social-preview.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>

      {/* ✅ HERO SECTION */}
      <section className="hero">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/assets/images/fallback.jpg"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: -1
          }}
        >
          <source src="/assets/videos/promos/counting-cash.webm" type="video/webm" />
          <source src="/assets/videos/promos/counting-cash.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/**
        <video autoPlay muted loop playsInline preload="metadata" id="bg-video" poster="/assets/images/fallback.jpg">
          <source src="/assets/videos/promos/counting-cash.mp4" type="video/mp4" />
          <Image src="/assets/images/fallback.jpg" alt="Structured Settlement Video Preview" width={1920} height={1080} priority />
        </video>
        */}

        <div className="overlay"></div>

        <div className="hero-content text-center">
          <h1 id="pulseText" className="fw-bold text-white display-5">
            Skip the Sales Pitch
          </h1>
          <p></p>
          <h2 className="lead fs-4 fw-semibold text-light mt-3">
          Discover your settlement's early payout value today.
          </h2>
          <p></p>
          <p className="fs-5 text-light">
          No personal info needed to see your quote.
          </p>

          <p className="fs-5 text-light mt-2">
          You're in control — not the sales team.
          </p>

          <div className="hero-buttons mt-4">
            <Link href="/main" className="cta-button secondary">
              How Our Process Works
            </Link>
            <Link href="/pricing-calculator" className="cta-button primary">
              Early Payout Calculator
            </Link>
          </div>
        </div>
      </section>

     
    </main>
  );
}
