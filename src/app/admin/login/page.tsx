"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAs } = useAuth();
  const [email, setEmail] = useState("amosbosire@gmail.com");
  const [password, setPassword] = useState("amo123");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (email === "amosbosire@gmail.com" || email === "admin@sokolink.co.ke") &&
      (password === "amo123" || password === "admin123")
    ) {
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
      router.push("/admin");
    } else {
      setError("Access Denied: Invalid Master Admin credentials. Only Amos Bosire has console authorization.");
    }
  };

  return (
    <div className="container" style={{ padding: "4rem 0 5rem", maxWidth: "480px" }}>
      <div
        className="panel"
        style={{
          padding: "3rem 2.5rem",
          border: "3px solid #1e40af",
          boxShadow: "0 25px 60px rgba(30, 58, 138, 0.25)",
          borderRadius: "26px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              margin: "0 auto 12px",
              boxShadow: "0 10px 24px rgba(37, 99, 235, 0.35)",
            }}
          >
            🛡️
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--text-main)", letterSpacing: "-0.5px" }}>
            SokoLink Admin Portal
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "4px" }}>
            Restricted Master Access • Platform Owner Only (Amos Bosire)
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
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Master Administrator Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="amosbosire@gmail.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Master Passkey / Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
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
              background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
            }}
          >
            Unlock Master Admin Console
          </button>
        </form>

        <div style={{ marginTop: "1.75rem", borderTop: "2px dashed #e2eeff", paddingTop: "1.25rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "6px" }}>
            Platform Owner Credentials:
          </div>
          <div style={{ fontSize: "0.82rem", background: "#eff6ff", padding: "8px 12px", borderRadius: "10px", color: "#1e40af" }}>
            Email: <strong>amosbosire@gmail.com</strong> | Pass: <strong>amo123</strong>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.88rem" }}>
          <Link href="/" style={{ color: "var(--primary)", fontWeight: 700 }}>
            &larr; Return to SokoLink Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
