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
  websiteSlug?: string;
  businessDescription?: string;
  targetMarket?: string;
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
      <main className="site-shell not-found-shell">
        <div className="not-found-card">
          <span className="not-found-mark">BLK</span>
          <p className="section-kicker">Business not found</p>
          <h1>That website is not live yet.</h1>
          <p>
            The business you&apos;re looking for does not exist, or the owner has not published their site yet.
          </p>
          <a className="button button-primary" href="/">
            Return home
          </a>
        </div>
      </main>
    );
  }

  return <ClientBusinessPage data={data} />;
}
