import Head from 'next/head';

const videos = [
  {
    img: '/assets/images/Self.JPG',
    alt: 'Self Calculate an Early Payout with Smarter Payouts! thumbnail',
    title: 'Self Calculate an Early Payout with Smarter Payouts!',
    desc: "Self-calculate a lump sum offer for your future settlement payments using our real-time tool. It's fast, accurate, and secure.",
    url: 'https://youtu.be/TxFogK2R61o',
  },
  {
    img: '/assets/images/why-wait.jpg',
    alt: 'Why wait, see an Early Lump offer in 2 minutes thumbnail',
    title: 'Why wait, see an Early Lump offer in 2 minutes',
    desc: 'Understand the benefit of receiving a lump-sum today versus waiting for monthly checks. A 2-minute video that explains everything.',
    url: 'https://youtu.be/AYFvqQCCSoY',
  },
  {
    img: '/assets/images/debt.JPG',
    alt: 'How does it feel to be debt free! thumbnail',
    title: 'How does it feel to be debt free!',
    desc: 'See how settlement payments can be used to pay off high-interest debt and regain financial peace of mind.',
    url: 'https://youtu.be/ur9pB2-xkk4',
  },
];

export default function YouTubeChannel() {
  return (
    <>
      <Head>
        <title>SmarterPayouts YouTube Channel</title>
        <meta name="description" content="Explore our latest videos and insights on structured settlements and payout strategies." />
      </Head>
      <section className="how-fast-hero p-4 rounded mb-4 d-flex align-items-center justify-content-center" style={{
        background: "linear-gradient(90deg, #e9f9f1 60%, #fbc23322 100%)",
        boxShadow: "0 4px 24px rgba(9,180,77,0.08)",
        minHeight: '180px'
      }}>
        <div className="text-center w-100">
          <h1 className="fw-bold mb-2 text-success" style={{ fontSize: "2.2rem", letterSpacing: "-1px" }}>
            SmarterPayouts YouTube Channel
          </h1>
        </div>
      </section>
      <div className="section-divider"></div>
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {videos.map((video, idx) => (
              <div className="col" key={idx}>
                <div className="card h-100 shadow-sm d-flex flex-column justify-content-between">
                  <a href={video.url} target="_blank" rel="noopener noreferrer" tabIndex={0} aria-label={`Watch: ${video.title}`} style={{ textDecoration: 'none' }}>
                    <img src={video.img} alt={video.alt} className="card-img-top" style={{ width: '100%', height: '220px', objectFit: 'cover', borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem' }} />
                  </a>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold" style={{ fontSize: '1.1rem' }}>{video.title}</h5>
                    <p className="card-text text-muted mb-3" style={{ fontSize: '0.98rem' }}>{video.desc}</p>
                    <a href={video.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-success mt-auto w-100" tabIndex={0} aria-label={`Open YouTube: ${video.title}`}>Watch on YouTube</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
} 