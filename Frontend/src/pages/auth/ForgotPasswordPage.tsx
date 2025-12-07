/* eslint-disable @typescript-eslint/no-explicit-any */
import bg from "@/assets/images/bg-account.jpg";
import { useNavigate } from "react-router-dom";
import JustValidate from "just-validate";
import { useEffect } from "react";
import { toast } from "sonner";

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
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-white to-indigo-300 overflow-hidden">
      {/* Decorative shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-indigo-500 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-purple-300 rounded-full opacity-25 "></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
        
        {/* Floating icons */}
        <div className="absolute top-1/4 left-1/4 text-6xl opacity-50 animate-bounce">🔐</div>
        <div className="absolute top-1/3 right-1/4 text-5xl opacity-100 animate-pulse">🚀</div>
        <div className="absolute bottom-1/4 left-1/4 text-4xl opacity-50 animate-bounce">💎</div>

        <form
          id="forgotPasswordForm"
          action=""
          className="relative z-20 bg-white/95 backdrop-blur-lg w-[500px] min-h-[450px] p-10 rounded-3xl shadow-2xl shadow-blue-400/30 border border-white/30"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mb-4 shadow-lg">
              <span className="text-2xl">🔑</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              Quên mật khẩu
            </h1>
            <p className="text-gray-600 text-sm font-medium">
              Vui lòng nhập email để nhận mã xác nhận
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="text"
                  placeholder="Ví dụ: nva@gmail.com"
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all duration-300 bg-gray-50 hover:bg-white"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  📧
                </div>
              </div>
              <div id="emailError" className="text-sm text-red-500 mt-1"></div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-orange-500/50 cursor-pointer"
                type="submit"
              >
                📤 Gửi mã xác nhận
              </button>
            </div>

            {/* Back to Login Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
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
