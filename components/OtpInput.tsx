import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

const CELL_COUNT = 6;

type OtpInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  error?: boolean;
  editable?: boolean;
};

export default function OtpInput({
  value,
  onChangeText,
  error = false,
  editable = true,
}: OtpInputProps) {
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [codeFieldProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue: onChangeText,
  });

  return (
    <CodeField
      ref={ref}
      {...codeFieldProps}
      value={value}
      onChangeText={onChangeText}
      cellCount={CELL_COUNT}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      autoComplete="sms-otp"
      rootStyle={styles.root}
      editable={editable}
      renderCell={({ index, symbol, isFocused }) => (
        <View
          key={index}
          onLayout={getCellOnLayoutHandler(index)}
          className={`h-14 flex-1 items-center justify-center rounded-xl border-2 bg-white dark:bg-neutral-dark ${
            error
              ? "border-red-500"
              : isFocused
                ? "border-primary"
                : "border-neutral-light dark:border-neutral-dark"
          }`}
        >
          <Text className="text-2xl font-semibold text-text-main-light dark:text-text-main-dark">
            {symbol || (isFocused && <Cursor />)}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    gap: 8,
  },
});
