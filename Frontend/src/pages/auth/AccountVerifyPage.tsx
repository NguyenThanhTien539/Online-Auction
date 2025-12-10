/* eslint-disable @typescript-eslint/no-explicit-any */
// import JustValidate from "just-validate";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OTPForm from "@/components/common/OTPForm";
import { toast } from "sonner";
import { ShieldCheck, CheckCircle } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

        


      <form
        id="registerVerify"
        action=""
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-full mb-4 shadow-lg">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Nhập mã OTP
          </h1>
          <p className="text-gray-600 text-sm">
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
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
            type="submit"
            onClick={handleSubmit}
          >
            <CheckCircle className="w-5 h-5" />
            Xác nhận mã OTP
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
