'use client';

import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="footer text-white bg-dark py-4">
      <div className="container text-center">
        <p>&copy; 2025 SmarterPayouts.com</p>
        <div className="mt-3 flex justify-center items-center flex-wrap gap-x-4 gap-y-2 text-yellow-400 text-base font-medium">
          <a href="/privacy" className="hover:underline">Privacy</a>
          <span className="text-yellow-400">|</span>
          <a href="/terms" className="hover:underline">Terms</a>
          <span className="text-yellow-400">|</span>
          <a href="/articles" className="hover:underline">Articles</a>
          <span className="text-yellow-400">|</span>
          <a href="/faqs" className="hover:underline">FAQs</a>
        </div>
      </div>
    </footer>
  );
}
