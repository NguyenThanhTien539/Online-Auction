import Cristiano from "@/assets/images/Cristiano.jpg";
import LoveIcon from "@/assets/icons/love.svg";
import {cn} from "@/lib/utils"






function ProductCard({data, className} : {data? : any, className? : string}) {
    
    // const nameProduct = data.nameProduct;
    // const currentPrice = data.currentPrice;
    // const buyNowPrice = data.buyNowPrice;
    // const postDate = data.postDate;
    // const endTime = data.endTime;
    // const highestBidder = data.highestBidder;
    // const bidCount = data.bidCount;
    // const image = data.image;

    return (
        // Container
        <div className = {cn("w-80 h-110 relative flex flex-col items-center  border border-gray-300 rounded-lg shadow-lg\
        hover:scale-[103%] transition-all duration-300 bg-white hover:cursor-pointer hover:shadow-2xl hover:shadow-gray-400 shrink-0", className)}>
            {/* Image */}
            <div className = "flex w-full h-[50%] shrink-0 overflow-hidden rounded-lg justify-center">
                <img src = {Cristiano} className = "bg-red-300 flex object-cover w-full h-full"></img>
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
                Ronaldo quá đẹp trai ahihi
            </div>
            <div className = "block h-[1px] mt-1 w-[90%] bg-black"></div>
            {/* Product Details */}
            <div className = "flex-1 mx-2 w-full p-2 pt-1 grid grid-cols-2 gap-2 ">

  
                <div className = "text-[85%]">
                    <div className = "font-semibold text-gray-500">
                        Giá:
                    </div>
                    100.000 đồng 
                </div>
                <div className = "text-[85%]">
                    <div className = "font-semibold text-gray-500">
                        Giá mua ngay:
                    </div>
                    100.000.000 đồng 
                </div>
                <div className = "text-[85%]">
                    <div className = "font-semibold text-gray-500">
                        Ngày đăng:
                    </div>
                    10/10/2025
                </div>
                <div className = "text-[85%]">
                    <div className = "font-semibold text-gray-500">
                        Thời gian kết thúc:
                    </div>
                    10 phút
                </div>
                <div className = "text-[85%]">
                    <div className = "font-semibold text-gray-500">
                        Người giữ giá:
                    </div>
                    Lock1412
                </div>
                <div className = "text-[85%]">
                    <div className = "font-semibold text-gray-500">
                        Số lượt đấu giá:
                    </div>
                    10
                </div>

            </div>

                    
        </div>
    );
}
export default ProductCard; 