/* eslint-disable @typescript-eslint/no-explicit-any */
import JustValidate from "just-validate";
import bg from "@/assets/images/bg-account.jpg";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import OTPForm from "@/features/auth/components/OTPForm";
import {toast} from "sonner";
const params = new URLSearchParams(window.location.search);
const verifyType = params.get("type");



function TestCount() {
  const [count, setCount] = useState(0);
  return(
    <div>
      <button type = "submit"  disabled = {false} className = "disabled:bg-red-600 bg-amber-200" onClick={() => setCount(count + 1)}>Increase</button>
      <p>{count}</p>
    </div>
  );
}
function Test (){
  return(
    <div>
      <input className = "min-h-[50px]" />
    </div>
  );
}
function AccountVerify() {
  const navigate = useNavigate();
  
  useEffect(() => {
    toast.info("Mã PIN tồn tại trong 5 phút");
  }, []);

  const [optValue, setOtp] = useState("");
  const [error, setError] = useState("");


  
  const handleSubmit = (event : any) => {
    event.preventDefault();

    if (optValue.trim().length !== 6){
      setError("Vui lòng nhập đủ 6 chữ số");
      return;
    }
    setError("");
    const finalData = JSON.parse(localStorage.getItem("registerForm") || "{}");
    finalData.otp = optValue;
    console.log(finalData);
    const checkOTP = async () => {
      try{
        let response = await fetch("http://localhost:5000/accounts/verify-register",
          {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(finalData)
          } 
        );
        let data = await response.json();
        console.log(data);
        if (data.code === "success"){
          localStorage.removeItem("registerForm");
          navigate("/accounts/login");
          toast.success("Xác thực thành công!")
          
        }
        else {
          setError(data.message || "Error happens");
          toast.error("Mã PIN không chính xác")
        }
      }
      catch(error){
        console.log ("Error fetching data in check OTP:", error);
        toast.error("Mất kết nối. Vui lòng thử lại")
      }
    }
    checkOTP();

  }  


  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <img
        src={bg}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <form
        id="registerVerify"
        action=""
        // onSubmit={(e) => e.preventDefault()}
        className="relative z-20 bg-white/85 w-[40%] min-h-[400px] rounded-[20%] p-6 shadow-2xl shadow-green-500"
      >
        <div className="text-center font-bold font-sans text-[30px] p-[20px] text-gray-400">
          <h1>Nhập mã OTP</h1>
          <p className="font-medium text-[13px] mt-[10px]">Vui lòng nhập mã OTP để tiếp tục</p>
        </div>

        <div className="flex flex-col px-5 gap-4">
          <div className="flex flex-col items-center">

            <div id="otpInputWrapper" tabIndex={0} className="w-full flex flex-col items-center mt-[50px]">
              <OTPForm
                className="flex scale-150"
                onChange={(val) => {
                  setOtp(val);
                }}
              />
    

            </div>
            <div className = "text-red-500 flex mt-10 ml-3">{error}</div>
          </div>
        </div>

        <div className="mt-[20px] text-center">
          <button
            className="bg-blue-300 hover:bg-green-300 hover:scale-105 transition-all duration-300 border ml-[50%] border-[#DEDEDE] rounded-lg px-4 py-2 font-bold text-[16px] text-white cursor-pointer"
            type="submit" onClick = {handleSubmit}
          >
            Xác nhận mã OTP
          </button>
        </div>

        <div className="text-center text-[14px] mt-2">
          Quay lại trang đăng ký?
          <span className="pl-[10px] cursor-pointer underline" onClick={() => navigate("/accounts/register")}>Đăng ký</span>
        </div>
      </form>
      
    </div>
  );
}

export default AccountVerify;
