/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router-dom";
import TinyMCEEditor from "@/components/editor/TinyMCEEditor";
import { useEffect, useRef, useState } from "react";
import { formatToVN } from "@/utils/format_time";

type ProductDetail = {
  product_id: number;
  product_name: string;
  is_removed: boolean;
  seller_id: string;
  seller_name?: string;
  step_price: number;
  start_price: number;
  current_price: number;
  start_time: string;
  end_time: string;
  product_images: string;
  description: string;
  created_at: string;
};

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editorRef = useRef(null);

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(
      `${import.meta.env.VITE_API_URL}/${
        import.meta.env.VITE_PATH_ADMIN
      }/api/product/detail/${id}`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          setProduct(data.product);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6">
        <div className="text-center text-red-500">Không tìm thấy sản phẩm</div>
      </div>
    );
  }

  // Parse product_images - có thể là JSON array hoặc string
  let productImages: string[] = [];
  if (product.product_images) {
    if (Array.isArray(product.product_images)) {
      productImages = product.product_images;
    } else if (typeof product.product_images === "string") {
      try {
        // Thử parse JSON nếu là string
        const parsed = JSON.parse(product.product_images);
        productImages = Array.isArray(parsed)
          ? parsed
          : [product.product_images];
      } catch {
        // Nếu không parse được, split by comma
        productImages = product.product_images
          .split(",")
          .filter((img) => img.trim());
      }
    }
  }

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
                htmlFor="seller"
                className="mb-4 block text-sm font-medium text-gray-700"
              >
                Người bán (Seller)
              </label>
              <input
                id="seller"
                type="text"
                value={product.seller_name || product.seller_id || "Không rõ"}
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
                value={formatToVN(product.start_time)}
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
                value={formatToVN(product.end_time)}
                disabled
                className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm outline-none cursor-default"
              />
            </div>
          </div>

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
                value={product.is_removed ? "removed" : "active"}
                disabled
                className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm outline-none cursor-default"
              >
                <option value="active">Hoạt động</option>
                <option value="removed">Đã xóa</option>
              </select>
            </div>
          </div>
          {/* Hình ảnh sản phẩm */}
          <div className="space-y-2">
            <label className="mb-4 block text-sm font-medium text-gray-700">
              Hình ảnh sản phẩm
            </label>
            <div className="border rounded-2xl bg-gray-50 p-4">
              {productImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {productImages.map((img, index) => (
                    <img
                      key={index}
                      src={img.trim()}
                      alt={`${product.product_name} - ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <span className="text-sm text-gray-400">
                    Không có hình ảnh
                  </span>
                </div>
              )}
            </div>
          </div>

          <TinyMCEEditor
            editorRef={editorRef}
            value={product.description || ""}
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
