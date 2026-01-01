import { useEffect, useMemo, useState } from "react";
import FilterBar from "@/components/admin/FilterBar";
import Pagination from "@/components/admin/Pagination";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formatToVN } from "@/utils/format_time";
import type { CategoryItem } from "@/interface/category.interface";
import { useFilters } from "@/hooks/useFilters";
import { slugify } from "@/utils/make_slug";
const LIMIT = 5;

export default function CategoryList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const {
    statusFilter,
    creatorFilter,
    dateFrom,
    dateTo,
    search: searchFromUrl,
    handleStatusFilterChange,
    handleCreatorFilterChange,
    handleDateFromChange,
    handleDateToChange,
    handleSearchChange,
    resetFilters,
  } = useFilters();

  // Local search state (giữ text gốc có dấu, không sync với slug từ URL)
  const [localSearch, setLocalSearch] = useState("");

  useEffect(() => {
    if (!searchFromUrl) {
      setLocalSearch("");
    }
  }, [searchFromUrl]);

  // Handler khi nhấn Enter trong search box
  const handleSearchSubmit = () => {
    const slugified = slugify(localSearch);
    if (slugified !== searchFromUrl) {
      // Slugify search term trước khi lưu vào URL, nhưng giữ nguyên localSearch
      handleSearchChange(slugified);
    }
  };

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/${
        import.meta.env.VITE_PATH_ADMIN
      }/api/category/number-of-categories?status=${statusFilter}&creator=${creatorFilter}&dateFrom=${dateFrom}&dateTo=${dateTo}&search=${slugify(
        searchFromUrl
      )}`,
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
  }, [statusFilter, creatorFilter, dateFrom, dateTo, searchFromUrl]);

  useEffect(() => {
    setIsPageLoading(true);

    fetch(
      `${import.meta.env.VITE_API_URL}/${
        import.meta.env.VITE_PATH_ADMIN
      }/api/category/list?page=${currentPage}&limit=${LIMIT}&status=${statusFilter}&creator=${creatorFilter}&dateFrom=${dateFrom}&dateTo=${dateTo}&search=${slugify(
        searchFromUrl
      )}`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => {
        setItems(data.list);
        setIsLoading(false);
        setIsPageLoading(false);
      })
      .catch(() => {
        setItems([]);
        setIsLoading(false);
        setIsPageLoading(false);
      });
  }, [
    currentPage,
    statusFilter,
    creatorFilter,
    dateFrom,
    dateTo,
    searchFromUrl,
  ]);

  // ================== SELECTION ==================
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const creatorOptions: string[] = useMemo(
    () =>
      Array.from(
        new Set(
          items
            .map((i) => i.created_by)
            .filter((v) => v != null)
            .map(String)
            .filter((v) => v.trim() !== "")
        )
      ),
    [items]
  );

  // ================== CHECKBOX ==================
  const allChecked = useMemo(
    () => items.length > 0 && items.every((i) => selectedIds.includes(i.id)),
    [items, selectedIds]
  );

  const toggleAll = () => {
    const itemIds = items.map((i) => i.id);
    setSelectedIds((prev) => {
      if (allChecked) return prev.filter((id) => !itemIds.includes(id));
      const newSet = new Set([...prev, ...itemIds]);
      return Array.from(newSet);
    });
  };

  const toggleOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h2 className="font-semibold text-2xl sm:text-3xl mb-5">
        Quản lý danh mục
      </h2>

      <FilterBar
        showStatusFilter
        statusFilter={statusFilter}
        setStatusFilter={handleStatusFilterChange}
        statusOptions={[
          { value: "all", label: "Trạng thái" },
          { value: "active", label: "Hoạt động" },
          { value: "inactive", label: "Dừng" },
        ]}
        creatorFilter={creatorFilter}
        setCreatorFilter={handleCreatorFilterChange}
        creatorOptions={creatorOptions}
        dateFrom={dateFrom}
        setDateFrom={handleDateFromChange}
        dateTo={dateTo}
        setDateTo={handleDateToChange}
        search={localSearch}
        setSearch={setLocalSearch}
        onSearchSubmit={handleSearchSubmit}
        onResetFilters={resetFilters}
        bulkActionOptions={[
          { value: "active", label: "Cho hoạt động" },
          { value: "inactive", label: "Tạm dừng" },
          { value: "delete", label: "Xóa" },
        ]}
        onApplyBulkAction={(action) => console.log(action, selectedIds)}
        onCreateNew={() => navigate("/admin/category/create")}
      />

      {/* Desktop Table View */}
      <div className="mt-5 bg-white rounded-2xl border border-gray-200 overflow-hidden hidden lg:block relative">
        {isPageLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-left w-12">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    className="w-4 h-4"
                  />
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700">
                  Tên danh mục
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700">
                  Trạng thái
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700">
                  Tạo bởi
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700">
                  Cập nhật bởi
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => {
                const checked = selectedIds.includes(item.id);
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOne(item.id)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-900 text-center">
                      {item.name}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center px-3 py-1 rounded-md font-semibold min-w-[90px] ${
                          item.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-200 text-red-600"
                        }`}
                      >
                        {item.status === "active" ? "Hoạt động" : "Dừng"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="font-medium">
                        {item.created_by || "Không rõ"}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        {formatToVN(item.created_at)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="font-medium">
                        {item.updated_by || "Không rõ"}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        {formatToVN(item.updated_at)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          onClick={() =>
                            navigate(
                              `/${
                                import.meta.env.VITE_PATH_ADMIN
                              }/category/edit/${item.id}`
                            )
                          }
                        >
                          <Pencil size={18} />
                        </button>
                        <button className="p-2 hover:bg-red-50 text-red-500 rounded-lg">
                          <Trash2 size={18} />
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
          <div className="py-10 text-center text-gray-500">
            Không có danh mục nào phù hợp bộ lọc
          </div>
        )}
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="mt-5 space-y-4 lg:hidden relative">
        {isPageLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-10 rounded-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        {items.map((item) => {
          const checked = selectedIds.includes(item.id);
          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleOne(item.id)}
                    className="w-4 h-4 mt-1"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {item.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold mt-1 ${
                        item.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-200 text-red-600"
                      }`}
                    >
                      {item.status === "active" ? "Hoạt động" : "Dừng"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tạo bởi:</span>
                  <span className="font-medium text-right">
                    {item.created_by || "Không rõ"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày tạo:</span>
                  <span className="text-gray-700 text-xs text-right">
                    {formatToVN(item.created_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cập nhật bởi:</span>
                  <span className="font-medium text-right">
                    {item.updated_by || "Không rõ"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày cập nhật:</span>
                  <span className="text-gray-700 text-xs text-right">
                    {formatToVN(item.updated_at)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() =>
                    navigate(
                      `/${import.meta.env.VITE_PATH_ADMIN}/category/edit/${
                        item.id
                      }`
                    )
                  }
                >
                  <Pencil size={16} />
                  <span className="font-medium">Sửa</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
                  <Trash2 size={16} />
                  <span className="font-medium">Xóa</span>
                </button>
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 py-10 text-center text-gray-500">
            Không có danh mục nào phù hợp bộ lọc
          </div>
        )}
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        isPageLoading={isPageLoading}
      />
    </div>
  );
}
