/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import JustValidate from "just-validate";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserPlus, User, Mail, MapPin, Lock } from "lucide-react";

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
      <div className="flex  justify-center  px-4 py-8">
        <form
          id="registerForm"
          action=""
          className="w-full max-w-md bg-white p-6 rounded-2xl shadow-2xl border-2 border-emerald-100"
        >
          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl mb-3 shadow-lg">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Đăng Ký
            </h1>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            {/* Full Name Field */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-bold text-gray-700 mb-1.5">
                Họ Tên
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="full_name"
                  placeholder="Nguyễn Văn A"
                  className="w-full px-3 py-2.5 pl-10 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <User className="w-4 h-4" />
                </div>
              </div>
              <div id="full_nameError" className="text-xs text-red-500 mt-1 font-medium"></div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="email"
                  placeholder="your@email.com"
                  className="w-full px-3 py-2.5 pl-10 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
              <div id="emailError" className="text-xs text-red-500 mt-1 font-medium"></div>
            </div>

            {/* Address Field */}
            <div>
              <label htmlFor="address" className="block text-sm font-bold text-gray-700 mb-1.5">
                Địa chỉ
              </label>
              <div className="relative">
                <input
                  id="address"
                  type="text"
                  placeholder="Thành phố, Tỉnh"
                  className="w-full px-3 py-2.5 pl-10 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>
              <div id="addressError" className="text-xs text-red-500 mt-1 font-medium"></div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 pl-10 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
              </div>
              <div id="passwordError" className="text-xs text-red-500 mt-1 font-medium"></div>
            </div>

            {/* Agree Checkbox */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  id="agree"
                  type="checkbox"
                  className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded-md focus:ring-emerald-500 focus:ring-2 cursor-pointer"
                />
                <span className="text-xs text-gray-600 group-hover:text-gray-800">
                  Tôi đồng ý với <span className="text-emerald-600 font-semibold">điều khoản sử dụng</span>
                </span>
              </label>
              <div id="agreeError" className="text-xs text-red-500 mt-1 font-medium"></div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full cursor-pointer bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm"
              type="submit"
            >
              <UserPlus className="w-4 h-4" />
              Đăng ký
            </button>

            {/* Login Link */}
            <div className="text-center pt-2">
              <span className="text-xs text-gray-600">
                Đã có tài khoản?
              </span>
              <span
                className="ml-1 text-emerald-600 hover:text-emerald-700 cursor-pointer font-bold transition-colors duration-200 text-xs"
                onClick={() => {
                  navigate("/accounts/login");
                }}
              >
                Đăng nhập ngay
              </span>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default AccountRegister;