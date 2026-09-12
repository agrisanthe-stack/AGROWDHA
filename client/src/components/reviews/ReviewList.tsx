import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Review = {
  id: number;
  rating: number;
  comment: string;
  name: string;
  avatarUrl: string;
  date: string;
};

type ReviewListProps = {
  reviews: Review[];
  entityType: "product" | "farmer";
};

export default function ReviewList({ reviews, entityType }: ReviewListProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">
        No reviews yet. Be the first to review this {entityType}!
      </div>
    );
  }

  const calculateAverageRating = () => {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < fullStars
                ? "fill-yellow-400 text-yellow-400"
                : i === fullStars && halfStar
                ? "fill-yellow-400 text-yellow-400 half-star"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b">
        <h3 className="text-lg font-medium">
          Customer Reviews ({reviews.length})
        </h3>
        <div className="flex items-center">
          <div className="flex mr-2">
            {renderStars(parseFloat(calculateAverageRating()))}
          </div>
          <span className="font-medium">{calculateAverageRating()}</span>
          <span className="text-gray-500 ml-1">/ 5</span>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6 last:border-0">
            <div className="flex items-start gap-3">
              <img
                src={review.avatarUrl}
                alt={review.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{review.name}</h4>
                  <span className="text-sm text-gray-500">
                    {typeof review.date === 'string' ? review.date : formatDistanceToNow(new Date(review.date), { addSuffix: true })}
                  </span>
                </div>
                <div className="flex my-1">
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-700 mt-2">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}