"use client";

import type { CSSProperties } from 'react';
import { useEffect, useMemo, useState } from 'react';

export interface Product {
  id?: number;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface BusinessData {
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

const DEFAULT_PRIMARY = '#1f8a4c';
const DEFAULT_SECONDARY = '#e0632f';

// ---------- sector -> motif ----------
// Instead of pulling stock photos from a third-party image service (which breaks
// the moment the business has no real photo, and never actually fits the brand),
// every sector maps to a small generated pattern built from the business's own colors.
// It never fails to load and it never looks like a random stock photo.
type MotifId = 'harvest' | 'weave' | 'bloom' | 'grove' | 'grid' | 'tide';

const SECTOR_MOTIFS: { keys: string[]; motif: MotifId }[] = [
  { keys: ['coconut', 'palmyra', 'kithul', 'food', 'tea', 'spice', 'bakery', 'restaurant', 'cafe'], motif: 'harvest' },
  { keys: ['craft', 'handmade', 'textile', 'batik', 'fashion', 'jewelry', 'jewellery', 'wood'], motif: 'weave' },
  { keys: ['beauty', 'salon', 'wellness', 'spa'], motif: 'bloom' },
  { keys: ['agriculture', 'farm', 'organic', 'plant', 'nursery'], motif: 'grove' },
  { keys: ['technology', 'digital', 'software', 'service', 'consulting', 'it '], motif: 'grid' },
  { keys: ['tourism', 'travel', 'hotel', 'guest', 'villa', 'resort'], motif: 'tide' },
];

function cleanSector(sector?: string) {
  return (sector || 'Local business').replace(/_/g, ' ').trim().toLowerCase();
}

function titleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getMotif(sector?: string): MotifId {
  const normalized = cleanSector(sector);
  const match = SECTOR_MOTIFS.find((entry) => entry.keys.some((key) => normalized.includes(key)));
  return match?.motif ?? 'weave';
}

function motifBackground(motif: MotifId): CSSProperties {
  switch (motif) {
    case 'harvest':
      return {
        backgroundColor: 'var(--paper)',
        backgroundImage:
          'radial-gradient(circle at 28% 26%, color-mix(in srgb, var(--primary) 55%, white) 0%, transparent 46%),' +
          'radial-gradient(circle at 78% 72%, color-mix(in srgb, var(--secondary) 45%, white) 0%, transparent 50%),' +
          'repeating-radial-gradient(circle at 50% 50%, transparent 0 16px, color-mix(in srgb, var(--ink) 7%, transparent) 16px 17px)',
      };
    case 'weave':
      return {
        backgroundColor: 'var(--paper)',
        backgroundImage:
          'repeating-linear-gradient(45deg, color-mix(in srgb, var(--primary) 24%, transparent) 0 2px, transparent 2px 15px),' +
          'repeating-linear-gradient(-45deg, color-mix(in srgb, var(--secondary) 20%, transparent) 0 2px, transparent 2px 15px)',
      };
    case 'bloom':
      return {
        backgroundColor: 'var(--paper)',
        backgroundImage:
          'radial-gradient(circle at 24% 30%, color-mix(in srgb, var(--secondary) 42%, white) 0, transparent 40%),' +
          'radial-gradient(circle at 72% 22%, color-mix(in srgb, var(--primary) 38%, white) 0, transparent 38%),' +
          'radial-gradient(circle at 55% 78%, color-mix(in srgb, var(--primary) 26%, white) 0, transparent 42%)',
      };
    case 'grove':
      return {
        backgroundColor: 'var(--paper)',
        backgroundImage:
          'repeating-linear-gradient(115deg, color-mix(in srgb, var(--primary) 22%, transparent) 0 3px, transparent 3px 21px),' +
          'radial-gradient(circle at 80% 16%, color-mix(in srgb, var(--secondary) 32%, white) 0, transparent 40%)',
      };
    case 'grid':
      return {
        backgroundColor: 'var(--paper)',
        backgroundImage:
          'linear-gradient(color-mix(in srgb, var(--ink) 6%, transparent) 1px, transparent 1px),' +
          'linear-gradient(90deg, color-mix(in srgb, var(--ink) 6%, transparent) 1px, transparent 1px),' +
          'radial-gradient(circle at 22% 24%, color-mix(in srgb, var(--primary) 36%, white) 0, transparent 44%)',
        backgroundSize: '22px 22px, 22px 22px, auto',
      };
    case 'tide':
    default:
      return {
        backgroundColor: 'var(--paper)',
        backgroundImage:
          'repeating-linear-gradient(180deg, transparent 0 13px, color-mix(in srgb, var(--primary) 18%, transparent) 13px 15px),' +
          'radial-gradient(circle at 72% 30%, color-mix(in srgb, var(--secondary) 36%, white) 0, transparent 45%)',
      };
  }
}

function getProductKey(product: Product) {
  return product.id?.toString() ?? product.name;
}

function getInitials(name?: string) {
  return (name || 'Business')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function formatPhoneNumber(phone: string) {
  let cleanPhone = phone.replace(/[^\d+]/g, '');
  if (!cleanPhone.startsWith('+')) {
    cleanPhone = cleanPhone.startsWith('0') ? '+94' + cleanPhone.substring(1) : '+94' + cleanPhone;
  }
  return cleanPhone.replace('+', '');
}

function getOpenStatus(openTime?: string, closeTime?: string, workingDays?: string) {
  if (!openTime || !closeTime) {
    return { isOpen: true, text: 'Available for inquiries' };
  }

  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDayName = days[now.getDay()];
  const activeDays = workingDays
    ? workingDays.split(',').map((day) => day.trim().toLowerCase()).filter(Boolean)
    : [];

  if (activeDays.length > 0 && !activeDays.includes(currentDayName.toLowerCase())) {
    return { isOpen: false, text: `Closed today · open ${openTime}–${closeTime}` };
  }

  const parseTime = (time: string) => {
    const [hours = '0', minutes = '0'] = time.split(':');
    return Number(hours) * 60 + Number(minutes);
  };

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = parseTime(openTime);
  const closeMinutes = parseTime(closeTime);
  const isOpen =
    openMinutes <= closeMinutes
      ? currentMinutes >= openMinutes && currentMinutes <= closeMinutes
      : currentMinutes >= openMinutes || currentMinutes <= closeMinutes;

  return {
    isOpen,
    text: isOpen ? `Open now · closes ${closeTime}` : `Closed now · opens ${openTime}`,
  };
}

function getInitialOpenStatus(openTime?: string, closeTime?: string) {
  if (!openTime || !closeTime) {
    return { isOpen: true, text: 'Available for inquiries' };
  }
  return { isOpen: true, text: `${openTime}–${closeTime}` };
}

function getSocialLabel(platform: string) {
  const normalized = platform.toLowerCase();
  if (normalized.includes('facebook')) return 'Facebook';
  if (normalized.includes('instagram')) return 'Instagram';
  if (normalized.includes('whatsapp')) return 'WhatsApp';
  if (normalized.includes('tiktok')) return 'TikTok';
  return platform || 'Link';
}

type IconName = 'facebook' | 'instagram' | 'whatsapp' | 'tiktok' | 'link' | 'phone' | 'mail' | 'pin' | 'menu' | 'close' | 'arrow';

function Icon({ name }: { name: IconName }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' };
  switch (name) {
    case 'facebook':
      return (
        <svg {...common}>
          <path d="M14 9h2V6h-2c-1.66 0-3 1.34-3 3v2H9v3h2v6h3v-6h2.2l.8-3H14v-1.5c0-.28.22-.5.5-.5H14z" fill="currentColor" />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...common} stroke="currentColor" strokeWidth="1.6">
          <rect x="4" y="4" width="16" height="16" rx="4.5" />
          <circle cx="12" cy="12" r="3.4" />
          <circle cx="16.6" cy="7.4" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg {...common}>
          <path
            d="M12 3.5a8.5 8.5 0 0 0-7.35 12.8L3.6 20.5l4.32-1.02A8.5 8.5 0 1 0 12 3.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M8.8 8.6c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .55.4.2.5.6 1.4.65 1.5.05.15.1.3 0 .5-.1.2-.15.3-.3.45-.15.15-.3.3-.15.55.5.9 1.9 2.2 2.8 2.5.2.05.3 0 .45-.15.15-.15.5-.6.65-.8.15-.2.3-.15.5-.1.2.1 1.3.6 1.5.7.2.1.35.15.4.25.05.1.05.6-.15 1.1-.2.5-1.15 1-1.6 1.05-.4.05-1 .05-1.6-.15-.4-.15-.9-.3-1.55-.6-2.7-1.15-4.4-3.9-4.55-4.1-.15-.2-1.15-1.55-1.15-2.95 0-1.4.75-2.05.95-2.3Z"
            fill="currentColor"
          />
        </svg>
      );
    case 'tiktok':
      return (
        <svg {...common}>
          <path
            d="M14 3.5c.3 1.6 1.4 2.9 3 3.3v2.4c-1.2-.05-2.3-.4-3.2-1v5.3a4.6 4.6 0 1 1-4.2-4.6v2.4a2.2 2.2 0 1 0 1.8 2.2V3.5H14Z"
            fill="currentColor"
          />
        </svg>
      );
    case 'link':
      return (
        <svg {...common} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M9.5 14.5 14.5 9.5" />
          <path d="M11 6.5h1.5A3.5 3.5 0 0 1 16 10v0a3.5 3.5 0 0 1-1 2.5L13.5 14" />
          <path d="M13 17.5h-1.5A3.5 3.5 0 0 1 8 14v0a3.5 3.5 0 0 1 1-2.5L10.5 10" />
        </svg>
      );
    case 'phone':
      return (
        <svg {...common} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 4h3l1.5 4-2 1.5a10 10 0 0 0 5 5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 4.5 5.6 1.5 1.5 0 0 1 6 4Z" />
        </svg>
      );
    case 'mail':
      return (
        <svg {...common} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="6" width="16" height="12" rx="2" />
          <path d="M5 7.5 12 13l7-5.5" />
        </svg>
      );
    case 'pin':
      return (
        <svg {...common} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M12 21s-6.5-5.6-6.5-10.8A6.5 6.5 0 0 1 12 3a6.5 6.5 0 0 1 6.5 6.7C18.5 15.4 12 21 12 21Z" />
          <circle cx="12" cy="9.7" r="2.2" />
        </svg>
      );
    case 'menu':
      return (
        <svg {...common} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case 'close':
      return (
        <svg {...common} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case 'arrow':
    default:
      return (
        <svg {...common} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
  }
}

function getSocialIconName(platform: string): IconName {
  const normalized = platform.toLowerCase();
  if (normalized.includes('facebook')) return 'facebook';
  if (normalized.includes('instagram')) return 'instagram';
  if (normalized.includes('whatsapp')) return 'whatsapp';
  if (normalized.includes('tiktok')) return 'tiktok';
  return 'link';
}

/** A generated brand plate used anywhere a photo would normally go, and as a graceful
 *  fallback the moment a real photo fails to load or was never provided. */
function MotifPlate({
  motif,
  label,
  sublabel,
  compact,
}: {
  motif: MotifId;
  label: string;
  sublabel?: string;
  compact?: boolean;
}) {
  return (
    <div className={`motif-plate${compact ? ' motif-plate--compact' : ''}`} style={motifBackground(motif)}>
      <span className="motif-plate-mark">{label}</span>
      {sublabel && <span className="motif-plate-sub">{sublabel}</span>}
    </div>
  );
}

/** Image with an automatic fallback to the motif plate if it fails to load or is absent. */
function SmartImage({
  src,
  alt,
  motif,
  label,
}: {
  src?: string;
  alt: string;
  motif: MotifId;
  label: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <MotifPlate motif={motif} label={label} />;
  }
  return <img src={src} alt={alt} onError={() => setFailed(true)} />;
}

export default function ClientBusinessPage({ data }: { data: BusinessData }) {
  const products = data.products || [];
  const hasProducts = products.length > 0;
  const primary = data.primaryColor || DEFAULT_PRIMARY;
  const secondary = data.secondaryColor || DEFAULT_SECONDARY;
  const sector = titleCase(cleanSector(data.sector));
  const motif = useMemo(() => getMotif(data.sector), [data.sector]);
  const initials = getInitials(data.businessName);
  const [status, setStatus] = useState(() => getInitialOpenStatus(data.businessHoursOpen, data.businessHoursClose));
  const [navOpen, setNavOpen] = useState(false);

  const mapsUrl =
    data.googleMapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${data.businessName} ${sector} Sri Lanka`)}`;
  const heroText =
    data.heroText ||
    data.businessDescription ||
    `Meet ${data.businessName}, a Sri Lankan ${cleanSector(data.sector)} built around quality, trust, and friendly local service.`;
  const aboutText =
    data.aboutText ||
    data.businessDescription ||
    `${data.businessName} is a growing SME brand focused on one thing: making it easy for customers to see what's on offer, why it's worth trying, and how to get in touch.`;
  const marketingText = data.marketingText || 'Message us to check availability or ask a question — we reply fast.';
  const marketText = data.targetMarket || 'Local customers and repeat buyers';

  useEffect(() => {
    setStatus(getOpenStatus(data.businessHoursOpen, data.businessHoursClose, data.workingDays));
  }, [data.businessHoursClose, data.businessHoursOpen, data.workingDays]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStatus(getOpenStatus(data.businessHoursOpen, data.businessHoursClose, data.workingDays));
    }, 60000);
    return () => window.clearInterval(interval);
  }, [data.businessHoursClose, data.businessHoursOpen, data.workingDays]);

  useEffect(() => {
    setNavOpen(false);
  }, [data.businessName]);

  const contactHref = data.phone
    ? `https://wa.me/${formatPhoneNumber(data.phone)}?text=${encodeURIComponent(`Hello ${data.businessName}, I found your website and would like to learn more about your brand.`)}`
    : data.contactEmail
      ? `mailto:${data.contactEmail}?subject=${encodeURIComponent(`Inquiry for ${data.businessName}`)}`
      : '#contact';
  const hasDirectContact = Boolean(data.phone || data.contactEmail);

  const shellStyle = {
    '--primary': primary,
    '--secondary': secondary,
  } as CSSProperties;

  const navSections = [
    { href: '#story', label: 'Story' },
    ...(hasProducts ? [{ href: '#showcase', label: 'Showcase' }] : []),
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <main className="site-shell" style={shellStyle}>
      <nav className={`nav${navOpen ? ' nav-open' : ''}`}>
        <div className="container nav-inner">
          <a className="brand" href="#home" aria-label={`${data.businessName} home`} onClick={() => setNavOpen(false)}>
            <span className="brand-mark">
              {data.logoUrl ? (
                <SmartImage src={data.logoUrl} alt="" motif={motif} label={initials} />
              ) : (
                <MotifPlate motif={motif} label={initials} compact />
              )}
            </span>
            <span className="brand-text">
              <span className="brand-title">{data.businessName}</span>
              <span className="brand-subtitle">{sector}</span>
            </span>
          </a>

          <button
            type="button"
            className="nav-toggle"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={navOpen}
            onClick={() => setNavOpen((open) => !open)}
          >
            <Icon name={navOpen ? 'close' : 'menu'} />
          </button>

          <div className="nav-links">
            {navSections.map((section) => (
              <a key={section.href} href={section.href}>
                {section.label}
              </a>
            ))}
            <a className="nav-cta" href={contactHref} target={contactHref.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              Get in touch
            </a>
          </div>
        </div>

        {navOpen && (
          <div className="nav-mobile-panel">
            {navSections.map((section) => (
              <a key={section.href} href={section.href} onClick={() => setNavOpen(false)}>
                {section.label}
              </a>
            ))}
            <a
              className="nav-cta"
              href={contactHref}
              target={contactHref.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              onClick={() => setNavOpen(false)}
            >
              Get in touch
            </a>
          </div>
        )}
      </nav>

      <header id="home" className="hero">
        <div className="container hero-grid">
          <div className="hero-copy-block">
            <p className="eyebrow">
              <span className={status.isOpen ? 'status-dot' : 'status-dot closed'} />
              {status.text}
            </p>
            <p className="section-kicker">{sector}</p>
            <h1>{data.businessName}</h1>
            <p className="hero-copy">{heroText}</p>
            <div className="hero-actions">
              <a className="button button-primary" href={contactHref} target={contactHref.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                Contact the brand
                <Icon name="arrow" />
              </a>
              {hasProducts && (
                <a className="button button-secondary" href="#showcase">
                  View showcase
                </a>
              )}
            </div>
          </div>

          <aside className="hero-panel" aria-label="Brand summary">
            <div className="hero-panel-media">
              <SmartImage src={data.coverImageUrl} alt={`${data.businessName} brand visual`} motif={motif} label={initials} />
            </div>
            <div className="hero-panel-body">
              <span>{sector}</span>
              <h2>{marketText}</h2>
              <p>{marketingText}</p>
            </div>
          </aside>
        </div>
      </header>

      <section id="story" className="section story-section">
        <div className="container story-grid">
          <div className="story-copy">
            <p className="section-kicker">Brand story</p>
            <h2>A marketing page built for a growing SME.</h2>
            <p>{aboutText}</p>
          </div>
          <div className="story-notes">
            <article>
              <h3>Tell the story</h3>
              <p>Customers see the brand, the offer, and the reason to trust it — in seconds.</p>
            </article>
            <article>
              <h3>Show what matters</h3>
              <p>Products, photos, hours, and social links appear as soon as the owner adds them.</p>
            </article>
            <article>
              <h3>Get to contact</h3>
              <p>The page stays focused on calls, messages, and directions — not an online checkout.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section theme-band">
        <div className="container band-grid">
          <div className="band-copy">
            <p className="section-kicker">Fast launch</p>
            <h2>Live in seconds. Useful from day one.</h2>
          </div>
          <p className="band-lede">
            This page works even with a bare-bones profile. Add brand copy, photos, products, or services whenever
            you're ready — the page grows with the business, without a rebuild.
          </p>
        </div>
      </section>

      {hasProducts ? (
        <section id="showcase" className="section showcase-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Product showcase</p>
                <h2>What {data.businessName} wants customers to notice.</h2>
                <p className="section-lede">Products and services shown here are marketing highlights, not a checkout.</p>
              </div>
              <div className="section-summary-pill">{products.length} detail{products.length === 1 ? '' : 's'} shared</div>
            </div>

            <div className="product-grid">
              {products.map((product) => (
                <article className="product-card" key={getProductKey(product)}>
                  <div className="product-media">
                    <SmartImage src={product.imageUrl} alt={product.name} motif={motif} label={getInitials(product.name)} />
                  </div>
                  <div className="product-body">
                    <span className="product-badge">Showcase</span>
                    <h3 className="product-title">{product.name}</h3>
                    {product.description && <p className="product-description">{product.description}</p>}
                    <div className="product-footer">
                      <p className="price">{product.price != null ? `From LKR ${product.price.toLocaleString()}` : 'Contact for details'}</p>
                      <a className="text-link" href={contactHref} target={contactHref.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                        Ask more <Icon name="arrow" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="section showcase-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Product showcase</p>
                <h2>Nothing shared here yet.</h2>
                <p className="section-lede">
                  Add products or services to fill this space with photos, pricing, and details customers can act on.
                </p>
              </div>
            </div>
            <div className="preview-grid">
              {['Brand promise', 'Product details', 'Service highlights'].map((label) => (
                <article className="preview-card" key={label}>
                  <div className="preview-media">
                    <MotifPlate motif={motif} label={initials} sublabel={label} />
                  </div>
                  <div>
                    <span>{label}</span>
                    <p>This card becomes real once the owner adds a product, service, or photo.</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="section contact-section">
        <div className="container contact-grid">
          <div className="contact-panel">
            <p className="section-kicker">Contact</p>
            <h2>Start a conversation with {data.businessName}.</h2>
            <p className="section-lede">{marketingText}</p>

            <div className="contact-links">
              {data.phone && (
                <a className="contact-link" href={`tel:${data.phone}`}>
                  <span className="contact-link-icon"><Icon name="phone" /></span>
                  <span className="contact-link-text">
                    <span>Phone</span>
                    <strong>{data.phone}</strong>
                  </span>
                </a>
              )}
              {data.contactEmail && (
                <a className="contact-link" href={`mailto:${data.contactEmail}`}>
                  <span className="contact-link-icon"><Icon name="mail" /></span>
                  <span className="contact-link-text">
                    <span>Email</span>
                    <strong>{data.contactEmail}</strong>
                  </span>
                </a>
              )}
              <a className="contact-link" href={mapsUrl} target="_blank" rel="noreferrer">
                <span className="contact-link-icon"><Icon name="pin" /></span>
                <span className="contact-link-text">
                  <span>Location</span>
                  <strong>Get directions</strong>
                </span>
              </a>
              {!hasDirectContact && (
                <p className="contact-hint">No phone or email on file yet — directions are the best way to reach us for now.</p>
              )}
            </div>

            {data.socialLinks && data.socialLinks.length > 0 && (
              <div className="social-row">
                {data.socialLinks.map((link) => (
                  <a className="social-link" href={link.url} key={`${link.platform}-${link.url}`} target="_blank" rel="noreferrer">
                    <Icon name={getSocialIconName(link.platform)} />
                    {getSocialLabel(link.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>

          <aside className="hours-panel">
            <div className="hours-media">
              <SmartImage src={data.coverImageUrl} alt={`${data.businessName} visual`} motif={motif} label={initials} />
            </div>
            <div className="hours-body">
              <span>Availability</span>
              <h3>{data.workingDays || 'Contact for availability'}</h3>
              <p>
                {data.businessHoursOpen && data.businessHoursClose
                  ? `${data.businessHoursOpen} – ${data.businessHoursClose}`
                  : 'Message the brand directly to confirm hours and current availability.'}
              </p>
              <a className="button button-primary" href={contactHref} target={contactHref.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                Message now
                <Icon name="arrow" />
              </a>
            </div>
          </aside>
        </div>
      </section>

      <footer>
        <div className="container">
          © {new Date().getFullYear()} {data.businessName} · Powered by BuildBusinessLK
        </div>
      </footer>
    </main>
  );
}