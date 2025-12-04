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
import { Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';

type ProductType = {
  product_id : number,
  product_name : string,
  product_images : string[],

  seller_id: number,
  seller_username: string,
  seller_rating: number,

  current_price: number,
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


  useEffect(() => {
    // Fetch product data from API
    async function fetchProduct() {
      try{
        // param is slug-id
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

  const nextImage = () => {
    if (products?.product_images) {
      setModalImageIndex((prev) => (prev + 1) % products.product_images.length);
    }
  };

  const prevImage = () => {
    if (products?.product_images) {
      setModalImageIndex((prev) => (prev - 1 + products.product_images.length) % products.product_images.length);
    }
  };



  return (
    <div className=" mx-auto px-4 py-8">
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
          <div className="p-6 rounded-lg w-full  shadow-[-5px_-5px_5px] shadow-gray-500/80 my-3 bg-linear-to-r from-gray-100 to-white">
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Thời gian đấu giá</h4>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium text-green-500 mr-2">Thời điểm đăng:</span> 
                {formattedStartTime}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-red-500 mr-2">Thời điểm kết thúc:</span> 
                {timeLeft}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className= "p-0 rounded-lg w-full my-6">
            <div className = "h-[1px] w-[70%] bg-black rounded-3xl mb-5"></div>
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Mô tả sản phẩm</h4>
            {/* <p className={`text-gray-600 ${isExpanded ? '' : 'line-clamp-3'}`}>{products?.description}</p> */}
            <p
              className={`text-gray-600 ${isExpanded ? '' : 'line-clamp-3'}`}
              dangerouslySetInnerHTML={{ __html: products?.description || '' }}
            />
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              {isExpanded ? 'Thu gọn' : 'Xem thêm'}
            </button>
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
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm shadow-black/30">
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Thông tin người bán</h4>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-bold">{products?.seller_username?.charAt(0)}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{products?.seller_username}</p>
                <p className="text-sm text-gray-600">Điểm đánh giá: 
                  <span className="ml-2 font-semibold text-yellow-500">{products?.seller_rating}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Highest Bidder Info */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm shadow-black/30">
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Người đặt giá cao nhất</h4>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-bold">{products?.price_owner_username?.charAt(0)}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{products?.price_owner_username}</p>
                <p className="text-sm text-gray-600">Điểm đánh giá: 
                  <span className="ml-2 font-semibold text-yellow-500">
                    {products?.price_owner_rating}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Bid Section */}
          <div className="bg-white border border-gray-200 py-6 px-1 rounded-lg shadow-sm">
            <PlayBidSection product_id = {products?.product_id}></PlayBidSection>
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
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-2 bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={() => setImageModalOpen(false)}>
          <div className="relative w-[95vw] max-w-7xl max-h-[95vh] bg-white rounded-xl shadow-2xl overflow-hidden animate-scaleIn" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-500 to-white text-white">
              <h3 className="text-lg font-semibold flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                {products?.product_name} ({modalImageIndex + 1}/{products?.product_images.length})
              </h3>
              <button
                onClick={() => setImageModalOpen(false)}
                className="p-2 hover:bg-red-400 rounded-full transition-all duration-200"
                title="Đóng"
              >
                <X className="w-5 h-5 bg-red-500 cursor-pointer" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="relative bg-gray-300">
              <div className="relative p-6">
                <img
                  src={products?.product_images[modalImageIndex]}
                  alt={`${products?.product_name} - Image ${modalImageIndex + 1}`}
                  className="max-w-full max-h-[70vh] object-contain mx-auto rounded-lg shadow-lg"
                />
                
                {/* Navigation Arrows */}
                {products?.product_images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 backdrop-blur-sm"
                      title="Hình trước"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 backdrop-blur-sm"
                      title="Hình tiếp theo"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnail Navigation */}
              {products?.product_images.length > 1 && (
                <div className="p-4 bg-gray-100">
                  <div className="flex justify-center space-x-2 overflow-x-auto">
                    {products.product_images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className={`w-16 h-12 object-cover rounded cursor-pointer transition-all duration-200 flex-shrink-0 ${
                          index === modalImageIndex 
                            ? 'ring-2 ring-pink-500 ring-offset-2' 
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        onClick={() => setModalImageIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}





export default DetailProductPage;