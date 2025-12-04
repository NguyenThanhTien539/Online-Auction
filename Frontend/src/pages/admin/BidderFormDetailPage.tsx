import { useState, useRef } from "react";
import TinyMCEEditor from "@/components/editor/TinyMCEEditor";
import { useNavigate } from "react-router-dom";
export default function BidderFormDetailPage() {
  const editorRef = useRef(null);
  const navigate = useNavigate();
  // Dữ liệu giả
  const [form] = useState({
    full_name: "Trần Thị B",
    username: "tranthib",
    email: "tranthib@example.com",
    address: "456 Đường Lê Lợi, Quận 1, TP.HCM",
    current_role: "Người đấu giá",
    requested_role: "Người bán",
    date_of_birth: "20/08/1992",
    rating: 4.8,
    rating_count: 256,
    status: "Chờ duyệt",
    submitted_date: "01/12/2024",
    description: `
      <h3>Lý do xin nâng cấp tài khoản</h3>
      <p>Kính gửi Ban Quản trị,</p>
      <p>Tôi là <strong>Trần Thị B</strong>, hiện đang là người đấu giá trên hệ thống từ năm 2023. Sau thời gian tham gia và tích lũy kinh nghiệm, tôi mong muốn được nâng cấp lên tài khoản <strong>Người bán</strong> với những lý do sau:</p>
      
      <h4>1. Kinh nghiệm và uy tín</h4>
      <ul>
        <li>Đã tham gia <strong>256 phiên đấu giá</strong> với tỷ lệ hoàn thành giao dịch 98%</li>
        <li>Đánh giá trung bình <strong>4.8/5.0</strong> từ cộng đồng</li>
        <li>Không có vi phạm nào trong quá trình sử dụng</li>
      </ul>
      
      <h4>2. Nguồn hàng và năng lực</h4>
      <ul>
        <li>Có nguồn hàng ổn định từ các nhà cung cấp uy tín</li>
        <li>Chuyên về các mặt hàng: Đồ cổ, Nghệ thuật, Đồ sưu tầm</li>
        <li>Có kiến thức chuyên môn về định giá và thẩm định hàng hóa</li>
      </ul>
      
      <h4>3. Cam kết</h4>
      <p>Tôi cam kết sẽ:</p>
      <ul>
        <li>Cung cấp thông tin sản phẩm chính xác và đầy đủ</li>
        <li>Đảm bảo chất lượng hàng hóa theo mô tả</li>
        <li>Giao hàng đúng hạn và đóng gói cẩn thận</li>
        <li>Hỗ trợ khách hàng nhiệt tình</li>
      </ul>
      
      <p>Tôi rất mong được sự xem xét và chấp thuận từ Ban Quản trị.</p>
      <p>Trân trọng cảm ơn!</p>
    `,
  });

  return (
    <div className="p-5 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">
        Chi tiết đơn xin nâng cấp tài khoản
      </h1>

      <div className="bg-white rounded-xl p-6 md:p-10 shadow-md">
        {/* Thông tin đơn */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Thông tin đơn
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600">Ngày gửi đơn:</span>
              <span className="ml-2 font-medium">{form.submitted_date}</span>
            </div>
            <div>
              <span className="text-gray-600">Trạng thái:</span>
              <span className="ml-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                {form.status}
              </span>
            </div>
          </div>
        </div>

        {/* Row 1: Họ và tên & Tên đăng nhập */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Họ và tên
            </label>
            <input
              type="text"
              value={form.full_name}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={form.username}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:outline-none"
            />
          </div>
        </div>

        {/* Row 2: Email & Địa chỉ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Địa chỉ
            </label>
            <input
              type="text"
              value={form.address}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:outline-none"
            />
          </div>
        </div>

        {/* Row 3: Vai trò hiện tại & Vai trò muốn nâng cấp */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Vai trò hiện tại
            </label>
            <input
              type="text"
              value={form.current_role}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Vai trò muốn nâng cấp
            </label>
            <input
              type="text"
              value={form.requested_role}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-blue-50 font-medium text-blue-700 focus:outline-none"
            />
          </div>
        </div>

        {/* Row 4: Ngày sinh */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Ngày sinh
            </label>
            <input
              type="text"
              value={form.date_of_birth}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:outline-none"
            />
          </div>
        </div>

        {/* Row 5: Rating & Rating Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Đánh giá trung bình
            </label>
            <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-2">
              <span className="text-xl text-yellow-500">⭐</span>
              <span className="text-lg font-bold">{form.rating}</span>
              <span className="text-gray-600">/ 5.0</span>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Số lượng đánh giá
            </label>
            <input
              type="text"
              value={`${form.rating_count} đánh giá`}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:outline-none"
            />
          </div>
        </div>

        {/* Description - TinyMCE Editor (Read-only) */}
        <div className="mb-8 md:mb-10">
          <label className="block mb-2 font-medium text-gray-700">
            Lý do xin nâng cấp
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50 pointer-events-none opacity-90">
            <TinyMCEEditor
              editorRef={editorRef}
              value={form.description}
              isReadOnly={true}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            * Nội dung này chỉ để xem, không thể chỉnh sửa
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center sm:flex-row gap-3 sm:gap-4 ">
          <button className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-base font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer">
            Phê duyệt
          </button>

          <button className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-base font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer">
            Từ chối
          </button>

          <button
            className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-base font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer"
            onClick={() => {
              navigate("/admin/bidder/form/list");
            }}
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
