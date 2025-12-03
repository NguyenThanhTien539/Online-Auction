import { useMemo, useState } from "react";
import FilterBar from "@/components/admin/FilterBar";
import { Pencil, Trash2 } from "lucide-react";
import { useCategories } from "@/hooks/useCategory";
import { useNavigate } from "react-router-dom";

function formatDate(dateStr: string) {
  if (!dateStr) return "";

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";

<<<<<<< HEAD
const MOCK_DATA: CategoryItem[] = [
  {
    id: 1,
    name: "Tour trong nướcfjs dlkfjsdlkf jsdkfjk",
    status: "active",
    createdBy: "Le Van A",
    createdAt: "23:10 - 08/10/2025",
    updatedBy: "Le Van A",
    updatedAt: "14:44 - 12/10/2025",
  },
  {
    id: 2,
    name: "Tour nước ngoài",
    status: "active",
    createdBy: "Le Van A",
    createdAt: "23:10 - 08/10/2025",
    updatedBy: "Le Van A",
    updatedAt: "23:10 - 08/10/2025",
  },
  {
    id: 3,
    name: "Tour Miền Bắc",
    status: "active",
    createdBy: "Le Van A",
    createdAt: "23:12 - 08/10/2025",
    updatedBy: "Le Van A",
    updatedAt: "14:45 - 12/10/2025",
  },
  {
    id: 4,
    name: "Tour Miền Nam",
    status: "active",
    createdBy: "Le Van A",
    createdAt: "23:12 - 08/10/2025",
    updatedBy: "Le Van A",
    updatedAt: "14:46 - 12/10/2025",
  },
];
=======
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
}
>>>>>>> eab463a2a34b53317cbe972fd76e57885bc820ee

export default function CategoryList() {
  const navigate = useNavigate();
  const { items } = useCategories();

  // ================== FILTER STATE ==================
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [creatorFilter, setCreatorFilter] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [search, setSearch] = useState<string>("");

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

  // ================== FILTERED ITEMS ==================
  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        if (statusFilter !== "all" && item.status !== statusFilter)
          return false;
        if (creatorFilter && item.created_by !== creatorFilter) return false;
        if (dateFrom) {
          const from = new Date(dateFrom);
          if (new Date(item.created_at) < from) return false;
        }
        if (dateTo) {
          const to = new Date(dateTo);
          if (new Date(item.created_at) > to) return false;
        }
        if (search.trim()) {
          const key = search.toLowerCase();
          if (!item.name.toLowerCase().includes(key)) return false;
        }
        return true;
      }),
    [items, statusFilter, creatorFilter, dateFrom, dateTo, search]
  );

  // ================== CHECKBOX ==================
  const allChecked = useMemo(
    () =>
      filteredItems.length > 0 &&
      filteredItems.every((i) => selectedIds.includes(i.id)),
    [filteredItems, selectedIds]
  );

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

  const handleStatusFilterChange = (v: string) => {
    setStatusFilter(v as "all" | "active" | "inactive");
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setCreatorFilter("");
    setDateFrom("");
    setDateTo("");
    setSearch("");
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h2 className="font-semibold text-2xl sm:text-3xl mb-5">
        Quản lý danh mục
      </h2>

      <FilterBar
        showStatusFilter
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        statusOptions={[
          { value: "all", label: "Trạng thái" },
          { value: "active", label: "Hoạt động" },
          { value: "inactive", label: "Dừng" },
        ]}
        creatorFilter={creatorFilter}
        setCreatorFilter={setCreatorFilter}
        creatorOptions={creatorOptions}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        search={search}
        setSearch={setSearch}
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
      <div className="mt-5 bg-white rounded-2xl border border-gray-200 overflow-hidden hidden lg:block">
        <div className="w-full overflow-x-auto">
<<<<<<< HEAD
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col className="w-[8%]" /> {/* Checkbox */}
              <col className="w-[15%]" /> {/* Tên danh mục */}
              <col className="w-[12%]" /> {/* Trạng thái */}
              <col className="w-[22%]" /> {/* Tạo bởi */}
              <col className="w-[22%]" /> {/* Cập nhật bởi */}
              <col className="w-[11%]" /> {/* Hành động */}
            </colgroup>

            <thead className="bg-gray-50 text-gray-700">
              <tr className="[&>th]:px-4 [&>th]:py-4 [&>th]:font-semibold">
                <th className="text-left">
=======
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-left w-12">
>>>>>>> eab463a2a34b53317cbe972fd76e57885bc820ee
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
              {filteredItems.map((item) => {
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
<<<<<<< HEAD

                    <td className="font-medium text-gray-900 max-w-[300px] truncate" title={item.name}>
=======
                    <td className="px-4 py-4 font-medium text-gray-900 text-center">
>>>>>>> eab463a2a34b53317cbe972fd76e57885bc820ee
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
<<<<<<< HEAD

                    <td className="max-w-[220px]">
                      <div className="font-medium truncate" title={item.createdBy}>{item.createdBy}</div>
                      <div className="text-gray-500 text-xs mt-1 truncate" title={item.createdAt}>
                        {item.createdAt}
                      </div>
                    </td>

                    <td className="max-w-[220px]">
                      <div className="font-medium truncate" title={item.updatedBy}>{item.updatedBy}</div>
                      <div className="text-gray-500 text-xs mt-1 truncate" title={item.updatedAt}>
                        {item.updatedAt}
=======
                    <td className="px-4 py-4 text-center">
                      <div className="font-medium">
                        {item.created_by || "Không rõ"}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        {formatDate(item.created_at)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="font-medium">
                        {item.updated_by || "Không rõ"}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        {formatDate(item.updated_at)}
>>>>>>> eab463a2a34b53317cbe972fd76e57885bc820ee
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
        {filteredItems.length === 0 && (
          <div className="py-10 text-center text-gray-500">
            Không có danh mục nào phù hợp bộ lọc
          </div>
        )}
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="mt-5 space-y-4 lg:hidden">
        {filteredItems.map((item) => {
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
                    {formatDate(item.created_at)}
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
                    {formatDate(item.updated_at)}
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

        {filteredItems.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 py-10 text-center text-gray-500">
            Không có danh mục nào phù hợp bộ lọc
          </div>
        )}
      </div>
    </div>
  );
}
