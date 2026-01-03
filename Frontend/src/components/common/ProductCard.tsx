import LoveIcon from "@/assets/icons/love.svg";
import { cn } from "@/lib/utils";
import { DateTime } from "luxon";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { slugify } from "@/utils/make_slug";
import AddToLove from "@/components/common/AddToLove";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
type Products = {
  product_id?: number;
  product_image?: string;
  product_name?: string;
  current_price?: number;
  buy_now_price?: number;
  start_time?: any;
  end_time?: any;
  price_owner_username?: string;
  bid_turns?: string;
};

function ProductCard({
  product_image,
  product_id,
  product_name,
  current_price,
  buy_now_price,
  start_time,
  end_time,
  price_owner_username,
  bid_turns,
  ...data
}: Products & { className?: string } & { onClick?: () => void }) {
  const navigate = useNavigate();
  let [formattedStartTime, setFormatStartTime] = useState("");
  let [timeLeft, setTimeLeft] = useState("");

  // Start time take day, month, year
  const startDate = DateTime.fromISO(start_time, { zone: "Asia/Ho_Chi_Minh" });
  const endDate = DateTime.fromISO(end_time, { zone: "Asia/Ho_Chi_Minh" });
  const handleClickProduct = (productId?: number, productName?: string) => {
    const slug = slugify(productName ?? "");
    navigate(`/product/${slug}-${productId}`);
  };

  const formatStartTime = () => {
    if (start_time) {
      setFormatStartTime(startDate.toFormat("dd-MM-yyyy HH:mm"));
    }
  };
  const formatEndTime = () => {
    if (!end_time) return;

    // Lấy thời điểm hiện tại đúng timezone
    const present_time = DateTime.now().setZone("Asia/Ho_Chi_Minh");
    // Parse endDate nếu chưa parse
    const endDateValid = DateTime.isDateTime(endDate)
      ? endDate
      : DateTime.fromISO(end_time, { zone: "Asia/Ho_Chi_Minh" });
    // Kiểm tra valid trước khi diff
    if (!endDateValid.isValid) {
      console.error("endDate invalid:", endDateValid.invalidReason);
      timeLeft = "";
      return;
    }

    const diff = endDateValid
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
    } else if (hours >= 1) {
      result = `Còn ${Math.floor(hours)} giờ ${Math.floor(minutes)} phút`;
    } else if (minutes >= 0) {
      result = `Còn ${Math.floor(minutes)} phút ${Math.floor(seconds)} giây`;
    } else {
      result = "Đã hết hạn";
    }
    setTimeLeft(result);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      formatEndTime();
    }, 1000);
    formatStartTime();
    return () => clearInterval(timer);
  });

  // Function to mask buyer name (hide half with ***)
  const maskName = (name: string) => {
    const len = name.length;
    const thirdLen = Math.floor(len / 3);
    return name.substring(0, len - thirdLen) + "***";
  };

  const { ref, hasIntersected } = useIntersectionObserver();
  return (
    // Container with glassmorphism - Gray/Blue theme
    <div
      ref={ref}
      className={cn(
        "group relative w-80 h-110 cursor-pointer overflow-hidden rounded-3xl",
        "bg-gray-100/50 backdrop-blur-xl border border-gray-300/30",
        "hover:bg-white/10 hover:border-gray-400/40",
        "transition-all duration-500 ease-out",
        "hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20",
        "before:absolute before:inset-0 before:rounded-3xl",
        "before:bg-gradient-to-br before:from-blue-500/10 before:to-gray-500/10",
        "before:opacity-0 before:transition-opacity before:duration-500",
        "hover:before:opacity-100 shadow-xl shadow-gray-300/20",
        "flex flex-col items-center shrink-0",
        hasIntersected ? "animate__animated animate__fadeInUp" : "opacity-0",
        data.className
      )}
      onClick={
        data.onClick ??
        (() => {
          handleClickProduct(product_id ?? 0, product_name ?? "");
        })
      }
    >
      {/* Background pattern - Gray/Blue theme */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-gray-400/20 to-transparent rounded-full blur-xl"></div>
      </div>

      {/* Image Container */}
      <div className="relative w-full h-[50%] shrink-0 overflow-hidden rounded-t-3xl">
        {/* Love Button - Top Right */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-0 right-0 z-20"
        >
          <AddToLove product_id={product_id ?? 1} className="min-w-[70px]" />
        </div>

        <img
          src={product_image}
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
        />

        {/* Image overlay gradient - Gray/Blue theme */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>

        {/* Hover overlay with icon */}
        <div className="absolute inset-0 bg-gray-900/20 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Name Product */}
      <div className="relative text-xl font-bold mx-2 flex h-[15%] pt-2 grow-0 self-start limit-to-2-lines text-gray-700 group-hover:text-gray-900 transition-colors duration-500">
        {product_name ?? "Ronaldo"}
      </div>

      {/* Decorative line - Gray/Blue theme */}
      <div className="relative w-[90%] h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent group-hover:via-blue-500 transition-all duration-500"></div>

      {/* Product Details */}
      <div className="relative flex-1 mx-2 w-full p-2 pt-1 grid grid-cols-2 gap-2">
        <div className="text-[85%] transition-colors duration-300">
          <div className="font-semibold text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
            Giá:
          </div>
          <span className="text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
            {current_price?.toLocaleString() ?? "0"} đồng
          </span>
        </div>
        <div className="text-[85%] transition-colors duration-300">
          <div className="font-semibold text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
            Giá mua ngay:
          </div>
          <span className="text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
            {buy_now_price?.toLocaleString() ?? "0"} đồng
          </span>
        </div>
        <div className="text-[85%] transition-colors duration-300">
          <div className="font-semibold text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
            Thời điểm đăng:
          </div>
          <span className="text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
            {formattedStartTime}
          </span>
        </div>
        <div className="text-[85%] transition-colors duration-300">
          <div className="font-semibold text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
            Thời gian kết thúc:
          </div>
          <span className="text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
            {timeLeft}
          </span>
        </div>
        <div className="text-[85%] transition-colors duration-300">
          <div className="font-semibold text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
            Người giữ giá:
          </div>
          <span className="text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
            {price_owner_username ? maskName(price_owner_username) : "..."}
          </span>
        </div>
        <div className="text-[85%] transition-colors duration-300">
          <div className="font-semibold text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
            Số lượt đấu giá:
          </div>
          <span className="text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
            {bid_turns}
          </span>
        </div>
      </div>

      {/* Shine effect - Gray/Blue theme */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
        <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent -skew-x-12 animate-shine"></div>
      </div>
    </div>
  );
}
export default ProductCard;
