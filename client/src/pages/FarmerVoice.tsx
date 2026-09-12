import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Megaphone, ArrowBigUp, MessageCircle, Filter, Plus, Lightbulb, 
  AlertTriangle, CheckCircle, Users, Calendar, MapPin, Send, Pencil, Trash2, Share2
} from "lucide-react";
import { Helmet } from "react-helmet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from "date-fns";

interface District {
  id: number;
  name: string;
  state?: string;
}

interface FarmerVoicePost {
  id: number;
  districtManagerId: number;
  districtId: number;
  title: string;
  content: string;
  category: string;
  socialMediaUrl?: string;
  upvoteCount: number;
  commentCount: number;
  createdAt: string;
  districtManager?: {
    id: number;
    name: string;
    avatar?: string;
    orgName?: string;
  };
  district?: {
    id: number;
    name: string;
  };
}

interface FarmerVoiceComment {
  id: number;
  postId: number;
  farmerId: number;
  content: string;
  createdAt: string;
  farmer?: {
    id: number;
    farmName: string;
  };
}

const CATEGORIES = [
  { value: "all", label: "All Categories", icon: Filter },
  { value: "innovation", label: "Innovation Ideas", icon: Lightbulb },
  { value: "issue", label: "Issues", icon: AlertTriangle },
  { value: "solution", label: "Solutions", icon: CheckCircle },
  { value: "protest", label: "Protests", icon: Megaphone },
  { value: "announcement", label: "Announcements", icon: Megaphone },
  { value: "success_story", label: "Success Stories", icon: Users },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case "innovation": return "bg-blue-100 text-blue-800 border-blue-200";
    case "issue": return "bg-red-100 text-red-800 border-red-200";
    case "solution": return "bg-green-100 text-green-800 border-green-200";
    case "protest": return "bg-orange-100 text-orange-800 border-orange-200";
    case "announcement": return "bg-purple-100 text-purple-800 border-purple-200";
    case "success_story": return "bg-emerald-100 text-emerald-800 border-emerald-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "innovation": return Lightbulb;
    case "issue": return AlertTriangle;
    case "solution": return CheckCircle;
    case "protest": return Megaphone;
    case "announcement": return Megaphone;
    case "success_story": return Users;
    default: return Megaphone;
  }
};

export default function FarmerVoice() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "announcement", socialMediaUrl: "" });
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [commentText, setCommentText] = useState<Record<number, string>>({});
  const [editingPost, setEditingPost] = useState<FarmerVoicePost | null>(null);
  const [editPostData, setEditPostData] = useState({ title: "", content: "", category: "", socialMediaUrl: "" });

  const { data: districts } = useQuery<District[]>({
    queryKey: ["/api/farmer-voice/districts"],
  });

  const { data: posts, isLoading } = useQuery<FarmerVoicePost[]>({
    queryKey: ["/api/farmer-voice/posts", selectedDistrict, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedDistrict !== "all") params.append("districtId", selectedDistrict);
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      const response = await fetch(`/api/farmer-voice/posts?${params.toString()}`);
      return response.json();
    },
  });

  const { data: comments } = useQuery<FarmerVoiceComment[]>({
    queryKey: ["/api/farmer-voice/posts", expandedPost, "comments"],
    queryFn: async () => {
      if (!expandedPost) return [];
      const response = await fetch(`/api/farmer-voice/posts/${expandedPost}/comments`);
      return response.json();
    },
    enabled: !!expandedPost,
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: typeof newPost) => {
      return apiRequest("POST", "/api/farmer-voice/posts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farmer-voice/posts"] });
      setIsCreateDialogOpen(false);
      setNewPost({ title: "", content: "", category: "announcement", socialMediaUrl: "" });
      toast({ title: t("farmerVoice.postCreated"), description: t("farmerVoice.postCreatedDesc") });
    },
    onError: (error: any) => {
      toast({ title: t("farmerVoice.error"), description: error.message, variant: "destructive" });
    },
  });

  const upvoteMutation = useMutation({
    mutationFn: async (postId: number) => {
      return apiRequest("POST", `/api/farmer-voice/posts/${postId}/upvote`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farmer-voice/posts"] });
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({ postId, content }: { postId: number; content: string }) => {
      return apiRequest("POST", `/api/farmer-voice/posts/${postId}/comments`, { content });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/farmer-voice/posts", variables.postId, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/farmer-voice/posts"] });
      setCommentText(prev => ({ ...prev, [variables.postId]: "" }));
      toast({ title: t("farmerVoice.commentAdded") });
    },
    onError: (error: any) => {
      toast({ title: t("farmerVoice.error"), description: error.message, variant: "destructive" });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ postId, data }: { postId: number; data: typeof editPostData }) => {
      return apiRequest("PUT", `/api/farmer-voice/posts/${postId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farmer-voice/posts"] });
      setEditingPost(null);
      toast({ title: t("farmerVoice.postUpdated") });
    },
    onError: (error: any) => {
      toast({ title: t("farmerVoice.error"), description: error.message, variant: "destructive" });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      return apiRequest("DELETE", `/api/farmer-voice/posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farmer-voice/posts"] });
      toast({ title: t("farmerVoice.postDeleted") });
    },
    onError: (error: any) => {
      toast({ title: t("farmerVoice.error"), description: error.message, variant: "destructive" });
    },
  });

  const isDistrictManager = (user?.role as string) === "district_manager";
  const isAdmin = user?.role === "admin";
  const canCreatePost = isDistrictManager || isAdmin;
  const canEditPost = (post: FarmerVoicePost) => user && (post.districtManagerId === user.id || isAdmin);

  const handleEditPost = (post: FarmerVoicePost) => {
    setEditingPost(post);
    setEditPostData({
      title: post.title,
      content: post.content,
      category: post.category,
      socialMediaUrl: post.socialMediaUrl || ""
    });
  };

  const sharePost = (post: FarmerVoicePost) => {
    const postUrl = `${window.location.origin}/farmer-voice?post=${post.id}`;
    const shareText = `${post.title}\n\n${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}\n\n`;
    
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: shareText,
        url: postUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareText}${postUrl}`);
      toast({
        title: t("farmerVoice.linkCopied"),
        description: t("farmerVoice.linkCopiedDesc"),
      });
    }
  };

  const shareToWhatsApp = (post: FarmerVoicePost) => {
    const postUrl = `${window.location.origin}/farmer-voice?post=${post.id}`;
    const text = encodeURIComponent(`${post.title}\n\n${post.content.substring(0, 200)}...\n\n${postUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareToFacebook = (post: FarmerVoicePost) => {
    const postUrl = encodeURIComponent(`${window.location.origin}/farmer-voice?post=${post.id}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${postUrl}`, '_blank');
  };

  const shareToTwitter = (post: FarmerVoicePost) => {
    const postUrl = encodeURIComponent(`${window.location.origin}/farmer-voice?post=${post.id}`);
    const text = encodeURIComponent(post.title);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${postUrl}`, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>Farmer Voice | Santhe - Community Platform for Farmers</title>
        <meta name="description" content="Join the Farmer Voice community. Share innovations, solutions, and announcements with fellow farmers. Connect with district managers and get updates on agricultural initiatives." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl flex items-center gap-6">
              <Megaphone className="h-16 w-16 text-white/90 hidden md:block" />
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("farmerVoice.title")}</h1>
                <p className="text-xl text-green-100">
                  {t("farmerVoice.subtitle")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-end mb-8 gap-4">
          {canCreatePost && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white gap-2">
                  <Plus className="h-5 w-5" />
                  {t("farmerVoice.createPost")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{t("farmerVoice.createNewPost")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="title">{t("farmerVoice.postTitle")}</Label>
                    <Input
                      id="title"
                      value={newPost.title}
                      onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                      placeholder={t("farmerVoice.postTitlePlaceholder")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">{t("farmerVoice.category")}</Label>
                    <Select value={newPost.category} onValueChange={(value) => setNewPost(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.filter(c => c.value !== "all").map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="content">{t("farmerVoice.content")}</Label>
                    <Textarea
                      id="content"
                      value={newPost.content}
                      onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                      placeholder={t("farmerVoice.contentPlaceholder")}
                      rows={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="socialMediaUrl">{t("farmerVoice.socialMediaUrl")} ({t("common.optional")})</Label>
                    <Input
                      id="socialMediaUrl"
                      value={newPost.socialMediaUrl}
                      onChange={(e) => setNewPost(prev => ({ ...prev, socialMediaUrl: e.target.value }))}
                      placeholder="https://youtube.com/... or https://facebook.com/..."
                    />
                    <p className="text-xs text-gray-500 mt-1">{t("farmerVoice.socialMediaHint")}</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    {t("common.cancel")}
                  </Button>
                  <Button 
                    onClick={() => createPostMutation.mutate(newPost)}
                    disabled={!newPost.title || !newPost.content || createPostMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {createPostMutation.isPending ? t("common.posting") : t("farmerVoice.publish")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              <SelectValue placeholder={t("farmerVoice.allDistricts")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("farmerVoice.allDistricts")}</SelectItem>
              {districts?.map(district => (
                <SelectItem key={district.id} value={district.id.toString()}>{district.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              <SelectValue placeholder={t("farmerVoice.allCategories")} />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid gap-6">
            {posts.map(post => {
              const CategoryIcon = getCategoryIcon(post.category);
              const isExpanded = expandedPost === post.id;
              
              return (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${getCategoryColor(post.category)} border`}>
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {CATEGORIES.find(c => c.value === post.category)?.label || post.category}
                          </Badge>
                          {post.district && (
                            <Badge variant="outline" className="text-gray-600">
                              <MapPin className="h-3 w-3 mr-1" />
                              {post.district.name}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{post.title}</CardTitle>
                      </div>
                      {canEditPost(post) && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600"
                            onClick={() => handleEditPost(post)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t("farmerVoice.deleteConfirmTitle")}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t("farmerVoice.deleteConfirmDesc")}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => deletePostMutation.mutate(post.id)}
                                >
                                  {t("farmerVoice.delete")}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={post.districtManager?.avatar} />
                        <AvatarFallback className="text-xs bg-green-100 text-green-700">
                          {post.districtManager?.name?.charAt(0) || "D"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-700">
                        {post.districtManager?.name}
                        {post.districtManager?.orgName && (
                          <span className="text-gray-500 font-normal"> ({post.districtManager.orgName})</span>
                        )}
                      </span>
                      <span className="text-gray-300">•</span>
                      <Calendar className="h-3 w-3" />
                      <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                    {post.socialMediaUrl && (
                      <a 
                        href={post.socialMediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                        </svg>
                        {t("farmerVoice.viewOnSocialMedia")}
                      </a>
                    )}
                  </CardContent>

                  <CardFooter className="border-t bg-gray-50 flex flex-col">
                    <div className="flex items-center justify-between w-full py-3">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 hover:text-green-600"
                          onClick={() => user ? upvoteMutation.mutate(post.id) : toast({ title: t("farmerVoice.loginToUpvote"), variant: "destructive" })}
                          disabled={upvoteMutation.isPending}
                        >
                          <ArrowBigUp className="h-5 w-5" />
                          <span>{post.upvoteCount}</span>
                          <span>{t("farmerVoice.upvote")}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.commentCount} {t("farmerVoice.comments")}</span>
                        </Button>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 hover:text-green-600"
                          onClick={() => shareToWhatsApp(post)}
                          title="Share on WhatsApp"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 hover:text-blue-600"
                          onClick={() => shareToFacebook(post)}
                          title="Share on Facebook"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 hover:text-sky-500"
                          onClick={() => shareToTwitter(post)}
                          title="Share on X"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 hover:text-gray-600"
                          onClick={() => sharePost(post)}
                          title={t("farmerVoice.share")}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="w-full border-t pt-4 space-y-4">
                        {user && user.role === "farmer" && user.district === post.district?.name && (
                          <div className="flex gap-2">
                            <Textarea
                              placeholder={t("farmerVoice.addComment")}
                              value={commentText[post.id] || ""}
                              onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                              rows={2}
                              className="flex-1"
                            />
                            <Button
                              size="sm"
                              className="self-end bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                if (commentText[post.id]?.trim()) {
                                  addCommentMutation.mutate({ postId: post.id, content: commentText[post.id] });
                                }
                              }}
                              disabled={!commentText[post.id]?.trim() || addCommentMutation.isPending}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        )}

                        {!user && (
                          <p className="text-sm text-gray-500 text-center">
                            <Link href="/login" className="text-green-600 hover:underline">
                              {t("farmerVoice.loginToComment")}
                            </Link>
                          </p>
                        )}

                        <div className="space-y-3">
                          {comments?.map(comment => (
                            <div key={comment.id} className="bg-white p-3 rounded-lg border">
                              <div className="flex items-center gap-2 mb-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs bg-green-100 text-green-700">
                                    {comment.farmer?.farmName?.charAt(0) || "F"}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-sm">{comment.farmer?.farmName}</span>
                                <span className="text-xs text-gray-400">
                                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{comment.content}</p>
                            </div>
                          ))}
                          {comments?.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">
                              {t("farmerVoice.noComments")}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Megaphone className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{t("farmerVoice.noPosts")}</h3>
              <p className="text-gray-500">{t("farmerVoice.noPostsDesc")}</p>
            </CardContent>
          </Card>
        )}

        {/* Edit Post Dialog */}
        <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{t("farmerVoice.editPost")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-title">{t("farmerVoice.postTitle")}</Label>
                <Input
                  id="edit-title"
                  value={editPostData.title}
                  onChange={(e) => setEditPostData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={t("farmerVoice.postTitlePlaceholder")}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">{t("farmerVoice.category")}</Label>
                <Select value={editPostData.category} onValueChange={(value) => setEditPostData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.filter(c => c.value !== "all").map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-content">{t("farmerVoice.content")}</Label>
                <Textarea
                  id="edit-content"
                  value={editPostData.content}
                  onChange={(e) => setEditPostData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder={t("farmerVoice.contentPlaceholder")}
                  rows={5}
                />
              </div>
              <div>
                <Label htmlFor="edit-socialMediaUrl">{t("farmerVoice.socialMediaUrl")} ({t("common.optional")})</Label>
                <Input
                  id="edit-socialMediaUrl"
                  value={editPostData.socialMediaUrl}
                  onChange={(e) => setEditPostData(prev => ({ ...prev, socialMediaUrl: e.target.value }))}
                  placeholder="https://youtube.com/... or https://facebook.com/..."
                />
                <p className="text-xs text-gray-500 mt-1">{t("farmerVoice.socialMediaHint")}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingPost(null)}>
                {t("common.cancel")}
              </Button>
              <Button 
                onClick={() => editingPost && updatePostMutation.mutate({ postId: editingPost.id, data: editPostData })}
                disabled={!editPostData.title || !editPostData.content || updatePostMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {updatePostMutation.isPending ? t("common.saving") : t("common.save")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </>
  );
}
