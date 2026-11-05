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
              <div className="brand-icon">🏬</div>
              <div>
                Dr. Mia Store
                <span style={{ display: "block", fontSize: "0.68rem", color: "var(--accent)", fontWeight: 700 }}>
                  ONLINE SHOPPING
                </span>
              </div>
            </Link>

            <nav>
              <ul className="nav-links">
                <li>
                  <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
                    Shop
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
                <li>
                  <Link
                    href="/vendor/dashboard"
                    className={`nav-link ${pathname.startsWith("/vendor") ? "active" : ""}`}
                  >
                    Vendor
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin"
                    className={`nav-link ${pathname.startsWith("/admin") ? "active" : ""}`}
                  >
                    Admin
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="nav-actions">
              <button
                onClick={() => openAuthModal()}
                className="btn-secondary"
                style={{ padding: "8px 14px", fontSize: "0.82rem" }}
              >
                👤 {currentUser ? currentUser.role.toUpperCase() : "Sign In"}
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
          <div className="footer-inner">
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.15rem", color: "var(--primary)" }}>
                Dr. Mia Store
              </div>
              <p style={{ fontSize: "0.85rem", marginTop: "4px" }}>
                Buy from verified local shops in Kisii (Mwembe, Milimani) and across Kenya with Escrow protection.
              </p>
            </div>
            <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.88rem", fontWeight: 600 }}>
              <Link href="/">Shop</Link>
              <Link href="/buyer/orders">Orders</Link>
              <Link href="/vendor/dashboard">Vendor</Link>
              <Link href="/admin">Admin</Link>
            </div>
          </div>
          <div
            style={{
              marginTop: "1.5rem",
              textAlign: "center",
              fontSize: "0.78rem",
              borderTop: "1px solid var(--border)",
              paddingTop: "1rem",
              color: "var(--text-muted)",
            }}
          >
            &copy; {new Date().getFullYear()} Dr. Mia Store. All rights reserved.
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
        <title>Dr. Mia Store | Safe Online Shopping</title>
        <meta
          name="description"
          content="Dr. Mia Store - Safe Escrow protected shopping from local shops in Kenya."
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
