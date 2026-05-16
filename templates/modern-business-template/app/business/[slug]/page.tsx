async function fetchBusiness(slug: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8083';
  const res = await fetch(`${base}/api/public/business/${encodeURIComponent(slug)}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function BusinessPage({ params }: { params: { slug: string } }) {
  const data = await fetchBusiness(params.slug);
  if (!data) {
    return (
      <main style={{ padding: 48, textAlign: 'center' }}>
        <h1>Business not found</h1>
      </main>
    );
  }

  const primary = data.primaryColor || '#15803d';
  const secondary = data.secondaryColor || '#ca8a04';

  return (
    <main>
      {data.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data.coverImageUrl} alt="" style={{ width: '100%', height: 280, objectFit: 'cover' }} />
      )}
      <header style={{ background: primary, color: '#fff', padding: '48px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {data.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.logoUrl} alt="" width={72} height={72} style={{ borderRadius: 8, objectFit: 'cover' }} />
            )}
            <div>
              <h1 style={{ margin: 0 }}>{data.businessName}</h1>
              <p style={{ opacity: 0.9, margin: '8px 0 0' }}>
                {data.sector} · Sri Lanka
              </p>
            </div>
          </div>
          {data.heroText && (
            <p style={{ maxWidth: 720, lineHeight: 1.5, marginTop: 24, fontSize: '1.15rem' }}>{data.heroText}</p>
          )}
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 64px' }}>
        {data.aboutText && (
          <section style={{ marginBottom: 24, borderTop: `4px solid ${secondary}`, paddingTop: 16 }}>
            <h2>About</h2>
            <p style={{ whiteSpace: 'pre-wrap' }}>{data.aboutText}</p>
          </section>
        )}
        {data.marketingText && (
          <section style={{ marginBottom: 24 }}>
            <h2>Why choose us</h2>
            <p style={{ whiteSpace: 'pre-wrap' }}>{data.marketingText}</p>
          </section>
        )}
        {data.products?.length > 0 && (
          <section style={{ marginBottom: 24 }}>
            <h2>Products</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 16,
              }}
            >
              {data.products.map((p: { id?: number; name: string; description?: string; price?: number; imageUrl?: string }) => (
                <article key={p.id || p.name} style={{ border: '1px solid #e5e5e5', borderRadius: 12, overflow: 'hidden' }}>
                  {p.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                  )}
                  <div style={{ padding: 12 }}>
                    <h3 style={{ margin: '0 0 8px' }}>{p.name}</h3>
                    {p.description && <p style={{ margin: 0, color: '#555', fontSize: '0.95rem' }}>{p.description}</p>}
                    {p.price != null && <p style={{ fontWeight: 700, margin: '8px 0 0' }}>LKR {p.price}</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
        <section style={{ border: '1px solid #e5e5e5', borderRadius: 12, padding: 20 }}>
          <h2>Contact</h2>
          {data.contactEmail && <p>Email: {data.contactEmail}</p>}
          {data.phone && <p>Phone: {data.phone}</p>}
          {data.socialLinks?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              {data.socialLinks.map((s: { platform: string; url: string }) => (
                <a key={s.platform + s.url} href={s.url} target="_blank" rel="noreferrer" style={{ color: primary }}>
                  {s.platform}
                </a>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
