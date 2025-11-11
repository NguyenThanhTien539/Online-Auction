import Cristiano from "@/assets/images/Cristiano.jpg";
import LoveIcon from "@/assets/icons/love.svg";
import {cn} from "@/lib/utils"
import {DateTime} from "luxon";
import {useState, useEffect} from "react";

type Products = {
    product_image ?: string,
    product_name ?: string,
    current_price ?: string,
    buy_now_price ?: string,
    start_time ?: any,
    end_time ?: any,
    price_owner_username? : string,
    bid_turns?: string
}

function ProductCard({product_image, product_name, current_price, buy_now_price, start_time, end_time, price_owner_username, bid_turns, ...data} : Products & {className? : string}
    &{onClick?: () => void}
) {
    
    let [formattedStartTime, setFormatStartTime] =useState("");
    let [timeLeft, setTimeLeft] = useState("");
    
    // Start time take day, month, year
    const startDate = DateTime.fromISO(start_time, { zone: "Asia/Ho_Chi_Minh" });
    const endDate = DateTime.fromISO(end_time, { zone: "Asia/Ho_Chi_Minh" });

    console.log(startDate);
    
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
        console.log("Time hiện tại: ",present_time.toFormat("dd-MM-yyyy HH-mm-ss"))
        // Parse endDate nếu chưa parse
        const endDateValid = DateTime.isDateTime(endDate) ? endDate : DateTime.fromISO(end_time, { zone: "Asia/Ho_Chi_Minh" });
        console.log("Time kết thúc: ",endDateValid.toFormat("dd-MM-yyyy HH-mm-ss"))
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

    

    return (
        // Container
        <div className = {cn("w-80 h-110 relative flex flex-col items-center  border border-gray-300 rounded-lg shadow-lg\
        hover:scale-[103%] transition-all duration-300 bg-white hover:cursor-pointer hover:shadow-2xl hover:shadow-gray-400 shrink-0", data.className)}
            onClick = {data.onClick}>
            {/* Image */}
            <div className = "flex w-full h-[50%] shrink-0 overflow-hidden rounded-lg justify-center">
                <img src = {product_image} className = "flex object-cover w-full h-full"></img>
            </div>
            {/* Add to Love */}
            <div className = "absolute w-fit h-[42px] top-5 right-5 bg-gray-200/50 rounded-[10px] flex flex-row items-center gap-1\
            hover:cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-red-300/50 ">
                {/* Love icon */}
                <img src = {LoveIcon} className = "flex h-[70%] ml-1"></img>
                {/* Number of love */}
                <div className = "text-xl text-white m-1">0</div>
            </div>

            {/* Name Product */}
            <div className = "text-xl font-semibold mx-2  flex h-[15%] pt-2 grow-0 self-start limit-to-2-lines">
                {product_name ?? "Ronaldo"}
            </div>
            <div className = "block h-[1px] mt-1 w-[90%] bg-black"></div>
            {/* Product Details */}
            <div className = "flex-1 mx-2 w-full p-2 pt-1 grid grid-cols-2 gap-2 ">

  
                <div className = "text-[85%]">
                    <div className = "font-semibold text-gray-500">
                        Giá:
                    </div>
                    {current_price ?? "0"} đồng 
                </div>
                <div className = "text-[85%]">
                    <div className = "font-semibold text-gray-500">
                        Giá mua ngay:
                    </div>
                    {buy_now_price ?? "0"} đồng 
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
                    {price_owner_username ?? "..."}
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