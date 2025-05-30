export const metadata = {
  title: "Mobile Friendly Structured Settlement Calculator | 24/7 Access | SmarterPayouts",
  description: "Get a quote for your structured settlement anytime, anywhere. Our mobile-friendly calculator is fast, secure, and available 24/7 on any device.",
  keywords: "mobile friendly, 24/7 access, structured settlement calculator, instant quote, any device, SmarterPayouts"
};

import React, { Suspense } from 'react';
import PricingCalculator from './PricingCalculatorClient';

export default function PricingCalculatorPageWrapper() {
  return (
    <>
      <section className="how-fast-hero p-4 rounded mb-4 d-flex align-items-center justify-content-center" style={{
        background: "linear-gradient(90deg, #e9f9f1 60%, #fbc23322 100%)",
        boxShadow: "0 4px 24px rgba(9,180,77,0.08)",
        minHeight: '180px'
      }}>
        <div className="text-center w-100">
          <h1 className="fw-bold mb-2 text-success" style={{ fontSize: "2.2rem", letterSpacing: "-1px" }}>
            Get your instant payout quote today.
          </h1>
          <div className="text-muted mb-2" style={{ fontSize: "1.1rem" }}>
            {/* Header simplified as requested. */}
          </div>
        </div>
      </section>
      <Suspense fallback={<div>Loading calculator...</div>}>
        <PricingCalculator />
      </Suspense>
    </>
  );
}
