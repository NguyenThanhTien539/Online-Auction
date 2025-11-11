import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { cn } from "@/lib/utils"

import {useState, useEffect} from "react";




function OTPForm({ className, onChange, value }: { className?: string; onChange?: (value: string) => void; value?: string }) {

    // If `value` is provided, the component acts controlled by the parent.
    const isControlled = value !== undefined;
    const [internalOtp, setInternalOtp] = useState<string>(value ?? "");

    useEffect(() => {
        if (isControlled) setInternalOtp(value ?? "");
    }, [value, isControlled]);

    const handleChange = (val: string) => {
        setInternalOtp(val);
        onChange && onChange(val);
    };

    return (
        <div className={cn("", className)} >
            <InputOTP
                maxLength={6}
                className="m-2 w-full hover:cursor-pointer"
                pattern={REGEXP_ONLY_DIGITS}
                value={internalOtp}
                onChange={handleChange}
            >
            <InputOTPGroup className = "">
                <InputOTPSlot index={0} className = "bg-gray-300/50 border-black/50"/>
                <InputOTPSlot index={1} className = "bg-gray-300/50  border-black/50"/>
                <InputOTPSlot index={2} className = "bg-gray-300/50  border-black/50"/>
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
                <InputOTPSlot index={3} className = "bg-gray-300/50  border-black/50"/>
                <InputOTPSlot index={4} className = "bg-gray-300/50  border-black/50"/>
                <InputOTPSlot index={5} className = "bg-gray-300/50  border-black/50"/>
            </InputOTPGroup>
            </InputOTP>
        </div>
    );
}

export default OTPForm;



