/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router-dom";
import TinyMCEEditor from "@/components/editor/TinyMCEEditor";
import { useRef } from "react";

export default function ProductDetailMock() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editorRef = useRef(null);
  const value = "";
  // ============================
  // ⭐ DỮ LIỆU GIẢ
  // ============================
  const product = {
    product_id: id || 1,
    status: "active" as "active" | "inactive",
    product_name: "iPhone 15 Pro Max 256GB",
    seller_name: "Nguyễn Văn A",
    step_price: 500_000,
    start_price: 25_000_000,
    start_time: "2025-01-12T09:15:00",
    end_time: "2025-01-15T21:00:00",
    product_img:
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch_natural_titanium?wid=5120&hei=2880&fmt=jpeg&qlt=80&.v=1692925920079",
    description: `
      <h3>Mô tả sản phẩm</h3>
      <p>iPhone 15 Pro Max phiên bản cao cấp với khung titanium, chip A17 Pro.</p>
      <ul>
        <li>Chip A17 Pro</li>
        <li>Camera 48MP</li>
        <li>Màn hình 6.7 inch OLED</li>
        <li>Pin dung lượng lớn, hỗ trợ sạc nhanh</li>
      </ul>
    `,
  };

  const formatDateTime = (value: string) => {
    if (!value) return "";
    return new Date(value).toLocaleString("vi-VN");
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-medium mb-6">Chi tiết sản phẩm</h2>

      <div className="rounded-2xl border-3 bg-white p-6 md:p-8">
        <div className="space-y-8">
          {/* Hàng 1: Tên + ID */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="product_name"
                className="mb-4 block text-sm font-medium text-gray-700"
              >
                Tên sản phẩm
              </label>
              <input
                id="product_name"
                type="text"
                value={product.product_name}
                disabled
                className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm outline-none cursor-default"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="product_id"
                className="mb-4 block text-sm font-medium text-gray-700"
              >
                ID sản phẩm
              </label>
              <input
                id="product_id"
                type="text"
                value={product.product_id}
                disabled
                className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm outline-none cursor-default"
              />
            </div>
          </div>

          {/* Hàng 2: Trạng thái + Seller */}
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
                value={product.status}
                disabled
                className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm outline-none cursor-default"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm dừng</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="seller"
                className="mb-4 block text-sm font-medium text-gray-700"
              >
                Người bán (Seller)
              </label>
              <input
                id="seller"
                type="text"
                value={product.seller_name}
                disabled
                className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm outline-none cursor-default"
              />
            </div>
          </div>

          {/* Hàng 3: Giá khởi điểm + Bước giá */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="start_price"
                className="mb-4 block text-sm font-medium text-gray-700"
              >
                Giá khởi điểm
              </label>
              <input
                id="start_price"
                type="text"
                value={product.start_price.toLocaleString("vi-VN") + " đ"}
                disabled
                className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm outline-none cursor-default"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="step_price"
                className="mb-4 block text-sm font-medium text-gray-700"
              >
                Bước giá
              </label>
              <input
                id="step_price"
                type="text"
                value={product.step_price.toLocaleString("vi-VN") + " đ"}
                disabled
                className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm outline-none cursor-default"
              />
            </div>
          </div>

          {/* Hàng 4: Thời gian */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="start_time"
                className="mb-4 block text-sm font-medium text-gray-700"
              >
                Thời gian bắt đầu
              </label>
              <input
                id="start_time"
                type="text"
                value={formatDateTime(product.start_time)}
                disabled
                className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm outline-none cursor-default"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="end_time"
                className="mb-4 block text-sm font-medium text-gray-700"
              >
                Thời gian kết thúc
              </label>
              <input
                id="end_time"
                type="text"
                value={formatDateTime(product.end_time)}
                disabled
                className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm outline-none cursor-default"
              />
            </div>
          </div>

          {/* Hình ảnh sản phẩm */}
          <div className="space-y-2">
            <label className="mb-4 block text-sm font-medium text-gray-700">
              Hình ảnh sản phẩm
            </label>
            <div className="border rounded-2xl bg-gray-50 p-4 flex items-center justify-center">
              {product.product_img ? (
                <img
                  src={product.product_img}
                  alt={product.product_name}
                  className="max-h-64 object-contain"
                />
              ) : (
                <span className="text-sm text-gray-400">Không có hình ảnh</span>
              )}
            </div>
          </div>

          <TinyMCEEditor
            editorRef={editorRef}
            value={value}
            isReadOnly={true}
          />

          {/* Nút quay lại */}
          <div className="flex flex-col items-center justify-center gap-5 pt-2">
            <span
              className="text-[15px] font-medium cursor-pointer underline text-blue-400"
              onClick={() => {
                navigate(-1); // quay lại trang trước
              }}
            >
              Quay lại danh sách
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
