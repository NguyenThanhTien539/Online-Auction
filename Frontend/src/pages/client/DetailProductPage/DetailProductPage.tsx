import React, { useState , useEffect} from 'react';
import { formatPrice, parsePrice } from '@/utils/format_price';
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "sonner"
import {DateTime} from "luxon";
import {useAuth} from "@/routes/ProtectedRouter";
import PlayBidSection from './components/PlayBidSection';
import BidHistorySection from './components/BidHistorySection';
import QASection from './components/QASection';

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
      console.log("Time hiện tại: ",present_time.toFormat("dd-MM-yyyy HH-mm-ss"))
      // Parse endDate nếu chưa parse

      console.log("Time kết thúc: ",(end_time).toFormat("dd-MM-yyyy HH-mm-ss"))
 
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

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };



  return (
    <div className=" mx-auto px-4 py-8">
      {/* Product Name */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{products?.product_name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_0.6fr] gap-3">
        {/* Main Image and Related Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="flex justify-center">
            <img
              src={products?.product_images[currentImageIndex]}
              alt={products?.product_name}
              className="w-full h-[380px] object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Related Images - Horizontal Scroll */}
          <div className="max-w-[50%] mx-auto">
            <div className="flex overflow-x-auto space-x-2 pb-4 pt-2">
              {products?.product_images?.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Image ${index + 1}`}
                  className={`w-24 h-16 object-cover rounded-lg shadow-md flex-shrink-0 cursor-pointer ${
                    index === currentImageIndex ? 'ring-2 ring-blue-500' : ''
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
            <p className={`text-gray-600 ${isExpanded ? '' : 'line-clamp-3'}`}>{products?.description}</p>
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
                <span className="text-2xl font-bold text-green-600">{formatPrice(Number(products?.current_price.toFixed(2)))} VND</span>
              </div>
              {products?.buy_now_price && (
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">Giá mua ngay:</span>
                  <span className="text-xl font-semibold text-blue-600">{formatPrice(Number(products?.buy_now_price?.toFixed(2)))} VND</span>
                </div>
              )}
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm shadow-black/30">
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Thông tin người bán</h4>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex it`ems-center justify-center">
                <span className="text-gray-600 font-bold">{products?.seller_username?.charAt(0)}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{products?.seller_username}</p>
                <p className="text-sm text-gray-600">Điểm đánh giá: 
                  <span className="ml-2 font-semibold text-yellow-500">{products?.seller_rating}/10
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
                    {products?.price_owner_rating}/10
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
      
    </div>
  );
}





export default DetailProductPage;