import { NextResponse } from "next/server";
import { getAllProducts, saveProductRecord, deleteProductRecord, toggleProductInStockRecord } from "@/lib/serverDb";
import { Product } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get("vendorId");
    const category = searchParams.get("category");

    let products = getAllProducts();

    if (vendorId) {
      products = products.filter((p) => p.vendorId === vendorId);
    }
    if (category && category !== "All") {
      products = products.filter((p) => p.category === category);
    }

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product: Product = {
      id: body.id || `prod-${Date.now()}`,
      name: body.name,
      description: body.description || "",
      price: Number(body.price),
      unit: body.unit || "pc",
      category: body.category || "Bags & Totes",
      image: body.image,
      vendorId: body.vendorId,
      vendorName: body.vendorName,
      stallLocation: body.stallLocation || "",
      location: body.location,
      inStock: body.inStock !== false,
      stockQuantity: Number(body.stockQuantity || 1),
      rating: body.rating || 5.0,
      badge: body.badge || "In Stock",
      isPromoted: Boolean(body.isPromoted),
    };

    saveProductRecord(product);
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: "Product id required" }, { status: 400 });
    }

    const inStock = toggleProductInStockRecord(id);
    return NextResponse.json({ success: true, inStock });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Product id required" }, { status: 400 });
    }

    const deleted = deleteProductRecord(id);
    return NextResponse.json({ success: true, deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
