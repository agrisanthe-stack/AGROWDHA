import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Copy, MessageCircle, Facebook, Linkedin, Instagram } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createProductSlug, createFarmerSlug } from "@/lib/slugs";

interface ShareButtonProps {
  type: 'product' | 'farmer' | 'event';
  id: string;
  title: string;
  description?: string;
  // Additional props for SEO-friendly URLs
  productName?: string;
  categoryName?: string;
  farmName?: string;
  location?: string;
}

export default function ShareButton({ 
  type, 
  id, 
  title, 
  description,
  productName,
  categoryName,
  farmName,
  location
}: ShareButtonProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { toast } = useToast();
  
  // Always use the /share/ URLs which are designed for social media sharing
  // These URLs serve proper meta tags to social media crawlers and redirect to the main page
  const shareUrl = `https://farmersanthe.com/share/${type}/${id}`;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Share link copied to clipboard",
      });
      setShowShareMenu(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const shareOnPlatform = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description || '');
    
    if (platform === 'instagram') {
      // Instagram doesn't support direct web sharing, so copy the link and show instructions
      copyToClipboard();
      toast({
        title: "Ready to share on Instagram!",
        description: "Link copied! Open Instagram app and paste in your story or post.",
        duration: 5000,
      });
      return;
    }
    
    const urls = {
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    };
    
    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>
      
      {showShareMenu && (
        <Card className="absolute right-0 top-full mt-2 z-50 w-64 shadow-lg">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700">
                Share this {type}
              </div>
              
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={copyToClipboard}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-green-600 hover:text-green-700"
                  onClick={() => shareOnPlatform('whatsapp')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-blue-600 hover:text-blue-700"
                  onClick={() => shareOnPlatform('facebook')}
                >
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-blue-700 hover:text-blue-800"
                  onClick={() => shareOnPlatform('linkedin')}
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-pink-500 hover:text-pink-600"
                  onClick={() => shareOnPlatform('instagram')}
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  Instagram
                </Button>
              </div>
              
              <div className="text-xs text-gray-500 mt-3 p-2 bg-gray-50 rounded">
                <strong>Sharing URL:</strong>
                <div className="break-all mt-1 font-mono text-xs">
                  {shareUrl}
                </div>
                <div className="mt-2 text-xs">
                  This URL shows proper images on social media platforms and redirects to the main page.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {showShareMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
}