import { useState, useEffect } from "react";
import {toast} from "sonner"
import {NumericFormat} from "react-number-format";
import { TrendingUp, AlertCircle, Zap } from "lucide-react";
import JustValidate from "just-validate";
import { useNavigate } from "react-router-dom";
export default function PlayBidSection({product_id, current_price, step_price} : {product_id?: number, current_price?: number, step_price?: number}){
  const [isSubmit, setIsSubmit] = useState (false);
  const navigate = useNavigate();
  useEffect (() => {
    const validate = new JustValidate ("#bidForm");
    validate.addField (
      "#max_price", [
        {rule: "required", errorMessage: "Vui lòng nhập giá đấu!"},
        {
          validator: (value: string) => {
              var numericValue = value.split('.').join('').split(',').join('.');
              return parseFloat(numericValue) >= (current_price ?? 0) + (step_price ?? 0);
          }
          , errorMessage: `Giá đấu phải cao hơn ${(current_price ?? 0) + (step_price ?? 0)} VNĐ!`
        }
        ,
        {
          validator : (value: string) => {
            var numericValue = value.split('.').join('').split(',').join('.');
            if (!step_price) return true;
            return (parseFloat(numericValue) - (current_price ?? 0)) % step_price === 0;
          },
          errorMessage: `Giá đấu phải là bội số của ${step_price?.toLocaleString()} VNĐ!`
        },

      ]  
    )
    .onSuccess ((event: any) => {
      event.preventDefault();
      const form = event.target;

      const maxPriceSubmit = form.max_price.value.split('.').join('').split(',').join('.');

      setIsSubmit (true);
      fetch(`${import.meta.env.VITE_API_URL}/api/bid/play`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        credentials: "include",
        body: JSON.stringify({
          product_id: product_id,
          max_price: parseFloat (maxPriceSubmit),
        })

      })
      .then(res => {
        if (!res.ok) {
          return res.json().then (data => {
            throw new Error (data.message || "Lỗi kết nối đến server để đặt bid!");
          })
        }
        return res.json();
      })
      .then (data => {
        if (data.status === "success"){
          toast.success ("Đặt giá thành công!");
        } else {
          toast.error (`Đặt giá thất bại`);
        }
      })
      .catch (e => {
        console.log (e);
        if (e.message !== "Not logged in"){
          toast.error (e.message || "Lỗi kết nối đến server để đặt bid!");
        }
      }
      );
      setIsSubmit (false);

    })

  }, [])




  return(
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-500 rounded-lg">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-gray-800">
            Đặt giá đấu
          </h4>
          <p className="text-sm text-gray-600">Tham gia đấu giá sản phẩm</p>
        </div>
      </div>

      {/* Content Grid - Horizontal Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
        {/* Min Bid Info */}
        <div className="bg-amber-50 p-5 rounded-lg border border-amber-200 h-fit">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-semibold text-amber-700">Giá tối thiểu</span>
          </div>
          <p className="text-2xl font-bold text-amber-800 mb-2">
            {((current_price ?? 0) + (step_price ?? 0)).toLocaleString()} VNĐ
          </p>
          <div className="space-y-1 text-xs text-amber-600">
            <p>• Giá hiện tại: {current_price?.toLocaleString()} VNĐ</p>
            <p>• Bước giá: {step_price?.toLocaleString()} VNĐ</p>
          </div>
        </div>

        {/* Bid Form */}
        <form className="space-y-4" id="bidForm">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhập giá đấu của bạn
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <NumericFormat
                  name = "max_price"
                  id = "max_price"
                  thousandSeparator= "."
                  decimalSeparator= ","
                  placeholder="Ví dụ: 1.500.000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg pr-16"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  VNĐ
                </div>
              </div>
              <button
                type="submit"
                className={`bg-blue-600 hover:bg-blue-700 cursor-pointer text-white py-3 px-8 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap
                  ${isSubmit ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Zap className="w-5 h-5" />
                Đặt giá ngay
              </button>
            </div>
          </div>

          {/* Helper Text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-700">
                <span className="font-semibold">ℹ️ Lưu ý:</span> Giá đấu phải cao hơn hoặc bằng giá tối thiểu
              </p>
            </div>
            <div className="p-3 bg-rose-50 rounded-lg border border-rose-100">
              <p className="text-xs text-rose-700">
                <span className="font-semibold">⚠️ Chú ý:</span> Giá đấu phải là bội số của bước giá
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}