import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getAuthToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { 
  X, 
  Upload, 
  ImageIcon, 
  CheckCircle2, 
  Trash2,
  Camera,
  ImagePlus,
  Check,
  TrendingUp,
  Package,
  Tag,
  Plus,
  Truck,
  AlertCircle
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Product, ProductImage } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Category } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface PriceSlab {
  id?: number;
  minQuantity: number;
  maxQuantity: number | null;
  pricePerUnit: string;
  slabType: 'b2c' | 'b2b';
}

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  unit: z.string().min(1, "Unit is required"),
  status: z.string().min(1, "Status is required"),
  categoryId: z.coerce.number().positive("Category is required"),
  inventory: z.coerce.number().nonnegative("Stock quantity must be 0 or more"),
  imageUrl: z.string().optional(),
  image: z.instanceof(File).optional(),
  availableUntil: z.date(),
  growingDetails: z.string().optional(),
  harvestDate: z.date(),
  // Retail box size
  unitsPerBox: z.coerce.number().positive("Box size must be greater than 0").default(1),
  // B2B Wholesale fields
  enableB2B: z.boolean().default(false),
  b2bMoq: z.coerce.number().int().min(1).optional(),
  wholesaleUnit: z.string().optional(),
  hasSlabPricing: z.boolean().default(false),
  gradeVariety: z.string().optional(),
  approxWeightPerPieceGrams: z.coerce.number().nonnegative().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function AddEditProduct() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [priceSlabs, setPriceSlabs] = useState<PriceSlab[]>([]);
  const [newSlab, setNewSlab] = useState<{minQuantity: string; maxQuantity: string; pricePerUnit: string; slabType: 'b2c' | 'b2b'}>({
    minQuantity: '',
    maxQuantity: '',
    pricePerUnit: '',
    slabType: 'b2b'
  });
  const isEditing = !!id;

  // Fetch categories for dropdown
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // If editing, fetch the product (use admin endpoint if user is admin/staff)
  const { data: currentUser } = useQuery<any>({
    queryKey: ["/api/auth/me"],
  });

  const isAdminUser = currentUser?.role && ["admin", "district_manager", "taluk_agent"].includes(currentUser.role);
  const isDM = currentUser?.role === "district_manager";
  const isFarmerUser = currentUser?.role === "farmer";

  const { data: fpoData } = useQuery<{ linked: any[]; available: any[]; maxLinks: number; currentCount: number }>({
    queryKey: ["/api/farmer/fpos"],
    enabled: isFarmerUser && !isEditing,
  });

  const fpoDataLoaded = !isFarmerUser || isEditing || fpoData !== undefined;
  const hasLinkedFpo = !isFarmerUser || isEditing || (fpoData?.linked && fpoData.linked.length > 0);

  const { data: product, isLoading: isLoadingProduct } = useQuery<Product>({
    queryKey: isAdminUser ? [`/api/admin/products/${id}`] : [`/api/products/${id}`],
    enabled: isEditing && currentUser !== undefined,
  });

  // Fetch product images if editing
  const { data: images } = useQuery<ProductImage[]>({
    queryKey: [`/api/products/${id}/images`],
    enabled: isEditing,
  });

  // Fetch price slabs if editing
  const { data: fetchedSlabs } = useQuery<PriceSlab[]>({
    queryKey: [`/api/products/${id}/price-slabs`],
    enabled: isEditing,
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      unit: "lb",
      status: "Available Now",
      categoryId: 0,
      inventory: 0,
      imageUrl: "",
      availableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      growingDetails: "",
      harvestDate: new Date(),
      // Retail box size
      unitsPerBox: 1,
      // B2B Wholesale defaults
      enableB2B: false,
      b2bMoq: 1,
      wholesaleUnit: "",
      hasSlabPricing: false,
      gradeVariety: "",
      approxWeightPerPieceGrams: 0,
    },
  });

  // Sync product images when loaded
  useEffect(() => {
    if (images) {
      setProductImages(images);
    }
  }, [images]);

  // Sync price slabs when loaded (B2B slabs only)
  useEffect(() => {
    if (fetchedSlabs && fetchedSlabs.length > 0) {
      setPriceSlabs(fetchedSlabs.filter(s => s.slabType === 'b2b'));
    }
  }, [fetchedSlabs]);

  // Update form values when product data is loaded
  useEffect(() => {
    if (product && isEditing) {
      const hasB2B = !!((product as any).b2bQuantity && (product as any).b2bQuantity > 0);
      const productPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
      const harvestDate = product.harvestDate ? new Date(product.harvestDate) : new Date();
      const availableUntil = product.availableUntil ? new Date(product.availableUntil) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const hasSlabs = !!((product as any).hasSlabPricing || (fetchedSlabs && fetchedSlabs.length > 0));
      form.reset({
        name: product.name,
        description: product.description,
        price: productPrice,
        unit: product.unit,
        status: product.status,
        categoryId: product.categoryId,
        inventory: product.inventory,
        imageUrl: product.imageUrl || "",
        availableUntil: availableUntil,
        growingDetails: product.growingDetails || "",
        harvestDate: harvestDate,
        unitsPerBox: product.unitsPerBox ? parseFloat(String(product.unitsPerBox)) : 1,
        enableB2B: hasB2B,
        b2bMoq: (product as any).b2bMoq || 1,
        wholesaleUnit: product.wholesaleUnit || "",
        hasSlabPricing: hasSlabs,
        gradeVariety: (product as any).gradeVariety || "",
        approxWeightPerPieceGrams: (product as any).approxWeightPerPieceGrams
          ? parseFloat((product as any).approxWeightPerPieceGrams) : 0,
      });
    }
  }, [product, form, isEditing, fetchedSlabs]);

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const response = await apiRequest("POST", "/api/products", data);
      return response.json();
    },
    onSuccess: async (newProduct) => {
      toast({
        title: "Product created",
        description: "Your product has been successfully created.",
        variant: "default",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/products/farmer"] });
      
      // If there are any new images waiting to be uploaded
      if (newImages.length > 0 && newProduct.id) {
        toast({
          title: "Uploading additional images",
          description: `Uploading ${newImages.length} additional product images...`,
        });
        
        // Upload additional images immediately
        try {
          setIsUploadingImages(true);
          
          // Create FormData for each image and upload one by one
          for (const image of newImages) {
            const formData = new FormData();
            formData.append('image', image);
            
            const token = getAuthToken();
            const headers: HeadersInit = {};
            
            if (token) {
              headers['Authorization'] = `Bearer ${token}`;
            }
            
            // Upload the image
            const response = await fetch(`/api/products/${newProduct.id}/images`, {
              method: 'POST',
              body: formData,
              headers,
              credentials: 'include'
            });
            
            if (!response.ok) {
              const errorText = await response.text();
              let errorMessage = "File upload failed";
              
              try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorMessage;
              } catch (e) {
                if (errorText) errorMessage = errorText;
              }
              
              throw new Error(errorMessage);
            }
          }
          
          toast({
            title: "Images uploaded",
            description: `Successfully uploaded ${newImages.length} additional product image(s).`
          });
          
          // Clear the new images after successful upload
          setNewImages([]);
        } catch (error) {
          toast({
            title: "Upload Error",
            description: error instanceof Error 
              ? error.message 
              : "Failed to upload additional images. You can try uploading them later in edit mode.",
            variant: "destructive"
          });
        } finally {
          setIsUploadingImages(false);
          navigate("/dashboard/products");
        }
      } else {
        // No additional images, go back to product list
        navigate("/dashboard/products");
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create product. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  // DM-specific product creation mutation (uses /api/dm/products endpoint with auto-approval)
  const createDMProductMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/dm/products", data);
      return response.json();
    },
    onSuccess: async (newProduct) => {
      toast({
        title: "Product created (Auto-Approved)",
        description: "Your FPO product has been successfully created and is now live.",
        variant: "default",
      });
      
      // Invalidate admin product queries
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products/approved"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dm/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/fpo-products"] });
      
      // If there are any new images waiting to be uploaded
      if (newImages.length > 0 && newProduct.id) {
        toast({
          title: "Uploading additional images",
          description: `Uploading ${newImages.length} additional product images...`,
        });
        
        try {
          setIsUploadingImages(true);
          
          for (const image of newImages) {
            const formData = new FormData();
            formData.append('image', image);
            
            const token = getAuthToken();
            const headers: HeadersInit = {};
            
            if (token) {
              headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(`/api/products/${newProduct.id}/images`, {
              method: 'POST',
              body: formData,
              headers,
              credentials: 'include'
            });
            
            if (!response.ok) {
              const errorText = await response.text();
              let errorMessage = "File upload failed";
              
              try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorMessage;
              } catch (e) {
                if (errorText) errorMessage = errorText;
              }
              
              throw new Error(errorMessage);
            }
          }
          
          toast({
            title: "Images uploaded",
            description: `Successfully uploaded ${newImages.length} additional product image(s).`
          });
          
          setNewImages([]);
        } catch (error) {
          toast({
            title: "Upload Error",
            description: error instanceof Error 
              ? error.message 
              : "Failed to upload additional images.",
            variant: "destructive"
          });
        } finally {
          setIsUploadingImages(false);
          // DM goes back to admin dashboard products tab
          navigate("/admin?tab=products");
        }
      } else {
        // DM goes back to admin dashboard products tab
        navigate("/admin?tab=products");
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create product. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const response = await apiRequest("PUT", `/api/products/${id}`, data);
      return response.json();
    },
    onSuccess: (updatedProduct) => {
      toast({
        title: "Product updated",
        description: "Your product has been successfully updated.",
        variant: "default",
      });
      
      // Invalidate all product-related queries to ensure updates are reflected everywhere
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/farmer"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/farmer/list"] });
      queryClient.invalidateQueries({ queryKey: [`/api/products/${id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/calendar"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products/approved"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products/expired"] });
      
      // If there are any new images waiting to be uploaded
      if (newImages.length > 0) {
        toast({
          title: "Uploading images",
          description: `Uploading ${newImages.length} product images...`,
        });
        
        // Start the image upload process
        uploadProductImages();
      } else {
        // No additional images, go back to product list
        setIsSubmitting(false);
        navigate("/dashboard/products");
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update product. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  // Handle adding files to the new images array
  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const newFilesArray = Array.from(files);
    setNewImages(prev => [...prev, ...newFilesArray]);
  };

  // Remove an image from the newImages list
  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Remove an existing product image
  const deleteProductImage = async (imageId: number) => {
    try {
      await apiRequest('DELETE', `/api/products/${id}/images/${imageId}`);
      setProductImages(prev => prev.filter(img => img.id !== imageId));
      toast({
        title: "Image deleted",
        description: "The image has been removed from this product."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete image. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Set an image as primary
  const setPrimaryImage = async (imageId: number) => {
    try {
      await apiRequest('PUT', `/api/products/${id}/images/${imageId}/primary`);
      
      // Update local state to reflect the primary image change
      setProductImages(prev => prev.map(img => ({
        ...img,
        isPrimary: img.id === imageId
      })));
      
      toast({
        title: "Primary image updated",
        description: "The primary product image has been updated."
      });
      
      // Refresh product data to get updated imageUrl
      queryClient.invalidateQueries({ queryKey: [`/api/products/${id}`] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set primary image. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Upload new images for an existing product
  const uploadProductImages = async () => {
    if (newImages.length === 0) return;
    
    try {
      setIsUploadingImages(true);
      
      // Create FormData for each image and upload one by one
      for (const image of newImages) {
        const formData = new FormData();
        formData.append('image', image);
        
        const token = getAuthToken();
        const headers: HeadersInit = {};
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Upload the image
        const response = await fetch(`/api/products/${id}/images`, {
          method: 'POST',
          body: formData,
          headers,
          credentials: 'include'
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = "File upload failed";
          
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            if (errorText) errorMessage = errorText;
          }
          
          throw new Error(errorMessage);
        }
        
        const newImage = await response.json();
        setProductImages(prev => [...prev, newImage]);
      }
      
      // Clear the new images after successful upload
      setNewImages([]);
      
      toast({
        title: "Images uploaded",
        description: `Successfully uploaded ${newImages.length} new product image(s).`
      });
      
      // Refresh product images
      queryClient.invalidateQueries({ queryKey: [`/api/products/${id}/images`] });
      
      // Navigate back to product list after successful upload
      navigate("/dashboard/products");
    } catch (error) {
      toast({
        title: "Upload Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to upload images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploadingImages(false);
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Check if there's a file to upload
      let uploadedImageUrl = data.imageUrl;
      
      if (data.image) {
        const formData = new FormData();
        formData.append('image', data.image);
        
        try {
          console.log("Uploading image using apiRequest helper...");
          
          // Create a custom fetch function for use with multipart/form-data
          const fetchWithFormData = async () => {
            const token = getAuthToken();
            const headers: HeadersInit = {};
            
            if (token) {
              headers['Authorization'] = `Bearer ${token}`;
              console.log("Using auth token for upload:", token.substring(0, 10) + '...');
            } else {
              console.log("No auth token found for upload");
            }
            
            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
              headers,
              credentials: 'include'
            });
            
            if (!response.ok) {
              const errorText = await response.text();
              console.error("Upload failed:", response.status, response.statusText, errorText);
              let errorMessage = "File upload failed";
              
              try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorMessage;
              } catch (e) {
                // If not JSON, use the error text as is
                if (errorText) errorMessage = errorText;
              }
              
              throw new Error(errorMessage);
            }
            
            return response.json();
          };
          
          // Call our custom fetch function
          const uploadResult = await fetchWithFormData();
          uploadedImageUrl = uploadResult.imageUrl;
          console.log("Image uploaded successfully:", uploadedImageUrl);
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          toast({
            title: "Image Upload Error",
            description: uploadError instanceof Error 
              ? uploadError.message 
              : "Failed to upload product image. Please try again.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      // Format data to match the expected types on the server
      const formattedData = {
        ...data,
        inventory: data.inventory, // Volume-based: store directly in product's unit (kg/piece etc.)
        price: String(data.price), // Convert price to string for the backend validation
        harvestDate: data.harvestDate, // Keep as Date object
        availableUntil: data.availableUntil, // Keep as Date object
        imageUrl: uploadedImageUrl, // Use the uploaded image URL
        image: undefined, // Remove the File object before sending to API
        // Retail box size
        unitsPerBox: data.unitsPerBox || 1,
        // B2B fields — wholesale uses same stock pool as retail
        b2bQuantity: data.enableB2B ? data.inventory : null,
        b2bMoq: data.enableB2B ? data.b2bMoq : null,
        b2cQuantity: data.inventory, // Retail stock = same as total inventory
        b2cMoq: 1, // Minimum retail order: 1 unit
        hasSlabPricing: data.hasSlabPricing && priceSlabs.length > 0,
        gradeVariety: data.gradeVariety || null,
        wholesaleUnit: data.wholesaleUnit || null,
        priceSlabs: data.hasSlabPricing ? priceSlabs : [],
      };
      
      console.log("Form data before formatting:", data);
      console.log("Formatted data for API:", formattedData);
      
      // Log the current state of form errors if any
      if (Object.keys(form.formState.errors).length > 0) {
        console.log("Form validation errors:", form.formState.errors);
      }
      
      if (isEditing) {
        console.log("Updating product with ID:", id);
        updateProductMutation.mutate(formattedData as any);
      } else if (isDM) {
        // DM creates products via special endpoint (auto-approved, FPO-level)
        console.log("Creating new DM/FPO product");
        createDMProductMutation.mutate(formattedData as any);
      } else {
        console.log("Creating new product");
        createProductMutation.mutate(formattedData as any);
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "An error occurred while submitting the form",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  if (isEditing && isLoadingProduct) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-5 w-64 bg-gray-200 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isFarmerUser && !isEditing && fpoDataLoaded && !hasLinkedFpo) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertCircle className="h-6 w-6" />
              FPO Link Required
            </CardTitle>
            <CardDescription>
              You need to be linked with a Farmer Producer Organization (FPO) before you can create products.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center space-y-4">
              <div className="text-orange-800 space-y-2">
                <p className="font-medium text-lg">No FPO Linked</p>
                <p className="text-sm">
                  To start selling your products on Santhe, you must first link your account with an FPO in your district.
                  Go to the <strong>FPO</strong> tab in your dashboard and join an available FPO.
                </p>
              </div>
              <Button asChild variant="default" className="bg-orange-600 hover:bg-orange-700">
                <Link href="/dashboard/my-fpos">Go to FPO Tab</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing 
              ? t('addEditProduct.editProduct') 
              : isDM 
                ? "Add FPO Product (Auto-Approved)"
                : t('addEditProduct.addNewProduct')}
          </CardTitle>
          <CardDescription>
            {isEditing 
              ? t('addEditProduct.updateProductDesc') 
              : isDM
                ? "Create a new FPO product listing. Products created by District Managers are automatically approved and go live immediately."
                : t('addEditProduct.addNewProductDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">

              {/* ── Step 1: Product Basics ── */}
              <div className="relative pl-10 pb-8">
                <div className="absolute left-0 top-0 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-bold shrink-0">1</div>
                  <div className="w-0.5 bg-orange-200 flex-1 mt-1" />
                </div>
                <div className="space-y-4">
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                      <Package className="h-4 w-4 text-orange-600" /> Product Basics
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Name, category, and description of your product</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('addEditProduct.productName')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('addEditProduct.productNamePlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('addEditProduct.category')}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value ? field.value.toString() : undefined}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder={t('addEditProduct.selectCategory')} /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories?.map(cat => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('addEditProduct.status')}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder={t('addEditProduct.selectStatus')} /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Available Now">{t('addEditProduct.availableNow')}</SelectItem>
                              <SelectItem value="Pre-Order">{t('addEditProduct.preOrder')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('addEditProduct.description')}</FormLabel>
                        <FormControl>
                          <Textarea placeholder={t('addEditProduct.descriptionPlaceholder')} className="resize-none min-h-[100px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* ── Step 2: Stock & Unit ── */}
              <div className="relative pl-10 pb-8">
                <div className="absolute left-0 top-0 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-bold shrink-0">2</div>
                  <div className="w-0.5 bg-orange-200 flex-1 mt-1" />
                </div>
                <div className="space-y-4">
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                      <Package className="h-4 w-4 text-orange-600" /> Stock & Unit
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">What unit do you measure this product in, and how much do you have?</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('addEditProduct.unit')} <span className="text-muted-foreground font-normal text-xs">— base measurement</span></FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder={t('addEditProduct.selectUnit')} /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="kg">{t('addEditProduct.kilogram')}</SelectItem>
                              <SelectItem value="g">{t('addEditProduct.gram')}</SelectItem>
                              <SelectItem value="pieces">{t('addEditProduct.pieces')}</SelectItem>
                              <SelectItem value="litres">{t('addEditProduct.litres')}</SelectItem>
                              <SelectItem value="ml">{t('addEditProduct.millilitre')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>e.g. if you sell tomatoes by the kilogram, choose kg</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="inventory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Stock ({form.watch("unit") || "units"})</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" placeholder="e.g. 90" {...field} />
                          </FormControl>
                          <FormDescription>Total quantity available across all pack sizes</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {form.watch("unit") === "pieces" && (
                    <FormField
                      control={form.control}
                      name="approxWeightPerPieceGrams"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Approx. Weight Per Piece (grams)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" placeholder="e.g. 250"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value === "" ? "0" : e.target.value)}
                            />
                          </FormControl>
                          <FormDescription>Used to calculate delivery charges automatically</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              {/* ── Step 3: Retail Pricing ── */}
              <div className="relative pl-10 pb-8">
                <div className="absolute left-0 top-0 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-bold shrink-0">3</div>
                  <div className="w-0.5 bg-orange-200 flex-1 mt-1" />
                </div>
                <div className="space-y-4">
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-orange-600" /> Retail Pricing
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Set the price and pack size for individual customers buying from the app</p>
                  </div>

                  {/* Pack size + Price grouped in one card */}
                  <div className="rounded-xl border border-orange-100 bg-orange-50/40 p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="unitsPerBox"
                        render={({ field }) => {
                          const currentUnit = form.watch("unit") || "unit";
                          return (
                            <FormItem>
                              <FormLabel>Pack Size <span className="text-muted-foreground font-normal text-xs">({currentUnit} per pack)</span></FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.001"
                                  min="0.001"
                                  placeholder={`e.g. 0.5 means a 500g pack (when unit = kg)`}
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value === "" ? 1 : parseFloat(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>
                                How much goes into one retail pack? (Use 1 if you sell loose by the {currentUnit})
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Retail Price per Pack (₹)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                <Input type="number" step="0.01" min="0" placeholder="0.00" className="pl-8" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>Price a retail customer pays for one pack</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Live preview card */}
                    {(() => {
                      const unit = form.watch("unit") || "unit";
                      const boxSize = parseFloat(String(form.watch("unitsPerBox") || 1));
                      const price = parseFloat(String(form.watch("price") || 0));
                      const stock = parseFloat(String(form.watch("inventory") || 0));
                      const boxCount = boxSize > 0 ? Math.floor(stock / boxSize) : 0;
                      if (!price || !unit) return null;
                      return (
                        <div className="bg-white rounded-lg border border-orange-200 p-3 flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-orange-500">📦</span>
                            <span className="text-gray-600">1 pack</span>
                            <span className="text-gray-400">=</span>
                            <span className="font-semibold text-gray-800">{boxSize} {unit}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-orange-500">💰</span>
                            <span className="text-gray-600">Retail price</span>
                            <span className="text-gray-400">=</span>
                            <span className="font-semibold text-green-700">₹{price.toFixed(2)} / pack</span>
                          </div>
                          {stock > 0 && boxSize > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-orange-500">🏪</span>
                              <span className="text-gray-600">Stock</span>
                              <span className="text-gray-400">=</span>
                              <span className="font-semibold text-gray-800">{boxCount} packs ({stock} {unit} total)</span>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* ── Step 4: Harvest & Availability ── */}
              <div className="relative pl-10 pb-8">
                <div className="absolute left-0 top-0 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-bold shrink-0">4</div>
                  <div className="w-0.5 bg-orange-200 flex-1 mt-1" />
                </div>
                <div className="space-y-4">
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-orange-600" /> Harvest & Availability
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">When was it harvested and how long will it be available?</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="harvestDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{t('addEditProduct.harvestDate')}</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                  {field.value ? format(field.value, "PPP") : <span>{t('addEditProduct.pickADate')}</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>{t('addEditProduct.harvestDateDesc')}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="availableUntil"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{t('addEditProduct.availableUntil')}</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                  {field.value ? format(field.value, "PPP") : <span>{t('addEditProduct.pickADate')}</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange}
                                disabled={(date) => date < new Date() || date > new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>{t('addEditProduct.availableUntilDesc')}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="growingDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('addEditProduct.growingDetails')} <span className="text-muted-foreground font-normal text-xs">(optional)</span></FormLabel>
                        <FormControl>
                          <Textarea placeholder={t('addEditProduct.growingDetailsPlaceholder')} className="resize-none min-h-[80px]" {...field} />
                        </FormControl>
                        <FormDescription>{t('addEditProduct.growingDetailsDesc')}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* ── Step 5: Wholesale / B2B ── */}
              <div className="relative pl-10 pb-8">
                <div className="absolute left-0 top-0 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold shrink-0">5</div>
                  <div className="w-0.5 bg-green-200 flex-1 mt-1" />
                </div>
                <div className="space-y-4">
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                      <Truck className="h-4 w-4 text-green-600" /> Wholesale / B2B
                      <span className="text-xs font-normal text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full">optional</span>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Enable this if you want to sell in bulk to restaurants, hotels, or traders</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="enableB2B"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 border-green-200 p-4 bg-green-50">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base flex items-center gap-2 cursor-pointer">
                            <Truck className="h-4 w-4 text-green-600" />
                            Enable Wholesale (B2B)
                          </FormLabel>
                          <FormDescription>Turn this on to accept bulk orders from business buyers</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={(val) => {
                            field.onChange(val);
                            form.setValue("hasSlabPricing", val);
                          }} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("enableB2B") && (
                    <div className="space-y-4 rounded-xl border border-green-200 p-4 bg-white">
                      {/* Wholesale settings */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="wholesaleUnit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Wholesale Unit <span className="text-muted-foreground font-normal text-xs">(optional)</span></FormLabel>
                              <FormControl>
                                <Input placeholder={`Default: ${form.watch("unit") || "unit"}`} {...field} />
                              </FormControl>
                              <FormDescription>e.g. "kg", "quintal", "50 kg bag"</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="b2bMoq"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Min. Order Qty ({form.watch("wholesaleUnit") || form.watch("unit") || "units"})</FormLabel>
                              <FormControl>
                                <Input type="number" min="1" placeholder="e.g. 50" {...field} />
                              </FormControl>
                              <FormDescription>Minimum a buyer must order</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="gradeVariety"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Grade / Variety <span className="text-muted-foreground font-normal text-xs">(optional)</span></FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Grade A, Premium, Organic" {...field} />
                              </FormControl>
                              <FormDescription>Quality label for buyers</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Wholesale price slabs */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                          <Tag className="h-4 w-4 text-green-600" /> Volume Price Slabs
                          <span className="font-normal text-muted-foreground text-xs ml-1">— different price per {form.watch("wholesaleUnit") || form.watch("unit") || "unit"} for each quantity range</span>
                        </h4>
                        <div className="bg-green-50 rounded-lg border border-green-200 p-3 space-y-3">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
                            <div>
                              <label className="text-xs font-medium text-gray-600 mb-1 block">Min Qty ({form.watch("wholesaleUnit") || form.watch("unit") || "units"})</label>
                              <Input type="number" min="1" placeholder="50"
                                value={newSlab.slabType === 'b2b' ? newSlab.minQuantity : ''}
                                onChange={(e) => setNewSlab({...newSlab, minQuantity: e.target.value, slabType: 'b2b'})}
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600 mb-1 block">Max Qty <span className="font-normal text-muted-foreground">(blank = no limit)</span></label>
                              <Input type="number" min="1" placeholder="Leave blank"
                                value={newSlab.slabType === 'b2b' ? newSlab.maxQuantity : ''}
                                onChange={(e) => setNewSlab({...newSlab, maxQuantity: e.target.value, slabType: 'b2b'})}
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600 mb-1 block">₹ per {form.watch("wholesaleUnit") || form.watch("unit") || "unit"}</label>
                              <Input type="number" step="0.01" min="0" placeholder="e.g. 40.00"
                                value={newSlab.slabType === 'b2b' ? newSlab.pricePerUnit : ''}
                                onChange={(e) => setNewSlab({...newSlab, pricePerUnit: e.target.value, slabType: 'b2b'})}
                              />
                            </div>
                            <Button type="button" className="bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                if (!newSlab.minQuantity || !newSlab.pricePerUnit) {
                                  toast({ title: "Missing fields", description: "Please fill min quantity and price", variant: "destructive" });
                                  return;
                                }
                                setPriceSlabs([...priceSlabs, {
                                  minQuantity: parseFloat(newSlab.minQuantity),
                                  maxQuantity: newSlab.maxQuantity ? parseFloat(newSlab.maxQuantity) : null,
                                  pricePerUnit: newSlab.pricePerUnit,
                                  slabType: 'b2b'
                                }]);
                                setNewSlab({minQuantity: '', maxQuantity: '', pricePerUnit: '', slabType: 'b2b'});
                              }}
                            >
                              <Plus className="h-4 w-4 mr-1" /> Add Slab
                            </Button>
                          </div>
                        </div>

                        {priceSlabs.filter(s => s.slabType === 'b2b').length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-3 border border-dashed rounded-lg">No price slabs yet — add at least one above</p>
                        ) : (
                          <div className="space-y-2">
                            {priceSlabs.map((slab, index) => slab.slabType !== 'b2b' ? null : (
                              <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-green-50 border-green-200">
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="font-semibold text-green-900 bg-green-100 px-2 py-0.5 rounded">
                                    {slab.minQuantity}{slab.maxQuantity ? `–${slab.maxQuantity}` : '+'} {form.watch("wholesaleUnit") || form.watch("unit")}
                                  </span>
                                  <span className="text-gray-400">→</span>
                                  <span className="font-bold text-green-700">
                                    ₹{parseFloat(slab.pricePerUnit).toFixed(2)} / {form.watch("wholesaleUnit") || form.watch("unit")}
                                  </span>
                                </div>
                                <Button type="button" variant="ghost" size="sm"
                                  onClick={() => setPriceSlabs(priceSlabs.filter((_, i) => i !== index))}
                                  className="text-red-500 hover:text-red-700 h-7 w-7 p-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Step 6: Product Images ── */}
              {!isEditing && (
                <div className="relative pl-10 pb-4">
                  <div className="absolute left-0 top-0">
                    <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-bold">6</div>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-orange-600" /> Product Images
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Upload clear photos to attract buyers</p>
                  </div>
                  <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>{t('addEditProduct.primaryProductImage')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                onChange(file);
                              }
                            }}
                            {...fieldProps}
                          />
                        </FormControl>
                        <FormDescription>
                          {t('addEditProduct.primaryImageDesc')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-base">{t('addEditProduct.additionalImages')}</FormLabel>
                      <label htmlFor="new-product-multiple-images" className="cursor-pointer">
                        <div className="flex items-center gap-1 px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm">
                          <ImagePlus className="h-4 w-4" />
                          <span>{t('addEditProduct.addMoreImages')}</span>
                        </div>
                        <input
                          id="new-product-multiple-images"
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleFileChange(e.target.files)}
                        />
                      </label>
                    </div>
                    <FormDescription>
                      {t('addEditProduct.additionalImagesDesc')}
                    </FormDescription>
                    
                    {/* Preview of images to be uploaded */}
                    {newImages.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">{t('addEditProduct.additionalImagesToUpload')}</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {newImages.map((file, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`New upload preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-md border"
                              />
                              <button
                                type="button"
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeNewImage(index)}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              )}

              {isEditing && (
                <div className="relative pl-10 pb-4">
                  <div className="absolute left-0 top-0">
                    <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-bold">6</div>
                  </div>
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-orange-600" /> Product Images
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">Manage photos for this product</p>
                    </div>
                    <div className="flex gap-2">
                      <label htmlFor="multiple-images-upload" className="cursor-pointer">
                        <div className="flex items-center gap-1 px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm">
                          <ImagePlus className="h-4 w-4" />
                          <span>{t('addEditProduct.addImages')}</span>
                        </div>
                        <input
                          id="multiple-images-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleFileChange(e.target.files)}
                        />
                      </label>
                      {newImages.length > 0 && (
                        <Button
                          type="button"
                          onClick={uploadProductImages}
                          disabled={isUploadingImages}
                          size="sm"
                        >
                          {isUploadingImages ? t('addEditProduct.uploading') : t('addEditProduct.uploadSelected')}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Preview of new images to be uploaded */}
                  {newImages.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">{t('addEditProduct.newImagesToUpload')}</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {newImages.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`New upload preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-md border"
                            />
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeNewImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Existing product images */}
                  {productImages.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">{t('addEditProduct.currentImages')}</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {productImages.map((image) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={image.imageUrl}
                              alt={`Product image ${image.id}`}
                              className={`w-full h-24 object-cover rounded-md border ${image.isPrimary ? 'border-primary border-2' : ''}`}
                            />
                            <div className="absolute top-1 right-1 flex gap-1">
                              {!image.isPrimary && (
                                <button
                                  type="button"
                                  className="bg-primary text-primary-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => setPrimaryImage(image.id)}
                                  title="Set as primary image"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                type="button"
                                className="bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => deleteProductImage(image.id)}
                                title="Delete image"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            {image.isPrimary && (
                              <div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-sm">
                                {t('addEditProduct.primary')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {productImages.length === 0 && !newImages.length && (
                    <div className="text-center p-8 border border-dashed rounded-md">
                      <ImagePlus className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">{t('addEditProduct.noProductImages')}</p>
                      <p className="text-xs text-muted-foreground">{t('addEditProduct.clickAddImages')}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/products")}
                >
                  {t('addEditProduct.cancel')}
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? isEditing ? t('addEditProduct.updating') : t('addEditProduct.creating') 
                    : isEditing ? t('addEditProduct.updateProduct') : t('addEditProduct.createProduct')
                  }
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
