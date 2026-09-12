// User types
export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  phone?: string;
  role: "customer" | "farmer" | "admin" | "district_manager" | "taluk_agent" | "delivery_agent";
  avatar?: string;
  district?: string;
  districtId?: number;
  taluk?: string;
  reportsTo?: number;
  orgName?: string;
  orgSlug?: string;
  orgAddress?: string;
  orgPhone?: string;
  orgEmail?: string;
  orgLogoUrl?: string;
  orgQrCodeUrl?: string;
  isActive?: boolean;
  createdAt: string;
  productCount?: number;
}

// Product types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  status: string;
  imageUrl: string;
  categoryId: number;
  category?: Category;
  availableUntil: string;
  harvestMonth?: string;
  harvestDate?: string;
  inventory: number;
  unitsPerBox: number | string;
  wholesaleUnit?: string | null;
  growingDetails?: string;
  rating?: string;
  reviewCount?: number;
  reviews?: ProductReview[];
  farm: {
    id: number;
    name: string;
    location: string;
    logoUrl: string;
    isZbnfCertified?: boolean;
    isFpoDirect?: boolean;
  };
  fpo?: {
    orgName: string | null;
    orgLogoUrl: string | null;
    orgSlug: string | null;
    district: string | null;
  } | null;
  approvalStatus?: string;
  approvalType?: string;
  approvedByUserId?: number | null;
  approxWeightPerPieceGrams?: string | number | null;
  createdByDmId?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductReview {
  id: number;
  rating: number;
  comment: string;
  name: string;
  avatarUrl: string;
  date: string;
}

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

// Farmer types
export interface Farmer {
  id: number;
  userId: number;
  farmName: string;
  description: string;
  location: string;
  distance: number;
  imageUrl: string;
  logoUrl: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  address?: string;
  website?: string;
  phone?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  story?: string;
  practices?: string;
  farmImages?: string[];
  instagramReels?: string;
  reviews?: FarmerReview[];
  createdAt: string;
  updatedAt: string;
}

export interface FarmerReview {
  id: number;
  rating: number;
  comment: string;
  name: string;
  avatarUrl: string;
  date: string;
}

// Order types
export interface OrderFee {
  id: number;
  name: string;
  description?: string;
  type: "fixed" | "percentage";
  value: string;
  isActive: boolean;
  applyToSubtotal: boolean;
  displayOrder: number;
  amount?: number; // For display in order details
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id: number;
  userId: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  total: number;
  productsTotal?: number | string | null;
  deliveryFee?: number | string | null;
  platformFee?: number | string | null;
  status: string;
  paymentMethod?: string; // "cashfree" or "cod"
  notes?: string;
  items: OrderItem[];
  fees?: OrderFee[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  farmId: number;
  farmName: string;
  product?: {
    id: number;
    name: string;
    status?: string;
    harvestDate?: string | null;
    availableUntil?: string | null;
    unitsPerBox?: number | null;
    unit?: string | null;
    imageUrl?: string | null;
  } | null;
}

// Calendar types
export interface CalendarEntry {
  id: number;
  productId: number;
  produceName: string;
  imageUrl: string;
  categoryId: number;
  monthlyStatus: {
    [key: string]: string; // month number -> status (available, growing, harvesting, pre-order, none)
  };
  farms: {
    id: number;
    name: string;
    logoUrl: string;
  }[];
}

// Cart types
export interface CartItem extends Product {
  quantity: number;
  cartItemId: string;
  b2bOrder?: boolean;
  b2bSlabApplied?: {
    minQuantity: number;
    maxQuantity: number | null;
    pricePerUnit: string;
  };
}
