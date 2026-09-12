import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Heart, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { apiRequest } from '@/lib/queryClient';

interface FollowButtonProps {
  farmerId: number;
  userId?: number;
  className?: string;
}

export function FollowButton({ farmerId, userId, className }: FollowButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get follow status and count
  const { data: followData, isLoading } = useQuery({
    queryKey: ['/api/farmers', farmerId, 'follow-status'],
    queryFn: async () => {
      const url = `/api/farmers/${farmerId}/follow-status${userId ? `?userId=${userId}` : ''}`;
      const response = await apiRequest('GET', url);
      if (!response.ok) {
        throw new Error('Failed to fetch follow status');
      }
      return response.json();
    }
  });

  // Toggle follow mutation (handles both follow and unfollow)
  const toggleFollowMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/farmers/${farmerId}/follow${userId ? `?userId=${userId}` : ''}`);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/farmers', farmerId, 'follow-status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/farmers'] }); // Refresh farmers list to update follower counts
      toast({
        title: "Success",
        description: data.isFollowing ? "You are now following this farmer!" : "You have unfollowed this farmer.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleToggleFollow = () => {
    toggleFollowMutation.mutate();
  };

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled className={cn("h-8 w-8 p-0 rounded-full", className)}>
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      </Button>
    );
  }

  const isFollowing = followData?.isFollowing;
  const followerCount = followData?.followerCount || 0;
  const isPending = toggleFollowMutation.isPending;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleFollow}
      disabled={isPending}
      className={cn(
        "h-8 w-8 p-0 rounded-full transition-all duration-200",
        "hover:bg-red-50 hover:text-red-600 hover:scale-110",
        isFollowing && "text-red-600 bg-red-50",
        className
      )}
      title={`${isFollowing ? 'Unfollow' : 'Follow'} farmer${followerCount > 0 ? ` (${followerCount} followers)` : ''}`}
    >
      {isPending ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <Heart 
          className={cn(
            "h-5 w-5 transition-all duration-200",
            isFollowing && "fill-current"
          )} 
        />
      )}
    </Button>
  );
}