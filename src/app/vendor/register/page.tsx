"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveVendor } from "../../../lib/data";
import { useAuth } from "../../../context/AuthContext";
import { KENYA_COUNTIES_DATA, getTownsByCounty, getEstatesByTown } from "../../../lib/locations";
import { Vendor, KenyaLocation, UserProfile } from "../../../types";

export default function VendorRegisterPage() {
  const router = useRouter();
  const { loginAs } = useAuth();
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [stallNumber, setStallNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Bags & Totes");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [shopPhoto, setShopPhoto] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShopPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_DIM = 800;
        let w = img.width;
        let h = img.height;
        if (w > h && w > MAX_DIM) {
          h = Math.round((h * MAX_DIM) / w);
          w = MAX_DIM;
        } else if (h > MAX_DIM) {
          w = Math.round((w * MAX_DIM) / h);
          h = MAX_DIM;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, w, h);
        setShopPhoto(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Kenya location selectors
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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) { setErrorMsg("Please enter your full name."); return; }
    if (!businessName.trim()) { setErrorMsg("Please enter your shop or business name."); return; }
    if (!stallNumber.trim()) { setErrorMsg("Please enter your stall location or room number."); return; }
    if (!phone.trim()) { setErrorMsg("Please enter your phone number."); return; }
    if (password.length < 6) { setErrorMsg("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setErrorMsg("Passwords do not match."); return; }

    setIsSubmitting(true);

    const vendorLoc: KenyaLocation = { county, town, estate };
    const vendorId = "v-" + Date.now();
    const vendorEmail = email.trim() || `vendor-${Date.now()}@sokolink.co.ke`;

    const newVendor: Vendor = {
      id: vendorId,
      name: name.trim(),
      businessName: businessName.trim(),
      stallNumber: stallNumber.trim(),
      phone: phone.trim(),
      email: vendorEmail,
      category,
      location: vendorLoc,
      businessRegistrationNumber: `BN-${county.substring(0, 2).toUpperCase()}-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      verificationStatus: "Verified",
      walletBalance: 0,
      tokenBalance: 50,
      mpesaNumber: phone.trim(),
      status: "Approved",
      shopFrontImageUrl: shopPhoto || undefined,
      joinedDate: new Date().toISOString().split("T")[0],
    };

    const userProfile: UserProfile = {
      id: vendorId,
      name: name.trim(),
      email: vendorEmail,
      phone: phone.trim(),
      role: "vendor",
      location: vendorLoc,
      createdAt: newVendor.joinedDate,
    };

    setTimeout(() => {
      // 1. Save vendor to vendors list
      saveVendor(newVendor);
      localStorage.setItem("current_vendor", JSON.stringify(newVendor));

      // 2. Save user to registered users for future login
      try {
        const users = JSON.parse(localStorage.getItem("sokolink_users") || "{}");
        users[vendorEmail.toLowerCase()] = {
          profile: userProfile,
          password: password,
          vendorData: newVendor,
        };
        // Also index by phone for convenience
        users[phone.trim().replace(/\s+/g, "")] = {
          profile: userProfile,
          password: password,
          vendorData: newVendor,
        };
        localStorage.setItem("sokolink_users", JSON.stringify(users));
      } catch (err) {
        console.error(err);
      }

      // 3. Log user in via AuthContext
      loginAs(userProfile);
      setIsSubmitting(false);
      router.push("/vendor/dashboard");
    }, 600);
  };

  return (
    <div className="container" style={{ padding: "4rem 0 5rem", maxWidth: "580px" }}>
      <div className="panel" style={{ padding: "3rem 2.5rem", borderRadius: "26px", border: "2px solid #86efac", boxShadow: "0 20px 50px rgba(22, 163, 74, 0.12)" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "8px" }}>🏪</div>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--text-main)" }}>
            Register Your Physical Shop
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginTop: "4px" }}>
            Join <strong>SokoLink</strong> as a verified Kenyan local vendor.
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #ef4444",
              color: "#991b1b",
              padding: "10px 14px",
              borderRadius: "12px",
              fontSize: "0.85rem",
              fontWeight: 700,
              marginBottom: "1.25rem",
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Full Name of Shop Owner *</label>
            <input
              type="text"
              required
              placeholder="e.g. John Mwangi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Shop / Business Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Kimani Hardware & General Supplies"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Shop Stall / Street / Room *</label>
            <input
              type="text"
              required
              placeholder="e.g. Stall 14, Mwembe Market Plaza"
              value={stallNumber}
              onChange={(e) => setStallNumber(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Safaricom Phone Number (for M-Pesa payouts) *</label>
            <input
              type="tel"
              required
              placeholder="e.g. 0712 345 678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address (optional)</label>
            <input
              type="email"
              placeholder="e.g. mystall@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Kenya Location Selector */}
          <div
            style={{
              background: "#f0fdf4",
              padding: "1.25rem",
              borderRadius: "16px",
              border: "1.5px solid #86efac",
              margin: "1.25rem 0",
            }}
          >
            <label style={{ fontSize: "0.85rem", fontWeight: 800, color: "#166534", display: "block", marginBottom: "8px" }}>
              📍 Physical Shop Location in Kenya:
            </label>
            <div className="responsive-grid-3">
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, display: "block", marginBottom: "3px" }}>County</label>
                <select
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="form-select"
                  style={{ padding: "8px", fontSize: "0.82rem" }}
                >
                  {KENYA_COUNTIES_DATA.map((c) => (
                    <option key={c.county} value={c.county}>
                      {c.county}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, display: "block", marginBottom: "3px" }}>Town</label>
                <select
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  className="form-select"
                  style={{ padding: "8px", fontSize: "0.82rem" }}
                >
                  {availableTowns.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, display: "block", marginBottom: "3px" }}>Estate</label>
                <select
                  value={estate}
                  onChange={(e) => setEstate(e.target.value)}
                  className="form-select"
                  style={{ padding: "8px", fontSize: "0.82rem" }}
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

          <div className="form-group">
            <label className="form-label">Primary Product Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
            >
              <option value="Bags & Totes">Bags &amp; Totes</option>
              <option value="Pillows & Bedding">Pillows &amp; Bedding</option>
              <option value="Plushies & Toys">Plushies &amp; Toys</option>
              <option value="Care & Beauty">Care &amp; Beauty</option>
              <option value="Shoes & Clothes">Shoes &amp; Clothes</option>
              <option value="Food & Groceries">Food &amp; Groceries</option>
              <option value="Electronics">Electronics</option>
              <option value="Hardware & Tools">Hardware &amp; Tools</option>
            </select>
          </div>

          {/* Shop Stall Photo from Device */}
          <div className="form-group">
            <label className="form-label">Shop Stall Photo (Upload from Phone/Device - Optional)</label>
            {shopPhoto ? (
              <div style={{ position: "relative", borderRadius: "14px", overflow: "hidden", border: "2px solid #86efac", maxHeight: "160px", marginBottom: "8px" }}>
                <img src={shopPhoto} alt="Shop stall preview" style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", bottom: "8px", right: "8px", display: "flex", gap: "6px" }}>
                  <label className="btn-secondary" style={{ padding: "4px 10px", fontSize: "0.75rem", cursor: "pointer", background: "white" }}>
                    🔄 Change Photo
                    <input type="file" accept="image/*" onChange={handleShopPhotoSelect} style={{ display: "none" }} />
                  </label>
                  <button type="button" onClick={() => setShopPhoto("")} style={{ background: "#ef4444", color: "white", border: "none", padding: "4px 10px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>
                    ✕ Remove
                  </button>
                </div>
              </div>
            ) : (
              <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem 1rem", border: "2px dashed #86efac", borderRadius: "14px", background: "#f0fdf4", cursor: "pointer", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "4px" }}>📸</div>
                <strong style={{ fontSize: "0.88rem", color: "#166534" }}>Tap to Upload Stall / Shop Front Photo</strong>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Choose from phone gallery or take photo</span>
                <input type="file" accept="image/*" onChange={handleShopPhotoSelect} style={{ display: "none" }} />
              </label>
            )}
          </div>

          <div className="responsive-grid-2">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                required
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                required
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{ width: "100%", padding: "14px", marginTop: "1rem", fontSize: "1.05rem", background: "#16a34a", borderColor: "#16a34a" }}
          >
            {isSubmitting ? "Registering Shop..." : "Register Shop & Open Stall Hub →"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.9rem" }}>
          Already have a shop account?{" "}
          <Link href="/vendor/login" style={{ color: "#16a34a", fontWeight: 700 }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
