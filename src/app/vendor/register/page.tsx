"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveVendor } from "../../../lib/data";
import { Vendor } from "../../../types";

export default function VendorRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [stallNumber, setStallNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Puffy Bags & Totes");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newVendor: Vendor = {
      id: "v-" + Date.now(),
      name,
      businessName,
      stallNumber,
      phone,
      email,
      category,
      location: {
        county: "Kisii",
        town: "Kisii Town",
        estate: "Mwembe",
      },
      businessRegistrationNumber: `BN-KS-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      verificationStatus: "Verified",
      walletBalance: 0,
      tokenBalance: 50,
      mpesaNumber: phone,
      status: "Approved",
      joinedDate: new Date().toISOString().split("T")[0],
    };

    setTimeout(() => {
      saveVendor(newVendor);
      localStorage.setItem("current_vendor", JSON.stringify(newVendor));
      setIsSubmitting(false);
      router.push("/vendor/dashboard");
    }, 800);
  };

  return (
    <div className="container" style={{ padding: "4rem 0 5rem", maxWidth: "560px" }}>
      <div className="panel" style={{ padding: "3rem 2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "8px" }}>☁️</div>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--text-main)" }}>
            Studio Registration
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginTop: "4px" }}>
            Join <strong>Dr. Mia Store</strong> as an artisan or comfort brand partner.
          </p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Mia Kimani"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Studio / Brand Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Mia Studio"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Studio Location / Suite *</label>
            <input
              type="text"
              required
              placeholder="e.g. Suite 3A, Westlands, Nairobi"
              value={stallNumber}
              onChange={(e) => setStallNumber(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input
              type="tel"
              required
              placeholder="e.g. 0700 123 456"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Studio Email</label>
            <input
              type="email"
              placeholder="e.g. studio@drmia.store"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Primary Collection Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
            >
              <option value="Puffy Bags & Totes">Puffy Bags & Totes</option>
              <option value="Cloud Pillows & Living">Cloud Pillows & Living</option>
              <option value="Plushies & Toys">Plushies & Toys</option>
              <option value="Care & Wellness">Care & Wellness</option>
              <option value="Soft Wear">Soft Wear</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
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
            disabled={isSubmitting}
            className="btn-primary"
            style={{ width: "100%", padding: "14px", marginTop: "1rem", fontSize: "1.05rem" }}
          >
            {isSubmitting ? "Onboarding Studio..." : "Register Studio & Enter Hub"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.9rem" }}>
          Already registered?{" "}
          <Link href="/vendor/login" style={{ color: "var(--primary)", fontWeight: 700 }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
