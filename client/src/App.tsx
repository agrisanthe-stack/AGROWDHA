import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Farmers from "@/pages/Farmers";
import FarmerDetail from "@/pages/FarmerDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import OrderDetail from "@/pages/OrderDetail";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Cookies from "@/pages/Cookies";
import Shipping from "@/pages/Shipping";
import HowItWorks from "@/pages/HowItWorks";
import AddEditProduct from "@/components/dashboard/AddEditProduct";
import ZbnfRecommendations from "@/pages/ZbnfRecommendations";
import Events from "@/pages/Events";
import EventDetail from "@/pages/EventDetail";
import EventPaymentStatus from "@/pages/EventPaymentStatus";
import FpoStores from "@/pages/FpoStores";
import Wholesale from "@/pages/Wholesale";
import FPOProductDetail from "@/pages/FPOProductDetail";
import Subscription from "@/pages/Subscription";
import OrgPage from "@/pages/OrgPage";
import OfficialBuyers from "@/pages/OfficialBuyers";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart";
import { DistrictContext, useDistrictState } from "@/hooks/use-district";
import DistrictSelector from "@/components/DistrictSelector";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ProtectedRoute } from "@/lib/protected-route";

// Scroll to top on route change
function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  const [, setLocation] = useLocation();
  
  // Handle redirects from server-side routing
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get('redirect');
    
    if (redirectPath) {
      // Clean the URL and navigate to the intended path
      window.history.replaceState({}, '', window.location.pathname);
      setLocation(redirectPath);
    }
  }, [setLocation]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/retail" component={Products} />
      <Route path="/products" component={Products} />
      <Route path="/products/:identifier" component={ProductDetail} />
      <Route path="/farmers" component={Farmers} />
      <Route path="/farmers/:identifier" component={FarmerDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/checkout/success" component={CheckoutSuccess} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/cookies" component={Cookies} />
      <Route path="/shipping" component={Shipping} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/official-buyers" component={OfficialBuyers} />
      <Route path="/events" component={Events} />
      <Route path="/events/payment-status" component={EventPaymentStatus} />
      <Route path="/events/:id" component={EventDetail} />
      <Route path="/fpo-stores" component={FpoStores} />
      <Route path="/subscription" component={Subscription} />
      <Route path="/org/:slug" component={OrgPage} />
      <Route path="/org/:slug/retail" component={OrgPage} />
      <Route path="/org/:slug/wholesale" component={OrgPage} />
      <Route path="/org/:slug/farmers-list" component={OrgPage} />
      <Route path="/org/:slug/events-list" component={OrgPage} />
      <Route path="/org/:slug/harvest-calendar" component={OrgPage} />
      <Route path="/org/:slug/products/:identifier" component={ProductDetail} />
      <Route path="/org/:slug/farmers/:identifier" component={FarmerDetail} />
      <Route path="/org/:slug/events/:id" component={EventDetail} />
      <Route path="/wholesale" component={Wholesale} />
      <Route path="/fpo-products" component={Wholesale} />
      <Route path="/fpo-products/:id" component={FPOProductDetail} />
      <ProtectedRoute path="/zbnf-recommendations" component={ZbnfRecommendations} />
      {/* Protected routes - only accessible when logged in */}
      <ProtectedRoute path="/dashboard/products/new" component={AddEditProduct} />
      <ProtectedRoute path="/dashboard/products/:id" component={AddEditProduct} />
      <ProtectedRoute path="/dashboard/orders/:id" component={OrderDetail} />
      <ProtectedRoute path="/dashboard/:tab?" component={Dashboard} />
      <ProtectedRoute path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  const [location] = useLocation();
  const isOrgPage = location.startsWith('/org/');

  if (isOrgPage) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Router />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pb-16 md:pb-0">
        <Router />
      </main>
      <Footer />
    </div>
  );
}

function DistrictProvider({ children }: { children: React.ReactNode }) {
  const districtState = useDistrictState();
  return (
    <DistrictContext.Provider value={districtState}>
      {children}
      <DistrictSelector />
    </DistrictContext.Provider>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <DistrictProvider>
          <ScrollToTop />
          <AppLayout />
          <Toaster />
        </DistrictProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
