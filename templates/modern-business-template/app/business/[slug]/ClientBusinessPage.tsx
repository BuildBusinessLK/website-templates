"use client";

import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';

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

interface CartItem {
  product: Product;
  quantity: number;
}

const DEFAULT_PRIMARY = '#0f766e';
const DEFAULT_SECONDARY = '#f59e0b';
const COPYRIGHT_YEAR = 2026;

function cleanSector(sector?: string) {
  return (sector || 'Local business').replace(/_/g, ' ').toLowerCase();
}

function titleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getProductKey(product: Product) {
  return product.id?.toString() ?? product.name;
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
    return { isOpen: true, text: 'Contact us anytime' };
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
    return { isOpen: true, text: 'Contact us anytime' };
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
  return 'ln';
}

function getInitials(name?: string) {
  return (name || 'Business')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function ClientBusinessPage({ data }: { data: BusinessData }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const products = data.products || [];
  const hasProducts = products.length > 0;
  const primary = data.primaryColor || DEFAULT_PRIMARY;
  const secondary = data.secondaryColor || DEFAULT_SECONDARY;
  const sector = titleCase(cleanSector(data.sector));
  const [status, setStatus] = useState(() => getInitialOpenStatus(data.businessHoursOpen, data.businessHoursClose));
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);
  const mapsUrl =
    data.googleMapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${data.businessName} ${sector} Sri Lanka`)}`;
  const heroText =
    data.heroText ||
    data.businessDescription ||
    `Discover ${data.businessName}, a Sri Lankan ${cleanSector(data.sector)} bringing dependable products and friendly service to customers.`;
  const aboutText =
    data.aboutText ||
    data.businessDescription ||
    `${data.businessName} is building a trusted local brand with practical service, clear communication, and a growing presence online.`;
  const marketingText =
    data.marketingText ||
    'Message us to ask questions, place an order, or learn what is available today.';

  useEffect(() => {
    setStatus(getOpenStatus(data.businessHoursOpen, data.businessHoursClose, data.workingDays));
  }, [data.businessHoursClose, data.businessHoursOpen, data.workingDays]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const key = getProductKey(product);
      const existing = prev.find((item) => getProductKey(item.product) === key);
      if (existing) {
        return prev.map((item) =>
          getProductKey(item.product) === key ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (product: Product, delta: number) => {
    const key = getProductKey(product);
    setCart((prev) =>
      prev
        .map((item) =>
          getProductKey(item.product) === key
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (product: Product) => {
    const key = getProductKey(product);
    setCart((prev) => prev.filter((item) => getProductKey(item.product) !== key));
  };

  const contactHref = data.phone
    ? `https://wa.me/${formatPhoneNumber(data.phone)}?text=${encodeURIComponent(`Hello ${data.businessName}, I found your website and would like to ask about your products or services.`)}`
    : data.contactEmail
      ? `mailto:${data.contactEmail}?subject=${encodeURIComponent(`Inquiry for ${data.businessName}`)}`
      : '#contact';

  const handleDirectBuy = (product: Product) => {
    const priceText = product.price != null ? ` (LKR ${product.price.toLocaleString()})` : '';
    const message = `Hello ${data.businessName}, I would like to buy ${product.name}${priceText}. Please let me know how to proceed.`;
    if (data.phone) {
      window.open(`https://wa.me/${formatPhoneNumber(data.phone)}?text=${encodeURIComponent(message)}`, '_blank');
      return;
    }
    if (data.contactEmail) {
      window.open(
        `mailto:${data.contactEmail}?subject=${encodeURIComponent(`Order: ${product.name}`)}&body=${encodeURIComponent(message)}`,
        '_blank'
      );
    }
  };

  const handleCheckout = () => {
    const lines = cart.map((item, index) => {
      const price = item.product.price != null ? ` (LKR ${item.product.price.toLocaleString()} each)` : '';
      return `${index + 1}. ${item.product.name} x${item.quantity}${price}`;
    });
    const message = `Hello ${data.businessName}, I would like to place this order:\n\n${lines.join('\n')}\n\nTotal: LKR ${cartTotal.toLocaleString()}\n\nPlease confirm availability.`;
    if (data.phone) {
      window.open(`https://wa.me/${formatPhoneNumber(data.phone)}?text=${encodeURIComponent(message)}`, '_blank');
      return;
    }
    if (data.contactEmail) {
      window.open(
        `mailto:${data.contactEmail}?subject=${encodeURIComponent(`Order for ${data.businessName}`)}&body=${encodeURIComponent(message)}`,
        '_blank'
      );
    }
  };

  const shellStyle = {
    '--primary': primary,
    '--secondary': secondary,
  } as CSSProperties;

  const heroStyle = {
    background: data.coverImageUrl
      ? `linear-gradient(110deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.9) 47%, rgba(255,255,255,0.1) 100%), url("${data.coverImageUrl}")`
      : undefined,
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
            <a href="#about">About</a>
            {hasProducts && <a href="#products">Products</a>}
            <a href="#contact">Contact</a>
            {hasProducts && (
              <button className="nav-cart" type="button" onClick={() => setIsCartOpen(true)}>
                Cart <span className="cart-count">{cartCount}</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <header id="home" className="hero" style={heroStyle}>
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">
              <span className={status.isOpen ? 'status-dot' : 'status-dot closed'} />
              {status.text}
            </p>
            <h1>{data.businessName}</h1>
            <p className="hero-copy">{heroText}</p>
            <div className="hero-actions">
              <a className="button button-primary" href={contactHref} target={contactHref.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                Contact business
              </a>
              {hasProducts && (
                <a className="button button-secondary" href="#products">
                  View products
                </a>
              )}
            </div>
          </div>

          <aside className="hero-card" aria-label="Business summary">
            <div className="hero-card-media">
              {data.coverImageUrl ? (
                <img src={data.coverImageUrl} alt={`${data.businessName} cover`} />
              ) : (
                <div className="hero-card-media-fallback">{getInitials(data.businessName)}</div>
              )}
            </div>
            <div className="hero-card-body">
              <div className="quick-facts">
                <div className="fact">
                  <span className="fact-icon">1</span>
                  <div>
                    <strong>{sector}</strong>
                    <span>Sri Lankan SME profile</span>
                  </div>
                </div>
                <div className="fact">
                  <span className="fact-icon">2</span>
                  <div>
                    <strong>{hasProducts ? `${products.length} product${products.length === 1 ? '' : 's'}` : 'Ready for inquiries'}</strong>
                    <span>{hasProducts ? 'Browse current offers below' : 'Ask about availability, services, and pricing'}</span>
                  </div>
                </div>
                <div className="fact">
                  <span className="fact-icon">3</span>
                  <div>
                    <strong>{data.workingDays || 'Flexible contact'}</strong>
                    <span>{data.businessHoursOpen && data.businessHoursClose ? `${data.businessHoursOpen} - ${data.businessHoursClose}` : 'Message to confirm hours'}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </header>

      <section id="about" className="section">
        <div className="container story-grid">
          <div>
            <p className="section-kicker">About the business</p>
            <h2>Built for customers who want clear, local service.</h2>
            <div className="story-card" style={{ marginTop: 24 }}>
              <p>{aboutText}</p>
            </div>
          </div>
          <aside className="highlight-list">
            <div className="highlight">
              <b>Easy to reach</b>
              <span>{data.phone || data.contactEmail ? 'Contact details are available below.' : 'Contact details can be added by the owner anytime.'}</span>
            </div>
            <div className="highlight">
              <b>Expandable site</b>
              <span>Products, social links, hours, and location appear automatically as the owner adds them.</span>
            </div>
            <div className="highlight">
              <b>Why choose us</b>
              <span>{marketingText}</span>
            </div>
          </aside>
        </div>
      </section>

      {hasProducts && (
        <section id="products" className="section section-alt">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Products</p>
                <h2>Current products and offers</h2>
                <p className="section-lede">Add items to cart or ask about a single product. Orders are sent directly to the business owner.</p>
              </div>
            </div>

            <div className="product-grid">
              {products.map((product) => {
                const key = getProductKey(product);
                const cartItem = cart.find((item) => getProductKey(item.product) === key);
                return (
                  <article className="product-card" key={key}>
                    <div className="product-media">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} />
                      ) : (
                        getInitials(product.name)
                      )}
                    </div>
                    <div className="product-body">
                      <h3 className="product-title">{product.name}</h3>
                      {product.description && <p className="product-description">{product.description}</p>}
                      <div className="product-footer">
                        <p className="price">{product.price != null ? `LKR ${product.price.toLocaleString()}` : 'Ask for price'}</p>
                        {cartItem ? (
                          <span className="quantity">
                            <button type="button" onClick={() => updateQuantity(product, -1)} aria-label={`Remove one ${product.name}`}>-</button>
                            <span>{cartItem.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(product, 1)} aria-label={`Add one ${product.name}`}>+</button>
                          </span>
                        ) : (
                          <button className="tiny-button" type="button" onClick={() => addToCart(product)}>
                            Add to cart
                          </button>
                        )}
                      </div>
                      <button className="tiny-button" type="button" onClick={() => handleDirectBuy(product)} style={{ background: secondary }}>
                        Ask about this
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="section">
        <div className="container contact-grid">
          <div className="contact-panel">
            <p className="section-kicker">Contact</p>
            <h2>Start a conversation with {data.businessName}.</h2>
            <p className="section-lede">{marketingText}</p>

            <div style={{ marginTop: 22 }}>
              {data.phone && (
                <a className="contact-link" href={`tel:${data.phone}`}>
                  <span>Phone</span>
                  <span>{data.phone}</span>
                </a>
              )}
              {data.contactEmail && (
                <a className="contact-link" href={`mailto:${data.contactEmail}`}>
                  <span>Email</span>
                  <span>{data.contactEmail}</span>
                </a>
              )}
              <a className="contact-link" href={mapsUrl} target="_blank" rel="noreferrer">
                <span>Location</span>
                <span>Open directions</span>
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

          <aside className="map-panel">
            <p className="section-kicker">Visit or inquire</p>
            <h3 style={{ margin: '0 0 12px', fontSize: '1.5rem' }}>{data.workingDays || 'Contact for availability'}</h3>
            <p style={{ margin: '0 0 18px', color: '#475569', lineHeight: 1.6 }}>
              {data.businessHoursOpen && data.businessHoursClose
                ? `${data.businessHoursOpen} - ${data.businessHoursClose}`
                : 'The owner can add opening hours later. For now, use the contact options to confirm availability.'}
            </p>
            <a className="button button-primary" href={mapsUrl} target="_blank" rel="noreferrer">
              Get directions
            </a>
          </aside>
        </div>
      </section>

      {isCartOpen && (
        <>
          <div className="drawer-backdrop" onClick={() => setIsCartOpen(false)} />
          <aside className="drawer" aria-label="Shopping cart">
            <div className="drawer-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <strong>Your cart</strong>
              <button className="tiny-button" type="button" onClick={() => setIsCartOpen(false)} style={{ background: '#e2e8f0', color: '#172033' }}>
                Close
              </button>
            </div>
            <div className="drawer-body">
              {cart.length === 0 ? (
                <p style={{ color: '#64748b', margin: 0 }}>Your cart is empty.</p>
              ) : (
                cart.map((item) => (
                  <div className="cart-item" key={getProductKey(item.product)}>
                    {item.product.imageUrl ? (
                      <img className="cart-thumb" src={item.product.imageUrl} alt={item.product.name} />
                    ) : (
                      <div className="cart-thumb">{getInitials(item.product.name)}</div>
                    )}
                    <div>
                      <strong>{item.product.name}</strong>
                      <p style={{ margin: '4px 0 10px', color: '#64748b', fontSize: '0.88rem' }}>
                        {item.product.price != null ? `LKR ${item.product.price.toLocaleString()}` : 'Ask for price'}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                        <span className="quantity">
                          <button type="button" onClick={() => updateQuantity(item.product, -1)}>-</button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.product, 1)}>+</button>
                        </span>
                        <button type="button" onClick={() => removeFromCart(item.product)} style={{ border: 0, background: 'transparent', color: '#dc2626', fontWeight: 800, cursor: 'pointer' }}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="drawer-footer">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontWeight: 950 }}>
                  <span>Estimated total</span>
                  <span>LKR {cartTotal.toLocaleString()}</span>
                </div>
                <button className="button button-primary" type="button" onClick={handleCheckout} style={{ width: '100%' }}>
                  Send order inquiry
                </button>
                {!data.phone && !data.contactEmail && (
                  <p style={{ margin: '12px 0 0', color: '#b45309', fontSize: '0.82rem', lineHeight: 1.5 }}>
                    The owner has not added phone or email details yet.
                  </p>
                )}
              </div>
            )}
          </aside>
        </>
      )}

      <footer>
        <div className="container">
          © {COPYRIGHT_YEAR} {data.businessName} · Powered by BuildBusinessLK
        </div>
      </footer>
    </main>
  );
}
