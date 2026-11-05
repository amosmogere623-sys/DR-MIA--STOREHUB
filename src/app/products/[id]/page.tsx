"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getStoredProducts, addToCart } from "../../../lib/data";
import { Product } from "../../../types";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const products = getStoredProducts();
    const found = products.find((p) => p.id === productId);
    if (found) {
      setProduct(found);
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="container" style={{ padding: "4rem 0", textAlign: "center" }}>
        <h2>Item not found</h2>
        <p style={{ color: "var(--text-muted)", marginTop: "6px" }}>
          The requested product could not be located.
        </p>
        <Link href="/" className="btn-primary" style={{ marginTop: "1rem" }}>
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/checkout");
  };

  return (
    <div className="container" style={{ padding: "2rem 0 4rem" }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--primary)", fontWeight: 700 }}>Shop</Link> &gt;{" "}
        <span>{product.category}</span> &gt;{" "}
        <span style={{ color: "var(--text-main)", fontWeight: 700 }}>{product.name}</span>
      </div>

      <div
        className="panel"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2.5rem",
          padding: "2rem",
        }}
      >
        {/* Left: Product Image */}
        <div
          style={{
            borderRadius: "20px",
            overflow: "hidden",
            maxHeight: "440px",
            border: "2px solid #e2eeff",
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Right: Product Details */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              background: "var(--primary-light)",
              color: "var(--primary)",
              padding: "4px 12px",
              borderRadius: "var(--radius-pill)",
              fontSize: "0.78rem",
              fontWeight: 800,
              width: "fit-content",
              marginBottom: "8px",
            }}
          >
            {product.category}
          </span>

          <h1 style={{ fontSize: "1.85rem", fontWeight: 800, marginBottom: "8px" }}>
            {product.name}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
            <span style={{ color: "#eab308", fontWeight: 700 }}>★ {product.rating.toFixed(1)}</span>
            <span style={{ color: "var(--text-muted)" }}>•</span>
            <span style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.9rem" }}>
              {product.inStock ? "In Stock" : "Sold Out"} ({product.stockQuantity} ready in shop)
            </span>
          </div>

          <div
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "var(--primary)",
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "baseline",
              gap: "6px",
            }}
          >
            <span>KSh {product.price.toLocaleString()}</span>
            <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 500 }}>
              / {product.unit}
            </span>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "6px" }}>Description</h3>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.6, fontSize: "0.92rem" }}>
              {product.description}
            </p>
          </div>

          {/* Shop Card */}
          <div
            style={{
              background: "#f8faff",
              padding: "1.1rem",
              borderRadius: "14px",
              marginBottom: "1.5rem",
              border: "1px solid #bfdbfe",
            }}
          >
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Sold by Verified Local Shop:</div>
            <div style={{ fontWeight: 800, color: "var(--text-main)", fontSize: "1rem", marginTop: "2px" }}>
              🏪 {product.vendorName}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--primary)", marginTop: "4px", fontWeight: 700 }}>
              📍 Area: {product.location.estate}, {product.location.town} ({product.location.county})
            </div>
            <div
              style={{
                marginTop: "8px",
                padding: "8px 10px",
                background: "#eff6ff",
                borderRadius: "8px",
                fontSize: "0.78rem",
                color: "#1e40af",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>🔒</span>
              <span>
                <strong>Exact Shop Stall & Phone Number:</strong> Hidden for security. Unlocked instantly once your payment is held safely in escrow.
              </span>
            </div>
          </div>

          {/* Quantity and Actions */}
          <div style={{ marginTop: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Quantity:</span>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #dbeafe", borderRadius: "var(--radius-pill)", padding: "2px 6px" }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: "28px", height: "28px", border: "none", background: "none", fontSize: "1.1rem", fontWeight: 700, color: "var(--primary)" }}
                >
                  -
                </button>
                <span style={{ padding: "0 10px", fontWeight: 800 }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ width: "28px", height: "28px", border: "none", background: "none", fontSize: "1.1rem", fontWeight: 700, color: "var(--primary)" }}
                >
                  +
                </button>
              </div>
              <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Total: <strong>KSh {(product.price * quantity).toLocaleString()}</strong>
              </span>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={handleAdd}
                className="btn-primary"
                style={{ flex: 1, padding: "12px", fontSize: "0.95rem" }}
              >
                {added ? "✓ Added to Cart!" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                className="btn-secondary"
                style={{ flex: 1, padding: "12px", fontSize: "0.95rem" }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
