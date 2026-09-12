import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OrderList from "@/components/dashboard/OrderList";
import ProductManagement from "@/components/dashboard/ProductManagement";
import FarmerProfileNew from "@/components/dashboard/FarmerProfileNew";
import CustomerProfile from "@/components/dashboard/CustomerProfile";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { formatIndianCurrency } from "@/lib/utils";
import { Product, Order, OrderItem } from "@/lib/types";
import { getAuthToken } from "@/lib/auth";
import { MapPin, Calendar, CalendarX, Clock, CheckCircle, XCircle, Hourglass, ChevronDown, ChevronUp, User, DollarSign, MessageSquare, Loader2, CreditCard, Package, TrendingUp, ShoppingCart, AlertCircle, Sprout, Sparkles, X, ImageIcon, Ticket, Shield, Building, Phone, Mail, UserCheck, UserPlus, Eye, Crown, Star } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Dashboard() {
  const { tab } = useParams();
  const [location, navigate] = useLocation();
  const { t } = useTranslation();
  const { user, isLoading, viewingAs } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(tab || "overview");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate(`/login?returnUrl=${encodeURIComponent(location)}`);
    }
  }, [user, isLoading, navigate, location]);

  // Redirect DMs and admins to admin dashboard
  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "district_manager" || user.role === "taluk_agent")) {
      navigate("/admin");
    }
  }, [user, navigate]);

  // Update the URL when the tab changes
  useEffect(() => {
    if (tab !== activeTab && activeTab !== "overview") {
      navigate(`/dashboard/${activeTab}`);
    } else if (tab !== activeTab) {
      navigate("/dashboard");
    }
  }, [activeTab, navigate, tab]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // The useEffect will redirect
  }

  // Determine if user is a farmer
  
  // If user has farmer role and is viewing as farmer, show farmer features
  // Otherwise, if user role isn't farmer, or they're viewing as customer, show customer features
  const isFarmer = user.role === "farmer" && viewingAs === "farmer";

  const { data: subscriptionData } = useQuery<{ subscription: any }>({
    queryKey: ["/api/my-subscription"],
    enabled: !isFarmer,
  });

  const { data: customerOrders } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !isFarmer,
  });
  
  const { data: fpoLinkData } = useQuery<{ linked: any[]; pending: any[]; available: any[]; maxLinks: number; currentCount: number; farmerDistrict: string | null }>({
    queryKey: ["/api/farmer/fpos"],
    enabled: isFarmer,
  });
  const hasLinkedFpo = fpoLinkData?.linked && fpoLinkData.linked.length > 0;

  // Fetch farmer's products
  const { data: farmerProducts } = useQuery<(Product & { isExpired: boolean, approvalStatus: string })[]>({
    queryKey: ["/api/products/farmer/list"],
    queryFn: async () => {
      if (!isFarmer) return null;
      const token = getAuthToken();
      const res = await fetch("/api/products/farmer/list", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return res.json();
    },
    enabled: isFarmer,
    staleTime: 0,
    refetchOnMount: 'always'
  });
  
  // Fetch farmer's orders
  const { data: farmerOrders } = useQuery<(Order & { items: (OrderItem & { price: number, quantity: number })[] })[]>({
    queryKey: ["/api/orders/farmer"],
    queryFn: async () => {
      if (!isFarmer) return null;
      const token = getAuthToken();
      const res = await fetch("/api/orders/farmer", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return res.json();
    },
    enabled: isFarmer,
    staleTime: 0,
    refetchOnMount: 'always'
  });

  // Fetch saved ZBNF plans
  const { data: savedPlansResponse } = useQuery({
    queryKey: ["/api/zbnf/saved-plans"],
    queryFn: async () => {
      const token = getAuthToken();
      const res = await fetch("/api/zbnf/saved-plans", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return res.json();
    },
    enabled: isFarmer,
    staleTime: 0,
    refetchOnMount: 'always'
  });

  // Fetch farmer's events with bookings for overview (includes expired for historical stats)
  const { data: farmerEventsWithBookings } = useQuery<any[]>({
    queryKey: ["/api/farmer/events", "approved", "includeExpired"],
    queryFn: async () => {
      const token = getAuthToken();
      const response = await fetch("/api/farmer/events?status=approved&includeExpired=true", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response.json();
    },
    enabled: isFarmer,
    staleTime: 0,
    refetchOnMount: 'always'
  });

  // Calculate event booking statistics
  const totalEvents = Array.isArray(farmerEventsWithBookings) ? farmerEventsWithBookings.length : 0;
  const allBookings = Array.isArray(farmerEventsWithBookings) 
    ? farmerEventsWithBookings.flatMap(e => ({ 
        ...e, 
        bookings: (e.bookings || []).map((b: any) => ({ ...b, pricePerSeat: e.pricePerSeat })) 
      })).flatMap(e => e.bookings || [])
    : [];
  const totalEventBookings = allBookings.length;
  const paidBookings = allBookings.filter((b: any) => b.paymentStatus === 'paid').length;
  const totalSeatsBooked = allBookings.reduce((sum: number, b: any) => sum + (b.numSeats || 1), 0);
  // Calculate event revenue using reverse calculation from totalAmount (what customer paid)
  // Formula: farmerRevenue = totalAmount / feeMultiplier
  // This ensures correct calculation even if event pricePerSeat was edited after booking
  const eventFeeMultiplier = 1.07; // 7% Platform Fee
  const eventBookingRevenue = allBookings
    .filter((b: any) => b.paymentStatus === 'paid')
    .reduce((sum: number, b: any) => {
      const totalAmount = parseFloat(b.totalAmount || 0);
      return sum + (totalAmount / eventFeeMultiplier);
    }, 0);

  // Process the saved plans data
  const savedPlans = (savedPlansResponse && savedPlansResponse.success) ? savedPlansResponse.plans : [];
  
  // Calculate farmer statistics
  const currentDate = new Date();
  const activeProductsCount = Array.isArray(farmerProducts) 
    ? farmerProducts.filter(product => {
        const availableUntilDate = new Date(product.availableUntil);
        return availableUntilDate >= currentDate && product.approvalStatus === "approved";
      }).length 
    : 0;
    
  const totalProducts = Array.isArray(farmerProducts) ? farmerProducts.length : 0;
  const pendingProducts = Array.isArray(farmerProducts) ? farmerProducts.filter(p => p.approvalStatus === "pending").length : 0;
  const rejectedProducts = Array.isArray(farmerProducts) ? farmerProducts.filter(p => p.approvalStatus === "rejected").length : 0;
  // Split orders into retail and wholesale
  const retailOrders = Array.isArray(farmerOrders) ? farmerOrders.filter((o: any) => !o.notes?.includes('B2B Bulk Order')) : [];
  const wholesaleOrders = Array.isArray(farmerOrders) ? farmerOrders.filter((o: any) => o.notes?.includes('B2B Bulk Order')) : [];

  // Calculate order earnings using subtotal (item price × quantity)
  const regularOrderEarnings = Array.isArray(farmerOrders) 
    ? farmerOrders
        .reduce((total: number, order) => {
          return total + (Array.isArray(order.items) ? order.items.reduce((orderTotal: number, item) => {
            return orderTotal + (parseFloat(item.price.toString()) * item.quantity);
          }, 0) : 0);
        }, 0) 
    : 0;

  const retailEarnings = retailOrders.reduce((total: number, order: any) => {
    return total + (Array.isArray(order.items) ? order.items.reduce((orderTotal: number, item: any) => {
      return orderTotal + (parseFloat(item.price.toString()) * item.quantity);
    }, 0) : 0);
  }, 0);

  const wholesaleEarnings = wholesaleOrders.reduce((total: number, order: any) => {
    return total + (Array.isArray(order.items) ? order.items.reduce((orderTotal: number, item: any) => {
      return orderTotal + (parseFloat(item.price.toString()) * item.quantity);
    }, 0) : 0);
  }, 0);
  
  // Calculate grand total: orders + event bookings
  const grandTotalRevenue = regularOrderEarnings + eventBookingRevenue;
  
  // Calculate order statistics
  const totalOrders = Array.isArray(farmerOrders) ? farmerOrders.length : 0;
  const completedOrders = Array.isArray(farmerOrders) ? farmerOrders.filter(o => o.status === 'delivered').length : 0;
  const pendingOrders = Array.isArray(farmerOrders) ? farmerOrders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length : 0;

  return (
    <>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-3xl font-serif font-bold text-gray-900">
              {isFarmer ? t('dashboard.farmerDashboard') : t('dashboard.customerDashboard')}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {isFarmer ? t('dashboard.manageFarm') : t('dashboard.manageAccount')}
            </p>
          </div>
          
          {isFarmer && hasLinkedFpo && (
            <Button asChild size="sm" className="mt-2 sm:mt-0">
              <Link href="/dashboard/products/new">
                <i className="fas fa-plus mr-2"></i>
                <span className="hidden sm:inline">{t('dashboard.addNewProduct')}</span>
                <span className="sm:hidden">Add Product</span>
              </Link>
            </Button>
          )}
          {isFarmer && !hasLinkedFpo && fpoLinkData && (
            <Button asChild size="sm" variant="outline" className="mt-2 sm:mt-0 border-orange-300 text-orange-700 hover:bg-orange-50">
              <Link href="/dashboard/my-fpos">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Link FPO to Add Products</span>
                <span className="sm:hidden">Link FPO</span>
              </Link>
            </Button>
          )}
        </div>

        <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-8 flex flex-wrap gap-1 h-auto justify-start overflow-x-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">{t('dashboard.overview')}</TabsTrigger>
            <TabsTrigger value="orders" className="text-xs sm:text-sm">{t('dashboard.orders')}</TabsTrigger>
            {isFarmer && (
              <TabsTrigger value="products" className="text-xs sm:text-sm">{t('dashboard.products')}</TabsTrigger>
            )}
            {!isFarmer && (
              <TabsTrigger value="event-bookings" className="text-xs sm:text-sm">{t('dashboard.eventBookings')}</TabsTrigger>
            )}
            {isFarmer && (
              <TabsTrigger value="zbnf" className="text-xs sm:text-sm">{t('dashboard.zbnfRecommendations')}</TabsTrigger>
            )}
            {isFarmer && (
              <TabsTrigger value="events" className="text-xs sm:text-sm">{t('dashboard.farmEvents')}</TabsTrigger>
            )}
            {isFarmer && (
              <TabsTrigger value="my-fpos" className="text-xs sm:text-sm">My FPOs</TabsTrigger>
            )}
            {isFarmer && (
              <TabsTrigger value="my-reviews" className="text-xs sm:text-sm">My Reviews</TabsTrigger>
            )}
            <TabsTrigger value="profile" className="text-xs sm:text-sm">{t('dashboard.profile')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            {isFarmer ? (
              <div className="space-y-6">
                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Total Earnings Card */}
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">{t('dashboard.totalEarnings')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{formatIndianCurrency(grandTotalRevenue)}</div>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-emerald-600">Orders: {formatIndianCurrency(regularOrderEarnings)}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-purple-600">Events: {formatIndianCurrency(eventBookingRevenue)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Total Orders Card */}
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">{t('dashboard.totalOrders')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{totalOrders}</div>
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <span className="text-green-600">{completedOrders} {t('dashboard.completed')}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-yellow-600">{pendingOrders} {t('dashboard.pending')}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Total Products Card */}
                  <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">{t('dashboard.myProducts')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">{totalProducts}</div>
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <span className="text-green-600">{activeProductsCount} {t('dashboard.active')}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-yellow-600">{pendingProducts} {t('dashboard.pending')}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Event Bookings Card */}
                  <Card className="border-l-4 border-l-pink-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">{t('dashboard.eventBookings')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-pink-600">{totalEventBookings}</div>
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <span className="text-green-600">{paidBookings} {t('dashboard.paid')}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-blue-600">{totalSeatsBooked} {t('dashboard.seats')}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Product & Earnings Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Product Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-purple-600" />
                        {t('dashboard.productStatus')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">{t('dashboard.activeProducts')}</span>
                          <span className="text-lg font-bold text-green-600">{activeProductsCount}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">{t('dashboard.pendingApproval')}</span>
                          <span className="text-lg font-bold text-yellow-600">{pendingProducts}</span>
                        </div>
                        {rejectedProducts > 0 && (
                          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">{t('dashboard.rejected')}</span>
                            <span className="text-lg font-bold text-red-600">{rejectedProducts}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Earnings Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        {t('dashboard.revenueBreakdown')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">{t('dashboard.totalRevenue')}</div>
                          <div className="text-3xl font-bold text-green-600">{formatIndianCurrency(grandTotalRevenue)}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="text-xs text-gray-600 mb-1">{t('dashboard.retailSales')}</div>
                            <div className="text-lg font-bold text-blue-600">{formatIndianCurrency(retailEarnings)}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {grandTotalRevenue > 0 ? Math.round((retailEarnings / grandTotalRevenue) * 100) : 0}%
                            </div>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="text-xs text-gray-600 mb-1">{t('dashboard.wholesaleSales')}</div>
                            <div className="text-lg font-bold text-green-600">{formatIndianCurrency(wholesaleEarnings)}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {grandTotalRevenue > 0 ? Math.round((wholesaleEarnings / grandTotalRevenue) * 100) : 0}%
                            </div>
                          </div>
                          <div className="p-3 bg-pink-50 rounded-lg">
                            <div className="text-xs text-gray-600 mb-1">{t('dashboard.eventBookings')}</div>
                            <div className="text-lg font-bold text-pink-600">{formatIndianCurrency(eventBookingRevenue)}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {grandTotalRevenue > 0 ? Math.round((eventBookingRevenue / grandTotalRevenue) * 100) : 0}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity & NF Plans */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Recent Orders */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ShoppingCart className="h-5 w-5 text-blue-600" />
                          Recent Orders
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <OrderList limit={5} />
                        <div className="mt-4">
                          <Button variant="outline" onClick={() => setActiveTab("orders")} className="w-full">
                            View All Orders
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Event Bookings */}
                    {totalEventBookings > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Ticket className="h-5 w-5 text-pink-600" />
                            Recent Event Bookings
                          </CardTitle>
                          <CardDescription>{totalEventBookings} bookings across {totalEvents} events</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {allBookings.slice(0, 5).map((booking: any) => (
                              <div key={booking.id} className="flex items-center justify-between p-3 bg-pink-50 rounded-lg border border-pink-100">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                                    <User className="h-5 w-5 text-pink-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{booking.customerName || booking.customer?.name || 'Customer'}</p>
                                    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                                      {(booking.customerPhone || booking.customer?.phone) && (
                                        <span className="flex items-center gap-1">
                                          <Phone className="h-3 w-3 text-green-600" />
                                          {booking.customerPhone || booking.customer?.phone}
                                        </span>
                                      )}
                                      {(booking.customerEmail || booking.customer?.email) && (
                                        <span className="flex items-center gap-1">
                                          <Mail className="h-3 w-3 text-blue-600" />
                                          {(booking.customerEmail || booking.customer?.email)?.split('@')[0]}...
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge variant={booking.paymentStatus === 'paid' ? 'default' : 'secondary'} className="text-xs">
                                    {booking.paymentStatus || 'pending'}
                                  </Badge>
                                  <p className="text-xs text-gray-500 mt-1">{booking.numSeats || 1} seat(s)</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4">
                            <Button variant="outline" onClick={() => setActiveTab("events")} className="w-full">
                              View All Event Bookings
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                  </div>

                  {/* Sidebar - Account & ZBNF */}
                  <div className="space-y-6">
                    {/* Account Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Account Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center mb-4">
                          <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3">
                            <User className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Member Since</span>
                            <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">District</span>
                            <span className="font-medium">{user.district || 'N/A'}</span>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          className="w-full mt-4"
                          size="sm"
                          onClick={() => setActiveTab("profile")}
                        >
                          Edit Profile
                        </Button>
                      </CardContent>
                    </Card>

                    {/* NF Plans */}
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Sprout className="h-5 w-5 text-green-600" />
                          NF Plans
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-2">
                          <div className="text-3xl font-bold text-green-600 mb-1">{savedPlans.length}</div>
                          <div className="text-sm text-gray-600 mb-4">Saved Recommendations</div>
                          <Button asChild size="sm" className="w-full">
                            <Link href="/zbnf-recommendations">
                              <Sparkles className="h-4 w-4 mr-2" />
                              View NF Plans
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ) : (
              // Customer Overview
              (() => {
                const sub = subscriptionData?.subscription;
                const orders = customerOrders || [];
                const deliveredCount = orders.filter((o: any) => o.status === 'delivered').length;
                const totalSpent = orders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);
                
                return (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="border-l-4 border-l-amber-500">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Subscription</p>
                              {sub ? (
                                <>
                                  <h3 className="text-lg font-bold text-amber-700 mt-1">{sub.plan?.name || sub.plan?.tier || 'Active'}</h3>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Expires {new Date(sub.endDate).toLocaleDateString()}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <h3 className="text-lg font-bold text-gray-500 mt-1">No Plan</h3>
                                  <p className="text-xs text-gray-400 mt-1">
                                    <Link href="/subscription" className="text-amber-600 hover:underline">Subscribe now</Link>
                                  </p>
                                </>
                              )}
                            </div>
                            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                              <Crown className="h-6 w-6 text-amber-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Total Orders</p>
                              <h3 className="text-3xl font-bold text-blue-600 mt-1">{orders.length}</h3>
                              <p className="text-xs text-green-600 mt-1">{deliveredCount} delivered</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                              <ShoppingCart className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-green-500">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Total Spent</p>
                              <h3 className="text-2xl font-bold text-green-600 mt-1">{formatIndianCurrency(totalSpent)}</h3>
                              <p className="text-xs text-gray-500 mt-1">Lifetime purchases</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                              <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-purple-500">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Member Since</p>
                              <h3 className="text-lg font-bold text-gray-700 mt-1">{new Date(user.createdAt).toLocaleDateString()}</h3>
                              <p className="text-xs text-gray-500 mt-1">{user.district || 'Customer'}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                              <User className="h-6 w-6 text-purple-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-6">
                        <div>
                          <h2 className="text-xl font-medium mb-4">Recent Orders</h2>
                          <OrderList limit={5} />
                          <div className="mt-4">
                            <Button variant="outline" onClick={() => setActiveTab("orders")}>
                              View All Orders
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Account</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center mb-4">
                              <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-4">
                                <User className="h-6 w-6" />
                              </div>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => setActiveTab("profile")}
                            >
                              Edit Profile
                            </Button>
                          </CardContent>
                        </Card>

                        {sub && sub.plan?.zeroPlatformFee && (
                          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
                            <CardContent className="pt-6">
                              <div className="flex items-center gap-2 mb-2">
                                <Shield className="h-5 w-5 text-amber-600" />
                                <span className="font-semibold text-amber-800">0% Platform Fee</span>
                              </div>
                              <p className="text-xs text-amber-700">
                                Your {sub.plan.name} subscription gives you zero platform fees on all purchases.
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()
            )}
          </TabsContent>
          
          <TabsContent value="orders">
            <h2 className="text-xl font-medium mb-6">Your Orders</h2>
            <OrderList />
          </TabsContent>
          
          {isFarmer && (
            <TabsContent value="products">
              <h2 className="text-xl font-medium mb-6">Your Products</h2>
              <ProductManagement />
            </TabsContent>
          )}
          
          {isFarmer && (
            <TabsContent value="zbnf">
              <h2 className="text-xl font-medium mb-6">Natural Farming Recommendations</h2>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center py-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Natural Farming Recommendations</h3>
                  <p className="text-gray-600 mb-6">
                    Get AI-powered crop recommendations based on your farm's specific conditions using the Natural Farming 5-layer system.
                  </p>
                  <Button asChild>
                    <Link href="/zbnf-recommendations">
                      Start NF Analysis
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
          )}
          
          {/* Event Bookings Tab - Customer Only */}
          {!isFarmer && (
            <TabsContent value="event-bookings">
              <CustomerEventBookingsTab />
            </TabsContent>
          )}
          
          {/* Farm Events Tab - Farmer Only */}
          {isFarmer && (
            <TabsContent value="events">
              <FarmerEventsTab />
            </TabsContent>
          )}
          
          {isFarmer && (
            <TabsContent value="my-fpos">
              <FarmerFpoSection />
            </TabsContent>
          )}
          {isFarmer && (
            <TabsContent value="my-reviews">
              <FarmerReviewsTab />
            </TabsContent>
          )}
          <TabsContent value="profile">
            <h2 className="text-xl font-medium mb-6">Your Profile</h2>
            {isFarmer ? <FarmerProfileNew /> : <CustomerProfile />}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

// Customer Event Bookings Tab Component
function CustomerEventBookingsTab() {
  const { user, viewingAs } = useAuth();
  
  const { data: bookings, isLoading } = useQuery<any[]>({
    queryKey: ['/api/my-event-bookings'],
    queryFn: async () => {
      const token = getAuthToken();
      const response = await fetch('/api/my-event-bookings', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response.json();
    },
    enabled: !!user && viewingAs === 'customer',
    staleTime: 0,
    refetchOnMount: 'always',
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Ticket className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No event bookings yet</p>
          <p className="text-sm text-gray-400 mt-2">
            Browse farm events to book exciting agricultural experiences
          </p>
          <div className="mt-4">
            <Button asChild>
              <Link href="/events">Browse Farm Events</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-purple-600" />
            My Event Bookings ({bookings.length})
          </CardTitle>
          <CardDescription>
            Your farm event reservations and experiences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.map((booking: any) => (
              <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    {booking.event?.coverImage && (
                      <img 
                        src={booking.event.coverImage} 
                        alt={booking.event?.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{booking.event?.title || 'Event'}</h3>
                        <Badge variant={
                          booking.paymentStatus === 'paid' ? 'default' :
                          booking.status === 'cancelled' ? 'destructive' :
                          'secondary'
                        }>
                          {booking.paymentStatus === 'paid' ? 'Confirmed' : 
                           booking.status === 'cancelled' ? 'Cancelled' : 'Pending Payment'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {booking.event?.location || 'Location not specified'}
                        </p>
                        <p className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(booking.bookingDate).toLocaleDateString('en-IN', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {booking.event?.startTime || '09:00'} - {booking.event?.endTime || '17:00'}
                        </p>
                        <p className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {booking.numSeats || 1} seat(s)
                        </p>
                        <p className="font-semibold text-green-600">
                          Total: {formatIndianCurrency(parseFloat(booking.totalAmount || '0'))}
                        </p>
                      </div>
                      {booking.specialRequests && (
                        <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                          <strong>Special Requests:</strong> {booking.specialRequests}
                        </div>
                      )}
                      
                      {/* Approved DM Details */}
                      {booking.event?.districtManager && (
                        <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                          <h4 className="font-medium text-purple-800 flex items-center gap-2 mb-2">
                            <Shield className="h-4 w-4" />
                            Event Approved By
                          </h4>
                          <div className="text-sm space-y-1 text-gray-700">
                            <p className="font-semibold">{booking.event.districtManager.name}</p>
                            {booking.event.districtManager.orgName && (
                              <p className="flex items-center gap-1">
                                <Building className="h-4 w-4 text-purple-600" />
                                {booking.event.districtManager.orgName}
                              </p>
                            )}
                            {booking.event.districtManager.orgAddress && (
                              <p className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-purple-600" />
                                {booking.event.districtManager.orgAddress}
                              </p>
                            )}
                            {booking.event.districtManager.orgPhone && (
                              <p className="flex items-center gap-1">
                                <Phone className="h-4 w-4 text-purple-600" />
                                {booking.event.districtManager.orgPhone}
                              </p>
                            )}
                            {booking.event.districtManager.district && (
                              <p className="text-xs text-purple-600 mt-1">
                                District: {booking.event.districtManager.district}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/events/${booking.eventId}`}>
                        View Event
                      </Link>
                    </Button>
                    {booking.paymentStatus !== 'paid' && booking.status !== 'cancelled' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" asChild>
                        <Link href={`/events/checkout/${booking.id}`}>
                          <CreditCard className="h-4 w-4 mr-1" />
                          Pay Now
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Farmer Events Tab Component
function FarmerEventsTab() {
  const { t } = useTranslation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [eventStatusTab, setEventStatusTab] = useState<"pending" | "approved" | "rejected" | "expired">("pending");
  const [selectedEventForBookings, setSelectedEventForBookings] = useState<any>(null);
  const [showBookingsDialog, setShowBookingsDialog] = useState(false);
  
  const { data: pendingEvents, isLoading: pendingLoading, refetch: refetchPending } = useQuery<any[]>({
    queryKey: ["/api/farmer/events", "pending"],
    queryFn: async () => {
      const token = getAuthToken();
      const response = await fetch("/api/farmer/events?status=pending", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response.json();
    },
    staleTime: 0,
    refetchOnMount: 'always'
  });
  
  const { data: approvedEvents, isLoading: approvedLoading, refetch: refetchApproved } = useQuery<any[]>({
    queryKey: ["/api/farmer/events", "approved"],
    queryFn: async () => {
      const token = getAuthToken();
      const response = await fetch("/api/farmer/events?status=approved", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response.json();
    },
    staleTime: 0,
    refetchOnMount: 'always',
    enabled: eventStatusTab === 'approved'
  });
  
  const { data: rejectedEvents, isLoading: rejectedLoading, refetch: refetchRejected } = useQuery<any[]>({
    queryKey: ["/api/farmer/events", "rejected"],
    queryFn: async () => {
      const token = getAuthToken();
      const response = await fetch("/api/farmer/events?status=rejected", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response.json();
    },
    staleTime: 0,
    refetchOnMount: 'always',
    enabled: eventStatusTab === 'rejected'
  });
  
  const { data: expiredEvents, isLoading: expiredLoading, refetch: refetchExpired } = useQuery<any[]>({
    queryKey: ["/api/farmer/events", "expired"],
    queryFn: async () => {
      const token = getAuthToken();
      const response = await fetch("/api/farmer/events?status=expired", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response.json();
    },
    staleTime: 0,
    refetchOnMount: 'always',
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Your Farm Events</h2>
          <p className="text-sm text-gray-500">Host farm experiences and connect with visitors</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-green-600 hover:bg-green-700"
        >
          {showCreateForm ? t('createEvent.cancel') : t('createEvent.createNewEvent')}
        </Button>
      </div>

      {showCreateForm && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle>{t('createEvent.title')}</CardTitle>
            <CardDescription>
              {t('createEvent.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateEventForm onSuccess={() => setShowCreateForm(false)} />
          </CardContent>
        </Card>
      )}

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
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : events && events.length > 0 ? (
            <div className="grid gap-4">
              {events.map((event: any) => (
            <Card key={event.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {event.coverImage ? (
                    <img 
                      src={event.coverImage} 
                      alt={event.title}
                      className="h-24 w-24 object-cover rounded"
                    />
                  ) : (
                    <div className="h-24 w-24 bg-green-100 rounded flex items-center justify-center">
                      <Calendar className="h-8 w-8 text-green-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </p>
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
                    {event.dates && event.dates.length > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">Event Dates ({event.dates.length}):</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {event.dates.slice(0, 8).map((date: any) => (
                            <Badge key={date.id} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              {new Date(date.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                            </Badge>
                          ))}
                          {event.dates.length > 8 && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">+{event.dates.length - 8} more</Badge>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {event.startTime} - {event.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {event.totalSeats} seats
                      </span>
                      <span className="font-medium text-green-600">
                        {formatIndianCurrency(parseFloat(event.pricePerSeat))}
                      </span>
                    </div>
                    {/* DM Approval Details for approved events */}
                    {event.status === 'live' && event.dm && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-800 flex items-center gap-2 mb-2">
                          <UserCheck className="h-4 w-4" />
                          Approved by DM
                        </h4>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{event.dm.name || event.dm.email}</p>
                              {event.dm.phone && (
                                <p className="text-gray-500 text-xs flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {event.dm.phone}
                                </p>
                              )}
                            </div>
                          </div>
                          {event.dm.email && (
                            <div className="ml-auto text-xs text-blue-600">
                              {event.dm.email}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {event.bookings && event.bookings.length > 0 && (
                      <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-purple-800 flex items-center gap-2">
                            <Ticket className="h-4 w-4" />
                            Customer Bookings ({event.bookings.length})
                          </h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-purple-100 text-purple-800">
                              {event.bookings.reduce((sum: number, b: any) => sum + (b.numSeats || 1), 0)} seats booked
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedEventForBookings(event);
                                setShowBookingsDialog(true);
                              }}
                              className="bg-white hover:bg-purple-100"
                              title="View Booking Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    {event.status === 'rejected' && event.rejectionReason && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                        Rejection reason: {event.rejectionReason}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700">
                  {eventStatusTab === 'pending' ? 'No pending events' :
                   eventStatusTab === 'approved' ? 'No approved events' :
                   eventStatusTab === 'rejected' ? 'No rejected events' :
                   'No expired events'}
                </h3>
                <p className="text-gray-500 mt-2">
                  {eventStatusTab === 'pending' ? 'Events you create will appear here while awaiting approval' :
                   eventStatusTab === 'approved' ? 'Your approved events will appear here' :
                   eventStatusTab === 'rejected' ? 'Rejected events will appear here with feedback' :
                   'Past events will appear here after their dates have passed'}
                </p>
                {eventStatusTab === 'pending' && !showCreateForm && (
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    className="mt-4 bg-green-600 hover:bg-green-700"
                  >
                    Create Your First Event
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Booking Details Dialog */}
      <Dialog open={showBookingsDialog} onOpenChange={setShowBookingsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-purple-600" />
              Customer Bookings - {selectedEventForBookings?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedEventForBookings?.bookings && selectedEventForBookings.bookings.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="font-medium text-purple-800">Total Bookings: {selectedEventForBookings.bookings.length}</span>
                <Badge className="bg-purple-600">
                  {selectedEventForBookings.bookings.reduce((sum: number, b: any) => sum + (b.numSeats || 1), 0)} seats booked
                </Badge>
              </div>
              <div className="space-y-2">
                {selectedEventForBookings.bookings.map((booking: any) => (
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
    </div>
  );
}

// Create Event Form Component
function CreateEventForm({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("");
  const [cropType, setCropType] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [totalSeats, setTotalSeats] = useState("30");
  const [pricePerSeat, setPricePerSeat] = useState("");
  const [eventDate, setEventDate] = useState("");

  // Fetch event types from admin-controlled API
  const { data: eventTypesData } = useQuery<{ eventTypes: string[] }>({
    queryKey: ["/api/events/types"],
  });

  const eventTypes = eventTypesData?.eventTypes || [];
  const farmerDistrict = user?.district || "Not specified";

  const createMutation = useMutation({
    mutationFn: async (eventData: any) => {
      const response = await apiRequest("POST", "/api/events", eventData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farmer/events"] });
      toast({
        title: t('createEvent.eventCreated'),
        description: t('createEvent.eventCreatedDesc'),
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: t('farmerProfile.error'),
        description: error.message || "Failed to create event",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventDate) {
      toast({
        title: t('createEvent.addEventDates'),
        description: t('createEvent.addEventDatesHelp'),
        variant: "destructive"
      });
      return;
    }

    createMutation.mutate({
      title,
      description,
      eventType,
      cropType: cropType || null,
      location: farmerDistrict,
      address: farmerDistrict,
      startTime,
      endTime,
      totalSeats: parseInt(totalSeats),
      pricePerSeat,
      eventDates: [eventDate] // Send as array with single date for backend compatibility
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">{t('createEvent.eventTitle')} *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('createEvent.eventTitlePlaceholder')}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('createEvent.eventType')} *</label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">{t('createEvent.selectEventType')}</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('createEvent.cropType')}</label>
          <input
            type="text"
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
            placeholder={t('createEvent.cropTypePlaceholder')}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">{t('createEvent.eventDescription')} *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('createEvent.eventDescriptionPlaceholder')}
            className="w-full px-3 py-2 border rounded-md"
            rows={3}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">{t('createEvent.district')}</label>
          <div className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-700">
            {farmerDistrict}
          </div>
          <p className="text-xs text-gray-500 mt-1">{t('createEvent.districtHelp')}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('createEvent.startTime')} *</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('createEvent.endTime')} *</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('createEvent.totalSeats')} *</label>
          <input
            type="number"
            value={totalSeats}
            onChange={(e) => setTotalSeats(e.target.value)}
            min="1"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('createEvent.pricePerSeat')} *</label>
          <input
            type="number"
            value={pricePerSeat}
            onChange={(e) => setPricePerSeat(e.target.value)}
            min="0"
            step="0.01"
            placeholder={t('createEvent.pricePerSeatPlaceholder')}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">{t('createEvent.eventDate')} *</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          className="bg-green-600 hover:bg-green-700"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('createEvent.creating')}
            </>
          ) : (
            t('createEvent.submitForApproval')
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onSuccess}>
          {t('createEvent.cancel')}
        </Button>
      </div>
    </form>
  );
}

interface FpoData {
  dmUserId: number;
  dmName: string;
  dmDistrict: string | null;
  orgName: string | null;
  orgAddress: string | null;
  orgPhone: string | null;
  orgEmail: string | null;
  orgLogoUrl: string | null;
}

interface LinkedFpo extends FpoData {
  id: number;
  status: string;
  createdAt: string;
}

interface FarmerFpoResponse {
  linked: LinkedFpo[];
  pending: FpoData[];
  available: FpoData[];
  maxLinks: number;
  currentCount: number;
  farmerDistrict: string | null;
}

function FpoCard({ fpo, children, showContact }: { fpo: FpoData; children: React.ReactNode; showContact?: boolean }) {
  return (
    <Card className="border">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3 mb-3">
          {fpo.orgLogoUrl ? (
            <img src={fpo.orgLogoUrl} alt={fpo.orgName || ""} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Building className="h-6 w-6 text-gray-500" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{fpo.orgName || fpo.dmName}</h4>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {fpo.dmDistrict || "N/A"}
            </p>
            {showContact && fpo.orgPhone && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {fpo.orgPhone}
              </p>
            )}
            {showContact && fpo.orgEmail && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                <Mail className="h-3 w-3" />
                {fpo.orgEmail}
              </p>
            )}
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function FarmerFpoSection() {
  const [districtFilter, setDistrictFilter] = useState<string>("all");

  const { data, isLoading, refetch } = useQuery<FarmerFpoResponse>({
    queryKey: ["/api/farmer/fpos"],
  });

  const refreshFpoData = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/farmer/fpos"] });
    refetch();
  };

  const requestMutation = useMutation({
    mutationFn: async (dmUserId: number) => {
      const res = await apiRequest("POST", "/api/farmer/fpos", { dmUserId });
      return res.json();
    },
    onSuccess: (_, dmUserId) => {
      const fpo = data?.available.find(f => f.dmUserId === dmUserId);
      refreshFpoData();
      toast({ title: "Request sent!", description: `Your join request has been sent to ${fpo?.orgName || "the FPO"}. Awaiting their approval.` });
    },
    onError: (error: any) => {
      toast({ title: "Failed to send request", description: error.message, variant: "destructive" });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: async (dmUserId: number) => {
      const res = await apiRequest("DELETE", `/api/farmer/fpos/${dmUserId}`);
      return res.json();
    },
    onSuccess: () => {
      refreshFpoData();
      toast({ title: "Request withdrawn" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to withdraw", description: error.message, variant: "destructive" });
    },
  });

  const unlinkMutation = useMutation({
    mutationFn: async (dmUserId: number) => {
      const res = await apiRequest("DELETE", `/api/farmer/fpos/${dmUserId}`);
      return res.json();
    },
    onSuccess: () => {
      refreshFpoData();
      toast({ title: "Unlinked from FPO successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to unlink", description: error.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const linked = data?.linked || [];
  const pending = data?.pending || [];
  const available = data?.available || [];
  const currentCount = data?.currentCount || 0;

  const availableDistricts = [...new Set(available.map(f => f.dmDistrict).filter(Boolean))].sort() as string[];
  const filteredAvailable = districtFilter === "all" ? available : available.filter(f => f.dmDistrict === districtFilter);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium mb-1">My FPOs</h2>
        <p className="text-muted-foreground text-sm">
          Browse and request to join any FPO across all districts. You can link to as many FPOs as you like.
          Currently approved: <span className="font-medium text-foreground">{currentCount}</span>
        </p>
      </div>

      {/* Approved / Linked FPOs */}
      {linked.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              Linked FPOs
              <Badge className="bg-green-100 text-green-700 border-green-200">{linked.length}</Badge>
            </CardTitle>
            <CardDescription>FPOs that have approved your membership</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {linked.map((fpo) => (
                <FpoCard key={fpo.dmUserId} fpo={fpo} showContact>
                  <div className="flex gap-2">
                    <Badge className="bg-green-100 text-green-700 border-green-200 text-xs flex-1 justify-center py-1">
                      <UserCheck className="h-3 w-3 mr-1" /> Approved
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200 px-2"
                      onClick={() => unlinkMutation.mutate(fpo.dmUserId)}
                      disabled={unlinkMutation.isPending}
                      title="Leave this FPO"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </FpoCard>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Requests */}
      {pending.length > 0 && (
        <Card className="border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Pending Requests
              <Badge className="bg-amber-100 text-amber-700 border-amber-200">{pending.length}</Badge>
            </CardTitle>
            <CardDescription>Awaiting approval from the FPO</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pending.map((fpo) => (
                <FpoCard key={fpo.dmUserId} fpo={fpo}>
                  <div className="flex gap-2">
                    <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs flex-1 justify-center py-1">
                      Request Sent — Awaiting Approval
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-500 hover:text-red-500 hover:bg-red-50 border-gray-200 px-2"
                      onClick={() => withdrawMutation.mutate(fpo.dmUserId)}
                      disabled={withdrawMutation.isPending}
                      title="Withdraw request"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </FpoCard>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available FPOs — All Districts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-600" />
            All FPOs — Request to Join
            {available.length > 0 && <Badge variant="outline">{filteredAvailable.length} of {available.length}</Badge>}
          </CardTitle>
          <CardDescription>
            Browse FPOs from any district and send a join request. You'll be linked once they approve.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* District filter */}
          {availableDistricts.length > 1 && (
            <div className="mb-4">
              <Select value={districtFilter} onValueChange={setDistrictFilter}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Filter by district" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts ({available.length})</SelectItem>
                  {availableDistricts.map(d => (
                    <SelectItem key={d} value={d}>
                      {d} ({available.filter(f => f.dmDistrict === d).length})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {available.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {linked.length > 0 || pending.length > 0
                  ? "You have requested or joined all available FPOs."
                  : "No FPO organizations are registered on the platform yet."}
              </p>
            </div>
          ) : filteredAvailable.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No FPOs available in {districtFilter}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAvailable.map((fpo) => (
                <FpoCard key={fpo.dmUserId} fpo={fpo}>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => requestMutation.mutate(fpo.dmUserId)}
                    disabled={requestMutation.isPending}
                  >
                    {requestMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <UserPlus className="h-4 w-4 mr-1" />
                    )}
                    Request to Join
                  </Button>
                </FpoCard>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Farmer Reviews Tab ─────────────────────────────────────────────────────

interface FarmerReview {
  id: number;
  type: 'product' | 'farmer_profile';
  contextName: string;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerAvatar: string | null;
  createdAt: string;
}

interface FarmerReviewsResponse {
  reviews: FarmerReview[];
  totalCount: number;
  avgRating: number;
}

function FarmerReviewsTab() {
  const [filter, setFilter] = useState<'all' | 'product' | 'farmer_profile'>('all');

  const { data, isLoading } = useQuery<FarmerReviewsResponse>({
    queryKey: ['/api/farmer/reviews'],
    queryFn: async () => {
      const token = getAuthToken();
      const res = await fetch('/api/farmer/reviews', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to load reviews');
      return res.json();
    },
  });

  const filtered = (data?.reviews || []).filter(r => filter === 'all' || r.type === filter);
  const avgRating = data?.avgRating || 0;
  const totalCount = data?.totalCount || 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                My Reviews
              </CardTitle>
              <CardDescription>
                All customer reviews on your products and your farmer profile.
              </CardDescription>
            </div>
            {totalCount > 0 && (
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">{avgRating.toFixed(1)}</div>
                <div className="flex justify-center text-amber-400 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(avgRating) ? 'fill-amber-400' : 'fill-none'}`} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{totalCount} total reviews</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-3 flex-wrap">
            {(['all', 'product', 'farmer_profile'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filter === f
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'all'
                  ? `All (${totalCount})`
                  : f === 'product'
                  ? `Products (${(data?.reviews || []).filter(r => r.type === 'product').length})`
                  : `Profile (${(data?.reviews || []).filter(r => r.type === 'farmer_profile').length})`}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length > 0 ? (
            <div className="space-y-4">
              {filtered.map(review => (
                <div key={`${review.type}-${review.id}`} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {review.reviewerAvatar ? (
                          <img src={review.reviewerAvatar} alt={review.reviewerName} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <span className="text-green-700 font-medium text-sm">
                            {review.reviewerName?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{review.reviewerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-amber-400' : 'fill-none'}`} />
                        ))}
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        review.type === 'product'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {review.type === 'product' ? '🛒 Product' : '👤 Profile'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    {review.type === 'product' ? '📦' : '🌾'} {review.contextName}
                  </p>
                  <p className="text-sm text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-600 mb-1">No Reviews Yet</h3>
              <p className="text-sm text-muted-foreground">
                Customer reviews on your products and profile will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
