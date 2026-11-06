import { NextResponse } from "next/server";
import { getAllVendors, saveVendorRecord, updateVendorRecordStatus } from "@/lib/serverDb";
import { Vendor } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const vendors = getAllVendors();
    return NextResponse.json({ success: true, vendors });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const vendor: Vendor = {
      id: body.id || `v-${Date.now()}`,
      name: body.name,
      businessName: body.businessName,
      stallNumber: body.stallNumber,
      phone: body.phone,
      email: body.email,
      category: body.category || "General Goods",
      location: body.location,
      businessRegistrationNumber: body.businessRegistrationNumber || `BN-${Date.now()}`,
      shopPermitUrl: body.shopPermitUrl,
      shopFrontImageUrl: body.shopFrontImageUrl,
      qualityCertificateUrl: body.qualityCertificateUrl,
      verificationStatus: body.verificationStatus || "Verified",
      walletBalance: Number(body.walletBalance || 0),
      tokenBalance: Number(body.tokenBalance || 10),
      mpesaNumber: body.mpesaNumber || body.phone,
      status: body.status || "Approved",
      joinedDate: body.joinedDate || new Date().toISOString().split("T")[0],
    };

    saveVendorRecord(vendor);
    return NextResponse.json({ success: true, vendor });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, verificationStatus } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: "Vendor id required" }, { status: 400 });
    }

    const updated = updateVendorRecordStatus(id, status, verificationStatus);
    return NextResponse.json({ success: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
