import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation, Link } from "wouter";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest as apiRequestFn, queryClient } from "@/lib/queryClient";
import { 
  Calendar, MapPin, Users, Clock, Leaf, Car, Droplets, 
  Utensils, ShieldCheck, Camera, ChevronRight, Plus, Minus,
  CheckCircle, AlertCircle, ChevronLeft, ArrowLeft
} from "lucide-react";
import ShareButton from "@/components/social/ShareButton";
import type { FarmEvent, OrderFee } from "@shared/schema";
import { useTranslation } from "react-i18next";

const formatPrice = (price: string | number) => {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(num);
};

const facilityIcons: Record<string, any> = {
  parking: Car,
  restrooms: ShieldCheck,
  drinking_water: Droplets,
  meals: Utensils,
  snacks: Utensils,
  photography_allowed: Camera,
};

const eventTypeKeys: Record<string, string> = {
  fruit_picking: "eventDetail.eventTypes.fruit_picking",
  vegetable_experience: "eventDetail.eventTypes.vegetable_experience",
  farm_tour: "eventDetail.eventTypes.farm_tour",
  zbnf_training: "eventDetail.eventTypes.zbnf_training",
  nursery_visit: "eventDetail.eventTypes.nursery_visit",
  festival: "eventDetail.eventTypes.festival",
  workshop: "eventDetail.eventTypes.workshop",
  kids_activity: "eventDetail.eventTypes.kids_activity",
};

type EventWithDetails = FarmEvent & {
  farmer: any;
  districtManager: any;
  facilities: any[];
  activities: any[];
  gallery: any[];
  dates: { id: number; eventId: number; eventDate: string; availableSeats: number; isAvailable: boolean }[];
  availability: Record<string, { booked: number; available: number }>;
  farmerProfile?: any;
  childPrice?: string | number | null;
  whatToBring?: string | null;
  dressCode?: string | null;
  specialInstructions?: string | null;
  childAgeLimit?: number | null;
};

export default function EventDetail() {
  const { id, slug: orgSlug } = useParams<{ id: string; slug?: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();
  const isOrgContext = !!orgSlug;
  const orgBasePath = orgSlug ? `/org/${orgSlug}` : '';
  
  const [selectedDate, setSelectedDate] = useState("");
  const [adultSeats, setAdultSeats] = useState(1);
  const [childSeats, setChildSeats] = useState(0);
  const [specialNotes, setSpecialNotes] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: event, isLoading } = useQuery<EventWithDetails>({
    queryKey: [`/api/events/${id}`],
    enabled: !!id,
  });

  const { data: orderFees = [], isLoading: orderFeesLoading } = useQuery<OrderFee[]>({
    queryKey: ["/api/order-fees/active"],
  });

  const bookMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      console.log("Booking request data:", bookingData);
      const response = await apiRequestFn("POST", `/api/events/${id}/book`, bookingData);
      const data = await response.json();
      console.log("Booking response:", data);
      
      if (!data.sessionId) {
        throw new Error(data.message || "Failed to create payment session");
      }
      
      // Load Cashfree SDK if not already loaded
      if (typeof (window as any).Cashfree === 'undefined') {
        console.log("Loading Cashfree SDK...");
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
          script.async = true;
          script.onload = () => {
            console.log("Cashfree SDK loaded");
            resolve(undefined);
          };
          script.onerror = (error) => {
            console.error("Failed to load Cashfree SDK:", error);
            reject(new Error("Failed to load payment SDK"));
          };
          document.head.appendChild(script);
        });
        // Wait for SDK to initialize
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Initialize Cashfree
      const cashfree = await (window as any).Cashfree({
        mode: "production"
      });
      
      if (!cashfree || typeof cashfree.checkout !== 'function') {
        throw new Error("Payment SDK initialization failed");
      }
      
      console.log("Starting Cashfree checkout with session:", data.sessionId);
      
      // Start payment checkout
      const result = await cashfree.checkout({
        paymentSessionId: data.sessionId
      });
      
      console.log("Cashfree payment result:", result);
      
      if (result?.error) {
        throw new Error(result.error.message || "Payment failed");
      }
      
      // Payment initiated - will redirect to return URL after completion
      return { ...data, paymentResult: result };
    },
    onSuccess: (data: any) => {
      console.log("Booking payment initiated:", data);
      if (data.paymentResult?.redirect) {
        toast({
          title: t('eventDetail.processingPayment'),
          description: t('eventDetail.redirectToPayment'),
        });
      }
    },
    onError: (error: any) => {
      console.error("Booking error:", error);
      const message = error.message || t('eventDetail.somethingWentWrong');
      if (!message.toLowerCase().includes('cancel')) {
        toast({
          title: t('eventDetail.bookingFailed'),
          description: message,
          variant: "destructive",
        });
      }
    },
  });

  // Combine all gallery images: event gallery + farmer's farm images + cover image
  // Must be before any conditional returns to satisfy React hooks rules
  const galleryImages = useMemo(() => {
    if (!event) return [];
    const images: string[] = [];
    
    if (event.coverImage) {
      images.push(event.coverImage);
    }
    
    if (event.gallery && Array.isArray(event.gallery)) {
      event.gallery.forEach((img: any) => {
        if (img.imageUrl && !images.includes(img.imageUrl)) {
          images.push(img.imageUrl);
        }
      });
    }
    
    if (event.farmerProfile?.farmImages && Array.isArray(event.farmerProfile.farmImages)) {
      event.farmerProfile.farmImages.forEach((url: string) => {
        if (url && !images.includes(url)) {
          images.push(url);
        }
      });
    }
    
    return images;
  }, [event]);

  // Auto-slide effect - must be before conditional returns
  useEffect(() => {
    if (galleryImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-64 w-full rounded-lg mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-600">{t('eventDetail.eventNotFound')}</h2>
        <p className="text-gray-500 mt-2">{t('eventDetail.eventNotFoundDesc')}</p>
        <Button onClick={() => setLocation(isOrgContext ? orgBasePath : "/events")} className="mt-4">
          {isOrgContext ? "Back to Store" : t('eventDetail.browseEvents')}
        </Button>
      </div>
    );
  }

  // Get all event dates for display in "About This Event"
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const allEventDates = (event.dates || [])
    .map((d: any) => d.eventDate)
    .sort();
  
  // Filter to only future dates for booking
  const bookableDates = allEventDates.filter((date: string) => new Date(date) >= today);
  const pricePerSeat = parseFloat(event.pricePerSeat as string);
  const childPrice = event.childPrice ? parseFloat(event.childPrice as string) : pricePerSeat * 0.5;
  const subtotal = (adultSeats * pricePerSeat) + (childSeats * childPrice);
  const description = event.description || "";

  // Calculate fees using the Order Fees Management system
  const calculateFees = (baseAmount: number): { fee: OrderFee; amount: number }[] => {
    if (!orderFees || orderFeesLoading) {
      return [];
    }
    
    const calculatedFees: { fee: OrderFee; amount: number }[] = [];
    let calculationBase = baseAmount;
    
    // Sort fees by display order
    const sortedFees = [...orderFees].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    
    // First apply all fees that don't compound (don't apply to subtotal)
    sortedFees.forEach(fee => {
      if (fee.isActive && !fee.applyToSubtotal) {
        const feeValue = parseFloat(fee.value as string);
        let amount = 0;
        if (fee.type === "fixed") {
          amount = feeValue;
        } else if (fee.type === "percentage") {
          amount = (baseAmount * feeValue) / 100;
        }
        calculatedFees.push({ fee, amount });
      }
    });
    
    // Then apply fees that compound (apply to subtotal including previous fees)
    sortedFees.forEach(fee => {
      if (fee.isActive && fee.applyToSubtotal) {
        const feeValue = parseFloat(fee.value as string);
        let amount = 0;
        if (fee.type === "fixed") {
          amount = feeValue;
        } else if (fee.type === "percentage") {
          amount = (calculationBase * feeValue) / 100;
          calculationBase += amount;
        }
        calculatedFees.push({ fee, amount });
      }
    });
    
    return calculatedFees;
  };

  const fees = calculateFees(subtotal);
  const totalFees = fees.reduce((sum, f) => sum + f.amount, 0);
  const grandTotal = subtotal + totalFees;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleBook = () => {
    if (!user) {
      toast({
        title: t('eventDetail.loginRequired'),
        description: t('eventDetail.loginToBook'),
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    if (!selectedDate) {
      toast({
        title: t('eventDetail.selectADate'),
        description: t('eventDetail.selectDateToBook'),
        variant: "destructive",
      });
      return;
    }

    bookMutation.mutate({
      bookingDate: selectedDate,
      adultSeats,
      childSeats,
      specialNotes,
    });
  };

  return (
    <>
      <Helmet>
        <title>{`${event.title || t('eventDetail.farmEvent')} | Farm Events | Santhe`}</title>
        <meta name="description" content={description.slice(0, 160)} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {isOrgContext && (
          <div className="bg-white border-b px-4 py-2">
            <Link href={orgBasePath}>
              <button className="flex items-center gap-2 text-sm text-green-700 hover:text-green-800 font-medium">
                <ArrowLeft className="h-4 w-4" />
                Back to Store
              </button>
            </Link>
          </div>
        )}
        <div className="relative h-64 md:h-96 bg-gradient-to-br from-green-500 to-emerald-600 overflow-hidden">
          {/* Sliding Gallery */}
          {galleryImages.length > 0 ? (
            <>
              <div className="absolute inset-0">
                {galleryImages.map((imageUrl, idx) => (
                  <img 
                    key={idx}
                    src={imageUrl} 
                    alt={`${event.title} - Photo ${idx + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                      idx === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}
              </div>
              
              {/* Navigation arrows (only show if multiple images) */}
              {galleryImages.length > 1 && (
                <>
                  <button 
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  
                  {/* Slide indicators */}
                  <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {galleryImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentSlide 
                            ? 'bg-white w-4' 
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Leaf className="h-24 w-24 text-white/30" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
            <div className="container mx-auto">
              <Badge className="mb-2 bg-white/20 backdrop-blur">
                {eventTypeKeys[event.eventType] ? t(eventTypeKeys[event.eventType]) : event.eventType}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
              <p className="flex items-center gap-2 text-white/90">
                <MapPin className="h-5 w-5" />
                {event.location}
              </p>
              {galleryImages.length > 1 && (
                <p className="text-xs text-white/70 mt-1">
                  <Camera className="h-3 w-3 inline mr-1" />
                  {t('eventDetail.photos', { current: currentSlide + 1, total: galleryImages.length })}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{t('eventDetail.aboutThisEvent')}</CardTitle>
                  <ShareButton 
                    type="event"
                    id={id || ""}
                    title={event.title || t('eventDetail.farmEvent')}
                    description={`${event.title} at ${event.location} - ${formatPrice(event.pricePerSeat)} ${t('eventDetail.perPerson')}`}
                    location={event.location}
                  />
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 whitespace-pre-line">{description}</p>
                  
                  {allEventDates.length > 0 && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {t('eventDetail.availableSessions')}
                      </h4>
                      <p className="text-sm text-blue-600 mb-3">{t('eventDetail.oneDayEventDesc')}</p>
                      <div className="flex flex-wrap gap-2">
                        {allEventDates.map((date) => {
                          const isPast = new Date(date) < today;
                          return (
                            <Badge 
                              key={date} 
                              variant="outline" 
                              className={isPast 
                                ? "bg-gray-100 text-gray-500 border-gray-300 px-3 py-1 line-through" 
                                : "bg-white text-blue-700 border-blue-300 px-3 py-1"
                              }
                            >
                              {new Date(date).toLocaleDateString("en-IN", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                              })}
                              {isPast && ` (${t('eventDetail.past')})`}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 bg-green-50 rounded-lg">
                    <div className="text-center">
                      <Calendar className="h-6 w-6 text-green-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-500">{t('eventDetail.sessions')}</p>
                      <p className="font-medium">{t('eventDetail.available', { count: bookableDates.length })}</p>
                    </div>
                    <div className="text-center">
                      <Clock className="h-6 w-6 text-green-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-500">{t('eventDetail.time')}</p>
                      <p className="font-medium">{event.startTime} - {event.endTime}</p>
                    </div>
                    <div className="text-center">
                      <Users className="h-6 w-6 text-green-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-500">{t('eventDetail.capacity')}</p>
                      <p className="font-medium">{t('eventDetail.seats', { count: event.totalSeats })}</p>
                    </div>
                    <div className="text-center">
                      <Leaf className="h-6 w-6 text-green-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-500">{t('eventDetail.crop')}</p>
                      <p className="font-medium">{event.cropType || t('eventDetail.various')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {event.activities && event.activities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('eventDetail.activitiesIncluded')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {event.activities.map((activity, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <ChevronRight className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium capitalize">
                              {activity.activityName.replace(/_/g, " ")}
                            </p>
                            {activity.description && (
                              <p className="text-sm text-gray-500">{activity.description}</p>
                            )}
                            {activity.duration && (
                              <p className="text-xs text-gray-400 mt-1">{t('eventDetail.duration', { duration: activity.duration })}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {event.facilities && event.facilities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('eventDetail.facilitiesAvailable')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {event.facilities.map((facility, idx) => {
                        const IconComponent = facilityIcons[facility.facilityType] || CheckCircle;
                        return (
                          <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <IconComponent className="h-5 w-5 text-green-600" />
                            <span className="text-sm capitalize">
                              {facility.facilityType.replace(/_/g, " ")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {(event.whatToBring || event.dressCode || event.specialInstructions) && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('eventDetail.importantInformation')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {event.whatToBring && (
                      <div>
                        <h4 className="font-medium mb-1">{t('eventDetail.whatToBring')}</h4>
                        <p className="text-gray-600 text-sm">{event.whatToBring}</p>
                      </div>
                    )}
                    {event.dressCode && (
                      <div>
                        <h4 className="font-medium mb-1">{t('eventDetail.dressCode')}</h4>
                        <p className="text-gray-600 text-sm">{event.dressCode}</p>
                      </div>
                    )}
                    {event.specialInstructions && (
                      <div>
                        <h4 className="font-medium mb-1">{t('eventDetail.specialInstructions')}</h4>
                        <p className="text-gray-600 text-sm">{event.specialInstructions}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {(event.farmerProfile || event.farmer) && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('eventDetail.hostedBy')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Link href={event.farmerProfile?.id ? (isOrgContext ? `${orgBasePath}/farmers/${event.farmerProfile.id}` : `/farmers/${event.farmerProfile.id}`) : "#"}>
                      <div className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          {event.farmerProfile?.logoUrl ? (
                            <img 
                              src={event.farmerProfile.logoUrl} 
                              alt={event.farmerProfile?.farmName || t('eventDetail.farm')}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <Leaf className="h-8 w-8 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-green-700 hover:text-green-800 hover:underline">
                            {event.farmerProfile?.farmName || event.farmer?.name || t('eventDetail.farmEvent')}
                          </h4>
                          <p className="text-sm text-gray-500">{event.farmerProfile?.location || event.location}</p>
                          {event.farmerProfile?.isZbnfCertified && (
                            <Badge variant="outline" className="mt-1 text-green-600 border-green-600">
                              {t('eventDetail.zbnfCertified')}
                            </Badge>
                          )}
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </Link>
                    
                    {event.districtManager?.orgName && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
                        <p className="text-sm text-green-700 font-medium">
                          {t('eventDetail.inAssociationWith')} <span className="font-semibold">{event.districtManager.orgName}</span>
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>{t('eventDetail.bookThisEvent')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>{t('eventDetail.chooseSessionDate')}</Label>
                    <Select value={selectedDate} onValueChange={setSelectedDate}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder={t('eventDetail.chooseDate')} />
                      </SelectTrigger>
                      <SelectContent>
                        {bookableDates.map((date) => {
                          const availability = event.availability?.[date];
                          const available = availability?.available ?? event.totalSeats;
                          return (
                            <SelectItem 
                              key={date} 
                              value={date}
                              disabled={available <= 0}
                            >
                              {new Date(date).toLocaleDateString("en-IN", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                              })} ({t('eventDetail.seatsLeft', { count: available })})
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>{t('eventDetail.adultSeats')}</Label>
                    <div className="flex items-center gap-3 mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setAdultSeats(Math.max(1, adultSeats - 1))}
                        disabled={adultSeats <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{adultSeats}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setAdultSeats(adultSeats + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-gray-500 ml-2">
                        {t('eventDetail.each', { price: formatPrice(pricePerSeat) })}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label>{t('eventDetail.childSeats', { age: event.childAgeLimit || 12 })}</Label>
                    <div className="flex items-center gap-3 mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setChildSeats(Math.max(0, childSeats - 1))}
                        disabled={childSeats <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{childSeats}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setChildSeats(childSeats + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-gray-500 ml-2">
                        {t('eventDetail.each', { price: formatPrice(childPrice) })}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label>{t('eventDetail.specialNotes')}</Label>
                    <Textarea
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      placeholder={t('eventDetail.specialNotesPlaceholder')}
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-700 mb-3">{t('eventDetail.feeBreakdown')}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('eventDetail.adultTickets', { count: adultSeats, price: formatPrice(pricePerSeat) })}</span>
                        <span>{formatPrice(adultSeats * pricePerSeat)}</span>
                      </div>
                      {childSeats > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('eventDetail.childTickets', { count: childSeats, price: formatPrice(childPrice) })}</span>
                          <span>{formatPrice(childSeats * childPrice)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-medium border-t pt-2 mt-2">
                        <span>{t('eventDetail.subtotal')}</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      {fees.map(({ fee, amount }) => (
                        <div key={fee.id} className="flex justify-between text-gray-600">
                          <span>{fee.name}</span>
                          <span>{formatPrice(amount)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-3 mt-3 border-t border-green-200 bg-green-50 -mx-4 px-4 py-2">
                      <span>{t('eventDetail.totalAmount')}</span>
                      <span className="text-green-600">{formatPrice(grandTotal)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                    onClick={handleBook}
                    disabled={bookMutation.isPending}
                  >
                    {bookMutation.isPending ? t('eventDetail.processing') : t('eventDetail.bookNow')}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    {t('eventDetail.bookingConfirmNote')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
