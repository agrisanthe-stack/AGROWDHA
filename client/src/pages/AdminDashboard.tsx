import { useEffect, useState, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { toast, useToast } from "@/hooks/use-toast";
import { formatDate, formatIndianCurrency, downloadImageAsBlob } from "@/lib/utils";
import { Loader2, CheckCircle, XCircle, AlertCircle, ShoppingCart, ShoppingBag, Users, User, PackageOpen, Package, Home, BarChart2, Settings, Plus, Pencil, Trash2, UserCircle, Ban, Check, Truck, Eye, Edit, Building, Building2, UserPlus, Shield, CreditCard, Banknote, TrendingUp, DollarSign, Leaf, Brain, Calendar, CalendarX, MapPin, RefreshCcw, Clock, X, Ticket, Phone, Mail, Wallet, Crown, Search, ExternalLink, Copy, RotateCcw, Upload, QrCode, Download, RefreshCw, Film, Play, Video, Mic } from "lucide-react";
import { addDays, parseISO, format } from "date-fns";
import { queryClient, apiRequest } from "@/lib/queryClient";
import CropManagement from "@/pages/admin/CropManagement";
import FPOProfile from "@/components/dashboard/FPOProfile";
import { FpoReturnRequestsPanel, AdminReturnRequestsPanel } from "@/components/dashboard/ReturnRequestsPanel";
import MarketingToolsPanel from "@/components/dashboard/MarketingToolsPanel";
import AnalyticsReportSection from "@/components/dashboard/AnalyticsReportSection";
import AdminSubscriptionPlans from "@/components/AdminSubscriptionPlans";
import type { District, User as UserRecord } from "@shared/schema.ts";

// Type definitions
interface AdminStats {
  totalUsers: number;
  totalFarmers: number;
  totalProducts: number;
  pendingProducts: number;
  totalOrders: number;
  totalCustomers: number;
  recentOrders: number;
  pendingProductList: Array<any>;
  ordersByStatus: {
    pending: number;
    accepted: number;
    growing: number;
    harvested: number;
    packaging: number;
    shipping: number;
    delivered: number;
    canceled: number;
  };
  orderStats: {
    pending: { count: number; amount: number };
    accepted: { count: number; amount: number };
    delivered: { count: number; amount: number };
    cancelled: { count: number; amount: number };
  };
  paymentStats: {
    onlinePayments: { count: number; amount: number };
    codPayments: { count: number; amount: number };
  };
  transactionStats: {
    totalRevenue: number;
    deliveryRevenue?: number;
    onlinePayments: {
      count: number;
      amount: number;
    };
    codPayments: {
      count: number;
      amount: number;
    };
  };
  recentSalesData: Array<{
    id: number;
    customerName: string;
    total: number;
    paymentMethod: string;
    status: string;
    createdAt: string;
    items: Array<{
      productName: string;
      quantity: number;
    }>;
  }>;
  platformFeePercent?: number;
  subscriptionStats?: {
    totalSubscribers: number;
    activeSubscribers: number;
    subscriptionRevenue: number;
    subscriptionsByTier: Array<{ tier: string; count: number; revenue: number }>;
  };
  retailStats?: { orders: number; revenue: number; farmerRevenue: number; itemsSold: number };
  wholesaleStats?: { orders: number; revenue: number; farmerRevenue: number; itemsSold: number };
  fpoPayouts?: Array<{ fpoId: number; fpoName: string; orgName: string; district: string; farmerCount: number; orderCount: number; totalPayout: number; totalCollected: number; platformFee: number; deliveryRevenue: number }>;
  totalDeliveryRevenue?: number;
}

interface PendingProduct {
  id: number;
  name: string;
  price: string | number;
  farmerId: number;
  farmerName: string;
  farmerLocation: string;
  createdAt: string;
  imageUrl?: string;
  description: string;
}

interface AdminOrder {
  id: number;
  customerName: string;
  email: string;
  total: string | number;
  status: string;
  createdAt: string;
  notes?: string;
  items: Array<{
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    price: string | number;
    farmerId: number;
    farmerName: string;
  }>;
}

interface AdminFarmer {
  id: number;
  farmName: string;
  description?: string;
  location: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  story?: string;
  practices?: string;
  tags?: string[];
  logoUrl?: string;
  latitude?: string;
  longitude?: string;
  userId: number;
  productCount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  isZbnfCertified?: boolean;
  isOrganicCertified?: boolean;
  isNaturalCertified?: boolean;
  createdAt: string;
}

interface OrderFee {
  id: number;
  name: string;
  description: string | null;
  type: "fixed" | "percentage";
  value: string;
  isActive: boolean;
  applyToSubtotal: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface OrderFeeFormData {
  name: string;
  description: string;
  type: "fixed" | "percentage";
  value: string;
  isActive: boolean;
  applyToSubtotal: boolean;
  displayOrder: number;
}

interface AiSubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: string;
  duration: number;
  durationType: "monthly" | "yearly" | "6months";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AiPlanFormData {
  name: string;
  description: string;
  price: string;
  duration: number;
  durationType: "monthly" | "yearly" | "6months";
  isActive: boolean;
}

interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminUser {
  id: number;
  username: string;
  email: string;
  phone: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  avatar: string | null;
  isActive: boolean;
  subscription?: {
    planName: string | null;
    tier: string | null;
    billingPeriod: string | null;
    status: string;
    endDate: string;
    zeroPlatformFee: boolean;
  } | null;
}

interface ProductSalesData {
  productId: number;
  productName: string;
  totalQuantitySold: number;
  totalRevenue: number;
  totalOrders: number;
  salesHistory: Array<{
    orderId: number;
    customerName: string;
    quantity: number;
    price: number;
    orderDate: string;
    orderStatus: string;
  }>;
}

// Helper function to get color for status badge
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-400";
    case "accepted":
      return "bg-blue-100 text-blue-700 border-blue-400";
    case "growing":
      return "bg-green-100 text-green-700 border-green-400";
    case "harvested":
      return "bg-orange-100 text-orange-700 border-orange-400";
    case "packaging":
      return "bg-indigo-100 text-indigo-700 border-indigo-400";
    case "shipping":
      return "bg-purple-100 text-purple-700 border-purple-400";
    case "delivered":
      return "bg-emerald-100 text-emerald-700 border-emerald-400";
    case "canceled":
      return "bg-red-100 text-red-700 border-red-400";
    default:
      return "bg-gray-100 text-gray-700 border-gray-400";
  }
};

// Role-based permission helper
const hasPermission = (userRole: string, permission: string) => {
  const permissions = {
    admin: ['all'],
    district_manager: ['products', 'orders', 'farmers'],
    taluk_agent: ['orders', 'farmers']
  };
  
  const userPermissions = permissions[userRole as keyof typeof permissions] || [];
  return userPermissions.includes('all') || userPermissions.includes(permission);
};

// Check if user can edit resources
const canEdit = (userRole: string, resource: string) => {
  if (userRole === 'admin') return true;
  if (userRole === 'district_manager' && ['products', 'orders', 'farmers'].includes(resource)) return true;
  if (userRole === 'taluk_agent' && ['orders'].includes(resource)) return true;
  return false;
};

export default function AdminDashboard() {
  const [location, setLocation] = useLocation();
  const { t } = useTranslation();
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [productStatusTab, setProductStatusTab] = useState<"pending" | "approved" | "rejected" | "expired">("pending");
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [productFarmerFilter, setProductFarmerFilter] = useState("all");
  const [productApproverFilter, setProductApproverFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderSearchTerm, setOrderSearchTerm] = useState("");
  const [farmerSearchTerm, setFarmerSearchTerm] = useState("");
  const [dmFilterOrders, setDmFilterOrders] = useState("all");
  const [districtFilterOrders, setDistrictFilterOrders] = useState("all");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionForm, setShowRejectionForm] = useState<number | null>(null);
  
  // State for order fee management
  const [showFeeForm, setShowFeeForm] = useState(false);
  const [editingFee, setEditingFee] = useState<OrderFee | null>(null);
  const [feeForm, setFeeForm] = useState<OrderFeeFormData>({
    name: "",
    description: "",
    type: "fixed",
    value: "",
    isActive: true,
    applyToSubtotal: false,
    displayOrder: 0
  });
  
  // State for category management
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: number; name: string; description: string } | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: ""
  });

  // Official buyers state
  const [showBuyerForm, setShowBuyerForm] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState<{ id: number; name: string; type: string; logoUrl: string | null } | null>(null);
  const [buyerForm, setBuyerForm] = useState({ name: "", type: "other", logoUrl: "" });
  const [buyerLogoUploading, setBuyerLogoUploading] = useState(false);
  const buyerLogoInputRef = useRef<HTMLInputElement>(null);
  const [downloadingQrId, setDownloadingQrId] = useState<number | null>(null);
  const [dmQrDownloading, setDmQrDownloading] = useState(false);
  const [analyticsDialogDm, setAnalyticsDialogDm] = useState<any>(null);
  const [analyticsPeriod, setAnalyticsPeriod] = useState<"week" | "month" | "year" | "custom">("month");
  const [analyticsCustomStart, setAnalyticsCustomStart] = useState(() => new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0]);
  const [analyticsCustomEnd, setAnalyticsCustomEnd] = useState(() => new Date().toISOString().split("T")[0]);
  const [analyticsPdfLoading, setAnalyticsPdfLoading] = useState(false);
  const [analyticsCsvLoading, setAnalyticsCsvLoading] = useState(false);
  // District management state
  const [showDistrictForm, setShowDistrictForm] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState<{ id: number; name: string; state: string; isActive: boolean } | null>(null);
  const [districtForm, setDistrictForm] = useState({
    name: "",
    state: "",
    isActive: true
  });
  
  // State for AI subscription plans management
  const [showAiPlanForm, setShowAiPlanForm] = useState(false);
  const [editingAiPlan, setEditingAiPlan] = useState<AiSubscriptionPlan | null>(null);
  const [aiPlanForm, setAiPlanForm] = useState<AiPlanFormData>({
    name: "",
    description: "",
    price: "",
    duration: 30,
    durationType: "monthly",
    isActive: true
  });
  
  // State for user management
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    phone: "",
    name: "",
    role: "customer",
    password: "",
    isActive: true
  });

  // State for farmer management
  const [showFarmerForm, setShowFarmerForm] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState<AdminFarmer | null>(null);
  const [farmerForm, setFarmerForm] = useState({
    farmName: "",
    description: "",
    location: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    story: "",
    practices: "",
    tags: [] as string[]
  });
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  
  // State for farmer dashboard view
  const [viewingFarmerDashboard, setViewingFarmerDashboard] = useState<AdminFarmer | null>(null);
  
  // Fetch Farmer stats when viewing dashboard
  const { data: farmerDashboardStats, isLoading: farmerDashboardLoading, error: farmerDashboardError, refetch: refetchFarmerStats } = useQuery({
    queryKey: ["/api/admin/farmer-stats", viewingFarmerDashboard?.id],
    queryFn: async () => {
      if (!viewingFarmerDashboard) return null;
      const response = await apiRequest("GET", `/api/admin/farmer-stats/${viewingFarmerDashboard.id}`);
      return response.json();
    },
    enabled: !!viewingFarmerDashboard,
    retry: 1,
    staleTime: 0
  });
  
  // State for product sales modal
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [selectedProductForSales, setSelectedProductForSales] = useState<any>(null);
  
  // State for product editing
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productEditForm, setProductEditForm] = useState({
    name: "",
    description: "",
    price: "",
    inventory: "",
    unit: "",
    unitsPerBox: "",
    harvestDate: "",
    availableUntil: "",
    growingDetails: "",
    categoryId: "",
    status: "",
  });
  
  // State for DM product creation
  const [showDmProductForm, setShowDmProductForm] = useState(false);
  const [dmProductForm, setDmProductForm] = useState({
    farmerId: "",
    name: "",
    description: "",
    price: "",
    unit: "kg",
    categoryId: "",
    harvestDate: "",
    availableUntil: "",
    inventory: "",
    gradeVariety: "",
    b2cQuantity: "",
    b2bQuantity: "",
    b2cMoq: "1",
    b2bMoq: "1",
    growingDetails: "",
    imageUrl: ""
  });
  const [dmProductSlabs, setDmProductSlabs] = useState<Array<{minQuantity: string; maxQuantity: string; pricePerUnit: string; slabType: string}>>([]);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/login");
      toast({
        title: "Login Required",
        description: "You need to log in to access the admin dashboard.",
        variant: "destructive"
      });
    }
    
    // Check for authorized roles
    if (!authLoading && user && !["admin", "district_manager", "taluk_agent"].includes(user.role)) {
      setLocation("/");
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive"
      });
    }
  }, [user, authLoading, setLocation]);

  // Fetch dashboard statistics - use district-specific endpoint for district managers
  const { 
    data: stats, 
    isLoading: statsLoading,
    refetch: refetchStats,
    error: statsError
  } = useQuery({
    queryKey: [user?.role === 'district_manager' ? "/api/dm/statistics" : "/api/admin/statistics"],
    enabled: !!user && ["admin", "district_manager", "taluk_agent"].includes(user.role),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  // Fetch events with bookings for overview statistics
  const eventsEndpoint = user?.role === 'district_manager' ? "/api/dm/events" : "/api/admin/events";
  const { data: adminEventsWithBookings } = useQuery<any[]>({
    queryKey: [eventsEndpoint, "all-for-overview"],
    queryFn: async () => {
      const response = await apiRequest("GET", `${eventsEndpoint}?status=approved`);
      return response.json();
    },
    enabled: !!user && ["admin", "district_manager"].includes(user.role),
    staleTime: 0,
    refetchOnMount: 'always'
  });

  // Fetch DM payouts for admin overview
  const { data: dmPayoutsData } = useQuery<{
    platformFeePercent: number;
    dmPayouts: Array<{
      dmId: number;
      username: string;
      district: string;
      farmerCount: number;
      boxFarmerRevenue: number;
      boxOrderCount: number;
      deliveryRevenue: number;
      totalFarmerPrice: number;
      totalOrders: number;
    }>;
  }>({
    queryKey: ["/api/admin/dm-payouts"],
    enabled: !!user && user.role === 'admin' && (activeTab === 'overview' || activeTab === 'dm-payout'),
    staleTime: 0,
    refetchOnMount: 'always'
  });

  // Calculate admin event booking statistics
  const totalAdminEvents = Array.isArray(adminEventsWithBookings) ? adminEventsWithBookings.length : 0;
  const allAdminBookings = Array.isArray(adminEventsWithBookings) 
    ? adminEventsWithBookings.flatMap(e => e.bookings || []) 
    : [];
  const totalAdminEventBookings = allAdminBookings.length;
  const paidAdminBookings = allAdminBookings.filter((b: any) => b.paymentStatus === 'paid').length;
  const totalAdminSeatsBooked = allAdminBookings.reduce((sum: number, b: any) => sum + (b.numSeats || 1), 0);
  const adminEventBookingRevenue = allAdminBookings
    .filter((b: any) => b.paymentStatus === 'paid')
    .reduce((sum: number, b: any) => sum + parseFloat(b.totalAmount || 0), 0);

  // Note: Total revenue is now calculated entirely on the backend (Retail Sales + Wholesale Sales + Event Bookings)
  // AI Subscriptions removed - now a free feature

  // Provide default values for stats to prevent undefined errors
  const safeStats: AdminStats = {
    totalUsers: stats?.totalUsers || 0,
    totalFarmers: stats?.totalFarmers || 0,
    totalProducts: stats?.totalProducts || 0,
    pendingProducts: stats?.pendingProducts || 0,
    totalOrders: stats?.totalOrders || 0,
    totalCustomers: stats?.totalCustomers || 0,
    recentOrders: stats?.recentOrders || 0,
    orderStats: stats?.orderStats || {
      pending: { count: 0, amount: 0 },
      accepted: { count: 0, amount: 0 },
      delivered: { count: 0, amount: 0 },
      cancelled: { count: 0, amount: 0 }
    },
    paymentStats: stats?.paymentStats || {
      onlinePayments: { count: 0, amount: 0 },
      codPayments: { count: 0, amount: 0 }
    },
    transactionStats: stats?.transactionStats || {
      totalRevenue: 0,
      onlinePayments: { count: 0, amount: 0 },
      codPayments: { count: 0, amount: 0 },
      eventBookings: { count: 0, amount: 0, farmerRevenue: 0 }
    },
    recentSalesData: stats?.recentSalesData || [],
    // Additional properties used throughout the dashboard
    ordersByStatus: stats?.ordersByStatus || {
      pending: 0,
      accepted: 0,
      growing: 0,
      harvested: 0,
      packaging: 0,
      shipping: 0,
      delivered: 0,
      canceled: 0
    },
    boxesStats: stats?.boxesStats || {
      totalBoxProducts: 0,
      totalBoxesSold: 0,
      boxRevenue: 0,
      boxFarmerRevenue: 0,
      boxOrders: 0,
      averagePricePerBox: 0
    },
    retailStats: stats?.retailStats || { orders: 0, revenue: 0, farmerRevenue: 0, itemsSold: 0 },
    wholesaleStats: stats?.wholesaleStats || { orders: 0, revenue: 0, farmerRevenue: 0, itemsSold: 0 },
    pendingProductList: stats?.pendingProductList || [],
    platformFeePercent: stats?.platformFeePercent || 7,
    subscriptionStats: stats?.subscriptionStats || {
      totalSubscribers: 0,
      activeSubscribers: 0,
      subscriptionRevenue: 0,
      subscriptionsByTier: []
    },
    fpoPayouts: stats?.fpoPayouts || [],
  };
  
  // No duplicate state needed as it's already defined above
  
  // Fetch pending products for review
  const { 
    data: pendingProducts, 
    isLoading: pendingProductsLoading,
    refetch: refetchPendingProducts 
  } = useQuery({
    queryKey: ["/api/admin/products/pending"],
    enabled: !!user && ["admin", "district_manager"].includes(user.role) && activeTab === "products" && productStatusTab === "pending",
  });
  
  // Fetch approved products
  const { 
    data: approvedProducts, 
    isLoading: approvedProductsLoading,
    refetch: refetchApprovedProducts 
  } = useQuery({
    queryKey: ["/api/admin/products/approved"],
    enabled: !!user && ["admin", "district_manager"].includes(user.role) && activeTab === "products" && productStatusTab === "approved",
  });
  
  // Fetch rejected products
  const { 
    data: rejectedProducts, 
    isLoading: rejectedProductsLoading,
    refetch: refetchRejectedProducts 
  } = useQuery({
    queryKey: ["/api/admin/products/rejected"],
    enabled: user && ["admin", "district_manager"].includes(user.role) && activeTab === "products" && productStatusTab === "rejected",
  });
  
  // Fetch expired products
  const { 
    data: expiredProducts, 
    isLoading: expiredProductsLoading,
    refetch: refetchExpiredProducts 
  } = useQuery({
    queryKey: ["/api/admin/products/expired"],
    enabled: user && ["admin", "district_manager"].includes(user.role) && activeTab === "products" && productStatusTab === "expired",
  });


  
  // Fetch orders for overview farmer payouts (DM only, no filters)
  const { 
    data: overviewOrders = [],
    isLoading: overviewOrdersLoading
  } = useQuery({
    queryKey: ["/api/admin/orders/district", "overview"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/orders/district");
      return await response.json();
    },
    enabled: !!user && user.role === "district_manager" && activeTab === "overview",
  });
  
  // Fetch orders based on user role
  const { 
    data: orders, 
    isLoading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders
  } = useQuery({
    queryKey: [user?.role === "admin" ? "/api/admin/orders" : "/api/admin/orders/district", orderStatusFilter, dmFilterOrders, districtFilterOrders],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (orderStatusFilter !== "all") params.append("status", orderStatusFilter);
      if (user?.role === "admin" && dmFilterOrders !== "all") params.append("dmId", dmFilterOrders);
      if (user?.role === "admin" && districtFilterOrders !== "all") params.append("district", districtFilterOrders);
      
      const queryString = params.toString();
      const endpoint = user?.role === "admin" ? "/api/admin/orders" : "/api/admin/orders/district";
      const response = await apiRequest(
        "GET", 
        `${endpoint}${queryString ? `?${queryString}` : ""}`
      );
      return await response.json();
    },
    enabled: user && ["admin", "district_manager", "taluk_agent"].includes(user.role) && activeTab === "orders",
    retry: 1,
    onError: (error: Error) => {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error Loading Orders",
        description: "Failed to load order data. Please check your connection and try again.",
        variant: "destructive"
      });
    }
  });
  
  // Fetch all users (for DM and District filters)
  const { data: allUsers } = useQuery({
    queryKey: ['/api/users'],
    enabled: user?.role === 'admin' && (activeTab === "orders" || activeTab === "farmers"),
  });
  
  // Fetch farmers based on user role
  // DMs: use linked-farmers endpoint (only approved/linked farmers, any district)
  // Admins: use full admin farmers endpoint
  const { 
    data: farmers, 
    isLoading: farmersLoading,
    refetch: refetchFarmers,
  } = useQuery({
    queryKey: [user?.role === "admin" ? "/api/admin/farmers" : user?.role === "district_manager" ? "/api/dm/linked-farmers" : "/api/admin/farmers/district"],
    enabled: user && ["admin", "district_manager", "taluk_agent"].includes(user.role) && (activeTab === "farmers" || activeTab === "orders" || activeTab === "products"),
  });
  
  // Fetch all order fees (needed for overview split calculation and orders tab)
  const {
    data: orderFees = [],
    isLoading: orderFeesLoading,
    error: orderFeesError,
    refetch: refetchOrderFees
  } = useQuery({
    queryKey: ["/api/order-fees/active"],
    enabled: !!user && ["admin", "district_manager"].includes(user.role),
    onError: (error: Error) => {
      console.error("Error fetching order fees:", error);
    }
  });
  
  // Helper function to calculate DM payment from order items
  // DM gets: subtotal (product prices) + district hub fee calculated on subtotal
  const calculateDMPayment = (order: any): number | null => {
    if (!orderFees || orderFees.length === 0) return null;
    if (!order.items || order.items.length === 0) return null;
    
    // Calculate subtotal from order items (sum of price × quantity)
    const subtotal = order.items.reduce((sum: number, item: any) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : (item.price || 0);
      const quantity = item.quantity || 0;
      return sum + (price * quantity);
    }, 0);
    
    if (isNaN(subtotal) || subtotal === 0) return null;
    
    // Find district hub fee percentage
    let districtHubFeePercent = 0;
    
    orderFees.forEach((fee: any) => {
      if (!fee.isActive || fee.type !== 'percentage') return;
      
      const nameLower = fee.name?.toLowerCase() || '';
      if (nameLower.includes('district') || nameLower.includes('hub')) {
        districtHubFeePercent = parseFloat(fee.value) || 0;
      }
    });
    
    // DM gets = subtotal + (subtotal × districtHubFee%)
    const districtHubFeeAmount = (subtotal * districtHubFeePercent) / 100;
    const dmAmount = subtotal + districtHubFeeAmount;
    
    return dmAmount;
  };
  
  // Get fee percentages from order fees
  const getFeePercentages = () => {
    let districtHubFeePercent = 0;
    let techSupportFeePercent = 0;
    
    if (orderFees && orderFees.length > 0) {
      orderFees.forEach((fee: any) => {
        if (!fee.isActive || fee.type !== 'percentage') return;
        
        const nameLower = fee.name?.toLowerCase() || '';
        if (nameLower.includes('district') || nameLower.includes('hub')) {
          districtHubFeePercent = parseFloat(fee.value) || 0;
        }
        if (nameLower.includes('tech') || nameLower.includes('santhe') || nameLower.includes('platform')) {
          techSupportFeePercent = parseFloat(fee.value) || 0;
        }
      });
    }
    
    return { districtHubFeePercent, techSupportFeePercent };
  };
  
  // Calculate payment split from total revenue
  // FPO gets: Product Price (Subtotal)
  // Santhe Platform gets: Fixed 9% Tech Support Fee
  const TECH_SUPPORT_FEE_PERCENT = 9;
  const calculatePaymentSplit = (totalRevenue: number) => {
    const totalFeeMultiplier = 1 + (TECH_SUPPORT_FEE_PERCENT / 100);
    
    const subtotal = totalRevenue / totalFeeMultiplier;
    const techFeeAmount = subtotal * (TECH_SUPPORT_FEE_PERCENT / 100);
    
    return {
      farmerPayout: subtotal,
      dmEarnings: subtotal,
      platformEarnings: techFeeAmount,
      hubFeeAmount: 0,
      techFeeAmount,
      districtHubFeePercent: 0,
      techSupportFeePercent: TECH_SUPPORT_FEE_PERCENT
    };
  };
  
  // Calculate farmer payouts from orders and events (aggregate by farmer)
  const calculateFarmerPayouts = (ordersData: any[], eventsData: any[] = [], feeMultiplier: number = 1.24) => {
    const farmerPayouts: Record<string, { farmerId: number | string; farmerName: string; totalPayout: number; orderCount: number; eventCount: number }> = {};
    
    // Process orders
    if (ordersData && ordersData.length > 0) {
      ordersData.forEach((order: any) => {
        if (!order.items || order.items.length === 0) return;
        
        order.items.forEach((item: any) => {
          const farmerId = item.product?.farmerId || item.farmerId || item.productId || 'unknown';
          
          let farmerName = 'Unknown Farm';
          if (item.product?.farmer?.farmName) {
            farmerName = item.product.farmer.farmName;
          } else if (item.product?.farm?.name) {
            farmerName = item.product.farm.name;
          } else if (item.farmName) {
            farmerName = item.farmName;
          } else if (item.product?.farmName) {
            farmerName = item.product.farmName;
          } else if (item.farmerName) {
            farmerName = item.farmerName;
          } else if (item.product?.farmer?.name) {
            farmerName = item.product.farmer.name;
          } else if (item.productName) {
            farmerName = `Product: ${item.productName}`;
          }
          
          const price = typeof item.price === 'string' ? parseFloat(item.price) : (item.price || 0);
          const quantity = item.quantity || 1;
          const itemTotal = price * quantity;
          
          // Use farm name as key to combine orders and events from same farm
          const key = farmerName.toLowerCase().trim();
          if (!farmerPayouts[key]) {
            farmerPayouts[key] = {
              farmerId,
              farmerName,
              totalPayout: 0,
              orderCount: 0,
              eventCount: 0
            };
          }
          
          farmerPayouts[key].totalPayout += itemTotal;
          farmerPayouts[key].orderCount += 1;
        });
      });
    }
    
    // Process events (add event organizer payouts)
    if (eventsData && eventsData.length > 0) {
      eventsData.forEach((event: any) => {
        if (!event.bookings || event.bookings.length === 0) return;
        
        // Get organizer (farmer) info from event - use farmerId to match with product orders
        const farmerId = event.farmerId || event.farmerProfile?.id || event.userId || 'unknown-event';
        const farmerName = event.farmerProfile?.farmName || event.farmer?.farmName || event.farmer?.name || event.organizerName || event.title || 'Event Organizer';
        
        // Calculate total payout for this event's paid bookings
        const paidBookings = event.bookings.filter((b: any) => b.paymentStatus === 'paid');
        const eventPayout = paidBookings.reduce((sum: number, b: any) => {
          const totalAmount = parseFloat(b.totalAmount || 0);
          // Extract base price from total (remove fees)
          const basePrice = totalAmount / feeMultiplier;
          return sum + basePrice;
        }, 0);
        
        if (eventPayout > 0) {
          // Use farm name as key to combine orders and events from same farm
          const key = farmerName.toLowerCase().trim();
          if (!farmerPayouts[key]) {
            farmerPayouts[key] = {
              farmerId,
              farmerName,
              totalPayout: 0,
              orderCount: 0,
              eventCount: 0
            };
          }
          
          farmerPayouts[key].totalPayout += eventPayout;
          farmerPayouts[key].eventCount += paidBookings.length;
        }
      });
    }
    
    // Convert to array and sort by payout amount (highest first)
    return Object.values(farmerPayouts).sort((a, b) => b.totalPayout - a.totalPayout);
  };
  
  // Fetch all categories
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories
  } = useQuery({
    queryKey: ["/api/categories"],
    enabled: true, // Always enabled so categories are available for product editing
    onError: (error: Error) => {
      console.error("Error fetching categories:", error);
    }
  });
  
  // Fetch official buyers
  const {
    data: officialBuyersList = [],
    isLoading: officialBuyersLoading,
    refetch: refetchOfficialBuyers,
  } = useQuery<{ id: number; name: string; type: string; logoUrl: string | null; createdAt: string }[]>({
    queryKey: ["/api/official-buyers"],
    enabled: user?.role === "admin",
  });

  // Fetch all districts
  const {
    data: districts = [],
    isLoading: districtsLoading,
    error: districtsError,
    refetch: refetchDistricts
  } = useQuery<District[]>({
    queryKey: ["/api/districts"],
    enabled: true, // Always enabled so districts are available for user management
  });
  
  // Fetch all users for admin
  const {
    data: usersList = [],
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ["/api/admin/users", userRoleFilter],
    queryFn: async () => {
      const response = await apiRequest(
        "GET", 
        `/api/admin/users${userRoleFilter !== "all" ? `?role=${userRoleFilter}` : ""}`
      );
      return await response.json();
    },
    enabled: user?.role === "admin" && activeTab === "users",
    onError: (error: Error) => {
      console.error("Error fetching users:", error);
    }
  });
  
  // Fetch product sales data
  const {
    data: productSalesData,
    isLoading: salesDataLoading,
    refetch: refetchSalesData
  } = useQuery({
    queryKey: ["/api/admin/products/sales", selectedProductForSales?.id],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/admin/products/${selectedProductForSales.id}/sales`);
      return await response.json();
    },
    enabled: user && ["admin", "district_manager"].includes(user.role) && selectedProductForSales !== null,
  });
  
  // Fetch AI subscription plans
  const {
    data: aiPlans = [],
    isLoading: aiPlansLoading,
    error: aiPlansError,
    refetch: refetchAiPlans
  } = useQuery({
    queryKey: ["/api/admin/ai-plans"],
    enabled: user?.role === "admin" && activeTab === "ai-plans",
    onError: (error: Error) => {
      console.error("Error fetching AI plans:", error);
    }
  });
  
  // Create a new order fee
  const createFeeMutation = useMutation({
    mutationFn: async (feeData: Omit<OrderFee, "id" | "createdAt" | "updatedAt">) => {
      const res = await apiRequest("POST", "/api/admin/order-fees", feeData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Order fee created successfully",
      });
      refetchOrderFees();
      setShowFeeForm(false);
      resetFeeForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create order fee: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Update an existing order fee
  const updateFeeMutation = useMutation({
    mutationFn: async ({ id, ...feeData }: { id: number } & Partial<Omit<OrderFee, "id" | "createdAt" | "updatedAt">>) => {
      const res = await apiRequest("PUT", `/api/admin/order-fees/${id}`, feeData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Order fee updated successfully",
      });
      refetchOrderFees();
      setShowFeeForm(false);
      setEditingFee(null);
      resetFeeForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update order fee: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Delete an order fee
  const deleteFeeMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/order-fees/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Order fee deleted successfully",
      });
      refetchOrderFees();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete order fee: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Create a new category
  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: { name: string; description: string }) => {
      try {
        console.log("Creating category with data:", categoryData);
        const response = await apiRequest("POST", "/api/categories", categoryData);
        console.log("Category creation response status:", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Category creation failed:", errorText);
          throw new Error(errorText || "Failed to create category");
        }
        
        const data = await response.json();
        console.log("Category created successfully:", data);
        return data;
      } catch (error) {
        console.error("Error in category creation:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Success", 
        description: "Category created successfully"
      });
      refetchCategories();
      setCategoryForm({ name: "", description: "" });
      setShowCategoryForm(false);
    },
    onError: (error: Error) => {
      console.error("Category creation error in mutation handler:", error);
      toast({
        title: "Error",
        description: `Failed to create category: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Update an existing category
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { name: string; description: string } }) => {
      try {
        console.log("Updating category with data:", data);
        const response = await apiRequest("PUT", `/api/categories/${id}`, data);
        console.log("Category update response status:", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Category update failed:", errorText);
          throw new Error(errorText || "Failed to update category");
        }
        
        const responseData = await response.json();
        console.log("Category updated successfully:", responseData);
        return responseData;
      } catch (error) {
        console.error("Error in category update:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      refetchCategories();
      setCategoryForm({ name: "", description: "" });
      setEditingCategory(null);
      setShowCategoryForm(false);
    },
    onError: (error: Error) => {
      console.error("Category update error in mutation handler:", error);
      toast({
        title: "Error",
        description: `Failed to update category: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Delete a category
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      try {
        console.log("Deleting category with ID:", id);
        const response = await apiRequest("DELETE", `/api/categories/${id}`);
        console.log("Category deletion response status:", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Category deletion failed:", errorText);
          throw new Error(errorText || "Failed to delete category");
        }
        
        const data = await response.json();
        console.log("Category deleted successfully:", data);
        return data;
      } catch (error) {
        console.error("Error in category deletion:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      refetchCategories();
    },
    onError: (error: Error) => {
      console.error("Category deletion error in mutation handler:", error);
      toast({
        title: "Error",
        description: `Failed to delete category: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Official Buyers Mutations
  const createBuyerMutation = useMutation({
    mutationFn: async (data: { name: string; type: string; logoUrl: string }) => {
      const response = await apiRequest("POST", "/api/admin/official-buyers", data);
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Buyer added successfully" });
      setShowBuyerForm(false);
      setBuyerForm({ name: "", type: "other", logoUrl: "" });
      setEditingBuyer(null);
      refetchOfficialBuyers();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateBuyerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { name: string; type: string; logoUrl: string } }) => {
      const response = await apiRequest("PATCH", `/api/admin/official-buyers/${id}`, data);
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Buyer updated successfully" });
      setShowBuyerForm(false);
      setBuyerForm({ name: "", type: "other", logoUrl: "" });
      setEditingBuyer(null);
      refetchOfficialBuyers();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteBuyerMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/official-buyers/${id}`);
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Buyer removed successfully" });
      refetchOfficialBuyers();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // District Management Mutations
  // Create a new district
  const createDistrictMutation = useMutation({
    mutationFn: async (districtData: { name: string; state: string; isActive: boolean }) => {
      try {
        console.log("Creating district with data:", districtData);
        const response = await apiRequest("POST", "/api/districts", districtData);
        console.log("District creation response status:", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("District creation failed:", errorText);
          throw new Error(errorText || "Failed to create district");
        }
        
        const data = await response.json();
        console.log("District created successfully:", data);
        return data;
      } catch (error) {
        console.error("Error in district creation:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "District created successfully"
      });
      refetchDistricts();
      setDistrictForm({ name: "", state: "", isActive: true });
      setShowDistrictForm(false);
    },
    onError: (error: Error) => {
      console.error("District creation error in mutation handler:", error);
      toast({
        title: "Error",
        description: `Failed to create district: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Update a district
  const updateDistrictMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { name: string; state: string; isActive: boolean } }) => {
      try {
        console.log("Updating district with data:", data);
        const response = await apiRequest("PUT", `/api/districts/${id}`, data);
        console.log("District update response status:", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("District update failed:", errorText);
          throw new Error(errorText || "Failed to update district");
        }
        
        const result = await response.json();
        console.log("District updated successfully:", result);
        return result;
      } catch (error) {
        console.error("Error in district update:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "District updated successfully",
      });
      refetchDistricts();
      setDistrictForm({ name: "", state: "", isActive: true });
      setEditingDistrict(null);
      setShowDistrictForm(false);
    },
    onError: (error: Error) => {
      console.error("District update error in mutation handler:", error);
      toast({
        title: "Error",
        description: `Failed to update district: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete a district
  const deleteDistrictMutation = useMutation({
    mutationFn: async (id: number) => {
      try {
        console.log("Deleting district with ID:", id);
        const response = await apiRequest("DELETE", `/api/districts/${id}`);
        console.log("District deletion response status:", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("District deletion failed:", errorText);
          throw new Error(errorText || "Failed to delete district");
        }
        
        const data = await response.json();
        console.log("District deleted successfully:", data);
        return data;
      } catch (error) {
        console.error("Error in district deletion:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "District deleted successfully",
      });
      refetchDistricts();
    },
    onError: (error: Error) => {
      console.error("District deletion error in mutation handler:", error);
      toast({
        title: "Error",
        description: `Failed to delete district: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Create a new user
  const createUserMutation = useMutation({
    mutationFn: async (userData: Omit<typeof userForm, "password"> & { password?: string }) => {
      try {
        console.log("Creating user with data:", userData);
        const response = await apiRequest("POST", "/api/admin/users", userData);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("User creation failed:", errorText);
          throw new Error(errorText || "Failed to create user");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Error in user creation:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User created successfully",
      });
      refetchUsers();
      refetchStats();
      setShowUserForm(false);
      setUserForm({
        username: "",
        email: "",
        name: "",
        role: "customer",
        password: "",
        isActive: true
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create user: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Update an existing user
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, ...userData }: { id: number } & Partial<Omit<typeof userForm, "password"> & { password?: string }>) => {
      try {
        console.log("Updating user with data:", userData);
        const response = await apiRequest("PUT", `/api/admin/users/${id}`, userData);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("User update failed:", errorText);
          throw new Error(errorText || "Failed to update user");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Error in user update:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      refetchUsers();
      setShowUserForm(false);
      setEditingUser(null);
      setUserForm({
        username: "",
        email: "",
        name: "",
        role: "customer",
        password: "",
        isActive: true
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update user: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Toggle user active status
  const toggleUserStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      try {
        console.log(`${isActive ? 'Activating' : 'Deactivating'} user with ID:`, id);
        const response = await apiRequest("PUT", `/api/admin/users/${id}/toggle-status`, { isActive });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("User status toggle failed:", errorText);
          throw new Error(errorText || "Failed to update user status");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Error in user status toggle:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `User ${data.isActive ? 'activated' : 'deactivated'} successfully`,
      });
      refetchUsers();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update user status: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Approve or reject a product
  const approvalMutation = useMutation({
    mutationFn: async ({ 
      productId, 
      approvalStatus, 
      rejectionReason 
    }: { 
      productId: number; 
      approvalStatus: string; 
      rejectionReason?: string 
    }) => {
      // Use different endpoints based on user role
      if (user?.role === 'district_manager') {
        // District managers use role-specific endpoints
        if (approvalStatus === 'approved') {
          const response = await apiRequest("PUT", `/api/dm/products/${productId}/approve`, {});
          return response.json();
        } else if (approvalStatus === 'rejected') {
          const response = await apiRequest("POST", `/api/dm/products/${productId}/reject`, {
            reason: rejectionReason
          });
          return response.json();
        }
      } else {
        // Admins continue using the existing endpoint
        const response = await apiRequest("PUT", `/api/admin/products/${productId}/approval`, {
          approvalStatus,
          rejectionReason
        });
        return response.json();
      }
    },
    onSuccess: () => {
      toast({
        title: "Product Updated",
        description: "The product approval status has been updated.",
      });
      // Invalidate all product-related queries to ensure updates are reflected everywhere
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/farmer"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/farmer/list"] });
      queryClient.invalidateQueries({ queryKey: ["/api/calendar"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products/approved"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products/expired"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/statistics"] });
      
      // Also refresh the local queries
      refetchPendingProducts();
      refetchApprovedProducts();
      refetchExpiredProducts();
      refetchStats();
      refetchFarmers();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update product status",
        variant: "destructive"
      });
    }
  });
  
  // Update order status
  const orderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const response = await apiRequest("PUT", `/api/admin/orders/${orderId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Order Updated",
        description: "The order status has been updated.",
      });
      refetchOrders();
      refetchStats();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update order status",
        variant: "destructive"
      });
    }
  });
  
  // Handle product approval/rejection
  const handleProductApproval = (productId: number, approvalStatus: string, rejectionReason?: string) => {
    approvalMutation.mutate({ productId, approvalStatus, rejectionReason });
  };

  // Handle editing a pending product (for admin to edit before approval)
  const handleEditPendingProduct = (product: any) => {
    // Navigate to unified product edit page
    setLocation(`/dashboard/products/${product.id}`);
  };

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ productId, ...productData }: { productId: number } & typeof productEditForm) => {
      const response = await apiRequest("PUT", `/api/admin/products/${productId}`, {
        ...productData,
        price: parseFloat(productData.price),
        inventory: parseInt(productData.inventory),
        unitsPerBox: parseInt(productData.unitsPerBox),
        categoryId: parseInt(productData.categoryId),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Product Updated",
        description: "The product has been updated successfully.",
      });
      setShowEditProductModal(false);
      setEditingProduct(null);
      setProductEditForm({
        name: "",
        description: "",
        price: "",
        inventory: "",
        unit: "",
        unitsPerBox: "",
        harvestDate: "",
        availableUntil: "",
        growingDetails: "",
        categoryId: "",
        status: "",
      });
      // Refresh all product queries
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      refetchPendingProducts();
      refetchApprovedProducts();
      refetchStats();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update product",
        variant: "destructive"
      });
    }
  });
  
  // Handle order status change
  const handleOrderStatusChange = (orderId: number, status: string) => {
    orderStatusMutation.mutate({ orderId, status });
  };

  // Toggle Organic certification
  const toggleOrganicCertificationMutation = useMutation({
    mutationFn: async ({ farmerId, isOrganicCertified }: { farmerId: number; isOrganicCertified: boolean }) => {
      const endpoint = user?.role === 'district_manager'
        ? `/api/dm/farmers/${farmerId}/organic-certification`
        : `/api/admin/farmers/${farmerId}/organic-certification`;
      const response = await apiRequest("PUT", endpoint, { isOrganicCertified });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Organic Certification Updated", description: "The farmer's organic certification status has been updated." });
      refetchFarmers();
    },
    onError: (error) => {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to update organic certification", variant: "destructive" });
    }
  });

  // Toggle Natural certification
  const toggleNaturalCertificationMutation = useMutation({
    mutationFn: async ({ farmerId, isNaturalCertified }: { farmerId: number; isNaturalCertified: boolean }) => {
      const endpoint = user?.role === 'district_manager'
        ? `/api/dm/farmers/${farmerId}/natural-certification`
        : `/api/admin/farmers/${farmerId}/natural-certification`;
      const response = await apiRequest("PUT", endpoint, { isNaturalCertified });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Natural Certification Updated", description: "The farmer's natural certification status has been updated." });
      refetchFarmers();
    },
    onError: (error) => {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to update natural certification", variant: "destructive" });
    }
  });

  // Create AI subscription plan
  const createAiPlanMutation = useMutation({
    mutationFn: async (planData: AiPlanFormData) => {
      const res = await apiRequest("POST", "/api/admin/ai-plans", planData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "AI subscription plan created successfully",
      });
      refetchAiPlans();
      setShowAiPlanForm(false);
      resetAiPlanForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create AI plan: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Update AI subscription plan
  const updateAiPlanMutation = useMutation({
    mutationFn: async ({ id, ...planData }: { id: number } & Partial<AiPlanFormData>) => {
      const res = await apiRequest("PUT", `/api/admin/ai-plans/${id}`, planData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "AI subscription plan updated successfully",
      });
      refetchAiPlans();
      setShowAiPlanForm(false);
      setEditingAiPlan(null);
      resetAiPlanForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update AI plan: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete AI subscription plan
  const deleteAiPlanMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/ai-plans/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "AI subscription plan deleted successfully",
      });
      refetchAiPlans();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete AI plan: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Reset fee form to defaults
  const resetFeeForm = () => {
    setFeeForm({
      name: "",
      description: "",
      type: "fixed",
      value: "",
      isActive: true,
      applyToSubtotal: false,
      displayOrder: 0
    });
  };

  // Reset AI plan form to defaults
  const resetAiPlanForm = () => {
    setAiPlanForm({
      name: "",
      description: "",
      price: "",
      duration: 30,
      durationType: "monthly",
      isActive: true
    });
  };

  // Handle editing an AI plan
  const handleEditAiPlan = (plan: AiSubscriptionPlan) => {
    setEditingAiPlan(plan);
    setAiPlanForm({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      duration: plan.duration,
      durationType: plan.durationType,
      isActive: plan.isActive
    });
    setShowAiPlanForm(true);
  };

  // Handle creating/updating an AI plan
  const handleSubmitAiPlan = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAiPlan) {
      updateAiPlanMutation.mutate({ id: editingAiPlan.id, ...aiPlanForm });
    } else {
      createAiPlanMutation.mutate(aiPlanForm);
    }
  };

  // Get duration label for display
  const getDurationLabel = (duration: number, durationType: string) => {
    if (durationType === "monthly") return `${duration} days (Monthly)`;
    if (durationType === "yearly") return `${duration} days (Yearly)`;
    if (durationType === "6months") return `${duration} days (6 Months)`;
    return `${duration} days`;
  };
  
  // Handle editing a fee
  const handleEditFee = (fee: OrderFee) => {
    setEditingFee(fee);
    setFeeForm({
      name: fee.name,
      description: fee.description || "",
      type: fee.type as "fixed" | "percentage",
      value: fee.value,
      isActive: fee.isActive,
      applyToSubtotal: fee.applyToSubtotal,
      displayOrder: fee.displayOrder
    });
    setShowFeeForm(true);
  };
  
  // Handle creating/updating a fee
  const handleSubmitFee = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert value to number since the server validation expects a number
    const feeData = {
      ...feeForm,
      // Ensure value is a number
      value: parseFloat(feeForm.value) || 0
    };
    
    if (editingFee) {
      console.log("Updating fee:", { id: editingFee.id, ...feeData });
      updateFeeMutation.mutate({
        id: editingFee.id,
        ...feeData
      });
    } else {
      createFeeMutation.mutate(feeData);
    }
  };
  
  // Handle deleting a fee
  const handleDeleteFee = (id: number) => {
    if (confirm("Are you sure you want to delete this fee? This action cannot be undone.")) {
      deleteFeeMutation.mutate(id);
    }
  };
  
  // Handle editing a product
  const handleEditProduct = (product: any) => {
    // Navigate to unified product edit page
    setLocation(`/dashboard/products/${product.id}`);
  };
  
  // Handle deleting a product
  const handleDeleteProduct = (productId: number) => {
    if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      deleteProductMutation.mutate(productId);
    }
  };
  
  // Handle viewing product sales
  const handleViewSales = (product: any) => {
    setSelectedProductForSales(product);
    setShowSalesModal(true);
  };
  
  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await apiRequest("DELETE", `/api/products/${productId}`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      refetchApprovedProducts();
      refetchExpiredProducts();
      refetchStats();
      // Invalidate all product-related queries to ensure updates across the platform
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/farmer/list"] });
      queryClient.invalidateQueries({ queryKey: ["/api/calendar"] });
      // Also invalidate category-specific product queries
      queryClient.invalidateQueries({ queryKey: ["/api/products", "category"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products", "farmer"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete product: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // DM product creation mutation
  const createDmProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const res = await apiRequest("POST", `/api/dm/products`, productData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product created and approved successfully",
      });
      setShowDmProductForm(false);
      setDmProductForm({
        farmerId: "", name: "", description: "", price: "", unit: "kg", categoryId: "",
        harvestDate: "", availableUntil: "", inventory: "", gradeVariety: "",
        b2cQuantity: "", b2bQuantity: "", b2cMoq: "1", b2bMoq: "1", growingDetails: "", imageUrl: ""
      });
      setDmProductSlabs([]);
      refetchApprovedProducts();
      refetchStats();
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dm/products"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create product: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Farmer mutations
  const updateFarmerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PUT", `/api/admin/farmers/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Farmer updated successfully",
      });
      setShowFarmerForm(false);
      setEditingFarmer(null);
      refetchFarmers();
      refetchStats();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update farmer: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const deleteFarmerMutation = useMutation({
    mutationFn: async (farmerId: number) => {
      const res = await apiRequest("DELETE", `/api/admin/farmers/${farmerId}`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Farmer deleted successfully",
      });
      refetchFarmers();
      refetchStats();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete farmer: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const { data: linkedFarmerIds = [] } = useQuery<{ linkId: number; farmerUserId: number; status: string; createdAt: string; farmerName: string; farmerDistrict: string; farmerPhone: string; farmerEmail: string }[]>({
    queryKey: ["/api/dm/linked-farmers"],
    enabled: user?.role === 'district_manager' && activeTab === "farmers",
  });

  const { data: pendingFarmerRequests = [], isLoading: pendingRequestsLoading, refetch: refetchPendingRequests } = useQuery<{ linkId: number; farmerUserId: number; farmName: string; farmerName: string; farmerDistrict: string; farmerPhone: string; farmerEmail: string; logoUrl: string | null; farmerAvatar: string | null; requestedAt: string }[]>({
    queryKey: ["/api/dm/farmer-requests"],
    enabled: user?.role === 'district_manager' && activeTab === "farmers",
  });

  const approveFarmerMutation = useMutation({
    mutationFn: async (farmerUserId: number) => {
      const res = await apiRequest("PUT", `/api/dm/farmer-requests/${farmerUserId}/approve`);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Farmer approved", description: "The farmer has been linked to your FPO." });
      queryClient.invalidateQueries({ queryKey: ["/api/dm/farmer-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dm/linked-farmers"] });
      refetchPendingRequests();
      refetchFarmers();
    },
    onError: (error: any) => {
      toast({ title: "Failed to approve", description: error.message, variant: "destructive" });
    },
  });

  const rejectFarmerMutation = useMutation({
    mutationFn: async (farmerUserId: number) => {
      const res = await apiRequest("PUT", `/api/dm/farmer-requests/${farmerUserId}/reject`);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Request rejected", description: "The join request has been declined." });
      queryClient.invalidateQueries({ queryKey: ["/api/dm/farmer-requests"] });
      refetchPendingRequests();
    },
    onError: (error: any) => {
      toast({ title: "Failed to reject", description: error.message, variant: "destructive" });
    },
  });

  const unlinkFarmerMutation = useMutation({
    mutationFn: async (farmerUserId: number) => {
      const res = await apiRequest("DELETE", `/api/dm/unlink-farmer/${farmerUserId}`);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Farmer unlinked from your FPO" });
      queryClient.invalidateQueries({ queryKey: ["/api/dm/linked-farmers"] });
      refetchFarmers();
    },
    onError: (error: any) => {
      toast({ title: "Failed to unlink farmer", description: error.message, variant: "destructive" });
    },
  });

  // FPO Storefront Inquiries query (admin only)
  const { data: fpoInquiriesList = [], isLoading: fpoInquiriesLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/fpo-inquiries"],
    enabled: !!user && user.role === "admin" && activeTab === "fpo-inquiries",
  });

  // Farmer form handlers
  const handleEditFarmer = (farmer: AdminFarmer) => {
    setEditingFarmer(farmer);
    setFarmerForm({
      farmName: farmer.farmName || "",
      description: farmer.description || "",
      location: farmer.location || "",
      address: farmer.address || "",
      phone: farmer.phone || "",
      email: farmer.email || "",
      website: farmer.website || "",
      story: farmer.story || "",
      practices: farmer.practices || "",
      tags: farmer.tags || []
    });
    setShowFarmerForm(true);
  };

  const handleFarmerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFarmer) {
      updateFarmerMutation.mutate({
        id: editingFarmer.id,
        data: farmerForm
      });
    }
  };

  const resetFarmerForm = () => {
    setFarmerForm({
      farmName: "",
      description: "",
      location: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      facebook: "",
      instagram: "",
      story: "",
      practices: "",
      tags: []
    });
    setEditingFarmer(null);
    setShowFarmerForm(false);
  };
  
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return null; // Will be redirected by the useEffect
  }
  
  if (!["admin", "district_manager", "taluk_agent"].includes(user.role)) {
    return null; // Will be redirected by the useEffect
  }

  // Staff Management Component
  function StaffManagement() {
    const [activeStaffTab, setActiveStaffTab] = useState("overview");
    const [dmSearchTerm, setDmSearchTerm] = useState("");
    const [dmDistrictFilter, setDmDistrictFilter] = useState("all");
    const [showStaffForm, setShowStaffForm] = useState(false);
    const [editingStaff, setEditingStaff] = useState<any>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<any>(null);
    const [viewingDmDashboard, setViewingDmDashboard] = useState<any>(null);
    const [managingDeliveryForDm, setManagingDeliveryForDm] = useState<any>(null);
    const [dmLogoFile, setDmLogoFile] = useState<File | null>(null);
    const [dmLogoUploading, setDmLogoUploading] = useState(false);
    const dmLogoFileInputRef = useRef<HTMLInputElement>(null);
    
    // Fetch DM stats when viewing dashboard
    const { data: dmStats, isLoading: dmStatsLoading, error: dmStatsError } = useQuery({
      queryKey: ["/api/admin/dm-stats", viewingDmDashboard?.id],
      queryFn: async () => {
        if (!viewingDmDashboard) return null;
        try {
          const response = await apiRequest("GET", `/api/admin/dm-stats/${viewingDmDashboard.id}`);
          return response.json();
        } catch (error) {
          console.error("DM stats fetch error:", error);
          throw error;
        }
      },
      enabled: !!viewingDmDashboard,
      retry: 1,
      staleTime: 0
    });
    const [staffForm, setStaffForm] = useState({
      username: "",
      password: "",
      email: "",
      name: "",
      phone: "",
      role: "",
      district: "",
      taluk: "",
      reportsTo: "",
      isActive: true,
      // District Manager / FPO Organization Details
      orgName: "",
      orgAddress: "",
      orgPhone: "",
      orgEmail: "",
      orgLogoUrl: "",
      bankAccountNumber: "",
      bankIfsc: "",
      gstNumber: "",
      upiId: ""
    });

    // Fetch staff by role
    const { data: districtManagers, isLoading: dmLoading } = useQuery<UserRecord[]>({
      queryKey: ["/api/admin/staff/district_manager"],
      enabled: activeStaffTab === "overview" || activeStaffTab === "district-managers"
    });

    const { data: talukAgents, isLoading: taLoading } = useQuery<UserRecord[]>({
      queryKey: ["/api/admin/staff/taluk_agent"],
      enabled: activeStaffTab === "overview" || activeStaffTab === "taluk-agents"
    });

    const { data: deliveryAgents, isLoading: daLoading } = useQuery<UserRecord[]>({
      queryKey: ["/api/admin/staff/delivery_agent"],
      enabled: activeStaffTab === "overview" || activeStaffTab === "delivery-agents"
    });

    // Create staff mutation
    const createStaffMutation = useMutation({
      mutationFn: (data: any) => apiRequest("POST", "/api/admin/staff", data),
      onSuccess: () => {
        toast({ title: "Success", description: editingStaff ? "Staff member updated successfully" : "Staff member created successfully" });
        resetStaffForm();
        queryClient.invalidateQueries({ queryKey: ["/api/admin/staff"] });
      },
      onError: (error: any) => {
        toast({ 
          variant: "destructive",
          title: "Error", 
          description: error.message || (editingStaff ? "Failed to update staff member" : "Failed to create staff member")
        });
      }
    });

    // Update staff mutation
    const updateStaffMutation = useMutation({
      mutationFn: ({ id, data }: { id: number; data: any }) => apiRequest("PUT", `/api/admin/staff/${id}`, data),
      onSuccess: () => {
        toast({ title: "Success", description: "Staff member updated successfully" });
        resetStaffForm();
        queryClient.invalidateQueries({ queryKey: ["/api/admin/staff"] });
      },
      onError: (error: any) => {
        toast({ 
          variant: "destructive",
          title: "Error", 
          description: error.message || "Failed to update staff member" 
        });
      }
    });

    // Toggle staff status mutation
    const toggleStaffStatusMutation = useMutation({
      mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => 
        apiRequest("PATCH", `/api/admin/staff/${id}/status`, { isActive }),
      onSuccess: () => {
        toast({ title: "Success", description: "Staff status updated successfully" });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/staff"] });
      },
      onError: (error: any) => {
        toast({ 
          variant: "destructive",
          title: "Error", 
          description: error.message || "Failed to update staff status" 
        });
      }
    });

    // Delete staff mutation
    const deleteStaffMutation = useMutation({
      mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/staff/${id}`),
      onSuccess: () => {
        toast({ title: "Success", description: "Staff member deleted successfully" });
        setShowDeleteConfirmation(null);
        queryClient.invalidateQueries({ queryKey: ["/api/admin/staff"] });
      },
      onError: (error: any) => {
        toast({ 
          variant: "destructive",
          title: "Error", 
          description: error.message || "Failed to delete staff member" 
        });
      }
    });

    const resetStaffForm = () => {
      setStaffForm({
        username: "",
        password: "",
        email: "",
        name: "",
        phone: "",
        role: "",
        district: "",
        taluk: "",
        reportsTo: "",
        isActive: true,
        // District Manager / FPO Organization Details
        orgName: "",
        orgAddress: "",
        orgPhone: "",
        orgEmail: "",
        orgLogoUrl: "",
        bankAccountNumber: "",
        bankIfsc: "",
        gstNumber: "",
        upiId: ""
      });
      setDmLogoFile(null);
      setEditingStaff(null);
      setShowStaffForm(false);
    };

    const handleCreateStaff = async () => {
      if (!staffForm.username || !staffForm.email || !staffForm.role || !staffForm.name) {
        toast({ 
          variant: "destructive",
          title: "Error", 
          description: "Please fill in all required fields" 
        });
        return;
      }

      // Enhanced validation for district managers
      if (staffForm.role === "district_manager") {
        const requiredOrgFields = {
          district: "District assignment",
          orgName: "Organization name",
          orgAddress: "Organization address",
          orgPhone: "Organization phone",
          orgEmail: "Organization email",
          bankAccountNumber: "Bank account number",
          bankIfsc: "Bank IFSC code"
        };
        
        for (const [field, label] of Object.entries(requiredOrgFields)) {
          if (!staffForm[field as keyof typeof staffForm]) {
            toast({ 
              variant: "destructive",
              title: "Error", 
              description: `${label} is required for district managers` 
            });
            return;
          }
        }

        // Validate IFSC format
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(staffForm.bankIfsc)) {
          toast({ 
            variant: "destructive",
            title: "Error", 
            description: "Please enter a valid IFSC code (e.g., ABCD0123456)" 
          });
          return;
        }

        // Validate GST format if provided
        if (staffForm.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(staffForm.gstNumber)) {
          toast({ 
            variant: "destructive",
            title: "Error", 
            description: "Please enter a valid GST number format" 
          });
          return;
        }
      }

      // If a logo file was selected, upload it now before saving
      let finalLogoUrl = staffForm.orgLogoUrl;
      if (dmLogoFile) {
        setDmLogoUploading(true);
        try {
          const formData = new FormData();
          formData.append("image", dmLogoFile);
          const res = await apiRequest("POST", "/api/upload", formData, { isFormData: true });
          const data = await res.json();
          finalLogoUrl = data.imageUrl;
        } catch {
          toast({ title: "Logo upload failed", description: "Could not upload the logo. Please try again.", variant: "destructive" });
          setDmLogoUploading(false);
          return;
        }
        setDmLogoUploading(false);
        setDmLogoFile(null);
      }

      if (editingStaff) {
        const updateData = { ...staffForm, orgLogoUrl: finalLogoUrl };
        if (!updateData.password) {
          delete updateData.password;
        }
        updateStaffMutation.mutate({ id: editingStaff.id, data: updateData });
      } else {
        if (!staffForm.password) {
          toast({ 
            variant: "destructive",
            title: "Error", 
            description: "Password is required for new staff members" 
          });
          return;
        }
        createStaffMutation.mutate({ ...staffForm, orgLogoUrl: finalLogoUrl });
      }
    };

    const handleEditStaff = (staff: any) => {
      setEditingStaff(staff);
      setStaffForm({
        username: staff.username,
        password: "",
        email: staff.email,
        name: staff.name,
        phone: staff.phone,
        role: staff.role,
        district: staff.district || "",
        taluk: staff.taluk || "",
        reportsTo: staff.reportsTo?.toString() || "",
        isActive: staff.isActive,
        // Organization Details (for District Managers/FPOs)
        orgName: staff.orgName || "",
        orgAddress: staff.orgAddress || "",
        orgPhone: staff.orgPhone || "",
        orgEmail: staff.orgEmail || "",
        orgLogoUrl: staff.orgLogoUrl || "",
        bankAccountNumber: staff.bankAccountNumber || "",
        bankIfsc: staff.bankIfsc || "",
        gstNumber: staff.gstNumber || "",
        upiId: staff.upiId || ""
      });
      setShowStaffForm(true);
    };

    const handleToggleStaffStatus = (staff: any) => {
      toggleStaffStatusMutation.mutate({ 
        id: staff.id, 
        isActive: !staff.isActive 
      });
    };

    const handleDeleteStaff = (staff: any) => {
      setShowDeleteConfirmation(staff);
    };

    const confirmDeleteStaff = () => {
      if (showDeleteConfirmation) {
        deleteStaffMutation.mutate(showDeleteConfirmation.id);
      }
    };

    const getRoleName = (role: string) => {
      switch (role) {
        case "district_manager":
          return "District Manager";
        case "taluk_agent":
          return "Taluk-level Farm Squad";
        case "delivery_agent":
          return "Delivery Squad";
        default:
          return role;
      }
    };

    return (
      <div className="container mx-auto py-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Staff Hierarchy Management
            </CardTitle>
            <CardDescription>
              Manage District Managers, Taluk-level Farm Squad, and Delivery Squad roles with reporting structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeStaffTab} onValueChange={setActiveStaffTab}>
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-1 h-auto mb-6">
                <TabsTrigger value="overview" className="text-xs sm:text-sm py-2">Overview</TabsTrigger>
                <TabsTrigger value="district-managers" className="text-xs sm:text-sm py-2">DMs</TabsTrigger>
                <TabsTrigger value="taluk-agents" className="text-xs sm:text-sm py-2">Farm Squad</TabsTrigger>
                <TabsTrigger value="delivery-agents" className="text-xs sm:text-sm py-2">Delivery</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">District Managers</CardTitle>
                      <Building className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{districtManagers?.length || 0}</div>
                      <p className="text-xs text-muted-foreground">Overseeing operations</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Farm Squad</CardTitle>
                      <Shield className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{talukAgents?.length || 0}</div>
                      <p className="text-xs text-muted-foreground">Field operations</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Delivery Squad</CardTitle>
                      <Truck className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{deliveryAgents?.length || 0}</div>
                      <p className="text-xs text-muted-foreground">Product delivery</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end mb-4">
                  <Button onClick={() => setShowStaffForm(true)} className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add Staff Member
                  </Button>
                </div>

                {/* Hierarchy Visualization */}
                <Card>
                  <CardHeader>
                    <CardTitle>Organization Hierarchy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <Badge variant="outline" className="bg-red-50 text-red-700">
                          Admin
                        </Badge>
                      </div>
                      <div className="flex justify-center">
                        <div className="w-px h-8 bg-gray-300"></div>
                      </div>
                      <div className="flex justify-center gap-8">
                        {districtManagers?.map((dm: any) => (
                          <div key={dm.id} className="text-center">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 mb-2">
                              {dm.name}
                            </Badge>
                            <div className="text-xs text-muted-foreground">District Manager</div>
                            <div className="text-xs">{dm.district}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* District Managers Tab */}
              <TabsContent value="district-managers">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">District Managers</h3>
                  <Button onClick={() => {
                    setStaffForm({ ...staffForm, role: "district_manager" });
                    setShowStaffForm(true);
                  }} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add District Manager
                  </Button>
                </div>

                {/* DM search and district filter */}
                {!dmLoading && districtManagers && districtManagers.length > 0 && (
                  <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search by manager name or org name…"
                        value={dmSearchTerm}
                        onChange={(e) => setDmSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <Select value={dmDistrictFilter} onValueChange={setDmDistrictFilter}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="All Districts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Districts</SelectItem>
                        {Array.from(new Set((districtManagers as any[]).map((d: any) => d.district).filter(Boolean))).sort().map((district) => (
                          <SelectItem key={district as string} value={district as string}>{district as string}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {(dmSearchTerm || dmDistrictFilter !== "all") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setDmSearchTerm(""); setDmDistrictFilter("all"); }}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4 mr-1" /> Clear
                      </Button>
                    )}
                  </div>
                )}
                
                {/* Analytics Report Dialog for a specific FPO */}
                <Dialog open={!!analyticsDialogDm} onOpenChange={(open) => { if (!open) setAnalyticsDialogDm(null); }}>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <BarChart2 className="h-5 w-5 text-purple-600" />
                        Analytics Report — {analyticsDialogDm?.orgName || analyticsDialogDm?.name}
                      </DialogTitle>
                      <DialogDescription>Select a period and download the performance analytics PDF for this FPO.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div>
                        <Label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Report Period</Label>
                        <div className="flex flex-wrap gap-2">
                          {(["week", "month", "year", "custom"] as const).map(p => (
                            <button key={p} onClick={() => setAnalyticsPeriod(p)}
                              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${analyticsPeriod === p ? "bg-purple-600 text-white" : "bg-white border border-purple-200 text-purple-700 hover:bg-purple-50"}`}>
                              {p === "week" ? "This Week" : p === "month" ? "This Month" : p === "year" ? "This Year" : "Custom"}
                            </button>
                          ))}
                        </div>
                      </div>
                      {analyticsPeriod === "custom" && (
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <Label className="text-xs text-gray-600 mb-1 block">From</Label>
                            <Input type="date" value={analyticsCustomStart} onChange={e => setAnalyticsCustomStart(e.target.value)} />
                          </div>
                          <div className="flex-1">
                            <Label className="text-xs text-gray-600 mb-1 block">To</Label>
                            <Input type="date" value={analyticsCustomEnd} onChange={e => setAnalyticsCustomEnd(e.target.value)} />
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 font-mono">
                        Period: {(() => {
                          const today = new Date();
                          const iso = (d: Date) => d.toISOString().split("T")[0];
                          if (analyticsPeriod === "week") { const mon = new Date(today); mon.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); return `${iso(mon)} → ${iso(today)}`; }
                          if (analyticsPeriod === "month") return `${iso(new Date(today.getFullYear(), today.getMonth(), 1))} → ${iso(today)}`;
                          if (analyticsPeriod === "year") return `${iso(new Date(today.getFullYear(), 0, 1))} → ${iso(today)}`;
                          return `${analyticsCustomStart} → ${analyticsCustomEnd}`;
                        })()}
                      </p>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                      <Button variant="outline" onClick={() => setAnalyticsDialogDm(null)} className="sm:mr-auto">Cancel</Button>
                      <Button
                        disabled={analyticsCsvLoading}
                        variant="outline"
                        className="border-purple-300 text-purple-700 hover:bg-purple-50"
                        onClick={async () => {
                          if (!analyticsDialogDm) return;
                          setAnalyticsCsvLoading(true);
                          try {
                            const today = new Date();
                            const iso = (d: Date) => d.toISOString().split("T")[0];
                            let pStart: string, pEnd: string;
                            if (analyticsPeriod === "week") { const mon = new Date(today); mon.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); pStart = iso(mon); pEnd = iso(today); }
                            else if (analyticsPeriod === "month") { pStart = iso(new Date(today.getFullYear(), today.getMonth(), 1)); pEnd = iso(today); }
                            else if (analyticsPeriod === "year") { pStart = iso(new Date(today.getFullYear(), 0, 1)); pEnd = iso(today); }
                            else { pStart = analyticsCustomStart; pEnd = analyticsCustomEnd; }
                            const raw = localStorage.getItem('harvest_direct_auth');
                            const token = raw ? JSON.parse(raw).token : null;
                            const res = await fetch(`/api/admin/analytics/report-csv?dmId=${analyticsDialogDm.id}&startDate=${pStart}&endDate=${pEnd}&period=${analyticsPeriod}`, { headers: { Authorization: `Bearer ${token}` } });
                            if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error((e as any).error || "Failed"); }
                            const blob = await res.blob();
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `${(analyticsDialogDm.orgName || "analytics").replace(/\s+/g, "_")}_${analyticsPeriod}_report.csv`;
                            a.click();
                            URL.revokeObjectURL(url);
                            toast({ title: "CSV downloaded!" });
                          } catch (e: any) {
                            toast({ title: "Error", description: e.message, variant: "destructive" });
                          } finally { setAnalyticsCsvLoading(false); }
                        }}
                      >
                        {analyticsCsvLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                        {analyticsCsvLoading ? "Generating…" : "Download CSV"}
                      </Button>
                      <Button
                        disabled={analyticsPdfLoading}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={async () => {
                          if (!analyticsDialogDm) return;
                          setAnalyticsPdfLoading(true);
                          try {
                            const today = new Date();
                            const iso = (d: Date) => d.toISOString().split("T")[0];
                            let pStart: string, pEnd: string;
                            if (analyticsPeriod === "week") { const mon = new Date(today); mon.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); pStart = iso(mon); pEnd = iso(today); }
                            else if (analyticsPeriod === "month") { pStart = iso(new Date(today.getFullYear(), today.getMonth(), 1)); pEnd = iso(today); }
                            else if (analyticsPeriod === "year") { pStart = iso(new Date(today.getFullYear(), 0, 1)); pEnd = iso(today); }
                            else { pStart = analyticsCustomStart; pEnd = analyticsCustomEnd; }
                            const raw = localStorage.getItem('harvest_direct_auth');
                            const token = raw ? JSON.parse(raw).token : null;
                            const res = await fetch(`/api/admin/analytics/report-pdf?dmId=${analyticsDialogDm.id}&startDate=${pStart}&endDate=${pEnd}&period=${analyticsPeriod}`, { headers: { Authorization: `Bearer ${token}` } });
                            if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error((e as any).error || "Failed"); }
                            const blob = await res.blob();
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `${(analyticsDialogDm.orgName || "analytics").replace(/\s+/g, "_")}_${analyticsPeriod}_report.pdf`;
                            a.click();
                            URL.revokeObjectURL(url);
                            toast({ title: "Report downloaded!" });
                            setAnalyticsDialogDm(null);
                          } catch (e: any) {
                            toast({ title: "Error", description: e.message, variant: "destructive" });
                          } finally { setAnalyticsPdfLoading(false); }
                        }}
                      >
                        {analyticsPdfLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                        {analyticsPdfLoading ? "Generating…" : "Download PDF"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {dmLoading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : districtManagers && districtManagers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Personal Info</TableHead>
                          <TableHead>District</TableHead>
                          <TableHead>Organization Details</TableHead>
                          <TableHead>Bank Account Details</TableHead>
                          <TableHead>GST & UPI</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(districtManagers as any[]).filter((staff: any) =>
                          (!dmSearchTerm || staff.name?.toLowerCase().includes(dmSearchTerm.toLowerCase()) || staff.orgName?.toLowerCase().includes(dmSearchTerm.toLowerCase())) &&
                          (dmDistrictFilter === "all" || staff.district === dmDistrictFilter)
                        ).map((staff: any) => (
                          <TableRow key={staff.id}>
                            <TableCell className="font-medium">
                              <div className="space-y-1">
                                <div className="font-semibold">{staff.name}</div>
                                <div className="text-sm text-gray-600">{staff.email}</div>
                                <div className="text-sm text-gray-600">{staff.phone}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                {staff.district}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {staff.orgLogoUrl && (
                                  <img
                                    src={staff.orgLogoUrl}
                                    alt={staff.orgName || "Logo"}
                                    className="h-10 w-auto max-w-[80px] object-contain rounded border bg-gray-50 p-0.5 mb-1"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                  />
                                )}
                                <div className="font-medium">{staff.orgName || "Not provided"}</div>
                                <div className="text-sm text-gray-600">{staff.orgEmail || "Not provided"}</div>
                                <div className="text-sm text-gray-600">{staff.orgPhone || "Not provided"}</div>
                                <div className="text-xs text-gray-500">{staff.orgAddress || "No address"}</div>
                                {staff.orgSlug && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <a
                                      href={`/org/${staff.orgSlug}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      /org/{staff.orgSlug}
                                    </a>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(`https://farmersanthe.com/org/${staff.orgSlug}`);
                                        toast({ title: "Copied!", description: "Tenant URL copied to clipboard" });
                                      }}
                                      className="text-gray-400 hover:text-gray-600 p-0.5"
                                      title="Copy URL"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </button>
                                  </div>
                                )}
                                {staff.orgQrCodeUrl ? (
                                  <div className="mt-2 flex items-center gap-2">
                                    <img
                                      src={staff.orgQrCodeUrl}
                                      alt="QR Code"
                                      className="h-14 w-14 border rounded object-contain bg-white cursor-pointer"
                                      title="Click to view full size"
                                      onClick={() => window.open(staff.orgQrCodeUrl!, '_blank')}
                                    />
                                    <div className="flex flex-col gap-1">
                                      <button
                                        disabled={downloadingQrId === staff.id}
                                        aria-busy={downloadingQrId === staff.id}
                                        onClick={async () => {
                                          setDownloadingQrId(staff.id);
                                          try {
                                            await downloadImageAsBlob(staff.orgQrCodeUrl!, `qr-${staff.orgSlug || 'storefront'}.png`);
                                          } catch {
                                            toast({ title: "Download failed", description: "Could not download QR code", variant: "destructive" });
                                          } finally {
                                            setDownloadingQrId(null);
                                          }
                                        }}
                                        className="text-xs text-green-700 hover:text-green-900 flex items-center gap-0.5 border border-green-300 rounded px-1.5 py-0.5 bg-green-50 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        {downloadingQrId === staff.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                                        {downloadingQrId === staff.id ? '…' : 'QR'}
                                      </button>
                                      <button
                                        onClick={async () => {
                                          try {
                                            await apiRequest("POST", `/api/admin/staff/${staff.id}/regenerate-qr`);
                                            queryClient.invalidateQueries({ queryKey: ['/api/admin/staff/district_manager'] });
                                            queryClient.invalidateQueries({ queryKey: ['/api/admin/staff/taluk_agent'] });
                                            queryClient.invalidateQueries({ queryKey: ['/api/admin/staff/delivery_agent'] });
                                            toast({ title: "QR Regenerated", description: "New QR code generated successfully" });
                                          } catch {
                                            toast({ title: "Error", description: "Failed to regenerate QR code", variant: "destructive" });
                                          }
                                        }}
                                        className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-0.5 border border-blue-300 rounded px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100"
                                        title="Regenerate QR code"
                                      >
                                        <RefreshCw className="h-3 w-3" />
                                        Regen
                                      </button>
                                    </div>
                                  </div>
                                ) : staff.orgSlug ? (
                                  <button
                                    onClick={async () => {
                                      try {
                                        await apiRequest("POST", `/api/admin/staff/${staff.id}/regenerate-qr`);
                                        queryClient.invalidateQueries({ queryKey: ['/api/admin/staff/district_manager'] });
                                        queryClient.invalidateQueries({ queryKey: ['/api/admin/staff/taluk_agent'] });
                                        queryClient.invalidateQueries({ queryKey: ['/api/admin/staff/delivery_agent'] });
                                        toast({ title: "QR Generated", description: "QR code generated successfully" });
                                      } catch {
                                        toast({ title: "Error", description: "Failed to generate QR code", variant: "destructive" });
                                      }
                                    }}
                                    className="mt-1 text-xs text-blue-700 hover:text-blue-900 flex items-center gap-0.5 border border-blue-300 rounded px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100"
                                  >
                                    <QrCode className="h-3 w-3" />
                                    Gen QR
                                  </button>
                                ) : null}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-mono text-sm">
                                  <span className="font-medium">A/c:</span> {staff.bankAccountNumber || "Not provided"}
                                </div>
                                <div className="font-mono text-sm">
                                  <span className="font-medium">IFSC:</span> {staff.bankIfsc || "Not provided"}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-sm">
                                  <span className="font-medium">GST:</span> {staff.gstNumber || "Not provided"}
                                </div>
                                <div className="text-sm">
                                  <span className="font-medium">UPI:</span> {staff.upiId || "Not provided"}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={staff.isActive ? "default" : "secondary"}>
                                {staff.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setViewingDmDashboard(staff)}
                                title="View Dashboard"
                                className="bg-blue-50 hover:bg-blue-100"
                              >
                                <Eye className="h-4 w-4 text-blue-600" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => { setAnalyticsDialogDm(staff); setAnalyticsPeriod("month"); }}
                                title="Analytics Report"
                                className="bg-purple-50 hover:bg-purple-100"
                              >
                                <BarChart2 className="h-4 w-4 text-purple-600" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setManagingDeliveryForDm(staff)}
                                title="Manage Delivery"
                                className="bg-green-50 hover:bg-green-100"
                              >
                                <Truck className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditStaff(staff)}
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant={staff.isActive ? "destructive" : "default"} 
                                size="sm"
                                onClick={() => handleToggleStaffStatus(staff)}
                                disabled={toggleStaffStatusMutation.isPending}
                                title={staff.isActive ? "Deactivate" : "Activate"}
                              >
                                {staff.isActive ? <Ban className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteStaff(staff)}
                                disabled={deleteStaffMutation.isPending}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No district managers found</p>
                  </div>
                )}
              </TabsContent>

              {/* Taluk Agents Tab */}
              <TabsContent value="taluk-agents">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Taluk-level Farm Squad</h3>
                  <Button onClick={() => {
                    setStaffForm({ ...staffForm, role: "taluk_agent" });
                    setShowStaffForm(true);
                  }} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Farm Squad Member
                  </Button>
                </div>
                
                {taLoading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : talukAgents && talukAgents.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>District</TableHead>
                        <TableHead>Taluk</TableHead>
                        <TableHead>Reports To</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {talukAgents.map((staff: any) => (
                        <TableRow key={staff.id}>
                          <TableCell className="font-medium">{staff.name}</TableCell>
                          <TableCell>{staff.email}</TableCell>
                          <TableCell>{staff.phone}</TableCell>
                          <TableCell>{staff.district}</TableCell>
                          <TableCell>{staff.taluk}</TableCell>
                          <TableCell>
                            {districtManagers?.find((dm: any) => dm.id === staff.reportsTo)?.name || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={staff.isActive ? "default" : "secondary"}>
                              {staff.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditStaff(staff)}
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant={staff.isActive ? "destructive" : "default"} 
                                size="sm"
                                onClick={() => handleToggleStaffStatus(staff)}
                                disabled={toggleStaffStatusMutation.isPending}
                                title={staff.isActive ? "Deactivate" : "Activate"}
                              >
                                {staff.isActive ? <Ban className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteStaff(staff)}
                                disabled={deleteStaffMutation.isPending}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No farm squad members found</p>
                  </div>
                )}
              </TabsContent>

              {/* Delivery Agents Tab */}
              <TabsContent value="delivery-agents">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Delivery Squad</h3>
                  <Button onClick={() => {
                    setStaffForm({ ...staffForm, role: "delivery_agent" });
                    setShowStaffForm(true);
                  }} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Delivery Agent
                  </Button>
                </div>
                
                {daLoading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : deliveryAgents && deliveryAgents.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>District</TableHead>
                        <TableHead>Reports To</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deliveryAgents.map((staff: any) => (
                        <TableRow key={staff.id}>
                          <TableCell className="font-medium">{staff.name}</TableCell>
                          <TableCell>{staff.email}</TableCell>
                          <TableCell>{staff.phone}</TableCell>
                          <TableCell>{staff.district}</TableCell>
                          <TableCell>
                            {districtManagers?.find((dm: any) => dm.id === staff.reportsTo)?.name || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={staff.isActive ? "default" : "secondary"}>
                              {staff.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditStaff(staff)}
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant={staff.isActive ? "destructive" : "default"} 
                                size="sm"
                                onClick={() => handleToggleStaffStatus(staff)}
                                disabled={toggleStaffStatusMutation.isPending}
                                title={staff.isActive ? "Deactivate" : "Activate"}
                              >
                                {staff.isActive ? <Ban className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteStaff(staff)}
                                disabled={deleteStaffMutation.isPending}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Truck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No delivery agents found</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Staff Creation/Edit Dialog */}
        <Dialog open={showStaffForm} onOpenChange={(open) => { if (!open) { setShowStaffForm(false); resetStaffForm(); } }}>
          <DialogContent
            className={`max-h-[90vh] overflow-y-auto ${staffForm.role === "district_manager" ? "max-w-2xl" : "max-w-md"}`}
            onInteractOutside={(e) => e.preventDefault()}
            onFocusOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>{editingStaff ? "Edit Staff Member" : "Add Staff Member"}</DialogTitle>
              <DialogDescription>
                {editingStaff ? "Update" : "Create a new"} {getRoleName(staffForm.role)} account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={staffForm.role} onValueChange={(value) => setStaffForm({ ...staffForm, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="district_manager">District Manager</SelectItem>
                    <SelectItem value="taluk_agent">Taluk-level Farm Squad</SelectItem>
                    <SelectItem value="delivery_agent">Delivery Squad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={staffForm.username}
                    onChange={(e) => setStaffForm({ ...staffForm, username: e.target.value })}
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={staffForm.name}
                    onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    placeholder="Enter phone"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={staffForm.password}
                    onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="district">District</Label>
                  <Select value={staffForm.district} onValueChange={(value) => setStaffForm({ ...staffForm, district: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {districts.map((district) => (
                        <SelectItem key={district.id} value={district.name}>
                          {district.name}
                          {district.state && <span className="text-muted-foreground text-xs ml-1">({district.state})</span>}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {staffForm.role === "taluk_agent" && (
                  <div>
                    <Label htmlFor="taluk">Taluk</Label>
                    <Input
                      id="taluk"
                      value={staffForm.taluk}
                      onChange={(e) => setStaffForm({ ...staffForm, taluk: e.target.value })}
                      placeholder="Enter taluk"
                    />
                  </div>
                )}
              </div>

              {/* District Manager Organization Details */}
              {staffForm.role === "district_manager" && (
                <div className="space-y-4 border-t pt-4">
                  <div className="text-sm font-medium text-gray-700 mb-3">
                    FPO / Organization Details
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="orgName">Organization Name *</Label>
                      <Input
                        id="orgName"
                        value={staffForm.orgName}
                        onChange={(e) => setStaffForm({ ...staffForm, orgName: e.target.value })}
                        placeholder="Enter FPO/Organization name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="orgEmail">Organization Email *</Label>
                      <Input
                        id="orgEmail"
                        type="email"
                        value={staffForm.orgEmail}
                        onChange={(e) => setStaffForm({ ...staffForm, orgEmail: e.target.value })}
                        placeholder="org@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="orgAddress">Organization Address *</Label>
                    <Input
                      id="orgAddress"
                      value={staffForm.orgAddress}
                      onChange={(e) => setStaffForm({ ...staffForm, orgAddress: e.target.value })}
                      placeholder="Complete address with city, state, pincode"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="orgPhone">Organization Phone *</Label>
                      <Input
                        id="orgPhone"
                        value={staffForm.orgPhone}
                        onChange={(e) => setStaffForm({ ...staffForm, orgPhone: e.target.value })}
                        placeholder="Enter organization phone"
                      />
                    </div>
                    <div>
                      <Label htmlFor="orgLogoUrl">Organization Logo</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="orgLogoUrl"
                          value={staffForm.orgLogoUrl}
                          onChange={(e) => setStaffForm({ ...staffForm, orgLogoUrl: e.target.value })}
                          placeholder="https://example.com/logo.png"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          disabled={dmLogoUploading}
                          onClick={() => dmLogoFileInputRef.current?.click()}
                          title="Choose logo image"
                          aria-label="Choose logo image"
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                        <input
                          ref={dmLogoFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setDmLogoFile(file);
                            setStaffForm(f => ({ ...f, orgLogoUrl: URL.createObjectURL(file) }));
                            if (dmLogoFileInputRef.current) dmLogoFileInputRef.current.value = "";
                          }}
                        />
                      </div>
                      {staffForm.orgLogoUrl && (
                        <img src={staffForm.orgLogoUrl} alt="preview" className="h-14 mt-2 object-contain border rounded bg-gray-50 p-1" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      )}
                    </div>
                  </div>

                  <div className="text-sm font-medium text-gray-700 mb-3 border-t pt-3">
                    Banking & Financial Details
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bankAccountNumber">Bank Account Number *</Label>
                      <Input
                        id="bankAccountNumber"
                        type="text"
                        value={staffForm.bankAccountNumber}
                        onChange={(e) => setStaffForm({ ...staffForm, bankAccountNumber: e.target.value })}
                        placeholder="Enter account number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bankIfsc">Bank IFSC Code *</Label>
                      <Input
                        id="bankIfsc"
                        value={staffForm.bankIfsc}
                        onChange={(e) => setStaffForm({ ...staffForm, bankIfsc: e.target.value.toUpperCase() })}
                        placeholder="ABCD0123456"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gstNumber">GST Number</Label>
                      <Input
                        id="gstNumber"
                        value={staffForm.gstNumber}
                        onChange={(e) => setStaffForm({ ...staffForm, gstNumber: e.target.value.toUpperCase() })}
                        placeholder="12ABCDE3456F1Z5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        id="upiId"
                        value={staffForm.upiId}
                        onChange={(e) => setStaffForm({ ...staffForm, upiId: e.target.value })}
                        placeholder="organization@upi"
                      />
                    </div>
                  </div>
                </div>
              )}

              {(staffForm.role === "taluk_agent" || staffForm.role === "delivery_agent") && (
                <div>
                  <Label htmlFor="reportsTo">Reports To (District Manager)</Label>
                  <Select value={staffForm.reportsTo} onValueChange={(value) => setStaffForm({ ...staffForm, reportsTo: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select district manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {districtManagers?.map((dm: any) => (
                        <SelectItem key={dm.id} value={dm.id.toString()}>
                          {dm.name} - {dm.district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowStaffForm(false); resetStaffForm(); }}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateStaff}
                disabled={createStaffMutation.isPending || updateStaffMutation.isPending || dmLogoUploading}
              >
                {(createStaffMutation.isPending || updateStaffMutation.isPending || dmLogoUploading) ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {editingStaff ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!showDeleteConfirmation} onOpenChange={() => setShowDeleteConfirmation(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Staff Member</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {showDeleteConfirmation?.name}? This action cannot be undone and the staff member will no longer be able to login.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteConfirmation(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={confirmDeleteStaff}
                disabled={deleteStaffMutation.isPending}
              >
                {deleteStaffMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* DM Dashboard View Dialog */}
        {/* Admin: Manage Delivery for a specific DM */}
        <Dialog open={!!managingDeliveryForDm} onOpenChange={() => setManagingDeliveryForDm(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-green-600" />
                Delivery Management — {managingDeliveryForDm?.orgName || managingDeliveryForDm?.name}
              </DialogTitle>
              <DialogDescription>
                Configure delivery districts and weight-based pricing for {managingDeliveryForDm?.name} ({managingDeliveryForDm?.district})
              </DialogDescription>
            </DialogHeader>
            {managingDeliveryForDm && (
              <FpoDeliveryManagement dmUserId={managingDeliveryForDm.id} />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={!!viewingDmDashboard} onOpenChange={() => setViewingDmDashboard(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                {viewingDmDashboard?.name}'s Dashboard - {viewingDmDashboard?.district}
              </DialogTitle>
              <DialogDescription>
                Overview of district manager performance and statistics
                <span className="block text-xs mt-1 text-gray-400">ಜಿಲ್ಲಾ ವ್ಯವಸ್ಥಾಪಕರ ಕಾರ್ಯಕ್ಷಮತೆ ಮತ್ತು ಅಂಕಿಅಂಶಗಳ ಅವಲೋಕನ</span>
              </DialogDescription>
            </DialogHeader>
            
            {dmStatsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : dmStats ? (
              <div className="space-y-6">
                {/* Key Metrics - Same as DM Dashboard */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-purple-50 border-l-4 border-l-purple-500">
                    <div className="text-sm text-purple-600">Total Orders <span className="text-xs text-purple-400">| ಒಟ್ಟು ಆರ್ಡರ್‌ಗಳು</span></div>
                    <div className="text-2xl font-bold text-purple-700">{dmStats.totalOrders || 0}</div>
                    <div className="text-xs text-green-600">{dmStats.ordersByStatus?.delivered || 0} delivered <span className="text-gray-400">| ವಿತರಣೆಯಾಗಿದೆ</span></div>
                  </div>
                  <div className="p-4 rounded-lg bg-emerald-50 border-l-4 border-l-emerald-500">
                    <div className="text-sm text-emerald-600">District Hub Earnings <span className="text-xs text-emerald-400">| ಜಿಲ್ಲಾ ಹಬ್ ಆದಾಯ</span></div>
                    <div className="text-2xl font-bold text-emerald-700">{formatIndianCurrency(dmStats.districtHubEarnings || 0)}</div>
                    <div className="text-xs text-gray-500">{dmStats.districtHubFeePercent || 18}% of farmer sales <span className="text-gray-400">| ರೈತರ ಮಾರಾಟದ</span></div>
                  </div>
                  <div className="p-4 rounded-lg bg-orange-50 border-l-4 border-l-orange-500">
                    <div className="text-sm text-orange-600">Total to Farmers <span className="text-xs text-orange-400">| ರೈತರಿಗೆ ಒಟ್ಟು</span></div>
                    <div className="text-2xl font-bold text-orange-700">{formatIndianCurrency(dmStats.totalFarmerPrice || 0)}</div>
                    <div className="text-xs text-gray-500">Products + Events <span className="text-gray-400">| ಉತ್ಪನ್ನಗಳು + ಕಾರ್ಯಕ್ರಮಗಳು</span></div>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-l-blue-500">
                    <div className="text-sm text-blue-600">Active Products <span className="text-xs text-blue-400">| ಸಕ್ರಿಯ ಉತ್ಪನ್ನಗಳು</span></div>
                    <div className="text-2xl font-bold text-blue-700">{dmStats.totalProducts || 0}</div>
                    <div className="text-xs text-gray-500">{dmStats.totalFarmers || 0} farmers <span className="text-gray-400">| ರೈತರು</span></div>
                  </div>
                </div>

                {/* Order Status Distribution */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-purple-600" />
                    Order Status <span className="text-sm font-normal text-gray-500">| ಆರ್ಡರ್ ಸ್ಥಿತಿ</span>
                  </h4>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                    <div className="text-center p-2 bg-yellow-50 rounded border">
                      <div className="font-bold text-yellow-700">{dmStats.ordersByStatus?.pending || 0}</div>
                      <div className="text-xs">Pending</div>
                      <div className="text-xs text-gray-400">ಬಾಕಿ</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded border">
                      <div className="font-bold text-blue-700">{dmStats.ordersByStatus?.accepted || 0}</div>
                      <div className="text-xs">Accepted</div>
                      <div className="text-xs text-gray-400">ಸ್ವೀಕೃತ</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded border">
                      <div className="font-bold text-green-700">{dmStats.ordersByStatus?.growing || 0}</div>
                      <div className="text-xs">Growing</div>
                      <div className="text-xs text-gray-400">ಬೆಳೆಯುತ್ತಿದೆ</div>
                    </div>
                    <div className="text-center p-2 bg-amber-50 rounded border">
                      <div className="font-bold text-amber-700">{dmStats.ordersByStatus?.harvested || 0}</div>
                      <div className="text-xs">Harvested</div>
                      <div className="text-xs text-gray-400">ಕೊಯ್ಲು</div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded border">
                      <div className="font-bold text-purple-700">{dmStats.ordersByStatus?.packaging || 0}</div>
                      <div className="text-xs">Packing</div>
                      <div className="text-xs text-gray-400">ಪ್ಯಾಕಿಂಗ್</div>
                    </div>
                    <div className="text-center p-2 bg-indigo-50 rounded border">
                      <div className="font-bold text-indigo-700">{dmStats.ordersByStatus?.shipping || 0}</div>
                      <div className="text-xs">Shipping</div>
                      <div className="text-xs text-gray-400">ಶಿಪ್ಪಿಂಗ್</div>
                    </div>
                    <div className="text-center p-2 bg-emerald-50 rounded border">
                      <div className="font-bold text-emerald-700">{dmStats.ordersByStatus?.delivered || 0}</div>
                      <div className="text-xs">Delivered</div>
                      <div className="text-xs text-gray-400">ವಿತರಣೆ</div>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded border">
                      <div className="font-bold text-red-700">{dmStats.ordersByStatus?.canceled || 0}</div>
                      <div className="text-xs">Canceled</div>
                      <div className="text-xs text-gray-400">ರದ್ದು</div>
                    </div>
                  </div>
                </div>

                {/* Sales Breakdown with Farmer Prices */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    Sales Breakdown <span className="text-sm font-normal text-gray-500">| ಮಾರಾಟ ವಿವರ</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-700">Retail Sales <span className="text-xs text-blue-500">| ಚಿಲ್ಲರೆ ಮಾರಾಟ</span></span>
                      </div>
                      <div className="text-xl font-bold text-blue-800">{formatIndianCurrency(dmStats.retailStats?.revenue || 0)}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Farmer Price <span className="text-gray-400">| ರೈತರ ಬೆಲೆ</span>: {formatIndianCurrency(dmStats.retailStats?.farmerRevenue || 0)}
                      </div>
                      <div className="text-xs text-gray-500">{dmStats.retailStats?.orders || 0} orders <span className="text-gray-400">| ಆರ್ಡರ್‌ಗಳು</span></div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-700">Wholesale Sales <span className="text-xs text-green-500">| ಸಗಟು ಮಾರಾಟ</span></span>
                      </div>
                      <div className="text-xl font-bold text-green-800">{formatIndianCurrency(dmStats.wholesaleStats?.revenue || 0)}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Farmer Price <span className="text-gray-400">| ರೈತರ ಬೆಲೆ</span>: {formatIndianCurrency(dmStats.wholesaleStats?.farmerRevenue || 0)}
                      </div>
                      <div className="text-xs text-gray-500">{dmStats.wholesaleStats?.orders || 0} orders <span className="text-gray-400">| ಆರ್ಡರ್‌ಗಳು</span></div>
                    </div>
                    <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Ticket className="h-4 w-4 text-pink-600" />
                        <span className="font-medium text-pink-700">Events <span className="text-xs text-pink-500">| ಕಾರ್ಯಕ್ರಮಗಳು</span></span>
                      </div>
                      <div className="text-xl font-bold text-pink-800">{formatIndianCurrency(dmStats.transactionStats?.eventBookings?.amount || 0)}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Farmer Price <span className="text-gray-400">| ರೈತರ ಬೆಲೆ</span>: {formatIndianCurrency(dmStats.eventFarmerPrice || 0)}
                      </div>
                      <div className="text-xs text-gray-500">{dmStats.transactionStats?.eventBookings?.count || 0} bookings <span className="text-gray-400">| ಬುಕಿಂಗ್‌ಗಳು</span></div>
                    </div>
                  </div>
                </div>

                {/* Farmer Payouts (with events) */}
                {dmStats.farmerPayouts && dmStats.farmerPayouts.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-lg mb-3 flex items-center gap-2">
                      <Users className="h-5 w-5 text-orange-600" />
                      Farmer Payouts <span className="text-xs text-gray-500">| ರೈತರ ಪಾವತಿಗಳು</span>
                    </h4>
                    <div className="bg-white rounded-lg border divide-y max-h-64 overflow-y-auto">
                      {dmStats.farmerPayouts.map((farmer: any, index: number) => (
                        <div key={index} className="p-3 flex items-center justify-between hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                              <span className="text-orange-700 font-medium text-sm">
                                {farmer.farmerName?.charAt(0)?.toUpperCase() || '?'}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{farmer.farmerName}</div>
                              <div className="text-xs text-gray-500 flex gap-2">
                                {farmer.orderCount > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Package className="h-3 w-3" />
                                    {farmer.orderCount} orders
                                  </span>
                                )}
                                {farmer.eventCount > 0 && (
                                  <span className="flex items-center gap-1 text-pink-600">
                                    <Ticket className="h-3 w-3" />
                                    {farmer.eventCount} bookings
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-orange-700">{formatIndianCurrency(farmer.totalPayout)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total Payout Summary */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium opacity-90">Total Admin Payout to This Hub</div>
                      <div className="text-xs opacity-75">ಈ ಹಬ್‌ಗೆ ಒಟ್ಟು ಅಡ್ಮಿನ್ ಪಾವತಿ</div>
                      <div className="text-xs opacity-75 mt-1">Farmer Price + Hub Fee ({dmStats.districtHubFeePercent || 18}%) | ರೈತರ ಬೆಲೆ + ಹಬ್ ಶುಲ್ಕ</div>
                    </div>
                    <div className="text-2xl font-bold">
                      {formatIndianCurrency((dmStats.totalFarmerPrice || 0) + (dmStats.districtHubEarnings || 0))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No data available for this district manager
                <div className="text-xs mt-1">ಈ ಜಿಲ್ಲಾ ವ್ಯವಸ್ಥಾಪಕರಿಗೆ ಡೇಟಾ ಲಭ್ಯವಿಲ್ಲ</div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewingDmDashboard(null)}>
                Close | ಮುಚ್ಚಿ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-8">
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h1 className="text-xl sm:text-3xl font-bold">
            {user?.role === 'district_manager' 
              ? (user?.orgName ? `${user.orgName} Dashboard` : t('adminDashboard.dmDashboard'))
              : user?.role === 'taluk_agent' ? t('adminDashboard.agentDashboard') : t('adminDashboard.title')}
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setLocation("/")}>
              <Home className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap gap-1 h-auto mb-8 justify-start overflow-x-auto">
            {/* Overview tab - available to all roles */}
            <TabsTrigger value="overview" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <BarChart2 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{t('adminDashboard.overview')}</span>
              <span className="sm:hidden">Overview</span>
            </TabsTrigger>
            
            {/* Products tab - admin and district_manager only */}
            {hasPermission(user?.role || '', 'products') && (
              <TabsTrigger value="products" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <PackageOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{t('adminDashboard.products')}</span>
                <span className="sm:hidden">Products</span>
                {!statsLoading && stats?.pendingProducts > 0 && (
                  <Badge variant="destructive" className="ml-1 sm:ml-2 min-w-[18px] h-4 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs font-semibold">{safeStats.pendingProducts}</Badge>
                )}
              </TabsTrigger>
            )}
            
            {/* Orders tab - available to all staff roles */}
            {hasPermission(user?.role || '', 'orders') && (
              <TabsTrigger value="orders" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{t('adminDashboard.orders')}</span>
                <span className="sm:hidden">Orders</span>
                {!statsLoading && stats?.ordersByStatus?.pending > 0 && (
                  <Badge variant="default" className="ml-1 sm:ml-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-[10px] sm:text-xs">
                    {safeStats.ordersByStatus.pending}
                  </Badge>
                )}
              </TabsTrigger>
            )}
            
            {/* Farmers tab - available to all staff roles */}
            {hasPermission(user?.role || '', 'farmers') && (
              <TabsTrigger value="farmers" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                {t('adminDashboard.farmers')}
              </TabsTrigger>
            )}
            
            {(user?.role === 'admin' || user?.role === 'district_manager') && (
              <>
                <TabsTrigger value="events" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  {t('adminDashboard.events')}
                </TabsTrigger>
              </>
            )}

            {user?.role === 'district_manager' && (
              <>
                <TabsTrigger value="fpo-profile" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <Building className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">FPO Profile</span>
                  <span className="sm:hidden">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="delivery" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <Truck className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Delivery</span>
                  <span className="sm:hidden">Delivery</span>
                </TabsTrigger>
                <TabsTrigger value="returns" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Returns</span>
                  <span className="sm:hidden">Returns</span>
                </TabsTrigger>
                <TabsTrigger value="marketing-video" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <Film className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Marketing Video</span>
                  <span className="sm:hidden">Video</span>
                </TabsTrigger>
                <TabsTrigger value="marketing-tools" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Marketing Tools</span>
                  <span className="sm:hidden">Tools</span>
                </TabsTrigger>
              </>
            )}
            
            {/* Admin-only tabs */}
            {user?.role === 'admin' && (
              <>
                <TabsTrigger value="users" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <UserCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  {t('adminDashboard.users')}
                </TabsTrigger>
                <TabsTrigger value="staff" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  Staff
                </TabsTrigger>
                <TabsTrigger value="fees" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                  Fees
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <PackageOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">{t('adminDashboard.categories')}</span>
                  <span className="sm:hidden">Cat.</span>
                </TabsTrigger>
                <TabsTrigger value="districts" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Districts</span>
                  <span className="sm:hidden">Dist.</span>
                </TabsTrigger>
                <TabsTrigger value="zbnf-crops" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <Leaf className="h-3 w-3 sm:h-4 sm:w-4" />
                  Crops
                </TabsTrigger>
                <TabsTrigger value="ai-plans" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Subscriptions</span>
                  <span className="sm:hidden">Subs</span>
                </TabsTrigger>
                <TabsTrigger value="event-types" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Event Types</span>
                  <span className="sm:hidden">Events</span>
                </TabsTrigger>
                <TabsTrigger value="vendors" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Payment Vendors</span>
                  <span className="sm:hidden">Vendors</span>
                </TabsTrigger>
                <TabsTrigger value="fpo-inquiries" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Store Requests</span>
                  <span className="sm:hidden">Requests</span>
                </TabsTrigger>
                <TabsTrigger value="returns" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Returns & Refunds</span>
                  <span className="sm:hidden">Returns</span>
                </TabsTrigger>
                <TabsTrigger value="official-buyers" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Official Buyers</span>
                  <span className="sm:hidden">Buyers</span>
                </TabsTrigger>
                <TabsTrigger value="dm-payout" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <Building className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">DM Payout</span>
                  <span className="sm:hidden">DM Pay</span>
                </TabsTrigger>
              </>
            )}
          </TabsList>
          
          {/* Dashboard Overview */}
          <TabsContent value="overview">
            {statsLoading || (user?.role === 'district_manager' && overviewOrdersLoading) ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : user?.role === 'district_manager' ? (
              /* ========== DM-SPECIFIC DASHBOARD OVERVIEW ========== */
              (() => {
                // Get platform fee percentage from order fees
                const dmPlatformFeePercent = (() => {
                  if (!orderFees || !Array.isArray(orderFees)) return 7;
                  const techFee = orderFees.find((f: any) => 
                    f.isActive && (f.type === 'percentage' || f.feeType === 'percentage') && 
                    (f.name?.toLowerCase().includes('tech') || f.name?.toLowerCase().includes('santhe') || f.name?.toLowerCase().includes('platform') || f.name?.toLowerCase().includes('support'))
                  );
                  return techFee ? parseFloat(techFee.value) : 7;
                })();
                
                const feeMultiplier = 1 + (dmPlatformFeePercent / 100);
                
                // Calculate farmer payouts including Box and Events
                const farmerPayouts = calculateFarmerPayouts(overviewOrders, adminEventsWithBookings || [], feeMultiplier);
                
                // Calculate Box orders farmer revenue
                const boxOrders = (overviewOrders || []);
                const boxFarmerPayout = boxOrders.reduce((sum: number, order: any) => {
                  if (!order.items) return sum;
                  return sum + order.items.reduce((itemSum: number, item: any) => {
                    const price = typeof item.price === 'string' ? parseFloat(item.price) : (item.price || 0);
                    const quantity = item.quantity || 1;
                    return itemSum + (price * quantity);
                  }, 0);
                }, 0);
                
                // Event farmer revenue
                const eventFarmerPayout = adminEventBookingRevenue > 0 ? adminEventBookingRevenue / feeMultiplier : 0;
                
                // Combined totals
                const combinedFarmerPayout = boxFarmerPayout + eventFarmerPayout;
                const totalSalesValue = boxOrders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0) + adminEventBookingRevenue;
                
                return (
                  <>
                    {/* Org Branding Header */}
                    {user?.orgName && (
                      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl p-4 sm:p-6 mb-6 text-white shadow-lg">
                        <div className="flex items-center gap-4">
                          {user?.orgLogoUrl ? (
                            <img 
                              src={user.orgLogoUrl} 
                              alt={user.orgName} 
                              className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover border-2 border-white/30 bg-white/20"
                            />
                          ) : (
                            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                              <Building className="h-7 w-7 sm:h-8 sm:w-8 text-white/80" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <h2 className="text-lg sm:text-2xl font-bold truncate">{user.orgName}</h2>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 text-xs sm:text-sm text-white/80">
                              {user?.district && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                  {user.district}
                                </span>
                              )}
                              {user?.orgEmail && (
                                <span className="hidden sm:flex items-center gap-1">
                                  <Mail className="h-3.5 w-3.5" />
                                  {user.orgEmail}
                                </span>
                              )}
                              {user?.orgPhone && (
                                <span className="hidden sm:flex items-center gap-1">
                                  <Phone className="h-3.5 w-3.5" />
                                  {user.orgPhone}
                                </span>
                              )}
                            </div>
                            {user?.orgSlug && (
                              <p className="text-[10px] sm:text-xs text-white/60 mt-1">
                                {user.orgSlug}.farmersanthe.com
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Storefront QR Code Card (shown when orgSlug exists) */}
                    {user?.orgSlug && (
                      <Card className="mb-6 border-emerald-200 bg-emerald-50">
                        <CardContent className="pt-4 pb-4">
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                              {user?.orgQrCodeUrl ? (
                                <img
                                  src={user.orgQrCodeUrl}
                                  alt="Storefront QR Code"
                                  className="h-24 w-24 rounded-lg border-2 border-emerald-300 bg-white object-contain cursor-pointer shadow"
                                  title="Click to view full size"
                                  onClick={() => window.open(user.orgQrCodeUrl!, '_blank')}
                                />
                              ) : (
                                <div className="h-24 w-24 rounded-lg border-2 border-dashed border-emerald-300 bg-white flex items-center justify-center">
                                  <QrCode className="h-10 w-10 text-emerald-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
                                <QrCode className="h-4 w-4" />
                                Storefront QR Code
                              </h3>
                              <p className="text-sm text-emerald-700 mt-0.5">
                                Share this QR code with customers to let them access your storefront directly.
                              </p>
                              <p className="text-xs text-emerald-600 font-mono mt-1 truncate">
                                https://farmersanthe.com/org/{user.orgSlug}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                {user?.orgQrCodeUrl && (
                                  <button
                                    disabled={dmQrDownloading}
                                    aria-busy={dmQrDownloading}
                                    onClick={async () => {
                                      setDmQrDownloading(true);
                                      try {
                                        await downloadImageAsBlob(user.orgQrCodeUrl!, `qr-${user.orgSlug || 'storefront'}.png`);
                                      } catch {
                                        toast({ title: "Download failed", description: "Could not download QR code", variant: "destructive" });
                                      } finally {
                                        setDmQrDownloading(false);
                                      }
                                    }}
                                    className="text-xs text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1 rounded px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {dmQrDownloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                                    {dmQrDownloading ? 'Downloading…' : 'Download QR'}
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(`https://farmersanthe.com/org/${user.orgSlug}`);
                                    toast({ title: "Copied!", description: "Storefront URL copied to clipboard" });
                                  }}
                                  className="text-xs text-emerald-700 border border-emerald-400 bg-white hover:bg-emerald-50 flex items-center gap-1 rounded px-3 py-1.5"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                  Copy URL
                                </button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    {/* DM Key Metrics - Top Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <Card className="border-l-4 border-l-purple-500">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">{t('adminDashboard.dm.totalOrders')}</p>
                              <h3 className="text-3xl font-bold text-gray-900 mt-1">{safeStats.totalOrders}</h3>
                              <p className="text-xs text-green-600 mt-1 font-medium">
                                {safeStats.ordersByStatus?.delivered || 0} {t('adminDashboard.dm.delivered')}
                              </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                              <ShoppingCart className="h-6 w-6 text-purple-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-orange-500">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">{t('adminDashboard.dm.totalToFarmers')}</p>
                              <h3 className="text-2xl font-bold text-orange-700 mt-1">{formatIndianCurrency(combinedFarmerPayout)}</h3>
                              <p className="text-xs text-gray-500 mt-1">
                                Products: {formatIndianCurrency(boxFarmerPayout)} + Events: {formatIndianCurrency(eventFarmerPayout)}
                              </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                              <Users className="h-6 w-6 text-orange-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Approved Products</p>
                              <h3 className="text-3xl font-bold text-gray-900 mt-1">{safeStats.totalProducts}</h3>
                              <p className="text-xs text-amber-600 mt-1">
                                {safeStats.pendingProducts} pending approval
                              </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                              <Package className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-green-500">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Linked Farmers</p>
                              <h3 className="text-3xl font-bold text-gray-900 mt-1">{safeStats.totalFarmers}</h3>
                              <p className="text-xs text-green-600 mt-1 font-medium">
                                with approved products
                              </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                              <Users className="h-6 w-6 text-green-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Order Status Distribution */}
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ShoppingCart className="h-5 w-5 text-purple-600" />
                          {t('adminDashboard.dm.orderStatus')}
                        </CardTitle>
                        <CardDescription>{t('adminDashboard.dm.orderStatusInDistrict')}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                          <div className={`p-3 rounded-lg border ${getStatusColor("pending")}`}>
                            <div className="text-xl font-bold">{safeStats.ordersByStatus.pending}</div>
                            <div className="text-xs">{t('adminDashboard.dm.pending')}</div>
                          </div>
                          <div className={`p-3 rounded-lg border ${getStatusColor("accepted")}`}>
                            <div className="text-xl font-bold">{safeStats.ordersByStatus.accepted}</div>
                            <div className="text-xs">{t('adminDashboard.dm.accepted')}</div>
                          </div>
                          <div className={`p-3 rounded-lg border ${getStatusColor("growing")}`}>
                            <div className="text-xl font-bold">{safeStats.ordersByStatus.growing}</div>
                            <div className="text-xs">{t('adminDashboard.dm.growing')}</div>
                          </div>
                          <div className={`p-3 rounded-lg border ${getStatusColor("harvested")}`}>
                            <div className="text-xl font-bold">{safeStats.ordersByStatus.harvested}</div>
                            <div className="text-xs">{t('adminDashboard.dm.harvested')}</div>
                          </div>
                          <div className={`p-3 rounded-lg border ${getStatusColor("packaging")}`}>
                            <div className="text-xl font-bold">{safeStats.ordersByStatus.packaging}</div>
                            <div className="text-xs">{t('adminDashboard.dm.packaging')}</div>
                          </div>
                          <div className={`p-3 rounded-lg border ${getStatusColor("shipping")}`}>
                            <div className="text-xl font-bold">{safeStats.ordersByStatus.shipping}</div>
                            <div className="text-xs">{t('adminDashboard.dm.shipping')}</div>
                          </div>
                          <div className={`p-3 rounded-lg border ${getStatusColor("delivered")}`}>
                            <div className="text-xl font-bold">{safeStats.ordersByStatus.delivered}</div>
                            <div className="text-xs">{t('adminDashboard.dm.delivered')}</div>
                          </div>
                          <div className={`p-3 rounded-lg border ${getStatusColor("canceled")}`}>
                            <div className="text-xl font-bold">{safeStats.ordersByStatus.canceled}</div>
                            <div className="text-xs">{t('adminDashboard.dm.canceled')}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Sales Summary */}
                    <Card className="mb-6 border-l-4 border-l-green-500">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          Sales Summary
                        </CardTitle>
                        <CardDescription>Revenue breakdown by type</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {(() => {
                            const retailOrders = boxOrders.filter((o: any) => !o.notes?.includes('B2B Bulk Order'));
                            const wholesaleOrders = boxOrders.filter((o: any) => o.notes?.includes('B2B Bulk Order'));
                            const retailFarmerPayout = retailOrders.reduce((sum: number, order: any) => {
                              if (!order.items) return sum;
                              return sum + order.items.reduce((itemSum: number, item: any) => {
                                const price = typeof item.price === 'string' ? parseFloat(item.price) : (item.price || 0);
                                const quantity = item.quantity || 1;
                                return itemSum + (price * quantity);
                              }, 0);
                            }, 0);
                            const wholesaleFarmerPayout = wholesaleOrders.reduce((sum: number, order: any) => {
                              if (!order.items) return sum;
                              return sum + order.items.reduce((itemSum: number, item: any) => {
                                const price = typeof item.price === 'string' ? parseFloat(item.price) : (item.price || 0);
                                const quantity = item.quantity || 1;
                                return itemSum + (price * quantity);
                              }, 0);
                            }, 0);
                            return (
                              <>
                                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <Package className="h-5 w-5 text-blue-600" />
                                      <span className="font-medium text-blue-700">Retail Sales</span>
                                    </div>
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{retailOrders.length} orders</span>
                                  </div>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Farmer Price:</span>
                                      <span className="font-medium">{formatIndianCurrency(retailFarmerPayout)}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <Building2 className="h-5 w-5 text-green-600" />
                                      <span className="font-medium text-green-700">Wholesale Sales</span>
                                    </div>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">{wholesaleOrders.length} orders</span>
                                  </div>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Farmer Price:</span>
                                      <span className="font-medium">{formatIndianCurrency(wholesaleFarmerPayout)}</span>
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                          <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Ticket className="h-5 w-5 text-pink-600" />
                                <span className="font-medium text-pink-700">Event Bookings</span>
                              </div>
                              <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded">{paidAdminBookings} paid</span>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Farmer Price:</span>
                                <span className="font-medium">{formatIndianCurrency(eventFarmerPayout)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 rounded-lg bg-teal-50 border border-teal-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Truck className="h-5 w-5 text-teal-600" />
                                <span className="font-medium text-teal-700">Delivery Revenue</span>
                              </div>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Collected:</span>
                                <span className="font-bold text-teal-700">{formatIndianCurrency(safeStats.transactionStats?.deliveryRevenue || 0)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Farmer Payouts Detail */}
                    <Card className="mb-6 border-l-4 border-l-orange-500">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-orange-600" />
                          {t('adminDashboard.dm.farmerPayouts')}
                        </CardTitle>
                        <CardDescription>Amount to pay to each farmer (product prices)</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {farmerPayouts.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>{t('adminDashboard.dm.noFarmerPayouts')}</p>
                          </div>
                        ) : (
                          <div className="rounded-md border max-h-64 overflow-y-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>{t('adminDashboard.dm.farmer')}</TableHead>
                                  <TableHead className="text-center">{t('adminDashboard.dm.orders')}</TableHead>
                                  <TableHead className="text-center">{t('adminDashboard.dm.events')}</TableHead>
                                  <TableHead className="text-right">{t('adminDashboard.dm.payAmount')}</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {farmerPayouts.map((farmer: any) => (
                                  <TableRow key={farmer.farmerId}>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                                          <User className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <span className="font-medium">{farmer.farmerName}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                        {farmer.orderCount}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Badge variant="outline" className="bg-pink-50 text-pink-700">
                                        {farmer.eventCount || 0}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <span className="font-semibold text-orange-600">
                                        {formatIndianCurrency(farmer.totalPayout)}
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Performance Analytics Report */}
                    <AnalyticsReportSection orgName={user?.orgName || undefined} />
                  </>
                );
              })()
            ) : (
              /* ========== ADMIN DASHBOARD OVERVIEW ========== */
              (() => {
                const platformFeePercent = safeStats.platformFeePercent || 7;

                const boxFarmerPrice = safeStats.boxesStats.boxFarmerRevenue || 0;
                const eventFarmerPrice = safeStats.transactionStats?.eventBookings?.farmerRevenue || 0;
                const boxRevenue = safeStats.boxesStats.boxRevenue || 0;
                const eventRevenue = adminEventBookingRevenue || 0;

                // Use DB-stored fee columns for accurate overview totals (non-canceled orders)
                // Read from raw stats response (not safeStats) as these fields aren't in AdminStats type
                const dbProductsRevenue = Number((stats as any)?.totalProductsRevenue || 0);
                const dbDeliveryRevenue = Number((stats as any)?.dbTotalDeliveryRevenue || 0);
                const dbPlatformFee = Number((stats as any)?.totalPlatformFee || 0);
                const totalFarmerPayout = dbProductsRevenue + dbDeliveryRevenue + eventFarmerPrice;
                const totalSalesValue = dbProductsRevenue + dbDeliveryRevenue + dbPlatformFee + eventRevenue;
                const totalPlatformEarnings = dbPlatformFee + (eventRevenue - eventFarmerPrice);
                const subscriptionRevenue = safeStats.subscriptionStats?.subscriptionRevenue || 0;

                const boxPlatformFee = boxRevenue - boxFarmerPrice;
                const eventPlatformFee = eventRevenue - eventFarmerPrice;

                return (
                  <>
                    {/* Platform Stats - Top Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                      <Card className="border-l-4 border-l-indigo-500">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Total Users</p>
                              <h3 className="text-3xl font-bold text-gray-900 mt-1">{safeStats.totalUsers}</h3>
                              <p className="text-xs text-gray-500 mt-1">{safeStats.totalFarmers} farmers · {safeStats.totalCustomers} customers</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                              <Users className="h-6 w-6 text-indigo-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-green-500">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Farmers</p>
                              <h3 className="text-3xl font-bold text-gray-900 mt-1">{safeStats.totalFarmers}</h3>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                              <Users className="h-6 w-6 text-green-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Products</p>
                              <h3 className="text-3xl font-bold text-gray-900 mt-1">{safeStats.totalProducts}</h3>
                              <p className="text-xs text-amber-600 mt-1">{safeStats.pendingProducts} pending</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                              <Package className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-purple-500">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Orders</p>
                              <h3 className="text-3xl font-bold text-gray-900 mt-1">{safeStats.totalOrders}</h3>
                              <p className="text-xs text-green-600 mt-1">{safeStats.ordersByStatus?.delivered || 0} delivered</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                              <ShoppingCart className="h-6 w-6 text-purple-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-amber-500">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Subscribers</p>
                              <h3 className="text-3xl font-bold text-gray-900 mt-1">{safeStats.subscriptionStats?.activeSubscribers || 0}</h3>
                              <p className="text-xs text-gray-500 mt-1">{safeStats.subscriptionStats?.totalSubscribers || 0} total subscribers</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                              <Crown className="h-6 w-6 text-amber-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Revenue & Earnings Summary */}
                    <Card className="mb-6 border-l-4 border-l-emerald-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-emerald-600" />
                          Revenue & Earnings
                        </CardTitle>
                        <CardDescription>
                          Based on actual order bills (varies by subscription level)
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-slate-100 border">
                            <div className="text-sm text-gray-600 mb-1">Total Sales</div>
                            <div className="text-2xl font-bold text-gray-800">{formatIndianCurrency(totalSalesValue)}</div>
                          </div>
                          <div className="p-4 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200">
                            <div className="text-sm text-orange-700 mb-1">Farmer Payout</div>
                            <div className="text-2xl font-bold text-orange-700">{formatIndianCurrency(totalFarmerPayout)}</div>
                          </div>
                          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200">
                            <div className="text-sm text-purple-700 mb-1">Platform Earnings</div>
                            <div className="text-2xl font-bold text-purple-700">{formatIndianCurrency(totalPlatformEarnings)}</div>
                          </div>
                          <div className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200">
                            <div className="text-sm text-amber-700 mb-1">Subscription Revenue</div>
                            <div className="text-2xl font-bold text-amber-700">{formatIndianCurrency(subscriptionRevenue)}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Sales by Type */}
                    <Card className="mb-6">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2">
                          <Wallet className="h-5 w-5 text-gray-600" />
                          Sales by Type
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Retail Sales */}
                          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-blue-600" />
                                <span className="font-medium text-blue-700">Retail Sales</span>
                              </div>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{safeStats.retailStats?.orders || 0} orders</span>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Farmer Price:</span>
                                <span className="font-medium">{formatIndianCurrency(safeStats.retailStats?.farmerRevenue || 0)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-orange-600">Delivery:</span>
                                <span className="font-medium text-orange-600">{formatIndianCurrency(safeStats.retailStats?.deliveryRevenue || 0)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-purple-600">Platform Fee:</span>
                                <span className="font-medium text-purple-600">{formatIndianCurrency(safeStats.retailStats?.platformFeeRevenue || 0)}</span>
                              </div>
                              <div className="flex justify-between border-t pt-2">
                                <span className="text-gray-800 font-medium">Total Collected:</span>
                                <span className="font-bold text-gray-800">{formatIndianCurrency(safeStats.retailStats?.revenue || 0)}</span>
                              </div>
                            </div>
                          </div>
                          {/* Wholesale Sales */}
                          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-green-600" />
                                <span className="font-medium text-green-700">Wholesale Sales</span>
                              </div>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">{safeStats.wholesaleStats?.orders || 0} orders</span>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Farmer Price:</span>
                                <span className="font-medium">{formatIndianCurrency(safeStats.wholesaleStats?.farmerRevenue || 0)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-orange-600">Delivery:</span>
                                <span className="font-medium text-orange-600">{formatIndianCurrency(safeStats.wholesaleStats?.deliveryRevenue || 0)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-purple-600">Platform Fee:</span>
                                <span className="font-medium text-purple-600">{formatIndianCurrency(safeStats.wholesaleStats?.platformFeeRevenue || 0)}</span>
                              </div>
                              <div className="flex justify-between border-t pt-2">
                                <span className="text-gray-800 font-medium">Total Collected:</span>
                                <span className="font-bold text-green-800">{formatIndianCurrency(safeStats.wholesaleStats?.revenue || 0)}</span>
                              </div>
                            </div>
                          </div>
                          {/* Events */}
                          <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Ticket className="h-5 w-5 text-pink-600" />
                                <span className="font-medium text-pink-700">Events</span>
                              </div>
                              <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded">{paidAdminBookings} bookings</span>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Farmer Price:</span>
                                <span className="font-medium">{formatIndianCurrency(eventFarmerPrice)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-purple-600">Platform Fee ({platformFeePercent}%):</span>
                                <span className="font-medium text-purple-600">{formatIndianCurrency(eventPlatformFee)}</span>
                              </div>
                              <div className="flex justify-between border-t pt-2">
                                <span className="text-gray-800 font-medium">Total Collected:</span>
                                <span className="font-bold text-gray-800">{formatIndianCurrency(adminEventBookingRevenue || 0)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Order Status */}
                    <Card className="mb-6">
                      <CardHeader className="pb-3">
                        <CardTitle>Order Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                          <div className={`p-3 rounded-lg border text-center ${getStatusColor("pending")}`}>
                            <div className="text-xl font-bold">{safeStats.ordersByStatus?.pending || 0}</div>
                            <div className="text-xs">Pending</div>
                          </div>
                          <div className={`p-3 rounded-lg border text-center ${getStatusColor("accepted")}`}>
                            <div className="text-xl font-bold">{safeStats.ordersByStatus?.accepted || 0}</div>
                            <div className="text-xs">Accepted</div>
                          </div>
                          <div className={`p-3 rounded-lg border text-center ${getStatusColor("growing")}`}>
                            <div className="text-xl font-bold">{safeStats.ordersByStatus?.growing || 0}</div>
                            <div className="text-xs">Growing</div>
                          </div>
                          <div className={`p-3 rounded-lg border text-center ${getStatusColor("harvested")}`}>
                            <div className="text-xl font-bold">{safeStats.ordersByStatus?.harvested || 0}</div>
                            <div className="text-xs">Harvested</div>
                          </div>
                          <div className={`p-3 rounded-lg border text-center ${getStatusColor("packaging")}`}>
                            <div className="text-xl font-bold">{safeStats.ordersByStatus?.packaging || 0}</div>
                            <div className="text-xs">Packing</div>
                          </div>
                          <div className={`p-3 rounded-lg border text-center ${getStatusColor("shipping")}`}>
                            <div className="text-xl font-bold">{safeStats.ordersByStatus?.shipping || 0}</div>
                            <div className="text-xs">Shipping</div>
                          </div>
                          <div className={`p-3 rounded-lg border text-center ${getStatusColor("delivered")}`}>
                            <div className="text-xl font-bold">{safeStats.ordersByStatus?.delivered || 0}</div>
                            <div className="text-xs">Delivered</div>
                          </div>
                          <div className={`p-3 rounded-lg border text-center ${getStatusColor("canceled")}`}>
                            <div className="text-xl font-bold">{safeStats.ordersByStatus?.canceled || 0}</div>
                            <div className="text-xs">Canceled</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* FPO Payouts */}
                    <Card className="mb-6 border-l-4 border-l-teal-500">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-teal-600" />
                          FPO Payouts
                        </CardTitle>
                        <CardDescription>Product price + delivery charges = total payout to FPO</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {(!safeStats.fpoPayouts || safeStats.fpoPayouts.length === 0) ? (
                          <div className="text-center py-8 text-gray-500">
                            <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>No FPO payouts yet</p>
                          </div>
                        ) : (
                          <div className="rounded-md border max-h-80 overflow-y-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>FPO Name</TableHead>
                                  <TableHead>District</TableHead>
                                  <TableHead className="text-center">Farmers</TableHead>
                                  <TableHead className="text-center">Orders</TableHead>
                                  <TableHead className="text-right">Product Price</TableHead>
                                  <TableHead className="text-right">+ Delivery</TableHead>
                                  <TableHead className="text-right font-bold">= Total Payout</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {safeStats.fpoPayouts.map((fpo: any) => {
                                  const totalPayout = fpo.totalPayout + (fpo.deliveryRevenue || 0);
                                  return (
                                  <TableRow key={fpo.fpoId}>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${fpo.fpoId === 0 ? 'bg-gray-100' : 'bg-teal-100'}`}>
                                          <Building2 className={`h-4 w-4 ${fpo.fpoId === 0 ? 'text-gray-500' : 'text-teal-600'}`} />
                                        </div>
                                        <div>
                                          <span className="font-medium">{fpo.orgName}</span>
                                          {fpo.fpoId > 0 && fpo.fpoName !== fpo.orgName && (
                                            <p className="text-xs text-gray-500">{fpo.fpoName}</p>
                                          )}
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <span className="text-sm text-gray-600">{fpo.district || '-'}</span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Badge variant="outline" className="bg-green-50 text-green-700">
                                        {fpo.farmerCount}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                        {fpo.orderCount}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <span className="text-gray-700">
                                        {formatIndianCurrency(fpo.totalPayout)}
                                      </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <span className="text-orange-600">
                                        {formatIndianCurrency(fpo.deliveryRevenue || 0)}
                                      </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <span className="font-bold text-teal-700">
                                        {formatIndianCurrency(totalPayout)}
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                  );
                                })}
                                <TableRow className="bg-gray-50 font-medium">
                                  <TableCell colSpan={3}>
                                    <span className="font-semibold">Total</span>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Badge variant="outline" className="bg-purple-50 text-purple-700">
                                      {safeStats.fpoPayouts.reduce((sum: number, fpo: any) => sum + fpo.orderCount, 0)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <span className="font-semibold text-gray-700">
                                      {formatIndianCurrency(safeStats.fpoPayouts.reduce((sum: number, fpo: any) => sum + fpo.totalPayout, 0))}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <span className="font-semibold text-orange-700">
                                      {formatIndianCurrency(safeStats.fpoPayouts.reduce((sum: number, fpo: any) => sum + (fpo.deliveryRevenue || 0), 0))}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <span className="font-bold text-teal-700">
                                      {formatIndianCurrency(safeStats.fpoPayouts.reduce((sum: number, fpo: any) => sum + fpo.totalPayout + (fpo.deliveryRevenue || 0), 0))}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </>
                );
              })()
            )}
          </TabsContent>

          {/* DM Payout Tab */}
          {user?.role === 'admin' && (
            <TabsContent value="dm-payout">
              <Card className="mb-6 border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    DM Payouts
                  </CardTitle>
                  <CardDescription>Product price + event revenue = total payout to DM</CardDescription>
                </CardHeader>
                <CardContent>
                  {(!dmPayoutsData?.dmPayouts || dmPayoutsData.dmPayouts.length === 0) ? (
                    <div className="text-center py-8 text-gray-500">
                      <Building className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No DM payouts yet</p>
                    </div>
                  ) : (
                    <div className="rounded-md border max-h-80 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>DM Name</TableHead>
                            <TableHead>District</TableHead>
                            <TableHead className="text-center">Farmers</TableHead>
                            <TableHead className="text-center">Orders</TableHead>
                            <TableHead className="text-right">Product Price</TableHead>
                            <TableHead className="text-right">+ Delivery</TableHead>
                            <TableHead className="text-right font-bold">= Total Payout</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dmPayoutsData.dmPayouts.map((dm: any) => (
                            <TableRow key={dm.dmId}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Building className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <span className="font-medium">{dm.username}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-gray-600">{dm.district || '-'}</span>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant="outline" className="bg-green-50 text-green-700">
                                  {dm.farmerCount ?? 0}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                  {dm.boxOrderCount}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <span className="text-gray-700">
                                  {formatIndianCurrency(dm.boxFarmerRevenue)}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <span className="text-orange-600">
                                  {formatIndianCurrency(dm.deliveryRevenue)}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <span className="font-bold text-blue-700">
                                  {formatIndianCurrency(dm.totalFarmerPrice)}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-gray-50 font-medium">
                            <TableCell colSpan={3}>
                              <span className="font-semibold">Total</span>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                                {dmPayoutsData.dmPayouts.reduce((s: number, d: any) => s + d.boxOrderCount, 0)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className="font-semibold text-gray-700">
                                {formatIndianCurrency(dmPayoutsData.dmPayouts.reduce((s: number, d: any) => s + d.boxFarmerRevenue, 0))}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className="font-semibold text-orange-700">
                                {formatIndianCurrency(dmPayoutsData.dmPayouts.reduce((s: number, d: any) => s + d.deliveryRevenue, 0))}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className="font-bold text-blue-700">
                                {formatIndianCurrency(dmPayoutsData.dmPayouts.reduce((s: number, d: any) => s + d.totalFarmerPrice, 0))}
                              </span>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <CardTitle>Product Management</CardTitle>
                      <CardDescription>View and manage products by status</CardDescription>
                    </div>
                    {user?.role === 'district_manager' && (
                      <Link href="/dashboard/products/new">
                        <Button className="bg-green-600 hover:bg-green-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Product
                        </Button>
                      </Link>
                    )}
                  </div>
                  <Tabs value={productStatusTab} onValueChange={(value) => { setProductStatusTab(value as "pending" | "approved" | "rejected" | "expired"); setProductSearchTerm(""); setProductFarmerFilter("all"); setProductApproverFilter("all"); }}>
                    <TabsList>
                      <TabsTrigger value="pending" className="relative">
                        Pending Approval
                        {stats?.pendingProducts > 0 && (
                          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {safeStats.pendingProducts}
                          </span>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="approved">Approved</TabsTrigger>
                      <TabsTrigger value="rejected">Rejected</TabsTrigger>
                      <TabsTrigger value="expired">Expired</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                {/* Product Filters */}
                {(() => {
                  const currentData: any[] =
                    productStatusTab === "pending" ? (pendingProducts as any[] ?? []) :
                    productStatusTab === "approved" ? (approvedProducts as any[] ?? []) :
                    productStatusTab === "rejected" ? (rejectedProducts as any[] ?? []) :
                    (expiredProducts as any[] ?? []);
                  const uniqueFarmers = Array.from(new Set(currentData.map((p: any) => p.farmerName).filter(Boolean))) as string[];
                  const uniqueApprovers = productStatusTab !== "pending"
                    ? (Array.from(new Set(currentData.map((p: any) => p.approverDetails?.name).filter(Boolean))) as string[])
                    : [];
                  return (
                    <div className="flex flex-col sm:flex-row gap-2 mb-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search by product name…"
                          value={productSearchTerm}
                          onChange={(e) => setProductSearchTerm(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <Select value={productFarmerFilter} onValueChange={(v) => setProductFarmerFilter(v)}>
                        <SelectTrigger className="w-full sm:w-48">
                          <SelectValue placeholder="All Farmers" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Farmers</SelectItem>
                          {uniqueFarmers.map((name) => (
                            <SelectItem key={name} value={name}>{name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {user?.role === "admin" && productStatusTab !== "pending" && uniqueApprovers.length > 0 && (
                        <Select value={productApproverFilter} onValueChange={(v) => setProductApproverFilter(v)}>
                          <SelectTrigger className="w-full sm:w-52">
                            <SelectValue placeholder="All Approvers" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Approvers</SelectItem>
                            {uniqueApprovers.map((name) => (
                              <SelectItem key={name} value={name}>{name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {(productSearchTerm || productFarmerFilter !== "all" || productApproverFilter !== "all") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setProductSearchTerm(""); setProductFarmerFilter("all"); setProductApproverFilter("all"); }}
                          className="shrink-0"
                        >
                          <X className="h-4 w-4 mr-1" /> Clear
                        </Button>
                      )}
                    </div>
                  );
                })()}

                {/* Pending Products Tab Content */}
                {productStatusTab === "pending" && (
                  <>
                    {pendingProductsLoading ? (
                      <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    ) : pendingProducts?.length === 0 ? (
                      <div className="text-center py-10">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">All caught up!</h3>
                        <p className="text-muted-foreground">There are no products awaiting approval.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {(pendingProducts as PendingProduct[] ?? []).filter((p) =>
                          (!productSearchTerm || p.name.toLowerCase().includes(productSearchTerm.toLowerCase())) &&
                          (productFarmerFilter === "all" || (p as any).farmerName === productFarmerFilter)
                        ).map((product: PendingProduct) => (
                          <Card key={product.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                              <div className="w-full md:w-1/4 bg-muted">
                                {product.imageUrl ? (
                                  <img 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    className="w-full h-48 object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-48 flex items-center justify-center bg-muted">
                                    <PackageOpen className="h-12 w-12 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div className="w-full md:w-3/4 p-6">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                      <div>
                                        <h3 className="text-xl font-bold">{product.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                          <span>{product.farmerName}</span>
                                          <span>•</span>
                                          <span><i className="fas fa-map-marker-alt mr-1"></i>{product.farmerLocation}</span>
                                          <span>•</span>
                                          <span>Added {formatDate(product.createdAt)}</span>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-lg font-medium">
                                          {formatIndianCurrency(product.price)}/{product.unit}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {product.inventory} {product.unit} in stock
                                        </div>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            product.status === 'Available Now' 
                                              ? 'bg-green-100 text-green-800' 
                                              : 'bg-amber-100 text-amber-800'
                                          }`}>
                                            {product.status}
                                          </span>
                                          <span className="text-xs text-muted-foreground">
                                            {product.categoryName}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                                      <div>
                                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Harvest Date</div>
                                        <div className="text-sm font-medium mt-1">
                                          {new Date(product.harvestDate).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                          })}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Available Until</div>
                                        <div className="text-sm font-medium mt-1">
                                          {new Date(product.availableUntil).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                          })}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Stock Available</div>
                                        <div className="text-sm font-medium mt-1">
                                          {product.inventory ?? 0} {product.unit}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <p className="text-muted-foreground line-clamp-2 mb-4">
                                      {product.description}
                                    </p>
                                    
                                    {product.growingDetails && (
                                      <div className="mb-4">
                                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Growing Details</div>
                                        <p className="text-sm text-gray-700 line-clamp-2">
                                          {product.growingDetails}
                                        </p>
                                      </div>
                                    )}
                                    
                                  </div>
                                </div>
                                
                                {showRejectionForm === product.id ? (
                                  <div className="border rounded p-4 mb-4 bg-gray-50">
                                    <h4 className="font-medium mb-2">Rejection Reason</h4>
                                    <p className="text-sm text-muted-foreground mb-3">
                                      Please provide a reason for rejecting this product. This will be shared with the farmer.
                                    </p>
                                    <textarea 
                                      className="w-full border rounded p-2 mb-3"
                                      rows={3}
                                      value={rejectionReason}
                                      onChange={(e) => setRejectionReason(e.target.value)}
                                      placeholder="e.g., Product images are unclear, Missing important details, etc."
                                    />
                                    <div className="flex justify-end gap-2">
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => {
                                          setShowRejectionForm(null);
                                          setRejectionReason("");
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button 
                                        variant="destructive" 
                                        size="sm"
                                        onClick={() => {
                                          handleProductApproval(product.id, 'rejected', rejectionReason);
                                          setShowRejectionForm(null);
                                          setRejectionReason("");
                                        }}
                                        disabled={approvalMutation.isPending || !rejectionReason.trim()}
                                      >
                                        {approvalMutation.isPending ? (
                                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                          <XCircle className="h-4 w-4 mr-2" />
                                        )}
                                        Confirm Rejection
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex gap-2 justify-end">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleEditPendingProduct(product)}
                                      disabled={approvalMutation.isPending}
                                    >
                                      <Pencil className="h-4 w-4 mr-2" />
                                      Edit
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setShowRejectionForm(product.id)}
                                      disabled={approvalMutation.isPending}
                                    >
                                      {approvalMutation.isPending ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      ) : (
                                        <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                      )}
                                      Reject
                                    </Button>
                                    <Button 
                                      variant="default" 
                                      size="sm"
                                      onClick={() => handleProductApproval(product.id, 'approved')}
                                      disabled={approvalMutation.isPending}
                                    >
                                      {approvalMutation.isPending ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      ) : (
                                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                      )}
                                      Approve
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Approved Products Tab Content */}
                {productStatusTab === "approved" && (
                  <>
                    {approvedProductsLoading ? (
                      <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    ) : approvedProducts?.length === 0 ? (
                      <div className="text-center py-10">
                        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No approved products</h3>
                        <p className="text-muted-foreground">There are no approved products in the system.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Farmer</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock Available</TableHead>
                                <TableHead>Available Until</TableHead>
                                <TableHead>Approver</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(approvedProducts as any[] ?? []).filter((p) =>
                                (!productSearchTerm || p.name.toLowerCase().includes(productSearchTerm.toLowerCase())) &&
                                (productFarmerFilter === "all" || p.farmerName === productFarmerFilter) &&
                                (productApproverFilter === "all" || p.approverDetails?.name === productApproverFilter)
                              ).map((product: any) => (
                                <TableRow key={product.id}>
                                  <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                      {product.imageUrl ? (
                                        <img 
                                          src={product.imageUrl} 
                                          alt={product.name} 
                                          className="w-8 h-8 rounded-md object-cover"
                                        />
                                      ) : (
                                        <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                                          <PackageOpen className="h-4 w-4" />
                                        </div>
                                      )}
                                      <div>
                                        <div>{product.name}</div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>{product.farmerName}</TableCell>
                                  <TableCell>{product.categoryName}</TableCell>
                                  <TableCell>{formatIndianCurrency(product.price)}/box</TableCell>
                                  <TableCell>
                                    <span className="text-sm font-medium">{product.inventory ?? 0} {product.unit}</span>
                                  </TableCell>
                                  <TableCell>{formatDate(product.availableUntil)}</TableCell>
                                  <TableCell>
                                    {product.approverDetails ? (
                                      <div className="text-sm">
                                        <div className="font-medium">
                                          {product.approverDetails.approvalType === 'fpo' ? 'FPO' : 'Admin'}: {product.approverDetails.name}
                                        </div>
                                        {product.approverDetails.orgName && (
                                          <div className="text-xs text-gray-500">{product.approverDetails.orgName}</div>
                                        )}
                                        <div className="text-xs text-gray-500">{product.approverDetails.district}</div>
                                      </div>
                                    ) : (
                                      <span className="text-xs text-gray-500">Unknown</span>
                                    )}
                                  </TableCell>
                                  <TableCell>{formatDate(product.createdAt)}</TableCell>
                                  <TableCell>
                                    <div className="flex gap-1">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewSales(product)}
                                        title="View Sales Details"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      {(user?.role === 'admin' || user?.role === 'district_manager') && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleEditProduct(product)}
                                          title="Edit Product"
                                        >
                                          <Pencil className="h-4 w-4" />
                                        </Button>
                                      )}
                                      {user?.role === 'admin' && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleDeleteProduct(product.id)}
                                          className="text-red-600 hover:text-red-700"
                                          title="Delete Product"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Expired Products Tab Content */}
                {productStatusTab === "expired" && (
                  <>
                    {expiredProductsLoading ? (
                      <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    ) : expiredProducts?.length === 0 ? (
                      <div className="text-center py-10">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No expired products</h3>
                        <p className="text-muted-foreground">There are no expired products in the system.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Farmer</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Expired On</TableHead>
                                <TableHead>Days Expired</TableHead>
                                <TableHead>Approver</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(expiredProducts as any[] ?? []).filter((p) =>
                                (!productSearchTerm || p.name.toLowerCase().includes(productSearchTerm.toLowerCase())) &&
                                (productFarmerFilter === "all" || p.farmerName === productFarmerFilter) &&
                                (productApproverFilter === "all" || p.approverDetails?.name === productApproverFilter)
                              ).map((product: any) => (
                                <TableRow key={product.id}>
                                  <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                      {product.imageUrl ? (
                                        <img 
                                          src={product.imageUrl} 
                                          alt={product.name} 
                                          className="w-8 h-8 rounded-md object-cover"
                                        />
                                      ) : (
                                        <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                                          <PackageOpen className="h-4 w-4" />
                                        </div>
                                      )}
                                      <div>
                                        <div>{product.name}</div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>{product.farmerName}</TableCell>
                                  <TableCell>{formatIndianCurrency(product.price)}/box</TableCell>
                                  <TableCell>{formatDate(product.availableUntil)}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100">
                                      {product.daysSinceExpiry} {product.daysSinceExpiry === 1 ? 'day' : 'days'} ago
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {product.approverDetails ? (
                                      <div className="text-sm">
                                        <div className="font-medium">
                                          {product.approverDetails.approvalType === 'fpo' ? 'FPO' : 'Admin'}: {product.approverDetails.name}
                                        </div>
                                        {product.approverDetails.orgName && (
                                          <div className="text-xs text-gray-500">{product.approverDetails.orgName}</div>
                                        )}
                                        <div className="text-xs text-gray-500">{product.approverDetails.district}</div>
                                      </div>
                                    ) : (
                                      <span className="text-xs text-gray-500">Unknown</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-1">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewSales(product)}
                                        title="View Sales Details"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      {(user?.role === 'admin' || user?.role === 'district_manager') && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleEditProduct(product)}
                                          title="Edit Product"
                                        >
                                          <Pencil className="h-4 w-4" />
                                        </Button>
                                      )}
                                      {user?.role === 'admin' && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleDeleteProduct(product.id)}
                                          className="text-red-600 hover:text-red-700"
                                          title="Delete Product"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Rejected Products Tab Content */}
                {productStatusTab === "rejected" && (
                  <>
                    {rejectedProductsLoading ? (
                      <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    ) : rejectedProducts?.length === 0 ? (
                      <div className="text-center py-10">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No rejected products</h3>
                        <p className="text-muted-foreground">There are no rejected products in the system.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Farmer</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Rejection Reason</TableHead>
                                <TableHead>Rejected By</TableHead>
                                <TableHead>Rejected On</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(rejectedProducts as any[] ?? []).filter((p) =>
                                (!productSearchTerm || p.name.toLowerCase().includes(productSearchTerm.toLowerCase())) &&
                                (productFarmerFilter === "all" || p.farmerName === productFarmerFilter) &&
                                (productApproverFilter === "all" || p.approverDetails?.name === productApproverFilter)
                              ).map((product: any) => (
                                <TableRow key={product.id}>
                                  <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                      {product.imageUrl ? (
                                        <img 
                                          src={product.imageUrl} 
                                          alt={product.name} 
                                          className="w-8 h-8 rounded-md object-cover"
                                        />
                                      ) : (
                                        <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                                          <PackageOpen className="h-4 w-4" />
                                        </div>
                                      )}
                                      <div>
                                        <div>{product.name}</div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>{product.farmerName}</TableCell>
                                  <TableCell>{product.categoryName}</TableCell>
                                  <TableCell>{formatIndianCurrency(product.price)}/box</TableCell>
                                  <TableCell>
                                    <div className="max-w-xs">
                                      <p className="text-sm text-muted-foreground">
                                        {product.rejectionReason || "No reason provided"}
                                      </p>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {product.approverDetails ? (
                                      <div className="text-sm">
                                        <div className="font-medium">
                                          {product.approverDetails.approvalType === 'fpo' ? 'FPO' : 'Admin'}: {product.approverDetails.name}
                                        </div>
                                        {product.approverDetails.orgName && (
                                          <div className="text-xs text-gray-500">{product.approverDetails.orgName}</div>
                                        )}
                                        <div className="text-xs text-gray-500">{product.approverDetails.district}</div>
                                      </div>
                                    ) : (
                                      <span className="text-xs text-gray-500">Unknown</span>
                                    )}
                                  </TableCell>
                                  <TableCell>{formatDate(product.updatedAt)}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center space-x-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => window.open(`/products/${product.id}`, '_blank')}
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Orders Tab */}
          <TabsContent value="orders">
            {/* Order Type Sub-Tabs */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle>Order Management</CardTitle>
                <CardDescription>Manage and track all orders</CardDescription>
              </CardHeader>
            </Card>
            
            {/* Filter Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Filter Orders</CardTitle>
                <CardDescription>Search and filter orders by customer name, order details, status, FPO, or district</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search Bar - Full Width */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search Orders</label>
                    <Input
                      placeholder="Search by order ID, customer name, phone, email, or address..."
                      value={orderSearchTerm}
                      onChange={(e) => setOrderSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Filter Dropdowns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Order Status</label>
                      <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="growing">Growing</SelectItem>
                          <SelectItem value="harvested">Harvested</SelectItem>
                          <SelectItem value="packaging">Packaging</SelectItem>
                          <SelectItem value="shipping">Shipping</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="canceled">Canceled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {user?.role === 'admin' && allUsers && (
                      <>
                        <div>
                          <label className="text-sm font-medium mb-2 block">FPO</label>
                          <Select value={dmFilterOrders} onValueChange={setDmFilterOrders}>
                            <SelectTrigger>
                              <SelectValue placeholder="All FPOs" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All FPOs</SelectItem>
                              {allUsers.filter((u: any) => u.role === 'district_manager').map((dm: any) => (
                                <SelectItem key={dm.id} value={dm.id.toString()}>
                                  {dm.orgName || dm.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">District</label>
                          <Select value={districtFilterOrders} onValueChange={setDistrictFilterOrders}>
                            <SelectTrigger>
                              <SelectValue placeholder="All Districts" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Districts</SelectItem>
                              {[...new Set(allUsers.filter((u: any) => u.role === 'district_manager' && u.district).map((dm: any) => dm.district))].map((district: string) => (
                                <SelectItem key={district} value={district}>
                                  {district}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Main Content Card */}
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>Manage and track all customer orders with FPO details</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading orders...</span>
                  </div>
                ) : ordersError ? (
                  <div className="text-center py-10">
                    <div className="text-red-500 mb-4">
                      <svg className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 18.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Error Loading Orders</h3>
                    <p className="text-muted-foreground mb-4">
                      Failed to load order data. Please try again.
                    </p>
                    <Button onClick={() => refetchOrders()} variant="outline">
                      Try Again
                    </Button>
                  </div>
                ) : orders?.length === 0 ? (
                  <div className="text-center py-10">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No orders found</h3>
                    <p className="text-muted-foreground">
                      {orderStatusFilter !== "all" 
                        ? `No orders with status "${orderStatusFilter}" found.` 
                        : "There are no orders in the system yet."}
                    </p>
                  </div>
                ) : (() => {
                  let filteredOrders = orders || [];
                  
                  // Apply search filter to orders
                  if (orderSearchTerm) {
                    const searchLower = orderSearchTerm.toLowerCase();
                    filteredOrders = filteredOrders.filter((order: AdminOrder) => 
                      order.id.toString().includes(searchLower) ||
                      order.customerName?.toLowerCase().includes(searchLower) ||
                      order.email?.toLowerCase().includes(searchLower) ||
                      order.phone?.toLowerCase().includes(searchLower) ||
                      order.address?.toLowerCase().includes(searchLower) ||
                      order.city?.toLowerCase().includes(searchLower)
                    );
                  }
                  
                  if (filteredOrders.length === 0) {
                    return (
                      <div className="text-center py-10">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No orders found</h3>
                        <p className="text-muted-foreground">
                          {orderSearchTerm 
                            ? `No orders matching "${orderSearchTerm}" found.`
                            : `No orders match your current filters.`}
                        </p>
                      </div>
                    );
                  }
                  
                  return (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>FPO(s)</TableHead>
                          <TableHead>Products</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead>Pay to FPO</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Est. Delivery</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order: AdminOrder) => {
                        // Get unique FPOs from order items
                        const uniqueFpos = order.items?.reduce((fpos: any[], item: any) => {
                          const fpoId = (item as any).fpoId ?? item.farmerId;
                          const existing = fpos.find(f => f.fpoId === fpoId);
                          if (!existing) {
                            fpos.push({
                              fpoId,
                              fpoName: (item as any).fpoName || item.farmerName || 'Unknown FPO'
                            });
                          }
                          return fpos;
                        }, []) || [];

                        const deliveryDate = getEstimatedDeliveryDate(order);

                        return (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{order.customerName}</span>
                                <span className="text-xs text-muted-foreground">{order.email}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col space-y-1">
                                {uniqueFpos.map((fpo) => (
                                  <Badge 
                                    key={fpo.fpoId}
                                    variant="outline" 
                                    className="bg-teal-50 text-teal-700 text-xs border-teal-200"
                                  >
                                    {fpo.fpoName}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col space-y-1">
                                {order.items?.slice(0, 2).map((item: any, index) => (
                                  <div key={index} className="text-xs">
                                    <span className="font-medium">{item.productName}</span>
                                    <span className="text-muted-foreground ml-1">×{(() => {
                                      const isB2B = order.notes?.includes('B2B Bulk Order');
                                      const upb = !isB2B && item.product?.unitsPerBox ? parseFloat(String(item.product.unitsPerBox)) : 1;
                                      const u = isB2B ? (item.product?.wholesaleUnit || item.product?.unit || 'units') : (item.product?.unit || 'units');
                                      if (!isB2B && upb > 1) return `${item.quantity} box${item.quantity !== 1 ? 'es' : ''} (${item.quantity * upb} ${u})`;
                                      return `${item.quantity} ${u}`;
                                    })()}</span>
                                  </div>
                                ))}
                                {order.items && order.items.length > 2 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{order.items.length - 2} more
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{formatIndianCurrency(order.total)}</TableCell>
                            <TableCell>
                              {order.paymentMethod === "cod" ? (
                                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                  COD
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  Online
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className="font-medium text-green-600">
                                {formatIndianCurrency(
                                  order.items?.reduce((sum: number, item: any) => {
                                    const productPrice = item.product?.price 
                                      ? (typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price)
                                      : (typeof item.price === 'string' ? parseFloat(item.price) : (item.price || 0));
                                    return sum + (productPrice * (item.quantity || 1));
                                  }, 0) || 0
                                )}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-sm">{formatDate(order.createdAt)}</span>
                                {deliveryDate && (
                                  <span className="text-xs text-muted-foreground">
                                    Delivery: {deliveryDate}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <OrderStatusBadge status={order.status} />
                            </TableCell>
                            <TableCell>
                                {order.status.toLowerCase() !== 'delivered' && order.status.toLowerCase() !== 'canceled' && (
                                  <div className="flex items-center text-xs text-green-700 font-medium">
                                    <Truck className="h-3 w-3 mr-1" />
                                    {deliveryDate || getEstimatedDeliveryDate(order)}
                                  </div>
                                )}
                                {(order.status.toLowerCase() === 'delivered') && (
                                  <Badge variant="outline" className="bg-green-100 text-green-800">
                                    Delivered
                                  </Badge>
                                )}
                                {(order.status.toLowerCase() === 'canceled') && (
                                  <Badge variant="outline" className="bg-red-100 text-red-800">
                                    Canceled
                                  </Badge>
                                )}
                              </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex items-center"
                                  asChild
                                >
                                  <Link href={`/dashboard/orders/${order.id}`}>
                                    <span>View Details</span>
                                  </Link>
                                </Button>
                                <Select 
                                  defaultValue={order.status}
                                  onValueChange={(value) => handleOrderStatusChange(order.id, value)}
                                  disabled={orderStatusMutation.isPending}
                                >
                                  <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Change status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="accepted">Accepted</SelectItem>
                                    <SelectItem value="growing">Growing</SelectItem>
                                    <SelectItem value="harvested">Harvested</SelectItem>
                                    <SelectItem value="packaging">Packaging</SelectItem>
                                    <SelectItem value="shipping">Shipping</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="canceled">Canceled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                        })}
                      </TableBody>
                    </Table>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Farmers Tab */}
          <TabsContent value="farmers">
            <Card>
              <CardHeader>
                <CardTitle>Farmer Management</CardTitle>
                <CardDescription>Manage and monitor all farmers on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search and Filter Section */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by farm name..."
                      value={farmerSearchTerm}
                      onChange={(e) => setFarmerSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="w-full sm:w-64">
                    <Select value={districtFilterOrders} onValueChange={setDistrictFilterOrders}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Districts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Districts</SelectItem>
                        {(() => {
                          const farmerDistricts = farmers ? [...new Set((farmers as AdminFarmer[]).filter(f => f.location).map(f => f.location))] : [];
                          const allDistricts = [...new Set(farmerDistricts)].sort();
                          return allDistricts.map((district: string) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ));
                        })()}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Join Requests Panel - DM only */}
                {user?.role === 'district_manager' && (
                  <div className="mb-6">
                    {pendingRequestsLoading ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading join requests...
                      </div>
                    ) : pendingFarmerRequests.length > 0 ? (
                      <Card className="border-amber-200 bg-amber-50/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <UserPlus className="h-4 w-4 text-amber-600" />
                            Pending Join Requests
                            <Badge className="bg-amber-500 text-white ml-1">{pendingFarmerRequests.length}</Badge>
                          </CardTitle>
                          <CardDescription>Farmers who have requested to join your FPO</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {pendingFarmerRequests.map((req) => (
                              <div key={req.farmerUserId} className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg border border-amber-100">
                                <div className="flex items-center gap-3 min-w-0">
                                  {(req.farmerAvatar || req.logoUrl) ? (
                                    <img src={req.farmerAvatar || req.logoUrl!} alt={req.farmerName} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-700 font-semibold text-sm">
                                      {(req.farmerName || "?").split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("")}
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <p className="font-medium text-sm truncate">{req.farmName || req.farmerName}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />{req.farmerDistrict || "District N/A"}
                                      {req.farmerPhone && <span className="ml-2">· {req.farmerPhone}</span>}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Requested {new Date(req.requestedAt).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => approveFarmerMutation.mutate(req.farmerUserId)}
                                    disabled={approveFarmerMutation.isPending || rejectFarmerMutation.isPending}
                                  >
                                    {approveFarmerMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Approve"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => rejectFarmerMutation.mutate(req.farmerUserId)}
                                    disabled={approveFarmerMutation.isPending || rejectFarmerMutation.isPending}
                                  >
                                    {rejectFarmerMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Reject"}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <p className="text-xs text-muted-foreground py-1">No pending join requests.</p>
                    )}
                  </div>
                )}

                {farmersLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (() => {
                  // Apply filters to farmers
                  let filteredFarmers = farmers || [];
                  
                  // Search filter
                  if (farmerSearchTerm) {
                    const searchLower = farmerSearchTerm.toLowerCase();
                    filteredFarmers = filteredFarmers.filter((farmer: AdminFarmer) => 
                      farmer.farmName?.toLowerCase().includes(searchLower) ||
                      farmer.phone?.toLowerCase().includes(searchLower) ||
                      farmer.email?.toLowerCase().includes(searchLower)
                    );
                  }
                  
                  // District filter
                  if (user?.role === 'admin' && districtFilterOrders !== "all") {
                    filteredFarmers = filteredFarmers.filter((farmer: AdminFarmer) => 
                      farmer.location === districtFilterOrders
                    );
                  }
                  
                  return filteredFarmers.length === 0 ? (
                    <div className="text-center py-10">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No farmers found</h3>
                      <p className="text-muted-foreground">
                        {farmerSearchTerm || districtFilterOrders !== "all" 
                          ? "No farmers match your filter criteria." 
                          : "There are no farmers registered on the platform yet."}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Farm Name</TableHead>
                          <TableHead>District</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Location Coordinates</TableHead>
                          <TableHead>Tags</TableHead>
                          <TableHead>Total Products</TableHead>
                          <TableHead>Pending</TableHead>
                          <TableHead>Approved</TableHead>
                          <TableHead>Rejected</TableHead>
                          <TableHead>Organic Cert.</TableHead>
                          <TableHead>Natural Cert.</TableHead>
                          {user?.role === 'district_manager' && <TableHead>FPO Status</TableHead>}
                          <TableHead>Joined</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredFarmers.map((farmer: AdminFarmer) => (
                          <TableRow key={farmer.id}>
                            <TableCell className="font-medium">{farmer.farmName}</TableCell>
                            <TableCell>{farmer.location}</TableCell>
                            <TableCell>{farmer.phone || 'N/A'}</TableCell>
                            <TableCell>{farmer.email || 'N/A'}</TableCell>
                            <TableCell>
                              {farmer.latitude && farmer.longitude ? (
                                <div className="text-sm">
                                  <div className="font-mono text-xs">
                                    <div>Lat: {parseFloat(farmer.latitude).toFixed(6)}</div>
                                    <div>Lng: {parseFloat(farmer.longitude).toFixed(6)}</div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-1 h-6 text-xs"
                                    onClick={() => window.open(`https://maps.google.com/?q=${farmer.latitude},${farmer.longitude}`, '_blank')}
                                  >
                                    <MapPin className="h-3 w-3 mr-1" />
                                    View on Map
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">No location set</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {farmer.tags && farmer.tags.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {farmer.tags.slice(0, 3).map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {farmer.tags.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{farmer.tags.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400">No tags</span>
                              )}
                            </TableCell>
                            <TableCell>{farmer.productCount}</TableCell>
                          <TableCell>
                            {farmer.pendingCount > 0 ? (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
                                {farmer.pendingCount}
                              </Badge>
                            ) : (
                              farmer.pendingCount
                            )}
                          </TableCell>
                          <TableCell>{farmer.approvedCount}</TableCell>
                          <TableCell>{farmer.rejectedCount}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={farmer.isOrganicCertified || false}
                                onCheckedChange={(checked) => toggleOrganicCertificationMutation.mutate({ farmerId: farmer.id, isOrganicCertified: checked })}
                                disabled={toggleOrganicCertificationMutation.isPending}
                              />
                              <span className="text-xs text-gray-600">{farmer.isOrganicCertified ? 'Yes' : 'No'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={farmer.isNaturalCertified || false}
                                onCheckedChange={(checked) => toggleNaturalCertificationMutation.mutate({ farmerId: farmer.id, isNaturalCertified: checked })}
                                disabled={toggleNaturalCertificationMutation.isPending}
                              />
                              <span className="text-xs text-gray-600">{farmer.isNaturalCertified ? 'Yes' : 'No'}</span>
                            </div>
                          </TableCell>
                          {user?.role === 'district_manager' && (
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">Linked</Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 text-xs"
                                  onClick={() => unlinkFarmerMutation.mutate(farmer.userId)}
                                  disabled={unlinkFarmerMutation.isPending}
                                  title="Unlink farmer"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          )}
                          <TableCell>{formatDate(farmer.createdAt)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setViewingFarmerDashboard(farmer)}
                                title="View Dashboard"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {canEdit(user?.role || '', 'farmers') && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEditFarmer(farmer)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => deleteFarmerMutation.mutate(farmer.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
            
            {/* Farmer Dashboard Dialog */}
            <Dialog open={!!viewingFarmerDashboard} onOpenChange={() => setViewingFarmerDashboard(null)}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-green-600" />
                    {viewingFarmerDashboard?.farmName}'s Dashboard
                  </DialogTitle>
                  <DialogDescription>
                    Overview of farmer performance and statistics
                  </DialogDescription>
                </DialogHeader>
                
                {farmerDashboardLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                  </div>
                ) : farmerDashboardStats ? (
                  <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-gray-600">Total Earnings</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">
                            {formatIndianCurrency(farmerDashboardStats.stats?.grandTotalRevenue || 0)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Box: {formatIndianCurrency(farmerDashboardStats.stats?.regularOrderEarnings || 0)} | 
                            Events: {formatIndianCurrency(farmerDashboardStats.stats?.eventBookingRevenue || 0)}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-gray-600">Total Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-blue-600">
                            {farmerDashboardStats.stats?.totalOrders || 0}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {farmerDashboardStats.stats?.completedOrders || 0} delivered | {farmerDashboardStats.stats?.pendingOrders || 0} pending
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-l-4 border-l-purple-500">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-gray-600">Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-purple-600">
                            {farmerDashboardStats.stats?.totalProducts || 0}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {farmerDashboardStats.stats?.approvedProducts || 0} approved | {farmerDashboardStats.stats?.pendingProducts || 0} pending
                          </div>
                        </CardContent>
                      </Card>
                      
                    </div>
                    
                    {/* Additional Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-pink-600" />
                            Events & Bookings
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-lg font-bold text-pink-600">{farmerDashboardStats.stats?.totalEvents || 0} Events</div>
                              <div className="text-sm text-gray-500">{farmerDashboardStats.stats?.eventBookingCount || 0} paid bookings</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">
                                {formatIndianCurrency(farmerDashboardStats.stats?.eventBookingRevenue || 0)}
                              </div>
                              <div className="text-xs text-gray-500">Event revenue</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Leaf className="h-4 w-4 text-green-600" />
                            Farmer Info
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Location:</span>
                              <span className="font-medium">{viewingFarmerDashboard?.location || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Organic Cert.:</span>
                              <Badge variant={viewingFarmerDashboard?.isOrganicCertified ? "default" : "secondary"} className={viewingFarmerDashboard?.isOrganicCertified ? "bg-green-600" : ""}>
                                {viewingFarmerDashboard?.isOrganicCertified ? 'Certified' : 'Not Certified'}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Natural Cert.:</span>
                              <Badge variant={viewingFarmerDashboard?.isNaturalCertified ? "default" : "secondary"} className={viewingFarmerDashboard?.isNaturalCertified ? "bg-emerald-600" : ""}>
                                {viewingFarmerDashboard?.isNaturalCertified ? 'Certified' : 'Not Certified'}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Total Products:</span>
                              <span className="font-medium">{farmerDashboardStats.stats?.totalProducts || 0}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="md:col-span-2">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-indigo-600" />
                            Linked FPOs
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {farmerDashboardStats.linkedFpos && farmerDashboardStats.linkedFpos.length > 0 ? (
                            <div className="space-y-3">
                              {farmerDashboardStats.linkedFpos.map((fpo: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                                  <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center">
                                      <Building2 className="h-4 w-4 text-indigo-600" />
                                    </div>
                                    <div>
                                      <div className="font-medium text-sm">{fpo.orgName}</div>
                                      <div className="text-xs text-gray-500">
                                        DM: {fpo.dmName} {fpo.district ? `| ${fpo.district}` : ''}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    Linked {formatDate(fpo.linkedAt)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-gray-400 text-sm">
                              <Building2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                              Not linked to any FPO
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : farmerDashboardError ? (
                  <div className="text-center py-8">
                    <div className="text-red-500 mb-4">Failed to load farmer statistics</div>
                    <Button variant="outline" onClick={() => refetchFarmerStats()}>
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No statistics available
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          {/* Fees Tab */}
          <TabsContent value="fees">
            {orderFeesLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Order Fees Management</CardTitle>
                    <CardDescription>Configure additional fees applied to orders</CardDescription>
                  </div>
                  <Button onClick={() => {
                    resetFeeForm();
                    setEditingFee(null);
                    setShowFeeForm(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Fee
                  </Button>
                </CardHeader>
                <CardContent>
                  {showFeeForm && (
                    <form onSubmit={handleSubmitFee} className="space-y-4 mb-6 p-4 border rounded-md">
                      <h3 className="text-lg font-medium">
                        {editingFee ? "Edit Fee" : "Add New Fee"}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fee-name">Fee Name</Label>
                          <Input 
                            id="fee-name" 
                            value={feeForm.name} 
                            onChange={e => setFeeForm({...feeForm, name: e.target.value})}
                            placeholder="e.g., Delivery Fee"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="fee-type">Fee Type</Label>
                          <Select 
                            value={feeForm.type} 
                            onValueChange={value => setFeeForm({...feeForm, type: value as "fixed" | "percentage"})}
                          >
                            <SelectTrigger id="fee-type">
                              <SelectValue placeholder="Select fee type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                              <SelectItem value="percentage">Percentage (%)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="fee-value">
                            {feeForm.type === "fixed" ? "Amount (₹)" : "Percentage (%)"}
                          </Label>
                          <Input 
                            id="fee-value" 
                            type="number"
                            step={feeForm.type === "fixed" ? "1" : "0.01"}
                            value={feeForm.value} 
                            onChange={e => setFeeForm({...feeForm, value: e.target.value})}
                            placeholder={feeForm.type === "fixed" ? "e.g., 50" : "e.g., 5.5"}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="fee-order">Display Order</Label>
                          <Input 
                            id="fee-order" 
                            type="number"
                            min="0"
                            value={feeForm.displayOrder.toString()} 
                            onChange={e => setFeeForm({...feeForm, displayOrder: parseInt(e.target.value) || 0})}
                            placeholder="Order of appearance in cart"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="fee-description">Description (Optional)</Label>
                        <Input 
                          id="fee-description" 
                          value={feeForm.description} 
                          onChange={e => setFeeForm({...feeForm, description: e.target.value})}
                          placeholder="Explain the purpose of this fee"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="fee-active"
                            checked={feeForm.isActive}
                            onCheckedChange={(checked) => setFeeForm({...feeForm, isActive: checked})}
                          />
                          <Label htmlFor="fee-active">Active</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="fee-subtotal"
                            checked={feeForm.applyToSubtotal}
                            onCheckedChange={(checked) => setFeeForm({...feeForm, applyToSubtotal: checked})}
                          />
                          <Label htmlFor="fee-subtotal">Apply to subtotal</Label>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => setShowFeeForm(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          disabled={createFeeMutation.isPending || updateFeeMutation.isPending}
                        >
                          {(createFeeMutation.isPending || updateFeeMutation.isPending) && (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          )}
                          {editingFee ? "Update Fee" : "Create Fee"}
                        </Button>
                      </div>
                    </form>
                  )}
                  
                  {orderFees && orderFees.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Active</TableHead>
                          <TableHead>Apply to Subtotal</TableHead>
                          <TableHead>Display Order</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderFees.map((fee: OrderFee) => (
                          <TableRow key={fee.id}>
                            <TableCell className="font-medium">
                              {fee.name}
                              {fee.description && (
                                <p className="text-sm text-muted-foreground">{fee.description}</p>
                              )}
                            </TableCell>
                            <TableCell>{fee.type === "fixed" ? "Fixed" : "Percentage"}</TableCell>
                            <TableCell>
                              {fee.type === "fixed" ? 
                                formatIndianCurrency(parseFloat(fee.value)) : 
                                `${fee.value}%`
                              }
                            </TableCell>
                            <TableCell>
                              {fee.isActive ? (
                                <Badge className="bg-green-500">Active</Badge>
                              ) : (
                                <Badge variant="outline">Inactive</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {fee.applyToSubtotal ? "Yes" : "No"}
                            </TableCell>
                            <TableCell>{fee.displayOrder}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleEditFee(fee)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDeleteFee(fee.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No order fees configured yet.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          resetFeeForm();
                          setShowFeeForm(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create your first fee
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* FPO Profile Tab - DM only */}
          <TabsContent value="fpo-profile">
            <FPOProfile />
          </TabsContent>

          {/* Delivery Management Tab */}
          <TabsContent value="delivery">
            <FpoDeliveryManagement />
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users">
            <div className="container mx-auto py-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Master control for all platform users</CardDescription>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or username..."
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        className="pl-8 w-[250px]"
                      />
                    </div>
                    <Select
                      value={userRoleFilter}
                      onValueChange={setUserRoleFilter}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="admin">Admins</SelectItem>
                        <SelectItem value="farmer">Farmers</SelectItem>
                        <SelectItem value="customer">Customers</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={() => {
                      setEditingUser(null);
                      setUserForm({
                        username: "",
                        email: "",
                        phone: "",
                        name: "",
                        role: "customer",
                        password: "",
                        isActive: true
                      });
                      setShowUserForm(true);
                    }}>
                      <Plus className="h-4 w-4 mr-2" /> Add User
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : usersList && usersList.length > 0 ? (() => {
                    const filteredUsers = userSearchQuery.trim()
                      ? usersList.filter((u: AdminUser) => {
                          const q = userSearchQuery.toLowerCase();
                          return u.username.toLowerCase().includes(q) || u.name.toLowerCase().includes(q);
                        })
                      : usersList;
                    return filteredUsers.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Username</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Subscription</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user: AdminUser) => (
                          <TableRow key={user.id} className={!user.isActive ? "bg-gray-50" : ""}>
                            <TableCell className="font-medium">{user.username}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phone || 'N/A'}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  user.role === "admin" ? "default" :
                                  user.role === "farmer" ? "secondary" : "outline"
                                }
                              >
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {user.subscription ? (
                                <div className="flex flex-col gap-1">
                                  <Badge className={
                                    user.subscription.status === 'active'
                                      ? (user.subscription.tier?.startsWith('business') 
                                          ? "bg-blue-100 text-blue-800 border-blue-200" 
                                          : "bg-green-100 text-green-800 border-green-200")
                                      : user.subscription.status === 'expired'
                                        ? "bg-gray-100 text-gray-500 border-gray-200"
                                        : "bg-red-100 text-red-600 border-red-200"
                                  }>
                                    {user.subscription.planName || user.subscription.tier}
                                  </Badge>
                                  <Badge variant="outline" className={`text-xs w-fit ${
                                    user.subscription.status === 'active' ? "bg-green-50 text-green-700 border-green-200" :
                                    user.subscription.status === 'expired' ? "bg-gray-50 text-gray-500 border-gray-200" :
                                    "bg-red-50 text-red-600 border-red-200"
                                  }`}>
                                    {user.subscription.status === 'active' ? 'Active' : user.subscription.status === 'expired' ? 'Expired' : 'Cancelled'}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {user.subscription.status === 'active' ? 'Expires' : 'Ended'}: {new Date(user.subscription.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                  </span>
                                  {user.subscription.zeroPlatformFee && (
                                    <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200 w-fit">
                                      0% Fee
                                    </Badge>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={user.isActive ? "outline" : "destructive"}
                                className={`${user.isActive 
                                  ? "bg-green-100 text-green-800 hover:bg-green-100" 
                                  : "bg-red-100 text-red-800 hover:bg-red-100"}`
                                }
                              >
                                {user.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(user.createdAt)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingUser(user);
                                    setUserForm({
                                      username: user.username,
                                      email: user.email,
                                      phone: user.phone || "",
                                      name: user.name,
                                      role: user.role,
                                      password: "", // Don't show password
                                      isActive: user.isActive
                                    });
                                    setShowUserForm(true);
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant={user.isActive ? "destructive" : "outline"}
                                  onClick={() => toggleUserStatusMutation.mutate({
                                    id: user.id,
                                    isActive: !user.isActive
                                  })}
                                >
                                  {user.isActive 
                                    ? <Ban className="h-4 w-4" /> 
                                    : <Check className="h-4 w-4" />
                                  }
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No users found matching "{userSearchQuery}"</p>
                      </div>
                    );
                  })() : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No users found matching the selected filter.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          setUserForm({
                            username: "",
                            email: "",
                            phone: "",
                            name: "",
                            role: "customer",
                            password: "",
                            isActive: true
                          });
                          setShowUserForm(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create a new user
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingUser ? "Edit User" : "Add New User"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingUser
                        ? "Update the user details below."
                        : "Fill in the details to create a new user."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        value={userForm.username} 
                        onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        type="email" 
                        value={userForm.email} 
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone"
                        type="tel" 
                        value={userForm.phone} 
                        onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={userForm.name} 
                        onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={userForm.role}
                        onValueChange={(value) => setUserForm({ ...userForm, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="farmer">Farmer</SelectItem>
                          <SelectItem value="customer">Customer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">
                        {editingUser ? "Password (leave blank to keep current)" : "Password"}
                      </Label>
                      <Input 
                        id="password"
                        type="password" 
                        value={userForm.password} 
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={userForm.isActive}
                        onCheckedChange={(checked) => setUserForm({ ...userForm, isActive: checked })}
                      />
                      <Label htmlFor="isActive">Active Account</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      onClick={() => {
                        if (editingUser) {
                          const updateData: any = {
                            id: editingUser.id,
                            username: userForm.username,
                            email: userForm.email,
                            phone: userForm.phone,
                            name: userForm.name,
                            role: userForm.role,
                            isActive: userForm.isActive
                          };
                          // Only include password if it was changed
                          if (userForm.password) {
                            updateData.password = userForm.password;
                          }
                          updateUserMutation.mutate(updateData);
                        } else {
                          createUserMutation.mutate(userForm);
                        }
                      }}
                      disabled={!userForm.username || !userForm.email || (!editingUser && !userForm.password)}
                    >
                      {editingUser ? "Update" : "Create"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>

          {/* Staff Management Tab */}
          <TabsContent value="staff">
            <StaffManagement />
          </TabsContent>
          
          {/* Categories Management Tab */}
          <TabsContent value="categories">
            <div className="container mx-auto py-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Product Categories</CardTitle>
                    <CardDescription>Manage product categories for the marketplace</CardDescription>
                  </div>
                  <Button onClick={() => {
                    setCategoryForm({ name: "", description: "" });
                    setEditingCategory(null);
                    setShowCategoryForm(true);
                  }} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Category
                  </Button>
                </CardHeader>
                <CardContent>
                  {categoriesLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : categories && categories.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categories.map((category: Category) => (
                          <TableRow key={category.id}>
                            <TableCell className="font-medium">{category.name}</TableCell>
                            <TableCell>{category.description}</TableCell>
                            <TableCell>{formatDate(category.createdAt)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => {
                                    setEditingCategory({
                                      id: category.id,
                                      name: category.name,
                                      description: category.description
                                    });
                                    setCategoryForm({
                                      name: category.name,
                                      description: category.description
                                    });
                                    setShowCategoryForm(true);
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="icon"
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
                                      deleteCategoryMutation.mutate(category.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No categories found.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          setCategoryForm({ name: "", description: "" });
                          setShowCategoryForm(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create your first category
                      </Button>
                    </div>
                  )}
                  
                  {/* Category Form Dialog */}
                  <Dialog open={showCategoryForm} onOpenChange={setShowCategoryForm}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
                        <DialogDescription>
                          {editingCategory ? "Update the category details below." : "Enter the details for the new category."}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (editingCategory) {
                          updateCategoryMutation.mutate({
                            id: editingCategory.id,
                            data: categoryForm
                          });
                        } else {
                          createCategoryMutation.mutate(categoryForm);
                        }
                      }}>
                        <div className="space-y-4 py-2">
                          <div className="space-y-2">
                            <Label htmlFor="category-name">Category Name</Label>
                            <Input 
                              id="category-name" 
                              value={categoryForm.name} 
                              onChange={e => setCategoryForm({...categoryForm, name: e.target.value})}
                              placeholder="e.g., Vegetables"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="category-description">Description</Label>
                            <Input 
                              id="category-description" 
                              value={categoryForm.description} 
                              onChange={e => setCategoryForm({...categoryForm, description: e.target.value})}
                              placeholder="Describe this category"
                              required
                            />
                          </div>
                        </div>
                        
                        <DialogFooter className="mt-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              setShowCategoryForm(false);
                              setCategoryForm({ name: "", description: "" });
                              setEditingCategory(null);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                          >
                            {(createCategoryMutation.isPending || updateCategoryMutation.isPending) ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                {editingCategory ? "Updating..." : "Creating..."}
                              </>
                            ) : (
                              <>{editingCategory ? "Update Category" : "Create Category"}</>
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Districts Management Tab */}
          <TabsContent value="districts">
            <div className="container mx-auto py-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Districts Management</CardTitle>
                    <CardDescription>Manage districts for farmer registration and staff assignment</CardDescription>
                  </div>
                  <Button onClick={() => {
                    setDistrictForm({ name: "", state: "", isActive: true });
                    setEditingDistrict(null);
                    setShowDistrictForm(true);
                  }} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add District
                  </Button>
                </CardHeader>
                <CardContent>
                  {districtsLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : districts && districts.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>District Name</TableHead>
                          <TableHead>State</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {districts.map((district) => (
                          <TableRow key={district.id}>
                            <TableCell className="font-medium">{district.name}</TableCell>
                            <TableCell>{district.state}</TableCell>
                            <TableCell>
                              <Badge variant={district.isActive ? "default" : "secondary"}>
                                {district.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(district.createdAt)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => {
                                    setEditingDistrict({
                                      id: district.id,
                                      name: district.name,
                                      state: district.state || "",
                                      isActive: district.isActive
                                    });
                                    setDistrictForm({
                                      name: district.name,
                                      state: district.state || "",
                                      isActive: district.isActive
                                    });
                                    setShowDistrictForm(true);
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="icon"
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete the district "${district.name}"?`)) {
                                      deleteDistrictMutation.mutate(district.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No districts found.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          setDistrictForm({ name: "", state: "", isActive: true });
                          setShowDistrictForm(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create your first district
                      </Button>
                    </div>
                  )}
                  
                  {/* District Form Dialog */}
                  <Dialog open={showDistrictForm} onOpenChange={setShowDistrictForm}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingDistrict ? "Edit District" : "Add New District"}</DialogTitle>
                        <DialogDescription>
                          {editingDistrict ? "Update the district details below." : "Enter the details for the new district."}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (editingDistrict) {
                          updateDistrictMutation.mutate({
                            id: editingDistrict.id,
                            data: districtForm
                          });
                        } else {
                          createDistrictMutation.mutate(districtForm);
                        }
                      }}>
                        <div className="space-y-4 py-2">
                          <div className="space-y-2">
                            <Label htmlFor="district-name">District Name</Label>
                            <Input 
                              id="district-name" 
                              value={districtForm.name} 
                              onChange={e => setDistrictForm({...districtForm, name: e.target.value})}
                              placeholder="e.g., Bangalore"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="district-state">State</Label>
                            <Input 
                              id="district-state" 
                              value={districtForm.state} 
                              onChange={e => setDistrictForm({...districtForm, state: e.target.value})}
                              placeholder="e.g., Karnataka"
                              required
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="district-active"
                              checked={districtForm.isActive}
                              onCheckedChange={(checked) => setDistrictForm({...districtForm, isActive: checked})}
                            />
                            <Label htmlFor="district-active">Active</Label>
                          </div>
                        </div>
                        
                        <DialogFooter className="mt-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              setShowDistrictForm(false);
                              setDistrictForm({ name: "", state: "", isActive: true });
                              setEditingDistrict(null);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={createDistrictMutation.isPending || updateDistrictMutation.isPending}
                          >
                            {(createDistrictMutation.isPending || updateDistrictMutation.isPending) ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                {editingDistrict ? "Updating..." : "Creating..."}
                              </>
                            ) : (
                              <>{editingDistrict ? "Update District" : "Create District"}</>
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ZBNF Crops Management Tab */}
          <TabsContent value="zbnf-crops">
            <CropManagement />
          </TabsContent>

          {/* Customer Subscription Plans Tab */}
          <TabsContent value="ai-plans">
            <AdminSubscriptionPlans />
          </TabsContent>

          {/* Legacy AI Subscription Plans Tab (hidden, kept for reference) */}
          <TabsContent value="legacy-ai-plans-hidden">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        AI Subscription Plans
                      </CardTitle>
                      <CardDescription>
                        Manage AI subscription plans for farmers
                      </CardDescription>
                    </div>
                    <Dialog open={showAiPlanForm} onOpenChange={setShowAiPlanForm}>
                      <DialogTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Plan
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>
                            {editingAiPlan ? "Edit AI Plan" : "Create AI Plan"}
                          </DialogTitle>
                          <DialogDescription>
                            {editingAiPlan ? "Update the AI subscription plan details." : "Add a new AI subscription plan for farmers."}
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmitAiPlan} className="space-y-4">
                          <div>
                            <Label htmlFor="name">Plan Name</Label>
                            <Input
                              id="name"
                              value={aiPlanForm.name}
                              onChange={(e) => setAiPlanForm({ ...aiPlanForm, name: e.target.value })}
                              placeholder="e.g., Monthly AI Basic"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Input
                              id="description"
                              value={aiPlanForm.description}
                              onChange={(e) => setAiPlanForm({ ...aiPlanForm, description: e.target.value })}
                              placeholder="e.g., AI-powered crop recommendations"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="price">Price (₹)</Label>
                            <Input
                              id="price"
                              type="number"
                              min="0"
                              step="0.01"
                              value={aiPlanForm.price}
                              onChange={(e) => setAiPlanForm({ ...aiPlanForm, price: e.target.value })}
                              placeholder="e.g., 299.00"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="durationType">Duration Type</Label>
                            <Select 
                              value={aiPlanForm.durationType} 
                              onValueChange={(value: "monthly" | "yearly" | "6months") => 
                                setAiPlanForm({ ...aiPlanForm, durationType: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="6months">6 Months</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="duration">Duration (Days)</Label>
                            <Input
                              id="duration"
                              type="number"
                              min="1"
                              value={aiPlanForm.duration}
                              onChange={(e) => setAiPlanForm({ ...aiPlanForm, duration: parseInt(e.target.value) || 30 })}
                              placeholder="e.g., 30"
                              required
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={aiPlanForm.isActive}
                              onCheckedChange={(checked) => setAiPlanForm({ ...aiPlanForm, isActive: checked })}
                            />
                            <Label>Active Plan</Label>
                          </div>
                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setShowAiPlanForm(false);
                                setEditingAiPlan(null);
                                resetAiPlanForm();
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              disabled={createAiPlanMutation.isPending || updateAiPlanMutation.isPending}
                            >
                              {(createAiPlanMutation.isPending || updateAiPlanMutation.isPending) ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  {editingAiPlan ? "Updating..." : "Creating..."}
                                </>
                              ) : (
                                <>{editingAiPlan ? "Update Plan" : "Create Plan"}</>
                              )}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {aiPlansLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : aiPlansError ? (
                    <div className="text-center py-8 text-red-500">
                      Error loading AI plans. Please try again.
                    </div>
                  ) : aiPlans.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No AI subscription plans found. Create your first plan to get started.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {aiPlans.map((plan: AiSubscriptionPlan) => (
                            <TableRow key={plan.id}>
                              <TableCell className="font-medium">{plan.name}</TableCell>
                              <TableCell>{plan.description}</TableCell>
                              <TableCell>{formatIndianCurrency(parseFloat(plan.price))}</TableCell>
                              <TableCell>{getDurationLabel(plan.duration, plan.durationType)}</TableCell>
                              <TableCell>
                                <Badge variant={plan.isActive ? "default" : "secondary"}>
                                  {plan.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatDate(plan.createdAt)}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditAiPlan(plan)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => deleteAiPlanMutation.mutate(plan.id)}
                                    disabled={deleteAiPlanMutation.isPending}
                                  >
                                    {deleteAiPlanMutation.isPending ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Farm Events Tab */}
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Farm Events Management
                </CardTitle>
                <CardDescription>
                  Review and approve farmer-submitted events (Mango Picking, Farm Tours, Natural Farming Training, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminEventsTab />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Event Types Management Tab */}
          <TabsContent value="event-types">
            <EventTypesManagement />
          </TabsContent>

          {/* Payment Vendors (Cashfree Easy Split) */}
          <TabsContent value="vendors">
            <VendorsManagement />
          </TabsContent>

          {/* Returns & Refunds */}
          <TabsContent value="returns">
            {user?.role === 'district_manager' ? (
              <FpoReturnRequestsPanel />
            ) : user?.role === 'admin' ? (
              <AdminReturnRequestsPanel />
            ) : null}
          </TabsContent>

          {/* Marketing Tools — Video Generator + Poster Creator — DM only */}
          <TabsContent value="marketing-video">
            <Tabs defaultValue="video" className="w-full">
              <TabsList className="mb-6 bg-orange-50 border border-orange-200 h-11">
                <TabsTrigger value="video" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  <Film className="h-4 w-4" />
                  Video Generator
                </TabsTrigger>
                <TabsTrigger value="poster" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  <span>🖼️</span>
                  Poster Creator
                </TabsTrigger>
              </TabsList>
              <TabsContent value="video">
                <MarketingVideoPanel />
              </TabsContent>
              <TabsContent value="poster">
                <MarketingPosterPanel />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Marketing Tools (PDF Catalog + WhatsApp Broadcast) — DM only */}
          <TabsContent value="marketing-tools">
            <MarketingToolsPanel />
          </TabsContent>

          {/* FPO Brand Storefront Requests */}
          <TabsContent value="fpo-inquiries">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-green-600" />
                    FPO Brand Storefront Requests
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Leads from FPOs and farmer organisations interested in creating their own brand storefront on FarmerSanthe.
                  </p>
                </div>
                <div className="text-sm text-gray-500 bg-gray-100 rounded-lg px-3 py-2">
                  {fpoInquiriesLoading ? "Loading..." : `${fpoInquiriesList.length} request${fpoInquiriesList.length !== 1 ? "s" : ""}`}
                </div>
              </div>

              {fpoInquiriesLoading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                </div>
              ) : fpoInquiriesList.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No storefront requests yet</p>
                  <p className="text-gray-400 text-sm mt-1">Requests submitted via the homepage form will appear here.</p>
                </div>
              ) : (
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-green-50">
                        <TableHead className="font-semibold text-green-800">#</TableHead>
                        <TableHead className="font-semibold text-green-800">Organisation</TableHead>
                        <TableHead className="font-semibold text-green-800">Contact Person</TableHead>
                        <TableHead className="font-semibold text-green-800">Email</TableHead>
                        <TableHead className="font-semibold text-green-800">Phone</TableHead>
                        <TableHead className="font-semibold text-green-800">District</TableHead>
                        <TableHead className="font-semibold text-green-800">Message</TableHead>
                        <TableHead className="font-semibold text-green-800">Date</TableHead>
                        <TableHead className="font-semibold text-green-800">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fpoInquiriesList.map((inq: any, idx: number) => (
                        <TableRow key={inq.id} className="hover:bg-green-50/30">
                          <TableCell className="text-gray-500 text-sm">{idx + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <Building2 className="h-4 w-4 text-green-600" />
                              </div>
                              <span className="font-semibold text-gray-900">{inq.orgName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-gray-700">
                              <User className="h-3 w-3 text-gray-400" />
                              {inq.contactName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <a href={`mailto:${inq.email}`} className="flex items-center gap-1 text-green-600 hover:underline">
                              <Mail className="h-3 w-3" />
                              {inq.email}
                            </a>
                          </TableCell>
                          <TableCell>
                            <a href={`tel:${inq.phone}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                              <Phone className="h-3 w-3" />
                              {inq.phone}
                            </a>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-gray-700">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              {inq.district}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <p className="text-gray-600 text-sm truncate" title={inq.message || ""}>
                              {inq.message || <span className="text-gray-400 italic">No message</span>}
                            </p>
                          </TableCell>
                          <TableCell className="text-gray-500 text-sm whitespace-nowrap">
                            {new Date(inq.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit", month: "short", year: "numeric"
                            })}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              inq.status === "new"
                                ? "bg-blue-100 text-blue-700"
                                : inq.status === "contacted"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}>
                              {inq.status === "new" ? "New" : inq.status === "contacted" ? "Contacted" : "Onboarded"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Official Buyers */}
          {user?.role === "admin" && (
            <TabsContent value="official-buyers">
              <div className="container mx-auto py-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Official Buyers</CardTitle>
                      <CardDescription>Manage buyers showcased on the Official Buyers page (hotels, traders, retailers, etc.)</CardDescription>
                    </div>
                    <Button onClick={() => { setBuyerForm({ name: "", type: "other", logoUrl: "" }); setEditingBuyer(null); setShowBuyerForm(true); }} className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Buyer
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {officialBuyersLoading ? (
                      <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
                    ) : officialBuyersList.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Logo</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Added</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {officialBuyersList.map((buyer) => (
                            <TableRow key={buyer.id}>
                              <TableCell>
                                {buyer.logoUrl ? (
                                  <img src={buyer.logoUrl} alt={buyer.name} className="h-10 w-10 object-contain rounded border bg-gray-50 p-0.5" />
                                ) : (
                                  <div className="h-10 w-10 rounded border bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No logo</div>
                                )}
                              </TableCell>
                              <TableCell className="font-medium">{buyer.name}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">{buyer.type}</Badge>
                              </TableCell>
                              <TableCell>{formatDate(buyer.createdAt)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="icon" onClick={() => { setEditingBuyer(buyer); setBuyerForm({ name: buyer.name, type: buyer.type, logoUrl: buyer.logoUrl || "" }); setShowBuyerForm(true); }}>
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button variant="destructive" size="icon" onClick={() => { if (window.confirm(`Remove "${buyer.name}" from official buyers?`)) deleteBuyerMutation.mutate(buyer.id); }}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-muted-foreground mb-3">No official buyers added yet.</p>
                        <Button variant="outline" onClick={() => { setBuyerForm({ name: "", type: "other", logoUrl: "" }); setEditingBuyer(null); setShowBuyerForm(true); }}>
                          <Plus className="h-4 w-4 mr-2" /> Add First Buyer
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Add / Edit dialog */}
              <Dialog open={showBuyerForm} onOpenChange={setShowBuyerForm}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingBuyer ? "Edit Buyer" : "Add Official Buyer"}</DialogTitle>
                    <DialogDescription>Enter the buyer's name, type, and logo (paste a URL or upload an image).</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div>
                      <Label htmlFor="buyer-name">Name *</Label>
                      <Input id="buyer-name" placeholder="e.g. The Leela Palace" value={buyerForm.name} onChange={(e) => setBuyerForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div>
                      <Label htmlFor="buyer-type">Buyer Type *</Label>
                      <select
                        id="buyer-type"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={buyerForm.type}
                        onChange={(e) => setBuyerForm(f => ({ ...f, type: e.target.value }))}
                      >
                        <option value="hotel">Luxury Hotel</option>
                        <option value="trader">Trader</option>
                        <option value="retailer">Retailer</option>
                        <option value="corporate">Corporate</option>
                        <option value="caterer">Caterer</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="buyer-logo">Logo</Label>
                      <div className="flex gap-2 mt-1">
                        <Input id="buyer-logo" placeholder="https://example.com/logo.png" value={buyerForm.logoUrl} onChange={(e) => setBuyerForm(f => ({ ...f, logoUrl: e.target.value }))} />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          disabled={buyerLogoUploading}
                          onClick={() => buyerLogoInputRef.current?.click()}
                          title="Upload logo"
                          aria-label="Upload logo"
                        >
                          {buyerLogoUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        </Button>
                        <input
                          ref={buyerLogoInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setBuyerLogoUploading(true);
                            try {
                              const formData = new FormData();
                              formData.append("image", file);
                              const res = await apiRequest("POST", "/api/upload", formData, { isFormData: true });
                              const data = await res.json();
                              setBuyerForm(f => ({ ...f, logoUrl: data.imageUrl }));
                              toast({ title: "Logo uploaded", description: "Logo has been uploaded successfully." });
                            } catch (err) {
                              toast({ title: "Upload failed", description: "Could not upload the logo. Please try again.", variant: "destructive" });
                            } finally {
                              setBuyerLogoUploading(false);
                              if (buyerLogoInputRef.current) buyerLogoInputRef.current.value = "";
                            }
                          }}
                        />
                      </div>
                      {buyerForm.logoUrl && (
                        <img src={buyerForm.logoUrl} alt="preview" className="h-14 mt-2 object-contain border rounded bg-gray-50 p-1" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowBuyerForm(false)}>Cancel</Button>
                    <Button
                      disabled={!buyerForm.name.trim() || createBuyerMutation.isPending || updateBuyerMutation.isPending || buyerLogoUploading}
                      onClick={() => {
                        const payload = { name: buyerForm.name.trim(), type: buyerForm.type, logoUrl: buyerForm.logoUrl.trim() };
                        if (editingBuyer) {
                          updateBuyerMutation.mutate({ id: editingBuyer.id, data: payload });
                        } else {
                          createBuyerMutation.mutate(payload);
                        }
                      }}
                    >
                      {(createBuyerMutation.isPending || updateBuyerMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      {editingBuyer ? "Save Changes" : "Add Buyer"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>
          )}

        </Tabs>
      </div>
      
      {/* Product Sales Modal */}
      <Dialog open={showSalesModal} onOpenChange={setShowSalesModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Sales Details: {selectedProductForSales?.name}
            </DialogTitle>
            <DialogDescription>
              View comprehensive sales data and order history for this product.
            </DialogDescription>
          </DialogHeader>
          
          {salesDataLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : productSalesData ? (
            <div className="space-y-6">
              {/* Sales Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Orders</p>
                        <p className="text-2xl font-bold">{productSalesData.totalOrders || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <PackageOpen className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Units Sold</p>
                        <p className="text-2xl font-bold">{productSalesData.totalQuantitySold || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="h-4 w-4 text-purple-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                        <p className="text-2xl font-bold">{formatIndianCurrency(productSalesData.totalRevenue || 0)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Avg. Order Size</p>
                        <p className="text-2xl font-bold">
                          {productSalesData.totalOrders > 0 
                            ? Math.round(productSalesData.totalQuantitySold / productSalesData.totalOrders)
                            : 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Sales History Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  {productSalesData.salesHistory && productSalesData.salesHistory.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {productSalesData.salesHistory.map((sale: any) => (
                            <TableRow key={`${sale.orderId}-${sale.productId}`}>
                              <TableCell className="font-medium">#{sale.orderId}</TableCell>
                              <TableCell>{sale.customerName}</TableCell>
                              <TableCell>{sale.quantity}</TableCell>
                              <TableCell>{formatIndianCurrency(sale.price)}</TableCell>
                              <TableCell>{formatIndianCurrency(sale.quantity * sale.price)}</TableCell>
                              <TableCell>{formatDate(sale.orderDate)}</TableCell>
                              <TableCell>
                                <OrderStatusBadge status={sale.orderStatus} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No Sales Yet</h3>
                      <p className="text-muted-foreground">This product hasn't been ordered by any customers yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Unable to Load Sales Data</h3>
              <p className="text-muted-foreground">There was an error loading the sales information for this product.</p>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setShowSalesModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Edit Dialog */}
      <Dialog open={showEditProductModal} onOpenChange={setShowEditProductModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to the product before approval. All fields can be edited.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            if (editingProduct) {
              updateProductMutation.mutate({ productId: editingProduct.id, ...productEditForm });
            }
          }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
                <div>
                  <label className="text-sm font-medium">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={productEditForm.name}
                    onChange={(e) => setProductEditForm({...productEditForm, name: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    placeholder="Enter product name"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={productEditForm.description}
                    onChange={(e) => setProductEditForm({...productEditForm, description: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    placeholder="Describe the product"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Category *</label>
                  <select
                    required
                    value={productEditForm.categoryId}
                    onChange={(e) => setProductEditForm({...productEditForm, categoryId: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  >
                    <option value="">Select category</option>
                    {categories?.map((category: any) => (
                      <option key={category.id} value={category.id.toString()}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pricing & Inventory</h3>
                
                <div>
                  <label className="text-sm font-medium">Price per Box (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={productEditForm.price}
                    onChange={(e) => setProductEditForm({...productEditForm, price: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    placeholder="0.00"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Units per Box *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={productEditForm.unitsPerBox}
                      onChange={(e) => setProductEditForm({...productEditForm, unitsPerBox: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Unit *</label>
                    <select
                      required
                      value={productEditForm.unit}
                      onChange={(e) => setProductEditForm({...productEditForm, unit: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                    >
                      <option value="">Select unit</option>
                      <option value="kg">Kilograms</option>
                      <option value="g">Grams</option>
                      <option value="pieces">Pieces</option>
                      <option value="bundles">Bundles</option>
                      <option value="liters">Liters</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Available Boxes *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productEditForm.inventory}
                    onChange={(e) => setProductEditForm({...productEditForm, inventory: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Timing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Timeline</h3>
                
                <div>
                  <label className="text-sm font-medium">Harvest Date *</label>
                  <input
                    type="date"
                    required
                    value={productEditForm.harvestDate}
                    onChange={(e) => setProductEditForm({...productEditForm, harvestDate: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Available Until *</label>
                  <input
                    type="date"
                    required
                    value={productEditForm.availableUntil}
                    onChange={(e) => setProductEditForm({...productEditForm, availableUntil: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  />
                </div>
              </div>

              {/* Growing Details & Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Growing Details & Status</h3>
                
                <div>
                  <label className="text-sm font-medium">Product Status *</label>
                  <select
                    required
                    value={productEditForm.status}
                    onChange={(e) => setProductEditForm({...productEditForm, status: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  >
                    <option value="">Select status</option>
                    <option value="Available Now">Available Now</option>
                    <option value="Pre-Order">Pre-Order</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Seasonal">Seasonal</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Growing Details</label>
                  <textarea
                    rows={4}
                    value={productEditForm.growingDetails}
                    onChange={(e) => setProductEditForm({...productEditForm, growingDetails: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    placeholder="Optional: farming methods, soil type, certifications..."
                  />
                </div>
              </div>
            </div>


            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditProductModal(false)}
                disabled={updateProductMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateProductMutation.isPending}
              >
                {updateProductMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DM Product Creation Dialog */}
      <Dialog open={showDmProductForm} onOpenChange={setShowDmProductForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PackageOpen className="h-5 w-5" />
              Create Product (Auto-Approved)
            </DialogTitle>
            <DialogDescription>
              Create a new product listing for a farmer in your district. Products created by District Managers are automatically approved.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            
            // Validate required selections
            const farmerId = parseInt(dmProductForm.farmerId);
            if (!dmProductForm.farmerId || isNaN(farmerId) || farmerId <= 0) {
              toast({
                title: "Validation Error",
                description: "Please select a farmer from your district",
                variant: "destructive"
              });
              return;
            }
            
            const categoryId = parseInt(dmProductForm.categoryId);
            if (!dmProductForm.categoryId || isNaN(categoryId) || categoryId <= 0) {
              toast({
                title: "Validation Error",
                description: "Please select a product category",
                variant: "destructive"
              });
              return;
            }
            
            // Validate required text fields
            if (!dmProductForm.name.trim()) {
              toast({
                title: "Validation Error",
                description: "Product name is required",
                variant: "destructive"
              });
              return;
            }
            
            if (!dmProductForm.description.trim()) {
              toast({
                title: "Validation Error",
                description: "Product description is required",
                variant: "destructive"
              });
              return;
            }
            
            // Validate base price is a valid number
            const basePrice = parseFloat(dmProductForm.price);
            if (isNaN(basePrice) || basePrice <= 0) {
              toast({
                title: "Validation Error",
                description: "Please enter a valid base price greater than 0",
                variant: "destructive"
              });
              return;
            }
            
            // Validate inventory
            const inventory = parseInt(dmProductForm.inventory);
            if (!dmProductForm.inventory || isNaN(inventory) || inventory < 0) {
              toast({
                title: "Validation Error",
                description: "Please enter a valid inventory quantity",
                variant: "destructive"
              });
              return;
            }
            
            // Validate dates
            if (!dmProductForm.harvestDate || !dmProductForm.availableUntil) {
              toast({
                title: "Validation Error",
                description: "Both harvest date and availability date are required",
                variant: "destructive"
              });
              return;
            }
            
            // Validate price slabs if any exist
            const validSlabs: Array<{minQuantity: number; maxQuantity: number | null; pricePerUnit: string; slabType: string}> = [];
            
            for (const slab of dmProductSlabs) {
              const minQty = parseInt(slab.minQuantity);
              const maxQty = slab.maxQuantity ? parseInt(slab.maxQuantity) : null;
              const pricePerUnit = parseFloat(slab.pricePerUnit);
              
              // Check if both required fields are filled
              if (!slab.minQuantity && !slab.pricePerUnit) {
                continue; // Skip empty slabs
              }
              
              // Check for incomplete slabs
              if ((slab.minQuantity && !slab.pricePerUnit) || (!slab.minQuantity && slab.pricePerUnit)) {
                toast({
                  title: "Validation Error",
                  description: "All price slabs must have both minimum quantity and price per unit filled in",
                  variant: "destructive"
                });
                return;
              }
              
              // Validate numeric values
              if (isNaN(minQty) || minQty <= 0) {
                toast({
                  title: "Validation Error",
                  description: "Minimum quantity must be a valid number greater than 0",
                  variant: "destructive"
                });
                return;
              }
              
              if (isNaN(pricePerUnit) || pricePerUnit <= 0) {
                toast({
                  title: "Validation Error",
                  description: "Price per unit must be a valid number greater than 0",
                  variant: "destructive"
                });
                return;
              }
              
              // Validate max > min if max is provided
              if (maxQty !== null && (isNaN(maxQty) || maxQty < minQty)) {
                toast({
                  title: "Validation Error",
                  description: "Maximum quantity must be greater than or equal to minimum quantity",
                  variant: "destructive"
                });
                return;
              }
              
              validSlabs.push({
                minQuantity: minQty,
                maxQuantity: maxQty,
                pricePerUnit: pricePerUnit.toString(),
                slabType: slab.slabType
              });
            }
            
            // Parse B2C/B2B quantities safely
            const b2cQuantity = dmProductForm.b2cQuantity ? parseInt(dmProductForm.b2cQuantity) : null;
            const b2bQuantity = dmProductForm.b2bQuantity ? parseInt(dmProductForm.b2bQuantity) : null;
            const b2cMoq = dmProductForm.b2cMoq ? parseInt(dmProductForm.b2cMoq) : 1;
            const b2bMoq = dmProductForm.b2bMoq ? parseInt(dmProductForm.b2bMoq) : 1;
            
            const submitData = {
              name: dmProductForm.name.trim(),
              description: dmProductForm.description.trim(),
              gradeVariety: dmProductForm.gradeVariety.trim() || null,
              unit: dmProductForm.unit,
              harvestDate: dmProductForm.harvestDate,
              availableUntil: dmProductForm.availableUntil,
              growingDetails: dmProductForm.growingDetails.trim() || null,
              imageUrl: dmProductForm.imageUrl.trim() || null,
              farmerId: farmerId,
              categoryId: categoryId,
              price: basePrice.toString(),
              inventory: inventory,
              b2cQuantity: b2cQuantity && !isNaN(b2cQuantity) ? b2cQuantity : null,
              b2bQuantity: b2bQuantity && !isNaN(b2bQuantity) ? b2bQuantity : null,
              b2cMoq: b2cMoq && !isNaN(b2cMoq) && b2cMoq > 0 ? b2cMoq : 1,
              b2bMoq: b2bMoq && !isNaN(b2bMoq) && b2bMoq > 0 ? b2bMoq : 1,
              priceSlabs: validSlabs
            };
            createDmProductMutation.mutate(submitData);
          }} className="space-y-6">

            {/* Basic Information - FPO products are organization-level, no farmer selection needed */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Product Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={dmProductForm.name}
                    onChange={(e) => setDmProductForm({...dmProductForm, name: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    placeholder="e.g., Organic Tomatoes"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Grade/Variety</label>
                  <input
                    type="text"
                    value={dmProductForm.gradeVariety}
                    onChange={(e) => setDmProductForm({...dmProductForm, gradeVariety: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    placeholder="e.g., Premium Grade A"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={dmProductForm.description}
                  onChange={(e) => setDmProductForm({...dmProductForm, description: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="Describe the product quality, farming method, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Category *</label>
                  <select
                    required
                    value={dmProductForm.categoryId}
                    onChange={(e) => setDmProductForm({...dmProductForm, categoryId: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  >
                    <option value="">Select category</option>
                    {categories?.map((category: any) => (
                      <option key={category.id} value={category.id.toString()}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={dmProductForm.price}
                    onChange={(e) => setDmProductForm({...dmProductForm, price: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    placeholder="Base price per unit"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Unit *</label>
                  <select
                    required
                    value={dmProductForm.unit}
                    onChange={(e) => setDmProductForm({...dmProductForm, unit: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="g">Gram (g)</option>
                    <option value="pieces">Pieces</option>
                    <option value="litres">Litres</option>
                    <option value="ml">Millilitre (ml)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* B2C/B2B Allocation */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">B2C/B2B Allocation</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-3">B2C (Retail)</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Quantity for Retail</label>
                      <input
                        type="number"
                        min="0"
                        value={dmProductForm.b2cQuantity}
                        onChange={(e) => setDmProductForm({...dmProductForm, b2cQuantity: e.target.value})}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        placeholder="e.g., 100"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">MOQ for B2C</label>
                      <input
                        type="number"
                        min="1"
                        value={dmProductForm.b2cMoq}
                        onChange={(e) => setDmProductForm({...dmProductForm, b2cMoq: e.target.value})}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        placeholder="Minimum order quantity"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-3">B2B (Wholesale)</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Quantity for Wholesale</label>
                      <input
                        type="number"
                        min="0"
                        value={dmProductForm.b2bQuantity}
                        onChange={(e) => setDmProductForm({...dmProductForm, b2bQuantity: e.target.value})}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        placeholder="e.g., 500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">MOQ for B2B</label>
                      <input
                        type="number"
                        min="1"
                        value={dmProductForm.b2bMoq}
                        onChange={(e) => setDmProductForm({...dmProductForm, b2bMoq: e.target.value})}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        placeholder="Minimum order quantity"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Total Inventory (in {dmProductForm.unit || 'units'}) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={dmProductForm.inventory}
                  onChange={(e) => setDmProductForm({...dmProductForm, inventory: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder={`Total available quantity in ${dmProductForm.unit || 'units'}`}
                />
              </div>
            </div>

            {/* Price Slabs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-lg font-semibold">Price Slabs (Optional)</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDmProductSlabs([...dmProductSlabs, {minQuantity: "", maxQuantity: "", pricePerUnit: "", slabType: "b2c"}])}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Slab
                </Button>
              </div>
              
              {dmProductSlabs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No price slabs configured. Add slabs for quantity-based pricing.</p>
              ) : (
                <div className="space-y-3">
                  {dmProductSlabs.map((slab, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 grid grid-cols-4 gap-2">
                        <input
                          type="number"
                          min="1"
                          required
                          placeholder="Min Qty *"
                          value={slab.minQuantity}
                          onChange={(e) => {
                            const updated = [...dmProductSlabs];
                            updated[index].minQuantity = e.target.value;
                            setDmProductSlabs(updated);
                          }}
                          className={`px-2 py-1 border rounded text-sm ${!slab.minQuantity && slab.pricePerUnit ? 'border-red-500' : ''}`}
                        />
                        <input
                          type="number"
                          placeholder="Max Qty (optional)"
                          value={slab.maxQuantity}
                          onChange={(e) => {
                            const updated = [...dmProductSlabs];
                            updated[index].maxQuantity = e.target.value;
                            setDmProductSlabs(updated);
                          }}
                          className="px-2 py-1 border rounded text-sm"
                        />
                        <input
                          type="number"
                          step="0.01"
                          required
                          placeholder="Price/unit *"
                          value={slab.pricePerUnit}
                          onChange={(e) => {
                            const updated = [...dmProductSlabs];
                            updated[index].pricePerUnit = e.target.value;
                            setDmProductSlabs(updated);
                          }}
                          className={`px-2 py-1 border rounded text-sm ${!slab.pricePerUnit && slab.minQuantity ? 'border-red-500' : ''}`}
                        />
                        <select
                          value={slab.slabType}
                          onChange={(e) => {
                            const updated = [...dmProductSlabs];
                            updated[index].slabType = e.target.value;
                            setDmProductSlabs(updated);
                          }}
                          className="px-2 py-1 border rounded text-sm"
                        >
                          <option value="b2c">B2C</option>
                          <option value="b2b">B2B</option>
                        </select>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updated = dmProductSlabs.filter((_, i) => i !== index);
                          setDmProductSlabs(updated);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Availability Dates */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Availability</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Harvest Date *</label>
                  <input
                    type="date"
                    required
                    value={dmProductForm.harvestDate}
                    onChange={(e) => setDmProductForm({...dmProductForm, harvestDate: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Available Until *</label>
                  <input
                    type="date"
                    required
                    value={dmProductForm.availableUntil}
                    onChange={(e) => setDmProductForm({...dmProductForm, availableUntil: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDmProductForm(false)}
                disabled={createDmProductMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={createDmProductMutation.isPending}
              >
                {createDmProductMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Create Product
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Farmer Edit Dialog */}
      <Dialog open={showFarmerForm} onOpenChange={setShowFarmerForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFarmer ? "Edit Farmer Profile" : "Add New Farmer"}
            </DialogTitle>
            <DialogDescription>
              Update farmer information and profile details.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleFarmerSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Farm Name *</label>
                <input
                  type="text"
                  required
                  value={farmerForm.farmName}
                  onChange={(e) => setFarmerForm({...farmerForm, farmName: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="Enter farm name"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Location (District) *</label>
                <Select
                  value={farmerForm.location}
                  onValueChange={(value) => setFarmerForm({...farmerForm, location: value})}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts && districts.filter(d => d.isActive).map((district) => (
                      <SelectItem key={district.id} value={district.name}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-amber-600 mt-1">
                  Only admin can change farmer's district
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Phone</label>
                <input
                  type="tel"
                  value={farmerForm.phone}
                  onChange={(e) => setFarmerForm({...farmerForm, phone: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="Phone number"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={farmerForm.email}
                  onChange={(e) => setFarmerForm({...farmerForm, email: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                rows={3}
                value={farmerForm.description}
                onChange={(e) => setFarmerForm({...farmerForm, description: e.target.value})}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="Brief description of the farm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Full Address</label>
              <textarea
                rows={2}
                value={farmerForm.address}
                onChange={(e) => setFarmerForm({...farmerForm, address: e.target.value})}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="Complete address"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Website</label>
              <input
                type="url"
                value={farmerForm.website}
                onChange={(e) => setFarmerForm({...farmerForm, website: e.target.value})}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="https://website.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Farm Story</label>
              <textarea
                rows={4}
                value={farmerForm.story}
                onChange={(e) => setFarmerForm({...farmerForm, story: e.target.value})}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="Tell the story of your farm, your journey, and what makes your products special"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Farming Practices</label>
              <textarea
                rows={3}
                value={farmerForm.practices}
                onChange={(e) => setFarmerForm({...farmerForm, practices: e.target.value})}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="Describe your farming methods, organic practices, sustainability efforts"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Farm Tags</label>
              <input
                type="text"
                value={Array.isArray(farmerForm.tags) ? farmerForm.tags.join(", ") : farmerForm.tags || ""}
                onChange={(e) => setFarmerForm({...farmerForm, tags: e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0)})}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="e.g., organic, sustainable, traditional, modern, greenhouse, dairy, etc. (comma-separated)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter tags separated by commas to categorize the farm's specialties and practices
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFarmerForm(false)}
                disabled={updateFarmerMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateFarmerMutation.isPending}
              >
                {updateFarmerMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Marketing Video Panel ────────────────────────────────────────────────────
function MarketingVideoPanel() {
  const { toast: toastFn } = useToast();
  const [videoMode, setVideoMode] = useState<'product' | 'event'>('product');
  // Step 1: pick ONE farmer; Step 2: pick their products
  const [selectedFarmerId, setSelectedFarmerId] = useState<number | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [voice, setVoice] = useState('en-female');
  const [contentStyle, setContentStyle] = useState('warm');
  const [highlights, setHighlights] = useState<string[]>([]);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [downloadFilename, setDownloadFilename] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: mvData, isLoading: mvLoading } = useQuery<{
    fpo: {
      orgName: string; orgLogoUrl?: string; orgPhone?: string; district?: string;
      orgSlug?: string | null; storeUrl?: string | null; qrCodeUrl?: string | null;
    };
    farmers: Array<{ id: number; farmName: string; imageUrl?: string; logoUrl?: string; location?: string; tags?: any }>;
    products: Array<{
      id: number; name: string; imageUrl?: string; price: string; unit: string;
      harvestDate?: string | null; availableUntil?: string | null;
      isQuoteMode?: boolean; b2bQuantity?: number | null; b2cQuantity?: number | null;
      farmerId?: number | null;
    }>;
    events: Array<{
      id: number; title: string; eventType: string; location: string; address: string;
      startTime: string; endTime: string; pricePerSeat: string; coverImage?: string | null;
      description: string; nextDate?: string | null;
    }>;
  }>({ queryKey: ['/api/dm/marketing-video/data'] });

  const voiceGroups = [
    {
      lang: 'English',
      options: [
        { value: 'en-female',            label: 'Female — Neerja',             gender: 'F' },
        { value: 'en-female-expressive', label: 'Female Expressive — Neerja',  gender: 'F' },
        { value: 'en-male',              label: 'Male — Prabhat',              gender: 'M' },
      ],
    },
    {
      lang: 'Hindi',
      options: [
        { value: 'hi-female', label: 'Female — Swara',  gender: 'F' },
        { value: 'hi-male',   label: 'Male — Madhur',   gender: 'M' },
      ],
    },
    {
      lang: 'Kannada',
      options: [
        { value: 'kn-female', label: 'Female — Sapna',  gender: 'F' },
        { value: 'kn-male',   label: 'Male — Gagan',    gender: 'M' },
      ],
    },
    {
      lang: 'Telugu',
      options: [
        { value: 'te-female', label: 'Female — Shruti', gender: 'F' },
        { value: 'te-male',   label: 'Male — Mohan',    gender: 'M' },
      ],
    },
    {
      lang: 'Tamil',
      options: [
        { value: 'ta-female', label: 'Female — Pallavi', gender: 'F' },
        { value: 'ta-male',   label: 'Male — Valluvar',  gender: 'M' },
      ],
    },
  ];

  const farmers = mvData?.farmers || [];
  const allProducts = mvData?.products || [];
  const allEvents = mvData?.events || [];
  const fpo = mvData?.fpo;

  // Products belonging to the selected farmer
  const selectedFarmer = farmers.find(f => f.id === selectedFarmerId) || null;
  const farmerProducts = selectedFarmerId != null
    ? allProducts.filter(p => p.farmerId === selectedFarmerId)
    : [];
  // FPO-level products (no farmer link) — always available as optional add-ons
  const fpoProducts = allProducts.filter(p => p.farmerId == null);

  // When farmer selection changes, auto-select all their products
  function selectFarmer(farmerId: number) {
    if (selectedFarmerId === farmerId) return; // already selected
    setSelectedFarmerId(farmerId);
    const theirProductIds = allProducts
      .filter(p => p.farmerId === farmerId)
      .map(p => p.id);
    setSelectedProductIds(theirProductIds);
  }

  function toggleProduct(id: number) {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  function stopPoll() {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }

  async function handleGenerate() {
    if (videoMode === 'product' && !selectedFarmerId) {
      toastFn({ title: 'Pick a farmer first', description: 'Select a farmer to build the video around.', variant: 'destructive' });
      return;
    }
    if (videoMode === 'event' && !selectedEventId) {
      toastFn({ title: 'Pick an event first', description: 'Select a farm event to build the promo video around.', variant: 'destructive' });
      return;
    }
    setJobStatus('running');
    setErrorMsg(null);
    setDownloadFilename(null);
    setProgressMsg('');
    try {
      const body: Record<string, any> = { voice, aspectRatio, contentStyle, highlights, videoMode };
      if (videoMode === 'product') {
        body.farmerIds = selectedFarmerId ? [selectedFarmerId] : [];
        body.productIds = selectedProductIds;
      } else {
        body.eventId = selectedEventId;
      }
      const res = await apiRequest('POST', '/api/dm/marketing-video/render', body);
      const data = await res.json();
      if (!data.jobId) throw new Error('No job ID returned');
      setJobId(data.jobId);

      let consecutiveFailures = 0;
      pollRef.current = setInterval(async () => {
        try {
          const sr = await apiRequest('GET', `/api/dm/marketing-video/status/${data.jobId}`);
          if (!sr.ok) {
            consecutiveFailures++;
            if (consecutiveFailures >= 3 || sr.status === 403 || sr.status === 404) {
              stopPoll();
              setJobStatus('error');
              setErrorMsg(sr.status === 403 ? 'Access denied to video job' : 'Job not found — the server may have restarted. Please try again.');
              toastFn({ title: 'Video generation failed', variant: 'destructive' });
            }
            return;
          }
          consecutiveFailures = 0;
          const st = await sr.json();
          if (st.progress) setProgressMsg(st.progress);
          if (st.status === 'done') {
            stopPoll();
            setJobStatus('done');
            setDownloadFilename(st.filename);
            toastFn({ title: 'Video ready!', description: 'Your marketing video has been generated.' });
          } else if (st.status === 'error') {
            stopPoll();
            setJobStatus('error');
            setErrorMsg(st.error || 'Generation failed');
            toastFn({ title: 'Video generation failed', variant: 'destructive' });
          }
        } catch {
          consecutiveFailures++;
          if (consecutiveFailures >= 5) {
            stopPoll();
            setJobStatus('error');
            setErrorMsg('Lost connection to server. Please try again.');
            toastFn({ title: 'Connection lost', variant: 'destructive' });
          }
        }
      }, 4000);
    } catch (err: any) {
      setJobStatus('error');
      setErrorMsg(err.message || 'Failed to start video generation');
      toastFn({ title: 'Failed to start', variant: 'destructive' });
    }
  }

  async function handleDownload() {
    if (!downloadFilename) return;
    try {
      let token: string | null = null;
      try {
        const raw = localStorage.getItem('harvest_direct_auth');
        if (raw) token = JSON.parse(raw)?.token ?? null;
      } catch { /* ignore */ }

      const res = await fetch(`/api/dm/marketing-video/download/${downloadFilename}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`Download failed: ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFilename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      setTimeout(() => {
        setJobStatus('idle'); setJobId(null); setDownloadFilename(null);
      }, 1500);
    } catch (err: any) {
      toastFn({ title: 'Download failed', description: err.message, variant: 'destructive' });
    }
  }

  useEffect(() => () => stopPoll(), []);

  // Shared product card renderer
  function ProductCard({ p }: { p: typeof allProducts[0] }) {
    const selected = selectedProductIds.includes(p.id);
    const isB2B = p.isQuoteMode || (p.b2bQuantity != null && p.b2bQuantity > 0);
    const isB2C = !p.isQuoteMode && (p.b2cQuantity == null || p.b2cQuantity > 0);
    const listingBadge = isB2B && isB2C ? 'Both' : isB2B ? 'B2B' : 'B2C';
    const badgeColor = isB2B && isB2C
      ? 'bg-purple-100 text-purple-700'
      : isB2B ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700';
    const fmtDate = (d?: string | null) => {
      if (!d) return null;
      try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); }
      catch { return null; }
    };
    const harvest = fmtDate(p.harvestDate);
    const until = fmtDate(p.availableUntil);
    const now = new Date();
    const isPreOrder = p.harvestDate ? new Date(p.harvestDate) > now : false;
    return (
      <button
        type="button"
        onClick={() => toggleProduct(p.id)}
        className={`flex gap-3 p-2.5 rounded-lg border text-left transition-all w-full ${
          selected
            ? 'border-orange-500 bg-orange-50 shadow-sm ring-1 ring-orange-300'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <div className="relative shrink-0">
          {p.imageUrl ? (
            <img src={p.imageUrl} alt={p.name} className="h-14 w-14 rounded-lg object-cover border border-gray-100 shadow-sm" />
          ) : (
            <div className="h-14 w-14 rounded-lg bg-orange-100 flex items-center justify-center text-2xl shadow-sm">🌽</div>
          )}
          {selected && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full p-0.5 shadow">
              <CheckCircle className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-start gap-1.5">
            <p className="text-sm font-semibold truncate text-gray-800 flex-1">{p.name}</p>
            <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${badgeColor}`}>{listingBadge}</span>
          </div>
          <p className="text-xs font-medium text-gray-700">₹{Number(p.price).toFixed(0)} / {p.unit}</p>
          <div className="flex items-center gap-2 flex-wrap">
            {isPreOrder ? (
              <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">Pre-Order</span>
            ) : (
              <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">Available Now</span>
            )}
            {(harvest || until) && (
              <div className="flex items-center gap-1 text-[10px] text-gray-500">
                {harvest && <span>🌾 {harvest}</span>}
                {harvest && until && <span>→</span>}
                {until && <span>📅 {until}</span>}
              </div>
            )}
          </div>
        </div>
      </button>
    );
  }

  const totalSlides = 2 + (selectedFarmerId ? 1 : 0) + selectedProductIds.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow">
          <Film className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Marketing Video Generator</h2>
          <p className="text-sm text-gray-500">
            {videoMode === 'product'
              ? 'Pick a farmer, choose their products, and create a focused short video'
              : 'Select a farm event and create a promotional video to attract bookings'}
          </p>
        </div>
      </div>

      {mvLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      ) : (<>
        {/* ── Video Mode Toggle ── */}
        <div className="flex gap-2">
          {([
            { mode: 'product' as const, label: 'Product Video', emoji: '🌽', desc: 'Farmer & produce spotlight' },
            { mode: 'event' as const,   label: 'Event Promo',   emoji: '🎪', desc: 'Farm event promotion' },
          ]).map(tab => (
            <button
              key={tab.mode}
              type="button"
              onClick={() => { setVideoMode(tab.mode); setSelectedEventId(null); }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 font-medium text-sm transition-all ${
                videoMode === tab.mode
                  ? tab.mode === 'product'
                    ? 'border-orange-400 bg-orange-50 text-orange-800 shadow-sm'
                    : 'border-purple-500 bg-purple-50 text-purple-800 shadow-sm'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{tab.emoji}</span>
              <div className="text-left">
                <p className="leading-tight">{tab.label}</p>
                <p className="text-[10px] font-normal opacity-70">{tab.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Farmer/Product picker (product mode) or Event picker (event mode) */}
          <div className="lg:col-span-2 space-y-5">

            {/* ── EVENT MODE: Pick an Event ── */}
            {videoMode === 'event' && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-purple-600 text-white text-xs font-bold">1</span>
                    <span className="text-lg">🎪</span>
                    Pick a Farm Event
                    {selectedEventId && (
                      <Badge className="bg-purple-100 text-purple-700 border-purple-200 ml-auto">
                        {allEvents.find(e => e.id === selectedEventId)?.title || 'Selected'}
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">The promo video will be built around the selected event.</p>
                </CardHeader>
                <CardContent>
                  {allEvents.length === 0 ? (
                    <p className="text-sm text-gray-400 py-4 text-center">No approved events found. Create and get events approved first.</p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                      {allEvents.map(ev => {
                        const isSelected = selectedEventId === ev.id;
                        const evTypeCap = ev.eventType.charAt(0).toUpperCase() + ev.eventType.slice(1).replace(/_/g, ' ');
                        const dateStr = ev.nextDate
                          ? new Date(ev.nextDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : null;
                        return (
                          <button
                            key={ev.id}
                            type="button"
                            onClick={() => setSelectedEventId(isSelected ? null : ev.id)}
                            className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left w-full transition-all ${
                              isSelected
                                ? 'border-purple-500 bg-purple-50 shadow-md ring-1 ring-purple-300'
                                : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/40'
                            }`}
                          >
                            {ev.coverImage ? (
                              <img
                                src={ev.coverImage}
                                alt={ev.title}
                                className="h-16 w-20 rounded-lg object-cover border border-gray-100 shrink-0"
                              />
                            ) : (
                              <div className="h-16 w-20 rounded-lg bg-purple-100 flex items-center justify-center text-3xl shrink-0">🎪</div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start gap-1.5">
                                <p className={`text-sm font-bold flex-1 truncate ${isSelected ? 'text-purple-800' : 'text-gray-800'}`}>{ev.title}</p>
                                {isSelected && <CheckCircle className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />}
                              </div>
                              <p className="text-xs text-gray-500 truncate mt-0.5">{ev.location}</p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">{evTypeCap}</span>
                                {dateStr && <span className="text-[10px] text-gray-500">📅 {dateStr}</span>}
                                <span className="text-[10px] font-medium text-emerald-700">₹{Number(ev.pricePerSeat).toFixed(0)}/seat</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* ── PRODUCT MODE: Step 1 — Pick a Farmer ── */}
            {videoMode === 'product' && <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-purple-600 text-white text-xs font-bold">1</span>
                  <Users className="h-4 w-4 text-green-600" />
                  Pick a Farmer
                  {selectedFarmer && (
                    <Badge className="bg-green-100 text-green-700 border-green-200 ml-auto">{selectedFarmer.farmName}</Badge>
                  )}
                </CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">The video will spotlight this farmer and their products.</p>
              </CardHeader>
              <CardContent>
                {farmers.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4 text-center">No linked farmers. Link farmers first via the Farmers tab.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                    {farmers.map(f => {
                      const isSelected = selectedFarmerId === f.id;
                      const profilePic = f.imageUrl || f.logoUrl;
                      const productCount = allProducts.filter(p => p.farmerId === f.id).length;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => selectFarmer(f.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                            isSelected
                              ? 'border-purple-500 bg-purple-50 shadow-md ring-1 ring-purple-300'
                              : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/40'
                          }`}
                        >
                          <div className="relative shrink-0">
                            {profilePic ? (
                              <img
                                src={profilePic}
                                alt={f.farmName}
                                className={`h-14 w-14 rounded-full object-cover border-2 shadow ${isSelected ? 'border-purple-400' : 'border-white'}`}
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  target.style.display = 'none';
                                  const next = target.nextElementSibling as HTMLElement | null;
                                  if (next) next.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div
                              className={`h-14 w-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 items-center justify-center text-white font-bold text-lg shadow`}
                              style={{ display: profilePic ? 'none' : 'flex' }}
                            >
                              {f.farmName.charAt(0).toUpperCase()}
                            </div>
                            {isSelected && (
                              <span className="absolute -top-1 -right-1 bg-purple-600 text-white rounded-full p-0.5 shadow">
                                <CheckCircle className="h-4 w-4" />
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm font-bold truncate ${isSelected ? 'text-purple-800' : 'text-gray-800'}`}>{f.farmName}</p>
                            {f.location && <p className="text-xs text-gray-500 truncate">{f.location}</p>}
                            {Array.isArray(f.tags) && f.tags.length > 0 && (
                              <p className="text-xs text-green-600 truncate mt-0.5">{f.tags.slice(0, 2).join(' • ')}</p>
                            )}
                            <p className="text-[10px] text-gray-400 mt-0.5">{productCount} product{productCount !== 1 ? 's' : ''}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>}

            {/* ── PRODUCT MODE: Step 2 — Choose Products ── */}
            {videoMode === 'product' && <Card className={selectedFarmerId == null ? 'opacity-50 pointer-events-none' : ''}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-purple-600 text-white text-xs font-bold">2</span>
                  <Package className="h-4 w-4 text-orange-600" />
                  Choose Products to Feature
                  <Badge variant="secondary" className="ml-auto">{selectedProductIds.length} selected</Badge>
                </CardTitle>
                {selectedFarmer && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Showing {farmerProducts.length} product{farmerProducts.length !== 1 ? 's' : ''} from {selectedFarmer.farmName}.
                    {selectedProductIds.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedProductIds([])}
                        className="ml-2 text-red-500 hover:text-red-700 underline"
                      >
                        Clear all
                      </button>
                    )}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Farmer's products */}
                {selectedFarmerId != null && farmerProducts.length === 0 && (
                  <p className="text-sm text-gray-400 py-3 text-center">This farmer has no approved products yet.</p>
                )}
                {farmerProducts.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                    {farmerProducts.map(p => <ProductCard key={p.id} p={p} />)}
                  </div>
                )}

                {/* FPO-level products as optional add-ons */}
                {fpoProducts.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5" /> FPO Products (optional add-ons)
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                      {fpoProducts.map(p => <ProductCard key={p.id} p={p} />)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>}
          </div>

          {/* Right column: Settings + Generate */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="h-4 w-4 text-gray-600" />
                  Video Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* FPO Info preview */}
                {fpo && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                    {fpo.orgLogoUrl ? (
                      <img src={fpo.orgLogoUrl} alt="FPO Logo" className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Building className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{fpo.orgName || 'Your FPO'}</p>
                      {fpo.district && <p className="text-xs text-gray-500">{fpo.district} District</p>}
                    </div>
                  </div>
                )}

                {/* Store URL + QR Code */}
                {fpo && (fpo.storeUrl || fpo.qrCodeUrl) && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 space-y-2">
                    <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                      <span>🛒</span> Your Store Link
                    </p>
                    {fpo.storeUrl && (
                      <div className="flex items-center gap-2">
                        <code className="text-[10px] bg-white border border-emerald-200 rounded px-2 py-1 text-emerald-700 flex-1 truncate">
                          {fpo.storeUrl}
                        </code>
                        <button
                          type="button"
                          onClick={() => { navigator.clipboard.writeText(fpo.storeUrl!); }}
                          className="shrink-0 text-xs text-emerald-600 hover:text-emerald-800 font-medium"
                          title="Copy URL"
                        >
                          Copy
                        </button>
                      </div>
                    )}
                    {fpo.qrCodeUrl && (
                      <div className="flex items-center gap-3 pt-1">
                        <img
                          src={fpo.qrCodeUrl}
                          alt="Store QR Code"
                          className="h-20 w-20 rounded-lg border border-emerald-200 bg-white object-contain p-1"
                        />
                        <div className="text-xs text-emerald-700 space-y-1">
                          <p className="font-medium">Scan to shop</p>
                          <p className="text-emerald-600">QR appears on the final video slide.</p>
                        </div>
                      </div>
                    )}
                    {!fpo.qrCodeUrl && fpo.storeUrl && (
                      <p className="text-[10px] text-emerald-600">Store URL will appear in the video's final slide.</p>
                    )}
                  </div>
                )}

                {/* Aspect Ratio */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Format</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['9:16', '16:9'] as const).map(ar => (
                      <button
                        key={ar}
                        type="button"
                        onClick={() => setAspectRatio(ar)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-sm font-medium transition-all ${
                          aspectRatio === ar
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {ar === '9:16' ? (
                          <div className="h-7 w-4 border-2 rounded border-current" />
                        ) : (
                          <div className="h-4 w-7 border-2 rounded border-current" />
                        )}
                        <span>{ar === '9:16' ? 'Portrait' : 'Landscape'}</span>
                        <span className="text-xs text-gray-400">{ar === '9:16' ? '720×1280' : '1280×720'}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Voice / Language */}
                <div>
                  <Label className="text-sm font-medium mb-2 flex items-center gap-1.5">
                    <Mic className="h-3.5 w-3.5" /> Narration Voice
                  </Label>
                  <Select value={voice} onValueChange={setVoice}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {voiceGroups.map(group => (
                        <SelectGroup key={group.lang}>
                          <SelectLabel className="text-xs text-gray-500 font-semibold px-2 py-1">{group.lang}</SelectLabel>
                          {group.options.map(v => (
                            <SelectItem key={v.value} value={v.value}>
                              <span className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${v.gender === 'F' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                                  {v.gender === 'F' ? '♀' : '♂'}
                                </span>
                                {v.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-gray-400 mt-1">All voices speak in a warm, friendly tone. "Expressive" adds more emotion.</p>
                </div>

                {/* Content Style */}
                <div>
                  <Label className="text-sm font-medium mb-2 flex items-center gap-1.5">
                    <span className="text-base">🎨</span> Narration Style
                  </Label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { value: 'warm',        label: 'Warm & Story',    emoji: '🤝', desc: 'Heartfelt, farmer-first' },
                      { value: 'modern',      label: 'Modern & Direct', emoji: '⚡', desc: 'Clean, punchy, no fluff' },
                      { value: 'health',      label: 'Health Focus',    emoji: '🥗', desc: 'Natural & chemical-free' },
                      { value: 'festive',     label: 'Festive',         emoji: '🎉', desc: 'Celebratory & seasonal' },
                      { value: 'trust',       label: 'Trust & Heritage',emoji: '🏆', desc: 'Tradition & credibility' },
                      { value: 'promotional', label: 'Promotional',     emoji: '💰', desc: 'Deals & call-to-action' },
                    ].map(s => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setContentStyle(s.value)}
                        className={`flex items-start gap-1.5 p-2 rounded-lg border text-left transition-all ${
                          contentStyle === s.value
                            ? 'border-green-500 bg-green-50 ring-1 ring-green-400'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-lg leading-none mt-0.5">{s.emoji}</span>
                        <div className="min-w-0">
                          <p className={`text-[11px] font-semibold leading-tight ${contentStyle === s.value ? 'text-green-700' : 'text-gray-700'}`}>{s.label}</p>
                          <p className="text-[9px] text-gray-400 leading-tight mt-0.5">{s.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content Highlights — multi-select */}
                <div>
                  <Label className="text-sm font-medium mb-2 flex items-center gap-1.5">
                    <span className="text-base">✨</span> Add Highlights
                    <span className="text-[10px] text-gray-400 font-normal">(pick any)</span>
                  </Label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { value: 'natural',          label: 'Chemical-free',     emoji: '🌿' },
                      { value: 'bulk',             label: 'Bulk deals',         emoji: '📦' },
                      { value: 'festive_greeting', label: 'Festive greeting',   emoji: '🎊' },
                      { value: 'delivery',         label: 'Home delivery',      emoji: '🚚' },
                    ].map(h => {
                      const active = highlights.includes(h.value);
                      return (
                        <button
                          key={h.value}
                          type="button"
                          onClick={() => setHighlights(prev =>
                            prev.includes(h.value) ? prev.filter(v => v !== h.value) : [...prev, h.value]
                          )}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium border transition-all ${
                            active
                              ? 'bg-green-100 border-green-400 text-green-700'
                              : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          <span>{h.emoji}</span> {h.label}
                          {active && <span className="ml-0.5 text-green-600">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Summary */}
                <div className="p-3 rounded-lg bg-gray-50 border text-sm space-y-1">
                  {videoMode === 'event' ? (
                    selectedEventId ? (
                      <>
                        <p className="text-gray-700 font-medium truncate">🎪 {allEvents.find(e => e.id === selectedEventId)?.title}</p>
                        <p className="text-gray-600 text-xs">{allEvents.find(e => e.id === selectedEventId)?.eventType?.replace(/_/g, ' ')}</p>
                        <p className="text-gray-400 text-xs">Event promo video — ~4–6 slides</p>
                      </>
                    ) : (
                      <p className="text-gray-400 text-xs text-center py-1">Select an event to see the video summary</p>
                    )
                  ) : selectedFarmer ? (
                    <>
                      <p className="text-gray-700 font-medium truncate">📽 {selectedFarmer.farmName}</p>
                      <p className="text-gray-600 text-xs">{selectedProductIds.length} product{selectedProductIds.length !== 1 ? 's' : ''} selected</p>
                      <p className="text-gray-400 text-xs">≈ {totalSlides} slides total</p>
                      <p className="text-gray-400 text-xs">Est. ~{Math.max(1, Math.round(totalSlides * 0.75))}–{totalSlides} min</p>
                    </>
                  ) : (
                    <p className="text-gray-400 text-xs text-center py-1">Select a farmer to see the video summary</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Generate / Status / Download */}
            <Card>
              <CardContent className="pt-4 space-y-3">
                {jobStatus === 'idle' && (
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    onClick={handleGenerate}
                    disabled={videoMode === 'product' ? !selectedFarmerId : !selectedEventId}
                  >
                    <Film className="h-4 w-4 mr-2" />
                    {videoMode === 'event' ? 'Generate Event Promo' : 'Generate Video'}
                  </Button>
                )}

                {jobStatus === 'running' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Generating video…</p>
                        <p className="text-xs text-blue-600">
                          {progressMsg || 'Preparing slides & AI narration. This may take a few minutes.'}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" disabled>
                      Please wait…
                    </Button>
                  </div>
                )}

                {jobStatus === 'done' && downloadFilename && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                      <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Video ready!</p>
                        <p className="text-xs text-green-600">Your marketing video has been generated.</p>
                      </div>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download MP4
                    </Button>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => {
                      setJobStatus('idle'); setJobId(null); setDownloadFilename(null); setErrorMsg(null);
                    }}>
                      Make Another Video
                    </Button>
                  </div>
                )}

                {jobStatus === 'error' && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                      <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-800">Generation failed</p>
                        {errorMsg && <p className="text-xs text-red-600 mt-0.5 break-all">{errorMsg}</p>}
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => {
                      setJobStatus('idle'); setJobId(null); setErrorMsg(null);
                    }}>
                      Try Again
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </>)}
    </div>
  );
}

// FPO Delivery Management Component
function FpoDeliveryManagement({ dmUserId }: { dmUserId?: number } = {}) {
  const { toast: toastFn } = useToast();
  const qClient = useQueryClient();

  // When dmUserId is provided (admin view), use admin endpoints; otherwise use FPO's own endpoints
  const isAdminView = !!dmUserId;
  const districtsEndpoint = isAdminView ? `/api/admin/fpo/${dmUserId}/delivery/districts` : "/api/fpo/delivery/districts";
  const pricingEndpoint = isAdminView ? `/api/admin/fpo/${dmUserId}/delivery/pricing` : "/api/fpo/delivery/pricing";
  const pricingDistrictEndpoint = (districtId: number) =>
    isAdminView ? `/api/admin/fpo/${dmUserId}/delivery/pricing/${districtId}` : `/api/fpo/delivery/pricing/${districtId}`;

  interface DeliveryDistrict {
    id: number;
    districtId: number;
    districtName: string;
    districtState: string;
    isActive: boolean;
  }

  interface DeliveryPricingRow {
    id?: number;
    districtId: number;
    districtName: string;
    districtState?: string;
    minWeightKg: string;
    maxWeightKg: string | null;
    priceRs: string;
    sortOrder: number;
  }

  const [selectedPricingDistrictId, setSelectedPricingDistrictId] = useState<number | null>(null);
  const [newTier, setNewTier] = useState({ minWeightKg: "", maxWeightKg: "", priceRs: "" });
  const [editingDistrictId, setEditingDistrictId] = useState<number | null>(null);

  const { data: allDistricts, isLoading: districtsLoading } = useQuery<District[]>({
    queryKey: ["/api/districts"],
  });

  const { data: deliveryDistricts, isLoading: ddLoading } = useQuery<DeliveryDistrict[]>({
    queryKey: [districtsEndpoint],
  });

  const { data: deliveryPricing, isLoading: dpLoading } = useQuery<DeliveryPricingRow[]>({
    queryKey: [pricingEndpoint],
  });

  const selectedDistrictIds = new Set((deliveryDistricts || []).map(d => d.districtId));

  const pricingByDistrict = useMemo(() => {
    const groups: Record<number, DeliveryPricingRow[]> = {};
    (deliveryPricing || []).forEach(row => {
      if (!groups[row.districtId]) groups[row.districtId] = [];
      groups[row.districtId].push(row);
    });
    return groups;
  }, [deliveryPricing]);

  const districtsWithPricing = new Set(Object.keys(pricingByDistrict).map(Number));

  const availableDistrictsForNewPricing = useMemo(() => {
    return (deliveryDistricts || []).filter(d => !districtsWithPricing.has(d.districtId));
  }, [deliveryDistricts, districtsWithPricing]);

  const saveDistrictsMutation = useMutation({
    mutationFn: async (districtIds: number[]) => {
      return apiRequest("PUT", districtsEndpoint, { districtIds });
    },
    onSuccess: () => {
      qClient.invalidateQueries({ queryKey: [districtsEndpoint] });
      toastFn({ title: "Delivery districts updated" });
    },
    onError: () => {
      toastFn({ title: "Failed to update districts", variant: "destructive" });
    },
  });

  const savePricingMutation = useMutation({
    mutationFn: async ({ districtId, tiers }: { districtId: number; tiers: Array<{ minWeightKg: string; maxWeightKg: string | null; priceRs: string }> }) => {
      return apiRequest("PUT", pricingDistrictEndpoint(districtId), { tiers });
    },
    onSuccess: () => {
      qClient.invalidateQueries({ queryKey: [pricingEndpoint] });
      toastFn({ title: "Delivery pricing saved" });
      setSelectedPricingDistrictId(null);
      setEditingDistrictId(null);
      setNewTier({ minWeightKg: "", maxWeightKg: "", priceRs: "" });
    },
    onError: () => {
      toastFn({ title: "Failed to save pricing", variant: "destructive" });
    },
  });

  const deletePricingMutation = useMutation({
    mutationFn: async (districtId: number) => {
      return apiRequest("DELETE", pricingDistrictEndpoint(districtId));
    },
    onSuccess: () => {
      qClient.invalidateQueries({ queryKey: [pricingEndpoint] });
      toastFn({ title: "District pricing removed" });
    },
    onError: () => {
      toastFn({ title: "Failed to remove pricing", variant: "destructive" });
    },
  });

  const toggleDistrict = (districtId: number) => {
    const current = new Set(selectedDistrictIds);
    if (current.has(districtId)) {
      if (districtsWithPricing.has(districtId)) {
        toastFn({ title: "Remove pricing for this district first before unselecting it", variant: "destructive" });
        return;
      }
      current.delete(districtId);
    } else {
      current.add(districtId);
    }
    saveDistrictsMutation.mutate(Array.from(current));
  };

  const [editTiers, setEditTiers] = useState<Array<{ minWeightKg: string; maxWeightKg: string; priceRs: string }>>([]);

  const startEditDistrict = (districtId: number) => {
    const existing = pricingByDistrict[districtId] || [];
    setEditTiers(existing.map(t => ({
      minWeightKg: t.minWeightKg,
      maxWeightKg: t.maxWeightKg || "",
      priceRs: t.priceRs,
    })));
    setEditingDistrictId(districtId);
  };

  const startNewDistrictPricing = (districtId: number) => {
    setSelectedPricingDistrictId(districtId);
    setEditTiers([
      { minWeightKg: "1", maxWeightKg: "50", priceRs: "20" },
      { minWeightKg: "51", maxWeightKg: "500", priceRs: "70" },
      { minWeightKg: "501", maxWeightKg: "", priceRs: "130" },
    ]);
    setEditingDistrictId(null);
  };

  const addTierToEdit = () => {
    if (!newTier.minWeightKg || !newTier.priceRs) {
      toastFn({ title: "Please fill min weight and price", variant: "destructive" });
      return;
    }
    const updated = [...editTiers, { ...newTier }];
    updated.sort((a, b) => parseFloat(a.minWeightKg) - parseFloat(b.minWeightKg));
    setEditTiers(updated);
    setNewTier({ minWeightKg: "", maxWeightKg: "", priceRs: "" });
  };

  const removeTierFromEdit = (index: number) => {
    if (editTiers.length <= 1) return;
    setEditTiers(editTiers.filter((_, i) => i !== index));
  };

  const updateEditTierPrice = (index: number, newPrice: string) => {
    setEditTiers(editTiers.map((t, i) => i === index ? { ...t, priceRs: newPrice } : t));
  };

  const saveCurrentPricing = () => {
    const districtId = editingDistrictId || selectedPricingDistrictId;
    if (!districtId || editTiers.length === 0) return;
    savePricingMutation.mutate({
      districtId,
      tiers: editTiers.map(t => ({
        minWeightKg: t.minWeightKg,
        maxWeightKg: t.maxWeightKg || null,
        priceRs: t.priceRs,
      })),
    });
  };

  const cancelEditing = () => {
    setEditingDistrictId(null);
    setSelectedPricingDistrictId(null);
    setEditTiers([]);
    setNewTier({ minWeightKg: "", maxWeightKg: "", priceRs: "" });
  };

  const getDistrictName = (districtId: number): string => {
    const dd = (deliveryDistricts || []).find(d => d.districtId === districtId);
    if (dd) return dd.districtName;
    const d = (allDistricts || []).find(d => d.id === districtId);
    return d ? d.name : `District #${districtId}`;
  };

  if (districtsLoading || ddLoading || dpLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-3 text-gray-500">Loading delivery settings...</span>
      </div>
    );
  }

  const isEditing = editingDistrictId !== null || selectedPricingDistrictId !== null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Truck className="h-6 w-6 text-green-600" />
          Delivery Management
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Configure delivery districts and set per-district delivery pricing tiers
        </p>
      </div>

      {/* Step 1: Delivery Districts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-blue-600" />
            Step 1: Select Delivery Districts
          </CardTitle>
          <CardDescription>
            Select the districts where you offer delivery service. You can set different pricing for each district.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
            {allDistricts && allDistricts.length > 0 ? (
              allDistricts.map((district) => (
                <div
                  key={district.id}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                    selectedDistrictIds.has(district.id)
                      ? "bg-green-50 border-green-300"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => toggleDistrict(district.id)}
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                    selectedDistrictIds.has(district.id)
                      ? "bg-green-600 border-green-600"
                      : "border-gray-300"
                  }`}>
                    {selectedDistrictIds.has(district.id) && (
                      <Check className="h-2.5 w-2.5 text-white" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="font-medium text-xs block truncate">{district.name}</span>
                    {district.state && (
                      <span className="text-[10px] text-gray-400">{district.state}</span>
                    )}
                  </div>
                  {districtsWithPricing.has(district.id) && (
                    <Badge variant="outline" className="text-[9px] px-1 py-0 ml-auto shrink-0 border-green-400 text-green-600">Priced</Badge>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm py-4 text-center col-span-full">
                No districts available. Ask your admin to add districts first.
              </p>
            )}
          </div>
          {selectedDistrictIds.size > 0 && (
            <div className="mt-3 pt-3 border-t">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {selectedDistrictIds.size} district{selectedDistrictIds.size !== 1 ? "s" : ""} selected
              </Badge>
              {districtsWithPricing.size > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 ml-2">
                  {districtsWithPricing.size} with pricing configured
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 2: Per-District Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5 text-orange-600" />
            Step 2: Set Per-District Delivery Pricing
          </CardTitle>
          <CardDescription>
            Set weight-based delivery charges for each district. Each district can have different pricing tiers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Existing district pricing cards */}
          {Object.keys(pricingByDistrict).length > 0 && (
            <div className="space-y-3 mb-6">
              {Object.entries(pricingByDistrict).map(([distId, tiers]) => {
                const districtId = parseInt(distId);
                const isEditingThis = editingDistrictId === districtId;
                return (
                  <div key={districtId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-sm">{getDistrictName(districtId)}</span>
                        <Badge variant="outline" className="text-xs">{tiers.length} tier{tiers.length !== 1 ? "s" : ""}</Badge>
                      </div>
                      <div className="flex gap-1">
                        {!isEditing && (
                          <>
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => startEditDistrict(districtId)}>
                              <Pencil className="h-3 w-3 mr-1" /> Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-red-500 hover:text-red-700" onClick={() => deletePricingMutation.mutate(districtId)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    {!isEditingThis && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">Weight Range (kg)</TableHead>
                            <TableHead className="text-xs">Price (₹)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tiers.map((tier, index) => (
                            <TableRow key={index}>
                              <TableCell className="text-sm py-1.5">
                                {tier.minWeightKg} - {tier.maxWeightKg ? `${tier.maxWeightKg} kg` : "& Above"}
                              </TableCell>
                              <TableCell className="text-sm py-1.5 font-medium">₹{tier.priceRs}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Add new district pricing - show selector */}
          {!isEditing && availableDistrictsForNewPricing.length > 0 && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">Add Delivery Pricing for a New District</p>
              <div className="flex gap-2 flex-wrap">
                {availableDistrictsForNewPricing.map(d => (
                  <Button
                    key={d.districtId}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => startNewDistrictPricing(d.districtId)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {d.districtName}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {!isEditing && selectedDistrictIds.size === 0 && (
            <p className="text-gray-500 text-sm py-4 text-center">
              Select delivery districts first (Step 1), then configure pricing for each district.
            </p>
          )}

          {!isEditing && selectedDistrictIds.size > 0 && availableDistrictsForNewPricing.length === 0 && Object.keys(pricingByDistrict).length > 0 && (
            <div className="border-t pt-4">
              <p className="text-green-600 text-sm text-center flex items-center justify-center gap-2">
                <Check className="h-4 w-4" />
                All delivery districts have pricing configured
              </p>
            </div>
          )}

          {/* Editing/Creating pricing tiers for a district */}
          {isEditing && (
            <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-sm">
                    {editingDistrictId ? "Editing" : "New"} pricing for: {getDistrictName((editingDistrictId || selectedPricingDistrictId)!)}
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={cancelEditing}>Cancel</Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Weight Range (kg)</TableHead>
                    <TableHead className="text-xs">Price (₹)</TableHead>
                    <TableHead className="text-xs w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editTiers.map((tier, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-sm py-1.5">
                        {tier.minWeightKg} - {tier.maxWeightKg ? `${tier.maxWeightKg} kg` : "& Above"}
                      </TableCell>
                      <TableCell className="py-1.5">
                        <div className="flex items-center gap-1">
                          <span className="text-sm">₹</span>
                          <Input
                            type="number"
                            value={tier.priceRs}
                            onChange={(e) => updateEditTierPrice(index, e.target.value)}
                            className="w-20 h-7 text-sm"
                            min="0"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTierFromEdit(index)}
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          disabled={editTiers.length <= 1}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Add tier row */}
              <div className="mt-3 border-t pt-3">
                <p className="text-xs font-medium mb-2">Add Tier</p>
                <div className="grid grid-cols-4 gap-2 items-end">
                  <div>
                    <Label className="text-[10px]">Min (kg)</Label>
                    <Input type="number" placeholder="501" value={newTier.minWeightKg} onChange={(e) => setNewTier({ ...newTier, minWeightKg: e.target.value })} className="h-8 text-sm" min="0" />
                  </div>
                  <div>
                    <Label className="text-[10px]">Max (kg)</Label>
                    <Input type="number" placeholder="No limit" value={newTier.maxWeightKg} onChange={(e) => setNewTier({ ...newTier, maxWeightKg: e.target.value })} className="h-8 text-sm" min="0" />
                  </div>
                  <div>
                    <Label className="text-[10px]">Price (₹)</Label>
                    <Input type="number" placeholder="130" value={newTier.priceRs} onChange={(e) => setNewTier({ ...newTier, priceRs: e.target.value })} className="h-8 text-sm" min="0" />
                  </div>
                  <Button onClick={addTierToEdit} size="sm" variant="outline" className="h-8">
                    <Plus className="h-3 w-3 mr-1" /> Add
                  </Button>
                </div>
              </div>

              {/* Save/Cancel */}
              <div className="flex gap-2 mt-4 pt-3 border-t">
                <Button onClick={saveCurrentPricing} className="bg-green-600 hover:bg-green-700" size="sm" disabled={savePricingMutation.isPending || editTiers.length === 0}>
                  {savePricingMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                  Save Pricing
                </Button>
                <Button onClick={cancelEditing} variant="outline" size="sm">Cancel</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info box */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">How delivery pricing works</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Each district can have its own set of weight-based delivery pricing tiers</li>
                <li>Customers and farmers in buy mode will only see products deliverable to their district</li>
                <li>For products sold as "pieces", the approximate weight per piece is used for fee calculation</li>
                <li>When creating pricing for a new district, only remaining districts (without pricing) are shown</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Get estimated delivery date based on order status
function getEstimatedDeliveryDate(order: AdminOrder) {
  // For orders already delivered or cancelled, no estimated date
  if (order.status.toLowerCase() === 'delivered' || order.status.toLowerCase() === 'canceled' || order.status.toLowerCase() === 'cancelled') {
    return null;
  }
  
  try {
    // 1. Use the stored column (most accurate — set at order creation time)
    if ((order as any).estimatedDeliveryDate) {
      // Use UTC date to avoid timezone-shift (e.g. IST+5:30 pushing midnight UTC to next day)
      const d = new Date((order as any).estimatedDeliveryDate);
      return format(parseISO(d.toISOString().split('T')[0]), 'dd MMM yyyy');
    }

    // 2. Parse from notes field (covers orders placed before the column was added)
    if (order.notes) {
      const match = order.notes.match(/Delivery Date:\s*(\d{4}-\d{2}-\d{2})/);
      if (match) {
        return format(parseISO(match[1]), 'dd MMM yyyy');
      }
    }

    // 3. Legacy fallback — calculate from current product status (may be stale for pre-orders)
    if (order.items && order.items.length > 0) {
      const deliveryDates = order.items.map(item => {
        if (item.product) {
          if (item.product.status === 'Available Now') {
            const orderDate = typeof order.createdAt === 'string' 
              ? parseISO(order.createdAt)
              : order.createdAt;
            return addDays(orderDate, 1);
          } else if (item.product.status === 'Pre-Order' && item.product.harvestDate) {
            const harvestDate = typeof item.product.harvestDate === 'string'
              ? parseISO(item.product.harvestDate)
              : item.product.harvestDate;
            return addDays(harvestDate, 1);
          }
        }
        return null;
      }).filter(date => date !== null);
      
      if (deliveryDates.length > 0) {
        const latestDate = new Date(Math.max(...deliveryDates.map(date => date ? date.getTime() : 0)));
        return format(latestDate, 'dd MMM yyyy');
      }
    }
    
    return "Estimated soon";
  } catch (error) {
    console.error("Error calculating delivery date:", error);
    return "Unavailable";
  }
}

// Helper components
function StatCard({ title, value, icon, subtitle }: { title: string; value: number | string; icon: React.ReactNode; subtitle?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">Pending</Badge>;
    case "accepted":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">Accepted</Badge>;
    case "growing":
      return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Growing</Badge>;
    case "harvested":
      return <Badge variant="outline" className="bg-orange-50 text-orange-700 hover:bg-orange-50">Harvested</Badge>;
    case "packaging":
      return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50">Packaging</Badge>;
    case "shipping":
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">Shipping</Badge>;
    case "delivered":
      return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">Delivered</Badge>;
    case "canceled":
      return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Canceled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

// Admin Events Tab Component
function AdminEventsTab() {
  const { user } = useAuth();
  const [eventStatusTab, setEventStatusTab] = useState<"pending" | "approved" | "rejected" | "expired">("pending");
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    eventType: "",
    cropType: "",
    location: "",
    address: "",
    startTime: "",
    endTime: "",
    totalSeats: 0,
    pricePerSeat: ""
  });
  
  // Date editing state (single date only)
  const [editEventDate, setEditEventDate] = useState("");
  
  // Use different endpoints based on user role
  const isDM = user?.role === 'district_manager';
  const baseEndpoint = isDM ? "/api/dm/events" : "/api/admin/events";
  
  const { data: pendingEvents, isLoading: pendingLoading, refetch: refetchPending } = useQuery<any[]>({
    queryKey: [baseEndpoint, "pending"],
    queryFn: async () => {
      const response = await apiRequest("GET", `${baseEndpoint}?status=pending`);
      return response.json();
    }
  });
  
  const { data: approvedEvents, isLoading: approvedLoading, refetch: refetchApproved } = useQuery<any[]>({
    queryKey: [baseEndpoint, "approved"],
    queryFn: async () => {
      const response = await apiRequest("GET", `${baseEndpoint}?status=approved`);
      return response.json();
    },
    enabled: eventStatusTab === 'approved'
  });
  
  const { data: rejectedEvents, isLoading: rejectedLoading, refetch: refetchRejected } = useQuery<any[]>({
    queryKey: [baseEndpoint, "rejected"],
    queryFn: async () => {
      const response = await apiRequest("GET", `${baseEndpoint}?status=rejected`);
      return response.json();
    },
    enabled: eventStatusTab === 'rejected'
  });
  
  const { data: expiredEvents, isLoading: expiredLoading, refetch: refetchExpired } = useQuery<any[]>({
    queryKey: [baseEndpoint, "expired"],
    queryFn: async () => {
      const response = await apiRequest("GET", `${baseEndpoint}?status=expired`);
      return response.json();
    },
    enabled: eventStatusTab === 'expired'
  });
  
  const getCurrentEvents = () => {
    switch (eventStatusTab) {
      case 'pending': return pendingEvents || [];
      case 'approved': return approvedEvents || [];
      case 'rejected': return rejectedEvents || [];
      case 'expired': return expiredEvents || [];
      default: return [];
    }
  };
  
  const isLoading = eventStatusTab === 'pending' ? pendingLoading :
    eventStatusTab === 'approved' ? approvedLoading :
    eventStatusTab === 'rejected' ? rejectedLoading : expiredLoading;
  
  const events = getCurrentEvents();
  
  const refetch = () => {
    refetchPending();
    if (eventStatusTab === 'approved') refetchApproved();
    if (eventStatusTab === 'rejected') refetchRejected();
    if (eventStatusTab === 'expired') refetchExpired();
  };
  
  // Edit mutation
  const editMutation = useMutation({
    mutationFn: async ({ eventId, data }: { eventId: number; data: any }) => {
      const response = await apiRequest("PATCH", `/api/events/${eventId}`, data);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate all events-related queries (including status-based)
      queryClient.invalidateQueries({ queryKey: [baseEndpoint] });
      queryClient.invalidateQueries({ queryKey: ["/api/farmer/events"] });
      setShowEditDialog(false);
      setEditingEvent(null);
      toast({
        title: "Event Updated",
        description: "The event has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update event",
        variant: "destructive"
      });
    }
  });
  
  const handleEditClick = (event: any) => {
    setEditingEvent(event);
    setEditForm({
      title: event.title || "",
      description: event.description || "",
      eventType: event.eventType || "",
      cropType: event.cropType || "",
      location: event.location || "",
      address: event.address || "",
      startTime: event.startTime || "",
      endTime: event.endTime || "",
      totalSeats: event.totalSeats || 0,
      pricePerSeat: event.pricePerSeat || ""
    });
    // Populate existing date (use first date if multiple exist)
    const existingDates = (event.dates || []).map((d: any) => d.eventDate);
    setEditEventDate(existingDates[0] || "");
    setShowEditDialog(true);
  };
  
  const handleSaveEdit = () => {
    if (editingEvent) {
      editMutation.mutate({ 
        eventId: editingEvent.id, 
        data: { ...editForm, eventDates: editEventDate ? [editEventDate] : [] } 
      });
    }
  };

  const approveMutation = useMutation({
    mutationFn: async (eventId: number) => {
      // DMs use a different endpoint for approval
      const endpoint = isDM 
        ? `/api/dm/events/${eventId}/review`
        : `/api/events/${eventId}/approve`;
      const body = isDM ? { action: 'approve' } : {};
      const response = await apiRequest(isDM ? "POST" : "PATCH", endpoint, body);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [baseEndpoint] });
      queryClient.invalidateQueries({ queryKey: ["/api/farmer/events"] });
      // Explicitly refetch all tabs so the UI updates without a hard refresh
      refetchPending();
      refetchApproved();
      toast({
        title: "Event Approved",
        description: "The event is now live and visible to customers.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve event",
        variant: "destructive"
      });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ eventId, reason }: { eventId: number; reason: string }) => {
      // DMs use a different endpoint for rejection
      const endpoint = isDM 
        ? `/api/dm/events/${eventId}/review`
        : `/api/events/${eventId}/reject`;
      const body = isDM ? { action: 'reject', reason } : { reason };
      const response = await apiRequest(isDM ? "POST" : "PATCH", endpoint, body);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [baseEndpoint] });
      queryClient.invalidateQueries({ queryKey: ["/api/farmer/events"] });
      // Explicitly refetch all tabs so the UI updates without a hard refresh
      refetchPending();
      refetchRejected();
      toast({
        title: "Event Rejected",
        description: "The farmer has been notified.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject event",
        variant: "destructive"
      });
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Farm Events</h3>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs value={eventStatusTab} onValueChange={(value) => setEventStatusTab(value as any)}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto gap-1">
          <TabsTrigger value="pending" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Pending</span>
            <span className="xs:hidden">Pend</span>
            {pendingEvents && pendingEvents.length > 0 && (
              <Badge variant="secondary" className="ml-1 bg-yellow-100 text-yellow-800 text-[10px] sm:text-xs">{pendingEvents.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Approved</span>
            <span className="xs:hidden">Appr</span>
            {approvedEvents && approvedEvents.length > 0 && (
              <Badge variant="secondary" className="ml-1 bg-green-100 text-green-800 text-[10px] sm:text-xs">{approvedEvents.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2">
            <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Rejected</span>
            <span className="xs:hidden">Rej</span>
            {rejectedEvents && rejectedEvents.length > 0 && (
              <Badge variant="secondary" className="ml-1 bg-red-100 text-red-800 text-[10px] sm:text-xs">{rejectedEvents.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="expired" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2">
            <CalendarX className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Expired</span>
            <span className="xs:hidden">Exp</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={eventStatusTab} className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : !events || events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">
                {eventStatusTab === 'pending' ? 'No pending events' :
                 eventStatusTab === 'approved' ? 'No approved events' :
                 eventStatusTab === 'rejected' ? 'No rejected events' :
                 'No expired events'}
              </h3>
              <p className="text-gray-500">
                {eventStatusTab === 'pending' ? 'No events waiting for approval' :
                 eventStatusTab === 'approved' ? 'Approved events will appear here' :
                 eventStatusTab === 'rejected' ? 'Rejected events will appear here' :
                 'Past events will appear here'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event: any) => (
                <AdminEventCard 
                  key={event.id} 
                  event={event} 
                  onApprove={() => approveMutation.mutate(event.id)}
                  onReject={(reason) => rejectMutation.mutate({ eventId: event.id, reason })}
                  onEdit={() => handleEditClick(event)}
                  isApproving={approveMutation.isPending}
                  isRejecting={rejectMutation.isPending}
                  showApprovalButtons={eventStatusTab === 'pending'}
                  canEdit={user?.role === 'admin' || (event.status !== 'approved' && event.status !== 'live')}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Edit Event Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update the event details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input 
                  id="edit-title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-description">Description</Label>
                <textarea 
                  id="edit-description"
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-eventType">Event Type</Label>
                <Select value={editForm.eventType} onValueChange={(val) => setEditForm({ ...editForm, eventType: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fruit_picking">Fruit Picking</SelectItem>
                    <SelectItem value="vegetable_experience">Vegetable Experience</SelectItem>
                    <SelectItem value="farm_tour">Farm Tour</SelectItem>
                    <SelectItem value="zbnf_training">Natural Farming Training</SelectItem>
                    <SelectItem value="nursery_visit">Nursery Visit</SelectItem>
                    <SelectItem value="festival">Farm Festival</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="kids_activity">Kids Activity</SelectItem>
                    <SelectItem value="dairy_experience">Dairy Experience</SelectItem>
                    <SelectItem value="cattle_visit">Cattle Visit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-cropType">Crop Type</Label>
                <Input 
                  id="edit-cropType"
                  value={editForm.cropType}
                  onChange={(e) => setEditForm({ ...editForm, cropType: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-location">Location</Label>
                <Input 
                  id="edit-location"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-address">Address</Label>
                <Input 
                  id="edit-address"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-startTime">Start Time</Label>
                <Input 
                  id="edit-startTime"
                  type="time"
                  value={editForm.startTime}
                  onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-endTime">End Time</Label>
                <Input 
                  id="edit-endTime"
                  type="time"
                  value={editForm.endTime}
                  onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-totalSeats">Total Seats</Label>
                <Input 
                  id="edit-totalSeats"
                  type="number"
                  value={editForm.totalSeats}
                  onChange={(e) => setEditForm({ ...editForm, totalSeats: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="edit-pricePerSeat">Price per Seat (₹)</Label>
                <Input 
                  id="edit-pricePerSeat"
                  type="number"
                  step="0.01"
                  value={editForm.pricePerSeat}
                  onChange={(e) => setEditForm({ ...editForm, pricePerSeat: e.target.value })}
                />
              </div>
              
              {/* Editable Event Dates */}
              <div className="col-span-2">
                <Label>Event Date *</Label>
                <Input
                  type="date"
                  value={editEventDate}
                  onChange={(e) => setEditEventDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-2"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={editMutation.isPending}>
              {editMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Admin Event Card Component
function AdminEventCard({ 
  event, 
  onApprove, 
  onReject, 
  onEdit,
  isApproving, 
  isRejecting,
  showApprovalButtons = true,
  canEdit = true
}: { 
  event: any; 
  onApprove: () => void; 
  onReject: (reason: string) => void;
  onEdit: () => void;
  isApproving: boolean;
  isRejecting: boolean;
  showApprovalButtons?: boolean;
  canEdit?: boolean;
}) {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showBookingsDialog, setShowBookingsDialog] = useState(false);

  const eventTypeLabels: Record<string, string> = {
    fruit_picking: "Fruit Picking",
    vegetable_experience: "Vegetable Experience",
    farm_tour: "Farm Tour",
    zbnf_training: "Natural Farming Training",
    nursery_visit: "Nursery Visit",
    festival: "Farm Festival",
    workshop: "Workshop",
    kids_activity: "Kids Activity"
  };

  return (
    <Card className={event.status === 'pending' ? 'border-l-4 border-l-yellow-500' : ''}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {event.coverImage ? (
            <img 
              src={event.coverImage} 
              alt={event.title}
              className="h-28 w-28 object-cover rounded"
            />
          ) : (
            <div className="h-28 w-28 bg-green-100 rounded flex items-center justify-center">
              <Calendar className="h-10 w-10 text-green-600" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{eventTypeLabels[event.eventType] || event.eventType}</Badge>
                  {event.cropType && <Badge variant="secondary">{event.cropType}</Badge>}
                </div>
              </div>
              <Badge variant={
                event.status === 'live' ? 'default' :
                event.status === 'pending' ? 'secondary' :
                event.status === 'rejected' ? 'destructive' :
                'outline'
              }>
                {event.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{event.farmer?.name || 'Unknown Farmer'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                <span>{event.farmerProfile?.farmName || 'Unknown Farm'}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{event.startTime} - {event.endTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{event.totalSeats} seats @ {formatIndianCurrency(parseFloat(event.pricePerSeat))}</span>
              </div>
              {event.dmDetails && (
                <div className="flex items-center gap-1 col-span-2 mt-1 text-purple-600">
                  <Shield className="h-4 w-4" />
                  <span>Approved by: {event.dmDetails.name} ({event.dmDetails.district || 'DM'})</span>
                </div>
              )}
              {event.districtManager && !event.dmDetails && (
                <div className="flex items-center gap-1 col-span-2 mt-1 text-purple-600">
                  <Shield className="h-4 w-4" />
                  <span>DM: {event.districtManager.name} ({event.districtManager.district || 'District Manager'})</span>
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{event.description}</p>

            {/* Event Dates Display */}
            {event.dates && event.dates.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1 items-center">
                <Calendar className="h-4 w-4 text-blue-600" />
                {event.dates.slice(0, 5).map((date: any) => (
                  <Badge key={date.id} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                    {new Date(date.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </Badge>
                ))}
                {event.dates.length > 5 && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">+{event.dates.length - 5} more</Badge>
                )}
              </div>
            ) : (
              <div className="mt-2 flex items-center gap-1 text-yellow-600 text-sm">
                <Calendar className="h-4 w-4" />
                <span>No dates added - farmer needs to add event dates</span>
              </div>
            )}

            {event.status === 'rejected' && event.rejectionReason && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                Rejection reason: {event.rejectionReason}
              </div>
            )}

            {/* Bookings Summary */}
            {event.bookings && event.bookings.length > 0 && (
              <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-purple-800 flex items-center gap-2">
                    <Ticket className="h-4 w-4" />
                    Bookings ({event.bookings.length})
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-purple-100 text-purple-800">
                      {event.bookings.reduce((sum: number, b: any) => sum + (b.numSeats || 1), 0)} seats booked
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowBookingsDialog(true)}
                      className="bg-white hover:bg-purple-100"
                      title="View Booking Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-3">
              {showApprovalButtons && event.status === 'pending' && (
                <>
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={onApprove}
                    disabled={isApproving}
                  >
                    {isApproving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <Check className="h-4 w-4 mr-1" />
                    )}
                    Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => setShowRejectDialog(true)}
                    disabled={isRejecting}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </>
              )}
              {canEdit && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={onEdit}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Event</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this event. The farmer will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                onReject(rejectReason);
                setShowRejectDialog(false);
                setRejectReason("");
              }}
              disabled={!rejectReason.trim()}
            >
              Reject Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Details Dialog */}
      <Dialog open={showBookingsDialog} onOpenChange={setShowBookingsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-purple-600" />
              Customer Bookings - {event.title}
            </DialogTitle>
          </DialogHeader>
          {event.bookings && event.bookings.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="font-medium text-purple-800">Total Bookings: {event.bookings.length}</span>
                <Badge className="bg-purple-600">
                  {event.bookings.reduce((sum: number, b: any) => sum + (b.numSeats || 1), 0)} seats booked
                </Badge>
              </div>
              <div className="space-y-2">
                {event.bookings.map((booking: any) => (
                  <div key={booking.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{booking.customerName || booking.customer?.name || 'Customer'}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600 mt-1">
                            {(booking.customerPhone || booking.customer?.phone) && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-4 w-4 text-green-600" />
                                {booking.customerPhone || booking.customer?.phone}
                              </span>
                            )}
                            {(booking.customerEmail || booking.customer?.email) && (
                              <span className="flex items-center gap-1">
                                <Mail className="h-4 w-4 text-blue-600" />
                                {booking.customerEmail || booking.customer?.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Badge variant="outline" className="bg-gray-50">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(booking.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {booking.numSeats || 1} seat(s)
                        </Badge>
                        <Badge variant={booking.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                          {booking.paymentStatus || 'pending'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Ticket className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No bookings for this event yet.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// Event Types Management Component
function EventTypesManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingType, setEditingType] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    icon: "",
    sortOrder: 0,
    isActive: true
  });

  const { data: eventTypesData, isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/event-types"],
  });

  const eventTypes = eventTypesData || [];

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/admin/event-types", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/event-types"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events/types"] });
      setShowForm(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest("PATCH", `/api/admin/event-types/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/event-types"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events/types"] });
      setShowForm(false);
      setEditingType(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/event-types/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/event-types"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events/types"] });
    },
  });

  const initializeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/event-types/initialize");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/event-types"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events/types"] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      displayName: "",
      description: "",
      icon: "",
      sortOrder: 0,
      isActive: true
    });
  };

  const handleEdit = (type: any) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      displayName: type.displayName,
      description: type.description || "",
      icon: type.icon || "",
      sortOrder: type.sortOrder || 0,
      isActive: type.isActive
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingType) {
      updateMutation.mutate({ id: editingType.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Farm Event Types
              </CardTitle>
              <CardDescription>
                Manage event types that farmers can choose when creating farm events
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {eventTypes.length === 0 && (
                <Button 
                  variant="outline"
                  onClick={() => initializeMutation.mutate()}
                  disabled={initializeMutation.isPending}
                >
                  {initializeMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCcw className="h-4 w-4 mr-2" />
                  )}
                  Initialize Defaults
                </Button>
              )}
              <Dialog open={showForm} onOpenChange={(open) => {
                setShowForm(open);
                if (!open) {
                  setEditingType(null);
                  resetForm();
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event Type
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingType ? "Edit Event Type" : "Add Event Type"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingType ? "Update the event type details." : "Create a new event type for farmers to use."}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">System Name (lowercase, underscores)</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                        placeholder="e.g., fruit_picking"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={formData.displayName}
                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        placeholder="e.g., Fruit Picking"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Optional description"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sortOrder">Sort Order</Label>
                      <Input
                        id="sortOrder"
                        type="number"
                        value={formData.sortOrder}
                        onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      />
                      <Label>Active (visible to farmers)</Label>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => {
                        setShowForm(false);
                        setEditingType(null);
                        resetForm();
                      }}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                        {(createMutation.isPending || updateMutation.isPending) ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : null}
                        {editingType ? "Update" : "Create"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {eventTypes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No event types configured yet.</p>
              <p className="text-sm">Click "Initialize Defaults" to add the standard event types, or create custom ones.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>System Name</TableHead>
                    <TableHead>Display Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventTypes.map((type: any) => (
                    <TableRow key={type.id}>
                      <TableCell>{type.sortOrder}</TableCell>
                      <TableCell className="font-mono text-sm">{type.name}</TableCell>
                      <TableCell className="font-medium">{type.displayName}</TableCell>
                      <TableCell className="text-gray-500">{type.description || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={type.isActive ? "default" : "secondary"}>
                          {type.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(type)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (confirm(`Delete event type "${type.displayName}"?`)) {
                                deleteMutation.mutate(type.id);
                              }
                            }}
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Vendors Management Component for Cashfree Easy Split
function VendorsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch vendors list (District Managers with vendor status)
  const { data: vendorsData, isLoading } = useQuery<{ vendors: any[], total: number, registered: number, pending: number }>({
    queryKey: ["/api/admin/cashfree/vendors"],
  });
  
  const vendors = vendorsData?.vendors || [];
  
  // Register a single District Manager as vendor
  const registerVendorMutation = useMutation({
    mutationFn: async (districtManagerId: number) => {
      const response = await apiRequest("POST", `/api/admin/cashfree/vendors/${districtManagerId}/register`);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Vendor Registration",
        description: data.message || "District Manager registered as Cashfree vendor",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cashfree/vendors"] });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register vendor with Cashfree",
        variant: "destructive",
      });
    },
  });
  
  // Sync all District Managers as vendors
  const syncAllVendorsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/cashfree/vendors/sync-all");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Vendor Sync Complete",
        description: `${data.registered || 0} new vendors registered, ${data.skipped || 0} skipped`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cashfree/vendors"] });
    },
    onError: (error: any) => {
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync vendors with Cashfree",
        variant: "destructive",
      });
    },
  });
  
  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "BLOCKED":
        return <Badge className="bg-red-100 text-red-800">Blocked</Badge>;
      default:
        return <Badge variant="secondary">Not Registered</Badge>;
    }
  };
  
  const registeredCount = vendors.filter(v => v.vendorStatus === "ACTIVE").length;
  const pendingCount = vendors.filter(v => v.vendorStatus === "PENDING").length;
  const unregisteredCount = vendors.filter(v => !v.cashfreeVendorId).length;
  
  return (
    <div className="space-y-6">
      {/* Header with stats and sync button */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Payment Vendors (Cashfree Easy Split)</h2>
          <p className="text-gray-500 mt-1">
            Register FPOs as Cashfree vendors to receive product price from order payments
          </p>
        </div>
        <Button
          onClick={() => syncAllVendorsMutation.mutate()}
          disabled={syncAllVendorsMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {syncAllVendorsMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCcw className="h-4 w-4 mr-2" />
          )}
          Sync All Vendors
        </Button>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total DMs</p>
                <h3 className="text-2xl font-bold">{vendors.length}</h3>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                <h3 className="text-2xl font-bold text-green-600">{registeredCount}</h3>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <h3 className="text-2xl font-bold text-yellow-600">{pendingCount}</h3>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Not Registered</p>
                <h3 className="text-2xl font-bold text-gray-600">{unregisteredCount}</h3>
              </div>
              <AlertCircle className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Payment Split Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Payment Split Configuration</h3>
              <p className="text-blue-700 mt-1">
                When a customer places an order, payments are automatically split:
              </p>
              <ul className="mt-2 space-y-1 text-blue-800">
                <li className="flex items-center gap-2">
                  <span className="font-medium">Product Price</span> → FPO (Vendor Account)
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-medium">Tech Support Fee 9%</span> → Santhe Platform
                </li>
              </ul>
              <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                <span className="font-semibold">Subscription Exception:</span> Customers with <span className="font-medium">BUSINESS – FARM DIRECT PRO</span> or <span className="font-medium">FAMILY – FARM DIRECT</span> subscriptions have 0% platform fee — FPO receives the full payment amount.
              </div>
              <p className="text-amber-700 text-sm mt-2 font-medium">
                If vendor is not added/approved, full payment goes to Santhe Platform until split payment gets approval.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle>District Managers</CardTitle>
          <CardDescription>
            Manage Cashfree vendor registrations for District Managers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No District Managers found</p>
              <p className="text-sm">Add District Managers to register them as payment vendors</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Bank Details</TableHead>
                    <TableHead>Vendor ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((vendor: any) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">
                        {vendor.fullName || vendor.username}
                      </TableCell>
                      <TableCell>{vendor.orgName || "-"}</TableCell>
                      <TableCell>{vendor.districtName || "-"}</TableCell>
                      <TableCell>
                        {vendor.bankAccountNumber ? (
                          <div className="text-sm">
                            <p>A/C: ****{vendor.bankAccountNumber?.slice(-4)}</p>
                            <p className="text-gray-500">{vendor.bankIfsc || "No IFSC"}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400">Not set</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {vendor.cashfreeVendorId || "-"}
                        </code>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(vendor.vendorStatus)}
                      </TableCell>
                      <TableCell>
                        {vendor.vendorCreatedAt ? (
                          new Date(vendor.vendorCreatedAt).toLocaleDateString()
                        ) : "-"}
                      </TableCell>
                      <TableCell>
                        {!vendor.cashfreeVendorId ? (
                          <Button
                            size="sm"
                            onClick={() => registerVendorMutation.mutate(vendor.id)}
                            disabled={registerVendorMutation.isPending || !vendor.bankAccountNumber}
                            title={!vendor.bankAccountNumber ? "Bank details required" : "Register as vendor"}
                          >
                            {registerVendorMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-1" />
                                Register
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" disabled>
                            <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                            Registered
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Marketing Poster Creator panel (inside the marketing-video tab) ──────────
function MarketingPosterPanel() {
  const { toast: toastFn } = useToast();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [format, setFormat] = useState<'square' | 'story'>('square');
  const [style, setStyle] = useState('warm');
  const [language, setLanguage] = useState('en');
  const [aiContent, setAiContent] = useState(true);
  const [sections, setSections] = useState({
    howWeGrow: true,
    howWeProcess: true,
    whyItMatters: true,
    popularWays: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadFilename, setDownloadFilename] = useState<string | null>(null);

  const { data: mvData, isLoading: mvLoading } = useQuery<{
    fpo: { orgName: string; orgLogoUrl?: string; orgQrCodeUrl?: string };
    farmers: Array<{ id: number; farmName: string; imageUrl?: string }>;
    products: Array<{
      id: number; name: string; imageUrl?: string; price: string; unit: string;
      harvestDate?: string | null; availableUntil?: string | null;
      farmerId?: number | null;
      priceSlabs?: Array<{ minQuantity: number; maxQuantity?: number | null; pricePerUnit: string; slabType: string }>;
    }>;
    events: any[];
  }>({ queryKey: ['/api/dm/marketing-video/data'] });

  const products = mvData?.products || [];
  const selectedProduct = products.find(p => p.id === selectedProductId) || null;

  const wholesalePrice = selectedProduct?.priceSlabs
    ? (() => {
        const b2b = (selectedProduct.priceSlabs || []).filter(s => s.slabType === 'b2b' && s.pricePerUnit);
        if (!b2b.length) return null;
        return b2b.reduce((min, s) => Number(s.pricePerUnit) < Number(min.pricePerUnit) ? s : min).pricePerUnit;
      })()
    : null;

  const STYLES = [
    { value: 'warm',        label: '🤝 Warm',   desc: 'Heartfelt, storytelling'  },
    { value: 'modern',      label: '⚡ Modern',  desc: 'Clean & punchy'            },
    { value: 'health',      label: '🥗 Health',  desc: 'Chemical-free, wholesome' },
    { value: 'festive',     label: '🎉 Festive', desc: 'Perfect for festivals'     },
    { value: 'trust',       label: '🏆 Trust',   desc: 'Heritage, credibility'     },
    { value: 'promotional', label: '💰 Promo',   desc: 'Price-forward, deals'      },
  ];

  const FORMATS = [
    { value: 'square', label: 'Square', dim: '1080×1080', desc: 'Instagram / WhatsApp post',  emoji: '⬜' },
    { value: 'story',  label: 'Story',  dim: '1080×1920', desc: 'Instagram / WhatsApp Story', emoji: '📱' },
  ];

  const LANGUAGES = [
    { value: 'en', label: 'English' },
    { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { value: 'hi', label: 'हिन्दी (Hindi)' },
    { value: 'te', label: 'తెలుగు (Telugu)' },
    { value: 'ta', label: 'தமிழ் (Tamil)' },
    { value: 'ml', label: 'മലയാളം (Malayalam)' },
    { value: 'mr', label: 'मराठी (Marathi)' },
    { value: 'gu', label: 'ગુજરાતી (Gujarati)' },
  ];

  const fmtDate = (d?: string | null) => {
    if (!d) return null;
    try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); }
    catch { return null; }
  };

  async function handleGenerate() {
    if (!selectedProductId) {
      toastFn({ title: 'Select a product first', variant: 'destructive' });
      return;
    }
    setIsGenerating(true);
    setDownloadFilename(null);
    try {
      const res = await apiRequest('POST', '/api/dm/marketing-poster/render', {
        productId: selectedProductId, style, format, language, aiContent, sections,
      });
      const data = await res.json();
      if (!data.filename) throw new Error(data.error || 'No filename returned');
      setDownloadFilename(data.filename);
      toastFn({
        title: '🖼️ Poster ready!',
        description: data.aiGenerated
          ? `AI content generated in ${data.languageLabel || language}.`
          : 'Your marketing poster has been created.',
      });
    } catch (err: any) {
      toastFn({ title: 'Poster generation failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleDownload() {
    if (!downloadFilename) return;
    try {
      let token: string | null = null;
      try {
        const raw = localStorage.getItem('harvest_direct_auth');
        if (raw) token = JSON.parse(raw)?.token ?? null;
      } catch { /* ignore */ }
      const res = await fetch(`/api/dm/marketing-poster/download/${downloadFilename}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`Download failed: ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'santhe-poster.png';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      setTimeout(() => setDownloadFilename(null), 1500);
    } catch (err: any) {
      toastFn({ title: 'Download failed', description: err.message, variant: 'destructive' });
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg">
        <div className="text-4xl">🖼️</div>
        <div>
          <h2 className="text-xl font-black tracking-tight">Marketing Poster Creator</h2>
          <p className="text-orange-100 text-sm mt-0.5">
            Generate a beautiful social-media poster for any product — shows retail &amp; wholesale prices, farmer details, and harvest dates. Download as PNG and share on WhatsApp, Instagram, or Facebook.
          </p>
        </div>
      </div>

      {mvLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <span className="ml-3 text-gray-500">Loading products…</span>
        </div>
      ) : products.length === 0 ? (
        <Card className="border-dashed border-orange-200">
          <CardContent className="py-12 text-center">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-gray-500 font-medium">No approved products found.</p>
            <p className="text-gray-400 text-sm mt-1">Approve farmer products first to create posters for them.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Step 1 — Pick a product */}
          <Card className="border-orange-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-black">1</span>
                Select Product
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                {products.map(p => {
                  const selected = p.id === selectedProductId;
                  const b2b = (p.priceSlabs || []).filter(s => s.slabType === 'b2b' && s.pricePerUnit);
                  const wsPrice = b2b.length
                    ? b2b.reduce((mn, s) => Number(s.pricePerUnit) < Number(mn.pricePerUnit) ? s : mn).pricePerUnit
                    : null;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProductId(selected ? null : p.id)}
                      className={`flex gap-3 p-3 rounded-xl border text-left transition-all w-full ${
                        selected
                          ? 'border-orange-500 bg-orange-50 shadow-sm ring-1 ring-orange-300'
                          : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/40'
                      }`}
                    >
                      <div className="relative shrink-0">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="h-16 w-16 rounded-lg object-cover border border-gray-100 shadow-sm" />
                        ) : (
                          <div className="h-16 w-16 rounded-lg bg-orange-100 flex items-center justify-center text-3xl">🥦</div>
                        )}
                        {selected && (
                          <span className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full p-0.5 shadow">
                            <CheckCircle className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate">{p.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="text-xs bg-orange-100 text-orange-700 rounded-full px-2 py-0.5 font-medium">
                            ₹{p.price}/{p.unit}
                          </span>
                          {wsPrice && (
                            <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 font-medium">
                              WS ₹{wsPrice}
                            </span>
                          )}
                        </div>
                        {p.harvestDate && (
                          <p className="text-xs text-gray-400 mt-1">🌾 {fmtDate(p.harvestDate)}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Step 2 — Format */}
          <Card className="border-orange-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-black">2</span>
                Choose Format
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {FORMATS.map(f => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFormat(f.value as 'square' | 'story')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      format === f.value
                        ? 'border-orange-500 bg-orange-50 shadow-sm'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{f.emoji}</div>
                    <p className="font-bold text-gray-800 text-sm">{f.label}</p>
                    <p className="text-xs text-gray-500">{f.desc}</p>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">{f.dim}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Step 3 — Style */}
          <Card className="border-orange-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-black">3</span>
                Choose Style Theme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {STYLES.map(s => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setStyle(s.value)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      style === s.value
                        ? 'border-orange-500 bg-orange-50 shadow-sm ring-1 ring-orange-200'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <p className="font-bold text-gray-800 text-sm">{s.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Step 4 — Language and content */}
          <Card className="border-orange-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-black">4</span>
                Poster Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Content language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                  <div>
                    <Label htmlFor="poster-ai-content" className="text-sm font-medium">AI-written copy</Label>
                    <p className="text-xs text-gray-400">Uses Ollama when configured</p>
                  </div>
                  <Switch id="poster-ai-content" checked={aiContent} onCheckedChange={setAiContent} />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Include highlights</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    ['howWeGrow', 'How we grow'],
                    ['howWeProcess', 'How we process'],
                    ['whyItMatters', 'Why it matters'],
                    ['popularWays', 'Popular ways to use'],
                  ].map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                      <span className="text-sm text-gray-700">{label}</span>
                      <Switch
                        checked={sections[key as keyof typeof sections]}
                        onCheckedChange={(checked) => setSections(current => ({ ...current, [key]: checked }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
              {!aiContent && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  AI is off. The poster will use reliable built-in copy.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Generate / Download */}
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedProductId}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-base font-bold rounded-xl shadow-md h-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Creating poster…
                </>
              ) : (
                <>🖼️ Generate Poster</>
              )}
            </Button>

            {downloadFilename && (
              <Button
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-base font-bold rounded-xl shadow-md h-auto"
              >
                <Download className="h-5 w-5 mr-2" />
                Download PNG
              </Button>
            )}
          </div>

          {/* Preview summary */}
          {selectedProduct && !downloadFilename && !isGenerating && (
            <Card className="border-green-100 bg-green-50">
              <CardContent className="py-4">
                <p className="text-sm text-green-800 font-semibold mb-2">✅ Your poster will include:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-green-700">
                  <span>• Product photo as background</span>
                  <span>• Retail: ₹{selectedProduct.price}/{selectedProduct.unit}</span>
                  {wholesalePrice && <span>• Wholesale: ₹{wholesalePrice}/{selectedProduct.unit}</span>}
                  {selectedProduct.harvestDate && <span>• Harvest: {fmtDate(selectedProduct.harvestDate)}</span>}
                  {selectedProduct.availableUntil && <span>• Available till: {fmtDate(selectedProduct.availableUntil)}</span>}
                  <span>• Farmer profile &amp; farm name</span>
                  <span>• FPO logo &amp; SANTHE branding</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success banner */}
          {downloadFilename && (
            <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
              <CardContent className="py-5 flex items-center gap-4">
                <div className="text-4xl">✅</div>
                <div>
                  <p className="font-bold text-green-800">Your poster is ready!</p>
                  <p className="text-sm text-green-600 mt-0.5">
                    Click "Download PNG" to save. Share on WhatsApp, Instagram, or Facebook.
                    The file is available for 10 minutes.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}