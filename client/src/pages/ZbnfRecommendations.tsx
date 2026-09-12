import React, { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { Sprout, TreePine, Leaf, Flower, Target, MapPin, Plus, Trash2, Save, Lightbulb, Camera, Upload, Eye, Bug, Clock, RotateCcw, Bell, Calendar, Droplets, BarChart3, Map, TrendingUp, ShieldAlert, UserCheck, FolderOpen, Brain, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import PlantationLayout from "@/components/PlantationLayout";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

// Schema definitions
const cropLayerSchema = z.object({
  layer: z.enum(["1", "2", "3", "4", "5"]),
  gapSize: z.string().min(1, "Gap size is required"),
  location: z.string().min(1, "Location is required"),
  existingCrops: z.string().optional(),
});

const gapAnalysisSchema = z.object({
  season: z.enum(["monsoon", "post_monsoon", "winter", "summer"]),
  soilType: z.enum(["Clay", "Sandy", "Loam", "Red Soil", "Black Soil", "Alluvial", "Laterite"]),
  waterAvailability: z.enum(["low", "moderate", "high"]),
  analysisMethod: z.enum(["manual", "camera"]),
  cropLayers: z.array(cropLayerSchema).min(1, "At least one crop layer is required"),
  additionalNotes: z.string().optional(),
});

type CropLayer = z.infer<typeof cropLayerSchema>;
type GapAnalysisForm = z.infer<typeof gapAnalysisSchema>;

// Layer configuration
const layerNames = {
  "1": "Canopy Trees (15m+)",
  "2": "Sub-canopy Trees (5-15m)",
  "3": "Shrub Layer (1-5m)",
  "4": "Herbaceous Layer (0.5-1m)",
  "5": "Ground Cover (0-0.5m)",
};

const layerIcons = {
  "1": TreePine,
  "2": TreePine,
  "3": Sprout,
  "4": Leaf,
  "5": Flower,
};

const layerColors = {
  "1": "bg-green-800",
  "2": "bg-green-600",
  "3": "bg-green-500",
  "4": "bg-green-400",
  "5": "bg-green-300",
};

function ZbnfRecommendations() {
  const { t } = useTranslation();
  const [recommendations, setRecommendations] = useState<any>(null);
  const [savedPlans, setSavedPlans] = useState<any[]>([]);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  
  // Debug effect to monitor recommendations state
  useEffect(() => {
    if (recommendations) {
      console.log("Recommendations state updated:", recommendations);
      console.log("Has recommendations array:", !!recommendations.recommendations);
      console.log("Recommendations length:", recommendations.recommendations?.length);
      console.log("Response structure:", {
        success: recommendations.success,
        recommendations: recommendations.recommendations,
        layerAnalysis: recommendations.layerAnalysis,
        summary: recommendations.summary,
        analysisType: recommendations.analysisType,
        timestamp: recommendations.timestamp
      });
    }
  }, [recommendations]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageAnalysis, setImageAnalysis] = useState<any>(null);
  const [rotationPlan, setRotationPlan] = useState<any>(null);
  const [showRotationDetails, setShowRotationDetails] = useState(false);
  const [jeevamruthaSchedule, setJeevamruthaSchedule] = useState<any>(null);
  const [showJeevamruthaGuide, setShowJeevamruthaGuide] = useState(false);
  const [pestAnalysis, setPestAnalysis] = useState<any>(null);
  const [farmerProfileLoaded, setFarmerProfileLoaded] = useState(false);

  const [aiMode, setAiMode] = useState(false);
  const [analysisMethod, setAnalysisMethod] = useState<'manual' | 'camera'>('manual');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPlan, setShowPlan] = useState(false);
  const [showJeevamruthaPlan, setShowJeevamruthaPlan] = useState(false);
  const [imageAnalysisResults, setImageAnalysisResults] = useState<any>(null);
  const [currentSeason, setCurrentSeason] = useState<string>('');
  const [useAIAnalysis, setUseAIAnalysis] = useState(false);
  const [subscriptionRequired, setSubscriptionRequired] = useState(false);
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [hasPendingSubscription, setHasPendingSubscription] = useState(false);
  const [showSavePlanDialog, setShowSavePlanDialog] = useState(false);
  const [planName, setPlanName] = useState("");
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user, token } = useAuth();
  
  // Check for planId in URL parameters
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1]);
  const planIdFromUrl = urlParams.get('planId');

  // Handle payment success verification (callback version)
  const handlePaymentSuccess = useCallback(async (orderId: string) => {
    try {
      console.log("Verifying AI subscription payment for orderId:", orderId);
      
      const response = await apiRequest("POST", "/api/payments/verify-ai-subscription", {
        orderId: orderId
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Payment verification result:", result);

        if (result.success && result.hasActiveSubscription) {
          // Refresh subscription status
          queryClient.invalidateQueries({ queryKey: ['/api/farmers/profile'] });
          queryClient.invalidateQueries({ queryKey: ['/api/farmers/ai-subscription-status'] });
          
          toast({
            title: t('zbnfRecommendations.toasts.aiSubscriptionActivated'),
            description: t('zbnfRecommendations.toasts.aiSubscriptionActivatedDesc'),
            variant: "default",
          });

          // Clear URL parameters
          const url = new URL(window.location.href);
          url.searchParams.delete('payment');
          url.searchParams.delete('orderId');
          window.history.replaceState({}, '', url.toString());
          
          // Set AI analysis to true and trigger refetch
          setUseAIAnalysis(true);
          
        } else {
          toast({
            title: t('zbnfRecommendations.toasts.paymentVerification'),
            description: t('zbnfRecommendations.toasts.paymentVerificationDesc'),
            variant: "default",
          });
        }
      } else {
        const errorData = await response.json();
        console.error("Payment verification failed:", errorData);
        toast({
          title: t('zbnfRecommendations.toasts.paymentVerificationFailed'),
          description: errorData.message || t('zbnfRecommendations.toasts.couldNotVerify'),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      toast({
        title: t('zbnfRecommendations.toasts.error'),
        description: t('zbnfRecommendations.toasts.failedToVerifyPayment'),
        variant: "destructive",
      });
    }
  }, [apiRequest, queryClient, toast, setUseAIAnalysis]);

  // Check if user returned from successful payment and verify payment
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const orderId = urlParams.get('orderId');
    
    if (paymentStatus === 'success' && orderId) {
      // Verify the payment and activate subscription
      handlePaymentSuccess(orderId);
    } else {
      // Check for legacy localStorage flag
      const shouldActivateAI = localStorage.getItem('activateAIAfterPayment');
      if (shouldActivateAI === 'true') {
        localStorage.removeItem('activateAIAfterPayment');
        setUseAIAnalysis(true);
        setSubscriptionRequired(false);
        toast({
          title: t('zbnfRecommendations.toasts.aiAnalysisActivated'),
          description: t('zbnfRecommendations.toasts.aiAnalysisActivatedDesc'),
        });
      }
    }
  }, [handlePaymentSuccess, toast]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pestImageInputRef = useRef<HTMLInputElement>(null);

  // Form setup
  const form = useForm<GapAnalysisForm>({
    resolver: zodResolver(gapAnalysisSchema),
    defaultValues: {
      season: "monsoon",
      soilType: "loam",
      waterAvailability: "moderate",
      analysisMethod: "manual",
      cropLayers: [
        {
          layer: "1",
          gapSize: "",
          location: "",
          existingCrops: "",
        }
      ],
      additionalNotes: "",
    },
  });

  // Check if user is authenticated farmer
  const isAuthenticatedFarmer = user && user.role === 'farmer';

  // Get farmer profile data
  const { data: farmerProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/zbnf/farmer-profile'],
    enabled: Boolean(isAuthenticatedFarmer && token),
    retry: false
  });

  // Get saved plans
  const { data: savedPlansData, refetch: refetchPlans } = useQuery({
    queryKey: ['/api/zbnf/saved-plans'],
    enabled: Boolean(isAuthenticatedFarmer && token),
    retry: false
  });

  // Get available AI subscription plans
  const { data: aiPlansData } = useQuery({
    queryKey: ['/api/farmer/ai-plans'],
    enabled: Boolean(isAuthenticatedFarmer && token),
    retry: false
  });

  // Check farmer's AI subscription status
  const { data: subscriptionStatus } = useQuery({
    queryKey: ['/api/farmer/ai-subscription-status'],
    enabled: Boolean(isAuthenticatedFarmer && token),
    retry: false
  });

  // Auto-populate form with farmer profile data
  useEffect(() => {
    if (farmerProfile?.success && farmerProfile.farmerData && !farmerProfileLoaded) {
      const { farmerData } = farmerProfile;
      
      // Update form with existing crops info
      if (farmerData.existingCrops && farmerData.existingCrops.length > 0) {
        form.setValue('additionalNotes', `Existing crops: ${farmerData.existingCrops.join(', ')}`);
      }
      
      setFarmerProfileLoaded(true);
      toast({
        title: t('zbnfRecommendations.toasts.farmerProfileLoaded'),
        description: t('zbnfRecommendations.toasts.farmerProfileLoadedDesc', { farmName: farmerData.farmName, district: farmerData.district }),
        variant: "default",
      });
    }
  }, [farmerProfile, farmerProfileLoaded, form, toast]);

  // Auto-load plan if planId is provided in URL
  useEffect(() => {
    if (planIdFromUrl && savedPlansData?.success && savedPlansData.plans?.length > 0) {
      const planToLoad = savedPlansData.plans.find(plan => plan.id === parseInt(planIdFromUrl));
      if (planToLoad) {
        console.log('Auto-loading plan from URL:', planToLoad);
        loadSavedPlan(planToLoad);
      }
    }
  }, [planIdFromUrl, savedPlansData]);

  // Handle payment success return
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment') === 'success';
    const shouldActivateAI = localStorage.getItem('activateAIAfterPayment');
    
    if (paymentSuccess && shouldActivateAI) {
      // Clear the flag
      localStorage.removeItem('activateAIAfterPayment');
      
      // Remove payment parameter from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      // Show success message and automatically enable AI
      setTimeout(() => {
        toast({
          title: t('zbnfRecommendations.toasts.paymentSuccessful'),
          description: t('zbnfRecommendations.toasts.paymentSuccessfulDesc'),
          duration: 5000,
        });
        
        // Automatically enable AI toggle
        setUseAIAnalysis(true);
      }, 1000);
    }
  }, [toast]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "cropLayers",
  });

  // AI analysis state is already declared above

  // Handle AI toggle function - AI is now FREE, no subscription required
  const handleAIToggle = async () => {
    if (!useAIAnalysis) {
      // User wants to turn on AI - enable directly (FREE feature now)
      setUseAIAnalysis(true);
      toast({
        title: t('zbnfRecommendations.toasts.aiEnabled'),
        description: t('zbnfRecommendations.toasts.aiEnabledDesc'),
      });
    } else {
      // User wants to turn off AI
      setUseAIAnalysis(false);
      toast({
        title: t('zbnfRecommendations.toasts.aiDisabled'),
        description: t('zbnfRecommendations.toasts.aiDisabledDesc'),
      });
    }
  };

  // Handle subscription purchase
  const handleSubscriptionPurchase = async () => {
    if (!selectedPlan) {
      toast({
        title: t('zbnfRecommendations.toasts.noPlanSelected'),
        description: t('zbnfRecommendations.toasts.noPlanSelectedDesc'),
        variant: "destructive",
      });
      return;
    }

    try {
      setHasPendingSubscription(true);
      
      // Create payment session for the selected plan
      const response = await apiRequest("POST", "/api/create-ai-subscription-payment", {
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        amount: selectedPlan.price,
        duration: selectedPlan.duration,
        durationType: selectedPlan.durationType
      });

      const paymentData = await response.json();
      console.log("Payment response:", paymentData);
      console.log("Payment response debug:", paymentData.debug);

      if (paymentData.success) {
        // Set flag to activate AI after payment
        localStorage.setItem('activateAIAfterPayment', 'true');
        
        // Debug the payment URL
        console.log("Payment URL:", paymentData.paymentUrl);
        console.log("Session ID:", paymentData.sessionId);
        console.log("Use SDK:", paymentData.useSDK);
        
        // Use Cashfree SDK for payment (matching Checkout.tsx pattern)
        if (paymentData.sessionId) {
          console.log("Using Cashfree SDK for AI subscription payment");
          
          // Check if Cashfree SDK is loaded (should be in index.html)
          if (typeof (window as any).Cashfree === 'undefined') {
            console.error("Cashfree SDK not loaded. Attempting to load dynamically...");
            
            // Try to load Cashfree SDK dynamically
            await new Promise<void>((resolve, reject) => {
              const script = document.createElement('script');
              script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
              script.async = true;
              script.defer = true;
              
              script.onload = () => {
                console.log("Cashfree SDK script loaded successfully");
                resolve();
              };
              
              script.onerror = (error) => {
                console.error("Failed to load Cashfree SDK script:", error);
                reject(new Error("Failed to load payment SDK"));
              };
              
              document.head.appendChild(script);
            });
            
            // Wait for SDK to initialize
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            if (typeof (window as any).Cashfree === 'undefined') {
              throw new Error("Cashfree SDK failed to load. Please check your internet connection and try again.");
            }
          }
          
          // Initialize Cashfree SDK
          const cashfree = await (window as any).Cashfree({
            mode: "production"
          });
          
          if (!cashfree || typeof cashfree.checkout !== 'function') {
            throw new Error("Payment SDK initialization failed. Please refresh the page and try again.");
          }
          
          console.log("Cashfree SDK initialized successfully");
          
          toast({
            title: t('zbnfRecommendations.toasts.paymentGatewayLoading'),
            description: t('zbnfRecommendations.toasts.paymentGatewayLoadingDesc'),
            variant: "default",
          });
          
          // Start the payment checkout
          const checkoutOptions = {
            paymentSessionId: paymentData.sessionId
          };
          
          console.log("Starting Cashfree checkout with options:", checkoutOptions);
          
          const result = await cashfree.checkout(checkoutOptions);
          
          console.log("Cashfree payment result:", result);
          
          // Handle the result
          if (!result) {
            console.log("Payment was cancelled or closed without completion");
            throw new Error("Payment cancelled by user");
          }
          
          if (result.error) {
            console.error("Cashfree payment error:", result.error);
            throw new Error(result.error.message || "Payment failed");
          }
          
          // Handle redirect case
          if (result.redirect === true) {
            console.log("Payment redirect initiated by Cashfree SDK");
            return; // Cashfree will handle the redirect
          }
          
          // Payment completed successfully
          if (result.paymentDetails) {
            toast({
              title: t('zbnfRecommendations.toasts.paymentSuccessfulSub'),
              description: t('zbnfRecommendations.toasts.paymentSuccessfulSubDesc'),
            });
            // Refresh subscription status
            window.location.href = '/zbnf-recommendations?payment=success';
          }
        } else if (paymentData.paymentUrl) {
          // Use regular URL redirect as fallback
          const paymentWindow = window.open(paymentData.paymentUrl, '_blank');
          
          if (!paymentWindow) {
            // If popup blocked, use current window
            window.location.href = paymentData.paymentUrl;
          } else {
            toast({
              title: t('zbnfRecommendations.toasts.paymentGatewayOpened'),
              description: t('zbnfRecommendations.toasts.paymentGatewayOpenedDesc'),
              variant: "default",
            });
          }
        } else {
          throw new Error("No valid payment method available");
        }
      } else {
        throw new Error(paymentData.message || "Payment session creation failed");
      }
    } catch (error) {
      console.error("Subscription purchase error:", error);
      toast({
        title: t('zbnfRecommendations.toasts.paymentError'),
        description: error instanceof Error ? error.message : t('zbnfRecommendations.toasts.paymentError'),
        variant: "destructive",
      });
      setHasPendingSubscription(false);
    }
  };

  // Save plan mutation
  const savePlanMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest("POST", "/api/zbnf/save-plan", data),
    onSuccess: async (response) => {
      const result = await response.json();
      refetchPlans(); // Refresh saved plans list
      setShowSavePlanDialog(false);
      setPlanName("");
      toast({
        title: t('zbnfRecommendations.toasts.planSaved'),
        description: t('zbnfRecommendations.toasts.planSavedDesc'),
      });
    },
    onError: (error) => {
      toast({
        title: t('zbnfRecommendations.toasts.saveFailed'),
        description: t('zbnfRecommendations.toasts.saveFailedDesc'),
        variant: "destructive",
      });
    },
  });

  // Handle save plan
  const handleSavePlan = () => {
    if (!recommendations || !farmerProfile?.success) {
      toast({
        title: t('zbnfRecommendations.toasts.cannotSavePlan'),
        description: t('zbnfRecommendations.toasts.cannotSavePlanDesc'),
        variant: "destructive",
      });
      return;
    }

    if (!planName.trim()) {
      toast({
        title: t('zbnfRecommendations.toasts.planNameRequired'),
        description: t('zbnfRecommendations.toasts.planNameRequiredDesc'),
        variant: "destructive",
      });
      return;
    }

    const saveData = {
      planName: planName.trim(),
      district: farmerProfile.farmerData.district,
      farmLocation: farmerProfile.farmerData.district,
      farmData: {
        ...farmerProfile.farmerData,
        season: form.getValues('season'),
        soilType: form.getValues('soilType'),
        waterAvailability: form.getValues('waterAvailability'),
        analysisMethod: form.getValues('analysisMethod'),
        additionalNotes: form.getValues('additionalNotes')
      },
      recommendations: recommendations?.recommendations || recommendations,
      layoutData: imageAnalysis?.layout || null
    };

    savePlanMutation.mutate(saveData);
  };

  // Load saved plan function
  const loadSavedPlan = (plan: any) => {
    try {
      console.log("Loading saved plan:", plan);
      
      // Set the recommendations from the saved plan
      if (plan.recommendations) {
        setRecommendations({
          success: true,
          recommendations: Array.isArray(plan.recommendations) ? plan.recommendations : [plan.recommendations],
          summary: `Loaded from saved plan: ${plan.planName}`,
          analysisType: plan.analysisMethod || 'manual',
          timestamp: plan.createdAt
        });
      }

      // Set form values from saved plan
      if (plan.farmData) {
        form.setValue('season', plan.season || 'monsoon');
        form.setValue('soilType', plan.soilType || 'loam');
        form.setValue('waterAvailability', plan.waterAvailability || 'moderate');
        form.setValue('analysisMethod', plan.analysisMethod || 'manual');
        if (plan.notes) {
          form.setValue('additionalNotes', plan.notes);
        }
      }

      // Set layout data if available
      if (plan.layoutData) {
        setImageAnalysis({
          layout: plan.layoutData,
          detectedTrees: plan.layoutData.detectedTrees || [],
          detectedGaps: plan.layoutData.detectedGaps || []
        });
      }

      toast({
        title: t('zbnfRecommendations.toasts.planLoadedSuccessfully'),
        description: t('zbnfRecommendations.toasts.planLoadedSuccessfullyDesc', { planName: plan.planName, count: plan.recommendations?.length || 0 }),
      });

      // Scroll to recommendations section
      setTimeout(() => {
        const recommendationsSection = document.getElementById('recommendations-section');
        if (recommendationsSection) {
          recommendationsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
    } catch (error) {
      console.error('Error loading saved plan:', error);
      toast({
        title: t('zbnfRecommendations.toasts.errorLoadingPlan'),
        description: t('zbnfRecommendations.toasts.errorLoadingPlanDesc'),
        variant: "destructive",
      });
    }
  };

  // Gap analysis mutation
  const analysisMutation = useMutation({
    mutationFn: (data: GapAnalysisForm) => {
      // Include detected trees in the analysis if available
      const analysisData = {
        ...data,
        detectedTrees: imageAnalysis?.detectedTrees || null
      };
      return apiRequest("POST", "/api/zbnf/gap-analysis", analysisData);
    },
    onSuccess: async (response) => {
      const result = await response.json();
      console.log("Gap Analysis Response:", result);
      console.log("Response type:", typeof result);
      console.log("Response keys:", Object.keys(result));
      console.log("Recommendations array:", result.recommendations);
      setRecommendations(result);
      toast({
        title: t('zbnfRecommendations.toasts.analysisComplete'),
        description: t('zbnfRecommendations.toasts.analysisCompleteDesc', { count: result.recommendations?.length || 0, withLayer: result.layerAnalysis ? t('zbnfRecommendations.toasts.withLayerAnalysis') : '' }),
      });
    },
    onError: (error) => {
      toast({
        title: t('zbnfRecommendations.toasts.analysisFailed'),
        description: t('zbnfRecommendations.toasts.analysisFailedDesc'),
        variant: "destructive",
      });
    },
  });

  // AI-powered gap analysis mutation  
  const aiAnalysisMutation = useMutation({
    mutationFn: async (data: GapAnalysisForm) => {
      // Include detected trees in the analysis if available
      const analysisData = {
        ...data,
        detectedTrees: imageAnalysis?.detectedTrees || null
      };
      
      const response = await apiRequest("POST", `/api/zbnf/ai-gap-analysis`, analysisData);
      
      // Check if response indicates subscription required
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify({ ...errorData, status: response.status }));
      }
      
      return response.json();
    },
    onSuccess: (result) => {
      console.log("AI Analysis completed:", result);
      setRecommendations(result);
      toast({
        title: t('zbnfRecommendations.toasts.aiAnalysisComplete'),
        description: t('zbnfRecommendations.toasts.aiAnalysisCompleteDesc', { count: result.recommendations?.length || 0 }),
      });
    },
    onError: (error) => {
      console.error("AI Analysis error:", error);
      
      try {
        const errorData = JSON.parse(error.message);
        toast({
          title: t('zbnfRecommendations.toasts.aiAnalysisFailed'),
          description: errorData.message || t('zbnfRecommendations.toasts.aiAnalysisFailedDesc'),
          variant: "destructive",
        });
      } catch {
        toast({
          title: t('zbnfRecommendations.toasts.aiAnalysisFailed'),
          description: t('zbnfRecommendations.toasts.aiAnalysisFailedGeneric'),
          variant: "destructive",
        });
      }
    },
  });



  // Image analysis mutation
  const imageAnalysisMutation = useMutation({
    mutationFn: (formData: FormData) => 
      apiRequest("POST", "/api/zbnf/analyze-image", formData, { isFormData: true }),
    onSuccess: async (response) => {
      const result = await response.json();
      setImageAnalysis(result);
      
      // Auto-populate form with detected gaps
      if (result.detectedGaps && result.detectedGaps.length > 0) {
        const detectedLayers = result.detectedGaps.map((gap: any, index: number) => ({
          layer: gap.suggestedLayer || "1",
          gapSize: gap.size || `${gap.width}m x ${gap.height}m`,
          location: gap.location || `Gap ${index + 1}`,
          existingCrops: gap.nearbyTrees?.join(', ') || "",
        }));
        
        form.setValue('cropLayers', detectedLayers);
        form.setValue('analysisMethod', 'camera');
      }
      
      toast({
        title: t('zbnfRecommendations.toasts.imageAnalysisComplete'),
        description: t('zbnfRecommendations.toasts.imageAnalysisCompleteDesc', { gaps: result.detectedGaps?.length || 0, trees: result.detectedTrees?.length || 0 }),
      });
    },
    onError: (error) => {
      toast({
        title: t('zbnfRecommendations.toasts.imageAnalysisFailed'),
        description: t('zbnfRecommendations.toasts.imageAnalysisFailedDesc'),
        variant: "destructive",
      });
    },
  });

  // Pest analysis mutation
  const pestAnalysisMutation = useMutation({
    mutationFn: (formData: FormData) => 
      apiRequest("POST", "/api/zbnf/analyze-pest", formData, { isFormData: true }),
    onSuccess: async (response) => {
      const result = await response.json();
      setPestAnalysis(result);
      toast({
        title: t('zbnfRecommendations.toasts.pestAnalysisComplete'),
        description: t('zbnfRecommendations.toasts.pestAnalysisCompleteDesc', { count: result.detectedPests?.length || 0 }),
      });
    },
    onError: (error) => {
      toast({
        title: t('zbnfRecommendations.toasts.pestAnalysisFailed'),
        description: t('zbnfRecommendations.toasts.pestAnalysisFailedDesc'),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: GapAnalysisForm) => {
    if (useAIAnalysis) {
      // AI analysis is now FREE - no subscription check needed
      aiAnalysisMutation.mutate(data);
    } else {
      analysisMutation.mutate(data);
    }
  };

  const addCropLayer = () => {
    append({
      layer: "1",
      gapSize: "",
      location: "",
      existingCrops: "",
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast({
        title: t('zbnfRecommendations.toasts.invalidFile'),
        description: t('zbnfRecommendations.toasts.invalidFileDesc'),
        variant: "destructive",
      });
      return;
    }

    // Preview the image
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setUploadedImages([e.target.result as string]);
      }
    };
    reader.readAsDataURL(file);

    // Analyze the image
    const formData = new FormData();
    formData.append('image', file);
    formData.append('farmLocation', form.getValues('farmLocation') || 'Unknown');
    formData.append('season', form.getValues('season'));
    formData.append('soilType', form.getValues('soilType'));

    imageAnalysisMutation.mutate(formData);
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const triggerPestImageUpload = () => {
    pestImageInputRef.current?.click();
  };

  const handlePestImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast({
        title: t('zbnfRecommendations.toasts.invalidFile'),
        description: t('zbnfRecommendations.toasts.invalidFileDesc'),
        variant: "destructive",
      });
      return;
    }

    // Analyze the pest image
    const formData = new FormData();
    formData.append('image', file);
    formData.append('farmLocation', form.getValues('farmLocation') || 'Unknown');
    formData.append('cropType', 'mixed');

    pestAnalysisMutation.mutate(formData);
  };

  const generateRotationPlan = () => {
    const currentCrops = form.getValues('cropLayers').map(layer => layer.existingCrops).filter(Boolean);
    const location = form.getValues('farmLocation');
    
    // Generate rotation plan based on ZBNF principles
    const rotationData = {
      seasons: [
        {
          name: "Monsoon (June-September)",
          months: "Jun-Sep",
          mainCrop: "Rice/Millets",
          companionCrops: "Legumes, Green manure"
        },
        {
          name: "Post-Monsoon (October-December)",
          months: "Oct-Dec",
          mainCrop: "Vegetables",
          companionCrops: "Leafy greens, Root vegetables"
        },
        {
          name: "Winter (January-February)",
          months: "Jan-Feb",
          mainCrop: "Pulses",
          companionCrops: "Mustard, Coriander"
        },
        {
          name: "Summer (March-May)",
          months: "Mar-May",
          mainCrop: "Drought-resistant crops",
          companionCrops: "Cover crops, Mulching"
        }
      ],
      principles: [
        "Nitrogen-fixing crops before heavy feeders",
        "Deep-rooted crops alternate with shallow-rooted",
        "Cover crops during fallow periods",
        "Diverse crop families to break pest cycles"
      ]
    };
    
    setRotationPlan(rotationData);
    toast({
      title: t('zbnfRecommendations.toasts.rotationPlanGenerated'),
      description: t('zbnfRecommendations.toasts.rotationPlanGeneratedDesc'),
    });
  };

  const setupJeevamruthaReminders = () => {
    const today = new Date();
    const schedule = [];
    
    // Generate next 12 reminders (6 months) with 15-day intervals
    for (let i = 0; i < 12; i++) {
      const reminderDate = new Date(today);
      reminderDate.setDate(today.getDate() + (i * 15)); // Every 15 days
      
      const isPreparationDay = i % 2 === 0; // Prepare every 30 days, apply every 15 days
      
      schedule.push({
        activity: isPreparationDay ? "Prepare fresh Jeevamrutha (200L batch)" : "Apply Jeevamrutha (diluted 1:10)",
        date: reminderDate.toLocaleDateString(),
        priority: i < 4 ? "High" : "Medium",
        notes: isPreparationDay 
          ? "Start fermentation 7 days before application. Use fresh ingredients." 
          : "Apply early morning/evening. 1-2L per plant. Check soil moisture first.",
        type: isPreparationDay ? "preparation" : "application",
        daysFromNow: i * 15
      });
    }
    
    setJeevamruthaSchedule(schedule);
    toast({
      title: t('zbnfRecommendations.toasts.reminderScheduleSet'),
      description: t('zbnfRecommendations.toasts.reminderScheduleSetDesc')
    });
  };



  // Show authentication warning if not logged in
  if (!user) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Alert className="border-orange-200 bg-orange-50">
          <ShieldAlert className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            {t('zbnfRecommendations.loginRequired')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show access denied if not a farmer or admin
  if (user.role !== 'farmer' && user.role !== 'admin') {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Alert className="border-red-200 bg-red-50">
          <ShieldAlert className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {t('zbnfRecommendations.accessDenied')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <UserCheck className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold text-green-800">{t('zbnfRecommendations.pageTitle')}</h1>
            <p className="text-gray-600">
              {t('zbnfRecommendations.pageDescription', { farmName: farmerProfile?.farmerData?.farmName || 'your farm' })}
            </p>
          </div>
        </div>
        
        {profileLoading && (
          <Alert className="border-blue-200 bg-blue-50 mb-4">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              {t('zbnfRecommendations.loadingProfile')}
            </AlertDescription>
          </Alert>
        )}
        
        {farmerProfile?.success && (
          <Alert className="border-green-200 bg-green-50 mb-4">
            <UserCheck className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {t('zbnfRecommendations.profileLoaded', { farmName: farmerProfile.farmerData.farmName, district: farmerProfile.farmerData.district })}
              {farmerProfile.farmerData.existingCrops?.length > 0 && (
                <span className="block mt-1">
                  {t('zbnfRecommendations.existingCrops', { crops: farmerProfile.farmerData.existingCrops.join(', ') })}
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analysis Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              {t('zbnfRecommendations.farmGapAnalysis')}
            </CardTitle>
            <CardDescription>
              {t('zbnfRecommendations.farmGapAnalysisDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Farm Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* District-based recommendations - location loaded from farmer profile */}
                  <div className="col-span-full">
                    <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800">{t('zbnfRecommendations.locationBased')}</span>
                      </div>
                      <p className="mt-1">
                        {t('zbnfRecommendations.locationBasedDesc', { district: farmerProfile?.farmerData?.district || t('zbnfRecommendations.loading') })}
                      </p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="season"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('zbnfRecommendations.currentSeason')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('zbnfRecommendations.selectSeason')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="monsoon">{t('zbnfRecommendations.monsoon')}</SelectItem>
                            <SelectItem value="post_monsoon">{t('zbnfRecommendations.postMonsoon')}</SelectItem>
                            <SelectItem value="winter">{t('zbnfRecommendations.winter')}</SelectItem>
                            <SelectItem value="summer">{t('zbnfRecommendations.summer')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="soilType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('zbnfRecommendations.soilType')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('zbnfRecommendations.selectSoilType')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Clay">{t('zbnfRecommendations.clay')}</SelectItem>
                            <SelectItem value="Sandy">{t('zbnfRecommendations.sandy')}</SelectItem>
                            <SelectItem value="Loam">{t('zbnfRecommendations.loam')}</SelectItem>
                            <SelectItem value="Red Soil">{t('zbnfRecommendations.redSoil')}</SelectItem>
                            <SelectItem value="Black Soil">{t('zbnfRecommendations.blackSoil')}</SelectItem>
                            <SelectItem value="Alluvial">{t('zbnfRecommendations.alluvial')}</SelectItem>
                            <SelectItem value="Laterite">{t('zbnfRecommendations.laterite')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="waterAvailability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('zbnfRecommendations.waterAvailability')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('zbnfRecommendations.selectWaterAvailability')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">{t('zbnfRecommendations.low')}</SelectItem>
                            <SelectItem value="moderate">{t('zbnfRecommendations.moderate')}</SelectItem>
                            <SelectItem value="high">{t('zbnfRecommendations.high')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="analysisMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('zbnfRecommendations.analysisMethod')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('zbnfRecommendations.selectAnalysisMethod')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="manual">{t('zbnfRecommendations.manualInput')}</SelectItem>
                            <SelectItem value="camera">{t('zbnfRecommendations.cameraAnalysis')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {t('zbnfRecommendations.cameraAnalysisDesc')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Camera Analysis Section */}
                {form.watch('analysisMethod') === 'camera' && (
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Camera className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-blue-800">{t('zbnfRecommendations.cameraAnalysisTitle')}</h3>
                      </div>
                      
                      <p className="text-sm text-blue-700">
                        {t('zbnfRecommendations.cameraAnalysisInfo')}
                      </p>

                      <div className="flex gap-4">
                        <Button 
                          type="button" 
                          onClick={triggerImageUpload}
                          disabled={imageAnalysisMutation.isPending}
                          variant="outline"
                          className="border-blue-300 text-blue-700 hover:bg-blue-100"
                        >
                          {imageAnalysisMutation.isPending ? (
                            <>
                              <Eye className="h-4 w-4 mr-2 animate-spin" />
                              {t('zbnfRecommendations.analyzing')}
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              {t('zbnfRecommendations.uploadFarmImage')}
                            </>
                          )}
                        </Button>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageUpload}
                        className="hidden"
                      />

                      {uploadedImages.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-blue-800">{t('zbnfRecommendations.uploadedImage')}</h4>
                          <div className="grid grid-cols-1 gap-2">
                            {uploadedImages.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Farm analysis ${index + 1}`}
                                className="w-full h-48 object-cover rounded-lg border border-blue-200"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {imageAnalysis && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-blue-800">{t('zbnfRecommendations.analysisResults')}</h4>
                          <div className="text-sm text-blue-700 space-y-1">
                            <p>• {t('zbnfRecommendations.detectedTrees')} {imageAnalysis.detectedTrees?.length || 0}</p>
                            <p>• {t('zbnfRecommendations.detectedGaps')} {imageAnalysis.detectedGaps?.length || 0}</p>
                            <p>• {t('zbnfRecommendations.averageGapSize')} {imageAnalysis.averageGapSize || 'N/A'}</p>
                            <p>• {t('zbnfRecommendations.soilHealthScore')} {imageAnalysis.soilHealthScore || 'N/A'}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Crop Layer Gaps */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{t('zbnfRecommendations.cropLayerGaps')}</h3>
                    <Button type="button" onClick={addCropLayer} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('zbnfRecommendations.addLayer')}
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <FormField
                            control={form.control}
                            name={`cropLayers.${index}.layer`}
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="w-48">
                                      <SelectValue placeholder={t('zbnfRecommendations.selectLayer')} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Object.entries(layerNames).map(([value, name]) => (
                                      <SelectItem key={value} value={value}>
                                        <div className="flex items-center gap-2">
                                          <div className={`w-3 h-3 rounded-full ${layerColors[value as keyof typeof layerColors]}`} />
                                          {name}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        {fields.length > 1 && (
                          <Button type="button" onClick={() => remove(index)} size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name={`cropLayers.${index}.gapSize`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('zbnfRecommendations.gapSize')}</FormLabel>
                              <FormControl>
                                <Input placeholder={t('zbnfRecommendations.gapSizePlaceholder')} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`cropLayers.${index}.location`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('zbnfRecommendations.gapLocation')}</FormLabel>
                              <FormControl>
                                <Input placeholder={t('zbnfRecommendations.gapLocationPlaceholder')} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`cropLayers.${index}.existingCrops`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('zbnfRecommendations.nearbyCrops')}</FormLabel>
                              <FormControl>
                                <Input placeholder={t('zbnfRecommendations.nearbyCropsPlaceholder')} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Additional Notes */}
                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('zbnfRecommendations.additionalNotes')}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={t('zbnfRecommendations.additionalNotesPlaceholder')}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* AI Analysis Toggle */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{t('zbnfRecommendations.analysisType')}</h3>
                        <p className="text-sm text-gray-600">
                          {useAIAnalysis ? t('zbnfRecommendations.aiPowered') : t('zbnfRecommendations.standardRuleBased')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{t('zbnfRecommendations.standard')}</span>
                      <button
                        type="button"
                        onClick={() => {
                          handleAIToggle();
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          useAIAnalysis ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            useAIAnalysis ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className="text-sm text-blue-600 font-medium">{t('zbnfRecommendations.ai')}</span>
                    </div>
                  </div>
                  {useAIAnalysis && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-blue-700 bg-blue-100 p-2 rounded">
                      <BarChart3 className="h-4 w-4" />
                      <span>{t('zbnfRecommendations.aiEnhancedDesc')}</span>
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className={`w-full ${useAIAnalysis ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
                  disabled={analysisMutation.isPending || aiAnalysisMutation.isPending}
                >
                  {(analysisMutation.isPending || aiAnalysisMutation.isPending) ? (
                    <>
                      <Lightbulb className="h-4 w-4 mr-2 animate-spin" />
                      {useAIAnalysis ? t('zbnfRecommendations.aiAnalyzing') : t('zbnfRecommendations.analyzingGaps')}
                    </>
                  ) : (
                    <>
                      {useAIAnalysis ? (
                        <>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          {t('zbnfRecommendations.getAiRecommendations')}
                        </>
                      ) : (
                        <>
                          <Lightbulb className="h-4 w-4 mr-2" />
                          {t('zbnfRecommendations.getStandardRecommendations')}
                        </>
                      )}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <div className="space-y-6">
          {recommendations && (
            <Card id="recommendations-section">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {recommendations.aiFeatures ? (
                      <>
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        <CardTitle>{t('zbnfRecommendations.aiAnalysisCompleteTitle')}</CardTitle>
                      </>
                    ) : (
                      <>
                        <Lightbulb className="h-5 w-5 text-green-600" />
                        <CardTitle>{t('zbnfRecommendations.analysisCompleteTitle')}</CardTitle>
                      </>
                    )}
                  </div>
                  {recommendations.averageConfidence && (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      {recommendations.averageConfidence}% {t('zbnfRecommendations.aiConfidence')}
                    </Badge>
                  )}
                </div>
                <CardDescription className={`p-3 rounded-lg border mt-3 ${
                  recommendations.aiFeatures 
                    ? 'bg-blue-50 text-blue-800 border-blue-200' 
                    : 'bg-green-50 text-green-800 border-green-200'
                }`}>
                  {recommendations.summary || `Based on your ${imageAnalysis ? `${imageAnalysis.detectedGaps?.length || 0}` : form.getValues('cropLayers').length} gap analysis and 
                  ${imageAnalysis ? ` missing Layer ${form.getValues('cropLayers').map(l => l.layer).join(', ')} crops` : ' crop layer assessment'}, 
                  we recommend introducing medium-height fruit trees.`}
                </CardDescription>
                
                {/* AI Features Display */}
                {recommendations.aiFeatures && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200 mt-4">
                    <h4 className="font-semibold text-blue-800 mb-2">{t('zbnfRecommendations.aiEnhancementFeatures')}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {recommendations.aiFeatures.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-blue-700">
                          <BarChart3 className="h-3 w-3" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Analysis Summary Banner */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-green-800">{t('zbnfRecommendations.farmAnalysisSummary')}</h3>
                      <p className="text-sm text-green-700 mt-1">
                        {imageAnalysis ? (
                          <>{t('zbnfRecommendations.detectedTreesWithGaps', { trees: imageAnalysis.detectedTrees?.length || 0, gaps: imageAnalysis.detectedGaps?.length || 0 })}</>
                        ) : (
                          <>{t('zbnfRecommendations.analyzedCropLayers', { count: form.getValues('cropLayers').length })}</>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600 text-white">{t('zbnfRecommendations.highMatch')}</Badge>
                      <Button 
                        onClick={() => setShowSavePlanDialog(true)}
                        disabled={savePlanMutation.isPending}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {t('zbnfRecommendations.savePlan')}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Recommended Crops Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{t('zbnfRecommendations.recommendedCrops')}</h3>
                    {recommendations?.recommendations && (
                      <Badge className="bg-green-600 text-white">
                        {t('zbnfRecommendations.cropsFound', { count: recommendations.recommendations?.length || 0 })}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Layer Visualization */}
                  <div className="bg-gradient-to-b from-sky-100 to-green-100 p-6 rounded-lg border-2 border-dashed border-green-300">
                    <div className="space-y-4">
                      {/* Layer 1 - Existing Canopy Trees */}
                      <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-8 bg-green-800 rounded-full"></div>
                          <div>
                            <h4 className="font-medium">{t('zbnfRecommendations.layer1Canopy')}</h4>
                            <p className="text-sm text-gray-600">{t('zbnfRecommendations.existing')}: {imageAnalysis?.detectedTrees?.map((tr: any) => tr.type).join(', ') || t('zbnfRecommendations.defaultTrees')}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{t('zbnfRecommendations.established')}</Badge>
                      </div>

                      {/* Recommended Crops Display */}
                      {(() => {
                        // Debug: Show what we received
                        console.log("Full recommendations object:", recommendations);
                        console.log("Recommendations structure:", recommendations ? Object.keys(recommendations) : 'null');
                        
                        // Try to get recommendations from either nested or direct structure
                        // Access recommendations - they should be at recommendations.recommendations based on server response
                        const recs = recommendations?.recommendations || [];
                        return recs.length > 0 ? (
                          recs.map((rec: any, index: number) => {
                        const layerInfo = {
                          2: { name: t('zbnfRecommendations.subCanopyTrees'), range: "5-15m", color: "bg-green-600" },
                          3: { name: t('zbnfRecommendations.shrubLayer'), range: "1-5m", color: "bg-green-500" },
                          4: { name: t('zbnfRecommendations.herbaceousLayer'), range: "0.5-1m", color: "bg-green-400" },
                          5: { name: t('zbnfRecommendations.groundCover'), range: "0-0.5m", color: "bg-green-300" }
                        };
                        
                        const layer = layerInfo[(rec.layer || rec.targetLayer) as keyof typeof layerInfo];
                        if (!layer) return null;

                        const gapInfo = form.getValues('cropLayers')[index];

                        return (
                          <div key={index} className="p-4 bg-white rounded-lg border border-green-200 shadow-sm">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4 flex-1">
                                <div className={`w-4 h-6 ${layer.color} rounded-full mt-1 flex-shrink-0`}></div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Sprout className="h-4 w-4 text-green-600" />
                                    <h4 className="font-semibold text-lg">{rec.cropName} (Layer {rec.layer || rec.targetLayer})</h4>
                                    <Badge className="bg-orange-500 text-white text-xs">90% {t('zbnfRecommendations.match')}</Badge>
                                  </div>
                                  
                                  {rec.scientificName && (
                                    <p className="text-sm text-gray-600 italic mb-2">{rec.scientificName}</p>
                                  )}
                                  
                                  <p className="text-sm text-gray-700 mb-3">
                                    {t('zbnfRecommendations.perfectForGaps', { gapSize: gapInfo?.gapSize || '6m+' })}
                                  </p>
                                  
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                                    <div className="flex items-center gap-1">
                                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                      <span className="font-medium">{layer.range} {t('zbnfRecommendations.height')}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-blue-600" />
                                      <span>{t('zbnfRecommendations.monthsRange')}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Leaf className="w-3 h-3 text-green-600" />
                                      <span>{t('zbnfRecommendations.claySoilFriendly')}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-3 flex items-center gap-1 text-xs text-green-700">
                                    <Calendar className="w-3 h-3" />
                                    <span>{t('zbnfRecommendations.bestPlantedDuring', { season: rec.plantingSeason })}</span>
                                  </div>

                                  {rec.benefits && Array.isArray(rec.benefits) && rec.benefits.length > 0 && (
                                    <div className="mt-3">
                                      <div className="flex flex-wrap gap-1">
                                        {rec.benefits.slice(0, 3).map((benefit, idx) => (
                                          <Badge key={idx} variant="secondary" className="text-xs bg-green-100 text-green-800">
                                            {typeof benefit === 'string' ? benefit.replace('_', ' ') : benefit}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  <div className="mt-2 text-xs text-gray-600">
                                    <strong>{t('zbnfRecommendations.location')}:</strong> {gapInfo?.location || rec.location}
                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>
                        );
                        })
                        ) : (
                        <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                          <Sprout className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                          <p className="font-medium">{t('zbnfRecommendations.noRecommendations')}</p>
                          <p className="text-sm mt-1">
                            {recommendations ? 
                              t('zbnfRecommendations.analysisReturnedNoRecs') :
                              t('zbnfRecommendations.tryAdjusting')
                            }
                          </p>
                          {recommendations && (
                            <details className="mt-2 text-xs text-left bg-white p-2 rounded border">
                              <summary className="cursor-pointer">{t('zbnfRecommendations.debugInfo')}</summary>
                              <pre className="mt-1 overflow-auto">{JSON.stringify(recommendations, null, 2)}</pre>
                            </details>
                          )}
                        </div>
                      )})()}

                      {/* Ground Layer Representation */}
                      <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-center gap-3">
                          <div className="w-full h-2 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"></div>
                          <div>
                            <h4 className="font-medium text-amber-800">{t('zbnfRecommendations.groundLevelSoilHealth')}</h4>
                            <p className="text-xs text-amber-700">
                              {t('zbnfRecommendations.soilHealthScoreLabel')}: {imageAnalysis?.soilHealthScore || '8.2/10'} | 
                              {t('zbnfRecommendations.waterRetention')}: {imageAnalysis?.farmAnalysis?.waterRetention || t('zbnfRecommendations.good')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Analysis Results */}
                {imageAnalysis && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 bg-blue-50 border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        {t('zbnfRecommendations.detectionResults')}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>{t('zbnfRecommendations.treesDetected')}:</span>
                          <span className="font-medium">{imageAnalysis.detectedTrees?.length || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('zbnfRecommendations.plantingGaps')}:</span>
                          <span className="font-medium">{imageAnalysis.detectedGaps?.length || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('zbnfRecommendations.avgGapSize')}:</span>
                          <span className="font-medium">{imageAnalysis.averageGapSize || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('zbnfRecommendations.farmBiodiversity')}:</span>
                          <span className="font-medium">{imageAnalysis.farmAnalysis?.biodiversity || 'Medium'}</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-green-50 border-green-200">
                      <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        {t('zbnfRecommendations.zbnfRecommendationsLabel')}
                      </h4>
                      <div className="space-y-2 text-sm text-green-700">
                        {imageAnalysis.recommendedActions?.map((action, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-green-600">•</span>
                            <span>{action}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}

                {recommendations.summary && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold mb-2 text-green-800">{t('zbnfRecommendations.implementationSummary')}</h4>
                    <p className="text-sm text-green-700">{recommendations.summary}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Crop Rotation Planning */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-blue-600" />
                <CardTitle>{t('zbnfRecommendations.cropRotationPlanning')}</CardTitle>
              </div>
              <CardDescription>
                {t('zbnfRecommendations.cropRotationPlanningDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => generateRotationPlan()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {t('zbnfRecommendations.generateRotationPlan')}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowRotationDetails(!showRotationDetails)}
                  >
                    {showRotationDetails ? t('zbnfRecommendations.hide') : t('zbnfRecommendations.show')} {t('zbnfRecommendations.rotationDetails')}
                  </Button>
                </div>

                {rotationPlan && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">{t('zbnfRecommendations.rotationSchedule')}</h3>
                    <div className="grid gap-3">
                      {rotationPlan.seasons.map((season, index) => (
                        <Card key={index} className="p-3 bg-blue-50 border-blue-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-blue-800">{season.name}</h4>
                              <p className="text-sm text-blue-600">{season.months}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{season.mainCrop}</p>
                              <p className="text-xs text-blue-600">{season.companionCrops}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Jeevamrutha Reminders */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-green-600" />
                <CardTitle>{t('zbnfRecommendations.jeevamruthaCareReminders')}</CardTitle>
              </div>
              <CardDescription>
                {t('zbnfRecommendations.jeevamruthaCareRemindersDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => setupJeevamruthaReminders()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    {t('zbnfRecommendations.setupReminders')}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowJeevamruthaGuide(!showJeevamruthaGuide)}
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    {t('zbnfRecommendations.preparationGuide')}
                  </Button>
                </div>

                {jeevamruthaSchedule && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">{t('zbnfRecommendations.applicationSchedule')}</h3>
                    {jeevamruthaSchedule.map((reminder, index) => (
                      <Card key={index} className={`p-3 border-green-200 ${
                        reminder.type === 'preparation' ? 'bg-blue-50' : 'bg-green-50'
                      }`}>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className={`font-medium ${
                                reminder.type === 'preparation' ? 'text-blue-800' : 'text-green-800'
                              }`}>
                                {reminder.activity}
                              </h4>
                              <p className={`text-sm ${
                                reminder.type === 'preparation' ? 'text-blue-600' : 'text-green-600'
                              }`}>
                                {reminder.date} ({reminder.daysFromNow === 0 ? t('zbnfRecommendations.today') : t('zbnfRecommendations.inDays', { days: reminder.daysFromNow })})
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className={
                                reminder.type === 'preparation' ? 'text-blue-700' : 'text-green-700'
                              }>
                                {reminder.priority}
                              </Badge>
                            </div>
                          </div>
                          <div className={`text-xs ${
                            reminder.type === 'preparation' ? 'text-blue-700' : 'text-green-700'
                          } bg-white p-2 rounded border`}>
                            <strong>{t('zbnfRecommendations.instructions')}:</strong> {reminder.notes}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {showJeevamruthaGuide && (
                  <Card className="p-4 bg-green-50 border-green-200">
                    <h3 className="font-semibold text-green-800 mb-3">{t('zbnfRecommendations.jeevamruthaCompleteGuide')}</h3>
                    <div className="text-sm text-green-700 space-y-4">
                      <div>
                        <p className="font-semibold mb-2">{t('zbnfRecommendations.ingredients')}:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>{t('zbnfRecommendations.ingredient1')}</li>
                          <li>{t('zbnfRecommendations.ingredient2')}</li>
                          <li>{t('zbnfRecommendations.ingredient3')}</li>
                          <li>{t('zbnfRecommendations.ingredient4')}</li>
                          <li>{t('zbnfRecommendations.ingredient5')}</li>
                          <li>{t('zbnfRecommendations.ingredient6')}</li>
                        </ul>
                      </div>
                      
                      <div>
                        <p className="font-semibold mb-2">{t('zbnfRecommendations.preparationMethod')}:</p>
                        <ol className="list-decimal list-inside space-y-1 ml-4">
                          <li>{t('zbnfRecommendations.prepStep1')}</li>
                          <li>{t('zbnfRecommendations.prepStep2')}</li>
                          <li>{t('zbnfRecommendations.prepStep3')}</li>
                          <li>{t('zbnfRecommendations.prepStep4')}</li>
                          <li>{t('zbnfRecommendations.prepStep5')}</li>
                          <li>{t('zbnfRecommendations.prepStep6')}</li>
                        </ol>
                      </div>
                      
                      <div>
                        <p className="font-semibold mb-2">{t('zbnfRecommendations.usageInstructions')}:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li><strong>{t('zbnfRecommendations.dilution')}:</strong> {t('zbnfRecommendations.dilutionDesc')}</li>
                          <li><strong>{t('zbnfRecommendations.application')}:</strong> {t('zbnfRecommendations.applicationDesc')}</li>
                          <li><strong>{t('zbnfRecommendations.method')}:</strong> {t('zbnfRecommendations.methodDesc')}</li>
                          <li><strong>{t('zbnfRecommendations.quantity')}:</strong> {t('zbnfRecommendations.quantityDesc')}</li>
                          <li><strong>{t('zbnfRecommendations.frequency')}:</strong> {t('zbnfRecommendations.frequencyDesc')}</li>
                          <li><strong>{t('zbnfRecommendations.storage')}:</strong> {t('zbnfRecommendations.storageDesc')}</li>
                        </ul>
                      </div>
                      
                      <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                        <p className="font-semibold text-yellow-800 mb-1">{t('zbnfRecommendations.importantTips')}:</p>
                        <ul className="text-xs text-yellow-700 space-y-1">
                          <li>• {t('zbnfRecommendations.tip1')}</li>
                          <li>• {t('zbnfRecommendations.tip2')}</li>
                          <li>• {t('zbnfRecommendations.tip3')}</li>
                          <li>• {t('zbnfRecommendations.tip4')}</li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Crop Layout Planner - Shows after AI analysis */}
          {imageAnalysis && recommendations && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  <CardTitle>{t('zbnfRecommendations.plantationPlan')}</CardTitle>
                </div>
                <CardDescription>
                  {t('zbnfRecommendations.plantationPlanDesc', { location: imageAnalysis.farmLocation, season: imageAnalysis.season })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Analysis Summary Header */}
                  <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg border border-green-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-green-700">{t('zbnfRecommendations.detectedTreesLabel')}:</span> 
                        <span className="ml-2">{imageAnalysis.detectedTrees.map((tr: any) => tr.type).join(', ')}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-blue-700">{t('zbnfRecommendations.availableGaps')}:</span> 
                        <span className="ml-2">{imageAnalysis.detectedGaps.length} {t('zbnfRecommendations.plantingAreas')}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-purple-700">{t('zbnfRecommendations.recommendedCropsLabel')}:</span> 
                        <span className="ml-2">{recommendations.recommendations.length} {t('zbnfRecommendations.varieties')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Layout Visualization */}
                  <div className="bg-gradient-to-b from-green-50 to-amber-50 p-6 rounded-lg border-2 border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-green-800">{t('zbnfRecommendations.customizedFarmLayout')}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>36ft × 36ft = 1,296 sq ft</span>
                      </div>
                    </div>
                    
                    {/* Dynamic Grid Layout */}
                    <div className="relative bg-white rounded-lg shadow-inner p-4 mb-4">
                      <svg
                        viewBox="0 0 360 360"
                        className="w-full h-80 border-2 border-green-300 rounded"
                        style={{ aspectRatio: '1/1' }}
                      >
                        {/* Grid lines */}
                        <defs>
                          <pattern id="dynamicGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                          </pattern>
                        </defs>
                        <rect width="360" height="360" fill="url(#dynamicGrid)" />
                        
                        {/* Render detected trees */}
                        {imageAnalysis.detectedTrees.map((tree, index) => {
                          const x = 80 + (index % 2) * 200; // Position trees
                          const y = 80 + Math.floor(index / 2) * 200;
                          const treeAbbrev = tree.type.slice(0, 2).toUpperCase();
                          
                          return (
                            <g key={index} fill="#065f46" stroke="#047857" strokeWidth="2">
                              <circle cx={x} cy={y} r="18" opacity="0.9" />
                              <text x={x} y={y + 5} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">
                                {treeAbbrev}
                              </text>
                              <text x={x} y={y + 35} textAnchor="middle" fontSize="8" fill="#065f46">
                                {tree.type}
                              </text>
                            </g>
                          );
                        })}
                        
                        {/* Render detected gaps with recommended crops and proper spacing */}
                        {imageAnalysis.detectedGaps.map((gap, index) => {
                          const recommendedCrop = recommendations.recommendations[index];
                          if (!recommendedCrop) return null;
                          
                          // Calculate positions based on layer spacing requirements
                          const layer = recommendedCrop.layer;
                          const spacingMap = {
                            1: 40, // 12 meters = ~40 pixels spacing
                            2: 20, // 6 meters = ~20 pixels spacing  
                            3: 10, // 3 meters = ~10 pixels spacing
                            4: 6,  // Close rows = ~6 pixels spacing
                            5: 4   // Beds/patches = ~4 pixels spacing
                          };
                          
                          const spacing = spacingMap[layer as keyof typeof spacingMap] || 15;
                          const x = 60 + (index % 3) * (80 + spacing);
                          const y = 60 + Math.floor(index / 3) * (80 + spacing);
                          const cropAbbrev = recommendedCrop.cropName.slice(0, 2).toUpperCase();
                          
                          // Different shapes for different layers
                          const colors = {
                            1: { fill: "#065f46", stroke: "#047857" }, // Canopy
                            2: { fill: "#059669", stroke: "#10b981" }, // Sub-canopy  
                            3: { fill: "#fbbf24", stroke: "#f59e0b" }, // Shrubs
                            4: { fill: "#84cc16", stroke: "#65a30d" }, // Herbaceous
                            5: { fill: "#dc2626", stroke: "#b91c1c" }  // Ground cover
                          };
                          
                          const color = colors[layer as keyof typeof colors] || colors[3];
                          
                          return (
                            <g key={index}>
                              {/* Spacing indicator lines */}
                              {index > 0 && (
                                <line 
                                  x1={x - spacing/2} 
                                  y1={y} 
                                  x2={x - 5} 
                                  y2={y} 
                                  stroke="#94a3b8" 
                                  strokeWidth="1" 
                                  strokeDasharray="2,2" 
                                />
                              )}
                              
                              {/* Crop symbol */}
                              <g fill={color.fill} stroke={color.stroke} strokeWidth="2">
                                {layer === 1 && (
                                  // Large circle for canopy trees (7000-12000 ft)
                                  <>
                                    <circle cx={x} cy={y} r="16" opacity="0.9" />
                                    <circle cx={x} cy={y} r="12" opacity="0.6" fill={color.stroke} />
                                  </>
                                )}
                                {layer === 2 && (
                                  // Medium circle for sub-canopy trees (5400-7000 ft)
                                  <>
                                    <circle cx={x} cy={y} r="12" opacity="0.8" />
                                    <circle cx={x} cy={y} r="8" opacity="0.5" fill={color.stroke} />
                                  </>
                                )}
                                {layer === 3 && (
                                  // Triangle for shrub layer (3700-5400 ft)
                                  <polygon 
                                    points={`${x},${y-8} ${x-8},${y+6} ${x+8},${y+6}`} 
                                    opacity="0.8" 
                                  />
                                )}
                                {layer === 4 && (
                                  // Diamond for herbaceous layer (1800-3700 ft)
                                  <polygon 
                                    points={`${x},${y-6} ${x+6},${y} ${x},${y+6} ${x-6},${y}`} 
                                    opacity="0.8" 
                                  />
                                )}
                                {layer === 5 && (
                                  // Square for ground cover (0-800 ft)
                                  <rect 
                                    x={x-6} 
                                    y={y-6} 
                                    width="12" 
                                    height="12" 
                                    opacity="0.8" 
                                  />
                                )}
                                
                                {/* Crop label */}
                                <text x={x} y={y + 2} textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">
                                  {cropAbbrev}
                                </text>
                              </g>
                              
                              {/* Crop name below symbol */}
                              <text x={x} y={y + 22} textAnchor="middle" fontSize="7" fill="#374151">
                                {recommendedCrop.cropName}
                              </text>
                              
                              {/* Spacing label */}
                              <text x={x} y={y + 32} textAnchor="middle" fontSize="6" fill="#6b7280">
                                {layer === 1 ? '12m' : layer === 2 ? '6m' : layer === 3 ? '3m' : layer === 4 ? 'Close' : 'Beds'}
                              </text>
                              
                              {/* Gap size indicator */}
                              <text x={x} y={y - 15} textAnchor="middle" fontSize="6" fill="#6b7280">
                                Gap: {gap.size}
                              </text>
                            </g>
                          );
                        })}
                        
                        {/* Distance markers */}
                        <g stroke="#94a3b8" strokeWidth="1" fill="#6b7280" fontSize="8">
                          {/* Horizontal spacing lines */}
                          <line x1="40" y1="340" x2="120" y2="340" strokeDasharray="2,2" />
                          <text x="80" y="355" textAnchor="middle">12m spacing</text>
                          
                          <line x1="140" y1="340" x2="200" y2="340" strokeDasharray="2,2" />
                          <text x="170" y="355" textAnchor="middle">6m</text>
                          
                          <line x1="220" y1="340" x2="260" y2="340" strokeDasharray="2,2" />
                          <text x="240" y="355" textAnchor="middle">3m</text>
                        </g>
                        
                        {/* Border */}
                        <rect x="1" y="1" width="358" height="358" fill="none" stroke="#059669" strokeWidth="2"/>
                        
                        {/* Farm title */}
                        <text x="180" y="20" textAnchor="middle" fontSize="12" fill="#065f46" fontWeight="bold">
                          {imageAnalysis.farmLocation} Farm - {imageAnalysis.season} Season
                        </text>
                      </svg>
                    </div>
                    
                    {/* Comprehensive Crop List with Markings */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h5 className="font-semibold mb-3 text-gray-800">{t('zbnfRecommendations.allRecommendedCrops')}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {recommendations.recommendations?.map((crop, index) => {
                          const getLayerColor = (layer) => {
                            switch(layer) {
                              case 1: return 'text-green-800 bg-green-100';
                              case 2: return 'text-emerald-800 bg-emerald-100';
                              case 3: return 'text-yellow-800 bg-yellow-100';
                              case 4: return 'text-lime-800 bg-lime-100';
                              case 5: return 'text-red-800 bg-red-100';
                              default: return 'text-gray-800 bg-gray-100';
                            }
                          };
                          
                          const getSymbol = (layer) => {
                            switch(layer) {
                              case 1: return '●'; // Circle for canopy
                              case 2: return '●'; // Circle for sub-canopy
                              case 3: return '★'; // Star for shrubs
                              case 4: return '♦'; // Diamond for herbaceous
                              case 5: return '■'; // Square for ground cover
                              default: return '○';
                            }
                          };
                          
                          return (
                            <div key={index} className={`p-3 rounded-lg border ${getLayerColor(crop.layer)}`}>
                              <div className="flex items-center gap-3">
                                <div className="text-2xl font-bold">
                                  {getSymbol(crop.layer)}
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold">{crop.cropName}</div>
                                  <div className="text-sm opacity-75">
                                    Layer {crop.layer} • {crop.plantingSeason} • {crop.expectedYield}
                                  </div>
                                  <div className="text-xs opacity-60 mt-1">
                                    Height: {crop.heightRange} | Spacing: {crop.layer === 1 ? '12m' : crop.layer === 2 ? '6m' : crop.layer === 3 ? '3m' : crop.layer === 4 ? 'Close rows' : 'Beds/patches'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <h5 className="font-semibold mb-3 text-gray-800">{t('zbnfRecommendations.layerLegend')}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 text-sm">
                        {/* Layer 1 */}
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                          <div className="w-6 h-6 bg-green-800 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">●</span>
                          </div>
                          <div>
                            <div className="font-medium text-green-800">{t('zbnfRecommendations.layerNum', { num: 1 })}</div>
                            <div className="text-xs text-green-600">{t('zbnfRecommendations.canopyTrees')}</div>
                            <div className="text-xs text-gray-500">7000-12000 ft</div>
                            <div className="text-xs text-gray-500">12m {t('zbnfRecommendations.spacing')}</div>
                          </div>
                        </div>
                        
                        {/* Layer 2 */}
                        <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded">
                          <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">●</span>
                          </div>
                          <div>
                            <div className="font-medium text-emerald-800">{t('zbnfRecommendations.layerNum', { num: 2 })}</div>
                            <div className="text-xs text-emerald-600">{t('zbnfRecommendations.subCanopy')}</div>
                            <div className="text-xs text-gray-500">5400-7000 ft</div>
                            <div className="text-xs text-gray-500">6m {t('zbnfRecommendations.spacing')}</div>
                          </div>
                        </div>
                        
                        {/* Layer 3 */}
                        <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                          <div className="w-6 h-6 bg-yellow-500 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">▲</span>
                          </div>
                          <div>
                            <div className="font-medium text-yellow-800">{t('zbnfRecommendations.layerNum', { num: 3 })}</div>
                            <div className="text-xs text-yellow-600">{t('zbnfRecommendations.shrubs')}</div>
                            <div className="text-xs text-gray-500">3700-5400 ft</div>
                            <div className="text-xs text-gray-500">3m {t('zbnfRecommendations.spacing')}</div>
                          </div>
                        </div>
                        
                        {/* Layer 4 */}
                        <div className="flex items-center gap-2 p-2 bg-lime-50 rounded">
                          <div className="w-6 h-6 bg-lime-500 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">♦</span>
                          </div>
                          <div>
                            <div className="font-medium text-lime-800">{t('zbnfRecommendations.layerNum', { num: 4 })}</div>
                            <div className="text-xs text-lime-600">{t('zbnfRecommendations.herbaceous')}</div>
                            <div className="text-xs text-gray-500">1800-3700 ft</div>
                            <div className="text-xs text-gray-500">{t('zbnfRecommendations.closeRows')}</div>
                          </div>
                        </div>
                        
                        {/* Layer 5 */}
                        <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                          <div className="w-6 h-6 bg-red-600 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">■</span>
                          </div>
                          <div>
                            <div className="font-medium text-red-800">{t('zbnfRecommendations.layerNum', { num: 5 })}</div>
                            <div className="text-xs text-red-600">{t('zbnfRecommendations.groundCoverLabel')}</div>
                            <div className="text-xs text-gray-500">0-800 ft</div>
                            <div className="text-xs text-gray-500">{t('zbnfRecommendations.bedsPatches')}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recommended Crops Summary */}
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
                      <h5 className="font-semibold mb-3 text-blue-800">{t('zbnfRecommendations.yourCustomizedRecommendations')}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        {recommendations.recommendations.slice(0, 4).map((rec: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                            <div className={`w-4 h-4 rounded-full ${
                              rec.layer === 1 ? 'bg-green-800' :
                              rec.layer === 2 ? 'bg-emerald-600' :
                              rec.layer === 3 ? 'bg-yellow-500' :
                              rec.layer === 4 ? 'bg-lime-500' : 'bg-red-600'
                            }`}></div>
                            <div>
                              <div className="font-medium">{rec.cropName}</div>
                              <div className="text-xs text-gray-600">Layer {rec.layer} • {rec.plantingSeason} season</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Farm Status vs ZBNF Improvement Plan */}
          {imageAnalysis && recommendations && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <CardTitle>{t('zbnfRecommendations.farmImprovementAnalysis')}</CardTitle>
                </div>
                <CardDescription>
                  {t('zbnfRecommendations.farmImprovementAnalysisDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Before/After Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Current Status */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-3">{t('zbnfRecommendations.currentFarmStatus')}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>{t('zbnfRecommendations.existingTreesLabel')}:</span>
                          <span className="font-medium">{imageAnalysis.detectedTrees.length} {t('zbnfRecommendations.trees')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{t('zbnfRecommendations.layerCoverage')}:</span>
                          <span className="font-medium">
                            {Array.from(new Set(imageAnalysis.detectedTrees.map(() => '1'))).length} {t('zbnfRecommendations.of5Layers')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{t('zbnfRecommendations.availableSpace')}:</span>
                          <span className="font-medium">{imageAnalysis.detectedGaps.length} {t('zbnfRecommendations.gaps')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{t('zbnfRecommendations.soilHealth')}:</span>
                          <span className="font-medium">{imageAnalysis.soilHealthScore || '7.2/10'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* After ZBNF Implementation */}
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-3">{t('zbnfRecommendations.afterZbnfImplementation')}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>{t('zbnfRecommendations.totalCrops')}:</span>
                          <span className="font-medium text-green-700">
                            {imageAnalysis.detectedTrees.length + recommendations.recommendations.length} {t('zbnfRecommendations.varieties')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{t('zbnfRecommendations.layerCoverage')}:</span>
                          <span className="font-medium text-green-700">{t('zbnfRecommendations.complete5LayerSystem')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{t('zbnfRecommendations.spaceUtilization')}:</span>
                          <span className="font-medium text-green-700">{t('zbnfRecommendations.optimized95')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{t('zbnfRecommendations.expectedSoilHealth')}:</span>
                          <span className="font-medium text-green-700">{t('zbnfRecommendations.improvedScore')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Implementation Timeline */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3">{t('zbnfRecommendations.implementationTimeline')}</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm"><strong>{t('zbnfRecommendations.month12')}:</strong> {t('zbnfRecommendations.month12Desc')}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-sm"><strong>{t('zbnfRecommendations.month34')}:</strong> {t('zbnfRecommendations.month34Desc')}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                        <span className="text-sm"><strong>{t('zbnfRecommendations.month56')}:</strong> {t('zbnfRecommendations.month56Desc')}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        <span className="text-sm"><strong>{t('zbnfRecommendations.month712')}:</strong> {t('zbnfRecommendations.month712Desc')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Customized Farm Layout */}
          {recommendations && (
            <PlantationLayout 
              detectedTrees={imageAnalysis?.detectedTrees || form.getValues('cropLayers').map((layer, index) => ({
                type: layer.existingCrops ? layer.existingCrops.split(',')[0].trim() : 'Existing Tree',
                health: 'Good',
                height: layer.layer === '1' ? '12m' : layer.layer === '2' ? '8m' : '6m',
                canopyRadius: '3m',
                position: { x: 100 + (index * 80), y: 100 + (index * 60) }
              }))}
              recommendations={recommendations.recommendations || []}
              farmSize={{ width: 36, height: 36 }}
            />
          )}

          {/* Farm Improvement Analysis */}
          {recommendations && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <CardTitle>{t('zbnfRecommendations.farmImprovementAnalysis')}</CardTitle>
                </div>
                <CardDescription>
                  {t('zbnfRecommendations.comprehensiveAnalysisDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Current Farm Status */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">{t('zbnfRecommendations.currentStatus')}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>{t('zbnfRecommendations.farmSize')}:</span>
                          <span className="font-medium">36ft × 36ft</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('zbnfRecommendations.detectedCropsLabel')}:</span>
                          <span className="font-medium">{form.getValues('cropLayers').length} {t('zbnfRecommendations.layers')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('zbnfRecommendations.seasonLabel')}:</span>
                          <span className="font-medium">{form.getValues('season')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('zbnfRecommendations.soilTypeLabel')}:</span>
                          <span className="font-medium">{form.getValues('soilType')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">{t('zbnfRecommendations.improvementPotential')}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>{t('zbnfRecommendations.revenueIncrease')}:</span>
                          <span className="font-medium text-green-600">+40-60%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('zbnfRecommendations.soilHealth')}:</span>
                          <span className="font-medium text-green-600">+50%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('zbnfRecommendations.waterEfficiency')}:</span>
                          <span className="font-medium text-green-600">+30%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('zbnfRecommendations.biodiversity')}:</span>
                          <span className="font-medium text-green-600">+80%</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">{t('zbnfRecommendations.priorityActions')}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          <span>{t('zbnfRecommendations.fillMissingLayers')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          <span>{t('zbnfRecommendations.improveSpacing')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                          <span>{t('zbnfRecommendations.startJeevamrutha')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span>{t('zbnfRecommendations.monitorGrowth')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Analysis */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-3">{t('zbnfRecommendations.farmStrengths')}</h4>
                      <ul className="space-y-2 text-sm text-green-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>{t('zbnfRecommendations.strength1', { soilType: form.getValues('soilType') })}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>{t('zbnfRecommendations.strength2')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>{t('zbnfRecommendations.strength3', { season: form.getValues('season') })}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>{t('zbnfRecommendations.strength4')}</span>
                        </li>
                      </ul>
                    </div>

                    {/* Improvement Areas */}
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-3">{t('zbnfRecommendations.improvementAreas')}</h4>
                      <ul className="space-y-2 text-sm text-red-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          <span>{t('zbnfRecommendations.improvement1', { missing: 5 - form.getValues('cropLayers').length })}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          <span>{t('zbnfRecommendations.improvement2')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          <span>{t('zbnfRecommendations.improvement3')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          <span>{t('zbnfRecommendations.improvement4')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>


                </div>
              </CardContent>
            </Card>
          )}

          {/* Dynamic Layer Analysis */}
          {recommendations?.layerAnalysis && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <CardTitle>{t('zbnfRecommendations.zbnfLayerAnalysis')}</CardTitle>
                </div>
                <CardDescription>
                  {t('zbnfRecommendations.zbnfLayerAnalysisDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Layer Completion Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-3">{t('zbnfRecommendations.systemCompletion')}</h4>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {recommendations.layerAnalysis.completionPercentage}%
                        </div>
                        <p className="text-sm text-blue-700">
                          {Math.round(recommendations.layerAnalysis.completionPercentage / 20)} {t('zbnfRecommendations.of5LayersPresent')}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-3">{t('zbnfRecommendations.currentLayers')}</h4>
                      <div className="space-y-2">
                        {Object.entries(recommendations.layerAnalysis.currentLayers).map(([layerKey, layer]: [string, any]) => (
                          <div key={layerKey} className="flex items-center justify-between text-sm">
                            <span>Layer {layerKey.slice(-1)}:</span>
                            <Badge variant={layer.present ? "default" : "secondary"}>
                              {layer.present ? `${layer.coverage}% ${t('zbnfRecommendations.covered')}` : t('zbnfRecommendations.missing')}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Missing Layers Recommendations */}
                  {recommendations.layerAnalysis.missingLayers.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-red-800 mb-3">
                        {t('zbnfRecommendations.missingLayersPriority')}
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {recommendations.layerAnalysis.recommendations.map((layerRec: any, index: number) => (
                          <Card key={index} className="border-l-4 border-l-red-500">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">{layerRec.layerName}</CardTitle>
                                <Badge variant={layerRec.priority === 'high' ? 'destructive' : layerRec.priority === 'medium' ? 'default' : 'secondary'}>
                                  {layerRec.priority} {t('zbnfRecommendations.priority')}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{layerRec.seasonalTiming}</p>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {/* Recommended Crops */}
                                <div>
                                  <h5 className="font-medium text-green-800 mb-2">{t('zbnfRecommendations.recommendedCropsLabel')}:</h5>
                                  <div className="space-y-2">
                                    {layerRec.recommendedCrops.map((crop: any, cropIndex: number) => (
                                      <div key={cropIndex} className="p-2 bg-green-50 rounded border border-green-200">
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="font-medium text-green-800">{crop.name}</span>
                                          <Badge variant="outline">{crop.spacing}</Badge>
                                        </div>
                                        <p className="text-xs text-green-700 italic mb-2">{crop.scientificName}</p>
                                        <p className="text-sm text-green-600">{crop.reasoning}</p>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                          {crop.benefits.slice(0, 3).map((benefit: string, bIndex: number) => (
                                            <Badge key={bIndex} variant="secondary" className="text-xs">
                                              {benefit.replace(/_/g, ' ')}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Implementation Notes */}
                                <div>
                                  <h5 className="font-medium text-blue-800 mb-2">{t('zbnfRecommendations.implementationNotes')}:</h5>
                                  <ul className="text-sm text-blue-700 space-y-1">
                                    {layerRec.implementationNotes.map((note: string, noteIndex: number) => (
                                      <li key={noteIndex} className="flex items-start gap-2">
                                        <span className="text-blue-500 mt-1">•</span>
                                        <span>{note}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Implementation Timeline */}
                  {recommendations.layerAnalysis.nextSteps.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-purple-800 mb-3">{t('zbnfRecommendations.implementationTimeline')}</h4>
                      <div className="space-y-3">
                        {recommendations.layerAnalysis.nextSteps.map((step: any, stepIndex: number) => (
                          <div key={stepIndex} className="flex items-start gap-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {step.step}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-medium text-purple-800">{step.action}</h5>
                                <Badge variant={step.priority === 'high' ? 'destructive' : step.priority === 'medium' ? 'default' : 'secondary'}>
                                  {step.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-purple-600 mb-2">{step.timeline}</p>
                              <p className="text-sm text-purple-700 mb-2">{step.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {step.requirements.map((req: string, reqIndex: number) => (
                                  <Badge key={reqIndex} variant="outline" className="text-xs">
                                    {req}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Layer Visualization */}
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3">{t('zbnfRecommendations.zbnf5LayerGuide')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      {[
                        { layer: 1, name: t('zbnfRecommendations.canopy'), height: '12m+', color: 'bg-green-800' },
                        { layer: 2, name: t('zbnfRecommendations.subCanopy'), height: '6-12m', color: 'bg-green-600' },
                        { layer: 3, name: t('zbnfRecommendations.shrub'), height: '2-6m', color: 'bg-green-400' },
                        { layer: 4, name: t('zbnfRecommendations.herbaceous'), height: '0.5-2m', color: 'bg-green-300' },
                        { layer: 5, name: t('zbnfRecommendations.groundCoverLabel'), height: '0-0.5m', color: 'bg-green-200' }
                      ].map((layerInfo) => {
                        const isPresent = !recommendations.layerAnalysis.missingLayers.includes(layerInfo.layer);
                        return (
                          <div key={layerInfo.layer} className={`p-3 rounded-lg text-center ${isPresent ? layerInfo.color : 'bg-gray-300'} text-white`}>
                            <div className="font-bold">{layerInfo.name}</div>
                            <div className="text-xs">{layerInfo.height}</div>
                            <div className="text-xs mt-1">
                              {isPresent ? `✓ ${t('zbnfRecommendations.present')}` : `✗ ${t('zbnfRecommendations.missing')}`}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pest & Disease Management */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bug className="h-5 w-5 text-red-600" />
                <CardTitle>{t('zbnfRecommendations.pestDiseaseManagement')}</CardTitle>
              </div>
              <CardDescription>
                {t('zbnfRecommendations.pestDiseaseManagementDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => triggerPestImageUpload()}
                    disabled={pestAnalysisMutation.isPending}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {pestAnalysisMutation.isPending ? (
                      <>
                        <Eye className="h-4 w-4 mr-2 animate-spin" />
                        {t('zbnfRecommendations.analyzing')}
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4 mr-2" />
                        {t('zbnfRecommendations.analyzePestDisease')}
                      </>
                    )}
                  </Button>
                </div>

                <input
                  ref={pestImageInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePestImageUpload}
                  className="hidden"
                />

                {pestAnalysis && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">{t('zbnfRecommendations.pestAnalysisResults')}</h3>
                    
                    {pestAnalysis.detectedPests?.map((pest, index) => (
                      <Card key={index} className="p-4 border-l-4 border-l-red-500">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-red-800">{pest.name}</h4>
                            <Badge variant="destructive">{pest.severity}</Badge>
                          </div>
                          <p className="text-sm text-red-600">{pest.description}</p>
                          
                          <div className="mt-3">
                            <h5 className="font-medium text-green-800">{t('zbnfRecommendations.zbnfTreatment')}:</h5>
                            <div className="text-sm text-green-700 space-y-1 mt-1">
                              {pest.zbnfTreatment?.map((treatment, idx) => (
                                <p key={idx}>• {treatment}</p>
                              ))}
                            </div>
                          </div>

                          <div className="mt-3">
                            <h5 className="font-medium text-blue-800">{t('zbnfRecommendations.prevention')}:</h5>
                            <div className="text-sm text-blue-700 space-y-1 mt-1">
                              {pest.prevention?.map((prev, idx) => (
                                <p key={idx}>• {prev}</p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}

                    {pestAnalysis.generalRecommendations && (
                      <Card className="p-4 bg-blue-50 border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-2">{t('zbnfRecommendations.generalZbnfRecommendations')}</h4>
                        <div className="text-sm text-blue-700 space-y-1">
                          {pestAnalysis.generalRecommendations.map((rec, index) => (
                            <p key={index}>• {rec}</p>
                          ))}
                        </div>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Saved Plans Section */}
          {savedPlansData?.plans && savedPlansData.plans.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-blue-600" />
                  <CardTitle>{t('zbnfRecommendations.yourSavedPlans')}</CardTitle>
                </div>
                <CardDescription>
                  {t('zbnfRecommendations.yourSavedPlansDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedPlansData.plans.map((plan: any, index: number) => (
                    <Card key={index} className="p-4 border border-gray-200 hover:border-green-300 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-green-800">{plan.planName}</h4>
                          <Badge variant="outline">{plan.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {t('zbnfRecommendations.farm')}: {plan.farmData?.farmerName} | {t('zbnfRecommendations.district')}: {plan.district}
                        </p>
                        <p className="text-sm text-gray-500">
                          {t('zbnfRecommendations.saved')}: {new Date(plan.createdAt).toLocaleDateString()}
                        </p>
                        <div className="text-xs text-gray-500">
                          {plan.recommendations?.length || 0} {t('zbnfRecommendations.cropRecommendationsCount')}
                        </div>
                        <Button 
                          onClick={() => loadSavedPlan(plan)} 
                          size="sm" 
                          className="mt-2 w-full"
                        >
                          {t('zbnfRecommendations.loadPlanDetails')}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>

      {/* Save Plan Dialog */}
      <Dialog open={showSavePlanDialog} onOpenChange={setShowSavePlanDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('zbnfRecommendations.saveZbnfPlan')}</DialogTitle>
            <DialogDescription>
              {t('zbnfRecommendations.saveZbnfPlanDesc')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="planName" className="text-sm font-medium">
                {t('zbnfRecommendations.planNameLabel')}
              </label>
              <Input
                id="planName"
                placeholder={t('zbnfRecommendations.planNamePlaceholder')}
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="w-full"
              />
            </div>
            {farmerProfile?.success && (
              <div className="text-sm text-gray-600 bg-green-50 p-3 rounded border">
                <p><strong>{t('zbnfRecommendations.farm')}:</strong> {farmerProfile.farmerData.farmName}</p>
                <p><strong>{t('zbnfRecommendations.district')}:</strong> {farmerProfile.farmerData.district}</p>
                <p><strong>{t('zbnfRecommendations.recommendedCrops')}:</strong> {recommendations?.recommendations?.length || 0} {t('zbnfRecommendations.crops')}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowSavePlanDialog(false)}
              disabled={savePlanMutation.isPending}
            >
              {t('zbnfRecommendations.cancel')}
            </Button>
            <Button 
              onClick={handleSavePlan}
              disabled={savePlanMutation.isPending || !planName.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {savePlanMutation.isPending ? (
                <>
                  <Save className="h-4 w-4 mr-2 animate-spin" />
                  {t('zbnfRecommendations.saving')}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {t('zbnfRecommendations.savePlan')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Subscription Dialog */}
      <Dialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              {t('zbnfRecommendations.chooseAiPlan')}
            </DialogTitle>
            <DialogDescription>
              {t('zbnfRecommendations.chooseAiPlanDesc')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* AI Features */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">{t('zbnfRecommendations.aiFeaturesInclude')}:</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• {t('zbnfRecommendations.aiFeature1')}</li>
                <li>• {t('zbnfRecommendations.aiFeature2')}</li>
                <li>• {t('zbnfRecommendations.aiFeature3')}</li>
                <li>• {t('zbnfRecommendations.aiFeature4')}</li>
                <li>• {t('zbnfRecommendations.aiFeature5')}</li>
              </ul>
            </div>

            {/* Available Plans */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">{t('zbnfRecommendations.availablePlans')}:</h4>
              <div className="grid gap-4">
                {availablePlans.map((plan) => (
                  <div 
                    key={plan.id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedPlan?.id === plan.id 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-800">{plan.name}</h5>
                        <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="outline" className="text-purple-600">
                            {plan.duration} {plan.durationType === 'monthly' ? 'Month' : 
                             plan.durationType === '6months' ? 'Months' : 'Year'}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">
                          ₹{plan.price.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {plan.durationType === 'monthly' ? 'per month' : 
                           plan.durationType === '6months' ? 'for 6 months' : 'per year'}
                        </div>
                      </div>
                    </div>
                    {selectedPlan?.id === plan.id && (
                      <div className="mt-3 p-2 bg-purple-100 rounded text-sm text-purple-700">
                        ✓ {t('zbnfRecommendations.selectedPlan')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowSubscriptionDialog(false)}
            >
              {t('zbnfRecommendations.cancel')}
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={handleSubscriptionPurchase}
              disabled={!selectedPlan || hasPendingSubscription}
            >
              {hasPendingSubscription ? t('zbnfRecommendations.processing') : `${t('zbnfRecommendations.subscribeFor')} ₹${selectedPlan?.price.toLocaleString() || 0}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default ZbnfRecommendations;