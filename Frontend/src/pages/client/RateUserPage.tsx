import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, ThumbsUp, ThumbsDown, User, Send } from 'lucide-react';
import Loading from '@/components/common/Loading';
import {toast} from "sonner";
interface UserToRate {
  username: string;
  full_name: string;
  rating: number;
  rating_count: number;
}

export default function RateUserPage() {
  const navigate = useNavigate();
  const params = useParams();
  const [userToRate, setUserToRate] = useState<UserToRate | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const username = params.username_id?.trim().split("_")[0];
    const user_id = params.username_id?.trim().split("_")[1];
    
    if (!username || !user_id) {
      navigate("/");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/profile/detail?username=${username}&user_id=${user_id}`, {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch user profile");
        }
        return res.json();
      })
      .then(data => {
        setUserToRate(data.data);
      })
      .catch(error => {
        console.error("Can't connect to backend:", error);
        navigate("/");
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (score === null) {
      setError('Vui lòng chọn đánh giá (tích cực hoặc tiêu cực)');
      return;
    }

    if (!comment.trim()) {
      setError('Vui lòng nhập nhận xét');
      return;
    }

    setIsSubmitting(true);

    try {
      const username = params.username_id?.trim().split("_")[0];
      const user_id = params.username_id?.trim().split("_")[1];
        if (!username || !user_id) {
        navigate("/");
        return;
        }
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          user_id: parseInt(user_id),
          score,
          comment: comment.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      // Success - navigate back to profile
      navigate(-1);
    } catch (error) {
      setError('Không thể gửi đánh giá. Vui lòng thử lại.');
      toast.error("Không thể gửi đánh giá. Vui lòng thử lại.");
      setIsSubmitting(false);
    }
  };

  if (!userToRate) return <Loading />;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-slate-700 bg-clip-text text-transparent mb-2">
            Đánh giá người dùng
          </h1>
          <p className="text-gray-600">Chia sẻ trải nghiệm của bạn</p>
        </div>

        {/* User Info Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-8 mb-6">
          <div className="flex items-center space-x-6 mb-6">
            {/* Avatar */}
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-gray-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white">
                {userToRate.full_name?.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* User Details */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">{userToRate.full_name}</h2>
              <p className="text-gray-600 mb-2">@{userToRate.username}</p>
              
              <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200 inline-flex">
                <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                <span className="font-bold text-yellow-700 mr-1">{userToRate.rating.toFixed(1)}</span>
                <span className="text-yellow-600 text-sm">({userToRate.rating_count} đánh giá)</span>
              </div>
            </div>
          </div>

          {/* Rating Stars Display */}
          <div className="flex items-center justify-center space-x-1 py-4 border-t border-gray-200">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 ${
                  star <= Math.floor(userToRate.rating)
                    ? 'text-yellow-400 fill-current'
                    : star - 0.5 <= userToRate.rating
                    ? 'text-yellow-400 fill-current opacity-50'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-3 text-gray-700 font-semibold text-lg">
              {userToRate.rating.toFixed(1)} / 5.0
            </span>
          </div>
        </div>

        {/* Rating Form */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Đánh giá của bạn</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Score Selection */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3">
                Đánh giá trải nghiệm *
              </label>
              <div className="flex gap-4 justify-center">
                {/* Thumbs Down - Score -1 */}
                <button
                  type="button"
                  onClick={() => setScore(-1)}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 hover:scale-105 ${
                    score === -1
                      ? 'border-red-500 bg-red-50 shadow-lg'
                      : 'border-gray-300 bg-white hover:border-red-300'
                  }`}
                >
                  <ThumbsDown
                    className={`w-12 h-12 mb-2 cursor-pointer ${
                      score === -1 ? 'text-red-500 fill-current' : 'text-gray-400'
                    }`}
                  />
                  <span
                    className={`font-semibold ${
                      score === -1 ? 'text-red-600' : 'text-gray-600'
                    }`}
                  >
                    Tiêu cực
                  </span>
                </button>

                {/* Thumbs Up - Score +1 */}
                <button
                  type="button"
                  onClick={() => setScore(1)}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 hover:scale-105 ${
                    score === 1
                      ? 'border-green-500 bg-green-50 shadow-lg'
                      : 'border-gray-300 bg-white hover:border-green-300'
                  }`}
                >
                  <ThumbsUp
                    className={`w-12 h-12 mb-2 cursor-pointer ${
                      score === 1 ? 'text-green-400 fill-current' : 'text-gray-400'
                    }`}
                  />
                  <span
                    className={`font-semibold ${
                      score === 1 ? 'text-green-600' : 'text-gray-600'
                    }`}
                  >
                    Tích cực
                  </span>
                </button>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="comment" className="block text-gray-700 font-semibold mb-3">
                Nhận xét của bạn *
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn với người dùng này..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={5}
                maxLength={500}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {comment.length}/500 ký tự
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border cursor-pointer border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 cursor-pointer bg-gradient-to-r from-blue-300 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-400 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Gửi đánh giá
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}