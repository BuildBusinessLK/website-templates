import type { Metadata } from 'next';
import ClientBusinessPage from './ClientBusinessPage';


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
  businessHoursOpen?: string;
  businessHoursClose?: string;
  workingDays?: string;
  googleMapsUrl?: string;
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

function getSocialIcon(platform: string) {
  const normalized = platform.toLowerCase();
  if (normalized.includes('facebook')) return '📘';
  if (normalized.includes('instagram')) return '📸';
  if (normalized.includes('whatsapp')) return '💬';
  return '🔗';
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

  return <ClientBusinessPage data={data} />;
}
