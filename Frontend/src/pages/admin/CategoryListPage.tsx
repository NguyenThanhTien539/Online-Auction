import { useMemo, useState } from "react";
import FilterBar from "@/components/admin/FilterBar";
import { Pencil, Trash2 } from "lucide-react";
import { useCategories } from "@/hooks/useCategory";
import { useNavigate } from "react-router-dom";

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

export default function CategoryList() {
  const navigate = useNavigate();
  const { items } = useCategories();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const allChecked = useMemo(
    () => items.length > 0 && selectedIds.length === items.length,
    [items, selectedIds]
  );

  const toggleAll = () => {
    if (allChecked) setSelectedIds([]);
    else setSelectedIds(items.map((i) => i.id));
  };

  const toggleOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const gridCols = "48px 1.2fr 0.9fr 1.3fr 1.3fr 0.8fr";
  const rowClass = "grid w-full text-sm";
  const headerRowClass =
    "grid w-full bg-gray-50 text-gray-700 font-semibold text-sm border-b border-gray-200";

  return (
    <>
      <h2 className="font-[600] text-3xl mb-5">Quản lý danh mục</h2>
      <FilterBar
        onCreateClick={() => navigate("/admin/category/create")}
        createLabel="+ Thêm sản phẩm"
      />
      {/* ===== TABLE GRID ===== */}
      <div className="mt-5 bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Header */}
            <div
              className={headerRowClass}
              style={{ gridTemplateColumns: gridCols }}
            >
              <div className="px-4 py-4 flex items-center justify-start">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  className="w-4 h-4"
                />
              </div>

              <div className="px-4 py-4 text-center">Tên danh mục</div>
              <div className="px-4 py-4 text-center whitespace-nowrap">
                Trạng thái
              </div>
              <div className="px-4 py-4 text-center whitespace-nowrap">
                Tạo bởi
              </div>
              <div className="px-4 py-4 text-center whitespace-nowrap">
                Cập nhật bởi
              </div>
              <div className="px-4 py-4 text-center whitespace-nowrap">
                Hành động
              </div>
            </div>

            {/* Body */}
            <div className="divide-y divide-gray-100">
              {items.map((item) => {
                const checked = selectedIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className={`${rowClass} hover:bg-gray-50 transition-colors`}
                    style={{ gridTemplateColumns: gridCols }}
                  >
                    <div className="px-4 py-4 flex items-center justify-start">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOne(item.id)}
                        className="w-4 h-4"
                      />
                    </div>

                    <div className="px-4 py-4 font-medium text-gray-900 text-center">
                      {item.name}
                    </div>

                    <div className="px-4 py-4 flex items-center justify-center">
                      <span
                        className={[
                          "inline-flex items-center justify-center px-3 py-1 rounded-md font-semibold",
                          "min-w-[90px] text-center", // ✅ cố định chiều ngang
                          item.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-200 text-red-600",
                        ].join(" ")}
                      >
                        {item.status === "active" ? "Hoạt động" : "Dừng"}
                      </span>
                    </div>

                    <div className="px-4 py-4 text-center">
                      <div className="font-medium">
                        {item.created_by ? item.created_by : "Không rõ"}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        {formatDate(item.created_at)}
                      </div>
                    </div>

                    <div className="px-4 py-4 text-center">
                      <div className="font-medium">
                        {item.updated_by ? item.updated_by : "Không rõ"}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        {formatDate(item.updated_at)}
                      </div>
                    </div>

                    <div className="px-4 py-4 flex items-center justify-center">
                      <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            navigate(
                              `/${
                                import.meta.env.VITE_PATH_ADMIN
                              }/category/edit/${item.id}`
                            );
                          }}
                        >
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
                  Không có danh mục nào
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
