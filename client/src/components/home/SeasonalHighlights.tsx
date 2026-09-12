import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, ArrowRight } from "lucide-react";

export default function SeasonalHighlights() {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products?seasonal=true&limit=4"],
  });

  const renderProductSkeletons = () => {
    return Array(4).fill(0).map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
        <Skeleton className="h-48 w-full" />
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full mb-3" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center">
              <Skeleton className="h-6 w-6 rounded-full mr-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </div>
      </div>
    ));
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">In Season Now</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover what local farmers are harvesting this month, at peak freshness and flavor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            renderProductSkeletons()
          ) : error ? (
            <div className="col-span-full text-center text-red-500">
              <p>Error loading seasonal products</p>
            </div>
          ) : products && products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              <p>No seasonal products available at this time.</p>
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
            <ShoppingCart className="h-5 w-5" />
            View All Seasonal Produce
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
