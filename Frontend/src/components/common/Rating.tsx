import { useState } from "react";
import { Star, Send } from "lucide-react";
import { toast } from "sonner";

interface RatingProps {
  productId: string;
  targetUserId: number;
  targetName: string;
  targetType: "seller" | "buyer"; // "seller" for buyer rating seller, "buyer" for seller rating buyer
  onRatingSubmitted?: () => void;
}

export default function Rating({
  productId,
  targetUserId,
  targetName,
  targetType,
  onRatingSubmitted,
}: RatingProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const targetLabel = targetType === "seller" ? "người bán" : "người mua";
  const placeholderText =
    targetType === "seller"
      ? "Hãy chia sẻ trải nghiệm của bạn với người bán..."
      : "Hãy chia sẻ trải nghiệm của bạn với người mua...";

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/rate`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: targetUserId,
            score: rating,
            comment: comment.trim() || null,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        toast.success(`Đánh giá ${targetLabel} thành công!`);
        setIsSubmitted(true);
        onRatingSubmitted?.();
      } else {
        toast.error(data.message || "Có lỗi xảy ra khi đánh giá");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Có lỗi xảy ra khi đánh giá");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={20}
              className={`${
                i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <p className="text-green-800 font-medium">Cảm ơn bạn đã đánh giá!</p>
        {comment && <p className="text-green-700 text-sm mt-1">"{comment}"</p>}
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Đánh giá {targetLabel}: {targetName}
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Số sao đánh giá *
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1"
            >
              <Star
                size={32}
                className={`${
                  star <= (hoverRating || rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                } transition-colors`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            {rating === 1 && "Rất tệ"}
            {rating === 2 && "Tệ"}
            {rating === 3 && "Bình thường"}
            {rating === 4 && "Tốt"}
            {rating === 5 && "Xuất sắc"}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nhận xét (tùy chọn)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={placeholderText}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting || rating === 0}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        <Send size={18} />
        {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
      </button>
    </div>
  );
}
