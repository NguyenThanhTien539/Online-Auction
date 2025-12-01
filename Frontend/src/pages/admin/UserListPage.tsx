/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import FilterBar from "@/components/admin/FilterBar";

type UserItem = {
  id: number;
  full_name: string;
  avatar: string;
  email: string;
  phone: string;
  address: string;
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
      address: "Số 123, đường ABC, quận 1, TP. Hồ Chí Minh",
      status: "active",
    },
    {
      id: 2,
      full_name: "Nguyễn Thị B",
      avatar:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&w=80",
      email: "nguyenthib@example.com",
      phone: "0987654321",
      address: "Số 456, đường XYZ, quận 3, TP. Hồ Chí Minh",
      status: "inactive",
    },
  ]);

  // ============================
  // ⭐ STATE CHECKBOX
  // ============================
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const allChecked = selectedIds.length === users.length && users.length > 0;
  const toggleAll = () => {
    setSelectedIds(allChecked ? [] : users.map((u) => u.id));
  };

  // ============================
  // ⭐ GRID CONFIG
  // ============================
  const rowClass = "grid items-center text-sm text-gray-700";
  const gridCols = "60px 1.1fr 120px 1.5fr 1.1fr 2fr 1fr 150px"; // checkbox + (Họ tên, Avatar, Email, SDT, ĐC, Trạng thái, HĐ)

  const handleEdit = (id: number) => {
    console.log("Edit user", id);
  };

  const handleDelete = (id: number) => {
    console.log("Delete user", id);
  };

  return (
    <>
      <h2 className="font-[600] text-3xl mb-10">Quản lý người dùng</h2>
      <FilterBar />
      <div className="mt-5 bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div className="w-full">
            {/* HEADER */}
            <div
              className="grid text-sm bg-gray-50 text-gray-700 border-b font-semibold"
              style={{ gridTemplateColumns: gridCols }}
            >
              {/* checkbox all */}
              <div className="px-4 py-3 flex items-center">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  className="w-4 h-4"
                />
              </div>

              <div className="px-4 py-3">Họ tên</div>
              <div className="px-4 py-3 text-center">Ảnh đại diện</div>
              <div className="px-4 py-3 text-center">Email</div>
              <div className="px-4 py-3 text-center">Số điện thoại</div>
              <div className="px-4 py-3 text-center">Địa chỉ</div>
              <div className="px-4 py-3 text-center">Trạng thái</div>
              <div className="px-4 py-3 text-center">Hành động</div>
            </div>

            {/* BODY */}
            <div className="divide-y divide-gray-100">
              {users.map((user) => {
                const checked = selectedIds.includes(user.id);
                return (
                  <div
                    key={user.id}
                    className={`${rowClass} hover:bg-gray-50 transition-colors`}
                    style={{ gridTemplateColumns: gridCols }}
                  >
                    {/* checkbox */}
                    <div className="px-4 py-4 flex items-center">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOne(user.id)}
                        className="w-4 h-4"
                      />
                    </div>

                    {/* Họ tên */}
                    <div className="px-4 py-4 font-medium text-gray-900">
                      {user.full_name}
                    </div>

                    {/* Avatar */}
                    <div className="px-4 py-4 flex items-center justify-center">
                      <div className="h-14 w-14 rounded-xl overflow-hidden border border-gray-200">
                        <img
                          src={user.avatar}
                          alt={user.full_name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="px-4 py-4 text-center text-gray-700">{user.email}</div>

                    {/* SĐT */}
                    <div className="px-4 py-4 text-center text-gray-700">{user.phone}</div>

                    {/* Địa chỉ */}
                    <div className="px-4 py-4 text-gray-700">
                      <span className="line-clamp-1">{user.address}</span>
                    </div>

                    {/* Trạng thái */}
                    <div className="px-4 py-4 flex items-center justify-center">
                      <span
                        className={[
                          "inline-flex items-center justify-center px-3 py-1 rounded-md font-semibold",
                          "min-w-[90px] text-center",
                          user.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-200 text-red-600",
                        ].join(" ")}
                      >
                        {user.status === "active" ? "Hoạt động" : "Tạm dừng"}
                      </span>
                    </div>

                    {/* Hành động */}
                    <div className="px-4 py-4 flex items-center justify-center">
                      <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                        <button
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-r border-gray-200"
                          onClick={() => handleEdit(user.id)}
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          className="px-3 py-2 hover:bg-red-50 text-red-500 cursor-pointer"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {users.length === 0 && (
                <div className="py-10 text-center text-gray-500">
                  Không có người dùng nào
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
