import type { Metadata } from 'next';

interface Product {
  id?: number;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface BusinessData {
  businessName: string;
  sector: string;
  heroText?: string;
  aboutText?: string;
  marketingText?: string;
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  contactEmail?: string;
  phone?: string;
  products?: Product[];
  socialLinks?: SocialLink[];
}

async function fetchBusiness(slug: string): Promise<BusinessData | null> {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8083').replace(/\/$/, '');
  try {
    const res = await fetch(`${base}/api/public/business/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await fetchBusiness(params.slug);
  return {
    title: data ? `${data.businessName} — BuildBusinessLK` : 'Business not found',
    description: data?.heroText || data?.aboutText || 'Sri Lankan SME business',
  };
}

export default async function BusinessPage({ params }: { params: { slug: string } }) {
  const data = await fetchBusiness(params.slug);

  if (!data) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          background: '#000',
          color: '#fff',
          padding: 48,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 56, marginBottom: 24 }}>🌴</div>
        <h1 style={{ fontWeight: 900, color: '#fff', marginBottom: 12 }}>Business not found</h1>
        <p style={{ color: '#94a3b8', maxWidth: 420 }}>
          The business you're looking for doesn't exist or may not have published their site yet.
        </p>
      </main>
    );
  }

  const primary = data.primaryColor || '#15803d';
  const secondary = data.secondaryColor || '#ca8a04';
  const accentGradient = 'linear-gradient(135deg, #FF6B35, #F59E0B)';

  const font = `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`;

  return (
    <main id="home" style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: font }}>
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'rgba(0,0,0,0.88)',
          backdropFilter: 'blur(18px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '18px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <a
            href="#home"
            style={{
              textDecoration: 'none',
              color: '#fff',
              fontWeight: 800,
              fontSize: '1.05rem',
            }}
          >
            {data.businessName || 'Business'}
          </a>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <a
              href="#home"
              style={{
                color: '#f8fafc',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Home
            </a>
            <a
              href="#products"
              style={{
                color: '#f8fafc',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Products
            </a>
            <a
              href="#about"
              style={{
                color: '#f8fafc',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              About us
            </a>
            <a
              href="#contact"
              style={{
                color: '#f8fafc',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Contact us
            </a>
          </div>
        </div>
      </nav>

      {/* ── Cover image ── */}
      {data.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.coverImageUrl}
          alt=""
          style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }}
        />
      )}

      {/* ── Hero section ── */}
      <header
        style={{
          background: `linear-gradient(135deg, ${primary}ee, ${primary})`,
          color: '#fff',
          padding: data.coverImageUrl ? '48px 24px 56px' : '80px 24px 72px',
        }}
      >
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 0.9fr',
              gap: 32,
              alignItems: 'center',
              minHeight: 420,
            }}
          >
            <div>
              <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                {data.logoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.logoUrl}
                    alt={data.businessName}
                    style={{ width: 80, height: 80, borderRadius: 16, objectFit: 'cover', border: '3px solid rgba(255,255,255,0.3)' }}
                  />
                )}
                <div>
                  <p
                    style={{
                      margin: '0 0 6px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      opacity: 0.75,
                    }}
                  >
                    {data.sector} · Sri Lanka
                  </p>
                  <h1 style={{ margin: 0, fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 4rem)', lineHeight: 1.05 }}>
                    {data.businessName}
                  </h1>
                </div>
              </div>

              {data.heroText && (
                <p
                  style={{
                    maxWidth: 680,
                    lineHeight: 1.65,
                    marginTop: 28,
                    fontSize: '1.15rem',
                    opacity: 0.93,
                    borderLeft: '4px solid rgba(255,255,255,0.35)',
                    paddingLeft: 18,
                  }}
                >
                  {data.heroText}
                </p>
              )}

              {/* Call-to-action anchor */}
              {(data.contactEmail || data.phone) && (
                <a
                  href="#contact"
                  style={{
                    display: 'inline-block',
                    marginTop: 28,
                    padding: '12px 28px',
                    background: secondary,
                    color: '#fff',
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                  }}
                >
                  Get in touch
                </a>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero-coconut.jpg"
                alt="Coconut product hero"
                style={{
                  width: '100%',
                  maxWidth: 520,
                  borderRadius: 28,
                  boxShadow: '0 30px 80px rgba(0,0,0,0.24)',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '56px 24px 80px' }}>

          {/* Products */}
        {data.products && data.products.length > 0 && (
          <section id="products" style={{ marginBottom: 56 }}>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                color: '#fff',
                marginBottom: 24,
                paddingBottom: 10,
                borderBottom: `3px solid ${primary}`,
                display: 'inline-block',
              }}
            >
              Our products
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 24,
                alignItems: 'stretch',
              }}
            >
              {data.products.map((p) => (
                <article
                  key={p.id ?? p.name}
                  style={{
                    background: '#08101a',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 20,
                    overflow: 'hidden',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ padding: '20px 20px 14px' }}>
                    <h3 style={{ margin: 0, fontWeight: 900, color: '#fff', fontSize: '1.05rem' }}>
                      {p.name}
                    </h3>
                  </div>
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: 220,
                        background: '#111827',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#94a3b8',
                        fontSize: '0.95rem',
                      }}
                    >
                      No image available
                    </div>
                  )}
                  <div style={{ padding: '18px 20px', marginTop: 'auto' }}>
                    {p.description && (
                      <p style={{ margin: '0 0 14px', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.65 }}>
                        {p.description}
                      </p>
                    )}
                    {p.price != null && (
                      <p
                        style={{
                          margin: 0,
                          fontWeight: 900,
                          fontSize: '1.05rem',
                          color: secondary,
                        }}
                      >
                        LKR {p.price.toLocaleString()}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* About */}
        {data.aboutText && (
          <section id="about" style={{ marginBottom: 56 }}>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                color: '#fff',
                marginBottom: 16,
                paddingBottom: 10,
                borderBottom: `3px solid ${secondary}`,
                display: 'inline-block',
              }}
            >
              About us
            </h2>
            <p
              style={{
                whiteSpace: 'pre-wrap',
                color: '#e2e8f0',
                lineHeight: 1.8,
                fontSize: '1.05rem',
                maxWidth: 740,
              }}
            >
              {data.aboutText}
            </p>
          </section>
        )}

        {/* Contact */}
        <section
          id="contact"
          style={{
            background: '#07111d',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: '32px 36px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.24)',
          }}
        >
          <h2
            style={{
              fontSize: '1.35rem',
              fontWeight: 900,
              color: '#fff',
              marginTop: 0,
              marginBottom: 20,
            }}
          >
            Contact us
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.contactEmail && (
              <p style={{ margin: 0, color: '#e2e8f0', fontSize: '1rem' }}>
                📧{' '}
                <a href={`mailto:${data.contactEmail}`} style={{ color: secondary, fontWeight: 600 }}>
                  {data.contactEmail}
                </a>
              </p>
            )}
            {data.phone && (
              <p style={{ margin: 0, color: '#e2e8f0', fontSize: '1rem' }}>
                📞{' '}
                <a href={`tel:${data.phone}`} style={{ color: secondary, fontWeight: 600 }}>
                  {data.phone}
                </a>
              </p>
            )}
          </div>
          {data.socialLinks && data.socialLinks.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
              {data.socialLinks.map((s) => (
                <a
                  key={s.platform + s.url}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '6px 16px',
                    borderRadius: 999,
                    background: primary + '18',
                    color: primary,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    border: `1px solid ${primary}30`,
                  }}
                >
                  {s.platform}
                </a>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── Footer ── */}
      <footer
        style={{
          background: primary,
          color: '#fff',
          textAlign: 'center',
          padding: '24px 16px',
          fontSize: '0.85rem',
          opacity: 0.9,
        }}
      >
        <p style={{ margin: 0 }}>
          © {new Date().getFullYear()} {data.businessName} · Powered by{' '}
          <strong>BuildBusinessLK</strong>
        </p>
      </footer>
    </main>
  );
}
