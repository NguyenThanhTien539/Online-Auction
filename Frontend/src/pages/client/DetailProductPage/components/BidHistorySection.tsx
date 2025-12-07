import { useEffect, useState } from "react";
import {toast} from "sonner"

export default function BidHistorySection({product_id} : {product_id?: number}){


  useEffect(()=>{
    async function fetchBidHistory(){
      // Fetch bid history from API
      try{
        const response = await fetch(`http://localhost:5000/api/bid/history?product_id=${product_id}`, {
          method: "GET",
          headers: {
            "credentials": "include"
          }
        });
        const data = await response.json();
        if (!response.ok){
          toast.error (data.message || "Lỗi khi tải lịch sử đấu giá");
        }
        else{
          // Process bid history data
        }
      } catch (e){
        console.log(e);
        toast.error("Lỗi kết nối đến server xem lịch sử đấu giá");
      }
    }
    fetchBidHistory();
  }, [product_id]);
  
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
    <div className="backdrop-blur-sm rounded-2xl "> 
      <h4 className="font-bold text-xl ml-4 text-rose-400 mb-6 flex items-center gap-2">
        Lịch sử đấu giá
      </h4>
      {bidHistory.length > 0 ? (
        <div className="overflow-x-auto w-full overflow-y-auto max-h-[280px] rounded-xl border border-gray-100/80">
          <table className="min-w-full bg-white/70 backdrop-blur-sm rounded-xl">
            <thead className="bg-gradient-to-r from-blue-50 to-purple-50 sticky top-0 rounded-t-xl">
              <tr className="border-b border-gray-200/50">
                <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Người mua</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Giá</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/60">
              {bidHistory.map((bid, index) => (
                <tr key={bid.id} className={`hover:bg-gradient-to-r hover:from-blue-50/40 hover:to-purple-50/40 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white/40' : 'bg-gray-50/30'}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                    <div className="flex flex-col">
                      <span className="text-gray-900">{bid.time.toLocaleDateString('vi-VN')}</span>
                      <span className="text-xs text-gray-500 font-normal">{bid.time.toLocaleTimeString('vi-VN')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                    {maskName(bid.buyer)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-green-600 bg-green-50/60 rounded-lg border border-green-200/40">
                    ${bid.price.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="text-gray-400 text-4xl mb-3">📊</div>
          <p className="text-gray-600 font-medium text-lg">Chưa có lượt đấu giá nào.</p>
          <p className="text-sm text-gray-500 mt-1">Hãy là người đầu tiên đấu giá!</p>
        </div>
      )}
    </div>
  );
}