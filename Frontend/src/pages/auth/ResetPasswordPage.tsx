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
          className="relative z-20 bg-white/70 w-[550px] min-h-[420px] rounded-4xl"
        >
          <div className="text-center font-bold font-sans text-[30px] p-[20px]">
            <h1>Đặt lại mật khẩu</h1>
            <p className="font-medium text-[13px] mt-[10px]">
              Vui lòng nhập mật khẩu mới để tiếp tục
            </p>
          </div>

          <div className="flex flex-col px-5 gap-4">
            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium font-sans text-[20px]"
              >
                Mật khẩu mới
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Nhập mật khẩu mới"
                className="border border-gray-500 rounded-lg p-2 w-full"
              />
              <div id="passwordError" className="text-sm text-red"></div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium font-sans text-[20px]"
              >
                Xác nhận mật khẩu
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Nhập lại mật khẩu"
                className="border border-gray-500 rounded-lg p-2 w-full"
              />
              <div id="confirmPasswordError" className="text-sm text-red"></div>
            </div>

            <div className="mt-[10px] text-center">
              <button
                className="bg-blue-500 border border-[#DEDEDE] rounded-lg px-4 py-2 font-bold text-[16px] text-white cursor-pointer"
                type="submit"
              >
                Xác nhận đổi mật khẩu
              </button>
            </div>

            <div className="text-center text-[14px]">
              Quay lại trang đăng nhập?
              <span
                className="pl-[10px] cursor-pointer underline"
                onClick={() => navigate("/accounts/login")}
              >
                Đăng nhập
              </span>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default ResetPassword;
