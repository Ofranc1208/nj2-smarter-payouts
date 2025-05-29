"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import '../../styles/Index.css';

const processRoutes = [
  '/get-a-quote',
  '/review-offer',
  '/court-approval',
  '/get-your-cash',
];

export default function Navbar() {
  const pathname = usePathname();
  const [navbarCollapsed, setNavbarCollapsed] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isInProcessSection = processRoutes.includes(pathname);

  React.useEffect(() => {
    setDropdownOpen(false);
    setNavbarCollapsed(true);
  }, [pathname]);

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm" style={{ borderBottom: '1.5px solid #e0e0e0', minHeight: 68 }}>
      <div className="container align-items-center justify-content-between px-3" style={{ paddingTop: 6, paddingBottom: 6 }}>
        <Link href="/main" className="navbar-brand d-flex align-items-center me-4" style={{ height: 44 }}>
          <Image
            src="/assets/images/favicon_without_text.ico"
            alt="SmarterPayouts Logo"
            width={30}
            height={30}
            style={{ height: '30px', width: 'auto', display: 'block' }}
          />
          <span className="fw-bold" style={{ fontSize: '1.22rem', letterSpacing: '-0.5px', marginLeft: 4 }}>Smarter Payouts</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={!navbarCollapsed}
          onClick={() => setNavbarCollapsed((prev) => !prev)}
          style={{ border: 'none', boxShadow: 'none', outline: 'none', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 44 }}
        >
          <span className="navbar-toggler-icon" style={{ fontSize: 26 }}></span>
        </button>
        <div className={`collapse navbar-collapse${!navbarCollapsed ? ' show' : ''}`} id="navbarMain">
          <ul className="navbar-nav ms-auto align-items-center" style={{ gap: 0 }}>
            {[
              { href: '/main', label: 'Home' },
              { href: '/pricing-calculator', label: 'Early Payout Calculator' },
            ].map((item) => (
              <li className="nav-item me-2" key={item.href}>
                <Link className={`nav-link${pathname === item.href ? ' active' : ''}`} href={item.href} 
                  style={{ fontSize: '1.09rem', padding: '0.7rem 1.1rem', display: 'flex', alignItems: 'center', fontWeight: pathname === item.href ? 600 : 500, borderRadius: 6, transition: 'background 0.15s, color 0.15s', ...(pathname === item.href ? { color: '#09b44d', background: '#e9f9f1' } : {}) }}
                  onClick={() => setNavbarCollapsed(true)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="nav-item dropdown me-2" style={{ position: 'relative' }}>
              <span
                className={`nav-link dropdown-toggle${isInProcessSection ? ' active text-success fw-bold' : ''}`}
                id="processDropdown"
                role="button"
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen((open) => !open)}
                style={{ cursor: 'pointer', fontSize: '1.09rem', padding: '0.7rem 1.1rem', display: 'flex', alignItems: 'center', fontWeight: isInProcessSection ? 600 : 500, borderRadius: 6, transition: 'background 0.15s, color 0.15s', ...(isInProcessSection ? { color: '#09b44d', background: '#e9f9f1' } : {}) }}
              >
                Our Process
              </span>
              <ul className={`dropdown-menu${dropdownOpen ? ' show' : ''}`} aria-labelledby="processDropdown" style={{ border: '1.5px solid #09b44d', borderRadius: 12, boxShadow: '0 4px 18px rgba(9,180,77,0.07)', minWidth: 230, marginTop: 6, padding: '0.5rem 0' }}>
                <li><Link className="dropdown-item d-flex align-items-center px-3 py-2" href="/get-a-quote" style={{ fontSize: '1.07rem', gap: 10, borderRadius: 6, fontWeight: 500 }} onClick={() => setNavbarCollapsed(true)}><span style={{fontSize: '1.15em'}}>💡</span>Get A Quote</Link></li>
                <li><Link className="dropdown-item d-flex align-items-center px-3 py-2" href="/review-offer" style={{ fontSize: '1.07rem', gap: 10, borderRadius: 6, fontWeight: 500 }} onClick={() => setNavbarCollapsed(true)}><span style={{fontSize: '1.15em'}}>📝</span>Review Offer</Link></li>
                <li><Link className="dropdown-item d-flex align-items-center px-3 py-2" href="/court-approval" style={{ fontSize: '1.07rem', gap: 10, borderRadius: 6, fontWeight: 500 }} onClick={() => setNavbarCollapsed(true)}><span style={{fontSize: '1.15em'}}>⚖️</span>Court Approval</Link></li>
                <li><Link className="dropdown-item d-flex align-items-center px-3 py-2" href="/get-your-cash" style={{ fontSize: '1.07rem', gap: 10, borderRadius: 6, fontWeight: 500 }} onClick={() => setNavbarCollapsed(true)}><span style={{fontSize: '1.15em'}}>💵</span>Get Your Cash</Link></li>
              </ul>
            </li>
            {[
              { href: '/articles', label: 'Articles' },
              { href: '/testimonials', label: '⭐ Testimonials' },
              { href: '/credentials', label: '🛡️ Credentials' },
              { href: '/resources', label: '📚 Resources' },
              { href: '/youtube-channel', label: '▶️ YouTube Channel' },
              { href: '/about', label: 'About Us' },
              { href: '/faqs', label: 'FAQs' },
              { href: '/contact', label: 'Contact Us' },
              { href: '/privacy', label: 'Privacy' },
              { href: '/terms', label: 'Terms' },
            ].map((item) => (
              <li className="nav-item me-2" key={item.href}>
                <Link className={`nav-link${pathname === item.href ? ' active' : ''}`} href={item.href} 
                  style={{ fontSize: '1.09rem', padding: '0.7rem 1.1rem', display: 'flex', alignItems: 'center', fontWeight: pathname === item.href ? 600 : 500, borderRadius: 6, transition: 'background 0.15s, color 0.15s', ...(pathname === item.href ? { color: '#09b44d', background: '#e9f9f1' } : {}) }}
                  onClick={() => setNavbarCollapsed(true)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
