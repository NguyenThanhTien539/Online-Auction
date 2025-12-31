import LoveIcon from "@/assets/icons/love.svg";
import {cn} from "@/lib/utils"
import {DateTime} from "luxon";
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {slugify} from "@/utils/make_slug";
import AddToLove from "@/components/common/AddToLove";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
type Products = {
    product_id ?: number,
    product_image ?: string,
    product_name ?: string,
    current_price ?: number,
    buy_now_price ?: number,
    start_time ?: any,
    end_time ?: any,
    price_owner_username? : string,
    bid_turns?: string
}

function ProductCard({product_image, product_id, product_name, current_price, buy_now_price, start_time, end_time, price_owner_username, bid_turns, ...data} : Products & {className? : string}
    &{onClick?: () => void}
) {
    const navigate = useNavigate();
    let [formattedStartTime, setFormatStartTime] =useState("");
    let [timeLeft, setTimeLeft] = useState("");
    
    // Start time take day, month, year
    const startDate = DateTime.fromISO(start_time, { zone: "Asia/Ho_Chi_Minh" });
    const endDate = DateTime.fromISO(end_time, { zone: "Asia/Ho_Chi_Minh" });
    console.log("Product Name in ProductCard:", product_name);
    const handleClickProduct = (productId? : number, productName? : string) => {
            const slug = slugify(productName?? "");
            navigate(`/product/${slug}-${productId}`);
        }
    


  
    
    const formatStartTime =() =>{
        if (start_time)
        {
            setFormatStartTime(startDate.toFormat("dd-MM-yyyy HH:mm"));
        }
    }
    const formatEndTime = () => {
        if (!end_time) return;

        // Lấy thời điểm hiện tại đúng timezone
        const present_time = DateTime.now().setZone("Asia/Ho_Chi_Minh");
        // console.log("Time hiện tại: ",present_time.toFormat("dd-MM-yyyy HH-mm-ss"))
        // Parse endDate nếu chưa parse
        const endDateValid = DateTime.isDateTime(endDate) ? endDate : DateTime.fromISO(end_time, { zone: "Asia/Ho_Chi_Minh" });
        // console.log("Time kết thúc: ",endDateValid.toFormat("dd-MM-yyyy HH-mm-ss"))
        // Kiểm tra valid trước khi diff
        if (!endDateValid.isValid) {
            console.error("endDate invalid:", endDateValid.invalidReason);
            timeLeft = "";
            return;
        }

        const diff = endDateValid.diff(present_time, ["days", "hours", "minutes", "seconds"]).toObject();

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

    
    // Function to mask buyer name (hide half with ***)
    const maskName = (name: string) => {
        const len = name.length;
        const thirdLen = Math.floor(len / 3);
        return name.substring(0, len - thirdLen) + '***';
    };

    const { ref, hasIntersected } = useIntersectionObserver();
    return (
        // Container
        <div ref = {ref} className = {cn("w-80 h-110 relative flex flex-col items-center border border-gray-300 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-purple-200/30 \
        hover:scale-[103%] hover:-translate-y-1 transition-all duration-300 bg-white hover:cursor-pointer overflow-hidden group shrink-0",   
             hasIntersected ? "animate__animated animate__fadeInUp" : "opacity-0",
         data.className)}
            onClick = {data.onClick ?? (() => {handleClickProduct(product_id?? 0, product_name?? "")})}
            >
            
            {/* Image */}
            
            <div className = "flex w-full h-[50%] shrink-0 overflow-hidden rounded-t-xl justify-center relative">
                <img src = {product_image} loading = "lazy" className = "flex object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"></img>
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
                <AddToLove product_id={product_id ?? 1}/>
            </div>

            {/* Name Product */}
            <div className = "text-xl font-semibold mx-2  flex h-[15%] pt-2 grow-0 self-start limit-to-2-lines">
                {product_name ?? "Ronaldo"}
            </div>
            <div className = "block h-px mt-1 w-[90%] bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            {/* Product Details */}
            <div className = "flex-1 mx-2 w-full p-2 pt-1 grid grid-cols-2 gap-2 ">

  
                <div className = "text-[85%]">
                    <div className = "font-semibold text-gray-500">
                        Giá:
                    </div>
                    {current_price?.toLocaleString() ?? "0"} đồng
                </div>
                <div className = "text-[85%]">
                    <div className = "font-semibold text-gray-500">
                        Giá mua ngay:
                    </div>
                    {buy_now_price?.toLocaleString() ?? "0"} đồng
                </div>
                <div className = "text-[85%]">
                    <div className = "font-semibold text-gray-500">
                        Thời điểm đăng:
                    </div>
                    {formattedStartTime}
                </div>
                <div className = "text-[85%]">
                    <div className = "font-semibold text-gray-500">
                        Thời gian kết thúc:
                    </div>
                    {timeLeft}
                </div>
                <div className = "text-[85%]">
                    <div className = "font-semibold text-gray-500">
                        Người giữ giá:
                    </div>
                    {price_owner_username ? maskName(price_owner_username) : "..."}
                </div>
                <div className = "text-[85%]">
                    <div className = "font-semibold text-gray-500">
                        Số lượt đấu giá:
                    </div>
                    {bid_turns}
                </div>

            </div>

                    
        </div>
    );
}
export default ProductCard; 