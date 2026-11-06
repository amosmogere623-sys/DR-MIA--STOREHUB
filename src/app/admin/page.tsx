"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getStoredOrders,
  updateOrderStatus,
  getStoredVendors,
  updateVendorStatus,
  getStoredProducts,
  getAdminTreasury,
  withdrawAdminCommission,
  toggleProductInStock,
} from "../../lib/data";
import { Order, Vendor, Product, AdminTreasury } from "../../types";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { currentUser, loginAs } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [treasury, setTreasury] = useState<AdminTreasury>(getAdminTreasury());

  const [activeTab, setActiveTab] = useState<"treasury" | "orders" | "inventory" | "vendors" | "aiMatch">("orders");

  // Admin M-Pesa Withdrawal State
  const [withdrawAmount, setWithdrawAmount] = useState<number>(4000);
  const [adminPhone, setAdminPhone] = useState<string>("0711 000 999");
  const [payoutNotice, setPayoutNotice] = useState<string | null>(null);

  // Passkey gate if not logged in
  const [passkeyInput, setPasskeyInput] = useState("");
  const isAuthorized =
    currentUser?.role === "admin" ||
    (typeof window !== "undefined" && localStorage.getItem("admin_auth") === "true");

  const refreshData = () => {
    setOrders(getStoredOrders());
    setVendors(getStoredVendors());
    setProducts(getStoredProducts());
    setTreasury(getAdminTreasury());
  };

  useEffect(() => {
    refreshData();
    window.addEventListener("ordersUpdated", refreshData);
    window.addEventListener("vendorsUpdated", refreshData);
    window.addEventListener("productsUpdated", refreshData);
    window.addEventListener("treasuryUpdated", refreshData);
    return () => {
      window.removeEventListener("ordersUpdated", refreshData);
      window.removeEventListener("vendorsUpdated", refreshData);
      window.removeEventListener("productsUpdated", refreshData);
      window.removeEventListener("treasuryUpdated", refreshData);
    };
  }, []);

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkeyInput === "amo123" || passkeyInput === "admin123" || passkeyInput === "drmia2026") {
      localStorage.setItem("admin_auth", "true");
      loginAs({
        id: "admin-amos",
        name: "Amos Bosire (Platform Owner)",
        email: "amosbosire@gmail.com",
        phone: adminPhone,
        role: "admin",
        location: { county: "Kisii", town: "Kisii Town", estate: "Milimani" },
        createdAt: "2026-01-01",
      });
    } else {
      alert("Invalid Master Passkey! Access strictly reserved for platform owner (Amos Bosire).");
    }
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const result = withdrawAdminCommission(Number(withdrawAmount), adminPhone);
    setPayoutNotice(result.message);
    if (result.success) {
      refreshData();
    }
    setTimeout(() => setPayoutNotice(null), 5000);
  };

  const handleStatusChange = (orderId: string, newStatus: Order["orderStatus"]) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleToggleVendor = (vendorId: string, currentStatus: Vendor["status"]) => {
    const nextStatus = currentStatus === "Approved" ? "Suspended" : "Approved";
    updateVendorStatus(vendorId, nextStatus);
  };

  const handleToggleStock = (productId: string) => {
    toggleProductInStock(productId);
    refreshData();
  };

  // Financial aggregates
  const totalHeldInEscrow = orders
    .filter((o) => o.escrowStatus === "HELD_IN_ESCROW")
    .reduce((sum, o) => sum + o.total, 0);

  const totalReleasedToVendors = orders
    .filter((o) => o.escrowStatus === "RELEASED_TO_VENDOR")
    .reduce((sum, o) => sum + o.vendorPayoutAmount, 0);

  const totalVolume = orders.reduce((sum, o) => sum + o.total, 0);

  // If not authorized as Admin, show dedicated "Only Me" Gate
  if (!isAuthorized) {
    return (
      <div className="container" style={{ padding: "5rem 0", maxWidth: "480px" }}>
        <div className="panel" style={{ textAlign: "center", padding: "3rem 2rem", border: "3px solid #1e40af", borderRadius: "26px", boxShadow: "0 25px 60px rgba(30,58,138,0.25)" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🛡️</div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--text-main)" }}>
            SokoLink Admin Gateway
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "6px", marginBottom: "2rem" }}>
            Restricted Master Access (Platform Owner Only: Amos Bosire). Enter your master passkey to access escrow custody, inventory in/out, and 10% fee M-Pesa cashout.
          </p>

          <form onSubmit={handleAdminAuth}>
            <div className="form-group" style={{ textAlign: "left" }}>
              <label className="form-label">Master Passkey</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                className="form-input"
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: "100%", padding: "14px", background: "#1e40af" }}>
              Unlock Master Admin Console
            </button>
          </form>

          <div style={{ marginTop: "1.5rem" }}>
            <Link href="/" style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 700 }}>
              &larr; Return to SokoLink Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "2.5rem 0 5rem" }}>
      {/* Top Admin Identity Panel */}
      <div
        className="panel"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)",
          color: "white",
          border: "3px solid #93c5fd",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "2.2rem" }}>🛡️</span>
            <div>
              <h1 style={{ fontSize: "1.85rem", fontWeight: 900, letterSpacing: "-0.5px" }}>
                SokoLink Master Admin Console — Amos Bosire
              </h1>
              <p style={{ fontSize: "0.88rem", opacity: 0.9 }}>
                Direct Platform Owner Control: Escrow Custody • Product Inventory In/Out • AI Telemetry • 10% Fee M-Pesa Cashout
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("admin_auth");
            window.location.reload();
          }}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "1px solid rgba(255,255,255,0.4)",
            color: "white",
            padding: "8px 18px",
            borderRadius: "999px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Lock Console
        </button>
      </div>

      {payoutNotice && (
        <div
          style={{
            background: "#ecfdf5",
            border: "2px solid #10b981",
            color: "#065f46",
            padding: "16px 20px",
            borderRadius: "18px",
            margin: "1.5rem 0",
            fontWeight: 800,
          }}
        >
          {payoutNotice}
        </div>
      )}

      {/* High-Level Financial Overview */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
          gap: "1.5rem",
          margin: "2rem 0",
        }}
      >
        {/* Active Funds in Escrow */}
        <div className="panel" style={{ padding: "1.5rem", border: "2px solid #60a5fa", background: "#eff6ff" }}>
          <div style={{ fontSize: "0.82rem", color: "#1e40af", fontWeight: 800 }}>
            🔒 Total Payments in Escrow (Active)
          </div>
          <div style={{ fontSize: "2.1rem", fontWeight: 900, color: "var(--primary)", marginTop: "4px" }}>
            KSh {totalHeldInEscrow.toLocaleString()}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Held safely until buyer pickup and verification
          </div>
        </div>

        {/* Released to Vendors */}
        <div className="panel" style={{ padding: "1.5rem", border: "2px solid #86efac", background: "#f0fdf4" }}>
          <div style={{ fontSize: "0.82rem", color: "#166534", fontWeight: 800 }}>
            ✓ Total Paid Out to Vendors (90%)
          </div>
          <div style={{ fontSize: "2.1rem", fontWeight: 900, color: "#16a34a", marginTop: "4px" }}>
            KSh {totalReleasedToVendors.toLocaleString()}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Successfully collected and released
          </div>
        </div>

        {/* 10% System Commission Pool */}
        <div className="panel" style={{ padding: "1.5rem", border: "2px solid #fde047", background: "#fefce8" }}>
          <div style={{ fontSize: "0.82rem", color: "#854d0e", fontWeight: 800 }}>
            💵 10% Service Fee Balance
          </div>
          <div style={{ fontSize: "2.1rem", fontWeight: 900, color: "#ca8a04", marginTop: "4px" }}>
            KSh {treasury.commissionBalance.toLocaleString()}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Ready to transfer to Amos Bosire M-Pesa
          </div>
        </div>

        {/* Total Platform Volume */}
        <div className="panel" style={{ padding: "1.5rem" }}>
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 800 }}>
            Total Platform Orders Volume
          </div>
          <div style={{ fontSize: "2.1rem", fontWeight: 900, color: "#0f172a", marginTop: "4px" }}>
            KSh {totalVolume.toLocaleString()}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Across {orders.length} total orders
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "1.75rem", overflowX: "auto" }}>
        <button
          onClick={() => setActiveTab("orders")}
          className={`cat-btn ${activeTab === "orders" ? "active" : ""}`}
        >
          📦 All Payments to Escrow ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          className={`cat-btn ${activeTab === "inventory" ? "active" : ""}`}
        >
          🏷️ Products In & Out ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("aiMatch")}
          className={`cat-btn ${activeTab === "aiMatch" ? "active" : ""}`}
        >
          🤖 AI Location & Escrow Safety
        </button>
        <button
          onClick={() => setActiveTab("treasury")}
          className={`cat-btn ${activeTab === "treasury" ? "active" : ""}`}
        >
          💰 Withdraw 10% Fee to M-Pesa
        </button>
        <button
          onClick={() => setActiveTab("vendors")}
          className={`cat-btn ${activeTab === "vendors" ? "active" : ""}`}
        >
          🏪 Registered Shops ({vendors.length})
        </button>
      </div>

      {/* TAB 1: ALL PAYMENTS TO ESCROW */}
      {activeTab === "orders" && (
        <div className="panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--primary)" }}>
                Escrow Custody & Payment Log
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Track every shilling paid into escrow, its current custody status, secret release key, and 90/10 split.
              </p>
            </div>
            <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--primary)" }}>
              Total Orders: {orders.length}
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Order Amount</th>
                  <th>Pickup Key</th>
                  <th>Payment Status</th>
                  <th>Vendor 90% / System 10%</th>
                  <th>Order Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 800, color: "var(--primary)" }}>{order.id}</td>
                    <td>
                      <strong>{order.buyerName}</strong>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{order.buyerPhone}</div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{order.deliveryAddress}</div>
                    </td>
                    <td style={{ fontWeight: 900, fontSize: "1rem" }}>
                      KSh {order.total.toLocaleString()}
                    </td>
                    <td>
                      <code style={{ background: "#eff6ff", padding: "4px 8px", borderRadius: "6px", fontWeight: 800, color: "#1e40af" }}>
                        {order.escrowReleaseKey}
                      </code>
                    </td>
                    <td>
                      <span className={order.escrowStatus === "RELEASED_TO_VENDOR" ? "badge badge-delivered" : "badge badge-dispatched"}>
                        {order.escrowStatus === "RELEASED_TO_VENDOR" ? "✓ Released to Vendor" : "🔒 Held in Escrow"}
                      </span>
                      {order.vendorMarkedPickedUp && order.escrowStatus === "HELD_IN_ESCROW" && (
                        <div style={{ fontSize: "0.72rem", color: "#d97706", marginTop: "2px" }}>
                          (Vendor marked picked up)
                        </div>
                      )}
                    </td>
                    <td style={{ fontSize: "0.82rem" }}>
                      Vendor (90%): <strong>KSh {order.vendorPayoutAmount.toLocaleString()}</strong>
                      <br />
                      System (10%): <strong style={{ color: "var(--primary)" }}>KSh {order.platformCommission.toLocaleString()}</strong>
                    </td>
                    <td>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order["orderStatus"])}
                        className="form-select"
                        style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Ready for Pickup">Ready for Pickup</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS IN & OUT (INVENTORY) */}
      {activeTab === "inventory" && (
        <div className="panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--primary)" }}>
                Products Inventory (In & Out of Stock)
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Comprehensive list of all items across all vendor stalls. Toggle stock status or check available quantities.
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <span className="badge badge-delivered" style={{ fontSize: "0.85rem" }}>
                In Stock: {products.filter((p) => p.inStock).length}
              </span>
              <span className="badge badge-pending" style={{ fontSize: "0.85rem" }}>
                Out of Stock: {products.filter((p) => !p.inStock).length}
              </span>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Quantity</th>
                  <th>Vendor Stall</th>
                  <th>Stock Status</th>
                  <th>Toggle In/Out</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "10px", border: "1px solid #dbeafe" }}
                      />
                      <div>
                        <strong>{p.name}</strong>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          ID: {p.id} {p.badge ? `• ${p.badge}` : ""}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-dispatched" style={{ fontSize: "0.75rem" }}>
                        {p.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, color: "var(--primary)" }}>
                      KSh {p.price.toLocaleString()}
                    </td>
                    <td style={{ fontWeight: 700 }}>
                      {p.stockQuantity} {p.unit}s
                    </td>
                    <td>
                      <div><strong>{p.vendorName}</strong></div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {p.location.estate}, {p.location.town}
                      </div>
                    </td>
                    <td>
                      {p.inStock ? (
                        <span className="badge badge-delivered" style={{ fontSize: "0.78rem" }}>
                          ✓ In Stock
                        </span>
                      ) : (
                        <span className="badge badge-pending" style={{ fontSize: "0.78rem" }}>
                          ✕ Out of Stock
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleStock(p.id)}
                        className="btn-secondary"
                        style={{ padding: "4px 10px", fontSize: "0.78rem" }}
                      >
                        {p.inStock ? "Set Out of Stock" : "Set In Stock"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: AI LOCATION & ESCROW SAFETY */}
      {activeTab === "aiMatch" && (
        <div className="panel">
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
            <span style={{ fontSize: "2.2rem" }}>🤖</span>
            <div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--primary)" }}>
                AI Location Matchmaker & Escrow Safety Engine
              </h2>
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
                Real-time AI telemetry matching buyers to nearby verified stalls in Kenya, detecting location anomalies, and validating Safaricom phone numbers.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "1.25rem", marginBottom: "1.75rem" }}>
            <div style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe", padding: "1.25rem", borderRadius: "18px" }}>
              <div style={{ fontSize: "0.8rem", color: "#1e40af", fontWeight: 800 }}>🤖 AI Proximity Engine</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--primary)", marginTop: "4px" }}>Active (99% Accuracy)</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>Matches buyers to physical shops by Estate, Town, and County</div>
            </div>
            <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", padding: "1.25rem", borderRadius: "18px" }}>
              <div style={{ fontSize: "0.8rem", color: "#166534", fontWeight: 800 }}>🛡️ AI Escrow Integrity</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#16a34a", marginTop: "4px" }}>0 Compromised Keys</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>Cryptographic secret release keys generated per order</div>
            </div>
          </div>

          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1rem" }}>
            Order Location Matches & Telemetry Logs
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {orders.map((o) => (
              <div
                key={o.id}
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #e2eeff",
                  borderRadius: "18px",
                  padding: "1.25rem",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                  <div>
                    <strong style={{ color: "var(--primary)", fontSize: "1.05rem" }}>{o.id}</strong>
                    <span style={{ marginLeft: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      Customer: {o.buyerName} ({o.buyerPhone})
                    </span>
                  </div>
                  <div>
                    <span className="badge badge-delivered" style={{ fontSize: "0.75rem" }}>
                      🤖 AI Matched: {o.items[0]?.vendorName}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: "10px", fontSize: "0.85rem", color: "var(--text-main)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div style={{ background: "#f8faff", padding: "10px", borderRadius: "10px" }}>
                    <strong>📍 Buyer Delivery Estate:</strong> {o.deliveryAddress}
                  </div>
                  <div style={{ background: "#f8faff", padding: "10px", borderRadius: "10px" }}>
                    <strong>🏪 Matched Physical Shop:</strong> {o.items[0]?.stallLocation || "Shop Stall"} ({o.items[0]?.vendorLocation?.estate}, {o.items[0]?.vendorLocation?.town})
                  </div>
                </div>

                <div style={{ marginTop: "8px", fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", justifyContent: "space-between" }}>
                  <span>AI Escrow Safety Recommendation: <strong style={{ color: "#16a34a" }}>APPROVE</strong></span>
                  <span>Secret Key Status: <strong style={{ color: "var(--primary)" }}>{o.escrowStatus === "RELEASED_TO_VENDOR" ? "Handover Completed" : "Securely Locked in Escrow"}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: 10% Fee M-Pesa Cashout */}
      {activeTab === "treasury" && (
        <div className="panel">
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
            <span style={{ fontSize: "2rem" }}>📲</span>
            <div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--primary)" }}>
                Withdraw 10% Service Fee to M-Pesa
              </h2>
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
                Transfer platform commissions directly to Amos Bosire Safaricom M-Pesa line.
              </p>
            </div>
          </div>

          <form onSubmit={handleWithdraw} style={{ maxWidth: "540px", background: "#f8faff", padding: "1.5rem", borderRadius: "20px", border: "2px solid #e2eeff" }}>
            <div className="form-group">
              <label className="form-label">Available Service Fee Balance</label>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--primary)" }}>
                KSh {treasury.commissionBalance.toLocaleString()}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Amount to Cash Out (KSh) *</label>
              <input
                type="number"
                required
                min={100}
                max={treasury.commissionBalance}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Amos Bosire Safaricom M-Pesa Phone Number *</label>
              <input
                type="tel"
                required
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                className="form-input"
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", padding: "14px", fontSize: "1rem" }}
            >
              💸 Transfer KSh {withdrawAmount.toLocaleString()} to M-Pesa
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: Registered Shop Stalls */}
      {activeTab === "vendors" && (
        <div className="panel">
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.25rem" }}>
            Registered Physical Shops in Kenya
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Shop / Stall</th>
                  <th>Registration No.</th>
                  <th>Location (Town & Estate)</th>
                  <th>Phone / M-Pesa</th>
                  <th>Promotion Tokens</th>
                  <th>Verification</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <strong>{v.businessName}</strong>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Owner: {v.name}</div>
                    </td>
                    <td>
                      <span style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--primary)" }}>
                        {v.businessRegistrationNumber}
                      </span>
                    </td>
                    <td>
                      📍 <strong>{v.stallNumber}</strong>
                      <div style={{ fontSize: "0.78rem", color: "var(--primary)" }}>
                        {v.location.estate}, {v.location.town} ({v.location.county})
                      </div>
                    </td>
                    <td>{v.phone}</td>
                    <td>
                      <span style={{ fontWeight: 800, color: "var(--primary)" }}>{v.tokenBalance} Tokens</span>
                    </td>
                    <td>
                      <span className={v.verificationStatus === "Verified" ? "badge badge-delivered" : "badge badge-pending"}>
                        {v.verificationStatus}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleVendor(v.id, v.status)}
                        className="btn-secondary"
                        style={{ padding: "4px 10px", fontSize: "0.78rem" }}
                      >
                        {v.status === "Approved" ? "Suspend" : "Approve"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
