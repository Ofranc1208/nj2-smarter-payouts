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
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm" style={{ borderBottom: '1.5px solid #e0e0e0', minHeight: 68 }}>
      <div className="container d-flex align-items-center justify-content-between md:gap-x-8" style={{ paddingTop: 6, paddingBottom: 6 }}>
        <Link href="/main" className="navbar-brand d-flex align-items-center gap-2 md:gap-x-3" style={{ height: 44 }}>
          <Image
            src="/assets/images/favicon_without_text.ico"
            alt="SmarterPayouts Logo"
            width={30}
            height={30}
            style={{ height: '30px', width: 'auto', display: 'block' }}
          />
          <span className="fw-bold md:text-base md:font-semibold md:tracking-tight" style={{ fontSize: '1.22rem', letterSpacing: '-0.5px', marginLeft: 4 }}>Smarter Payouts</span>
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
          <ul className="navbar-nav ms-auto md:flex md:items-center md:gap-x-8 md:space-x-0" style={{ gap: 2 }}>
            {[
              { href: '/main', label: 'Home' },
              { href: '/pricing-calculator', label: 'Early Payout Calculator' },
            ].map((item) => (
              <li className="nav-item" key={item.href}>
                <Link className={`nav-link${pathname === item.href ? ' active' : ''} md:inline-flex md:items-center md:text-sm md:font-medium`} href={item.href} style={{ fontSize: '1.09rem', padding: '0.7rem 1.1rem', display: 'flex', alignItems: 'center', fontWeight: pathname === item.href ? 600 : 500, borderRadius: 6, transition: 'background 0.15s, color 0.15s', ...(pathname === item.href ? { color: '#09b44d', background: '#e9f9f1' } : {}) }}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="nav-item dropdown md:inline-flex md:items-center" style={{ position: 'relative' }}>
              <span
                className={`nav-link dropdown-toggle${isInProcessSection ? ' active text-success fw-bold' : ''} md:inline-flex md:items-center md:text-sm md:font-medium`}
                id="processDropdown"
                role="button"
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen((open) => !open)}
                style={{ cursor: 'pointer', fontSize: '1.09rem', padding: '0.7rem 1.1rem', display: 'flex', alignItems: 'center', fontWeight: isInProcessSection ? 600 : 500, borderRadius: 6, transition: 'background 0.15s, color 0.15s', ...(isInProcessSection ? { color: '#09b44d', background: '#e9f9f1' } : {}) }}
              >
                Our Process
              </span>
              <ul className={`dropdown-menu${dropdownOpen ? ' show' : ''} md:mt-3 md:shadow-lg md:bg-white md:py-2 md:px-0 md:rounded-xl md:min-w-[230px] md:border md:border-green-500`}
                aria-labelledby="processDropdown"
                style={{ border: '1.5px solid #09b44d', borderRadius: 12, boxShadow: '0 4px 18px rgba(9,180,77,0.07)', minWidth: 230, marginTop: 6, padding: '0.5rem 0' }}>
                <li><Link className="dropdown-item md:inline-flex md:items-center md:gap-x-2 md:text-sm md:font-medium md:px-5 md:py-2" href="/get-a-quote" style={{ fontSize: '1.07rem', padding: '0.7rem 1.2rem', display: 'flex', alignItems: 'center', gap: 10, borderRadius: 6, transition: 'background 0.15s', fontWeight: 500 }}><span style={{fontSize: '1.15em'}}>💡</span>Get A Quote</Link></li>
                <li><Link className="dropdown-item md:inline-flex md:items-center md:gap-x-2 md:text-sm md:font-medium md:px-5 md:py-2" href="/review-offer" style={{ fontSize: '1.07rem', padding: '0.7rem 1.2rem', display: 'flex', alignItems: 'center', gap: 10, borderRadius: 6, transition: 'background 0.15s', fontWeight: 500 }}><span style={{fontSize: '1.15em'}}>📝</span>Review Offer</Link></li>
                <li><Link className="dropdown-item md:inline-flex md:items-center md:gap-x-2 md:text-sm md:font-medium md:px-5 md:py-2" href="/court-approval" style={{ fontSize: '1.07rem', padding: '0.7rem 1.2rem', display: 'flex', alignItems: 'center', gap: 10, borderRadius: 6, transition: 'background 0.15s', fontWeight: 500 }}><span style={{fontSize: '1.15em'}}>⚖️</span>Court Approval</Link></li>
                <li><Link className="dropdown-item md:inline-flex md:items-center md:gap-x-2 md:text-sm md:font-medium md:px-5 md:py-2" href="/get-your-cash" style={{ fontSize: '1.07rem', padding: '0.7rem 1.2rem', display: 'flex', alignItems: 'center', gap: 10, borderRadius: 6, transition: 'background 0.15s', fontWeight: 500 }}><span style={{fontSize: '1.15em'}}>💵</span>Get Your Cash</Link></li>
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
              <li className="nav-item" key={item.href}>
                <Link className={`nav-link${pathname === item.href ? ' active' : ''} md:inline-flex md:items-center md:text-sm md:font-medium`} href={item.href} style={{ fontSize: '1.09rem', padding: '0.7rem 1.1rem', display: 'flex', alignItems: 'center', fontWeight: pathname === item.href ? 600 : 500, borderRadius: 6, transition: 'background 0.15s, color 0.15s', ...(pathname === item.href ? { color: '#09b44d', background: '#e9f9f1' } : {}) }}>
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
