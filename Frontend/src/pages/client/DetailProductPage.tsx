import React, { useState , useEffect, useRef} from 'react';
import HorizontalBar from '@/components/common/HorizontalBar';
import { formatPrice, parsePrice } from '@/utils/format_price';
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "sonner"
import {DateTime} from "luxon";
import {useAuth} from "@/routes/ProtectedRouter";

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
  // Navigate
  const navigate = useNavigate();
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
  let startDate = useRef<DateTime>(null); 
  let endDate = useRef<DateTime>(null);
  const [formattedStartTime, setFormatStartTime] =useState("");
  const [timeLeft, setTimeLeft] = useState("");


  useEffect(() => {
    // Fetch product data from API
    async function fetchProduct() {
      try{
        // param is slug-id
        let response = await fetch(`http://localhost:5000/api/products/detail?product_id=${product_id}&product_slug=${product_slug}`);
        let data = await response.json();
        if (!response.ok){
          toast.error("Lỗi khi tải sản phẩm");
          // navigate("/"); // Redirect to home on error
        }
        else{
          setProduct(data.data);
          // Set custom time
          if (products){
            (startDate as any).current = DateTime.fromISO(products.start_time, { zone: "Asia/Ho_Chi_Minh" });
            (endDate as any).current = DateTime.fromISO(products.end_time, { zone: "Asia/Ho_Chi_Minh" });
          }
          
        }
        
      } catch (e){
        toast.error("Lỗi kết nối đến server");
      }
    }
    fetchProduct();
  },[]);

  
  
  // Start time take day, month, year
  

  console.log("startDate: ",startDate.current);
  
  const formatStartTime =() =>{
      if (startDate.current)
      {
          setFormatStartTime((startDate.current as any).toFormat("dd-MM-yyyy HH:mm"));
      }
  }
  const formatEndTime = () => {
      if (!endDate.current) return;

      // Lấy thời điểm hiện tại đúng timezone
      const present_time = DateTime.now().setZone("Asia/Ho_Chi_Minh");
      console.log("Time hiện tại: ",present_time.toFormat("dd-MM-yyyy HH-mm-ss"))
      // Parse endDate nếu chưa parse

      console.log("Time kết thúc: ",(endDate.current as any).toFormat("dd-MM-yyyy HH-mm-ss"))
      // // Kiểm tra valid trước khi diff
      // if (!endDate.isValid) {
      //     console.error("endDate invalid:", endDate.invalidReason);
      //     setTimeLeft("");
      //     return;
      // }

      const diff = (endDate.current as any).diff(present_time, ["days", "hours", "minutes", "seconds"]).toObject();

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

  useEffect(()=>{
      const timer = setInterval(()=>{
          formatEndTime();
      }, 1000);
      formatStartTime();
      return ()=> clearInterval(timer);
  })



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
            <PlayBidSection></PlayBidSection>
          </div>
          {/* Bid History */}
          {authUser && <div className="bg-white border border-gray-200 py-6 px-1 rounded-lg shadow-sm">
            
            <BidHistorySection></BidHistorySection>
          </div>}

        </div>
      </div>


      {/* Q&A Section */}
      <QASection></QASection>
      
    </div>
  );
}

function QASection(){
 
  const product = {
    qa: [
      {
        id: 1,
        question: "Sản phẩm có còn mới không?",
        answer: "Vâng, sản phẩm còn mới 100%, chưa sử dụng.",
        asker: "Nguyễn Văn A",}
    ],
  };
  return(
    <div className="p-5 rounded-lg bg-blue-50 w-[90%] mt-6">
      <h4 className="text-xl font-semibold text-gray-800 mb-4">Hỏi đáp</h4>
      {product.qa.length > 0 ? (
        <div className="space-y-4">
          {product.qa.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="mb-2">
                <span className="font-medium text-gray-900">{item.asker}:</span>
                <span className="ml-2 text-gray-700">{item.question}</span>
              </div>
              <div className="ml-4 pl-4 border-l-2 border-blue-200">
                <span className="font-medium text-blue-600">Người bán:</span>
                <span className="ml-2 text-gray-700">{item.answer}</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Chưa có câu hỏi nào.</p>
      )}
      {/* Optional: Add a form to ask new questions */}
      <div className="mt-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Đặt câu hỏi
        </button>
      </div>
    </div>
  )
  
}

function PlayBidSection({product_id} : {product_id?: number}){

  
  const [bidPrice, setBidPrice] = useState(0);

  const handleInputPriceChange = (e : any) =>{
      let raw = e.target.value;
      raw = raw.replace(/[^\d]/g, ''); // Remove non-numeric characters
      setBidPrice(raw || 0);
  }

  const handleSubmitBid = (e : any)=>{
    // Submit bid logic here
    e.preventDefault();
    console.log("Bid submitted: ", bidPrice);

    async function submitBid(){
      // Call API to submit bid
      try{
        const response = await fetch ("http://localhost:5000/api/bid/play", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "creadentials": "include",
          }
          ,
          body: JSON.stringify({
            product_id: product_id,
            max_price: bidPrice,
          })
        })

        const data = await response.json();

        if (response.status == 403){
          // Not logged in
          toast.error("Vui lòng đăng nhập để đặt giá!");
          return;
        }

        if (data.message === "Success"){
          // Bid successful
          toast.success("Đặt giá thành công!");
        } else {
          // Bid failed
          toast.error(`Đặt giá thất bại: ${data.message}`);
        }
      }catch(e){
        toast.error("Lỗi kết nối đến server!");
      }
      
    }
    submitBid();

  }

  return(
    <div>
      {/* Bid Input */}
      <div className = "mx-4">
        <h4 className="text-xl font-semibold text-blue-500">Đặt giá (đơn vị: VNĐ)</h4>
        <form className = "flex flex-col items-end" onSubmit = {handleSubmitBid}>
          <input type = "text" placeholder = "Nhập giá" name = "price" value = {formatPrice(bidPrice)} onChange = {(e)=>{handleInputPriceChange(e)}} className = "border-1 w-full rounded-xl p-2 my-3"></input>
          <button type = "submit" className = "border-1 py-2 px-5 flex w-fit text-white bg-gray-600 \
          hover:bg-blue-400 active:bg-green-500 transition-colors duration-300">
            Đặt
          </button>
        </form>
      </div>
      {/* Bid History */}
      <div></div>
    </div>
  );
}

function BidHistorySection({product_id} : {product_id?: number}){

  const [testbidHistory, setBidHistory] = useState<any[]>([]);
  useEffect(()=>{
    async function fetchBidHistory(){
      // Fetch bid history from API
      try{
        let response = await fetch(`http://localhost:5000/api/bid/history?product_id=${product_id}`);
        let data = await response.json();
        if (!response.ok){
          toast.error("Lỗi khi tải lịch sử đấu giá");
        }
        else{
          // Process bid history data
        }
      } catch (e){
        toast.error("Lỗi kết nối đến server");
      }
    }
    fetchBidHistory();
  }, []);
  
  // Sample bid history data
  const bidHistory = [
    {
      id: 1,
      time: new Date('2023-11-12T15:00:00Z'),
      buyer: "Nguyễn Văn A",
      price: 120.00,
    },
    {
      id: 2,
      time: new Date('2023-11-12T16:30:00Z'),
      buyer: "Trần Thị B",
      price: 135.00,
    },
    {
      id: 3,
      time: new Date('2023-11-13T09:15:00Z'),
      buyer: "Lê Văn C ",
      price: 15000000000,
    },
  ];

  // Function to mask buyer name (hide half with ***)
  const maskName = (name: string) => {
    const parts = name.split(' ');
    if (parts.length < 2) return name.replace(/./g, '*');
    const lastName = parts[0];
    const firstName = parts.slice(1).join(' ');
    const halfLength = Math.ceil(firstName.length / 2);
    const visiblePart = firstName.substring(0, halfLength);
    const maskedPart = '*'.repeat(firstName.length - halfLength);
    return `${lastName} ${visiblePart}${maskedPart}`;
  };

  return(
    <div>
      <h4 className="ml-4 font-bold text-red-500 text-lg mb-4">Lịch sử đấu giá</h4>
      {bidHistory.length > 0 ? (
        <div className="overflow-x-auto w-full overflow-y-auto max-h-[200px]">
          <table className="min-w-full bg-white rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người mua</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bidHistory.map((bid) => (
                <tr key={bid.id}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    {bid.time.toLocaleDateString('vi-VN')} {bid.time.toLocaleTimeString('vi-VN')}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    {maskName(bid.buyer)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-green-600">
                    ${bid.price.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 ml-4">Chưa có lượt đấu giá nào.</p>
      )}
    </div>
  );
}

export default DetailProductPage;