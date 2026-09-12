import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarEntry } from "@/lib/types";
import { Calendar, Leaf, Clock, ShoppingCart, Sprout, Sparkles, ArrowRight, Building } from "lucide-react";

export default function HarvestCalendarPreview() {
  const { data: calendarEntries, isLoading, error } = useQuery<CalendarEntry[]>({
    queryKey: ["/api/calendar"],
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'growing':
        return <Sprout className="h-3 w-3" />;
      case 'harvesting':
        return <Clock className="h-3 w-3" />;
      case 'pre-order':
        return <Calendar className="h-3 w-3" />;
      case 'available':
        return <ShoppingCart className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'growing':
        return 'bg-blue-500';
      case 'harvesting':
        return 'bg-orange-500';
      case 'pre-order':
        return 'bg-yellow-500';
      case 'available':
        return 'bg-green-500';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-white shadow-lg">
              <Calendar className="h-8 w-8" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
              Harvest Calendar
            </h2>
            <Sparkles className="h-6 w-6 text-yellow-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover seasonal freshness! Plan your purchases with our interactive calendar showing when local produce is growing, harvesting, and available.
          </p>
        </div>

        {/* Calendar Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 bg-gradient-to-r from-green-50 via-emerald-50 to-blue-50 rounded-xl border border-green-100 shadow-sm">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
              <Sprout className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Growing</div>
              <div className="text-xs text-gray-500">Still developing</div>
            </div>
          </div>
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Harvesting</div>
              <div className="text-xs text-gray-500">Being picked</div>
            </div>
          </div>
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Pre-Order</div>
              <div className="text-xs text-gray-500">Book ahead</div>
            </div>
          </div>
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
              <ShoppingCart className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Available</div>
              <div className="text-xs text-gray-500">Ready now</div>
            </div>
          </div>
        </div>

        {/* Calendar Table */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2"></div>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-2xl text-gray-800">
              <Leaf className="h-6 w-6 text-green-600" />
              Seasonal Availability
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-6 px-8 text-left text-sm font-bold text-gray-900 bg-gradient-to-r from-green-50 to-emerald-50 sticky left-0 z-10 min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-green-600" />
                        Produce
                      </div>
                    </th>
                    {months.map((m, i) => (
                      <th 
                        key={i} 
                        className="py-6 px-4 text-center text-sm font-bold min-w-[80px] text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100"
                      >
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-base">{m.slice(0, 3)}</span>
                          <span className="text-xs opacity-75">{new Date().getFullYear()}</span>
                        </div>
                      </th>
                    ))}
                    <th className="py-6 px-8 text-left text-sm font-bold text-gray-900 bg-gradient-to-r from-green-50 to-emerald-50 sticky right-0 z-10 min-w-[150px]">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-green-600" />
                        Local Farms
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    Array(4).fill(0).map((_, i) => (
                      <tr key={i} className="hover:bg-gradient-to-r hover:from-green-25 hover:to-emerald-25 transition-colors">
                        <td className="py-6 px-8 sticky left-0 bg-white z-10">
                          <div className="flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                          </div>
                        </td>
                        {Array(12).fill(0).map((_, j) => (
                          <td key={j} className="py-6 px-4">
                            <Skeleton className="h-8 w-full rounded-lg" />
                          </td>
                        ))}
                        <td className="py-6 px-8 sticky right-0 bg-white z-10">
                          <div className="flex -space-x-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : error ? (
                    <tr>
                      <td colSpan={14} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <Calendar className="h-8 w-8 text-red-500" />
                          </div>
                          <div className="text-red-600 font-medium">Error loading calendar data</div>
                          <div className="text-gray-500 text-sm">Please try refreshing the page</div>
                        </div>
                      </td>
                    </tr>
                  ) : calendarEntries && calendarEntries.length > 0 ? (
                    calendarEntries.slice(0, 6).map((entry, index) => (
                      <tr key={index} className="hover:bg-gradient-to-r hover:from-green-25 hover:to-emerald-25 transition-all duration-200 group">
                        <td className="py-6 px-8 sticky left-0 bg-white z-10 group-hover:bg-green-25">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full overflow-hidden shadow-lg ring-2 ring-green-100 group-hover:ring-green-300 transition-all">
                              <img 
                                src={entry.imageUrl} 
                                alt={entry.produceName} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-base group-hover:text-green-800 transition-colors">
                                {entry.produceName}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {entry.category}
                              </div>
                            </div>
                          </div>
                        </td>
                        {Object.entries(entry.monthlyStatus).map(([month, status]) => (
                          <td key={month} className="py-6 px-4">
                            <div className="flex justify-center">
                              <div 
                                className={`w-full h-8 rounded-lg ${getStatusColor(status)} transition-all duration-200 hover:scale-110 hover:shadow-md flex items-center justify-center group cursor-pointer`}
                                title={`${status.charAt(0).toUpperCase() + status.slice(1)} in ${months[parseInt(month)]}`}
                              >
                                {getStatusIcon(status)}
                              </div>
                            </div>
                          </td>
                        ))}
                        <td className="py-6 px-8 sticky right-0 bg-white z-10 group-hover:bg-green-25">
                          <div className="flex -space-x-2">
                            {entry.farms?.slice(0, 3).map((farm, i) => (
                              <div key={i} className="relative group/farm">
                                <img 
                                  className="h-8 w-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform cursor-pointer" 
                                  src={farm.logoUrl} 
                                  alt={farm.name}
                                  title={farm.name}
                                />
                              </div>
                            ))}
                            {entry.farms && entry.farms.length > 3 && (
                              <div className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer">
                                <span className="text-xs font-bold text-green-700">+{entry.farms.length - 3}</span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={14} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <Calendar className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="text-gray-500 font-medium">No calendar data available</div>
                          <div className="text-gray-400 text-sm">Check back soon for seasonal produce updates</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* View Full Calendar Link */}
        <div className="mt-8 text-center">
          <Link href="/campus" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
            <Building className="h-5 w-5" />
            Explore Santhe@Campus
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}