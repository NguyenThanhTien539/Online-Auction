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
      <div className=" flex justify-center bg-gray-50 px-4 py-6">
        <form
          id="loginForm"
          action=""
          className="w-full max-w-md bg-white p-6 rounded-xl shadow-xl border border-gray-200"
        >
          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full mb-3 shadow-lg">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Đăng nhập
            </h1>
            <p className="text-gray-600 text-xs">
              Vui lòng nhập email và mật khẩu để tiếp tục
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="email"
                  placeholder="Ví dụ: nva@gmail.com"
                  className="w-full px-3 py-2 pl-9 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
                />
                <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
              <div id="emailError" className="text-sm text-red-500 mt-1"></div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="******"
                  className="w-full px-3 py-2 pl-9 pr-9 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
                />
                <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
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

            {/* reCAPTCHA Custom Checkbox */}
            <div className="flex items-center py-2">
              <div 
                className={`border-2 rounded-md p-3 cursor-pointer transition-all duration-200 ${
                  isCaptchaChecked 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 bg-white hover:border-blue-400'
                }`}
                onClick={() => setIsCaptchaChecked(!isCaptchaChecked)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-all ${
                    isCaptchaChecked 
                      ? 'border-green-300 bg-blue-500' 
                      : 'border-gray-400 bg-white'
                  }`}>
                    {isCaptchaChecked && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">
                      Tôi không phải là robot
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">reCAPTCHA</span>
                    </div>
                  </div>
                  <div className="ml-2">
                    <img 
                      src="https://www.gstatic.com/recaptcha/api2/logo_48.png" 
                      alt="reCAPTCHA" 
                      className="w-8 h-8"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm"
                type="submit"
              >
                <LogIn className="w-4 h-4" />
                Đăng nhập
              </button>
            </div>

            {/* Register Link */}
            <div className="text-center pt-3">
              <p className="text-xs text-gray-600">
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
