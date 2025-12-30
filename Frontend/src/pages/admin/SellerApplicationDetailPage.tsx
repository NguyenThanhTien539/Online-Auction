import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import TinyMCEEditor from "@/components/editor/TinyMCEEditor";
import { formatToVN } from "@/utils/format_time";

interface ApplicationInfo {
  full_name: string;
  username: string;
  email: string;
  status: string;
  submitted_date: string;
  description: string;
}

export default function SellerApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [detailForm, setDetailForm] = useState<ApplicationInfo | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    // Fetch application detail from API
    fetch(
      `${import.meta.env.VITE_API_URL}/${
        import.meta.env.VITE_PATH_ADMIN
      }/api/application-form/detail/${id}`,
      {
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          const app = data.applicationInfo;
          setDetailForm({
            full_name: app.full_name || "",
            username: app.username || "",
            email: app.email || "",
            status: app.status || "Chờ duyệt",
            submitted_date: formatToVN(app.created_at),
            description: app.reason || "",
          });
          setIsLoading(false);
        } else {
          setHasError(true);
          setIsLoading(false);
          toast.error(data.message || "Lỗi khi tải chi tiết đơn");
        }
      })
      .catch(() => {
        setHasError(true);
        setIsLoading(false);
        toast.error("Đơn chi tiết không tồn tại");
      });
  }, [id, navigate]);

  const handleConfirmApplication = (status: string) => {
    fetch(
      `${import.meta.env.VITE_API_URL}/${
        import.meta.env.VITE_PATH_ADMIN
      }/api/application-form/set-status/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          toast.success(data.message);
          // Update local state instead of navigating
          setDetailForm((prev) => (prev ? { ...prev, status } : null));
        } else {
          toast.error(data.message || "Lỗi khi xác nhận đơn");
        }
      })
      .catch(() => {
        toast.error("Lỗi khi xác nhận đơn");
      });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Không tìm thấy đơn
          </h1>
          <p className="text-gray-600 mb-6">
            Đơn xin nâng cấp tài khoản này không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={() => navigate("/admin/seller/applications")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    detailForm && (
      <>
        <div className="p-5 md:p-8 max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">
            Chi tiết đơn xin nâng cấp tài khoản
          </h1>

          <div className="bg-white rounded-xl p-6 md:p-10 shadow-md">
            {/* Thông tin đơn */}
            <div className="mb-8 pb-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Thông tin đơn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Ngày gửi đơn:</span>
                  <span className="ml-2 font-medium">
                    {detailForm.submitted_date}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Trạng thái:</span>
                  <span
                    className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                      detailForm.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : detailForm.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {detailForm.status === "pending"
                      ? "Chờ duyệt"
                      : detailForm.status === "accepted"
                      ? "Đã duyệt"
                      : "Từ chối"}
                  </span>
                </div>
              </div>
            </div>

            {/* Row 1: Họ và tên & Tên đăng nhập */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={detailForm.full_name}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  value={detailForm.username}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:outline-none"
                />
              </div>
            </div>

            {/* Row 2: Email */}
            <div className="grid grid-cols-1 gap-6 md:gap-8 mb-6 md:mb-8">
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={detailForm.email}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 focus:outline-none"
                />
              </div>
            </div>

            {/* Description - TinyMCE Editor (Read-only) */}
            <div className="mb-8 md:mb-10">
              <label className="block mb-2 font-medium text-gray-700">
                Lý do xin nâng cấp
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                <TinyMCEEditor
                  editorRef={editorRef}
                  value={detailForm.description}
                  isReadOnly={true}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                * Nội dung này chỉ để xem, không thể chỉnh sửa
              </p>
            </div>

            {/* Action Buttons */}

            <div className="flex flex-col justify-center sm:flex-row gap-3 sm:gap-4">
              {detailForm.status === "pending" && (
                <>
                  <button
                    onClick={() => handleConfirmApplication("accepted")}
                    className="cursor-pointer px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-base font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Phê duyệt
                  </button>

                  <button
                    onClick={() => handleConfirmApplication("rejected")}
                    className="cursor-pointer px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-base font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Từ chối
                  </button>
                </>
              )}

              <button
                onClick={() =>
                  navigate(
                    `/${import.meta.env.VITE_PATH_ADMIN}/seller/applications`
                  )
                }
                className="cursor-pointer px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-base font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      </>
    )
  );
}
