'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function About() {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href);
    }
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <section className="how-fast-hero p-4 rounded mb-4 d-flex align-items-center justify-content-center" style={{
        background: "linear-gradient(90deg, #e9f9f1 60%, #fbc23322 100%)",
        boxShadow: "0 4px 24px rgba(9,180,77,0.08)",
        minHeight: '180px'
      }}>
        <div className="text-center w-100">
          <h1 className="fw-bold mb-2 text-success" style={{ fontSize: "2.2rem", letterSpacing: "-1px" }}>
            About Us
          </h1>
          <div className="text-muted mb-2" style={{ fontSize: "1.1rem" }}>
            The transparent, stress-free way to unlock your structured settlement's value.
          </div>
          <Link href="/pricing-calculator" className="btn btn-success btn-lg mt-2">
            Get Your Instant Offer
          </Link>
        </div>
      </section>
      <div className="section-divider"></div>
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center text-center g-4">
            <div className="col-md-10 col-lg-8">
             
              <p className="lead text-center mb-4" style={{ color: '#198754', fontWeight: 700 }}>
                SmarterPayouts is a Florida-based structured settlement company, serving clients nationwide since 2017. We are officially registered on SunBiz and listed with the Better Business Bureau (BBB) to promote transparency and accountability.
              </p>
              <div className="text-start" style={{ maxWidth: 700, margin: '0 auto' }}>
                <p className="mb-3">
                  As a digital-first, Florida-based structured settlement company, we make structured settlement transfers simple, transparent, and fully online. Our mission is to empower clients with instant quotes, clear pricing, and a no-pressure, client-first experience—whether you need a structured settlement cash out or want to compare options.
                </p>
                <p className="mb-3">
                  We believe in transparent, court-approved structured settlement transfers and ethical, compliant business practices. Our team is dedicated to helping you make informed financial decisions, with no hidden fees or sales pressure.
                </p>
                <p className="mb-0">
                  You can verify our registration on SunBiz or review our BBB profile at any time. Discover why clients trust SmarterPayouts for structured settlement quotes and cash outs in Florida and nationwide.
                </p>
              </div>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 g-4 mt-4">
            <div className="col">
              <div className="p-4 bg-white shadow-sm rounded blog-article-enhanced text-start d-flex align-items-start gap-3">
                <div style={{ fontSize: '1.5rem' }} role="img" aria-label="Calculator">🧮</div>
                <div>
                  <strong>Instant Quote Calculator</strong><br />
                  First-of-its-kind in the industry
                </div>
              </div>
            </div>
            <div className="col">
              <div className="p-4 bg-white shadow-sm rounded blog-article-enhanced text-start d-flex align-items-start gap-3">
                <div style={{ fontSize: '1.5rem' }} role="img" aria-label="Mobile Phone">📲</div>
                <div>
                  <strong>100% Digital Workflows</strong><br />
                  DocuSign + court automation included
                </div>
              </div>
            </div>
            <div className="col">
              <div className="p-4 bg-white shadow-sm rounded blog-article-enhanced text-start d-flex align-items-start gap-3">
                <div style={{ fontSize: '1.5rem' }} role="img" aria-label="Handshake">🤝</div>
                <div>
                  <strong>Inform-First Sales Team</strong><br />
                  No pushy calls or quotas
                </div>
              </div>
            </div>
            <div className="col">
              <div className="p-4 bg-white shadow-sm rounded blog-article-enhanced text-start d-flex align-items-start gap-3">
                <div style={{ fontSize: '1.5rem' }} role="img" aria-label="Check Mark">✅</div>
                <div>
                  <strong>Transparent Pricing</strong><br />
                  No credit checks or personal data required
                </div>
              </div>
            </div>
          </div>
          <div className="section-divider"></div>
          {/* FAQ SECTION */}
          <div className="blog-article-enhanced p-4 bg-white rounded shadow-sm mt-5">
            <h2 className="fw-bold text-success mb-3">About Us FAQ</h2>
            <details className="mb-3">
              <summary className="fw-bold">What makes SmarterPayouts different?</summary>
              <div className="mt-2 text-muted">We offer instant online quotes, a 100% digital process, and never use pushy sales tactics. Our focus is on transparency and your comfort.</div>
            </details>
            <details className="mb-3">
              <summary className="fw-bold">Is my information safe?</summary>
              <div className="mt-2 text-muted">Yes. We never sell or share your information. All data is handled securely and confidentially.</div>
            </details>
            <details>
              <summary className="fw-bold">How can I contact your team?</summary>
              <div className="mt-2 text-muted">You can use our contact form, call, or email us anytime. We respond within 24 hours on business days.</div>
            </details>
          </div>
          <div className="hero-buttons text-center mt-5">
            <Link href="/pricing-calculator" className="cta-button primary">
              Get Your Instant Offer
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
