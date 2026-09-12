import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Farmer } from "@/lib/types";
import FarmerCard from "@/components/farmers/FarmerCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, ArrowRight } from "lucide-react";

export default function FeaturedFarmers() {
  const { data: farmers, isLoading, error } = useQuery<Farmer[]>({
    queryKey: ["/api/farmers?featured=true"],
  });

  const renderFarmerSkeletons = () => {
    return Array(3).fill(0).map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
        <Skeleton className="h-60 w-full" />
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center">
              <Skeleton className="h-4 w-6 mr-1" />
              <div className="flex">
                {Array(5).fill(0).map((_, j) => (
                  <Skeleton key={j} className="h-3 w-3 mx-px" />
                ))}
              </div>
            </div>
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-4" />
          <div className="flex flex-wrap gap-2 mb-4">
            {Array(3).fill(0).map((_, j) => (
              <Skeleton key={j} className="h-6 w-16 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-5 w-36" />
        </div>
      </div>
    ));
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Meet Our Farmers</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with local growers committed to sustainable agriculture and quality produce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            renderFarmerSkeletons()
          ) : error ? (
            <div className="col-span-full text-center text-red-500">
              <p>Error loading featured farmers</p>
            </div>
          ) : farmers && farmers.length > 0 ? (
            farmers.map((farmer) => (
              <FarmerCard key={farmer.id} farmer={farmer} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              <p>No featured farmers available at this time.</p>
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link href="/farmers" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
            <Users className="h-5 w-5" />
            Browse All Local Farms
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
