"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { KENYA_COUNTIES_DATA, getTownsByCounty, getEstatesByTown } from "../lib/locations";
import { UserRole, KenyaLocation, UserProfile } from "../types";

export default function AuthModal() {
  const router = useRouter();
  const { isAuthModalOpen, closeAuthModal, loginAs } = useAuth();

  const [activeTab, setActiveTab] = useState<UserRole>("buyer");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Vendor fields
  const [businessName, setBusinessName] = useState("");
  const [stallNumber, setStallNumber] = useState("");
  const [businessReg, setBusinessReg] = useState("");

  // Location selector
  const [county, setCounty] = useState("Kisii");
  const [town, setTown] = useState("Kisii Town");
  const [estate, setEstate] = useState("Mwembe");

  const [availableTowns, setAvailableTowns] = useState<string[]>([]);
  const [availableEstates, setAvailableEstates] = useState<string[]>([]);

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

  if (!isAuthModalOpen) return null;

  // Single-Click Fast Demo Logins
  const handleQuickDemo = (role: UserRole) => {
    if (role === "admin") {
      localStorage.setItem("admin_auth", "true");
      loginAs({
        id: "admin-amos",
        name: "Amos Bosire (Platform Owner)",
        email: "amosbosire@gmail.com",
        phone: "0711 000 999",
        role: "admin",
        location: { county: "Kisii", town: "Kisii Town", estate: "Milimani" },
        createdAt: "2026-01-01",
      });
      closeAuthModal();
      router.push("/admin");
    } else if (role === "vendor") {
      const vLoc = { county: "Kisii", town: "Kisii Town", estate: "Mwembe" };
      localStorage.setItem(
        "current_vendor",
        JSON.stringify({
          id: "v-vender44",
          name: "SokoLink Vendor",
          businessName: "SokoLink Store - Mwembe Branch",
          stallNumber: "Shop 14, Mwembe Plaza",
          phone: "0712 998 877",
          email: "vender44@gmail.com",
          category: "Bags, Clothes & Living",
          location: vLoc,
          businessRegistrationNumber: "BN-KS-2024-90214",
          verificationStatus: "Verified",
          walletBalance: 8500,
          tokenBalance: 80,
          mpesaNumber: "0712998877",
          status: "Approved",
          joinedDate: "2026-02-14",
        })
      );
      loginAs({
        id: "v-vender44",
        name: "SokoLink Vendor",
        email: "vender44@gmail.com",
        phone: "0712 998 877",
        role: "vendor",
        location: vLoc,
        createdAt: "2026-02-14",
      });
      closeAuthModal();
      router.push("/vendor/dashboard");
    } else {
      loginAs({
        id: "user-buyer23",
        name: "Buyer Account",
        email: "buyer23@gmail.com",
        phone: "0722 334 455",
        role: "buyer",
        location: { county: "Kisii", town: "Kisii Town", estate: "Mwembe" },
        createdAt: "2026-11-01",
      });
      closeAuthModal();
      router.push("/");
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if ((activeTab as string) === "admin") {
      if ((email === "amosbosire@gmail.com" || email === "admin@sokolink.co.ke") && (password === "amo123" || password === "admin123")) {
        handleQuickDemo("admin");
        return;
      }
      if (password === "amo123" || password === "admin123") {
        handleQuickDemo("admin");
        return;
      }
      alert("Invalid Admin credentials. Use email: amosbosire@gmail.com and password: amo123");
      return;
    }

    if (activeTab === "vendor") {
      if (email === "vender44@gmail.com" && password === "vendoe33!") {
        handleQuickDemo("vendor");
        return;
      }
    }

    if (activeTab === "buyer") {
      if (email === "buyer23@gmail.com" && password === "buy123!@1") {
        handleQuickDemo("buyer");
        return;
      }
    }

    // Custom login
    const newLoc: KenyaLocation = { county, town, estate };
    const profile: UserProfile = {
      id: `${activeTab}-${Date.now()}`,
      name: name || (activeTab === "vendor" ? businessName : "Customer"),
      email: email || `${activeTab}@sokolink.co.ke`,
      phone: phone || "0712 345 678",
      role: activeTab,
      location: newLoc,
      createdAt: new Date().toISOString().split("T")[0],
    };

    if (activeTab === "vendor") {
      localStorage.setItem(
        "current_vendor",
        JSON.stringify({
          id: profile.id,
          name: profile.name,
          businessName: businessName || profile.name,
          stallNumber: stallNumber || `Shop in ${estate}`,
          phone: profile.phone,
          email: profile.email,
          category: "Bags, Clothes & Living",
          location: newLoc,
          businessRegistrationNumber: businessReg || "BN-REG-1029",
          verificationStatus: "Verified",
          walletBalance: 0,
          tokenBalance: 40,
          mpesaNumber: profile.phone,
          status: "Approved",
          joinedDate: new Date().toISOString().split("T")[0],
        })
      );
      loginAs(profile);
      closeAuthModal();
      router.push("/vendor/dashboard");
      return;
    }

    if ((activeTab as string) === "admin") {
      loginAs(profile);
      closeAuthModal();
      router.push("/admin");
      return;
    }

    loginAs(profile);
    closeAuthModal();
    router.push("/");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(6px)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={closeAuthModal}
    >
      <div
        className="panel"
        style={{
          maxWidth: "540px",
          width: "100%",
          maxHeight: "92vh",
          overflowY: "auto",
          padding: "2rem",
          background: "white",
          borderRadius: "26px",
          border: "2px solid #bfdbfe",
          boxShadow: "0 25px 60px rgba(15, 23, 42, 0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.6rem" }}>🔗</span>
              <h2 style={{ fontSize: "1.45rem", fontWeight: 900, color: "var(--primary)", letterSpacing: "-0.5px" }}>
                SokoLink
              </h2>
            </div>
            <p style={{ fontSize: "0.95rem", color: "var(--text-main)", fontWeight: 800, marginTop: "4px" }}>
              Login as:
            </p>
          </div>
          <button
            onClick={closeAuthModal}
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "50%",
              width: "34px",
              height: "34px",
              fontSize: "1.3rem",
              cursor: "pointer",
              color: "var(--primary)",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            &times;
          </button>
        </div>

        {/* 3 Prominent "Login as" Selection Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "10px",
            marginBottom: "1.5rem",
          }}
        >
          {/* 1. Buyer */}
          <button
            type="button"
            onClick={() => setActiveTab("buyer")}
            style={{
              padding: "12px 8px",
              borderRadius: "18px",
              border: `2px solid ${activeTab === "buyer" ? "var(--primary)" : "#e2eeff"}`,
              background: activeTab === "buyer" ? "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)" : "#ffffff",
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.2s ease",
              boxShadow: activeTab === "buyer" ? "0 8px 18px rgba(37, 99, 235, 0.18)" : "none",
            }}
          >
            <div style={{ fontSize: "1.6rem", marginBottom: "4px" }}>🛍️</div>
            <strong style={{ fontSize: "0.85rem", color: activeTab === "buyer" ? "var(--primary)" : "var(--text-main)", display: "block" }}>
              Buyer
            </strong>
            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
              Shop & Escrow
            </span>
          </button>

          {/* 2. Vendor */}
          <button
            type="button"
            onClick={() => setActiveTab("vendor")}
            style={{
              padding: "12px 8px",
              borderRadius: "18px",
              border: `2px solid ${activeTab === "vendor" ? "#16a34a" : "#e2eeff"}`,
              background: activeTab === "vendor" ? "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)" : "#ffffff",
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.2s ease",
              boxShadow: activeTab === "vendor" ? "0 8px 18px rgba(22, 163, 74, 0.18)" : "none",
            }}
          >
            <div style={{ fontSize: "1.6rem", marginBottom: "4px" }}>🏪</div>
            <strong style={{ fontSize: "0.85rem", color: activeTab === "vendor" ? "#16a34a" : "var(--text-main)", display: "block" }}>
              Vendor
            </strong>
            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
              Physical Stall
            </span>
          </button>

          {/* 3. Admin */}
          <button
            type="button"
            onClick={() => setActiveTab("admin")}
            style={{
              padding: "12px 8px",
              borderRadius: "18px",
              border: `2px solid ${activeTab === "admin" ? "#1e40af" : "#e2eeff"}`,
              background: activeTab === "admin" ? "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)" : "#ffffff",
              color: activeTab === "admin" ? "white" : "var(--text-main)",
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.2s ease",
              boxShadow: activeTab === "admin" ? "0 8px 18px rgba(30, 58, 138, 0.25)" : "none",
            }}
          >
            <div style={{ fontSize: "1.6rem", marginBottom: "4px" }}>🛡️</div>
            <strong style={{ fontSize: "0.85rem", color: activeTab === "admin" ? "#ffffff" : "var(--text-main)", display: "block" }}>
              Admin
            </strong>
            <span style={{ fontSize: "0.68rem", color: activeTab === "admin" ? "#93c5fd" : "var(--text-muted)" }}>
              Platform Owner
            </span>
          </button>
        </div>

        {/* ADMIN DEDICATED SEPARATE PANEL */}
        {activeTab === "admin" && (
          <div
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
              color: "white",
              padding: "1.25rem",
              borderRadius: "18px",
              marginBottom: "1.5rem",
              border: "2px solid #60a5fa",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "1.2rem" }}>🔒</span>
              <strong style={{ fontSize: "0.95rem", color: "#93c5fd" }}>
                Restricted Admin Gateway — Amos Bosire
              </strong>
            </div>
            <p style={{ fontSize: "0.78rem", color: "#e2e8f0", lineHeight: "1.4" }}>
              Master platform console for monitoring 100% escrow balances, releasing payouts, inventory in/out, and 10% fee M-Pesa withdrawals.
            </p>

            <div style={{ marginTop: "12px", background: "rgba(255,255,255,0.1)", padding: "10px", borderRadius: "12px", fontSize: "0.78rem" }}>
              <div>Master Email: <strong>amosbosire@gmail.com</strong></div>
              <div>Password: <strong>amo123</strong></div>
            </div>

            <button
              type="button"
              onClick={() => handleQuickDemo("admin")}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "var(--radius-pill)",
                fontWeight: 800,
                fontSize: "0.88rem",
                cursor: "pointer",
              }}
            >
              ⚡ Enter Master Admin Console &rarr;
            </button>
          </div>
        )}

        {/* VENDOR DEMO CARD */}
        {activeTab === "vendor" && (
          <div
            style={{
              background: "#f0fdf4",
              border: "1.5px solid #86efac",
              borderRadius: "16px",
              padding: "12px",
              marginBottom: "1.25rem",
            }}
          >
            <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#166534", marginBottom: "4px" }}>
              🏪 Verified Physical Shop Stall Portal
            </div>
            <div style={{ fontSize: "0.78rem", color: "#15803d", marginBottom: "8px" }}>
              Demo: <strong>vender44@gmail.com</strong> | Password: <strong>vendoe33!</strong> (SokoLink Store - Mwembe Branch)
            </div>
            <button
              type="button"
              onClick={() => handleQuickDemo("vendor")}
              className="btn-primary"
              style={{ width: "100%", padding: "8px", fontSize: "0.82rem", background: "#16a34a", borderColor: "#16a34a" }}
            >
              ⚡ Log In as Vendor (Open Stall Hub) &rarr;
            </button>
          </div>
        )}

        {/* BUYER DEMO CARD */}
        {activeTab === "buyer" && (
          <div
            style={{
              background: "#eff6ff",
              border: "1.5px solid #bfdbfe",
              borderRadius: "16px",
              padding: "12px",
              marginBottom: "1.25rem",
            }}
          >
            <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--primary)", marginBottom: "4px" }}>
              🛍️ Customer Safe Escrow Shopping
            </div>
            <div style={{ fontSize: "0.78rem", color: "#1e40af", marginBottom: "8px" }}>
              Demo: <strong>buyer23@gmail.com</strong> | Password: <strong>buy123!@1</strong>
            </div>
            <button
              type="button"
              onClick={() => handleQuickDemo("buyer")}
              className="btn-primary"
              style={{ width: "100%", padding: "8px", fontSize: "0.82rem" }}
            >
              ⚡ Log In as Customer (Start Shopping) &rarr;
            </button>
          </div>
        )}

        {/* Regular Login Form */}
        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label className="form-label">
              {activeTab === "admin" ? "Master Admin Email" : activeTab === "vendor" ? "Vendor Email or Phone" : "Buyer Email"}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder={
                activeTab === "admin"
                  ? "amosbosire@gmail.com"
                  : activeTab === "vendor"
                  ? "vender44@gmail.com"
                  : "buyer23@gmail.com"
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          {activeTab === "vendor" && (
            <>
              <div className="form-group">
                <label className="form-label">Shop Stall Name</label>
                <input
                  type="text"
                  placeholder="e.g. SokoLink Store - Mwembe Branch"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Stall Number / Building</label>
                <input
                  type="text"
                  placeholder="e.g. Stall 14, Mwembe Plaza"
                  value={stallNumber}
                  onChange={(e) => setStallNumber(e.target.value)}
                  className="form-input"
                />
              </div>
            </>
          )}

          {/* Location Selector (Relevant for Buyer & Vendor in Kenya) */}
          {activeTab !== "admin" && (
            <div
              style={{
                background: "#f8faff",
                padding: "1rem",
                borderRadius: "14px",
                border: "1px solid #e2eeff",
                margin: "1rem 0",
              }}
            >
              <label style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--primary)", display: "block", marginBottom: "8px" }}>
                📍 {activeTab === "vendor" ? "Physical Shop Location in Kenya:" : "Your Delivery Estate in Kenya:"}
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                <div>
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, display: "block", marginBottom: "2px" }}>County</label>
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
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, display: "block", marginBottom: "2px" }}>Town</label>
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
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, display: "block", marginBottom: "2px" }}>Estate</label>
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
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              fontSize: "0.95rem",
              background: activeTab === "admin" ? "#1e3a8a" : activeTab === "vendor" ? "#16a34a" : undefined,
              borderColor: activeTab === "admin" ? "#1e3a8a" : activeTab === "vendor" ? "#16a34a" : undefined,
            }}
          >
            Log In as {activeTab === "admin" ? "Master Admin" : activeTab === "vendor" ? "Vendor Stall" : "Customer"}
          </button>
        </form>
      </div>
    </div>
  );
}
