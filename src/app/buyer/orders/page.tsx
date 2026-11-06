"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredOrders, buyerAcceptAndReleaseEscrow, syncAllFromServer } from "../../../lib/data";
import { Order } from "../../../types";

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [notice, setNotice] = useState<string | null>(null);

  const refreshOrders = () => {
    setOrders(getStoredOrders());
  };

  useEffect(() => {
    syncAllFromServer();
    refreshOrders();
    const handleUpdate = () => refreshOrders();
    window.addEventListener("ordersUpdated", handleUpdate);
    const interval = setInterval(() => { syncAllFromServer(); }, 5000);
    return () => {
      clearInterval(interval);
      window.removeEventListener("ordersUpdated", handleUpdate);
    };
  }, []);

  const handleBuyerRelease = (order: Order) => {
    const ok = window.confirm(
      `Have you inspected and received your item for Order ${order.id}?\n\nThis will release KSh ${order.vendorPayoutAmount.toLocaleString()} to the vendor.`
    );
    if (!ok) return;

    const res = buyerAcceptAndReleaseEscrow(order.id);
    setNotice(res.message);
    refreshOrders();
    setTimeout(() => setNotice(null), 5000);
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "All") return true;
    if (activeTab === "Escrow Active") return o.escrowStatus === "HELD_IN_ESCROW";
    if (activeTab === "Delivered") return o.escrowStatus === "RELEASED_TO_VENDOR";
    return o.orderStatus === activeTab;
  });

  return (
    <div className="container" style={{ padding: "2rem 0 4rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--text-main)" }}>
            My Orders
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
            View your order history, pickup confirmation codes, and shop contact details.
          </p>
        </div>
        <Link href="/" className="btn-primary" style={{ padding: "8px 18px", fontSize: "0.88rem" }}>
          + New Order
        </Link>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem", overflowX: "auto" }}>
        {["All", "Active Orders", "Completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cat-btn ${activeTab === tab ? "active" : ""}`}
            style={{ padding: "6px 14px", fontSize: "0.82rem" }}
          >
            {tab}
          </button>
        ))}
      </div>

      {notice && (
        <div
          style={{
            background: "#ecfdf5",
            border: "2px solid #10b981",
            color: "#065f46",
            padding: "12px 18px",
            borderRadius: "14px",
            marginBottom: "1.5rem",
            fontWeight: 800,
          }}
        >
          ✓ {notice}
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="panel" style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <h3>No orders found</h3>
          <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
            You have no orders in this tab.
          </p>
          <Link href="/" className="btn-primary" style={{ marginTop: "1rem" }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {filteredOrders.map((order) => (
            <div key={order.id} className="panel">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "1rem",
                  marginBottom: "1rem",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--primary)" }}>
                      {order.id}
                    </span>
                    <span className={order.escrowStatus === "RELEASED_TO_VENDOR" ? "badge badge-delivered" : "badge badge-dispatched"}>
                      {order.escrowStatus === "RELEASED_TO_VENDOR" ? "Completed" : "Ready for Pickup"}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    Date: {order.createdAt} • Payment: {order.paymentMethod.toUpperCase()}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--primary)" }}>
                    KSh {order.total.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Release Key Alert */}
              {order.escrowStatus === "HELD_IN_ESCROW" && (
                <div
                  style={{
                    background: "#1e40af",
                    color: "white",
                    padding: "14px 18px",
                    borderRadius: "14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <span style={{ fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700, opacity: 0.9 }}>
                      🔑 Pickup Confirmation Code:
                    </span>
                    <div style={{ fontSize: "1.4rem", fontWeight: 900, fontFamily: "monospace", color: "#fef08a" }}>
                      {order.escrowReleaseKey}
                    </div>
                  </div>
                  <div style={{ fontSize: "0.78rem", opacity: 0.9 }}>
                    Show to seller at the shop when collecting.
                  </div>
                </div>
              )}

              {/* Unlocked Shop Contact (Visible after Payment) */}
              {order.unlockedVendorContacts && order.unlockedVendorContacts.length > 0 && (
                <div
                  style={{
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    marginBottom: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.78rem", color: "#166534", fontWeight: 700 }}>
                      🔓 UNLOCKED SHOP LOCATION & CONTACT:
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#15803d", fontWeight: 700 }}>
                      📍 {order.unlockedVendorContacts[0]?.exactAddress}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <a
                      href={`tel:${order.unlockedVendorContacts[0]?.phone.replace(/\s+/g, "")}`}
                      className="btn-primary"
                      style={{ padding: "4px 12px", fontSize: "0.75rem" }}
                    >
                      📞 Call ({order.unlockedVendorContacts[0]?.phone})
                    </a>
                  </div>
                </div>
              )}

              {/* Vendor status notice */}
              {order.vendorMarkedPickedUp && order.escrowStatus === "HELD_IN_ESCROW" && (
                <div
                  style={{
                    background: "#fef3c7",
                    border: "1px solid #f59e0b",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    color: "#92400e",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    marginBottom: "1rem",
                  }}
                >
                  🏪 Shop owner has marked this item as handed over. Please click Accept below to release their payment.
                </div>
              )}

              {/* Buyer Accept & Release Button */}
              {order.escrowStatus === "HELD_IN_ESCROW" && (
                <div style={{ marginBottom: "1rem" }}>
                  <button
                    onClick={() => handleBuyerRelease(order)}
                    className="btn-primary"
                    style={{
                      background: "#16a34a",
                      borderColor: "#16a34a",
                      padding: "8px 18px",
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      width: "100%",
                    }}
                  >
                    ✓ I Received My Item — Release Payment (KSh {order.vendorPayoutAmount.toLocaleString()})
                  </button>
                </div>
              )}

              {/* Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "1rem" }}>
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.88rem",
                      background: "#f8faff",
                      padding: "8px 12px",
                      borderRadius: "10px",
                    }}
                  >
                    <div>
                      <strong>{item.quantity}x {item.productName}</strong>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        Shop: {item.vendorName} ({item.stallLocation})
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, color: "var(--primary)" }}>
                      KSh {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.82rem",
                  color: "var(--text-muted)",
                  borderTop: "1px solid var(--border)",
                  paddingTop: "8px",
                }}
              >
                <div>📍 Pickup / Delivery: {order.deliveryAddress}</div>
                <Link
                  href={`/order-success/${order.id}`}
                  style={{ color: "var(--primary)", fontWeight: 700 }}
                >
                  View Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
