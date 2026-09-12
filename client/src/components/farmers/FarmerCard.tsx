import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Farmer } from "@/lib/types";
import { FollowButton } from "@/components/FollowButton";
import { useAuth } from "@/hooks/use-auth";
import { createFarmerSlug } from "@/lib/slugs";
import { FarmerBadge } from "@/components/AIFarmerBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users } from "lucide-react";

interface FarmerCardProps {
  farmer: Farmer;
}

export default function FarmerCard({ farmer }: FarmerCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFollowers, setShowFollowers] = useState(false);
  const auth = useAuth();
  const user = auth?.user;
  
  // Fetch followers when dialog opens
  const { data: followers, isLoading: followersLoading } = useQuery<{ name: string }[]>({
    queryKey: [`/api/farmers/${farmer.id}/followers`],
    enabled: showFollowers,
  });

  // Create SEO-friendly slug for the farmer
  const farmerSlug = createFarmerSlug(farmer.id, farmer.farmName, farmer.location);



  // Get all available images (gallery + default)
  const getAllImages = () => {
    const images = [];
    
    // Add farm gallery images first
    if (farmer.farmImages && Array.isArray(farmer.farmImages) && farmer.farmImages.length > 0) {
      farmer.farmImages.forEach(image => {
        // For Cloudinary URLs (https://), use as-is; for local paths, add leading slash
        if (image.startsWith('http://') || image.startsWith('https://')) {
          images.push(image);
        } else {
          images.push(image.startsWith('/') ? image : `/${image}`);
        }
      });
    }
    
    // Add default image as fallback if no gallery images
    if (images.length === 0) {
      images.push(farmer.imageUrl);
    }
    
    return images;
  };

  const allImages = getAllImages();

  // Auto-rotate images every 3 seconds
  useEffect(() => {
    if (allImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [allImages.length]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition relative">
      {/* Follow button positioned absolutely to prevent navigation */}
      {user && (
        <div className="absolute top-3 right-3 z-10">
          <FollowButton 
            farmerId={farmer.id} 
            userId={user.id}
          />
        </div>
      )}
      
      <Link href={`/farmers/${farmerSlug}`}>
        <div className="h-32 sm:h-60 overflow-hidden relative">
          <img 
            src={allImages[currentImageIndex]} 
            alt={`${farmer.farmName} - Image ${currentImageIndex + 1}`} 
            className="w-full h-full object-cover transition-opacity duration-500" 
            onError={(e) => {
              // If current image fails, try default farmer image
              e.currentTarget.src = farmer.imageUrl;
            }}
          />
          
          {/* Farmer Profile Image Overlay */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full overflow-hidden border-3 border-white shadow-lg bg-gradient-to-br from-emerald-400 to-green-600">
              {farmer.logoUrl && !farmer.logoUrl.includes('unsplash.com') ? (
                <img 
                  src={farmer.logoUrl} 
                  alt={`${farmer.farmName} profile`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://img.freepik.com/premium-photo/indian-farmer-standing-farm-portrait-photograph_975284-1338.jpg';
                  }}
                />
              ) : (
                <img 
                  src="https://img.freepik.com/premium-photo/indian-farmer-standing-farm-portrait-photograph_975284-1338.jpg" 
                  alt="Default farmer profile" 
                  className="w-full h-full object-cover object-top"
                />
              )}
            </div>
          </div>
          
          {/* Image indicators */}
          {allImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {allImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-2 sm:p-6">
        <div className="flex justify-between items-start mb-2 sm:mb-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
              <h3 className="text-sm sm:text-xl font-medium truncate">{farmer.farmName}</h3>
              {(farmer as any).isOrganicCertified && (
                <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] sm:text-xs font-medium flex-shrink-0">
                  <span className="hidden sm:inline">Organic Farm</span>
                  <span className="sm:hidden">Organic</span>
                </div>
              )}
              {!(farmer as any).isOrganicCertified && (farmer as any).isNaturalCertified && (
                <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-[10px] sm:text-xs font-medium flex-shrink-0">
                  <span className="hidden sm:inline">Natural Farm</span>
                  <span className="sm:hidden">Natural</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 text-[10px] sm:text-sm truncate">
              <i className="fas fa-map-marker-alt mr-1"></i>
              {farmer.location} 
              {(farmer as any).distanceText && (
                <span> • {(farmer as any).distanceText}</span>
              )}
            </p>
          </div>
          <div className="flex items-center flex-shrink-0 ml-1">
            <span className="text-amber-500 mr-0.5 sm:mr-1 text-xs sm:text-base">{farmer.rating}</span>
            <div className="flex text-amber-400 hidden sm:flex">
              {[...Array(5)].map((_, i) => (
                <i 
                  key={i} 
                  className={`fas ${i < Math.floor(farmer.rating) ? 'fa-star' : i < farmer.rating ? 'fa-star-half-alt' : 'fa-star'} text-xs`}
                ></i>
              ))}
            </div>
          </div>
        </div>
        
        {/* Follower count display with dialog */}
        {(farmer as any).followerCount !== undefined && (
          <Dialog open={showFollowers} onOpenChange={setShowFollowers}>
            <DialogTrigger asChild>
              <button 
                className="flex items-center text-gray-500 text-sm mb-4 hover:text-primary-600 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowFollowers(true);
                }}
              >
                <Users className="h-4 w-4 mr-2" />
                <span className="hover:underline">{(farmer as any).followerCount} {(farmer as any).followerCount === 1 ? 'follower' : 'followers'}</span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Followers of {farmer.farmName}
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[300px] pr-4">
                {followersLoading ? (
                  <div className="py-4 text-center text-gray-500">Loading followers...</div>
                ) : followers && followers.length > 0 ? (
                  <ul className="space-y-2">
                    {followers.filter(f => f && f.name).map((follower, index) => (
                      <li key={index} className="flex items-center gap-3 py-2 px-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-700 font-medium text-sm">
                            {follower.name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <span className="text-gray-700">{follower.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-4 text-center text-gray-500">No followers yet</div>
                )}
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}
        
        <Link href={`/farmers/${farmer.id}`} className="block">
          <div className="text-accent-600 hover:text-accent-700 font-medium text-sm inline-flex items-center">
            View farm profile
            <i className="fas fa-arrow-right ml-2"></i>
          </div>
        </Link>
      </div>
    </div>
  );
}
