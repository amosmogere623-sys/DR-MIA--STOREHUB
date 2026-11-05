export type UserRole = "buyer" | "vendor" | "admin";

export interface KenyaLocation {
  county: string;
  town: string;
  estate: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  location: KenyaLocation;
  avatar?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: "Bags & Totes" | "Pillows & Bedding" | "Plushies & Toys" | "Care & Beauty" | "Shoes & Clothes";
  image: string;
  vendorId: string;
  vendorName: string;
  stallLocation: string; // e.g. "Shop 14, Mwembe Plaza"
  location: KenyaLocation;
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  badge?: string;
  isPromoted?: boolean;
  promotedUntil?: string;
  tokensSpent?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  unit: string;
  quantity: number;
  vendorId: string;
  vendorName: string;
  vendorPhone: string;
  vendorLocation: KenyaLocation;
  stallLocation: string;
}

export type EscrowStatus = "HELD_IN_ESCROW" | "RELEASED_TO_VENDOR" | "REFUNDED_TO_BUYER" | "DISPUTED";

export interface FraudAnalysis {
  riskScore: number;
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  flags: string[];
  recommendation: "APPROVE" | "REVIEW" | "REJECT";
  analyzedAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  buyerLocation: KenyaLocation;
  deliveryAddress: string;
  notes?: string;
  paymentMethod: "mpesa" | "card" | "cod";
  paymentStatus: "Paid" | "Pending";
  orderStatus: "Pending" | "Confirmed" | "Ready for Pickup" | "Dispatched" | "Delivered" | "Cancelled";
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  
  // Escrow & Handover Details
  escrowStatus: EscrowStatus;
  escrowReleaseKey: string;
  escrowReleasedAt?: string;
  vendorPayoutAmount: number; // 90%
  platformCommission: number; // 10%
  
  unlockedVendorContacts?: {
    vendorName: string;
    phone: string;
    exactAddress: string;
    gpsCoordinates?: string;
  }[];

  fraudAnalysis: FraudAnalysis;
  vendorMarkedPickedUp?: boolean;
  buyerReleasedPayment?: boolean;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  businessName: string;
  stallNumber: string;
  phone: string;
  email: string;
  category: string;
  location: KenyaLocation;
  
  businessRegistrationNumber: string;
  shopPermitUrl?: string;
  shopFrontImageUrl?: string;
  qualityCertificateUrl?: string;
  verificationStatus: "Verified" | "Pending Review" | "Rejected";
  
  walletBalance: number;
  tokenBalance: number;
  mpesaNumber: string;
  
  status: "Approved" | "Pending" | "Suspended";
  joinedDate: string;
}

export interface AdminTreasury {
  commissionBalance: number;
  totalWithdrawn: number;
  lastWithdrawalDate?: string;
  adminMpesaNumber: string;
}
