'use client';
import React, { useState } from 'react';
import Head from 'next/head';

interface Company {
  name: string;
  formerNames?: string[];
  phone: string;
  fax: string;
  email: string;
  website: string;
  address: string;
  officeHours: string;
  verifyPays?: boolean | string;
  acblsadapos?: string[];
  notes?: string;
}

const acronymDescriptions: Record<string, string> = {
  AC: 'Assignment Confirmation',
  BL: 'Benefits Letter',
  SA: 'Settlement Agreement',
  DA: 'Disclosure Agreement',
  POS: 'Proof of Service',
};

const companies: Company[] = [
  {
    name: 'AIG (American General / Life Insurance Branch)',
    formerNames: ['AIG American General Life', 'American General Life Insurance Company of New York (NY Branch)'],
    phone: '800-888-2452',
    fax: '713-831-3028',
    email: 'customersupport@aig.com',
    website: 'https://www.aig.com',
    address: 'P.O. Box 305355, Nashville, TN 37230',
    officeHours: '',
    verifyPays: false,
    acblsadapos: ['BL'],
    notes: '',
  },
  {
    name: 'Allstate Life Insurance Company',
    phone: '800-366-1411',
    fax: '',
    email: 'AFRUnit@allstate.com',
    website: 'https://www.allstate.com',
    address: '3100 Sanders Road, Northbrook, IL 60062',
    officeHours: '',
    verifyPays: false,
    acblsadapos: ['AC', 'BL'],
    notes: '',
  },
  {
    name: 'Berkshire Hathaway Life Insurance Company of NE',
    phone: '800-624-5554',
    fax: '',
    email: '',
    website: 'https://www.berkshirehathaway.com/insurance/insurance.html',
    address: '1314 Douglas Street, Suite 1400, Omaha, NE 68102',
    officeHours: '',
    verifyPays: true,
    acblsadapos: ['AC', 'SA', 'QA'],
    notes: '',
  },
  {
    name: 'MassMutual Life Insurance Company',
    phone: '800-272-2216',
    fax: '',
    email: 'service@massmutual.com',
    website: 'https://www.massmutual.com',
    address: '1295 State Street, Springfield, MA 01111',
    officeHours: '',
    verifyPays: '',
    acblsadapos: [],
    notes: '',
  },
  {
    name: 'MetLife',
    formerNames: ['Metropolitan Life Insurance Company'],
    phone: '800-638-5433',
    fax: '',
    email: '',
    website: 'https://www.metlife.com',
    address: 'P.O. Box 14587, Lexington, KY 40512',
    officeHours: '',
    verifyPays: '',
    acblsadapos: ['BL'],
    notes: '',
  },
  {
    name: 'New York Life Insurance Company',
    phone: '800-225-5695',
    fax: '212-576-3500',
    email: 'customerservice@newyorklife.com',
    website: 'https://www.newyorklife.com',
    address: '51 Madison Avenue, New York, NY 10010',
    officeHours: '',
    verifyPays: false,
    acblsadapos: ['BL'],
    notes: '',
  },
  {
    name: 'Pacific Life Insurance Company',
    phone: '800-800-7646',
    fax: '949-420-6821',
    email: 'service@pacificlife.com',
    website: 'https://www.pacificlife.com',
    address: 'P.O. Box 9000, Newport Beach, CA 92658',
    officeHours: '',
    verifyPays: true,
    acblsadapos: ['BL'],
    notes: '',
  },
  {
    name: 'Prudential Insurance Company of America',
    phone: '800-778-2255',
    fax: '877-889-6446',
    email: 'contactus@prudential.com',
    website: 'https://www.prudential.com',
    address: 'P.O. Box 7392, Philadelphia, PA 19176',
    officeHours: '',
    verifyPays: false,
    acblsadapos: ['AC', 'SA', 'QA'],
    notes: "STLegal@prudential.com",
  },
  {
    name: 'Symetra Life Insurance Company',
    phone: '800-796-3872',
    fax: '866-817-2207',
    email: 'service@symetra.com',
    website: 'https://www.symetra.com',
    address: 'P.O. Box 34690, Seattle, WA 98124',
    officeHours: '',
    verifyPays: true,
    acblsadapos: [],
    notes: '',
  },
  {
    name: 'Transamerica Life Insurance Company',
    phone: '800-797-2643',
    fax: '800-553-6074',
    email: 'customercare@transamerica.com',
    website: 'https://www.transamerica.com',
    address: '6400 C Street SW, Cedar Rapids, IA 52499',
    officeHours: '',
    verifyPays: true,
    acblsadapos: ['BL', 'AC', 'QA', 'SA'],
    notes: 'When requesting ask for "Verification of Benefits"',
  },
  {
    name: 'American United Life Insurance Company',
    phone: '800-382-4000',
    fax: '',
    email: '',
    website: 'https://www.oneamerica.com',
    address: 'One American Square, Indianapolis, IN 46206',
    officeHours: '',
    verifyPays: false,
    acblsadapos: [],
    notes: '',
  },
  {
    name: 'Athene Annuity & Life Assurance Company',
    phone: '888-266-8489',
    fax: '',
    email: '',
    website: 'https://www.athene.com',
    address: 'P.O. Box 725449, Atlanta, GA 31139',
    officeHours: '',
    verifyPays: false,
    acblsadapos: [],
    notes: '',
  },
  {
    name: 'Brighthouse Life Insurance Company',
    formerNames: ['MetLife Assurance Company of Connecticut'],
    phone: '800-638-5433',
    fax: '',
    email: '',
    website: 'https://www.brighthousefinancial.com',
    address: '11225 North Community House Road, Charlotte, NC 28277',
    officeHours: '',
    verifyPays: false,
    acblsadapos: [],
    notes: '',
  },
  {
    name: 'Companion Life Insurance Company',
    phone: '800-753-0404',
    fax: '',
    email: '',
    website: 'https://www.companionlife.com',
    address: '7909 Parklane Road, Suite 200, Columbia, SC 29223',
    officeHours: '',
    verifyPays: false,
    acblsadapos: [],
    notes: '',
  },
  {
    name: 'First Berkshire Hathaway Life Insurance Company',
    phone: '800-624-5554',
    fax: '',
    email: '',
    website: 'https://www.berkshirehathaway.com/insurance/insurance.html',
    address: '1314 Douglas Street, Suite 1400, Omaha, NE 68102',
    officeHours: '',
    verifyPays: false,
    acblsadapos: [],
    notes: '',
  },
  {
    name: 'Genworth Life Insurance Company',
    formerNames: ['GE Capital Assurance', 'General Electric Capital Assurance', 'GE Life & Annuity'],
    phone: '888-436-9678',
    fax: '804-281-6200',
    email: '',
    website: 'https://www.genworth.com',
    address: '6620 West Broad Street, Richmond, VA 23230',
    officeHours: '',
    verifyPays: true,
    acblsadapos: [],
    notes: '',
  },
  {
    name: 'Great American Life Insurance Company',
    phone: '800-854-3649',
    fax: '',
    email: '',
    website: 'https://www.greatamericaninsurancegroup.com',
    address: '301 E. Fourth Street, Cincinnati, OH 45202',
    officeHours: '',
    verifyPays: false,
    acblsadapos: [],
    notes: '',
  },
  {
    name: 'John Hancock Life Insurance Company',
    phone: '800-624-5155',
    fax: '617-572-1571',
    email: '',
    website: 'https://www.johnhancock.com',
    address: 'P.O. Box 55979, Boston, MA 02205',
    officeHours: '',
    verifyPays: false,
    acblsadapos: [],
    notes: '',
  },
  {
    name: 'Liberty Life Assurance Company of Boston',
    phone: '800-451-7065',
    fax: '',
    email: '',
    website: 'https://www.libertymutual.com',
    address: '100 Liberty Way, Dover, NH 03820',
    officeHours: '',
    verifyPays: false,
    acblsadapos: [],
    notes: '',
  },
  {
    name: 'Minnesota Life Insurance Company',
    phone: '800-362-3141',
    fax: '',
    email: '',
    website: 'https://www.securian.com',
    address: '400 Robert Street North, St. Paul, MN 55101',
    officeHours: '',
    verifyPays: false,
    acblsadapos: [],
    notes: '',
  },
  {
    name: 'Mutual of Omaha Insurance Company',
    phone: '800-775-6000',
    fax: '',
    email: 'clientservices@mutualofomaha.com',
    website: 'https://www.mutualofomaha.com',
    address: 'Mutual of Omaha Plaza, Omaha, NE 68175',
    officeHours: '',
    verifyPays: false,
    acblsadapos: [],
    notes: '',
  },
  {
    name: 'Nationwide Life Insurance Company',
    phone: '800-848-6331',
    fax: '',
    email: 'customerservice@nationwide.com',
    website: 'https://www.nationwide.com',
    address: 'One Nationwide Plaza, Columbus, OH 43215',
    officeHours: '',
    verifyPays: false,
    acblsadapos: [],
    notes: '',
  },
  {
    name: 'Independent Life Insurance Company',
    formerNames: [],
    phone: '800-793-7474',
    fax: '',
    email: 'info@independent.life',
    website: 'https://www.independent.life',
    address: '8950 SW 74th Ct, Suite 2201, Miami, FL 33156',
    officeHours: '',
    verifyPays: true,
    acblsadapos: [],
    notes: '',
  },
  {
    name: 'USAA Life Insurance Company',
    formerNames: [],
    phone: '800-531-8722',
    fax: '',
    email: '',
    website: 'https://www.usaa.com',
    address: '9800 Fredericksburg Road, San Antonio, TX 78288',
    officeHours: '',
    verifyPays: false,
    acblsadapos: [],
    notes: '',
  },
  {
    name: 'Hartford Life Insurance Company',
    formerNames: ['Genworth Life Insurance Company', 'Hartford Life and Annuity Insurance Company'],
    phone: '800-862-6668',
    fax: '',
    email: '',
    website: 'https://www.genworth.com',
    address: '6620 West Broad Street, Richmond, VA 23230',
    officeHours: '',
    verifyPays: false,
    acblsadapos: [],
    notes: 'Hartford Life business was acquired by Genworth in 2004. Some legacy policies may still be serviced under the Hartford name.'
  },
  {
    name: 'United States Life Insurance Company in the City of New York',
    formerNames: ['AIG', 'American General Life Insurance Company of New York'],
    phone: '800-221-9039',
    fax: '',
    email: '',
    website: 'https://www.corebridgefinancial.com',
    address: 'One World Financial Center, 200 Liberty Street, New York, NY 10281',
    officeHours: '',
    verifyPays: false,
    acblsadapos: [],
    notes: '',
  },
  {
    name: 'Pacific Life & Annuity Company (NY)',
    formerNames: ['Pacific Life Insurance Company'],
    phone: '800-800-7646',
    fax: '',
    email: '',
    website: 'https://ssa.pacificlife.com',
    address: '700 Newport Center Drive, Newport Beach, CA 92660',
    officeHours: '',
    verifyPays: false,
    acblsadapos: [],
    notes: 'Handles NY-specific structured settlements.'
  },
];

function icon(label: string) {
  switch (label) {
    case 'phone': return '📞';
    case 'fax': return '📠';
    case 'email': return '📧';
    case 'website': return '🌐';
    case 'officeHours': return '🕒';
    case 'address': return '🏢';
    case 'formerNames': return '🔄';
    case 'verifyPays': return '✔️';
    case 'acblsadapos': return 'ℹ️';
    case 'notes': return '📝';
    default: return '';
  }
}

export default function ResourcesPage() {
  const [search, setSearch] = useState('');
  const [showLegend, setShowLegend] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  React.useEffect(() => {
    const handleResize = () => {
      setShowLegend(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filtered = companies.filter((c) => {
    const searchLower = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(searchLower) ||
      (c.formerNames && c.formerNames.some((fn) => fn.toLowerCase().includes(searchLower))) ||
      (c.acblsadapos && c.acblsadapos.some((a) => a.toLowerCase().includes(searchLower))) ||
      (c.notes && c.notes.toLowerCase().includes(searchLower))
    );
  });

  return (
    <>
      <Head>
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Helpful Links – Structured Settlement Resources | SmarterPayouts" />
        <meta name="twitter:description" content="Find useful links and resources for structured settlement recipients and sellers, curated by SmarterPayouts." />
        <meta name="twitter:site" content="@SmarterPayouts" />
        <meta name="twitter:image" content="https://smarterpayouts.com/assets/images/social-preview.jpg" />

        {/* Open Graph */}
        <meta property="og:image" content="https://smarterpayouts.com/assets/images/social-preview.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

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
                  "name": "Resources",
                  "item": "https://smarterpayouts.com/resources"
                }
              ]
            })
          }}
        />
      </Head>
      <section className="py-5" style={{ background: '#f8fafc', minHeight: '100vh' }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <section className="how-fast-hero p-4 rounded mb-4 d-flex flex-column align-items-center justify-content-center shadow-sm" style={{
            background: 'linear-gradient(90deg, #e9f9f1 60%, #fbc23322 100%)',
            boxShadow: '0 4px 24px rgba(9,180,77,0.08)',
            minHeight: '160px',
            marginBottom: 32
          }}>
            <h1 className="fw-bold mb-2 text-success text-center" style={{ fontSize: '2.1rem', letterSpacing: '-1px' }}>
              Insurance Directory
            </h1>
            <div className="text-muted mb-0 text-center" style={{ fontSize: '1.05rem', maxWidth: 600, margin: '0 auto' }}>
              Use this directory to look up contact info for companies that provide structured settlement annuities.
            </div>
          </section>
          <div className="mb-3">
            <button
              className="btn btn-sm btn-outline-secondary mb-2"
              type="button"
              aria-expanded={showLegend}
              aria-controls="acronym-legend"
              onClick={() => setShowLegend((v) => !v)}
              style={{ fontSize: '1rem' }}
            >
              {showLegend ? 'Hide Acronym Legend' : 'Show Acronym Legend'}
            </button>
            {showLegend && (
              <div id="acronym-legend" className="p-3 bg-white rounded shadow-sm" style={{ fontSize: '0.98rem', maxWidth: 700 }}>
                <span className="fw-semibold me-2">Acronym Legend:</span>
                {Object.entries(acronymDescriptions).map(([ac, desc]) => (
                  <span key={ac} className="me-3"><span className="badge bg-light border text-dark me-1">{ac}</span>{desc}</span>
                ))}
                <span className="ms-3"><span className="badge bg-light border text-dark me-1">✔️</span>Will verify payments by phone</span>
              </div>
            )}
          </div>
          <input
            type="text"
            className="form-control mb-4"
            placeholder="Search insurance company, acronym, or note..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', maxWidth: 480, margin: '0 auto', fontSize: '0.93rem', padding: '0.45rem 0.7rem', boxSizing: 'border-box', textOverflow: 'ellipsis' }}
            aria-label="Search insurance company"
          />
          <div className="list-group mb-4">
            {filtered.length === 0 && (
              <div className="text-center text-muted py-5">No companies found.</div>
            )}
            {filtered.map((c, i) => (
              <div key={c.name + i} className="mb-2">
                <button
                  className={`list-group-item list-group-item-action fw-bold text-success d-flex justify-content-between align-items-center${openIndex === i ? ' active' : ''}`}
                  style={{ fontSize: '1.08rem', borderRadius: 8, background: openIndex === i ? '#e9f9f1' : '#fff', border: '1px solid #e0e0e0', padding: '1rem 1.2rem', marginBottom: 2, width: '100%' }}
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                  aria-controls={`company-details-${i}`}
                >
                  {c.name}
                  <span style={{ fontSize: '1.2rem', marginLeft: 8 }}>{openIndex === i ? '▲' : '▼'}</span>
                </button>
                {openIndex === i && (
                  <div id={`company-details-${i}`} className="card shadow-sm" style={{ borderRadius: 14, padding: '1.5rem', marginTop: 2, background: '#fff' }}>
                    <div style={{ fontSize: '1.01rem' }}>
                      {c.formerNames && c.formerNames.length > 0 && (
                        <div className="mb-2"><span style={{ fontSize: '1rem', marginRight: 6 }}>{icon('formerNames')}</span> <span className="fw-semibold">Formerly:</span> {c.formerNames.join(', ')}</div>
                      )}
                      <div className="mb-2">
                        {c.phone && <div className="mb-1"><span style={{ fontSize: '1rem', marginRight: 6 }}>{icon('phone')}</span> <span className="fw-semibold">Phone:</span> <a href={`tel:${c.phone.replace(/[^\d]/g, '')}`} className="text-decoration-none">{c.phone}</a></div>}
                        {c.fax && <div className="mb-1"><span style={{ fontSize: '1rem', marginRight: 6 }}>{icon('fax')}</span> <span className="fw-semibold">Fax:</span> {c.fax}</div>}
                        {c.email && <div className="mb-1"><span style={{ fontSize: '1rem', marginRight: 6 }}>{icon('email')}</span> <span className="fw-semibold">Email:</span> <a href={`mailto:${c.email}`} className="text-decoration-none">{c.email}</a></div>}
                        {c.website && <div className="mb-1"><span style={{ fontSize: '1rem', marginRight: 6 }}>{icon('website')}</span> <span className="fw-semibold">Website:</span> <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none">{c.website.replace('https://','').replace('www.','')}</a></div>}
                      </div>
                      <div style={{ borderBottom: '1px solid #f0f0f0', margin: '12px 0' }}></div>
                      {c.address && <div className="mb-2"><span style={{ fontSize: '1rem', marginRight: 6 }}>{icon('address')}</span> <span className="fw-semibold">Address:</span> {c.address}</div>}
                      {c.officeHours && <div className="mb-2"><span style={{ fontSize: '1rem', marginRight: 6 }}>{icon('officeHours')}</span> <span className="fw-semibold">Office Hours:</span> {c.officeHours}</div>}
                      <div style={{ borderBottom: '1px solid #f0f0f0', margin: '12px 0' }}></div>
                      {c.acblsadapos && c.acblsadapos.length > 0 && (
                        <div className="mb-2"><span style={{ fontSize: '1rem', marginRight: 6 }}>{icon('acblsadapos')}</span> <span className="fw-semibold">Structured Settlement Docs:</span> {c.acblsadapos.map(ac => <span key={ac} className="badge bg-light border text-dark me-1" title={acronymDescriptions[ac] || ac}>{ac}</span>)}
                        </div>
                      )}
                      {typeof c.verifyPays !== 'undefined' && c.verifyPays !== '' && (
                        <div className="mb-2"><span style={{ fontSize: '1rem', marginRight: 6 }}>{icon('verifyPays')}</span> <span className="fw-semibold">Verify Pays by Phone:</span> {c.verifyPays === true ? <span className="text-success fw-semibold">Yes</span> : <span className="text-danger fw-semibold">No</span>}</div>
                      )}
                      {c.notes && <div className="mb-2"><span style={{ fontSize: '1rem', marginRight: 6 }}>{icon('notes')}</span> <span className="fw-semibold">Notes:</span> {c.notes}</div>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
} 