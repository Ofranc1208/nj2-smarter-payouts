"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [navbarCollapsed, setNavbarCollapsed] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const isInProcessSection = processRoutes.includes(pathname);

  React.useEffect(() => {
    setDropdownOpen(false);
    setNavbarCollapsed(true);
  }, [pathname]);

  // Hardcoded keyword-to-route map
  const searchMap: { [key: string]: string } = {
    'faq': '/faqs',
    'faqs': '/faqs',
    'testimonials': '/testimonials',
    'contact': '/contact',
    'quote': '/get-a-quote',
    'resources': '/resources',
    'about': '/about',
    'privacy': '/privacy',
    'terms': '/terms',
    'calculator': '/pricing-calculator',
    'structured settlement': '/main',
    'main': '/main',
    'home': '/main',
    'offer': '/review-offer',
    'court': '/court-approval',
    'cash': '/get-your-cash',
    'blog': '/blog',
    'articles': '/articles',
    'youtube': '/youtube-channel',
  };

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const keyword = searchValue.trim().toLowerCase();
    const route = searchMap[keyword];
    if (route) {
      router.push(route);
      setSearchValue('');
      setNavbarCollapsed(true);
    } else if (keyword) {
      // Redirect to helpful links page instead of alert
      router.push('/helpful-links');
      setSearchValue('');
      setNavbarCollapsed(true);
    }
  }

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
          {/* Mobile search bar: visible only when navbar is collapsed (mobile menu open) */}
          {!navbarCollapsed && (
            <div className="d-md-none w-100 px-3 pb-2" style={{ background: '#fff' }}>
              <form className="d-flex mt-2 mb-3" role="search" onSubmit={handleSearchSubmit}>
                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={searchValue} onChange={e => setSearchValue(e.target.value)} />
                <button className="btn btn-outline-success" type="submit">Search</button>
              </form>
            </div>
          )}
          <ul className="navbar-nav ms-auto align-items-center" style={{ gap: 0 }}>
            {/* Home and Calculator always visible */}
            {[{ href: '/main', label: 'Home' }, { href: '/pricing-calculator', label: 'Early Payout Calculator' }].map((item) => (
              <li className="nav-item me-2" key={item.href}>
                <Link className={`nav-link${pathname === item.href ? ' active' : ''}`} href={item.href}
                  style={{ fontSize: '1.09rem', padding: '0.7rem 1.1rem', display: 'flex', alignItems: 'center', fontWeight: pathname === item.href ? 600 : 500, borderRadius: 6, transition: 'background 0.15s, color 0.15s', ...(pathname === item.href ? { color: '#09b44d', background: '#e9f9f1' } : {}) }}
                  onClick={() => setNavbarCollapsed(true)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {/* Why Us dropdown (first) */}
            <li className="nav-item dropdown me-2">
              <span
                className="nav-link dropdown-toggle"
                id="whyUsDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ cursor: 'pointer', fontSize: '1.09rem', padding: '0.7rem 1.1rem', display: 'flex', alignItems: 'center', fontWeight: 500, borderRadius: 6, transition: 'background 0.15s, color 0.15s' }}
              >
                Why Us
              </span>
              <ul className="dropdown-menu" aria-labelledby="whyUsDropdown" style={{ border: '1.5px solid #09b44d', borderRadius: 12, boxShadow: '0 4px 18px rgba(9,180,77,0.07)', minWidth: 230, marginTop: 6, padding: '0.5rem 0' }}>
                <li><Link className="dropdown-item d-flex align-items-center px-3 py-2" href="/testimonials" style={{ fontSize: '1.07rem', gap: 10, borderRadius: 6, fontWeight: 500 }} onClick={() => setNavbarCollapsed(true)}><span style={{fontSize: '1.15em'}}>⭐</span>Testimonials</Link></li>
                <li><Link className="dropdown-item d-flex align-items-center px-3 py-2" href="/credentials" style={{ fontSize: '1.07rem', gap: 10, borderRadius: 6, fontWeight: 500 }} onClick={() => setNavbarCollapsed(true)}><span style={{fontSize: '1.15em'}}>🛡️</span>Credentials</Link></li>
              </ul>
            </li>
            {/* Company Info dropdown (second) */}
            <li className="nav-item dropdown me-2">
              <span
                className="nav-link dropdown-toggle"
                id="companyDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ cursor: 'pointer', fontSize: '1.09rem', padding: '0.7rem 1.1rem', display: 'flex', alignItems: 'center', fontWeight: 500, borderRadius: 6, transition: 'background 0.15s, color 0.15s' }}
              >
                Company Info
              </span>
              <ul className="dropdown-menu" aria-labelledby="companyDropdown" style={{ border: '1.5px solid #09b44d', borderRadius: 12, boxShadow: '0 4px 18px rgba(9,180,77,0.07)', minWidth: 230, marginTop: 6, padding: '0.5rem 0' }}>
                <li><Link className="dropdown-item d-flex align-items-center px-3 py-2" href="/about" style={{ fontSize: '1.07rem', gap: 10, borderRadius: 6, fontWeight: 500 }} onClick={() => setNavbarCollapsed(true)}><span style={{fontSize: '1.15em'}}>🏢</span>About Us</Link></li>
                <li><Link className="dropdown-item d-flex align-items-center px-3 py-2" href="/faqs" style={{ fontSize: '1.07rem', gap: 10, borderRadius: 6, fontWeight: 500 }} onClick={() => setNavbarCollapsed(true)}><span style={{fontSize: '1.15em'}}>❓</span>FAQs</Link></li>
                <li><Link className="dropdown-item d-flex align-items-center px-3 py-2" href="/contact" style={{ fontSize: '1.07rem', gap: 10, borderRadius: 6, fontWeight: 500 }} onClick={() => setNavbarCollapsed(true)}><span style={{fontSize: '1.15em'}}>✉️</span>Contact Us</Link></li>
              </ul>
            </li>
            {/* Resources dropdown (third) */}
            <li className="nav-item dropdown me-2">
              <span
                className="nav-link dropdown-toggle"
                id="resourcesDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ cursor: 'pointer', fontSize: '1.09rem', padding: '0.7rem 1.1rem', display: 'flex', alignItems: 'center', fontWeight: 500, borderRadius: 6, transition: 'background 0.15s, color 0.15s' }}
              >
                Resources
              </span>
              <ul className="dropdown-menu" aria-labelledby="resourcesDropdown" style={{ border: '1.5px solid #09b44d', borderRadius: 12, boxShadow: '0 4px 18px rgba(9,180,77,0.07)', minWidth: 230, marginTop: 6, padding: '0.5rem 0' }}>
                <li><Link className="dropdown-item d-flex align-items-center px-3 py-2" href="/articles" style={{ fontSize: '1.07rem', gap: 10, borderRadius: 6, fontWeight: 500 }} onClick={() => setNavbarCollapsed(true)}><span style={{fontSize: '1.15em'}}>📰</span>Articles</Link></li>
                <li><Link className="dropdown-item d-flex align-items-center px-3 py-2" href="/testimonials" style={{ fontSize: '1.07rem', gap: 10, borderRadius: 6, fontWeight: 500, display: 'none' }} onClick={() => setNavbarCollapsed(true)}><span style={{fontSize: '1.15em'}}>⭐</span>Testimonials</Link></li>
                <li><Link className="dropdown-item d-flex align-items-center px-3 py-2" href="/credentials" style={{ fontSize: '1.07rem', gap: 10, borderRadius: 6, fontWeight: 500, display: 'none' }} onClick={() => setNavbarCollapsed(true)}><span style={{fontSize: '1.15em'}}>🛡️</span>Credentials</Link></li>
                <li><Link className="dropdown-item d-flex align-items-center px-3 py-2" href="/resources" style={{ fontSize: '1.07rem', gap: 10, borderRadius: 6, fontWeight: 500 }} onClick={() => setNavbarCollapsed(true)}><span style={{fontSize: '1.15em'}}>📚</span>Settlement Insurance Companies</Link></li>
                <li><Link className="dropdown-item d-flex align-items-center px-3 py-2" href="/structured-settlement-laws" style={{ fontSize: '1.07rem', gap: 10, borderRadius: 6, fontWeight: 500 }} onClick={() => setNavbarCollapsed(true)}><span style={{fontSize: '1.15em'}}>⚖️</span>Structured Settlement Federal Law</Link></li>
                <li><Link className="dropdown-item d-flex align-items-center px-3 py-2" href="/structured-settlement-laws-by-state" style={{ fontSize: '1.07rem', gap: 10, borderRadius: 6, fontWeight: 500 }} onClick={() => setNavbarCollapsed(true)}><span style={{fontSize: '1.15em'}}>🏛️</span>Structured Settlement Laws by State</Link></li>
              </ul>
            </li>
            {/* Our Process dropdown (existing) */}
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
            {/* YouTube Channel (standalone link) */}
            <li className="nav-item me-2">
              <Link className={`nav-link${pathname === '/youtube-channel' ? ' active' : ''}`} href="/youtube-channel"
                style={{ fontSize: '1.09rem', padding: '0.7rem 1.1rem', display: 'flex', alignItems: 'center', fontWeight: pathname === '/youtube-channel' ? 600 : 500, borderRadius: 6, transition: 'background 0.15s, color 0.15s', ...(pathname === '/youtube-channel' ? { color: '#09b44d', background: '#e9f9f1' } : {}) }}
                onClick={() => setNavbarCollapsed(true)}
              >
                <span style={{fontSize: '1.15em'}}>▶️</span> YouTube Channel
              </Link>
            </li>
          </ul>
          {/* Desktop search bar: visible on md and up */}
          <form className="d-none d-md-flex ms-3" role="search" style={{ maxWidth: 260 }} onSubmit={handleSearchSubmit}>
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" style={{ minWidth: 0 }} value={searchValue} onChange={e => setSearchValue(e.target.value)} />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>
  );
}
