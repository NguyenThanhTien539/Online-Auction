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
      <div className="flex justify-center bg-gray-50 px-4 py-6">
        <form
          id="registerForm"
          action=""
          className="w-full max-w-md bg-white p-6 rounded-xl shadow-xl border border-gray-200"
        >
          {/* Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-full mb-2 shadow-lg">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Đăng ký tài khoản
            </h1>
            <p className="text-gray-600 text-xs">
              Tạo tài khoản để tham gia đấu giá ngay!
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            {/* Full Name Field */}
            <div>
              <label htmlFor="full_name" className="block text-xs font-semibold text-gray-700 mb-1">
                Họ Tên <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="full_name"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full px-3 py-2 pl-9 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-white text-sm"
                />
                <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <User className="w-4 h-4" />
                </div>
              </div>
              <div id="full_nameError" className="text-sm text-red-500 mt-1"></div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="email"
                  placeholder="Ví dụ: nva@gmail.com"
                  className="w-full px-3 py-2 pl-9 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-white text-sm"
                />
                <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
              <div id="emailError" className="text-sm text-red-500 mt-1"></div>
            </div>

            {/* Address Field */}
            <div>
              <label htmlFor="address" className="block text-xs font-semibold text-gray-700 mb-1">
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="address"
                  type="text"
                  placeholder="Ví dụ: Đ.Nguyễn Thông, Tân An, Long An"
                  className="w-full px-3 py-2 pl-9 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-white text-sm"
                />
                <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>
              <div id="addressError" className="text-sm text-red-500 mt-1"></div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  placeholder="******"
                  className="w-full px-3 py-2 pl-9 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-white text-sm"
                />
                <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
              </div>
              <div id="passwordError" className="text-sm text-red-500 mt-1"></div>
            </div>

            {/* Agree Checkbox */}
            <div>
              <label className="flex items-center gap-2 mt-1">
                <input
                  id="agree"
                  type="checkbox"
                  className="w-3.5 h-3.5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                />
                <span className="text-xs text-gray-700 cursor-pointer">
                  Tôi đồng ý với <span className="text-green-600 font-medium">điều khoản sử dụng</span>
                </span>
              </label>
              <div id="agreeError" className="text-xs text-red-500 mt-1"></div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm"
                type="submit"
              >
                <UserPlus className="w-4 h-4" />
                Đăng ký ngay
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center pt-3">
              <p className="text-xs text-gray-600">
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