import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
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
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordFormValues) => {
      const response = await apiRequest("POST", "/api/forgot-password", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: t('forgotPassword.requestSentTitle'),
        description: t('forgotPassword.requestSentDescription'),
        variant: "default",
      });
      
      if (data.resetToken) {
        setResetToken(data.resetToken);
      }
      
      setIsRequestSent(true);
    },
    onError: (error) => {
      toast({
        title: t('forgotPassword.requestFailedTitle'),
        description: error.message || t('forgotPassword.requestFailedDescription'),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate(data);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-md mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4 pl-0" 
          onClick={() => navigate("/login")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('forgotPassword.backToLogin')}
        </Button>
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-serif text-center">{t('forgotPassword.title')}</CardTitle>
            <CardDescription className="text-center">
              {t('forgotPassword.description')}
            </CardDescription>
          </CardHeader>
          
          {!isRequestSent ? (
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('forgotPassword.emailLabel')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder={t('forgotPassword.emailPlaceholder')} 
                            {...field} 
                            disabled={forgotPasswordMutation.isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={forgotPasswordMutation.isPending}
                  >
                    {forgotPasswordMutation.isPending ? t('forgotPassword.sending') : t('forgotPassword.sendResetInstructions')}
                  </Button>
                </form>
              </Form>
            </CardContent>
          ) : (
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-md text-green-800 text-sm">
                <p className="mb-2 font-medium">{t('forgotPassword.emailSent')}</p>
                <p>
                  {t('forgotPassword.emailSentMessage')}
                </p>
              </div>
              
              {resetToken && (
                <div className="bg-blue-50 p-4 rounded-md text-blue-800 text-sm">
                  <p className="mb-2 font-medium">{t('forgotPassword.devModeTitle')}</p>
                  <p className="mb-2">{t('forgotPassword.devModeMessage')}</p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/reset-password?token=${resetToken}`)}
                  >
                    {t('forgotPassword.resetPasswordNow')}
                  </Button>
                </div>
              )}
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate("/login")}
              >
                {t('forgotPassword.returnToLogin')}
              </Button>
            </CardContent>
          )}
          
          <CardFooter className="flex justify-center border-t pt-4">
            <Button variant="link" onClick={() => navigate("/login")}>
              {t('forgotPassword.rememberPassword')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
