/* eslint-disable @typescript-eslint/no-explicit-any */
import bg from "@/assets/images/bg-account.jpg";
import { useEffect } from "react";
import JustValidate from "just-validate";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function AccountRegister() {
  const navigate = useNavigate();
  useEffect(() => {
    const validation = new JustValidate("#registerForm");
    validation
      .addField(
        "#full_name",
        [
          { rule: "required", errorMessage: "Vui lòng nhập họ tên!" },
          {
            rule: "minLength",
            value: 5,
            errorMessage: "Họ tên phải có ít nhất 5 kí tự!",
          },
          {
            rule: "maxLength",
            value: 50,
            errorMessage: "Họ tên không được quá 50 kí tự!",
          },
        ],
        { errorContainer: "#full_nameError" }
      )
      .addField(
        "#email",
        [
          { rule: "required", errorMessage: "Vui lòng nhập email!" },
          { rule: "email", errorMessage: "Email không đúng định dạng!" },
        ],
        { errorContainer: "#emailError" }
      )
      .addField(
        "#address",
        [{ rule: "required", errorMessage: "Vui lòng nhập địa chỉ!" }],
        { errorContainer: "#addressError" }
      )
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
        "#agree",
        [{ rule: "required", errorMessage: "Vui lòng đồng ý với điều khoản" }],
        {
          errorContainer: "#agreeError",
        }
      )
      .onSuccess((event: any) => {
        const full_name = event.target.full_name.value;
        const email = event.target.email.value;
        const password = event.target.password.value;
        const address = event.target.address.value;

        const finalData = {
          full_name: full_name,
          email: email,
          password: password,
          address: address,
        };

        fetch("http://localhost:5000/accounts/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(finalData),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.code == "error") {
              toast.error(data.message);
            }

            if (data.code == "success") {
              navigate(`/accounts/verify?email=${email}&type=register`);
            }

            if (data.code == "existedOTP") {
              toast.error(data.message);
              navigate(`/accounts/verify?email=${email}&type=register`);
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
          id="registerForm"
          action=""
          className="relative z-10 bg-white/95 backdrop-blur-lg w-[520px] min-h-[650px] p-10 rounded-3xl shadow-2xl shadow-blue-400/30 border border-white/30"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mb-4 shadow-lg">
              <span className="text-2xl">📝</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Đăng ký tài khoản
            </h1>
            <p className="text-gray-600 text-sm font-medium">
              Tạo tài khoản để tham gia đấu giá ngay!
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-semibold text-gray-700 mb-2">
                Họ Tên <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="full_name"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all duration-300 bg-gray-50 hover:bg-white"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  👤
                </div>
              </div>
              <div id="full_nameError" className="text-sm text-red-500 mt-1"></div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="email"
                  placeholder="Ví dụ: nva@gmail.com"
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all duration-300 bg-gray-50 hover:bg-white"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  📧
                </div>
              </div>
              <div id="emailError" className="text-sm text-red-500 mt-1"></div>
            </div>

            {/* Address Field */}
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="address"
                  type="text"
                  placeholder="Ví dụ: Đ.Nguyễn Thông, Tân An, Long An"
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all duration-300 bg-gray-50 hover:bg-white"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  📍
                </div>
              </div>
              <div id="addressError" className="text-sm text-red-500 mt-1"></div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  placeholder="******"
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all duration-300 bg-gray-50 hover:bg-white"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔒
                </div>
              </div>
              <div id="passwordError" className="text-sm text-red-500 mt-1"></div>
            </div>

            {/* Agree Checkbox */}
            <div>
              <label className="flex items-center gap-2 mt-2">
                <input
                  id="agree"
                  type="checkbox"
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                />
                <span className="text-sm text-gray-700 cursor-pointer">
                  Tôi đồng ý với <span className="text-green-600 font-medium">điều khoản sử dụng</span>
                </span>
              </label>
              <div id="agreeError" className="text-sm text-red-500 mt-1"></div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                className="w-full cursor-pointer bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-green-500/50"
                type="submit"
              >
                🌟 Đăng ký ngay
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Bạn đã có tài khoản?
                <span
                  className="ml-1 text-blue-600 hover:text-blue-800 cursor-pointer font-semibold transition-colors duration-200"
                  onClick={() => {
                    navigate("/accounts/login");
                  }}
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

export default AccountRegister;