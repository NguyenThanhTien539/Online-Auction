/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import JustValidate from "just-validate";
import { useEffect } from "react";
import { toast } from "sonner";
import { Key, Mail, Send } from "lucide-react";

function ForgotPassword() {
  const navigate = useNavigate();
  useEffect(() => {
    const validate = new JustValidate("#forgotPasswordForm");

    validate
      .addField(
        "#email",
        [
          { rule: "required", errorMessage: "Vui lòng nhập email!" },
          { rule: "email", errorMessage: "Email không đúng định dạng" },
        ],
        { errorContainer: "#emailError" }
      )
      .onSuccess((event: any) => {
        const email = event.target.email.value;

        const dataFinal = {
          email: email,
        };

        fetch(`${import.meta.env.VITE_API_URL}/accounts/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataFinal),
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.code == "error") {
              toast.error(data.message);
            }

            if (data.code == "success") {
              navigate(`/accounts/verify?email=${email}&type=forgot-password`);
            }

            if (data.code == "existedOTP") {
              navigate(`/accounts/verify?email=${email}&type=forgot-password`);
            }
          });
      });
  }, []);
  return (
    <>
      <div className="flex justify-center bg-gray-50 px-4 py-6">
        <form
          id="forgotPasswordForm"
          action=""
          className="w-full max-w-md bg-white p-6 rounded-xl shadow-xl border border-gray-200"
        >
          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-600 rounded-full mb-3 shadow-lg">
              <Key className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Quên mật khẩu
            </h1>
            <p className="text-gray-600 text-xs">
              Vui lòng nhập email để nhận mã xác nhận
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="text"
                  placeholder="Ví dụ: nva@gmail.com"
                  className="w-full px-3 py-2 pl-9 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white text-sm"
                />
                <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
              <div id="emailError" className="text-xs text-red-500 mt-1"></div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                className="w-full cursor-pointer bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm"
                type="submit"
              >
                <Send className="w-4 h-4" />
                Gửi mã xác nhận
              </button>
            </div>

            {/* Back to Login Link */}
            <div className="text-center pt-3">
              <p className="text-xs text-gray-600">
                Quay lại trang đăng nhập?
                <span
                  className="ml-1 text-blue-600 hover:text-blue-800 cursor-pointer font-semibold transition-colors duration-200"
                  onClick={() => navigate("/accounts/login")}
                >
                  Đăng nhập ngay
                </span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default ForgotPassword;
