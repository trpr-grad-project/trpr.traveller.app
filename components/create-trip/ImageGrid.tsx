import { MaterialIcons } from "@expo/vector-icons";
import type { ImageItem } from "@/store/tripCreation";
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

const GAP = 4;

interface ImageGridProps {
  images: ImageItem[];
  onAdd: () => void;
  onRemove: (localUri: string) => void;
}

export default function ImageGrid({ images, onAdd, onRemove }: ImageGridProps) {
  if (images.length === 0) {
    return (
      <Pressable
        onPress={onAdd}
        className="w-full h-40 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 items-center justify-center bg-slate-50 dark:bg-slate-800/50"
      >
        <MaterialIcons name="add-photo-alternate" size={36} color="#94a3b8" />
        <Text className="text-sm text-slate-500 mt-2 font-medium">
          Add photos
        </Text>
      </Pressable>
    );
  }

  return (
    <View className="flex-row flex-wrap" style={{ gap: GAP }}>
      {images.map((img) => (
        <View key={img.localUri} className="relative" style={{ width: 80, height: 80 }}>
          <Image
            source={{ uri: img.localUri }}
            className="w-full h-full rounded-xl"
            resizeMode="cover"
          />
          {img.uploading && (
            <View className="absolute inset-0 bg-black/40 rounded-xl items-center justify-center">
              <ActivityIndicator color="white" size="small" />
            </View>
          )}
          <DeleteButton onPress={() => onRemove(img.localUri)} />
        </View>
      ))}
      <AddButton onPress={onAdd} />
    </View>
  );
}

function DeleteButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-black/50 items-center justify-center z-10"
    >
      <MaterialIcons name="close" size={14} color="white" />
    </Pressable>
  );
}

function AddButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 items-center justify-center bg-slate-50 dark:bg-slate-800/50"
      style={{ width: 80, height: 80 }}
    >
      <MaterialIcons name="add" size={24} color="#94a3b8" />
    </Pressable>
  );
}
