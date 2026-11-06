import { Product, Order, Vendor, CartItem, AdminTreasury, KenyaLocation, UserProfile } from "../types";

// Empty initial arrays — NO DEMO PRODUCTS OR VENDORS
export const INITIAL_PRODUCTS: Product[] = [];
export const INITIAL_VENDORS: Vendor[] = [];

// Storage keys
const PRODUCTS_KEY = "sokolink_v4_products";
const VENDORS_KEY = "sokolink_v4_vendors";
const ORDERS_KEY = "sokolink_v4_orders";
const CART_KEY = "sokolink_v4_cart";
const TREASURY_KEY = "sokolink_v4_treasury";
const MIGRATION_FLAG = "sokolink_v4_migrated";

// Purge any legacy demo data from client localStorage on first load
function runLegacyCleanup(): void {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(MIGRATION_FLAG) !== "true") {
      // Remove all legacy keys
      localStorage.removeItem("drmia_v3_products");
      localStorage.removeItem("drmia_v3_vendors");
      localStorage.removeItem("drmia_v3_orders");
      localStorage.removeItem("drmia_v3_treasury");
      localStorage.removeItem("drmia_v3_cart");
      localStorage.removeItem("drmia_orders");
      localStorage.removeItem("drmia_vendors");
      localStorage.removeItem("drmia_products");
      localStorage.removeItem("sokolink_users");
      localStorage.setItem(MIGRATION_FLAG, "true");
    }
  } catch (e) {
    // Ignore storage errors
  }
}

// ── SYNC ENGINE: Pulls live shared state from Next.js server API ──────────────
let isSyncing = false;
export async function syncAllFromServer(): Promise<void> {
  if (typeof window === "undefined" || isSyncing) return;
  isSyncing = true;
  runLegacyCleanup();

  try {
    // Fetch products, vendors, orders, and treasury in parallel
    const [prodRes, vendRes, ordRes, treasRes] = await Promise.allSettled([
      fetch("/api/products", { cache: "no-store" }),
      fetch("/api/vendors", { cache: "no-store" }),
      fetch("/api/orders", { cache: "no-store" }),
      fetch("/api/treasury", { cache: "no-store" }),
    ]);

    if (prodRes.status === "fulfilled" && prodRes.value.ok) {
      const data = await prodRes.value.json();
      if (data.success && Array.isArray(data.products)) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(data.products));
        window.dispatchEvent(new Event("productsUpdated"));
      }
    }

    if (vendRes.status === "fulfilled" && vendRes.value.ok) {
      const data = await vendRes.value.json();
      if (data.success && Array.isArray(data.vendors)) {
        localStorage.setItem(VENDORS_KEY, JSON.stringify(data.vendors));
        window.dispatchEvent(new Event("vendorsUpdated"));
      }
    }

    if (ordRes.status === "fulfilled" && ordRes.value.ok) {
      const data = await ordRes.value.json();
      if (data.success && Array.isArray(data.orders)) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(data.orders));
        window.dispatchEvent(new Event("ordersUpdated"));
      }
    }

    if (treasRes.status === "fulfilled" && treasRes.value.ok) {
      const data = await treasRes.value.json();
      if (data.success && data.treasury) {
        localStorage.setItem(TREASURY_KEY, JSON.stringify(data.treasury));
        window.dispatchEvent(new Event("treasuryUpdated"));
      }
    }
  } catch (err) {
    console.error("syncAllFromServer error:", err);
  } finally {
    isSyncing = false;
  }
}

// ── PRODUCTS ────────────────────────────────────────────────────────────────
export function getStoredProducts(): Product[] {
  if (typeof window === "undefined") return [];
  runLegacyCleanup();
  try {
    const data = localStorage.getItem(PRODUCTS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function saveProduct(product: Product): void {
  if (typeof window === "undefined") return;
  runLegacyCleanup();
  const products = getStoredProducts();
  const index = products.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    products[index] = product;
  } else {
    products.unshift(product);
  }
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event("productsUpdated"));

  // Sync to server so all other devices receive this product
  fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  }).catch((e) => console.error("Error saving product to server:", e));
}

export function deleteProduct(productId: string): void {
  if (typeof window === "undefined") return;
  const products = getStoredProducts().filter((p) => p.id !== productId);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event("productsUpdated"));

  fetch(`/api/products?id=${encodeURIComponent(productId)}`, {
    method: "DELETE",
  }).catch((e) => console.error("Error deleting product on server:", e));
}

export function toggleProductInStock(productId: string): boolean {
  if (typeof window === "undefined") return false;
  const products = getStoredProducts();
  const prod = products.find((p) => p.id === productId);
  if (prod) {
    prod.inStock = !prod.inStock;
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event("productsUpdated"));

    fetch("/api/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: productId }),
    }).catch((e) => console.error("Error updating stock on server:", e));

    return prod.inStock;
  }
  return false;
}

export function getSortedProductsByProximity(userLoc?: KenyaLocation): Product[] {
  const products = getStoredProducts();
  if (!userLoc) {
    return products.sort((a, b) => (b.isPromoted ? 1 : 0) - (a.isPromoted ? 1 : 0));
  }

  return [...products].sort((a, b) => {
    if (a.isPromoted && !b.isPromoted) return -1;
    if (!a.isPromoted && b.isPromoted) return 1;

    const aEstate = a.location.estate.toLowerCase() === userLoc.estate.toLowerCase();
    const bEstate = b.location.estate.toLowerCase() === userLoc.estate.toLowerCase();
    if (aEstate && !bEstate) return -1;
    if (!aEstate && bEstate) return 1;

    const aTown = a.location.town.toLowerCase() === userLoc.town.toLowerCase();
    const bTown = b.location.town.toLowerCase() === userLoc.town.toLowerCase();
    if (aTown && !bTown) return -1;
    if (!aTown && bTown) return 1;

    const aCounty = a.location.county.toLowerCase() === userLoc.county.toLowerCase();
    const bCounty = b.location.county.toLowerCase() === userLoc.county.toLowerCase();
    if (aCounty && !bCounty) return -1;
    if (!aCounty && bCounty) return 1;

    return 0;
  });
}

export function boostProductWithTokens(productId: string, vendorId: string, tokens: number): boolean {
  if (typeof window === "undefined") return false;
  const vendors = getStoredVendors();
  const vendor = vendors.find((v) => v.id === vendorId);
  if (!vendor || vendor.tokenBalance < tokens) return false;

  vendor.tokenBalance -= tokens;
  localStorage.setItem(VENDORS_KEY, JSON.stringify(vendors));

  const products = getStoredProducts();
  const prod = products.find((p) => p.id === productId);
  if (prod) {
    prod.isPromoted = true;
    prod.tokensSpent = (prod.tokensSpent || 0) + tokens;
    prod.badge = "⭐ PROMOTED";
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    saveProduct(prod);
  }
  window.dispatchEvent(new Event("productsUpdated"));
  return true;
}

// ── VENDORS ─────────────────────────────────────────────────────────────────
export function getStoredVendors(): Vendor[] {
  if (typeof window === "undefined") return [];
  runLegacyCleanup();
  try {
    const data = localStorage.getItem(VENDORS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function saveVendor(vendor: Vendor): void {
  if (typeof window === "undefined") return;
  runLegacyCleanup();
  const vendors = getStoredVendors();
  const index = vendors.findIndex((v) => v.id === vendor.id);
  if (index >= 0) {
    vendors[index] = vendor;
  } else {
    vendors.unshift(vendor);
  }
  localStorage.setItem(VENDORS_KEY, JSON.stringify(vendors));
  window.dispatchEvent(new Event("vendorsUpdated"));

  // Send to server so all devices and admin see this vendor
  fetch("/api/vendors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vendor),
  }).catch((e) => console.error("Error saving vendor to server:", e));
}

export function updateVendorStatus(vendorId: string, status: Vendor["status"]): void {
  if (typeof window === "undefined") return;
  const vendors = getStoredVendors();
  const vendor = vendors.find((v) => v.id === vendorId);
  if (vendor) {
    vendor.status = status;
    localStorage.setItem(VENDORS_KEY, JSON.stringify(vendors));
    window.dispatchEvent(new Event("vendorsUpdated"));

    fetch("/api/vendors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: vendorId, status }),
    }).catch((e) => console.error("Error updating vendor on server:", e));
  }
}

export function verifyVendorShop(vendorId: string, status: "Verified" | "Rejected"): void {
  if (typeof window === "undefined") return;
  const vendors = getStoredVendors();
  const vendor = vendors.find((v) => v.id === vendorId);
  if (vendor) {
    vendor.verificationStatus = status;
    localStorage.setItem(VENDORS_KEY, JSON.stringify(vendors));
    window.dispatchEvent(new Event("vendorsUpdated"));

    fetch("/api/vendors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: vendorId, verificationStatus: status }),
    }).catch((e) => console.error("Error verifying vendor on server:", e));
  }
}

// ── ORDERS ──────────────────────────────────────────────────────────────────
export function getStoredOrders(): Order[] {
  if (typeof window === "undefined") return [];
  runLegacyCleanup();
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function saveOrder(order: Order): void {
  if (typeof window === "undefined") return;
  runLegacyCleanup();
  const orders = getStoredOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event("ordersUpdated"));

  // Send to server so admin and vendor dashboards receive it immediately
  fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  }).catch((e) => console.error("Error saving order to server:", e));
}

export function updateOrderStatus(orderId: string, status: Order["orderStatus"]): void {
  if (typeof window === "undefined") return;
  const orders = getStoredOrders();
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    order.orderStatus = status;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event("ordersUpdated"));

    fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, orderStatus: status }),
    }).catch((e) => console.error("Error updating order on server:", e));
  }
}

export function releaseEscrowWithKey(
  orderId: string,
  enteredKey: string
): { success: boolean; message: string; vendorAmount?: number; commission?: number } {
  if (typeof window === "undefined") return { success: false, message: "Window unavailable" };
  const orders = getStoredOrders();
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return { success: false, message: "Order not found." };
  }

  if (order.escrowStatus === "RELEASED_TO_VENDOR") {
    return { success: false, message: "Escrow funds have already been released for this order." };
  }

  if (order.escrowReleaseKey.trim().toUpperCase() !== enteredKey.trim().toUpperCase()) {
    return { success: false, message: "Invalid Pickup Code! Please check with customer." };
  }

  order.escrowStatus = "RELEASED_TO_VENDOR";
  order.orderStatus = "Delivered";
  order.escrowReleasedAt = new Date().toISOString().replace("T", " ").substring(0, 16);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

  const vendors = getStoredVendors();
  const vendor = vendors.find((v) => v.id === order.items[0]?.vendorId) || vendors[0];
  if (vendor) {
    vendor.walletBalance = (vendor.walletBalance || 0) + order.vendorPayoutAmount;
    localStorage.setItem(VENDORS_KEY, JSON.stringify(vendors));
  }

  const treasury = getAdminTreasury();
  treasury.commissionBalance = (treasury.commissionBalance || 0) + order.platformCommission;
  saveAdminTreasury(treasury);

  window.dispatchEvent(new Event("ordersUpdated"));
  window.dispatchEvent(new Event("vendorsUpdated"));
  window.dispatchEvent(new Event("treasuryUpdated"));

  // Send release to server
  fetch("/api/orders/release", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, key: enteredKey, action: "vendorKey" }),
  }).catch((e) => console.error("Error syncing release to server:", e));

  return {
    success: true,
    message: `Verified! KSh ${order.vendorPayoutAmount.toLocaleString()} released to vendor. 10% fee (KSh ${order.platformCommission.toLocaleString()}) recorded.`,
    vendorAmount: order.vendorPayoutAmount,
    commission: order.platformCommission,
  };
}

export function buyerAcceptAndReleaseEscrow(
  orderId: string
): { success: boolean; message: string; vendorAmount?: number; commission?: number } {
  if (typeof window === "undefined") return { success: false, message: "Window unavailable" };
  const orders = getStoredOrders();
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return { success: false, message: "Order not found." };
  }

  if (order.escrowStatus === "RELEASED_TO_VENDOR") {
    return { success: false, message: "Payment has already been released to the vendor." };
  }

  order.buyerReleasedPayment = true;
  order.escrowStatus = "RELEASED_TO_VENDOR";
  order.orderStatus = "Delivered";
  order.escrowReleasedAt = new Date().toISOString().replace("T", " ").substring(0, 16);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

  const vendors = getStoredVendors();
  const vendor = vendors.find((v) => v.id === order.items[0]?.vendorId) || vendors[0];
  if (vendor) {
    vendor.walletBalance = (vendor.walletBalance || 0) + order.vendorPayoutAmount;
    localStorage.setItem(VENDORS_KEY, JSON.stringify(vendors));
  }

  const treasury = getAdminTreasury();
  treasury.commissionBalance = (treasury.commissionBalance || 0) + order.platformCommission;
  saveAdminTreasury(treasury);

  window.dispatchEvent(new Event("ordersUpdated"));
  window.dispatchEvent(new Event("vendorsUpdated"));
  window.dispatchEvent(new Event("treasuryUpdated"));

  // Send release to server
  fetch("/api/orders/release", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, action: "buyerConfirm" }),
  }).catch((e) => console.error("Error syncing buyer confirm to server:", e));

  return {
    success: true,
    message: `Order confirmed! KSh ${order.vendorPayoutAmount.toLocaleString()} released to vendor.`,
    vendorAmount: order.vendorPayoutAmount,
    commission: order.platformCommission,
  };
}

export function vendorMarkOrderPickedUp(orderId: string): { success: boolean; message: string } {
  if (typeof window === "undefined") return { success: false, message: "Window unavailable" };
  const orders = getStoredOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) return { success: false, message: "Order not found" };

  order.vendorMarkedPickedUp = true;
  order.orderStatus = "Ready for Pickup";
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event("ordersUpdated"));

  fetch("/api/orders", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: orderId, orderStatus: "Ready for Pickup" }),
  }).catch((e) => console.error("Error updating order picked up on server:", e));

  return {
    success: true,
    message: "Item marked ready for pickup.",
  };
}

// ── TREASURY ────────────────────────────────────────────────────────────────
export function getAdminTreasury(): AdminTreasury {
  const defaultTreasury: AdminTreasury = {
    commissionBalance: 0,
    totalWithdrawn: 0,
    adminMpesaNumber: "0711 000 999",
  };

  if (typeof window === "undefined") return defaultTreasury;
  runLegacyCleanup();
  try {
    const data = localStorage.getItem(TREASURY_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return defaultTreasury;
}

export function saveAdminTreasury(treasury: AdminTreasury): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TREASURY_KEY, JSON.stringify(treasury));
  window.dispatchEvent(new Event("treasuryUpdated"));
}

export function withdrawAdminCommission(
  amount: number,
  mpesaPhone: string
): { success: boolean; message: string } {
  const treasury = getAdminTreasury();
  if (amount <= 0 || amount > treasury.commissionBalance) {
    return { success: false, message: "Amount is more than available balance." };
  }

  treasury.commissionBalance -= amount;
  treasury.totalWithdrawn += amount;
  treasury.lastWithdrawalDate = new Date().toISOString().split("T")[0];
  treasury.adminMpesaNumber = mpesaPhone;
  saveAdminTreasury(treasury);

  fetch("/api/treasury", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, phone: mpesaPhone }),
  }).catch((e) => console.error("Error syncing withdrawal to server:", e));

  return {
    success: true,
    message: `KSh ${amount.toLocaleString()} sent to Admin M-Pesa (${mpesaPhone}) successfully!`,
  };
}

// ── CART ────────────────────────────────────────────────────────────────────
export function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
}

export function addToCart(product: Product, quantity = 1): void {
  const cart = getStoredCart();
  const existing = cart.find((item) => item.product.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }
  saveCart(cart);
}

export function removeFromCart(productId: string): void {
  const cart = getStoredCart().filter((item) => item.product.id !== productId);
  saveCart(cart);
}

export function updateCartQuantity(productId: string, quantity: number): void {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  const cart = getStoredCart();
  const item = cart.find((i) => i.product.id === productId);
  if (item) {
    item.quantity = quantity;
    saveCart(cart);
  }
}

export function clearCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("cartUpdated"));
}
