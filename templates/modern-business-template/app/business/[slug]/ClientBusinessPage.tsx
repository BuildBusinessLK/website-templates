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

const DEFAULT_PRIMARY = '#22c55e';
const DEFAULT_SECONDARY = '#ff6b35';
const COPYRIGHT_YEAR = 2026;
const HOME_HERO_IMAGE = '/brand-home-bg.png';

const PHOTO_THEMES = [
  { keys: ['coconut', 'palmyra', 'kithul', 'food', 'tea', 'spice', 'bakery', 'restaurant'], query: 'sri+lanka+food+market' },
  { keys: ['craft', 'handmade', 'textile', 'batik', 'fashion', 'jewelry', 'wood'], query: 'handmade+artisan+workshop' },
  { keys: ['beauty', 'salon', 'wellness', 'spa'], query: 'modern+salon+wellness' },
  { keys: ['agriculture', 'farm', 'organic', 'plant'], query: 'organic+farm+produce' },
  { keys: ['technology', 'digital', 'software', 'service', 'consulting'], query: 'modern+small+business+team' },
  { keys: ['tourism', 'travel', 'hotel', 'guest', 'villa'], query: 'sri+lanka+boutique+hotel' },
] as const;

function cleanSector(sector?: string) {
  return (sector || 'Local business').replace(/_/g, ' ').trim().toLowerCase();
}

function titleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
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

function getImageQuery(sector?: string) {
  const normalized = cleanSector(sector);
  const match = PHOTO_THEMES.find((theme) => theme.keys.some((key) => normalized.includes(key)));
  return match?.query || 'sri+lanka+small+business+market';
}

function getFallbackPhoto(query: string, width = 1200, height = 900) {
  return `https://source.unsplash.com/${width}x${height}/?${query}`;
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
    return { isOpen: false, text: `Closed today · ${openTime} - ${closeTime}` };
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
    text: isOpen ? `Open now · closes ${closeTime}` : `Closed now · ${openTime} - ${closeTime}`,
  };
}

function getInitialOpenStatus(openTime?: string, closeTime?: string) {
  if (!openTime || !closeTime) {
    return { isOpen: true, text: 'Available for inquiries' };
  }
  return { isOpen: true, text: `${openTime} - ${closeTime}` };
}

function getSocialLabel(platform: string) {
  const normalized = platform.toLowerCase();
  if (normalized.includes('facebook')) return 'Facebook';
  if (normalized.includes('instagram')) return 'Instagram';
  if (normalized.includes('whatsapp')) return 'WhatsApp';
  if (normalized.includes('tiktok')) return 'TikTok';
  return platform || 'Link';
}

function getSocialIcon(platform: string) {
  const normalized = platform.toLowerCase();
  if (normalized.includes('facebook')) return 'f';
  if (normalized.includes('instagram')) return 'ig';
  if (normalized.includes('whatsapp')) return 'wa';
  if (normalized.includes('tiktok')) return 'tk';
  return 'in';
}

export default function ClientBusinessPage({ data }: { data: BusinessData }) {
  const products = data.products || [];
  const hasProducts = products.length > 0;
  const primary = data.primaryColor || DEFAULT_PRIMARY;
  const secondary = data.secondaryColor || DEFAULT_SECONDARY;
  const sector = titleCase(cleanSector(data.sector));
  const photoQuery = useMemo(() => getImageQuery(data.sector), [data.sector]);
  const showcaseImage = data.coverImageUrl || getFallbackPhoto(photoQuery);
  const [status, setStatus] = useState(() => getInitialOpenStatus(data.businessHoursOpen, data.businessHoursClose));
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
    `${data.businessName} is a growing SME brand with a simple promise: make it easy for customers to understand what we offer, why it matters, and how to reach us.`;
  const marketingText =
    data.marketingText ||
    'Message us to learn more, ask about availability, or discuss what you need.';
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

  const contactHref = data.phone
    ? `https://wa.me/${formatPhoneNumber(data.phone)}?text=${encodeURIComponent(`Hello ${data.businessName}, I found your website and would like to learn more about your brand.`)}`
    : data.contactEmail
      ? `mailto:${data.contactEmail}?subject=${encodeURIComponent(`Inquiry for ${data.businessName}`)}`
      : '#contact';

  const shellStyle = {
    '--primary': primary,
    '--secondary': secondary,
  } as CSSProperties;

  const heroStyle = {
    backgroundImage: `linear-gradient(90deg, rgba(6, 10, 13, 0.9) 0%, rgba(6, 10, 13, 0.72) 44%, rgba(6, 10, 13, 0.26) 100%), url("${HOME_HERO_IMAGE}")`,
  };

  return (
    <main className="site-shell" style={shellStyle}>
      <nav className="nav">
        <div className="container nav-inner">
          <a className="brand" href="#home" aria-label={`${data.businessName} home`}>
            <span className="brand-mark">
              {data.logoUrl ? <img src={data.logoUrl} alt="" /> : getInitials(data.businessName)}
            </span>
            <span className="brand-text">
              <span className="brand-title">{data.businessName}</span>
              <span className="brand-subtitle">{sector}</span>
            </span>
          </a>

          <div className="nav-links">
            <a href="#story">Story</a>
            {hasProducts && <a href="#showcase">Showcase</a>}
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      <header id="home" className="hero" style={heroStyle}>
        <div className="container hero-grid">
          <div className="hero-copy-block reveal-up">
            <p className="eyebrow">
              <span className={status.isOpen ? 'status-dot' : 'status-dot closed'} />
              {status.text}
            </p>
            <h1>{data.businessName}</h1>
            <p className="hero-copy">{heroText}</p>
            <div className="hero-actions">
              <a className="button button-primary" href={contactHref} target={contactHref.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                Contact the brand
              </a>
              {hasProducts && (
                <a className="button button-secondary" href="#showcase">
                  View showcase
                </a>
              )}
            </div>
          </div>

          <aside className="hero-panel reveal-up delay-1" aria-label="Brand summary">
            <img src={showcaseImage} alt={`${data.businessName} brand visual`} />
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
          <div className="story-copy reveal-up">
            <p className="section-kicker">Brand story</p>
            <h2>A simple marketing page made for a growing SME.</h2>
            <p>{aboutText}</p>
          </div>
          <div className="story-notes reveal-up delay-1">
            <article>
              <span>01</span>
              <h3>Tell the story</h3>
              <p>Customers can quickly understand the brand, the offer, and the reason to trust it.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Show useful details</h3>
              <p>Products, services, photos, opening hours, and social links can appear when the owner adds them.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Move to contact</h3>
              <p>The page stays focused on calls, messages, directions, and social engagement instead of online selling.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section theme-band">
        <div className="container band-grid">
          <div className="band-copy reveal-up">
            <p className="section-kicker">Fast launch</p>
            <h2>Created in seconds, useful from day one.</h2>
          </div>
          <p className="band-lede reveal-up delay-1">
            This template works even with a small business profile. As the owner adds more brand copy, photos, products, or services, the page becomes richer without needing a custom build.
          </p>
        </div>
      </section>

      {hasProducts && (
        <section id="showcase" className="section showcase-section">
          <div className="container">
            <div className="section-heading reveal-up">
              <div>
                <p className="section-kicker">Product showcase</p>
                <h2>What {data.businessName} wants customers to notice.</h2>
                <p className="section-lede">Products and services are presented as marketing details, not a sales flow.</p>
              </div>
              <div className="section-summary-pill">{products.length} detail{products.length === 1 ? '' : 's'} shared</div>
            </div>

            <div className="product-grid">
              {products.map((product, index) => {
                const imageUrl = product.imageUrl || getFallbackPhoto(`${encodeURIComponent(product.name)}+${photoQuery}`, 900, 700);
                return (
                  <article className="product-card reveal-up" style={{ animationDelay: `${index * 80}ms` }} key={getProductKey(product)}>
                    <div className="product-media">
                      <img src={imageUrl} alt={product.name} />
                    </div>
                    <div className="product-body">
                      <span className="product-badge">Showcase</span>
                      <h3 className="product-title">{product.name}</h3>
                      {product.description && <p className="product-description">{product.description}</p>}
                      <div className="product-footer">
                        <p className="price">{product.price != null ? `From LKR ${product.price.toLocaleString()}` : 'Contact for details'}</p>
                        <a className="text-link" href={contactHref} target={contactHref.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                          Ask more
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {!hasProducts && (
        <section className="section showcase-section">
          <div className="container preview-grid">
            {['Brand promise', 'Product details', 'Service highlights'].map((label, index) => (
              <article className="preview-card reveal-up" style={{ animationDelay: `${index * 80}ms` }} key={label}>
                <img src={index === 0 ? showcaseImage : getFallbackPhoto(`${photoQuery}+brand`, 700, 560)} alt={`${sector} ${label}`} />
                <div>
                  <span>{label}</span>
                  <p>The owner can add products, photos, or service details later and this area will become a real showcase.</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section id="contact" className="section contact-section">
        <div className="container contact-grid">
          <div className="contact-panel reveal-up">
            <p className="section-kicker">Contact</p>
            <h2>Start a conversation with {data.businessName}.</h2>
            <p className="section-lede">{marketingText}</p>

            <div className="contact-links">
              {data.phone && (
                <a className="contact-link" href={`tel:${data.phone}`}>
                  <span>Phone</span>
                  <strong>{data.phone}</strong>
                </a>
              )}
              {data.contactEmail && (
                <a className="contact-link" href={`mailto:${data.contactEmail}`}>
                  <span>Email</span>
                  <strong>{data.contactEmail}</strong>
                </a>
              )}
              <a className="contact-link" href={mapsUrl} target="_blank" rel="noreferrer">
                <span>Location</span>
                <strong>Open directions</strong>
              </a>
            </div>

            {data.socialLinks && data.socialLinks.length > 0 && (
              <div className="social-row">
                {data.socialLinks.map((link) => (
                  <a className="social-link" href={link.url} key={`${link.platform}-${link.url}`} target="_blank" rel="noreferrer">
                    <span>{getSocialIcon(link.platform)}</span>
                    {getSocialLabel(link.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>

          <aside className="hours-panel reveal-up delay-1">
            <img src={showcaseImage} alt={`${data.businessName} visual`} />
            <div className="hours-body">
              <span>Availability</span>
              <h3>{data.workingDays || 'Contact for availability'}</h3>
              <p>
                {data.businessHoursOpen && data.businessHoursClose
                  ? `${data.businessHoursOpen} - ${data.businessHoursClose}`
                  : 'Use the contact options to confirm availability and ask for the latest details.'}
              </p>
              <a className="button button-primary" href={contactHref} target={contactHref.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                Message now
              </a>
            </div>
          </aside>
        </div>
      </section>

      <footer>
        <div className="container">
          © {COPYRIGHT_YEAR} {data.businessName} · Powered by BuildBusinessLK
        </div>
      </footer>
    </main>
  );
}
