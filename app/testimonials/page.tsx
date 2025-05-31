'use client';
import React from 'react';
import './testimonials.css';
import Head from 'next/head';
import Image from 'next/image';

const testimonials = [
  {
    name: 'Nat Reynolds',
    location: 'Denver, CO',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'SmarterPayouts gave me an instant quote online with zero hassle. The process was transparent, there were no hidden fees, and I felt in control the entire time. Highly recommend their modern, digital approach!',
    alt: 'Profile photo of Nat Reynolds',
    altBg: false,
  },
  {
    name: 'Celia Almeda',
    location: 'Austin, TX',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'I loved how easy it was to get a quote without any phone calls or pressure. Everything was clear, fast, and I always knew what to expect. SmarterPayouts is truly a step ahead!',
    alt: 'Profile photo of Celia Almeda',
    altBg: true,
  },
  {
    name: 'Roberto García',
    location: 'Miami, FL',
    img: 'https://randomuser.me/api/portraits/men/65.jpg',
    text: 'The online process was simple and transparent. I appreciated the honest pricing and the fact that there were no hidden fees. I would recommend SmarterPayouts to anyone looking for a trustworthy company.',
    alt: 'Profile photo of Roberto García',
    altBg: false,
  },
  {
    name: 'Lori Stanley',
    location: 'New York, NY',
    img: 'https://randomuser.me/api/portraits/women/68.jpg',
    text: 'Truly revolutionized the way I work, providing a seamless experience that streamlines tasks and enhances productivity. Its intuitive interface and comprehensive features make it an indispensable tool for professionals in any industry.',
    alt: 'Profile photo of Lori Stanley',
    altBg: true,
  },
  {
    name: 'Sintia Kent',
    location: 'Chicago, IL',
    img: 'https://randomuser.me/api/portraits/women/65.jpg',
    text: 'This platform has exceeded my expectations with its user-friendly interface and robust functionality. It has significantly improved my workflow efficiency and collaboration capabilities, making it an essential tool for my team\'s success.',
    alt: 'Profile photo of Sintia Kent',
    altBg: false,
  },
];

// Add a vertical testimonial card list below the carousel/scroll-row
const verticalTestimonials = [
  {
    name: 'Maria S.',
    location: 'NY',
    text: 'No surprises, no stress. The self-calculate tool is a game changer.',
  },
  {
    name: 'James L.',
    location: 'GA',
    text: 'Quick, easy, and the team answered all my questions.',
  },
  {
    name: 'D. Chen',
    location: 'CA',
    text: 'I appreciated the transparency and how simple everything was.',
  },
  {
    name: 'Samantha R.',
    location: 'FL',
    text: 'I felt in control and informed every step of the way.',
  },
  {
    name: 'Brian T.',
    location: 'TX',
    text: 'Got my payout options in minutes. Very professional and friendly service.',
  },
];

export default function TestimonialsPage() {
  return (
    <>
      <Head>
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Client Testimonials – SmarterPayouts" />
        <meta name="twitter:description" content="Read real reviews from clients who trusted SmarterPayouts with their structured settlement payouts." />
        <meta name="twitter:site" content="@SmarterPayouts" />
        <meta name="twitter:image" content="https://smarterpayouts.com/assets/images/social-preview.jpg" />

        {/* Open Graph */}
        <meta property="og:image" content="https://smarterpayouts.com/assets/images/social-preview.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

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

        {/* JSON-LD Breadcrumb */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://smarterpayouts.com/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Testimonials",
                  "item": "https://smarterpayouts.com/testimonials"
                }
              ]
            })
          }}
        />
      </Head>
      {/* HERO SECTION */}
      <section className="how-fast-hero p-4 rounded mb-4 d-flex align-items-center justify-content-center" style={{
        background: "linear-gradient(90deg, #e9f9f1 60%, #fbc23322 100%)",
        boxShadow: "0 4px 24px rgba(9,180,77,0.08)",
        minHeight: '180px'
      }}>
        <div className="text-center w-100">
          <div className="testimonials-hero-title">
            What Our Clients Are Saying
          </div>
          <div className="testimonials-hero-subtitle">
            Real feedback from real people. Discover why clients trust SmarterPayouts for a transparent, no-pressure experience.
          </div>
        </div>
      </section>
      <div className="section-divider"></div>
      <section className="container py-5">
        {/* Horizontally Scrollable Testimonial Row */}
        <div className="testimonial-scroll-row" style={{ overflowX: 'auto', display: 'flex', gap: '1.5rem', paddingBottom: '2rem', WebkitOverflowScrolling: 'touch' }}>
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="featured-testimonial"
              style={{ minWidth: 320, maxWidth: 400, flex: '0 0 auto', margin: '0 auto' }}
              tabIndex={0}
            >
              <Image
                src={t.img}
                alt={t.alt}
                className="testimonial-profile"
                width={64}
                height={64}
                priority={i === 0}
                style={{ marginBottom: '0.7rem' }}
              />
              <div className="testimonial-stars" aria-label="5 star rating">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="testimonial-star">★</span>
                ))}
              </div>
              <div className="testimonial-quote" aria-hidden="true">“</div>
              <div className="testimonial-text" style={{ textAlign: 'center' }}>{t.text}</div>
              <div className="testimonial-author">
                {t.name.toUpperCase()}
                <span className="testimonial-location">{t.location}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Vertical Testimonial Card List at the bottom */}
        <div className="vertical-testimonials-list">
          {verticalTestimonials.map((t, i) => (
            <div key={t.name} className="vertical-testimonial-card">
              {i === 0 && (
                <Image
                  src="https://randomuser.me/api/portraits/women/65.jpg"
                  alt={`Profile photo of ${t.name}`}
                  className="vertical-testimonial-profile"
                  width={48}
                  height={48}
                  loading="lazy"
                />
              )}
              {i === 1 && (
                <Image
                  src="https://randomuser.me/api/portraits/men/33.jpg"
                  alt={`Profile photo of ${t.name}`}
                  className="vertical-testimonial-profile"
                  width={48}
                  height={48}
                  loading="lazy"
                />
              )}
              {i === 2 && (
                <Image
                  src="https://randomuser.me/api/portraits/women/68.jpg"
                  alt={`Profile photo of ${t.name}`}
                  className="vertical-testimonial-profile"
                  width={48}
                  height={48}
                  loading="lazy"
                />
              )}
              <div className="vertical-testimonial-stars" aria-label="5 star rating">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="vertical-testimonial-star">★</span>
                ))}
              </div>
              <div className="vertical-testimonial-text">"{t.text}"</div>
              <div className="vertical-testimonial-author">
                {t.name}
                <span className="vertical-testimonial-location">{t.location}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
} 