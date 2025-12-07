/* eslint-disable @typescript-eslint/no-explicit-any */
import JustValidate from "just-validate";
import bg from "@/assets/images/bg-account.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
function AccountLogin() {
  const navigate = useNavigate();
  useEffect(() => {
    const validate = new JustValidate("#loginForm", { lockForm: false });

    validate
      .addField(
        "#email",
        [
          { rule: "required", errorMessage: "Vui lòng nhập email!" },
          { rule: "email", errorMessage: "Email không đúng định dạng" },
        ],
        { errorContainer: "#emailError" }
      )
      .addField(
        "#password",
        [{ rule: "required", errorMessage: "Vui lòng nhập mật khẩu!" }],
        { errorContainer: "#passwordError" }
      )
      .onSuccess((event: any) => {
        const email = event.target.email.value;
        const password = event.target.password.value;
        const rememberPassword = event.target.rememberPassword.checked;

        const dataFinal = {
          email: email,
          password: password,
          rememberPassword: rememberPassword,
        };

        fetch(`${import.meta.env.VITE_API_URL}/accounts/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataFinal),
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.code == "error") {
              console.log(data.message);
              toast.error("Đăng nhập thất bại");
            }

            if (data.code == "success") {
              if (data.role === "admin") {
                navigate(`/admin/dashboard`);
                toast.success("Đăng nhập thành công!");
              } else {
                navigate(`/`);
                toast.success("Đăng nhập thành công!");
              }
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
          id="loginForm"
          action=""
          className="relative z-10 bg-white/95 backdrop-blur-lg w-[500px] min-h-[500px] p-10 rounded-3xl shadow-2xl shadow-blue-400/30 border border-white/30"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
              <span className="text-2xl">🔐</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Đăng nhập
            </h1>
            <p className="text-gray-600 text-sm font-medium">
              Vui lòng nhập email và mật khẩu để tiếp tục
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="email"
                  placeholder="Ví dụ: nva@gmail.com"
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 bg-gray-50 hover:bg-white"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  📧
                </div>
              </div>
              <div id="emailError" className="text-sm text-red-500 mt-1"></div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  placeholder="******"
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 bg-gray-50 hover:bg-white"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔒
                </div>
              </div>
              <div id="passwordError" className="text-sm text-red-500 mt-1"></div>
            </div>

            {/* Remember Password & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberPassword"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="rememberPassword" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                  Nhớ mật khẩu
                </label>
              </div>
              <span
                className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium transition-colors duration-200"
                onClick={() => {
                  navigate("/accounts/forgot-password");
                }}
              >
                Quên mật khẩu?
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-blue-500/50"
                type="submit"
              >
                🚀 Đăng nhập
              </button>
            </div>

            {/* Register Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Bạn chưa có tài khoản?
                <span
                  className="ml-1 text-blue-600 hover:text-blue-800 cursor-pointer font-semibold transition-colors duration-200"
                  onClick={() => {
                    navigate("/accounts/register");
                  }}
                >
                  Tạo tài khoản ngay
                </span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default AccountLogin;
