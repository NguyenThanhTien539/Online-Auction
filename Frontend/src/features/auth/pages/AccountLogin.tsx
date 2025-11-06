/* eslint-disable @typescript-eslint/no-explicit-any */
import JustValidate from "just-validate";
import bg from "@/assets/images/bg-account.svg";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
function AccountLogin() {
  const navigate = useNavigate();
  useEffect(() => {
    const validate = new JustValidate("#loginForm");

    validate
      .addField(
        "#email",
        [{ rule: "required", errorMessage: "Vui lòng nhập email!" }],
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

        const dataFinal = {
          email: email,
          password: password,
        };

        fetch("http://localhost:5000/accounts/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataFinal),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.code == "error") {
              console.log(data.message);
            }

            if (data.code == "success") {
              navigate(`/`);
            }
          });
      });
  }, []);

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center ">
        <img
          src={bg}
          alt="background"
          className="absolute z-0 object-cover w-full"
        />

        <form
          id="loginForm"
          action=""
          className="relative z-10 bg-[white] w-[490px] min-h-[450px] p-8 rounded-4xl"
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
                <input type="checkbox" className="w-[20px] h-[20px]" />
                <span className="ml-[10px]">Nhớ mật khẩu</span>
              </div>
              <span className="text-blue-500 cursor-pointer">
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
