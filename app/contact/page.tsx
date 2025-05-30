'use client';
import { useState, FormEvent } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Contact() {
  const [formValidated, setFormValidated] = useState(false);
  const [thankYouVisible, setThankYouVisible] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      setFormValidated(true);
    } else {
      form.reset();
      setFormValidated(false);
      setThankYouVisible(true);
      setTimeout(() => setThankYouVisible(false), 4000);
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us | SmarterPayouts - Structured Settlement Experts</title>
        <meta
          name="description"
          content="Contact SmarterPayouts for questions about your structured settlement, instant quotes, or support. We're here to help you get the most from your settlement."
        />
        <meta
          name="keywords"
          content="structured settlement, contact, support, quote, help, payout"
        />
        <meta
          property="og:title"
          content="Contact SmarterPayouts - Structured Settlement Experts"
        />
        <meta
          property="og:description"
          content="Reach out to SmarterPayouts for fast, friendly support and answers to your structured settlement questions."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://smarterpayouts.com/assets/images/social-preview.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us | SmarterPayouts - Structured Settlement Experts" />
        <meta name="twitter:description" content="Contact SmarterPayouts for questions about your structured settlement, instant quotes, or support. We're here to help you get the most from your settlement." />
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
                  "name": "Contact",
                  "item": "https://smarterpayouts.com/contact"
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
          <h1 className="fw-bold mb-2 text-success" style={{ fontSize: "2.2rem", letterSpacing: "-1px" }}>
            Get In Touch
          </h1>
          <div className="text-muted mb-2" style={{ fontSize: "1.1rem" }}>
            We're here to help you get the most from your structured settlement. Reach out and our friendly team will respond within 24 hours.
          </div>
          <Link href="/pricing-calculator" className="btn btn-success btn-lg mt-2">
            Get Your Instant Offer
          </Link>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* CONTACT SECTION */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-5 align-items-start">
            {/* Contact Form */}
            <div className="col-md-7">
              <div className="p-4 bg-white rounded shadow-sm blog-article-enhanced mb-4">
                <h2 className="fw-bold text-success mb-3">Get in Touch</h2>
                <form
                  id="contactForm"
                  noValidate
                  onSubmit={handleSubmit}
                  className={formValidated ? 'was-validated' : ''}
                >
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Your Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder="Jane Doe"
                      required
                    />
                    <div className="invalid-feedback">Please enter your name.</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Your Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="you@email.com"
                      required
                    />
                    <div className="invalid-feedback">Please enter a valid email address.</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="subject" className="form-label">
                      Subject
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="subject"
                      placeholder="How can we help you?"
                      required
                    />
                    <div className="invalid-feedback">Please enter a subject.</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">
                      Your Message
                    </label>
                    <textarea
                      className="form-control"
                      id="message"
                      rows={5}
                      placeholder="Type your message here..."
                      required
                    ></textarea>
                    <div className="invalid-feedback">Please enter your message.</div>
                  </div>
                  <button type="submit" className="btn btn-success px-4">
                    Send Message
                  </button>
                  {thankYouVisible && (
                    <div
                      id="thankYouMessage"
                      className="mt-3 text-success fw-bold"
                      aria-live="polite"
                    >
                      Thank you! We'll be in touch shortly.
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Contact Info + Map */}
            <div className="col-md-5">
              <div className="p-4 bg-white rounded shadow-sm blog-article-enhanced h-100" style={{ padding: '2rem 1.5rem', minWidth: 0 }}>
                <h4 className="fw-bold mb-4" style={{ fontSize: '1.25rem', letterSpacing: '-0.5px' }}>SmarterPayouts</h4>
                <div className="mb-3 d-flex align-items-center" style={{ gap: 12 }}>
                  <span className="d-flex align-items-center justify-content-center" style={{ fontSize: '1.15rem', width: 28 }} aria-label="Email" role="img">📧</span>
                  <span style={{ fontWeight: 600, minWidth: 70 }}>Email:</span>
                  <span style={{ fontWeight: 400, fontSize: '1.04rem', wordBreak: 'break-all' }}>info@smarterpayouts.com</span>
                </div>
                <div className="mb-3 d-flex align-items-center" style={{ gap: 12 }}>
                  <span className="d-flex align-items-center justify-content-center" style={{ fontSize: '1.15rem', width: 28 }} aria-label="Phone" role="img">📞</span>
                  <span style={{ fontWeight: 600, minWidth: 70 }}>Phone:</span>
                  <span style={{ fontWeight: 400, fontSize: '1.04rem' }}>(954) 764-9750</span>
                </div>
                <div className="mb-3 d-flex align-items-center" style={{ gap: 12 }}>
                  <span className="d-flex align-items-center justify-content-center" style={{ fontSize: '1.15rem', width: 28 }} aria-label="Hours" role="img">⏰</span>
                  <span style={{ fontWeight: 600, minWidth: 70 }}>Hours:</span>
                  <span style={{ fontWeight: 400, fontSize: '1.04rem' }}>Mon–Fri, 9am – 6pm EST</span>
                </div>
                <div className="mb-4 d-flex align-items-start" style={{ gap: 12 }}>
                  <span className="d-flex align-items-center justify-content-center mt-1" style={{ fontSize: '1.15rem', width: 28 }} aria-label="Address" role="img">📍</span>
                  <div>
                    <span style={{ fontWeight: 600 }}>Address:</span>
                    <div style={{ fontWeight: 400, fontSize: '1.04rem', marginTop: 2 }}>
                      433 Plaza Real, Suite 275<br />Boca Raton, FL 33432
                    </div>
                  </div>
                </div>
                <iframe
                  className="w-100 rounded shadow-sm"
                  height="200"
                  loading="lazy"
                  src="https://www.google.com/maps?q=433+Plaza+Real,+Boca+Raton,+FL+33432&output=embed"
                  title="SmarterPayouts Location"
                  aria-label="Map showing SmarterPayouts location in Boca Raton, FL"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* FAQ SECTION */}
      <section className="container mb-5">
        <div className="blog-article-enhanced p-4 bg-white rounded shadow-sm">
          <h2 className="fw-bold text-success mb-3">Contact Us FAQ</h2>
          <div>
            <details className="mb-3">
              <summary className="fw-bold">How quickly will I get a response?</summary>
              <div className="mt-2 text-muted">We respond to all inquiries within 24 hours, Monday through Friday.</div>
            </details>
            <details className="mb-3">
              <summary className="fw-bold">Can I get a quote without a phone call?</summary>
              <div className="mt-2 text-muted">Yes! Use our <Link href="/pricing-calculator" className="text-success fw-bold text-decoration-underline">Early Payout Calculator</Link> for an instant, no-obligation quote online.</div>
            </details>
            <details className="mb-3">
              <summary className="fw-bold">Is my information confidential?</summary>
              <div className="mt-2 text-muted">Absolutely. We never share your information and all messages are handled securely and privately.</div>
            </details>
            <details>
              <summary className="fw-bold">What if I need urgent help?</summary>
              <div className="mt-2 text-muted">If your situation is urgent, mention it in your message and we'll prioritize your request.</div>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}
