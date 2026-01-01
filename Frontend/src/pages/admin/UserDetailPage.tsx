import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { UserItem } from "@/interface/user.interface";
import { formatDateOfBirth } from "@/utils/format_time";
import { toast } from "sonner";

export default function UserDetailPage() {
  const { id } = useParams();
  const [userDetail, setUserDetail] = useState<UserItem | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/${
        import.meta.env.VITE_PATH_ADMIN
      }/api/user/detail/${id}`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => {
        setUserDetail(data.user);
        setSelectedRole(data.user.role);
      })
      .catch(() => {
        setUserDetail(null);
      });
  }, [id]);

  const handleSave = (role: string) => {
    fetch(
      `${import.meta.env.VITE_API_URL}/${
        import.meta.env.VITE_PATH_ADMIN
      }/api/user/edit-role/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          toast.success("Cập nhật vai trò thành công!");
          setUserDetail((prev) => (prev ? { ...prev, role } : null));
        } else {
          toast.error("Cập nhật vai trò thất bại.");
        }
      })
      .catch(() => {
        toast.error("Có lỗi xảy ra khi cập nhật vai trò.");
      });
  };

  return (
    userDetail && (
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
                value={userDetail.full_name}
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
                value={userDetail.username}
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
                value={userDetail.email}
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
                value={userDetail.address}
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
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">Người dùng</option>
                <option value="seller">Người bán</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Ngày sinh
              </label>
              <input
                type="text"
                value={formatDateOfBirth(userDetail.date_of_birth)}
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
                <span className="text-lg font-bold">{userDetail.rating}</span>
                <span className="text-gray-600">/ 5.0</span>
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Số lượng đánh giá
              </label>
              <input
                type="text"
                value={`${userDetail.rating_count} đánh giá`}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={() => handleSave(selectedRole)}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-base font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    )
  );
}
