import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Clock, ArrowRight, XCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { apiRequest } from "@/lib/queryClient";
import { useTranslation } from "react-i18next";

export default function CheckoutSuccess() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const { clearCart } = useCart();
  const { t } = useTranslation();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending');

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;
    let timeoutId: NodeJS.Timeout;

    async function verifyPayment() {
      try {
        // CRITICAL: Check if user is authenticated before making API call
        const authData = localStorage.getItem("harvest_direct_auth");
        if (!authData) {
          console.error("❌ No authentication data found in localStorage");
          console.log("Waiting for auth to load...");
          // Wait a bit and retry - user might still be logging in
          if (retryCount < 3) {
            retryCount++;
            timeoutId = setTimeout(verifyPayment, 1000);
            return;
          }
          setError("You must be logged in to verify payment. Please log in and try again.");
          setVerificationStatus('failed');
          setLoading(false);
          return;
        }

        // Get order ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('order_id');
        
        if (!orderId) {
          setError("No order ID found. Please contact support if payment was deducted.");
          setVerificationStatus('failed');
          setLoading(false);
          return;
        }
        
        console.log(`Verifying payment for order: ${orderId} (Attempt ${retryCount + 1}/${maxRetries})`);
        
        let response, result;
        
        console.log("Processing checkout payment");
        response = await apiRequest("POST", "/api/payments/verify", {
          orderId: orderId
        });
        result = await response.json();
        
        if (result.success) {
          console.log("Payment verified successfully:", result);
          setOrderDetails(result.orders || []);
          setVerificationStatus('success');
          setLoading(false);
          // Clear the cart after successful verification
          clearCart();
          console.log("Cart cleared after successful payment verification");
        } else if ((result.status === 'ACTIVE' || result.status === 'CASHFREE_PENDING') && retryCount < maxRetries) {
          // Payment is still in progress, retry after a delay
          retryCount++;
          const delay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff, max 10s
          console.log(`Payment still in progress (${result.status}). Retrying in ${delay}ms...`);
          timeoutId = setTimeout(verifyPayment, delay);
        } else {
          console.error("Payment verification failed:", result.message);
          setError(result.message || "Payment verification failed. Please contact support.");
          setVerificationStatus('failed');
          setLoading(false);
        }
      } catch (err) {
        console.error("Error verifying payment:", err);
        if (retryCount < maxRetries) {
          // Retry on network error
          retryCount++;
          const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
          console.log(`Network error. Retrying in ${delay}ms...`);
          timeoutId = setTimeout(verifyPayment, delay);
        } else {
          setError("Failed to verify payment. Please contact support if payment was deducted.");
          setVerificationStatus('failed');
          setLoading(false);
        }
      }
    }
    
    verifyPayment();

    // Cleanup timeout on unmount
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []); // Empty dependency array - run once on mount

  const handleContinueShopping = () => {
    setLocation("/");
  };

  const handleViewOrders = () => {
    if (user?.role === 'customer') {
      setLocation("/dashboard/orders");
    } else if (user?.role === 'farmer') {
      setLocation("/dashboard/orders");
    } else if (user?.role === 'admin') {
      setLocation("/admin");
    } else {
      setLocation("/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-10 h-10 text-blue-600 animate-pulse" />
              </div>
              <CardTitle className="text-2xl text-blue-600">
                {t('checkoutSuccess.verifyingPayment')}
              </CardTitle>
              <CardDescription className="text-lg">
                {t('checkoutSuccess.pleaseWait')}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'failed') {
    const isAuthError = error?.includes("logged in") || error?.includes("Authentication");
    
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-600">
                {isAuthError ? t('checkoutSuccess.authRequired') : t('checkoutSuccess.paymentVerificationFailed')}
              </CardTitle>
              <CardDescription className="text-lg">
                {error || t('checkoutSuccess.couldNotVerify')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isAuthError ? (
                <>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="text-left text-sm text-yellow-800">
                        <p className="font-semibold mb-2">{t('checkoutSuccess.sessionExpired')}</p>
                        <p className="mb-3">
                          {t('checkoutSuccess.dontWorry')}
                        </p>
                        <p className="text-xs text-yellow-700">
                          💡 <strong>{t('checkoutSuccess.tip')}</strong> {t('checkoutSuccess.savePageUrl')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button 
                      onClick={() => setLocation("/login?redirect=" + encodeURIComponent(window.location.pathname + window.location.search))}
                    >
                      {t('checkoutSuccess.loginToVerify')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleContinueShopping}
                    >
                      {t('checkoutSuccess.returnHome')}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="text-left text-sm text-yellow-800">
                        <p className="font-semibold">{t('checkoutSuccess.important')}</p>
                        <p>{t('checkoutSuccess.moneyDeducted')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 pt-4">
                    <Button onClick={handleContinueShopping}>
                      {t('checkoutSuccess.returnHome')}
                    </Button>
                    {user && (
                      <Button onClick={handleViewOrders}>
                        {t('checkoutSuccess.viewMyOrders')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              {t('checkoutSuccess.paymentSuccessful')}
            </CardTitle>
            <CardDescription className="text-lg">
              {t('checkoutSuccess.thankYou')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {orderDetails && Array.isArray(orderDetails) && orderDetails.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">{t('checkoutSuccess.orderDetails')}</h3>
                {orderDetails.map((order: any, index: number) => (
                  <p key={index} className="text-sm text-gray-600">
                    Order #{order.id} - ₹{order.total}
                  </p>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-blue-600">
                <Package className="w-5 h-5" />
                <span className="text-sm">{t('checkoutSuccess.orderConfirmationEmail')}</span>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-orange-600">
                <Clock className="w-5 h-5" />
                <span className="text-sm">{t('checkoutSuccess.orderProcessing')}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={handleViewOrders}
                className="flex items-center justify-center space-x-2"
              >
                <Package className="w-4 h-4" />
                <span>{t('checkoutSuccess.viewOrders')}</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleContinueShopping}
                className="flex items-center justify-center space-x-2"
              >
                <span>{t('checkoutSuccess.continueShopping')}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}