import Head from 'next/head';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const platforms = [
  {
    name: 'Facebook',
    icon: <FaFacebookF className="text-[#1877F3] mx-auto block" size={48} />,
    desc: 'Follow us on Facebook to stay updated with our latest news and community posts.'
  },
  {
    name: 'X (Twitter)',
    icon: <FaTwitter className="text-black dark:text-white mx-auto block" size={48} />,
    desc: 'Join us on X (Twitter) for real-time updates, tips, and industry insights.'
  },
  {
    name: 'Instagram',
    icon: <FaInstagram className="text-[#E4405F] mx-auto block" size={48} />,
    desc: 'Connect with us on Instagram for behind-the-scenes content and company highlights.'
  },
  {
    name: 'LinkedIn',
    icon: <FaLinkedinIn className="text-[#0A66C2] mx-auto block" size={48} />,
    desc: 'Follow our LinkedIn page for professional updates and business news.'
  },
];

export default function SocialMediaPage() {
  return (
    <>
      <Head>
        <title>Social Media | SmarterPayouts</title>
        <meta name="description" content="Connect with us on social media." />
      </Head>
      <main className="container py-5">
        <section className="how-fast-hero p-4 rounded mb-5 d-flex flex-column align-items-center justify-content-center shadow-sm" style={{ background: 'linear-gradient(90deg, #e9f9f1 60%, #fbc23322 100%)', boxShadow: '0 4px 24px rgba(9,180,77,0.08)', minHeight: '160px', marginBottom: 32 }}>
          <h1 className="fw-bold mb-2 text-success text-center" style={{ fontSize: '2.1rem', letterSpacing: '-1px' }}>
            Social Media
          </h1>
          <div className="text-muted mb-0 text-center" style={{ fontSize: '1.05rem', maxWidth: 600, margin: '0 auto' }}>
            Follow us on social media to stay up to date with the latest news, tips, and updates from SmarterPayouts. We love connecting with our community!
          </div>
        </section>
        <div className="flex flex-col gap-10 max-w-2xl mx-auto">
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className="flex flex-col items-center bg-white rounded-lg shadow-md px-6 py-8 gap-2 border border-gray-200 mb-2"
            >
              <div className="w-full mb-6">
                {platform.icon}
                <h2 className="h5 fw-bold mt-3 mb-2 text-success text-center" style={{ fontSize: '1.18rem', letterSpacing: '-0.5px' }}>{platform.name}</h2>
              </div>
              <p className="text-gray-700 text-base mb-0 text-center" style={{ fontSize: '1.04rem' }}>{platform.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
} 