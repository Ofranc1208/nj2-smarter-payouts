'use client';

import { ClientFAQ } from './SharedFAQ';
import { miniFAQData } from '../data/faqData';
import Link from 'next/link';

export default function MiniFAQ() {
  return (
    <section className="py-5 bg-white">
      <div className="container">
        <h3 className="text-center fw-bold text-success mb-4">Common Questions, Clear Answers</h3>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <ClientFAQ items={miniFAQData} id="miniFAQ" />
            <div className="text-center mt-3">
              <Link href="/faqs" className="btn btn-outline-success">
                See All FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
