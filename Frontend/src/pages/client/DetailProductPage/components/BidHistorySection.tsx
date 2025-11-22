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