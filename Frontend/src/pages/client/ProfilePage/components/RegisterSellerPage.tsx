import React, { useState, useEffect, useRef, use } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  FileText,
  Send,
  ArrowLeft,
  Shield,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/routes/ProtectedRouter";
import justValidate from "just-validate";
import TinyMCEEditor from "@/components/editor/TinyMCEEditor";

interface UserInfo {
  username: string;
  email: string;
  full_name: string;
}

export default function RegisterSellerPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { auth } = useAuth();
  const editor = useRef<any>(null);
  const handleEditorChange = (content: string) => {
    const reasonContent = document.getElementById("reason") as HTMLInputElement;
    reasonContent.value = content;
  };
  // Sample user data - in real app, get from auth context or API
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: "",
    email: "",
    full_name: "",
  });
  useEffect(() => {
    if (auth) {
      setUserInfo({
        username: auth.username,
        email: auth.email,
        full_name: auth.full_name,
      });
    }
  }, [auth]);

  useEffect(() => {
    const validator = new justValidate("#register-seller-form");
    validator
      .addField("#reason", [
        {
          rule: "required",
          errorMessage: "Lý do không được để trống",
        },
      ])
      .onSuccess((e: any) => {
        e.preventDefault();
        setIsSubmitting(true);

        console.log(
          "Submitting seller registration with reason:",
          e.target.reason.value
        );
        fetch(`${import.meta.env.VITE_API_URL}/api/user/register-seller`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: e.target.reason.value,
          }),
        })
          .then((res) => {
            if (!res.ok) {
              return res.json().then((data) => {
                throw new Error(data.message || "Có lỗi xảy ra");
              });
            }
            return res.json();
          })
          .then((data) => {
            toast.success(data.message || "Gửi yêu cầu thành công");
            navigate(-1);
          })
          .catch((error) => {
            toast.error(error.message || "Lỗi kết nối máy chủ");
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      });
  }, []);

  return (
    <div className="min-h-screen pb-5 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center cursor-pointer text-xl p-3 px-6 mb-4 transition-colors text-green-600 "
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </button>

          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Đăng ký trở thành Seller
            </h1>
            <p className="text-gray-600">
              Bắt đầu hành trình kinh doanh của bạn trên nền tảng đấu giá
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate__animated animate__fadeInUp">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6">
            <h2 className="text-xl font-semibold flex items-center">
              <FileText className="w-5 h-5 mr-3" />
              Thông tin đăng ký
            </h2>
            <p className="text-green-100 mt-2">
              Vui lòng kiểm tra thông tin và nhập lý do muốn trở thành seller
            </p>
          </div>

          {/* Form Content */}
          <form id="register-seller-form" className="p-8">
            {/* User Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-500" />
                Thông tin cá nhân
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên đăng nhập
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={userInfo.username}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed focus:outline-none"
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={userInfo.full_name}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={userInfo.email}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Reason Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-500" />
                Lý do muốn trở thành Seller
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vui lòng chia sẻ lý do bạn muốn trở thành seller trên nền tảng
                  của chúng tôi
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <TinyMCEEditor
                  editorRef={editor}
                  onEditChange={handleEditorChange}
                />
                <input id="reason" name="reason" type="hidden"></input>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p className="font-semibold mb-1">Lưu ý quan trọng:</p>
                  <ul className="space-y-1">
                    <li> Yêu cầu sẽ được xem xét trong vòng 7 ngày</li>
                    <li> Bạn sẽ được làm seller trong vòng 7 ngày</li>
                    <li>Chúng tôi sẽ liên hệ qua email để thông báo kết quả</li>
                    <li>Seller cần tuân thủ các quy định của nền tảng</li>
                    <li>Có thể yêu cầu xác minh thông tin bổ sung</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border cursor-pointer border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Gửi yêu cầu
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            Lợi ích khi trở thành Seller
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Đăng sản phẩm
              </h4>
              <p className="text-sm text-gray-600">
                Đăng bán sản phẩm của bạn trên nền tảng đấu giá
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Quản lý khách hàng
              </h4>
              <p className="text-sm text-gray-600">
                Tương tác và chăm sóc khách hàng hiệu quả
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Uy tín & Đánh giá
              </h4>
              <p className="text-sm text-gray-600">
                Xây dựng thương hiệu qua hệ thống đánh giá
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
