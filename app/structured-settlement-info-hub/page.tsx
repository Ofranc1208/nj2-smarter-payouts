import Head from 'next/head';
import Link from 'next/link';

export default function StructuredSettlementInfoHub() {
  // Article Schema for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Structured Settlement Info Hub | Complete Guide & Resources",
    "description": "Comprehensive guide to structured settlements: selling, laws by state, lump sum payouts, and tax rules. Learn everything about structured settlements at SmarterPayouts.",
    "image": "https://smarterpayouts.com/assets/images/social-preview.jpg",
    "author": {
      "@type": "Organization",
      "name": "SmarterPayouts",
      "url": "https://smarterpayouts.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SmarterPayouts",
      "logo": {
        "@type": "ImageObject",
        "url": "https://smarterpayouts.com/assets/images/logo.png"
      }
    },
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://smarterpayouts.com/structured-settlement-info-hub"
    }
  };

  // Breadcrumb Schema for Navigation
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://smarterpayouts.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Knowledge Hub",
        "item": "https://smarterpayouts.com/structured-settlement-info-hub"
      }
    ]
  };

  return (
    <>
      <Head>
        <title>Structured Settlement Info Hub | SmarterPayouts</title>
        <meta name="description" content="Comprehensive guide to structured settlements: selling, laws by state, lump sum payouts, and tax rules. Learn everything about structured settlements at SmarterPayouts." />
        <meta name="robots" content="index, follow" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema)
          }}
        />
      </Head>
      <main className="container py-5">
        <article className="row">
          <div className="col-lg-8">
            <header className="mb-5">
              <h1 className="display-4 fw-bold mb-3">Structured Settlement Info Hub</h1>
              <p className="lead">Your comprehensive resource for understanding, selling, and maximizing your structured settlement payout.</p>
            </header>

            <section className="mb-5">
              <h2 className="h2 fw-semibold mb-3">What is a structured settlement?</h2>
              <p>
                Structured settlements are financial arrangements that provide periodic payments to individuals, typically as a result of a personal injury lawsuit or insurance claim. These payments offer long-term financial security and are often tax-free.
              </p>
              <Link href="/structured-settlement-info-hub/what-is-a-structured-settlement" className="btn btn-outline-success">
                Learn More About Structured Settlements
              </Link>
            </section>

            <section className="mb-5">
              <h2 className="h2 fw-semibold mb-3">Can I sell my structured settlement?</h2>
              <p>
                Yes, you can sell your structured settlement payments for a lump sum of cash. The process involves court approval and varies by state. Selling your settlement can provide immediate funds for major expenses or financial goals.
              </p>
              <Link href="/structured-settlement-info-hub/how-to-sell-structured-settlement" className="btn btn-outline-success">
                Learn How to Sell Your Settlement
              </Link>
            </section>

            <section className="mb-5">
              <h2 className="h2 fw-semibold mb-3">Explore Our Resources</h2>
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <h3 className="h5">State Laws & Requirements</h3>
                      <p>Learn about structured settlement laws in your state.</p>
                      <Link href="/structured-settlement-info-hub/state-laws" className="btn btn-outline-success">
                        View State Laws
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <h3 className="h5">Court Approval Process</h3>
                      <p>Understand the legal requirements for selling.</p>
                      <Link href="/structured-settlement-info-hub/court-approval-process" className="btn btn-outline-success">
                        Learn About Court Approval
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <h3 className="h5">Glossary of Terms</h3>
                      <p>Definitions of key structured settlement terms.</p>
                      <Link href="/structured-settlement-info-hub/glossary-of-structured-settlement-terms" className="btn btn-outline-success">
                        View Glossary
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <h3 className="h5">FAQ</h3>
                      <p>Answers to common questions about settlements.</p>
                      <Link href="/structured-settlement-info-hub/faq" className="btn btn-outline-success">
                        Read FAQ
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="col-lg-4">
            <div className="card mb-4">
              <div className="card-body">
                <h3 className="h5">Get Your Instant Quote</h3>
                <p>Find out how much your structured settlement is worth today.</p>
                <Link href="/pricing-calculator" className="btn btn-success w-100">
                  Calculate Your Offer
                </Link>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <h3 className="h5">Need Help?</h3>
                <p>Our experts are here to answer your questions.</p>
                <Link href="/contact" className="btn btn-outline-success w-100">
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h3 className="h5">Related Articles</h3>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <Link href="/structured-settlement-info-hub/pros-cons-selling-structured-settlement" className="text-decoration-none">
                      Pros & Cons of Selling
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link href="/structured-settlement-info-hub/maximize-offer-selling-structured-settlement" className="text-decoration-none">
                      How to Maximize Your Offer
                    </Link>
                  </li>
                  <li>
                    <Link href="/structured-settlement-info-hub/common-mistakes-selling-structured-settlement" className="text-decoration-none">
                      Common Mistakes to Avoid
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </article>
      </main>
    </>
  );
} 