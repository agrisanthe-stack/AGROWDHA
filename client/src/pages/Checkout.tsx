import { useState, useEffect, useMemo } from "react";
import { useLocation, Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Loader2, Truck, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useDistrict } from "@/hooks/use-district";
import { apiRequest, queryClient } from "@/lib/queryClient";
// Define OrderFee interface
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Order } from "@/lib/types";

const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(5, "Zip code must be at least 5 characters"),
  paymentMethod: z.literal("cashfree"),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { t } = useTranslation();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { selectedDistrictId, selectedDistrictName, districts } = useDistrict();
  const { cartItems, clearCart, getTotalPrice } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if not authenticated (must use useEffect, not early return, to preserve hook order)
  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/checkout");
    }
  }, [user]);
  
  // Get customer profile data including phone and address
  const { data: customerProfile, error: customerProfileError } = useQuery({
    queryKey: ["/api/customers/profile"],
    enabled: !!user,
    retry: false, // Don't retry on 404 - user might not have a customer profile yet
    staleTime: 0,
    refetchOnMount: 'always',
  });

  // Log non-404 errors (404 is expected when user doesn't have a customer profile yet)
  useEffect(() => {
    if (customerProfileError && (customerProfileError as any)?.status !== 404) {
      console.error("Error fetching customer profile:", customerProfileError);
    }
  }, [customerProfileError]);

  // Get active order fees
  const { data: orderFees, isLoading: orderFeesLoading } = useQuery<OrderFee[]>({
    queryKey: ["/api/order-fees/active"],
    staleTime: 0,
    refetchOnMount: 'always',
  });

  // Get user's active subscription for fee calculation
  const { data: subData } = useQuery<{ subscription: any }>({
    queryKey: ["/api/my-subscription"],
    enabled: !!user,
  });
  const hasZeroPlatformFee = subData?.subscription?.plan?.zeroPlatformFee || false;

  // FPO org names for per-FPO delivery fee labels
  const { data: orgsData } = useQuery<Array<{ id: number; orgName: string }>>({
    queryKey: ["/api/orgs"],
  });
  const dmIdToOrgName = useMemo(() => {
    const map: Record<number, string> = {};
    (orgsData || []).forEach(org => { map[org.id] = org.orgName || `FPO #${org.id}`; });
    return map;
  }, [orgsData]);
  
  const subtotal = getTotalPrice();

  const userDistrictId = selectedDistrictId || user?.districtId;
  const selectedDistrict = districts.find(d => d.id === (selectedDistrictId || user?.districtId));

  const fpoWeights = useMemo(() => {
    const groups: Record<number, number> = {};
    cartItems.forEach(item => {
      const dmId = (item as any).createdByDmId || ((item as any).approvalType === 'fpo' ? (item as any).approvedByUserId : null);
      if (!dmId) return;
      
      const qty = item.quantity;
      const unit = ((item as any).unit || 'kg').toLowerCase();
      const unitsPerBox = parseFloat(String((item as any).unitsPerBox || 1));
      // B2B quantities are already in individual units (pieces/kg), not boxes
      const totalUnits = (item as any).b2bOrder ? qty : qty * unitsPerBox;
      let weightKg = 0;

      if (unit === 'kg') weightKg = totalUnits;
      else if (unit === 'g') weightKg = totalUnits / 1000;
      else if (unit === 'litres' || unit === 'l') weightKg = totalUnits;
      else if (unit === 'ml') weightKg = totalUnits / 1000;
      else if (unit === 'pieces') {
        const approxGrams = (item as any).approxWeightPerPieceGrams
          ? parseFloat(String((item as any).approxWeightPerPieceGrams)) : 200;
        weightKg = totalUnits * approxGrams / 1000;
      } else {
        weightKg = totalUnits;
      }

      groups[dmId] = (groups[dmId] || 0) + weightKg;
    });
    return groups;
  }, [cartItems]);

  const dmUserIds = useMemo(() => Object.keys(fpoWeights).map(Number), [fpoWeights]);

  const { data: deliveryFeeData } = useQuery({
    queryKey: ["/api/delivery/calculate", fpoWeights, userDistrictId],
    queryFn: async () => {
      if (dmUserIds.length === 0) return { totalFee: 0, fpoFees: [] };
      
      const fpoFees: Array<{ dmId: number; fee: number; weightKg: number }> = [];
      let totalFee = 0;

      for (const dmId of dmUserIds) {
        const weightKg = fpoWeights[dmId] || 0;
        if (weightKg <= 0) continue;
        
        try {
          const res = await fetch("/api/delivery/calculate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dmUserId: dmId, totalWeightKg: weightKg, districtId: userDistrictId }),
          });
          if (res.ok) {
            const data = await res.json();
            const fee = data.fee || 0;
            fpoFees.push({ dmId, fee, weightKg });
            totalFee += fee;
          }
        } catch {
        }
      }

      return { totalFee, fpoFees };
    },
    enabled: cartItems.length > 0 && dmUserIds.length > 0,
  });

  const deliveryFee = deliveryFeeData?.totalFee || 0;

  // Helper to check if a fee is the platform/tech support fee
  const isPlatformFee = (fee: OrderFee) => {
    const name = fee.name.toLowerCase();
    return fee.type === 'percentage' && (name.includes('tech') || name.includes('support') || name.includes('platform') || name.includes('santhe'));
  };
  
  // Calculate total with fees (same as in Cart.tsx)
  const calculateOrderTotal = () => {
    if (!orderFees || orderFeesLoading) {
      return subtotal + deliveryFee;
    }
    
    let total = subtotal + deliveryFee;
    let calculationBase = subtotal;
    
    const sortedFees = [...orderFees].sort((a, b) => a.displayOrder - b.displayOrder);
    
    sortedFees.forEach(fee => {
      if (fee.isActive && !fee.applyToSubtotal) {
        if (hasZeroPlatformFee && isPlatformFee(fee)) return;
        const feeValue = parseFloat(fee.value);
        if (fee.type === "fixed") {
          total += feeValue;
        } else if (fee.type === "percentage") {
          total += (subtotal * feeValue) / 100;
        }
      }
    });
    
    sortedFees.forEach(fee => {
      if (fee.isActive && fee.applyToSubtotal) {
        if (hasZeroPlatformFee && isPlatformFee(fee)) return;
        const feeValue = parseFloat(fee.value);
        if (fee.type === "fixed") {
          total += feeValue;
        } else if (fee.type === "percentage") {
          total += (calculationBase * feeValue) / 100;
          calculationBase += (calculationBase * feeValue) / 100;
        }
      }
    });
    
    return total;
  };
  
  const total = calculateOrderTotal();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: user?.name?.split(' ')[0] || "",
      lastName: user?.name?.split(' ').slice(1).join(' ') || "",
      email: user?.email || "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      paymentMethod: "cashfree",
      notes: "",
    },
  });

  // Update form values when customer profile data is loaded or when user data is available
  useEffect(() => {
    const districtCity = selectedDistrict?.name || "";
    const districtState = selectedDistrict?.state || "";

    const formData = {
      firstName: user?.name?.split(' ')[0] || "",
      lastName: user?.name?.split(' ').slice(1).join(' ') || "",
      email: user?.email || "",
      phone: (user as any)?.phone || "",
      address: "",
      city: districtCity,
      state: districtState,
      zipCode: "",
      paymentMethod: "cashfree" as const,
      notes: "",
    };

    if (customerProfile) {
      formData.phone = (customerProfile as any)?.phone || (user as any)?.phone || "";
      formData.address = (customerProfile as any)?.address || "";
      formData.zipCode = (customerProfile as any)?.zipCode || "";
      formData.city = districtCity || (customerProfile as any)?.city || "";
      formData.state = districtState || (customerProfile as any)?.state || "";
    }

    form.reset(formData);
  }, [customerProfile, user, form, selectedDistrictId, districts]);

  const createOrderMutation = useMutation({
    mutationFn: async (data: CheckoutFormValues) => {
      if (data.paymentMethod === "cashfree") {
        // For Cashfree payment, create payment session first - use total including fees
        const amount = total;
        
        // Organize order data by farmer for payment
        const farmerOrdersData = [];
        
        // Group cart items by farmerId, also track dmId per farmer
        const farmerItemsMap = new Map<number, {
          farmerId: number;
          dmId: number | null;
          items: { productId: number; quantity: number; price: number | string; farmerId: number; }[];
          total: number;
        }>();

        for (const item of cartItems) {
          const farmerId = item.farm.id;
          const price = typeof item.price === 'number' ? item.price : parseFloat(item.price);
          const itemTotal = price * item.quantity;
          const itemDmId = (item as any).createdByDmId || ((item as any).approvalType === 'fpo' ? (item as any).approvedByUserId : null) || null;
          
          if (!farmerItemsMap.has(farmerId)) {
            farmerItemsMap.set(farmerId, { 
              farmerId,
              dmId: itemDmId,
              items: [], 
              total: 0 
            });
          }
          
          const farmerData = farmerItemsMap.get(farmerId)!;
          if (!farmerData.dmId && itemDmId) farmerData.dmId = itemDmId;
          const isB2B = (item as any).b2bOrder;
          farmerData.items.push({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            farmerId: item.farm.id,
            ...(isB2B ? { b2bOrder: true } : {})
          });
          farmerData.total += itemTotal;
        }
        
        // Calculate proportional total for each farmer (including fees)
        const subtotalSum = Array.from(farmerItemsMap.values()).reduce((sum, f) => sum + f.total, 0);
        
        // Convert to order data format with proper totals including fees
        for (const [_, farmerData] of Array.from(farmerItemsMap.entries())) {
          // Calculate proportional share of the total amount (including fees)
          const proportion = subtotalSum > 0 ? farmerData.total / subtotalSum : 1;
          const proportionalTotal = proportion * amount;
          // Use the FPO-specific delivery fee from deliveryFeeData if available, else proportional
          const fpoFee = deliveryFeeData?.fpoFees?.find((f: any) => f.dmId === farmerData.dmId);
          const farmerDeliveryFee = fpoFee ? fpoFee.fee : proportion * deliveryFee;
          
          farmerOrdersData.push({
            ...data,
            farmerId: farmerData.farmerId,
            items: farmerData.items,
            total: proportionalTotal,
            deliveryFee: farmerDeliveryFee,
          });
        }
        
        // Create Cashfree payment session
        const paymentResponse = await apiRequest("POST", "/api/payments/create-session", {
          amount: amount.toString(),
          orderData: farmerOrdersData,
          customerDetails: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            phone: data.phone
          }
        });
        
        const paymentData = await paymentResponse.json();
        
        if (!paymentResponse.ok) {
          throw new Error(paymentData.message || "Payment session creation failed");
        }
        
        if (paymentData.sessionId) {
          // Check if this is a test session or production session
          if (paymentData.mode === "testing") {
            console.log("Using test payment mode due to API configuration issues");
            
            // Simulate payment success for testing
            const verifyResponse = await apiRequest("POST", "/api/payments/verify", {
              orderId: paymentData.orderId,
              orderData: farmerOrdersData
            });
            
            const verificationResult = await verifyResponse.json();
            
            if (verificationResult.success) {
              return verificationResult.orders;
            } else {
              throw new Error(verificationResult.message || "Payment verification failed");
            }
          } else {
            // Use production Cashfree payment modal
            try {
              console.log("Initializing Cashfree SDK for production...");
              console.log("Payment session ID:", paymentData.sessionId);
              
              // Check if Cashfree SDK is loaded
              if (typeof (window as any).Cashfree === 'undefined') {
                console.error("Cashfree SDK not loaded. Attempting to load dynamically...");
                
                // Try to load Cashfree SDK dynamically with mobile-friendly approach
                await new Promise((resolve, reject) => {
                  const script = document.createElement('script');
                  script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
                  script.async = true;
                  script.defer = true;
                  
                  script.onload = () => {
                    console.log("Cashfree SDK script loaded successfully");
                    resolve(undefined);
                  };
                  
                  script.onerror = (error) => {
                    console.error("Failed to load Cashfree SDK script:", error);
                    reject(new Error("Failed to load payment SDK"));
                  };
                  
                  document.head.appendChild(script);
                });
                
                // Wait longer for mobile browsers to initialize
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                await new Promise(resolve => setTimeout(resolve, isMobile ? 2000 : 1000));
                
                if (typeof (window as any).Cashfree === 'undefined') {
                  throw new Error("Cashfree SDK failed to load. Please check your internet connection and try again.");
                }
              }
              
              const cashfree = await (window as any).Cashfree({
                mode: paymentData.mode || "sandbox" // Use mode from backend to ensure consistency
              });
              
              // Ensure SDK is properly initialized on mobile
              if (!cashfree || typeof cashfree.checkout !== 'function') {
                throw new Error("Payment SDK initialization failed. Please refresh the page and try again.");
              }
              
              console.log("Cashfree SDK initialized successfully");
              
              // Mobile-friendly checkout options
              const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
              
              // Use embedded Checkout for better branding and trust
              const checkoutOptions = {
                paymentSessionId: paymentData.sessionId,
                // Remove redirectTarget to prevent redirect - use embedded mode
                // redirectTarget: '#cashfree-payment-content'
              };
              
              console.log("Starting Cashfree checkout with options:", checkoutOptions);
              console.log("Payment data mode:", paymentData.mode);
              console.log("SDK mode:", paymentData.mode || "sandbox");
              
              // Start the payment process directly
              console.log("Starting Cashfree payment...");
              const result = await cashfree.checkout(checkoutOptions);
              
              console.log("Cashfree payment result:", result);
              
              // Check if result is valid
              if (!result) {
                console.log("Payment was cancelled or closed without completion");
                throw new Error("Payment cancelled by user");
              }
              
              if (result.error) {
                console.error("Cashfree payment error:", result.error);
                
                // Check if the error indicates user cancellation
                const errorMessage = result.error.message || "Payment failed";
                if (errorMessage.toLowerCase().includes('cancel') || 
                    errorMessage.toLowerCase().includes('abort') ||
                    errorMessage.toLowerCase().includes('close')) {
                  throw new Error("Payment cancelled by user");
                }
                
                throw new Error(errorMessage);
              }
              
              // Handle redirect case (production payments often redirect)
              if (result.redirect === true) {
                console.log("Payment redirect initiated by Cashfree SDK");
                console.log("User will be redirected to payment gateway to complete payment");
                console.log("After payment, Cashfree will redirect back to:", paymentData.returnUrl || "return_url");
                
                // Don't manually redirect - Cashfree SDK will handle the redirect to payment gateway
                // After user completes payment, Cashfree will redirect to our return_url
                // Return a promise that never resolves to prevent mutation handlers from running
                // since the page will be redirected by Cashfree SDK
                return new Promise(() => {}); // Never resolves - waiting for Cashfree redirect
              }
              
              // Check if payment details exist
              if (!result.paymentDetails) {
                console.log("No payment details returned - payment likely cancelled");
                throw new Error("Payment cancelled by user");
              }
              
              // Check if payment was actually successful
              if (result.paymentDetails.paymentStatus === 'SUCCESS') {
                console.log("Payment successful, verifying with backend...");
                
                // Verify payment with backend
                const verifyResponse = await apiRequest("POST", "/api/payments/verify", {
                  orderId: paymentData.orderId,
                  orderData: farmerOrdersData,
                  paymentData: result
                });
                
                const verificationResult = await verifyResponse.json();
                
                if (verificationResult.success) {
                  return verificationResult.orders;
                } else {
                  throw new Error(verificationResult.message || "Payment verification failed");
                }
              } else if (result.paymentDetails && result.paymentDetails.paymentStatus === 'CANCELLED') {
                // Handle payment cancellation
                console.log("Payment was cancelled by user");
                throw new Error("Payment cancelled by user");
              } else if (result.paymentDetails && result.paymentDetails.paymentStatus === 'FAILED') {
                // Handle payment failure
                console.log("Payment failed:", result.paymentDetails);
                throw new Error("Payment failed. Please try again.");
              } else {
                // Handle any other status or missing payment details
                console.log("Payment did not complete successfully:", result);
                throw new Error("Payment was not completed successfully");
              }
            } catch (cashfreeError: any) {
              console.error("Cashfree payment error:", cashfreeError);
              throw new Error(`Payment failed: ${cashfreeError?.message || "Unknown error"}`);
            }
          }
        } else {
          throw new Error("Failed to create payment session");
        }
      }
    },
    onSuccess: (data: any) => {
      clearCart();
      // Invalidate both customer and farmer order queries
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders/farmer"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      
      // Ensure data is treated as an array (it could be a single order or array of orders)
      const orders = Array.isArray(data) ? data : [data];
      const orderCount = orders.length;
      
      let message = orderCount === 1 
        ? `Your order #${orders[0].id} has been placed.` 
        : `${orderCount} orders have been placed successfully!`;
      
      toast({
        title: "Order placed successfully!",
        description: `${message} Thank you for your purchase!`,
        variant: "default",
      });
      navigate("/dashboard/orders");
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "There was an error placing your order. Please try again.";
      
      // Handle different types of payment errors with specific messaging
      if (errorMessage.includes("cancelled") || errorMessage.includes("canceled")) {
        toast({
          title: "Payment Cancelled",
          description: "You cancelled the payment. No charges were made. You can try again anytime.",
          variant: "destructive",
        });
      } else if (errorMessage.includes("Payment failed. Please try again.")) {
        toast({
          title: "Payment Failed",
          description: "Your payment could not be processed. Please check your payment details and try again.",
          variant: "destructive",
        });
      } else if (errorMessage.includes("Payment was not completed successfully")) {
        toast({
          title: "Payment Incomplete",
          description: "The payment process was not completed. Please try placing your order again.",
          variant: "destructive",
        });
      } else if (errorMessage.includes("Payment verification failed")) {
        toast({
          title: "Payment Verification Failed",
          description: "We couldn't verify your payment. If money was deducted, it will be refunded within 5-7 business days.",
          variant: "destructive",
        });
      } else {
        // Generic error message for other cases
        toast({
          title: "Error placing order",
          description: errorMessage,
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Please add some products to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }

    // Mobile-specific handling
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      console.log("Mobile Cashfree payment initiated");
      
      // Inform user about secure payment process
      toast({
        title: "Payment Processing",
        description: "Opening secure payment interface...",
        variant: "default",
      });
      
      // Small delay to ensure toast shows before payment process
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsSubmitting(true);
    createOrderMutation.mutate(data);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>{t('cart.empty')}</CardTitle>
            <CardDescription>
              {t('cart.emptyDesc')}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/products">{t('cart.continueShopping')}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Format price as Indian Rupees
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'number' ? price : parseFloat(price);
    return numPrice.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    });
  };

  // Render nothing while redirecting unauthenticated users
  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif font-bold mb-8 text-center">{t('checkout.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('checkout.shippingInfo')}</CardTitle>
              <CardDescription>
                {t('checkout.shippingInfoDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('checkout.firstName')}</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('checkout.lastName')}</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('checkout.email')}</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('checkout.phone')}</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('checkout.streetAddress')}</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('checkout.city')}</FormLabel>
                          <FormControl>
                            <Input placeholder="Anytown" {...field} readOnly={!!selectedDistrictId} className={selectedDistrictId ? "bg-gray-100 cursor-not-allowed" : ""} />
                          </FormControl>
                          {selectedDistrictId && (
                            <p className="text-xs text-muted-foreground">Auto-filled from your selected district</p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('checkout.state')}</FormLabel>
                          <FormControl>
                            <Input placeholder="CA" {...field} readOnly={!!selectedDistrictId} className={selectedDistrictId ? "bg-gray-100 cursor-not-allowed" : ""} />
                          </FormControl>
                          {selectedDistrictId && (
                            <p className="text-xs text-muted-foreground">Auto-filled from your selected district</p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('checkout.zipCode')}</FormLabel>
                          <FormControl>
                            <Input placeholder="12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">{t('checkout.securePayment')}</h4>
                    <p className="text-sm text-blue-700">
                      {t('checkout.securePaymentDesc')}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-blue-600">{t('checkout.sslSecured')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-blue-600">{t('checkout.stayOnSite')}</span>
                      </div>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('checkout.orderNotes')}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('checkout.orderNotesPlaceholder')}
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t('checkout.orderNotesDesc')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col gap-4 mt-8">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white py-6 text-lg font-bold touch-manipulation"
                      style={{ 
                        touchAction: 'manipulation',
                        WebkitTapHighlightColor: 'transparent'
                      }}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <span className="h-5 w-5 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin" />
                          {t('checkout.processingOrder')}
                        </span>
                      ) : (
                        t('checkout.placeOrderNow')
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/cart")}
                      className="w-full"
                    >
                      ← {t('checkout.backToCart')}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>{t('checkout.orderSummary')}</CardTitle>
              <CardDescription>
                {t('checkout.itemsInCart', { count: cartItems.length })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const isB2BItem = (item as any).b2bOrder;
                  const price = parseFloat(typeof item.price === 'string' ? item.price : item.price.toString());
                  const unitsPerBoxDisplay = parseFloat(String((item as any).unitsPerBox || 1));
                  const itemTotal = price * item.quantity;
                  
                  return (
                    <div key={item.cartItemId || item.id} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded overflow-hidden mr-3 relative">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="h-full w-full object-cover" 
                          />
                          {isB2BItem ? (
                            <div className="absolute top-0 left-0 bg-green-600 text-white text-[6px] px-0.5 rounded-br font-bold">
                              Wholesale
                            </div>
                          ) : (
                            <div className="absolute top-0 left-0 bg-blue-600 text-white text-[6px] px-0.5 rounded-br font-bold">
                              Retail
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            {isB2BItem ? (
                              <>₹{formatPrice(price)}/{(item as any).wholesaleUnit || item.unit} × {item.quantity} {(item as any).wholesaleUnit || item.unit}</>
                            ) : unitsPerBoxDisplay !== 1 ? (
                              <>₹{formatPrice(price)}/box × {item.quantity} box{item.quantity !== 1 ? 'es' : ''} ({unitsPerBoxDisplay} {item.unit}/box)</>
                            ) : (
                              <>₹{formatPrice(price)}/{item.unit} × {item.quantity} {item.unit}</>
                            )}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium">
                        ₹{formatPrice(itemTotal)}
                      </span>
                    </div>
                  );
                })}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t('cart.subtotal')}</span>
                    <span>₹{formatPrice(subtotal)}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Truck className="h-3.5 w-3.5 text-blue-600" />
                        Delivery Fee
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-[200px] text-xs">
                              Delivery fee is set by the FPO and varies based on your district and order weight.
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </span>
                      <span>₹{formatPrice(deliveryFee)}</span>
                    </div>
                  )}
                  {/* Display order fees */}
                  {orderFeesLoading ? (
                    <div className="flex justify-center py-1">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : orderFees && orderFees.length > 0 ? (
                    orderFees
                      .filter(fee => fee.isActive)
                      .sort((a, b) => a.displayOrder - b.displayOrder)
                      .map(fee => {
                        const isWaived = hasZeroPlatformFee && isPlatformFee(fee);
                        const feeValue = parseFloat(fee.value);
                        const feeAmount = isWaived ? 0 : (fee.type === "fixed" 
                          ? feeValue 
                          : (subtotal * feeValue) / 100);
                        
                        return (
                          <div key={fee.id} className="flex justify-between text-sm">
                            <span>{fee.name} {isWaived && <span className="text-amber-600 text-xs">(Farm Direct)</span>}</span>
                            <span className={isWaived ? 'text-green-600 line-through-none' : ''}>
                              {isWaived ? '₹0' : `₹${formatPrice(feeAmount)}`}
                            </span>
                          </div>
                        );
                      })
                  ) : null}
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>{t('cart.total')}</span>
                    <span>₹{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
