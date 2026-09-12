import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { CalendarEntry, Category } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Calendar, Search, ChevronLeft, ChevronRight, Leaf, Clock, ShoppingCart, Sprout, Sparkles } from "lucide-react";

export default function HarvestCalendar() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [month, setMonth] = useState(new Date().getMonth().toString());
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  const { data: calendarEntries, isLoading, error } = useQuery<CalendarEntry[]>({
    queryKey: [`/api/calendar?search=${searchTerm}&category=${category}&month=${month}`],
  });
  
  const monthKeys = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ];
  
  const months = monthKeys.map(key => t(`harvestCalendar.months.${key}`));
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  const getPrevMonth = () => {
    const prevMonth = parseInt(month) - 1;
    return prevMonth < 0 ? "11" : prevMonth.toString();
  };
  
  const getNextMonth = () => {
    const nextMonth = parseInt(month) + 1;
    return nextMonth > 11 ? "0" : nextMonth.toString();
  };

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
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-white shadow-lg">
                <Calendar className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                {t('harvestCalendar.title')}
              </h1>
              <Sparkles className="h-6 w-6 text-yellow-500" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('harvestCalendar.description')}
            </p>
          </div>
          
          {/* Search and Filter Section */}
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2"></div>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-2xl text-gray-800">
                <Search className="h-6 w-6 text-green-600" />
                {t('harvestCalendar.exploreSeasonalProduce')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form 
                onSubmit={handleSearch}
                className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6"
              >
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder={t('harvestCalendar.searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-60 pl-10 border-gray-200 focus:ring-green-500 focus:border-green-500 rounded-lg shadow-sm"
                    />
                  </div>
                  
                  <Select 
                    value={category} 
                    onValueChange={setCategory}
                  >
                    <SelectTrigger className="w-full sm:w-40 border-gray-200 focus:ring-green-500 focus:border-green-500 rounded-lg shadow-sm">
                      <SelectValue placeholder={t('harvestCalendar.categoryPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('harvestCalendar.allCategories')}</SelectItem>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-lg transition-all duration-200">
                    <Search className="h-4 w-4 mr-2" />
                    {t('harvestCalendar.filter')}
                  </Button>
                </div>
                
                <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-2 shadow-inner">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMonth(getPrevMonth())}
                    className="hover:bg-green-100 hover:text-green-700 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger className="w-40 mx-2 border-0 bg-transparent focus:ring-0 font-semibold text-gray-700">
                      <SelectValue placeholder={t('harvestCalendar.monthPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((m, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMonth(getNextMonth())}
                    className="hover:bg-green-100 hover:text-green-700 rounded-lg transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
              
              {/* Enhanced Calendar Legend */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 p-6 bg-gradient-to-r from-green-50 via-emerald-50 to-blue-50 rounded-xl border border-green-100 shadow-sm">
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                    <Sprout className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t('harvestCalendar.legend.growing')}</div>
                    <div className="text-xs text-gray-500">{t('harvestCalendar.legend.growingDesc')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t('harvestCalendar.legend.harvesting')}</div>
                    <div className="text-xs text-gray-500">{t('harvestCalendar.legend.harvestingDesc')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t('harvestCalendar.legend.preOrder')}</div>
                    <div className="text-xs text-gray-500">{t('harvestCalendar.legend.preOrderDesc')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                    <ShoppingCart className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t('harvestCalendar.legend.available')}</div>
                    <div className="text-xs text-gray-500">{t('harvestCalendar.legend.availableDesc')}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Enhanced Calendar Table */}
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2"></div>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-2xl text-gray-800">
                <Leaf className="h-6 w-6 text-green-600" />
                {t('harvestCalendar.seasonalAvailability')}
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
                          {t('harvestCalendar.produce')}
                        </div>
                      </th>
                      {months.map((m, i) => (
                        <th 
                          key={i} 
                          className={`py-6 px-4 text-center text-sm font-bold min-w-[80px] transition-all duration-300 ${
                            i.toString() === month 
                              ? 'text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg transform scale-105' 
                              : 'text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100'
                          }`}
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
                          {t('harvestCalendar.localFarms')}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                      Array(6).fill(0).map((_, i) => (
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
                              <Search className="h-8 w-8 text-red-500" />
                            </div>
                            <div className="text-red-600 font-medium">{t('harvestCalendar.errorLoading')}</div>
                            <div className="text-gray-500 text-sm">{t('harvestCalendar.errorRefresh')}</div>
                          </div>
                        </td>
                      </tr>
                    ) : calendarEntries && calendarEntries.length > 0 ? (
                      calendarEntries.map((entry, index) => (
                        <tr key={index} className="hover:bg-gradient-to-r hover:from-green-25 hover:to-emerald-25 transition-all duration-200 group">
                          <td className="py-6 px-8 sticky left-0 bg-white z-10 group-hover:bg-green-25">
                            <Link href={`/products/${entry.productId}`} className="flex items-center gap-4 group/link">
                              <div className="h-12 w-12 rounded-full overflow-hidden shadow-lg ring-2 ring-green-100 group-hover/link:ring-green-400 transition-all flex-shrink-0">
                                <img 
                                  src={entry.imageUrl} 
                                  alt={entry.produceName} 
                                  className="h-full w-full object-cover group-hover/link:scale-110 transition-transform duration-300" 
                                />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 text-base group-hover/link:text-green-700 group-hover/link:underline transition-colors">
                                  {entry.produceName}
                                </div>
                                <div className="text-sm text-gray-500">{t('harvestCalendar.freshAndLocal')}</div>
                              </div>
                            </Link>
                          </td>
                          {months.map((_, i) => {
                            const monthKey = Object.keys(entry.monthlyStatus).find(
                              key => parseInt(key) === i
                            );
                            const status = monthKey ? entry.monthlyStatus[monthKey] : "none";
                            return (
                              <td key={i} className="py-6 px-4 text-center">
                                <div className="flex justify-center">
                                  <div 
                                    className={`h-8 w-12 rounded-lg shadow-sm flex items-center justify-center transition-all duration-300 hover:scale-110 ${getStatusColor(status)} ${
                                      status !== 'none' ? 'text-white' : 'text-gray-400'
                                    }`}
                                    title={status.charAt(0).toUpperCase() + status.slice(1)}
                                  >
                                    {getStatusIcon(status)}
                                  </div>
                                </div>
                              </td>
                            );
                          })}
                          <td className="py-6 px-8 sticky right-0 bg-white z-10 group-hover:bg-green-25">
                            <div className="flex -space-x-3">
                              {entry.farms.slice(0, 3).map((farm, i) => (
                                <Link key={i} href={`/farmers/${farm.id}`} title={farm.name}>
                                  <img 
                                    className="h-8 w-8 rounded-full border-2 border-white shadow-lg hover:scale-110 hover:border-green-400 transition-all cursor-pointer" 
                                    src={farm.logoUrl} 
                                    alt={farm.name}
                                  />
                                </Link>
                              ))}
                              {entry.farms.length > 3 && (
                                <div className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                                  <span className="text-xs font-bold text-white">+{entry.farms.length - 3}</span>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={14} className="py-16 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                              <Calendar className="h-10 w-10 text-gray-400" />
                            </div>
                            <div className="text-gray-600 font-medium text-lg">{t('harvestCalendar.noData')}</div>
                            <div className="text-gray-500">{t('harvestCalendar.noDataDesc')}</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}