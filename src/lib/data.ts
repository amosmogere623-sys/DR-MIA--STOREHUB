import { Product, Order, Vendor, CartItem, AdminTreasury, KenyaLocation } from "../types";

export const INITIAL_PRODUCTS: Product[] = [
  // ── Bags & Totes ──────────────────────────────────────────────
  {
    id: "mia-1",
    name: "SokoLink Quilted Shoulder Tote Bag",
    description: "Lightweight quilted shoulder bag with zipper and inner pocket. Water-resistant and easy to carry.",
    price: 450,
    unit: "pc",
    category: "Bags & Totes",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
    vendorId: "v-vender44",
    vendorName: "SokoLink Store - Mwembe Branch",
    stallLocation: "Shop 14, Mwembe Plaza, Opposite Main Stage",
    location: { county: "Kisii", town: "Kisii Town", estate: "Mwembe" },
    inStock: true, stockQuantity: 45, rating: 4.9, badge: "In Mwembe", isPromoted: true, tokensSpent: 50,
  },
  {
    id: "mia-7",
    name: "Crossbody Small Sling Pouch",
    description: "Compact sling bag for phone, keys, and money. Adjustable strap.",
    price: 350,
    unit: "pc",
    category: "Bags & Totes",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80",
    vendorId: "v-daraja",
    vendorName: "Daraja Mbili Footwear",
    stallLocation: "Stall D-08, Daraja Mbili Market",
    location: { county: "Kisii", town: "Kisii Town", estate: "Daraja Mbili" },
    inStock: true, stockQuantity: 30, rating: 4.7,
  },
  {
    id: "mia-9",
    name: "Classic Leather Handbag",
    description: "Genuine leather ladies handbag with gold zip and wide carry handles. Fits A4 documents.",
    price: 1200,
    unit: "pc",
    category: "Bags & Totes",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
    vendorId: "v-vender44",
    vendorName: "SokoLink Store - Mwembe Branch",
    stallLocation: "Shop 14, Mwembe Plaza, Opposite Main Stage",
    location: { county: "Kisii", town: "Kisii Town", estate: "Mwembe" },
    inStock: true, stockQuantity: 15, rating: 4.9, badge: "Premium",
  },
  {
    id: "mia-10",
    name: "Large Travel Backpack",
    description: "Water-resistant travel backpack with laptop compartment and USB charging port. 35L capacity.",
    price: 950,
    unit: "pc",
    category: "Bags & Totes",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    vendorId: "v-milimani",
    vendorName: "Milimani Baby Shop",
    stallLocation: "Citadel Mall, 1st Floor, Milimani",
    location: { county: "Kisii", town: "Kisii Town", estate: "Milimani" },
    inStock: true, stockQuantity: 20, rating: 4.6, badge: "Travel",
  },
  {
    id: "mia-11",
    name: "School Bag for Kids",
    description: "Durable cartoon print school bag with padded back and multiple pockets. Fits grades 1–8.",
    price: 480,
    unit: "pc",
    category: "Bags & Totes",
    image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&auto=format&fit=crop&q=80",
    vendorId: "v-daraja",
    vendorName: "Daraja Mbili Footwear",
    stallLocation: "Stall D-08, Daraja Mbili Market",
    location: { county: "Kisii", town: "Kisii Town", estate: "Daraja Mbili" },
    inStock: true, stockQuantity: 35, rating: 4.8, badge: "School",
  },

  // ── Pillows & Bedding ─────────────────────────────────────────
  {
    id: "mia-2",
    name: "Deep Sleep Comfort Pillow",
    description: "Soft micro-fiber sleeping pillow with breathable cotton cover. Good neck support.",
    price: 650,
    unit: "pc",
    category: "Pillows & Bedding",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80",
    vendorId: "v-vender44",
    vendorName: "SokoLink Store - Mwembe Branch",
    stallLocation: "Shop 14, Mwembe Plaza, Opposite Main Stage",
    location: { county: "Kisii", town: "Kisii Town", estate: "Mwembe" },
    inStock: true, stockQuantity: 30, rating: 5.0, badge: "Top Seller", isPromoted: true, tokensSpent: 40,
  },
  {
    id: "mia-12",
    name: "Colourful Throw Pillow Set (2 pcs)",
    description: "Decorative square throw pillows in bold colours. Great for sofas and bedrooms.",
    price: 750,
    unit: "set",
    category: "Pillows & Bedding",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
    vendorId: "v-milimani",
    vendorName: "Milimani Baby Shop",
    stallLocation: "Citadel Mall, 1st Floor, Milimani",
    location: { county: "Kisii", town: "Kisii Town", estate: "Milimani" },
    inStock: true, stockQuantity: 18, rating: 4.7, badge: "Home Decor",
  },
  {
    id: "mia-13",
    name: "Cotton Bed Sheet Set (King)",
    description: "100% cotton fitted sheet, flat sheet, and 2 pillowcases. Soft, cool, and easy to wash.",
    price: 1400,
    unit: "set",
    category: "Pillows & Bedding",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop&q=80",
    vendorId: "v-vender44",
    vendorName: "SokoLink Store - Mwembe Branch",
    stallLocation: "Shop 14, Mwembe Plaza, Opposite Main Stage",
    location: { county: "Kisii", town: "Kisii Town", estate: "Mwembe" },
    inStock: true, stockQuantity: 12, rating: 4.9, badge: "King Size",
  },
  {
    id: "mia-14",
    name: "Warm Winter Duvet (6kg)",
    description: "Heavy 6kg duvet filled with hollow fibre for cold Kisii nights. Machine washable cover.",
    price: 1800,
    unit: "pc",
    category: "Pillows & Bedding",
    image: "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=600&auto=format&fit=crop&q=80",
    vendorId: "v-daraja",
    vendorName: "Daraja Mbili Footwear",
    stallLocation: "Stall D-08, Daraja Mbili Market",
    location: { county: "Kisii", town: "Kisii Town", estate: "Daraja Mbili" },
    inStock: true, stockQuantity: 8, rating: 4.8, badge: "Warm",
  },

  // ── Plushies & Toys ───────────────────────────────────────────
  {
    id: "mia-5",
    name: "Cuddle Soft Teddy Bear",
    description: "Soft velvet teddy bear toy, clean and safe for children and gifts.",
    price: 550,
    unit: "pc",
    category: "Plushies & Toys",
    image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=600&auto=format&fit=crop&q=80",
    vendorId: "v-vender44",
    vendorName: "SokoLink Store - Mwembe Branch",
    stallLocation: "Shop 14, Mwembe Plaza, Opposite Main Stage",
    location: { county: "Kisii", town: "Kisii Town", estate: "Mwembe" },
    inStock: true, stockQuantity: 40, rating: 5.0, badge: "Gift Choice",
  },
  {
    id: "mia-15",
    name: "Giant Stuffed Elephant",
    description: "Big soft grey elephant with embroidered eyes. 60 cm tall, non-toxic stuffing. Perfect gift.",
    price: 850,
    unit: "pc",
    category: "Plushies & Toys",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80",
    vendorId: "v-milimani",
    vendorName: "Milimani Baby Shop",
    stallLocation: "Citadel Mall, 1st Floor, Milimani",
    location: { county: "Kisii", town: "Kisii Town", estate: "Milimani" },
    inStock: true, stockQuantity: 22, rating: 4.9, badge: "Giant",
  },
  {
    id: "mia-16",
    name: "Family Board Game (Ludo & Snake)",
    description: "Classic family board game set with ludo, snake & ladders, and cards. Fun for all ages.",
    price: 450,
    unit: "set",
    category: "Plushies & Toys",
    image: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=600&auto=format&fit=crop&q=80",
    vendorId: "v-daraja",
    vendorName: "Daraja Mbili Footwear",
    stallLocation: "Stall D-08, Daraja Mbili Market",
    location: { county: "Kisii", town: "Kisii Town", estate: "Daraja Mbili" },
    inStock: true, stockQuantity: 25, rating: 4.7, badge: "Family Fun",
  },
  {
    id: "mia-17",
    name: "Kids Puzzle Set (200 pcs)",
    description: "Colourful 200-piece puzzle with African wildlife images. Builds focus and creativity.",
    price: 350,
    unit: "pc",
    category: "Plushies & Toys",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80",
    vendorId: "v-vender44",
    vendorName: "SokoLink Store - Mwembe Branch",
    stallLocation: "Shop 14, Mwembe Plaza, Opposite Main Stage",
    location: { county: "Kisii", town: "Kisii Town", estate: "Mwembe" },
    inStock: true, stockQuantity: 30, rating: 4.6, badge: "Educational",
  },

  // ── Care & Beauty ─────────────────────────────────────────────
  {
    id: "mia-6",
    name: "SokoLink Gentle Facial Cleanser (150ml)",
    description: "Daily foaming face wash with aloe vera and vitamin E. Cleans without drying the face.",
    price: 300,
    unit: "bottle",
    category: "Care & Beauty",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
    vendorId: "v-vender44",
    vendorName: "SokoLink Store - Mwembe Branch",
    stallLocation: "Shop 14, Mwembe Plaza, Opposite Main Stage",
    location: { county: "Kisii", town: "Kisii Town", estate: "Mwembe" },
    inStock: true, stockQuantity: 50, rating: 4.9, badge: "Skincare",
  },
  {
    id: "mia-8",
    name: "Soft Eye Sleep Mask & Hair Band",
    description: "Smooth silk eye mask for night rest and travel.",
    price: 150,
    unit: "set",
    category: "Care & Beauty",
    image: "https://images.unsplash.com/photo-1585232004423-244e0e6904e3?w=600&auto=format&fit=crop&q=80",
    vendorId: "v-vender44",
    vendorName: "SokoLink Store - Mwembe Branch",
    stallLocation: "Shop 14, Mwembe Plaza, Opposite Main Stage",
    location: { county: "Kisii", town: "Kisii Town", estate: "Mwembe" },
    inStock: true, stockQuantity: 70, rating: 4.8,
  },
  {
    id: "mia-18",
    name: "Cocoa Butter Body Lotion (400ml)",
    description: "Rich cocoa butter lotion that keeps skin smooth and moisturised all day. No greasy feel.",
    price: 280,
    unit: "bottle",
    category: "Care & Beauty",
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&auto=format&fit=crop&q=80",
    vendorId: "v-milimani",
    vendorName: "Milimani Baby Shop",
    stallLocation: "Citadel Mall, 1st Floor, Milimani",
    location: { county: "Kisii", town: "Kisii Town", estate: "Milimani" },
    inStock: true, stockQuantity: 40, rating: 4.8, badge: "Moisturiser",
  },
  {
    id: "mia-19",
    name: "Lip Balm & Gloss Set (5 pcs)",
    description: "Set of 5 fruity flavoured lip balms in a cute carry pouch. Long-lasting moisture.",
    price: 200,
    unit: "set",
    category: "Care & Beauty",
    image: "https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=600&auto=format&fit=crop&q=80",
    vendorId: "v-daraja",
    vendorName: "Daraja Mbili Footwear",
    stallLocation: "Stall D-08, Daraja Mbili Market",
    location: { county: "Kisii", town: "Kisii Town", estate: "Daraja Mbili" },
    inStock: true, stockQuantity: 60, rating: 4.7, badge: "Lip Care",
  },
  {
    id: "mia-20",
    name: "Brightening Face Cream (50ml)",
    description: "Lightweight face cream with turmeric and shea butter. Fades dark spots and brightens skin.",
    price: 420,
    unit: "jar",
    category: "Care & Beauty",
    image: "https://images.unsplash.com/photo-1591019479261-1a103585c559?w=600&auto=format&fit=crop&q=80",
    vendorId: "v-vender44",
    vendorName: "SokoLink Store - Mwembe Branch",
    stallLocation: "Shop 14, Mwembe Plaza, Opposite Main Stage",
    location: { county: "Kisii", town: "Kisii Town", estate: "Mwembe" },
    inStock: true, stockQuantity: 35, rating: 4.9, badge: "Brightening",
  },

  // ── Shoes & Clothes ───────────────────────────────────────────
  {
    id: "mia-3",
    name: "Cushioned Slip-on Slides",
    description: "Thick soft foam indoor and outdoor slides. Non-slip sole for daily comfort.",
    price: 350,
    unit: "pair",
    category: "Shoes & Clothes",
    image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&auto=format&fit=crop&q=80",
    vendorId: "v-daraja",
    vendorName: "Daraja Mbili Footwear",
    stallLocation: "Stall D-08, Daraja Mbili Market",
    location: { county: "Kisii", town: "Kisii Town", estate: "Daraja Mbili" },
    inStock: true, stockQuantity: 60, rating: 4.8, badge: "Nearby",
  },
  {
    id: "mia-4",
    name: "Baby Warm Cotton Romper & Cap",
    description: "Warm soft cotton baby clothes with snap buttons. Gentle on sensitive skin.",
    price: 400,
    unit: "set",
    category: "Shoes & Clothes",
    image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&auto=format&fit=crop&q=80",
    vendorId: "v-milimani",
    vendorName: "Milimani Baby Shop",
    stallLocation: "Citadel Mall, 1st Floor, Milimani",
    location: { county: "Kisii", town: "Kisii Town", estate: "Milimani" },
    inStock: true, stockQuantity: 25, rating: 4.9, badge: "Baby Care",
  },
  {
    id: "mia-21",
    name: "Ladies Flat Sandals",
    description: "Comfortable flat sandals with cushioned insole. Available in black and brown. Sizes 36–42.",
    price: 580,
    unit: "pair",
    category: "Shoes & Clothes",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80",
    vendorId: "v-daraja",
    vendorName: "Daraja Mbili Footwear",
    stallLocation: "Stall D-08, Daraja Mbili Market",
    location: { county: "Kisii", town: "Kisii Town", estate: "Daraja Mbili" },
    inStock: true, stockQuantity: 28, rating: 4.8, badge: "Ladies",
  },
  {
    id: "mia-22",
    name: "Kids School Shoes (Sizes 28–36)",
    description: "Durable black school shoes with hard sole. Easy lace-up closure. Long lasting leather upper.",
    price: 650,
    unit: "pair",
    category: "Shoes & Clothes",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop&q=80",
    vendorId: "v-milimani",
    vendorName: "Milimani Baby Shop",
    stallLocation: "Citadel Mall, 1st Floor, Milimani",
    location: { county: "Kisii", town: "Kisii Town", estate: "Milimani" },
    inStock: true, stockQuantity: 32, rating: 4.7, badge: "School",
  },
  {
    id: "mia-23",
    name: "Men's Lightweight Windbreaker Jacket",
    description: "Thin but warm windbreaker jacket. Great for Kisii mornings and evenings. Sizes S–XL.",
    price: 1100,
    unit: "pc",
    category: "Shoes & Clothes",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80",
    vendorId: "v-vender44",
    vendorName: "SokoLink Store - Mwembe Branch",
    stallLocation: "Shop 14, Mwembe Plaza, Opposite Main Stage",
    location: { county: "Kisii", town: "Kisii Town", estate: "Mwembe" },
    inStock: true, stockQuantity: 18, rating: 4.8, badge: "Jacket",
  },
];

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: "v-vender44",
    name: "SokoLink Vendor",
    businessName: "SokoLink Store - Mwembe Branch",
    stallNumber: "Shop 14, Mwembe Plaza",
    phone: "0712 998 877",
    email: "vender44@gmail.com",
    category: "Bags, Clothes & Living",
    location: {
      county: "Kisii",
      town: "Kisii Town",
      estate: "Mwembe",
    },
    businessRegistrationNumber: "BN-KS-2024-90214",
    verificationStatus: "Verified",
    walletBalance: 8500,
    tokenBalance: 80,
    mpesaNumber: "0712998877",
    status: "Approved",
    joinedDate: "2026-02-14",
  },
  {
    id: "v-daraja",
    name: "Amina Hassan",
    businessName: "Daraja Mbili Footwear",
    stallNumber: "Stall D-08, Daraja Mbili",
    phone: "0722 887 766",
    email: "amina@kisiistore.com",
    category: "Shoes & Slippers",
    location: {
      county: "Kisii",
      town: "Kisii Town",
      estate: "Daraja Mbili",
    },
    businessRegistrationNumber: "BN-KS-2025-41002",
    verificationStatus: "Verified",
    walletBalance: 3200,
    tokenBalance: 40,
    mpesaNumber: "0722887766",
    status: "Approved",
    joinedDate: "2026-04-10",
  },
  {
    id: "v-milimani",
    name: "Peter Nyachae",
    businessName: "Milimani Baby Shop",
    stallNumber: "Citadel Mall, 1st Floor",
    phone: "0733 445 566",
    email: "milimani@kisiistore.com",
    category: "Baby Clothes & Toys",
    location: {
      county: "Kisii",
      town: "Kisii Town",
      estate: "Milimani",
    },
    businessRegistrationNumber: "BN-KS-2025-88319",
    verificationStatus: "Verified",
    walletBalance: 2100,
    tokenBalance: 20,
    mpesaNumber: "0733445566",
    status: "Approved",
    joinedDate: "2026-06-01",
  },
];

export function getStoredProducts(): Product[] {
  if (typeof window === "undefined") return INITIAL_PRODUCTS;
  try {
    const data = localStorage.getItem("drmia_v3_products");
    if (data) return JSON.parse(data);
    localStorage.setItem("drmia_v3_products", JSON.stringify(INITIAL_PRODUCTS));
  } catch (e) {
    console.error(e);
  }
  return INITIAL_PRODUCTS;
}

export function saveProduct(product: Product): void {
  if (typeof window === "undefined") return;
  const products = getStoredProducts();
  const index = products.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    products[index] = product;
  } else {
    products.unshift(product);
  }
  localStorage.setItem("drmia_v3_products", JSON.stringify(products));
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
  localStorage.setItem("drmia_v3_vendors", JSON.stringify(vendors));

  const products = getStoredProducts();
  const prod = products.find((p) => p.id === productId);
  if (prod) {
    prod.isPromoted = true;
    prod.tokensSpent = (prod.tokensSpent || 0) + tokens;
    prod.badge = "⭐ PROMOTED";
    localStorage.setItem("drmia_v3_products", JSON.stringify(products));
  }
  window.dispatchEvent(new Event("productsUpdated"));
  return true;
}

export function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem("drmia_v3_cart");
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("drmia_v3_cart", JSON.stringify(cart));
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
  localStorage.removeItem("drmia_v3_cart");
  window.dispatchEvent(new Event("cartUpdated"));
}

export function getStoredOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem("drmia_v3_orders");
    if (data) return JSON.parse(data);

    const initialOrders: Order[] = [
      {
        id: "MIA-78219",
        buyerId: "user-buyer23",
        buyerName: "Buyer Account",
        buyerPhone: "0722334455",
        buyerEmail: "buyer23@gmail.com",
        buyerLocation: {
          county: "Kisii",
          town: "Kisii Town",
          estate: "Mwembe",
        },
        deliveryAddress: "Near Mwembe Stage, Gate 2, Kisii",
        paymentMethod: "mpesa",
        paymentStatus: "Paid",
        orderStatus: "Ready for Pickup",
        items: [
          {
            productId: "mia-1",
            productName: "SokoLink Quilted Shoulder Tote Bag",
            price: 450,
            unit: "pc",
            quantity: 1,
            vendorId: "v-vender44",
            vendorName: "SokoLink Store - Mwembe Branch",
            vendorPhone: "0712 998 877",
            vendorLocation: { county: "Kisii", town: "Kisii Town", estate: "Mwembe" },
            stallLocation: "Shop 14, Mwembe Plaza, Opposite Main Stage",
          },
        ],
        subtotal: 450,
        deliveryFee: 50,
        total: 500,
        escrowStatus: "HELD_IN_ESCROW",
        escrowReleaseKey: "ESC-SKL-849201",
        vendorPayoutAmount: 450, // 90% of 500
        platformCommission: 50,  // 10% of 500
        unlockedVendorContacts: [
          {
            vendorName: "SokoLink Store - Mwembe Branch",
            phone: "0712 998 877",
            exactAddress: "Shop 14, Mwembe Plaza, Opposite Main Stage, Mwembe, Kisii",
            gpsCoordinates: "-0.6773, 34.7796",
          },
        ],
        fraudAnalysis: {
          riskScore: 4,
          riskLevel: "LOW",
          flags: ["Normal transaction", "Verified M-Pesa account"],
          recommendation: "APPROVE",
          analyzedAt: "2026-11-05 10:15:00",
        },
        createdAt: "2026-11-05 10:15",
      },
    ];
    localStorage.setItem("drmia_v3_orders", JSON.stringify(initialOrders));
    return initialOrders;
  } catch (e) {
    return [];
  }
}

export function saveOrder(order: Order): void {
  if (typeof window === "undefined") return;
  const orders = getStoredOrders();
  orders.unshift(order);
  localStorage.setItem("drmia_v3_orders", JSON.stringify(orders));
  window.dispatchEvent(new Event("ordersUpdated"));
}

export function releaseEscrowWithKey(orderId: string, enteredKey: string): { success: boolean; message: string; vendorAmount?: number; commission?: number } {
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
    return { success: false, message: "Invalid Release Key! Please check with the buyer." };
  }

  order.escrowStatus = "RELEASED_TO_VENDOR";
  order.orderStatus = "Delivered";
  order.escrowReleasedAt = new Date().toISOString().replace("T", " ").substring(0, 16);
  localStorage.setItem("drmia_v3_orders", JSON.stringify(orders));

  const vendors = getStoredVendors();
  const vendor = vendors.find((v) => v.id === order.items[0]?.vendorId) || vendors[0];
  if (vendor) {
    vendor.walletBalance = (vendor.walletBalance || 0) + order.vendorPayoutAmount;
    localStorage.setItem("drmia_v3_vendors", JSON.stringify(vendors));
  }

  const treasury = getAdminTreasury();
  treasury.commissionBalance = (treasury.commissionBalance || 0) + order.platformCommission;
  saveAdminTreasury(treasury);

  window.dispatchEvent(new Event("ordersUpdated"));
  window.dispatchEvent(new Event("vendorsUpdated"));
  window.dispatchEvent(new Event("treasuryUpdated"));

  return {
    success: true,
    message: `Verified! KSh ${order.vendorPayoutAmount.toLocaleString()} (90%) released to vendor. 10% (KSh ${order.platformCommission.toLocaleString()}) commission kept in system.`,
    vendorAmount: order.vendorPayoutAmount,
    commission: order.platformCommission,
  };
}

export function getAdminTreasury(): AdminTreasury {
  const defaultTreasury: AdminTreasury = {
    commissionBalance: 4200,
    totalWithdrawn: 12000,
    lastWithdrawalDate: "2026-11-03",
    adminMpesaNumber: "0711 000 999",
  };

  if (typeof window === "undefined") return defaultTreasury;
  try {
    const data = localStorage.getItem("drmia_v3_treasury");
    if (data) return JSON.parse(data);
    localStorage.setItem("drmia_v3_treasury", JSON.stringify(defaultTreasury));
  } catch (e) {
    console.error(e);
  }
  return defaultTreasury;
}

export function saveAdminTreasury(treasury: AdminTreasury): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("drmia_v3_treasury", JSON.stringify(treasury));
  window.dispatchEvent(new Event("treasuryUpdated"));
}

export function withdrawAdminCommission(amount: number, mpesaPhone: string): { success: boolean; message: string } {
  const treasury = getAdminTreasury();
  if (amount <= 0 || amount > treasury.commissionBalance) {
    return { success: false, message: "Amount is more than available commission balance." };
  }

  treasury.commissionBalance -= amount;
  treasury.totalWithdrawn += amount;
  treasury.lastWithdrawalDate = new Date().toISOString().split("T")[0];
  treasury.adminMpesaNumber = mpesaPhone;
  saveAdminTreasury(treasury);

  return {
    success: true,
    message: `KSh ${amount.toLocaleString()} sent to Admin M-Pesa (${mpesaPhone}) successfully!`,
  };
}

export function getStoredVendors(): Vendor[] {
  if (typeof window === "undefined") return INITIAL_VENDORS;
  try {
    const data = localStorage.getItem("drmia_v3_vendors");
    if (data) return JSON.parse(data);
    localStorage.setItem("drmia_v3_vendors", JSON.stringify(INITIAL_VENDORS));
  } catch (e) {
    console.error(e);
  }
  return INITIAL_VENDORS;
}

export function saveVendor(vendor: Vendor): void {
  if (typeof window === "undefined") return;
  const vendors = getStoredVendors();
  const index = vendors.findIndex((v) => v.id === vendor.id);
  if (index >= 0) {
    vendors[index] = vendor;
  } else {
    vendors.unshift(vendor);
  }
  localStorage.setItem("drmia_v3_vendors", JSON.stringify(vendors));
  window.dispatchEvent(new Event("vendorsUpdated"));
}

export function updateOrderStatus(orderId: string, status: Order["orderStatus"]): void {
  if (typeof window === "undefined") return;
  const orders = getStoredOrders();
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    order.orderStatus = status;
    localStorage.setItem("drmia_v3_orders", JSON.stringify(orders));
    window.dispatchEvent(new Event("ordersUpdated"));
  }
}

export function updateVendorStatus(vendorId: string, status: Vendor["status"]): void {
  if (typeof window === "undefined") return;
  const vendors = getStoredVendors();
  const vendor = vendors.find((v) => v.id === vendorId);
  if (vendor) {
    vendor.status = status;
    localStorage.setItem("drmia_v3_vendors", JSON.stringify(vendors));
    window.dispatchEvent(new Event("vendorsUpdated"));
  }
}

export function vendorMarkOrderPickedUp(orderId: string): { success: boolean; message: string } {
  if (typeof window === "undefined") return { success: false, message: "Window unavailable" };
  const orders = getStoredOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) return { success: false, message: "Order not found" };

  order.vendorMarkedPickedUp = true;
  order.orderStatus = "Ready for Pickup";
  localStorage.setItem("drmia_v3_orders", JSON.stringify(orders));
  window.dispatchEvent(new Event("ordersUpdated"));

  return {
    success: true,
    message: "Item marked as handed over/picked up. Funds will be released once buyer verifies and clicks Accept.",
  };
}

export function buyerAcceptAndReleaseEscrow(orderId: string): { success: boolean; message: string; vendorAmount?: number; commission?: number } {
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
  localStorage.setItem("drmia_v3_orders", JSON.stringify(orders));

  const vendors = getStoredVendors();
  const vendor = vendors.find((v) => v.id === order.items[0]?.vendorId) || vendors[0];
  if (vendor) {
    vendor.walletBalance = (vendor.walletBalance || 0) + order.vendorPayoutAmount;
    localStorage.setItem("drmia_v3_vendors", JSON.stringify(vendors));
  }

  const treasury = getAdminTreasury();
  treasury.commissionBalance = (treasury.commissionBalance || 0) + order.platformCommission;
  saveAdminTreasury(treasury);

  window.dispatchEvent(new Event("ordersUpdated"));
  window.dispatchEvent(new Event("vendorsUpdated"));
  window.dispatchEvent(new Event("treasuryUpdated"));

  return {
    success: true,
    message: `Payment released! KSh ${order.vendorPayoutAmount.toLocaleString()} credited to vendor wallet. KSh ${order.platformCommission.toLocaleString()} service fee kept in system.`,
    vendorAmount: order.vendorPayoutAmount,
    commission: order.platformCommission,
  };
}

export function toggleProductInStock(productId: string): boolean {
  if (typeof window === "undefined") return false;
  const products = getStoredProducts();
  const prod = products.find((p) => p.id === productId);
  if (prod) {
    prod.inStock = !prod.inStock;
    localStorage.setItem("drmia_v3_products", JSON.stringify(products));
    window.dispatchEvent(new Event("productsUpdated"));
    return prod.inStock;
  }
  return false;
}

export function verifyVendorShop(vendorId: string, status: "Verified" | "Rejected"): void {
  if (typeof window === "undefined") return;
  const vendors = getStoredVendors();
  const vendor = vendors.find((v) => v.id === vendorId);
  if (vendor) {
    vendor.verificationStatus = status;
    localStorage.setItem("drmia_v3_vendors", JSON.stringify(vendors));
    window.dispatchEvent(new Event("vendorsUpdated"));
  }
}
