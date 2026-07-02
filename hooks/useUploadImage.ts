import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { tripService } from "@/services/trips";
import { useTripDraftStore } from "@/store/tripCreation";
import { enqueue, processQueue, getQueueLength } from "@/utils/offlineQueue";
import { useNetworkStatus } from "./useNetworkStatus";

export function useUploadImage() {
  const setImageUploaded = useTripDraftStore((s) => s.setImageUploaded);
  const { isConnected } = useNetworkStatus();

  const mutation = useMutation({
    mutationFn: async ({
      localUri,
      filename,
    }: {
      localUri: string;
      filename: string;
    }) => {
      const formData = new FormData();
      formData.append("request", {
        uri: localUri,
        type: "image/jpeg",
        name: filename,
      } as any);
      const result = await tripService.uploadImages(formData);
      return { localUri, filenames: result as string[] };
    },
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    onSuccess: ({ localUri, filenames }) => {
      const serverFilename = filenames[0];
      if (serverFilename) {
        setImageUploaded(localUri, serverFilename);
      }
    },
    onError: (err, { localUri, filename }) => {
      enqueue({
        execute: async () => {
          const formData = new FormData();
          formData.append("request", {
            uri: localUri,
            type: "image/jpeg",
            name: filename,
          } as any);
          const result = await tripService.uploadImages(formData);
          const filenames = result as string[];
          const serverFilename = filenames[0];
          if (serverFilename) {
            setImageUploaded(localUri, serverFilename);
          }
        },
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Upload resumed",
            text2: "Image uploaded after reconnection",
          });
        },
        onError: () => {
          Toast.show({
            type: "error",
            text1: "Upload failed",
            text2: "Could not upload image. Please try again.",
          });
        },
      });

      Toast.show({
        type: "error",
        text1: "Upload failed",
        text2: "Will retry when connection is back",
      });

      if (isConnected && getQueueLength() > 0) {
        processQueue();
      }
    },
  });

  return mutation;
}
