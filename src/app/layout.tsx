"use client";

import "./globals.css";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getStoredCart, updateCartQuantity, removeFromCart, clearCart } from "../lib/data";
import { CartItem } from "../types";
import { AuthProvider, useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, currentLocation, openAuthModal, logout } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const refreshCart = () => {
    setCart(getStoredCart());
  };

  useEffect(() => {
    refreshCart();
    window.addEventListener("cartUpdated", refreshCart);
    return () => {
      window.removeEventListener("cartUpdated", refreshCart);
    };
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <>
      <AuthModal />

      {/* Top Bar: Escrow & Location */}
      <div
        style={{
          background: "#1e40af",
          color: "white",
          padding: "6px 0",
          fontSize: "0.8rem",
          fontWeight: 600,
        }}
      >
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: "999px", fontSize: "0.72rem" }}>
              🔒 ESCROW
            </span>
            <span>Safe shop pickup with Secret Release Key</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => openAuthModal()}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.4)",
                color: "white",
                padding: "2px 10px",
                borderRadius: "999px",
                cursor: "pointer",
                fontSize: "0.75rem",
                fontWeight: 700,
              }}
            >
              📍 {currentLocation.estate}, {currentLocation.town} (Change)
            </button>

            {currentUser ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    background: currentUser.role === "admin" ? "#f59e0b" : currentUser.role === "vendor" ? "#10b981" : "white",
                    color: currentUser.role === "buyer" ? "#1e40af" : "white",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  {currentUser.role}
                </span>
                <span>{currentUser.name}</span>
                <button
                  onClick={logout}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.8)",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontSize: "0.75rem",
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal()}
                style={{
                  background: "white",
                  color: "#1e40af",
                  border: "none",
                  padding: "3px 10px",
                  borderRadius: "999px",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                }}
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="header">
        <div className="container">
          <div className="nav-inner">
            <Link href="/" className="brand">
              <div className="brand-icon">🔗</div>
              <div>
                SokoLink
                <span style={{ display: "block", fontSize: "0.68rem", color: "var(--accent)", fontWeight: 800, letterSpacing: "0.5px" }}>
                  KENYA ESCROW MARKETPLACE
                </span>
              </div>
            </Link>

            {/* Role-Specific Navigation (Buyer, Vendor, and Admin strictly separated) */}
            <nav>
              <ul className="nav-links">
                <li>
                  <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link
                    href="/buyer/orders"
                    className={`nav-link ${pathname.startsWith("/buyer") ? "active" : ""}`}
                  >
                    My Orders
                  </Link>
                </li>

                {/* Vendor link: ONLY visible when logged in as a Vendor */}
                {currentUser?.role === "vendor" && (
                  <li>
                    <Link
                      href="/vendor/dashboard"
                      className={`nav-link ${pathname.startsWith("/vendor") ? "active" : ""}`}
                      style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }}
                    >
                      🏪 My Stall Dashboard
                    </Link>
                  </li>
                )}

                {/* Admin link: ONLY visible when logged in as Admin (Amos Bosire) */}
                {currentUser?.role === "admin" && (
                  <li>
                    <Link
                      href="/admin"
                      className={`nav-link ${pathname.startsWith("/admin") ? "active" : ""}`}
                      style={{ background: "#eff6ff", color: "#1e40af", border: "1px solid #bfdbfe" }}
                    >
                      🛡️ Admin Console (Amos)
                    </Link>
                  </li>
                )}
              </ul>
            </nav>

            <div className="nav-actions">
              <button
                onClick={() => openAuthModal()}
                className="btn-secondary"
                style={{ padding: "8px 14px", fontSize: "0.82rem" }}
              >
                👤 {currentUser ? `${currentUser.role.toUpperCase()}: ${currentUser.name.split(" ")[0]}` : "Login as"}
              </button>

              <button
                className="btn-cart"
                onClick={() => setIsCartOpen(true)}
                aria-label="View Cart"
              >
                <span>🛒 Cart</span>
                <span className="cart-badge">{totalItems}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main style={{ flex: 1 }}>{children}</main>

      {/* Slide-out Cart Drawer */}
      {isCartOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(4px)",
            zIndex: 100,
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={() => setIsCartOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "100%",
              backgroundColor: "white",
              padding: "1.75rem",
              display: "flex",
              flexDirection: "column",
              boxShadow: "-8px 0 25px rgba(0,0,0,0.1)",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid var(--border)",
                paddingBottom: "1rem",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                Shopping Cart ({totalItems})
              </h3>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                }}
              >
                &times;
              </button>
            </div>

            {cart.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)", flex: 1 }}>
                <div style={{ fontSize: "3rem", marginBottom: "8px" }}>🛒</div>
                <h4 style={{ fontWeight: 700 }}>Your cart is empty</h4>
                <p style={{ fontSize: "0.85rem", marginTop: "4px" }}>
                  Browse our items and add what you need.
                </p>
              </div>
            ) : (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    style={{
                      display: "flex",
                      gap: "12px",
                      padding: "10px",
                      border: "1px solid var(--border)",
                      borderRadius: "14px",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "10px" }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: "0.9rem", fontWeight: 700 }}>
                        {item.product.name}
                      </h4>
                      <p style={{ fontSize: "0.82rem", color: "var(--primary)", fontWeight: 800 }}>
                        KSh {item.product.price.toLocaleString()}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          style={{
                            width: "24px",
                            height: "24px",
                            border: "1px solid var(--border)",
                            borderRadius: "50%",
                            background: "white",
                            fontWeight: 700,
                          }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          style={{
                            width: "24px",
                            height: "24px",
                            border: "1px solid var(--border)",
                            borderRadius: "50%",
                            background: "white",
                            fontWeight: 700,
                          }}
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          style={{
                            marginLeft: "auto",
                            background: "none",
                            border: "none",
                            color: "#ef4444",
                            fontSize: "0.78rem",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", marginTop: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                    fontSize: "1.1rem",
                    fontWeight: 800,
                  }}
                >
                  <span>Subtotal:</span>
                  <span style={{ color: "var(--primary)" }}>KSh {cartSubtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="btn-primary"
                    style={{ padding: "12px", textAlign: "center", fontSize: "0.95rem" }}
                  >
                    Checkout (Escrow Protected) &rarr;
                  </Link>
                  <button
                    onClick={() => clearCart()}
                    className="btn-secondary"
                    style={{ padding: "8px", fontSize: "0.82rem" }}
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "2rem" }}>
            <div style={{ maxWidth: "420px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 900, fontSize: "1.3rem", color: "var(--primary)" }}>
                <span>🔗</span> SokoLink
              </div>
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginTop: "6px", lineHeight: "1.6" }}>
                Kenya’s verified local escrow marketplace. AI matches you with physical stalls in your town or estate (e.g. Mwembe, Kisii). Pay safely with Escrow and pick up with your secret key.
              </p>
            </div>
            
            {/* Buyer Links */}
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text-main)", marginBottom: "8px" }}>
                Buyer Center
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                <Link href="/">Marketplace</Link>
                <Link href="/buyer/orders">Track My Orders</Link>
                <button onClick={() => openAuthModal()} style={{ background: "none", border: "none", color: "var(--primary)", textAlign: "left", cursor: "pointer", fontWeight: 700, padding: 0 }}>
                  Login as Buyer
                </button>
              </div>
            </div>

            {/* Dedicated Portals Section */}
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text-main)", marginBottom: "8px" }}>
                Separate Portals
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.85rem" }}>
                <Link href="/vendor/login" style={{ color: "#166534", fontWeight: 700 }}>
                  🏪 SokoLink Vendor Portal
                </Link>
                <Link href="/vendor/register" style={{ color: "var(--text-muted)" }}>
                  + Register Your Physical Shop
                </Link>
                <Link href="/admin/login" style={{ color: "#1e40af", fontWeight: 700, marginTop: "4px" }}>
                  🛡️ Master Admin Gate (Amos Bosire)
                </Link>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "2rem",
              textAlign: "center",
              fontSize: "0.8rem",
              borderTop: "1px solid var(--border)",
              paddingTop: "1.25rem",
              color: "var(--text-muted)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <div>&copy; {new Date().getFullYear()} SokoLink Kenya. All rights reserved.</div>
            <div style={{ display: "flex", gap: "14px", fontSize: "0.78rem" }}>
              <span>🔒 100% Escrow Protected</span>
              <span>•</span>
              <span>🤖 AI Proximity Engine</span>
              <span>•</span>
              <span>🇰🇪 Made for Kenya</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>SokoLink | Kenya Verified Escrow Marketplace</title>
        <meta
          name="description"
          content="SokoLink - Safe Escrow protected shopping from verified local shop stalls across Kenyan counties, towns and estates."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
