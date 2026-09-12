import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Order, OrderItem, Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatIndianCurrency } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { Truck, Wallet, FileText } from "lucide-react";
import { addDays, parseISO, format } from "date-fns";

interface OrderListProps {
  limit?: number;
}

export default function OrderList({ limit }: OrderListProps) {
  const { viewingAs } = useAuth();
  const isFarmer = viewingAs === "farmer";
  const isDistrictManager = viewingAs === "district_manager";
  
  // Choose the correct endpoint based on user role
  const getOrdersEndpoint = () => {
    if (isFarmer) return "/api/orders/farmer";
    if (isDistrictManager) return "/api/admin/orders/district";
    return "/api/orders";
  };
  
  const { data: orders, isLoading, error } = useQuery<Order[]>({
    queryKey: [getOrdersEndpoint()],
    queryFn: async ({ queryKey }) => {
      try {
        const response = await apiRequest("GET", queryKey[0] as string);
        return await response.json();
      } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }
    },
  });
  
  const calculateFarmerPayout = (order: any): number | null => {
    if (!order.items || order.items.length === 0) return null;
    
    const subtotal = order.items.reduce((sum: number, item: any) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : (item.price || 0);
      const quantity = item.quantity || 0;
      return sum + (price * quantity);
    }, 0);
    
    if (isNaN(subtotal) || subtotal === 0) return null;
    return subtotal;
  };

  const displayOrders = Array.isArray(orders) ? (limit ? orders.slice(0, limit) : orders) : [];
  
  // Get estimated delivery date — reads from stored column first, then notes, then falls back to calculation
  const getEstimatedDeliveryDate = (order: Order): string => {
    if (order.status.toLowerCase() === 'delivered' || order.status.toLowerCase() === 'cancelled' || order.status.toLowerCase() === 'canceled') {
      return '';
    }
    
    try {
      // 1. Use the stored column (set at order creation time — never changes)
      if ((order as any).estimatedDeliveryDate) {
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
                : new Date(order.createdAt);
              return addDays(orderDate, 1);
            } else if (item.product.status === 'Pre-Order' && item.product.harvestDate) {
              const harvestDate = typeof item.product.harvestDate === 'string'
                ? parseISO(item.product.harvestDate)
                : new Date(item.product.harvestDate);
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
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "growing":
        return "bg-green-100 text-green-800";
      case "harvested":
        return "bg-orange-100 text-orange-800";
      case "packaging":
        return "bg-indigo-100 text-indigo-800";
      case "shipping":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-emerald-100 text-emerald-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[...Array(limit || 5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div>
                  <Skeleton className="h-5 w-36 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <p className="text-red-500">Error loading orders</p>
            <Button variant="outline" className="mt-4">Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!displayOrders || displayOrders.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No orders found</p>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              {isFarmer && <TableHead>Customer</TableHead>}
              <TableHead>{isFarmer ? "Subtotal" : "Total"}</TableHead>
              {isDistrictManager && <TableHead>Pay to Farmer</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Est. Delivery</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                {isFarmer && <TableCell>{order.customerName}</TableCell>}
                <TableCell>
                  {isFarmer 
                    ? (order.items && order.items.length > 0)
                      ? formatIndianCurrency(
                          order.items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0)
                        )
                      : "N/A"
                    : formatIndianCurrency(Number(order.total))
                  }
                </TableCell>
                {isDistrictManager && (
                  <TableCell>
                    <div className="flex items-center text-orange-600 font-medium">
                      <Wallet className="h-3 w-3 mr-1" />
                      {calculateFarmerPayout(order) !== null 
                        ? formatIndianCurrency(calculateFarmerPayout(order)!)
                        : '—'
                      }
                    </div>
                  </TableCell>
                )}
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {order.paymentMethod === "cod" ? (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 hover:bg-orange-50">
                      COD
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                      Online
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {order.status.toLowerCase() !== 'delivered' && order.status.toLowerCase() !== 'cancelled' && (
                    <div className="flex items-center text-xs text-green-700 font-medium">
                      <Truck className="h-3 w-3 mr-1" />
                      {getEstimatedDeliveryDate(order)}
                    </div>
                  )}
                  {(order.status.toLowerCase() === 'delivered') && (
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Delivered
                    </Badge>
                  )}
                  {(order.status.toLowerCase() === 'cancelled') && (
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      Cancelled
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {isDistrictManager && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-700 border-green-200 hover:bg-green-50 px-2"
                        onClick={async () => {
                          try {
                            let token: string | null = null;
                            try {
                              const raw = localStorage.getItem('harvest_direct_auth');
                              if (raw) token = JSON.parse(raw)?.token ?? null;
                            } catch {}
                            const r = await fetch(`/api/dm/orders/${order.id}/bill-pdf`, {
                              headers: token ? { Authorization: `Bearer ${token}` } : {},
                            });
                            if (!r.ok) throw new Error(`Failed: ${r.status}`);
                            const blob = await r.blob();
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url; a.download = `order_${order.id}_bill.pdf`; a.click();
                            setTimeout(() => URL.revokeObjectURL(url), 5000);
                          } catch (e: any) {
                            alert('Could not download bill: ' + e.message);
                          }
                        }}
                        title="Download Bill / Shipping Label"
                      >
                        <FileText className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
