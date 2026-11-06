import fs from "fs";
import path from "path";
import { Product, Vendor, Order, AdminTreasury, UserProfile } from "../types";

export interface StoredUserRecord {
  profile: UserProfile;
  password: string;
  vendorData?: Vendor;
}

export interface ServerDB {
  users: Record<string, StoredUserRecord>;
  vendors: Vendor[];
  products: Product[];
  orders: Order[];
  treasury: AdminTreasury;
}

const DB_FILE_PATH = path.join(process.cwd(), "src", "lib", "db.json");

const DEFAULT_DB: ServerDB = {
  users: {
    "amosbosire@gmail.com": {
      profile: {
        id: "admin-amos",
        name: "Amos Bosire (Platform Owner)",
        email: "amosbosire@gmail.com",
        phone: "0711 000 999",
        role: "admin",
        location: { county: "Kisii", town: "Kisii Town", estate: "Milimani" },
        createdAt: "2026-01-01",
      },
      password: "amo123",
    },
  },
  vendors: [],
  products: [],
  orders: [],
  treasury: {
    commissionBalance: 0,
    totalWithdrawn: 0,
    adminMpesaNumber: "0711 000 999",
  },
};

// Global in-memory cache to ensure fast responses and consistency
let memoryCache: ServerDB | null = null;

export function getDatabase(): ServerDB {
  if (memoryCache) {
    return memoryCache;
  }

  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
      if (raw.trim()) {
        const parsed = JSON.parse(raw);
        memoryCache = {
          users: parsed.users || DEFAULT_DB.users,
          vendors: parsed.vendors || [],
          products: parsed.products || [],
          orders: parsed.orders || [],
          treasury: parsed.treasury || DEFAULT_DB.treasury,
        };
        // Always ensure admin exists
        if (!memoryCache.users["amosbosire@gmail.com"]) {
          memoryCache.users["amosbosire@gmail.com"] = DEFAULT_DB.users["amosbosire@gmail.com"];
        }
        return memoryCache;
      }
    }
  } catch (err) {
    console.error("Error reading db.json, using fallback:", err);
  }

  memoryCache = JSON.parse(JSON.stringify(DEFAULT_DB));
  saveDatabase(memoryCache!);
  return memoryCache!;
}

export function saveDatabase(db: ServerDB): void {
  memoryCache = db;
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing db.json:", err);
  }
}

// ── USERS ─────────────────────────────────────────────────────────────
export function getAllUsers(): UserProfile[] {
  const db = getDatabase();
  return Object.values(db.users).map((u) => u.profile);
}

export function findUserRecord(emailOrPhone: string): StoredUserRecord | undefined {
  const db = getDatabase();
  const key = emailOrPhone.trim().toLowerCase();
  if (db.users[key]) return db.users[key];

  // Also check if phone matches
  const cleanPhone = emailOrPhone.replace(/\s+/g, "");
  for (const record of Object.values(db.users)) {
    if (record.profile.phone && record.profile.phone.replace(/\s+/g, "") === cleanPhone) {
      return record;
    }
  }
  return undefined;
}

export function saveUserRecord(email: string, record: StoredUserRecord): void {
  const db = getDatabase();
  db.users[email.trim().toLowerCase()] = record;
  saveDatabase(db);
}

// ── VENDORS ───────────────────────────────────────────────────────────
export function getAllVendors(): Vendor[] {
  const db = getDatabase();
  return db.vendors;
}

export function saveVendorRecord(vendor: Vendor): void {
  const db = getDatabase();
  const index = db.vendors.findIndex((v) => v.id === vendor.id);
  if (index >= 0) {
    db.vendors[index] = vendor;
  } else {
    db.vendors.unshift(vendor);
  }
  saveDatabase(db);
}

export function updateVendorRecordStatus(
  vendorId: string,
  status?: Vendor["status"],
  verification?: Vendor["verificationStatus"]
): boolean {
  const db = getDatabase();
  const vendor = db.vendors.find((v) => v.id === vendorId);
  if (!vendor) return false;
  if (status) vendor.status = status;
  if (verification) vendor.verificationStatus = verification;
  saveDatabase(db);
  return true;
}

// ── PRODUCTS ──────────────────────────────────────────────────────────
export function getAllProducts(): Product[] {
  const db = getDatabase();
  return db.products;
}

export function saveProductRecord(product: Product): void {
  const db = getDatabase();
  const index = db.products.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    db.products[index] = product;
  } else {
    db.products.unshift(product);
  }
  saveDatabase(db);
}

export function deleteProductRecord(productId: string): boolean {
  const db = getDatabase();
  const len = db.products.length;
  db.products = db.products.filter((p) => p.id !== productId);
  if (db.products.length !== len) {
    saveDatabase(db);
    return true;
  }
  return false;
}

export function toggleProductInStockRecord(productId: string): boolean {
  const db = getDatabase();
  const product = db.products.find((p) => p.id === productId);
  if (product) {
    product.inStock = !product.inStock;
    saveDatabase(db);
    return product.inStock;
  }
  return false;
}

// ── ORDERS ────────────────────────────────────────────────────────────
export function getAllOrders(): Order[] {
  const db = getDatabase();
  return db.orders;
}

export function saveOrderRecord(order: Order): void {
  const db = getDatabase();
  const index = db.orders.findIndex((o) => o.id === order.id);
  if (index >= 0) {
    db.orders[index] = order;
  } else {
    db.orders.unshift(order);
  }
  saveDatabase(db);
}

export function updateOrderStatusRecord(orderId: string, status: Order["orderStatus"]): boolean {
  const db = getDatabase();
  const order = db.orders.find((o) => o.id === orderId);
  if (order) {
    order.orderStatus = status;
    saveDatabase(db);
    return true;
  }
  return false;
}

export function releaseEscrowWithKeyRecord(
  orderId: string,
  enteredKey: string
): { success: boolean; message: string; vendorAmount?: number; commission?: number } {
  const db = getDatabase();
  const order = db.orders.find((o) => o.id === orderId);

  if (!order) {
    return { success: false, message: "Order not found." };
  }

  if (order.escrowStatus === "RELEASED_TO_VENDOR") {
    return { success: false, message: "Payment has already been released for this order." };
  }

  if (order.escrowReleaseKey.trim().toUpperCase() !== enteredKey.trim().toUpperCase()) {
    return { success: false, message: "Invalid Pickup Code! Please check with customer." };
  }

  order.escrowStatus = "RELEASED_TO_VENDOR";
  order.orderStatus = "Delivered";
  order.escrowReleasedAt = new Date().toISOString().replace("T", " ").substring(0, 16);

  // Credit vendor wallet
  const vendor = db.vendors.find((v) => v.id === order.items[0]?.vendorId);
  if (vendor) {
    vendor.walletBalance = (vendor.walletBalance || 0) + order.vendorPayoutAmount;
  }

  // Credit admin platform treasury commission (10%)
  db.treasury.commissionBalance = (db.treasury.commissionBalance || 0) + order.platformCommission;

  saveDatabase(db);

  return {
    success: true,
    message: `Verified! KSh ${order.vendorPayoutAmount.toLocaleString()} released to vendor. Platform fee KSh ${order.platformCommission.toLocaleString()} recorded.`,
    vendorAmount: order.vendorPayoutAmount,
    commission: order.platformCommission,
  };
}

export function buyerConfirmOrderRecord(
  orderId: string
): { success: boolean; message: string; vendorAmount?: number; commission?: number } {
  const db = getDatabase();
  const order = db.orders.find((o) => o.id === orderId);

  if (!order) {
    return { success: false, message: "Order not found." };
  }

  if (order.escrowStatus === "RELEASED_TO_VENDOR") {
    return { success: false, message: "Payment has already been released for this order." };
  }

  order.buyerReleasedPayment = true;
  order.escrowStatus = "RELEASED_TO_VENDOR";
  order.orderStatus = "Delivered";
  order.escrowReleasedAt = new Date().toISOString().replace("T", " ").substring(0, 16);

  const vendor = db.vendors.find((v) => v.id === order.items[0]?.vendorId);
  if (vendor) {
    vendor.walletBalance = (vendor.walletBalance || 0) + order.vendorPayoutAmount;
  }

  db.treasury.commissionBalance = (db.treasury.commissionBalance || 0) + order.platformCommission;
  saveDatabase(db);

  return {
    success: true,
    message: `Order confirmed! KSh ${order.vendorPayoutAmount.toLocaleString()} released to vendor.`,
    vendorAmount: order.vendorPayoutAmount,
    commission: order.platformCommission,
  };
}

// ── TREASURY ──────────────────────────────────────────────────────────
export function getTreasuryRecord(): AdminTreasury {
  const db = getDatabase();
  return db.treasury;
}

export function withdrawAdminCommissionRecord(
  amount: number,
  mpesaPhone: string
): { success: boolean; message: string } {
  const db = getDatabase();
  if (amount <= 0 || amount > db.treasury.commissionBalance) {
    return { success: false, message: "Amount exceeds available balance." };
  }

  db.treasury.commissionBalance -= amount;
  db.treasury.totalWithdrawn += amount;
  db.treasury.lastWithdrawalDate = new Date().toISOString().split("T")[0];
  db.treasury.adminMpesaNumber = mpesaPhone;
  saveDatabase(db);

  return {
    success: true,
    message: `KSh ${amount.toLocaleString()} transferred to Admin M-Pesa (${mpesaPhone}) successfully!`,
  };
}
