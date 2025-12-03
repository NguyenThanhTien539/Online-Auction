/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import FilterBar from "@/components/admin/FilterBar";

type UserItem = {
  id: number;
  full_name: string;
  avatar: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
};

export default function UserListPage() {
  // ============================
  // ⭐ DỮ LIỆU GIẢ
  // ============================
  const [users] = useState<UserItem[]>([
    {
      id: 1,
      full_name: "Lê Văn A",
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&w=80",
      email: "levana@gmail.com",
      phone: "01234567890",
      status: "active",
    },
    {
      id: 2,
      full_name: "Nguyễn Thị B",
      avatar:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&w=80",
      email: "nguyenthib@example.com",
      phone: "0987654321",
      status: "inactive",
    },
    {
      id: 3,
      full_name: "Trần Văn C",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&w=80",
      email: "tranvanc@example.com",
      phone: "0123456789",
      status: "active",
    },
    {
      id: 4,
      full_name: "Phạm Thị D",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&w=80",
      email: "phamthid@example.com",
      phone: "0987654322",
      status: "active",
    },
  ]);

  // ============================
  // ⭐ FILTER STATE
  // ============================
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [search, setSearch] = useState<string>("");

  // danh sách user sau khi áp filter
  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        // lọc theo trạng thái
        if (statusFilter !== "all" && user.status !== statusFilter)
          return false;

        // search theo họ tên / email / sđt
        if (search.trim()) {
          const key = search.toLowerCase();
          if (
            !user.full_name.toLowerCase().includes(key) &&
            !user.email.toLowerCase().includes(key) &&
            !user.phone.toLowerCase().includes(key)
          ) {
            return false;
          }
        }

        return true;
      }),
    [users, statusFilter, search]
  );

  const resetFilters = () => {
    setStatusFilter("all");
    setSearch("");
  };

  // ============================
  // ⭐ STATE CHECKBOX
  // ============================
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // chọn tất cả trên danh sách ĐÃ LỌC
  const allChecked =
    filteredUsers.length > 0 &&
    filteredUsers.every((u) => selectedIds.includes(u.id));

  const toggleAll = () => {
    const filteredIds = filteredUsers.map((u) => u.id);
    setSelectedIds((prev) => {
      if (allChecked) return prev.filter((id) => !filteredIds.includes(id));
      const set = new Set([...prev, ...filteredIds]);
      return Array.from(set);
    });
  };

  // ============================
  // ⭐ HANDLERS
  // ============================
  const handleView = (id: number) => {
    console.log("View user", id);
  };

  const handleEdit = (id: number) => {
    console.log("Edit user", id);
  };

  const handleDelete = (id: number) => {
    console.log("Delete user", id);
  };

  return (
    <div className="w-full min-h-screen px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
      <div className="max-w-[1600px] mx-auto">
        <h2 className="font-semibold text-xl sm:text-2xl lg:text-3xl mb-4 sm:mb-5">
          Quản lý người dùng
        </h2>

        <FilterBar
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          statusOptions={[
            { value: "all", label: "Trạng thái" },
            { value: "active", label: "Hoạt động" },
            { value: "inactive", label: "Tạm dừng" },
          ]}
          search={search}
          setSearch={setSearch}
          bulkActionOptions={[
            { value: "active", label: "Bật hoạt động" },
            { value: "inactive", label: "Tạm dừng" },
          ]}
          onApplyBulkAction={(action) => console.log(action, selectedIds)}
          onResetFilters={resetFilters}
        />

        {/* Desktop Table View - Hidden on screens < 1280px */}
        <div className="mt-4 sm:mt-5 bg-white rounded-lg sm:rounded-xl lg:rounded-2xl border border-gray-200 overflow-hidden hidden xl:block">
          <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-left w-10 lg:w-12">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={toggleAll}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </th>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-left font-semibold text-gray-700 text-sm lg:text-base">
                    Họ tên
                  </th>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-center font-semibold text-gray-700 text-sm lg:text-base">
                    Ảnh đại diện
                  </th>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-center font-semibold text-gray-700 text-sm lg:text-base">
                    Email
                  </th>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-center font-semibold text-gray-700 text-sm lg:text-base">
                    Số điện thoại
                  </th>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-center font-semibold text-gray-700 text-sm lg:text-base">
                    Trạng thái
                  </th>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-center font-semibold text-gray-700 text-sm lg:text-base">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => {
                  const checked = selectedIds.includes(user.id);
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 lg:px-4 py-3 lg:py-4">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleOne(user.id)}
                          className="w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="px-3 lg:px-4 py-3 lg:py-4 font-medium text-gray-900 text-sm lg:text-base">
                        {user.full_name}
                      </td>
                      <td className="px-3 lg:px-4 py-3 lg:py-4">
                        <div className="flex items-center justify-center">
                          <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-lg lg:rounded-xl overflow-hidden border border-gray-200">
                            <img
                              src={user.avatar}
                              alt={user.full_name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 lg:px-4 py-3 lg:py-4 text-center text-gray-700 text-sm lg:text-base">
                        <div className="max-w-[200px] mx-auto truncate">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-3 lg:px-4 py-3 lg:py-4 text-center text-gray-700 text-sm lg:text-base">
                        {user.phone}
                      </td>
                      <td className="px-3 lg:px-4 py-3 lg:py-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center px-2.5 lg:px-3 py-1 rounded-md text-xs lg:text-sm font-semibold min-w-[80px] lg:min-w-[90px] ${
                            user.status === "active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-200 text-red-600"
                          }`}
                        >
                          {user.status === "active" ? "Hoạt động" : "Tạm dừng"}
                        </span>
                      </td>
                      <td className="px-3 lg:px-4 py-3 lg:py-4 text-center">
                        <div className="flex items-center justify-center gap-1 lg:gap-2">
                          <button
                            className="p-1.5 lg:p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"
                            onClick={() => handleView(user.id)}
                            title="Xem chi tiết"
                          >
                            <Eye
                              size={16}
                              className="lg:w-[18px] lg:h-[18px]"
                            />
                          </button>
                          <button
                            className="p-1.5 lg:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={() => handleEdit(user.id)}
                            title="Chỉnh sửa"
                          >
                            <Pencil
                              size={16}
                              className="lg:w-[18px] lg:h-[18px]"
                            />
                          </button>
                          <button
                            className="p-1.5 lg:p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                            onClick={() => handleDelete(user.id)}
                            title="Xóa"
                          >
                            <Trash2
                              size={16}
                              className="lg:w-[18px] lg:h-[18px]"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="py-8 lg:py-10 text-center text-gray-500 text-sm lg:text-base">
              Không có người dùng nào phù hợp bộ lọc
            </div>
          )}
        </div>

        {/* Tablet/Mobile Card View - Show on screens < 1280px */}
        <div className="mt-4 sm:mt-5 grid grid-row-1 sm:grid-row-2 gap-3 sm:gap-4 xl:hidden">
          {filteredUsers.map((user) => {
            const checked = selectedIds.includes(user.id);
            return (
              <div
                key={user.id}
                className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleOne(user.id)}
                    className="w-4 h-4 mt-1 cursor-pointer flex-shrink-0"
                  />

                  <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                    <img
                      src={user.avatar}
                      alt={user.full_name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 truncate">
                      {user.full_name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                        user.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-200 text-red-600"
                      }`}
                    >
                      {user.status === "active" ? "Hoạt động" : "Tạm dừng"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm mb-3 sm:mb-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500 font-medium">Email:</span>
                    <span className="font-medium text-gray-900 break-all">
                      {user.email}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500 font-medium">
                      Số điện thoại:
                    </span>
                    <span className="font-medium text-gray-900">
                      {user.phone}
                    </span>
                  </div>
                </div>

                {/* Buttons - Vertical on mobile, Horizontal on larger screens */}
                <div className="flex flex-col xs:flex-row gap-2 pt-3 sm:pt-4 border-t border-gray-100">
                  <button
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                    onClick={() => handleView(user.id)}
                  >
                    <Eye size={16} className="flex-shrink-0" />
                    <span className="font-medium text-xs sm:text-sm">Xem</span>
                  </button>

                  <button
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => handleEdit(user.id)}
                  >
                    <Pencil size={16} className="flex-shrink-0" />
                    <span className="font-medium text-xs sm:text-sm">Sửa</span>
                  </button>

                  <button
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 size={16} className="flex-shrink-0" />
                    <span className="font-medium text-xs sm:text-sm">Xóa</span>
                  </button>
                </div>
              </div>
            );
          })}

          {filteredUsers.length === 0 && (
            <div className="col-span-full bg-white rounded-lg sm:rounded-xl border border-gray-200 py-8 sm:py-10 text-center text-gray-500 text-sm sm:text-base">
              Không có người dùng nào phù hợp bộ lọc
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
