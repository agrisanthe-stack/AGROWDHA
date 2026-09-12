import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/products/ProductCard";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewList from "@/components/reviews/ReviewList";
import { Product } from "@/lib/types";
import { useDistrict } from "@/hooks/use-district";
import { useAuth } from "@/hooks/use-auth";
import {
  Loader2, MapPin, Mail, ShoppingBag, Users, Leaf, Star,
  Calendar, Clock, Package, Copy, Check, Award,
  Store, Search, BadgeCheck, Truck, Shield, Heart,
  Phone, ChevronRight, ChevronLeft, ArrowLeft, ShoppingCart, Home, ArrowRight, CalendarDays,
  Bell, BellOff, UserPlus, Sprout, Sparkles
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { FollowButton } from "@/components/FollowButton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { formatIndianCurrency } from "@/lib/utils";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";

interface OrgFarmer {
  id: number;
  farmName: string;
  location: string;
  imageUrl: string;
  logoUrl: string;
  description: string;
  rating: string;
  productAvgRating: string | null;
  isZbnfCertified: boolean;
  isOrganicCertified: boolean;
  isNaturalCertified: boolean;
  tags: string[];
  farmImages: string[] | null;
}

function FpoFollowButton({ dmUserId, orgName }: { dmUserId: number; orgName: string }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: followData, isLoading } = useQuery({
    queryKey: ['/api/fpo', dmUserId, 'is-following'],
    queryFn: async () => {
      if (!user) return { isFollowing: false, followerCount: 0 };
      const res = await apiRequest('GET', `/api/fpo/${dmUserId}/is-following`);
      if (!res.ok) return { isFollowing: false, followerCount: 0 };
      return res.json();
    },
    enabled: !!user,
  });

  const { data: followerData } = useQuery({
    queryKey: ['/api/fpo', dmUserId, 'followers'],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/fpo/${dmUserId}/followers`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      const isFollowing = followData?.isFollowing;
      const method = isFollowing ? 'DELETE' : 'POST';
      const res = await apiRequest(method, `/api/fpo/${dmUserId}/follow`);
      if (!res.ok) throw new Error('Failed to update follow status');
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/fpo', dmUserId, 'is-following'] });
      queryClient.invalidateQueries({ queryKey: ['/api/fpo', dmUserId, 'followers'] });
      toast({
        title: data.isFollowing ? 'Following store!' : 'Unfollowed',
        description: data.isFollowing
          ? `You'll get email updates when ${orgName} adds new products.`
          : `You won't receive updates from ${orgName} anymore.`,
      });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Could not update follow status.', variant: 'destructive' });
    },
  });

  const followerCount = Array.isArray(followerData) ? followerData.length : 0;
  const isFollowing = followData?.isFollowing;
  const isPending = followMutation.isPending || isLoading;

  if (!user) {
    return (
      <Link href="/login">
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white border-white/30 backdrop-blur-sm text-xs sm:text-sm"
        >
          <Bell className="h-3.5 w-3.5" />
          Follow Store
          {followerCount > 0 && <span className="ml-1 text-white/70">({followerCount})</span>}
        </Button>
      </Link>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => followMutation.mutate()}
      disabled={isPending}
      className={`flex items-center gap-1.5 backdrop-blur-sm text-xs sm:text-sm transition-all ${
        isFollowing
          ? 'bg-white/90 text-green-700 border-white hover:bg-white hover:text-red-600'
          : 'bg-white/15 hover:bg-white/25 text-white border-white/30'
      }`}
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : isFollowing ? (
        <BellOff className="h-3.5 w-3.5" />
      ) : (
        <Bell className="h-3.5 w-3.5" />
      )}
      {isFollowing ? 'Following' : 'Follow Store'}
      {followerCount > 0 && <span className="opacity-70">({followerCount})</span>}
    </Button>
  );
}

function OrgFarmerCard({ farmer, orgSlug }: { farmer: OrgFarmer; orgSlug: string }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user } = useAuth();

  const allImages = useMemo(() => {
    const images: string[] = [];
    if (farmer.farmImages && Array.isArray(farmer.farmImages) && farmer.farmImages.length > 0) {
      farmer.farmImages.forEach((image: string) => {
        if (image.startsWith('http://') || image.startsWith('https://')) {
          images.push(image);
        } else {
          images.push(image.startsWith('/') ? image : `/${image}`);
        }
      });
    }
    if (images.length === 0 && farmer.imageUrl) {
      images.push(farmer.imageUrl);
    }
    return images;
  }, [farmer.farmImages, farmer.imageUrl]);

  useEffect(() => {
    if (allImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [allImages.length]);

  const profileRating = Number(farmer.rating);
  const productRating = Number(farmer.productAvgRating);

  return (
    <div className="relative h-full">
      {user && (
        <div className="absolute top-2 right-2 z-20">
          <FollowButton farmerId={farmer.id} userId={user.id} className="bg-white/80 backdrop-blur-sm shadow-sm" />
        </div>
      )}
      <Link href={`/org/${orgSlug}/farmers/${farmer.id}`}>
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full group border-0 shadow-sm">
          <div className="h-32 sm:h-44 overflow-hidden relative">
            <img
              src={allImages[currentImageIndex] || farmer.imageUrl || '/placeholder-farmer.jpg'}
              alt={`${farmer.farmName} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = farmer.imageUrl || '/placeholder-farmer.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute top-2 left-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white shadow-lg bg-white">
                <img
                  src={farmer.logoUrl || farmer.imageUrl}
                  alt={farmer.farmName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://img.freepik.com/premium-photo/indian-farmer-standing-farm-portrait-photograph_975284-1338.jpg';
                  }}
                />
              </div>
            </div>
            {farmer.isOrganicCertified && (
              <Badge className="absolute top-2 right-2 bg-green-500/90 backdrop-blur-sm text-white text-[10px] sm:text-xs border-0">
                <Leaf className="h-3 w-3 mr-0.5" /> Organic
              </Badge>
            )}
            {!farmer.isOrganicCertified && farmer.isNaturalCertified && (
              <Badge className="absolute top-2 right-2 bg-teal-500/90 backdrop-blur-sm text-white text-[10px] sm:text-xs border-0">
                <Leaf className="h-3 w-3 mr-0.5" /> Natural
              </Badge>
            )}
            <div className="absolute bottom-2 left-2 right-2">
              <h3 className="font-semibold text-sm sm:text-base text-white truncate drop-shadow-md">{farmer.farmName}</h3>
            </div>
            {allImages.length > 1 && (
              <div className="absolute bottom-2 right-2 flex space-x-1">
                {allImages.map((_: string, index: number) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            )}
          </div>
          <CardContent className="p-2.5 sm:p-3">
            <div className="flex items-center gap-1 text-gray-500">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="text-xs truncate">{farmer.location}</span>
            </div>
            {profileRating > 0 && productRating > 0 ? (
              <div className="flex flex-col gap-0.5 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-medium">{profileRating.toFixed(1)}</span>
                  <span className="text-[10px] text-gray-400">profile</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs font-medium">{productRating.toFixed(1)}</span>
                  <span className="text-[10px] text-gray-400">products</span>
                </div>
              </div>
            ) : profileRating > 0 ? (
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-medium">{profileRating.toFixed(1)}</span>
              </div>
            ) : productRating > 0 ? (
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-medium">{productRating.toFixed(1)}</span>
                <span className="text-[10px] text-gray-400">products</span>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

interface OrgEvent {
  id: number;
  title: string;
  slug: string | null;
  description: string;
  eventType: string;
  cropType: string | null;
  location: string;
  address: string;
  startTime: string;
  endTime: string;
  totalSeats: number;
  pricePerSeat: string;
  coverImage: string | null;
  status: string;
  gallery: { imageUrl: string }[];
  farmerProfile: { farmName: string; farmImages: string[] } | null;
}

function EventCardCarousel({ event }: { event: OrgEvent }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const allImages: string[] = [];
  if (event.coverImage) allImages.push(event.coverImage);
  if (event.gallery && Array.isArray(event.gallery)) {
    event.gallery.forEach((g) => {
      if (g.imageUrl && !allImages.includes(g.imageUrl)) allImages.push(g.imageUrl);
    });
  }
  if (event.farmerProfile?.farmImages && Array.isArray(event.farmerProfile.farmImages)) {
    event.farmerProfile.farmImages.forEach((img) => {
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
      <div className="flex items-center justify-center h-full">
        <CalendarDays className="h-16 w-16 text-white/50" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {allImages.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`${event.title} - ${index + 1}`}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {allImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5">
          {allImages.map((_, index) => (
            <button
              key={index}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(index); }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-white w-4" : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface OrgData {
  id: number;
  orgName: string;
  orgSlug: string;
  orgLogoUrl: string;
  orgEmail: string;
  orgPhone: string;
  district: string;
  fpoFarmerId: number | null;
  orgGallery: string[];
  products: (Product & { b2bQuantity?: number; hasSlabPricing?: boolean; isOrganic?: boolean })[];
  farmers: OrgFarmer[];
  events: OrgEvent[];
}

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

function EventCard({ event, orgSlug }: { event: OrgEvent; orgSlug: string }) {
  return (
    <Link href={`/org/${orgSlug}/events/${event.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer h-full flex flex-col">
        <div className="relative h-32 sm:h-48 bg-gradient-to-br from-green-400 to-emerald-500 flex-shrink-0">
          <EventCardCarousel event={event} />
          <Badge className="absolute top-2 left-2 bg-white text-green-700 text-[10px] sm:text-xs px-1.5 py-0.5">
            {eventTypeLabels[event.eventType] || event.eventType}
          </Badge>
          {event.cropType && (
            <Badge className="absolute top-2 right-2 bg-orange-500 text-[10px] sm:text-xs px-1.5 py-0.5">
              {event.cropType}
            </Badge>
          )}
        </div>

        <div className="p-2 sm:p-4 flex flex-col flex-grow">
          <h3 className="text-sm sm:text-base font-semibold line-clamp-2 group-hover:text-green-700 transition-colors leading-tight mb-1">{event.title}</h3>
          <p className="text-[11px] sm:text-sm text-gray-500 flex items-center gap-1 truncate mb-1">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </p>
          <p className="text-[11px] sm:text-sm text-gray-500 flex items-center gap-1 mb-2">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            {event.startTime} - {event.endTime}
          </p>
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
            <div>
              <p className="text-sm sm:text-base font-bold text-green-600">
                {formatIndianCurrency(Number(event.pricePerSeat))}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400">per person</p>
            </div>
            <span className="text-[10px] sm:text-xs text-gray-400">{event.totalSeats} seats</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function OrgNavBar({ org, activeSection, copied, onCopy }: {
  org: OrgData;
  activeSection?: string;
  copied: boolean;
  onCopy: () => void;
}) {
  const { cartItems } = useCart();
  const initials = (org.orgName || '').split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
  const base = `/org/${org.orgSlug}`;

  const navItems = [
    { key: 'retail', label: 'Retail', icon: ShoppingBag, href: `${base}/retail` },
    { key: 'wholesale', label: 'Wholesale', icon: Package, href: `${base}/wholesale` },
    { key: 'events', label: 'Events', icon: Calendar, href: `${base}/events-list` },
    { key: 'farmers', label: 'Farmers', icon: Users, href: `${base}/farmers-list` },
    { key: 'harvest', label: 'Harvest', icon: CalendarDays, href: `${base}/harvest-calendar` },
  ];

  return (
    <>
      {/* ===== TOP HEADER BAR ===== */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 sm:py-3 min-h-[56px] sm:min-h-[72px]">
            <Link href={base} className="flex-shrink min-w-0 max-w-[55%] sm:max-w-[40%]">
              <div className="flex items-center gap-2 sm:gap-3 group">
                {org.orgLogoUrl ? (
                  <img src={org.orgLogoUrl} alt={org.orgName} className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg object-cover bg-white border border-gray-200 transition-transform duration-300 group-hover:scale-105 flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg bg-green-600 flex items-center justify-center text-white text-sm sm:text-lg font-bold flex-shrink-0">{initials}</div>
                )}
                <div className="leading-tight min-w-0">
                  <span className="font-bold text-xs sm:text-lg text-gray-900 block break-words line-clamp-2">{org.orgName}</span>
                  <span className="text-[9px] sm:text-xs text-gray-400">Powered by <span className="text-green-600 font-medium">farmersanthe</span></span>
                </div>
              </div>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeSection === item.key;
                return (
                  <Link key={item.key} href={item.href}>
                    <span className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isActive
                        ? 'text-white bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg'
                        : 'text-gray-700 hover:text-green-700 hover:bg-green-50'
                    }`}>
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Action buttons */}
            <div className="flex items-center gap-1 sm:gap-3">
              <Link href="/">
                <button className="flex items-center gap-1.5 text-gray-500 hover:text-green-700 px-2 sm:px-3 py-2 rounded-lg transition-colors hover:bg-green-50" title="Santhe Home">
                  <Home className="h-5 w-5" />
                  <span className="hidden sm:inline text-sm font-medium">Home</span>
                </button>
              </Link>

              <Link href="/cart">
                <button className="relative flex items-center gap-1.5 text-gray-500 hover:text-green-700 px-2 sm:px-3 py-2 rounded-lg transition-colors hover:bg-green-50" title="Cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-0.5 right-0 sm:-right-0.5 bg-green-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                      {cartItems.length}
                    </span>
                  )}
                </button>
              </Link>

              <button
                onClick={onCopy}
                className="flex items-center gap-1.5 text-gray-500 hover:text-green-700 px-2 sm:px-3 py-2 rounded-lg transition-colors hover:bg-green-50"
                title="Share store link"
              >
                {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
                <span className="hidden sm:inline text-sm font-medium">{copied ? 'Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.key;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full py-1 ${
                  isActive ? 'text-green-600' : 'text-gray-500 hover:text-green-600'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-green-600' : ''} />
                <span className="text-[10px] mt-1 font-medium truncate max-w-[60px] text-center">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

function OrgFooter({ org }: { org: OrgData }) {
  const initials = (org.orgName || '').split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 sm:py-10">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-3">
            {org.orgLogoUrl ? (
              <img src={org.orgLogoUrl} alt={org.orgName} className="w-10 h-10 rounded-lg object-cover bg-white" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center text-sm font-bold">{initials}</div>
            )}
            <h3 className="font-bold text-base sm:text-lg">{org.orgName}</h3>
          </div>
          {org.district && (
            <div className="flex items-center gap-1.5 text-gray-400 text-sm">
              <MapPin className="h-3.5 w-3.5 text-green-400" />{org.district} District
            </div>
          )}
          <div className="border-t border-gray-800 w-full max-w-md pt-4 mt-2">
            <p className="text-gray-500 text-xs sm:text-sm">
              Powered by{' '}
              <Link href="/" className="text-green-400 hover:text-green-300 font-medium transition-colors">farmersanthe</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SectionHeader({ icon: Icon, title, subtitle, color, backHref }: {
  icon: any;
  title: string;
  subtitle: string;
  color: string;
  backHref?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5 sm:mb-6">
      {backHref && (
        <Link href={backHref}>
          <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          </button>
        </Link>
      )}
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-${color}-100 flex items-center justify-center`}>
        <Icon className={`h-5 w-5 sm:h-6 sm:w-6 text-${color}-700`} />
      </div>
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-xs sm:text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

function useOrgData(slug: string | undefined) {
  const { selectedDistrictId } = useDistrict();
  const { user } = useAuth();
  const effectiveDistrictId = selectedDistrictId || user?.districtId || null;
  return useQuery<OrgData>({
    queryKey: [`/api/org/${slug}`, { deliveryDistrictId: effectiveDistrictId || undefined }],
    enabled: !!slug,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

function OrgRetailPage({ slug }: { slug: string }) {
  const { data: org, isLoading, error } = useOrgData(slug);
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const copyUrl = () => {
    navigator.clipboard.writeText(`${window.location.origin}/org/${slug}`);
    setCopied(true);
    toast({ title: "Link copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) return <LoadingState />;
  if (error || !org) return <ErrorState />;

  const allProducts = org.products || [];
  const retailProducts = allProducts.filter(p => (p.inventory ?? 0) > 0 || !p.b2bQuantity || Number(p.b2bQuantity) === 0);
  const filtered = retailProducts.filter(p => !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <OrgNavBar org={org} activeSection="retail" copied={copied} onCopy={copyUrl} />
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">
          <SectionHeader icon={ShoppingBag} title="Retail" subtitle={`${retailProducts.length} products available`} color="green" backHref={`/org/${slug}`} />
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-gray-50 border-gray-200 text-sm" />
          </div>
        </div>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filtered.map(product => <ProductCard key={product.id} product={product} orgSlug={org.orgSlug} />)}
          </div>
        ) : (
          <EmptySearch term={searchTerm} />
        )}
      </div>
      <OrgFooter org={org} />
    </div>
  );
}

function OrgWholesalePage({ slug }: { slug: string }) {
  const { data: org, isLoading, error } = useOrgData(slug);
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const copyUrl = () => {
    navigator.clipboard.writeText(`${window.location.origin}/org/${slug}`);
    setCopied(true);
    toast({ title: "Link copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) return <LoadingState />;
  if (error || !org) return <ErrorState />;

  const wholesaleProducts = (org.products || []).filter(p => p.b2bQuantity && Number(p.b2bQuantity) > 0);
  const filtered = wholesaleProducts.filter(p => !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <OrgNavBar org={org} activeSection="wholesale" copied={copied} onCopy={copyUrl} />
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">
          <SectionHeader icon={Package} title="Wholesale" subtitle={`${wholesaleProducts.length} bulk products`} color="orange" backHref={`/org/${slug}`} />
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search wholesale..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-gray-50 border-gray-200 text-sm" />
          </div>
        </div>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filtered.map(product => <ProductCard key={product.id} product={product} displayMode="b2b" orgSlug={org.orgSlug} />)}
          </div>
        ) : (
          <EmptySearch term={searchTerm} />
        )}
      </div>
      <OrgFooter org={org} />
    </div>
  );
}

function OrgFarmersPage({ slug }: { slug: string }) {
  const { data: org, isLoading, error } = useOrgData(slug);
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    navigator.clipboard.writeText(`${window.location.origin}/org/${slug}`);
    setCopied(true);
    toast({ title: "Link copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) return <LoadingState />;
  if (error || !org) return <ErrorState />;

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <OrgNavBar org={org} activeSection="farmers" copied={copied} onCopy={copyUrl} />
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <SectionHeader icon={Users} title="Farmers" subtitle={`${org.farmers.length} farmers in this FPO`} color="emerald" backHref={`/org/${slug}`} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {org.farmers.map(farmer => <OrgFarmerCard key={farmer.id} farmer={farmer} orgSlug={org.orgSlug} />)}
        </div>
      </div>
      <OrgFooter org={org} />
    </div>
  );
}

function OrgEventsPage({ slug }: { slug: string }) {
  const { data: org, isLoading, error } = useOrgData(slug);
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    navigator.clipboard.writeText(`${window.location.origin}/org/${slug}`);
    setCopied(true);
    toast({ title: "Link copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) return <LoadingState />;
  if (error || !org) return <ErrorState />;

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <OrgNavBar org={org} activeSection="events" copied={copied} onCopy={copyUrl} />
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <SectionHeader icon={Calendar} title="Events" subtitle={`${(org.events || []).length} upcoming events`} color="blue" backHref={`/org/${slug}`} />
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {(org.events || []).map(event => <EventCard key={event.id} event={event} orgSlug={org.orgSlug} />)}
        </div>
      </div>
      <OrgFooter org={org} />
    </div>
  );
}

interface FpoCalendarEntry {
  id: number;
  productId: number;
  produceName: string;
  imageUrl: string;
  categoryId: number;
  monthlyStatus: Record<string, string>;
  farms: { id: number; name: string; logoUrl: string }[];
}

// ── Shared harvest calendar table (used on standalone page AND landing page) ──

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const CURRENT_MONTH = new Date().getMonth();

const STATUS_META: Record<string, { color: string; bg: string; Icon: React.ElementType; label: string }> = {
  growing:    { color: 'from-blue-400 to-blue-600',   bg: 'bg-blue-500',   Icon: Sprout,      label: 'Growing' },
  harvesting: { color: 'from-orange-400 to-orange-600', bg: 'bg-orange-500', Icon: Clock,       label: 'Harvesting' },
  'pre-order':{ color: 'from-yellow-400 to-yellow-600', bg: 'bg-yellow-500', Icon: Calendar,    label: 'Pre-Order' },
  available:  { color: 'from-green-400 to-green-600',  bg: 'bg-green-500',  Icon: ShoppingCart, label: 'Available' },
};

const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function CalendarLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 px-4 pt-3 pb-3 border-b border-gray-100">
      {Object.values(STATUS_META).map(({ color, Icon, label }) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className={`w-5 h-5 rounded bg-gradient-to-r ${color} flex items-center justify-center flex-shrink-0`}>
            <Icon className="h-2.5 w-2.5 text-white" />
          </div>
          <span className="text-xs font-medium text-gray-600">{label}</span>
        </div>
      ))}
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center">
          <span className="text-[9px] text-gray-400">—</span>
        </div>
        <span className="text-xs font-medium text-gray-400">Off season</span>
      </div>
    </div>
  );
}

function CalendarTable({ entries, isLoading, base = "" }: { entries: FpoCalendarEntry[]; isLoading: boolean; base?: string }) {
  const emptyState = (
    <div className="py-12 text-center">
      <div className="flex flex-col items-center gap-2">
        <CalendarDays className="h-10 w-10 text-gray-200" />
        <p className="text-sm font-medium text-gray-500">No harvest schedule yet</p>
        <p className="text-xs text-gray-400">Farmers haven't added crop schedules yet.</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <CalendarLegend />

      {/* ── Desktop table (md+) ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-3 px-4 text-left text-xs font-bold text-gray-600 bg-gray-50 sticky left-0 z-10 min-w-[160px]">
                <div className="flex items-center gap-1.5"><Leaf className="h-3.5 w-3.5 text-green-600" />Produce</div>
              </th>
              {MONTH_NAMES.map((m, i) => (
                <th key={i} className={`py-3 px-1.5 text-center text-xs font-bold min-w-[44px] ${
                  i === CURRENT_MONTH ? 'text-white bg-green-600' : 'text-gray-500 bg-gray-50'
                }`}>
                  {m.slice(0, 3)}
                </th>
              ))}
              <th className="py-3 px-4 text-left text-xs font-bold text-gray-600 bg-gray-50 sticky right-0 z-10 min-w-[90px]">
                <div className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-amber-500" />Farms</div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <tr key={i}>
                  <td className="py-3 px-4 sticky left-0 bg-white z-10">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </td>
                  {Array(12).fill(0).map((_, j) => <td key={j} className="py-3 px-1.5"><Skeleton className="h-7 w-full rounded" /></td>)}
                  <td className="py-3 px-4 sticky right-0 bg-white z-10"><Skeleton className="h-7 w-12 rounded-full" /></td>
                </tr>
              ))
            ) : entries.length === 0 ? (
              <tr><td colSpan={14}>{emptyState}</td></tr>
            ) : (
              entries.map((entry, idx) => (
                <tr key={idx} className="hover:bg-amber-50/40 transition-colors group">
                  <td className="py-3 px-4 sticky left-0 bg-white group-hover:bg-amber-50/40 z-10">
                    <Link href={`${base}/products/${entry.productId}`} className="flex items-center gap-2.5 group/link">
                      <div className="h-9 w-9 rounded-full overflow-hidden ring-2 ring-gray-100 flex-shrink-0 bg-gray-50 group-hover/link:ring-orange-300 transition-all">
                        <img src={entry.imageUrl} alt={entry.produceName} className="h-full w-full object-cover group-hover/link:scale-110 transition-transform duration-200" />
                      </div>
                      <span className="font-medium text-gray-900 text-sm leading-tight group-hover/link:text-orange-700 group-hover/link:underline transition-colors">{entry.produceName}</span>
                    </Link>
                  </td>
                  {MONTH_NAMES.map((_, i) => {
                    const key = Object.keys(entry.monthlyStatus).find(k => parseInt(k) === i);
                    const status = key ? entry.monthlyStatus[key] : "none";
                    const meta = STATUS_META[status];
                    return (
                      <td key={i} className={`py-3 px-1.5 text-center ${i === CURRENT_MONTH ? 'bg-green-50/60' : ''}`}>
                        <div className="flex justify-center">
                          {meta ? (
                            <div className={`h-7 w-9 rounded-md ${meta.bg} flex items-center justify-center text-white`} title={meta.label}>
                              <meta.Icon className="h-3 w-3" />
                            </div>
                          ) : (
                            <div className="h-7 w-9 rounded-md bg-gray-100 flex items-center justify-center">
                              <span className="text-[10px] text-gray-300">—</span>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td className="py-3 px-4 sticky right-0 bg-white group-hover:bg-amber-50/40 z-10">
                    <div className="flex -space-x-1.5">
                      {entry.farms.slice(0, 3).map((farm, fi) => (
                        <Link key={fi} href={`${base}/farmers/${farm.id}`} title={farm.name}>
                          <img src={farm.logoUrl} alt={farm.name}
                            className="h-7 w-7 rounded-full border-2 border-white object-cover bg-gray-100 hover:scale-110 hover:border-orange-300 transition-all cursor-pointer" />
                        </Link>
                      ))}
                      {entry.farms.length > 3 && (
                        <div className="h-7 w-7 rounded-full border-2 border-white bg-green-500 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-white">+{entry.farms.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards (< md) ── */}
      <div className="block md:hidden">
        {isLoading ? (
          <div className="divide-y divide-gray-50">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="p-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-11 w-11 rounded-full flex-shrink-0" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-8 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : entries.length === 0 ? emptyState : (
          <div className="divide-y divide-gray-50">
            {entries.map((entry, idx) => {
              const currentStatus = entry.monthlyStatus[CURRENT_MONTH.toString()] || "none";
              const currentMeta = STATUS_META[currentStatus];
              return (
                <div key={idx} className="p-4">
                  {/* Crop header */}
                  <div className="flex items-center justify-between mb-3">
                    <Link href={`${base}/products/${entry.productId}`} className="flex items-center gap-3 group/link">
                      <div className="h-11 w-11 rounded-full overflow-hidden ring-2 ring-gray-100 flex-shrink-0 bg-gray-50 group-hover/link:ring-orange-300 transition-all">
                        <img src={entry.imageUrl} alt={entry.produceName} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm group-hover/link:text-orange-700 group-hover/link:underline transition-colors">{entry.produceName}</p>
                        {currentMeta ? (
                          <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full text-white ${currentMeta.bg} mt-0.5`}>
                            <currentMeta.Icon className="h-2.5 w-2.5" />
                            {currentMeta.label} now
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-400 mt-0.5 block">Off season now</span>
                        )}
                      </div>
                    </Link>
                    {/* Farm avatars */}
                    <div className="flex -space-x-1.5 flex-shrink-0">
                      {entry.farms.slice(0, 2).map((farm, fi) => (
                        <Link key={fi} href={`${base}/farmers/${farm.id}`} title={farm.name}>
                          <img src={farm.logoUrl} alt={farm.name}
                            className="h-7 w-7 rounded-full border-2 border-white object-cover bg-gray-100 hover:scale-110 hover:border-orange-300 transition-all cursor-pointer" />
                        </Link>
                      ))}
                      {entry.farms.length > 2 && (
                        <div className="h-7 w-7 rounded-full border-2 border-white bg-green-500 flex items-center justify-center">
                          <span className="text-[9px] font-bold text-white">+{entry.farms.length - 2}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Month bar — 12 mini blocks */}
                  <div className="grid grid-cols-12 gap-0.5">
                    {MONTH_SHORT.map((abbr, i) => {
                      const key = Object.keys(entry.monthlyStatus).find(k => parseInt(k) === i);
                      const status = key ? entry.monthlyStatus[key] : "none";
                      const meta = STATUS_META[status];
                      const isCurrent = i === CURRENT_MONTH;
                      return (
                        <div key={i} className="flex flex-col items-center gap-0.5">
                          <div className={`h-6 w-full rounded-sm flex items-center justify-center
                            ${isCurrent ? 'ring-2 ring-green-600 ring-offset-1' : ''}
                            ${meta ? meta.bg : 'bg-gray-100'}`}
                            title={meta ? meta.label : 'Off season'}
                          >
                            {meta
                              ? <meta.Icon className="h-2.5 w-2.5 text-white" />
                              : <span className="text-[8px] text-gray-300">—</span>}
                          </div>
                          <span className={`text-[8px] font-medium leading-none ${isCurrent ? 'text-green-700 font-bold' : 'text-gray-400'}`}>
                            {abbr}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function OrgHarvestCalendarPage({ slug }: { slug: string }) {
  const { data: org, isLoading: orgLoading, error } = useOrgData(slug);
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    navigator.clipboard.writeText(`${window.location.origin}/org/${slug}`);
    setCopied(true);
    toast({ title: "Link copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const { data: calendarEntries, isLoading: calLoading } = useQuery<FpoCalendarEntry[]>({
    queryKey: ['/api/calendar', { fpoId: org?.id }],
    queryFn: async () => {
      if (!org?.id) return [];
      const res = await fetch(`/api/calendar?fpoId=${org.id}`);
      if (!res.ok) throw new Error('Failed to fetch calendar');
      return res.json();
    },
    enabled: !!org?.id,
  });

  if (orgLoading) return <LoadingState />;
  if (error || !org) return <ErrorState />;

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <OrgNavBar org={org} activeSection="harvest" copied={copied} onCopy={copyUrl} />
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/org/${slug}`}>
            <button className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <ArrowLeft className="h-4 w-4 text-gray-600" />
            </button>
          </Link>
          <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center">
            <CalendarDays className="h-6 w-6 text-orange-700" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Harvest Calendar</h2>
            <p className="text-xs sm:text-sm text-gray-500">Seasonal crop availability from {org.orgName}'s farmers</p>
          </div>
        </div>
        <CalendarTable entries={calendarEntries || []} isLoading={calLoading} base={`/org/${slug}`} />
      </div>
      <OrgFooter org={org} />
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-green-600 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading store...</p>
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 bg-gray-50">
      <Store className="h-16 w-16 text-gray-300" />
      <h1 className="text-2xl font-bold text-gray-800">Store Not Found</h1>
      <p className="text-gray-500 text-center max-w-md">The store you're looking for doesn't exist or the URL may be incorrect.</p>
      <Link href="/fpo-stores">
        <Button className="bg-green-600 hover:bg-green-700">Browse All Stores</Button>
      </Link>
    </div>
  );
}

function EmptySearch({ term }: { term: string }) {
  return (
    <div className="text-center py-10 bg-gray-50 rounded-xl">
      <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
      <p className="text-gray-500 text-sm">No products match "{term}"</p>
    </div>
  );
}

export default function OrgPage() {
  const [location] = useLocation();
  const [, params] = useRoute("/org/:slug");
  const [, retailParams] = useRoute("/org/:slug/retail");
  const [, wholesaleParams] = useRoute("/org/:slug/wholesale");
  const [, farmersParams] = useRoute("/org/:slug/farmers-list");
  const [, eventsParams] = useRoute("/org/:slug/events-list");
  const [, harvestParams] = useRoute("/org/:slug/harvest-calendar");

  const slug = params?.slug || retailParams?.slug || wholesaleParams?.slug || farmersParams?.slug || eventsParams?.slug || harvestParams?.slug;

  if (retailParams?.slug) return <OrgRetailPage slug={retailParams.slug} />;
  if (wholesaleParams?.slug) return <OrgWholesalePage slug={wholesaleParams.slug} />;
  if (farmersParams?.slug) return <OrgFarmersPage slug={farmersParams.slug} />;
  if (eventsParams?.slug) return <OrgEventsPage slug={eventsParams.slug} />;
  if (harvestParams?.slug) return <OrgHarvestCalendarPage slug={harvestParams.slug} />;

  return <OrgLandingPage slug={slug || ''} />;
}

function OrgLandingPage({ slug }: { slug: string }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const { data: org, isLoading, error } = useOrgData(slug);

  const copyUrl = () => {
    navigator.clipboard.writeText(`${window.location.origin}/org/${slug}`);
    setCopied(true);
    toast({ title: "Link copied!", description: "Store URL copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const allProducts = org?.products || [];
  const retailProducts = allProducts.filter(p => (p.inventory ?? 0) > 0 || !p.b2bQuantity || Number(p.b2bQuantity) === 0);
  const wholesaleProducts = allProducts.filter(p => p.b2bQuantity && Number(p.b2bQuantity) > 0);

  const galleryImages = useMemo(() => {
    const images: string[] = [];
    if (!org) return images;
    if (org.orgGallery && Array.isArray(org.orgGallery)) {
      org.orgGallery.forEach(img => {
        if (img && typeof img === 'string') images.push(img);
      });
    }
    org.farmers.forEach(f => {
      if (f.farmImages && Array.isArray(f.farmImages)) {
        f.farmImages.forEach(img => {
          if (img && typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://'))) {
            images.push(img);
          }
        });
      }
    });
    return images;
  }, [org]);

  useEffect(() => {
    if (galleryImages.length > 1) {
      const interval = setInterval(() => {
        setGalleryIndex((prev) => (prev + 1) % galleryImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [galleryImages.length]);

  const displayName = org?.orgName || slug?.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "";
  const initials = displayName.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
  const base = `/org/${slug}`;

  if (isLoading) return <LoadingState />;
  if (error || !org) return <ErrorState />;

  return (
    <>
      <Helmet>
        <title>{org.orgName} - Official FPO Store | Santhe Farmers Market</title>
        <meta name="description" content={`Shop fresh produce from ${org.orgName}, ${org.district} district. ${org.products.length} products from ${org.farmers.length} local farmers.`} />
        <meta property="og:title" content={`${org.orgName} - Official FPO Store`} />
        <meta property="og:description" content={`Shop fresh produce directly from ${org.orgName}, ${org.district} district.`} />
        <meta property="og:image" content={org.orgLogoUrl || 'https://farmersanthe.com/logo-santhe.png'} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/org/${org.orgSlug}`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen bg-white pb-16 md:pb-0">
        <OrgNavBar org={org} copied={copied} onCopy={copyUrl} />

        {/* ===== HERO BANNER WITH FPO GALLERY ===== */}
        <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden bg-gray-900">
          {galleryImages.length > 0 ? (
            <>
              {galleryImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${org.orgName} gallery`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === galleryIndex ? 'opacity-100' : 'opacity-0'}`}
                />
              ))}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {galleryImages.slice(0, 8).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setGalleryIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === galleryIndex % Math.min(galleryImages.length, 8) ? 'bg-white scale-125' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
            <div className="container mx-auto flex items-end gap-4 sm:gap-6">
              {org.orgLogoUrl ? (
                <img src={org.orgLogoUrl} alt={org.orgName} className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl border-3 border-white shadow-2xl object-cover bg-white flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl border-3 border-white shadow-2xl bg-green-600 flex items-center justify-center text-white text-xl sm:text-3xl font-bold flex-shrink-0">{initials}</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">{org.orgName}</h1>
                  <Badge className="bg-green-500/80 text-white text-[10px] sm:text-xs border-0 backdrop-blur-sm">
                    <BadgeCheck className="h-3 w-3 mr-0.5" />Verified
                  </Badge>
                  {org.farmers.filter(f => f.isOrganicCertified).length > 0 && (
                    <Badge className="bg-emerald-500/80 text-white text-[10px] sm:text-xs border-0 backdrop-blur-sm">
                      <Award className="h-3 w-3 mr-0.5" />Organic Farm
                    </Badge>
                  )}
                  {org.farmers.filter(f => f.isNaturalCertified).length > 0 && (
                    <Badge className="bg-teal-500/80 text-white text-[10px] sm:text-xs border-0 backdrop-blur-sm">
                      <Award className="h-3 w-3 mr-0.5" />Natural Farm
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-white/80 text-xs sm:text-sm">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{org.district} District</span>
                  {org.orgEmail && (
                    <a href={`mailto:${org.orgEmail}`} className="flex items-center gap-1 hover:text-white transition-colors">
                      <Mail className="h-3 w-3" /><span className="hidden sm:inline">{org.orgEmail}</span>
                    </a>
                  )}
                </div>
                <div className="mt-2">
                  <FpoFollowButton dmUserId={org.id} orgName={org.orgName} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== TRUST STRIP ===== */}
        <div className="bg-green-50 border-b border-green-100">
          <div className="container mx-auto px-4 py-2.5">
            <div className="flex items-center justify-center gap-4 sm:gap-8 text-[11px] sm:text-xs text-green-700 overflow-x-auto scrollbar-hide">
              {org.farmers.filter(f => f.isOrganicCertified).length > 0 && (
                <span className="flex items-center gap-1 whitespace-nowrap font-semibold">
                  <Award className="h-3.5 w-3.5 text-emerald-600" />
                  {org.farmers.filter(f => f.isOrganicCertified).length} Organic Farm
                </span>
              )}
              {org.farmers.filter(f => f.isNaturalCertified).length > 0 && (
                <span className="flex items-center gap-1 whitespace-nowrap font-semibold">
                  <Award className="h-3.5 w-3.5 text-teal-600" />
                  {org.farmers.filter(f => f.isNaturalCertified).length} Natural Farm
                </span>
              )}
              <span className="flex items-center gap-1 whitespace-nowrap"><Shield className="h-3.5 w-3.5 text-green-600" />Quality Assured</span>
              <span className="flex items-center gap-1 whitespace-nowrap"><Truck className="h-3.5 w-3.5 text-green-600" />Farm Fresh</span>
              <span className="flex items-center gap-1 whitespace-nowrap"><Leaf className="h-3.5 w-3.5 text-green-600" />Naturally Grown</span>
              <span className="flex items-center gap-1 whitespace-nowrap"><Heart className="h-3.5 w-3.5 text-green-600" />Support Local</span>
            </div>
          </div>
        </div>

        {/* ===== CAROUSEL SECTIONS ===== */}
        <div className="space-y-0">

          {retailProducts.length > 0 && (
            <section className="py-8 sm:py-14 bg-gradient-to-br from-gray-50 to-green-50">
              <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="mb-6 sm:mb-10">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <ShoppingBag className="h-5 w-5 sm:h-8 sm:w-8 text-green-600" />
                    <h2 className="text-xl sm:text-3xl font-bold text-gray-900">Retail Products</h2>
                  </div>
                  <p className="text-sm sm:text-lg text-gray-600">Fresh produce directly from our farmers</p>
                </div>
                <Carousel
                  opts={{ align: "start", loop: true }}
                  plugins={[Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })]}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {retailProducts.map(product => (
                      <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/2 lg:basis-1/3">
                        <div className="transform hover:scale-105 transition-transform duration-300">
                          <ProductCard product={product} orgSlug={org.orgSlug} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-white/80 hover:bg-white" />
                  <CarouselNext className="right-0 bg-white/80 hover:bg-white" />
                </Carousel>
                <div className="flex justify-center mt-8">
                  <Link href={`${base}/retail`}>
                    <Button variant="outline" size="lg" className="flex items-center gap-2 hover:bg-green-50 border-green-200 text-green-700">
                      View All Retail Products <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          )}

          {wholesaleProducts.length > 0 && (
            <section className="py-8 sm:py-14 bg-gradient-to-br from-orange-50 to-amber-50">
              <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="mb-6 sm:mb-10">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <Package className="h-5 w-5 sm:h-8 sm:w-8 text-orange-600" />
                    <h2 className="text-xl sm:text-3xl font-bold text-gray-900">Wholesale Products</h2>
                  </div>
                  <p className="text-sm sm:text-lg text-gray-600">Bulk orders at competitive prices</p>
                </div>
                <Carousel
                  opts={{ align: "start", loop: true }}
                  plugins={[Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })]}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {wholesaleProducts.map(product => (
                      <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/2 lg:basis-1/3">
                        <div className="transform hover:scale-105 transition-transform duration-300">
                          <ProductCard product={product} displayMode="b2b" orgSlug={org.orgSlug} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-white/80 hover:bg-white" />
                  <CarouselNext className="right-0 bg-white/80 hover:bg-white" />
                </Carousel>
                <div className="flex justify-center mt-8">
                  <Link href={`${base}/wholesale`}>
                    <Button variant="outline" size="lg" className="flex items-center gap-2 hover:bg-orange-50 border-orange-200 text-orange-700">
                      View All Wholesale Products <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          )}

          {org.events && org.events.length > 0 && (
            <section className="py-8 sm:py-14 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="mb-6 sm:mb-10">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <Calendar className="h-5 w-5 sm:h-8 sm:w-8 text-blue-600" />
                    <h2 className="text-xl sm:text-3xl font-bold text-gray-900">Upcoming Events</h2>
                  </div>
                  <p className="text-sm sm:text-lg text-gray-600">{org.events.length} events to explore</p>
                </div>
                <Carousel
                  opts={{ align: "start", loop: true }}
                  plugins={[Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {org.events.map(event => (
                      <CarouselItem key={event.id} className="pl-2 md:pl-4 basis-1/2 lg:basis-1/3">
                        <div className="transform hover:scale-105 transition-transform duration-300">
                          <EventCard event={event} orgSlug={org.orgSlug} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-white/80 hover:bg-white" />
                  <CarouselNext className="right-0 bg-white/80 hover:bg-white" />
                </Carousel>
                <div className="flex justify-center mt-8">
                  <Link href={`${base}/events-list`}>
                    <Button variant="outline" size="lg" className="flex items-center gap-2 hover:bg-blue-50 border-blue-200 text-blue-700">
                      View All Events <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          )}

          {org.farmers.length > 0 && (
            <section className="py-8 sm:py-14 bg-gradient-to-br from-emerald-50 to-teal-50">
              <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="mb-6 sm:mb-10">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <Users className="h-5 w-5 sm:h-8 sm:w-8 text-emerald-600" />
                    <h2 className="text-xl sm:text-3xl font-bold text-gray-900">Our Farmers</h2>
                  </div>
                  <p className="text-sm sm:text-lg text-gray-600">{org.farmers.length} farmers in this FPO</p>
                </div>
                <Carousel
                  opts={{ align: "start", loop: true }}
                  plugins={[Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })]}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {org.farmers.map(farmer => (
                      <CarouselItem key={farmer.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/2 lg:basis-1/3">
                        <div className="transform hover:scale-105 transition-transform duration-300">
                          <OrgFarmerCard farmer={farmer} orgSlug={org.orgSlug} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-white/80 hover:bg-white" />
                  <CarouselNext className="right-0 bg-white/80 hover:bg-white" />
                </Carousel>
                <div className="flex justify-center mt-8">
                  <Link href={`${base}/farmers-list`}>
                    <Button variant="outline" size="lg" className="flex items-center gap-2 hover:bg-emerald-50 border-emerald-200 text-emerald-700">
                      View All Farmers <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          )}

          {allProducts.length === 0 && org.farmers.length === 0 && (!org.events || org.events.length === 0) && (
            <div className="text-center py-16 px-4">
              <Store className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700">Coming Soon</h2>
              <p className="text-gray-500 mt-2 text-sm">This store is setting up. Check back soon!</p>
            </div>
          )}

          {/* Harvest Calendar Section */}
          <OrgLandingCalendarSection org={org} base={base} />

          {/* Store Reviews Section */}
          {org.fpoFarmerId && (
            <OrgStoreReviews org={org} />
          )}
        </div>

        <OrgFooter org={org} />
      </div>
    </>
  );
}

// ─── Harvest Calendar Section for Org Landing Page ──────────────────────────

function OrgLandingCalendarSection({ org, base }: { org: OrgData; base: string }) {
  const { data: entries, isLoading } = useQuery<FpoCalendarEntry[]>({
    queryKey: ['/api/calendar', { fpoId: org.id, preview: true }],
    queryFn: async () => {
      const res = await fetch(`/api/calendar?fpoId=${org.id}&preview=true`);
      if (!res.ok) throw new Error('Failed to fetch calendar');
      return res.json();
    },
  });

  if (!isLoading && (!entries || entries.length === 0)) return null;

  return (
    <section className="py-8 sm:py-14 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <CalendarDays className="h-5 w-5 sm:h-7 sm:w-7 text-orange-600" />
              <h2 className="text-xl sm:text-3xl font-bold text-gray-900">Harvest Calendar</h2>
            </div>
            <p className="text-sm text-gray-500">When each crop is growing, harvesting, or available to order</p>
          </div>
          <Link href={`${base}/harvest-calendar`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 hover:bg-orange-50 border-orange-200 text-orange-700 self-start sm:self-auto">
              View Full Calendar <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <CalendarTable entries={entries || []} isLoading={isLoading} base={base} />
      </div>
    </section>
  );
}

// ─── Store Reviews Section for Org Landing Page ─────────────────────────────

interface FpoReview {
  id: number;
  type: 'product' | 'farmer';
  contextName: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface FpoReviewsData {
  reviews: FpoReview[];
  avgRating: string;
  totalCount: number;
}

function OrgStoreReviews({ org }: { org: OrgData }) {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, refetch } = useQuery<FpoReviewsData>({
    queryKey: [`/api/fpo/${org.id}/reviews`],
    queryFn: async () => {
      const res = await fetch(`/api/fpo/${org.id}/reviews`);
      if (!res.ok) throw new Error('Failed to fetch reviews');
      return res.json();
    },
    staleTime: 0,
  });

  const reviews = data?.reviews || [];
  const avgRating = parseFloat(data?.avgRating || '0');
  const totalCount = data?.totalCount || 0;

  const renderStars = (rating: number) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}`} />
      ))}
    </div>
  );

  const avatarInitial = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f59e0b&color=fff&size=40`;

  return (
    <section className="py-8 sm:py-14 bg-gradient-to-br from-amber-50 to-yellow-50">
      <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-1">
              <Star className="h-5 w-5 sm:h-7 sm:w-7 text-amber-500 fill-amber-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Store Reviews</h2>
            </div>
            <p className="text-sm text-gray-600">What customers say about {org.orgName}</p>
          </div>
          {avgRating > 0 && (
            <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-amber-100">
              <div className="text-3xl font-bold text-amber-600">{avgRating}</div>
              <div>
                <div className="flex text-amber-400 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(avgRating) ? 'fill-amber-400' : 'fill-none'}`} />
                  ))}
                </div>
                <p className="text-xs text-gray-500">{totalCount} review{totalCount !== 1 ? 's' : ''}</p>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-4 sm:p-6 space-y-4">
            {reviews.length === 0 ? (
              <p className="text-center text-gray-500 py-6 text-sm">
                No reviews yet. Be the first to review a product from {org.orgName}!
              </p>
            ) : (
              <div className="space-y-5">
                {reviews.map((review) => (
                  <div key={review.id} className="flex gap-3 pb-5 border-b border-gray-50 last:border-0 last:pb-0">
                    <img
                      src={avatarInitial(review.reviewerName)}
                      alt={review.reviewerName}
                      className="w-9 h-9 rounded-full flex-shrink-0 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1">
                        <span className="font-medium text-sm text-gray-900">{review.reviewerName}</span>
                        <span className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full truncate max-w-[140px]">
                          {review.contextName}
                        </span>
                        <span className="text-xs text-gray-400 ml-auto">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      {renderStars(review.rating)}
                      {review.comment && (
                        <p className="text-sm text-gray-700 mt-1.5 leading-relaxed">{review.comment}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {org.fpoFarmerId && (
              <div className="pt-2 border-t border-gray-100">
                {user ? (
                  showForm ? (
                    <ReviewForm
                      entityId={org.fpoFarmerId}
                      entityType="farmer"
                      onSuccess={() => { setShowForm(false); refetch(); }}
                    />
                  ) : (
                    <Button
                      onClick={() => setShowForm(true)}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Write a Review
                    </Button>
                  )
                ) : (
                  <div className="text-center py-3">
                    <p className="text-sm text-gray-500 mb-2">Log in to leave a review</p>
                    <Link href="/login">
                      <Button variant="outline" size="sm">Log In</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
