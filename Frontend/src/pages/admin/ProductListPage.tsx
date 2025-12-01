import FilterBar from "@/components/admin/FilterBar";
import { Trash2, Eye, Pencil } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function ProductListPage() {
  // -----------------------------
  // ⭐ DỮ LIỆU GIẢ
  // -----------------------------
  const [items, setItems] = useState([
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      status: "active",
      created_by: "Admin",
      created_at: "2025-01-12T09:15:00",
    },
    {
      id: 2,
      name: "MacBook Air M3",
      status: "inactive",
      created_by: "John",
      created_at: "2025-01-10T14:22:00",
    },
    {
      id: 3,
      name: "Tai nghe Airpods Pro 2",
      status: "active",
      created_by: "Anna",
      created_at: "2025-01-08T08:30:00",
    },
  ]);

  const formatDate = (date: any) => {
    return new Date(date).toLocaleString("vi-VN");
  };

  const rowClass = "grid items-center text-sm text-gray-700";
  const gridCols =
    "60px minmax(220px, 2fr) minmax(120px, 1fr) minmax(160px, 1.5fr) minmax(90px, 0.7fr) minmax(90px, 0.7fr)";
  return (
    <>
      <h2 className="font-[600] text-3xl mb-10">Quản lý sản phẩm</h2>

      <FilterBar />

      <div className="mt-5 bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <div
              className={`grid text-sm bg-gray-50 text-gray-700 border-b font-semibold`}
              style={{ gridTemplateColumns: gridCols }}
            >
              <div className="px-4 py-3 text-left">
                <input type="checkbox" className="w-4 h-4" />
              </div>

              <div className="px-4 py-3 text-center">Tên sản phẩm</div>
              <div className="px-4 py-3 text-center">Trạng thái</div>
              <div className="px-4 py-3 text-center">Tạo bởi</div>
              <div className="px-4 py-3 text-center">Xem chi tiết</div>
              <div className="px-4 py-3 text-center">Xóa</div>
            </div>

            <div className="divide-y divide-gray-100">
              {items.map((item) => {
                return (
                  <div
                    key={item.id}
                    className={`${rowClass} hover:bg-gray-50 transition-colors`}
                    style={{ gridTemplateColumns: gridCols }}
                  >
                    <div className="px-4 py-4 flex items-center justify-start">
                      <input type="checkbox" className="w-4 h-4" />
                    </div>

                    <div className="px-4 py-4 font-medium text-gray-900 text-center">
                      {item.name}
                    </div>

                    <div className="px-4 py-4 flex items-center justify-center">
                      <span
                        className={[
                          "inline-flex items-center justify-center px-3 py-1 rounded-md font-semibold",
                          "min-w-[90px] text-center",
                          item.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-200 text-red-600",
                        ].join(" ")}
                      >
                        {item.status === "active" ? "Hoạt động" : "Ngừng"}
                      </span>
                    </div>

                    <div className="px-4 py-4 text-center">
                      <div className="font-medium">
                        {item.created_by || "Không rõ"}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        {formatDate(item.created_at)}
                      </div>
                    </div>

                    <div className="px-4 py-4 flex items-center justify-center">
                      <button className="px-3 py-2 hover:bg-gray-100 cursor-pointer border border-gray-200 rounded-lg">
                        <Eye size={18} />
                      </button>
                    </div>

                    <div className="px-4 py-4 flex items-center justify-center">
                      <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                        <button className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                          <Pencil size={18} />
                        </button>
                        <button className="px-3 py-2 hover:bg-red-50 text-red-500">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {items.length === 0 && (
                <div className="py-10 text-center text-gray-500">
                  Không có sản phẩm nào
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
