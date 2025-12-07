import { useState, useEffect } from "react";
import {toast} from "sonner"
import {NumericFormat} from "react-number-format";
import { TrendingUp, AlertCircle, Zap } from "lucide-react";
import JustValidate from "just-validate";

export default function PlayBidSection({product_id, current_price, step_price} : {product_id?: number, current_price?: number, step_price?: number}){
  const [isSubmit, setIsSubmit] = useState (false);

  useEffect (() => {
    const validate = new JustValidate ("#bidForm");

    validate.addField (
      "#max_price", [
        {rule: "required", errorMessage: "Vui lòng nhập giá đấu!"}
      ]  
    )
    validate.addField (
      "#max_price", [
        {

          validator: (value: string) => {
              var numericValue = value.split('.').join('').split(',').join('.');
              return parseFloat(numericValue) >= (current_price ?? 0) + (step_price ?? 0);
          }
          , errorMessage: `Giá đấu phải cao hơn ${(current_price ?? 0) + (step_price ?? 0)} VNĐ!`
        }
        
      ]
    )
    .onSuccess ((event: any) => {
      event.preventDefault();
      const form = event.target;

      const maxPriceSubmit = form.max_price.value.split('.').join('').split(',').join('.');
      setIsSubmit (true);
      fetch("http://localhost:5000/api/bid/play", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
          "credentials": "include"},
        body: JSON.stringify({
          product_id: product_id,
          max_price: parseFloat (maxPriceSubmit),
        })

      })
      .then(res => {
        if (res.status == 403){
          toast.error ("Vui lòng đăng nhập để đặt giá!");
          throw new Error ("Not logged in");
        }
        return res.json();
      })
      .then (data => {
        if (data.message === "Success"){
          toast.success ("Đặt giá thành công!");
        } else {
          toast.error (`Đặt giá thất bại: ${data.message}`);
        }
      })
      .catch (e => {
        console.log (e);
        if (e.message !== "Not logged in"){
          toast.error ("Lỗi kết nối đến server để đặt bid!");
        }
      }
      );
      setIsSubmit (false);

    })

  }, [])




  return(
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md">
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

      {/* Min Bid Info */}
      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-700">Giá tối thiểu có thể đặt:</span>
        </div>
        <p className="text-lg font-bold text-amber-800">
          {(current_price ?? 0) + (step_price ?? 0)} VNĐ
        </p>
        <p className="text-xs text-amber-600 mt-1">
          (Giá hiện tại + {current_price?.toLocaleString()} VNĐ)
        </p>
      </div>

      {/* Bid Form */}
      <form className="space-y-4" id="bidForm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nhập giá đấu của bạn
          </label>
          <div className="relative">
            <NumericFormat
              name = "max_price"
              id = "max_price"
              thousandSeparator= "."
              decimalSeparator= ","
              placeholder="Ví dụ: 1.500.000 VNĐ"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg pr-16"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              VNĐ
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2
            ${isSubmit ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Zap className="w-5 h-5" />
          Đặt giá ngay
        </button>
      </form>

      {/* Helper Text */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          💡 Giá đấu phải cao hơn giá tối thiểu để được chấp nhận
        </p>
      </div>
    </div>
  );
}