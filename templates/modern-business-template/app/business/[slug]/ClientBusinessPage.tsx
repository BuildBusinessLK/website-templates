"use client";

import { useState } from 'react';

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

interface CartItem {
  product: Product;
  quantity: number;
}

function getSocialIcon(platform: string) {
  const normalized = platform.toLowerCase();
  if (normalized.includes('facebook')) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" style={{ display: 'block' }}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    );
  }
  if (normalized.includes('instagram')) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    );
  }
  if (normalized.includes('whatsapp')) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366" style={{ display: 'block' }}>
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.579 1.966 14.11 .94 11.487.94c-5.437 0-9.866 4.372-9.87 9.802 0 1.972.518 3.9 1.502 5.617L2.08 20.6l4.567-1.446zm11.378-6.195c-.297-.15-1.758-.867-2.03-.967-.273-.099-.471-.15-.669.15-.198.297-.767.967-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.568-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

export default function ClientBusinessPage({ data }: { data: BusinessData }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const getProductKey = (p: Product) => p.id?.toString() ?? p.name;

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const key = getProductKey(product);
      const existing = prev.find((item) => getProductKey(item.product) === key);
      if (existing) {
        return prev.map((item) =>
          getProductKey(item.product) === key
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (product: Product, delta: number) => {
    const key = getProductKey(product);
    setCart((prev) => {
      return prev
        .map((item) => {
          if (getProductKey(item.product) === key) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (product: Product) => {
    const key = getProductKey(product);
    setCart((prev) => prev.filter((item) => getProductKey(item.product) !== key));
  };

  const handleCheckout = () => {
    const businessName = data.businessName || 'Business';
    let message = `Hello! I would like to place an order from ${businessName} via BuildBusinessLK:\n\n`;

    cart.forEach((item, index) => {
      const priceStr =
        item.product.price != null
          ? ` (LKR ${item.product.price.toLocaleString()} each)`
          : '';
      message += `${index + 1}. ${item.product.name} x${item.quantity}${priceStr}\n`;
    });

    const total = cart.reduce(
      (sum, item) => sum + (item.product.price || 0) * item.quantity,
      0
    );
    message += `\nTotal: LKR ${total.toLocaleString()}\n\nPlease confirm my order.`;

    const encodedMessage = encodeURIComponent(message);

    if (data.phone) {
      let cleanPhone = data.phone.replace(/[^\d+]/g, '');
      if (!cleanPhone.startsWith('+')) {
        if (cleanPhone.startsWith('0')) {
          cleanPhone = '+94' + cleanPhone.substring(1);
        } else {
          cleanPhone = '+94' + cleanPhone;
        }
      }
      window.open(
        `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodedMessage}`,
        '_blank'
      );
    } else if (data.contactEmail) {
      window.open(
        `mailto:${data.contactEmail}?subject=New Order from ${encodeURIComponent(
          businessName
        )}&body=${encodedMessage}`,
        '_blank'
      );
    } else {
      alert(
        `Thank you for your order!\n\nNo contact information available to submit order automatically.\n\nOrder summary:\n${message}`
      );
    }
  };

  const primary = data.primaryColor || '#15803d';
  const secondary = data.secondaryColor || '#ca8a04';
  const font = `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`;

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main
      id="home"
      style={{
        minHeight: '100vh',
        background: '#f8fafc', // Premium off-white base
        color: '#1e293b', // Slate-800 text
        fontFamily: font,
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      <style>{`
        @keyframes bounce-scale {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .cart-badge-bounce {
          animation: bounce-scale 0.3s ease-out;
        }
        .pulse-floating-cart {
          animation: bounce-scale 0.4s ease-out, pulse-ring 2s infinite;
        }
        .nav-link {
          color: #475569;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          transition: color 0.2s ease;
        }
        .nav-link:hover {
          color: ${primary};
        }
      `}</style>

      {/* Navbar */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'rgba(255, 255, 255, 0.85)', // Light glassmorphism
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          padding: '16px 24px',
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
              color: '#0f172a',
              fontWeight: 800,
              fontSize: '1.1rem',
              letterSpacing: '-0.02em',
            }}
          >
            {data.businessName || 'Business'}
          </a>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <a href="#home" className="nav-link">
              Home
            </a>
            <a href="#products" className="nav-link">
              Products
            </a>
            <a href="#about" className="nav-link">
              About us
            </a>
            <a href="#contact" className="nav-link" style={{ marginRight: 8 }}>
              Contact us
            </a>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                background: 'rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                color: '#0f172a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 18px',
                borderRadius: 999,
                fontWeight: 700,
                fontSize: '0.85rem',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)';
              }}
            >
              <span>🛒</span>
              <span>Cart</span>
              {totalCartCount > 0 && (
                <span
                  key={totalCartCount}
                  className="cart-badge-bounce"
                  style={{
                    background: secondary,
                    color: '#fff',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  }}
                >
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Cover image */}
      {data.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.coverImageUrl}
          alt=""
          style={{
            width: '100%',
            height: 320,
            objectFit: 'cover',
            display: 'block',
          }}
        />
      )}

      {/* Hero section */}
      <header
        style={{
          background: `linear-gradient(135deg, ${primary}dd, ${primary})`,
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
              <div
                style={{
                  display: 'flex',
                  gap: 20,
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {data.logoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.logoUrl}
                    alt={data.businessName}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 16,
                      objectFit: 'cover',
                      border: '3px solid rgba(255,255,255,0.4)',
                    }}
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
                      color: 'rgba(255,255,255,0.85)',
                    }}
                  >
                    {data.sector} · Sri Lanka
                  </p>
                  <h1
                    style={{
                      margin: 0,
                      fontWeight: 900,
                      fontSize: 'clamp(2rem, 4vw, 4rem)',
                      lineHeight: 1.05,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {data.businessName}
                  </h1>
                </div>
              </div>

              {data.heroText && (
                <p
                  style={{
                    maxWidth: 680,
                    lineHeight: 1.7,
                    marginTop: 28,
                    fontSize: '1.15rem',
                    opacity: 0.95,
                    borderLeft: '4px solid rgba(255,255,255,0.4)',
                    paddingLeft: 18,
                  }}
                >
                  {data.heroText}
                </p>
              )}

              {/* Call-to-action */}
              {(data.contactEmail || data.phone) && (
                <a
                  href="#contact"
                  style={{
                    display: 'inline-block',
                    marginTop: 28,
                    padding: '12px 30px',
                    background: secondary,
                    color: '#fff',
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
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
                  borderRadius: 24,
                  boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Body Content */}
      <div
        style={{ maxWidth: 920, margin: '0 auto', padding: '56px 24px 80px' }}
      >
        {/* Products */}
        {data.products && data.products.length > 0 && (
          <section id="products" style={{ marginBottom: 64 }}>
            <h2
              style={{
                fontSize: '1.6rem',
                fontWeight: 900,
                color: '#0f172a',
                marginBottom: 28,
                paddingBottom: 10,
                borderBottom: `3px solid ${primary}`,
                display: 'inline-block',
                letterSpacing: '-0.02em',
              }}
            >
              Our products
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 28,
                alignItems: 'stretch',
              }}
            >
              {data.products.map((p) => {
                const pKey = getProductKey(p);
                const cartItem = cart.find(
                  (item) => getProductKey(item.product) === pKey
                );

                return (
                  <article
                    key={pKey}
                    style={{
                      background: '#ffffff', // Clean white background for cards
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      borderRadius: 20,
                      overflow: 'hidden',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.12)';
                      e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.05)';
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.03)';
                    }}
                  >
                    <div style={{ padding: '20px 20px 14px' }}>
                      <h3
                        style={{
                          margin: 0,
                          fontWeight: 800,
                          color: '#0f172a',
                          fontSize: '1.05rem',
                        }}
                      >
                        {p.name}
                      </h3>
                    </div>
                    {p.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        style={{
                          width: '100%',
                          height: 220,
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: 220,
                          background: '#f1f5f9', // Light placeholder base
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#64748b',
                          fontSize: '0.95rem',
                        }}
                      >
                        No image available
                      </div>
                    )}
                    <div style={{ padding: '18px 20px', marginTop: 'auto' }}>
                      {p.description && (
                        <p
                          style={{
                            margin: '0 0 16px',
                            color: '#475569', // Slate-600
                            fontSize: '0.95rem',
                            lineHeight: 1.6,
                          }}
                        >
                          {p.description}
                        </p>
                      )}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 12,
                          marginTop: 'auto',
                        }}
                      >
                        {p.price != null && (
                          <p
                            style={{
                              margin: 0,
                              fontWeight: 800,
                              fontSize: '1.1rem',
                              color: secondary,
                            }}
                          >
                            LKR {p.price.toLocaleString()}
                          </p>
                        )}

                        {/* Interactive cart button or quantity editor */}
                        {cartItem ? (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              background: 'rgba(0, 0, 0, 0.05)',
                              borderRadius: 999,
                              border: '1px solid rgba(0, 0, 0, 0.08)',
                              overflow: 'hidden',
                            }}
                          >
                            <button
                              onClick={() => updateQuantity(p, -1)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#0f172a',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '0.95rem',
                              }}
                            >
                              -
                            </button>
                            <span
                              style={{
                                minWidth: 20,
                                textAlign: 'center',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                color: '#0f172a',
                              }}
                            >
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(p, 1)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#0f172a',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '0.95rem',
                              }}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(p)}
                            style={{
                              background: secondary,
                              color: '#fff',
                              border: 'none',
                              borderRadius: 999,
                              padding: '8px 18px',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow =
                                '0 6px 14px rgba(0,0,0,0.18)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow =
                                '0 4px 10px rgba(0,0,0,0.1)';
                            }}
                          >
                            🛒 Add
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* About */}
        {data.aboutText && (
          <section id="about" style={{ marginBottom: 64 }}>
            <h2
              style={{
                fontSize: '1.6rem',
                fontWeight: 900,
                color: '#0f172a',
                marginBottom: 18,
                paddingBottom: 10,
                borderBottom: `3px solid ${secondary}`,
                display: 'inline-block',
                letterSpacing: '-0.02em',
              }}
            >
              About us
            </h2>
            <p
              style={{
                whiteSpace: 'pre-wrap',
                color: '#334155', // Slate-700
                lineHeight: 1.8,
                fontSize: '1.05rem',
                maxWidth: 740,
              }}
            >
              {data.aboutText}
            </p>
          </section>
        )}

        {/* Contact card */}
        <section
          id="contact"
          style={{
            background: '#ffffff', // Clean white background for contact card
            border: '1px solid rgba(0, 0, 0, 0.05)',
            borderRadius: 20,
            padding: '36px 40px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
          }}
        >
          <h2
            style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              color: '#0f172a',
              marginTop: 0,
              marginBottom: 24,
              letterSpacing: '-0.02em',
            }}
          >
            Contact us
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.contactEmail && (
              <p style={{ margin: 0, color: '#475569', fontSize: '1rem' }}>
                📧{' '}
                <a
                  href={`mailto:${data.contactEmail}`}
                  style={{ color: secondary, fontWeight: 600, textDecoration: 'none' }}
                >
                  {data.contactEmail}
                </a>
              </p>
            )}
            {data.phone && (
              <p style={{ margin: 0, color: '#475569', fontSize: '1rem' }}>
                📞{' '}
                <a
                  href={`tel:${data.phone}`}
                  style={{ color: secondary, fontWeight: 600, textDecoration: 'none' }}
                >
                  {data.phone}
                </a>
              </p>
            )}
          </div>
          {data.socialLinks && data.socialLinks.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                marginTop: 24,
              }}
            >
              {data.socialLinks.map((s) => (
                <a
                  key={s.platform + s.url}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 20px',
                    borderRadius: 999,
                    background: primary + '0c', // Soft tinted background
                    color: primary,
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    border: `1px solid ${primary}20`,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = primary + '18';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = primary + '0c';
                  }}
                >
                  <span>{getSocialIcon(s.platform)}</span>
                  <span>{s.platform}</span>
                </a>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Floating Cart (Bottom Right) */}
      {totalCartCount > 0 && !isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="pulse-floating-cart"
          style={{
            position: 'fixed',
            bottom: 28,
            right: 28,
            zIndex: 49,
            background: secondary,
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 60,
            height: 60,
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(239, 68, 68, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          🛒
          <span
            style={{
              background: '#ef4444',
              color: '#fff',
              borderRadius: '50%',
              width: 22,
              height: 22,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              position: 'absolute',
              top: -2,
              right: -2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {totalCartCount}
          </span>
        </button>
      )}

      {/* Sliding Cart Drawer (Light Mode) */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: 420,
          background: 'rgba(255, 255, 255, 0.98)', // Clean white glass
          backdropFilter: 'blur(30px)',
          borderLeft: '1px solid rgba(0, 0, 0, 0.08)',
          zIndex: 100,
          boxShadow: '-12px 0 40px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          color: '#0f172a',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '24px 20px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em',
            }}
          >
            Your Shopping Cart
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '4px 8px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#0f172a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#64748b';
            }}
          >
            ✕
          </button>
        </div>

        {/* Drawer Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {cart.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#64748b',
              }}
            >
              <span style={{ fontSize: '3rem', marginBottom: 16 }}>🛒</span>
              <p style={{ margin: 0, fontSize: '1rem', fontWeight: 500 }}>Your cart is empty</p>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{
                  marginTop: 16,
                  background: 'rgba(0, 0, 0, 0.05)',
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: 999,
                  padding: '10px 24px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                }}
              >
                Back to Store
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {cart.map((item) => {
                const key = getProductKey(item.product);
                return (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      gap: 12,
                      background: 'rgba(0, 0, 0, 0.01)',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      borderRadius: 16,
                      padding: 12,
                    }}
                  >
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        style={{
                          width: 64,
                          height: 64,
                          objectFit: 'cover',
                          borderRadius: 10,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 64,
                          height: 64,
                          background: 'rgba(0, 0, 0, 0.04)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 10,
                          fontSize: '1.25rem',
                        }}
                      >
                        📦
                      </div>
                    )}
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            margin: '0 0 4px',
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            color: '#0f172a',
                            lineHeight: 1.2,
                          }}
                        >
                          {item.product.name}
                        </h4>
                        {item.product.price != null && (
                          <span
                            style={{
                              fontSize: '0.85rem',
                              color: secondary,
                              fontWeight: 600,
                            }}
                          >
                            LKR {item.product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 8,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'rgba(0, 0, 0, 0.05)',
                            borderRadius: 999,
                            overflow: 'hidden',
                          }}
                        >
                          <button
                            onClick={() => updateQuantity(item.product, -1)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#0f172a',
                              padding: '2px 8px',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: 'bold',
                            }}
                          >
                            -
                          </button>
                          <span
                            style={{
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              minWidth: 16,
                              textAlign: 'center',
                              color: '#0f172a',
                            }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product, 1)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#0f172a',
                              padding: '2px 8px',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: 'bold',
                            }}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            transition: 'opacity 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '0.8';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '1';
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div
            style={{
              padding: '24px 20px',
              borderTop: '1px solid rgba(0, 0, 0, 0.06)',
              background: 'rgba(250, 250, 250, 0.95)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 20,
              }}
            >
              <span style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 500 }}>
                Subtotal
              </span>
              <span
                style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a' }}
              >
                LKR{' '}
                {cart
                  .reduce(
                    (sum, item) =>
                      sum + (item.product.price || 0) * item.quantity,
                    0
                  )
                  .toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              style={{
                width: '100%',
                background: `linear-gradient(135deg, ${secondary}, ${secondary}dd)`,
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '14px 20px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(250, 160, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              💬 Checkout via WhatsApp
            </button>

            {!data.phone && (
              <p
                style={{
                  margin: '8px 0 0',
                  fontSize: '0.75rem',
                  color: '#b45309', // Amber-700
                  textAlign: 'center',
                  lineHeight: 1.4,
                }}
              >
                ⚠️ No phone number configured. Checkout will open an email to{' '}
                {data.contactEmail || 'owner'}.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Cart Backdrop overlay */}
      {isCartOpen && (
        <div
          onClick={() => setIsCartOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.2)',
            backdropFilter: 'blur(4px)',
            zIndex: 90,
          }}
        />
      )}

      {/* Footer */}
      <footer
        style={{
          background: primary,
          color: '#fff',
          textAlign: 'center',
          padding: '24px 16px',
          fontSize: '0.85rem',
          opacity: 0.95,
        }}
      >
        <p style={{ margin: 0, fontWeight: 500 }}>
          © {new Date().getFullYear()} {data.businessName} · Powered by{' '}
          <strong>BuildBusinessLK</strong>
        </p>
      </footer>
    </main>
  );
}
