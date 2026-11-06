"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getStoredOrders, buyerAcceptAndReleaseEscrow } from "../../../lib/data";
import { Order } from "../../../types";

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const refreshOrder = () => {
    const orders = getStoredOrders();
    const found = orders.find((o) => o.id === orderId);
    if (found) {
      setOrder(found);
    }
  };

  useEffect(() => {
    refreshOrder();
    window.addEventListener("ordersUpdated", refreshOrder);
    return () => window.removeEventListener("ordersUpdated", refreshOrder);
  }, [orderId]);

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleBuyerRelease = () => {
    if (!order) return;
    const confirmRelease = window.confirm(
      `Are you sure you have received your item and want to release KSh ${order.vendorPayoutAmount.toLocaleString()} to the vendor?`
    );
    if (!confirmRelease) return;

    const res = buyerAcceptAndReleaseEscrow(order.id);
    setActionNotice(res.message);
    refreshOrder();
  };

  return (
    <div className="container" style={{ padding: "2.5rem 0 4rem", maxWidth: "680px" }}>
      <div className="panel" style={{ textAlign: "center", padding: "2.5rem 2rem" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "#2563eb",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            margin: "0 auto 1rem",
          }}
        >
          ✓
        </div>

        <h1 style={{ fontSize: "1.85rem", fontWeight: 800, marginBottom: "6px" }}>
          Order Confirmed!
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginBottom: "1.5rem" }}>
          Your payment is held in the <strong>SokoLink Escrow Vault</strong>. The shop will only receive payment when you give them your Secret Release Key below.
        </p>

        {/* Unique Secret Release Key Card */}
        {order && (
          <div
            style={{
              background: "#1e40af",
              color: "white",
              padding: "1.5rem",
              borderRadius: "20px",
              border: "3px solid #93c5fd",
              margin: "1.25rem 0 2rem",
            }}
          >
            <div style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700, opacity: 0.9 }}>
              🔑 YOUR SECRET RELEASE KEY (GIVE TO SHOP OWNER)
            </div>

            <div
              style={{
                fontSize: "2.2rem",
                fontWeight: 900,
                letterSpacing: "3px",
                margin: "8px 0",
                fontFamily: "monospace",
                color: "#fef08a",
              }}
            >
              {order.escrowReleaseKey}
            </div>

            <p style={{ fontSize: "0.85rem", opacity: 0.95, maxWidth: "460px", margin: "0 auto 1rem" }}>
              Go to the shop address below, inspect your item, and give this key to the seller to complete the handover.
            </p>

            <button
              onClick={() => handleCopyKey(order.escrowReleaseKey)}
              style={{
                background: "white",
                color: "#1e40af",
                border: "none",
                padding: "8px 20px",
                borderRadius: "999px",
                fontWeight: 800,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              {copiedKey ? "✓ Copied Key!" : "📋 Copy Secret Key"}
            </button>
          </div>
        )}

        {/* Real-time Unlocked Shop Location & Contact */}
        {order && order.unlockedVendorContacts && order.unlockedVendorContacts.length > 0 && (
          <div
            style={{
              background: "#eff6ff",
              border: "2px solid #60a5fa",
              borderRadius: "18px",
              padding: "1.25rem",
              textAlign: "left",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontSize: "1.3rem" }}>🔓</span>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--primary)", margin: 0 }}>
                Shop Location & Vendor Contact (Unlocked on Payment)
              </h3>
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "12px" }}>
              Your payment is safely held in escrow. Visit the stall or call the vendor directly to collect your order:
            </p>

            {order.unlockedVendorContacts.map((contact, idx) => (
              <div key={idx} style={{ background: "white", padding: "12px", borderRadius: "12px", border: "1px solid #bfdbfe", marginTop: "8px" }}>
                <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-main)" }}>
                  🏪 {contact.vendorName}
                </div>
                <div style={{ fontSize: "0.88rem", color: "var(--primary)", margin: "4px 0 10px", fontWeight: 700 }}>
                  📍 Exact Address: {contact.exactAddress}
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                    className="btn-primary"
                    style={{ padding: "6px 14px", fontSize: "0.82rem" }}
                  >
                    📞 Call Vendor ({contact.phone})
                  </a>
                  <a
                    href={`https://wa.me/254${contact.phone.replace(/[^0-9]/g, "").slice(-9)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary"
                    style={{ padding: "6px 14px", fontSize: "0.82rem", borderColor: "#22c55e", color: "#166534" }}
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {actionNotice && (
          <div
            style={{
              background: "#ecfdf5",
              border: "2px solid #10b981",
              color: "#065f46",
              padding: "12px",
              borderRadius: "14px",
              marginBottom: "1.25rem",
              fontWeight: 800,
            }}
          >
            ✓ {actionNotice}
          </div>
        )}

        {/* Buyer Accept & Release Button */}
        {order && order.escrowStatus === "HELD_IN_ESCROW" && (
          <div
            style={{
              background: "#f0fdf4",
              border: "2px solid #86efac",
              padding: "1.25rem",
              borderRadius: "16px",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#166534", marginBottom: "6px" }}>
              Already Picked Up Your Items?
            </div>
            <p style={{ fontSize: "0.82rem", color: "#15803d", marginBottom: "12px" }}>
              Clicking below verifies that you have received your product in good condition and releases KSh {order.vendorPayoutAmount.toLocaleString()} to the vendor.
            </p>
            <button
              onClick={handleBuyerRelease}
              className="btn-primary"
              style={{
                background: "#16a34a",
                borderColor: "#16a34a",
                padding: "12px 24px",
                fontSize: "0.95rem",
                fontWeight: 800,
              }}
            >
              ✓ Accept Product & Release Payment
            </button>
          </div>
        )}

        {/* Summary */}
        {order && (
          <div style={{ textAlign: "left", borderTop: "1px solid var(--border)", paddingTop: "1.25rem", fontSize: "0.88rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span>Order Number:</span>
              <strong>{order.id}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span>Total in Escrow:</span>
              <strong style={{ color: "var(--primary)" }}>KSh {order.total.toLocaleString()}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "0.8rem" }}>
              <span>Vendor Payout (90%): KSh {order.vendorPayoutAmount.toLocaleString()}</span>
              <span>System Fee (10%): KSh {order.platformCommission.toLocaleString()}</span>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "1.75rem" }}>
          <Link href="/buyer/orders" className="btn-primary" style={{ padding: "10px 20px", fontSize: "0.9rem" }}>
            View My Orders
          </Link>
          <Link href="/" className="btn-secondary" style={{ padding: "10px 20px", fontSize: "0.9rem" }}>
            Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
