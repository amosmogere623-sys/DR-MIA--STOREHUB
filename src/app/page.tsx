"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredProducts, addToCart, getStoredVendors } from "../lib/data";
import { Product, Vendor } from "../types";
import { useAuth } from "../context/AuthContext";
import { aiMatchBuyerToVendors, aiRankProductsByLocation, AILocationMatchResult } from "../lib/aiLocationMatch";

const CATEGORIES = [
  { label: "All Items", icon: "✨", key: "All" },
  { label: "Bags & Totes", icon: "👜", key: "Bags & Totes" },
  { label: "Pillows & Bedding", icon: "🛏️", key: "Pillows & Bedding" },
  { label: "Plushies & Toys", icon: "🧸", key: "Plushies & Toys" },
  { label: "Care & Beauty", icon: "🌸", key: "Care & Beauty" },
  { label: "Shoes & Clothes", icon: "👟", key: "Shoes & Clothes" },
];

const CATEGORY_THEMES: Record<string, { bg: string; subtitle: string; tag: string }> = {
  "All": {
    bg: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&auto=format&fit=crop&q=80",
    tag: "CURATED KENYAN STORES",
    subtitle: "Discover high quality bags, bedding, plushies, and beauty essentials from verified physical stalls near you. Shop safely with escrow protection.",
  },
  "Bags & Totes": {
    bg: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1400&auto=format&fit=crop&q=80",
    tag: "PREMIUM BAGS & LEATHER",
    subtitle: "Quilted shoulder bags, luxury leather totes, durable travel backpacks, and school bags from verified shops.",
  },
  "Pillows & Bedding": {
    bg: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1400&auto=format&fit=crop&q=80",
    tag: "LUXURY SLEEP & LIVING",
    subtitle: "Deep-sleep micro-fiber pillows, 100% cotton king-size bed sheets, and heavy warm duvets for chilly nights.",
  },
  "Plushies & Toys": {
    bg: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=1400&auto=format&fit=crop&q=80",
    tag: "CUDDLY GIFTS & GAMES",
    subtitle: "Soft velvet teddy bears, giant plush elephants, African wildlife puzzles, and family board games.",
  },
  "Care & Beauty": {
    bg: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1400&auto=format&fit=crop&q=80",
    tag: "NATURAL GLOW & SKINCARE",
    subtitle: "Gentle aloe vera cleansers, rich cocoa butter lotions, brightening turmeric creams, and silk eye masks.",
  },
  "Shoes & Clothes": {
    bg: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1400&auto=format&fit=crop&q=80",
    tag: "FASHION & DAILY COMFORT",
    subtitle: "Thick cushioned foam slides, ladies flat sandals, durable kids school shoes, and lightweight windbreakers.",
  },
};

export default function HomePage() {
  const { currentLocation, openAuthModal } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorMatches, setVendorMatches] = useState<AILocationMatchResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const loadData = () => {
    const rawProds = getStoredProducts();
    const rawVendors = getStoredVendors();
    setVendors(rawVendors);

    // Run AI Location Matchmaker between buyer and vendors
    const matches = aiMatchBuyerToVendors(currentLocation, rawVendors);
    setVendorMatches(matches);

    // Run AI Ranking on products based on proximity & quality
    const aiRanked = aiRankProductsByLocation(currentLocation, rawProds);
    setProducts(aiRanked.map((r) => r.product));
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("productsUpdated", handleUpdate);
    window.addEventListener("vendorsUpdated", handleUpdate);
    window.addEventListener("userLocationChanged", handleUpdate);
    return () => {
      window.removeEventListener("productsUpdated", handleUpdate);
      window.removeEventListener("vendorsUpdated", handleUpdate);
      window.removeEventListener("userLocationChanged", handleUpdate);
    };
  }, [currentLocation]);

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.estate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.town.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedNotice(`Added "${product.name}" to cart!`);
    setTimeout(() => {
      setAddedNotice(null);
    }, 2000);
  };

  const getProximityLabel = (prod: Product) => {
    const isSameEstate = prod.location.estate.toLowerCase() === currentLocation.estate.toLowerCase();
    const isSameTown = prod.location.town.toLowerCase() === currentLocation.town.toLowerCase();

    if (isSameEstate) {
      return { text: `🤖 AI Match: 98% Nearest (${prod.location.estate})`, class: "badge-delivered" };
    }
    if (isSameTown) {
      return { text: `🤖 AI Match: In ${prod.location.town} (${prod.location.estate})`, class: "badge-dispatched" };
    }
    return { text: `📍 ${prod.location.town}, ${prod.location.county}`, class: "badge-pending" };
  };

  const currentTheme = CATEGORY_THEMES[selectedCategory] || CATEGORY_THEMES["All"];

  return (
    <div className="container" style={{ paddingBottom: "4rem" }}>
      {addedNotice && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "white",
            padding: "14px 24px",
            borderRadius: "var(--radius-pill)",
            boxShadow: "0 12px 30px rgba(37, 99, 235, 0.45)",
            zIndex: 9999,
            fontWeight: 800,
            fontSize: "0.92rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>✓</span>
          <span>{addedNotice}</span>
        </div>
      )}

      {/* Dynamic Visual Hero Banner */}
      <section
        style={{
          position: "relative",
          margin: "1.75rem 0 2rem",
          borderRadius: "32px",
          overflow: "hidden",
          minHeight: "420px",
          display: "flex",
          alignItems: "center",
          padding: "clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 4vw, 2.5rem)",
          boxShadow: "0 20px 45px -10px rgba(30, 58, 138, 0.28)",
          backgroundImage: `linear-gradient(135deg, rgba(10, 25, 60, 0.88) 0%, rgba(30, 58, 138, 0.82) 100%), url('${currentTheme.bg}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          border: "4px solid rgba(255, 255, 255, 0.9)",
          transition: "all 0.4s ease-in-out",
        }}
      >
        <div style={{ maxWidth: "680px", position: "relative", zIndex: 2 }}>
          {/* Trust Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 255, 255, 0.18)",
              backdropFilter: "blur(10px)",
              padding: "6px 16px",
              borderRadius: "var(--radius-pill)",
              fontSize: "0.78rem",
              fontWeight: 800,
              letterSpacing: "0.8px",
              marginBottom: "1rem",
              border: "1px solid rgba(255, 255, 255, 0.35)",
            }}
          >
            <span>🔒</span>
            <span>{currentTheme.tag} • SAFE ESCROW PROTECTED</span>
          </div>

          <h1
            style={{
              fontSize: "clamp(1.75rem, 5.5vw, 3rem)",
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: "-1px",
              marginBottom: "1rem",
              textShadow: "0 2px 10px rgba(0,0,0,0.25)",
            }}
          >
            {selectedCategory === "All" ? "SokoLink Marketplace" : selectedCategory}
          </h1>

          <p
            style={{
              fontSize: "1.08rem",
              lineHeight: 1.6,
              color: "#e2e8f0",
              marginBottom: "1.75rem",
              maxWidth: "600px",
            }}
          >
            {currentTheme.subtitle}
          </p>

          {/* Interactive Search Box */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.96)",
              backdropFilter: "blur(12px)",
              padding: "6px 8px 6px 20px",
              borderRadius: "var(--radius-pill)",
              boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
              maxWidth: "520px",
              border: "2px solid rgba(255, 255, 255, 0.8)",
            }}
          >
            <span style={{ fontSize: "1.2rem", color: "var(--primary)", marginRight: "10px" }}>🔍</span>
            <input
              type="text"
              placeholder="Search tote bags, pillows, slides, shops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                fontSize: "0.95rem",
                color: "var(--text-main)",
                fontWeight: 600,
                background: "transparent",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  border: "none",
                  background: "none",
                  color: "var(--text-muted)",
                  padding: "0 8px",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            )}
            <button
              onClick={() => {}}
              className="btn-primary"
              style={{ padding: "8px 20px", fontSize: "0.85rem" }}
            >
              Explore
            </button>
          </div>

          {/* Quick Trending Tags */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "1rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.78rem", color: "#93c5fd", fontWeight: 700 }}>Popular:</span>
            {["Tote Bags", "Comfort Pillows", "Slides", "Teddy Bears", "Skincare"].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  color: "#ffffff",
                  padding: "3px 10px",
                  borderRadius: "999px",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)")}
                onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)")}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4-Card Trust & Escrow Guarantee Ribbon */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
          gap: "1.25rem",
          margin: "0 0 2rem",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1.5px solid #dbeafe",
            borderRadius: "20px",
            padding: "1.25rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ fontSize: "1.8rem", background: "#eff6ff", width: "46px", height: "46px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            🔒
          </div>
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--primary)" }}>Safe Escrow Hold</h4>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Your money is locked safely in escrow until you inspect and accept your item.
            </p>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1.5px solid #dbeafe",
            borderRadius: "20px",
            padding: "1.25rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ fontSize: "1.8rem", background: "#f0fdf4", width: "46px", height: "46px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            🏪
          </div>
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#166534" }}>Verified Local Shops</h4>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Registered physical shops in Kenyan towns with real street stalls and permits.
            </p>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1.5px solid #dbeafe",
            borderRadius: "20px",
            padding: "1.25rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ fontSize: "1.8rem", background: "#fefce8", width: "46px", height: "46px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            🔑
          </div>
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#854d0e" }}>Secret Pickup Key</h4>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Exact shop address and secret pickup key unlock immediately upon payment.
            </p>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1.5px solid #dbeafe",
            borderRadius: "20px",
            padding: "1.25rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ fontSize: "1.8rem", background: "#fdf2f8", width: "46px", height: "46px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            📱
          </div>
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#9d174d" }}>Instant M-Pesa Split</h4>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
              90% releases to vendor wallet once verified; 10% system service fee remains.
            </p>
          </div>
        </div>
      </div>

      {/* 🤖 AI Location Matchmaker Banner */}
      <div
        className="panel"
        style={{
          padding: "16px 22px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
          background: "linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)",
          border: "2px solid #bfdbfe",
          borderRadius: "22px",
          marginBottom: "1.75rem",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #2563eb, #38bdf8)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.4rem",
              boxShadow: "0 6px 16px rgba(37, 99, 235, 0.35)",
            }}
          >
            🤖
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <strong style={{ fontSize: "0.98rem", color: "var(--text-main)" }}>
                AI Location Matchmaker: Active in {currentLocation.estate}, {currentLocation.town}
              </strong>
              <span className="badge badge-delivered" style={{ fontSize: "0.72rem", background: "#dcfce7", color: "#15803d" }}>
                ✓ {vendorMatches.length} Verified Stores Matched
              </span>
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px" }}>
              {vendorMatches[0]
                ? `AI matched you with ${vendorMatches[0].vendorName} (${vendorMatches[0].distanceEstimate} • ${vendorMatches[0].matchScore}% proximity score). Exact shop stall unlocks upon payment.`
                : "AI is intelligently matching you with verified local shops closest to your address."}
            </div>
          </div>
        </div>

        <button
          onClick={() => openAuthModal()}
          className="btn-secondary"
          style={{ padding: "8px 16px", fontSize: "0.85rem", borderColor: "#93c5fd" }}
        >
          📍 Change My Location
        </button>
      </div>

      {/* Category Pills Bar */}
      <div className="categories-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            className={`cat-btn ${selectedCategory === cat.key ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat.key)}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Section Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.25rem" }}>
        <div>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.5px" }}>
            {selectedCategory === "All" ? "Featured Products Near You" : selectedCategory}
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Showing {filteredProducts.length} verified products available for instant escrow pickup
          </p>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="panel" style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🔍</div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>No items found</h3>
          <p style={{ color: "var(--text-muted)", marginTop: "6px" }}>
            Try another category or clear your search query.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="btn-primary"
            style={{ marginTop: "1.25rem" }}
          >
            View All Products
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => {
            const proximity = getProximityLabel(product);
            return (
              <div
                key={product.id}
                className="puffy-item-box"
                style={{
                  border: product.isPromoted ? "2px solid #3b82f6" : undefined,
                }}
              >
                {product.isPromoted && (
                  <div
                    style={{
                      position: "absolute",
                      top: "14px",
                      right: "-30px",
                      background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                      color: "white",
                      fontSize: "0.62rem",
                      fontWeight: 900,
                      padding: "3px 32px",
                      transform: "rotate(45deg)",
                      zIndex: 10,
                      boxShadow: "0 2px 8px rgba(37,99,235,0.4)",
                      letterSpacing: "0.5px",
                    }}
                  >
                    FEATURED
                  </div>
                )}

                <Link href={`/products/${product.id}`} className="puffy-img-wrap">
                  <img src={product.image} alt={product.name} className="puffy-img" />
                  <span className="puffy-pill-badge">
                    {product.badge || product.category}
                  </span>
                </Link>

                <div className="puffy-body">
                  <div style={{ marginBottom: "6px" }}>
                    <span className={`badge ${proximity.class}`} style={{ fontSize: "0.7rem" }}>
                      {proximity.text}
                    </span>
                  </div>

                  <div className="puffy-vendor">
                    <span>🏪</span>
                    <span>{product.vendorName}</span>
                  </div>

                  {/* Locked shop details until payment */}
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "#1e40af",
                      background: "#eff6ff",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      margin: "4px 0 8px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontWeight: 700,
                    }}
                  >
                    <span>🔒</span>
                    <span>Stall & contact unlock on payment</span>
                  </div>

                  <Link href={`/products/${product.id}`}>
                    <h3 className="puffy-title">{product.name}</h3>
                  </Link>
                  <p className="puffy-desc">{product.description}</p>

                  <div className="puffy-footer">
                    <div>
                      <span className="puffy-price">KSh {product.price.toLocaleString()}</span>
                      <span className="puffy-unit"> / {product.unit}</span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="btn-primary"
                      style={{ padding: "7px 16px", fontSize: "0.82rem" }}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Visual 3-Step Escrow Explainer */}
      <div
        className="panel"
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #f8faff 100%)",
          border: "2px solid #dbeafe",
          padding: "2.5rem 2rem",
          marginTop: "2rem",
          borderRadius: "28px",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 2rem" }}>
          <span className="badge badge-dispatched" style={{ marginBottom: "8px" }}>
            HOW SHOPPING WORKS
          </span>
          <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--primary)" }}>
            Zero-Risk Escrow Handover
          </h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Your payment never touches the seller until you inspect your item in person and confirm receipt.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "1.25rem" }}>
          <div
            style={{
              background: "#ffffff",
              border: "1.5px solid #e2eeff",
              borderRadius: "20px",
              padding: "1.75rem",
              textAlign: "center",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "18px",
                background: "linear-gradient(135deg, #2563eb, #38bdf8)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                margin: "0 auto 1rem",
                fontWeight: 900,
              }}
            >
              1
            </div>
            <h4 style={{ fontWeight: 800, fontSize: "1.05rem", marginBottom: "6px" }}>Pay into Safe Escrow</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Pay via Safaricom M-Pesa. Your funds are held securely in the system escrow account.
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "1.5px solid #e2eeff",
              borderRadius: "20px",
              padding: "1.75rem",
              textAlign: "center",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "18px",
                background: "linear-gradient(135deg, #10b981, #34d399)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                margin: "0 auto 1rem",
                fontWeight: 900,
              }}
            >
              2
            </div>
            <h4 style={{ fontWeight: 800, fontSize: "1.05rem", marginBottom: "6px" }}>Shop & Secret Key Unlock</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Payment unlocks the exact stall address, WhatsApp/call contact, and your Secret Pickup Key.
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "1.5px solid #e2eeff",
              borderRadius: "20px",
              padding: "1.75rem",
              textAlign: "center",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "18px",
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                margin: "0 auto 1rem",
                fontWeight: 900,
              }}
            >
              3
            </div>
            <h4 style={{ fontWeight: 800, fontSize: "1.05rem", marginBottom: "6px" }}>Inspect & Release 90%</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Pick up your item, click Accept, and 90% is released to the vendor. System keeps 10% fee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
