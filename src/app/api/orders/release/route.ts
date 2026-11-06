import { NextResponse } from "next/server";
import { releaseEscrowWithKeyRecord, buyerConfirmOrderRecord } from "@/lib/serverDb";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, key, action } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, message: "Order ID required" }, { status: 400 });
    }

    if (action === "buyerConfirm") {
      const result = buyerConfirmOrderRecord(orderId);
      return NextResponse.json(result);
    } else {
      if (!key) {
        return NextResponse.json({ success: false, message: "Pickup confirmation code required" }, { status: 400 });
      }
      const result = releaseEscrowWithKeyRecord(orderId, key);
      return NextResponse.json(result);
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
