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
          background: '#f8fafc',
          padding: 48,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 56, marginBottom: 24 }}>🌴</div>
        <h1 style={{ fontWeight: 900, color: '#0f172a', marginBottom: 12 }}>Business not found</h1>
        <p style={{ color: '#64748b', maxWidth: 420 }}>
          The business you're looking for doesn't exist or may not have published their site yet.
        </p>
      </main>
    );
  }

  const primary = data.primaryColor || '#15803d';
  const secondary = data.secondaryColor || '#ca8a04';

  const font = `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`;

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: font }}>

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
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
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
              <h1 style={{ margin: 0, fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.1 }}>
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
      </header>

      {/* ── Body ── */}
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '56px 24px 80px' }}>

        {/* About */}
        {data.aboutText && (
          <section style={{ marginBottom: 56 }}>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                color: '#0f172a',
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
                color: '#374151',
                lineHeight: 1.8,
                fontSize: '1.05rem',
                maxWidth: 740,
              }}
            >
              {data.aboutText}
            </p>
          </section>
        )}

        {/* Why choose us */}
        {data.marketingText && (
          <section
            style={{
              marginBottom: 56,
              background: `linear-gradient(135deg, ${secondary}18, ${secondary}08)`,
              border: `1px solid ${secondary}30`,
              borderRadius: 16,
              padding: '28px 32px',
            }}
          >
            <h2
              style={{
                fontSize: '1.35rem',
                fontWeight: 900,
                color: '#0f172a',
                marginTop: 0,
                marginBottom: 14,
              }}
            >
              Why choose us
            </h2>
            <p style={{ whiteSpace: 'pre-wrap', color: '#374151', lineHeight: 1.8, margin: 0 }}>
              {data.marketingText}
            </p>
          </section>
        )}

        {/* Products */}
        {data.products && data.products.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                color: '#0f172a',
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
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 20,
              }}
            >
              {data.products.map((p) => (
                <article
                  key={p.id ?? p.name}
                  style={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 14,
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    transition: 'box-shadow 0.2s',
                  }}
                >
                  {p.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                    />
                  )}
                  <div style={{ padding: '16px 18px' }}>
                    <h3 style={{ margin: '0 0 6px', fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                      {p.name}
                    </h3>
                    {p.description && (
                      <p style={{ margin: '0 0 10px', color: '#64748b', fontSize: '0.9rem', lineHeight: 1.55 }}>
                        {p.description}
                      </p>
                    )}
                    {p.price != null && (
                      <p
                        style={{
                          margin: 0,
                          fontWeight: 800,
                          fontSize: '1rem',
                          color: primary,
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

        {/* Contact */}
        <section
          id="contact"
          style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 16,
            padding: '32px 36px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <h2
            style={{
              fontSize: '1.35rem',
              fontWeight: 900,
              color: '#0f172a',
              marginTop: 0,
              marginBottom: 20,
            }}
          >
            Contact us
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.contactEmail && (
              <p style={{ margin: 0, color: '#374151', fontSize: '1rem' }}>
                📧{' '}
                <a href={`mailto:${data.contactEmail}`} style={{ color: primary, fontWeight: 600 }}>
                  {data.contactEmail}
                </a>
              </p>
            )}
            {data.phone && (
              <p style={{ margin: 0, color: '#374151', fontSize: '1rem' }}>
                📞{' '}
                <a href={`tel:${data.phone}`} style={{ color: primary, fontWeight: 600 }}>
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
