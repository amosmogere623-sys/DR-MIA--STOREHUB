"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@drmia.store");
  const [password, setPassword] = useState("admin123");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("admin_auth", "true");
    router.push("/admin");
  };

  const handleQuickDemo = () => {
    localStorage.setItem("admin_auth", "true");
    router.push("/admin");
  };

  return (
    <div className="container" style={{ padding: "4rem 0 5rem", maxWidth: "480px" }}>
      <div className="panel" style={{ padding: "3rem 2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "8px" }}>☁️</div>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--text-main)" }}>
            Dr. Mia Store
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginTop: "4px" }}>
            Administrator Management Console
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Administrator Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
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
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", padding: "14px", marginTop: "1rem", fontSize: "1.05rem" }}
          >
            Access Management Console
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", borderTop: "2px dashed #edf4ff", paddingTop: "1.25rem" }}>
          <button
            onClick={handleQuickDemo}
            className="btn-secondary"
            style={{ width: "100%", padding: "12px", fontSize: "0.92rem" }}
          >
            ⚡ Fast Demo Admin Access
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.9rem" }}>
          <Link href="/" style={{ color: "var(--primary)", fontWeight: 700 }}>
            &larr; Return to Puffy Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
