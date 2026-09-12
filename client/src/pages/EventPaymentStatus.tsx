import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "react-i18next";

type PaymentStatus = "loading" | "success" | "failed" | "pending" | "error";

export default function EventPaymentStatus() {
  const [, setLocation] = useLocation();
  const { user, token } = useAuth();
  const { t } = useTranslation();
  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [message, setMessage] = useState("");
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id");

    if (!orderId) {
      setStatus("error");
      setMessage(t('eventPaymentStatus.invalidLink'));
      return;
    }

    if (!token) {
      setStatus("error");
      setMessage(t('eventPaymentStatus.loginToVerify'));
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `/api/events/verify-payment?order_id=${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
          setStatus("error");
          setMessage(data.message || t('eventPaymentStatus.notAuthorized'));
          return;
        }

        if (data.status === "success") {
          setStatus("success");
          setMessage(data.message || t('eventPaymentStatus.paymentConfirmed'));
          setBooking(data.booking);
          // Automatically redirect to bookings dashboard after 3 seconds
          setTimeout(() => {
            setLocation("/dashboard/events");
          }, 3000);
        } else if (data.status === "pending") {
          setStatus("pending");
          setMessage(data.message || t('eventPaymentStatus.stillProcessing'));
        } else if (data.status === "failed") {
          setStatus("failed");
          setMessage(data.message || t('eventPaymentStatus.paymentFailedRetry'));
        } else {
          setStatus("error");
          setMessage(data.message || t('eventPaymentStatus.unableToVerify'));
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("error");
        setMessage(t('eventPaymentStatus.verificationErrorMsg'));
      }
    };

    verifyPayment();
  }, [token]);

  const statusConfig = {
    loading: {
      icon: null,
      title: t('eventPaymentStatus.verifyingPayment'),
      color: "text-gray-500",
      bgColor: "bg-gray-100",
    },
    success: {
      icon: CheckCircle,
      title: t('eventPaymentStatus.paymentSuccessful'),
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    failed: {
      icon: XCircle,
      title: t('eventPaymentStatus.paymentFailed'),
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    pending: {
      icon: Clock,
      title: t('eventPaymentStatus.paymentProcessing'),
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    error: {
      icon: AlertTriangle,
      title: t('eventPaymentStatus.verificationError'),
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  };

  const config = statusConfig[status];
  const IconComponent = config.icon;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className={`mx-auto w-20 h-20 rounded-full ${config.bgColor} flex items-center justify-center mb-4`}>
            {status === "loading" ? (
              <div className="w-10 h-10 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin" />
            ) : IconComponent ? (
              <IconComponent className={`w-10 h-10 ${config.color}`} />
            ) : null}
          </div>
          <CardTitle className={`text-2xl ${config.color}`}>
            {config.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === "loading" ? (
            <>
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </>
          ) : (
            <>
              <p className="text-gray-600">{message}</p>
              
              {booking && status === "success" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left mt-4">
                  <h4 className="font-semibold text-green-800 mb-2">{t('eventPaymentStatus.bookingDetails')}</h4>
                  <p className="text-sm text-green-700">
                    <span className="font-medium">{t('eventPaymentStatus.event')}</span> {booking.event?.title || t('eventPaymentStatus.farmEvent')}
                  </p>
                  <p className="text-sm text-green-700">
                    <span className="font-medium">{t('eventPaymentStatus.date')}</span>{" "}
                    {new Date(booking.bookingDate).toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-green-700">
                    <span className="font-medium">{t('eventPaymentStatus.seatsLabel')}</span> {booking.adultSeats} {booking.adultSeats > 1 ? t('eventPaymentStatus.adults') : t('eventPaymentStatus.adult')}
                    {booking.childSeats > 0 && `, ${booking.childSeats} ${booking.childSeats > 1 ? t('eventPaymentStatus.children') : t('eventPaymentStatus.child')}`}
                  </p>
                  <p className="text-sm text-green-700">
                    <span className="font-medium">{t('eventPaymentStatus.total')}</span> ₹{parseFloat(booking.totalAmount).toFixed(2)}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                {status === "success" && (
                  <Button 
                    onClick={() => setLocation("/dashboard/events")}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {t('eventPaymentStatus.viewMyBookings')}
                  </Button>
                )}
                
                {status === "failed" && (
                  <Button 
                    onClick={() => window.history.back()}
                    className="flex-1"
                  >
                    {t('eventPaymentStatus.tryAgain')}
                  </Button>
                )}
                
                {status === "pending" && (
                  <Button 
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="flex-1"
                  >
                    {t('eventPaymentStatus.checkAgain')}
                  </Button>
                )}
                
                <Link href="/events" className="flex-1">
                  <Button variant="outline" className="w-full">
                    {t('eventPaymentStatus.browseEvents')}
                  </Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
