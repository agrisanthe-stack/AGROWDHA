import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { apiRequest, queryClient } from "@/lib/queryClient";
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
import { X, Upload, Image as ImageIcon, PlusCircle } from "lucide-react";
import AvatarUpload from "@/components/user/AvatarUpload";

const farmerProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  farmName: z.string().min(2, "Farm name must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  website: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  instagramReels: z.string().optional(),
  youtube: z.string().optional(),
  story: z.string().optional(),
  practices: z.string().optional(),
  tags: z.string().optional(),
  logoUrl: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
});

type FarmerProfileFormValues = z.infer<typeof farmerProfileSchema>;

export default function FarmerProfile() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Define the type for the farmer profile
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
    createdAt: string;
    updatedAt: string;
  }

  const { data: profile, isLoading } = useQuery<FarmerProfileData>({
    queryKey: ["/api/farmers/profile"],
  });

  // State for handling image uploads
  const [farmImages, setFarmImages] = useState<File[]>([]);
  const [uploadedFarmImages, setUploadedFarmImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for logo/avatar update
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

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
    },
  });

  // Update form values when profile data is loaded
  useEffect(() => {
    if (profile) {
      // Log the profile data to debug
      console.log("Profile data loaded:", profile);
      
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
        story: profile.story || "",
        practices: profile.practices || "",
        tags: profile.tags ? profile.tags.join(", ") : "",
        logoUrl: profile.logoUrl || "",
      });
      
      // Set uploaded farm images if available
      if (profile.farmImages && Array.isArray(profile.farmImages)) {
        console.log("Setting farm images:", profile.farmImages);
        setUploadedFarmImages(profile.farmImages);
      }
      
      // Set logo URL for avatar
      if (profile.logoUrl) {
        console.log("Setting logo URL:", profile.logoUrl);
        setLogoUrl(profile.logoUrl);
      }
    }
  }, [profile, form]);
  
  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFarmImages(prev => [...prev, ...newFiles]);
    }
  };
  
  // Handle removing a selected file
  const handleRemoveFile = (index: number) => {
    setFarmImages(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle removing an uploaded image
  const handleRemoveUploadedImage = (index: number) => {
    setUploadedFarmImages(prev => prev.filter((_, i) => i !== index));
  };
  
  // Upload images to server
  const uploadImages = async () => {
    if (farmImages.length === 0) return [];
    
    setIsUploading(true);
    const formData = new FormData();
    farmImages.forEach(file => {
      formData.append('images', file);
    });
    
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('auth_token');
      
      // For FormData uploads, we need a direct fetch call without Content-Type header
      // as the browser will set it automatically with the correct boundary
      const response = await fetch('/api/farmers/images', {
        method: 'POST',
        // Don't set Content-Type header for multipart/form-data
        // The browser will set it automatically with the correct boundary
        headers: {
          // Include the authorization token if available
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        credentials: 'include', // Include cookies for session authentication
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload images');
      }
      
      const data = await response.json();
      setIsUploading(false);
      setFarmImages([]);
      return data.imageUrls || [];
    } catch (error) {
      console.error("Error uploading farm images:", error);
      setIsUploading(false);
      toast({
        title: "Error",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      });
      return [];
    }
  };

  const updateProfileMutation = useMutation({
    mutationFn: async (formattedData: any) => {
      console.log("Submitting data with apiRequest:", formattedData);
      try {
        const response = await apiRequest("PUT", "/api/farmers/profile", formattedData);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to update profile: ${response.status} ${errorText}`);
        }
        return await response.json();
      } catch (error) {
        console.error("Error in mutation function:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Profile update successful, received data:", data);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/farmers/profile"] });
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  // Handle avatar update 
  const handleAvatarUpdate = (url: string) => {
    form.setValue("logoUrl", url);
    setLogoUrl(url);
  };
  
  const onSubmit = async (data: FarmerProfileFormValues) => {
    console.log("Form submitted with data:", data);
    setIsSubmitting(true);
    
    try {
      // Upload images first if there are any
      console.log("Uploading images...");
      const uploadedUrls = await uploadImages();
      console.log("Uploaded image URLs:", uploadedUrls);
      
      // Combine existing uploaded images with new ones
      const allFarmImages = [...uploadedFarmImages, ...uploadedUrls];
      console.log("All farm images:", allFarmImages);
      
      // Convert tags string to array
      const formattedData = {
        ...data,
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()) : [],
        farmImages: allFarmImages
      };
      
      console.log("Submitting formatted data to API:", formattedData);
      
      // Use direct fetch with explicit auth header and JSON stringify
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }
      
      const response = await fetch('/api/farmers/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update profile: ${response.status} ${errorText}`);
      }
      
      const updatedProfile = await response.json();
      console.log("Profile update successful:", updatedProfile);
      
      // Force reload the farmer profile data
      await queryClient.invalidateQueries({ queryKey: ["/api/farmers/profile"] });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
        variant: "default",
      });
      
      // Reset form with new values to avoid stale data
      if (updatedProfile) {
        form.reset({
          name: updatedProfile.name || "",
          email: updatedProfile.email || "",
          phone: updatedProfile.phone || "",
          farmName: updatedProfile.farmName || "",
          location: updatedProfile.location || "",
          description: updatedProfile.description || "",
          address: updatedProfile.address || "",
          website: updatedProfile.website || "",
          instagramReels: updatedProfile.instagramReels || "",
          story: updatedProfile.story || "",
          practices: updatedProfile.practices || "",
          tags: updatedProfile.tags ? updatedProfile.tags.join(", ") : "",
          logoUrl: updatedProfile.logoUrl || "",
        });
        
        if (updatedProfile.farmImages && Array.isArray(updatedProfile.farmImages)) {
          setUploadedFarmImages(updatedProfile.farmImages);
        }
        
        if (updatedProfile.logoUrl) {
          setLogoUrl(updatedProfile.logoUrl);
        }
      }
      
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('farmerProfile.title')}</CardTitle>
          <CardDescription>{t('farmerProfile.loadingDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('farmerProfile.title')}</CardTitle>
        <CardDescription>
          {t('farmerProfile.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">{t('farmerProfile.personalInfo')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('farmerProfile.fullName')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('farmerProfile.fullNamePlaceholder')} {...field} />
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
                      <FormLabel>{t('farmerProfile.email')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t('farmerProfile.emailPlaceholder')} 
                          {...field} 
                          disabled={true}
                          className="bg-gray-100 cursor-not-allowed"
                        />
                      </FormControl>
                      <FormDescription className="text-amber-600">
                        {t('farmerProfile.emailLocked') || 'Email address cannot be changed after registration'}
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
                      <FormLabel>{t('farmerProfile.phone')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('farmerProfile.phonePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">{t('farmerProfile.farmInfo')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="farmName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('farmerProfile.farmName')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('farmerProfile.farmNamePlaceholder')} {...field} />
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
                      <FormLabel>{t('farmerProfile.location')} ({t('farmerProfile.district') || 'District'})</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t('farmerProfile.locationPlaceholder')} 
                          {...field} 
                          disabled={true}
                          className="bg-gray-100 cursor-not-allowed"
                        />
                      </FormControl>
                      <FormDescription className="text-amber-600">
                        {t('farmerProfile.locationLocked') || 'District cannot be changed after registration. Contact admin for location changes.'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>{t('farmerProfile.address')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('farmerProfile.addressPlaceholder')} {...field} />
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
                      <FormLabel>{t('farmerProfile.website')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('farmerProfile.websitePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('farmerProfile.farmDescription')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('farmerProfile.farmDescriptionPlaceholder')}
                          className="resize-none min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t('farmerProfile.farmDescriptionHelp')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="story"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('farmerProfile.farmStory')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('farmerProfile.farmStoryPlaceholder')}
                          className="resize-none min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t('farmerProfile.farmStoryHelp')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="practices"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('farmerProfile.farmingPractices')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('farmerProfile.farmingPracticesPlaceholder')}
                          className="resize-none min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t('farmerProfile.farmingPracticesHelp')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('farmerProfile.farmTags')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('farmerProfile.farmTagsPlaceholder')} {...field} />
                      </FormControl>
                      <FormDescription>
                        {t('farmerProfile.farmTagsHelp')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">{t('farmerProfile.media')}</h3>
              <div className="space-y-6">
                {/* Instagram Reels */}
                <FormField
                  control={form.control}
                  name="instagramReels"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('farmerProfile.instagramReels')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="https://www.instagram.com/reel/ABC123/&#10;https://www.instagram.com/reel/DEF456/"
                          className="resize-none min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t('farmerProfile.instagramReelsHelp')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Farm Logo/Avatar */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-sm font-medium">{t('farmerProfile.farmLogo')}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {t('farmerProfile.farmLogoHelp')}
                    </p>
                  </div>
                  <AvatarUpload 
                    currentAvatarUrl={logoUrl} 
                    onAvatarUpdate={handleAvatarUpdate}
                    size="lg"
                  />
                </div>
                
                {/* Farm Images Upload */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">{t('farmerProfile.farmImages')}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {t('farmerProfile.farmImagesHelp')}
                    </p>
                  </div>
                  
                  {/* Already uploaded images */}
                  {uploadedFarmImages.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-4">
                      {uploadedFarmImages.map((image, index) => (
                        <div 
                          key={`uploaded-${index}`} 
                          className="relative w-24 h-24 border rounded overflow-hidden group"
                        >
                          <img 
                            src={image} 
                            alt={`Farm image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveUploadedImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Selected files waiting to be uploaded */}
                  {farmImages.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-4">
                      {farmImages.map((file, index) => (
                        <div 
                          key={`file-${index}`} 
                          className="relative w-24 h-24 border rounded overflow-hidden group"
                        >
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={`Selected image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                            <span className="text-xs text-white font-medium px-2 py-1 bg-green-500 rounded">New</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* File input button */}
                  <div>
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
                      className="flex items-center gap-2"
                      disabled={isUploading}
                    >
                      <Upload className="w-4 h-4" />
                      <span>{t('farmerProfile.addImages')}</span>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Upload JPEG, PNG or GIF images (max 10MB each)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('farmerProfile.saving') : t('farmerProfile.saveChanges')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
