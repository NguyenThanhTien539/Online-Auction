/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from "react";
import { Eye, Check, X } from "lucide-react";
import FilterBar from "@/components/admin/FilterBar";
import Pagination from "@/components/admin/Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFilters } from "@/hooks/useFilters";
import { formatToVN } from "@/utils/format_time";
import { slugify } from "@/utils/make_slug";
import Loading from "@/components/common/Loading";
type BidderForm = {
  id: number;
  full_name: string;
  email: string;
  created_at: string;
  status: "pending" | "accepted" | "rejected";
};

const LIMIT = 10;

export default function BidderFormListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [list, setList] = useState<BidderForm[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState(1);
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const {
    statusFilter,
    dateFrom,
    dateTo,
    search: searchFromUrl,
    handleStatusFilterChange,
    handleDateFromChange,
    handleDateToChange,
    handleSearchChange,
    resetFilters,
  } = useFilters();

  // Local search state (giữ text gốc có dấu, không sync với slug từ URL)
  const [localSearch, setLocalSearch] = useState("");

  // Chỉ clear local search khi reset filters (searchFromUrl = "")
  useEffect(() => {
    if (!searchFromUrl) {
      setLocalSearch("");
    }
  }, [searchFromUrl]);

  // Handler khi nhấn Enter trong search box
  const handleSearchSubmit = () => {
    const slugified = slugify(localSearch);
    if (slugified !== searchFromUrl) {
      handleSearchChange(slugified);
    }
  };

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/${
        import.meta.env.VITE_PATH_ADMIN
      }/api/application-form/number-of-forms?status=${statusFilter}&dateFrom=${dateFrom}&dateTo=${dateTo}&search=${searchFromUrl}`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => {
        const total = data.total as number;
        setTotalPages(Math.ceil(total / LIMIT));
        const newTotalPages = Math.ceil(total / LIMIT);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setSearchParams((prev) => ({
            ...Object.fromEntries(prev),
            page: "1",
          }));
        }
      });
  }, [statusFilter, dateFrom, dateTo, searchFromUrl]);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/${
        import.meta.env.VITE_PATH_ADMIN
      }/api/application-form/list?page=${currentPage}&limit=${LIMIT}&status=${statusFilter}&dateFrom=${dateFrom}&dateTo=${dateTo}&search=${searchFromUrl}`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          setList(data.list);
        } else {
          setList([]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentPage, statusFilter, dateFrom, dateTo, searchFromUrl]);

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
          search={localSearch}
          setSearch={setLocalSearch}
          onSearchSubmit={handleSearchSubmit}
          dateFrom={dateFrom}
          setDateFrom={handleDateFromChange}
          dateTo={dateTo}
          setDateTo={handleDateToChange}
          onResetFilters={resetFilters}
          bulkActionOptions={[
            { value: "accepted", label: "Chấp nhận" },
            { value: "rejected", label: "Từ chối" },
          ]}
        />

        {isLoading ? (
          <Loading className = "ml-[240px] bg-transparent"></Loading>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="mt-4 sm:mt-5 bg-white rounded-lg sm:rounded-xl lg:rounded-2xl border border-gray-200 overflow-hidden hidden lg:block">
              <div className="w-full overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 lg:px-4 py-3 lg:py-4 text-center font-semibold text-gray-700 text-sm lg:text-base">
                        Họ tên
                      </th>
                      <th className="px-3 lg:px-4 py-3 lg:py-4 text-center font-semibold text-gray-700 text-sm lg:text-base">
                        Email
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
                    {list.map((item) => {
                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-3 lg:px-4 py-3 lg:py-4  text-gray-900 text-center text-sm lg:text-base">
                            {item.full_name}
                          </td>
                          <td className="px-3 lg:px-4 py-3 lg:py-4 text-center text-gray-900 text-sm lg:text-base">
                            <div className="max-w-[200px] mx-auto truncate">
                              {item.email}
                            </div>
                          </td>

                          <td className="px-3 lg:px-4 py-3 lg:py-4 text-center text-gray-900 text-sm lg:text-base">
                            {formatToVN(item.created_at)}
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
                                onClick={() =>
                                  navigate(
                                    `/admin/seller/application/detail/${item.id}`
                                  )
                                }
                                title="Xem chi tiết"
                              >
                                <Eye
                                  size={16}
                                  className="lg:w-[18px] lg:h-[18px] cursor-pointer"
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
              {list.length === 0 && (
                <div className="py-8 lg:py-10 text-center text-gray-500 text-sm lg:text-base">
                  Không có dữ liệu
                </div>
              )}
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:hidden">
              {list.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 mt-1 cursor-pointer shrink-0"
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
                        <span className="text-gray-500 font-medium">
                          Email:
                        </span>
                        <span className="font-medium text-gray-900 break-all">
                          {item.email}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-gray-500 font-medium">
                          Ngày gửi:
                        </span>
                        <span className="text-gray-700">
                          {formatToVN(item.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
                      <button className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors">
                        <Eye size={16} className="shrink-0" />
                        <span className="font-medium text-xs sm:text-sm">
                          Xem chi tiết
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {list.length === 0 && (
                <div className="col-span-full bg-white rounded-lg sm:rounded-xl border border-gray-200 py-8 sm:py-10 text-center text-gray-500 text-sm sm:text-base">
                  Không có dữ liệu
                </div>
              )}
            </div>
          </>
        )}

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          isPageLoading={isLoading}
        />
      </div>
    </div>
  );
}
