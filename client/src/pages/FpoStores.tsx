import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, MapPin, Building2, Store, Search, Award, Heart, Users, Star, MessageSquare, Zap } from "lucide-react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useDistrict } from "@/hooks/use-district";
import { apiRequest } from "@/lib/queryClient";

interface OrgInfo {
  id: number;
  orgName: string;
  orgSlug: string;
  orgLogoUrl: string;
  district: string;
  organicCertifiedCount?: number;
  totalFarmers?: number;
  followerCount?: number;
  avgRating?: string | null;
  reviewCount?: number;
}

interface FpoReview {
  id: number;
  type: 'product' | 'farmer_profile';
  contextName: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface FpoReviewsResponse {
  reviews: FpoReview[];
  avgRating: string;
  totalCount: number;
}

function FpoFollowButton({ dmUserId, className }: { dmUserId: number; className?: string }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: followData, isLoading } = useQuery({
    queryKey: ['/api/fpo', dmUserId, 'is-following'],
    queryFn: async () => {
      const res = await fetch(`/api/fpo/${dmUserId}/is-following`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) return { isFollowing: false };
      return res.json();
    },
    enabled: !!user,
  });

  const toggleFollowMutation = useMutation({
    mutationFn: async () => {
      const isFollowing = followData?.isFollowing;
      if (isFollowing) {
        return apiRequest("DELETE", `/api/fpo/${dmUserId}/follow`);
      } else {
        return apiRequest("POST", `/api/fpo/${dmUserId}/follow`);
      }
    },
    onSuccess: async (response) => {
      const data = await response.json();
      queryClient.invalidateQueries({ queryKey: ['/api/fpo', dmUserId, 'is-following'] });
      queryClient.invalidateQueries({ queryKey: ['/api/orgs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/fpo', dmUserId, 'followers'] });
      toast({
        title: "Success",
        description: data.isFollowing ? "You are now following this store!" : "You have unfollowed this store.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to follow FPO stores",
        variant: "destructive",
      });
      return;
    }
    toggleFollowMutation.mutate();
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled className={`h-8 w-8 p-0 rounded-full ${className || ''}`}>
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      </Button>
    );
  }

  const isFollowing = followData?.isFollowing ?? false;
  const isPending = toggleFollowMutation.isPending;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      className={`h-8 w-8 p-0 rounded-full transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:scale-110 ${
        isFollowing ? 'text-red-600 bg-red-50' : ''
      } ${className || ''}`}
      title={isFollowing ? 'Unfollow store' : 'Follow store'}
    >
      {isPending ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <Heart
          className={`h-5 w-5 transition-all duration-200 ${
            isFollowing ? 'fill-current text-red-600' : ''
          }`}
        />
      )}
    </Button>
  );
}

function StarDisplay({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'xs' }) {
  const iconClass = size === 'xs' ? 'h-2.5 w-2.5' : 'h-3 w-3';
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${iconClass} ${s <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
        />
      ))}
    </span>
  );
}

function FpoStoreCard({ org }: { org: OrgInfo }) {
  const [showFollowers, setShowFollowers] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const { user } = useAuth();

  const displayName = org.orgName || org.orgSlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const followerCount = org.followerCount ?? 0;
  const reviewCount = org.reviewCount ?? 0;
  const avgRating = org.avgRating ? parseFloat(org.avgRating) : 0;

  const { data: followers, isLoading: followersLoading } = useQuery<{ name: string }[]>({
    queryKey: ['/api/fpo', org.id, 'followers'],
    queryFn: async () => {
      const res = await fetch(`/api/fpo/${org.id}/followers`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: showFollowers,
  });

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery<FpoReviewsResponse>({
    queryKey: ['/api/fpo', org.id, 'reviews'],
    queryFn: async () => {
      const res = await fetch(`/api/fpo/${org.id}/reviews`);
      if (!res.ok) return { reviews: [], avgRating: '0.0', totalCount: 0 };
      return res.json();
    },
    enabled: showReviews,
  });

  return (
    <div className="relative h-full">
      {user && (
        <div className="absolute top-3 right-3 z-10">
          <FpoFollowButton dmUserId={org.id} />
        </div>
      )}

      <Link href={`/org/${org.orgSlug}`}>
        <Card className="group cursor-pointer overflow-hidden border border-gray-200 hover:border-green-400 hover:shadow-xl transition-all duration-300 h-full">
          <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 sm:p-6 flex flex-col items-center text-center">
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
              <Badge variant="secondary" className="bg-green-100 text-green-700 text-[10px] sm:text-xs px-1.5 sm:px-2">
                <Store className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                Official Store
              </Badge>
            </div>

            {org.orgLogoUrl ? (
              <img
                src={org.orgLogoUrl}
                alt={displayName}
                className="w-14 h-14 sm:w-20 sm:h-20 rounded-lg object-cover border-2 border-white shadow-md mb-3 sm:mb-4 mt-4 sm:mt-2"
              />
            ) : (
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-lg sm:text-2xl font-bold border-2 border-white shadow-md mb-3 sm:mb-4 mt-4 sm:mt-2">
                {initials}
              </div>
            )}

            <h3 className="text-sm sm:text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2 mb-1 sm:mb-2">
              {displayName}
            </h3>

            {org.district && (
              <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-500" />
                <span>{org.district} District</span>
              </div>
            )}

            {(org.organicCertifiedCount ?? 0) > 0 && (
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200 text-[10px] sm:text-xs px-2 py-0.5 mt-2">
                <Award className="h-3 w-3 mr-0.5" />
                {org.organicCertifiedCount} Organic
              </Badge>
            )}
          </div>
          <CardContent className="p-3 sm:p-4 bg-white">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-xs sm:text-sm font-medium text-green-700">
                  Visit Store
                </span>
                {(org.totalFarmers ?? 0) > 0 && (
                  <span className="text-[10px] sm:text-xs text-gray-400">
                    {org.totalFarmers} {org.totalFarmers === 1 ? 'farmer' : 'farmers'}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Followers + Reviews row — floated over the bottom of the image area */}
      <div className="absolute bottom-[52px] sm:bottom-[60px] left-3 right-3 sm:left-4 sm:right-4 z-10 flex items-center justify-between gap-1">
        {/* Followers dialog */}
        <Dialog open={showFollowers} onOpenChange={setShowFollowers}>
          <DialogTrigger asChild>
            <button
              className="flex items-center text-gray-500 text-[10px] sm:text-xs hover:text-green-600 transition-colors cursor-pointer bg-white/80 backdrop-blur-sm rounded-full px-2 py-0.5"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowFollowers(true); }}
            >
              <Users className="h-3 w-3 mr-1" />
              <span className="hover:underline">{followerCount} {followerCount === 1 ? 'follower' : 'followers'}</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Followers of {displayName}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[300px] pr-4">
              {followersLoading ? (
                <div className="py-4 text-center text-gray-500">Loading followers...</div>
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
                <div className="py-4 text-center text-gray-500">No followers yet</div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Reviews dialog — shown only when there are reviews */}
        {reviewCount > 0 && (
          <Dialog open={showReviews} onOpenChange={setShowReviews}>
            <DialogTrigger asChild>
              <button
                className="flex items-center gap-1 text-gray-500 text-[10px] sm:text-xs hover:text-yellow-600 transition-colors cursor-pointer bg-white/80 backdrop-blur-sm rounded-full px-2 py-0.5"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowReviews(true); }}
              >
                <StarDisplay rating={avgRating} size="xs" />
                <span className="hover:underline ml-0.5">{org.avgRating} ({reviewCount})</span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg" onClick={(e) => e.stopPropagation()}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  Reviews for {displayName}
                </DialogTitle>
              </DialogHeader>

              {/* Aggregate header */}
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100 mb-2">
                <div className="text-3xl font-bold text-gray-900">
                  {reviewsData?.avgRating || org.avgRating || '—'}
                </div>
                <div className="flex flex-col gap-1">
                  <StarDisplay rating={parseFloat(reviewsData?.avgRating || org.avgRating || '0')} />
                  <span className="text-xs text-gray-500">
                    {reviewsData?.totalCount ?? reviewCount} {(reviewsData?.totalCount ?? reviewCount) === 1 ? 'review' : 'reviews'}
                  </span>
                </div>
              </div>

              <ScrollArea className="max-h-[480px] pr-2">
                {reviewsLoading ? (
                  <div className="py-6 text-center text-gray-500 flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading reviews...
                  </div>
                ) : reviewsData && reviewsData.reviews.length > 0 ? (
                  <ul className="space-y-3">
                    {reviewsData.reviews.map((review) => (
                      <li key={review.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-green-700 font-semibold text-xs">
                                {review.reviewerName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-800">{review.reviewerName}</span>
                              <div className="flex items-center gap-1 mt-0.5">
                                <StarDisplay rating={review.rating} size="xs" />
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-gray-400 flex-shrink-0">
                            {new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-1 italic">on {review.contextName}</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-6 text-center text-gray-500">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    No reviews yet
                  </div>
                )}
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

export default function FpoStores() {
  const [searchTerm, setSearchTerm] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const { selectedDistrictId } = useDistrict();
  const { user } = useAuth();
  const effectiveDistrictId = selectedDistrictId || user?.districtId || null;

  const { data: orgs, isLoading, isError } = useQuery<OrgInfo[]>({
    queryKey: ["/api/orgs", { deliveryDistrictId: effectiveDistrictId || undefined }],
  });

  const districts = orgs
    ? Array.from(new Set(orgs.map((o) => o.district).filter(Boolean))).sort()
    : [];

  const filteredOrgs = orgs?.filter((org) => {
    const displayName = org.orgName || org.orgSlug.replace(/-/g, " ");
    const matchesSearch =
      !searchTerm ||
      displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (org.district && org.district.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDistrict =
      districtFilter === "all" || org.district === districtFilter;
    return matchesSearch && matchesDistrict;
  });

  return (
    <>
      <Helmet>
        <title>FPO Stores - Farmer Producer Organizations | FarmerSanthe</title>
        <meta
          name="description"
          content="Browse official stores of Farmer Producer Organizations (FPOs) on FarmerSanthe. Shop fresh produce directly from local FPOs across India."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-teal-700 via-emerald-700 to-green-700 text-white py-8 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4 sm:mb-6">
                <Store className="h-7 w-7 sm:h-10 sm:w-10" />
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">FPO Stores</h1>
              <p className="text-sm sm:text-xl text-teal-100 max-w-3xl mx-auto mb-4 sm:mb-8">
                Shop directly from Farmer Producer Organizations. Each store is managed by a local FPO, bringing you farm-fresh produce with fair pricing. Follow stores to get notified about new products!
              </p>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full">
                  <Building2 className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                  <span>Government Registered FPOs</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full">
                  <Award className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                  <span>Quality Assured</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full">
                  <Users className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                  <span>5000+ Farmers</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full">
                  <Star className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                  <span>Zero Middlemen</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <div className="bg-white rounded-xl shadow-sm border p-3 sm:p-4 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search FPO stores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>

              <Select value={districtFilter} onValueChange={setDistrictFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="All Districts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {districts.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              <span className="ml-3 text-gray-500">Loading FPO stores...</span>
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                Unable to load FPO stores. Please try again later.
              </p>
            </div>
          ) : !filteredOrgs || filteredOrgs.length === 0 ? (
            <div className="text-center py-20">
              <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm || districtFilter !== "all"
                  ? "No stores match your filters. Try adjusting your search."
                  : "No FPO stores available yet. Check back soon!"}
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
                {filteredOrgs.length} FPO store{filteredOrgs.length !== 1 ? "s" : ""} available
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {filteredOrgs.map((org) => (
                  <FpoStoreCard key={org.id} org={org} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
