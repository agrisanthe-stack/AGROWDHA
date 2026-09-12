import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { useDistrict } from "@/hooks/use-district";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import ProductCard from "@/components/products/ProductCard";
import { Product, CalendarEntry } from "@/lib/types";
import {
  Leaf,
  MapPin,
  Star,
  ChevronRight,
  Store,
  Users,
  Award,
  CheckCircle2,
  Mail,
  Phone,
  MessageSquare,
  BadgeCheck,
  Globe,
  Zap,
  TrendingUp,
  Building2,
  Calendar,
  Package,
  Sprout,
  Truck,
  ArrowRight,
  Shield,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WE = {
  sand: "#F5E6C8",
  cream: "#FDF8F0",
  brown: "#4A2C17",
  terra: "#C4622D",
  ochre: "#D4A017",
  dark: "#2D1B0E",
} as const;

const warmShadow = "0 10px 25px -5px rgba(212,160,23,0.2), 0 8px 10px -6px rgba(212,160,23,0.1)";

function SectionHeader({
  badge,
  title,
  subtitle,
  dark = false,
}: {
  badge: React.ReactNode;
  title: React.ReactNode;
  subtitle: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-10 sm:mb-14 text-center">
      <div
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full mb-4 border"
        style={{
          background: dark ? "rgba(212,160,23,0.15)" : "rgba(212,160,23,0.12)",
          borderColor: dark ? "rgba(212,160,23,0.4)" : "rgba(196,98,45,0.3)",
          color: dark ? WE.ochre : WE.terra,
        }}
      >
        {badge}
      </div>
      <h2
        className="text-2xl sm:text-4xl font-black mb-3 leading-tight"
        style={{ color: dark ? WE.cream : WE.brown }}
      >
        {title}
      </h2>
      <p
        className="text-sm sm:text-lg max-w-2xl mx-auto"
        style={{ color: dark ? `${WE.sand}cc` : `${WE.brown}bb` }}
      >
        {subtitle}
      </p>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const { selectedDistrictId } = useDistrict();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [inquiryForm, setInquiryForm] = useState({
    orgName: "", contactName: "", email: "", phone: "", district: "", message: "",
  });
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const inquiryMutation = useMutation({
    mutationFn: async (data: typeof inquiryForm) => {
      const res = await apiRequest("POST", "/api/fpo-inquiry", data);
      return res.json();
    },
    onSuccess: () => {
      setInquirySubmitted(true);
      setInquiryForm({ orgName: "", contactName: "", email: "", phone: "", district: "", message: "" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to submit. Please try again.", variant: "destructive" });
    },
  });

  const { data: allDistricts = [] } = useQuery<{ id: number; name: string }[]>({
    queryKey: ["/api/districts"],
    staleTime: 5 * 60 * 1000,
  });

  const effectiveDistrictId = selectedDistrictId || user?.districtId || null;

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products", { featured: "true", limit: "6", deliveryDistrictId: effectiveDistrictId || undefined }],
    staleTime: 0,
    refetchOnMount: "always",
  });

  const { data: wholesaleProducts } = useQuery<Product[]>({
    queryKey: ["/api/products", { b2bMode: "true", limit: "6", deliveryDistrictId: effectiveDistrictId || undefined }],
    staleTime: 0,
    refetchOnMount: "always",
  });

  interface FpoStore {
    id: number;
    orgName: string;
    orgSlug: string;
    orgLogoUrl: string;
    district: string;
    organicCertifiedCount?: number;
    totalFarmers?: number;
    followerCount?: number;
  }

  const { data: fpoStores } = useQuery<FpoStore[]>({
    queryKey: ["/api/orgs"],
    staleTime: 0,
    refetchOnMount: "always",
  });

  const nunito: React.CSSProperties = { fontFamily: "'Nunito', sans-serif" };

  return (
    <>
      <Helmet>
        <title>FarmerSanthe.com | Direct Farm to Table Marketplace | AI powered NF recommendation</title>
        <meta name="description" content="Connect directly with local farmers for fresh, seasonal produce with AI-powered NF recommendations. Pre-order from farms near you with transparent pricing and guaranteed freshness. Supporting sustainable agriculture in India." />
        <meta name="keywords" content="farm to table, local farmers, fresh produce, organic vegetables, seasonal fruits, sustainable agriculture, direct from farm, India marketplace, AI powered NF, natural farming" />
        <link rel="canonical" href="https://farmersanthe.com/" />
        <meta property="og:title" content="FarmerSanthe.com | Direct Farm to Table Marketplace | AI powered NF recommendation" />
        <meta property="og:description" content="Connect directly with local farmers for fresh, seasonal produce with AI-powered NF recommendations." />
        <meta property="og:image" content="https://farmersanthe.com/logo-santhe.png" />
        <meta property="og:url" content="https://farmersanthe.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="FarmerSanthe" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FarmerSanthe.com | Direct Farm to Table Marketplace | AI powered NF recommendation" />
        <meta name="twitter:description" content="Connect directly with local farmers for fresh, seasonal produce with AI-powered NF recommendations." />
        <meta name="twitter:image" content="https://farmersanthe.com/logo-santhe.png" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Samskruti Agro Tech Private Limited" />
        <meta name="geo.region" content="IN-KA" />
        <meta name="geo.placename" content="Bangalore, Karnataka, India" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "FarmerSanthe",
            "url": "https://farmersanthe.com",
            "description": "Direct Farm to Table Marketplace with AI-powered NF recommendations",
            "publisher": {
              "@type": "Organization",
              "name": "Samskruti Agro Tech Private Limited",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "1529, 15th main, M.C.Layout, Vijaynagar",
                "addressLocality": "Bangalore",
                "addressRegion": "Karnataka",
                "postalCode": "560040",
                "addressCountry": "IN",
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-80882-40775",
                "email": "admin@farmersanthe.com",
                "contactType": "customer service",
              },
            },
          })}
        </script>
      </Helmet>

      <div style={{ ...nunito, background: WE.sand }}>

        {/* ── FPO Stores Hero ─────────────────────────────────── */}
        <section style={{ background: WE.cream }} className="py-14 sm:py-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">

            {/* Hero headline — centred */}
            <div className="text-center mb-10">
              <h1
                className="text-3xl sm:text-5xl font-black leading-tight mb-4"
                style={{ color: WE.brown }}
              >
                From Our Villages to You
              </h1>
              <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: `${WE.brown}bb` }}>
                Discover Farmer Producer Organizations selling authentic, naturally grown staples — direct, fair, and traceable.
              </p>
              <div className="flex flex-wrap justify-center gap-6 mt-5">
                {[
                  { icon: Shield, label: "Verified FPOs" },
                  { icon: CheckCircle2, label: "Direct from Farmers" },
                  { icon: Award, label: "Fair Pricing" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: `${WE.brown}99` }}>
                    <Icon className="h-4 w-4" style={{ color: WE.terra }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* FPO cards grid / carousel */}
            {fpoStores && fpoStores.length > 0 ? (
              <>
                <Carousel
                  opts={{ align: "start", loop: true }}
                  plugins={[Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })]}
                  className="w-full"
                >
                  <CarouselContent className="-ml-3 md:-ml-4">
                    {fpoStores.map((org) => {
                      const displayName = org.orgName || org.orgSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
                      const initials = displayName.split(" ").map((w: string) => w[0]).join("").substring(0, 2).toUpperCase();
                      return (
                        <CarouselItem key={org.id} className="pl-3 md:pl-4 basis-4/5 sm:basis-1/2 lg:basis-1/3">
                          <Link href={`/org/${org.orgSlug}`}>
                            <div
                              className="group cursor-pointer rounded-3xl overflow-hidden flex flex-col h-full hover:-translate-y-1 transition-all duration-300"
                              style={{ background: WE.cream, border: `1.5px solid ${WE.sand}`, boxShadow: warmShadow }}
                            >
                              {/* Card top banner */}
                              <div
                                className="relative px-5 pt-6 pb-12 text-center"
                                style={{ background: `linear-gradient(135deg, ${WE.brown}, #6B3A25)` }}
                              >
                                <div className="absolute top-3 right-3">
                                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(212,160,23,0.2)", border: "1px solid rgba(212,160,23,0.4)", color: WE.ochre }}>
                                    <BadgeCheck className="h-3 w-3" /> Verified
                                  </span>
                                </div>
                                <div className="absolute top-3 left-3">
                                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)" }}>
                                    <Store className="h-3 w-3" /> FPO Store
                                  </span>
                                </div>
                                <div className="mt-4 flex justify-center">
                                  {org.orgLogoUrl ? (
                                    <img
                                      src={org.orgLogoUrl}
                                      alt={displayName}
                                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-4 shadow-xl"
                                      style={{ borderColor: "rgba(255,255,255,0.25)" }}
                                      onError={(e) => {
                                        const t = e.target as HTMLImageElement;
                                        t.style.display = "none";
                                        const fb = t.nextElementSibling as HTMLElement;
                                        if (fb) fb.style.display = "flex";
                                      }}
                                    />
                                  ) : null}
                                  <div
                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl items-center justify-center text-white text-2xl font-black border-4 shadow-xl"
                                    style={{
                                      background: `linear-gradient(135deg, ${WE.terra}, ${WE.ochre})`,
                                      borderColor: "rgba(255,255,255,0.25)",
                                      display: org.orgLogoUrl ? "none" : "flex",
                                    }}
                                  >
                                    {initials}
                                  </div>
                                </div>
                              </div>

                              {/* Card body */}
                              <div
                                className="flex flex-col flex-1 -mt-6 rounded-t-2xl px-5 pt-8 pb-5"
                                style={{ background: WE.cream }}
                              >
                                <h3
                                  className="font-black text-base text-center line-clamp-2 mb-1 leading-snug transition-colors"
                                  style={{ color: WE.brown }}
                                >
                                  {displayName}
                                </h3>
                                {org.district && (
                                  <p className="flex items-center justify-center gap-1 text-xs mb-3" style={{ color: `${WE.brown}88` }}>
                                    <MapPin className="h-3 w-3" style={{ color: WE.terra }} />
                                    {org.district} District
                                  </p>
                                )}
                                <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
                                  {(org.totalFarmers ?? 0) > 0 && (
                                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg" style={{ background: `${WE.sand}`, color: WE.brown, border: `1px solid ${WE.ochre}30` }}>
                                      <Users className="h-3 w-3" style={{ color: WE.terra }} /> {org.totalFarmers} Farmers
                                    </span>
                                  )}
                                  {(org.organicCertifiedCount ?? 0) > 0 && (
                                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg" style={{ background: `${WE.sand}`, color: WE.brown, border: `1px solid ${WE.ochre}30` }}>
                                      <Award className="h-3 w-3" style={{ color: WE.ochre }} /> {org.organicCertifiedCount} Organic
                                    </span>
                                  )}
                                </div>
                                <div className="mt-auto">
                                  <div
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold transition-all duration-200 group-hover:opacity-90"
                                    style={{ background: `linear-gradient(135deg, ${WE.terra}, ${WE.brown})`, color: "white" }}
                                  >
                                    <Store className="h-3.5 w-3.5" /> Visit Storefront <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 shadow-xl border-0" style={{ background: WE.cream, color: WE.brown }} />
                  <CarouselNext className="right-0 shadow-xl border-0" style={{ background: WE.cream, color: WE.brown }} />
                </Carousel>
                <div className="flex justify-center mt-10">
                  <Link href="/fpo-stores">
                    <button
                      className="flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm transition-all hover:opacity-90"
                      style={{ background: WE.brown, color: WE.cream, boxShadow: warmShadow }}
                    >
                      <Store className="h-4 w-4" /> Browse All FPO Stores <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="rounded-3xl overflow-hidden" style={{ border: `1px solid ${WE.sand}` }}>
                    <Skeleton className="h-32 w-full" style={{ background: `${WE.sand}` }} />
                    <div className="p-5" style={{ background: WE.cream }}>
                      <Skeleton className="h-5 w-3/4 mb-3" style={{ background: WE.sand }} />
                      <Skeleton className="h-4 w-full mb-4" style={{ background: WE.sand }} />
                      <Skeleton className="h-9 w-full" style={{ background: WE.sand }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Wholesale / B2B Products ─────────────────────────── */}
        {wholesaleProducts && wholesaleProducts.length > 0 && (
          <section style={{ background: WE.sand }} className="py-14 sm:py-20 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              <SectionHeader
                badge={<><Package className="h-3.5 w-3.5" /> Bulk &amp; Wholesale</>}
                title={<>{t("home.wholesaleProducts")}<span className="ml-2">🌾</span></>}
                subtitle={t("home.wholesaleProductsDesc")}
              />
              <Carousel
                opts={{ align: "start", loop: true }}
                plugins={[Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })]}
                className="w-full"
              >
                <CarouselContent className="-ml-3 md:-ml-4">
                  {wholesaleProducts.map((product) => (
                    <CarouselItem key={product.id} className="pl-3 md:pl-4 basis-1/2 md:basis-1/2 lg:basis-1/3">
                      <div className="hover:-translate-y-1 transition-all duration-300">
                        <ProductCard product={product} displayMode="b2b" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 shadow-xl border-0" style={{ background: WE.cream, color: WE.brown }} />
                <CarouselNext className="right-0 shadow-xl border-0" style={{ background: WE.cream, color: WE.brown }} />
              </Carousel>
              <div className="flex justify-center mt-10">
                <Link href="/wholesale">
                  <button
                    className="flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm transition-all hover:opacity-90"
                    style={{ background: WE.brown, color: WE.cream, boxShadow: warmShadow }}
                  >
                    <Package className="h-4 w-4" /> {t("home.viewAllWholesale")} <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── Fresh Picks / Retail ─────────────────────────────── */}
        <section style={{ background: WE.cream }} className="py-14 sm:py-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              badge={<><Sprout className="h-3.5 w-3.5" /> Farm to Table · Retail</>}
              title={<>{t("home.freshPicksTitle")}<span className="ml-2">🛒</span></>}
              subtitle={t("home.freshPicksDesc")}
            />
            {products && products.length > 0 ? (
              <>
                <Carousel
                  opts={{ align: "start", loop: true }}
                  plugins={[Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })]}
                  className="w-full"
                >
                  <CarouselContent className="-ml-3 md:-ml-4">
                    {products.map((product) => (
                      <CarouselItem key={product.id} className="pl-3 md:pl-4 basis-1/2 md:basis-1/2 lg:basis-1/3">
                        <div className="hover:-translate-y-1 transition-all duration-300">
                          <ProductCard product={product} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 shadow-xl border-0" style={{ background: WE.cream, color: WE.brown }} />
                  <CarouselNext className="right-0 shadow-xl border-0" style={{ background: WE.cream, color: WE.brown }} />
                </Carousel>
                <div className="flex justify-center mt-10">
                  <Link href="/products">
                    <button
                      className="flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm transition-all hover:opacity-90"
                      style={{ background: WE.brown, color: WE.cream, boxShadow: warmShadow }}
                    >
                      <Sprout className="h-4 w-4" /> {t("home.viewAllProducts")} <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="rounded-3xl overflow-hidden" style={{ border: `1px solid ${WE.sand}` }}>
                    <Skeleton className="h-48 w-full" style={{ background: WE.sand }} />
                    <div className="p-5" style={{ background: WE.cream }}>
                      <Skeleton className="h-5 w-3/4 mb-3" style={{ background: WE.sand }} />
                      <Skeleton className="h-9 w-full" style={{ background: WE.sand }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Farm Events ──────────────────────────────────────── */}
        <FarmEventsSection />

        {/* ── FPO Brand Storefront CTA ─────────────────────────── */}
        <section
          className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden"
          style={{ background: WE.dark }}
        >
          {/* Dot-grid texture */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: `radial-gradient(${WE.ochre} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px" }}
          />

          <div className="relative max-w-6xl mx-auto">
            {/* Section badge */}
            <div className="flex justify-center mb-10 sm:mb-14">
              <span
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full border"
                style={{ background: "rgba(212,160,23,0.12)", borderColor: "rgba(212,160,23,0.4)", color: WE.ochre }}
              >
                <Store className="h-3.5 w-3.5" /> For FPOs &amp; Farmer Organisations
              </span>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              {/* Left: copy + benefits */}
              <div>
                <h2 className="text-3xl sm:text-5xl font-black mb-5 leading-tight" style={{ color: WE.cream }}>
                  Create Your Own<br />
                  <span style={{ color: WE.ochre }}>Brand Storefront</span>
                </h2>
                <p className="text-base sm:text-lg mb-8 leading-relaxed" style={{ color: `${WE.sand}cc` }}>
                  Get your FPO its own digital storefront on Santhe. Sell directly to consumers across Karnataka, manage your farmers, set your own delivery charges, and build your brand — all in one place.
                </p>
                <div className="space-y-5">
                  {[
                    { icon: Globe, title: "Your Own Store URL", desc: "A branded storefront at your-brand.farmersanthe.com" },
                    { icon: BadgeCheck, title: "Product Approval Control", desc: "Review and approve all farmer listings before they go live" },
                    { icon: Zap, title: "Set Your Own Delivery Charges", desc: "Configure per-district, weight-based delivery pricing your way" },
                    { icon: TrendingUp, title: "Zero Platform Fee Plans", desc: "Subscription plans with zero commission on your sales" },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-4">
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5 border"
                        style={{ background: "rgba(212,160,23,0.1)", borderColor: "rgba(212,160,23,0.25)" }}
                      >
                        <Icon className="h-5 w-5" style={{ color: WE.ochre }} />
                      </div>
                      <div>
                        <p className="font-bold text-sm sm:text-base" style={{ color: WE.cream }}>{title}</p>
                        <p className="text-sm mt-0.5" style={{ color: `${WE.sand}99` }}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  className="mt-10 pt-8 grid grid-cols-3 gap-4"
                  style={{ borderTop: `1px solid rgba(245,230,200,0.12)` }}
                >
                  {[
                    { value: "50+", label: "FPOs onboarded" },
                    { value: "5000+", label: "Farmers connected" },
                    { value: "₹0", label: "Setup cost" },
                  ].map(({ value, label }) => (
                    <div key={label} className="text-center">
                      <p className="text-xl sm:text-2xl font-black" style={{ color: WE.ochre }}>{value}</p>
                      <p className="text-xs sm:text-sm mt-0.5" style={{ color: `${WE.sand}88` }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Inquiry form */}
              <div
                className="rounded-2xl p-6 sm:p-8 border backdrop-blur-sm"
                style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(245,230,200,0.12)" }}
              >
                {inquirySubmitted ? (
                  <div className="text-center py-8">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border"
                      style={{ background: "rgba(212,160,23,0.1)", borderColor: "rgba(212,160,23,0.25)" }}
                    >
                      <CheckCircle2 className="h-9 w-9" style={{ color: WE.ochre }} />
                    </div>
                    <h3 className="text-xl font-black mb-2" style={{ color: WE.cream }}>Thank You!</h3>
                    <p className="text-sm mb-6" style={{ color: `${WE.sand}99` }}>
                      We've received your enquiry. Our team will contact you within 1–2 business days.
                    </p>
                    <button
                      className="px-5 py-2 rounded-full text-sm font-bold border transition-colors hover:opacity-90"
                      style={{ borderColor: "rgba(212,160,23,0.4)", color: WE.ochre, background: "transparent" }}
                      onClick={() => setInquirySubmitted(false)}
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg sm:text-xl font-black mb-1" style={{ color: WE.cream }}>Get Started — It's Free</h3>
                    <p className="text-sm mb-6" style={{ color: `${WE.sand}88` }}>Fill in your details and our team will reach out to you.</p>
                    <form
                      className="space-y-4"
                      onSubmit={(e) => { e.preventDefault(); inquiryMutation.mutate(inquiryForm); }}
                    >
                      <div>
                        <label className="block text-sm font-semibold mb-1.5" style={{ color: `${WE.sand}cc` }}>Organisation / FPO Name *</label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: `${WE.sand}66` }} />
                          <Input
                            className="pl-9 border text-white placeholder:text-neutral-500 focus:ring-1"
                            style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(245,230,200,0.15)" }}
                            placeholder="e.g. Mandya FPC, Ramanagara Growers"
                            value={inquiryForm.orgName}
                            onChange={(e) => setInquiryForm((f) => ({ ...f, orgName: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1.5" style={{ color: `${WE.sand}cc` }}>Contact Person Name *</label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: `${WE.sand}66` }} />
                          <Input
                            className="pl-9 border text-white placeholder:text-neutral-500"
                            style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(245,230,200,0.15)" }}
                            placeholder="Your full name"
                            value={inquiryForm.contactName}
                            onChange={(e) => setInquiryForm((f) => ({ ...f, contactName: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold mb-1.5" style={{ color: `${WE.sand}cc` }}>Email *</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: `${WE.sand}66` }} />
                            <Input
                              type="email"
                              className="pl-9 border text-white placeholder:text-neutral-500"
                              style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(245,230,200,0.15)" }}
                              placeholder="you@example.com"
                              value={inquiryForm.email}
                              onChange={(e) => setInquiryForm((f) => ({ ...f, email: e.target.value }))}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1.5" style={{ color: `${WE.sand}cc` }}>Phone *</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: `${WE.sand}66` }} />
                            <Input
                              type="tel"
                              className="pl-9 border text-white placeholder:text-neutral-500"
                              style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(245,230,200,0.15)" }}
                              placeholder="+91 XXXXX XXXXX"
                              value={inquiryForm.phone}
                              onChange={(e) => setInquiryForm((f) => ({ ...f, phone: e.target.value }))}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1.5" style={{ color: `${WE.sand}cc` }}>District *</label>
                        <Select
                          value={inquiryForm.district}
                          onValueChange={(val) => setInquiryForm((f) => ({ ...f, district: val }))}
                          required
                        >
                          <SelectTrigger
                            className="w-full border text-white"
                            style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(245,230,200,0.15)" }}
                          >
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: `${WE.sand}66` }} />
                              <SelectValue placeholder="Select your district" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {allDistricts.filter((d) => (d as any).isActive !== false).map((d) => (
                              <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1.5" style={{ color: `${WE.sand}cc` }}>Message (Optional)</label>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-3 h-4 w-4" style={{ color: `${WE.sand}66` }} />
                          <Textarea
                            className="pl-9 resize-none border text-white placeholder:text-neutral-500"
                            style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(245,230,200,0.15)" }}
                            rows={3}
                            placeholder="Tell us about your FPO, number of farmers, or any questions..."
                            value={inquiryForm.message}
                            onChange={(e) => setInquiryForm((f) => ({ ...f, message: e.target.value }))}
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={inquiryMutation.isPending}
                        className="w-full py-3 rounded-full font-black text-base transition-all hover:opacity-90 disabled:opacity-60"
                        style={{ background: `linear-gradient(135deg, ${WE.terra}, ${WE.ochre})`, color: WE.dark, boxShadow: warmShadow }}
                      >
                        {inquiryMutation.isPending ? "Submitting..." : "Request Your Brand Storefront →"}
                      </button>
                      <p className="text-center text-xs" style={{ color: `${WE.sand}55` }}>
                        By submitting, you agree to our{" "}
                        <a href="/privacy" className="hover:underline" style={{ color: `${WE.ochre}cc` }}>Privacy Policy</a>.
                        We'll never share your details.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}

// ─── Event Card Image Carousel ────────────────────────────────────────────────
function EventCardCarousel({ event }: { event: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const allImages: string[] = [];
  if (event.coverImage) allImages.push(event.coverImage);
  if (event.gallery && Array.isArray(event.gallery)) {
    event.gallery.forEach((g: any) => {
      if (g.imageUrl && !allImages.includes(g.imageUrl)) allImages.push(g.imageUrl);
    });
  }
  if (event.farmerProfile?.farmImages && Array.isArray(event.farmerProfile.farmImages)) {
    event.farmerProfile.farmImages.forEach((img: string) => {
      if (img && !allImages.includes(img)) allImages.push(img);
    });
  }

  useEffect(() => {
    if (allImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [allImages.length]);

  if (allImages.length === 0) {
    return (
      <div
        className="h-48 w-full flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${WE.sand}, ${WE.cream})` }}
      >
        <Calendar className="h-16 w-16" style={{ color: `${WE.terra}66` }} />
      </div>
    );
  }

  return (
    <div className="relative h-48 w-full overflow-hidden">
      {allImages.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`${event.title} - ${index + 1}`}
          className={`absolute inset-0 h-48 w-full object-cover transition-opacity duration-500 group-hover:scale-105 ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      {allImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {allImages.map((_, index) => (
            <button
              key={index}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(index); }}
              className={`h-2 rounded-full transition-all ${index === currentIndex ? "bg-white w-4" : "bg-white/50 w-2 hover:bg-white/75"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Farm Events Section ──────────────────────────────────────────────────────
function FarmEventsSection() {
  const { t } = useTranslation();
  const { data: events, isLoading } = useQuery<any[]>({
    queryKey: ["/api/events?status=live&limit=9"],
    staleTime: 0,
    refetchOnMount: "always",
  });

  const eventTypeLabels: Record<string, string> = {
    fruit_picking: "Fruit Picking",
    vegetable_experience: "Vegetable Experience",
    farm_tour: "Farm Tour",
    zbnf_training: "Natural Farming Training",
    nursery_visit: "Nursery Visit",
    festival: "Farm Festival",
    workshop: "Workshop",
    kids_activity: "Kids Activity",
  };

  if (isLoading) {
    return (
      <section style={{ background: WE.sand }} className="py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${WE.ochre}25` }}>
                <Skeleton className="h-48 w-full" style={{ background: `${WE.ochre}20` }} />
                <div className="p-5" style={{ background: WE.cream }}>
                  <Skeleton className="h-5 w-3/4 mb-3" style={{ background: WE.sand }} />
                  <Skeleton className="h-4 w-full mb-4" style={{ background: WE.sand }} />
                  <Skeleton className="h-9 w-full" style={{ background: WE.sand }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const activeEvents = events?.filter((event) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const eventDates = event.eventDates || event.dates?.map((d: any) => d.eventDate);
    if (eventDates && eventDates.length > 0) {
      const latestDate = new Date(Math.max(...eventDates.map((d: string) => new Date(d).getTime())));
      latestDate.setHours(23, 59, 59, 999);
      return latestDate >= now;
    }
    return true;
  });

  if (!activeEvents || activeEvents.length === 0) return null;

  return (
    <section style={{ background: WE.sand }} className="py-14 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge={<><Calendar className="h-3.5 w-3.5" /> Live Farm Experiences</>}
          title={<>{t("home.farmExperiencesTitle")}<span className="ml-2">🌄</span></>}
          subtitle={t("home.farmExperiencesDesc")}
        />
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })]}
          className="w-full"
        >
          <CarouselContent className="-ml-3 md:-ml-4">
            {activeEvents.map((event) => (
              <CarouselItem key={event.id} className="pl-3 md:pl-4 basis-4/5 sm:basis-1/2 lg:basis-1/3">
                <Link href={`/events/${event.id}`}>
                  <div
                    className="group cursor-pointer hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden border"
                    style={{ background: WE.cream, borderColor: `${WE.ochre}25`, boxShadow: "0 4px 16px rgba(74,44,23,0.08)" }}
                  >
                    <div className="relative">
                      <EventCardCarousel event={event} />
                      <div className="absolute top-3 left-3">
                        <span
                          className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-md"
                          style={{ background: WE.cream, color: WE.terra, border: `1px solid ${WE.terra}30` }}
                        >
                          {eventTypeLabels[event.eventType] || event.eventType}
                        </span>
                      </div>
                      {event.dates && event.dates.length > 0 && (
                        <div
                          className="absolute bottom-3 right-3 rounded-lg px-3 py-1.5 shadow-md"
                          style={{ background: "rgba(253,248,240,0.95)" }}
                        >
                          <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: WE.brown }}>
                            <Calendar className="h-4 w-4" style={{ color: WE.terra }} />
                            {new Date(event.dates[0].eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            {event.dates.length > 1 && ` +${event.dates.length - 1}`}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3 sm:p-5">
                      <h3 className="font-black text-xs sm:text-base line-clamp-1 transition-colors group-hover:opacity-80" style={{ color: WE.brown }}>
                        {event.title}
                      </h3>
                      {(event.farmerProfile?.farmName || event.farmer?.name) && (
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-sm mt-1.5 font-semibold" style={{ color: WE.terra }}>
                          <Leaf className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="line-clamp-1">{event.farmerProfile?.farmName || event.farmer?.name}</span>
                        </div>
                      )}
                      <div className="hidden sm:flex items-center gap-1.5 text-sm mt-1.5" style={{ color: `${WE.brown}77` }}>
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div
                        className="flex items-center justify-between mt-3 pt-3"
                        style={{ borderTop: `1px solid ${WE.sand}` }}
                      >
                        <div>
                          <span className="text-base sm:text-xl font-black" style={{ color: WE.terra }}>
                            ₹{parseFloat(event.pricePerSeat).toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] sm:text-sm ml-1" style={{ color: `${WE.brown}66` }}>/ person</span>
                        </div>
                        <button
                          className="text-xs sm:text-sm px-3 py-1.5 rounded-full font-bold transition-all hover:opacity-90"
                          style={{ background: `linear-gradient(135deg, ${WE.terra}, ${WE.brown})`, color: "white" }}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 shadow-xl border-0" style={{ background: WE.cream, color: WE.brown }} />
          <CarouselNext className="right-0 shadow-xl border-0" style={{ background: WE.cream, color: WE.brown }} />
        </Carousel>
        <div className="flex justify-center mt-10">
          <Link href="/events">
            <button
              className="flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm transition-all hover:opacity-90"
              style={{ background: WE.brown, color: WE.cream, boxShadow: warmShadow }}
            >
              <Calendar className="h-4 w-4" /> {t("home.viewAllEvents")} <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
