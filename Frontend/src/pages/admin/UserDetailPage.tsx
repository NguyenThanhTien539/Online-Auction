import { useState } from "react";

export default function UserDetailPage() {
  // Dữ liệu giả
  const [user] = useState({
    full_name: "Nguyễn Văn A",
    username: "nguyenvana",
    email: "nguyenvana@example.com",
    address: "123 Đường Nguyễn Văn Cừ, Quận 5, TP.HCM",
    role: "Người dùng",
    date_of_birth: "15/03/1995",
    rating: 4.5,
    rating_count: 128,
    status: "Hoạt động",
  });

  return (
    <div className="p-5 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">
        Chi tiết người dùng
      </h1>

      <div className="bg-white rounded-xl p-6 md:p-10 shadow-md">
        {/* Row 1: Họ và tên & Tên đăng nhập */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Họ và tên
            </label>
            <input
              type="text"
              value={user.full_name}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={user.username}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              value={user.email}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Địa chỉ
            </label>
            <input
              type="text"
              value={user.address}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Row 3: Vai trò & Ngày sinh */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Vai trò
            </label>
            <select
              defaultValue={user.role}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Người dùng</option>
              <option>Quản trị viên</option>
              <option>Người kiểm duyệt</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Ngày sinh
            </label>
            <input
              type="text"
              value={user.date_of_birth}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Row 4: Rating & Rating Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Đánh giá trung bình
            </label>
            <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-2">
              <span className="text-xl text-yellow-500">⭐</span>
              <span className="text-lg font-bold">{user.rating}</span>
              <span className="text-gray-600">/ 5.0</span>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Số lượng đánh giá
            </label>
            <input
              type="text"
              value={`${user.rating_count} đánh giá`}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Row 5: Trạng thái */}
        <div className="mb-8 md:mb-10">
          <label className="block mb-2 font-medium text-gray-700">
            Trạng thái
          </label>
          <select
            value={user.status}
            className="w-full md:max-w-md px-4 py-3 border border-gray-300 rounded-lg text-base bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Hoạt động</option>
            <option>Tạm khóa</option>
            <option>Khóa vĩnh viễn</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center sm:flex-row gap-3 sm:gap-4">
          <button className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-base font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500">
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
