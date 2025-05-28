export const metadata = {
  title: "Structured Settlement Calculator | Real-Time Payout Estimates | SmarterPayouts",
  description: "Use our real-time structured settlement calculator to get an instant lump sum payout estimate. Fast, free, and more accurate than JG Wentworth or DRB Financial."
};

import React, { Suspense } from 'react';
import PricingCalculator from './PricingCalculatorClient';

export default function PricingCalculatorPageWrapper() {
  return (
    <Suspense fallback={<div>Loading calculator...</div>}>
      <PricingCalculator />
    </Suspense>
  );
}
