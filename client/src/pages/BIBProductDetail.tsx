import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Product, ProductImage } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatIndianCurrency } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { 
  ChevronLeft, 
  ChevronRight, 
  Package, 
  Calendar,
  TrendingUp,
  ArrowLeft,
  Check,
  AlertCircle
} from "lucide-react";
import { Helmet } from "react-helmet";
import { extractIdFromSlug } from "@/lib/slugs";
import { useToast } from "@/hooks/use-toast";
import ShareButton from "@/components/social/ShareButton";

export default function BIBProductDetail() {
  const { identifier } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Extract ID from identifier (could be slug or plain ID)
  const id = identifier && /^\d+$/.test(identifier) 
    ? identifier 
    : identifier ? extractIdFromSlug(identifier)?.toString() : undefined;
  
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [proposedPrice, setProposedPrice] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Fetch product details
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
  });

  // Quote submission mutation
  const submitQuoteMutation = useMutation({
    mutationFn: async (quoteData: { productId: number; proposedPrice: string; notes?: string }) => {
      return await apiRequest("POST", "/api/quotes", quoteData);
    },
    onSuccess: () => {
      toast({
        title: "Quote Submitted!",
        description: "The farmer will review your quote and contact you if accepted.",
      });
      // Reset form
      setProposedPrice("");
      setNotes("");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Submit Quote",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Fetch product images
  const { data: productImages } = useQuery<ProductImage[]>({
    queryKey: [`/api/products/${id}/images`],
    enabled: !!id,
  });

  // Combine primary image with additional images
  useEffect(() => {
    if (product) {
      const images: string[] = [product.imageUrl];
      
      if (productImages && productImages.length > 0) {
        const additionalImages = productImages.map(img => img.imageUrl);
        setAllImages([...images, ...additionalImages]);
      } else {
        setAllImages(images);
      }
    }
  }, [product, productImages]);

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

  const handleSubmitQuote = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to submit a quote",
        variant: "destructive"
      });
      setLocation("/login");
      return;
    }

    if (!proposedPrice) {
      toast({
        title: "Missing Information",
        description: "Please enter your proposed price",
        variant: "destructive"
      });
      return;
    }

    const priceNum = parseFloat(proposedPrice);

    if (priceNum < (product?.priceRangeMin || 0) || priceNum > (product?.priceRangeMax || 0)) {
      toast({
        title: "Invalid Price",
        description: `Price must be between ${formatIndianCurrency(product?.priceRangeMin || 0)} and ${formatIndianCurrency(product?.priceRangeMax || 0)}`,
        variant: "destructive"
      });
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

    // Submit quote to backend (quantity is automatically set to totalAvailableQuantity on server)
    submitQuoteMutation.mutate({
      productId: product.id,
      proposedPrice: proposedPrice,
      notes: notes || undefined
    });
  };

  // For BIB products, use totalAvailableQuantity instead of inventory calculation
  const totalAvailable = product?.totalAvailableQuantity || (product?.inventory || 0) * (product?.unitsPerBox || 1);
  const isQuoteDeadlinePassed = product?.quoteDeadline 
    ? new Date(product.quoteDeadline) < new Date() 
    : false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Link href="/bib">
            <Button>Back to BIB</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.name} - Buy In Bulk | FarmerSanthe</title>
        <meta name="description" content={`Submit a competitive quote for ${product.name}. ${product.description}`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link href="/bib">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to BIB Products
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              <Card className="overflow-hidden border-orange-200">
                <div className="relative h-96 bg-gray-100">
                  <img 
                    src={allImages[currentImageIndex] || product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={goToPreviousImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={goToNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                      
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {allImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToImage(index)}
                            className={`w-3 h-3 rounded-full transition-all ${
                              index === currentImageIndex 
                                ? 'bg-white' 
                                : 'bg-white/50 hover:bg-white/70'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </Card>

              {/* Product Info */}
              <Card className="mt-4 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                      {(product as any).isSold ? (
                        <Badge className="bg-red-600 text-white">
                          <Package className="h-3 w-3 mr-1" />
                          Sold Out
                        </Badge>
                      ) : (
                        <Badge className="bg-orange-600 text-white">
                          <Package className="h-3 w-3 mr-1" />
                          Bulk Order
                        </Badge>
                      )}
                    </div>
                    <ShareButton 
                      type="product" 
                      id={id || ""} 
                      title={product.name}
                      description={`Bulk wholesale lot of ${product.totalAvailableQuantity || 0} ${product.unit} from ${product.farm.name}. Quote range: ₹${product.priceRangeMin}-₹${product.priceRangeMax}`}
                      productName={product.name}
                      categoryName={typeof product.category === 'string' ? product.category : product.category?.name}
                      farmName={product.farm.name}
                      location={product.farm.location}
                    />
                  </div>

                  <p className="text-gray-600 mb-6">{product.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <div className="text-sm text-orange-700 mb-1">Price Range (Total)</div>
                      <div className="text-2xl font-bold text-orange-600">
                        {formatIndianCurrency(product.priceRangeMin || 0)} - {formatIndianCurrency(product.priceRangeMax || 0)}
                      </div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <div className="text-sm text-orange-700 mb-1">Total Available</div>
                      <div className="text-2xl font-bold text-orange-600">
                        {totalAvailable} {product.unit}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>Quote Deadline: <strong>{formatDate(product.quoteDeadline || product.availableUntil)}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>Harvest Date: <strong>{formatDate(product.harvestDate || product.harvestMonth || '')}</strong></span>
                  </div>

                  {product.growingDetails && (
                    <>
                      <Separator className="my-4" />
                      <div className="text-sm">
                        <span className="font-semibold text-gray-700">Cultivation Details:</span>
                        <p className="text-gray-600 mt-1">{product.growingDetails}</p>
                      </div>
                    </>
                  )}

                  <Separator className="my-4" />

                  {/* Farmer Info */}
                  <div className="flex items-center gap-3">
                    <img 
                      src={product.farm.logoUrl} 
                      alt={product.farm.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{product.farm.name}</div>
                      <div className="text-sm text-gray-600">{product.farm.location}</div>
                      {product.farm.isZbnfCertified && (
                        <Badge className="mt-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs">
                          ZBNF Certified
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quote Submission Form */}
            <div>
              <Card className="border-orange-200 sticky top-8">
                <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
                  <CardTitle className="text-2xl">Submit Your Quote</CardTitle>
                  <p className="text-orange-100 text-sm">
                    Provide your best offer within the farmer's price range
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  {(product as any).isSold ? (
                    <div className="text-center py-8">
                      <Package className="h-16 w-16 text-red-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Sold Out</h3>
                      <p className="text-gray-600 mb-4">This bulk lot has been sold and is no longer available for quotes</p>
                      <Link href="/bib">
                        <Button className="bg-orange-600 hover:bg-orange-700">
                          Browse Other Products
                        </Button>
                      </Link>
                    </div>
                  ) : isQuoteDeadlinePassed ? (
                    <div className="text-center py-8">
                      <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Quote Deadline Passed</h3>
                      <p className="text-gray-600 mb-4">This product is no longer accepting quotes</p>
                      <Link href="/bib">
                        <Button className="bg-orange-600 hover:bg-orange-700">
                          Browse Other Products
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-6">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                          <div className="flex items-start gap-2">
                            <Package className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                              <p className="font-semibold text-gray-900 mb-1">Wholesale Lot</p>
                              <p className="text-gray-700">
                                This is a bulk wholesale lot of <span className="font-semibold">{product.totalAvailableQuantity || 0} {product.unit}</span>. You are quoting for the entire quantity.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="proposed-price" className="text-base font-semibold">
                            Your Proposed Price (for entire lot)
                          </Label>
                          <div className="text-sm text-gray-600 mb-2">
                            Range: {formatIndianCurrency(product.priceRangeMin || 0)} - {formatIndianCurrency(product.priceRangeMax || 0)}
                          </div>
                          <Input
                            id="proposed-price"
                            type="number"
                            placeholder="Enter your price"
                            value={proposedPrice}
                            onChange={(e) => setProposedPrice(e.target.value)}
                            className="text-lg"
                            min={product.priceRangeMin || 0}
                            max={product.priceRangeMax || 0}
                          />
                        </div>

                        <div>
                          <Label htmlFor="notes" className="text-base font-semibold">
                            Additional Notes (Optional)
                          </Label>
                          <textarea
                            id="notes"
                            placeholder="Any special requirements or delivery preferences..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full min-h-[100px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>

                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-gray-700">
                              <p className="font-semibold mb-2">What happens next?</p>
                              <ul className="space-y-1 text-gray-600">
                                <li>• The farmer will review all submitted quotes</li>
                                <li>• If your quote is selected, you'll receive a payment request</li>
                                <li>• Payment must be completed within 24 hours</li>
                                <li>• Delivery will be arranged after payment confirmation</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={handleSubmitQuote}
                          disabled={submitQuoteMutation.isPending}
                          className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-lg py-6"
                          size="lg"
                        >
                          {submitQuoteMutation.isPending ? "Submitting..." : "Submit Quote"}
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
