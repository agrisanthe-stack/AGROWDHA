import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, X, Check, CheckCheck, Package, Star, UserPlus, AlertTriangle, ShoppingCart, CreditCard, FileCheck, FileX, MessageSquare } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface NotificationCenterProps {
  userId?: number;
}

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  data?: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationCenter({ userId }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['/api/notifications'],
    queryFn: async () => {
      const url = `/api/notifications${userId ? `?userId=${userId}` : ''}`;
      const response = await fetch(url, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      return response.json();
    }
  });

  // Get unread count
  const { data: unreadData } = useQuery({
    queryKey: ['/api/notifications/unread-count'],
    queryFn: async () => {
      const url = `/api/notifications/unread-count${userId ? `?userId=${userId}` : ''}`;
      const response = await fetch(url, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch unread count');
      }
      return response.json();
    }
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
    }
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const url = `/api/notifications/mark-all-read${userId ? `?userId=${userId}` : ''}`;
      const response = await fetch(url, {
        method: 'PATCH',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    }
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
    }
  });

  const handleMarkAsRead = (notificationId: number) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDeleteNotification = (notificationId: number) => {
    deleteNotificationMutation.mutate(notificationId);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getNotificationIcon = (type: string, title?: string) => {
    const iconMap: Record<string, { icon: JSX.Element; color: string }> = {
      'low_stock': { icon: <AlertTriangle className="h-4 w-4" />, color: 'text-amber-500 bg-amber-50' },
      'product_approval': { icon: title?.includes('Attention') || title?.includes('rejected') ? <FileX className="h-4 w-4" /> : <FileCheck className="h-4 w-4" />, color: title?.includes('Attention') || title?.includes('rejected') ? 'text-red-500 bg-red-50' : 'text-green-500 bg-green-50' },
      'new_review': { icon: <Star className="h-4 w-4" />, color: 'text-yellow-500 bg-yellow-50' },
      'new_follower': { icon: <UserPlus className="h-4 w-4" />, color: 'text-blue-500 bg-blue-50' },
      'new_order': { icon: <ShoppingCart className="h-4 w-4" />, color: 'text-emerald-500 bg-emerald-50' },
      'order_placed': { icon: <ShoppingCart className="h-4 w-4" />, color: 'text-emerald-500 bg-emerald-50' },
      'order_confirmed': { icon: <Package className="h-4 w-4" />, color: 'text-blue-500 bg-blue-50' },
      'order_status': { icon: <Package className="h-4 w-4" />, color: 'text-purple-500 bg-purple-50' },
      'payment_status': { icon: <CreditCard className="h-4 w-4" />, color: 'text-green-500 bg-green-50' },
      'payment_received': { icon: <CreditCard className="h-4 w-4" />, color: 'text-green-500 bg-green-50' },
    };
    return iconMap[type] || { icon: <Bell className="h-4 w-4" />, color: 'text-gray-500 bg-gray-50' };
  };

  const unreadCount = unreadData?.unreadCount || 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>
        
        <ScrollArea className="h-80">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification: Notification) => {
                const { icon, color } = getNotificationIcon(notification.type, notification.title);
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-muted/50 transition-colors ${
                      !notification.isRead ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full flex-shrink-0 ${color}`}>
                        {icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            disabled={markAsReadMutation.isPending}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNotification(notification.id)}
                          disabled={deleteNotificationMutation.isPending}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}