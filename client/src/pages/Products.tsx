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
import { ShoppingBasket, Truck, BadgeCheck, Leaf } from "lucide-react";

export default function Products() {
  const auth = useAuth();
  const user = auth?.user;
  const { selectedDistrictId, selectedDistrictName } = useDistrict();
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
    staleTime: 60000, // Categories don't change often, 1 minute stale time
  });
  
  const { data: districts } = useQuery<District[]>({
    queryKey: ["/api/districts"],
    staleTime: 60000, // Districts don't change often, 1 minute stale time
  });
  
  // Build query parameters - use selectedDistrictId from context (covers both logged-in and guest users)
  const effectiveDistrictId = selectedDistrictId ?? user?.districtId ?? null;
  const queryParams = new URLSearchParams();
  if (searchTerm) queryParams.set("search", searchTerm);
  if (category !== "all") queryParams.set("category", category);
  if (availability !== "all") queryParams.set("availability", availability);
  if (districtId !== "all") queryParams.set("districtId", districtId);
  if (effectiveDistrictId) queryParams.set("deliveryDistrictId", String(effectiveDistrictId));

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: [
      "/api/products",
      { search: searchTerm, category, availability, districtId, deliveryDistrictId: effectiveDistrictId || undefined }
    ],
    staleTime: 0,
    refetchOnMount: 'always',
  });
  
  // Update URL when filters change
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
        <title>Fresh Seasonal Produce | Buy Direct from Farmers | FarmerSanthe.com</title>
        <meta name="description" content="Browse fresh, seasonal produce directly from local farmers. Pre-order organic fruits, vegetables, and farm products with guaranteed freshness and transparent pricing." />
        <meta name="keywords" content="fresh produce, seasonal fruits, organic vegetables, farm products, direct from farmer, buy online, fresh fruits, local produce, seasonal vegetables" />
        <link rel="canonical" href="https://farmersanthe.com/products" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Fresh Seasonal Produce | Buy Direct from Farmers | FarmerSanthe.com" />
        <meta property="og:description" content="Browse fresh, seasonal produce directly from local farmers. Pre-order organic fruits, vegetables, and farm products with guaranteed freshness." />
        <meta property="og:image" content="https://farmersanthe.com/logo-santhe.png" />
        <meta property="og:url" content="https://farmersanthe.com/products" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fresh Seasonal Produce | Buy Direct from Farmers" />
        <meta name="twitter:description" content="Browse fresh, seasonal produce directly from local farmers. Pre-order with guaranteed freshness." />
        <meta name="twitter:image" content="https://farmersanthe.com/logo-santhe.png" />
        
        <meta name="robots" content="index, follow" />
        <meta name="geo.region" content="IN-KA" />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Seasonal Produce Marketplace",
            "description": "Fresh seasonal produce directly from local farmers",
            "url": "https://farmersanthe.com/products",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Fresh Produce",
              "description": "Seasonal fruits, vegetables and farm products"
            }
          })}
        </script>
      </Helmet>
      
      {/* Hero Banner Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-6 sm:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full mb-3 sm:mb-6">
              <ShoppingBasket className="h-6 w-6 sm:h-10 sm:w-10" />
            </div>
            <h1 className="text-2xl md:text-5xl font-bold mb-2 sm:mb-4">{t('products.heroTitle')}</h1>
            <p className="text-sm sm:text-xl text-green-100 max-w-3xl mx-auto mb-4 sm:mb-8">
              {t('products.heroDesc')}
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full">
                <ShoppingBasket className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                <span>{t('products.boxSales')}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full">
                <Truck className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                <span>{t('products.homeDelivery')}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full">
                <Leaf className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                <span>{t('products.farmFresh')}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full">
                <BadgeCheck className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                <span>{t('products.qualityAssured')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters Section */}
          <div className="bg-white rounded-xl shadow-sm border p-4 mb-8">
            <form 
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row gap-3 items-center"
            >
              <Input
                type="text"
                placeholder={t('products.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64"
              />
            
            <Select 
              value={category} 
              onValueChange={setCategory}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
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
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="available">Available Now</SelectItem>
                <SelectItem value="pre-order">Pre-Order</SelectItem>
                <SelectItem value="coming-soon">Coming Soon</SelectItem>
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
            
            <Button type="submit">Filter</Button>
          </form>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="h-32 sm:h-48 w-full" />
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
            <p className="text-red-500">Error loading products</p>
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
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No products found matching your criteria.</p>
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
                Clear filters
              </Button>
            </div>
          );
        })()}
        </div>
      </div>
    </>
  );
}
