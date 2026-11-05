"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStoredVendors } from "../../../lib/data";

export default function VendorLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const vendors = getStoredVendors();
    const found = vendors.find((v) => v.phone.includes(phone) || v.email.includes(phone));
    const target = found || vendors[0];
    localStorage.setItem("current_vendor", JSON.stringify(target));
    router.push("/vendor/dashboard");
  };

  const handleQuickLogin = (vendorId: string) => {
    const vendors = getStoredVendors();
    const found = vendors.find((v) => v.id === vendorId) || vendors[0];
    localStorage.setItem("current_vendor", JSON.stringify(found));
    router.push("/vendor/dashboard");
  };

  return (
    <div className="container" style={{ padding: "4rem 0 5rem", maxWidth: "480px" }}>
      <div className="panel" style={{ padding: "3rem 2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "8px" }}>☁️</div>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--text-main)" }}>
            Dr. Mia Studio
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginTop: "4px" }}>
            Artisan & Vendor Partner Portal
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Phone Number or Studio Email</label>
            <input
              type="text"
              required
              placeholder="e.g. contact@drmia.store"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
            style={{ width: "100%", padding: "14px", marginTop: "1rem", fontSize: "1.05rem" }}
          >
            Sign In to Studio Hub
          </button>
        </form>

        <div style={{ marginTop: "2rem", borderTop: "2px dashed #edf4ff", paddingTop: "1.5rem" }}>
          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 700, display: "block", marginBottom: "10px" }}>
            ⚡ Fast Demo Studio Sign-In:
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              onClick={() => handleQuickLogin("v-mia")}
              className="btn-secondary"
              style={{ padding: "10px 14px", fontSize: "0.88rem", textAlign: "left" }}
            >
              ☁️ Continue as <strong>Dr. Mia Official Studio</strong>
            </button>
            <button
              onClick={() => handleQuickLogin("v-2")}
              className="btn-secondary"
              style={{ padding: "10px 14px", fontSize: "0.88rem", textAlign: "left" }}
            >
              🩴 Continue as <strong>Dr. Mia Comfort Lab</strong>
            </button>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.9rem" }}>
          New studio partner?{" "}
          <Link href="/vendor/register" style={{ color: "var(--primary)", fontWeight: 700 }}>
            Register your studio
          </Link>
        </div>
      </div>
    </div>
  );
}
