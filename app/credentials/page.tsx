import React from 'react';
import Image from 'next/image';
import styles from './Credentials.module.css';

export default function CredentialsPage() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="p-0 mb-4" style={{ background: "linear-gradient(90deg, #e9f9f1 60%, #fbc23322 100%)", boxShadow: "0 4px 24px rgba(9,180,77,0.08)" }}>
        <div className="container py-5 d-flex flex-column align-items-center justify-content-center">
          <div className="mb-3">
            <span className="badge bg-success bg-opacity-10 text-success fw-semibold px-3 py-2" style={{ fontSize: '1rem', letterSpacing: '0.5px' }}>
              Verified & Trusted
            </span>
          </div>
          <h1 className="fw-bold mb-2 text-success" style={{ fontSize: "2.5rem", letterSpacing: "-1px" }}>
            Our Credentials
          </h1>
          <div className="text-muted mb-2" style={{ fontSize: "1.15rem", maxWidth: 600, margin: '0 auto' }}>
            SmarterPayouts is a transparent, trustworthy structured settlement company dedicated to providing clear, honest service to our clients nationwide.
          </div>
        </div>
      </section>
      {/* Elegant Divider */}
      <div className="w-100 d-flex justify-content-center mb-4">
        <div style={{ width: 80, height: 4, borderRadius: 2, background: 'linear-gradient(90deg, #fbc233 0%, #09b44d 100%)', opacity: 0.18 }}></div>
      </div>
      <section className="py-5" style={{ background: '#f8fafc' }}>
        <div className="container">
          {/* Credential Images Grid */}
          <div className="row g-4 justify-content-center">
            <div className="col-12 col-md-6 col-lg-6">
              <div className={styles.credentialCard}>
                <div className={styles.accentBar} style={{ background: '#fbc233' }}></div>
                <Image src="/assets/images/BBB.png" alt="Better Business Bureau logo for SmarterPayouts" width={120} height={120} className={styles.credentialImage} />
                <h5 className={styles.credentialTitle} style={{ color: '#fbc233' }}>Better Business Bureau</h5>
                <p className={styles.credentialDesc}>
                  SmarterPayouts is listed with the BBB under their free verification program. While we do not pay for accreditation, our registration allows customers to verify our identity and view public feedback.
                </p>
                <a href="https://www.bbb.org/" target="_blank" rel="noopener noreferrer" className="btn btn-outline-success mt-3 w-100" tabIndex={0} aria-label="Verify SmarterPayouts on BBB">Verify on BBB</a>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-6">
              <div className={styles.credentialCard}>
                <div className={styles.accentBar} style={{ background: '#09b44d' }}></div>
                <Image src="/assets/images/2017 florida vased corporation.png" alt="Florida Corporation Registration for SmarterPayouts" width={120} height={120} className={styles.credentialImage} />
                <h5 className={styles.credentialTitle} style={{ color: '#09b44d' }}>Florida Corporation Registration</h5>
                <p className={styles.credentialDesc}>
                  SmarterPayouts is a fully registered legal entity in the State of Florida. This official record verifies our legal standing and corporate identity.
                </p>
                <a href="https://search.sunbiz.org/Inquiry/CorporationSearch/ByName" target="_blank" rel="noopener noreferrer" className="btn btn-outline-success mt-3 w-100" tabIndex={0} aria-label="Verify SmarterPayouts on Sunbiz">Verify on Sunbiz</a>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-6">
              <div className={styles.credentialCard}>
                <div className={styles.accentBar} style={{ background: '#fbc233' }}></div>
                <Image src="/assets/images/Sunbiz.jpg" alt="Sunbiz Registration for SmarterPayouts" width={120} height={120} className={styles.credentialImage} />
                <h5 className={styles.credentialTitle} style={{ color: '#fbc233' }}>Sunbiz Registration</h5>
                <p className={styles.credentialDesc}>
                  Sunbiz is the official corporate registry for Florida. SmarterPayouts can be found on Sunbiz, validating our formation, structure, and legal representatives.
                </p>
                <a href="https://search.sunbiz.org/Inquiry/CorporationSearch/ByName" target="_blank" rel="noopener noreferrer" className="btn btn-outline-success mt-3 w-100" tabIndex={0} aria-label="View SmarterPayouts on Sunbiz">View on Sunbiz</a>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-6">
              <div className={styles.credentialCard}>
                <div className={styles.accentBar} style={{ background: '#09b44d' }}></div>
                <Image src="/assets/images/ssl.png" alt="SSL Certificate of Incorporation for SmarterPayouts" width={120} height={120} className={styles.credentialImage} />
                <h5 className={styles.credentialTitle} style={{ color: '#09b44d' }}>SSL Certificate of Incorporation</h5>
                <p className={styles.credentialDesc}>
                  Our website and backend operations are secured with full SSL certification. This ensures secure, encrypted communication for all user activity.
                </p>
                <a href="https://www.ssllabs.com/ssltest/analyze.html?d=smarterpayouts.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline-success mt-3 w-100" tabIndex={0} aria-label="Check SSL for SmarterPayouts">Check SSL</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 