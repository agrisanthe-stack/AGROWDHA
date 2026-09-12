import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from 'wouter';
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Farmer } from "@/lib/types";
import type { District } from "@shared/schema.ts";
import FarmerCard from "@/components/farmers/FarmerCard";
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
import { Users, MapPin, Leaf, Award } from "lucide-react";

export default function Farmers() {
  const { t } = useTranslation();
  const auth = useAuth();
  const user = auth?.user;
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  
  const initialSearch = searchParams.get("search") || "";
  const initialTag = searchParams.get("tag") || "all";
  const initialDistrict = searchParams.get("districtId") || "all";
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [tag, setTag] = useState(initialTag);
  const [districtId, setDistrictId] = useState(initialDistrict);
  
  const { data: tags } = useQuery<string[]>({
    queryKey: ["/api/farmers/tags"],
    staleTime: 60000, // Tags don't change often
  });
  
  const { data: districts } = useQuery<District[]>({
    queryKey: ["/api/districts"],
    staleTime: 60000, // Districts don't change often
  });
  
  const { data: farmers, isLoading, error } = useQuery<Farmer[]>({
    queryKey: [
      "/api/farmers",
      { search: searchTerm, tag, districtId }
    ],
    staleTime: 0,
    refetchOnMount: 'always',
  });
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (tag !== "all") params.set("tag", tag);
    if (districtId !== "all") params.set("districtId", districtId);
    
    const newSearch = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${newSearch ? `?${newSearch}` : ""}`
    );
  }, [searchTerm, tag, districtId]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <Helmet>
        <title>Local Farmers Near You | FarmerSanthe.com</title>
        <meta name="description" content="Discover local farmers in your area offering fresh, seasonal produce. Connect directly with farmers, view their specialties, and pre-order fresh produce from farms near you." />
        <meta name="keywords" content="local farmers, nearby farms, fresh produce farmers, organic farmers, seasonal farmers, farm directory, local agriculture" />
        <link rel="canonical" href="https://farmersanthe.com/farmers" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Local Farmers Near You | FarmerSanthe.com" />
        <meta property="og:description" content="Discover local farmers in your area offering fresh, seasonal produce. Connect directly with farmers and pre-order fresh produce." />
        <meta property="og:image" content="https://farmersanthe.com/logo-santhe.png" />
        <meta property="og:url" content="https://farmersanthe.com/farmers" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Local Farmers Near You | FarmerSanthe.com" />
        <meta name="twitter:description" content="Discover local farmers in your area offering fresh, seasonal produce." />
        <meta name="twitter:image" content="https://farmersanthe.com/logo-santhe.png" />
        
        <meta name="robots" content="index, follow" />
        <meta name="geo.region" content="IN-KA" />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Local Farmers Directory",
            "description": "Find and connect with local farmers in your area",
            "url": "https://farmersanthe.com/farmers",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Local Farmers",
              "description": "Directory of local farmers offering fresh produce"
            }
          })}
        </script>
      </Helmet>
      
      {/* Hero Banner Section */}
      <section className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-6 sm:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full mb-3 sm:mb-6">
              <Users className="h-6 w-6 sm:h-10 sm:w-10" />
            </div>
            <h1 className="text-2xl md:text-5xl font-bold mb-2 sm:mb-4">{t('farmers.heroTitle')}</h1>
            <p className="text-sm sm:text-xl text-amber-100 max-w-3xl mx-auto mb-4 sm:mb-8">
              {t('farmers.heroDesc')}
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full">
                <Users className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                <span>{t('farmers.localFarmers')}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full">
                <MapPin className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                <span>{t('farmers.nearYou')}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full">
                <Leaf className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                <span>{t('farmers.organicPractices')}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full">
                <Award className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                <span>Organic &amp; Natural Certified</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters Section */}
          <div className="bg-white rounded-xl shadow-sm border p-4 mb-8">
            <form 
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row gap-3 items-center"
            >
              <Input
                type="text"
                placeholder={t('farmers.searchFarms')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64"
              />
            
            <Select 
              value={tag} 
              onValueChange={setTag}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={t('farmers.specialty')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('farmers.allSpecialties')}</SelectItem>
                {tags?.filter(t => t && t.trim() !== "").map((t, i) => (
                  <SelectItem key={i} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={districtId} 
              onValueChange={setDistrictId}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={t('farmers.allDistricts')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('farmers.allDistricts')}</SelectItem>
                {districts?.map((dist) => (
                  <SelectItem key={dist.id} value={dist.id.toString()}>
                    {dist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button type="submit">{t('farmers.filter')}</Button>
          </form>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-8">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="h-32 sm:h-60 w-full" />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Skeleton className="h-6 w-40 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center">
                      <Skeleton className="h-4 w-6 mr-1" />
                      <div className="flex">
                        {Array(5).fill(0).map((_, j) => (
                          <Skeleton key={j} className="h-3 w-3 mx-px" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Array(3).fill(0).map((_, j) => (
                      <Skeleton key={j} className="h-6 w-16 rounded-full" />
                    ))}
                  </div>
                  <Skeleton className="h-5 w-36" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{t('farmers.errorLoading')}</p>
          </div>
        ) : farmers && farmers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-8">
            {farmers.map((farmer) => (
              <FarmerCard key={farmer.id} farmer={farmer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No farmers found matching your criteria.</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearchTerm("");
                setTag("all");
                setDistrictId("all");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
        </div>
      </div>
    </>
  );
}
