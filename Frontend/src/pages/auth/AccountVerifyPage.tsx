/* eslint-disable @typescript-eslint/no-explicit-any */
// import JustValidate from "just-validate";
import bg from "@/assets/images/bg-account.jpg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OTPForm from "@/components/common/OTPForm";
import { toast } from "sonner";

function AccountVerify() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const verifyType = params.get("type");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/accounts/verify-account`, {
      method: "get",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          toast.success(data.message);
        }
        if (data.code == "error") {
          toast.error(data.message);
          navigate("/accounts/login");
        }
      });
  }, []);

  const [otpValue, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (otpValue.trim().length !== 6) {
      setError("Vui lòng nhập đủ 6 chữ số");
      return;
    }
    const finalData = { otp: otpValue };
    if (verifyType == "forgot-password") {
      fetch(`${import.meta.env.VITE_API_URL}/accounts/verify-forgot-password`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "success") {
            toast.success(data.message);
            const email = params.get("email");
            navigate(`/accounts/reset-password?email=${email}`);
          }
          if (data.code == "error") {
            toast.error(data.message);
            navigate("/accounts/forgot-password");
          }
          if (data.code == "otp error") {
            toast.error(data.message);
          }
        });
    } else {
      fetch(`${import.meta.env.VITE_API_URL}/accounts/verify-register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "success") {
            toast.success(data.message);
            navigate("/accounts/login");
          }
          if (data.code == "error") {
            toast.error(data.message);
            navigate("/accounts/register");
          }
          if (data.code == "otp error") {
            toast.error(data.message);
          }
        });
    }
  };

  return (
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
        id="registerVerify"
        action=""
        className="relative z-20 bg-white/95 backdrop-blur-lg w-[500px] min-h-[500px] p-10 rounded-3xl shadow-2xl shadow-blue-400/30 border border-white/30"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full mb-4 shadow-lg">
            <span className="text-2xl">📱</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Nhập mã OTP
          </h1>
          <p className="text-gray-600 text-sm font-medium">
            Vui lòng nhập mã OTP để tiếp tục
          </p>
        </div>

        {/* OTP Input */}
        <div className="flex flex-col items-center space-y-6">
          <div className="w-full flex flex-col items-center">
            <OTPForm
              className="flex scale-150"
              onChange={(val) => {
                setOtp(val);
              }}
            />
          </div>
          <div className="text-red-500 text-sm">{error}</div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-teal-500/50 cursor-pointer"
            type="submit"
            onClick={handleSubmit}
          >
            ✅ Xác nhận mã OTP
          </button>
        </div>

        {/* Back to Register Link */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Quay lại trang đăng ký?
            <span
              className="ml-1 text-blue-600 hover:text-blue-800 cursor-pointer font-semibold transition-colors duration-200"
              onClick={() => navigate("/accounts/register")}
            >
              Đăng ký ngay
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default AccountVerify;
