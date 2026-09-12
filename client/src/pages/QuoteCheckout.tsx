import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(5, "Zip code must be at least 5 characters"),
  paymentMethod: z.enum(["cashfree"]),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function QuoteCheckout() {
  const { id } = useParams();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if not authenticated
  if (!user) {
    navigate("/login?redirect=/dashboard");
    return null;
  }

  const quoteId = parseInt(id || "0");

  // Fetch quote details
  const { data: allQuotes, isLoading: quoteLoading } = useQuery<any[]>({
    queryKey: ['/api/quotes/my-quotes'],
    enabled: !!user,
  });

  const quote = allQuotes?.find((q: any) => q.id === quoteId);

  // Get customer profile data including phone and address
  const { data: customerProfile, error: customerProfileError } = useQuery({
    queryKey: ["/api/customers/profile"],
    enabled: !!user,
    retry: false,
  });

  // Get active order fees
  const { data: orderFees, isLoading: orderFeesLoading } = useQuery<OrderFee[]>({
    queryKey: ["/api/order-fees/active"],
  });

  // Log non-404 errors (404 is expected when user doesn't have a customer profile yet)
  useEffect(() => {
    if (customerProfileError && (customerProfileError as any)?.status !== 404) {
      console.error("Error fetching customer profile:", customerProfileError);
    }
  }, [customerProfileError]);

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
    // Always populate basic user information
    const formData = {
      firstName: user?.name?.split(' ')[0] || "",
      lastName: user?.name?.split(' ').slice(1).join(' ') || "",
      email: user?.email || "",
      phone: (user as any)?.phone || "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      paymentMethod: "cashfree" as const,
      notes: "",
    };

    // If customer profile exists, use that data to override defaults
    if (customerProfile) {
      formData.phone = (customerProfile as any)?.phone || (user as any)?.phone || "";
      formData.address = (customerProfile as any)?.address || "";
      formData.city = (customerProfile as any)?.city || "";
      formData.state = (customerProfile as any)?.state || "";
      formData.zipCode = (customerProfile as any)?.zipCode || "";
    }

    form.reset(formData);
  }, [customerProfile, user, form]);

  // Calculate subtotal and total with fees
  // Note: quotedPrice is for the ENTIRE lot, not per unit
  const subtotal = quote ? parseFloat(quote.quotedPrice) : 0;

  // Calculate total with fees (same as in Checkout.tsx)
  const calculateOrderTotal = () => {
    if (!orderFees || orderFeesLoading) {
      return subtotal; // Default to subtotal if fees aren't loaded yet
    }
    
    let total = subtotal;
    let calculationBase = subtotal;
    
    // Sort fees by display order
    const sortedFees = [...orderFees].sort((a, b) => a.displayOrder - b.displayOrder);
    
    // First apply all fees that don't apply to subtotal
    sortedFees.forEach(fee => {
      if (fee.isActive && !fee.applyToSubtotal) {
        const feeValue = parseFloat(fee.value);
        if (fee.type === "fixed") {
          total += feeValue;
        } else if (fee.type === "percentage") {
          total += (subtotal * feeValue) / 100;
        }
      }
    });
    
    // Then apply fees that compound (apply to subtotal including previous fees)
    sortedFees.forEach(fee => {
      if (fee.isActive && fee.applyToSubtotal) {
        const feeValue = parseFloat(fee.value);
        if (fee.type === "fixed") {
          total += feeValue;
        } else if (fee.type === "percentage") {
          total += (calculationBase * feeValue) / 100;
          calculationBase += (calculationBase * feeValue) / 100; // Update base for next compound fee
        }
      }
    });
    
    return total;
  };
  
  const total = calculateOrderTotal();

  const createOrderMutation = useMutation({
    mutationFn: async (data: CheckoutFormValues) => {
      // For Cashfree payment, create payment session first - use total including fees
      const amount = total;
      
      const customerDetails = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        notes: data.notes || "",
      };

      // Create Cashfree payment session - send total amount including fees
      const paymentResponse = await apiRequest("POST", `/api/quotes/${quoteId}/checkout`, {
        customerDetails,
        totalAmount: total.toString() // Send total with fees to backend
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
          const verifyResponse = await apiRequest("POST", `/api/quotes/${quoteId}/complete-payment`, {
            orderId: paymentData.orderId,
            customerDetails
          });
          
          const verificationResult = await verifyResponse.json();
          
          if (verificationResult.success) {
            return verificationResult.order;
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
              mode: paymentData.mode || "sandbox"
            });
            
            // Ensure SDK is properly initialized on mobile
            if (!cashfree || typeof cashfree.checkout !== 'function') {
              throw new Error("Payment SDK initialization failed. Please refresh the page and try again.");
            }
            
            console.log("Cashfree SDK initialized successfully");
            
            // Mobile-friendly checkout options
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            const checkoutOptions = {
              paymentSessionId: paymentData.sessionId,
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
            
            // Check if payment details exist
            if (!result.paymentDetails) {
              console.log("No payment details returned - payment likely cancelled");
              throw new Error("Payment cancelled by user");
            }
            
            // Check if payment was actually successful
            if (result.paymentDetails.paymentStatus === 'SUCCESS') {
              console.log("Payment successful, verifying with backend...");
              
              // Verify payment with backend and create order
              const verifyResponse = await apiRequest("POST", `/api/quotes/${quoteId}/complete-payment`, {
                orderId: paymentData.orderId,
                customerDetails,
                totalAmount: total.toString(), // Send total with fees for verification
                paymentData: result
              });
              
              const verificationResult = await verifyResponse.json();
              
              if (verificationResult.success) {
                return verificationResult.order;
              } else {
                throw new Error(verificationResult.message || "Payment verification failed");
              }
            } else if (result.paymentDetails && result.paymentDetails.paymentStatus === 'CANCELLED') {
              console.log("Payment was cancelled by user");
              throw new Error("Payment cancelled by user");
            } else if (result.paymentDetails && result.paymentDetails.paymentStatus === 'FAILED') {
              console.log("Payment failed:", result.paymentDetails);
              throw new Error("Payment failed. Please try again.");
            } else {
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
    },
    onSuccess: (data: any) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders/farmer"] });
      queryClient.invalidateQueries({ queryKey: ["/api/quotes/my-quotes"] });
      
      toast({
        title: "Order placed successfully!",
        description: `Your order #${data.id} has been placed. Thank you for your purchase!`,
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
    if (!quote) {
      toast({
        title: "Quote not found",
        description: "Unable to process this quote.",
        variant: "destructive",
      });
      return;
    }

    // Mobile-specific handling
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile && data.paymentMethod === "cashfree") {
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

  // Loading state
  if (quoteLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Quote not found
  if (!quote) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Quote not found</CardTitle>
            <CardDescription>
              The quote you're looking for doesn't exist or you don't have access to it.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Quote not in accepted status
  if (quote.status !== 'accepted') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Quote not available</CardTitle>
            <CardDescription>
              This quote is {quote.status} and cannot be checked out at this time.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Quote already has an order
  if (quote.orderId) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Already processed</CardTitle>
            <CardDescription>
              This quote has already been converted to an order.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/orders">View Orders</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Calculate total
  const totalPrice = parseFloat(quote.quotedPrice) * quote.quantity;

  // Format price as Indian Rupees
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'number' ? price : parseFloat(price);
    return numPrice.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif font-bold mb-8 text-center">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>
                Enter your details for delivery
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
                          <FormLabel>First Name</FormLabel>
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
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john.doe@example.com" {...field} />
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
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+91 9876543210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="123 Main Street, Apartment 4B" {...field} />
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
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Bangalore" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="Karnataka" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input placeholder="560001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any special instructions for delivery..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Add any special instructions or preferences for your order
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Payment Method</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-3"
                          >
                            <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 bg-blue-50 border-blue-200">
                              <RadioGroupItem value="cashfree" id="cashfree" />
                              <div className="flex-1">
                                <label
                                  htmlFor="cashfree"
                                  className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  <h4 className="font-medium text-blue-900 mb-2">Secure Online Payment</h4>
                                  <p className="text-sm text-blue-700">
                                    Pay securely using Credit/Debit Card, UPI, Net Banking, or Wallet
                                  </p>
                                  <div className="mt-2 flex gap-2 flex-wrap">
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Visa</span>
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Mastercard</span>
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">UPI</span>
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Net Banking</span>
                                  </div>
                                </label>
                              </div>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      `Complete Order - ₹${formatPrice(total)}`
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Quote Summary</CardTitle>
              <CardDescription>
                Order details for Quote #{quote.id}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">{quote.product?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {quote.product?.farmer?.farmName}
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quoted Price (Whole Lot)</span>
                  <span>₹{formatPrice(quote.quotedPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantity</span>
                  <span>{quote.quantity} {quote.product?.unit}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{formatPrice(subtotal)}</span>
                </div>
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
                      const feeValue = parseFloat(fee.value);
                      const feeAmount = fee.type === "fixed" 
                        ? feeValue 
                        : (subtotal * feeValue) / 100;
                      
                      return (
                        <div key={fee.id} className="flex justify-between text-sm">
                          <span>{fee.name}</span>
                          <span>₹{formatPrice(feeAmount)}</span>
                        </div>
                      );
                    })
                ) : null}
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>₹{formatPrice(total)}</span>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-green-800">
                  🔒 Your payment is secured with industry-standard encryption
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
