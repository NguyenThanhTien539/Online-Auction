import { useState } from "react";
import { X, AlertTriangle, Ban, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface BanBidderModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  username: string;
  productId: number;
}

export default function BanBidderModal({
  isOpen,
  onClose,
  userId,
  username,
  productId,
}: BanBidderModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleBanBidder = async () => {
    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do cấm người dùng");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bid/ban_bidder`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: productId,
            banned_user_id: userId,
            reason: reason,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success(`Đã cấm người dùng ${username} thành công`);
        onClose();
      } else {
        toast.error(data.message || "Không thể cấm người dùng này");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi cấm người dùng");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200 animate__animated animate__zoomIn animate__fast">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Cấm người dùng</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Ban className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900 mb-1">
                  Bạn đang thực hiện cấm người dùng
                </p>
                <p className="text-sm text-red-700">
                  Người dùng <span className="font-semibold">{username}</span>{" "}
                  sẽ không thể tham gia đấu giá sản phẩm này nữa.
                </p>
              </div>
            </div>
          </div>

          {/* Reason Input */}
          <div className="space-y-2">
            <label
              htmlFor="ban-reason"
              className="block text-sm font-medium text-gray-700"
            >
              Lý do cấm <span className="text-red-500">*</span>
            </label>
            <textarea
              id="ban-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
              placeholder="Nhập lý do cấm người dùng này..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500">
              Lý do này sẽ được lưu lại và có thể xem lại sau
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm cursor-pointer font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleBanBidder}
            disabled={isSubmitting || !reason.trim()}
            className="px-4 py-2 text-sm font-medium cursor-pointer text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Ban className="w-4 h-4" />
                Xác nhận cấm
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
