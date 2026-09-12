import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Leaf, Users, ShoppingBasket, Brain, CheckCircle } from "lucide-react";
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

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { t } = useTranslation();
  const [location, navigate] = useLocation();
  const searchString = typeof location === 'string' ? location.split('?')[1] || '' : window.location.search.substring(1);
  const params = new URLSearchParams(searchString);
  const redirectTo = params.get('redirect') || '/';
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const response = await apiRequest("POST", "/api/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      login(data);
      toast({
        title: t('auth.toast.loginSuccess'),
        description: t('auth.toast.welcomeBack'),
        variant: "default",
      });
      setTimeout(() => {
        if (data.user?.role === 'district_manager' || data.user?.role === 'admin' || data.user?.role === 'taluk_agent') {
          window.location.href = '/admin';
        } else {
          navigate(redirectTo);
        }
      }, 100);
    },
    onError: (error) => {
      toast({
        title: t('auth.toast.loginFailed'),
        description: error.message || t('auth.toast.invalidCredentials'),
        variant: "destructive",
      });
      setIsLoading(false);
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setIsLoading(true);
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #FDF8F0 0%, #F5E6C8 50%, #FDF8F0 100%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[80vh]">
          {/* Left Side - Branding */}
          <div className="hidden lg:block">
            <div className="rounded-3xl p-10 text-white shadow-2xl" style={{ background: "linear-gradient(135deg, #4A2C17, #6B3A25, #2D1B0E)" }}>
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">SANTHE</h1>
                <p className="text-lg" style={{ color: "#F5E6C8cc" }}>{t('auth.branding.tagline')}</p>
              </div>

              <h2 className="text-2xl font-semibold mb-6">
                {t('home.heroTitle1')}
              </h2>

              <p className="mb-8 text-lg leading-relaxed" style={{ color: "#F5E6C8dd" }}>
                {t('home.heroSubtitle1')}
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <Leaf className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('whyChoose.natural')}</h3>
                    <p className="text-sm" style={{ color: "#F5E6C8aa" }}>{t('whyChoose.naturalDesc')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('whyChoose.directFromFarmers')}</h3>
                    <p className="text-sm" style={{ color: "#F5E6C8aa" }}>{t('whyChoose.directFromFarmersDesc')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <Brain className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('whyChoose.aiPoweredZbnf')}</h3>
                    <p className="text-sm" style={{ color: "#F5E6C8aa" }}>{t('whyChoose.aiPoweredZbnfDesc')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <ShoppingBasket className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('auth.branding.easyOrdering')}</h3>
                    <p className="text-sm" style={{ color: "#F5E6C8aa" }}>{t('auth.branding.homeDelivery')}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6" style={{ borderTop: "1px solid rgba(245,230,200,0.2)" }}>
                <p className="text-sm italic" style={{ color: "#F5E6C8aa" }}>
                  "{t('auth.branding.empowering')}"
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {/* Mobile Branding */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-3xl font-bold" style={{ color: "#4A2C17" }}>SANTHE</h1>
              <p style={{ color: "#C4622D" }}>{t('auth.branding.tagline')}</p>
              <p className="text-gray-600 mt-2 text-sm">{t('home.heroTitle1')}</p>
            </div>

            <Card className="shadow-xl border-0">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-serif text-center">{t('auth.welcomeBack')}</CardTitle>
                <CardDescription className="text-center">
                  {t('auth.signInAccess')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('auth.username')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('auth.username')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('auth.password')}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...field}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      <Link href="/forgot-password" className="text-sm hover:underline" style={{ color: "#C4622D" }}>
                        {t('auth.forgotPassword', 'Forgot Password?')}
                      </Link>
                    </div>
                    <Button
                      type="submit"
                      className="w-full text-white border-0"
                      style={{ background: "linear-gradient(135deg, #C4622D, #4A2C17)" }}
                      disabled={isLoading}
                    >
                      {isLoading ? t('auth.signingIn') : t('auth.signIn')}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-center text-sm">
                  {t('auth.noAccount')}{" "}
                  <Link href="/register" className="font-medium hover:underline" style={{ color: "#C4622D" }}>
                    {t('auth.registerHere')}
                  </Link>
                </div>
              </CardFooter>
            </Card>

            {/* Mobile Features */}
            <div className="lg:hidden mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-md text-center">
                <Leaf className="h-6 w-6 mx-auto mb-2" style={{ color: "#C4622D" }} />
                <p className="text-xs text-gray-600">{t('auth.branding.naturalProduce')}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md text-center">
                <Users className="h-6 w-6 mx-auto mb-2" style={{ color: "#C4622D" }} />
                <p className="text-xs text-gray-600">{t('auth.branding.directFromFarm')}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md text-center">
                <Brain className="h-6 w-6 mx-auto mb-2" style={{ color: "#4A2C17" }} />
                <p className="text-xs text-gray-600">{t('auth.branding.aiZbnf')}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md text-center">
                <ShoppingBasket className="h-6 w-6 mx-auto mb-2" style={{ color: "#D4A017" }} />
                <p className="text-xs text-gray-600">{t('auth.branding.easyOrdering')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
