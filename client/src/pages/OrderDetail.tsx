import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Order, OrderFee } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatIndianCurrency } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Truck, RotateCcw, Upload, X, CheckCircle, Clock, XCircle, AlertCircle, FileText } from "lucide-react";
import { addDays, parseISO, format, differenceInHours } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const RETURN_REASONS = [
  { value: "damaged", label: "Product was damaged" },
  { value: "wrong_product", label: "Wrong product delivered" },
  { value: "quality_issue", label: "Quality not as expected" },
  { value: "missing_items", label: "Items were missing" },
  { value: "quantity_mismatch", label: "Quantity was incorrect" },
  { value: "other", label: "Other reason" },
];

function ReturnStatusBadge({ status }: { status: string }) {
  if (status === "pending") return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>;
  if (status === "fpo_accepted") return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Accepted by FPO</Badge>;
  if (status === "fpo_rejected") return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="h-3 w-3 mr-1" />Rejected by FPO</Badge>;
  return <Badge variant="outline">{status}</Badge>;
}

export default function OrderDetail() {
  const { id } = useParams();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { viewingAs, user } = useAuth();
  const isFarmer = viewingAs === "farmer";
  const isCustomer = !isFarmer && user?.role !== "admin" && user?.role !== "district_manager";
  const [status, setStatus] = useState<string>("");

  // Return request dialog state
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [returnDescription, setReturnDescription] = useState("");
  const [returnPhotos, setReturnPhotos] = useState<string[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const calculateSubtotal = (order: Order): number => {
    if (!order.items || order.items.length === 0) return 0;
    return order.items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  };

  const calculateFees = (subtotal: number): { fee: OrderFee; amount: number }[] => {
    if (!orderFees || orderFeesLoading) return [];
    const calculatedFees: { fee: OrderFee; amount: number }[] = [];
    let calculationBase = subtotal;
    const sortedFees = [...orderFees].sort((a, b) => a.displayOrder - b.displayOrder);
    sortedFees.forEach(fee => {
      if (fee.isActive && !fee.applyToSubtotal) {
        const feeValue = parseFloat(fee.value);
        let amount = 0;
        if (fee.type === "fixed") amount = feeValue;
        else if (fee.type === "percentage") amount = (subtotal * feeValue) / 100;
        calculatedFees.push({ fee, amount });
      }
    });
    sortedFees.forEach(fee => {
      if (fee.isActive && fee.applyToSubtotal) {
        const feeValue = parseFloat(fee.value);
        let amount = 0;
        if (fee.type === "fixed") amount = feeValue;
        else if (fee.type === "percentage") {
          amount = (calculationBase * feeValue) / 100;
          calculationBase += amount;
        }
        calculatedFees.push({ fee, amount });
      }
    });
    return calculatedFees;
  };

  const getEstimatedDeliveryDate = (order: Order): string | null => {
    if (order.status.toLowerCase() === 'delivered' || order.status.toLowerCase() === 'cancelled' || order.status.toLowerCase() === 'canceled') return null;
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
      // 3. Legacy fallback — calculate from current product status (may be stale)
      if (order.items && order.items.length > 0) {
        const deliveryDates = order.items.map(item => {
          if (item.product) {
            if (item.product.status === 'Available Now') {
              const orderDate = typeof order.createdAt === 'string' ? parseISO(order.createdAt) : new Date(order.createdAt);
              return addDays(orderDate, 1);
            } else if (item.product.status === 'Pre-Order' && item.product.harvestDate) {
              const harvestDate = typeof item.product.harvestDate === 'string' ? parseISO(item.product.harvestDate) : new Date(item.product.harvestDate);
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
      return null;
    } catch {
      return null;
    }
  };

  const { data: order, isLoading, error } = useQuery<Order>({
    queryKey: [`/api/orders/${id}`],
  });

  const { data: orderFees, isLoading: orderFeesLoading } = useQuery<OrderFee[]>({
    queryKey: ["/api/order-fees/active"],
  });

  // Fetch existing return request for this order
  const { data: myReturnRequests, refetch: refetchMyReturns } = useQuery<any[]>({
    queryKey: ["/api/return-requests/mine"],
    enabled: isCustomer && !!order && order.status === "delivered",
  });

  const existingReturnRequest = myReturnRequests?.find((r: any) => r.orderId === parseInt(id || "0"));

  // Is the 2-day return window still open?
  const isWithinReturnWindow = (() => {
    if (!order || order.status !== "delivered") return false;
    const deliveredAt = (order as any).deliveredAt;
    if (!deliveredAt) return false;
    const hoursElapsed = differenceInHours(new Date(), new Date(deliveredAt));
    return hoursElapsed <= 48;
  })();

  const hoursRemainingInWindow = (() => {
    if (!order || order.status !== "delivered") return 0;
    const deliveredAt = (order as any).deliveredAt;
    if (!deliveredAt) return 0;
    const hoursElapsed = differenceInHours(new Date(), new Date(deliveredAt));
    return Math.max(0, 48 - hoursElapsed);
  })();

  useEffect(() => {
    if (order) setStatus(order.status);
  }, [order]);

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const endpoint = isFarmer ? `/api/orders/farmer/${id}/status` : `/api/orders/${id}/status`;
      const res = await apiRequest("PUT", endpoint, { status: newStatus });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/orders/${id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/orders`] });
      queryClient.invalidateQueries({ queryKey: [`/api/orders/farmer`] });
      toast({ title: t('orderDetail.orderStatusUpdated'), description: t('orderDetail.orderStatusUpdatedDesc') });
    },
    onError: (error) => {
      toast({ title: t('orderDetail.errorUpdatingStatus'), description: (error as any).message || t('orderDetail.errorUpdatingStatusDesc'), variant: "destructive" });
    },
  });

  const submitReturnMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/orders/${id}/return-request`, {
        reason: returnReason,
        description: returnDescription,
        photos: returnPhotos,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/return-requests/mine"] });
      refetchMyReturns();
      setReturnDialogOpen(false);
      setReturnReason("");
      setReturnDescription("");
      setReturnPhotos([]);
      toast({ title: "Return request submitted", description: "Your FPO will review and respond within 2-3 business days." });
    },
    onError: (error: any) => {
      toast({ title: "Failed to submit return request", description: error.message || "Please try again.", variant: "destructive" });
    },
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (returnPhotos.length >= 3) {
      toast({ title: "Maximum 3 photos allowed", variant: "destructive" });
      return;
    }
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      let token: string | null = null;
      try {
        const authData = localStorage.getItem("harvest_direct_auth");
        if (authData) {
          const parsed = JSON.parse(authData);
          token = parsed?.token || null;
        }
      } catch { token = null; }
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      const data = await res.json();
      const uploadedUrl = data.imageUrl || data.url || data.publicUrl || data.secure_url;
      if (uploadedUrl) {
        setReturnPhotos(prev => [...prev, uploadedUrl]);
      } else {
        throw new Error("Upload failed");
      }
    } catch {
      toast({ title: "Photo upload failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "accepted": return "bg-blue-100 text-blue-800";
      case "growing": return "bg-green-100 text-green-800";
      case "harvested": return "bg-orange-100 text-orange-800";
      case "packaging": return "bg-indigo-100 text-indigo-800";
      case "shipping": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-emerald-100 text-emerald-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    updateStatusMutation.mutate(value);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Button variant="outline" className="mr-4" onClick={() => navigate("/dashboard/orders")}>
            <ChevronLeft className="mr-2 h-4 w-4" /> {t('orderDetail.backToOrders')}
          </Button>
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card><CardHeader><Skeleton className="h-6 w-40 mb-2" /><Skeleton className="h-4 w-48" /></CardHeader><CardContent><Skeleton className="h-32 w-full" /></CardContent></Card>
          </div>
          <div>
            <Card><CardHeader><Skeleton className="h-6 w-40 mb-2" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Button variant="outline" className="mr-4" onClick={() => navigate("/dashboard/orders")}>
            <ChevronLeft className="mr-2 h-4 w-4" /> {t('orderDetail.backToOrders')}
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{t('orderDetail.errorLoadingOrder')}</p>
              <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: [`/api/orders/${id}`] })}>
                {t('orderDetail.tryAgain')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredItems = order?.items || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Button variant="outline" className="mr-4" onClick={() => navigate("/dashboard/orders")}>
            <ChevronLeft className="mr-2 h-4 w-4" /> {t('orderDetail.backToOrders')}
          </Button>
          <h1 className="text-2xl font-serif font-bold">{t('orderDetail.orderNumber', { id: order.id })}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={getStatusColor(order.status)}>
            {order.status}
          </Badge>
          {user?.role === "district_manager" && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 border-orange-300 text-orange-700 hover:bg-orange-50"
              title="Download Bill / Shipping Label"
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
                  a.href = url;
                  a.download = `order_${order.id}_bill.pdf`;
                  a.click();
                  setTimeout(() => URL.revokeObjectURL(url), 5000);
                } catch (e: any) {
                  alert('Could not download bill: ' + e.message);
                }
              }}
            >
              <FileText className="h-4 w-4" />
              Download Bill
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('orderDetail.orderItems')}</CardTitle>
              <CardDescription>
                {t('orderDetail.placedOn', { date: formatDate(order.createdAt) })}
                {getEstimatedDeliveryDate(order) && (
                  <span className="ml-3 inline-flex items-center text-green-700 font-medium">
                    <Truck className="h-3 w-3 mr-1" />
                    Est. Delivery: {getEstimatedDeliveryDate(order)}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('orderDetail.product')}</TableHead>
                    {!isFarmer && (
                      <TableHead>
                        {(user?.role === "admin" || user?.role === "district_manager") ? "FPO" : t('orderDetail.farm')}
                      </TableHead>
                    )}
                    <TableHead>{t('orderDetail.price')}</TableHead>
                    <TableHead>{t('orderDetail.quantity')}</TableHead>
                    <TableHead className="text-right">{t('orderDetail.total')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded overflow-hidden mr-3">
                            <img src={item.imageUrl || '/placeholder-product.png'} alt={item.productName} className="h-full w-full object-cover" />
                          </div>
                          <div><p className="font-medium">{item.productName}</p></div>
                        </div>
                      </TableCell>
                      {!isFarmer && (
                        <TableCell>
                          {(user?.role === "admin" || user?.role === "district_manager")
                            ? ((item as any).fpoName || item.farmName || '—')
                            : item.farmName}
                        </TableCell>
                      )}
                      <TableCell>
                        {(() => {
                          const isB2B = order?.notes?.includes('B2B Bulk Order');
                          const upb = !isB2B && item.product?.unitsPerBox ? parseFloat(String(item.product.unitsPerBox)) : 1;
                          const u = isB2B
                            ? ((item.product as any)?.wholesaleUnit || item.product?.unit || 'unit')
                            : (item.product?.unit || 'unit');
                          return upb > 1
                            ? <>{formatIndianCurrency(item.price)}<span className="text-gray-500">/{upb}{u} box</span></>
                            : <>{formatIndianCurrency(item.price)}<span className="text-gray-500">/{u}</span></>;
                        })()}
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const isB2B = order?.notes?.includes('B2B Bulk Order');
                          const upb = !isB2B && item.product?.unitsPerBox ? parseFloat(String(item.product.unitsPerBox)) : 1;
                          const u = isB2B
                            ? ((item.product as any)?.wholesaleUnit || item.product?.unit || 'units')
                            : (item.product?.unit || 'units');
                          if (!isB2B && upb > 1) {
                            return <span>{item.quantity} box{item.quantity !== 1 ? 'es' : ''} <span className="text-gray-500">({item.quantity * upb} {u})</span></span>;
                          }
                          return <span>{item.quantity} {u}</span>;
                        })()}
                      </TableCell>
                      <TableCell className="text-right">{formatIndianCurrency(Number(item.price) * item.quantity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Return / Refund Section — customers only, delivered orders */}
          {isCustomer && order.status === "delivered" && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-orange-500" />
                  Return & Refund
                </CardTitle>
                <CardDescription>
                  {existingReturnRequest
                    ? "Your return request has been submitted."
                    : isWithinReturnWindow
                    ? `Return window closes in ${hoursRemainingInWindow}h. You can request a return within 2 days of delivery.`
                    : "The 2-day return window for this order has expired."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {existingReturnRequest ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status</span>
                      <ReturnStatusBadge status={existingReturnRequest.status} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Reason</span>
                      <span className="text-sm text-muted-foreground capitalize">
                        {RETURN_REASONS.find(r => r.value === existingReturnRequest.reason)?.label || existingReturnRequest.reason}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Description</span>
                      <p className="text-sm text-muted-foreground mt-1">{existingReturnRequest.description}</p>
                    </div>
                    {existingReturnRequest.photos && existingReturnRequest.photos.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">Uploaded Photos</span>
                        <div className="flex gap-2 mt-2">
                          {existingReturnRequest.photos.map((url: string, i: number) => (
                            <img key={i} src={url} alt={`Return photo ${i + 1}`} className="h-16 w-16 rounded object-cover border" />
                          ))}
                        </div>
                      </div>
                    )}
                    {existingReturnRequest.status === "fpo_accepted" && existingReturnRequest.refundAmount && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm font-semibold text-green-800">
                          Refund Approved: {formatIndianCurrency(existingReturnRequest.refundAmount)}
                        </p>
                        {existingReturnRequest.fpoNote && (
                          <p className="text-xs text-green-700 mt-1">{existingReturnRequest.fpoNote}</p>
                        )}
                      </div>
                    )}
                    {existingReturnRequest.status === "fpo_rejected" && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm font-semibold text-red-800">Return Request Rejected</p>
                        {existingReturnRequest.fpoNote && (
                          <p className="text-xs text-red-700 mt-1">{existingReturnRequest.fpoNote}</p>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Submitted on {formatDate(existingReturnRequest.createdAt)}
                    </p>
                  </div>
                ) : isWithinReturnWindow ? (
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground flex-1">
                      If you have any issue with this order — damaged product, wrong item, or quality problem — please raise a return/refund request.
                    </p>
                    <Button onClick={() => setReturnDialogOpen(true)} variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50 flex-shrink-0">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Request Return
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <XCircle className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">The 2-day return window has expired for this order.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            {isFarmer ? (
              <CardContent className="pt-6">
                <div className="w-full">
                  <label className="block text-sm font-medium mb-2">{t('orderDetail.updateOrderStatus')}</label>
                  <p className="text-sm text-muted-foreground mb-4">{t('orderDetail.updateStatusDescription')}</p>
                  <Select value={status} onValueChange={handleStatusChange} disabled={status.toLowerCase() === 'delivered' || status.toLowerCase() === 'cancelled'}>
                    <SelectTrigger><SelectValue placeholder={t('orderDetail.selectStatus')} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">{t('orderDetail.pending')}</SelectItem>
                      <SelectItem value="accepted">{t('orderDetail.accepted')}</SelectItem>
                      <SelectItem value="growing">{t('orderDetail.growing')}</SelectItem>
                      <SelectItem value="harvested">{t('orderDetail.harvested')}</SelectItem>
                      <SelectItem value="packaging">{t('orderDetail.packaging')}</SelectItem>
                      <SelectItem value="shipping">{t('orderDetail.shipping')}</SelectItem>
                    </SelectContent>
                  </Select>
                  {(status.toLowerCase() === 'delivered' || status.toLowerCase() === 'cancelled') && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {t('orderDetail.thisOrderIs')} {status.toLowerCase() === 'delivered' ? t('orderDetail.alreadyDelivered') : t('orderDetail.cancelled')} {t('orderDetail.cannotBeUpdated')}
                    </p>
                  )}
                </div>
              </CardContent>
            ) : (
              <>
                <CardHeader><CardTitle>{t('orderDetail.orderSummary')}</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(() => {
                      const storedDeliveryFee = Number(order.deliveryFee || 0);
                      const storedPlatformFee = Number(order.platformFee || 0);
                      const orderTotal = Number(order.total || 0);
                      // Derive products total from DB; if not stored, back-calculate from total
                      const storedProductsTotal = order.productsTotal
                        ? Number(order.productsTotal)
                        : Math.max(0, orderTotal - storedDeliveryFee - storedPlatformFee);
                      return (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Products Total</span>
                            <span>{formatIndianCurrency(storedProductsTotal)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Delivery Fee</span>
                            <span>{storedDeliveryFee > 0 ? formatIndianCurrency(storedDeliveryFee) : <span className="text-green-600 font-medium">Free</span>}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className={isCustomer ? "text-gray-600" : "text-purple-600"}>
                              {isCustomer ? "Service Fee" : "Platform Fee"}
                            </span>
                            <span className={isCustomer ? "" : "text-purple-600"}>{formatIndianCurrency(storedPlatformFee)}</span>
                          </div>
                        </>
                      );
                    })()}
                    <Separator />
                    <div className="flex justify-between font-medium text-lg">
                      <span>{t('orderDetail.total')}</span>
                      <span>{formatIndianCurrency(Number(order.total))}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span>{t('orderDetail.paymentMethod')}</span>
                      <span className="font-medium">
                        {order.paymentMethod === "cod" ? (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 hover:bg-orange-50">{t('orderDetail.cashOnDelivery')}</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">{t('orderDetail.onlinePayment')}</Badge>
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
          </Card>

          {!isFarmer && (
          <Card className="mt-4">
            <CardHeader><CardTitle>{t('orderDetail.customerInformation')}</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">{t('orderDetail.contact')}</h3>
                  <p>{order.customerName}</p>
                  <p>{order.email}</p>
                  <p>{order.phone}</p>
                </div>
                {order.address && (
                  <div>
                    <h3 className="font-medium mb-1">{t('orderDetail.shippingAddress')}</h3>
                    <p>{order.address}</p>
                    <p>{order.city}, {order.state} {order.zipCode}</p>
                  </div>
                )}
                {order.notes && (
                  <div>
                    <h3 className="font-medium mb-1">{t('orderDetail.orderNotes')}</h3>
                    <p className="text-gray-600">
                      {order.notes
                        .replace(/\s*\|\s*Delivery Date:\s*\d{4}-\d{2}-\d{2}/g, '')
                        .replace(/^\s*\|\s*/, '')
                        .replace(/\s*\|\s*$/, '')
                        .trim() || ''}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          )}
        </div>
      </div>

      {/* Return Request Dialog */}
      <Dialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-orange-500" />
              Request Return / Refund
            </DialogTitle>
            <DialogDescription>
              Please describe the issue with your order. The FPO will review your request and respond within 2-3 business days.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="return-reason">Reason for Return *</Label>
              <Select value={returnReason} onValueChange={setReturnReason}>
                <SelectTrigger id="return-reason" className="mt-1">
                  <SelectValue placeholder="Select a reason..." />
                </SelectTrigger>
                <SelectContent>
                  {RETURN_REASONS.map(r => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="return-desc">Describe the Issue *</Label>
              <Textarea
                id="return-desc"
                className="mt-1"
                placeholder="Please provide details about the problem..."
                rows={3}
                value={returnDescription}
                onChange={e => setReturnDescription(e.target.value)}
              />
            </div>

            <div>
              <Label>Photos (up to 3)</Label>
              <p className="text-xs text-muted-foreground mb-2">Upload photos showing the issue to help the FPO assess your request.</p>
              <div className="flex flex-wrap gap-2">
                {returnPhotos.map((url, i) => (
                  <div key={i} className="relative h-20 w-20 group">
                    <img src={url} alt={`Photo ${i + 1}`} className="h-full w-full object-cover rounded border" />
                    <button
                      onClick={() => setReturnPhotos(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {returnPhotos.length < 3 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="h-20 w-20 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-400 hover:border-orange-400 hover:text-orange-400 transition-colors"
                  >
                    {uploadingPhoto ? (
                      <div className="animate-spin h-4 w-4 border-2 border-orange-400 border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <Upload className="h-5 w-5 mb-1" />
                        <span className="text-xs">Add Photo</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReturnDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => submitReturnMutation.mutate()}
              disabled={!returnReason || returnDescription.length < 5 || submitReturnMutation.isPending}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {submitReturnMutation.isPending ? "Submitting..." : "Submit Return Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
