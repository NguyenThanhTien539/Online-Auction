/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import JustValidate from "just-validate";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { KeyRound, Key, Check, Lock, ShieldCheck, CheckCircle } from "lucide-react";
import OTPForm from "@/components/common/OTPForm";

// Component Form Đổi Mật Khẩu
interface ChangePasswordFormProps {
  onSuccess: () => void;
}

function ChangePasswordForm({ onSuccess }: ChangePasswordFormProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const validate = new JustValidate("#changePasswordForm");

    validate
      .addField(
        "#currentPassword",
        [
          { rule: "required", errorMessage: "Vui lòng nhập mật khẩu hiện tại!" },
        ],
        {
          errorContainer: "#currentPasswordError",
        }
      )
      .addField(
        "#newPassword",
        [
          { rule: "required", errorMessage: "Vui lòng nhập mật khẩu mới!" },
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
          errorContainer: "#newPasswordError",
        }
      )
      .addField(
        "#confirmPassword",
        [
          { rule: "required", errorMessage: "Vui lòng nhập lại mật khẩu!" },
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
        const currentPassword = event.target.currentPassword.value;
        const newPassword = event.target.newPassword.value;
        const confirmPassword = event.target.confirmPassword.value;
        
        if (newPassword !== confirmPassword) {
          toast.error("Mật khẩu mới không khớp!");
          return;
        }

        if (currentPassword === newPassword) {
          toast.error("Mật khẩu mới phải khác mật khẩu hiện tại!");
          return;
        }

        const dataFinal = {
          currentPassword,
          newPassword,
        };

        fetch(`${import.meta.env.VITE_API_URL}/accounts/change-password`, {
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
              toast.success("Vui lòng xác nhận OTP để hoàn tất đổi mật khẩu!");
              onSuccess();
            }
          })
          .catch(() => {
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
          });
      });

    return () => {
      validate.destroy();
    };
  }, [onSuccess]);

  return (
    <form
      id="changePasswordForm"
      action=""
      className="bg-white p-6 rounded-2xl shadow-2xl border-2 border-emerald-100"
    >
      {/* Header */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-3 shadow-lg">
          <KeyRound className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Đổi Mật Khẩu
        </h1>
      </div>

      {/* Form Fields */}
      <div className="space-y-3">
        {/* Current Password Field */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-bold text-gray-700 mb-1.5">
            Mật khẩu cũ
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2.5 pl-10 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div id="currentPasswordError" className="text-xs text-red-500 mt-1 font-medium"></div>
        </div>

        {/* New Password Field */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-bold text-gray-700 mb-1.5">
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2.5 pl-10 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Key className="w-4 h-4" />
            </div>
          </div>
          <div id="newPasswordError" className="text-xs text-red-500 mt-1 font-medium"></div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-1.5">
            Xác nhận
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2.5 pl-10 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Check className="w-4 h-4" />
            </div>
          </div>
          <div id="confirmPasswordError" className="text-xs text-red-500 mt-1 font-medium"></div>
        </div>

        {/* Submit Button */}
        <button
          className="w-full cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm"
          type="submit"
        >
          <KeyRound className="w-4 h-4" />
          Cập nhật
        </button>

        {/* Back Link */}
        <div className="text-center pt-2">
          <span
            className="text-emerald-600 hover:text-emerald-700 cursor-pointer font-semibold transition-colors duration-200 text-xs"
            onClick={() => navigate(-1)}
          >
            ← Quay lại
          </span>
        </div>
      </div>
    </form>
  );
}

// Component Form Xác Thực OTP
interface OTPVerifyFormProps {
  onBack: () => void;
}

function OTPVerifyForm({ onBack }: OTPVerifyFormProps) {
  const navigate = useNavigate();
  const [otpValue, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleOtpSubmit = (event: any) => {
    event.preventDefault();

    if (otpValue.trim().length !== 6) {
      setOtpError("Vui lòng nhập đủ 6 chữ số");
      return;
    }

    const finalData = { otp: otpValue };

    fetch(`${import.meta.env.VITE_API_URL}/accounts/verify-change-password`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          toast.success(data.message);
          navigate("/profile");
        }
        if (data.code === "error") {
          toast.error(data.message);
        }
        if (data.code === "otp error") {
          toast.error(data.message);
          setOtpError(data.message);
        }
      });
  };

  return (
    <form
      id="otpVerifyForm"
      action=""
      className="bg-white p-6 rounded-2xl shadow-2xl border-2 border-emerald-100"
    >
      {/* Header */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-3 shadow-lg">
          <ShieldCheck className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Xác thực OTP
        </h1>
      </div>

      {/* OTP Input */}
      <div className="flex flex-col items-center space-y-3 mb-4">
        <div className="w-full flex flex-col items-center">
          <OTPForm
            className="flex scale-125"
            onChange={(val) => {
              setOtp(val);
              setOtpError("");
            }}
          />
        </div>
        {otpError && <div className="text-red-500 text-xs font-medium">{otpError}</div>}
      </div>

      {/* Submit Button */}
      <button
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer mb-3"
        type="submit"
        onClick={handleOtpSubmit}
      >
        <CheckCircle className="w-4 h-4" />
        Xác nhận
      </button>

      {/* Back Link */}
      <div className="text-center">
        <span
          className="text-emerald-600 hover:text-emerald-700 cursor-pointer font-semibold transition-colors duration-200 text-xs"
          onClick={onBack}
        >
          ← Quay lại
        </span>
      </div>
    </form>
  );
}

// Component Cha
function ChangePassword() {
  const [showOtpForm, setShowOtpForm] = useState(false);

  return (
    <div className="flex items-center justify-center  px-4 py-8 mb-20">
      <div className="w-full max-w-md">
        {/* Header Text */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {showOtpForm ? "Xác thực OTP" : "Đổi Mật Khẩu"}
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            {showOtpForm 
              ? "Nhập mã OTP đã được gửi đến email của bạn"
              : "Cập nhật mật khẩu mới cho tài khoản của bạn"
            }
          </p>
        </div>

        {showOtpForm ? (
          <OTPVerifyForm onBack={() => setShowOtpForm(false)} />
        ) : (
          <ChangePasswordForm onSuccess={() => setShowOtpForm(true)} />
        )}
      </div>
    </div>
  );
}

export default ChangePassword;
