"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStoredVendors } from "../../../lib/data";
import { useAuth } from "../../../context/AuthContext";

export default function VendorLoginPage() {
  const router = useRouter();
  const { loginAs } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const input = emailOrPhone.trim().toLowerCase();

    // 1. Check registered users from localStorage
    try {
      const users = JSON.parse(localStorage.getItem("sokolink_users") || "{}");
      for (const key of Object.keys(users)) {
        const u = users[key];
        const emailMatch = u.profile?.email?.toLowerCase() === input;
        const phoneMatch = u.profile?.phone && u.profile.phone.replace(/\s+/g, "").includes(input.replace(/\s+/g, ""));
        if ((emailMatch || phoneMatch) && u.password === password) {
          if (u.profile.role !== "vendor") {
            setError("This account is registered as a buyer. Please sign in via the buyer portal.");
            return;
          }
          if (u.vendorData) {
            localStorage.setItem("current_vendor", JSON.stringify(u.vendorData));
          }
          loginAs(u.profile);
          router.push("/vendor/dashboard");
          return;
        }
      }
    } catch (err) {
      console.error(err);
    }

    // 2. Check initial seeded vendors in system
    const vendors = getStoredVendors();
    const foundVendor = vendors.find(
      (v) =>
        v.email.toLowerCase() === input ||
        (v.phone && v.phone.replace(/\s+/g, "").includes(input.replace(/\s+/g, "")))
    );

    if (foundVendor) {
      // Seed vendor password match check
      if (password === "vendoe33!" || password === "vendor123") {
        localStorage.setItem("current_vendor", JSON.stringify(foundVendor));
        loginAs({
          id: foundVendor.id,
          name: foundVendor.name,
          email: foundVendor.email,
          phone: foundVendor.phone,
          role: "vendor",
          location: foundVendor.location,
          createdAt: foundVendor.joinedDate,
        });
        router.push("/vendor/dashboard");
        return;
      }
    }

    setError("Invalid email/phone or password. Please verify your stall login details or register a new stall.");
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

        {error && (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #ef4444",
              color: "#991b1b",
              padding: "10px 14px",
              borderRadius: "12px",
              fontSize: "0.82rem",
              fontWeight: 700,
              marginBottom: "1.25rem",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Vendor Email or Safaricom Phone</label>
            <input
              type="text"
              required
              placeholder="e.g. 0712 345 678 or shop@gmail.com"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="form-input"
              autoComplete="username"
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
              autoComplete="current-password"
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

        <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.88rem" }}>
          Don't have a shop account yet?{" "}
          <Link href="/vendor/register" style={{ color: "#16a34a", fontWeight: 700 }}>
            Register Your Stall
          </Link>
          <div style={{ marginTop: "12px" }}>
            <Link href="/" style={{ color: "var(--primary)", fontSize: "0.82rem", fontWeight: 600 }}>
              &larr; Back to SokoLink Marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
