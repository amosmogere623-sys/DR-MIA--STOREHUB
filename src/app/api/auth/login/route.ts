import { NextResponse } from "next/server";
import { findUserRecord } from "@/lib/serverDb";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Special case: Platform Owner Admin
    if (role === "admin" || cleanEmail === "amosbosire@gmail.com") {
      if (cleanEmail === "amosbosire@gmail.com" && (password === "amo123" || password === "admin123")) {
        return NextResponse.json({
          success: true,
          profile: {
            id: "admin-amos",
            name: "Amos Bosire (Platform Owner)",
            email: "amosbosire@gmail.com",
            phone: "0711 000 999",
            role: "admin",
            location: { county: "Kisii", town: "Kisii Town", estate: "Milimani" },
            createdAt: "2026-01-01",
          },
        });
      } else {
        return NextResponse.json({ success: false, error: "Invalid admin email or password" }, { status: 401 });
      }
    }

    const record = findUserRecord(cleanEmail);
    if (!record || record.password !== password) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }

    if (role && record.profile.role !== role) {
      return NextResponse.json(
        { success: false, error: `This account is registered as a ${record.profile.role}, not a ${role}` },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: record.profile,
      vendorData: record.vendorData,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
