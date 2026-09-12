import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/ui/LanguageSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationCenter } from "@/components/NotificationCenter";
import { useDistrict } from "@/hooks/use-district";
import { ShoppingBasket, Menu, Store, Package, Calendar, Users, Building2, HelpCircle, Tractor, MapPin } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout, toggleRole, viewingAs } = useAuth();
  const { cartItems, clearCart } = useCart();
  const { selectedDistrictName, setShowSelector } = useDistrict();
  const { t } = useTranslation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      
      // Don't close if clicking on Select dropdown content (rendered in portal)
      if (target.closest('[data-radix-popper-content-wrapper]') || 
          target.closest('[role="listbox"]') ||
          target.closest('[data-radix-select-content]')) {
        return;
      }
      
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        menuButtonRef.current &&
        !mobileMenuRef.current.contains(target) &&
        !menuButtonRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside as any);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside as any);
    };
  }, [mobileMenuOpen]);

  // Desktop navigation - all links
  const navLinks = [
    { name: t('nav.retail'), href: "/products", active: location === "/products" },
    { name: t('nav.wholesale'), href: "/wholesale", active: location === "/wholesale" || location.startsWith("/wholesale/") },
    { name: t('nav.events'), href: "/events", active: location === "/events" },
    { name: t('nav.fpoStores'), href: "/fpo-stores", active: location === "/fpo-stores" },
    { name: t('nav.howItWorks'), href: "/how-it-works", active: location === "/how-it-works" },
  ];

  // Mobile bottom navigation - 5 key links with icons
  const bottomNavLinks = [
    { name: t('nav.retail'), href: "/products", icon: Store, active: location === "/products" },
    { name: t('nav.wholesale'), href: "/wholesale", icon: Package, active: location === "/wholesale" || location.startsWith("/wholesale/") },
    { name: t('nav.events'), href: "/events", icon: Calendar, active: location === "/events" },
    { name: t('nav.fpoStores'), href: "/fpo-stores", icon: Building2, active: location === "/fpo-stores" },
  ];

  // Mobile menu - remaining items not in bottom nav
  const mobileMenuLinks = [
    { name: t('nav.howItWorks'), href: "/how-it-works", icon: HelpCircle, active: location === "/how-it-works" },
  ];

  return (
    <>
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <img src="/logo-santhe.png" alt="FarmerSanthe Logo" className="h-14 w-auto mr-4 transition-transform duration-300 group-hover:scale-105" />
              <div className="flex flex-col">
                <span className="font-serif font-bold text-2xl" style={{ color: "#4A2C17" }}>SANTHE</span>
                <span className="text-xs font-medium tracking-wider -mt-1" style={{ color: "#C4622D" }}>NURTURED BY NATURE • POWERED BY AI</span>
              </div>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2 font-medium rounded-full transition-all duration-300 ${
                  link.active
                    ? "text-white bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg"
                    : "text-gray-700 hover:text-green-700 hover:bg-green-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* District Selector */}
            <button
              onClick={() => setShowSelector(true)}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-full transition-colors border border-green-200"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span className="max-w-[100px] truncate">{selectedDistrictName || "Select District"}</span>
            </button>

            {/* Language Selector */}
            <LanguageSelector variant="compact" className="hidden sm:flex" />
            
            <Link
              href="/cart"
              className="p-2 text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-all duration-300 relative"
            >
              <ShoppingBasket size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg animate-pulse">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Notifications */}
            {user && <NotificationCenter userId={user.id} />}

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 h-10 w-10 rounded-full hover:ring-2 hover:ring-green-200 transition-all duration-300">
                    <Avatar className="h-10 w-10 ring-2 ring-green-100">
                      <AvatarImage src={user.role === 'district_manager' && user.orgLogoUrl ? user.orgLogoUrl : user.avatar} alt={user.role === 'district_manager' && user.orgName ? user.orgName : user.name} />
                      <AvatarFallback className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    {user.role === 'district_manager' && user.orgName ? (
                      <>
                        <p className="text-sm font-medium">{user.orgName}</p>
                        <p className="text-xs text-muted-foreground">{user.name} &middot; {user.district || 'DM'}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  
                  {/* Account Mode Switch for Farmers */}
                  {user.role === "farmer" && (
                    <>
                      <DropdownMenuLabel className="text-xs text-muted-foreground">Account Mode</DropdownMenuLabel>
                      <div className="px-2 pb-2">
                        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                          <button
                            onClick={() => toggleRole("customer")}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
                              viewingAs === "customer"
                                ? "bg-green-100 text-green-700 border-r border-green-200"
                                : "bg-white text-gray-600 hover:bg-gray-50 border-r border-gray-200"
                            }`}
                          >
                            <Store className="h-3.5 w-3.5" />
                            Buy
                          </button>
                          <button
                            onClick={() => toggleRole("farmer")}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
                              viewingAs === "farmer"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <Tractor className="h-3.5 w-3.5" />
                            Sell
                          </button>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  
                  {["admin", "district_manager", "taluk_agent", "delivery_agent"].includes(user.role) ? (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">{t('nav.dashboard')}</Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">{t('nav.dashboard')}</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    clearCart(); // Clear cart when user logs out
                    logout();
                  }}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button className="text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" style={{ background: "linear-gradient(135deg, #C4622D, #4A2C17)" }}>
                  {t('nav.login')}
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              ref={menuButtonRef}
              type="button"
              className="md:hidden text-gray-600 hover:text-primary-500 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Backdrop - closes menu when clicked */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden bg-black/20" 
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Dropdown Menu - only shows items not in bottom nav */}
      {mobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden relative z-50 bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {mobileMenuLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center px-3 py-2 text-base font-medium ${
                  link.active
                    ? "text-primary-600 bg-primary-50"
                    : "text-gray-600 hover:bg-primary-50 hover:text-primary-600"
                } rounded-md`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <link.icon size={18} className="mr-2" />
                {link.name}
              </Link>
            ))}
            
            {/* District Selector for mobile */}
            <button
              onClick={() => { setShowSelector(true); setMobileMenuOpen(false); }}
              className="flex items-center w-full px-3 py-2 text-base font-medium text-green-700 hover:bg-green-50 rounded-md"
            >
              <MapPin size={18} className="mr-2" />
              {selectedDistrictName || "Select District"}
            </button>

            {/* Language Selector for mobile */}
            <div className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
              <LanguageSelector className="w-full" />
            </div>
          </div>
        </div>
      )}

    </header>

      {/* Mobile Bottom Navigation Bar - outside header for proper fixed positioning */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center h-16">
          {bottomNavLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 ${
                link.active
                  ? "text-green-600"
                  : "text-gray-500 hover:text-green-600"
              }`}
            >
              <link.icon size={20} className={link.active ? "text-green-600" : ""} />
              <span className="text-[10px] mt-1 font-medium truncate max-w-[60px] text-center">
                {link.name}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
