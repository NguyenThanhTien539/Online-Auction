import { useState } from "react";
import { ShoppingCart, Zap, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/routes/ProtectedRouter";
interface BuyNowSectionProps {
  product_id?: number;
  buy_now_price?: number;
  product_name?: string;
setProduct?: Function;
}

export default function BuyNowSection({
  product_id,
  buy_now_price,
  product_name,

}: BuyNowSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();
  const {auth} = useAuth();
  const handleBuyNowClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmBuyNow = async () => {
    if (!buy_now_price || !product_id) {
      toast.error("Thông tin sản phẩm không hợp lệ!");
      return;
    }

    setShowConfirmModal(false);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bid/buy_now`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            product_id: product_id,
            buy_price: buy_now_price,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Có lỗi xảy ra khi mua sản phẩm!");
      }

      if (data.status === "success") {
        toast.success("Mua sản phẩm thành công!");

      } else {
        toast.error(data.message || "Mua sản phẩm thất bại!");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Lỗi kết nối đến server!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!buy_now_price) {
    return null;
  }

  return (
    <div className="p-6 border-t border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-rose-500 rounded-lg">
          <ShoppingCart className="w-4 h-4 text-white" />
        </div>
        <div>
          <h4 className="text-base font-bold text-gray-800">Mua ngay</h4>
          <p className="text-xs text-gray-600">
            Sở hữu sản phẩm ngay lập tức với giá cố định
          </p>
        </div>
      </div>

      {/* Content Grid - Horizontal Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
        {/* Price Info */}
        <div className="bg-rose-50 p-4 rounded-lg border border-rose-200 h-fit">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-semibold text-rose-700">Giá mua ngay</span>
          </div>
          <p className="text-xl font-bold text-rose-800 mb-2">
            {buy_now_price.toLocaleString()} VNĐ
          </p>
          <div className="space-y-0.5 text-xs text-rose-600">
            <p>• Không cần đấu giá</p>
            <p>• Sở hữu ngay lập tức</p>
            <p>• Kết thúc đấu giá ngay</p>
          </div>
        </div>

        {/* Buy Now Form */}
        <div className="flex flex-col justify-center gap-3">
          <button
            onClick={handleBuyNowClick}
            disabled={isSubmitting}
            className={`bg-rose-600 hover:bg-rose-700 text-white py-2.5 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap
              ${isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Đang xử lý...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Mua ngay
              </>
            )}
          </button>

          {/* Helper Text */}
          <div className="p-2 bg-rose-50 rounded-lg border border-rose-100">
            <p className="text-xs text-rose-700 leading-tight">
              <span className="font-semibold">Lưu ý:</span> Phiên đấu giá sẽ kết thúc ngay
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/30  flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200 animate__animated animate__zoomIn animate__fast">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Xác nhận mua ngay</h3>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 mb-6">
              <p className="text-gray-700">
                Bạn chắc chắn muốn mua sản phẩm này với giá:
              </p>
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Giá mua ngay</p>
                <p className="text-2xl font-bold text-rose-600">
                  {buy_now_price?.toLocaleString()} VNĐ
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-800">
                  <span className="font-semibold">Lưu ý:</span> Phiên đấu giá sẽ kết thúc ngay lập tức và bạn sẽ sở hữu sản phẩm này.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2.5 cursor-pointer border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmBuyNow}
                className="flex-1 px-4 py-2.5 cursor-pointer bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors font-semibold shadow-md hover:shadow-lg"
              >
                Xác nhận mua
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
