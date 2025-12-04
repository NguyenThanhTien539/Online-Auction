/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { Eye, Check, X } from "lucide-react";
import FilterBar from "@/components/admin/FilterBar";
import { useNavigate } from "react-router-dom";
type BidderForm = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  status: "pending" | "accepted" | "rejected";
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

  return `${hours}:${minutes} - ${day}/${month}/${year}`;
}

export default function BidderFormListPage() {
  const navigate = useNavigate();
  const [list] = useState<BidderForm[]>([
    {
      id: 1,
      full_name: "Nguyễn Văn A",
      email: "vana@gmail.com",
      phone: "0123456789",
      created_at: "2024-12-01T10:30:00",
      status: "pending",
    },
    {
      id: 2,
      full_name: "Lê Thị B",
      email: "leb@gmail.com",
      phone: "0987654321",
      created_at: "2024-12-02T14:20:00",
      status: "pending",
    },
    {
      id: 3,
      full_name: "Phạm Văn C",
      email: "phamc@gmail.com",
      phone: "0345678901",
      created_at: "2024-11-28T09:15:00",
      status: "accepted",
    },
    {
      id: 4,
      full_name: "Trần Thị D",
      email: "trand@gmail.com",
      phone: "0912345678",
      created_at: "2024-11-25T16:45:00",
      status: "rejected",
    },
  ]);

  // ========= FILTER STATE =========
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "accepted" | "rejected"
  >("all");
  const [search, setSearch] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // ========= FILTERED LIST =========
  const filteredList = useMemo(
    () =>
      list.filter((item) => {
        // Filter by status
        if (statusFilter !== "all" && item.status !== statusFilter)
          return false;

        // Filter by search (name, email, phone)
        if (search.trim()) {
          const key = search.toLowerCase();
          if (
            !item.full_name.toLowerCase().includes(key) &&
            !item.email.toLowerCase().includes(key) &&
            !item.phone.toLowerCase().includes(key)
          ) {
            return false;
          }
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
    [list, statusFilter, search, dateFrom, dateTo]
  );

  const resetFilters = () => {
    setStatusFilter("all");
    setSearch("");
    setDateFrom("");
    setDateTo("");
  };

  // ========= CHECKBOX =========
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const allChecked =
    filteredList.length > 0 &&
    filteredList.every((item) => selectedIds.includes(item.id));

  const toggleAll = () => {
    const filteredIds = filteredList.map((i) => i.id);
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

  const handleStatusFilterChange = (v: string) => {
    setStatusFilter(v as "all" | "pending" | "accepted" | "rejected");
  };

  return (
    <div className="w-full min-h-screen px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
      <div className="max-w-[1600px] mx-auto">
        <h2 className="font-semibold text-xl sm:text-2xl lg:text-3xl mb-4 sm:mb-5">
          Quản lý form đăng ký
        </h2>

        <FilterBar
          statusFilter={statusFilter}
          setStatusFilter={handleStatusFilterChange}
          statusOptions={[
            { value: "all", label: "Trạng thái" },
            { value: "pending", label: "Chờ duyệt" },
            { value: "accepted", label: "Đã chấp nhận" },
            { value: "rejected", label: "Đã từ chối" },
          ]}
          search={search}
          setSearch={setSearch}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          onResetFilters={resetFilters}
          bulkActionOptions={[
            { value: "accept", label: "Chấp nhận" },
            { value: "reject", label: "Từ chối" },
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
                    Họ tên
                  </th>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-center font-semibold text-gray-700 text-sm lg:text-base">
                    Email
                  </th>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-center font-semibold text-gray-700 text-sm lg:text-base">
                    Số điện thoại
                  </th>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-center font-semibold text-gray-700 text-sm lg:text-base">
                    Ngày gửi
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
                {filteredList.map((item) => {
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
                        {item.full_name}
                      </td>
                      <td className="px-3 lg:px-4 py-3 lg:py-4 text-center text-gray-700 text-sm lg:text-base">
                        <div className="max-w-[200px] mx-auto truncate">
                          {item.email}
                        </div>
                      </td>
                      <td className="px-3 lg:px-4 py-3 lg:py-4 text-center text-gray-700 text-sm lg:text-base">
                        {item.phone}
                      </td>
                      <td className="px-3 lg:px-4 py-3 lg:py-4 text-center text-gray-600 text-xs lg:text-sm">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="px-3 lg:px-4 py-3 lg:py-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center px-2.5 lg:px-3 py-1 rounded-md text-xs lg:text-sm font-semibold min-w-[90px] ${
                            item.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : item.status === "accepted"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-200 text-red-600"
                          }`}
                        >
                          {item.status === "pending"
                            ? "Chờ duyệt"
                            : item.status === "accepted"
                            ? "Đã duyệt"
                            : "Từ chối"}
                        </span>
                      </td>
                      <td className="px-3 lg:px-4 py-3 lg:py-4 text-center">
                        <div className="flex items-center justify-center gap-1 lg:gap-2">
                          <button
                            className="p-1.5 lg:p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"
                            onClick={() => navigate(`/admin/bidder/form/detail/${item.id}`)}
                            title="Xem chi tiết"
                          >
                            <Eye
                              size={16}
                              className="lg:w-[18px] lg:h-[18px] cursor-pointer"
                            />
                          </button>
                          {item.status === "pending" && (
                            <>
                              <button
                                className="p-1.5 lg:p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors border border-green-200"
                                onClick={() => handleAccept(item.id)}
                                title="Chấp nhận"
                              >
                                <Check
                                  size={16}
                                  className="lg:w-[18px] lg:h-[18px]"
                                />
                              </button>
                              <button
                                className="p-1.5 lg:p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors border border-red-200"
                                onClick={() => handleReject(item.id)}
                                title="Từ chối"
                              >
                                <X
                                  size={16}
                                  className="lg:w-[18px] lg:h-[18px]"
                                />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredList.length === 0 && (
            <div className="py-8 lg:py-10 text-center text-gray-500 text-sm lg:text-base">
              Không có form nào phù hợp bộ lọc
            </div>
          )}
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:hidden">
          {filteredList.map((item) => {
            const checked = selectedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleOne(item.id)}
                      className="w-4 h-4 mt-1 cursor-pointer flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1">
                        {item.full_name}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                          item.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : item.status === "accepted"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-200 text-red-600"
                        }`}
                      >
                        {item.status === "pending"
                          ? "Chờ duyệt"
                          : item.status === "accepted"
                          ? "Đã duyệt"
                          : "Từ chối"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs sm:text-sm mb-3 sm:mb-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500 font-medium">Email:</span>
                    <span className="font-medium text-gray-900 break-all">
                      {item.email}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500 font-medium">
                      Số điện thoại:
                    </span>
                    <span className="font-medium text-gray-900">
                      {item.phone}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500 font-medium">Ngày gửi:</span>
                    <span className="text-gray-700">
                      {formatDate(item.created_at)}
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

                  {item.status === "pending" && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors border border-green-200"
                        onClick={() => handleAccept(item.id)}
                      >
                        <Check size={16} className="flex-shrink-0" />
                        <span className="font-medium text-xs sm:text-sm">
                          Chấp nhận
                        </span>
                      </button>

                      <button
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200"
                        onClick={() => handleReject(item.id)}
                      >
                        <X size={16} className="flex-shrink-0" />
                        <span className="font-medium text-xs sm:text-sm">
                          Từ chối
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredList.length === 0 && (
            <div className="col-span-full bg-white rounded-lg sm:rounded-xl border border-gray-200 py-8 sm:py-10 text-center text-gray-500 text-sm sm:text-base">
              Không có form nào phù hợp bộ lọc
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
