import Head from 'next/head';
import Link from 'next/link';

export const metadata = {
  title: 'Court Approval Process for Structured Settlements | Complete Guide | SmarterPayouts',
  description: 'Learn about the court approval process for selling your structured settlement. Expert guide covering requirements, timeline, and what to expect. Get your instant quote today.',
  openGraph: {
    title: 'Court Approval Process for Structured Settlements | Complete Guide | SmarterPayouts',
    description: 'Learn about the court approval process for selling your structured settlement. Expert guide covering requirements, timeline, and what to expect.',
    type: 'article',
    url: 'https://smarterpayouts.com/structured-settlement-info-hub/court-approval-process',
  }
};

export default function CourtApprovalProcess() {
  // FAQ Schema for AI SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Why is court approval required to sell a structured settlement?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Court approval is required by federal law (IRCA) to protect your interests. The judge reviews the sale to ensure it's in your best interest, considering factors like your financial needs, the sale terms, and any dependents' needs."
        }
      },
      {
        "@type": "Question",
        "name": "How long does court approval take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The court approval process typically takes 2-4 weeks after filing. This includes the independent advisor review, court hearing, and judge's decision. Some states may process faster, while others may take longer depending on court schedules."
        }
      },
      {
        "@type": "Question",
        "name": "What happens at the court hearing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The court hearing is typically brief (15-30 minutes). The judge reviews your case, may ask questions about your decision, and ensures you understand the terms. An independent advisor's report is considered, and the judge makes a final decision."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need to attend the court hearing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, your attendance is usually required. The judge needs to verify your understanding and consent. However, some states allow remote participation via video conference. We'll guide you through the specific requirements for your state."
        }
      },
      {
        "@type": "Question",
        "name": "What if the court denies the sale?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "If denied, we can help you understand why and suggest modifications to address the court's concerns. Common reasons include unclear financial need or unfavorable terms. We work with you to revise the proposal if needed."
        }
      }
    ]
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>

      <main className="container py-5">
        {/* Hero Section */}
        <section className="mb-5">
          <h1 className="display-4 fw-bold mb-4">Court Approval Process</h1>
          <p className="lead text-muted">
            Understanding the court approval process for selling your structured settlement - what to expect, how to prepare, and why it's important.
          </p>
          <div className="alert alert-success d-inline-block mt-3">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </section>

        {/* Main Content */}
        <article className="row">
          <div className="col-lg-8">
            {/* Overview Section */}
            <section className="mb-5">
              <h2 className="h3 mb-4">Why Court Approval is Required</h2>
              <p>
                The court approval process is a crucial protection mechanism established by federal law 
                (IRCA - Internal Revenue Code Act). Here's why it matters:
              </p>
              <div className="card bg-light mb-4">
                <div className="card-body">
                  <h3 className="h5">Key Protections:</h3>
                  <ul className="list-unstyled">
                    <li className="mb-2">✅ Ensures the sale is in your best interest</li>
                    <li className="mb-2">✅ Protects against predatory practices</li>
                    <li className="mb-2">✅ Considers your financial needs</li>
                    <li className="mb-2">✅ Reviews impact on dependents</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Process Timeline */}
            <section className="mb-5">
              <h2 className="h3 mb-4">The Court Approval Timeline</h2>
              
              <div className="timeline">
                {/* Step 1 */}
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <span className="badge bg-success rounded-circle p-2 me-3">1</span>
                      <h3 className="h5 mb-0">Filing the Petition</h3>
                    </div>
                    <p>
                      After accepting your offer, we prepare and file the necessary court documents:
                    </p>
                    <ul>
                      <li>Transfer petition</li>
                      <li>Financial disclosure forms</li>
                      <li>Supporting documentation</li>
                      <li>State-specific requirements</li>
                    </ul>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <span className="badge bg-success rounded-circle p-2 me-3">2</span>
                      <h3 className="h5 mb-0">Independent Advisor Review</h3>
                    </div>
                    <p>
                      The court appoints an independent advisor to review your case:
                    </p>
                    <ul>
                      <li>Reviews your financial situation</li>
                      <li>Evaluates the sale terms</li>
                      <li>Considers your needs and goals</li>
                      <li>Prepares a report for the judge</li>
                    </ul>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <span className="badge bg-success rounded-circle p-2 me-3">3</span>
                      <h3 className="h5 mb-0">Court Hearing</h3>
                    </div>
                    <p>
                      The judge conducts a hearing to review your case:
                    </p>
                    <ul>
                      <li>Typically 15-30 minutes</li>
                      <li>Verifies your understanding</li>
                      <li>Reviews independent advisor's report</li>
                      <li>May ask questions about your decision</li>
                    </ul>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <span className="badge bg-success rounded-circle p-2 me-3">4</span>
                      <h3 className="h5 mb-0">Judge's Decision</h3>
                    </div>
                    <p>
                      The judge makes a final decision based on:
                    </p>
                    <ul>
                      <li>Your financial needs</li>
                      <li>Terms of the sale</li>
                      <li>Independent advisor's report</li>
                      <li>Your understanding and consent</li>
                    </ul>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <span className="badge bg-success rounded-circle p-2 me-3">5</span>
                      <h3 className="h5 mb-0">Final Order</h3>
                    </div>
                    <p>
                      If approved, the court issues a final order:
                    </p>
                    <ul>
                      <li>Authorizes the transfer</li>
                      <li>Sets payment terms</li>
                      <li>Protects your interests</li>
                      <li>Enables funding</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* State-Specific Requirements */}
            <section className="mb-5">
              <h2 className="h3 mb-4">State-Specific Requirements</h2>
              <p>
                Court approval requirements vary by state. Key differences include:
              </p>
              <div className="card mb-4">
                <div className="card-body">
                  <ul>
                    <li>Hearing format (in-person vs. remote)</li>
                    <li>Required documentation</li>
                    <li>Processing timelines</li>
                    <li>Independent advisor requirements</li>
                  </ul>
                  <Link href="/state-laws" className="btn btn-outline-success">
                    View Your State's Requirements
                  </Link>
                </div>
              </div>
            </section>

            {/* Common Questions */}
            <section className="mb-5">
              <h2 className="h3 mb-4">Common Questions About Court Approval</h2>
              <div className="accordion" id="courtQuestions">
                <div className="accordion-item">
                  <h3 className="accordion-header">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#q1">
                      What should I bring to the hearing?
                    </button>
                  </h3>
                  <div id="q1" className="accordion-collapse collapse show" data-bs-parent="#courtQuestions">
                    <div className="accordion-body">
                      Bring a valid photo ID and any documents we've asked you to prepare. We'll provide a complete checklist and guide you through the preparation process.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h3 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#q2">
                      Can I participate remotely?
                    </button>
                  </h3>
                  <div id="q2" className="accordion-collapse collapse" data-bs-parent="#courtQuestions">
                    <div className="accordion-body">
                      Many states now allow remote participation via video conference. We'll help you understand your state's specific requirements and arrange remote participation if available.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h3 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#q3">
                      What if I need to reschedule?
                    </button>
                  </h3>
                  <div id="q3" className="accordion-collapse collapse" data-bs-parent="#courtQuestions">
                    <div className="accordion-body">
                      We can help you request a rescheduling if needed. While this may extend the timeline, we'll work with the court to find a new date that works for you.
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Related Resources */}
            <section className="mb-5">
              <h2 className="h3 mb-4">Related Resources</h2>
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <h3 className="h5">State Laws & Requirements</h3>
                      <p>Learn about court approval requirements in your state.</p>
                      <Link href="/state-laws" className="btn btn-outline-success">
                        View State Laws
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <h3 className="h5">Complete Selling Guide</h3>
                      <p>Step-by-step guide to selling your structured settlement.</p>
                      <Link href="/how-to-sell-structured-settlement" className="btn btn-outline-success">
                        Read Guide
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
                <p>Start the process with a free quote.</p>
                <Link href="/pricing-calculator" className="btn btn-success w-100">
                  Calculate Your Offer
                </Link>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <h3 className="h5">Need Help?</h3>
                <p>Our experts are here to guide you through the court process.</p>
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
                    <Link href="/blog/court-approval-tips" className="text-decoration-none">
                      Tips for Court Approval Success
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link href="/blog/state-requirements" className="text-decoration-none">
                      State-by-State Court Requirements
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog/common-denials" className="text-decoration-none">
                      Common Reasons for Court Denials
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