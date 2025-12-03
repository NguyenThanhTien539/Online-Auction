import { useMemo, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import FilterBar from "@/components/admin/FilterBar";
import { useNavigate } from "react-router-dom";

type ProductItem = {
  id: number;
  name: string;
  status: "active" | "inactive";
  created_by: string;
  created_at: string;
  updated_by?: string;
  updated_at?: string;
};

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
}

export default function ProductListPage() {
  const navigate = useNavigate();
  const [items] = useState<ProductItem[]>([
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      status: "active",
      created_by: "Admin",
      created_at: "2025-01-12T09:15:00",
      updated_by: "Admin",
      updated_at: "2025-01-12T10:30:00",
    },
    {
      id: 2,
      name: "MacBook Air M3",
      status: "inactive",
      created_by: "John",
      created_at: "2025-01-10T14:22:00",
      updated_by: "John",
      updated_at: "2025-01-11T08:15:00",
    },
    {
      id: 3,
      name: "Tai nghe Airpods Pro 2",
      status: "active",
      created_by: "Anna",
      created_at: "2025-01-08T08:30:00",
      updated_by: "Anna",
      updated_at: "2025-01-09T14:20:00",
    },
    {
      id: 4,
      name: "iPad Pro M2",
      status: "active",
      created_by: "Admin",
      created_at: "2025-01-05T11:45:00",
      updated_by: "John",
      updated_at: "2025-01-06T16:30:00",
    },
  ] as ProductItem[]);

  // ========= FILTER STATE =========
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [creatorFilter, setCreatorFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // ========= CREATOR OPTIONS =========
  const creatorOptions: string[] = useMemo(
    () =>
      Array.from(
        new Set(
          items
            .map((i) => i.created_by)
            .filter((v) => v != null)
            .filter((v) => v.trim() !== "")
        )
      ),
    [items]
  );

  // ========= FILTERED LIST =========
  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        // Filter by status
        if (statusFilter !== "all" && item.status !== statusFilter)
          return false;

        // Filter by creator
        if (creatorFilter && item.created_by !== creatorFilter) return false;

        // Filter by search
        if (search.trim()) {
          const key = search.toLowerCase();
          if (!item.name.toLowerCase().includes(key)) return false;
        }

        // Filter by date range
        if (dateFrom) {
          const from = new Date(dateFrom);
          if (new Date(item.created_at) < from) return false;
        }
        if (dateTo) {
          const to = new Date(dateTo);
          if (new Date(item.created_at) > to) return false;
        }

        return true;
      }),
    [items, statusFilter, creatorFilter, search, dateFrom, dateTo]
  );

  const resetFilters = () => {
    setStatusFilter("all");
    setCreatorFilter("");
    setSearch("");
    setDateFrom("");
    setDateTo("");
  };

  // ========= CHECKBOX =========
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const allChecked =
    filteredItems.length > 0 &&
    filteredItems.every((i) => selectedIds.includes(i.id));

  const toggleAll = () => {
    const filteredIds = filteredItems.map((i) => i.id);
    setSelectedIds((prev) => {
      if (allChecked) return prev.filter((id) => !filteredIds.includes(id));
      const newSet = new Set([...prev, ...filteredIds]);
      return Array.from(newSet);
    });
  };

  const toggleOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ========= ACTIONS =========
  const handleView = (id: number) => {
    navigate(`/${import.meta.env.VITE_PATH_ADMIN}/product/${id}`);
  };

  const handleEdit = (id: number) => {
    console.log("Edit product:", id);
  };

  const handleDelete = (id: number) => {
    console.log("Delete product:", id);
  };

  const handleStatusFilterChange = (v: string) => {
    setStatusFilter(v as "all" | "active" | "inactive");
  };

  return (
    <div className="w-full min-h-screen px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
      <div className="max-w-[1600px] mx-auto">
        <h2 className="font-semibold text-xl sm:text-2xl lg:text-3xl mb-4 sm:mb-5">
          Quản lý sản phẩm
        </h2>

        <FilterBar
          statusFilter={statusFilter}
          setStatusFilter={handleStatusFilterChange}
          statusOptions={[
            { value: "all", label: "Trạng thái" },
            { value: "active", label: "Hoạt động" },
            { value: "inactive", label: "Ngừng" },
          ]}
          creatorFilter={creatorFilter}
          setCreatorFilter={setCreatorFilter}
          creatorOptions={creatorOptions}
          search={search}
          setSearch={setSearch}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          onResetFilters={resetFilters}
          bulkActionOptions={[
            { value: "active", label: "Kích hoạt" },
            { value: "inactive", label: "Ngừng hoạt động" },
            { value: "delete", label: "Xóa" },
          ]}
          onApplyBulkAction={(action) => console.log(action, selectedIds)}
        />

        {/* Desktop Table View */}
        <div className="mt-4 sm:mt-5 bg-white rounded-lg sm:rounded-xl lg:rounded-2xl border border-gray-200 overflow-hidden hidden lg:block">
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
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-center font-semibold text-gray-700 text-sm lg:text-base">
                    Tên sản phẩm
                  </th>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-center font-semibold text-gray-700 text-sm lg:text-base">
                    Trạng thái
                  </th>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-center font-semibold text-gray-700 text-sm lg:text-base">
                    Tạo bởi
                  </th>

                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-center font-semibold text-gray-700 text-sm lg:text-base">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((item) => {
                  const checked = selectedIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 lg:px-4 py-3 lg:py-4">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleOne(item.id)}
                          className="w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="px-3 lg:px-4 py-3 lg:py-4 font-medium text-gray-900 text-center text-sm lg:text-base">
                        {item.name}
                      </td>
                      <td className="px-3 lg:px-4 py-3 lg:py-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center px-2.5 lg:px-3 py-1 rounded-md text-xs lg:text-sm font-semibold min-w-[90px] ${
                            item.status === "active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-200 text-red-600"
                          }`}
                        >
                          {item.status === "active" ? "Hoạt động" : "Ngừng"}
                        </span>
                      </td>
                      <td className="px-3 lg:px-4 py-3 lg:py-4 text-center">
                        <div className="font-medium text-sm lg:text-base">
                          {item.created_by || "Không rõ"}
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                          {formatDate(item.created_at)}
                        </div>
                      </td>

                      <td className="px-3 lg:px-4 py-3 lg:py-4 text-center">
                        <div className="flex items-center justify-center gap-1 lg:gap-2">
                          <button
                            className="p-1.5 lg:p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"
                            onClick={() => handleView(item.id)}
                            title="Xem chi tiết"
                          >
                            <Eye
                              size={16}
                              className="lg:w-[18px] lg:h-[18px]"
                            />
                          </button>
                          <button
                            className="p-1.5 lg:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={() => handleEdit(item.id)}
                            title="Chỉnh sửa"
                          >
                            <Pencil
                              size={16}
                              className="lg:w-[18px] lg:h-[18px]"
                            />
                          </button>
                          <button
                            className="p-1.5 lg:p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                            onClick={() => handleDelete(item.id)}
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
          {filteredItems.length === 0 && (
            <div className="py-8 lg:py-10 text-center text-gray-500 text-sm lg:text-base">
              Không có sản phẩm nào phù hợp bộ lọc
            </div>
          )}
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:hidden">
          {filteredItems.map((item) => {
            const checked = selectedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleOne(item.id)}
                      className="w-4 h-4 mt-1 cursor-pointer flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 break-words">
                        {item.name}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                          item.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-200 text-red-600"
                        }`}
                      >
                        {item.status === "active" ? "Hoạt động" : "Ngừng"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs sm:text-sm mb-3 sm:mb-4">
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500 font-medium flex-shrink-0">
                      Tạo bởi:
                    </span>
                    <span className="font-medium text-gray-900 text-right">
                      {item.created_by || "Không rõ"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500 flex-shrink-0">
                      Ngày tạo:
                    </span>
                    <span className="text-gray-700 text-xs text-right">
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500 font-medium flex-shrink-0">
                      Cập nhật:
                    </span>
                    <span className="font-medium text-gray-900 text-right">
                      {item.updated_by || "Không rõ"}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
                  <button
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                    onClick={() => handleView(item.id)}
                  >
                    <Eye size={16} className="flex-shrink-0" />
                    <span className="font-medium text-xs sm:text-sm">
                      Xem chi tiết
                    </span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => handleEdit(item.id)}
                    >
                      <Pencil size={16} className="flex-shrink-0" />
                      <span className="font-medium text-xs sm:text-sm">
                        Sửa
                      </span>
                    </button>

                    <button
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 size={16} className="flex-shrink-0" />
                      <span className="font-medium text-xs sm:text-sm">
                        Xóa
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="col-span-full bg-white rounded-lg sm:rounded-xl border border-gray-200 py-8 sm:py-10 text-center text-gray-500 text-sm sm:text-base">
              Không có sản phẩm nào phù hợp bộ lọc
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
