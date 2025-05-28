'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { calculateMinMaxNPV } from '../utils/npvCalculations';
import { AMOUNT_ADJUSTMENTS } from '../utils/npvConfig';
import { auth, db, RecaptchaVerifier } from '../utils/firebase';
import { signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier | null;
  }
}

interface Props {
  calculationResult: any;
  formData: any;
  onBack?: () => void;
}

// Phone number formatter
function formatPhoneNumber(value: string) {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
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

// OTP input component
const OTPInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  loading?: boolean;
}> = ({ value, onChange, disabled, loading }) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [otpArr, setOtpArr] = useState<string[]>(Array(6).fill(''));

  useEffect(() => {
    setOtpArr(value.padEnd(6, '').split(''));
  }, [value]);

  const handleChange = (idx: number, val: string) => {
    if (!/\d/.test(val) && val !== '') return;
    const arr = [...otpArr];
    arr[idx] = val;
    setOtpArr(arr);
    onChange(arr.join(''));
    if (val && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otpArr[idx]) {
        // Clear current
        const arr = [...otpArr];
        arr[idx] = '';
        setOtpArr(arr);
        onChange(arr.join(''));
      } else if (idx > 0) {
        // Move to previous
        inputsRef.current[idx - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      setOtpArr(pasted.padEnd(6, '').split(''));
      onChange(pasted);
      if (pasted.length < 6) {
        inputsRef.current[pasted.length]?.focus();
      } else {
        inputsRef.current[5]?.blur();
      }
    }
  };

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '1rem 0' }}>
      {Array.from({ length: 6 }).map((_, idx) => (
        <input
          key={idx}
          ref={el => { inputsRef.current[idx] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={otpArr[idx] || ''}
          onChange={e => handleChange(idx, e.target.value.replace(/\D/g, ''))}
          onKeyDown={e => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          disabled={disabled || loading}
          style={{
            width: 40,
            height: 48,
            textAlign: 'center',
            fontSize: '1.25rem',
            fontWeight: 600,
            border: '2px solid #dee2e6',
            borderRadius: 8,
            backgroundColor: disabled || loading ? '#f8f9fa' : 'white',
            transition: 'all 0.2s ease',
          }}
          autoFocus={idx === 0 && !value}
        />
      ))}
    </div>
  );
};

export default function Step3OfferSheet({ calculationResult, formData, onBack }: Props) {
  const router = useRouter();
  const [unlocked, setUnlocked] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [phoneDigits, setPhoneDigits] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const bannerTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const overlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Always render the offer results immediately

  // Show overlay after 12 seconds (if not unlocked)
  useEffect(() => {
    if (!unlocked) {
      overlayTimeoutRef.current = setTimeout(() => {
        setShowOverlay(true);
      }, 12000);
      return () => {
        if (overlayTimeoutRef.current) clearTimeout(overlayTimeoutRef.current);
      };
    }
  }, [unlocked]);

  // Clean up banner timeout on unmount
  useEffect(() => {
    return () => {
      if (bannerTimeoutRef.current) clearTimeout(bannerTimeoutRef.current);
      if (overlayTimeoutRef.current) clearTimeout(overlayTimeoutRef.current);
    };
  }, []);

  // On unlock, hide overlay and show banner
  useEffect(() => {
    if (unlocked) {
      setShowOverlay(false);
      setShowBanner(true);
      if (bannerTimeoutRef.current) clearTimeout(bannerTimeoutRef.current);
      bannerTimeoutRef.current = setTimeout(() => {
        setShowBanner(false);
      }, 2500);
    }
  }, [unlocked]);

  // Remove ?result=... from the URL after showing the result (for lump sum flow)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.history && window.location.search.includes('result=')) {
      const url = new URL(window.location.href);
      url.searchParams.delete('result');
      window.history.replaceState({}, document.title, url.pathname + url.search);
    }
  }, []);

  useEffect(() => {
    console.log('[Step3OfferSheet] showOverlay:', showOverlay, 'unlocked:', unlocked);
  }, [showOverlay, unlocked]);

  // Phone/OTP logic
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('1') && value.length === 11) {
      value = value.slice(1);
    }
    value = value.slice(0, 10);
    setPhoneDigits(value);
  };

  const handleSendCode = async () => {
    setLoading(true);
    setFirebaseError(null);
    let fullPhone = phoneDigits;
    if (phoneDigits.length === 10) {
      fullPhone = `+1${phoneDigits}`;
    } else if (phoneDigits.length === 11 && phoneDigits.startsWith('1')) {
      fullPhone = `+${phoneDigits}`;
    } else {
      setFirebaseError('📱 Please enter a valid 10-digit phone number');
      setLoading(false);
      return;
    }
    let appVerifier: RecaptchaVerifier | undefined = undefined;
    if (!(window.location.hostname === 'localhost' && (auth as any).settings?.appVerificationDisabledForTesting)) {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
        await window.recaptchaVerifier.render();
      }
      appVerifier = window.recaptchaVerifier as RecaptchaVerifier;
    }
    if (!appVerifier) {
      setFirebaseError('Verification system not ready. Please try again.');
      setLoading(false);
      return;
    }
    try {
      const result = await signInWithPhoneNumber(auth, fullPhone, appVerifier);
      setConfirmationResult(result);
      setStep('otp');
    } catch (err: any) {
      setFirebaseError('Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    setFirebaseError(null);
    if (otp.length !== 6) {
      setFirebaseError('⚠️ Enter the 6-digit code sent to your phone');
      setLoading(false);
      return;
    }
    try {
      if (!confirmationResult) throw new Error('No confirmation result available');
      await confirmationResult.confirm(otp);
      await addDoc(collection(db, 'verifiedPhones'), {
        phone: `+1${phoneDigits}`,
        timestamp: serverTimestamp()
      });
      setUnlocked(true);
    } catch (error: any) {
      setFirebaseError('Invalid verification code. Try again.');
    } finally {
      setLoading(false);
    }
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
    <div className="step calculator text-center px-3 py-4" style={{ position: 'relative' }}>
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
          zIndex: 1200,
          position: 'relative',
        }}>
          <span role="img" aria-label="party">🎉</span> Offer Unlocked!
        </div>
      )}
      {/* Overlay for unlock */}
      {showOverlay && (
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
          <div style={{
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
            <div id="recaptcha-container"></div>
            {step === 'phone' && (
              <>
                <h2 style={{ marginBottom: '0.5rem', color: '#22b455' }}>Unlock Your Offer</h2>
                <p style={{ marginBottom: '1rem', color: '#555' }}>Enter your phone number to unlock your personalized offer.</p>
                <input
                  type="tel"
                  placeholder="(561) 568-3128"
                  value={formatPhoneNumber(phoneDigits)}
                  onChange={e => {
                    let val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setPhoneDigits(val);
                  }}
                  disabled={loading}
                  maxLength={14}
                  pattern="[0-9-]*"
                  inputMode="numeric"
                  style={{
                    fontFamily: 'monospace',
                    letterSpacing: '0.5px',
                    width: '100%',
                    textAlign: 'center',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: '1.5px solid #ccc',
                    fontSize: '1.1rem',
                    marginBottom: '0.5rem',
                  }}
                  onKeyPress={e => {
                    if (!/[\d]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={e => {
                    e.preventDefault();
                    const pastedText = e.clipboardData.getData('text');
                    const cleaned = pastedText.replace(/\D/g, '').slice(0, 10);
                    setPhoneDigits(cleaned);
                  }}
                />
                {firebaseError && <div style={{ color: '#dc3545', fontSize: '0.95rem', marginBottom: '0.75rem' }}>{firebaseError}</div>}
                <button
                  onClick={handleSendCode}
                  disabled={loading}
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
                  {loading ? 'Sending...' : 'Send Code'}
                </button>
              </>
            )}
            {step === 'otp' && (
              <>
                <h2 style={{ color: '#22b455' }}>Enter Verification Code</h2>
                <p style={{ color: '#555' }}>We sent a 6-digit code to your phone.</p>
                <OTPInput value={otp} onChange={setOtp} disabled={loading} loading={loading} />
                {firebaseError && <div style={{ color: '#dc3545', fontSize: '0.95rem', marginBottom: '0.75rem' }}>{firebaseError}</div>}
                <button
                  onClick={handleVerifyCode}
                  disabled={loading || otp.length !== 6}
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
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </>
            )}
          </div>
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
    </div>
  );
}
