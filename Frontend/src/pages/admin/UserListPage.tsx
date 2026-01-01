/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import FilterBar from "@/components/admin/FilterBar";
import Pagination from "@/components/admin/Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFilters } from "@/hooks/useFilters";
import { slugify } from "@/utils/make_slug";

type UserItem = {
  user_id: number;
  full_name: string;
  avatar: string;
  email: string;
  role: string;
};

const LIMIT = 5;

export default function UserListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const {
    search,
    handleSearchChange,
    statusFilter,
    handleStatusFilterChange,
    resetFilters,
  } = useFilters();

  // Local search state (giữ text gốc có dấu, không sync với slug từ URL)
  const [localSearch, setLocalSearch] = useState("");

  // Chỉ clear local search khi reset filters (searchFromUrl = "")
  useEffect(() => {
    if (!search) {
      setLocalSearch("");
    }
  }, [search]);

  // Handler khi nhấn Enter trong search box
  const handleSearchSubmit = () => {
    const slugified = slugify(localSearch);
    if (slugified !== search) {
      handleSearchChange(slugified);
    }
  };

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/${
        import.meta.env.VITE_PATH_ADMIN
      }/api/user/number-of-users?&search=${search}&status=${statusFilter}`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          const total = data.total as number;
          setTotalPages(Math.ceil(total / LIMIT));
          const newTotalPages = Math.ceil(total / LIMIT);
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setSearchParams((prev) => ({
              ...Object.fromEntries(prev),
              page: "1",
            }));
          }
        } else {
          setTotalPages(1);
        }
      });
  }, [search, statusFilter]);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/${
        import.meta.env.VITE_PATH_ADMIN
      }/api/user/list?&search=${encodeURIComponent(
        search
      )}&page=${currentPage}&limit=${LIMIT}&status=${statusFilter}`,
      {
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          setItems(data.list);
          setIsLoading(false);
          setIsPageLoading(false);
        }
      })
      .catch(() => {
        setItems([]);
        setIsLoading(false);
        setIsPageLoading(false);
      });
  }, [search, currentPage, statusFilter]);

  // Helper function to get initials from full name
  const getInitials = (name: string) => {
    const words = name.trim().split(" ");
    if (words.length === 0) return "?";
    const lastWord = words[words.length - 1];
    return lastWord.charAt(0).toUpperCase();
  };

  return (
    <div className="w-full min-h-screen px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
      <div className="max-w-[1600px] mx-auto">
        <h2 className="font-semibold text-xl sm:text-2xl lg:text-3xl mb-4 sm:mb-5">
          Quản lý người dùng
        </h2>

        <FilterBar
          showStatusFilter
          statusFilter={statusFilter}
          setStatusFilter={handleStatusFilterChange}
          statusOptions={[
            { value: "all", label: "Trạng thái" },
            { value: "user", label: "Người dùng" },
            { value: "seller", label: "Người bán" },
          ]}
          search={localSearch}
          setSearch={setLocalSearch}
          onSearchSubmit={handleSearchSubmit}
          onResetFilters={resetFilters}
        />

        {/* Desktop Table View - Hidden on screens < 1280px */}
        <div className="mt-4 sm:mt-5 bg-white rounded-lg sm:rounded-xl lg:rounded-2xl border border-gray-200 overflow-hidden hidden xl:block">
          <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-left font-semibold text-gray-700 text-sm lg:text-base">
                    Họ tên
                  </th>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-center font-semibold text-gray-700 text-sm lg:text-base">
                    Email
                  </th>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-center font-semibold text-gray-700 text-sm lg:text-base">
                    Quyền người dùng
                  </th>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-center font-semibold text-gray-700 text-sm lg:text-base">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((user) => {
                  return (
                    <tr
                      key={user.user_id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 lg:px-4 py-3 lg:py-4">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg lg:rounded-xl overflow-hidden border border-gray-200 shrink-0">
                              <img
                                src={user.avatar}
                                alt={user.full_name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg lg:rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold text-sm lg:text-base shrink-0">
                              {getInitials(user.full_name)}
                            </div>
                          )}
                          <span className="font-medium text-gray-900 text-sm lg:text-base">
                            {user.full_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 lg:px-4 py-3 lg:py-4 text-center text-gray-700 text-sm lg:text-base">
                        <div className="max-w-[200px] mx-auto truncate">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-3 lg:px-4 py-3 lg:py-4 text-center text-gray-700 text-sm lg:text-base">
                        {user.role === "user"
                          ? "Người dùng"
                          : user.role === "seller"
                          ? "Người bán"
                          : user.role === "admin"
                          ? "Quản trị viên"
                          : user.role}
                      </td>

                      <td className="px-3 lg:px-4 py-3 lg:py-4 text-center">
                        <div className="flex items-center justify-center gap-1 lg:gap-2">
                          <button
                            className="p-1.5 lg:p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            onClick={() =>
                              navigate(`/admin/user/detail/${user.user_id}`)
                            }
                            title="Chỉnh sửa"
                          >
                            <Pencil
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
          {items.length === 0 && (
            <div className="py-8 lg:py-10 text-center text-gray-500 text-sm lg:text-base">
              Không có người dùng nào phù hợp bộ lọc
            </div>
          )}
        </div>

        {/* Tablet/Mobile Card View - Show on screens < 1280px */}
        <div className="mt-4 sm:mt-5 grid grid-row-1 sm:grid-row-2 gap-3 sm:gap-4 xl:hidden">
          {items.map((user) => {
            return (
              <div
                key={user.user_id}
                className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                  {user.avatar ? (
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 shrink-0">
                      <img
                        src={user.avatar}
                        alt={user.full_name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg sm:rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold text-xl sm:text-2xl shrink-0">
                      {getInitials(user.full_name)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1">
                      {user.full_name}
                    </h3>
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
                      Quyền người dùng:
                    </span>
                    <span className="font-medium text-gray-900">
                      {user.role === "user"
                        ? "Người dùng"
                        : user.role === "seller"
                        ? "Người bán"
                        : user.role === "admin"
                        ? "Quản trị viên"
                        : user.role}
                    </span>
                  </div>
                </div>

                {/* Buttons - Vertical on mobile, Horizontal on larger screens */}
                <div className="flex flex-col xs:flex-row gap-2 pt-3 sm:pt-4 border-t border-gray-100">
                  <button
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    onClick={() =>
                      navigate(`/admin/user/detail/${user.user_id}`)
                    }
                  >
                    <Pencil size={16} className="shrink-0" />
                    <span className="font-medium text-xs sm:text-sm">Sửa</span>
                  </button>
                </div>
              </div>
            );
          })}

          {items.length === 0 && (
            <div className="col-span-full bg-white rounded-lg sm:rounded-xl border border-gray-200 py-8 sm:py-10 text-center text-gray-500 text-sm sm:text-base">
              Không có người dùng nào phù hợp bộ lọc
            </div>
          )}
        </div>

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          isPageLoading={isPageLoading}
        />
      </div>
    </div>
  );
}
