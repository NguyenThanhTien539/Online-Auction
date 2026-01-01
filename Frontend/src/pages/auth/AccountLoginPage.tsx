/* eslint-disable @typescript-eslint/no-explicit-any */
import JustValidate from "just-validate";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Lock, Mail, LogIn, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

function AccountLogin() {
  const navigate = useNavigate();
  const [isCaptchaChecked, setIsCaptchaChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
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
      .onSuccess(async (event: any) => {
        const email = event.target.email.value;
        const password = event.target.password.value;
        const rememberPassword = event.target.rememberPassword.checked;

        if (!isCaptchaChecked) {
          toast.error("Vui lòng xác nhận bạn không phải robot!");
          return;
        }

        if (!executeRecaptcha) {
          toast.error("Đang tải reCAPTCHA, vui lòng thử lại!");
          return;
        }

        // Lấy token từ reCAPTCHA v3
        const captchaToken = await executeRecaptcha('login');

        const dataFinal = {
          email: email,
          password: password,
          rememberPassword: rememberPassword,
          captchaToken: captchaToken,
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
              console.log("Response from backend:",data.message);
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
      return () => {
        validate.destroy();

      }
  }, [isCaptchaChecked, executeRecaptcha]);

  return (
    <>
      <div className="flex justify-center px-4">
        <form
          id="loginForm"
          action=""
          className="w-full max-w-md bg-white p-6 rounded-2xl shadow-2xl border-2 border-blue-100"
        >
          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-3 shadow-lg">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Đăng Nhập
            </h1>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="email"
                  placeholder="your@email.com"
                  className="w-full px-3 py-2.5 pl-10 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
              <div id="emailError" className="text-xs text-red-500 mt-1 font-medium"></div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 pl-10 pr-10 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div id="passwordError" className="text-xs text-red-500 mt-1 font-medium"></div>
            </div>

            {/* Remember Password & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input
                  id="rememberPassword"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2 cursor-pointer"
                />
                <span className="ml-2 text-xs font-medium text-gray-600 group-hover:text-gray-800">
                  Nhớ đăng nhập
                </span>
              </label>
              <span
                className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer font-semibold transition-colors duration-200"
                onClick={() => {
                  navigate("/accounts/forgot-password");
                }}
              >
                Quên mật khẩu?
              </span>
            </div>

            {/* reCAPTCHA Custom Checkbox */}
            <div 
              className={`border-2 rounded-xl p-3 cursor-pointer transition-all duration-200 ${
                isCaptchaChecked 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-white'
              }`}
              onClick={() => setIsCaptchaChecked(!isCaptchaChecked)}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all ${
                  isCaptchaChecked 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300 bg-white'
                }`}>
                  {isCaptchaChecked && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-xs font-semibold text-gray-700">
                    Xác minh con người
                  </span>
                  <span className="text-[10px] text-gray-400">reCAPTCHA</span>
                </div>
                <img 
                  src="https://www.gstatic.com/recaptcha/api2/logo_48.png" 
                  alt="reCAPTCHA" 
                  className="w-8 h-8"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm"
              type="submit"
            >
              <LogIn className="w-4 h-4" />
              Đăng nhập
            </button>

            {/* Register Link */}
            <div className="text-center pt-2">
              <span className="text-xs text-gray-600">
                Chưa có tài khoản?
              </span>
              <span
                className="ml-1 text-blue-600 hover:text-blue-700 cursor-pointer font-bold transition-colors duration-200 text-xs"
                onClick={() => {
                  navigate("/accounts/register");
                }}
              >
                Đăng ký ngay
              </span>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default AccountLogin;
