"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStoredVendors } from "../../../lib/data";
import { useAuth } from "../../../context/AuthContext";

export default function VendorLoginPage() {
  const router = useRouter();
  const { loginAs } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState("vender44@gmail.com");
  const [password, setPassword] = useState("vendoe33!");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const vendors = getStoredVendors();
    const found = vendors.find(
      (v) => v.email.toLowerCase() === emailOrPhone.toLowerCase() || v.phone.includes(emailOrPhone)
    ) || vendors[0];

    localStorage.setItem("current_vendor", JSON.stringify(found));
    loginAs({
      id: found.id,
      name: found.name,
      email: found.email,
      phone: found.phone,
      role: "vendor",
      location: found.location,
      createdAt: found.joinedDate,
    });
    router.push("/vendor/dashboard");
  };

  const handleQuickLogin = (vendorId: string) => {
    const vendors = getStoredVendors();
    const found = vendors.find((v) => v.id === vendorId) || vendors[0];
    localStorage.setItem("current_vendor", JSON.stringify(found));
    loginAs({
      id: found.id,
      name: found.name,
      email: found.email,
      phone: found.phone,
      role: "vendor",
      location: found.location,
      createdAt: found.joinedDate,
    });
    router.push("/vendor/dashboard");
  };

  return (
    <div className="container" style={{ padding: "4rem 0 5rem", maxWidth: "480px" }}>
      <div
        className="panel"
        style={{
          padding: "3rem 2.5rem",
          border: "2px solid #86efac",
          boxShadow: "0 20px 50px rgba(22, 163, 74, 0.15)",
          borderRadius: "26px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.8rem",
              margin: "0 auto 12px",
              boxShadow: "0 10px 20px rgba(22, 163, 74, 0.35)",
            }}
          >
            🏪
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--text-main)", letterSpacing: "-0.5px" }}>
            SokoLink Vendor Portal
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "4px" }}>
            Manage Your Physical Stall, Products & 90% Sales Payouts
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Vendor Email or Safaricom Phone</label>
            <input
              type="text"
              required
              placeholder="vender44@gmail.com"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "1rem",
              fontSize: "1rem",
              background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
              borderColor: "#16a34a",
            }}
          >
            Access My Shop Dashboard &rarr;
          </button>
        </form>

        <div style={{ marginTop: "1.75rem", borderTop: "2px dashed #e2eeff", paddingTop: "1.25rem" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, display: "block", marginBottom: "8px" }}>
            ⚡ 1-Click Demo Shop Sign-In:
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button
              onClick={() => handleQuickLogin("v-vender44")}
              className="btn-secondary"
              style={{ padding: "10px 14px", fontSize: "0.85rem", textAlign: "left", borderColor: "#86efac" }}
            >
              🏪 Continue as <strong>SokoLink Store (Mwembe Branch)</strong>
            </button>
            <button
              onClick={() => handleQuickLogin("v-daraja")}
              className="btn-secondary"
              style={{ padding: "10px 14px", fontSize: "0.85rem", textAlign: "left" }}
            >
              🩴 Continue as <strong>Daraja Mbili Footwear</strong>
            </button>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "1.75rem", fontSize: "0.88rem" }}>
          Don't have a shop account?{" "}
          <Link href="/vendor/register" style={{ color: "#16a34a", fontWeight: 700 }}>
            Register Your Stall
          </Link>
          <div style={{ marginTop: "10px" }}>
            <Link href="/" style={{ color: "var(--primary)", fontSize: "0.82rem", fontWeight: 600 }}>
              &larr; Back to SokoLink Marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
