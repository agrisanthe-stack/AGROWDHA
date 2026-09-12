import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearch, Link } from 'wouter';
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Category } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Package, Building2, Tag, TrendingDown, ShoppingCart, Truck } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useDistrict } from "@/hooks/use-district";
import { useAuth } from "@/hooks/use-auth";

interface FPOProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  unit: string;
  imageUrl: string | null;
  status: string;
  inventory: number;
  harvestDate: string;
  availableUntil: string;
  gradeVariety: string | null;
  b2cQuantity: number | null;
  b2bQuantity: number | null;
  b2cMoq: number | null;
  b2bMoq: number | null;
  hasSlabPricing: boolean;
  category: { id: number; name: string } | null;
  createdByDm: { id: number; fullName: string; district: string } | null;
  priceSlabs: Array<{
    id: number;
    minQuantity: number;
    maxQuantity: number | null;
    pricePerUnit: string;
    slabType: string;
  }>;
}

function formatIndianCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(num);
}

export default function FPOProducts() {
  const { t } = useTranslation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { selectedDistrictId } = useDistrict();
  const { user } = useAuth();
  const effectiveDistrictId = selectedDistrictId || user?.districtId || null;
  
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    staleTime: 60000,
  });
  
  const { data: products, isLoading, error } = useQuery<FPOProduct[]>({
    queryKey: ["/api/fpo-products", { search: searchTerm, category, deliveryDistrictId: effectiveDistrictId || undefined }],
    staleTime: 0,
    refetchOnMount: 'always',
  });
  
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (category !== "all") params.set("category", category);
    
    const newSearch = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${newSearch ? `?${newSearch}` : ""}`
    );
  }, [searchTerm, category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleAddToCart = (product: FPOProduct) => {
    const moq = product.b2cMoq || 1;
    addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      unit: product.unit,
      imageUrl: product.imageUrl || '',
      farmerId: 0,
      farmerName: product.createdByDm?.fullName || 'FPO Product',
      inventory: product.inventory,
      unitsPerBox: 1
    } as any, moq);
    
    toast({
      title: t('fpoProducts.addedToCart'),
      description: t('fpoProducts.addedToCartDesc', { quantity: moq, unit: product.unit, name: product.name }),
    });
  };

  return (
    <>
      <Helmet>
        <title>{t('fpoProducts.pageTitle')}</title>
        <meta name="description" content={t('fpoProducts.metaDescription')} />
        <link rel="canonical" href="https://farmersanthe.com/fpo-products" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">{t('fpoProducts.heading')}</h1>
          </div>
          <p className="text-gray-600">
            {t('fpoProducts.subtitle')}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder={t('fpoProducts.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t('fpoProducts.categoryPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('fpoProducts.allCategories')}</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {t('fpoProducts.search')}
            </Button>
          </form>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-32 sm:h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{t('fpoProducts.errorLoading')}</p>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {products.map((product) => {
              const b2cSlabs = product.priceSlabs?.filter(s => s.slabType === 'b2c') || [];
              const b2bSlabs = product.priceSlabs?.filter(s => s.slabType === 'b2b') || [];
              
              return (
                <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all border-2 border-green-200 bg-gradient-to-br from-white to-green-50">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-1/3">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 md:h-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                          <Building2 className="h-16 w-16 text-green-500" />
                        </div>
                      )}
                      
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold shadow-lg">
                          <Building2 className="h-3 w-3 mr-1" />
                          {t('fpoProducts.fpoProductBadge')}
                        </Badge>
                        {product.category && (
                          <Badge variant="secondary" className="bg-white/90">{product.category.name}</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                          {product.gradeVariety && (
                            <p className="text-sm text-green-600 font-medium">{product.gradeVariety}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-green-600">
                            {formatIndianCurrency(product.price)}
                          </span>
                          <span className="text-sm text-gray-500">/{product.unit}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
                      
                      {product.createdByDm && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3 bg-gray-100 rounded-lg px-3 py-2">
                          <Building2 className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{t('fpoProducts.districtHub', { district: product.createdByDm.district })}</span>
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-emerald-600" />
                              <span className="text-sm font-semibold text-emerald-700">Stock Available</span>
                            </div>
                            <p className="text-lg font-bold text-emerald-700">
                              {product.inventory || 0} {product.unit}
                            </p>
                          </div>
                          {b2bSlabs.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-emerald-200">
                              <p className="text-xs font-medium text-emerald-600 mb-1 flex items-center gap-1">
                                <Tag className="h-3 w-3" /> {t('fpoProducts.priceSlabs')}
                              </p>
                              {b2bSlabs.slice(0, 3).map((slab, idx) => (
                                <div key={idx} className="flex justify-between text-xs text-emerald-700">
                                  <span>{slab.minQuantity}{slab.maxQuantity ? `-${slab.maxQuantity}` : '+'} {product.unit}</span>
                                  <span className="font-semibold">{formatIndianCurrency(slab.pricePerUnit)}/{product.unit}</span>
                                </div>
                              ))}
                              {b2bSlabs.length > 3 && (
                                <p className="text-xs text-emerald-500 mt-1">{t('fpoProducts.moreSlabs', { count: b2bSlabs.length - 3 })}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2 mb-3 text-sm">
                        <Truck className="h-4 w-4 text-green-600" />
                        <span className="text-green-700 font-medium">
                          {t('fpoProducts.delivery')} {(() => {
                            const harvestDate = product.harvestDate ? new Date(product.harvestDate) : null;
                            const today = new Date();
                            if (product.status === 'Pre-Order' && harvestDate && harvestDate > today) {
                              const delivery = new Date(harvestDate.getTime() + 86400000);
                              return delivery.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                            }
                            const tomorrow = new Date(today.getTime() + 86400000);
                            return tomorrow.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                          })()}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/fpo-products/${product.id}`} className="flex-1">
                          <Button className="w-full bg-green-600 hover:bg-green-700">
                            {t('fpoProducts.viewDetailsOrder')}
                          </Button>
                        </Link>
                        <Button 
                          onClick={() => handleAddToCart(product)}
                          variant="outline"
                          className="border-green-600 text-green-600 hover:bg-green-50"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('fpoProducts.noProducts')}</h3>
            <p className="text-gray-500">{t('fpoProducts.noProductsDesc')}</p>
          </div>
        )}
      </div>
    </>
  );
}
