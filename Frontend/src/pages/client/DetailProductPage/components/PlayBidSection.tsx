import { useState } from "react";
import {toast} from "sonner"
// import {formatPrice, parsePrice} from "@/utils/format_price"
import {NumericFormat} from "react-number-format";

export default function PlayBidSection({product_id} : {product_id?: number}){

  
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
        toast.error("Lỗi kết nối đến server để đặt bid!");
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
          {/* <input type = "text" placeholder = "Nhập giá" name = "price" value = {formatPrice(bidPrice)} onChange = {(e)=>{handleInputPriceChange(e)}} className = "border-1 w-full rounded-xl p-2 my-3"></input> */}
          <NumericFormat
            value={bidPrice}
            thousandSeparator={true}
            placeholder="Nhập giá"
            onValueChange={(values) => {
              const { value } = values;
              setBidPrice(value ? parseInt(value) : 0);
            }}
            className="border-1 w-full rounded-xl p-2 my-3"
          />
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
