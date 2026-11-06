import { NextResponse } from "next/server";
import { getAllUsers, saveUserRecord, findUserRecord, saveVendorRecord } from "@/lib/serverDb";
import { UserProfile } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    let users = getAllUsers();
    if (role) {
      users = users.filter((u) => u.role === role);
    }

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, profile, vendorData } = body;

    if (!email || !password || !profile) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const existing = findUserRecord(email);
    if (existing) {
      return NextResponse.json({ success: false, error: "An account with this email already exists" }, { status: 409 });
    }

    const userProfile: UserProfile = {
      id: profile.id || `${profile.role || "buyer"}-${Date.now()}`,
      name: profile.name,
      email: email.trim().toLowerCase(),
      phone: profile.phone || "—",
      role: profile.role || "buyer",
      location: profile.location || { county: "Kisii", town: "Kisii Town", estate: "Mwembe" },
      avatar: profile.avatar,
      createdAt: profile.createdAt || new Date().toISOString().split("T")[0],
    };

    saveUserRecord(email, {
      profile: userProfile,
      password,
      vendorData,
    });

    // If it's a vendor, also ensure vendor record exists in vendors list
    if (vendorData) {
      saveVendorRecord(vendorData);
    }

    return NextResponse.json({ success: true, profile: userProfile });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
