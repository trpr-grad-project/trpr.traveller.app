import { useCallback, useRef, useState } from "react";
import { TextInput } from "react-native";

const OTP_LENGTH = 6;

export function useOtpInput() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleOtpChange = useCallback((value: string, index: number) => {
    // Accept only last character when pasting
    const char = value.length > 1 ? value[value.length - 1] : value;
    setOtp((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });

    // Auto-focus next input on entry
    if (char && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyPress = useCallback(
    (e: { nativeEvent: { key: string } }, index: number) => {
      if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp],
  );

  const resetOtp = useCallback(() => {
    setOtp(Array(OTP_LENGTH).fill(""));
  }, []);

  const otpValue = otp.join("");
  const isComplete = otpValue.length === OTP_LENGTH;

  return {
    otp,
    otpValue,
    isComplete,
    inputRefs,
    handleOtpChange,
    handleKeyPress,
    resetOtp,
  };
}
