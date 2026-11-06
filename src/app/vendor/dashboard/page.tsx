"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getStoredProducts,
  saveProduct,
  getStoredOrders,
  getStoredVendors,
  releaseEscrowWithKey,
  boostProductWithTokens,
  vendorMarkOrderPickedUp,
} from "../../../lib/data";
import { Product, Vendor, Order } from "../../../types";
import { useAuth } from "../../../context/AuthContext";

export default function VendorDashboardPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Key verification
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [enteredReleaseKey, setEnteredReleaseKey] = useState("");
  const [escrowMessage, setEscrowMessage] = useState<string | null>(null);
  const [escrowSuccess, setEscrowSuccess] = useState<boolean | null>(null);

  // New product
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrice, setNewPrice] = useState(450);
  const [newUnit, setNewUnit] = useState("pc");
  const [newCategory, setNewCategory] = useState<Product["category"]>("Bags & Totes");
  const [newStock, setNewStock] = useState(30);
  const [newImage, setNewImage] = useState("https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80");

  const refreshData = () => {
    const vendors = getStoredVendors();
    let currentV: Vendor | undefined;
    if (currentUser?.role === "vendor") {
      currentV = vendors.find((v) => v.id === currentUser.id || v.email === currentUser.email);
    }
    const target = currentV || vendors[0];
    setVendor(target);
    setProducts(getStoredProducts());
    setOrders(getStoredOrders());
  };

  useEffect(() => {
    refreshData();
    window.addEventListener("ordersUpdated", refreshData);
    window.addEventListener("vendorsUpdated", refreshData);
    window.addEventListener("productsUpdated", refreshData);
    return () => {
      window.removeEventListener("ordersUpdated", refreshData);
      window.removeEventListener("vendorsUpdated", refreshData);
      window.removeEventListener("productsUpdated", refreshData);
    };
  }, [currentUser]);

  const handleVerifyEscrowRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId || !enteredReleaseKey) {
      alert("Please choose an order and enter the customer's secret key.");
      return;
    }

    const result = releaseEscrowWithKey(selectedOrderId, enteredReleaseKey);
    setEscrowMessage(result.message);
    setEscrowSuccess(result.success);

    if (result.success) {
      setEnteredReleaseKey("");
      setSelectedOrderId("");
      refreshData();
    }
  };

  const handleMarkPickedUp = (orderId: string) => {
    const res = vendorMarkOrderPickedUp(orderId);
    setEscrowMessage(res.message);
    setEscrowSuccess(true);
    refreshData();
  };

  const handleBoost = (productId: string) => {
    if (!vendor) return;
    if (vendor.tokenBalance < 20) {
      alert(`You have ${vendor.tokenBalance} tokens. 20 tokens needed.`);
      return;
    }

    const success = boostProductWithTokens(productId, vendor.id, 20);
    if (success) {
      alert("✓ Product boosted to the top of the storefront!");
      refreshData();
    }
  };

  const handleBuyTokens = () => {
    if (!vendor) return;
    vendor.tokenBalance += 50;
    const vendors = getStoredVendors();
    const idx = vendors.findIndex((v) => v.id === vendor.id);
    if (idx >= 0) vendors[idx] = vendor;
    localStorage.setItem("drmia_v3_vendors", JSON.stringify(vendors));
    refreshData();
    alert("✓ Added 50 Tokens for KSh 500 via M-Pesa.");
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor) return;

    const newProd: Product = {
      id: "mia-" + Date.now(),
      name: newName,
      description: newDesc,
      price: Number(newPrice),
      unit: newUnit,
      category: newCategory,
      image: newImage,
      vendorId: vendor.id,
      vendorName: vendor.businessName,
      stallLocation: vendor.stallNumber,
      location: vendor.location,
      inStock: true,
      stockQuantity: Number(newStock),
      rating: 5.0,
      badge: "In Stock",
      isPromoted: false,
    };

    saveProduct(newProd);
    refreshData();
    setIsAddModalOpen(false);

    setNewName("");
    setNewDesc("");
    setNewPrice(450);
  };

  const vendorProducts = products.filter(
    (p) => !vendor || p.vendorId === vendor.id || p.vendorName === vendor.businessName
  );

  return (
    <div className="container" style={{ padding: "2rem 0 4rem" }}>
      {/* Header */}
      <div
        className="panel"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          background: "#eff6ff",
          borderColor: "#bfdbfe",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>
              {vendor?.businessName}
            </h1>
            <span className="badge badge-approved">
              ✓ Verified Shop ({vendor?.businessRegistrationNumber})
            </span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "2px" }}>
            📍 {vendor?.stallNumber}, {vendor?.location.estate}, {vendor?.location.town} • 📞 {vendor?.phone}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary"
          style={{ padding: "8px 18px", fontSize: "0.88rem" }}
        >
          + Add New Item
        </button>
      </div>

      {/* Financials & Tokens */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
          gap: "1.25rem",
          margin: "1.5rem 0",
        }}
      >
        <div className="panel" style={{ padding: "1.25rem", border: "1px solid #bbf7d0", background: "#f0fdf4" }}>
          <div style={{ fontSize: "0.78rem", color: "#166534", fontWeight: 700 }}>
            💰 Wallet Balance (90% Payouts)
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#15803d", marginTop: "4px" }}>
            KSh {vendor?.walletBalance.toLocaleString()}
          </div>
          <button
            onClick={() => alert(`Transferred KSh ${vendor?.walletBalance.toLocaleString()} to M-Pesa (${vendor?.mpesaNumber}) successfully!`)}
            className="btn-primary"
            style={{ marginTop: "8px", padding: "4px 12px", fontSize: "0.78rem", background: "#16a34a" }}
          >
            Withdraw to M-Pesa
          </button>
        </div>

        <div className="panel" style={{ padding: "1.25rem", border: "1px solid #bfdbfe" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>
            ⭐ Promotion Tokens
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--primary)", marginTop: "4px" }}>
            {vendor?.tokenBalance} Tokens
          </div>
          <button
            onClick={handleBuyTokens}
            className="btn-secondary"
            style={{ marginTop: "8px", padding: "4px 12px", fontSize: "0.78rem" }}
          >
            + Buy 50 Tokens (KSh 500)
          </button>
        </div>

        <div className="panel" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>
            My Products
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--primary)", marginTop: "4px" }}>
            {vendorProducts.length} Items
          </div>
        </div>
      </div>

      {/* Escrow Release & Customer Handover Form */}
      <div className="panel" style={{ border: "2px solid #2563eb", background: "#f8faff", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--primary)", marginBottom: "4px" }}>
          📦 Orders for Pickup & Handover
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
          Mark when a customer collects their item, or enter their Secret Pickup Key to unlock your 90% payout instantly.
        </p>

        {escrowMessage && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              marginBottom: "1rem",
              fontWeight: 700,
              fontSize: "0.85rem",
              background: escrowSuccess ? "#ecfdf5" : "#fee2e2",
              color: escrowSuccess ? "#065f46" : "#991b1b",
            }}
          >
            {escrowMessage}
          </div>
        )}

        {/* Orders list for pickup */}
        <div style={{ marginBottom: "1.5rem", overflowX: "auto" }}>
          <table className="data-table" style={{ background: "white" }}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Your 90% Payout</th>
                <th>Handover Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders
                .filter((o) => o.escrowStatus === "HELD_IN_ESCROW")
                .map((o) => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 800, color: "var(--primary)" }}>{o.id}</td>
                    <td>
                      <div><strong>{o.buyerName}</strong></div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{o.buyerPhone}</div>
                    </td>
                    <td style={{ fontSize: "0.82rem" }}>
                      {o.items.map((it, i) => (
                        <div key={i}>{it.quantity}x {it.productName}</div>
                      ))}
                    </td>
                    <td style={{ fontWeight: 800, color: "#16a34a" }}>
                      KSh {o.vendorPayoutAmount.toLocaleString()}
                    </td>
                    <td>
                      {o.vendorMarkedPickedUp ? (
                        <span className="badge badge-dispatched" style={{ fontSize: "0.75rem" }}>
                          ✓ Marked Handed Over (Pending Buyer Verification)
                        </span>
                      ) : (
                        <span className="badge badge-pending" style={{ fontSize: "0.75rem" }}>
                          Waiting for Pickup
                        </span>
                      )}
                    </td>
                    <td>
                      {!o.vendorMarkedPickedUp ? (
                        <button
                          onClick={() => handleMarkPickedUp(o.id)}
                          className="btn-secondary"
                          style={{ padding: "4px 10px", fontSize: "0.78rem" }}
                        >
                          Mark as Picked Up
                        </button>
                      ) : (
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          Awaiting buyer release
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              {orders.filter((o) => o.escrowStatus === "HELD_IN_ESCROW").length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "var(--text-muted)", padding: "1.5rem" }}>
                    No pending escrow pickup orders at the moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Enter key form */}
        <div style={{ borderTop: "1px dashed #bfdbfe", paddingTop: "1rem" }}>
          <strong style={{ fontSize: "0.88rem", color: "var(--primary)", display: "block", marginBottom: "8px" }}>
            🔑 Or Enter Customer Secret Key Directly (Instant 90% Unlock):
          </strong>
          <form onSubmit={handleVerifyEscrowRelease} className="responsive-grid-3" style={{ alignItems: "flex-end", gap: "10px" }}>
            <div>
              <label className="form-label" style={{ fontSize: "0.78rem" }}>Select Order</label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="form-select"
                style={{ padding: "8px 10px", fontSize: "0.85rem" }}
              >
                <option value="">-- Choose Order --</option>
                {orders
                  .filter((o) => o.escrowStatus === "HELD_IN_ESCROW")
                  .map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.id} — {o.buyerName} (KSh {o.vendorPayoutAmount.toLocaleString()} payout)
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: "0.78rem" }}>Customer Secret Key</label>
              <input
                type="text"
                placeholder="e.g. ESC-MIA-849201"
                value={enteredReleaseKey}
                onChange={(e) => setEnteredReleaseKey(e.target.value)}
                className="form-input"
                style={{ padding: "8px 10px", fontSize: "0.85rem" }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ height: "42px", padding: "0 18px", fontSize: "0.85rem" }}>
              Verify & Unlock 90%
            </button>
          </form>
        </div>
      </div>

      {/* Products Table */}
      <div className="panel">
        <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1rem" }}>
          My Products & Token Bumps
        </h2>

        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Promotion</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {vendorProducts.map((p) => (
                <tr key={p.id}>
                  <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: "45px", height: "45px", objectFit: "cover", borderRadius: "8px" }}
                    />
                    <div>
                      <strong>{p.name}</strong>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {p.location.estate}, {p.location.town}
                      </div>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td style={{ fontWeight: 800, color: "var(--primary)" }}>
                    KSh {p.price.toLocaleString()}
                  </td>
                  <td>
                    {p.isPromoted ? (
                      <span className="badge badge-delivered" style={{ fontSize: "0.72rem" }}>
                        ⭐ PROMOTED
                      </span>
                    ) : (
                      <span className="badge badge-pending" style={{ fontSize: "0.72rem" }}>
                        Standard
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleBoost(p.id)}
                      className="btn-primary"
                      style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                      title="Use 20 tokens to place on top"
                    >
                      🚀 Boost to Top (20 Tokens)
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isAddModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.45)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="panel"
            style={{ maxWidth: "480px", width: "100%", padding: "2rem" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Add Product</h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ border: "none", background: "none", fontSize: "1.2rem", cursor: "pointer" }}>
                &times;
              </button>
            </div>

            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label className="form-label">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Leather Shoulder Bag"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div className="form-group">
                  <label className="form-label">Price (KSh)</label>
                  <input
                    type="number"
                    required
                    min={50}
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Product["category"])}
                    className="form-select"
                  >
                    <option value="Bags & Totes">Bags & Totes</option>
                    <option value="Pillows & Bedding">Pillows & Bedding</option>
                    <option value="Plushies & Toys">Plushies & Toys</option>
                    <option value="Care & Beauty">Care & Beauty</option>
                    <option value="Shoes & Clothes">Shoes & Clothes</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Photo URL</label>
                <input
                  type="url"
                  required
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: "100%", padding: "12px", marginTop: "8px" }}>
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
