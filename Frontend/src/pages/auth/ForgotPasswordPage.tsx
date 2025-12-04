/* eslint-disable @typescript-eslint/no-explicit-any */
import bg from "@/assets/images/bg-account.jpg";
import { useNavigate } from "react-router-dom";
import JustValidate from "just-validate";
import { useEffect } from "react";
import { toast } from "sonner";

function ForgotPassword() {
  const navigate = useNavigate();
  useEffect(() => {
    const validate = new JustValidate("#forgotPasswordForm");

    validate
      .addField(
        "#email",
        [
          { rule: "required", errorMessage: "Vui lòng nhập email!" },
          { rule: "email", errorMessage: "Email không đúng định dạng" },
        ],
        { errorContainer: "#emailError" }
      )
      .onSuccess((event: any) => {
        const email = event.target.email.value;

        const dataFinal = {
          email: email,
        };

        fetch(`${import.meta.env.VITE_API_URL}/accounts/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataFinal),
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.code == "error") {
              toast.error(data.message);
            }

            if (data.code == "success") {
              navigate(`/accounts/verify?email=${email}&type=forgot-password`);
            }

            if (data.code == "existedOTP") {
              navigate(`/accounts/verify?email=${email}&type=forgot-password`);
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
          id="forgotPasswordForm"
          action=""
          className="relative z-20 bg-white/70 w-[550px] min-h-[400px] rounded-4xl"
        >
          <div className=" text-center font-bold font-sans text-[30px] p-[20px]">
            <h1>Quên mật khẩu</h1>
            <p className="font-medium text-[13px] mt-[10px]">
              Vui lòng nhập email để tiếp tục
            </p>
          </div>

          <div className="flex flex-col px-5 gap-4">
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium font-sans text-[20px]"
              >
                Email
              </label>
              <input
                id="email"
                type="text"
                placeholder="Ví dụ: nva@gamil.com"
                className="border border-gray-500 rounded-lg p-2 w-full"
              />
              <div id="emailError" className="text-sm text-red"></div>
            </div>

            <div className="mt-[10px] text-center">
              <button
                className="bg-blue-500 border border-[#DEDEDE] rounded-lg px-4 py-2 font-bold text-[16px] text-white cursor-pointer"
                type="submit"
              >
                Xác nhận Email
              </button>
            </div>
            <div className="text-center text-[14px]">
              Quay lại trang đăng nhập?
              <span
                className="pl-[10px] cursor-pointer underline "
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

export default ForgotPassword;
