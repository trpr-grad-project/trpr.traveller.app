import React from "react";
import { TextInput, View } from "react-native";

type OtpInputProps = {
  otp: string[];
  inputRefs: React.MutableRefObject<(TextInput | null)[]>;
  onChange: (value: string, index: number) => void;
  onKeyPress: (e: { nativeEvent: { key: string } }, index: number) => void;
  error?: boolean;
  editable?: boolean;
};

export default function OtpInput({
  otp,
  inputRefs,
  onChange,
  onKeyPress,
  error = false,
  editable = true,
}: OtpInputProps) {
  return (
    <View className="flex-row justify-between gap-2">
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          className={`h-14 flex-1 rounded-xl border-2 bg-white text-center text-2xl font-semibold text-text-main-light shadow-sm dark:bg-neutral-dark dark:text-text-main-dark ${
            error ? "border-red-500" : "border-primary"
          }`}
          maxLength={1}
          keyboardType="number-pad"
          value={digit}
          onChangeText={(value) => onChange(value, index)}
          onKeyPress={(e) => onKeyPress(e, index)}
          editable={editable}
          accessibilityLabel={`OTP digit ${index + 1}`}
        />
      ))}
    </View>
  );
}
