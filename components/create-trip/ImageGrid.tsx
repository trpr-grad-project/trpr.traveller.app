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

  if (images.length === 1) {
    return (
      <View className="relative" style={{ height: 200 }}>
        <Thumbnail uri={images[0].localUri} uploading={images[0].uploading} />
        <DeleteButton onPress={() => onRemove(images[0].localUri)} />
        <AddButton onPress={onAdd} />
      </View>
    );
  }

  if (images.length === 2) {
    return (
      <View className="flex-row" style={{ height: 160, gap: GAP }}>
        {images.map((img, i) => (
          <View key={img.localUri} className="flex-1 relative">
            <Thumbnail uri={img.localUri} uploading={img.uploading} />
            <DeleteButton onPress={() => onRemove(img.localUri)} />
            {i === images.length - 1 && <AddButton onPress={onAdd} />}
          </View>
        ))}
      </View>
    );
  }

  if (images.length === 3) {
    return (
      <View className="flex-row" style={{ height: 160, gap: GAP }}>
        <View className="flex-1 relative">
          <Thumbnail uri={images[0].localUri} uploading={images[0].uploading} />
          <DeleteButton onPress={() => onRemove(images[0].localUri)} />
        </View>
        <View className="flex-1" style={{ gap: GAP }}>
          {images.slice(1).map((img) => (
            <View key={img.localUri} className="flex-1 relative">
              <Thumbnail uri={img.localUri} uploading={img.uploading} />
              <DeleteButton onPress={() => onRemove(img.localUri)} />
            </View>
          ))}
          <AddButton onPress={onAdd} />
        </View>
      </View>
    );
  }

  if (images.length === 4) {
    return (
      <View style={{ gap: GAP }}>
        <View className="flex-row" style={{ height: 120, gap: GAP }}>
          {images.slice(0, 2).map((img) => (
            <View key={img.localUri} className="flex-1 relative">
              <Thumbnail uri={img.localUri} uploading={img.uploading} />
              <DeleteButton onPress={() => onRemove(img.localUri)} />
            </View>
          ))}
        </View>
        <View className="flex-row" style={{ height: 120, gap: GAP }}>
          {images.slice(2, 4).map((img) => (
            <View key={img.localUri} className="flex-1 relative">
              <Thumbnail uri={img.localUri} uploading={img.uploading} />
              <DeleteButton onPress={() => onRemove(img.localUri)} />
            </View>
          ))}
          <AddButton onPress={onAdd} />
        </View>
      </View>
    );
  }

  const visible = images.slice(0, 4);
  const extraCount = images.length - 4;

  return (
    <View style={{ gap: GAP }}>
      <View className="flex-row" style={{ height: 120, gap: GAP }}>
        {visible.slice(0, 2).map((img) => (
          <View key={img.localUri} className="flex-1 relative">
            <Thumbnail uri={img.localUri} uploading={img.uploading} />
            <DeleteButton onPress={() => onRemove(img.localUri)} />
          </View>
        ))}
      </View>
      <View className="flex-row" style={{ height: 120, gap: GAP }}>
        {visible.slice(2, 3).map((img) => (
          <View key={img.localUri} className="flex-1 relative">
            <Thumbnail uri={img.localUri} uploading={img.uploading} />
            <DeleteButton onPress={() => onRemove(img.localUri)} />
          </View>
        ))}
        <View className="flex-1 relative">
          <Thumbnail uri={visible[3].localUri} uploading={visible[3].uploading} />
          <View className="absolute inset-0 bg-black/50 rounded-xl items-center justify-center">
            <Text className="text-white text-2xl font-bold">+{extraCount}</Text>
          </View>
          <DeleteButton onPress={() => onRemove(visible[3].localUri)} />
        </View>
        <AddButton onPress={onAdd} />
      </View>
    </View>
  );
}

function Thumbnail({
  uri,
  uploading,
}: {
  uri: string;
  uploading: boolean;
}) {
  return (
    <View className="flex-1 relative">
      <Image
        source={{ uri }}
        className="w-full h-full rounded-xl"
        resizeMode="cover"
      />
      {uploading && (
        <View className="absolute inset-0 bg-black/40 rounded-xl items-center justify-center">
          <ActivityIndicator color="white" size="small" />
        </View>
      )}
    </View>
  );
}

function DeleteButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 items-center justify-center z-10"
    >
      <MaterialIcons name="close" size={16} color="white" />
    </Pressable>
  );
}

function AddButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 items-center justify-center bg-slate-50 dark:bg-slate-800/50"
      style={{ minWidth: 80 }}
    >
      <MaterialIcons name="add" size={24} color="#94a3b8" />
    </Pressable>
  );
}
