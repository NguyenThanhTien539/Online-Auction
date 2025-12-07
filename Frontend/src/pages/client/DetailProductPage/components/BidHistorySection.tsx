import { useEffect, useState } from "react";
import {toast} from "sonner"

export default function BidHistorySection({product_id} : {product_id?: number}){
  const [bidHistory, setBidHistory] = useState<{
    bidding_id: number,
    user_id: number,
    username: string,
    max_price: number,
    product_price: number,
    created_at: string,
    price_owner_id: number,
    price_owner_username: string,
  }[]>([]);
  

  useEffect(()=>{
    async function fetchBidHistory(){
      // Fetch bid history from API
      try{
        const response = await fetch(`http://localhost:5000/api/bid/history?product_id=${product_id}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok){
          return;
        }
        else{
          setBidHistory(data.data);
        }
      } catch (e){
        console.log(e);
      }
    }
    fetchBidHistory();
  }, [product_id]);
  
 

  // Function to mask buyer name (hide half with ***)
  const maskName = (name: string) => {
    const len = name.length;
    const thirdLen = Math.floor(len / 3);
    return name.substring(0, len - thirdLen) + '***';
  };

  return(
    <div className="backdrop-blur-sm rounded-2xl "> 
      <h4 className="font-bold text-xl ml-4 text-rose-400 mb-6 flex items-center gap-2">
        Lịch sử đấu giá
      </h4>
      {bidHistory.length > 0 ? (
        <div className="overflow-x-auto w-full overflow-y-auto h-fit max-h-[500px]  rounded-xl m-1 scrollbar-horizontal-only">
          <table className="min-w-full bg-white/70 backdrop-blur-sm rounded-xl">
            <thead className="bg-gradient-to-r from-blue-50 to-purple-50 sticky top-0 rouhnded-t-xl">
              <tr className="border-b border-gray-200/50">
                <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">STT</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Username</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Giá tối đa</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Giá</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Giữ giá</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Thời gian</th>
                
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/60">
              {bidHistory.map((bid, index) => (
                
                <tr key={index} className={`hover:bg-gradient-to-r hover:from-blue-50/40 hover:to-purple-50/40 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white/40' : 'bg-gray-50/30'}`}>
                  {/* STT */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                    {index + 1}
                  </td>
                  {/* Username */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-bold">
                    {maskName(bid.username)}
                  </td>
                  {/* Max Price */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-rose-500  font-bold">
                    {bid.max_price.toLocaleString('vi-VN')} VNĐ
                  </td>
                  {/* Product Price */}
                  <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-green-600 rounded-lg border border-green-200/40">
                    {bid.product_price.toLocaleString('vi-VN')} VNĐ
                  </td>
                  {/* Price Owner Username */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-500 font-medium">
                    {bid.price_owner_username || 'Chưa có'}
                  </td>
                  {/* Created At */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                    <div className="flex flex-col">
                      <span className="text-gray-900">{new Date(bid.created_at).toLocaleDateString('vi-VN')}</span>
                      <span className="text-xs text-gray-500 font-normal">{new Date(bid.created_at).toLocaleTimeString('vi-VN')}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50/50 m-1 rounded-xl border-2 border-dashed border-gray-200">
          <div className="text-gray-400 text-4xl mb-3">📊</div>
          <p className="text-gray-600 font-medium text-lg">Chưa có lượt đấu giá nào.</p>
          <p className="text-sm text-gray-500 mt-1">Hãy là người đầu tiên đấu giá!</p>
        </div>
      )}
    </div>
  );
}