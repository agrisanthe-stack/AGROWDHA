import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";
import { Link, useLocation, useSearch } from "wouter";
import { Check, Crown, ShoppingBag, Building2, Star, Zap, ArrowRight, Loader2, Calendar, Shield, CreditCard, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { CustomerSubscriptionPlan } from "@shared/schema";

function formatIndianCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
}

function getBillingLabel(period: string) {
  if (period === 'monthly') return 'subscription.billingMonthly';
  if (period === '6months') return 'subscription.billing6Months';
  if (period === 'yearly') return 'subscription.billingYearly';
  return '';
}

function getSavingsLabel(plan: CustomerSubscriptionPlan, allPlans: CustomerSubscriptionPlan[]) {
  const monthlyPlan = allPlans.find(p => p.tier === plan.tier && p.billingPeriod === 'monthly');
  if (!monthlyPlan || plan.billingPeriod === 'monthly') return null;
  
  const monthlyPrice = parseFloat(String(monthlyPlan.price));
  const totalMonths = plan.billingPeriod === '6months' ? 6 : 12;
  const fullPrice = monthlyPrice * totalMonths;
  const actualPrice = parseFloat(String(plan.price));
  const savings = Math.round(((fullPrice - actualPrice) / fullPrice) * 100);
  
  if (savings > 0) return savings;
  return null;
}

const tierInfo: Record<string, { icon: any; color: string; gradient: string; badge: string; features: string[] }> = {
  family_basic: {
    icon: ShoppingBag,
    color: 'green',
    gradient: 'from-green-500 to-emerald-600',
    badge: 'subscription.badgeFamily',
    features: [
      'subscription.features.familyBasic1',
      'subscription.features.familyBasic2',
      'subscription.features.familyBasic3',
    ],
  },
  family_farm_direct: {
    icon: Star,
    color: 'green',
    gradient: 'from-emerald-500 to-teal-600',
    badge: 'subscription.badgeFamily',
    features: [
      'subscription.features.familyFarmDirect1',
      'subscription.features.familyFarmDirect2',
      'subscription.features.familyFarmDirect3',
      'subscription.features.familyFarmDirect4',
    ],
  },
  business_basic: {
    icon: Building2,
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    badge: 'subscription.badgeBusiness',
    features: [
      'subscription.features.businessBasic1',
      'subscription.features.businessBasic2',
      'subscription.features.businessBasic3',
      'subscription.features.businessBasic4',
    ],
  },
  business_farm_direct_pro: {
    icon: Crown,
    color: 'blue',
    gradient: 'from-indigo-500 to-purple-600',
    badge: 'subscription.badgeBusiness',
    features: [
      'subscription.features.businessFarmDirect1',
      'subscription.features.businessFarmDirect2',
      'subscription.features.businessFarmDirect3',
      'subscription.features.businessFarmDirect4',
      'subscription.features.businessFarmDirect5',
    ],
  },
};

export default function Subscription() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const searchQuery = useSearch();
  const [selectedBilling, setSelectedBilling] = useState<string>('monthly');
  const [verifying, setVerifying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const { data: plans = [] } = useQuery<CustomerSubscriptionPlan[]>({
    queryKey: ["/api/subscription-plans"],
  });

  const { data: subData, isLoading: subLoading } = useQuery<{ subscription: any }>({
    queryKey: ["/api/my-subscription"],
    enabled: !!user,
  });

  useEffect(() => {
    const params = new URLSearchParams(searchQuery);
    const payment = params.get('payment');
    const orderId = params.get('order_id');
    const planId = params.get('plan_id');

    if (payment === 'success' && orderId && user && !verifying && !paymentSuccess) {
      setVerifying(true);
      apiRequest("POST", "/api/payments/verify-subscription", {
        orderId,
        planId: planId ? parseInt(planId) : undefined,
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setPaymentSuccess(true);
            toast({ title: t('subscription.toastSubscriptionActivated'), description: t('subscription.toastSubscriptionActivatedDesc') });
            queryClient.invalidateQueries({ queryKey: ["/api/my-subscription"] });
            window.history.replaceState({}, '', '/subscription');
          } else {
            toast({ title: t('subscription.toastPaymentVerificationFailed'), description: data.message || t('subscription.toastContactSupport'), variant: "destructive" });
          }
        })
        .catch(() => {
          toast({ title: t('subscription.toastVerificationError'), description: t('subscription.toastVerificationErrorDesc'), variant: "destructive" });
        })
        .finally(() => setVerifying(false));
    }
  }, [searchQuery, user]);

  const subscribeMutation = useMutation({
    mutationFn: async (planId: number) => {
      const res = await apiRequest("POST", "/api/subscribe-payment", { planId });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Payment session creation failed");
      }

      if (data.sessionId) {
        if (typeof (window as any).Cashfree === 'undefined') {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
            script.async = true;
            script.defer = true;
            script.onload = () => resolve(undefined);
            script.onerror = () => reject(new Error("Failed to load payment SDK"));
            document.head.appendChild(script);
          });

          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          await new Promise(resolve => setTimeout(resolve, isMobile ? 2000 : 1000));

          if (typeof (window as any).Cashfree === 'undefined') {
            throw new Error("Payment SDK failed to load. Please check your internet connection and try again.");
          }
        }

        const sdkMode = data.mode || "production";
        const cashfree = await (window as any).Cashfree({ mode: sdkMode });

        if (!cashfree || typeof cashfree.checkout !== 'function') {
          throw new Error("Payment SDK initialization failed. Please refresh the page and try again.");
        }

        const result = await cashfree.checkout({
          paymentSessionId: data.sessionId,
        });

        if (!result) {
          throw new Error("Payment cancelled by user");
        }

        if (result.error) {
          const errorMessage = result.error.message || "Payment failed";
          if (errorMessage.toLowerCase().includes('cancel') ||
              errorMessage.toLowerCase().includes('abort') ||
              errorMessage.toLowerCase().includes('close')) {
            throw new Error("Payment cancelled by user");
          }
          throw new Error(errorMessage);
        }

        if (result.redirect === true) {
          return new Promise(() => {});
        }

        if (result.paymentDetails?.paymentStatus === 'SUCCESS') {
          const verifyResponse = await apiRequest("POST", "/api/payments/verify-subscription", {
            orderId: data.orderId,
            planId,
          });
          const verificationResult = await verifyResponse.json();
          if (verificationResult.success) {
            return verificationResult;
          } else {
            throw new Error(verificationResult.message || "Payment verification failed");
          }
        } else {
          throw new Error("Payment was not completed. Please try again.");
        }
      } else if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return new Promise(() => {});
      } else {
        throw new Error("Unable to initialize payment. Please try again.");
      }
    },
    onSuccess: (data: any) => {
      if (data?.success) {
        setPaymentSuccess(true);
        toast({ title: t('subscription.toastSubscriptionActivated'), description: t('subscription.toastSubscriptionActivatedDesc') });
        queryClient.invalidateQueries({ queryKey: ["/api/my-subscription"] });
      }
    },
    onError: (error: any) => {
      if (error.message !== "Payment cancelled by user") {
        toast({ title: t('subscription.toastPaymentFailed'), description: error.message || t('subscription.toastSomethingWrong'), variant: "destructive" });
      }
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/cancel-subscription");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: t('subscription.toastSubscriptionCancelled'), description: t('subscription.toastSubscriptionCancelledDesc') });
      queryClient.invalidateQueries({ queryKey: ["/api/my-subscription"] });
    },
    onError: () => {
      toast({ title: t('subscription.toastError'), description: t('subscription.toastCancelFailed'), variant: "destructive" });
    },
  });

  const activeSub = subData?.subscription;
  const tiers = ['family_basic', 'family_farm_direct', 'business_basic', 'business_farm_direct_pro'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Helmet>
        <title>{t('subscription.pageTitle')}</title>
        <meta name="description" content={t('subscription.pageDescription')} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{t('subscription.chooseYourPlan')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('subscription.planSubtitle')}
          </p>
        </div>

        {verifying && (
          <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
            <CardContent className="py-6">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <p className="font-semibold text-blue-900">{t('subscription.verifyingPayment')}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {paymentSuccess && !activeSub && (
          <Card className="mb-8 border-2 border-green-200 bg-green-50">
            <CardContent className="py-6">
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <p className="font-semibold text-green-900">{t('subscription.paymentSuccessActivating')}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeSub && (
          <Card className="mb-8 border-2 border-green-200 bg-green-50">
            <CardContent className="py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-900">{t('subscription.active')} {activeSub.plan?.name}</p>
                    <p className="text-sm text-green-700 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {t('subscription.expires')} {new Date(activeSub.endDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    {activeSub.paymentId && (
                      <p className="text-xs text-green-600 mt-0.5">
                        {t('subscription.paymentId')} {activeSub.paymentId}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-700 hover:bg-red-50"
                  onClick={() => {
                    if (confirm(t('subscription.cancelConfirm'))) {
                      cancelMutation.mutate();
                    }
                  }}
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                  {t('subscription.cancelSubscription')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 rounded-lg p-1">
            {['monthly', '6months', 'yearly'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedBilling(period)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedBilling === period
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period === 'monthly' ? t('subscription.monthly') : period === '6months' ? t('subscription.sixMonths') : t('subscription.yearly')}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map(tier => {
            const info = tierInfo[tier];
            const plan = plans.find(p => p.tier === tier && p.billingPeriod === selectedBilling);
            if (!plan) return null;

            const Icon = info.icon;
            const isCurrentPlan = activeSub?.plan?.tier === tier && activeSub?.plan?.billingPeriod === selectedBilling;
            const isCurrentTier = activeSub?.plan?.tier === tier;
            const savings = getSavingsLabel(plan, plans);
            const isFarmDirect = tier.includes('farm_direct');

            return (
              <Card
                key={tier}
                className={`relative overflow-hidden transition-all hover:shadow-lg ${
                  isCurrentPlan ? 'ring-2 ring-green-500' : ''
                } ${isFarmDirect ? 'border-2 border-amber-200' : ''}`}
              >
                {isFarmDirect && (
                  <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    {t('subscription.bestValue')}
                  </div>
                )}
                {savings && (
                  <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg">
                    {t('subscription.savePercent', { percent: savings })}
                  </div>
                )}

                <div className={`h-2 bg-gradient-to-r ${info.gradient}`} />

                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`h-8 w-8 rounded-full bg-gradient-to-r ${info.gradient} flex items-center justify-center`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {t(info.badge)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{formatIndianCurrency(parseFloat(String(plan.price)))}</span>
                    <span className="text-gray-500 text-sm">{t(getBillingLabel(plan.billingPeriod))}</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {info.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className={`h-4 w-4 mt-0.5 shrink-0 ${
                          t(feature).includes('0%') ? 'text-amber-500' : 'text-green-500'
                        }`} />
                        <span className={t(feature).includes('0%') ? 'font-semibold text-amber-700' : ''}>{t(feature)}</span>
                      </li>
                    ))}
                  </ul>

                  {!user ? (
                    <Button asChild className="w-full" variant="outline">
                      <Link href="/login">
                        {t('subscription.loginToSubscribe')} <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  ) : isCurrentPlan ? (
                    <Button className="w-full" disabled variant="outline">
                      {t('subscription.currentPlan')}
                    </Button>
                  ) : (
                    <Button
                      className={`w-full bg-gradient-to-r ${info.gradient} hover:opacity-90 text-white`}
                      onClick={() => subscribeMutation.mutate(plan.id)}
                      disabled={subscribeMutation.isPending || verifying}
                    >
                      {subscribeMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <CreditCard className="h-4 w-4 mr-1" />
                      )}
                      {isCurrentTier ? t('subscription.switchPeriod') : t('subscription.subscribe')} — {formatIndianCurrency(parseFloat(String(plan.price)))}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{t('subscription.withoutSubscription')}</CardTitle>
              <CardDescription>{t('subscription.canStillShop')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  {t('subscription.buyAvailableNow')}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  {t('subscription.standardFee')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-4 w-4 text-gray-300 flex items-center justify-center text-xs">✕</span>
                  {t('subscription.noPreHarvest')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-4 w-4 text-gray-300 flex items-center justify-center text-xs">✕</span>
                  {t('subscription.noWholesale')}
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}