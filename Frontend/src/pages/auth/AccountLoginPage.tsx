/* eslint-disable @typescript-eslint/no-explicit-any */
import JustValidate from "just-validate";
import bg from "@/assets/images/bg-account.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
function AccountLogin() {
  const navigate = useNavigate();
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
      .onSuccess((event: any) => {
        const email = event.target.email.value;
        const password = event.target.password.value;
        const rememberPassword = event.target.rememberPassword.checked;

        const dataFinal = {
          email: email,
          password: password,
          rememberPassword: rememberPassword,
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
              console.log(data.message);
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
          id="loginForm"
          action=""
          className="relative z-10 bg-white/50 backdrop-blur-md w-[490px] min-h-[450px] p-8 rounded-4xl shadow-2xl shadow-blue-300/50 border border-white/20"
        >
          <div className="text-center font-bold font-sans text-[30px]">
            <h1>Đăng nhập</h1>
            <p className="text-[13px] pt-1.5 font-medium ">
              Vui lòng nhập email và mật khẩu để tiếp tục
            </p>
          </div>
          <div className="flex flex-col gap-4 mt-[25px]">
            <div>
              <label className="block font-[500] text-[14px] mb-[5px]">
                Email*
              </label>
              <input
                type="text"
                id="email"
                placeholder="Ví dụ: nva@gmail.com"
                className="border border-gray-500 rounded-lg p-2 w-full  "
              />
              <div id="emailError" className="text-sm text-red"></div>
            </div>
            <div>
              <label className="block font-[500] text-[14px] mb-[5px]">
                Mật khẩu*
              </label>
              <input
                type="password"
                id="password"
                placeholder="******"
                className="border border-gray-[500] rounded-lg p-2 w-full  "
              />
              <div id="passwordError" className="text-sm text-red"></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberPassword"
                  type="checkbox"
                  className="w-[20px] h-[20px]"
                />
                <label htmlFor="rememberPassword" className="ml-[10px]">
                  Nhớ mật khẩu
                </label>
              </div>
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => {
                  navigate("/accounts/forgot-password");
                }}
              >
                Quên mật khẩu
              </span>
            </div>

            <div className="text-center mt-[2px]">
              <button
                className=" bg-blue-500 border border-[#DEDEDE] rounded-lg w-[100px] h-[40px] font-[700] text-[16px] text-white cursor-pointer"
                type="submit"
              >
                Đăng nhập
              </button>
            </div>

            <div className="text-center text-[14px]">
              Bạn chưa có tài khoản?
              <span
                className="pl-1 text-blue-500 cursor-pointer hover:text-blue-700"
                onClick={() => {
                  navigate("/accounts/register");
                }}
              >
                Tạo tài khoản
              </span>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default AccountLogin;
