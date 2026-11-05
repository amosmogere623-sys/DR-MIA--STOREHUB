import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container" style={{ padding: "5rem 0", textAlign: "center" }}>
      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🍃</div>
      <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>Page Not Found (404)</h1>
      <p style={{ color: "var(--text-muted)", marginTop: "8px", maxWidth: "450px", margin: "8px auto 2rem" }}>
        We couldn&apos;t find the market page or produce you are looking for.
      </p>
      <Link href="/" className="btn-primary" style={{ padding: "12px 24px" }}>
        Back to Marketplace Home
      </Link>
    </div>
  );
}
