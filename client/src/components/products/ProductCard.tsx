import { Link } from "wouter";
import { Product, ProductImage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatIndianCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ImageIcon, Truck, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { createProductSlug } from "@/lib/slugs";
import { FarmerBadge } from "@/components/AIFarmerBadge";
import { useDeliveryPrice } from "@/hooks/use-delivery-price";
import { Skeleton } from "@/components/ui/skeleton";

interface PriceSlab {
  id: number;
  minQuantity: number;
  maxQuantity: number | null;
  pricePerUnit: string;
  slabType: string;
}

interface ProductCardProps {
  product: Product;
  displayMode?: 'regular' | 'b2b';
  orgSlug?: string;
}

export default function ProductCard({ product, displayMode = 'regular', orgSlug }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [farmLogoError, setFarmLogoError] = useState(false);
  
  // Fetch additional product images
  const { data: productImages } = useQuery<ProductImage[]>({
    queryKey: [`/api/products/${product.id}/images`],
    enabled: !!product.id,
  });

  // Fetch price slabs for B2B products
  const { data: priceSlabs } = useQuery<PriceSlab[]>({
    queryKey: [`/api/products/${product.id}/price-slabs`],
    enabled: displayMode === 'b2b' && (product as any).hasSlabPricing,
  });

  // Get B2B slabs only
  const b2bSlabs = priceSlabs?.filter(slab => slab.slabType === 'b2b') || [];
  const isNewB2BProduct = (product as any).b2bQuantity > 0;

  // Delivery fee for this product (1 box for B2C, MOQ for B2B)
  const b2bMoqCard = (product as any).b2bMoq || 1;
  const deliveryQty = displayMode === 'b2b' ? b2bMoqCard : 1;
  const { fee: deliveryFee, deliverable, hasFpo, districtName: deliveryDistrict, isLoading: deliveryLoading } = useDeliveryPrice(product, deliveryQty, displayMode === 'b2b');
  // Client-side hint: product likely has FPO if createdByDmId or fpo-approved — avoids skeleton flicker on non-FPO products
  const productLikelyHasFpo = !!(product as any).createdByDmId || (product.approvalType === 'fpo' && !!product.approvedByUserId);

  // Combine main product image with additional images
  const allImages = [
    ...(product.imageUrl ? [{ imageUrl: product.imageUrl, isPrimary: true }] : []),
    ...(productImages || [])
  ];

  // Check if product has multiple images
  const hasMultipleImages = allImages.length > 1;

  // Auto-advance slides every 3 seconds if there are multiple images
  useEffect(() => {
    if (hasMultipleImages) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [hasMultipleImages, allImages.length]);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const goToImage = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };
  
  // Compute effective status — if harvest date has passed, treat pre-order as available
  const effectiveStatus = (() => {
    if (product.status === 'Pre-Order' && (product.harvestDate || product.harvestMonth)) {
      const harvestDate = new Date(product.harvestDate || product.harvestMonth || '');
      if (!isNaN(harvestDate.getTime()) && harvestDate <= new Date()) {
        return 'Available Now';
      }
    }
    return product.status;
  })();

  // Calculate delivery date based on product status
  const getDeliveryDate = (): Date => {
    const today = new Date();
    
    if (effectiveStatus === 'Pre-Order') {
      // For pre-order: day after harvest date
      const harvestDate = product.harvestDate 
        ? new Date(product.harvestDate) 
        : (product.harvestMonth ? new Date(product.harvestMonth) : new Date());
      
      // Add one day to harvest date
      const deliveryDate = new Date(harvestDate);
      deliveryDate.setDate(deliveryDate.getDate() + 1);
      return deliveryDate;
    } else {
      // For Available Now: next day delivery (tomorrow)
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    }
  };
  
  const deliveryDate = getDeliveryDate();
  
  // Create SEO-friendly slug for the product
  const productSlug = createProductSlug(
    product.id, 
    product.name, 
    typeof product.category === 'string' ? product.category : product.category?.name
  );

  const baseProductPath = orgSlug ? `/org/${orgSlug}/products/${productSlug}` : `/products/${productSlug}`;
  const productLink = displayMode === 'b2b' ? `${baseProductPath}?mode=b2b` : baseProductPath;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition h-full flex flex-col">
      <Link href={productLink} className="flex flex-col h-full">
        <div className="h-32 sm:h-48 overflow-hidden relative group">
          {/* Current Image */}
          <img 
            src={allImages[currentImageIndex]?.imageUrl || product.imageUrl || ''} 
            alt={product.name} 
            className="w-full h-full object-cover transition-opacity duration-300" 
          />
          
          {/* Navigation arrows (show on hover) */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
          
          {/* Photo count badge */}
          {hasMultipleImages && (
            <Badge variant="secondary" className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 text-white hover:bg-black/80">
              <ImageIcon className="h-3 w-3" />
              <span>{allImages.length} photos</span>
            </Badge>
          )}
          
          {/* Dots indicator */}
          {hasMultipleImages && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => goToImage(index, e)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex 
                      ? 'bg-white' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        <div className="p-2 sm:p-4 flex flex-col flex-grow">
          {/* Product Name & Status Badges */}
          <div className="flex justify-between items-start mb-1 sm:mb-3">
            <h3 className="text-sm sm:text-lg font-semibold text-gray-900 leading-tight line-clamp-1">{product.name}</h3>
            <div className="flex flex-col gap-1 flex-shrink-0 ml-2">
              {displayMode === 'regular' && (product.inventory || 0) <= 0 ? (
                <span className="text-xs px-2 py-1 rounded-full font-medium bg-red-100 text-red-800">
                  Sold Out
                </span>
              ) : effectiveStatus === 'Pre-Order' ? (
                <span className="text-xs px-2 py-1 rounded-full font-medium status-preorder">
                  Pre-Order
                </span>
              ) : (
                <span className="text-xs px-2 py-1 rounded-full font-medium status-available">
                  Available Now
                </span>
              )}
            </div>
          </div>
          
          {/* Price & Quantity Section */}
          <div className={`rounded-lg p-2 sm:p-3 mb-2 sm:mb-3 ${displayMode === 'b2b' ? 'bg-emerald-50 border border-emerald-200' : 'bg-green-50 border border-green-200'}`}>
            {displayMode === 'b2b' && isNewB2BProduct ? (
              // New B2B product with slab pricing
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-700 uppercase">Wholesale</span>
                </div>
                
                {/* B2B Stock — shared inventory pool with retail */}
                <div className={`flex items-center justify-center py-1.5 rounded-md font-semibold text-sm mb-2 ${(product.inventory || 0) <= 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {(product.inventory || 0) <= 0 ? (
                    <span>Out of Stock</span>
                  ) : (
                    <span>{product.inventory} {product.unit} Available</span>
                  )}
                </div>

                {/* Volume Pricing Tiers - show max 3 on card */}
                {b2bSlabs.length > 0 ? (
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500 font-medium">Volume Pricing:</div>
                    {b2bSlabs.slice(0, 3).map((slab) => (
                      <div key={slab.id} className="flex justify-between text-xs bg-white rounded px-2 py-1 border border-emerald-100">
                        <span className="text-gray-600">
                          {slab.minQuantity}{slab.maxQuantity ? `-${slab.maxQuantity}` : '+'} {product.unit}
                        </span>
                        <span className="font-semibold text-emerald-700">
                          {formatIndianCurrency(slab.pricePerUnit)}/{product.unit}
                        </span>
                      </div>
                    ))}
                    {b2bSlabs.length > 3 && (
                      <div className="text-xs text-emerald-600 font-medium text-center pt-0.5">
                        +{b2bSlabs.length - 3} more tier{b2bSlabs.length - 3 > 1 ? 's' : ''} — view details
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <span className="text-lg font-bold text-emerald-700">{formatIndianCurrency(product.price)}</span>
                    <span className="text-gray-600 text-sm ml-1">per {product.unit}</span>
                  </div>
                )}
              </div>
            ) : (
              // Regular B2C product
              <>
                <div className="flex items-baseline justify-between mb-1">
                  <div>
                    <span className="text-lg sm:text-2xl font-bold text-green-700">{formatIndianCurrency(product.price)}</span>
                    <span className="text-gray-600 text-sm ml-1">/box</span>
                  </div>
                </div>
                {(() => {
                  const upb = parseFloat(String(product.unitsPerBox || 0));
                  if (upb > 0) {
                    const display = upb % 1 === 0 ? upb.toString() : upb.toFixed(2).replace(/\.?0+$/, '');
                    return (
                      <div className="text-xs text-gray-500 mb-2">
                        <Package className="h-3 w-3 inline mr-1 text-gray-400" />
                        {display} {product.unit} per box
                      </div>
                    );
                  }
                  return <div className="mb-2" />;
                })()}
                <div className={`flex items-center justify-center py-1.5 rounded-md font-semibold text-sm ${(product.inventory || 0) <= 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {(product.inventory || 0) <= 0 ? (
                    <span>Out of Stock</span>
                  ) : (
                    <span>{product.inventory} {product.unit} In Stock</span>
                  )}
                </div>
              </>
            )}
          </div>
          
          {/* Key Dates - Clean Layout */}
          <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-3 text-xs sm:text-sm hidden sm:block">
            {displayMode === 'b2b' && isNewB2BProduct ? (
              // New B2B product - show harvest, available until, and grade
              <>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Harvest/Ready:</span>
                  <span className="font-medium text-gray-800">{formatDate(product.harvestDate || product.harvestMonth || '')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Available Until:</span>
                  <span className="font-medium text-emerald-700">{formatDate(product.availableUntil)}</span>
                </div>
                {(product as any).gradeVariety && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Grade:</span>
                    <span className="font-medium text-gray-800">{(product as any).gradeVariety}</span>
                  </div>
                )}
                <div className="flex items-center bg-green-50 rounded px-2 py-1.5">
                  <Truck className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-gray-600 text-xs">Delivery:</span>
                  <span className="font-semibold text-green-700 ml-1 text-xs">{formatDate(deliveryDate)}</span>
                </div>
                {productLikelyHasFpo && deliveryLoading && (
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                )}
                {!deliveryLoading && hasFpo && deliverable && deliveryFee !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Delivery{deliveryDistrict ? ` to ${deliveryDistrict}` : ""}:</span>
                    <span className="font-semibold text-blue-700 text-xs">
                      {deliveryFee === 0 ? "Free delivery" : formatIndianCurrency(deliveryFee)}
                    </span>
                  </div>
                )}
                {!deliveryLoading && hasFpo && !deliverable && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Delivery:</span>
                    <span className="text-xs text-red-600 font-medium">Not available to your district</span>
                  </div>
                )}
              </>
            ) : (
              // Regular product
              <>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Available Until:</span>
                  <span className="font-medium text-gray-800">{formatDate(product.availableUntil)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Harvest/Ready:</span>
                  <span className="font-medium text-gray-800">{formatDate(product.harvestDate || product.harvestMonth || '')}</span>
                </div>
                <div className="flex items-center bg-green-50 rounded px-2 py-1.5">
                  <Truck className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-gray-600 text-xs">Delivery:</span>
                  <span className="font-semibold text-green-700 ml-1 text-xs">{formatDate(deliveryDate)}</span>
                </div>
                {productLikelyHasFpo && deliveryLoading && (
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                )}
                {!deliveryLoading && hasFpo && deliverable && deliveryFee !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Delivery{deliveryDistrict ? ` to ${deliveryDistrict}` : ""}:</span>
                    <span className="font-semibold text-blue-700 text-xs">
                      {deliveryFee === 0 ? "Free delivery" : formatIndianCurrency(deliveryFee)}
                    </span>
                  </div>
                )}
                {!deliveryLoading && hasFpo && !deliverable && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Delivery:</span>
                    <span className="text-xs text-red-600 font-medium">Not available to your district</span>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Delivery date + fee - mobile only compact */}
          <div className="sm:hidden flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center bg-green-50 rounded px-1.5 py-1 flex-1">
              <Truck className="h-3 w-3 text-green-600 mr-1" />
              <span className="font-semibold text-green-700 text-[10px]">{formatDate(deliveryDate)}</span>
            </div>
            {productLikelyHasFpo && deliveryLoading && (
              <Skeleton className="h-5 w-20 rounded" />
            )}
            {!deliveryLoading && hasFpo && deliverable && deliveryFee !== null && (
              <div className="bg-blue-50 rounded px-1.5 py-1">
                <span className="font-semibold text-blue-700 text-[10px]">
                  {deliveryFee === 0 ? `Free delivery${deliveryDistrict ? ` to ${deliveryDistrict}` : ""}` : `+${formatIndianCurrency(deliveryFee)}${deliveryDistrict ? ` to ${deliveryDistrict}` : ""}`}
                </span>
              </div>
            )}
            {!deliveryLoading && hasFpo && !deliverable && (
              <div className="bg-red-50 rounded px-1.5 py-1">
                <span className="text-[10px] text-red-600 font-medium">Not in your district</span>
              </div>
            )}
          </div>
          
          {/* Badges Row */}
          <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
            {product.approvalStatus === 'approved' && product.approvalType && (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                product.approvalType === 'fpo' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {product.approvalType === 'fpo' ? 'FPO Approved' : 'Admin approved'}
              </span>
            )}
          </div>
          
          {/* Farm Info */}
          {product.farm?.name && (
            <div className="mb-2 sm:mb-3 space-y-1">
              {/* Farmer row (amber) */}
              <div className={`border rounded-lg p-1.5 sm:p-2 ${(product.farm as any)?.isFpoDirect ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-center">
                  {product.farm.logoUrl && !farmLogoError ? (
                    <img 
                      src={product.farm.logoUrl} 
                      alt={product.farm.name} 
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-1.5 sm:mr-2 flex-shrink-0 object-cover border-2 ${(product.farm as any)?.isFpoDirect ? 'border-blue-300' : 'border-amber-300'}`}
                      onError={() => setFarmLogoError(true)}
                    />
                  ) : (
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-1.5 sm:mr-2 flex-shrink-0 border-2 flex items-center justify-center text-white font-bold text-xs ${(product.farm as any)?.isFpoDirect ? 'border-blue-300 bg-gradient-to-br from-blue-400 to-indigo-500' : 'border-amber-300 bg-gradient-to-br from-green-400 to-emerald-500'}`}>
                      {product.farm.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-gray-500 leading-none mb-0.5">{(product.farm as any)?.isFpoDirect ? 'FPO' : 'Farm'}</div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-800 truncate leading-tight">{product.farm.name}</div>
                  </div>
                  {(product.farm as any)?.isOrganicCertified && (
                    <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-medium flex-shrink-0">
                      Organic
                    </div>
                  )}
                  {!(product.farm as any)?.isOrganicCertified && (product.farm as any)?.isNaturalCertified && (
                    <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-[10px] font-medium flex-shrink-0">
                      Natural
                    </div>
                  )}
                </div>
              </div>

              {/* FPO row — only for farmer products approved/sold via an FPO (not FPO-direct) */}
              {product.fpo?.orgName && !(product.farm as any)?.isFpoDirect && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-1.5 sm:p-2">
                  <div className="flex items-center">
                    {product.fpo.orgLogoUrl ? (
                      <img
                        src={product.fpo.orgLogoUrl}
                        alt={product.fpo.orgName}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-1.5 sm:mr-2 flex-shrink-0 border-2 border-blue-300 object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-1.5 sm:mr-2 flex-shrink-0 border-2 border-blue-300 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                        {product.fpo.orgName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] text-gray-500 leading-none mb-0.5">Sold via FPO</div>
                      <div className="text-xs sm:text-sm font-semibold text-blue-800 truncate leading-tight">{product.fpo.orgName}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* View Details Button */}
          <div className="mt-auto">
            <Button 
              variant="outline"
              size="sm"
              className="w-full border-green-600 text-green-700 hover:bg-green-50 rounded-lg py-2"
            >
              View Details
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}
