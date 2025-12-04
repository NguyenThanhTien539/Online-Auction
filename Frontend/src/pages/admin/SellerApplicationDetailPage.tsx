import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import TinyMCEEditor from "@/components/editor/TinyMCEEditor";

interface ApplicationInfo {
  full_name: string;
  username: string;
  email: string;
  status: string;
  submitted_date: string;
  description: string;
}

function formatDateTime(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes} - ${day}/${month}/${year}`;
}

export default function SellerApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const [form, setForm] = useState<ApplicationInfo>({
    full_name: "",
    username: "",
    email: "",
    status: "Chờ duyệt",
    submitted_date: "",
    description: "",
  });

  useEffect(() => {
    // Fetch application detail from API
    fetch(
      `${import.meta.env.VITE_API_URL}/${
        import.meta.env.VITE_PATH_ADMIN
      }/api/seller/application/detail/${id}`,
      {
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          const app = data.applicationInfo;
          setForm({
            full_name: app.full_name || "",
            username: app.username || "",
            email: app.email || "",
            status: app.status || "Chờ duyệt",
            submitted_date: formatDateTime(app.created_at),
            description: app.reason || "",
          });
        }
      });
  }, [id, navigate]);

  return (
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
              <span className="ml-2 font-medium">{form.submitted_date}</span>
            </div>
            <div>
              <span className="text-gray-600">Trạng thái:</span>
              <span
                className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                  form.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : form.status === "accepted"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {form.status === "pending"
                  ? "Chờ duyệt"
                  : form.status === "accepted"
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
              value={form.full_name}
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
              value={form.username}
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
              value={form.email}
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
              value={form.description}
              isReadOnly={true}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            * Nội dung này chỉ để xem, không thể chỉnh sửa
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center sm:flex-row gap-3 sm:gap-4">
          <button
            disabled={form.status !== "pending"}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-base font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Phê duyệt
          </button>

          <button
            disabled={form.status !== "pending"}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-base font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Từ chối
          </button>

          <button
            onClick={() => navigate("/admin/seller/applications")}
            className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-base font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
