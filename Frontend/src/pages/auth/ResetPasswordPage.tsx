/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import JustValidate from "just-validate";
import { useEffect } from "react";
import { toast } from "sonner";
import { KeyRound, Key, Check, RotateCcw } from "lucide-react";

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
      <div className=" flex justify-center bg-gray-50 px-4 py-6">
        <form
          id="resetPasswordForm"
          action=""
          className="w-full max-w-md bg-white p-6 rounded-xl shadow-xl border border-gray-200"
        >
          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 rounded-full mb-3 shadow-lg">
              <KeyRound className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Đặt lại mật khẩu
            </h1>
            <p className="text-gray-600 text-xs">
              Vui lòng nhập mật khẩu mới để tiếp tục
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1">
                Mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  className="w-full px-3 py-2 pl-9 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white text-sm"
                />
                <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Key className="w-4 h-4" />
                </div>
              </div>
              <div id="passwordError" className="text-sm text-red-500 mt-1"></div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-700 mb-1">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  className="w-full px-3 py-2 pl-9 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white text-sm"
                />
                <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Check className="w-4 h-4" />
                </div>
              </div>
              <div id="confirmPasswordError" className="text-sm text-red-500 mt-1"></div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                className="w-full cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm"
                type="submit"
              >
                <RotateCcw className="w-4 h-4" />
                Xác nhận đổi mật khẩu
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

export default ResetPassword;
