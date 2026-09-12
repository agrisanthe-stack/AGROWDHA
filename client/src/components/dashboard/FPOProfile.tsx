import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Building, Phone, Mail, MapPin, CreditCard, Loader2, AlertCircle,
  User, Upload, X, Image as ImageIcon, Globe, Star, ExternalLink,
  Instagram, Youtube, Save, Eye
} from "lucide-react";
import { Link } from "wouter";
import { getAuthToken } from "@/lib/auth";

interface DMProfileData {
  id: number;
  name: string;
  email: string;
  phone: string;
  district: string;
  orgName: string;
  orgAddress: string;
  orgPhone: string;
  orgEmail: string;
  orgLogoUrl: string;
  bankAccountNumber: string;
  bankIfsc: string;
  gstNumber: string;
  upiId: string;
}

interface FPOFarmerProfile {
  id: number;
  farmName: string;
  description: string;
  location: string;
  address: string;
  website: string;
  logoUrl: string;
  farmImages: string[];
  instagramReels: string;
  youtube: string;
  rating: string;
  reviewCount: number;
  reviews: Array<{
    id: number;
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
}

export default function FPOProfile() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [farmName, setFarmName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [instagramReels, setInstagramReels] = useState("");
  const [youtube, setYoutube] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const { data: profile, isLoading: profileLoading } = useQuery<DMProfileData>({
    queryKey: ["/api/dm/profile"],
  });

  const { data: fpoFarmer, isLoading: farmerLoading } = useQuery<FPOFarmerProfile>({
    queryKey: ["/api/dm/fpo-farmer-profile"],
  });

  useEffect(() => {
    if (fpoFarmer) {
      setFarmName(fpoFarmer.farmName || "");
      setDescription(fpoFarmer.description || "");
      setWebsite(fpoFarmer.website || "");
      setInstagramReels(fpoFarmer.instagramReels || "");
      setYoutube(fpoFarmer.youtube || "");
      if (fpoFarmer.farmImages && Array.isArray(fpoFarmer.farmImages)) {
        setUploadedImages(fpoFarmer.farmImages);
      }
    }
  }, [fpoFarmer]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setNewFiles(prev => [...prev, ...files]);
    }
  };

  const handleRemoveNewFile = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (newFiles.length === 0) return [];
    setIsUploading(true);
    const formData = new FormData();
    newFiles.forEach(file => formData.append('images', file));

    try {
      const token = getAuthToken();
      const response = await fetch('/api/farmers/images', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        credentials: 'include',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload images');
      const data = await response.json();
      setIsUploading(false);
      setNewFiles([]);
      return data.imageUrls || [];
    } catch (error) {
      setIsUploading(false);
      toast({ title: "Error", description: "Failed to upload images.", variant: "destructive" });
      return [];
    }
  };

  const handleSaveProfile = async () => {
    setIsSubmitting(true);
    try {
      const newImageUrls = await uploadImages();
      const allImages = [...uploadedImages, ...newImageUrls];

      const token = getAuthToken();
      const response = await fetch('/api/dm/fpo-farmer-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          farmName,
          description,
          website,
          instagramReels,
          youtube,
          farmImages: allImages,
        }),
      });

      if (!response.ok) throw new Error('Failed to update FPO profile');
      const updated = await response.json();

      queryClient.invalidateQueries({ queryKey: ["/api/dm/fpo-farmer-profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dm/profile"] });

      if (updated.farmImages && Array.isArray(updated.farmImages)) {
        setUploadedImages(updated.farmImages);
      }

      toast({ title: "Profile Updated", description: "Your FPO profile has been saved successfully." });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save profile.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = profileLoading || farmerLoading;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>FPO Profile</CardTitle>
          <CardDescription>Loading your organization profile...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const rating = parseFloat(fpoFarmer?.rating || "0");

  return (
    <div className="space-y-6">
      <Tabs defaultValue="details">
        <TabsList className="mb-4 w-full grid grid-cols-4 bg-gradient-to-r from-blue-100 to-indigo-100 p-1.5 rounded-xl shadow-md border-2 border-blue-200">
          <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-lg data-[state=active]:font-semibold text-gray-600 font-medium py-2.5 rounded-lg transition-all">
            <Building className="h-4 w-4 mr-2" />
            Details
          </TabsTrigger>
          <TabsTrigger value="images" className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-lg data-[state=active]:font-semibold text-gray-600 font-medium py-2.5 rounded-lg transition-all">
            <ImageIcon className="h-4 w-4 mr-2" />
            Images
          </TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-lg data-[state=active]:font-semibold text-gray-600 font-medium py-2.5 rounded-lg transition-all">
            <Globe className="h-4 w-4 mr-2" />
            Social Media
          </TabsTrigger>
          <TabsTrigger value="reviews" className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-lg data-[state=active]:font-semibold text-gray-600 font-medium py-2.5 rounded-lg transition-all">
            <Star className="h-4 w-4 mr-2" />
            Reviews
          </TabsTrigger>
        </TabsList>

        {/* Organization Details Tab */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    FPO Organization Profile
                  </CardTitle>
                  <CardDescription>
                    Manage your FPO organization details visible to customers.
                  </CardDescription>
                </div>
                {fpoFarmer && (
                  <Link href={`/farmers/${fpoFarmer.id}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      View Public Profile
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                {profile?.orgLogoUrl ? (
                  <img
                    src={profile.orgLogoUrl}
                    alt={profile.orgName || "FPO Logo"}
                    className="w-20 h-20 rounded-lg object-cover border"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center border">
                    <Building className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{profile?.orgName || "Organization name not set"}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      {profile?.district || "District not assigned"}
                    </Badge>
                    {fpoFarmer && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="h-3 w-3 mr-1 text-amber-500" />
                        {rating.toFixed(1)} ({fpoFarmer.reviewCount} reviews)
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  District Manager Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-sm font-medium">{profile?.name || "Not set"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm">{profile?.email || "Not set"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-sm">{profile?.phone || "Not set"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">District</label>
                    <p className="text-sm">{profile?.district || "Not assigned"}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Organization Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">FPO / Organization Name</label>
                    <Input
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      placeholder="Enter organization name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Organization Email
                    </label>
                    <p className="text-sm">{profile?.orgEmail || "Not set"}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Organization Phone
                    </label>
                    <p className="text-sm">{profile?.orgPhone || "Not set"}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Organization Address
                    </label>
                    <p className="text-sm">{profile?.orgAddress || "Not set"}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">About / Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your FPO organization, mission, products, and services..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">This description is shown on your public FPO profile page.</p>
              </div>

              <Button onClick={handleSaveProfile} disabled={isSubmitting} className="gap-2">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50/50 mt-6">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-amber-800 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Banking & Financial Details
                  </h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Banking and financial details (bank account, IFSC code, GST number, UPI ID) are managed by the admin for security purposes.
                    Please contact the admin to view or update your banking information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                FPO Gallery
              </CardTitle>
              <CardDescription>
                Upload images of your FPO organization, warehouse, products, team, and facilities. These are shown on your public profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Uploaded Images */}
              {uploadedImages.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-3">Current Images ({uploadedImages.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {uploadedImages.map((url, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden border h-36">
                        <img
                          src={url}
                          alt={`FPO image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.src = "https://placehold.co/400x300?text=Image+Error"; }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveUploadedImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Files Preview */}
              {newFiles.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-3">New Images to Upload ({newFiles.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {newFiles.map((file, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden border h-36 bg-gray-50">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewFile(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1 truncate">
                          {file.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Add Images
                </Button>
                <span className="text-sm text-muted-foreground">
                  Upload photos of your organization (JPG, PNG - max 10 images)
                </span>
              </div>

              {(newFiles.length > 0 || uploadedImages.length !== (fpoFarmer?.farmImages?.length || 0)) && (
                <Button onClick={handleSaveProfile} disabled={isSubmitting || isUploading} className="gap-2">
                  {isSubmitting || isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {isUploading ? "Uploading..." : "Save Images"}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Social Media & Links
              </CardTitle>
              <CardDescription>
                Add your social media profiles and website links to connect with customers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-600" />
                  Website URL
                </label>
                <Input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.yourfpo.com"
                />
                <p className="text-xs text-muted-foreground">Your organization's website link</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-pink-600" />
                  Instagram Posts / Reels
                </label>
                <Textarea
                  value={instagramReels}
                  onChange={(e) => setInstagramReels(e.target.value)}
                  placeholder="https://www.instagram.com/reel/abc123&#10;https://www.instagram.com/p/xyz456"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">Add Instagram post or reel URLs (one per line). These will be displayed on your public profile.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Youtube className="h-4 w-4 text-red-600" />
                  YouTube Videos
                </label>
                <Textarea
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=abc123&#10;https://youtu.be/xyz456"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">Add YouTube video URLs (one per line). Videos will appear in your FPO gallery.</p>
              </div>

              {/* Preview of linked social media */}
              {(instagramReels || youtube || website) && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium mb-3">Linked Accounts Preview</h4>
                    <div className="flex flex-wrap gap-2">
                      {website && (
                        <a href={website} target="_blank" rel="noopener noreferrer">
                          <Badge variant="outline" className="gap-1 cursor-pointer hover:bg-blue-50">
                            <Globe className="h-3 w-3 text-blue-600" />
                            Website
                            <ExternalLink className="h-3 w-3" />
                          </Badge>
                        </a>
                      )}
                      {instagramReels && instagramReels.split('\n').filter(u => u.trim()).map((url, i) => (
                        <a key={i} href={url.trim()} target="_blank" rel="noopener noreferrer">
                          <Badge variant="outline" className="gap-1 cursor-pointer hover:bg-pink-50">
                            <Instagram className="h-3 w-3 text-pink-600" />
                            {url.includes('/reel/') ? `Reel ${i + 1}` : `Post ${i + 1}`}
                            <ExternalLink className="h-3 w-3" />
                          </Badge>
                        </a>
                      ))}
                      {youtube && youtube.split('\n').filter(u => u.trim()).map((url, i) => (
                        <a key={i} href={url.trim()} target="_blank" rel="noopener noreferrer">
                          <Badge variant="outline" className="gap-1 cursor-pointer hover:bg-red-50">
                            <Youtube className="h-3 w-3 text-red-600" />
                            Video {i + 1}
                            <ExternalLink className="h-3 w-3" />
                          </Badge>
                        </a>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Button onClick={handleSaveProfile} disabled={isSubmitting} className="gap-2">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Social Links
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <DmReviewsTab fpoFarmer={fpoFarmer} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Consolidated DM Reviews Tab ───────────────────────────────────────────

interface DmReview {
  id: number;
  type: 'product' | 'farmer_profile';
  contextName: string;
  productId: number | null;
  farmerId: number | null;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerAvatar: string | null;
  createdAt: string;
}

interface DmReviewsResponse {
  reviews: DmReview[];
  totalCount: number;
  avgRating: number;
}

function DmReviewsTab({ fpoFarmer }: { fpoFarmer: FPOFarmerProfile | undefined }) {
  const [filter, setFilter] = useState<'all' | 'product' | 'farmer_profile'>('all');

  const { data, isLoading } = useQuery<DmReviewsResponse>({
    queryKey: ['/api/dm/reviews'],
    queryFn: async () => {
      const token = getAuthToken();
      const res = await fetch('/api/dm/reviews', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to load reviews');
      return res.json();
    },
  });

  const filtered = (data?.reviews || []).filter(r => filter === 'all' || r.type === filter);
  const avgRating = data?.avgRating || 0;
  const totalCount = data?.totalCount || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              Customer Reviews & Ratings
            </CardTitle>
            <CardDescription>
              All reviews across your products, FPO-listed products, and farmer profiles.
            </CardDescription>
          </div>
          {totalCount > 0 && (
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{avgRating.toFixed(1)}</div>
              <div className="flex justify-center text-amber-400 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(avgRating) ? 'fill-amber-400' : 'fill-none'}`} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{totalCount} total reviews</p>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {(['all', 'product', 'farmer_profile'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === f
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? `All (${totalCount})` : f === 'product' ? `Products (${(data?.reviews || []).filter(r => r.type === 'product').length})` : `Farmer Profiles (${(data?.reviews || []).filter(r => r.type === 'farmer_profile').length})`}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map(review => (
              <div key={`${review.type}-${review.id}`} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {review.reviewerAvatar ? (
                        <img src={review.reviewerAvatar} alt={review.reviewerName} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <span className="text-blue-700 font-medium text-sm">
                          {review.reviewerName?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{review.reviewerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-amber-400' : 'fill-none'}`} />
                      ))}
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      review.type === 'product'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {review.type === 'product' ? '🛒 Product' : '👤 Farmer Profile'}
                    </span>
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-500 mb-1">
                  {review.type === 'product' ? '📦' : '🌾'} {review.contextName}
                </p>
                <p className="text-sm text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-600 mb-1">No Reviews Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Reviews left on your products and farmer profiles will appear here.
            </p>
            {fpoFarmer && (
              <Link href={`/farmers/${fpoFarmer.id}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye className="h-4 w-4" />
                  View Public Profile
                </Button>
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
