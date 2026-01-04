import { useEffect, useState } from "react";
import {toast} from "sonner"
import {Link} from "react-router-dom";
import { Ban } from "lucide-react";
type ProductType = {
  product_id: number,
  seller_id?: number,
}
import Loading from "@/components/common/Loading";
import BanBidderModal from "./BanBidderModal";

export default function BidHistorySection({product,  isSeller, isExpired} : {product?: ProductType | null,  isSeller?: boolean, isExpired?: boolean }) {
  const [bidHistory, setBidHistory] = useState<{
    bidding_id: number,
    user_id: number,
    username: string,
    max_price: number,
    product_price: number,
    created_at: string,
    price_owner_id: number,
    price_owner_username: string,
    status?: string,
  }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [selectedBidder, setSelectedBidder] = useState<{
    userId: number;
    username: string;
  } | null>(null);
  

  useEffect(()=>{
    setLoading (true);
    async function fetchBidHistory(){
      
      // Fetch bid history from API
      try{
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bid/history?product_id=${product?.product_id}`, {
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
    setInterval (() => {
      setLoading (false);
    }, 500);
  }, [product]);
  
 

  // Function to mask buyer name (hide half with ***)
  const maskName = (name: string) => {
    const len = name.length;
    const thirdLen = Math.floor(len / 2);
    return name.substring(0, len - thirdLen) + "*****";
  };

  // Function to open ban modal
  const handleOpenBanModal = (userId: number, username: string) => {
    setSelectedBidder({ userId, username });
    setBanModalOpen(true);
  };

  const handleCloseBanModal = () => {
    setBanModalOpen(false);
    setSelectedBidder(null);
  };


  if (loading){
    return <Loading className = "static w-full h-full bg-transparent"/>;
  }

  return(
    <div className="bg-white rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Lịch sử đấu giá
          </h3>
          <p className="text-sm text-gray-500">Theo dõi các lượt đấu giá của sản phẩm</p>
        </div>
      </div>

      {bidHistory.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người đấu giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá tối đa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá hiện tại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người giữ giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                {isSeller && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bidHistory.map((bid, index) => {
                const isBanned = bid.status === 'BANNED';
                const isSellerBid = product?.seller_id && bid.user_id === product.seller_id;
                
                return (
                <tr key={index} className={`hover:bg-gray-50 transition-colors duration-150 ${
                  isBanned ? 'bg-red-50' : ''
                }`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    isBanned 
                      ? 'text-red-600 line-through opacity-70' 
                      : isSellerBid
                      ? 'text-yellow-600 font-bold'
                      : 'text-gray-900'
                  }`}>
                    {isBanned && (
                      <span className="inline-flex items-center gap-1.5 bg-red-100 px-2 py-1 rounded">
                        <Ban className="w-3.5 h-3.5 text-red-600" />
                        {isSeller ? (<Link to = {`/profile/${bid.username}_${bid.user_id}`} className="text-red-600">{maskName(bid.username)}</Link>) : (maskName(bid.username))}
                      </span>
                    )}
                    {!isBanned && (
                      <>
                        {isSellerBid && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded mr-2">Seller</span>}
                        {isSeller ? (<Link to = {`/profile/${bid.username}_${bid.user_id}`}>{maskName(bid.username)}</Link>) : (maskName(bid.username))}
                      </>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-semibold">
                    {bid.max_price.toLocaleString('vi-VN')} VNĐ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    {bid.product_price.toLocaleString('vi-VN')} VNĐ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {isSeller && bid.price_owner_username ?  (<Link to = {`/profile/${bid.price_owner_username}_${bid.price_owner_id}`}>{bid.price_owner_username}</Link>)  : (bid.price_owner_username || 'Chưa có')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span>{new Date(bid.created_at).toLocaleDateString('vi-VN')}</span>
                      <span className="text-xs">{new Date(bid.created_at).toLocaleTimeString('vi-VN')}</span>
                    </div>
                  </td>
                  {isSeller && bid.user_id != product?.seller_id && !isExpired && bid.status != "BANNED" && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleOpenBanModal(bid.user_id, bid.username)}
                        className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        Cấm
                      </button>
                    </td>
                  )}
                </tr>
              )})
              }
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có lượt đấu giá</h3>
          <p className="mt-1 text-sm text-gray-500">Hãy là người đầu tiên đặt giá cho sản phẩm này.</p>
        </div>
      )}

      {/* Ban Bidder Modal */}
      {selectedBidder && (
        <BanBidderModal
          isOpen={banModalOpen}
          onClose={handleCloseBanModal}
          userId={selectedBidder.userId}
          username={selectedBidder.username}
          productId={product?.product_id || 0}
        />
      )}
    </div>
  );
}