import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useCallback } from "react";
import { Farmer, Product } from "@/lib/types";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShareButton from "@/components/social/ShareButton";
import { useAuth } from "@/hooks/use-auth";
import { useDistrict } from "@/hooks/use-district";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewList from "@/components/reviews/ReviewList";
import { Helmet } from "react-helmet";
import { useLocation } from "@/hooks/use-location";
import { calculateDistance, parseLocationToCoords, formatDistance } from "@/lib/distance";
import { extractIdFromSlug } from "@/lib/slugs";
import { FarmerBadge } from "@/components/AIFarmerBadge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, X, Camera, Users, Award, Leaf, Store, BadgeCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FarmerDetail() {
  const { identifier, slug: orgSlug } = useParams();
  
  // Extract ID from identifier (could be slug or plain ID)
  const id = identifier && /^\d+$/.test(identifier) 
    ? identifier 
    : identifier ? extractIdFromSlug(identifier)?.toString() : undefined;
  const { t } = useTranslation();
  const isOrgContext = !!orgSlug;
  const orgBasePath = orgSlug ? `/org/${orgSlug}` : '';
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [calculatedDistance, setCalculatedDistance] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showFollowers, setShowFollowers] = useState(false);
  
  // Location tracking for distance calculation
  const locationHook = useLocation();
  
  // Auto-request location when component mounts
  useEffect(() => {
    locationHook.requestLocation();
  }, []);
  
  const { data: farmer, isLoading: isLoadingFarmer, error: farmerError } = useQuery<Farmer>({
    queryKey: [`/api/farmers/${id}${user?.role ? `?userRole=${user.role}` : ''}`],
    staleTime: 0,
    refetchOnMount: 'always',
  });
  
  // Calculate distance when farmer data and location are available
  useEffect(() => {
    if (farmer && locationHook.location && !locationHook.error) {
      const farmerCoords = parseLocationToCoords(farmer.location);
      if (farmerCoords) {
        const distance = calculateDistance(
          locationHook.location.latitude,
          locationHook.location.longitude,
          farmerCoords.lat,
          farmerCoords.lng
        );
        setCalculatedDistance(formatDistance(distance));
      }
    }
  }, [farmer, locationHook.location, locationHook.error]);

  // Add debug logging for farm images
  useEffect(() => {
    if (farmer) {
      console.log("Farmer details received:", farmer);
      console.log("Farm images type:", typeof farmer.farmImages);
      console.log("Farm images:", farmer.farmImages);
      
      if (typeof farmer.farmImages === 'string') {
        try {
          // Try to parse if it's a JSON string
          const parsed = JSON.parse(farmer.farmImages as unknown as string);
          console.log("Parsed farm images:", parsed);
        } catch (e) {
          console.error("Failed to parse farmImages as JSON:", e);
        }
      }
    }
  }, [farmer]);
  
  // Check if the user has already reviewed this farmer
  const hasUserReviewed = () => {
    if (!user || !farmer?.reviews) return false;
    return farmer.reviews.some(review => review.name === user.name);
  };
  
  const { selectedDistrictId } = useDistrict();
  const effectiveDistrictId = selectedDistrictId || user?.districtId || null;

  const { data: products, isLoading: isLoadingProducts, error: productsError } = useQuery<Product[]>({
    queryKey: ["/api/products", { farmerId: id, deliveryDistrictId: effectiveDistrictId || undefined }],
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const { data: wholesaleProducts, isLoading: isLoadingWholesale } = useQuery<Product[]>({
    queryKey: ["/api/products", { farmerId: id, b2bMode: 'true', deliveryDistrictId: effectiveDistrictId || undefined }],
    staleTime: 0,
    refetchOnMount: 'always',
  });
  
  // Fetch followers when dialog opens
  const { data: followers, isLoading: followersLoading } = useQuery<{ name: string }[]>({
    queryKey: [`/api/farmers/${id}/followers`],
    enabled: showFollowers && !!id,
  });
  
  if (isLoadingFarmer) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-80 w-full rounded-lg mb-8" />
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-5 w-1/2 mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-4/5 mb-6" />
            
            <div className="flex flex-wrap gap-2 mb-6">
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-6 w-20 rounded-full" />
              ))}
            </div>
          </div>
          
          <div className="md:w-2/3">
            <Skeleton className="h-10 w-full mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full mb-3" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (farmerError || !farmer) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">{t('farmerDetail.farmerNotFound')}</h2>
        <p className="text-gray-600 mb-6">{t('farmerDetail.farmNotFoundMessage')}</p>
        <Button onClick={() => window.history.back()}>
          <i className="fas fa-arrow-left mr-2"></i>
          Go Back
        </Button>
      </div>
    );
  }

  // Generate dynamic SEO metadata for farmer
  const generateFarmerSEOData = () => {
    const title = `${farmer.farmName} - Organic Farm in ${farmer.location} | FarmerSanthe.com`;
    const description = `Discover fresh produce from ${farmer.farmName} in ${farmer.location}. ${farmer.description?.slice(0, 120)}... Browse organic farming practices and seasonal harvests on FarmerSanthe marketplace.`;
    const keywords = `${farmer.farmName}, ${farmer.location}, local farm, organic farming, fresh produce, ${farmer.tags?.join(', ')}, santhe, farm to table, sustainable agriculture`;
    
    // Ensure absolute URL for image - prefer logoUrl or farmImages over default imageUrl
    const getAbsoluteImageUrl = (farmer: any) => {
      let imageUrl = '';
      
      // Priority: logoUrl > first farmImage > imageUrl > default logo
      if (farmer.logoUrl) {
        imageUrl = farmer.logoUrl;
      } else if (farmer.farmImages && Array.isArray(farmer.farmImages) && farmer.farmImages.length > 0) {
        imageUrl = farmer.farmImages[0];
      } else if (farmer.imageUrl) {
        imageUrl = farmer.imageUrl;
      } else {
        return 'https://farmersanthe.com/logo-santhe.png';
      }
      
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
      }
      return `https://farmersanthe.com${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
    };
    
    return {
      title,
      description,
      keywords,
      image: getAbsoluteImageUrl(farmer),
      url: `https://farmersanthe.com/farmers/${identifier}`
    };
  };

  const seoData = generateFarmerSEOData();

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <link rel="canonical" href={seoData.url} />
        
        {/* Open Graph Tags for Social Media */}
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:image" content={seoData.image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${farmer.farmName} - Organic farm in ${farmer.location}`} />
        <meta property="og:url" content={seoData.url} />
        <meta property="og:type" content="business.business" />
        <meta property="og:site_name" content="FarmerSanthe" />
        <meta property="og:locale" content="en_IN" />
        <meta property="business:contact_data:locality" content={farmer.location} />
        <meta property="business:contact_data:region" content="Karnataka" />
        <meta property="business:contact_data:country_name" content="India" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@FarmerSanthe" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={seoData.image} />
        <meta name="twitter:image:alt" content={`${farmer.farmName} - Organic farm in ${farmer.location}`} />
        
        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content={`${farmer.farmName} - Santhe`} />
        <meta name="geo.region" content="IN-KA" />
        <meta name="geo.placename" content={farmer.location} />
        
        {/* Schema.org JSON-LD for Local Business */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": seoData.url,
            "name": farmer.farmName,
            "image": farmer.imageUrl,
            "description": farmer.description,
            "url": seoData.url,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": farmer.location,
              "addressRegion": "Karnataka",
              "addressCountry": "IN"
            },
            "aggregateRating": farmer.rating ? {
              "@type": "AggregateRating",
              "ratingValue": farmer.rating,
              "reviewCount": farmer.reviewCount || 0
            } : undefined,
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Fresh Produce",
              "itemListElement": products?.slice(0, 5).map(product => ({
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Product",
                  "name": product.name,
                  "image": product.imageUrl
                }
              })) || []
            },
            "knowsAbout": farmer.tags || [],
            "memberOf": {
              "@type": "Organization",
              "name": "Santhe Marketplace",
              "url": window.location.origin
            }
          })}
        </script>
      </Helmet>
      
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button onClick={() => window.history.back()} className="text-accent-600 hover:text-accent-700 flex items-center">
              <i className="fas fa-arrow-left mr-2"></i>
              Go Back
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-serif font-bold">{farmer.farmName}</h1>
                  <FarmerBadge 
                    farmer={farmer} 
                    size="lg" 
                    showText={true}
                  />
                </div>
                <p className="text-gray-600 mb-4">
                  {farmer.location} • {
                    calculatedDistance || 
                    (locationHook.loading ? t('farmerDetail.calculatingDistance') : t('farmerDetail.distanceNotAvailable'))
                  }
                </p>
                
                <div className="flex items-center mb-4">
                  <span className="text-amber-500 mr-1">{farmer.rating}</span>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <i 
                        key={i} 
                        className={`fas ${i < Math.floor(farmer.rating) ? 'fa-star' : i < farmer.rating ? 'fa-star-half-alt' : 'fa-star'} text-xs`}
                      ></i>
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm ml-2">({farmer.reviewCount} {t('farmerDetail.reviews')})</span>
                </div>
                
                {/* Display follower count - clickable */}
                {(farmer as any).followerCount !== undefined && (
                  <Dialog open={showFollowers} onOpenChange={setShowFollowers}>
                    <DialogTrigger asChild>
                      <button 
                        className="flex items-center text-gray-600 text-sm mb-4 hover:text-green-600 transition-colors cursor-pointer group"
                        onClick={() => setShowFollowers(true)}
                      >
                        <Users className="h-4 w-4 mr-2 group-hover:text-green-600" />
                        <span className="hover:underline font-medium">
                          {(farmer as any).followerCount} {(farmer as any).followerCount === 1 ? t('farmerDetail.follower') : t('farmerDetail.followers')}
                        </span>
                        <span className="ml-2 text-xs text-gray-400 group-hover:text-green-500">{t('farmerDetail.clickToView')}</span>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-green-600" />
                          {t('farmerDetail.followersOf', { farmName: farmer.farmName })}
                        </DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="max-h-[300px] pr-4">
                        {followersLoading ? (
                          <div className="py-4 text-center text-gray-500">{t('farmerDetail.loadingFollowers')}</div>
                        ) : followers && followers.length > 0 ? (
                          <ul className="space-y-2">
                            {followers.filter(f => f && f.name).map((follower, index) => (
                              <li key={index} className="flex items-center gap-3 py-2 px-3 bg-gray-50 rounded-lg">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                  <span className="text-green-700 font-medium text-sm">
                                    {follower.name?.charAt(0)?.toUpperCase() || '?'}
                                  </span>
                                </div>
                                <span className="text-gray-700">{follower.name}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="py-4 text-center text-gray-500">{t('farmerDetail.noFollowersYet')}</div>
                        )}
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                )}
                
                <p className="text-gray-700 mb-6">{farmer.description}</p>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">{t('farmerDetail.farmingPractices')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {farmer.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-primary-50 text-primary-700 rounded-full">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Certification Display */}
                {((farmer as any).isOrganicCertified || (farmer as any).isNaturalCertified) && (
                  <div className="mb-6 space-y-3">
                    <h3 className="font-medium mb-2">Certifications</h3>
                    {(farmer as any).isOrganicCertified && (
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-full">
                            <Award className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Leaf className="h-4 w-4 text-green-600" />
                              <span className="font-semibold text-green-800">Organic Farm</span>
                            </div>
                            <p className="text-sm text-green-700 mt-1">
                              This farm has been certified for organic farming practices, ensuring produce grown without synthetic pesticides or fertilizers.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {(farmer as any).isNaturalCertified && (
                      <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-teal-100 rounded-full">
                            <Award className="h-6 w-6 text-teal-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Leaf className="h-4 w-4 text-teal-600" />
                              <span className="font-semibold text-teal-800">Natural Farm</span>
                            </div>
                            <p className="text-sm text-teal-700 mt-1">
                              This farm follows natural farming methods, working in harmony with nature without chemical inputs.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">{t('farmerDetail.contactInformation')}</h3>
                  {user?.role === 'admin' ? (
                    // Show complete contact details for admin users
                    <div className="space-y-3">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-700 font-medium mb-3">{t('farmerDetail.adminViewDetails')}</p>
                        
                        <div className="space-y-2">
                          <p className="text-gray-700">
                            <i className="fas fa-envelope mr-2 text-gray-500 w-4"></i>
                            <span className="font-medium">{t('farmerDetail.email')}</span> {farmer.email || t('farmerDetail.notProvided')}
                          </p>
                          <p className="text-gray-700">
                            <i className="fas fa-phone mr-2 text-gray-500 w-4"></i>
                            <span className="font-medium">{t('farmerDetail.phone')}</span> {farmer.phone || t('farmerDetail.notProvided')}
                          </p>
                          <p className="text-gray-700">
                            <i className="fas fa-map-marker-alt mr-2 text-gray-500 w-4"></i>
                            <span className="font-medium">{t('farmerDetail.district')}</span> {farmer.location}
                          </p>
                          {farmer.address && (
                            <p className="text-gray-700">
                              <i className="fas fa-home mr-2 text-gray-500 w-4"></i>
                              <span className="font-medium">{t('farmerDetail.fullAddress')}</span> {farmer.address}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : user?.role === 'farmer' ? (
                    // Show contact details for farmers (no full address)
                    <>
                      <p className="text-gray-700 mb-1">
                        <i className="fas fa-envelope mr-2 text-gray-500"></i>
                        {farmer.email || t('farmerDetail.contactThroughMarketplace')}
                      </p>
                      <p className="text-gray-700 mb-1">
                        <i className="fas fa-phone mr-2 text-gray-500"></i>
                        {farmer.phone || t('farmerDetail.contactViaEmail')}
                      </p>
                      <p className="text-gray-700">
                        <i className="fas fa-map-marker-alt mr-2 text-gray-500"></i>
                        {farmer.location}
                      </p>
                    </>
                  ) : (
                    // Show only district and email contact to customers, not phone or full address
                    <>
                      <p className="text-gray-700 mb-1">
                        <i className="fas fa-envelope mr-2 text-gray-500"></i>
                        {farmer.email ? (
                          <Button variant="link" className="p-0 text-accent-600 hover:text-accent-800 h-auto" asChild>
                            <a href={`mailto:${farmer.email}`}>{t('farmerDetail.contactViaEmailLink')}</a>
                          </Button>
                        ) : (
                          t('farmerDetail.contactThroughWebsite')
                        )}
                      </p>
                      <p className="text-gray-700">
                        <i className="fas fa-map-marker-alt mr-2 text-gray-500"></i>
                        {/* Only show the district/locality, not the full address */}
                        {farmer.location ? farmer.location.split(',')[0] : t('farmerDetail.locationNotAvailable')}
                      </p>
                    </>
                  )}
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col space-y-3">
                    {(farmer as any).user?.orgSlug ? (
                      <Link href={`/org/${(farmer as any).user.orgSlug}`}>
                        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl shadow-sm hover:shadow-md hover:border-green-500 transition-all cursor-pointer group">
                          <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full shadow-inner">
                            <Store className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-green-700 uppercase tracking-wide flex items-center gap-1">
                              <BadgeCheck className="h-3.5 w-3.5 text-green-600" />
                              Official FPO Store
                            </span>
                            <span className="text-sm font-semibold text-green-800 group-hover:text-green-900">
                              Visit Store Front →
                            </span>
                          </div>
                        </div>
                      </Link>
                    ) : farmer.website ? (
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-globe text-accent-600"></i>
                        <a 
                          href={farmer.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-accent-600 hover:text-accent-700 text-sm underline"
                        >
                          {t('farmerDetail.visitFarmWebsite')}
                        </a>
                      </div>
                    ) : null}

                  </div>
                  
                  <ShareButton 
                    type="farmer" 
                    id={id || ""} 
                    title={farmer.farmName}
                    description={`Discover fresh produce from ${farmer.farmName} in ${farmer.location}`}
                    farmName={farmer.farmName}
                    location={farmer.location}
                  />
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <Tabs defaultValue="products">
                <TabsList className="mb-6 w-full grid grid-cols-4 bg-gradient-to-r from-green-100 to-emerald-100 p-1.5 rounded-xl shadow-md border-2 border-green-200">
                  <TabsTrigger 
                    value="products" 
                    className="data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-lg data-[state=active]:font-semibold text-gray-600 font-medium py-2.5 rounded-lg transition-all"
                  >
                    <i className="fas fa-shopping-basket mr-2"></i>
                    {t('farmerDetail.products')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="gallery" 
                    className="data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-lg data-[state=active]:font-semibold text-gray-600 font-medium py-2.5 rounded-lg transition-all"
                  >
                    <i className="fas fa-images mr-2"></i>
                    {t('farmerDetail.gallery')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="about" 
                    className="data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-lg data-[state=active]:font-semibold text-gray-600 font-medium py-2.5 rounded-lg transition-all"
                  >
                    <i className="fas fa-info-circle mr-2"></i>
                    {t('farmerDetail.about')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reviews" 
                    className="data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-lg data-[state=active]:font-semibold text-gray-600 font-medium py-2.5 rounded-lg transition-all"
                  >
                    <i className="fas fa-star mr-2"></i>
                    {t('farmerDetail.reviewsTab')}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="products">
                  {/* Retail Products */}
                  {isLoadingProducts ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {Array(4).fill(0).map((_, i) => (
                        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                          <Skeleton className="h-48 w-full" />
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <Skeleton className="h-6 w-40" />
                              <Skeleton className="h-5 w-20 rounded-full" />
                            </div>
                            <Skeleton className="h-4 w-full mb-3" />
                            <div className="flex justify-between items-center">
                              <Skeleton className="h-6 w-24" />
                              <Skeleton className="h-4 w-28" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : productsError ? (
                    <div className="text-center py-10">
                      <p className="text-red-500">{t('farmerDetail.errorLoadingProducts')}</p>
                    </div>
                  ) : products && products.length > 0 ? (
                    <Carousel opts={{ align: "start", loop: products.length > 2 }} className="w-full">
                      <CarouselContent className="-ml-2 md:-ml-4">
                        {products.map((product) => (
                          <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 lg:basis-1/3">
                            <ProductCard product={product} orgSlug={orgSlug} />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-0 bg-white/80 hover:bg-white" />
                      <CarouselNext className="right-0 bg-white/80 hover:bg-white" />
                    </Carousel>
                  ) : null}

                  {/* Wholesale Products */}
                  {!isLoadingWholesale && wholesaleProducts && wholesaleProducts.length > 0 && (
                    <div className="mt-8">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-base font-semibold text-orange-700">Wholesale / Bulk Pricing</span>
                        <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded-full">B2B</span>
                      </div>
                      <Carousel opts={{ align: "start", loop: wholesaleProducts.length > 2 }} className="w-full">
                        <CarouselContent className="-ml-2 md:-ml-4">
                          {wholesaleProducts.map((product) => (
                            <CarouselItem key={`w-${product.id}`} className="pl-2 md:pl-4 basis-1/2 lg:basis-1/3">
                              <ProductCard product={product} displayMode="b2b" orgSlug={orgSlug} />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-0 bg-white/80 hover:bg-white" />
                        <CarouselNext className="right-0 bg-white/80 hover:bg-white" />
                      </Carousel>
                    </div>
                  )}

                  {/* Empty state — only show if both retail and wholesale are empty */}
                  {!isLoadingProducts && !isLoadingWholesale &&
                   (!products || products.length === 0) &&
                   (!wholesaleProducts || wholesaleProducts.length === 0) && (
                    <div className="text-center py-10 bg-white rounded-lg shadow-md">
                      <p className="text-gray-500">{t('farmerDetail.noProductsAvailable')}</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="gallery">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-medium mb-4">{t('farmerDetail.farmGallery')}</h2>
                    
                    {/* Farm Images Gallery with Lightbox */}
                    {(() => {
                      let farmImages: string[] = [];
                      if (farmer.farmImages) {
                        if (Array.isArray(farmer.farmImages)) {
                          farmImages = farmer.farmImages;
                        } else if (typeof farmer.farmImages === 'string') {
                          try {
                            const parsed = JSON.parse(farmer.farmImages);
                            if (Array.isArray(parsed)) farmImages = parsed;
                          } catch { /* ignore */ }
                        }
                      }
                      
                      if (farmImages.length === 0) return null;
                      
                      const getImageUrl = (img: string) => 
                        img.startsWith('http://') || img.startsWith('https://') ? img : (img.startsWith('/') ? img : `/${img}`);
                      
                      return (
                        <>
                          <div className="mb-6">
                            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                              <Camera className="h-5 w-5 text-green-600" />
                              {t('farmerDetail.farmGalleryPhotos', { count: farmImages.length })}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {farmImages.map((image, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    setLightboxIndex(index);
                                    setLightboxOpen(true);
                                  }}
                                  className="relative rounded-lg overflow-hidden h-40 md:h-48 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                  <img 
                                    src={getImageUrl(image)} 
                                    alt={`${farmer.farmName} photo ${index + 1}`} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    onError={(e) => {
                                      e.currentTarget.src = "https://placehold.co/400x300?text=Image+Not+Found";
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                                      <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                      </svg>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                            <p className="text-sm text-gray-500 mt-2">{t('farmerDetail.clickToViewFullSize')}</p>
                          </div>
                          
                          {/* Lightbox Modal */}
                          <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
                            <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 bg-black/95 border-0">
                              <div className="relative w-full h-full flex items-center justify-center">
                                {/* Close button */}
                                <button
                                  onClick={() => setLightboxOpen(false)}
                                  className="absolute top-4 right-4 z-50 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors"
                                >
                                  <X className="h-6 w-6 text-white" />
                                </button>
                                
                                {/* Image counter */}
                                <div className="absolute top-4 left-4 z-50 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                  {lightboxIndex + 1} / {farmImages.length}
                                </div>
                                
                                {/* Previous button */}
                                {farmImages.length > 1 && (
                                  <button
                                    onClick={() => setLightboxIndex((prev) => (prev === 0 ? farmImages.length - 1 : prev - 1))}
                                    className="absolute left-4 z-50 bg-white/20 hover:bg-white/40 rounded-full p-3 transition-colors"
                                  >
                                    <ChevronLeft className="h-8 w-8 text-white" />
                                  </button>
                                )}
                                
                                {/* Main image */}
                                <img
                                  src={getImageUrl(farmImages[lightboxIndex])}
                                  alt={`${farmer.farmName} photo ${lightboxIndex + 1}`}
                                  className="max-w-full max-h-[80vh] object-contain"
                                  onError={(e) => {
                                    e.currentTarget.src = "https://placehold.co/800x600?text=Image+Not+Found";
                                  }}
                                />
                                
                                {/* Next button */}
                                {farmImages.length > 1 && (
                                  <button
                                    onClick={() => setLightboxIndex((prev) => (prev === farmImages.length - 1 ? 0 : prev + 1))}
                                    className="absolute right-4 z-50 bg-white/20 hover:bg-white/40 rounded-full p-3 transition-colors"
                                  >
                                    <ChevronRight className="h-8 w-8 text-white" />
                                  </button>
                                )}
                                
                                {/* Thumbnail strip */}
                                {farmImages.length > 1 && (
                                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg max-w-[90%] overflow-x-auto">
                                    {farmImages.map((img, idx) => (
                                      <button
                                        key={idx}
                                        onClick={() => setLightboxIndex(idx)}
                                        className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                                          idx === lightboxIndex ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                      >
                                        <img
                                          src={getImageUrl(img)}
                                          alt={`Thumbnail ${idx + 1}`}
                                          className="w-full h-full object-cover"
                                        />
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      );
                    })()}
                    
                    {/* Instagram Reels Section */}
                    {farmer.instagramReels && (
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-3">{t('farmerDetail.fromOurInstagram')}</h3>
                        <div className="space-y-3">
                          {farmer.instagramReels.split('\n').filter((url: string) => url.trim()).map((url: string, index: number) => {
                            // Extract Instagram post/reel ID for better display
                            const postMatch = url.match(/(?:instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+))/);
                            const postId = postMatch ? postMatch[1] : null;
                            
                            return (
                              <div key={index} className="bg-gray-50 rounded-lg p-4 border hover:border-pink-300 transition-colors">
                                <div className="flex items-center space-x-4">
                                  <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-full flex items-center justify-center">
                                      <i className="fab fa-instagram text-white text-2xl"></i>
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 mb-1">
                                      {url.includes('/reel/') ? t('farmerDetail.instagramReel') : t('farmerDetail.instagramPost')} {index + 1}
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-2">
                                      {t('farmerDetail.instagramDescription')}
                                    </p>
                                    <a 
                                      href={url.trim()}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center space-x-2 text-pink-600 hover:text-pink-700 font-medium text-sm"
                                    >
                                      <i className="fas fa-external-link-alt"></i>
                                      <span>{t('farmerDetail.viewOnInstagram')}</span>
                                    </a>
                                  </div>
                                  <div className="flex-shrink-0">
                                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-lg flex items-center justify-center relative overflow-hidden">
                                      <div className="absolute inset-2 bg-white rounded-md flex items-center justify-center">
                                        <i className="fab fa-instagram text-gray-400 text-lg"></i>
                                      </div>
                                      {postId && (
                                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                          {url.includes('/reel/') ? 'REEL' : 'POST'}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* YouTube Farm Videos Links */}
                    {farmer.youtube && (
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-3">{t('farmerDetail.farmVideos')}</h3>
                        <div className="space-y-3">
                          {farmer.youtube.split('\n').filter((url: string) => url.trim()).map((url: string, index: number) => {
                            // Extract YouTube video ID for thumbnail
                            const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
                            
                            return (
                              <div key={index} className="bg-gray-50 rounded-lg p-4 border hover:border-red-300 transition-colors">
                                <div className="flex items-center space-x-4">
                                  <div className="flex-shrink-0">
                                    <div className="w-16 h-12 bg-red-600 rounded flex items-center justify-center">
                                      <i className="fab fa-youtube text-white text-xl"></i>
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 mb-1">
                                      {t('farmerDetail.farmVideo', { index: index + 1 })}
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-2">
                                      {t('farmerDetail.youtubeDescription')}
                                    </p>
                                    <a 
                                      href={url.trim()}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium text-sm"
                                    >
                                      <i className="fas fa-external-link-alt"></i>
                                      <span>{t('farmerDetail.watchOnYouTube')}</span>
                                    </a>
                                  </div>
                                  {videoId && (
                                    <div className="flex-shrink-0">
                                      <img 
                                        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                        alt={`Video ${index + 1} thumbnail`}
                                        className="w-24 h-18 object-cover rounded"
                                        loading="lazy"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                </TabsContent>
                
                <TabsContent value="about">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-medium mb-4">{t('farmerDetail.aboutFarm', { farmName: farmer.farmName })}</h2>
                    
                    <div className="prose max-w-none">
                      <p>{farmer.description}</p>
                      
                      {farmer.story && (
                        <>
                          <h3>{t('farmerDetail.ourStory')}</h3>
                          <p>{farmer.story}</p>
                        </>
                      )}
                      
                      {farmer.practices && (
                        <>
                          <h3>{t('farmerDetail.farmingPractices')}</h3>
                          <p>{farmer.practices}</p>
                        </>
                      )}
                    </div>

                    {/* Certifications */}
                    {((farmer as any).isOrganicCertified || (farmer as any).isNaturalCertified) && (
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                          <Award className="h-5 w-5 text-green-600" />
                          Certifications
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {(farmer as any).isOrganicCertified && (
                            <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                              <div className="p-2 bg-green-100 rounded-full flex-shrink-0">
                                <Leaf className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <div className="font-semibold text-green-800 mb-1">Organic Farm</div>
                                <p className="text-sm text-green-700">
                                  Certified for organic farming — produce grown without synthetic pesticides or chemical fertilizers.
                                </p>
                              </div>
                            </div>
                          )}
                          {(farmer as any).isNaturalCertified && (
                            <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
                              <div className="p-2 bg-teal-100 rounded-full flex-shrink-0">
                                <Leaf className="h-5 w-5 text-teal-600" />
                              </div>
                              <div>
                                <div className="font-semibold text-teal-800 mb-1">Natural Farm</div>
                                <p className="text-sm text-teal-700">
                                  Certified for natural farming — working in harmony with nature without any chemical inputs.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-medium">{t('farmerDetail.customerReviews')}</h2>
                      <div className="flex items-center">
                        <span className="text-amber-500 font-medium mr-1">{farmer.rating}</span>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <i 
                              key={i} 
                              className={`fas ${i < Math.floor(farmer.rating) ? 'fa-star' : i < farmer.rating ? 'fa-star-half-alt' : 'fa-star'} text-xs`}
                            ></i>
                          ))}
                        </div>
                        <span className="text-gray-500 text-sm ml-2">({farmer.reviewCount} {t('farmerDetail.reviews')})</span>
                      </div>
                    </div>
                    
                    {user && !hasUserReviewed() && (
                      <div className="mb-8">
                        {showReviewForm ? (
                          <ReviewForm 
                            entityId={parseInt(id || "0")} 
                            entityType="farmer" 
                            onSuccess={() => setShowReviewForm(false)}
                          />
                        ) : (
                          <div className="text-center py-6">
                            <h3 className="text-lg font-medium mb-2">{t('farmerDetail.purchasedFromFarm')}</h3>
                            <p className="text-gray-600 mb-4">{t('farmerDetail.shareExperience')}</p>
                            <Button onClick={() => setShowReviewForm(true)}>
                              {t('farmerDetail.writeReview')}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <ReviewList 
                      reviews={farmer.reviews || []} 
                      entityType="farmer" 
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
