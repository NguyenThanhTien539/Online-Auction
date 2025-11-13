import { useNavigate } from "react-router-dom";

export default function CategoryCreate() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-medium">Tạo danh mục</h2>

      <div className="rounded-2xl border-3 bg-white p-6 md:p-8">
        <form className="space-y-8">
          {/* tên danh mục */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-5  ">
              <label
                htmlFor="name"
                className="mb-4 block text-sm font-medium text-gray-700"
              >
                Tên danh mục
              </label>
              <input
                id="name"
                type="text"
                className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Nhập tên danh mục"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="parent"
                className="mb-4 block text-sm font-medium text-gray-700"
              >
                Danh mục cha
              </label>
              <select
                id="parent"
                className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                defaultValue=""
              >
                <option value="" disabled>
                  -- Chọn danh mục --
                </option>
                <option value="1">Danh mục 1</option>
                <option value="2">Danh mục 2</option>
              </select>
            </div>
          </div>

          {/* Hàng 2: Vị trí + Trạng thái */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="status"
                className="mb-4 block text-sm font-medium text-gray-700"
              >
                Trạng thái
              </label>
              <select
                id="status"
                className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                defaultValue="active"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
          </div>

          {/* Ảnh đại diện */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Ảnh đại diện
            </label>

            <button
              type="button"
              className="flex h-36 w-36 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-3xl text-gray-500 hover:bg-gray-100"
            >
              +
            </button>
          </div>

          {/* Mô tả */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Mô tả</label>

            {/* Nếu bạn dùng TinyMCE / Quill thì thay <textarea> bằng component editor */}
            <textarea
              rows={6}
              className="w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Nhập mô tả danh mục..."
            />
          </div>

          {/* Nút hành động */}
          <div className="flex flex-col items-center justify-center gap-5 pt-2">
            <button
              type="submit"
              className="rounded-xl bg-blue-500 px-3 py-5 text-[18px] font-medium text-white hover:bg-blue-600"
            >
              Tạo mới danh mục
            </button>

            <span
              className="text-[15px] font-medium cursor-pointer underline text-blue-400"
              onClick={() => {
                navigate(`/${import.meta.env.VITE_PATH_ADMIN}/category/list`);
              }}
            >
              Quay lại danh sách
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
