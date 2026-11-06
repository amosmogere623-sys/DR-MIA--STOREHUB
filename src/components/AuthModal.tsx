"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { KENYA_COUNTIES_DATA, getTownsByCounty, getEstatesByTown } from "../lib/locations";
import { UserRole, KenyaLocation, UserProfile } from "../types";

// ── Helpers for user account storage ──────────────────────────────────────
function getRegisteredUsers(): Record<string, { profile: UserProfile; password: string; vendorData?: object }> {
  try {
    return JSON.parse(localStorage.getItem("sokolink_users") || "{}");
  } catch {
    return {};
  }
}

function saveRegisteredUser(email: string, password: string, profile: UserProfile, vendorData?: object) {
  const users = getRegisteredUsers();
  users[email.toLowerCase()] = { profile, password, vendorData };
  localStorage.setItem("sokolink_users", JSON.stringify(users));
}

function findUser(email: string, password: string) {
  const users = getRegisteredUsers();
  const record = users[email.toLowerCase()];
  if (record && record.password === password) return record;
  return null;
}

export default function AuthModal() {
  const router = useRouter();
  const { isAuthModalOpen, closeAuthModal, loginAs } = useAuth();

  const [activeTab, setActiveTab] = useState<UserRole>("buyer");
  const [mode, setMode] = useState<"login" | "register">("login");

  // Shared fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Vendor-only fields
  const [businessName, setBusinessName] = useState("");
  const [stallNumber, setStallNumber] = useState("");
  const [businessReg, setBusinessReg] = useState("");
  const [vendorCategory, setVendorCategory] = useState("Bags & Totes");

  // Location
  const [county, setCounty] = useState("Kisii");
  const [town, setTown] = useState("Kisii Town");
  const [estate, setEstate] = useState("Mwembe");
  const [availableTowns, setAvailableTowns] = useState<string[]>([]);
  const [availableEstates, setAvailableEstates] = useState<string[]>([]);

  useEffect(() => {
    const towns = getTownsByCounty(county);
    setAvailableTowns(towns);
    if (towns.length > 0 && !towns.includes(town)) setTown(towns[0]);
  }, [county]);

  useEffect(() => {
    const estates = getEstatesByTown(county, town);
    setAvailableEstates(estates);
    if (estates.length > 0 && !estates.includes(estate)) setEstate(estates[0]);
  }, [county, town]);

  // Reset form when tab or mode changes
  useEffect(() => {
    setErrorMsg("");
    setEmail(""); setPassword(""); setConfirmPassword("");
    setName(""); setPhone(""); setBusinessName(""); setStallNumber(""); setBusinessReg("");
  }, [activeTab, mode]);

  if (!isAuthModalOpen) return null;

  // ── LOGIN ────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, role: activeTab }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Invalid email or password.");
        return;
      }

      if (data.profile.role === "admin") {
        localStorage.setItem("admin_auth", "true");
        loginAs(data.profile);
        closeAuthModal();
        router.push("/admin");
        return;
      }

      if (activeTab === "vendor" && data.vendorData) {
        localStorage.setItem("current_vendor", JSON.stringify(data.vendorData));
      }

      loginAs(data.profile);
      closeAuthModal();
      router.push(activeTab === "vendor" ? "/vendor/dashboard" : "/");
    } catch (err: any) {
      // Fallback to local check if offline
      const record = findUser(email.trim(), password);
      if (record && record.profile.role === activeTab) {
        if (activeTab === "vendor" && record.vendorData) {
          localStorage.setItem("current_vendor", JSON.stringify(record.vendorData));
        }
        loginAs(record.profile);
        closeAuthModal();
        router.push(activeTab === "vendor" ? "/vendor/dashboard" : "/");
        return;
      }
      setErrorMsg("Error connecting to server. Please try again.");
    }
  };

  // ── REGISTER ─────────────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) { setErrorMsg("Please enter your full name."); return; }
    if (!email.trim()) { setErrorMsg("Please enter your email."); return; }
    if (password.length < 6) { setErrorMsg("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setErrorMsg("Passwords do not match."); return; }

    if (activeTab === "vendor") {
      if (!businessName.trim()) { setErrorMsg("Please enter your shop name."); return; }
      if (!stallNumber.trim()) { setErrorMsg("Please enter your stall/shop location."); return; }
    }

    const loc: KenyaLocation = { county, town, estate };
    const profile: UserProfile = {
      id: `${activeTab}-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || "—",
      role: activeTab,
      location: loc,
      createdAt: new Date().toISOString().split("T")[0],
    };

    let vendorData: object | undefined;
    if (activeTab === "vendor") {
      vendorData = {
        id: profile.id,
        name: profile.name,
        businessName: businessName.trim(),
        stallNumber: stallNumber.trim(),
        phone: profile.phone,
        email: profile.email,
        category: vendorCategory,
        location: loc,
        businessRegistrationNumber: businessReg.trim() || `BN-REG-${Date.now()}`,
        verificationStatus: "Verified",
        walletBalance: 0,
        tokenBalance: 20,
        mpesaNumber: phone.trim(),
        status: "Approved",
        joinedDate: profile.createdAt,
      };
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, profile, vendorData }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Registration failed. An account with this email may already exist.");
        return;
      }

      saveRegisteredUser(email.trim(), password, profile, vendorData);
      if (activeTab === "vendor" && vendorData) {
        localStorage.setItem("current_vendor", JSON.stringify(vendorData));
      }

      loginAs(profile);
      closeAuthModal();
      router.push(activeTab === "vendor" ? "/vendor/dashboard" : "/");
    } catch (err: any) {
      saveRegisteredUser(email.trim(), password, profile, vendorData);
      if (activeTab === "vendor" && vendorData) {
        localStorage.setItem("current_vendor", JSON.stringify(vendorData));
      }
      loginAs(profile);
      closeAuthModal();
      router.push(activeTab === "vendor" ? "/vendor/dashboard" : "/");
    }
  };

  // ── STYLES ───────────────────────────────────────────────────────────────
  const tabColor = activeTab === "admin" ? "#1e3a8a" : activeTab === "vendor" ? "#16a34a" : "#2563eb";
  const tabBg = activeTab === "admin"
    ? "linear-gradient(135deg,#0f172a,#1e40af)"
    : activeTab === "vendor"
    ? "linear-gradient(135deg,#f0fdf4,#dcfce7)"
    : "linear-gradient(135deg,#eff6ff,#dbeafe)";

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(15,23,42,0.65)",
        backdropFilter: "blur(6px)",
        zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
      onClick={closeAuthModal}
    >
      <div
        className="panel"
        style={{
          maxWidth: "520px", width: "100%",
          maxHeight: "92vh", overflowY: "auto",
          padding: "2rem",
          background: "white",
          borderRadius: "26px",
          border: `2px solid ${tabColor}30`,
          boxShadow: "0 25px 60px rgba(15,23,42,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.6rem" }}>🔗</span>
              <h2 style={{ fontSize: "1.45rem", fontWeight: 900, color: tabColor, letterSpacing: "-0.5px" }}>
                SokoLink
              </h2>
            </div>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Kenya Verified Escrow Marketplace
            </p>
          </div>
          <button
            onClick={closeAuthModal}
            style={{
              background: "#f1f5f9", border: "none", borderRadius: "50%",
              width: "34px", height: "34px", fontSize: "1.2rem",
              cursor: "pointer", color: "#64748b", fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            &times;
          </button>
        </div>

        {/* Role selector */}
        <div className="responsive-grid-3" style={{ marginBottom: "1.25rem" }}>
          {(["buyer", "vendor", "admin"] as UserRole[]).map((role) => {
            const icons: Record<string, string> = { buyer: "🛍️", vendor: "🏪", admin: "🛡️" };
            const labels: Record<string, string> = { buyer: "Buyer", vendor: "Vendor", admin: "Admin" };
            const subs: Record<string, string> = { buyer: "Shop & Pay", vendor: "My Stall", admin: "Platform" };
            const rColor = role === "admin" ? "#1e3a8a" : role === "vendor" ? "#16a34a" : "#2563eb";
            const isActive = activeTab === role;
            return (
              <button
                key={role}
                type="button"
                onClick={() => { setActiveTab(role); setMode("login"); }}
                style={{
                  padding: "12px 8px",
                  borderRadius: "16px",
                  border: `2px solid ${isActive ? rColor : "#e2e8f0"}`,
                  background: isActive ? (role === "admin" ? "linear-gradient(135deg,#1e3a8a,#2563eb)" : role === "vendor" ? "#f0fdf4" : "#eff6ff") : "#fff",
                  color: isActive && role === "admin" ? "white" : rColor,
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.18s",
                  boxShadow: isActive ? `0 6px 16px ${rColor}22` : "none",
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "3px" }}>{icons[role]}</div>
                <strong style={{ fontSize: "0.82rem", display: "block" }}>{labels[role]}</strong>
                <span style={{ fontSize: "0.68rem", opacity: 0.7 }}>{subs[role]}</span>
              </button>
            );
          })}
        </div>

        {/* Login / Register tabs — only for buyer & vendor */}
        {activeTab !== "admin" && (
          <div style={{ display: "flex", gap: "6px", marginBottom: "1.25rem", background: "#f8faff", borderRadius: "12px", padding: "4px" }}>
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                style={{
                  flex: 1, padding: "8px", border: "none", borderRadius: "10px",
                  fontWeight: 800, fontSize: "0.88rem", cursor: "pointer",
                  background: mode === m ? tabColor : "transparent",
                  color: mode === m ? "white" : "var(--text-muted)",
                  transition: "all 0.15s",
                }}
              >
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div style={{
            background: "#fef2f2", border: "1.5px solid #fca5a5",
            color: "#b91c1c", padding: "10px 14px", borderRadius: "12px",
            fontSize: "0.85rem", fontWeight: 700, marginBottom: "1rem",
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* ── LOGIN FORM ── */}
        {(activeTab === "admin" || mode === "login") && (
          <form onSubmit={handleLogin}>
            {activeTab === "admin" && (
              <div style={{
                background: "linear-gradient(135deg,#0f172a,#1e3a8a)",
                color: "white", padding: "14px", borderRadius: "14px",
                marginBottom: "1.25rem", fontSize: "0.82rem", lineHeight: 1.5,
              }}>
                🔒 <strong>Restricted Admin Access</strong><br />
                Only the platform owner can access this console.
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                {activeTab === "admin" ? "Admin Email" : "Email Address"}
              </label>
              <input
                type="email" required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password" required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                width: "100%", padding: "13px", marginTop: "10px",
                fontSize: "0.95rem", fontWeight: 800,
                background: tabColor, borderColor: tabColor,
              }}
            >
              {activeTab === "admin" ? "🛡️ Access Admin Console" : activeTab === "vendor" ? "🏪 Sign In to Stall" : "🛍️ Sign In & Shop"}
            </button>

            {activeTab !== "admin" && (
              <p style={{ textAlign: "center", fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "12px" }}>
                No account yet?{" "}
                <button type="button" onClick={() => setMode("register")}
                  style={{ background: "none", border: "none", color: tabColor, fontWeight: 800, cursor: "pointer", fontSize: "0.82rem" }}>
                  Create one free →
                </button>
              </p>
            )}
          </form>
        )}

        {/* ── REGISTER FORM ── */}
        {activeTab !== "admin" && mode === "register" && (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="form-input" placeholder="e.g. John Mwangi" />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="form-input" placeholder="e.g. john@gmail.com" autoComplete="email" />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="form-input" placeholder="e.g. 0712 345 678" />
            </div>

            <div className="responsive-grid-2">
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="form-input" placeholder="Min 6 chars" autoComplete="new-password" />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input" placeholder="Repeat password" />
              </div>
            </div>

            {/* Vendor-only fields */}
            {activeTab === "vendor" && (
              <>
                <div style={{ borderTop: "1px dashed #e2e8f0", margin: "12px 0 10px", paddingTop: "10px" }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#16a34a", marginBottom: "8px" }}>
                    🏪 Shop Details
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Shop / Business Name *</label>
                  <input type="text" required value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                    className="form-input" placeholder="e.g. Kimani Hardware Kisii" />
                </div>

                <div className="form-group">
                  <label className="form-label">Stall / Shop Location *</label>
                  <input type="text" required value={stallNumber} onChange={(e) => setStallNumber(e.target.value)}
                    className="form-input" placeholder="e.g. Shop 7, Mwembe Market" />
                </div>

                <div className="form-group">
                  <label className="form-label">Business Registration No. (optional)</label>
                  <input type="text" value={businessReg} onChange={(e) => setBusinessReg(e.target.value)}
                    className="form-input" placeholder="e.g. BN-KS-2024-12345" />
                </div>

                <div className="form-group">
                  <label className="form-label">Product Category</label>
                  <select value={vendorCategory} onChange={(e) => setVendorCategory(e.target.value)} className="form-select">
                    <option>Bags &amp; Totes</option>
                    <option>Pillows &amp; Bedding</option>
                    <option>Plushies &amp; Toys</option>
                    <option>Care &amp; Beauty</option>
                    <option>Shoes &amp; Clothes</option>
                    <option>Food &amp; Groceries</option>
                    <option>Electronics</option>
                    <option>Hardware &amp; Tools</option>
                  </select>
                </div>
              </>
            )}

            {/* Kenya Location */}
            <div style={{
              background: "#f8faff", padding: "1rem", borderRadius: "14px",
              border: "1px solid #e2eeff", margin: "10px 0",
            }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 800, color: tabColor, display: "block", marginBottom: "8px" }}>
                📍 {activeTab === "vendor" ? "Shop Location in Kenya:" : "Your Location in Kenya:"}
              </label>
              <div className="responsive-grid-3">
                <div>
                  <label style={{ fontSize: "0.7rem", fontWeight: 700, display: "block", marginBottom: "2px" }}>County</label>
                  <select value={county} onChange={(e) => setCounty(e.target.value)} className="form-select" style={{ padding: "6px", fontSize: "0.78rem" }}>
                    {KENYA_COUNTIES_DATA.map((c) => <option key={c.county}>{c.county}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.7rem", fontWeight: 700, display: "block", marginBottom: "2px" }}>Town</label>
                  <select value={town} onChange={(e) => setTown(e.target.value)} className="form-select" style={{ padding: "6px", fontSize: "0.78rem" }}>
                    {availableTowns.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.7rem", fontWeight: 700, display: "block", marginBottom: "2px" }}>Estate</label>
                  <select value={estate} onChange={(e) => setEstate(e.target.value)} className="form-select" style={{ padding: "6px", fontSize: "0.78rem" }}>
                    {availableEstates.map((est) => <option key={est}>{est}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                width: "100%", padding: "13px", marginTop: "8px",
                fontSize: "0.95rem", fontWeight: 800,
                background: tabColor, borderColor: tabColor,
              }}
            >
              {activeTab === "vendor" ? "✅ Register My Shop" : "✅ Create My Account"}
            </button>

            <p style={{ textAlign: "center", fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "12px" }}>
              Already have an account?{" "}
              <button type="button" onClick={() => setMode("login")}
                style={{ background: "none", border: "none", color: tabColor, fontWeight: 800, cursor: "pointer", fontSize: "0.82rem" }}>
                Sign in →
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
