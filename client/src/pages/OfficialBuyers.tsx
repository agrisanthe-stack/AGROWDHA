import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Loader2, Building2, ShoppingBag, Store, Briefcase, Package } from "lucide-react";
import type { OfficialBuyer } from "@shared/schema.ts";

const BUYER_TYPE_LABELS: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  hotel:     { label: "Luxury Hotel",  color: "bg-purple-100 text-purple-800 border-purple-200", icon: Building2 },
  trader:    { label: "Trader",         color: "bg-blue-100 text-blue-800 border-blue-200",       icon: Briefcase },
  retailer:  { label: "Retailer",       color: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: Store },
  corporate: { label: "Corporate",      color: "bg-orange-100 text-orange-800 border-orange-200", icon: ShoppingBag },
  caterer:   { label: "Caterer",        color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Package },
  Apartment: { label: "Apartment",        color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Building2 },
  other:     { label: "Official Buyer", color: "bg-gray-100 text-gray-700 border-gray-200",       icon: Package },
};

function BuyerCard({ buyer }: { buyer: OfficialBuyer }) {
  const meta = BUYER_TYPE_LABELS[buyer.type] ?? BUYER_TYPE_LABELS.other;
  const Icon = meta.icon;

  return (
    <div className="flex flex-col items-center bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-6 gap-4">
      <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100">
        {buyer.logoUrl ? (
          <img
            src={buyer.logoUrl}
            alt={buyer.name}
            className="w-full h-full object-contain p-1"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : null}
        <Icon className={`h-10 w-10 text-gray-300 ${buyer.logoUrl ? "hidden" : ""}`} />
      </div>
      <div className="text-center space-y-2">
        <h3 className="font-semibold text-gray-900 text-base leading-tight">{buyer.name}</h3>
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border ${meta.color}`}>
          <Icon className="h-3 w-3" />
          {meta.label}
        </span>
      </div>
    </div>
  );
}

export default function OfficialBuyers() {
  const { data: buyers, isLoading } = useQuery<OfficialBuyer[]>({
    queryKey: ["/api/official-buyers"],
  });

  return (
    <>
      <Helmet>
        <title>Official Buyers | Santhe Farmers Market</title>
        <meta
          name="description"
          content="Meet Santhe's verified official buyers — luxury hotels, traders, retailers, and corporates who partner with us to bring fresh farm produce to their customers."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {/* Hero */}
        <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
              <Building2 className="h-4 w-4" />
              Trusted Partners
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              Our Official Buyers
            </h1>
            <p className="text-green-100 text-lg max-w-2xl mx-auto">
              These verified partners trust Santhe to supply fresh, naturally grown produce directly
              from our farmers — ensuring quality, traceability, and fair trade.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-10 w-10 animate-spin text-green-600" />
            </div>
          ) : !buyers || buyers.length === 0 ? (
            <div className="text-center py-24">
              <Building2 className="h-16 w-16 text-gray-200 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Coming Soon</h2>
              <p className="text-gray-400">
                We are onboarding our official buyer partners. Check back soon!
              </p>
            </div>
          ) : (
            <>
              <p className="text-center text-gray-500 mb-10 text-sm">
                {buyers.length} verified partner{buyers.length !== 1 ? "s" : ""} across hotels,
                traders, retailers and more
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {buyers.map((buyer) => (
                  <BuyerCard key={buyer.id} buyer={buyer} />
                ))}
              </div>
            </>
          )}

          {/* Trust callout */}
          <div className="mt-16 bg-green-50 border border-green-100 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-semibold text-green-900 mb-2">Want to become an official buyer?</h2>
            <p className="text-green-700 text-sm max-w-lg mx-auto mb-4">
              Join our network of trusted business buyers. Get access to bulk pricing, guaranteed
              freshness, and direct farmer relationships.
            </p>
            <a
              href="mailto:admin@farmersanthe.com"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
