import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Leaf, Users, ShoppingBasket, Brain, Truck, Award, CheckCircle } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").regex(/^[\d\s\+\-\(\)]+$/, "Please enter a valid phone number"),
  role: z.enum(["customer", "farmer"]),
  farmName: z.string().optional(),
  farmLocation: z.string().optional(),
  farmDescription: z.string().optional(),
}).superRefine((data, ctx) => {
  // Make farmName and farmDescription required for farmers
  if (data.role === "farmer") {
    if (!data.farmName || data.farmName.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Farm name is required and must be at least 2 characters",
        path: ["farmName"],
      });
    }
    if (!data.farmDescription || data.farmDescription.trim().length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Farm description is required and must be at least 10 characters",
        path: ["farmDescription"],
      });
    }
    if (!data.farmLocation || data.farmLocation.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Farm location is required",
        path: ["farmLocation"],
      });
    }
  }
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const { t } = useTranslation();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch active districts from database
  const { data: districts = [] } = useQuery({
    queryKey: ["/api/districts?active=true"],
    enabled: true
  });

  // Get the role from the search params, if any
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  // Check for both 'role' and 'type' parameters to support different link formats
  const roleParam = searchParams.get("role");
  const typeParam = searchParams.get("type");
  const initialRole = ((roleParam || typeParam) as "farmer" | "customer") || "customer";

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      name: "",
      phone: "",
      role: initialRole,
      farmName: "",
      farmLocation: "",
      farmDescription: "",
    },
  });

  const selectedRole = form.watch("role");

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      const response = await apiRequest("POST", "/api/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      login(data);
      toast({
        title: t('auth.toast.registrationSuccess'),
        description: t('auth.toast.welcomeToSanthe'),
        variant: "default",
      });
      navigate("/");
    },
    onError: (error) => {
      toast({
        title: t('auth.toast.registrationFailed'),
        description: error.message || t('auth.toast.registrationError'),
        variant: "destructive",
      });
      setIsLoading(false);
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    setIsLoading(true);
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8 items-start min-h-[90vh]">
          {/* Left Side - Branding */}
          <div className="hidden lg:block lg:col-span-2 lg:sticky lg:top-8">
            <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-3xl p-8 text-white shadow-2xl">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-1">SANTHE</h1>
                <p className="text-emerald-200">{t('auth.branding.tagline')}</p>
              </div>
              
              <h2 className="text-xl font-semibold mb-4">
                {t('auth.joinCommunity')}
              </h2>
              
              <p className="text-emerald-100 mb-6 leading-relaxed">
                {t('auth.accessFresh')}
              </p>
              
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" /> {t('auth.branding.forCustomers')}
                </h3>
                <div className="space-y-2 ml-7">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-300" />
                    <span className="text-sm text-emerald-100">{t('auth.branding.freshProduce')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-300" />
                    <span className="text-sm text-emerald-100">{t('auth.branding.transparentPricing')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-300" />
                    <span className="text-sm text-emerald-100">{t('auth.branding.homeDelivery')}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Leaf className="h-5 w-5" /> {t('auth.branding.forFarmers')}
                </h3>
                <div className="space-y-2 ml-7">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-300" />
                    <span className="text-sm text-emerald-100">{t('auth.branding.sellDirectly')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-300" />
                    <span className="text-sm text-emerald-100">{t('auth.branding.freeAiZbnf')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-300" />
                    <span className="text-sm text-emerald-100">{t('auth.branding.dmSupport')}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="h-6 w-6 text-blue-300" />
                  <span className="font-semibold">{t('auth.branding.aiZbnf')}</span>
                </div>
                <p className="text-emerald-200 text-sm">
                  {t('auth.branding.aiZbnfDesc')}
                </p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-emerald-500/30">
                <p className="text-emerald-200 text-sm italic">
                  "{t('auth.branding.empowering')}"
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Side - Register Form */}
          <div className="lg:col-span-3">
            {/* Mobile Branding */}
            <div className="lg:hidden text-center mb-6">
              <h1 className="text-3xl font-bold text-emerald-700">SANTHE</h1>
              <p className="text-emerald-600">{t('auth.branding.tagline')}</p>
              <p className="text-gray-600 mt-2 text-sm">{t('auth.joinCommunity')}</p>
            </div>
            
            <Card className="shadow-xl border-0">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-serif text-center">{t('auth.createAccount')}</CardTitle>
                <CardDescription className="text-center">
                  {t('auth.accessFresh')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>{t('auth.accountType')}</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:bg-emerald-50 transition-colors">
                                <FormControl>
                                  <RadioGroupItem value="customer" />
                                </FormControl>
                                <div className="flex items-center gap-2">
                                  <ShoppingBasket className="h-5 w-5 text-orange-500" />
                                  <FormLabel className="font-normal cursor-pointer">
                                    {t('auth.customerDesc')}
                                  </FormLabel>
                                </div>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:bg-emerald-50 transition-colors">
                                <FormControl>
                                  <RadioGroupItem value="farmer" />
                                </FormControl>
                                <div className="flex items-center gap-2">
                                  <Leaf className="h-5 w-5 text-emerald-600" />
                                  <FormLabel className="font-normal cursor-pointer">
                                    {t('auth.farmerDesc')}
                                  </FormLabel>
                                </div>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.username')} *</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.name')} *</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.email')} *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="" {...field} />
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
                        <FormLabel>{t('auth.phone')} *</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.password')} *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            {...field} 
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Password must be at least 6 characters long
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedRole === "farmer" && (
                  <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="font-medium">{t('auth.farmName')}</h3>
                    <FormField
                      control={form.control}
                      name="farmName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('auth.farmName')} *</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="farmLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('auth.district')} *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('auth.selectDistrict')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[200px]">
                              {districts.map((district: any) => (
                                <SelectItem key={district.id} value={district.name}>
                                  {district.name}
                                  {district.state && <span className="text-muted-foreground text-xs ml-2">({district.state})</span>}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="farmDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('auth.farmDescription')} *</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={isLoading}
                >
                  {isLoading ? t('auth.creatingAccount') : t('auth.createAccount')}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              {t('auth.alreadyAccount')}{" "}
              <Link href="/login" className="text-emerald-600 hover:text-emerald-800 font-medium">
                {t('auth.loginHere')}
              </Link>
            </div>
          </CardFooter>
        </Card>
        
        {/* Mobile Features */}
        <div className="lg:hidden mt-6 grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3 shadow-md text-center">
            <Leaf className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600">{t('auth.branding.naturalProduce')}</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-md text-center">
            <Users className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600">{t('auth.branding.directFromFarm')}</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-md text-center">
            <Brain className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600">{t('auth.branding.aiZbnf')}</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-md text-center">
            <Truck className="h-5 w-5 text-orange-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600">{t('auth.branding.homeDelivery')}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}
