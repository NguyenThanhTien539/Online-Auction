/* eslint-disable @typescript-eslint/no-explicit-any */
import bg from "@/assets/images/bg-account.jpg";
import { useNavigate } from "react-router-dom";
import JustValidate from "just-validate";
import { useEffect } from "react";
import { toast } from "sonner";

function ResetPassword() {
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/accounts/verify-account`, {
      method: "get",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "error") {
          toast.error(data.message);
          navigate("/accounts/login");
        }
      });
  }, []);

  useEffect(() => {
    const validate = new JustValidate("#resetPasswordForm");

    validate
      .addField(
        "#password",
        [
          { rule: "required", errorMessage: "Vui lòng nhập mật khẩu!" },
          {
            validator: (value: string) => value.length >= 8,
            errorMessage: "Mật khẩu có ít nhất 8 kí tự",
          },
          {
            validator: (value: string) => /[A-Z]/.test(value),
            errorMessage: "Mật khẩu phải chứa ít nhất một chữ cái in hoa!",
          },
          {
            validator: (value: string) => /[a-z]/.test(value),
            errorMessage: "Mật khẩu phải chứa ít nhất một chữ cái thường!",
          },
          {
            validator: (value: string) => /\d/.test(value),
            errorMessage: "Mật khẩu phải chứa ít nhất một chữ số!",
          },
          {
            validator: (value: string) => /[@$!%*?&]/.test(value),
            errorMessage: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!",
          },
        ],
        {
          errorContainer: "#passwordError",
        }
      )
      .addField(
        "#confirmPassword",
        [
          { rule: "required", errorMessage: "Vui lòng nhập mật khẩu!" },
          {
            validator: (value: string) => value.length >= 8,
            errorMessage: "Mật khẩu có ít nhất 8 kí tự",
          },
          {
            validator: (value: string) => /[A-Z]/.test(value),
            errorMessage: "Mật khẩu phải chứa ít nhất một chữ cái in hoa!",
          },
          {
            validator: (value: string) => /[a-z]/.test(value),
            errorMessage: "Mật khẩu phải chứa ít nhất một chữ cái thường!",
          },
          {
            validator: (value: string) => /\d/.test(value),
            errorMessage: "Mật khẩu phải chứa ít nhất một chữ số!",
          },
          {
            validator: (value: string) => /[@$!%*?&]/.test(value),
            errorMessage: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!",
          },
        ],
        { errorContainer: "#confirmPasswordError" }
      )
      .onSuccess((event: any) => {
        const password = event.target.password.value;
        const confirmPassword = event.target.confirmPassword.value;
        if (password != confirmPassword) {
          toast.error("Mật khẩu không khớp");
        } else {
          // lấy email từ query
          const params = new URLSearchParams(window.location.search);
          const email = params.get("email");

          const dataFinal = {
            email,
            password,
          };

          fetch(`${import.meta.env.VITE_API_URL}/accounts/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataFinal),
            credentials: "include",
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.code === "error") {
                toast.error(data.message);
              }

              if (data.code === "success") {
                toast.success(data.message);
                navigate("/accounts/login");
              }
            })
            .catch(() => {
              toast.error("Có lỗi xảy ra, vui lòng thử lại!");
            });
        }
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
          id="resetPasswordForm"
          action=""
          className="relative z-20 bg-white/95 backdrop-blur-lg w-[500px] min-h-[480px] p-10 rounded-3xl shadow-2xl shadow-blue-400/30 border border-white/30"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-4 shadow-lg">
              <span className="text-2xl">🔒</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Đặt lại mật khẩu
            </h1>
            <p className="text-gray-600 text-sm font-medium">
              Vui lòng nhập mật khẩu mới để tiếp tục
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 bg-gray-50 hover:bg-white"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔑
                </div>
              </div>
              <div id="passwordError" className="text-sm text-red-500 mt-1"></div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 bg-gray-50 hover:bg-white"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  ✅
                </div>
              </div>
              <div id="confirmPasswordError" className="text-sm text-red-500 mt-1"></div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-purple-500/50 cursor-pointer"
                type="submit"
              >
                🔄 Xác nhận đổi mật khẩu
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

export default ResetPassword;
