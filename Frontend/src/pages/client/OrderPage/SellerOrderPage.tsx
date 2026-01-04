import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import {
  Package,
  Calendar,
  DollarSign,
  CheckCircle,
  User,
  Phone,
  Mail,
  Image as ImageIcon,
  XCircle,
  Upload,
  X,
} from "lucide-react";
import { useAuth } from "@/routes/ProtectedRouter";
import Swal from "sweetalert2";

type OrderInfo = {
  order_id: number;
  product_id: number;
  product_name: string;
  product_images: string[];
  buy_now_price: number;
  end_time: string;
  payment_proof_image_url: string;
  phone_number: string;
  shipping_address: string;
  order_status: string;
  winner_name: string;
  winner_email: string;
  winner_avatar?: string;
  shipping_label_image?: string;
};

export default function SellerOrderPage() {
  const [searchParams] = useSearchParams();
  const product_id = searchParams.get("product_id");
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();
  const [shippingLabelImage, setShippingLabelImage] = useState<File | null>(
    null
  );
  const [shippingLabelPreview, setShippingLabelPreview] = useState<string>("");

  useEffect(() => {
    async function fetchOrderData() {
      if (!product_id || !auth) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);

        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/order/seller-view?product_id=${product_id}`,
          { credentials: "include" }
        );

        const data = await response.json();
        console.log("API seller-view response:", data);

        if (data.status === "error" || !data.data) {
          console.log("No order data found");
          toast.error(data.message || "Chưa có đơn hàng cho sản phẩm này");
          setOrderInfo(null);
        } else {
          console.log("Order data:", data.data);
          setOrderInfo(data.data);
          if (data.data.shipping_label_image) {
            setShippingLabelPreview(data.data.shipping_label_image);
          }
        }
      } catch (e) {
        console.log("Error fetching order:", e);
        toast.error("Có lỗi xảy ra khi tải thông tin đơn hàng");
      }
      setIsLoading(false);
    }
    fetchOrderData();
  }, [product_id, auth]);

  const handleShippingLabelUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước file không được vượt quá 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chỉ tải lên file ảnh");
        return;
      }
      setShippingLabelImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setShippingLabelPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveShippingLabel = () => {
    setShippingLabelImage(null);
    setShippingLabelPreview("");
  };

  const handleApproveOrder = async () => {
    if (!shippingLabelImage && !orderInfo?.shipping_label_image) {
      toast.error("Vui lòng tải lên ảnh vận đơn");
      return;
    }

    Swal.fire({
      title: "Xác nhận đơn hàng?",
      text: "Bạn xác nhận đã nhận được thanh toán và sẽ gửi hàng",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const formData = new FormData();
          formData.append("product_id", product_id!);
          if (shippingLabelImage) {
            formData.append("shipping_label", shippingLabelImage);
          }

          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/order/approve?product_id=${product_id}`,
            {
              method: "POST",
              credentials: "include",
              body: formData,
            }
          );

          const data = await response.json();

          if (data.status === "success") {
            toast.success("Đã xác nhận đơn hàng thành công!");
            // Reload order data
            window.location.reload();
          } else {
            toast.error(data.message || "Có lỗi xảy ra khi xác nhận đơn hàng");
          }
        } catch (error) {
          console.error("Error approving order:", error);
          toast.error("Có lỗi xảy ra khi xác nhận đơn hàng");
        }
      }
    });
  };

  const handleRejectOrder = () => {
    Swal.fire({
      title: "Từ chối đơn hàng?",
      text: "Bạn có chắc chắn muốn từ chối đơn hàng này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Từ chối",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `${
              import.meta.env.VITE_API_URL
            }/api/order/reject?product_id=${product_id} `,
            {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ product_id }),
            }
          );

          const data = await response.json();

          if (data.status === "success") {
            toast.success("Đã từ chối đơn hàng");
            navigate(-1);
          } else {
            toast.error(data.message || "Có lỗi xảy ra khi từ chối đơn hàng");
          }
        } catch (error) {
          console.error("Error rejecting order:", error);
          toast.error("Có lỗi xảy ra khi từ chối đơn hàng");
        }
      }
    });
  };

  if (isLoading || !auth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!orderInfo) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Không tìm thấy đơn hàng
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Quản Lý Đơn Hàng
          </h1>
          <p className="text-gray-600">
            Mã đơn hàng:{" "}
            <span className="font-semibold">#{orderInfo.order_id}</span>
          </p>
          <div className="mt-2">
            <span
              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                orderInfo.order_status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : orderInfo.order_status === "finished"
                  ? "bg-green-100 text-green-800"
                  : orderInfo.order_status === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {orderInfo.order_status === "pending"
                ? "Chờ xác nhận"
                : orderInfo.order_status === "finished"
                ? "Đã hoàn tất"
                : orderInfo.order_status === "rejected"
                ? "Đã từ chối"
                : "Không xác định"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Product Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Package className="text-blue-600" size={24} />
                Thông Tin Sản Phẩm
              </h2>

              <div className="mb-4">
                <img
                  src={orderInfo.product_images[0]}
                  alt={orderInfo.product_name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              <h3 className="font-semibold text-lg mb-3">
                {orderInfo.product_name}
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign size={18} className="text-green-600" />
                  <span>Giá bán:</span>
                  <NumericFormat
                    value={orderInfo.buy_now_price}
                    displayType="text"
                    thousandSeparator=","
                    suffix=" đ"
                    className="font-bold text-green-600"
                  />
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={18} className="text-blue-600" />
                  <span>Kết thúc:</span>
                  <span className="font-medium">
                    {new Date(orderInfo.end_time).toLocaleString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Details */}
          <div className="lg:col-span-2">
            {/* Winner Info Card */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <User className="text-blue-600" size={24} />
                Thông Tin Người Mua
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={orderInfo.winner_name}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={orderInfo.winner_email}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={orderInfo.phone_number}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ giao hàng
                  </label>
                  <textarea
                    value={orderInfo.shipping_address}
                    readOnly
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Payment Proof */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ImageIcon className="text-blue-600" size={24} />
                Ảnh Chuyển Khoản Từ Người Mua
              </h2>

              {orderInfo.payment_proof_image_url ? (
                <div className="border-2 border-gray-300 rounded-lg p-4">
                  <img
                    src={orderInfo.payment_proof_image_url}
                    alt="Payment proof"
                    className="w-full max-h-96 object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <ImageIcon className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-600 font-medium mb-2">
                    Người mua chưa gửi ảnh chuyển khoản
                  </p>
                  <p className="text-gray-500 text-sm">
                    Vui lòng chờ người mua hoàn tất thanh toán và tải lên ảnh
                    chuyển khoản
                  </p>
                </div>
              )}
            </div>

            {/* Shipping Label Upload */}
            {orderInfo.order_status === "pending" && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Upload className="text-blue-600" size={24} />
                  Upload Vận Đơn
                </h2>

                <div className="mb-4">
                  <p className="text-gray-600 mb-4">
                    Vui lòng tải lên ảnh vận đơn để xác nhận đơn hàng và gửi cho
                    người mua.
                  </p>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    {!shippingLabelPreview ? (
                      <div className="text-center">
                        <ImageIcon
                          className="mx-auto mb-4 text-gray-400"
                          size={48}
                        />
                        <label
                          htmlFor="shipping-label"
                          className="cursor-pointer inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Upload size={20} className="mr-2" />
                          Chọn ảnh vận đơn
                        </label>
                        <input
                          id="shipping-label"
                          type="file"
                          accept="image/*"
                          onChange={handleShippingLabelUpload}
                          className="hidden"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          PNG, JPG, JPEG (tối đa 5MB)
                        </p>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={shippingLabelPreview}
                          alt="Shipping label"
                          className="w-full max-h-96 object-contain rounded-lg"
                        />
                        {!orderInfo.shipping_label_image && (
                          <button
                            onClick={handleRemoveShippingLabel}
                            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                          >
                            <X size={20} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleRejectOrder}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                  >
                    <XCircle size={20} className="inline mr-2" />
                    Từ chối đơn hàng
                  </button>
                  <button
                    onClick={handleApproveOrder}
                    disabled={
                      !shippingLabelImage && !orderInfo.shipping_label_image
                    }
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
                  >
                    <CheckCircle size={20} className="inline mr-2" />
                    Xác nhận đơn hàng
                  </button>
                </div>
              </div>
            )}

            {/* Order Completed */}
            {orderInfo.order_status === "finished" && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={24} />
                  Đơn Hàng Đã Hoàn Tất
                </h2>

                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="text-green-600" size={40} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Đơn hàng đã được xác nhận và gửi thành công!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Vận đơn đã được gửi cho người mua.
                  </p>

                  {orderInfo.shipping_label_image && (
                    <div className="mt-6">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Ảnh vận đơn:
                      </p>
                      <img
                        src={orderInfo.shipping_label_image}
                        alt="Shipping label"
                        className="mx-auto max-w-md max-h-64 object-contain rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate(-1)}
                  className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Quay lại
                </button>
              </div>
            )}

            {/* Order Rejected */}
            {orderInfo.order_status === "rejected" && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <XCircle className="text-red-600" size={24} />
                  Đơn Hàng Đã Bị Từ Chối
                </h2>

                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                    <XCircle className="text-red-600" size={40} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Đơn hàng đã bị từ chối
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Bạn đã từ chối đơn hàng này. Người mua sẽ được thông báo.
                  </p>
                </div>

                <button
                  onClick={() => navigate(-1)}
                  className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Quay lại
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
