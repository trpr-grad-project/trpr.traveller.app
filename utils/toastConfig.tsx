import React from "react";
import { BaseToast, ErrorToast } from "react-native-toast-message";

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#10B981",
        borderLeftWidth: 6,
        width: "90%",
        height: "auto",
        minHeight: 60,
        paddingVertical: 12,
        borderRadius: 12,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "700",
      }}
      text2Style={{
        fontSize: 14,
      }}
      text2NumberOfLines={3}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "#EF4444",
        borderLeftWidth: 6,
        borderColor: "#EF4444",
        borderWidth: 1,
        width: "90%",
        height: "auto",
        minHeight: 60,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: "#FEF2F2",
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "700",
        color: "#991B1B",
      }}
      text2Style={{
        fontSize: 14,
        color: "#B91C1C",
      }}
      text2NumberOfLines={3}
    />
  ),
};
