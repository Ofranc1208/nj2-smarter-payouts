'use client';

export default function Footer() {
  return (
    <footer className="footer text-white bg-dark py-4">
      <div className="container text-center">
        <p>&copy; 2025 SmarterPayouts.com</p>
        <div className="d-flex justify-content-center gap-3 mt-2">
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white fs-4" style={{ textDecoration: 'none' }}>
            <span role="img" aria-label="Facebook">📘</span>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-white fs-4" style={{ textDecoration: 'none' }}>
            <span role="img" aria-label="LinkedIn">💼</span>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-white fs-4" style={{ textDecoration: 'none' }}>
            <span role="img" aria-label="YouTube">▶️</span>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white fs-4" style={{ textDecoration: 'none' }}>
            <span role="img" aria-label="Instagram">📸</span>
          </a>
        </div>
        <div className="mt-3">
          <a href="/privacy" className="text-white text-decoration-underline me-3" style={{ fontSize: '1rem' }}>Privacy Policy</a>
          <a href="/terms" className="text-white text-decoration-underline" style={{ fontSize: '1rem' }}>Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
