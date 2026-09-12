import React, { useState } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AvatarUpload from "@/components/user/AvatarUpload";

const customerProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number").optional(),
  address: z.string().min(5, "Address must be at least 5 characters").optional(),
  city: z.string().min(2, "City must be at least 2 characters").optional(),
  state: z.string().min(2, "State must be at least 2 characters").optional(),
  zipCode: z.string().min(5, "Zip code must be at least 5 characters").optional(),
  avatarUrl: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
});

type CustomerProfileFormValues = z.infer<typeof customerProfileSchema>;

export default function CustomerProfile() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/customers/profile"],
  });

  const form = useForm<CustomerProfileFormValues>({
    resolver: zodResolver(customerProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      avatarUrl: "",
    },
  });

  // Update form values when profile data is loaded
  React.useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        zipCode: profile.zipCode || "",
        avatarUrl: profile.avatarUrl || "",
      });
    }
  }, [profile, form]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: CustomerProfileFormValues) => {
      const response = await apiRequest("PUT", "/api/customers/profile", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/customers/profile"] });
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: CustomerProfileFormValues) => {
    setIsSubmitting(true);
    updateProfileMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('customerProfile.title')}</CardTitle>
          <CardDescription>{t('customerProfile.loadingDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[...Array(6)].map((_, i) => (
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

  const handleAvatarUpdate = (avatarUrl: string) => {
    form.setValue("avatarUrl", avatarUrl);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('customerProfile.title')}</CardTitle>
        <CardDescription>
          {t('customerProfile.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-8 flex justify-center">
          <AvatarUpload 
            currentAvatarUrl={profile?.avatarUrl} 
            onAvatarUpdate={handleAvatarUpdate}
            size="lg"
          />
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">{t('customerProfile.personalInfo')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('customerProfile.fullName')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('customerProfile.fullNamePlaceholder')} {...field} />
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
                      <FormLabel>{t('customerProfile.email')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('customerProfile.emailPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('customerProfile.phone')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('customerProfile.phonePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* We'll keep this field but hide it since we're using the AvatarUpload component */}
                <FormField
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormLabel>Profile Picture URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">{t('customerProfile.shippingAddress')}</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('customerProfile.streetAddress')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('customerProfile.streetAddressPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('customerProfile.city')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('customerProfile.cityPlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('customerProfile.state')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('customerProfile.statePlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('customerProfile.zipCode')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('customerProfile.zipCodePlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('customerProfile.saving') : t('customerProfile.saveChanges')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
