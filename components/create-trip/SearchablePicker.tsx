import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { useColorScheme } from "nativewind";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";

export interface PickerItem {
  id: number;
  name: string;
}

export interface SearchablePickerRef {
  open: () => void;
  close: () => void;
}

interface SearchablePickerProps {
  items: PickerItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  labelExtractor?: (item: PickerItem) => string;
  snapPoints?: string[];
}

const SearchablePicker = forwardRef<SearchablePickerRef, SearchablePickerProps>(
  (
    {
      items,
      selectedId,
      onSelect,
      labelExtractor,
      snapPoints = ["50%", "80%"],
    },
    ref,
  ) => {
    const sheetRef = useRef<BottomSheet>(null);
    const [search, setSearch] = useState("");
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    const extractLabel = useMemo(
      () => labelExtractor ?? ((item: PickerItem) => item.name),
      [labelExtractor],
    );

    const filtered = useMemo(() => {
      if (!search.trim()) return items;
      const q = search.toLowerCase();
      return items.filter((item) =>
        extractLabel(item).toLowerCase().includes(q),
      );
    }, [items, search, extractLabel]);

    const open = useCallback(() => {
      setSearch("");
      sheetRef.current?.snapToIndex(0);
    }, []);

    const close = useCallback(() => {
      sheetRef.current?.close();
    }, []);

    useImperativeHandle(ref, () => ({ open, close }), [open, close]);

    return (
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onChange={(index) => { if (index === -1 || index === -1) Keyboard.dismiss(); }}
        backgroundStyle={{
          backgroundColor: isDark ? "#1f2f2f" : "white",
        }}
        handleIndicatorStyle={{
          backgroundColor: isDark ? "#64748b" : "#94a3b8",
        }}
      >
        <BottomSheetView className="flex-1 px-4">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="flex-1"
          >
            <View className="flex-row items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-4 h-11 gap-2 mb-3">
              <MaterialIcons name="search" size={20} color="#94a3b8" />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search..."
                placeholderTextColor="#94a3b8"
                className="flex-1 text-sm text-[#0c141d] dark:text-white"
                autoCorrect={false}
              />
              {search.length > 0 && (
                <Pressable onPress={() => setSearch("")}>
                  <MaterialIcons name="close" size={18} color="#94a3b8" />
                </Pressable>
              )}
            </View>
            <FlashList
              data={filtered}
              estimatedItemSize={52}
              keyExtractor={(item) => String(item.id)}
              onScrollBeginDrag={() => Keyboard.dismiss()}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const selected = selectedId === item.id;
                return (
                  <Pressable
                    onPress={() => {
                      onSelect(item.id);
                      sheetRef.current?.close();
                    }}
                    className={`flex-row items-center px-4 py-3.5 rounded-xl mb-1 ${
                      selected
                        ? "bg-primary/10 border border-primary/20"
                        : "border border-transparent"
                    }`}
                  >
                    <View
                      className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
                        selected
                          ? "border-primary bg-primary"
                          : "border-slate-300 dark:border-slate-600"
                      }`}
                    >
                      {selected && (
                        <View className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </View>
                    <Text className="text-sm font-medium text-[#0c141d] dark:text-white">
                      {extractLabel(item)}
                    </Text>
                  </Pressable>
                );
              }}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </KeyboardAvoidingView>
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

SearchablePicker.displayName = "SearchablePicker";
export default SearchablePicker;
