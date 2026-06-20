import { useState } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AuthHeader from "@/components/auth/AuthHeader";
import AuthFooter from "@/components/auth/AuthFooter";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <>
      <AuthHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Only the form section scrolls + moves with the keyboard */}
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 20,
          flexGrow: 1,
        }}
      >
        <View className="flex flex-col px-6 pt-2">
          {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
          <AuthFooter />
        </View>
      </KeyboardAwareScrollView>
    </>
  );
}
