import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Brain, Sparkles, CheckCircle, Clock } from "lucide-react";

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  durationType: string;
  isActive: boolean;
}

interface FarmerData {
  id: number;
  farmName: string;
  aiSubscriptionActive: boolean;
  aiSubscriptionExpiry: string | null;
}

export default function AISubscription() {
  const { toast } = useToast();
  const { t } = useTranslation();

  const { data: subscriptionPlans, isLoading: plansLoading } = useQuery<SubscriptionPlan[]>({
    queryKey: ['/api/ai-subscription-plans'],
  });

  const { data: farmerData, isLoading: farmerLoading } = useQuery<FarmerData>({
    queryKey: ['/api/farmers/me'],
  });

  const subscribeMutation = useMutation({
    mutationFn: async (planId: number) => {
      const response = await apiRequest("POST", `/api/farmers/subscribe-ai`, { planId });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('aiSubscription.subscriptionSuccessTitle'),
        description: t('aiSubscription.subscriptionSuccessDesc'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/farmers/me'] });
    },
    onError: (error) => {
      toast({
        title: t('aiSubscription.subscriptionFailedTitle'),
        description: t('aiSubscription.subscriptionFailedDesc'),
        variant: "destructive",
      });
    },
  });

  const isSubscribed = farmerData?.aiSubscriptionActive && 
    farmerData?.aiSubscriptionExpiry && 
    new Date(farmerData.aiSubscriptionExpiry) > new Date();

  const formatDuration = (duration: number, durationType: string) => {
    if (durationType === 'monthly') return `${duration} month${duration > 1 ? 's' : ''}`;
    if (durationType === 'yearly') return `${duration} year${duration > 1 ? 's' : ''}`;
    return `${duration} ${durationType}`;
  };

  const formatExpiryDate = (expiry: string | null) => {
    if (!expiry) return null;
    return new Date(expiry).toLocaleDateString();
  };

  if (plansLoading || farmerLoading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-gray-600">{t('aiSubscription.loadingPlans')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Brain className="w-8 h-8 text-purple-600" />
          {t('aiSubscription.title')}
        </h1>
        <p className="text-gray-600 mb-4">
          {t('aiSubscription.description')}
        </p>
        
        {isSubscribed && (
          <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">{t('aiSubscription.activeSubscription')}</h3>
                  <p className="text-sm text-green-600">
                    {t('aiSubscription.activeUntil', { date: formatExpiryDate(farmerData.aiSubscriptionExpiry) })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptionPlans?.map((plan) => (
          <Card key={plan.id} className="relative overflow-hidden border-2 hover:border-purple-200 transition-colors">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 transform rotate-45 translate-x-8 -translate-y-8"></div>
            
            <CardHeader className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <Badge variant="outline" className="text-xs">
                  {plan.durationType.toUpperCase()}
                </Badge>
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription className="text-sm">
                {plan.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">₹{plan.price}</span>
                  <span className="text-gray-600">
                    /{formatDuration(plan.duration, plan.durationType)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{t('aiSubscription.features.cropRecommendations')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{t('aiSubscription.features.layerOptimization')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{t('aiSubscription.features.roiProjections')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{t('aiSubscription.features.seasonalTiming')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{t('aiSubscription.features.companionPlanting')}</span>
                </div>
              </div>
              
              <Button 
                onClick={() => subscribeMutation.mutate(plan.id)}
                disabled={subscribeMutation.isPending || isSubscribed}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {subscribeMutation.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    {t('aiSubscription.subscribing')}
                  </>
                ) : isSubscribed ? (
                  t('aiSubscription.activeSubscriptionBtn')
                ) : (
                  t('aiSubscription.subscribeNow')
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">{t('aiSubscription.whyChoose')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-purple-600 mt-1" />
            <div>
              <h4 className="font-medium">{t('aiSubscription.benefits.mlInsightsTitle')}</h4>
              <p className="text-sm text-gray-600">
                {t('aiSubscription.benefits.mlInsightsDesc')}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 mt-1" />
            <div>
              <h4 className="font-medium">{t('aiSubscription.benefits.intelligentOptTitle')}</h4>
              <p className="text-sm text-gray-600">
                {t('aiSubscription.benefits.intelligentOptDesc')}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-purple-600 mt-1" />
            <div>
              <h4 className="font-medium">{t('aiSubscription.benefits.seasonalTimingTitle')}</h4>
              <p className="text-sm text-gray-600">
                {t('aiSubscription.benefits.seasonalTimingDesc')}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-purple-600 mt-1" />
            <div>
              <h4 className="font-medium">{t('aiSubscription.benefits.provenResultsTitle')}</h4>
              <p className="text-sm text-gray-600">
                {t('aiSubscription.benefits.provenResultsDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}