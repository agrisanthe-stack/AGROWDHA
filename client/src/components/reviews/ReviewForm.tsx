import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, { message: "Comment must be at least 10 characters" }),
});

type ReviewFormProps = {
  entityId: number;
  entityType: "product" | "farmer";
  onSuccess?: () => void;
};

export default function ReviewForm({ entityId, entityType, onSuccess }: ReviewFormProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async (data: z.infer<typeof reviewSchema>) => {
      const endpoint = entityType === "product" 
        ? `/api/products/${entityId}/reviews` 
        : `/api/farmers/${entityId}/reviews`;
      
      const response = await apiRequest("POST", endpoint, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      
      // Invalidate the entity's data to refresh reviews
      if (entityType === "product") {
        queryClient.invalidateQueries({ queryKey: [`/api/products/${entityId}`] });
      } else {
        queryClient.invalidateQueries({ queryKey: [`/api/farmers/${entityId}`] });
      }
      
      // Reset the form
      form.reset({ rating: 0, comment: "" });
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error submitting review",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof reviewSchema>) => {
    reviewMutation.mutate(data);
  };

  const handleStarClick = (rating: number) => {
    form.setValue("rating", rating);
  };

  const renderStars = () => {
    const stars = [];
    const currentRating = form.getValues().rating;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={24}
          className={`cursor-pointer transition-colors ${
            i <= (hoveredRating || currentRating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => handleStarClick(i)}
        />
      );
    }

    return stars;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-medium mb-4">Write a Review</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="rating"
            render={() => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center space-x-1">
                    {renderStars()}
                    <span className="ml-2 text-sm text-gray-500">
                      {form.getValues().rating > 0 ? `${form.getValues().rating}/5` : "Select rating"}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Share your experience..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full"
            disabled={reviewMutation.isPending}
          >
            {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </Form>
    </div>
  );
}