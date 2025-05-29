'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { calculateMinMaxNPV } from '../utils/npvCalculations';
import { AMOUNT_ADJUSTMENTS } from '../utils/npvConfig';
import { db } from '../utils/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import styles from './OfferConfirmation.module.css';

// Phone number formatter
function formatPhoneNumber(value: string) {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (!match) return '';
  let formatted = '';
  if (match[1]) {
    formatted = '(' + match[1];
  }
  if (match[2]) {
    formatted += (match[2].length === 3 ? ') ' : '') + match[2];
  }
  if (match[3]) {
    formatted += (match[3].length > 0 ? '-' : '') + match[3];
  }
  return formatted;
}

// Placeholder for email sending
function sendEmail(phone: string, offerCode: string) {
  // Implement with EmailJS, Firebase Functions, etc.
  console.log('Send email to oscar.francis1225@gmail.com:', phone, offerCode);
}

export default function Step3OfferSheet({ calculationResult, formData, onBack }: { calculationResult: any, formData: any, onBack?: () => void }) {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(false);
  const [phoneDigits, setPhoneDigits] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const overlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Show overlay after 12 seconds
  useEffect(() => {
    overlayTimeoutRef.current = setTimeout(() => {
      setShowOverlay(true);
    }, 12000);
    return () => {
      if (overlayTimeoutRef.current) clearTimeout(overlayTimeoutRef.current);
    };
  }, []);

  // Offer code generator
  function generateOfferCode(phone: string) {
    const cleaned = phone.replace(/\D/g, '');
    let last4 = cleaned.slice(-4);
    if (last4.length < 4) {
      last4 = (Math.floor(1000 + Math.random() * 9000)).toString();
    }
    return `PAYOUT-${last4}`;
  }

  // Handle phone submit (forgiving validation)
  async function handlePhoneSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setInputError(null);
    const cleaned = phoneDigits.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setInputError('Please enter a valid US phone number');
      setLoading(false);
      return;
    }
    const fullPhone = `+1${cleaned}`;
    const offerCode = generateOfferCode(cleaned);
    // Prepare extra fields if available
    const extraData: Record<string, any> = {};
    if (formData?.amount) extraData.paymentAmount = formData.amount;
    if (formData?.startDate) extraData.startDate = formData.startDate;
    if (formData?.paymentType) extraData.lifeContingent = formData.paymentType === 'Life Contingent';
    if (typeof max === 'number') extraData.maxOffer = max;
    if (typeof min === 'number') extraData.minOffer = min;
    if (formData?.endDate) extraData.endDate = formData.endDate;
    // Add lifeContingentAnswers if available
    if (formData?.lcpAnswers && typeof formData.lcpAnswers === 'object') {
      extraData.lifeContingentAnswers = formData.lcpAnswers;
    } else if (formData?.lifeContingentAnswers && typeof formData.lifeContingentAnswers === 'object') {
      extraData.lifeContingentAnswers = formData.lifeContingentAnswers;
    }
    // Save to Firestore
    try {
      await addDoc(collection(db, "offer_submissions"), {
        phone: cleaned,
        offerCode,
        timestamp: serverTimestamp(),
        ...extraData
      });
    } catch (err) {
      console.error('Firestore write failed:', err);
      // Do not block UI or crash
    }
    sendEmail(fullPhone, offerCode);
    setConfirmation(`${fullPhone}|${offerCode}`);
    setShowOverlay(false);
    setLoading(false);
  }

  // Offer calculation logic (unchanged)
  const { minOffer, maxOffer, familyProtectionNPV, npv } = calculationResult || {};
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
  const format = (val: number) => val?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
    <div className="step calculator text-center px-3 py-4" style={{ position: 'relative' }}>
      {/* Confirmation block removed as requested */}
      {/* {confirmation && (
        <div className={styles.confirmationCard}> ... </div>
      )} */}
      {showOverlay && !confirmation && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(34,180,85,0.18)',
          backdropFilter: 'blur(2.5px)',
          WebkitBackdropFilter: 'blur(2.5px)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'opacity 0.5s',
          opacity: showOverlay ? 1 : 0,
        }}>
          <form onSubmit={handlePhoneSubmit} style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            maxWidth: '320px',
            width: '100%',
            padding: '2rem 1.5rem',
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1.25rem',
          }}>
            <h2 style={{ marginBottom: '0.5rem', color: '#22b455' }}>To view and claim your offer, please enter your phone number.</h2>
            <input
              type="tel"
              inputMode="tel"
              placeholder="(555) 555-1234"
              value={phoneDigits}
              onChange={e => {
                // Remove all non-digit characters
                const raw = e.target.value.replace(/\D/g, '');
                // Limit to 10 digits
                const limited = raw.slice(0, 10);
                // Format as (XXX) XXX-XXXX
                let formatted = '';
                if (limited.length > 0) {
                  formatted = '(' + limited.slice(0, 3);
                }
                if (limited.length >= 4) {
                  formatted += ') ' + limited.slice(3, 6);
                } else if (limited.length > 3) {
                  formatted += ') ' + limited.slice(3);
                }
                if (limited.length >= 7) {
                  formatted += '-' + limited.slice(6, 10);
                }
                setPhoneDigits(formatted);
                setInputError(null);
              }}
              onPaste={e => {
                e.preventDefault();
                const pasted = e.clipboardData.getData('Text').replace(/\D/g, '').slice(0, 10);
                let formatted = '';
                if (pasted.length > 0) {
                  formatted = '(' + pasted.slice(0, 3);
                }
                if (pasted.length >= 4) {
                  formatted += ') ' + pasted.slice(3, 6);
                } else if (pasted.length > 3) {
                  formatted += ') ' + pasted.slice(3);
                }
                if (pasted.length >= 7) {
                  formatted += '-' + pasted.slice(6, 10);
                }
                setPhoneDigits(formatted);
                setInputError(null);
              }}
              disabled={loading}
              maxLength={20}
              style={{
                fontFamily: 'monospace',
                letterSpacing: '0.5px',
                width: '100%',
                textAlign: 'center',
                padding: '0.75rem',
                borderRadius: '6px',
                border: inputError ? '2px solid #dc3545' : '1.5px solid #ccc',
                fontSize: '1.1rem',
                marginBottom: '0.5rem',
              }}
              required
              readOnly={false}
            />
            {inputError && <div style={{ color: '#dc3545', fontWeight: 500, fontSize: '1rem', marginBottom: 4 }}>{inputError}</div>}
            <div style={{
              width: '100%',
              background: 'transparent',
              fontWeight: 400,
              fontSize: '1.07rem',
              color: '#222',
              margin: '0.2rem 0 0.2rem 0',
              padding: 0,
              lineHeight: 1.5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}>
              <div style={{ marginBottom: '0.25rem' }}>Your offer code is:</div>
              <div style={{ fontFamily: 'monospace', fontWeight: 500, fontSize: '1.13rem', marginBottom: '0.7rem' }}>{generateOfferCode(phoneDigits)}</div>
              <div className="d-flex flex-wrap justify-content-center align-items-center" style={{ marginBottom: '0.15rem', gap: 4, fontSize: '1.07rem', lineHeight: 1.5 }}>
                If you have any questions, call us at
                <a
                  href="tel:+19547649750"
                  style={{
                    color: '#222',
                    textDecoration: 'none',
                    fontWeight: 500,
                    marginLeft: 6,
                    whiteSpace: 'nowrap',
                    transition: 'color 0.18s, transform 0.18s',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.color = '#22b455';
                    e.currentTarget.style.transform = 'scale(1.045)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.color = '#222';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  (954) 764-9750
                </a>.
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || phoneDigits.length < 7}
              style={{
                width: '100%',
                margin: '1rem 0 0 0',
                padding: '0.75rem',
                fontSize: '1.1rem',
                borderRadius: '6px',
                fontWeight: 600,
                background: '#22b455',
                color: 'white',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 8px rgba(34,180,85,0.08)'
              }}
            >
              {loading ? 'Submitting...' : 'Unlock Offer'}
            </button>
          </form>
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
            <li className="offer-item d-flex flex-column align-items-center px-3 py-2 border-bottom" style={{ background: 'transparent', marginBottom: 10 }}>
              <span className="offer-label fw-medium" style={{ marginBottom: 2 }}>Family Benefit</span>
              <span className="offer-value text-muted fw-semibold" style={{ fontSize: '1.13rem' }}>${format(familyProtectionNPV)}</span>
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
    </div>
  );
}
