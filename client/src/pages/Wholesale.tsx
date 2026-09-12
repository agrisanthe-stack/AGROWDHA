import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from 'wouter';
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { Product, Category } from "@/lib/types";
import type { District } from "@shared/schema.ts";
import ProductCard from "@/components/products/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useDistrict } from "@/hooks/use-district";
import { Package, Truck, BadgeCheck, TrendingDown } from "lucide-react";

export default function Wholesale() {
  const auth = useAuth();
  const user = auth?.user;
  const { selectedDistrictId } = useDistrict();
  const { t } = useTranslation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";
  const initialAvailability = searchParams.get("availability") || "all";
  const initialDistrict = searchParams.get("districtId") || "all";
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [availability, setAvailability] = useState(initialAvailability);
  const [districtId, setDistrictId] = useState(initialDistrict);
  const [certification, setCertification] = useState("all");
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    staleTime: 60000,
  });
  
  const { data: districts } = useQuery<District[]>({
    queryKey: ["/api/districts"],
    staleTime: 60000,
  });

  const effectiveDistrictId = selectedDistrictId || user?.districtId || null;

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: [
      "/api/products",
      { search: searchTerm, category, availability, districtId, b2bMode: 'true', deliveryDistrictId: effectiveDistrictId || undefined }
    ],
    staleTime: 0,
    refetchOnMount: 'always',
  });
  
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (category !== "all") params.set("category", category);
    if (availability !== "all") params.set("availability", availability);
    if (districtId !== "all") params.set("districtId", districtId);
    
    const newSearch = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${newSearch ? `?${newSearch}` : ""}`
    );
  }, [searchTerm, category, availability, districtId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <Helmet>
        <title>{t('wholesale.title')}</title>
        <meta name="description" content={t('wholesale.metaDescription')} />
        <meta name="keywords" content={t('wholesale.metaKeywords')} />
        <link rel="canonical" href="https://farmersanthe.com/wholesale" />
        
        <meta property="og:title" content={t('wholesale.ogTitle')} />
        <meta property="og:description" content={t('wholesale.ogDescription')} />
        <meta property="og:image" content="https://farmersanthe.com/logo-santhe.png" />
        <meta property="og:url" content="https://farmersanthe.com/wholesale" />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('wholesale.twitterTitle')} />
        <meta name="twitter:description" content={t('wholesale.twitterDescription')} />
        <meta name="twitter:image" content="https://farmersanthe.com/logo-santhe.png" />
        
        <meta name="robots" content="index, follow" />
        <meta name="geo.region" content="IN-KA" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": t('wholesale.schemaName'),
            "description": t('wholesale.schemaDescription'),
            "url": "https://farmersanthe.com/wholesale",
            "mainEntity": {
              "@type": "ItemList",
              "name": t('wholesale.schemaItemListName'),
              "description": t('wholesale.schemaItemListDescription')
            }
          })}
        </script>
      </Helmet>
      
      <section className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4 sm:mb-6">
              <Package className="h-7 w-7 sm:h-10 sm:w-10" />
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">{t('wholesale.heroTitle')}</h1>
            <p className="text-sm sm:text-xl text-orange-100 max-w-3xl mx-auto mb-4 sm:mb-8">
              {t('wholesale.heroDescription')}
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full">
                <Package className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                <span>{t('wholesale.volumePricing')}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full">
                <TrendingDown className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                <span>{t('wholesale.bulkDiscounts')}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full">
                <Truck className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                <span>{t('wholesale.directSourcing')}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full">
                <BadgeCheck className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                <span>{t('wholesale.qualityAssured')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border p-3 sm:p-4 mb-6 sm:mb-8">
            <form 
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row gap-3 items-stretch md:items-center"
            >
              <Input
                type="text"
                placeholder={t('wholesale.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64"
              />
            
              <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
                <Select 
                  value={category} 
                  onValueChange={setCategory}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder={t('wholesale.categoryPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('wholesale.allCategories')}</SelectItem>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select 
                  value={availability} 
                  onValueChange={setAvailability}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder={t('wholesale.availabilityPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('wholesale.availabilityAll')}</SelectItem>
                    <SelectItem value="available">{t('wholesale.availableNow')}</SelectItem>
                    <SelectItem value="pre-order">{t('wholesale.preOrder')}</SelectItem>
                    <SelectItem value="coming-soon">{t('wholesale.comingSoon')}</SelectItem>
                  </SelectContent>
                </Select>

                <Select 
                  value={certification} 
                  onValueChange={setCertification}
                >
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder="Certification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="organic">🌿 Organic Farm</SelectItem>
                    <SelectItem value="natural">🍃 Natural Farm</SelectItem>
                  </SelectContent>
                </Select>

                <Button type="submit" className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto">{t('wholesale.filter')}</Button>
              </div>
          </form>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
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
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <Skeleton className="h-6 w-6 rounded-full mr-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{t('wholesale.errorLoading')}</p>
          </div>
        ) : (() => {
          const filteredProducts = (products || []).filter((product) => {
            if (certification === "organic") return (product.farm as any)?.isOrganicCertified;
            if (certification === "natural") return (product.farm as any)?.isNaturalCertified;
            return true;
          });
          return filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} displayMode="b2b" />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">{t('wholesale.noProducts')}</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchTerm("");
                  setCategory("all");
                  setAvailability("all");
                  setDistrictId("all");
                  setCertification("all");
                }}
              >
                {t('wholesale.clearFilters')}
              </Button>
            </div>
          );
        })()}
        </div>
      </div>
    </>
  );
}
