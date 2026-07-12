"use client";

import type { CSSProperties } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
  intentMessage?: string;
}

const DEFAULT_PRIMARY = '#FF6B35';
const DEFAULT_SECONDARY = '#F59E0B';
const HOME_HERO_IMAGE = '/brand-home-bg.png';

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

function hasText(value?: string | null) {
  return Boolean(value && value.trim());
}

function pickText(...values: (string | undefined | null)[]) {
  for (const value of values) {
    if (hasText(value)) return value!.trim();
  }
  return '';
}

type IconName =
  | 'facebook'
  | 'instagram'
  | 'whatsapp'
  | 'tiktok'
  | 'link'
  | 'phone'
  | 'mail'
  | 'pin'
  | 'menu'
  | 'close'
  | 'arrow'
  | 'clock'
  | 'star'
  | 'shield'
  | 'spark'
  | 'chevron-up';

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
    case 'clock':
      return (
        <svg {...common} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" />
        </svg>
      );
    case 'star':
      return (
        <svg {...common} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
          <path d="m12 4.5 2.1 4.3 4.7.7-3.4 3.3.8 4.7L12 15.8l-4.2 2.2.8-4.7-3.4-3.3 4.7-.7L12 4.5Z" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M12 3.5 5 6.5v5.8c0 4.2 3 7.9 7 8.7 4-.8 7-4.5 7-8.7V6.5l-7-3Z" />
          <path d="m9.5 12 1.8 1.8L15.5 9.5" />
        </svg>
      );
    case 'spark':
      return (
        <svg {...common} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
        </svg>
      );
    case 'chevron-up':
      return (
        <svg {...common} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 14l6-6 6 6" />
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

function useReveal() {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function RevealSection({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <section ref={ref} id={id} className={`${className}${visible ? ' is-visible' : ''}`}>
      {children}
    </section>
  );
}

function MotifPlate({
  motif,
  label,
  sublabel,
  compact,
  animated,
}: {
  motif: MotifId;
  label: string;
  sublabel?: string;
  compact?: boolean;
  animated?: boolean;
}) {
  return (
    <div
      className={`motif-plate${compact ? ' motif-plate--compact' : ''}${animated ? ' motif-plate--animated' : ''}`}
      style={motifBackground(motif)}
      role="img"
      aria-label={sublabel ? `${label} — ${sublabel}` : label}
    >
      <span className="motif-plate-mark">{label}</span>
      {sublabel && <span className="motif-plate-sub">{sublabel}</span>}
    </div>
  );
}

function SmartImage({
  src,
  alt,
  motif,
  label,
  compact,
  className = '',
}: {
  src?: string;
  alt: string;
  motif: MotifId;
  label: string;
  compact?: boolean;
  className?: string;
}) {
  const [state, setState] = useState<'loading' | 'loaded' | 'failed'>('loading');
  const trimmedSrc = src?.trim();

  useEffect(() => {
    setState(trimmedSrc ? 'loading' : 'failed');
  }, [trimmedSrc]);

  if (!trimmedSrc || state === 'failed') {
    return <MotifPlate motif={motif} label={label} compact={compact} animated={!compact} />;
  }

  return (
    <div className={`smart-image${className ? ` ${className}` : ''}`}>
      {state === 'loading' && <div className="smart-image-skeleton" aria-hidden="true" />}
      <img
        src={trimmedSrc}
        alt={alt}
        className={state === 'loaded' ? 'is-loaded' : 'is-loading'}
        onLoad={() => setState('loaded')}
        onError={() => setState('failed')}
      />
    </div>
  );
}

function HeroBackdrop({ motif }: { motif: MotifId }) {
  return (
    <div className="hero-backdrop" aria-hidden="true">
      <div className="hero-home-image" style={{ backgroundImage: `url("${HOME_HERO_IMAGE}")` }} />
      <div className={`hero-motif hero-motif--${motif}`} />
    </div>
  );
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
  const [showTop, setShowTop] = useState(false);

  const mapsUrl =
    data.googleMapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${data.businessName} ${sector} Sri Lanka`)}`;

  const heroText = pickText(
    data.heroText,
    data.businessDescription,
    `Welcome to ${data.businessName} — a trusted ${cleanSector(data.sector)} brand serving customers across Sri Lanka.`,
  );

  const aboutText = pickText(
    data.aboutText,
    data.businessDescription,
    `${data.businessName} is a growing local brand focused on quality, friendly service, and making it easy for customers to discover what we offer and get in touch.`,
  );

  const marketingText = pickText(
    data.marketingText,
    'Reach out to check availability, ask a question, or place an inquiry — we respond quickly.',
  );

  const marketText = pickText(data.targetMarket, `Serving ${sector.toLowerCase()} customers near you`);

  const hoursLabel =
    data.businessHoursOpen && data.businessHoursClose
      ? `${data.businessHoursOpen} – ${data.businessHoursClose}`
      : 'Message us to confirm hours';

  const workingDaysLabel = pickText(data.workingDays, 'Contact for availability');

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

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const trackClick = async (eventType: 'whatsapp_click' | 'directions_click', url: string, isBlank: boolean) => {
    try {
      const base = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8083').replace(/\/$/, '');
      await fetch(`${base}/api/public/business/${encodeURIComponent(data.websiteSlug || '')}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType }),
      });
    } catch (e) {
      console.error('Click tracking failed', e);
    } finally {
      if (url && url !== '#') {
        if (isBlank) {
          window.open(url, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = url;
        }
      }
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, eventType?: 'whatsapp_click' | 'directions_click') => {
    const href = e.currentTarget.href;
    const target = e.currentTarget.target;
    
    let resolvedType = eventType;
    if (!resolvedType) {
      if (href.includes('wa.me')) resolvedType = 'whatsapp_click';
      else if (href.includes('google.com/maps') || href.includes('maps.google')) resolvedType = 'directions_click';
    }

    if (resolvedType) {
      e.preventDefault();
      trackClick(resolvedType, href, target === '_blank');
    }
  };

  const defaultIntentMessage = 'Hello, I would like to inquire about your products';
  const whatsappText = data.intentMessage?.trim() || defaultIntentMessage;

  const contactHref = data.phone
    ? `https://wa.me/${formatPhoneNumber(data.phone)}?text=${encodeURIComponent(whatsappText)}`
    : data.contactEmail
      ? `mailto:${data.contactEmail}?subject=${encodeURIComponent(`Inquiry for ${data.businessName}`)}`
      : '#contact';

  const hasDirectContact = Boolean(data.phone || data.contactEmail);
  const hasSocial = Boolean(data.socialLinks && data.socialLinks.length > 0);

  const shellStyle = {
    '--primary': primary,
    '--secondary': secondary,
  } as CSSProperties;

  const navSections = [
    { href: '#story', label: 'Story' },
    ...(hasProducts ? [{ href: '#showcase', label: 'Showcase' }] : []),
    { href: '#contact', label: 'Contact' },
  ];

  const trustStats = [
    { icon: 'spark' as IconName, label: 'Sector', value: sector },
    {
      icon: 'clock' as IconName,
      label: 'Hours',
      value: data.businessHoursOpen && data.businessHoursClose ? hoursLabel : 'Flexible',
    },
    {
      icon: 'star' as IconName,
      label: 'Showcase',
      value: hasProducts ? `${products.length} item${products.length === 1 ? '' : 's'}` : 'Coming soon',
    },
    {
      icon: 'shield' as IconName,
      label: 'Status',
      value: status.isOpen ? 'Open for inquiries' : 'Closed now',
    },
  ];

  const highlights = [
    {
      icon: 'star' as IconName,
      title: 'Local & trusted',
      text: `${data.businessName} is built around quality service in the ${sector.toLowerCase()} space.`,
    },
    {
      icon: 'shield' as IconName,
      title: 'Easy to reach',
      text: hasDirectContact
        ? 'Call, message, or email — pick whichever works best for you.'
        : 'Find us on the map and send a message when you are ready.',
    },
    {
      icon: 'spark' as IconName,
      title: hasProducts ? 'Browse the showcase' : 'More coming soon',
      text: hasProducts
        ? 'See highlighted products and services before you get in touch.'
        : 'New products and photos can be added anytime as the business grows.',
    },
  ];

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <main className="site-shell" style={shellStyle}>
      <nav className={`nav${navOpen ? ' nav-open' : ''}`}>
        <div className="container nav-inner">
          <a className="brand" href="#home" aria-label={`${data.businessName} home`} onClick={() => setNavOpen(false)}>
            <span className="brand-mark">
              {data.logoUrl ? (
                <SmartImage src={data.logoUrl} alt="" motif={motif} label={initials} compact />
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
            <a className="nav-cta" href={contactHref} target={contactHref.startsWith('http') ? '_blank' : undefined} rel="noreferrer" onClick={handleLinkClick}>
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
              onClick={(e) => {
                setNavOpen(false);
                handleLinkClick(e);
              }}
            >
              Get in touch
            </a>
          </div>
        )}
      </nav>

      <header id="home" className="hero">
        <HeroBackdrop motif={motif} />
        <div className="container hero-grid">
          <div className="hero-copy-block reveal-on-load">
            <p className="eyebrow">
              <span className={status.isOpen ? 'status-dot' : 'status-dot closed'} />
              {status.text}
            </p>
            <p className="section-kicker">{sector}</p>
            <h1>{data.businessName}</h1>
            <p className="hero-copy">{heroText}</p>
            <div className="hero-actions">
              <a className="button button-primary" href={contactHref} target={contactHref.startsWith('http') ? '_blank' : undefined} rel="noreferrer" onClick={handleLinkClick}>
                Contact the brand
                <Icon name="arrow" />
              </a>
              {hasProducts ? (
                <a className="button button-secondary" href="#showcase">
                  View showcase
                </a>
              ) : (
                <a className="button button-secondary" href="#story">
                  Our story
                </a>
              )}
            </div>
            <div className="hero-meta-row" aria-label="Business highlights">
              <span>{marketText}</span>
              <span>{hoursLabel}</span>
            </div>
          </div>

          
        </div>
        <a className="hero-scroll-cue" href="#story" aria-label="Scroll to story">
          <span />
        </a>
      </header>

      <div className="trust-bar">
        <div className="container trust-bar-grid">
          {trustStats.map((item) => (
            <div className="trust-stat" key={item.label}>
              <span className="trust-stat-icon">
                <Icon name={item.icon} />
              </span>
              <span className="trust-stat-copy">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>

      <RevealSection id="story" className="section story-section reveal-section">
        <div className="container story-grid">
          <div className="story-copy">
            <p className="section-kicker">Brand story</p>
            <h2>The story behind {data.businessName}.</h2>
            <p>{aboutText}</p>
          </div>
          <div className="story-notes">
            {highlights.map((item) => (
              <article key={item.title}>
                <span className="story-note-icon">
                  <Icon name={item.icon} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection className="section cta-band reveal-section">
        <div className="container cta-band-inner">
          <div className="cta-band-copy">
            <p className="section-kicker">Ready when you are</p>
            <h2>Questions, orders, or directions — we make it simple.</h2>
            <p>{marketingText}</p>
          </div>
          <div className="cta-band-actions">
            <a className="button button-primary button-light" href={contactHref} target={contactHref.startsWith('http') ? '_blank' : undefined} rel="noreferrer" onClick={handleLinkClick}>
              {data.phone ? 'Message on WhatsApp' : data.contactEmail ? 'Send an email' : 'Go to contact'}
              <Icon name="arrow" />
            </a>
            {data.googleMapsUrl && (
              <a className="button button-ghost" href={mapsUrl} target="_blank" rel="noreferrer" onClick={(e) => handleLinkClick(e, 'directions_click')}>
                <Icon name="pin" />
                Get directions
              </a>
            )}
          </div>
        </div>
      </RevealSection>

      {hasProducts ? (
        <RevealSection id="showcase" className="section showcase-section reveal-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Product showcase</p>
                <h2>What {data.businessName} wants you to notice.</h2>
                <p className="section-lede">Highlighted products and services — contact us for availability and details.</p>
              </div>
              <div className="section-summary-pill">
                {products.length} item{products.length === 1 ? '' : 's'}
              </div>
            </div>

            <div className="product-grid">
              {products.map((product) => (
                <article className="product-card" key={getProductKey(product)}>
                  <div className="product-media">
                    <SmartImage
                      src={product.imageUrl}
                      alt={product.name}
                      motif={motif}
                      label={getInitials(product.name)}
                    />
                  </div>
                  <div className="product-body">
                    <span className="product-badge">Showcase</span>
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-description">
                      {pickText(product.description, 'Contact us for full details about this item.')}
                    </p>
                    <div className="product-footer">
                      <p className="price">
                        {product.price != null ? `From LKR ${product.price.toLocaleString()}` : 'Price on request'}
                      </p>
                      <a className="text-link" href={contactHref} target={contactHref.startsWith('http') ? '_blank' : undefined} rel="noreferrer" onClick={handleLinkClick}>
                        Ask more <Icon name="arrow" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </RevealSection>
      ) : (
        <RevealSection className="section showcase-section reveal-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Product showcase</p>
                <h2>Our range is growing.</h2>
                <p className="section-lede">
                  Products and services will appear here once added — until then, reach out and we will share what is available.
                </p>
              </div>
            </div>
            <div className="preview-grid">
              {['Featured item', 'Seasonal offer', 'Customer favourite'].map((label) => (
                <article className="preview-card preview-card--empty" key={label}>
                  <div className="preview-media">
                    <MotifPlate motif={motif} label={initials} sublabel={label} animated />
                  </div>
                  <div>
                    <span>{label}</span>
                    <p>Photo and details coming soon — message us to learn what is in stock today.</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </RevealSection>
      )}

      <RevealSection id="contact" className="section contact-section reveal-section">
        <div className="container contact-grid">
          <div className="contact-panel">
            <p className="section-kicker">Contact</p>
            <h2>Start a conversation with {data.businessName}.</h2>
            <p className="section-lede">{marketingText}</p>

            <div className="contact-links">
              {data.phone && (
                <a className="contact-link" href={`tel:${data.phone}`}>
                  <span className="contact-link-icon">
                    <Icon name="phone" />
                  </span>
                  <span className="contact-link-text">
                    <span>Phone</span>
                    <strong>{data.phone}</strong>
                  </span>
                </a>
              )}

              {data.contactEmail && (
                <a className="contact-link" href={`mailto:${data.contactEmail}`}>
                  <span className="contact-link-icon">
                    <Icon name="mail" />
                  </span>
                  <span className="contact-link-text">
                    <span>Email</span>
                    <strong>{data.contactEmail}</strong>
                  </span>
                </a>
              )}

              {data.googleMapsUrl && (
                <a className="contact-link" href={mapsUrl} target="_blank" rel="noreferrer" onClick={(e) => handleLinkClick(e, 'directions_click')}>
                  <span className="contact-link-icon">
                    <Icon name="pin" />
                  </span>
                  <span className="contact-link-text">
                    <span>Location</span>
                    <strong>Get directions on Google Maps</strong>
                  </span>
                </a>
              )}
            </div>

            {hasSocial && (
              <div className="social-row">
                {data.socialLinks!.map((link) => (
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
              <h3>{workingDaysLabel}</h3>
              <p>{hoursLabel}</p>
              <p className={`hours-status${status.isOpen ? '' : ' hours-status--closed'}`}>
                <span className={status.isOpen ? 'status-dot' : 'status-dot closed'} />
                {status.text}
              </p>
              <a className="button button-primary" href={contactHref} target={contactHref.startsWith('http') ? '_blank' : undefined} rel="noreferrer" onClick={handleLinkClick}>
                Message now
                <Icon name="arrow" />
              </a>
            </div>
          </aside>
        </div>
      </RevealSection>

      <footer>
        <div className="container footer-inner">
          <div className="footer-brand">
            <span className="footer-mark">{initials}</span>
            <div>
              <strong>{data.businessName}</strong>
              <span>{sector} · Sri Lanka</span>
            </div>
          </div>
          <nav className="footer-nav" aria-label="Footer">
            {navSections.map((section) => (
              <a key={section.href} href={section.href}>
                {section.label}
              </a>
            ))}
          </nav>
          <p className="footer-meta">© {new Date().getFullYear()} {data.businessName} · Powered by BuildBusinessLK</p>
        </div>
      </footer>

      {hasDirectContact && (
        <a
          className="fab-contact"
          href={contactHref}
          target={contactHref.startsWith('http') ? '_blank' : undefined}
          rel="noreferrer"
          aria-label={data.phone ? 'Message on WhatsApp' : 'Send email'}
          onClick={handleLinkClick}
        >
          <Icon name={data.phone ? 'whatsapp' : 'mail'} />
        </a>
      )}

      <button type="button" className={`scroll-top${showTop ? ' is-visible' : ''}`} onClick={scrollToTop} aria-label="Back to top">
        <Icon name="chevron-up" />
      </button>
    </main>
  );
}
