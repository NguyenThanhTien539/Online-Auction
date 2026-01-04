import React, { useState, useEffect } from "react";
// import { formatPrice, parsePrice } from '@/utils/format_price';
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { DateTime } from "luxon";
import { useAuth } from "@/routes/ProtectedRouter";
import PlayBidSection from "./components/PlayBidSection";
import BuyNowSection from "./components/BuyNowSection";
import BidHistorySection from "./components/BidHistorySection";
import QASection from "./components/QASection";
import ProductDescriptionSection from "./components/ProductDescriptionSection";
import RelatedProductsSection from "./components/RelatedProductsSection";
import ProductImageGallery from "./components/ProductImageGallery";
import { Clock, Calendar, User, Star, Award, TrendingUp } from "lucide-react";
import useSocketBidding from "@/hooks/useSocketBidding";
import PreviewImage from "./components/PreviewProductModal";
import Loading from "@/components/common/Loading";
import { slugify } from "@/utils/make_slug";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
type ProductType = {
  product_id: number;
  product_name: string;
  product_images: string[];

  seller_id: number;
  seller_username: string;
  seller_rating: number;
  seller_avatar?: string;

  current_price: number;
  step_price: number;
  buy_now_price?: number;

  price_owner_id?: number;
  price_owner_username?: string;
  price_owner_rating?: number;
  price_owner_avatar?: string;

  start_time: string;
  end_time: string;
  description: string;
  auto_extended?: boolean;

  cat2_id: number;
};

function DetailProductPage() {
  // Auth user useContext
  const navigator = useNavigate();
  const { auth } = useAuth();
  const [isSeller, setIsSeller] = useState(false);
  // Sample product data - in a real app, this would come from props or API
  const [products, setProduct] = useState<ProductType>();
  const { slugid } = useParams();
  let product_id: number | undefined;
  let product_slug: string;
  if (slugid) {
    const parts = slugid.split("-");
    product_id = Number(parts.pop());
    product_slug = parts.join("-");
  }
  // Socket for bidding
  const socket = useSocketBidding(product_id || null);

  // Custome time

  const [formattedStartTime, setFormatStartTime] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  const [isLoading, setLoading] = useState(true);
  const { setBreadcrumbs } = useBreadcrumb();
  // Initial loading data
  useEffect(() => {
    // Fetch product data from API
    async function fetchProduct() {
      try {
        // param is slug-id
        setLoading(true);
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/products/detail?product_id=${product_id}&product_slug=${product_slug}`
        );
        const data = await response.json();
        if (!response.ok) {
          toast.error("Lỗi khi tải sản phẩm");
        } else {
          setProduct(data.data);
        }
      } catch (e) {
        toast.error("Lỗi kết nối đến server");
        console.log(e);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [slugid]);

  useEffect(() => {
    async function fetchBreadCrumbs() {
      fetch(
        `${import.meta.env.VITE_API_URL}/api/categories/cat2?cat2_id=${
          products?.cat2_id
        }`
      )
        .then((response) => {
          if (!response.ok) {
            toast.error("Có lỗi khi lấy tên danh mục");
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Update breadcrumb
          setBreadcrumbs([
            { label: "Trang chủ", path: "/" },
            { label: "Danh mục", path: "/categories" },
            {
              label: data.data.cat1_name,
              path: `/categories/${slugify(data.data.cat1_name)}-${
                data.data.cat1_id
              }`,
            },
            {
              label: data.data.cat2_name,
              path: `/products?cat2_id=${data.data.cat2_id}`,
            },
            {
              label: products?.product_name || "Chi tiết sản phẩm",
              path: null,
            },
          ]);
        })
        .catch((error) => {
          toast.error(error.message || "Lỗi kết nối máy chủ");
        });
    }
    if (products) {
      fetchBreadCrumbs();
    }
  }, [products]);
  useEffect(() => {
    // Check if auth user is seller of this product
    if (auth && products) {
      setIsSeller(auth.user_id === products.seller_id);
    }
  }, [auth, products]);

  useEffect(() => {
    if (!socket) return;
    socket.on("new_bid", (data: any) => {
      console.log("Received new bid data via socket: ", data.data);
      // Update product data with new bid info
      setProduct(data.data);
    });
    return () => {
      if (socket) {
        socket.off("new_bid");
      }
    };
  }, [socket]);

  // Update time every second
  useEffect(() => {
    if (products) {
      formatStartTime(
        DateTime.fromISO(products.start_time).setZone("Asia/Ho_Chi_Minh")
      );
      const interval = setInterval(() => {
        const end = DateTime.fromISO(products.end_time).setZone(
          "Asia/Ho_Chi_Minh"
        );
        formatEndTime(end);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [products]);

  // Start time take day, month, year

  const formatStartTime = (start_time: DateTime) => {
    if (start_time) {
      setFormatStartTime(start_time.toFormat("dd-MM-yyyy HH:mm"));
    }
  };
  const formatEndTime = (end_time: DateTime) => {
    if (!end_time) return;

    // Lấy thời điểm hiện tại đúng timezone
    const present_time = DateTime.now().setZone("Asia/Ho_Chi_Minh");

    // Parse endDate nếu chưa parse

    const diff = end_time
      .diff(present_time, ["days", "hours", "minutes", "seconds"])
      .toObject();

    // diff luôn có keys nhưng values có thể NaN → gán mặc định 0
    const days = diff.days ?? 0;
    const hours = diff.hours ?? 0;
    const minutes = diff.minutes ?? 0;
    const seconds = diff.seconds ?? 0;
    let result;
    if (days >= 1) {
      result = `Còn ${Math.floor(days)} ngày ${Math.floor(hours)} giờ`;
      setIsExpired(false);
    } else if (hours >= 1) {
      result = `Còn ${Math.floor(hours)} giờ ${Math.floor(minutes)} phút`;
      setIsExpired(false);
    } else if (minutes >= 0 && seconds >= 0) {
      result = `Còn ${Math.floor(minutes)} phút ${Math.floor(seconds)} giây`;
      setIsExpired(false);
    } else {
      result = "Đã hết hạn";
      setIsExpired(true);
    }
    setTimeLeft(result);
  };

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const openImageModal = (index: number) => {
    setModalImageIndex(index);
    setImageModalOpen(true);
  };

  // Function to mask buyer name (hide half with ***)
  const maskName = (name: string) => {
    const len = name.length;
    const thirdLen = Math.floor(len / 2);
    return name.substring(0, len - thirdLen) + "*****";
  };

  return isLoading ? (
    <Loading></Loading>
  ) : (
    <div className=" mx-auto px-4 py-8">
      {/* Product Name */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {products?.product_name}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)] gap-8">
        {/* Main Image and Related Images */}
        <ProductImageGallery
          product_id={products?.product_id}
          product_name={products?.product_name}
          product_images={products?.product_images}
          onOpenImageModal={openImageModal}
        />

        {/* Product Details - Right Column */}
        <div className="space-y-4">
          {/* Pricing Section */}
          <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Giá đấu giá
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Giá hiện tại:
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  {products?.current_price.toLocaleString()} VNĐ
                </span>
              </div>
              {products?.buy_now_price && (
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-600">
                    Giá mua ngay:
                  </span>
                  <span className="text-lg font-bold text-rose-600">
                    {products.buy_now_price.toLocaleString()} VNĐ
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Auction Timing */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-600" />
              <h4 className="text-lg font-semibold text-gray-900">
                Thời gian đấu giá
              </h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Bắt đầu</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formattedStartTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <Clock className="w-5 h-5 text-red-600" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Còn lại</p>
                  <p className="text-lg font-bold text-red-600">{timeLeft}</p>
                </div>
              </div>
              {products?.auto_extended && (
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-1.5 flex-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <p className="text-xs font-medium text-blue-700">
                      Tự động gia hạn
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-indigo-600" />
              <h4 className="text-lg font-semibold text-gray-900">Người bán</h4>
            </div>
            <Link
              to={`/profile/${products?.seller_username}_${products?.seller_id}`}
              className="flex items-center gap-3"
            >
              <div className="relative">
                {products?.seller_avatar ? (
                  <img
                    src={products.seller_avatar}
                    alt={products.seller_username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {products?.seller_username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <h5 className="text-base font-semibold text-gray-900 mb-1">
                  {products?.seller_username}
                </h5>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(products?.seller_rating || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">
                    {products?.seller_rating?.toFixed(1)}
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Highest Bidder Info */}
          {products?.price_owner_username && (
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-amber-600" />
                <h4 className="text-lg font-semibold text-gray-900">
                  Người dẫn đầu
                </h4>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  {isSeller ? (
                    <Link
                      to={`/profile/${products.price_owner_username}_${products.price_owner_id}`}
                    >
                      {products?.price_owner_avatar ? (
                        <img
                          src={products.price_owner_avatar}
                          alt={products.price_owner_username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {products.price_owner_username
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        </div>
                      )}
                    </Link>
                  ) : (
                    <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {products.price_owner_username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Award className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h5 className="text-base font-semibold text-gray-900 mb-1">
                    {maskName(products.price_owner_username)}
                  </h5>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(products?.price_owner_rating || 0)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">
                      {products?.price_owner_rating?.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
              {products.price_owner_id === auth?.user_id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      navigator(
                        `/winner-order?product_id=${products.product_id}`
                      );
                    }}
                    className="cursor-pointer w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Xác nhận đơn hàng
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bid Section - Full Width */}
      {!isExpired && (
        <div className="mt-8 bg-white border border-gray-200 rounded-lg shadow-sm">
          <PlayBidSection
            product_id={products?.product_id}
            current_price={products?.current_price}
            step_price={products?.step_price}
            buy_now_price={products?.buy_now_price}
          />
          {products?.buy_now_price && (
            <BuyNowSection
              product_id={products?.product_id}
              buy_now_price={products?.buy_now_price}
              product_name={products?.product_name}
            />
          )}
        </div>
      )}

      {/* Tab Section */}
      <TabSection products={products} isSeller={isSeller} />

      {/* Related Products */}
      <RelatedProductsSection
        category_id={products?.cat2_id}
        product_id={products?.product_id}
      />

      {/* Image Preview Modal */}
      {imageModalOpen && products?.product_images && (
        <PreviewImage
          images={products.product_images}
          name={products.product_name}
          modalImageIndex={modalImageIndex}
          setModalImageIndex={setModalImageIndex}
          setImageModalOpen={setImageModalOpen}
        />
      )}
    </div>
  );
}

function TabSection({
  products,
  isSeller,
}: {
  products?: ProductType;
  isSeller?: boolean;
}) {
  const authUser = useAuth();
  const [activeTab, setActiveTab] = useState<
    "description" | "bidHistory" | "qa"
  >("description");

  return (
    <>
      {/* Tabs Section */}
      <div className="mt-8">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
              activeTab === "description"
                ? "border-b-2 b order-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Mô tả sản phẩm
          </button>
          {
            <button
              onClick={() => setActiveTab("bidHistory")}
              className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
                activeTab === "bidHistory"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Lịch sử đấu giá
            </button>
          }
          <button
            onClick={() => setActiveTab("qa")}
            className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
              activeTab === "qa"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Hỏi đáp
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-fit pb-20">
          {activeTab === "description" && products?.description && (
            <ProductDescriptionSection
              description={products.description}
              isSeller={isSeller}
            />
          )}
          {activeTab === "bidHistory" && authUser && (
            <div className="bg-white py-2 px-2 rounded-lg">
              <BidHistorySection product={products} isSeller={isSeller} />
            </div>
          )}
          {activeTab === "qa" && (
            <div className="bg-white py-2 px-2 rounded-lg">
              <QASection
                seller_id={products?.seller_id}
                product_id={products?.product_id}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default DetailProductPage;
