/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Eye, Check, X } from "lucide-react";
import FilterBar from "@/components/admin/FilterBar";

type BidderForm = {
  id: number;
  full_name: string;
  email: string;
  status: "pending" | "accepted" | "rejected";
};

export default function BidderFormListPage() {
  // ========= DỮ LIỆU GIẢ =========
  const [list] = useState<BidderForm[]>([
    {
      id: 1,
      full_name: "Nguyễn Văn A",
      email: "vana@gmail.com",
      status: "pending",
    },
    { id: 2, full_name: "Lê Thị B", email: "leb@gmail.com", status: "pending" },
    {
      id: 3,
      full_name: "Phạm Văn C",
      email: "phamc@gmail.com",
      status: "accepted",
    },
  ]);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const allChecked = selectedIds.length === list.length;
  const toggleAll = () => {
    setSelectedIds(allChecked ? [] : list.map((i) => i.id));
  };

  const toggleOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ========= ACTION =========
  const handleView = (id: number) => {
    console.log("Xem chi tiết form:", id);
  };

  const handleAccept = (id: number) => {
    console.log("Chấp nhận:", id);
  };

  const handleReject = (id: number) => {
    console.log("Từ chối:", id);
  };

  // GRID COLUMN
  const gridCols =
    "60px minmax(220px, 2fr) minmax(120px, 1fr) minmax(160px, 1.5fr) minmax(90px, 0.7fr) minmax(90px, 0.5fr)";
  const rowClass = "grid items-center text-sm text-gray-700";

  return (
    <>
      <h2 className="font-[600] text-3xl mb-10">Quản lý form đăng ký</h2>
      <FilterBar />
      <div className="mt-5 bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div className="w-full">
            {/* HEADER */}
            <div
              className="grid bg-gray-50 text-gray-700 border-b font-semibold"
              style={{ gridTemplateColumns: gridCols }}
            >
              <div className="px-4 py-3 flex items-center">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                />
              </div>
              <div className="px-4 py-3 text-center">Họ tên</div>
              <div className="px-4 py-3 text-center">Email</div>
              <div className="px-4 py-3 text-center">Xem chi tiết</div>
              <div className="px-4 py-3 text-center">Chấp nhận / Từ chối</div>
            </div>

            {/* BODY */}
            {list.map((item) => {
              const checked = selectedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`${rowClass} hover:bg-gray-50 transition`}
                  style={{ gridTemplateColumns: gridCols }}
                >
                  {/* checkbox */}
                  <div className="px-4 py-4 flex items-center">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleOne(item.id)}
                    />
                  </div>

                  {/* name */}
                  <div className="px-4 py-4 text-center font-medium text-gray-900">
                    {item.full_name}
                  </div>

                  {/* email */}
                  <div className="px-4 py-4 text-center text-gray-700">
                    {item.email}
                  </div>

                  {/* Xem */}
                  <div className="px-4 py-4 flex justify-center">
                    <button
                      onClick={() => handleView(item.id)}
                      className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-100"
                    >
                      <Eye size={18} />
                    </button>
                  </div>

                  {/* Accept / Reject */}
                  <div className="px-4 py-4 flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleAccept(item.id)}
                      className="px-3 py-2 rounded-lg border border-green-400 text-green-600 hover:bg-green-50 cursor-pointer"
                    >
                      <Check size={18} />
                    </button>

                    <button
                      onClick={() => handleReject(item.id)}
                      className="px-3 py-2 rounded-lg border border-red-400 text-red-500 hover:bg-red-50 cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              );
            })}

            {list.length === 0 && (
              <div className="py-10 text-center text-gray-500">
                Không có form nào
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
