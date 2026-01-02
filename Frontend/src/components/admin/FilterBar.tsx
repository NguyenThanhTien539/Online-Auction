"use client";

import { useState } from "react";
import { Filter, RotateCcw, Search, Trash2 } from "lucide-react";

type StatusOption = {
  value: string;
  label: string;
};

type BulkActionOption = {
  value: string;
  label: string;
};

type Props = {
  showStatusFilter?: boolean; // default: true
  statusFilter?: string;
  setStatusFilter?: (v: string) => void;
  statusOptions?: StatusOption[];

  /** ----- Người tạo ----- */
  creatorFilter?: string;
  setCreatorFilter?: (v: string) => void;
  creatorOptions?: string[];

  /** ----- Ngày ----- */
  dateFrom?: string;
  setDateFrom?: (v: string) => void;
  dateTo?: string;
  setDateTo?: (v: string) => void;

  /** ----- Tìm kiếm ----- */
  search?: string;
  setSearch?: (v: string) => void;
  onSearchSubmit?: () => void; // callback khi nhấn Enter

  /** ----- Hành động & reset & tạo mới ----- */
  onResetFilters?: () => void;

  bulkActionOptions?: BulkActionOption[]; // nếu không truyền → ẩn luôn block “Hành động”
  onApplyBulkAction?: (action: string) => void; // phải có callback thì mới hiện block bulk action

  onCreateNew?: () => void; // truyền → hiện nút tạo mới
  createLabel?: string;

  onTrashClick?: () => void; // truyền → hiện nút thùng rác
  trashLabel?: string;
};

export default function FilterBar({
  // trạng thái
  showStatusFilter = true,
  statusFilter,
  setStatusFilter,
  statusOptions,

  // người tạo
  creatorFilter,
  setCreatorFilter,
  creatorOptions = [],

  // ngày
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,

  // search
  search,
  setSearch,
  onSearchSubmit,

  // actions
  onResetFilters,
  bulkActionOptions,
  onApplyBulkAction,

  onCreateNew,
  createLabel = "+ Tạo mới",

  onTrashClick,
  trashLabel = "Thùng rác",
}: Props) {
  // ===== EFFECTIVE OPTIONS =====
  const effectiveStatusOptions: StatusOption[] = statusOptions ?? [
    { value: "all", label: "Trạng thái" },
    { value: "active", label: "Hoạt động" },
    { value: "inactive", label: "Dừng" },
  ];

  const effectiveBulkActions: BulkActionOption[] = bulkActionOptions ?? [
    { value: "hide", label: "Ẩn" },
    { value: "delete", label: "Xóa" },
  ];

  // ===== WHAT TO SHOW? =====
  const hasStatusFilter =
    showStatusFilter && statusFilter !== undefined && !!setStatusFilter;

  const hasCreatorFilter =
    creatorFilter !== undefined &&
    !!setCreatorFilter &&
    creatorOptions.length > 0;

  const hasDateFilter =
    dateFrom !== undefined &&
    dateTo !== undefined &&
    !!setDateFrom &&
    !!setDateTo;

  const hasResetButton = !!onResetFilters;

  const hasTopFilters =
    hasStatusFilter || hasCreatorFilter || hasDateFilter || hasResetButton;

  const hasSearch = search !== undefined && !!setSearch;

  const hasBulkAction = !!onApplyBulkAction && !!effectiveBulkActions.length;

  // state select "Hành động"
  const [selectedAction, setSelectedAction] = useState<string>("");

  // state để xử lý IME (Input Method Editor) cho tiếng Việt
  const [isComposing, setIsComposing] = useState(false);

  const handleApplyClick = () => {
    if (!onApplyBulkAction) return;
    if (!selectedAction) return;
    onApplyBulkAction(selectedAction);
  };

  return (
    <div className="mb-7 space-y-6">
      {/* ===== HÀNG TRÊN: BỘ LỌC ===== */}
      {hasTopFilters && (
        <div className="flex h-20 items-stretch rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm text-[15px] w-fit">
          {/* Nhãn “Bộ lọc” */}
          <div className="flex h-full items-center gap-2 px-5 border-r border-gray-200 font-medium text-gray-800">
            <Filter className="w-5 h-5" />
            <span>Bộ lọc</span>
          </div>

          {/* Trạng thái */}
          {hasStatusFilter && (
            <div className="flex h-full items-center gap-2 px-5 border-r border-gray-300">
              <select
                className="cursor-pointer bg-transparent outline-none font-medium"
                value={statusFilter}
                onChange={(e) => setStatusFilter!(e.target.value)}
              >
                {effectiveStatusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="text-sm">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Người tạo */}
          {hasCreatorFilter && (
            <div className=" flex items-center px-5 h-full border-r border-gray-300">
              <select
                className="cursor-pointer bg-transparent outline-none font-medium"
                value={creatorFilter}
                onChange={(e) => setCreatorFilter!(e.target.value)}
              >
                <option className="text-sm" value="">
                  Người tạo
                </option>
                {creatorOptions.map((c) => (
                  <option className="text-sm" key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Khoảng ngày */}
          {hasDateFilter && (
            <div className="flex h-full items-center gap-3 px-5 border-r border-gray-300">
              <input
                type="date"
                className="h-8 rounded-lg px-2 text-sm border border-gray-300"
                value={dateFrom}
                onChange={(e) => setDateFrom!(e.target.value)}
              />
              <span>-</span>
              <input
                type="date"
                className="h-8 rounded-lg px-2 text-sm border border-gray-300"
                value={dateTo}
                onChange={(e) => setDateTo!(e.target.value)}
              />
            </div>
          )}

          {/* Xóa bộ lọc */}
          {hasResetButton && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-2 px-5 h-full text-sm font-semibold text-rose-500 hover:text-rose-600 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>
      )}

      {/* ===== HÀNG DƯỚI: HÀNH ĐỘNG + SEARCH + TẠO MỚI ===== */}
      <div className="flex h-20 items-stretch gap-3">
        {/* Hành động linh hoạt */}
        {hasBulkAction && (
          <div className="flex rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm">
            <select
              className="cursor-pointer h-full px-4 text-sm text-gray-800 bg-white outline-none border-none"
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
            >
              <option value="">-- Hành động --</option>
              {effectiveBulkActions.map((act) => (
                <option key={act.value} value={act.value}>
                  {act.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              className=" cursor-pointer h-full px-5 text-sm font-semibold text-red-600 hover:bg-gray-50 border-l border-gray-200"
              onClick={handleApplyClick}
            >
              Áp dụng
            </button>
          </div>
        )}

        {/* Ô tìm kiếm */}
        {hasSearch && (
          <div className="flex items-center space-x-2 h-full w-[500px] rounded-2xl border border-gray-200 bg-white px-4 shadow-sm">
            <Search className="w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm (nhấn Enter để tìm)"
              className="flex-1 border-none bg-transparent text-sm outline-none placeholder:text-gray-400"
              value={search}
              onChange={(e) => {
                // Chỉ update state khi KHÔNG đang composition (gõ tiếng Việt)
                if (!isComposing) {
                  setSearch!(e.target.value);
                }
              }}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={(e) => {
                setIsComposing(false);
                // Update state với giá trị cuối cùng sau khi IME hoàn tất
                setSearch!((e.target as HTMLInputElement).value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isComposing && onSearchSubmit) {
                  onSearchSubmit();
                }
              }}
            />
          </div>
        )}

        {/* Nút tạo mới */}
        {onCreateNew && (
          <button
            type="button"
            className="h-full px-6 rounded-2xl bg-blue-500 text-white text-[15px] font-semibold hover:bg-blue-600 cursor-pointer"
            onClick={onCreateNew}
          >
            {createLabel}
          </button>
        )}
        {/* Nút thùng rác */}
        {onTrashClick && (
          <button
            type="button"
            className="h-full px-4 rounded-2xl bg-red-500 text-white text-[15px] font-semibold hover:bg-red-600 cursor-pointer flex items-center gap-2"
            onClick={onTrashClick}
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">{trashLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
