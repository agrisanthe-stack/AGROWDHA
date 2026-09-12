import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
})
.refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [resetComplete, setResetComplete] = useState(false);
  
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');
  
  useEffect(() => {
    if (!token) {
      toast({
        title: t('resetPassword.noTokenTitle'),
        description: t('resetPassword.noTokenDescription'),
        variant: "destructive",
      });
      navigate("/forgot-password");
    }
  }, [token, navigate, toast]);
  
  const { data: tokenData, isLoading: isVerifyingToken, error: tokenError } = useQuery({
    queryKey: [`/api/reset-password/${token}`],
    enabled: !!token,
  });
  
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  
  const [username, setUsername] = useState<string>("");
  
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { token: string; password: string }) => {
      const response = await apiRequest("POST", "/api/reset-password", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.username) {
        setUsername(data.username);
      }
      
      toast({
        title: t('resetPassword.successTitle'),
        description: t('resetPassword.successDescription'),
        variant: "default",
      });
      setResetComplete(true);
    },
    onError: (error) => {
      toast({
        title: t('resetPassword.resetFailedTitle'),
        description: error.message || t('resetPassword.resetFailedDescription'),
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: ResetPasswordFormValues) => {
    if (token) {
      resetPasswordMutation.mutate({
        token,
        password: data.password,
      });
    }
  };
  
  if (isVerifyingToken) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-center text-muted-foreground">{t('resetPassword.verifying')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (tokenError || !tokenData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-serif text-center">{t('resetPassword.invalidRequestTitle')}</CardTitle>
              <CardDescription className="text-center">
                {t('resetPassword.invalidRequestDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 p-4 rounded-md text-red-800 text-sm">
                <p>{t('resetPassword.invalidLinkMessage')}</p>
                <ul className="list-disc ml-5 mt-2">
                  <li>{t('resetPassword.linkExpired')}</li>
                  <li>{t('resetPassword.linkUsed')}</li>
                  <li>{t('resetPassword.linkModified')}</li>
                </ul>
              </div>
              <Button 
                variant="default" 
                className="w-full" 
                onClick={() => navigate("/forgot-password")}
              >
                {t('resetPassword.requestNewLink')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-md mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4 pl-0" 
          onClick={() => navigate("/login")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('resetPassword.backToLogin')}
        </Button>
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-serif text-center">{t('resetPassword.title')}</CardTitle>
            <CardDescription className="text-center">
              {t('resetPassword.description')}
            </CardDescription>
          </CardHeader>
          
          {!resetComplete ? (
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('resetPassword.newPasswordLabel')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            disabled={resetPasswordMutation.isPending}
                          />
                        </FormControl>
                        <FormDescription>
                          {t('resetPassword.passwordMinLength')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('resetPassword.confirmPasswordLabel')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            disabled={resetPasswordMutation.isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={resetPasswordMutation.isPending}
                  >
                    {resetPasswordMutation.isPending ? t('resetPassword.resetting') : t('resetPassword.resetPassword')}
                  </Button>
                </form>
              </Form>
            </CardContent>
          ) : (
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-md text-green-800 text-sm">
                <p className="mb-2 font-medium">{t('resetPassword.passwordResetSuccess')}</p>
                <p>
                  {t('resetPassword.passwordUpdatedMessage')} {username && <strong>{t('resetPassword.passwordUpdatedAs', { username })}</strong>} {t('resetPassword.passwordUpdatedSuffix')}
                </p>
              </div>
              
              <Button 
                variant="default" 
                className="w-full" 
                onClick={() => navigate("/login")}
              >
                {t('resetPassword.goToLogin')}
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
