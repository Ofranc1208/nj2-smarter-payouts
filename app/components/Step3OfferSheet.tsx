'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { calculateMinMaxNPV } from '../utils/npvCalculations';
import { AMOUNT_ADJUSTMENTS } from '../utils/npvConfig';
import UnlockModal from './UnlockModal';

interface Props {
  calculationResult: any;
  formData: any;
  onBack?: () => void;
}

export default function Step3OfferSheet({ calculationResult, formData, onBack }: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const bannerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!unlocked) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 12000); // 12 seconds
      return () => clearTimeout(timer);
    }
  }, [unlocked]);

  useEffect(() => {
    console.log('[Step3OfferSheet] showModal:', showModal, 'unlocked:', unlocked);
  }, [showModal, unlocked]);

  // Remove ?result=... from the URL after showing the result (for lump sum flow)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.history && window.location.search.includes('result=')) {
      const url = new URL(window.location.href);
      url.searchParams.delete('result');
      window.history.replaceState({}, document.title, url.pathname + url.search);
    }
  }, []);

  // Clean up banner timeout on unmount
  useEffect(() => {
    return () => {
      if (bannerTimeoutRef.current) clearTimeout(bannerTimeoutRef.current);
    };
  }, []);

  const handleUnlockSuccess = () => {
    console.log('[Step3OfferSheet] handleUnlockSuccess called');
    setUnlocked(true);
    setShowModal(false);
    setShowBanner(true);
    if (bannerTimeoutRef.current) clearTimeout(bannerTimeoutRef.current);
    bannerTimeoutRef.current = setTimeout(() => {
      setShowBanner(false);
    }, 2500); // 2.5 seconds
  };

  const { minOffer, maxOffer, familyProtectionNPV, npv } = calculationResult || {};

  // If minOffer/maxOffer are not present, try to calculate from formData (for legacy/other flows)
  let min = minOffer, max = maxOffer;
  if ((typeof min !== 'number' || typeof max !== 'number') && formData) {
    const minMax = calculateMinMaxNPV({
      amount: formData.amount,
      startDate: formData.startDate,
      endDate: formData.endDate,
      baseRate: parseFloat(formData.discountRate) / 100,
      paymentMode: formData.paymentMode,
      increaseRate: formData.increaseRate,
      minAdjustment: AMOUNT_ADJUSTMENTS.min,
      maxAdjustment: AMOUNT_ADJUSTMENTS.max,
      isLCP: formData.paymentType === 'Life Contingent',
      lcpKeys: formData.lcpAnswers || formData.lcpKeys || []
    });
    min = minMax.minOffer;
    max = minMax.maxOffer;
  }

  const format = (val: number): string =>
    val?.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  let noOfferMessage = 'No offer available.';
  const paymentType = formData?.paymentType || '';
  if (paymentType === 'Guaranteed') noOfferMessage = 'No Guaranteed offer available.';
  else if (paymentType === 'Life Contingent') noOfferMessage = 'No Life Contingent offer available.';
  else if (paymentType === 'Lump Sum') noOfferMessage = 'No Lump Sum offer available.';

  if (!min || !max || isNaN(min) || isNaN(max)) {
    return (
      <div className="calculator text-center p-4">
        <h2 className="text-center mb-3">Early Payout Calculator</h2>
        <p className="text-danger mb-3">⚠️ {noOfferMessage}</p>
        <button className="btn btn-warning w-50" onClick={onBack || (() => router.back())}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="step calculator text-center px-3 py-4">
      {showBanner && (
        <div style={{
          background: '#e6f9ed',
          color: '#22b455',
          borderRadius: '8px',
          padding: '0.75rem 1.5rem',
          margin: '0 auto 1.5rem auto',
          maxWidth: 400,
          fontWeight: 600,
          fontSize: '1.1rem',
          boxShadow: '0 2px 8px rgba(34,180,85,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}>
          <span role="img" aria-label="party">🎉</span> Offer Unlocked!
        </div>
      )}
      <div className="bg-white rounded shadow-sm p-4 mx-auto" style={{ maxWidth: '500px', background: 'linear-gradient(90deg, #f8fafc 60%, #fbc23311 100%)', boxShadow: '0 4px 24px rgba(9,180,77,0.08)' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: 12, lineHeight: 1 }} aria-hidden="true">🎉</div>
        <h2 className="offer-brand mb-3 text-success fw-bold d-flex align-items-center justify-content-center" style={{ gap: 8, fontSize: '1.18rem', marginBottom: 18 }}>
          <span style={{ fontSize: '1.18rem' }}>✅</span> Congratulations
        </h2>
        <p className="offer-subtitle text-muted mb-3" style={{ fontSize: '1.01rem', marginBottom: 18 }}>
          Here's your Early Payout offer.<br />
          Funding available in as little as <strong>30 days</strong>.
        </p>
        <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '18px 0 18px 0' }} />
        <ul className="offer-list list-unstyled mb-4" style={{ marginBottom: 24 }}>
          <li className="offer-item d-flex justify-content-between px-3 py-2 border-bottom" style={{ background: 'transparent', marginBottom: 10 }}>
            <span className="offer-label fw-medium">Min Offer</span>
            <span className="offer-value text-secondary">${format(min)}</span>
          </li>
          <li className="offer-item d-flex flex-column align-items-center px-3 py-3 border-bottom bg-light rounded mb-3" style={{ position: 'relative', background: '#f8fafc', marginBottom: 18 }}>
            <div className="d-flex align-items-center mb-2">
              <span className="offer-label fw-medium me-2">Max Payout Offer</span>
            </div>
            <span className="offer-value text-success fw-bold" style={{ fontSize: '2rem', animation: 'pop 0.7s cubic-bezier(.23,1.12,.67,1.01)' }}>
              ${format(max)}
            </span>
            <small className="text-muted mt-2">This is the highest amount you may qualify for.</small>
          </li>
          {typeof familyProtectionNPV === 'number' && (
            <li className="offer-item d-flex justify-content-between px-3 py-2 border-bottom" style={{ background: 'transparent', marginBottom: 10 }}>
              <span className="offer-label fw-medium">Family Benefit</span>
              <span className="offer-value text-muted fw-semibold">${format(familyProtectionNPV)}</span>
            </li>
          )}
        </ul>
        <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '18px 0 18px 0' }} />
        <div className="offer-footer mt-5 small text-muted" style={{ marginTop: 32 }}>
          <strong>SmarterPayouts LLC</strong>
          <br />
          433 Plaza Real, Suite 275
          <br />
          Boca Raton, FL 33432
          <br />
          <a href="tel:+19547649750" className="text-reset text-decoration-none">
            (954) 764-9750
          </a>{' '}
          •{' '}
          <a href="mailto:info@smarterpayouts.com" className="text-reset text-decoration-none">
            info@smarterpayouts.com
          </a>
        </div>
      </div>
      <style>{`
        @keyframes pop {
          0% { transform: scale(0.7); opacity: 0.5; }
          60% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      {!unlocked && showModal && (
        <UnlockModal key={showModal ? 'open' : 'closed'} onClose={handleUnlockSuccess} />
      )}
    </div>
  );
}
