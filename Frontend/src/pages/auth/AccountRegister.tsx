/* eslint-disable @typescript-eslint/no-explicit-any */
import bg from "@/assets/images/bg-account.jpg";
import { useEffect } from "react";
import JustValidate from "just-validate";
import { useNavigate } from "react-router-dom";
import {toast} from "sonner";

function AccountRegister() {
  const navigate = useNavigate();
  useEffect(() => {
    const validation = new JustValidate("#registerForm");
    validation
      .addField(
        "#fullName",
        [
          { rule: "required", errorMessage: "Vui lòng nhập họ tên!" },
          {
            rule: "minLength",
            value: 5,
            errorMessage: "Họ tên phải có ít nhất 5 kí tự!",
          },
          {
            rule: "maxLength",
            value: 50,
            errorMessage: "Họ tên không được quá 50 kí tự!",
          },
        ],
        { errorContainer: "#fullNameError" }
      )
      .addField(
        "#email",
        [
          { rule: "required", errorMessage: "Vui lòng nhập email!" },
          { rule: "email", errorMessage: "Email không đúng định dạng!" },
        ],
        { errorContainer: "#emailError" }
      )
      .addField(
        "#address",
        [{ rule: "required", errorMessage: "Vui lòng nhập địa chỉ!" }],
        { errorContainer: "#addressError" }
      )
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
        "#agree",
        [{ rule: "required", errorMessage: "Vui lòng đồng ý với điều khoản" }],
        {
          errorContainer: "#agreeError",
        }
      )
      .onSuccess((event: any) => {
        const fullName = event.target.fullName.value;
        const email = event.target.email.value;
        const password = event.target.password.value;
        const address = event.target.address.value;

        const finalData = {
          fullName: fullName,
          email: email,
          password: password,
          address: address,
        };


        fetch("http://localhost:5000/accounts/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.code == "error") {
              console.log(data.message);
              toast.error("Có lỗi xảy ra. Vui lòng thử lại")
            }

            if (data.code == "success") {
              localStorage.clear();
              localStorage.setItem("registerForm", JSON.stringify(finalData));
              navigate(`/accounts/verify?email=${email}&type=register`);
              
            }
            
            // Mục này nên sửa lại
            if (data.code == "existedOTP") { 
              console.log(data.message);
              localStorage.clear();
              localStorage.setItem("registerForm", JSON.stringify(finalData));
              navigate(`/accounts/verify?email=${email}&type=register`);
            }
          });
      });
  }, []);
  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center">
        <img
          src={bg}
          alt="hình nền"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <form
          id="registerForm"
          action=""
          className="relative z-10 bg-[white] w-[490px] min-h-[600px] p-8 rounded-4xl"
        >
          <div className="text-center font-bold font-sans text-[30px]">
            <h1>Đăng ký</h1>
            {/* <p className="text-[13px] pt-1.5 font-medium ">
              Tạo một tài khoản để tiếp tục
            </p> */}
          </div>

          <div className="flex flex-col gap-4 mt-[25px]">
            <div>
              <label
                htmlFor="fullName"
                className="block font-[500] text-[14px] mb-[5px]"
              >
                Họ Tên*
              </label>
              <input
                type="text"
                id="fullName"
                placeholder="Ví dụ: Nguyễn Văn A"
                className="border border-gray-500 rounded-lg p-2 w-full  "
              />
              <div id="fullNameError" className="text-sm text-red "></div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block font-[500] text-[14px] mb-[5px]"
              >
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
              <label
                htmlFor="address"
                className="block font-[500] text-[14px] mb-[5px]"
              >
                Địa chỉ*
              </label>
              <input
                id="address"
                type="text"
                placeholder="Ví dụ: Đ.Nguyễn Thông, Tân An, Long An"
                className="border border-gray-500 rounded-lg p-2 w-full  "
              />
              <div id="addressError" className="text-sm text-red"></div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-[500] text-[14px] mb-[5px]"
              >
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
            {/* checkbox */}
            <div>
              <label className="flex items-center gap-2 mt-[3px] ml-[3.5px]">
                <input id="agree" type="checkbox" className="w-4 h-4" />
                <span>Tôi đồng ý với điều khoản</span>
              </label>
              <div
                id="agreeError"
                className="text-sm text-red ml-[28px] mt-[2px]"
              ></div>
            </div>

            <div className="text-center mt-[2px]">
              <button
                className=" bg-blue-500 border border-[#DEDEDE] rounded-lg w-[100px] h-[40px] font-[700] text-[16px] text-white cursor-pointer"
                type="submit"
              >
                Đăng ký
              </button>
            </div>

            <div className="text-center text-[14px]">
              Bạn đã có tài khoản?
              <span
                className="pl-1 text-blue-500 underline cursor-pointer hover:text-blue-700"
                onClick={() => {
                  navigate("/accounts/login");
                }}
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

export default AccountRegister;
