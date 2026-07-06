import Toast from "react-native-toast-message";
import { paymentService } from "@/services/payments";

export async function checkSufficientBalance(requiredPrice: number): Promise<boolean> {
  if (requiredPrice <= 0) return true;

  try {
    const { balance } = await paymentService.getBalance();
    if (balance < requiredPrice) {
      Toast.show({
        type: "error",
        text1: "Insufficient Balance",
        text2: `You need $${requiredPrice} but your balance is $${balance}. Please add funds to your wallet.`,
      });
      return false;
    }
    return true;
  } catch {
    Toast.show({
      type: "error",
      text1: "Could not verify balance",
      text2: "Please try again later.",
    });
    return false;
  }
}
