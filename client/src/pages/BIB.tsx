import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/lib/types";
import { Package, ArrowRight, TrendingUp, Users, DollarSign } from "lucide-react";

export default function BIB() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch B2B products (quote mode)
  const { data: b2bProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { quoteMode: true }],
  });

  const filteredProducts = b2bProducts?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <>
      <Helmet>
        <title>BIB - Buy In Bulk | B2B Agricultural Products | FarmerSanthe</title>
        <meta name="description" content="Buy agricultural products in bulk directly from farmers. Submit competitive quotes and get the best wholesale prices for large quantity orders." />
        <meta name="keywords" content="buy in bulk, B2B agriculture, wholesale produce, bulk orders, farmer direct, competitive quotes" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <Package className="h-10 w-10" />
              </div>
              <h1 className="text-5xl font-bold mb-6">BIB - Buy In Bulk</h1>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto mb-8">
                Connect directly with farmers for wholesale agricultural products. 
                Submit your quote and get competitive pricing for bulk orders.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <TrendingUp className="h-5 w-5" />
                  <span>Competitive Pricing</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Users className="h-5 w-5" />
                  <span>Direct from Farmers</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <DollarSign className="h-5 w-5" />
                  <span>Best Wholesale Rates</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Available Bulk Products</h2>
                <p className="text-gray-600">Browse products available for wholesale ordering</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="Search bulk products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-5 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="transform hover:scale-105 transition-transform duration-300">
                    <div className="relative">
                      {(product as any).isSold ? (
                        <Badge className="absolute top-4 right-4 z-10 bg-red-600 text-white">
                          <Package className="h-3 w-3 mr-1" />
                          Sold Out
                        </Badge>
                      ) : (
                        <Badge className="absolute top-4 right-4 z-10 bg-orange-600 text-white">
                          <Package className="h-3 w-3 mr-1" />
                          Bulk Order
                        </Badge>
                      )}
                      <ProductCard product={product} displayMode="b2b" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Package className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-600 mb-3">
                  {searchTerm ? "No products found" : "No B2B Products Available"}
                </h3>
                <p className="text-gray-500 mb-8">
                  {searchTerm ? "Try adjusting your search" : "Check back soon for bulk ordering opportunities"}
                </p>
                {!searchTerm && (
                  <Link href="/products">
                    <Button className="bg-orange-600 hover:bg-orange-700">
                      Browse Regular Products
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
