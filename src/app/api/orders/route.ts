import { NextResponse } from "next/server";
import { getAllOrders, saveOrderRecord, updateOrderStatusRecord } from "@/lib/serverDb";
import { Order } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const buyerId = searchParams.get("buyerId");
    const vendorId = searchParams.get("vendorId");

    let orders = getAllOrders();

    if (buyerId) {
      orders = orders.filter((o) => o.buyerId === buyerId || o.buyerEmail === buyerId);
    }
    if (vendorId) {
      orders = orders.filter((o) => o.items.some((item) => item.vendorId === vendorId));
    }

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const orderTotal = Number(body.total || body.subtotal || 0);
    const platformCommission = Math.round(orderTotal * 0.10);
    const vendorPayoutAmount = orderTotal - platformCommission;

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const pickupKey = body.escrowReleaseKey || `ESC-SKL-${randomSuffix}`;

    const order: Order = {
      id: body.id || `MIA-${Math.floor(10000 + Math.random() * 90000)}`,
      buyerId: body.buyerId,
      buyerName: body.buyerName,
      buyerPhone: body.buyerPhone,
      buyerEmail: body.buyerEmail,
      buyerLocation: body.buyerLocation,
      deliveryAddress: body.deliveryAddress,
      notes: body.notes,
      paymentMethod: body.paymentMethod || "mpesa",
      paymentStatus: body.paymentStatus || "Paid",
      orderStatus: body.orderStatus || "Ready for Pickup",
      items: body.items || [],
      subtotal: Number(body.subtotal || 0),
      deliveryFee: Number(body.deliveryFee || 0),
      total: orderTotal,
      escrowStatus: body.escrowStatus || "HELD_IN_ESCROW",
      escrowReleaseKey: pickupKey,
      vendorPayoutAmount,
      platformCommission,
      unlockedVendorContacts: body.unlockedVendorContacts || [],
      fraudAnalysis: body.fraudAnalysis || {
        riskScore: 2,
        riskLevel: "LOW",
        flags: ["Verified order", "Customer M-Pesa verified"],
        recommendation: "APPROVE",
        analyzedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      },
      createdAt: body.createdAt || new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    saveOrderRecord(order);
    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, orderStatus } = body;
    if (!id || !orderStatus) {
      return NextResponse.json({ success: false, error: "Order id and status required" }, { status: 400 });
    }

    const updated = updateOrderStatusRecord(id, orderStatus);
    return NextResponse.json({ success: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
