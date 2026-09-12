import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, Award } from "lucide-react";

interface AIFarmerBadgeProps {
  isAISubscribed?: boolean;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export const AIFarmerBadge = ({ 
  isAISubscribed = false, 
  size = "md", 
  showText = true,
  className = "" 
}: AIFarmerBadgeProps) => {
  if (!isAISubscribed) return null;

  const sizeClasses = {
    sm: "text-xs px-2 py-1 gap-1",
    md: "text-sm px-2.5 py-1 gap-1.5",
    lg: "text-base px-3 py-1.5 gap-2"
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  };

  return (
    <Badge 
      className={`
        bg-gradient-to-r from-blue-600 to-purple-600 
        hover:from-blue-700 hover:to-purple-700
        text-white border-0 font-medium
        ${sizeClasses[size]} ${className}
      `}
    >
      <Brain className={iconSizes[size]} />
      {showText && "AI Organic"}
      <Sparkles className={iconSizes[size]} />
    </Badge>
  );
};

interface ZBNFFarmerBadgeProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export const ZBNFFarmerBadge = ({ 
  size = "md", 
  showText = true,
  className = "" 
}: ZBNFFarmerBadgeProps) => {
  const sizeClasses = {
    sm: "text-xs px-2 py-1 gap-1",
    md: "text-sm px-2.5 py-1 gap-1.5",
    lg: "text-base px-3 py-1.5 gap-2"
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  return (
    <Badge 
      className={`
        bg-gradient-to-r from-green-600 to-emerald-600 
        hover:from-green-700 hover:to-emerald-700
        text-white border-0 font-medium
        ${sizeClasses[size]} ${className}
      `}
    >
      <Award className={iconSizes[size]} />
      {showText && "Organic"}
    </Badge>
  );
};

// Combined badge component that shows appropriate badge based on subscription status
interface FarmerBadgeProps {
  farmer: {
    aiSubscriptionActive?: boolean;
    aiSubscriptionExpiry?: string | Date | null;
  };
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export const FarmerBadge = ({ 
  farmer, 
  size = "md", 
  showText = true,
  className = "" 
}: FarmerBadgeProps) => {
  const isAIActive = farmer.aiSubscriptionActive && farmer.aiSubscriptionExpiry && 
    new Date(farmer.aiSubscriptionExpiry) > new Date();

  if (isAIActive) {
    return (
      <AIFarmerBadge 
        isAISubscribed={true} 
        size={size} 
        showText={showText}
        className={className}
      />
    );
  }

  // No automatic badges - badges are now admin-controlled
  return null;
};

export default FarmerBadge;