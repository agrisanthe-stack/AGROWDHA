import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Leaf } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer style={{ background: "linear-gradient(135deg, #2D1B0E 0%, #4A2C17 50%, #2D1B0E 100%)", color: "#F5E6C8cc" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-6">
            <div className="flex items-center">
              <img src="/logo-santhe.png" alt="FarmerSanthe Logo" className="h-14 w-auto mr-4" />
              <div className="flex flex-col">
                <span className="font-serif font-bold text-2xl" style={{ color: "#F5E6C8" }}>SANTHE</span>
                <span className="text-sm font-medium tracking-wider -mt-1" style={{ color: "#C4622D" }}>NURTURED BY NATURE • POWERED BY AI</span>
              </div>
            </div>
            <p className="leading-relaxed max-w-sm" style={{ color: "#F5E6C8bb" }}>
              {t('footer.tagline')}
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full transition-all duration-300 hover:scale-110" style={{ background: "rgba(255,255,255,0.08)", color: "#F5E6C8aa" }} onMouseEnter={e => (e.currentTarget.style.background = "#1877F2")} onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}>
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full transition-all duration-300 hover:scale-110" style={{ background: "rgba(255,255,255,0.08)", color: "#F5E6C8aa" }} onMouseEnter={e => (e.currentTarget.style.background = "#E1306C")} onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}>
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full transition-all duration-300 hover:scale-110" style={{ background: "rgba(255,255,255,0.08)", color: "#F5E6C8aa" }} onMouseEnter={e => (e.currentTarget.style.background = "#1DA1F2")} onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}>
                <Twitter size={20} />
              </a>
              <a href="#" className="p-3 rounded-full transition-all duration-300 hover:scale-110" style={{ background: "rgba(255,255,255,0.08)", color: "#F5E6C8aa" }} onMouseEnter={e => (e.currentTarget.style.background = "#C4622D")} onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}>
                <Leaf size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6 flex items-center" style={{ color: "#F5E6C8" }}>
              <span className="w-1 h-6 rounded-full mr-3" style={{ background: "linear-gradient(to bottom, #C4622D, #D4A017)" }}></span>
              {t('footer.forCustomers')}
            </h3>
            <ul className="space-y-3">
              <li><Link href="/products" className="transition-colors duration-300 hover:pl-2" style={{ color: "#F5E6C8bb" }} onMouseEnter={e => (e.currentTarget.style.color = "#D4A017")} onMouseLeave={e => (e.currentTarget.style.color = "#F5E6C8bb")}>{t('footer.shopFreshProduce')}</Link></li>
              <li><Link href="/farmers" className="transition-colors duration-300 hover:pl-2" style={{ color: "#F5E6C8bb" }} onMouseEnter={e => (e.currentTarget.style.color = "#D4A017")} onMouseLeave={e => (e.currentTarget.style.color = "#F5E6C8bb")}>{t('footer.meetLocalFarmers')}</Link></li>
              <li><Link href="/how-it-works" className="transition-colors duration-300 hover:pl-2" style={{ color: "#F5E6C8bb" }} onMouseEnter={e => (e.currentTarget.style.color = "#D4A017")} onMouseLeave={e => (e.currentTarget.style.color = "#F5E6C8bb")}>{t('footer.howItWorks')}</Link></li>
              <li><Link href="/official-buyers" className="transition-colors duration-300 hover:pl-2" style={{ color: "#F5E6C8bb" }} onMouseEnter={e => (e.currentTarget.style.color = "#D4A017")} onMouseLeave={e => (e.currentTarget.style.color = "#F5E6C8bb")}>Official Buyers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6 flex items-center" style={{ color: "#F5E6C8" }}>
              <span className="w-1 h-6 rounded-full mr-3" style={{ background: "linear-gradient(to bottom, #C4622D, #D4A017)" }}></span>
              {t('footer.forFarmers')}
            </h3>
            <ul className="space-y-3">
              <li><Link href="/register" className="transition-colors duration-300 hover:pl-2" style={{ color: "#F5E6C8bb" }} onMouseEnter={e => (e.currentTarget.style.color = "#D4A017")} onMouseLeave={e => (e.currentTarget.style.color = "#F5E6C8bb")}>{t('footer.joinSanthe')}</Link></li>
              <li><Link href="/login" className="transition-colors duration-300 hover:pl-2" style={{ color: "#F5E6C8bb" }} onMouseEnter={e => (e.currentTarget.style.color = "#D4A017")} onMouseLeave={e => (e.currentTarget.style.color = "#F5E6C8bb")}>{t('footer.farmerLogin')}</Link></li>
              <li><Link href="/how-it-works" className="transition-colors duration-300 hover:pl-2" style={{ color: "#F5E6C8bb" }} onMouseEnter={e => (e.currentTarget.style.color = "#D4A017")} onMouseLeave={e => (e.currentTarget.style.color = "#F5E6C8bb")}>{t('footer.gettingStartedGuide')}</Link></li>
              <li>
                <Link
                  href="/how-it-works#ai-marketing-video"
                  className="transition-colors duration-300 hover:pl-2 inline-flex items-center gap-1.5"
                  style={{ color: "#F5E6C8bb" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#D4A017")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#F5E6C8bb")}
                >
                  <span style={{ fontSize: '10px', fontWeight: 700, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', padding: '1px 5px', borderRadius: '4px', letterSpacing: '0.04em' }}>NEW</span>
                  AI Marketing Videos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6 flex items-center" style={{ color: "#F5E6C8" }}>
              <span className="w-1 h-6 rounded-full mr-3" style={{ background: "linear-gradient(to bottom, #C4622D, #D4A017)" }}></span>
              {t('footer.contactUs')}
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium mb-2" style={{ color: "#F5E6C8" }}>SAMSKRUTI AGRO TECH PRIVATE LIMITED</p>
                <div className="flex items-start space-x-3 mb-3" style={{ color: "#F5E6C8bb" }}>
                  <MapPin size={18} className="mt-1 flex-shrink-0" style={{ color: "#C4622D" }} />
                  <div>
                    <p>Vijaynagar, Bangalore</p>
                    <p>Karnataka 560040</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <a href="mailto:admin@farmersanthe.com" className="flex items-center space-x-3 transition-colors duration-300" style={{ color: "#F5E6C8bb" }} onMouseEnter={e => (e.currentTarget.style.color = "#D4A017")} onMouseLeave={e => (e.currentTarget.style.color = "#F5E6C8bb")}>
                  <Mail size={18} style={{ color: "#C4622D" }} />
                  <span>admin@farmersanthe.com</span>
                </a>
                <a href="tel:+918088240775" className="flex items-center space-x-3 transition-colors duration-300" style={{ color: "#F5E6C8bb" }} onMouseEnter={e => (e.currentTarget.style.color = "#D4A017")} onMouseLeave={e => (e.currentTarget.style.color = "#F5E6C8bb")}>
                  <Phone size={18} style={{ color: "#C4622D" }} />
                  <span>+91 80882 40775</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8" style={{ borderTop: "1px solid rgba(245,230,200,0.15)" }}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm" style={{ color: "#F5E6C888" }}>© {new Date().getFullYear()} Santhe Farmers Market. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm transition-colors duration-300" style={{ color: "#F5E6C888" }} onMouseEnter={e => (e.currentTarget.style.color = "#D4A017")} onMouseLeave={e => (e.currentTarget.style.color = "#F5E6C888")}>Privacy Policy</Link>
              <Link href="/terms" className="text-sm transition-colors duration-300" style={{ color: "#F5E6C888" }} onMouseEnter={e => (e.currentTarget.style.color = "#D4A017")} onMouseLeave={e => (e.currentTarget.style.color = "#F5E6C888")}>Terms of Service</Link>
              <Link href="/cookies" className="text-sm transition-colors duration-300" style={{ color: "#F5E6C888" }} onMouseEnter={e => (e.currentTarget.style.color = "#D4A017")} onMouseLeave={e => (e.currentTarget.style.color = "#F5E6C888")}>Cookie Policy</Link>
              <Link href="/shipping" className="text-sm transition-colors duration-300" style={{ color: "#F5E6C888" }} onMouseEnter={e => (e.currentTarget.style.color = "#D4A017")} onMouseLeave={e => (e.currentTarget.style.color = "#F5E6C888")}>Shipping Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
