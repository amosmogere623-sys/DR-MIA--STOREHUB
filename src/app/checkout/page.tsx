"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStoredCart, clearCart, saveOrder } from "../../lib/data";
import { CartItem, Order } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { evaluateOrderFraud } from "../../lib/aiFraud";
import { KENYA_COUNTIES_DATA, getTownsByCounty, getEstatesByTown } from "../../lib/locations";

export default function CheckoutPage() {
  const router = useRouter();
  const { currentUser, currentLocation, updateLocation } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);

  const [buyerName, setBuyerName] = useState(currentUser?.name || "Buyer Account");
  const [buyerPhone, setBuyerPhone] = useState(currentUser?.phone || "0722334455");
  const [buyerEmail, setBuyerEmail] = useState(currentUser?.email || "buyer23@gmail.com");

  const [county, setCounty] = useState(currentLocation.county);
  const [town, setTown] = useState(currentLocation.town);
  const [estate, setEstate] = useState(currentLocation.estate);

  const [specificAddress, setSpecificAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "card" | "cod">("mpesa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fraudWarning, setFraudWarning] = useState<string | null>(null);

  const [availableTowns, setAvailableTowns] = useState<string[]>([]);
  const [availableEstates, setAvailableEstates] = useState<string[]>([]);

  useEffect(() => {
    setCart(getStoredCart());
  }, []);

  useEffect(() => {
    const towns = getTownsByCounty(county);
    setAvailableTowns(towns);
    if (towns.length > 0 && !towns.includes(town)) {
      setTown(towns[0]);
    }
  }, [county]);

  useEffect(() => {
    const estates = getEstatesByTown(county, town);
    setAvailableEstates(estates);
    if (estates.length > 0 && !estates.includes(estate)) {
      setEstate(estates[0]);
    }
  }, [county, town]);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 50 : 0; // Reasonable KSh 50
  const grandTotal = subtotal + deliveryFee;

  const platformCommission = Math.round(grandTotal * 0.1);
  const vendorPayoutAmount = grandTotal - platformCommission;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!buyerName || !buyerPhone || !estate) {
      alert("Please provide your name, phone number, and location.");
      return;
    }

    setIsSubmitting(true);

    const buyerLocation = { county, town, estate };
    updateLocation(buyerLocation);

    const fraudAnalysis = evaluateOrderFraud({
      buyerPhone,
      totalAmount: grandTotal,
      buyerLocation,
      itemsCount: cart.reduce((s, i) => s + i.quantity, 0),
      paymentMethod,
      notes,
    });

    if (fraudAnalysis.recommendation === "REJECT") {
      setIsSubmitting(false);
      setFraudWarning(`⚠️ Order cannot be processed: ${fraudAnalysis.flags.join(", ")}. Please verify your phone number and delivery location.`);
      return;
    }

    const randomKeyNumber = Math.floor(100000 + Math.random() * 900000);
    const escrowReleaseKey = `ESC-MIA-${randomKeyNumber}`;
    const orderId = `MIA-${Math.floor(10000 + Math.random() * 90000)}`;

    const unlockedContacts = cart.map((item) => ({
      vendorName: item.product.vendorName,
      phone: "0712 998 877",
      exactAddress: `${item.product.stallLocation}, ${item.product.location.estate}, ${item.product.location.town}`,
      gpsCoordinates: item.product.location.county === "Kisii" ? "-0.6773, 34.7796" : "-1.2683, 36.8111",
    }));

    const newOrder: Order = {
      id: orderId,
      buyerId: currentUser?.id || "buyer23",
      buyerName,
      buyerPhone,
      buyerEmail,
      buyerLocation,
      deliveryAddress: `${specificAddress ? specificAddress + ", " : ""}${estate}, ${town}, ${county} County`,
      notes,
      paymentMethod,
      paymentStatus: "Paid",
      orderStatus: "Ready for Pickup",
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        unit: item.product.unit,
        quantity: item.quantity,
        vendorId: item.product.vendorId,
        vendorName: item.product.vendorName,
        vendorPhone: "0712 998 877",
        vendorLocation: item.product.location,
        stallLocation: item.product.stallLocation,
      })),
      subtotal,
      deliveryFee,
      total: grandTotal,
      escrowStatus: "HELD_IN_ESCROW",
      escrowReleaseKey,
      vendorPayoutAmount,
      platformCommission,
      unlockedVendorContacts: unlockedContacts,
      fraudAnalysis,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    setTimeout(() => {
      saveOrder(newOrder);
      clearCart();
      setIsSubmitting(false);
      router.push(`/order-success/${orderId}`);
    }, 1000);
  };

  return (
    <div className="container" style={{ padding: "2rem 0 4rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-main)" }}>
          Checkout (Escrow Protected)
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Your payment stays safely in Escrow until you pick up your item with your secret key.
        </p>
      </div>

      {fraudWarning && (
        <div
          style={{
            background: "#fee2e2",
            border: "1px solid #ef4444",
            color: "#991b1b",
            padding: "12px",
            borderRadius: "12px",
            marginBottom: "1rem",
            fontWeight: 700,
          }}
        >
          {fraudWarning}
        </div>
      )}

      {cart.length === 0 ? (
        <div className="panel" style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <h2>Your cart is empty</h2>
          <Link href="/" className="btn-primary" style={{ marginTop: "1rem" }}>
            Return to Shop
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "1.5rem",
          }}
        >
          {/* Left: Form */}
          <div className="panel">
            <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1.25rem", color: "var(--primary)" }}>
              1. Delivery & Contact Details
            </h2>
            <form onSubmit={handleSubmitOrder}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Safaricom Phone Number (for M-Pesa & Secret Key)</label>
                <input
                  type="tel"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Location Selectors */}
              <div
                style={{
                  background: "#f8faff",
                  padding: "1rem",
                  borderRadius: "14px",
                  border: "1px solid #e2eeff",
                  margin: "1rem 0",
                }}
              >
                <strong style={{ fontSize: "0.85rem", color: "var(--primary)", display: "block", marginBottom: "8px" }}>
                  📍 Choose Your Delivery Location in Kenya:
                </strong>

                <div className="responsive-grid-3">
                  <div>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700, display: "block", marginBottom: "2px" }}>
                      County
                    </label>
                    <select
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                      className="form-select"
                      style={{ padding: "6px", fontSize: "0.8rem" }}
                    >
                      {KENYA_COUNTIES_DATA.map((c) => (
                        <option key={c.county} value={c.county}>
                          {c.county}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700, display: "block", marginBottom: "2px" }}>
                      Town
                    </label>
                    <select
                      value={town}
                      onChange={(e) => setTown(e.target.value)}
                      className="form-select"
                      style={{ padding: "6px", fontSize: "0.8rem" }}
                    >
                      {availableTowns.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700, display: "block", marginBottom: "2px" }}>
                      Estate
                    </label>
                    <select
                      value={estate}
                      onChange={(e) => setEstate(e.target.value)}
                      className="form-select"
                      style={{ padding: "6px", fontSize: "0.8rem" }}
                    >
                      {availableEstates.map((est) => (
                        <option key={est} value={est}>
                          {est}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: "8px" }}>
                  <input
                    type="text"
                    placeholder="Specific house, gate or street"
                    value={specificAddress}
                    onChange={(e) => setSpecificAddress(e.target.value)}
                    className="form-input"
                    style={{ padding: "6px 10px", fontSize: "0.85rem" }}
                  />
                </div>
              </div>

              <h2 style={{ fontSize: "1.15rem", fontWeight: 800, margin: "1.5rem 0 1rem", color: "var(--primary)" }}>
                2. Payment Method
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px",
                    border: `2px solid ${paymentMethod === "mpesa" ? "var(--primary)" : "#e0edff"}`,
                    borderRadius: "14px",
                    cursor: "pointer",
                    background: paymentMethod === "mpesa" ? "var(--primary-light)" : "white",
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="mpesa"
                    checked={paymentMethod === "mpesa"}
                    onChange={() => setPaymentMethod("mpesa")}
                  />
                  <div>
                    <strong style={{ color: "var(--primary)" }}>📱 Safaricom M-Pesa (Escrow Hold)</strong>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      Funds held safely. Unlocks Secret Release Key & shop directions.
                    </p>
                  </div>
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px",
                    border: `2px solid ${paymentMethod === "cod" ? "var(--primary)" : "#e0edff"}`,
                    borderRadius: "14px",
                    cursor: "pointer",
                    background: paymentMethod === "cod" ? "var(--primary-light)" : "white",
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <div>
                    <strong>💵 Pay on Shop Pickup</strong>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      Pay cash upon inspecting the item at the shop.
                    </p>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ width: "100%", padding: "14px", fontSize: "1rem" }}
              >
                {isSubmitting ? "Processing..." : `Pay to Escrow (KSh ${grandTotal.toLocaleString()})`}
              </button>
            </form>
          </div>

          {/* Right: Summary */}
          <div>
            <div className="panel" style={{ position: "sticky", top: "80px" }}>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1rem" }}>
                Order Summary
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1rem" }}>
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.88rem",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700 }}>{item.product.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {item.quantity} x KSh {item.product.price} ({item.product.vendorName})
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, color: "var(--primary)" }}>
                      KSh {(item.product.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", marginBottom: "6px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
                  <span>KSh {subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", marginBottom: "10px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Handling Fee</span>
                  <span>KSh {deliveryFee.toLocaleString()}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "10px",
                    borderTop: "1px dashed var(--border)",
                    fontSize: "1.2rem",
                    fontWeight: 800,
                  }}
                >
                  <span>Total</span>
                  <span style={{ color: "var(--primary)" }}>KSh {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div
                style={{
                  marginTop: "1.25rem",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  padding: "12px",
                  borderRadius: "12px",
                  fontSize: "0.8rem",
                  color: "#166534",
                }}
              >
                🔒 <strong>Payment Protection:</strong>
                <ul style={{ margin: "6px 0 0", paddingLeft: "18px", lineHeight: "1.5" }}>
                  <li>Exact shop address & vendor contacts unlock immediately after payment.</li>
                  <li>Vendor receives 90% (KSh {vendorPayoutAmount.toLocaleString()}) only after you inspect the item and accept.</li>
                  <li>System keeps 10% (KSh {platformCommission.toLocaleString()}) service fee.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
