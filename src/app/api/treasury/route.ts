import { NextResponse } from "next/server";
import { getTreasuryRecord, withdrawAdminCommissionRecord } from "@/lib/serverDb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const treasury = getTreasuryRecord();
    return NextResponse.json({ success: true, treasury });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, phone } = body;
    if (!amount || !phone) {
      return NextResponse.json({ success: false, message: "Amount and phone required" }, { status: 400 });
    }

    const result = withdrawAdminCommissionRecord(Number(amount), phone);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
