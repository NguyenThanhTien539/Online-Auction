import { useEffect, useMemo, useState } from "react";
import FilterBar from "@/components/admin/FilterBar";
import { Pencil, Trash2 } from "lucide-react";

type CategoryStatus = "active" | "inactive";

type CategoryItem = {
  id: number;
  name: string;
  status: CategoryStatus;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
};

const MOCK_DATA: CategoryItem[] = [
  {
    id: 1,
    name: "Tour trong nước",
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

export default function CategoryList() {
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    setItems(MOCK_DATA);
  }, []);

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

  const handleEdit = (id: number) => console.log("edit", id);

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  return (
    <>
      <h2 className="font-[600] text-3xl mb-5">Quản lý danh mục</h2>
      <FilterBar />

      <div className="mt-5 bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm table-auto">
            <colgroup>
              <col className="w-12" /> {/* checkbox */}
              <col className="w-[260px]" /> {/* Tên danh mục */}
              <col className="w-[140px]" /> {/* Trạng thái */}
              <col className="w-[220px]" /> {/* Tạo bởi */}
              <col className="w-[220px]" /> {/* Cập nhật bởi */}
              <col className="w-[160px]" /> {/* Hành động */}
            </colgroup>

            <thead className="bg-gray-50 text-gray-700">
              <tr className="[&>th]:px-4 [&>th]:py-4 [&>th]:font-semibold">
                <th className="text-left">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    className="w-4 h-4"
                  />
                </th>
                <th className="text-left">Tên danh mục</th>
                <th className="text-center whitespace-nowrap">Trạng thái</th>
                <th className="text-left whitespace-nowrap">Tạo bởi</th>
                <th className="text-left whitespace-nowrap">Cập nhật bởi</th>
                <th className="text-center whitespace-nowrap">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 [&>tr>td]:px-4 [&>tr>td]:py-4">
              {items.map((item) => {
                const checked = selectedIds.includes(item.id);

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOne(item.id)}
                        className="w-4 h-4"
                      />
                    </td>

                    <td className="font-medium text-gray-900 break-words">
                      {item.name}
                    </td>

                    <td className="text-center">
                      <span
                        className={[
                          "inline-flex items-center justify-center px-3 py-1 rounded-md font-semibold",
                          item.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-200 text-gray-600",
                        ].join(" ")}
                      >
                        {item.status === "active" ? "Hoạt động" : "Dừng"}
                      </span>
                    </td>

                    <td>
                      <div className="font-medium">{item.createdBy}</div>
                      <div className="text-gray-500 text-xs mt-1">
                        {item.createdAt}
                      </div>
                    </td>

                    <td>
                      <div className="font-medium">{item.updatedBy}</div>
                      <div className="text-gray-500 text-xs mt-1">
                        {item.updatedAt}
                      </div>
                    </td>

                    <td>
                      <div className="flex items-center justify-center">
                        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => handleEdit(item.id)}
                            className="px-3 py-2 hover:bg-gray-100"
                            title="Sửa"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-3 py-2 hover:bg-red-50 text-red-500"
                            title="Xoá"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    Không có danh mục nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
