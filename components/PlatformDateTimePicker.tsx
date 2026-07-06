import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform } from "react-native";

interface PlatformDateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  onCancel: () => void;
  minimumDate?: Date;
}

export default function PlatformDateTimePicker({
  value,
  onChange,
  onCancel,
  minimumDate,
}: PlatformDateTimePickerProps) {
  const [step, setStep] = useState<"date" | "time">("date");
  const [datePart, setDatePart] = useState<Date | null>(null);

  if (Platform.OS === "ios") {
    return (
      <DateTimePicker
        value={value}
        mode="datetime"
        display="spinner"
        minimumDate={
          minimumDate
            ? new Date(new Date(minimumDate).setHours(0, 0, 0, 0))
            : undefined
        }
        onChange={(_event, date) => {
          if (date) onChange(date);
        }}
      />
    );
  }

  if (step === "date") {
    return (
      <DateTimePicker
        value={value}
        mode="date"
        minimumDate={minimumDate}
        onChange={(_event, date) => {
          if (date) {
            setDatePart(date);
            setStep("time");
          } else {
            onCancel();
          }
        }}
      />
    );
  }

  return (
    <DateTimePicker
      value={value}
      mode="time"
      onChange={(_event, time) => {
        if (time && datePart) {
          const combined = new Date(datePart);
          combined.setHours(time.getHours(), time.getMinutes(), 0, 0);
          onChange(combined);
        } else {
          onCancel();
        }
      }}
    />
  );
}
