import React, { useState , useEffect} from 'react';
// import { formatPrice, parsePrice } from '@/utils/format_price';
import { NumericFormat } from 'react-number-format';
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "sonner"
import {DateTime} from "luxon";
import {useAuth} from "@/routes/ProtectedRouter";
import PlayBidSection from './components/PlayBidSection';
import BidHistorySection from './components/BidHistorySection';
import QASection from './components/QASection';
import { Eye, Clock, Calendar, User, Star, Award, FileText } from 'lucide-react';
import PreviewImage from './components/PreviewProductModal';
import Loading from '@/components/common/Loading';
type ProductType = {
  product_id : number,
  product_name : string,
  product_images : string[],

  seller_id: number,
  seller_username: string,
  seller_rating: number,

  current_price: number,
  step_price: number,
  buy_now_price?: number,

  price_owner_id?: number,
  price_owner_username?: string,
  price_owner_rating?: number,

  start_time: string,
  end_time:  string,
  description: string,
}
function DetailProductPage() {

  // Auth user useContext
  const authUser = useAuth();

  // Sample product data - in a real app, this would come from props or API
  const [products, setProduct] = useState<ProductType | null>(null);
  const {slugid} = useParams();
  let product_id : number;
  let product_slug : string;
  if (slugid){
    const parts = slugid.split("-");
    product_id = Number(parts.pop());
    product_slug = parts.join("-");
  }

  // Custome time

  const [formattedStartTime, setFormatStartTime] =useState("");
  const [timeLeft, setTimeLeft] = useState("");

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch product data from API
    async function fetchProduct() {
      try{
        // param is slug-id
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/detail?product_id=${product_id}&product_slug=${product_slug}`);
        const data = await response.json();
        if (!response.ok){
          toast.error("Lỗi khi tải sản phẩm");
          // navigate("/"); // Redirect to home on error
        }
        else{
          setProduct(data.data);
        }
        
      } catch (e){
        toast.error("Lỗi kết nối đến server");
        console.log(e);
      }
      setLoading (false);
    }
    fetchProduct();
  },[]);

  // Update time every second
  useEffect (() => {
    if (products){
      formatStartTime(DateTime.fromISO(products.start_time).setZone("Asia/Ho_Chi_Minh"));
      const interval = setInterval(() => {
        const end = DateTime.fromISO(products.end_time).setZone("Asia/Ho_Chi_Minh");
        formatEndTime(end);
      }, 1000);
      return () => clearInterval(interval);
    }
  })
  
  
  // Start time take day, month, year
  


  
  const formatStartTime =(start_time : DateTime) =>{
      if (start_time)
      {
          setFormatStartTime((start_time).toFormat("dd-MM-yyyy HH:mm"));
      }
  }
  const formatEndTime = (end_time : DateTime) => {
      if (!end_time) return;

      // Lấy thời điểm hiện tại đúng timezone
      const present_time = DateTime.now().setZone("Asia/Ho_Chi_Minh");

      // Parse endDate nếu chưa parse


 
      const diff = (end_time).diff(present_time, ["days", "hours", "minutes", "seconds"]).toObject();

      // diff luôn có keys nhưng values có thể NaN → gán mặc định 0
      const days = diff.days ?? 0;
      const hours = diff.hours ?? 0;
      const minutes = diff.minutes ?? 0;
      const seconds = diff.seconds ?? 0;
      let result;
      if (days >= 1) {
          result = `Còn ${Math.floor(days)} ngày ${Math.floor(hours)} giờ`;
      } else if (hours >= 1) {
          result = `Còn ${Math.floor(hours)} giờ ${Math.floor(minutes)} phút`;
      } else if (minutes >= 0) {
          result = `Còn ${Math.floor(minutes)} phút ${Math.floor(seconds)} giây`;
      } else {
          result = "Đã hết hạn";
      }
      setTimeLeft(result);
  };

  


  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const openImageModal = (index: number) => {
    setModalImageIndex(index);
    setImageModalOpen(true);
  };

  



  return (
    isLoading ? <Loading></Loading> :<div className=" mx-auto px-4 py-8">
      {/* Product Name */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{products?.product_name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_0.6fr] gap-3">
        {/* Main Image and Related Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="flex justify-center relative">
            <img
              src={products?.product_images[currentImageIndex]}
              alt={products?.product_name}
              className="w-full h-[500px] object-cover rounded-lg shadow-lg cursor-pointer"
              onClick={() => openImageModal(currentImageIndex)}
            />
            <div 
              className="absolute top-3 right-3 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 backdrop-blur-sm"
              onClick={() => openImageModal(currentImageIndex)}
              title="Xem chi tiết hình ảnh"
            >
              <Eye className="w-5 h-5 text-white"/>
            </div>
          </div>

          {/* Related Images - Horizontal Scroll */}
          <div className="max-w-[50%] mx-auto">
            <div className="flex overflow-x-auto space-x-2 pb-4 pt-2">
              {products?.product_images?.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Image ${index + 1}`}
                  className={`w-24 h-16 object-cover rounded-lg shadow-md cursor-pointer transition-all duration-200 hover:scale-105 flex-shrink-0 ${
                    index === currentImageIndex ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-300'
                  }`}
                  onClick={() => handleImageClick(index)}
                />
              ))}
            </div>
          </div>
          {/* Auction Timing */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">
                  Thời gian đấu giá
                </h4>
                <p className="text-sm text-gray-600">Theo dõi tiến trình phiên đấu giá</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Start Time */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-1">Thời điểm đăng sản phẩm</p>
                  <p className="text-base font-semibold text-gray-800">{formattedStartTime}</p>
                </div>
              </div>

              {/* End Time */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Clock className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-1">Thời gian còn lại</p>
                  <p className="text-base font-bold text-red-600">{timeLeft}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">
                  Mô tả sản phẩm
                </h4>
                <p className="text-sm text-gray-600">Thông tin chi tiết về sản phẩm</p>
              </div>
            </div>

            {/* Content */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div
                className={`text-gray-700 leading-relaxed ${isExpanded ? '' : 'line-clamp-4'}`}
                dangerouslySetInnerHTML={{ __html: products?.description || '' }}
              />
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-3 px-3 py-2 cursor-pointer"
              >
                {isExpanded ? 'Thu gọn ▲' : 'Xem thêm ▼'}
              </button>
            </div>
          </div>
        </div>




        {/* Product Details */}
        <div className="space-y-3 min-w-0">
          {/* Pricing Section */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Chi tiết giá:</h3>
            <div className="space-y-0">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-700">Giá hiện tại:</span>  
                <span className="text-2xl font-bold text-green-600">
                  
                  <NumericFormat 
                      value={products?.current_price ?? 0}
                      displayType={'text'}
                      thousandSeparator={true}
                      suffix={' đồng'}
                  ></NumericFormat>
                </span>
              </div>
              {products?.buy_now_price && (
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">Giá mua ngay:</span>
                  <span className="text-xl font-semibold text-blue-600">
                    <NumericFormat 
                        value={products?.buy_now_price ?? 0}
                        displayType={'text'}
                        thousandSeparator={true}
                        suffix={' đồng'}
                    ></NumericFormat>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-md">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-indigo-500 rounded-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">
                  Người bán
                </h4>
                <p className="text-sm text-gray-600">Thông tin người bán sản phẩm</p>
              </div>
            </div>

            {/* Seller Details */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="relative">
                <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{products?.seller_username?.charAt(0).toUpperCase()}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <h5 className="text-base font-bold text-gray-900 mb-1">{products?.seller_username}</h5>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(products?.seller_rating || 0)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {products?.seller_rating?.toFixed(1)}/5.0
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Highest Bidder Info */}
          { (
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-md">
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-500 rounded-lg">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800">
                    Người thắng cuộc
                  </h4>
                  <p className="text-sm text-gray-600">Người đặt giá cao nhất hiện tại</p>
                </div>
              </div>

              {/* Bidder Details */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="relative">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{products?.price_owner_username?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Award className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h5 className="text-base font-bold text-gray-900 mb-1">{products?.price_owner_username}</h5>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(products?.price_owner_rating || 0)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {products?.price_owner_rating?.toFixed(1)}/5.0
                    </span>
                  </div>
                  <p className="text-xs text-amber-600 font-medium mt-1">🏆 Đang dẫn đầu đấu giá</p>
                </div>
              </div>
            </div>
          )}

          {/* Bid Section */}
          <div className="bg-white border border-gray-200 py-6 px-1 rounded-lg shadow-sm">
            <PlayBidSection product_id = {products?.product_id} current_price = {products?.current_price} step_price = {products?.step_price}></PlayBidSection>
          </div>
          {/* Bid History */}
        
          {authUser && <div className="bg-white border border-gray-200 py-6 px-1 rounded-lg shadow-sm">
            
            <BidHistorySection product_id = {products?.product_id}></BidHistorySection>
          </div>}

        </div>
      </div>


      {/* Q&A Section */}
      <QASection product_id = {products?.product_id}></QASection>

      {/* Image Preview Modal */}
      {imageModalOpen && products?.product_images && (
        <PreviewImage
          images = {products.product_images}
          name={products.product_name}
          modalImageIndex={modalImageIndex}
          setModalImageIndex={setModalImageIndex}
          setImageModalOpen={setImageModalOpen}
        />
      )}
      
    </div>
  );
}





export default DetailProductPage;