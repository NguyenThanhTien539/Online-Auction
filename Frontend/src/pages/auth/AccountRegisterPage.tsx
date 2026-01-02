/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import JustValidate from "just-validate";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserPlus, User, Mail, MapPin, Lock } from "lucide-react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

function AccountRegister() {
  const navigate = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const handleSuccessGoogleLogin = async (credentialResponse: any) => {
    const { credential } = credentialResponse;

    const dataFinal = { credential: credential, rememberMe: false };
    fetch(`${import.meta.env.VITE_API_URL}/accounts/google-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataFinal),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "error") {
          console.log(data.message);
        }
        if (data.code == "success") {
          if (data.role === "admin") {
            navigate(`/admin/dashboard`);
            toast.success(data.message);
          } else {
            navigate(`/`);
            toast.success(data.message);
          }
        } else {
          toast.error("Đăng ký bằng Google thất bại");
        }
      });
  };

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
              <label
                htmlFor="full_name"
                className="block text-sm font-bold text-gray-700 mb-1.5"
              >
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
              <div
                id="full_nameError"
                className="text-xs text-red-500 mt-1 font-medium"
              ></div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-gray-700 mb-1"
              >
                Email <span className="text-red-500">*</span>
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
              <div
                id="emailError"
                className="text-xs text-red-500 mt-1 font-medium"
              ></div>
            </div>

            {/* Address Field */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-bold text-gray-700 mb-1.5"
              >
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
              <div
                id="addressError"
                className="text-xs text-red-500 mt-1 font-medium"
              ></div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-700 mb-1.5"
              >
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
              <div
                id="passwordError"
                className="text-xs text-red-500 mt-1 font-medium"
              ></div>
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
                  Tôi đồng ý với{" "}
                  <span className="text-emerald-600 font-semibold">
                    điều khoản sử dụng
                  </span>
                </span>
              </label>
              <div
                id="agreeError"
                className="text-xs text-red-500 mt-1 font-medium"
              ></div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full cursor-pointer bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm"
              type="submit"
            >
              <UserPlus className="w-4 h-4" />
              Đăng ký
            </button>

            {/* Divider */}
            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500 font-medium">
                  HOẶC
                </span>
              </div>
            </div>

            {/* Google Login Button */}
            <GoogleOAuthProvider
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            >
              <div ref={googleButtonRef} className="hidden">
                <GoogleLogin onSuccess={handleSuccessGoogleLogin} />
              </div>
            </GoogleOAuthProvider>

            {/* Custom Google Icon Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  const googleBtn = googleButtonRef.current?.querySelector(
                    'div[role="button"]'
                  ) as HTMLElement;
                  if (googleBtn) googleBtn.click();
                }}
                className="w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-300 hover:border-gray-400 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg
                  className=" cursor-pointer w-6 h-6"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center pt-2">
              <span className="text-xs text-gray-600">Đã có tài khoản?</span>
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
