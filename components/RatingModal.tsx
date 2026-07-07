import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface RatingModalProps {
  visible: boolean;
  participantName: string;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => Promise<void>;
}

export default function RatingModal({
  visible,
  participantName,
  onClose,
  onSubmit,
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      await onSubmit(rating, review);
      setRating(0);
      setReview("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setRating(0);
    setReview("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable
        className="flex-1 bg-black/40 items-center justify-center px-8"
        onPress={handleClose}
      >
        <Pressable
          className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl p-6"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
          }}
          onPress={() => {}}
        >
          <Text className="text-lg font-bold text-center text-[#0c141d] dark:text-white mb-1">
            Rate {participantName}
          </Text>
          <Text className="text-xs text-slate-400 text-center mb-5">
            Share your experience with this participant
          </Text>

          {/* Stars */}
          <View className="flex-row justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => setRating(star)}>
                <MaterialIcons
                  name={star <= rating ? "star" : "star-outline"}
                  size={36}
                  color={star <= rating ? "#eab308" : "#cbd5e1"}
                />
              </Pressable>
            ))}
          </View>

          {/* Review input */}
          <TextInput
            value={review}
            onChangeText={setReview}
            placeholder="Write a review..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={4}
            className="h-24 bg-slate-50 dark:bg-slate-700 rounded-xl px-4 py-3 text-sm text-[#0c141d] dark:text-white border border-slate-200 dark:border-slate-600 mb-6"
            textAlignVertical="top"
          />

          {/* Buttons */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={handleClose}
              className="flex-1 h-12 rounded-xl border border-slate-200 dark:border-slate-600 items-center justify-center"
            >
              <Text className="text-sm font-bold text-slate-600 dark:text-slate-300">
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit}
              disabled={rating === 0 || submitting}
              className={`flex-1 h-12 rounded-xl items-center justify-center ${
                rating === 0 || submitting
                  ? "bg-primary/50"
                  : "bg-primary"
              }`}
            >
              {submitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-sm font-bold text-white">Submit</Text>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
