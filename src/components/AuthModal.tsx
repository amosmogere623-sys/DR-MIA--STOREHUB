"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { KENYA_COUNTIES_DATA, getTownsByCounty, getEstatesByTown } from "../lib/locations";
import { UserRole, KenyaLocation, UserProfile } from "../types";

export default function AuthModal() {
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
        name: "Amos Bosire (Admin)",
        email: "amosbosire@gmail.com",
        phone: "0711 000 999",
        role: "admin",
        location: { county: "Kisii", town: "Kisii Town", estate: "Milimani" },
        createdAt: "2026-01-01",
      });
    } else if (role === "vendor") {
      const vLoc = { county: "Kisii", town: "Kisii Town", estate: "Mwembe" };
      localStorage.setItem(
        "current_vendor",
        JSON.stringify({
          id: "v-vender44",
          name: "Dr. Mia Vendor",
          businessName: "Dr. Mia Store - Mwembe Branch",
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
        name: "Dr. Mia Vendor",
        email: "vender44@gmail.com",
        phone: "0712 998 877",
        role: "vendor",
        location: vLoc,
        createdAt: "2026-02-14",
      });
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
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "admin") {
      if (email === "amosbosire@gmail.com" && password === "amo123") {
        handleQuickDemo("admin");
        return;
      }
      if (password === "amo123" || password === "admin123") {
        handleQuickDemo("admin");
        return;
      }
      alert("Invalid Admin login. Use email: amosbosire@gmail.com and password: amo123");
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
      email: email || `${activeTab}@drmia.store`,
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
    }

    loginAs(profile);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.55)",
        backdropFilter: "blur(4px)",
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
          maxWidth: "520px",
          width: "100%",
          maxHeight: "92vh",
          overflowY: "auto",
          padding: "2rem",
          background: "white",
          borderRadius: "24px",
          border: "2px solid #dbeafe",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-main)" }}>
              Dr. Mia Store Login
            </h2>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Select role and choose your location in Kenya
            </p>
          </div>
          <button
            onClick={closeAuthModal}
            style={{
              background: "#f0f7ff",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              fontSize: "1.2rem",
              cursor: "pointer",
              color: "var(--primary)",
              fontWeight: 700,
            }}
          >
            &times;
          </button>
        </div>

        {/* Role Tabs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "6px",
            background: "#f1f7ff",
            padding: "4px",
            borderRadius: "var(--radius-pill)",
            marginBottom: "1.25rem",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("buyer")}
            className={`cat-btn ${activeTab === "buyer" ? "active" : ""}`}
            style={{ padding: "6px 10px", fontSize: "0.82rem", textAlign: "center" }}
          >
            🛒 Buyer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("vendor")}
            className={`cat-btn ${activeTab === "vendor" ? "active" : ""}`}
            style={{ padding: "6px 10px", fontSize: "0.82rem", textAlign: "center" }}
          >
            🏪 Vendor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("admin")}
            className={`cat-btn ${activeTab === "admin" ? "active" : ""}`}
            style={{ padding: "6px 10px", fontSize: "0.82rem", textAlign: "center" }}
          >
            🛡️ Admin
          </button>
        </div>

        {/* Fast Demo Login Card */}
        <div
          style={{
            background: "var(--primary-light)",
            border: "1px solid #bfdbfe",
            borderRadius: "14px",
            padding: "12px",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--primary)", marginBottom: "4px" }}>
            ⚡ 1-Click Demo Login:
          </div>
          {activeTab === "admin" && (
            <div style={{ fontSize: "0.78rem", color: "#1e40af", marginBottom: "8px" }}>
              Email: <strong>amosbosire@gmail.com</strong> | Password: <strong>amo123</strong>
            </div>
          )}
          {activeTab === "buyer" && (
            <div style={{ fontSize: "0.78rem", color: "#1e40af", marginBottom: "8px" }}>
              Email: <strong>buyer23@gmail.com</strong> | Password: <strong>buy123!@1</strong>
            </div>
          )}
          {activeTab === "vendor" && (
            <div style={{ fontSize: "0.78rem", color: "#1e40af", marginBottom: "8px" }}>
              Email: <strong>vender44@gmail.com</strong> | Password: <strong>vendoe33!</strong>
            </div>
          )}
          <button
            type="button"
            onClick={() => handleQuickDemo(activeTab)}
            className="btn-primary"
            style={{ width: "100%", padding: "8px", fontSize: "0.82rem" }}
          >
            Log In as {activeTab.toUpperCase()} Now
          </button>
        </div>

        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
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
                <label className="form-label">Shop Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Mia Store - Mwembe Branch"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Shop / Stall Number</label>
                <input
                  type="text"
                  placeholder="e.g. Shop 14, Mwembe Plaza"
                  value={stallNumber}
                  onChange={(e) => setStallNumber(e.target.value)}
                  className="form-input"
                />
              </div>
            </>
          )}

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
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--primary)", marginBottom: "8px" }}>
                📍 Choose Location in Kenya:
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                <div>
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, display: "block", marginBottom: "2px" }}>
                    County
                  </label>
                  <select
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="form-select"
                    style={{ padding: "6px", fontSize: "0.78rem" }}
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
                    style={{ padding: "6px", fontSize: "0.78rem" }}
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
                    style={{ padding: "6px", fontSize: "0.78rem" }}
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
            style={{ width: "100%", padding: "12px", fontSize: "0.95rem" }}
          >
            Log In as {activeTab.toUpperCase()}
          </button>
        </form>
      </div>
    </div>
  );
}
