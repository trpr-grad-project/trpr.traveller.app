import React from "react";
import { Modal, Pressable, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface PhotoPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onChooseGallery: () => void;
}

export default function PhotoPickerModal({ visible, onClose, onTakePhoto, onChooseGallery }: PhotoPickerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable className="flex-1 bg-black/40 backdrop-blur items-center justify-center px-8" onPress={onClose}>
        <Pressable className="w-full max-w-[280px] bg-white dark:bg-slate-800 rounded-xl overflow-hidden" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 20 }}>
          <Pressable onPress={onTakePhoto} className="flex-row items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-700">
            <MaterialIcons name="photo-camera" size={22} color="#64748b" />
            <Text className="text-sm font-semibold text-slate-800 dark:text-slate-100">Take Photo</Text>
          </Pressable>
          <Pressable onPress={onChooseGallery} className="flex-row items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-700">
            <MaterialIcons name="image" size={22} color="#64748b" />
            <Text className="text-sm font-semibold text-slate-800 dark:text-slate-100">Choose from Gallery</Text>
          </Pressable>
          <Pressable onPress={onClose} className="px-6 py-4 items-center">
            <Text className="text-sm font-bold text-red-500">Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
