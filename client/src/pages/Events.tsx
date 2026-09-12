import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Users, Clock, Leaf, Search, Filter, CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { FarmEvent } from "@shared/schema";

// Event Card Image Carousel Component
function EventCardCarousel({ event }: { event: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const allImages: string[] = [];
  if (event.coverImage) allImages.push(event.coverImage);
  if (event.gallery && Array.isArray(event.gallery)) {
    event.gallery.forEach((g: any) => {
      if (g.imageUrl && !allImages.includes(g.imageUrl)) allImages.push(g.imageUrl);
    });
  }
  if (event.farmerProfile?.farmImages && Array.isArray(event.farmerProfile.farmImages)) {
    event.farmerProfile.farmImages.forEach((img: string) => {
      if (img && !allImages.includes(img)) allImages.push(img);
    });
  }

  useEffect(() => {
    if (allImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [allImages.length]);

  if (allImages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <CalendarDays className="h-12 w-12 text-white/50" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {allImages.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`${event.title} - ${index + 1}`}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {allImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5">
          {allImages.map((_, index) => (
            <button
              key={index}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(index); }}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-white w-3 sm:w-4" : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const formatPrice = (price: string | number) => {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(num);
};

const formatEventDates = (dates: any[] | string[] | undefined) => {
  if (!dates || dates.length === 0) return "TBA";
  const dateStrings = dates.map((d: any) => {
    if (typeof d === 'string') return d;
    if (d && d.eventDate) return d.eventDate;
    return null;
  }).filter(Boolean).sort();
  if (dateStrings.length === 0) return "TBA";
  if (dateStrings.length === 1) {
    return new Date(dateStrings[0]).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }
  const firstDate = new Date(dateStrings[0]).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const lastDate = new Date(dateStrings[dateStrings.length - 1]).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return `${firstDate} - ${lastDate}`;
};

const eventTypeLabels: Record<string, string> = {
  fruit_picking: "Fruit Picking",
  vegetable_experience: "Vegetable Experience",
  farm_tour: "Farm Tour",
  zbnf_training: "Natural Farming Training",
  nursery_visit: "Nursery Visit",
  festival: "Farm Festival",
  workshop: "Workshop",
  kids_activity: "Kids Activity",
};

export default function Events() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventType, setSelectedEventType] = useState("all");
  const [selectedCrop, setSelectedCrop] = useState("all");

  const { data: events, isLoading } = useQuery<(FarmEvent & { farmer: any; facilities: any[]; activities: any[]; gallery: any[] })[]>({
    queryKey: ["/api/events", { eventType: selectedEventType, cropType: selectedCrop }],
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const { data: eventTypes } = useQuery<{ eventTypes: string[]; facilityTypes: string[]; activityTypes: string[] }>({
    queryKey: ["/api/events/types"],
    staleTime: 60000,
  });

  const filteredEvents = events?.filter(event => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const datesArray = (event as any).dates;
    if (datesArray && datesArray.length > 0) {
      const dateStrings = datesArray.map((d: any) => d.eventDate);
      const latestDate = new Date(Math.max(...dateStrings.map((d: string) => new Date(d).getTime())));
      latestDate.setHours(23, 59, 59, 999);
      if (latestDate < now) return false;
    }
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Farm Events | Santhe - Experience Farm Life</title>
        <meta name="description" content="Book authentic farm experiences - fruit picking, farm tours, Natural Farming training, and more. Connect directly with farmers and experience sustainable agriculture." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
        <section className="bg-gradient-to-r from-rose-700 via-red-700 to-orange-600 text-white py-8 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4 sm:mb-6">
                <CalendarDays className="h-7 w-7 sm:h-10 sm:w-10" />
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">{t('events.heroTitle')}</h1>
              <p className="text-sm sm:text-xl text-rose-100 max-w-3xl mx-auto mb-4 sm:mb-8">
                {t('events.heroDesc')}
              </p>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full">
                  <Leaf className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                  <span>On Real Farms</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full">
                  <Users className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                  <span>Family Friendly</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full">
                  <Calendar className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                  <span>Unique Experiences</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full">
                  <MapPin className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                  <span>Book Instantly</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border p-2 sm:p-4 mb-4 sm:mb-8">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('events.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full h-9 sm:h-10 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
                <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                  <SelectTrigger className="w-full sm:w-[160px] h-9 sm:h-10 text-xs sm:text-sm">
                    <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('events.allTypes')}</SelectItem>
                    {eventTypes?.eventTypes?.map((type) => (
                      <SelectItem key={type} value={type}>{eventTypeLabels[type] || type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger className="w-full sm:w-[160px] h-9 sm:h-10 text-xs sm:text-sm">
                    <Leaf className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <SelectValue placeholder="Crop Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('events.allCrops')}</SelectItem>
                    <SelectItem value="mango">Mango</SelectItem>
                    <SelectItem value="strawberry">Strawberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="rice">Rice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Cards */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-32 sm:h-48 w-full" />
                  <CardContent className="p-2 sm:p-4 space-y-2">
                    <Skeleton className="h-4 sm:h-6 w-3/4" />
                    <Skeleton className="h-3 sm:h-4 w-full" />
                    <Skeleton className="h-3 sm:h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredEvents && filteredEvents.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow group flex flex-col">
                  <div className="relative h-32 sm:h-48 bg-gradient-to-br from-green-400 to-emerald-500 flex-shrink-0">
                    <EventCardCarousel event={event} />
                    <Badge className="absolute top-2 left-2 bg-white text-green-700 text-[10px] sm:text-xs px-1.5 py-0.5">
                      {eventTypeLabels[event.eventType] || event.eventType}
                    </Badge>
                    {event.cropType && (
                      <Badge className="absolute top-2 right-2 bg-orange-500 text-[10px] sm:text-xs px-1.5 py-0.5">
                        {event.cropType}
                      </Badge>
                    )}
                  </div>

                  <div className="p-2 sm:p-4 flex flex-col flex-grow">
                    <h3 className="text-sm sm:text-lg font-semibold line-clamp-2 leading-tight mb-1 group-hover:text-green-700 transition-colors">
                      {event.title}
                    </h3>

                    {(event as any).farmerProfile?.farmName || event.farmer?.name ? (
                      <p className="text-[11px] sm:text-sm text-green-600 font-medium flex items-center gap-1 mb-1 truncate">
                        <Leaf className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{(event as any).farmerProfile?.farmName || event.farmer?.name}</span>
                      </p>
                    ) : null}

                    <p className="text-[11px] sm:text-sm text-gray-500 flex items-center gap-1 mb-1 truncate">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </p>

                    <div className="hidden sm:flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatEventDates((event as any).dates || (event as any).eventDates)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {event.startTime} - {event.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.totalSeats} seats
                      </span>
                    </div>

                    {/* Mobile: compact date + time row */}
                    <p className="sm:hidden text-[10px] text-gray-400 flex items-center gap-1 mb-2">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      {event.startTime} - {event.endTime}
                    </p>

                    {event.activities && event.activities.length > 0 && (
                      <div className="hidden sm:flex mt-1 mb-3 flex-wrap gap-1">
                        {event.activities.slice(0, 3).map((activity, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {activity.activityName.replace(/_/g, " ")}
                          </Badge>
                        ))}
                        {event.activities.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{event.activities.length - 3} more</Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                      <div>
                        <p className="text-sm sm:text-xl font-bold text-green-600">
                          {formatPrice(event.pricePerSeat)}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-400">per person</p>
                      </div>
                      <Link href={`/events/${event.id}`}>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm h-7 sm:h-9 px-2 sm:px-4">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <CalendarDays className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No Events Found</h3>
              <p className="text-sm text-gray-500">
                {searchTerm || selectedEventType !== "all" || selectedCrop !== "all"
                  ? "Try adjusting your filters to find more events"
                  : "Check back soon for upcoming farm events!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
