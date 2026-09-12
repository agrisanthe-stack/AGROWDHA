import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useLocation, useSearch } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Product, ProductImage, ProductReview } from "@/lib/types";
import { useCart } from "@/hooks/use-cart";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatIndianCurrency } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { ChevronLeft, ChevronRight, Star, X, ZoomIn, Award, Leaf, Store, Truck, Tag, ShoppingCart, Package, CreditCard, Check, Lock } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewForm from "@/components/reviews/ReviewForm";
import ShareButton from "@/components/social/ShareButton";
import { Helmet } from "react-helmet";
import { extractIdFromSlug } from "@/lib/slugs";
import { useDeliveryPrice } from "@/hooks/use-delivery-price";

interface PriceSlab {
  id: number;
  minQuantity: number;
  maxQuantity: number | null;
  pricePerUnit: string;
  slabType: string;
}

export default function ProductDetail() {
  const { t } = useTranslation();
  const { identifier, slug: orgSlug } = useParams();
  
  // Extract ID from identifier (could be slug or plain ID)
  const id = identifier && /^\d+$/.test(identifier) 
    ? identifier 
    : identifier ? extractIdFromSlug(identifier)?.toString() : undefined;
  const searchQuery = useSearch();
  const isWholesaleMode = new URLSearchParams(searchQuery).get('mode') === 'b2b';
  const { user } = useAuth();
  const { addToCart, cartItems } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const isOrgContext = !!orgSlug;
  const orgBasePath = orgSlug ? `/org/${orgSlug}` : '';
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [buyerType, setBuyerType] = useState<"b2c" | "b2b">("b2c");
  const [b2bQuantity, setB2bQuantity] = useState(1);

  const { data: subscriptionData } = useQuery<{ subscription: any }>({
    queryKey: ["/api/my-subscription"],
    enabled: !!user,
  });

  const activeSubscription = subscriptionData?.subscription;
  const hasPreorderRetail = activeSubscription?.plan?.preorderRetail === true;
  const hasPreorderWholesale = activeSubscription?.plan?.preorderWholesale === true;

  // Fetch product details
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
    staleTime: 0,
    refetchOnMount: 'always',
  });

  // Fetch product images
  const { data: productImages, isLoading: isLoadingImages } = useQuery<ProductImage[]>({
    queryKey: [`/api/products/${id}/images`],
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  // Combine primary image with additional images
  useEffect(() => {
    if (product) {
      const images: string[] = [product.imageUrl]; // Start with primary image
      
      if (productImages && productImages.length > 0) {
        // Add additional images
        const additionalImages = productImages.map(img => img.imageUrl);
        setAllImages([...images, ...additionalImages]);
      } else {
        setAllImages(images);
      }
    }
  }, [product, productImages]);

  // B2B/B2C slab pricing logic
  const productWithSlabs = product as Product & {
    b2bQuantity?: number | null;
    b2cQuantity?: number | null;
    b2bMoq?: number | null;
    b2cMoq?: number | null;
    hasSlabPricing?: boolean;
    priceSlabs?: PriceSlab[];
    gradeVariety?: string | null;
    wholesaleUnit?: string | null;
    unitsPerBox?: number | string | null;
  };

  const b2cSlabs = useMemo(() => {
    if (!productWithSlabs?.priceSlabs) return [];
    return productWithSlabs.priceSlabs.filter(slab => slab.slabType === 'b2c');
  }, [productWithSlabs?.priceSlabs]);

  const b2bSlabs = useMemo(() => {
    if (!productWithSlabs?.priceSlabs) return [];
    return productWithSlabs.priceSlabs.filter(slab => slab.slabType === 'b2b');
  }, [productWithSlabs?.priceSlabs]);

  const hasB2B = (productWithSlabs?.b2bQuantity || 0) > 0;
  const b2bStock = productWithSlabs?.inventory ?? productWithSlabs?.b2bQuantity ?? 0;
  const b2bMoq = productWithSlabs?.b2bMoq || 1;
  const wholesaleUnitLabel = productWithSlabs?.wholesaleUnit || product?.unit || "unit";
  const unitsPerBoxVal = productWithSlabs?.unitsPerBox ? parseFloat(String(productWithSlabs.unitsPerBox)) : 1;

  // Calculate how much of this product is already in the cart to show true available stock
  const cartQtyRetail = cartItems
    .filter(item => item.id === product?.id && !item.b2bOrder)
    .reduce((sum, item) => sum + item.quantity, 0);
  const cartQtyB2B = cartItems
    .filter(item => item.id === product?.id && item.b2bOrder)
    .reduce((sum, item) => sum + item.quantity, 0);
  const availableRetailStock = Math.max(0, (product?.inventory || 0) - cartQtyRetail);
  const availableB2BStock = Math.max(0, b2bStock - cartQtyB2B);

  // Initialize B2B quantity when product loads
  useEffect(() => {
    if (hasB2B && b2bMoq > 0) {
      setB2bQuantity(b2bMoq);
      setB2bInputValue(String(b2bMoq));
    }
  }, [hasB2B, b2bMoq]);

  const findApplicableSlab = (qty: number, slabs: PriceSlab[]): PriceSlab | null => {
    if (!slabs || slabs.length === 0) return null;
    
    const sorted = [...slabs].sort((a, b) => a.minQuantity - b.minQuantity);
    
    for (const slab of sorted) {
      const min = slab.minQuantity;
      const max = slab.maxQuantity || Infinity;
      if (qty >= min && qty <= max) {
        return slab;
      }
    }
    
    // If quantity is higher than all slabs, use the highest slab
    if (qty >= sorted[sorted.length - 1].minQuantity) {
      return sorted[sorted.length - 1];
    }
    
    return null;
  };

  const calculateB2BPrice = (qty: number): { pricePerUnit: number; total: number; appliedSlab: PriceSlab | null } => {
    const basePrice = parseFloat(productWithSlabs?.price?.toString() || '0');
    const applicableSlab = findApplicableSlab(qty, b2bSlabs);
    
    if (applicableSlab) {
      const slabPrice = parseFloat(applicableSlab.pricePerUnit);
      return {
        pricePerUnit: slabPrice,
        total: slabPrice * qty,
        appliedSlab: applicableSlab
      };
    }
    
    return {
      pricePerUnit: basePrice,
      total: basePrice * qty,
      appliedSlab: null
    };
  };

  const b2bPriceDetails = calculateB2BPrice(b2bQuantity);

  const [b2bInputValue, setB2bInputValue] = useState(String(b2bMoq));

  // Delivery fee for B2C (1 box fixed) and B2B (live quantity)
  const { fee: b2cDeliveryFee, deliverable: b2cDeliverable, hasFpo: b2cHasFpo, districtName: b2cDistrictName, isLoading: b2cDeliveryLoading } = useDeliveryPrice(product, 1, false);
  const { fee: b2bDeliveryFee, deliverable: b2bDeliverable, hasFpo: b2bHasFpo, districtName: b2bDistrictName, isLoading: b2bDeliveryLoading } = useDeliveryPrice(product, b2bQuantity, true);

  const handleB2BQuantityChange = (value: string) => {
    setB2bInputValue(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setB2bQuantity(numValue);
    }
  };

  const handleB2BQuantityBlur = () => {
    const maxStock = Math.max(availableB2BStock, b2bMoq);
    const clamped = Math.max(b2bMoq, Math.min(b2bQuantity, maxStock));
    setB2bQuantity(clamped);
    setB2bInputValue(String(clamped));
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const createB2BOrderMutation = useMutation({
    mutationFn: async (orderData: { productId: number; quantity: number; pricePerUnit: number; totalAmount: number }) => {
      const res = await apiRequest("POST", "/api/b2b-orders", orderData);
      return await res.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Order Created!",
        description: `Your bulk order has been placed successfully. Stock updated.`,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/products/${id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        setLocation("/orders");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Order Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handlePlaceB2BOrder = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to place a bulk order",
        variant: "destructive"
      });
      setLocation("/login");
      return;
    }

    if (!product?.id) {
      toast({
        title: "Error",
        description: "Product information is missing",
        variant: "destructive"
      });
      return;
    }

    if (b2bQuantity < b2bMoq) {
      toast({
        title: "Minimum Order Required",
        description: `Minimum order quantity is ${b2bMoq} ${product.unit}`,
        variant: "destructive"
      });
      return;
    }

    if (b2bQuantity > availableB2BStock) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${availableB2BStock} ${product.unit} available`,
        variant: "destructive"
      });
      return;
    }

    createB2BOrderMutation.mutate({
      productId: product.id,
      quantity: b2bQuantity,
      pricePerUnit: b2bPriceDetails.pricePerUnit,
      totalAmount: b2bPriceDetails.total
    });
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Check if the user has already reviewed this product
  const hasUserReviewed = () => {
    if (!user || !product?.reviews) return false;
    return product.reviews.some(review => review.name === user.name);
  };

  // Render star rating
  const renderStarRating = (rating: string | undefined) => {
    if (!rating) return null;
    
    const numRating = parseFloat(rating);
    return (
      <div className="flex items-center">
        <div className="flex mr-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < Math.floor(numRating)
                  ? "fill-yellow-400 text-yellow-400"
                  : i < Math.ceil(numRating) && numRating % 1 >= 0.5
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">
          {numRating.toFixed(1)} ({product?.reviewCount || 0} {product?.reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-lg" />
          <div>
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />
            
            <Skeleton className="h-8 w-1/3 mb-4" />
            
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-12 w-24" />
              <Skeleton className="h-12 w-40" />
            </div>
            
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-6" />
            
            <div className="flex items-center gap-2 mb-6">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for could not be found.</p>
        <Button asChild>
          <Link href={isOrgContext ? orgBasePath : (isWholesaleMode ? "/wholesale" : "/products")}>
            {isOrgContext ? "Back to Store" : (isWholesaleMode ? "Back to Wholesale" : "Back to Products")}
          </Link>
        </Button>
      </div>
    );
  }

  // Generate dynamic SEO metadata
  const generateSEOData = () => {
    const categoryName = typeof product.category === 'string' ? product.category : product.category?.name || 'Produce';
    const title = `${product.name} - Fresh ${categoryName} | FarmerSanthe.com`;
    const description = `Buy fresh ${product.name} directly from local farmers. ${product.description.slice(0, 100)}... Available ${product.status === 'Pre-Order' ? 'for pre-order' : 'now'} at ${formatIndianCurrency(product.price)}/box on FarmerSanthe marketplace.`;
    const keywords = `${product.name}, ${categoryName}, fresh produce, local farmers, organic, ${product.status.toLowerCase()}, santhe, farm to table, ${product.unit}`;
    
    // Ensure absolute URL for image for social media sharing
    const getAbsoluteImageUrl = (imageUrl: string) => {
      if (!imageUrl) return 'https://farmersanthe.com/logo-santhe.png';
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
      }
      return `https://farmersanthe.com${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
    };
    
    return {
      title,
      description,
      keywords,
      image: getAbsoluteImageUrl(product.imageUrl),
      url: `https://farmersanthe.com/products/${identifier}`
    };
  };

  const seoData = generateSEOData();

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
        <meta property="og:image:alt" content={`${product.name} - Fresh produce from FarmerSanthe`} />
        <meta property="og:url" content={seoData.url} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="FarmerSanthe" />
        <meta property="og:locale" content="en_IN" />
        <meta property="product:price:amount" content={product.price.toString()} />
        <meta property="product:price:currency" content="INR" />
        <meta property="product:availability" content={product.status === 'Available Now' ? 'in stock' : 'preorder'} />
        <meta property="product:category" content={typeof product.category === 'string' ? product.category : product.category?.name || ''} />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@FarmerSanthe" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={seoData.image} />
        <meta name="twitter:image:alt" content={`${product.name} - Fresh produce from FarmerSanthe`} />
        
        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Santhe - Farm Fresh Marketplace" />
        <meta name="geo.region" content="IN-KA" />
        <meta name="geo.placename" content="Bangalore, Karnataka, India" />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": product.imageUrl,
            "description": product.description,
            "brand": {
              "@type": "Brand",
              "name": "Local Farmer"
            },
            "category": typeof product.category === 'string' ? product.category : product.category?.name || '',
            "offers": {
              "@type": "Offer",
              "url": seoData.url,
              "priceCurrency": "INR",
              "price": product.price,
              "priceValidUntil": product.availableUntil,
              "availability": product.status === 'Available Now' 
                ? "https://schema.org/InStock" 
                : "https://schema.org/PreOrder",
              "seller": {
                "@type": "Organization",
                "name": "Santhe",
                "url": window.location.origin
              }
            },
            "aggregateRating": product.rating ? {
              "@type": "AggregateRating",
              "ratingValue": product.rating,
              "reviewCount": product.reviewCount || 0
            } : undefined
          })}
        </script>
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href={isOrgContext ? orgBasePath : (isWholesaleMode ? "/wholesale" : "/products")} className="text-accent-600 hover:text-accent-700 flex items-center">
            <i className="fas fa-arrow-left mr-2"></i>
            {isOrgContext ? "Back to Store" : (isWholesaleMode ? "Back to Wholesale Products" : t('products.detail.backToProducts'))}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden shadow-md bg-white relative group">
              <button
                onClick={() => setLightboxOpen(true)}
                className="w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <img 
                  src={allImages[currentImageIndex]} 
                  alt={`${product.name} - image ${currentImageIndex + 1}`} 
                  className="w-full h-96 object-cover cursor-pointer"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                    <ZoomIn className="h-6 w-6 text-gray-700" />
                  </div>
                </div>
              </button>
              
              {allImages.length > 1 && (
                <>
                  <Button
                    variant="outline" 
                    size="icon" 
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full z-10"
                    onClick={(e) => { e.stopPropagation(); goToPreviousImage(); }}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  
                  <Button
                    variant="outline" 
                    size="icon" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full z-10"
                    onClick={(e) => { e.stopPropagation(); goToNextImage(); }}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
              
              <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-white bg-black/50 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Click to view full size
              </p>
            </div>
            
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((img, index) => (
                  <div 
                    key={index}
                    className={`relative rounded-md overflow-hidden cursor-pointer flex-shrink-0 border-2 ${
                      currentImageIndex === index ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => goToImage(index)}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} thumbnail ${index + 1}`} 
                      className="w-16 h-16 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            
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
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                  
                  {/* Previous button */}
                  {allImages.length > 1 && (
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                      className="absolute left-4 z-50 bg-white/20 hover:bg-white/40 rounded-full p-3 transition-colors"
                    >
                      <ChevronLeft className="h-8 w-8 text-white" />
                    </button>
                  )}
                  
                  {/* Main image */}
                  <img
                    src={allImages[currentImageIndex]}
                    alt={`${product.name} - image ${currentImageIndex + 1}`}
                    className="max-w-full max-h-[80vh] object-contain"
                  />
                  
                  {/* Next button */}
                  {allImages.length > 1 && (
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 z-50 bg-white/20 hover:bg-white/40 rounded-full p-3 transition-colors"
                    >
                      <ChevronRight className="h-8 w-8 text-white" />
                    </button>
                  )}
                  
                  {/* Thumbnail strip */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg max-w-[90%] overflow-x-auto">
                      {allImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                            idx === currentImageIndex ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img}
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
          </div>

          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h1 className="text-3xl font-serif font-bold">{product.name}</h1>
                {isWholesaleMode && (
                  <Badge className="mt-1 bg-orange-600 text-white">
                    <Package className="h-3 w-3 mr-1" />
                    Wholesale
                  </Badge>
                )}
              </div>
              {product.status === 'Pre-Order' ? (
                <div className="px-3 py-1.5 rounded-full font-medium status-preorder">
                  {product.status}
                </div>
              ) : (
                <div className="px-3 py-1.5 rounded-full font-medium status-available">
                  {product.status}
                </div>
              )}
            </div>
            
            {/* Rating */}
            <div className="mb-3">
              {renderStarRating(product.rating)}
            </div>
            
            {/* Retail Price Card - hidden in wholesale mode */}
            {!isWholesaleMode && (
              <div className="mb-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 inline-block">
                <p className="text-xs uppercase tracking-wide text-green-600 font-medium mb-1">{t('products.detail.pricePerBox')}</p>
                <p className="text-3xl font-bold text-green-700">
                  {formatIndianCurrency(product.price)}
                  <span className="text-base font-medium text-green-600 ml-1">
                    / {unitsPerBoxVal !== 1 ? `${unitsPerBoxVal}${product.unit}` : product.unit} box
                  </span>
                </p>
              </div>
            )}
            
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            {/* Product Details Grid */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <p className="text-xs uppercase tracking-wide text-blue-600 font-medium mb-1">{t('products.detail.availableUntil')}</p>
                <p className="text-lg font-bold text-gray-900">{formatDate(product.availableUntil)}</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                <p className="text-xs uppercase tracking-wide text-amber-600 font-medium mb-1">{t('products.detail.harvestDate')}</p>
                <p className="text-lg font-bold text-gray-900">{formatDate(product.harvestDate || product.harvestMonth)}</p>
              </div>
              {!isWholesaleMode && (
                <>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                    <p className="text-xs uppercase tracking-wide text-purple-600 font-medium mb-1">{t('products.detail.quantityPerBox')}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {unitsPerBoxVal !== 1
                        ? `${unitsPerBoxVal} ${product.unit} per box`
                        : `1 ${product.unit}`}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
                    <p className="text-xs uppercase tracking-wide text-emerald-600 font-medium mb-1">{t('products.detail.inStock')}</p>
                    {unitsPerBoxVal !== 1 ? (
                      <>
                        <p className="text-lg font-bold text-gray-900">
                          {Math.floor(availableRetailStock / unitsPerBoxVal)} {t('products.detail.boxes')}
                        </p>
                        <p className="text-sm text-emerald-700">({availableRetailStock} {product.unit} {t('products.detail.total')})</p>
                      </>
                    ) : (
                      <p className="text-lg font-bold text-gray-900">{availableRetailStock} {product.unit}</p>
                    )}
                  </div>
                </>
              )}
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4 border border-green-100">
                <p className="text-xs uppercase tracking-wide text-green-600 font-medium mb-1">Est. Delivery</p>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-green-600" />
                  <p className="text-lg font-bold text-gray-900">
                    {(() => {
                      const today = new Date();
                      if (product.status === 'Pre-Order' && (product.harvestDate || product.harvestMonth)) {
                        const harvestDate = new Date(product.harvestDate || product.harvestMonth || '');
                        if (!isNaN(harvestDate.getTime())) {
                          const delivery = new Date(harvestDate.getTime() + 86400000);
                          return formatDate(delivery.toISOString());
                        }
                      }
                      const tomorrow = new Date(today.getTime() + 86400000);
                      return formatDate(tomorrow.toISOString());
                    })()}
                  </p>
                </div>
              </div>
              {!isWholesaleMode && (b2cHasFpo || b2cDeliveryLoading) && (
                <div className={`rounded-xl p-4 border ${b2cDeliverable ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100' : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-100'}`}>
                  <p className={`text-xs uppercase tracking-wide font-medium mb-1 ${b2cDeliverable ? 'text-blue-600' : 'text-red-600'}`}>
                    Delivery Fee{b2cDistrictName ? ` · ${b2cDistrictName}` : ""}
                  </p>
                  {b2cDeliveryLoading ? (
                    <Skeleton className="h-6 w-24" />
                  ) : b2cDeliverable ? (
                    <p className="text-lg font-bold text-gray-900">
                      {b2cDeliveryFee === null ? "—" : b2cDeliveryFee === 0 ? "Free delivery" : formatIndianCurrency(b2cDeliveryFee)}
                      {b2cDeliveryFee !== null && b2cDeliveryFee > 0 && (
                        <span className="text-sm font-normal text-gray-500 ml-1">per box</span>
                      )}
                    </p>
                  ) : (
                    <p className="text-base font-semibold text-red-600">Not available to your district</p>
                  )}
                </div>
              )}
              {product.growingDetails && (
                <div className="col-span-2 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-100">
                  <p className="text-xs uppercase tracking-wide text-teal-600 font-medium mb-1">{t('products.detail.cultivationType')}</p>
                  <p className="text-lg font-bold text-gray-900">{product.growingDetails}</p>
                </div>
              )}
            </div>
            
            {/* Retail Add to Cart - hidden in wholesale mode */}
            {!isWholesaleMode && (
              <div className="mb-6">
                {product.status !== 'Available Now' && !hasPreorderRetail ? (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-amber-100 rounded-full">
                        <Lock className="h-5 w-5 text-amber-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-amber-900">Subscription Required for Pre-Order</h3>
                        <p className="text-sm text-amber-700">Subscribe to a Farm Direct plan to pre-order this product before harvest.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => setLocation("/subscription")}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium"
                        size="lg"
                      >
                        <CreditCard className="h-5 w-5 mr-2" />
                        View Subscription Plans
                      </Button>
                      <ShareButton
                        type="product"
                        id={id || ""}
                        title={product.name}
                        description={`Pre-order ${product.name} from ${product.farm?.name || 'FPO Store'} at ₹${product.price}/${product.unit}`}
                        productName={product.name}
                        categoryName={typeof product.category === 'string' ? product.category : product.category?.name || 'Produce'}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Select
                      value={quantity.toString()}
                      onValueChange={(value) => setQuantity(parseInt(value))}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder={t('products.detail.qty')} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRetailStock === 0 ? (
                          <SelectItem value="0" disabled>Out of stock</SelectItem>
                        ) : (
                          [...Array(Math.min(10, availableRetailStock))].map((_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      onClick={handleAddToCart}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-6"
                      size="lg"
                    >
                      <i className="fas fa-shopping-cart mr-2"></i>
                      {product.status === 'Available Now' ? t('products.detail.addToCart') : t('products.detail.preOrderNow')}
                    </Button>
                    
                    <ShareButton 
                      type="product" 
                      id={id || ""} 
                      title={product.name}
                      description={`Fresh ${product.name} from ${product.farm?.name || 'FPO Store'} at ₹${product.price}/${product.unit}`}
                      productName={product.name}
                      categoryName={typeof product.category === 'string' ? product.category : product.category?.name || 'Produce'}
                    />
                  </div>
                )}
              </div>
            )}
            
            {/* B2B Wholesale Ordering Section */}
            {isWholesaleMode && hasB2B && (
              <div className="mb-6">
                <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Package className="h-6 w-6 text-orange-600" />
                      Wholesale / Bulk Order (B2B)
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Volume-based pricing — higher quantities unlock better rates
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center bg-white rounded-lg p-3 border border-orange-100">
                      <div>
                        <p className="text-sm text-gray-500">Available Stock</p>
                        <p className="text-xl font-bold text-gray-900">{availableB2BStock} {wholesaleUnitLabel}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Min Order</p>
                        <p className="text-xl font-bold text-orange-600">{b2bMoq} {wholesaleUnitLabel}</p>
                      </div>
                    </div>

                    {b2bSlabs.length > 0 && (
                      <div className="bg-white rounded-lg border border-orange-100 overflow-hidden">
                        <div className="bg-orange-100 px-4 py-2 flex items-center gap-2">
                          <Tag className="h-4 w-4 text-orange-700" />
                          <span className="text-sm font-semibold text-orange-800">Volume Pricing Tiers</span>
                        </div>
                        <div className="divide-y divide-orange-50">
                          {b2bSlabs.sort((a, b) => a.minQuantity - b.minQuantity).map((slab) => (
                            <div
                              key={slab.id}
                              className="flex justify-between items-center px-4 py-3 hover:bg-orange-50 transition-colors"
                            >
                              <span className="font-medium text-gray-700">
                                {slab.minQuantity}{slab.maxQuantity ? ` – ${slab.maxQuantity}` : '+'} {wholesaleUnitLabel}
                              </span>
                              <span className="font-bold text-orange-600">
                                {formatIndianCurrency(slab.pricePerUnit)} / {wholesaleUnitLabel}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {product.status !== 'Available Now' && !hasPreorderWholesale ? (
                      <div className="rounded-xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 p-5">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="p-2 bg-amber-100 rounded-full shrink-0">
                            <Lock className="h-5 w-5 text-amber-700" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-amber-900">Subscription Required for Wholesale Pre-Order</h3>
                            <p className="text-sm text-amber-700 mt-0.5">
                              Subscribe to a Business Farm Direct Pro plan to pre-order wholesale products before harvest.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            onClick={() => setLocation("/subscription")}
                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium"
                            size="lg"
                          >
                            <CreditCard className="h-5 w-5 mr-2" />
                            View Subscription Plans
                          </Button>
                          <ShareButton
                            type="product"
                            id={id || ""}
                            title={product.name}
                            description={`Pre-order wholesale ${product.name} from ${product.farm?.name || 'FPO Store'} at ₹${product.price}/${product.unit}`}
                            productName={product.name}
                            categoryName={typeof product.category === 'string' ? product.category : product.category?.name || 'Produce'}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Enter Quantity ({wholesaleUnitLabel})
                          </label>
                          <Input
                            type="number"
                            min={b2bMoq}
                            max={availableB2BStock}
                            value={b2bInputValue}
                            onChange={(e) => handleB2BQuantityChange(e.target.value)}
                            onBlur={handleB2BQuantityBlur}
                            className="text-lg h-12 font-semibold text-center"
                            placeholder={`Min: ${b2bMoq} ${wholesaleUnitLabel}`}
                          />
                          {b2bMoq > 1 && (
                            <p className="text-xs text-amber-600 mt-1">
                              Minimum order: {b2bMoq} {wholesaleUnitLabel}
                            </p>
                          )}
                        </div>

                        {b2bPriceDetails.appliedSlab && (
                          <div className="bg-green-100 rounded-lg p-3 border border-green-200 flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-green-700 font-medium">
                              Slab Applied: {b2bPriceDetails.appliedSlab.minQuantity}{b2bPriceDetails.appliedSlab.maxQuantity ? `-${b2bPriceDetails.appliedSlab.maxQuantity}` : '+'} {wholesaleUnitLabel} @ {formatIndianCurrency(b2bPriceDetails.appliedSlab.pricePerUnit)}/{wholesaleUnitLabel}
                            </span>
                          </div>
                        )}

                        <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                          <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                            <span>Price per {wholesaleUnitLabel}</span>
                            <span className="font-semibold">{formatIndianCurrency(b2bPriceDetails.pricePerUnit)}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                            <span>Quantity</span>
                            <span className="font-semibold">{b2bQuantity} {wholesaleUnitLabel}</span>
                          </div>
                          {(b2bHasFpo || b2bDeliveryLoading) && (
                            <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                              <span className="flex items-center gap-1">
                                <Truck className="h-3.5 w-3.5 text-blue-500" />
                                Delivery{b2bDistrictName ? ` to ${b2bDistrictName}` : " Fee"}
                              </span>
                              {b2bDeliveryLoading ? (
                                <Skeleton className="h-4 w-16" />
                              ) : (
                                <span className={`font-semibold ${b2bDeliverable ? 'text-blue-600' : 'text-red-500'}`}>
                                  {!b2bDeliverable
                                    ? "Not available to your district"
                                    : b2bDeliveryFee === null ? "—"
                                    : b2bDeliveryFee === 0 ? "Free delivery"
                                    : formatIndianCurrency(b2bDeliveryFee)}
                                </span>
                              )}
                            </div>
                          )}
                          <Separator className="my-2" />
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-medium">Total Amount</span>
                            <span className="text-2xl font-bold text-green-600">
                              {formatIndianCurrency(b2bPriceDetails.total)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 text-right mt-1">
                            {b2bQuantity} {wholesaleUnitLabel} × {formatIndianCurrency(b2bPriceDetails.pricePerUnit)}
                          </p>
                        </div>

                        <Button
                          onClick={() => {
                            if (product) {
                              const wholesaleProduct = {
                                ...product,
                                price: b2bPriceDetails.pricePerUnit,
                                b2bOrder: true,
                                b2bSlabApplied: b2bPriceDetails.appliedSlab ? {
                                  minQuantity: b2bPriceDetails.appliedSlab.minQuantity,
                                  maxQuantity: b2bPriceDetails.appliedSlab.maxQuantity,
                                  pricePerUnit: b2bPriceDetails.appliedSlab.pricePerUnit,
                                } : undefined,
                              };
                              addToCart(wholesaleProduct, b2bQuantity);
                              toast({
                                title: "Added to cart",
                                description: `${b2bQuantity} ${wholesaleUnitLabel} of ${product.name} added @ ${formatIndianCurrency(b2bPriceDetails.pricePerUnit)}/${wholesaleUnitLabel}`,
                              });
                            }
                          }}
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          size="lg"
                          disabled={b2bQuantity < b2bMoq || b2bQuantity > availableB2BStock}
                        >
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          Add to Cart — {formatIndianCurrency(b2bPriceDetails.total)}
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Certification Badge for certified farms */}
            {(product.farm as any)?.isOrganicCertified && (
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
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
                      This product comes from an Organic certified farm — grown without chemicals, pesticides, or synthetic fertilizers.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {!(product.farm as any)?.isOrganicCertified && (product.farm as any)?.isNaturalCertified && (
              <div className="mb-6 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
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
                      This product comes from a Natural certified farm — grown in harmony with nature without any chemical inputs.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {product.farm ? (
              (product.farm as any).isFpoDirect ? (
                <Link href={(product.farm as any).orgSlug ? `/org/${(product.farm as any).orgSlug}` : '#'} className="flex items-center hover:bg-amber-50 p-3 rounded-lg border border-amber-200 bg-amber-50/50 transition">
                  {product.farm.logoUrl ? (
                    <img src={product.farm.logoUrl} alt={product.farm.name} className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-amber-300" />
                  ) : (
                    <div className="w-10 h-10 rounded-full mr-3 flex-shrink-0 bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm border-2 border-amber-300">
                      {(product.farm.name || 'F').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{product.farm.name}</p>
                    <p className="text-sm text-gray-600">{product.farm.location}</p>
                  </div>
                  <i className="fas fa-chevron-right ml-auto text-gray-400"></i>
                </Link>
              ) : (
                <Link href={isOrgContext ? `${orgBasePath}/farmers/${product.farm.id}` : `/farmers/${product.farm.id}`} className="flex items-center hover:bg-gray-50 p-3 rounded-lg transition">
                  <img 
                    src={product.farm.logoUrl} 
                    alt={product.farm.name} 
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium">{product.farm.name}</p>
                    <p className="text-sm text-gray-600">{product.farm.location}</p>
                  </div>
                  <i className="fas fa-chevron-right ml-auto text-gray-400"></i>
                </Link>
              )
            ) : null}
            
            {(product as any).approverDetails?.orgName && (
              <div className="mt-3">
                {(product as any).approverDetails?.orgSlug ? (
                  <Link
                    href={`/org/${(product as any).approverDetails.orgSlug}`}
                    className="flex items-center hover:bg-blue-50 p-3 rounded-lg border border-blue-100 bg-blue-50/50 transition"
                  >
                    {(product as any).approverDetails.orgLogoUrl ? (
                      <img
                        src={(product as any).approverDetails.orgLogoUrl}
                        alt={(product as any).approverDetails.orgName}
                        className="w-10 h-10 rounded-full mr-3 object-cover border border-blue-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full mr-3 bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                        {(product as any).approverDetails.orgName.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-blue-500 font-medium uppercase tracking-wide">In association with</p>
                      <p className="font-semibold text-blue-800 truncate">{(product as any).approverDetails.orgName}</p>
                      {(product as any).approverDetails.district && (
                        <p className="text-xs text-blue-600">{(product as any).approverDetails.district}</p>
                      )}
                    </div>
                    <i className="fas fa-chevron-right ml-2 text-blue-400 text-sm"></i>
                  </Link>
                ) : (
                  <div className="flex items-center p-3 rounded-lg border border-blue-100 bg-blue-50/50">
                    <div className="w-10 h-10 rounded-full mr-3 bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                      {(product as any).approverDetails.orgName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs text-blue-500 font-medium uppercase tracking-wide">In association with</p>
                      <p className="font-semibold text-blue-800">{(product as any).approverDetails.orgName}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
            
            {user && !hasUserReviewed() && (
              <div className="mb-8">
                {showReviewForm ? (
                  <ReviewForm 
                    entityId={parseInt(id || "0")} 
                    entityType="product" 
                    onSuccess={() => setShowReviewForm(false)}
                  />
                ) : (
                  <div className="text-center py-6">
                    <h3 className="text-lg font-medium mb-2">Have you tried this product?</h3>
                    <p className="text-gray-600 mb-4">Share your experience with other customers</p>
                    <Button onClick={() => setShowReviewForm(true)}>
                      Write a Review
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            <ReviewList 
              reviews={product.reviews || []} 
              entityType="product" 
            />
          </div>
        </div>
      </div>
    </>
  );
}
