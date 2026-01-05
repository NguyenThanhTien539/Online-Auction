import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import {
  Package,
  Calendar,
  DollarSign,
  Upload,
  CheckCircle,
  User,
  Phone,
  Mail,
  Image as ImageIcon,
  X,
  XCircle,
} from "lucide-react";

import { useAuth } from "@/routes/ProtectedRouter";

type ProductInfo = {
  product_id: number;
  product_name: string;
  product_image: string;
  final_price: number;
  end_time: string;
  seller_name: string;
  seller_email: string;
  seller_phone?: string;
  winner_name: string;
  winner_address: string;
  winner_phone: string;
  winner_email: string;
  buy_now_price: number;
  product_images: string[];
};

export default function WinnerOrderCompletionPage() {
  const [searchParams] = useSearchParams();
  const product_id = searchParams.get("product_id");
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState<ProductInfo | null>(null);
  const [infoUser, setInfoUser] = useState<any>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentProofImage, setPaymentProofImage] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    // Fetch product data from API
    async function fetchProduct() {
      if (!product_id || !auth) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setPhoneNumber(auth?.phone_number || "");
        setAddress(auth?.address || "");

        // Fetch product detail
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/products/detail-for-winner?product_id=${product_id}`,
          { credentials: "include" }
        );

        const data = await response.json();

        if (data.status === "error") {
          setOrderInfo(null);
          setInfoUser(null);
        } else {
          setOrderInfo(data.data);
          setInfoUser(data.infoSeller);
        }

        // Fetch order status
        const orderResponse = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/order/status?product_id=${product_id}`,
          { credentials: "include" }
        );

        const orderData = await orderResponse.json();

        if (orderData.status === "success" && orderData.data) {
          setOrderData(orderData.data);
          if (orderData.data.order_status === "pending") {
            setCurrentStep(2);
            if (orderData.data.payment_proof_image_url) {
              setPaymentProofPreview(orderData.data.payment_proof_image_url);
            }
            if (orderData.data.phone_number) {
              setPhoneNumber(orderData.data.phone_number);
            }
            if (orderData.data.shipping_address) {
              setAddress(orderData.data.shipping_address);
            }
          } else if (orderData.data.order_status === "finished") {
            setCurrentStep(3);
            // Load all order information
            if (orderData.data.payment_proof_image) {
              setPaymentProofPreview(orderData.data.payment_proof_image);
            }
            if (orderData.data.phone_number) {
              setPhoneNumber(orderData.data.phone_number);
            }
            if (orderData.data.shipping_address) {
              setAddress(orderData.data.shipping_address);
            }
          } else if (orderData.data.order_status === "rejected") {
            setCurrentStep(4);
            // Load payment proof to show what was rejected
            if (orderData.data.payment_proof_image_url) {
              setPaymentProofPreview(orderData.data.payment_proof_image_url);
            }
            if (orderData.data.phone_number) {
              setPhoneNumber(orderData.data.phone_number);
            }
            if (orderData.data.shipping_address) {
              setAddress(orderData.data.shipping_address);
            }
          } else {
            setCurrentStep(1);
          }
        } else {
          setCurrentStep(1);
        }
      } catch (e) {
        console.log(e);
      }
      setIsLoading(false);
    }
    fetchProduct();
  }, [product_id, auth]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setPaymentProofImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPaymentProofImage(null);
    setPaymentProofPreview("");
  };

  const handleSubmitPaymentProof = async () => {
    if (!paymentProofImage) {
      toast.error("Vui lòng tải lên ảnh chuyển khoản");
      return;
    }

    if (!phoneNumber.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }

    if (!address.trim()) {
      toast.error("Vui lòng nhập địa chỉ nhận hàng");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("product_id", product_id!);
      formData.append("phone_number", phoneNumber.trim());
      formData.append("shipping_address", address.trim());
      formData.append("payment_proof", paymentProofImage);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/order/create`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Đã tạo đơn hàng thành công!");
        setCurrentStep(2);
      } else {
        toast.error(data.message || "Có lỗi xảy ra khi tạo đơn hàng");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Có lỗi xảy ra khi tạo đơn hàng");
    }
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
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay về trang chủ
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
            Hoàn Tất Đơn Hàng
          </h1>
          <p className="text-gray-600">
            Mã sản phẩm: <span className="font-semibold">#{product_id}</span>
          </p>
        </div>

        {/* Wizard Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {/* Step 1 */}
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {currentStep > 1 ? <CheckCircle size={20} /> : "1"}
              </div>
              <span
                className={`ml-2 font-medium ${
                  currentStep >= 1 ? "text-blue-600" : "text-gray-500"
                }`}
              >
                Upload Chuyển Khoản
              </span>
            </div>

            {/* Connector */}
            <div
              className={`w-16 md:w-32 h-1 mx-4 ${
                currentStep >= 2 ? "bg-blue-600" : "bg-gray-300"
              }`}
            ></div>

            {/* Step 2 */}
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= 2
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {currentStep > 2 ? <CheckCircle size={20} /> : "2"}
              </div>
              <span
                className={`ml-2 font-medium ${
                  currentStep >= 2 ? "text-blue-600" : "text-gray-500"
                }`}
              >
                Chờ Vận Đơn
              </span>
            </div>

            {/* Connector */}
            <div
              className={`w-16 md:w-32 h-1 mx-4 ${
                currentStep >= 3 ? "bg-blue-600" : "bg-gray-300"
              }`}
            ></div>

            {/* Step 3 */}
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= 3
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {currentStep >= 3 ? <CheckCircle size={20} /> : "3"}
              </div>
              <span
                className={`ml-2 font-medium ${
                  currentStep >= 3 ? "text-green-600" : "text-gray-500"
                }`}
              >
                Hoàn Tất
              </span>
            </div>
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
                  <span>Giá thắng:</span>
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

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-3">Thông Tin Người Bán</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-500" />
                    <span>{infoUser?.full_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-500" />
                    <span>{infoUser?.email}</span>
                  </div>
                  {orderInfo.seller_phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-500" />
                      <span>{orderInfo.seller_phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Action Area */}
          <div className="lg:col-span-2">
            {/* Winner Info Card */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <User className="text-blue-600" size={24} />
                Thông Tin Người Nhận
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={auth?.full_name || ""}
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
                    value={auth?.email || ""}
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
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Nhập số điện thoại"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ nhận hàng
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nhập địa chỉ nhận hàng"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Proof Upload Card */}
            {currentStep === 1 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Upload className="text-blue-600" size={24} />
                  Upload Ảnh Chuyển Khoản
                </h2>

                <div className="mb-4">
                  <p className="text-gray-600 mb-4">
                    Vui lòng tải lên ảnh xác nhận đã chuyển khoản cho người bán.
                    Người bán sẽ xác nhận và gửi vận đơn cho bạn.
                  </p>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    {!paymentProofPreview ? (
                      <div className="text-center">
                        <ImageIcon
                          className="mx-auto mb-4 text-gray-400"
                          size={48}
                        />
                        <label
                          htmlFor="payment-proof"
                          className="cursor-pointer inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Upload size={20} className="mr-2" />
                          Chọn ảnh
                        </label>
                        <input
                          id="payment-proof"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          PNG, JPG, JPEG (tối đa 5MB)
                        </p>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={paymentProofPreview}
                          alt="Payment proof"
                          className="w-full max-h-96 object-contain rounded-lg"
                        />
                        <button
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={handleSubmitPaymentProof}
                    disabled={!paymentProofImage}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Xác nhận đã chuyển khoản
                  </button>
                </div>
              </div>
            )}

            {/* Waiting for Shipping Card */}
            {currentStep === 2 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Package className="text-blue-600" size={24} />
                  Chờ Người Bán Gửi Vận Đơn
                </h2>

                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                    <Package className="text-blue-600" size={40} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Đã gửi ảnh chuyển khoản thành công!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Người bán đang xác nhận thanh toán và chuẩn bị hàng. <br />
                    Bạn sẽ nhận được thông báo khi người bán đăng vận đơn.
                  </p>

                  {paymentProofPreview && (
                    <div className="mt-6">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Ảnh chuyển khoản của bạn:
                      </p>
                      <img
                        src={paymentProofPreview}
                        alt="Payment proof"
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

            {/* Completion Card */}
            {currentStep === 3 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={24} />
                  Hoàn Tất Đơn Hàng
                </h2>

                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="text-green-600" size={40} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Đơn hàng đã hoàn tất!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
                  </p>
                </div>

                {/* Rating Seller Section */}
                <div className="mb-6">
                  <button
                    onClick={() =>
                      navigate(
                        `/rating/${infoUser?.username}_${infoUser?.user_id}`
                      )
                    }
                    className="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Đánh giá người bán
                  </button>
                </div>

                <button
                  onClick={() => navigate(-1)}
                  className="w-full px-6 py-3 bg-blue-300 text-white rounded-lg hover:bg-blue-400 cursor-pointer transition-colors duration-300"
                >
                  Quay lại
                </button>
              </div>
            )}

            {/* Rejected Card */}
            {currentStep === 4 && (
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
                    Đơn hàng đã bị người bán từ chối
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Rất tiếc, người bán đã từ chối đơn hàng của bạn. <br />
                    Vui lòng liên hệ với người bán để biết thêm chi tiết.
                  </p>

                  {paymentProofPreview && (
                    <div className="mt-6">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Ảnh chuyển khoản đã gửi:
                      </p>
                      <img
                        src={paymentProofPreview}
                        alt="Payment proof"
                        className="mx-auto max-w-md max-h-64 object-contain rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate("/")}
                  className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Quay về trang chủ
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
