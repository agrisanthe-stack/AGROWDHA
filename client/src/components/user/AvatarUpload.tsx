import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Upload, X } from "lucide-react";

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  onAvatarUpdate?: (avatarUrl: string) => void;
  size?: "sm" | "md" | "lg";
}

export default function AvatarUpload({
  currentAvatarUrl,
  onAvatarUpdate,
  size = "md",
}: AvatarUploadProps) {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine avatar size
  const avatarSize = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  }[size];

  // Avatar upload mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: (formData: FormData) => {
      return apiRequest("POST", "/api/users/avatar", formData, {
        isFormData: true,
      }).then(res => res.json());
    },
    onSuccess: async (data) => {
      setIsUploading(false);
      setPreviewUrl(null);
      
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been successfully updated.",
        variant: "default",
      });
      
      // Callback to parent component
      if (onAvatarUpdate) {
        onAvatarUpdate(data.avatarUrl);
      }
      
      // Refresh user data to update authentication cache
      await refreshUser();
      
      // Invalidate any queries that might use the user data
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/customers/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/farmers/profile"] });
    },
    onError: (error: any) => {
      setIsUploading(false);
      
      toast({
        title: "Error",
        description: error.message || "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview the selected image
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Prepare form data and upload
    const formData = new FormData();
    formData.append("avatar", file);
    
    setIsUploading(true);
    uploadAvatarMutation.mutate(formData);
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Cancel upload preview
  const handleCancelUpload = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Get initials for fallback
  const getInitials = () => {
    if (!user?.name) return "U";
    return user.name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  // Determine which image to show
  const displayUrl = previewUrl || currentAvatarUrl || user?.avatar;

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar className={`${avatarSize} border-2 border-primary-100`}>
              <AvatarImage src={displayUrl || undefined} alt={user?.name || "User"} />
              <AvatarFallback className="bg-primary-100 text-primary-700 text-xl font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            
            {/* Upload overlay button */}
            <Button
              size="icon"
              variant="outline"
              className="absolute bottom-0 right-0 rounded-full shadow-md bg-background hover:bg-primary-50"
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              {isUploading ? (
                <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              ) : (
                <Upload size={14} />
              )}
            </Button>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg, image/png, image/gif, image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Preview message */}
          {previewUrl && (
            <div className="flex items-center gap-2 text-sm text-primary-600">
              <span>Uploading new profile picture...</span>
              <Button 
                size="sm" 
                variant="ghost" 
                className="p-0 h-auto" 
                onClick={handleCancelUpload}
              >
                <X size={14} />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}