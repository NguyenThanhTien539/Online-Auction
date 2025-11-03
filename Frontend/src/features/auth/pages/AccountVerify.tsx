import JustValidate from "just-validate";
import bg from "@/assets/images/bg-account.svg";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AccountVerify() {
  const navigate = useNavigate();
  useEffect(() => {
    const validate = new JustValidate("#registerVerify");
    validate.addField(
      "#otp",
      [
        {
          rule: "required",
          errorMessage: "Vui lòng nhập mã OTP!",
        },
      ],
      { errorContainer: "#otpError" }
    );
  }, []);

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center">
        <img
          src={bg}
          alt="background"
          className="absolute inset-0 w-full h-full object-cover brightness-125 "
        />

        <form
          id="registerVerify"
          action=""
          className="relative z-20 bg-white w-[550px] min-h-[400px]   "
        >
          <div className=" text-center font-bold font-sans text-[30px] p-[20px]">
            <h1>Nhập mã OTP</h1>
            <p className="font-medium text-[13px] mt-[10px]">
              Vui lòng nhập mã OTP để tiếp tục
            </p>
          </div>

          <div className="flex flex-col px-5 gap-4">
            <div>
              <label className="text-sm font-medium font-sans text-[20px]">
                Mã OTP
              </label>
              <input
                id="otp"
                type="text"
                placeholder="Ví dụ: 123456"
                className="border border-gray-500 rounded-lg p-2 w-full"
              />
              <div id="otpError" className="text-sm text-red"></div>
            </div>

            <div className="mt-[10px] text-center">
              <button
                className="bg-blue-500 border border-[#DEDEDE] rounded-lg px-4 py-2 font-bold text-[16px] text-white cursor-pointer"
                type="submit"
              >
                Xác nhận mã OTP
              </button>
            </div>
            <div className="text-center text-[14px]">
              Quay lại trang đăng ký?
              <span
                className="pl-[10px] cursor-pointer underline "
                onClick={() => navigate("/accounts/register")}
              >
                Đăng ký
              </span>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default AccountVerify;
