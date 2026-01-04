import { useEffect, useMemo, useState } from "react";
import FilterBar from "@/components/admin/FilterBar";
import Pagination from "@/components/admin/Pagination";
import { Eye, Trash2, RotateCcw } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formatToVN } from "@/utils/format_time";
import { useFilters } from "@/hooks/useFilters";
import { toast } from "sonner";
import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import Loading from "@/components/common/Loading";
const LIMIT = 10;

type ProductItem = {
  product_id: number;
  product_name: string;
  is_removed: boolean;
  seller_id: string;
  creator_name?: string;
  created_at: string;
  edited_at?: string;
};

export default function ProductTrashPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const {
    creatorFilter,
    dateFrom,
    dateTo,
    search: searchFromUrl,
    handleCreatorFilterChange,
    handleDateFromChange,
    handleDateToChange,
    handleSearchChange,
    resetFilters,
  } = useFilters();

  // Local search state (giữ text gốc có dấu, không sync với slug từ URL)
  const [localSearch, setLocalSearch] = useState("");

  const fetchItems = () => {
    setIsPageLoading(true);

    fetch(
      `${import.meta.env.VITE_API_URL}/${
        import.meta.env.VITE_PATH_ADMIN
      }/api/product/list?page=${currentPage}&limit=${LIMIT}&creator=${creatorFilter}&dateFrom=${dateFrom}&dateTo=${dateTo}&search=${encodeURIComponent(
        searchFromUrl
      )}`,
      {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({ is_removed: true }),
        headers: {
          "Content-Type": "application/json",
        },
      }
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
  };

  const fetchTotal = () => {
    fetch(
      `${import.meta.env.VITE_API_URL}/${
        import.meta.env.VITE_PATH_ADMIN
      }/api/product/number-of-products?creator=${creatorFilter}&dateFrom=${dateFrom}&dateTo=${dateTo}&search=${encodeURIComponent(
        searchFromUrl
      )}`,
      {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({ is_removed: true }),
        headers: {
          "Content-Type": "application/json",
        },
      }
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
  };

  useEffect(() => {
    if (!searchFromUrl) {
      setLocalSearch("");
    }
  }, [searchFromUrl]);

  // Handler khi nhấn Enter trong search box
  const handleSearchSubmit = () => {
    if (localSearch.trim() !== searchFromUrl) {
      handleSearchChange(localSearch.trim());
    }
  };

  useEffect(() => {
    fetchTotal();
  }, [creatorFilter, dateFrom, dateTo, searchFromUrl]);

  useEffect(() => {
    fetchItems();
  }, [currentPage, creatorFilter, dateFrom, dateTo, searchFromUrl]);

  const handleRestore = (id: number) => {
    fetch(
      `${import.meta.env.VITE_API_URL}/${
        import.meta.env.VITE_PATH_ADMIN
      }/api/product/restore/${id}`,
      {
        credentials: "include",
        method: "PATCH",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          toast.success(data.message || "Khôi phục sản phẩm thành công");
          fetchItems();
          fetchTotal();
        } else {
          toast.error(data.message || "Khôi phục sản phẩm thất bại");
        }
      });
  };

  const handleView = (id: number) => {
    navigate(`/${import.meta.env.VITE_PATH_ADMIN}/product/detail/${id}`);
  };

  // ================== SELECTION ==================
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const creatorOptions: string[] = useMemo(
    () =>
      Array.from(
        new Set(
          items
            .map((i) => i.seller_id)
            .filter((v) => v != null)
            .map(String)
            .filter((v) => v.trim() !== "")
        )
      ),
    [items]
  );

  // ================== CHECKBOX ==================
  const allChecked = useMemo(
    () =>
      items.length > 0 &&
      items.every((i) => selectedIds.includes(i.product_id)),
    [items, selectedIds]
  );

  const toggleAll = () => {
    const itemIds = items.map((i) => i.product_id);
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
      <Loading className = "ml-[240px] bg-transparent"></Loading>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h2 className="font-semibold text-2xl sm:text-3xl mb-5">
        Thùng rác sản phẩm
      </h2>

      <FilterBar
        showStatusFilter
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
          { value: "restore", label: "Khôi phục" },
          { value: "delete", label: "Xóa vĩnh viễn" },
        ]}
        onApplyBulkAction={(action) => console.log(action, selectedIds)}
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
                  Tên sản phẩm
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700">
                  Tạo bởi
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => {
                const checked = selectedIds.includes(item.product_id);
                return (
                  <tr key={item.product_id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOne(item.product_id)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-900 text-center">
                      <span title={item.product_name}>
                        {item.product_name.split(" ").length > 5
                          ? item.product_name.split(" ").slice(0, 5).join(" ") +
                            "..."
                          : item.product_name}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="font-medium">
                        {item.creator_name || "Không rõ"}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        {formatToVN(item.created_at)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="cursor-pointer p-2 hover:bg-blue-50 text-blue-500 rounded-lg"
                          onClick={() => handleView(item.product_id)}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="cursor-pointer p-2 hover:bg-green-50 text-green-500 rounded-lg"
                          onClick={() => handleRestore(item.product_id)}
                        >
                          <RotateCcw size={18} />
                        </button>
                        <ConfirmDeleteButton
                          apiUrl={`${import.meta.env.VITE_API_URL}/${
                            import.meta.env.VITE_PATH_ADMIN
                          }/api/product/destroy/${item.product_id}`}
                          onSuccess={(data) => {
                            toast.success(data.message);
                            fetchItems();
                            fetchTotal();
                          }}
                          onError={(message) => toast.error(message)}
                          className=" cursor-pointer p-2 hover:bg-red-50 text-red-500 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </ConfirmDeleteButton>
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
            Không có sản phẩm nào trong thùng rác
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
          const checked = selectedIds.includes(item.product_id);
          return (
            <div
              key={item.product_id}
              className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleOne(item.product_id)}
                    className="w-4 h-4 mt-1"
                  />
                  <div>
                    <h3
                      className="font-semibold text-gray-900 text-lg"
                      title={item.product_name}
                    >
                      {item.product_name.split(" ").length > 5
                        ? item.product_name.split(" ").slice(0, 5).join(" ") +
                          "..."
                        : item.product_name}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tạo bởi:</span>
                  <span className="font-medium text-right">
                    {item.creator_name || "Không rõ"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày tạo:</span>
                  <span className="text-gray-700 text-xs text-right">
                    {formatToVN(item.created_at)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                  onClick={() => handleView(item.product_id)}
                >
                  <Eye size={16} />
                  <span className="font-medium">Xem</span>
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                  onClick={() => handleRestore(item.product_id)}
                >
                  <RotateCcw size={16} />
                  <span className="font-medium">Khôi phục</span>
                </button>
                <ConfirmDeleteButton
                  apiUrl={`${import.meta.env.VITE_API_URL}/${
                    import.meta.env.VITE_PATH_ADMIN
                  }/api/product/destroy/${item.product_id}`}
                  onSuccess={(data) => {
                    toast.success(data.message);
                    fetchItems();
                    fetchTotal();
                  }}
                  onError={(message) => toast.error(message)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                  <span className="font-medium">Xóa vĩnh viễn</span>
                </ConfirmDeleteButton>
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 py-10 text-center text-gray-500">
            Không có sản phẩm nào trong thùng rác
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
