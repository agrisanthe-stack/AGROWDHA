import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ZbnfBadge } from "@/components/ZbnfBadge";
import { Award, Search, User, MapPin, Calendar } from "lucide-react";

interface Farmer {
  id: number;
  farmName: string;
  location: string;
  isZbnfCertified: boolean;
  aiSubscriptionActive: boolean;
  aiSubscriptionExpiry: string | null;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    district: string;
  };
}

export default function AdminFarmerCertifications() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCertification, setFilterCertification] = useState<string>("all");
  const [filterSubscription, setFilterSubscription] = useState<string>("all");

  // Fetch farmers
  const { data: farmers, isLoading } = useQuery<Farmer[]>({
    queryKey: ['/api/admin/farmers'],
  });

  // Update ZBNF certification mutation
  const updateCertificationMutation = useMutation({
    mutationFn: async ({ farmerId, isZbnfCertified }: { farmerId: number; isZbnfCertified: boolean }) => {
      const response = await apiRequest("PUT", `/api/admin/farmers/${farmerId}/zbnf-certification`, {
        isZbnfCertified
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Certification Updated",
        description: `Farmer ${data.isZbnfCertified ? 'certified' : 'decertified'} for Organic successfully!`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/farmers'] });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update Organic certification. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update AI subscription mutation
  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({ farmerId, active, months }: { farmerId: number; active: boolean; months?: number }) => {
      const response = await apiRequest("PUT", `/api/admin/farmers/${farmerId}/ai-subscription`, {
        active,
        months
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Subscription Updated",
        description: `AI subscription ${data.active ? 'activated' : 'deactivated'} successfully!`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/farmers'] });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update AI subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCertificationToggle = (farmerId: number, currentStatus: boolean) => {
    updateCertificationMutation.mutate({
      farmerId,
      isZbnfCertified: !currentStatus
    });
  };

  const handleSubscriptionToggle = (farmerId: number, currentStatus: boolean) => {
    if (!currentStatus) {
      // Activating subscription - ask for duration
      const months = prompt("Enter subscription duration in months (e.g., 1, 6, 12):");
      if (months && parseInt(months) > 0) {
        updateSubscriptionMutation.mutate({
          farmerId,
          active: true,
          months: parseInt(months)
        });
      }
    } else {
      // Deactivating subscription
      updateSubscriptionMutation.mutate({
        farmerId,
        active: false
      });
    }
  };

  const formatExpiryDate = (expiry: string | null) => {
    if (!expiry) return null;
    return new Date(expiry).toLocaleDateString();
  };

  const isSubscriptionActive = (farmer: Farmer) => {
    return farmer.aiSubscriptionActive && 
           farmer.aiSubscriptionExpiry && 
           new Date(farmer.aiSubscriptionExpiry) > new Date();
  };

  // Filter farmers based on search and filters
  const filteredFarmers = farmers?.filter(farmer => {
    const matchesSearch = farmer.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCertification = filterCertification === "all" || 
                               (filterCertification === "certified" && farmer.isZbnfCertified) ||
                               (filterCertification === "not_certified" && !farmer.isZbnfCertified);
    
    const matchesSubscription = filterSubscription === "all" ||
                              (filterSubscription === "active" && isSubscriptionActive(farmer)) ||
                              (filterSubscription === "inactive" && !isSubscriptionActive(farmer));
    
    return matchesSearch && matchesCertification && matchesSubscription;
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-gray-600">Loading farmers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
          <Award className="w-6 h-6 text-green-600" />
          Farmer Certifications & Subscriptions
        </h2>
        <p className="text-gray-600">Manage Organic certifications and AI subscriptions for farmers</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search farmers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterCertification} onValueChange={setFilterCertification}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by certification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Certifications</SelectItem>
            <SelectItem value="certified">Organic Certified</SelectItem>
            <SelectItem value="not_certified">Not Certified</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterSubscription} onValueChange={setFilterSubscription}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by subscription" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subscriptions</SelectItem>
            <SelectItem value="active">Active AI Subscription</SelectItem>
            <SelectItem value="inactive">Inactive Subscription</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Farmers List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredFarmers?.map((farmer) => (
          <Card key={farmer.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    {farmer.farmName}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{farmer.user.name}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{farmer.location}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <ZbnfBadge 
                    isZbnfCertified={farmer.isZbnfCertified}
                    hasAISubscription={isSubscriptionActive(farmer)}
                    size="sm"
                  />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Organic Certification */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-sm">Organic Certification</h4>
                    <p className="text-xs text-gray-600">
                      {farmer.isZbnfCertified ? "Certified farmer" : "Not certified"}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={farmer.isZbnfCertified ? "default" : "outline"}
                    onClick={() => handleCertificationToggle(farmer.id, farmer.isZbnfCertified)}
                    disabled={updateCertificationMutation.isPending}
                    className={farmer.isZbnfCertified ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {farmer.isZbnfCertified ? "Certified" : "Certify"}
                  </Button>
                </div>

                {/* AI Subscription */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-sm">AI Subscription</h4>
                    <p className="text-xs text-gray-600">
                      {isSubscriptionActive(farmer) ? (
                        <>Active until {formatExpiryDate(farmer.aiSubscriptionExpiry)}</>
                      ) : (
                        "No active subscription"
                      )}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={isSubscriptionActive(farmer) ? "default" : "outline"}
                    onClick={() => handleSubscriptionToggle(farmer.id, isSubscriptionActive(farmer))}
                    disabled={updateSubscriptionMutation.isPending}
                    className={isSubscriptionActive(farmer) ? "bg-purple-600 hover:bg-purple-700" : ""}
                  >
                    {isSubscriptionActive(farmer) ? "Active" : "Activate"}
                  </Button>
                </div>

                {/* Farmer Details */}
                <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Joined {new Date(farmer.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{farmer.user.district}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredFarmers?.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No farmers found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}