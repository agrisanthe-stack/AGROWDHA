import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { getAuthToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { X, Upload, Loader2, MapPin, Navigation } from "lucide-react";
import AvatarUpload from "@/components/user/AvatarUpload";

const farmerProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional().default(""),
  farmName: z.string().min(2, "Farm name must be at least 2 characters"),
  location: z.string().optional().default(""),
  description: z.string().optional().default(""),
  address: z.string().optional().default(""),
  website: z.string().optional().default(""),
  instagramReels: z.string().optional(),
  youtube: z.string().optional(),
  story: z.string().optional(),
  practices: z.string().optional(),
  tags: z.string().optional(),
  logoUrl: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

type FarmerProfileFormValues = z.infer<typeof farmerProfileSchema>;

// Define the farmer profile data type
interface FarmerProfileData {
  id: number;
  userId: number;
  name: string;
  email: string;
  farmName: string;
  description: string;
  location: string;
  address: string;
  phone: string;
  website?: string;
  story?: string;
  practices?: string;
  tags?: string[];
  logoUrl?: string;
  farmImages?: string[];
  instagramReels?: string;
  youtube?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export default function FarmerProfileNew() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [farmImages, setFarmImages] = useState<File[]>([]);
  const [uploadedFarmImages, setUploadedFarmImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentCoordinates, setCurrentCoordinates] = useState<{latitude: number, longitude: number} | null>(null);
  const [showLocationChangeModal, setShowLocationChangeModal] = useState(false);
  const [locationChangeRequest, setLocationChangeRequest] = useState<{
    requestedLatitude: number;
    requestedLongitude: number;
    currentLatitude: number;
    currentLongitude: number;
  } | null>(null);

  // Fetch farmer profile data
  const { data: profile, isLoading, isError } = useQuery<FarmerProfileData>({
    queryKey: ["/api/farmers/profile"],
    enabled: true,
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  // Initialize form with Zod schema
  const form = useForm<FarmerProfileFormValues>({
    resolver: zodResolver(farmerProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      farmName: "",
      location: "",
      description: "",
      address: "",
      website: "",
      instagramReels: "",
      youtube: "",
      story: "",
      practices: "",
      tags: "",
      logoUrl: "",
      latitude: undefined,
      longitude: undefined,
    },
  });

  // Update form when profile data is loaded
  useEffect(() => {
    if (profile) {
      console.log("Setting form data from profile:", profile);
      console.log("Farm images type:", typeof profile.farmImages);
      console.log("Farm images:", profile.farmImages);
      console.log("Tags type:", typeof profile.tags);
      console.log("Tags:", profile.tags);
      
      // Handle tags conversion properly
      let tagsString = "";
      if (profile.tags) {
        if (Array.isArray(profile.tags)) {
          tagsString = profile.tags.join(", ");
        } else if (typeof profile.tags === 'string') {
          tagsString = profile.tags;
        }
      }
      
      form.reset({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        farmName: profile.farmName || "",
        location: profile.location || "",
        description: profile.description || "",
        address: profile.address || "",
        website: profile.website || "",
        instagramReels: profile.instagramReels || "",
        youtube: profile.youtube || "",
        story: profile.story || "",
        practices: profile.practices || "",
        tags: tagsString,
        logoUrl: profile.logoUrl || "",
        latitude: profile.latitude ? Number(profile.latitude) : undefined,
        longitude: profile.longitude ? Number(profile.longitude) : undefined,
      });
      
      // Set current coordinates state if they exist (convert strings to numbers)
      if (profile.latitude && profile.longitude) {
        setCurrentCoordinates({
          latitude: parseFloat(String(profile.latitude)),
          longitude: parseFloat(String(profile.longitude))
        });
      }
      
      // Set uploaded farm images - handle both array and string cases
      if (profile.farmImages) {
        if (Array.isArray(profile.farmImages)) {
          setUploadedFarmImages(profile.farmImages);
        } else {
          console.log("Farm images is not an array, attempting to parse...");
          try {
            const parsedImages = typeof profile.farmImages === 'string' ? 
              JSON.parse(profile.farmImages) : [];
            if (Array.isArray(parsedImages)) {
              setUploadedFarmImages(parsedImages);
            }
          } catch (e) {
            console.log("Could not parse farm images:", e);
            setUploadedFarmImages([]);
          }
        }
      }
      
      // Set logo URL
      if (profile.logoUrl) {
        setLogoUrl(profile.logoUrl);
      }
    }
  }, [profile, form]);

  // Handle avatar/logo update
  const handleAvatarUpdate = (url: string) => {
    form.setValue("logoUrl", url);
    setLogoUrl(url);
  };

  // Get current location using Geolocation API (only for initial setting or change requests)
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation. Please enter coordinates manually.",
        variant: "destructive",
      });
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        
        // Check if farmer already has coordinates set
        if (currentCoordinates) {
          // Create a location change request instead of directly updating
          setLocationChangeRequest({
            requestedLatitude: latitude,
            requestedLongitude: longitude,
            currentLatitude: currentCoordinates.latitude,
            currentLongitude: currentCoordinates.longitude,
          });
          setShowLocationChangeModal(true);
        } else {
          // Initial location setting - allow direct update
          form.setValue("latitude", latitude);
          form.setValue("longitude", longitude);
          setCurrentCoordinates({ latitude, longitude });
          
          toast({
            title: "Location captured",
            description: `Farm coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          });
        }
        
        setIsGettingLocation(false);
      },
      (error) => {
        setIsGettingLocation(false);
        let errorMessage = "Failed to get location. ";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please allow location access and try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out.";
            break;
          default:
            errorMessage += "An unknown error occurred.";
            break;
        }
        
        toast({
          title: "Location error",
          description: errorMessage,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Handle farm image upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFarmImages(prev => [...prev, ...newFiles]);
    }
  };

  // Remove selected file before upload
  const handleRemoveFile = (index: number) => {
    setFarmImages(prev => prev.filter((_, i) => i !== index));
  };

  // Remove uploaded image
  const handleRemoveUploadedImage = (index: number) => {
    setUploadedFarmImages(prev => prev.filter((_, i) => i !== index));
  };

  // Upload farm images to server
  const uploadImages = async (): Promise<string[]> => {
    if (farmImages.length === 0) return [];
    
    const formData = new FormData();
    farmImages.forEach(file => {
      formData.append('images', file);
    });
    
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }
      
      const response = await fetch('/api/farmers/images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload images: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      setFarmImages([]); // Clear selected files after upload
      return data.imageUrls || [];
    } catch (error) {
      console.error("Error uploading farm images:", error);
      toast({
        title: "Error uploading images",
        description: error instanceof Error ? error.message : "Failed to upload images. Please try again.",
        variant: "destructive",
      });
      return [];
    }
  };

  // Submit form handler
  const onSubmit = async (data: FarmerProfileFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log("Submitting form with data:", data);
      
      // 1. Upload any new images
      const uploadedUrls = await uploadImages();
      console.log("Uploaded new images:", uploadedUrls);
      
      // 2. Combine with existing images
      const allFarmImages = [...uploadedFarmImages, ...uploadedUrls];
      
      // 3. Format data for API - exclude location/email (locked fields) and unchanged coordinates
      const { location, email, latitude, longitude, ...editableData } = data;
      const formattedData: any = {
        ...editableData,
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()) : [],
        farmImages: allFarmImages
      };
      
      // Only include coordinates if they're being set for the first time (no current coordinates)
      if (!currentCoordinates && latitude !== undefined && longitude !== undefined) {
        formattedData.latitude = latitude;
        formattedData.longitude = longitude;
      }
      
      // 4. Get authentication token
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }
      
      // 5. Make API request
      console.log("Sending profile update request:", formattedData);
      const response = await fetch('/api/farmers/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      });
      
      // 6. Handle response
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update profile: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log("Profile update successful:", result);
      
      // 7. Show success message
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      // 8. Refresh profile data
      queryClient.invalidateQueries({ queryKey: ["/api/farmers/profile"] });
      
      // 9. Reset form state
      setIsSubmitting(false);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show loading state while fetching profile data
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Farmer Profile</CardTitle>
          <CardDescription>Loading your information...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-56">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Show error state if profile fetch failed
  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Farmer Profile</CardTitle>
          <CardDescription>Failed to load your profile information</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-red-500">
            There was an error loading your profile. Please try refreshing the page.
          </p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Render form
  return (
    <Card>
      <CardHeader>
        <CardTitle>Farmer Profile</CardTitle>
        <CardDescription>
          Update your farm information to help customers find and connect with you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log("Form validation errors:", errors);
            const firstError = Object.values(errors)[0];
            if (firstError?.message) {
              toast({
                title: "Please fix form errors",
                description: String(firstError.message),
                variant: "destructive",
              });
            }
          })} className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="john@example.com" 
                          {...field} 
                          disabled={true}
                          className="bg-gray-100 cursor-not-allowed"
                        />
                      </FormControl>
                      <FormDescription className="text-amber-600">
                        Email address cannot be changed after registration
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Farm Information Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Farm Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="farmName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Farm Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Green Acres Farm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (District)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Riverdale, CA" 
                          {...field} 
                          disabled={true}
                          className="bg-gray-100 cursor-not-allowed"
                        />
                      </FormControl>
                      <FormDescription className="text-amber-600">
                        District cannot be changed after registration. Contact admin for location changes.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Farm Coordinates Section */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-md font-medium">Farm Coordinates</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="flex items-center gap-2"
                  >
                    {isGettingLocation ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Navigation className="h-4 w-4" />
                    )}
                    {isGettingLocation ? "Getting Location..." : (currentCoordinates ? "Request Location Change" : "Get My Location")}
                  </Button>
                </div>

                {currentCoordinates ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Farm Location Set</span>
                    </div>
                    <div className="text-sm text-green-700">
                      <p>Latitude: {currentCoordinates.latitude.toFixed(6)}</p>
                      <p>Longitude: {currentCoordinates.longitude.toFixed(6)}</p>
                    </div>
                    <p className="text-xs text-green-600 mt-2">
                      * To change your location, use "Request Location Change" button. Changes require admin approval.
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Set Your Farm Location</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Click "Get My Location" to automatically capture your farm's coordinates. This helps customers find products from farms within 150km of their location.
                    </p>
                    <p className="text-xs text-blue-600 mt-2">
                      * Make sure you're at your farm location when capturing coordinates.
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Farm Road, Riverdale, CA 95678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.myfarm.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description Field */}
              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Farm Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell customers about your farm..."
                          className="resize-none min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Brief description of your farm that will appear in search results
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Story Field */}
              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="story"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Farm Story (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share the story of your farm..."
                          className="resize-none min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        More detailed story about your farm's history and mission
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Practices Field */}
              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="practices"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Farming Practices (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your farming practices..."
                          className="resize-none min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Information about your farming methods and practices
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Tags Field */}
              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Farm Tags (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Organic, Berries, Sustainable" {...field} />
                      </FormControl>
                      <FormDescription>
                        Comma-separated list of tags that describe your farm
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Media Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Media</h3>
              <div className="space-y-6">
                {/* Instagram Reels Link */}
                <FormField
                  control={form.control}
                  name="instagramReels"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram Reels Links (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="https://www.instagram.com/reel/example1/&#10;https://www.instagram.com/reel/example2/"
                          className="resize-none min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter Instagram reel URLs, one per line, to showcase your farm
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* YouTube Video Link */}
                <FormField
                  control={form.control}
                  name="youtube"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube Video Links (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="https://www.youtube.com/watch?v=example1&#10;https://www.youtube.com/watch?v=example2"
                          className="resize-none min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter YouTube video URLs, one per line, to showcase your farm
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Farm Logo */}
                <div>
                  <FormLabel>Farm Logo</FormLabel>
                  <div className="mt-2">
                    <AvatarUpload 
                      currentAvatarUrl={logoUrl || undefined} 
                      onAvatarUpdate={handleAvatarUpdate}
                      size="lg"
                    />
                  </div>
                  <FormDescription>
                    Upload a logo for your farm that will appear on your profile
                  </FormDescription>
                </div>

                {/* Farm Images */}
                <div>
                  <FormLabel>Farm Images</FormLabel>
                  
                  {/* Selected Images (not yet uploaded) */}
                  {farmImages.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Selected Images</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {farmImages.map((file, index) => (
                          <div 
                            key={`selected-${index}`} 
                            className="relative border rounded-md p-1 h-[100px] group"
                          >
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={`Selected farm image ${index + 1}`}
                              className="w-full h-full object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Already Uploaded Images */}
                  {uploadedFarmImages.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Uploaded Images</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {uploadedFarmImages.map((imageUrl, index) => (
                          <div 
                            key={`uploaded-${index}`} 
                            className="relative border rounded-md p-1 h-[100px] group"
                          >
                            <img 
                              src={imageUrl} 
                              alt={`Farm image ${index + 1}`}
                              className="w-full h-full object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveUploadedImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Image Upload Button */}
                  <div className="mt-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                      multiple
                      accept="image/*"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-dashed"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Farm Images
                    </Button>
                    <FormDescription className="mt-2">
                      Upload images of your farm to showcase your operation
                    </FormDescription>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}