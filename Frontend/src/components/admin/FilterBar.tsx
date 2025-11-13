// components/admin/FilterBar.tsx
import { useState } from "react";
import { FiFilter, FiRotateCw, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
const STATUS_OPTIONS = [
  { value: "", label: "Trạng thái" },
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Tạm dừng" },
];

const INITIATOR_OPTIONS = [
  { value: "", label: "Người tạo" },
  { value: "1", label: "Thanh Tiến" },
  { value: "2", label: "Tuấn Lộc" },
];

const ALL_SELECTED_OPTIONS = [
  { value: "", label: "-- Hành động --" },
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Tạm dừng" },
  { value: "remove", label: "Xóa" },
];

export default function FilterBar() {
  const nagivate = useNavigate();
  const [openStatus, setOpenStatus] = useState("");
  const [initiatorStatus, setInitiatorStatus] = useState("");
  const [allSelectedStatus, setAllSelectedStatus] = useState("");
  return (
    <div className="space-y-5">
      <div className="inline-flex w-full max-w-[800px] items-center  rounded-2xl border bg-white font-[500] text-[15px]">
        <div className="flex items-center gap-2 px-5 py-6 border-r">
          <FiFilter size={20} />
          <span>Bộ lọc</span>
        </div>

        <div className="relative flex flex-1 justify-center border-r py-6">
          <select
            value={openStatus}
            onChange={(e) => setOpenStatus(e.target.value)}
            className=" cursor-pointer bg-transparent outline-none"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative flex flex-1 justify-center border-r py-6">
          <select
            value={initiatorStatus}
            onChange={(e) => setInitiatorStatus(e.target.value)}
            className=" cursor-pointer bg-transparent outline-none"
          >
            {INITIATOR_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative flex flex-1 items-center justify-center border-r px-4 py-6 top-1/2 -translate-y-0.5">
          <input type="date" className="text-sm outline-none" />
          <span className="mx-[7px]">-</span>
          <input type="date" className="text-sm outline-none" />
        </div>

        <button className="flex h-12 items-center gap-2 px-5 text-red-500 cursor-pointer">
          <FiRotateCw />
          <span>Xóa bộ lọc</span>
        </button>
      </div>

      {/* phần ở dưới */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="inline-flex items-stretch overflow-hidden rounded-2xl border bg-white text-sm font-[500]">
          <select
            value={allSelectedStatus}
            onChange={(e) => setAllSelectedStatus(e.target.value)}
            className=" px-3 py-5 cursor-pointer bg-transparent outline-none border-none"
          >
            {ALL_SELECTED_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button className="px-4 py-5 border-l text-pink-600 cursor-pointer">
            Áp dụng
          </button>
        </div>

        {/* Ô tìm kiếm */}
        <div className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-5 min-w-[360px]">
          <FiSearch className="text-lg" />
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="flex-1 border-none bg-transparent text-sm font-medium text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>

        {/* Nút tạo mới */}
        <button
          className="px-6 py-5 rounded-2xl bg-blue-500 text-sm font-medium text-white hover:bg-blue-600 cursor-pointer "
          onClick={() => {
            nagivate("/admin/category/create");
          }}
        >
          + Tạo mới
        </button>
      </div>
    </div>
  );
}
