import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ThumbsUp, ThumbsDown, X, User, MessageSquare, Calendar, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import Loading from '@/components/common/Loading';
import PaginationComponent from '@/components/common/Pagination';
import {Link} from 'react-router-dom';

interface RatingItem {
  rating_id: number;
  score: number;
  comment: string;
  created_at: string;
  rater_id: number;
  rater_username: string;
  rater_full_name: string;
  rater_avatar: string;
  rater_rating?: number;
  rater_rating_count?: number;
  total_count?: number;
  
}

interface RatingStats {
  rating_count: number;
  positive_rating_count: number;
}

export default function RatingHistoryPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState<RatingItem[]>([]);
  const [ratingStats, setRatingStats] = useState<RatingStats>({ rating_count: 0, positive_rating_count: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState<RatingItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const username = params.username_id?.trim().split("_")[0];
  const user_id = params.username_id?.trim().split("_")[1];

  useEffect(() => {
    if (!username || !user_id) {
      navigate("/");
      return;
    }

    // Fetch rating stats
    fetch(`${import.meta.env.VITE_API_URL}/api/user/rate/count?user_id=${user_id}&username=${username}`, {
      credentials: "include",
    })
      .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch stats"))
      .then(data => {
        console.log("Rating stats:", data);
        setRatingStats(data.data || { rating_count: 0, positive_rating_count: 0 });
      })
      .catch(error => {
        console.error("Can't fetch rating stats:", error);
      });
  }, [username, user_id]);

  useEffect(() => {
    if (!username || !user_id) return;

    setIsLoading(true);


    // Fetch rating history with pagination
    fetch(`${import.meta.env.VITE_API_URL}/api/user/rate/history?user_id=${user_id}&username=${username}&page=${currentPage}&limit=${itemsPerPage}`, {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch ratings");
        }
        return res.json();
      })
      .then(data => {
              
        setRatings(data.data || []);
        setTotalPages(Math.ceil((data.data[0]?.total_count || 0) / itemsPerPage));
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Can't connect to backend:", error);
        setIsLoading(false);
      });
  }, [username, user_id, currentPage, itemsPerPage]);

  const openModal = (rating: RatingItem) => {
    setSelectedRating(rating);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedRating(null), 300);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-slate-700 bg-clip-text text-transparent mb-2">
            Lịch sử đánh giá
          </h1>
          <p className="text-gray-600">Tất cả đánh giá từ người dùng khác</p>
        </div>

        {/* Stats Summary */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-600">{ratingStats.rating_count}</div>
              <div className="text-gray-600 text-sm">Tổng đánh giá</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-green-600">
                {ratingStats.positive_rating_count}
              </div>
              <div className="text-gray-600 text-sm">Tích cực</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-red-600">
                {ratingStats.rating_count - ratingStats.positive_rating_count}
              </div>
              <div className="text-gray-600 text-sm">Tiêu cực</div>
            </div>
          </div>
        </div>

        {/* Ratings List */}
        {ratings.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Chưa có đánh giá nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ratings.map((rating) => (
              <div
                key={rating.rating_id}
                className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6 mb-10"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Rater Info */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <Link to={`/profile/${rating.rater_username}_${rating.rater_id}`} className="w-14 h-14 bg-gradient-to-br from-blue-500 to-gray-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                      { rating.rater_avatar ? <img
                        src={rating.rater_avatar}
                        alt="Rater Avatar"
                        className="w-14 h-14 rounded-full object-cover"
                      /> :
                        <span className="text-xl font-bold text-white">
                        {rating.rater_full_name?.charAt(0).toUpperCase()}
                      </span>}
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-800 text-lg">
                          {rating.rater_full_name}
                        </h3>
                        {rating.score == 1 ? (
                          <div className="flex items-center bg-green-50 px-2 py-1 rounded-full border border-green-200">
                            <ThumbsUp className="w-4 h-4 text-green-500 fill-current mr-1" />
                            <span className="text-green-700 text-xs font-semibold">Tích cực</span>
                          </div>
                        ) : (
                          <div className="flex items-center bg-red-50 px-2 py-1 rounded-full border border-red-200">
                            <ThumbsDown className="w-4 h-4 text-red-500 fill-current mr-1" />
                            <span className="text-red-700 text-xs font-semibold">Tiêu cực</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">@{rating.rater_username}</p>
                      
                      {/* Comment Preview */}
                      <p className="text-gray-700 line-clamp-2 mb-2">
                        {rating.comment}
                      </p>

                      {/* Date */}
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(rating.created_at)}
                      </div>
                    </div>
                  </div>

                  {/* Right: View Details Button */}
                  <button
                    onClick={() => openModal(rating)}
                    className="px-4 py-2 bg-blue-300 hover:bg-blue-400 cursor-pointer transition-all duration-300 text-white rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg flex items-center gap-2 flex-shrink-0"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Xem chi tiết</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <PaginationComponent
          currentPage={currentPage}
          numberOfPages={totalPages}
          controlPage={handlePageChange}
        />

        {/* Modal */}
        {isModalOpen && selectedRating && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto  animate__animated animate__zoomIn animate__faster"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Chi tiết đánh giá</h2>
                <button
                  onClick={closeModal}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                {/* Rater Information */}
                <Link to = {`/profile/${selectedRating.rater_username}_${selectedRating.rater_id}`} className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-gray-600 rounded-full flex items-center justify-center shadow-sm">
                    { selectedRating.rater_avatar ? <img
                      src={selectedRating.rater_avatar}
                      alt="Rater Avatar"
                      className="w-14 h-14 rounded-full object-cover"
                    /> :
                      <span className="text-xl font-bold text-white">
                      {selectedRating.rater_full_name?.charAt(0).toUpperCase()}
                    </span>}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {selectedRating.rater_full_name}
                    </h4>
                    <p className="text-sm text-gray-500">@{selectedRating.rater_username}</p>
                  </div>
                </Link>

                {/* Rating Type */}
                <div className="flex justify-center py-2">
                  {selectedRating.score === 1 ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                      <ThumbsUp className="w-5 h-5 text-green-600 fill-current" />
                      <span className="font-medium text-green-700">Đánh giá tích cực</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                      <ThumbsDown className="w-5 h-5 text-red-600 fill-current" />
                      <span className="font-medium text-red-700">Đánh giá tiêu cực</span>
                    </div>
                  )}
                </div>

                {/* Comment */}
                <div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    "{selectedRating.comment}"
                  </p>
                </div>

                {/* Date */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    {formatDate(selectedRating.created_at)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}