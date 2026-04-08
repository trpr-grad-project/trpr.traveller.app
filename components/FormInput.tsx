import { MaterialIcons } from "@expo/vector-icons";
import React, { forwardRef, useState } from "react";
import {
  KeyboardTypeOptions,
  Pressable,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

type FormInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  error?: string;
  secure?: boolean;
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: TextInputProps["returnKeyType"];
  submitBehavior?: TextInputProps["submitBehavior"];
  onSubmitEditing?: TextInputProps["onSubmitEditing"];
};

const FormInput = forwardRef<TextInput, FormInputProps>(
  (
    {
      label,
      value,
      onChangeText,
      placeholder,
      icon,
      error,
      secure = false,
      editable = true,
      keyboardType = "default",
      returnKeyType,
      submitBehavior,
      onSubmitEditing,
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isError = Boolean(error);

    return (
      <View className="flex w-full flex-col">
        {/* Label */}
        <Text className="mb-2 ml-1 text-sm font-semibold text-gray-custom font-display">
          {label}
        </Text>

        {/* Input Container */}
        <View
          className={`flex-row items-center h-16 rounded-xl border-2 shadow bg-white dark:bg-neutral-dark ${
            isError
              ? "border-red-500"
              : isFocused
              ? "border-primary"
              : "border-neutral-light dark:border-neutral-dark"
          }`}
        >
          {icon && (
            <View className="pl-4 pr-2">
              <MaterialIcons
                name={icon}
                size={24}
                color={
                  isError ? "#EF4444" : isFocused ? "#359EFF" : "#4F4F4F"
                }
              />
            </View>
          )}

          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            editable={editable}
            secureTextEntry={secure && !showPassword}
            keyboardType={keyboardType}
            returnKeyType={returnKeyType}
            submitBehavior={submitBehavior}
            onSubmitEditing={onSubmitEditing}
            placeholder={placeholder}
            placeholderTextColor="#BDBDBD"
            autoCapitalize={secure ? "none" : "sentences"}
            autoCorrect={!secure}
            className="flex-1 text-base text-text-main-light dark:text-text-main-dark"
            style={{ paddingVertical: 0 }}
          />

          {secure && (
            <Pressable
              onPress={() => setShowPassword((prev) => !prev)}
              className="px-4"
              disabled={!editable}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={24}
                color="#4F4F4F"
              />
            </Pressable>
          )}
        </View>

        {isError && (
          <Text className="ml-1 mt-1 text-xs text-red-500 font-display">
            {error}
          </Text>
        )}
      </View>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;