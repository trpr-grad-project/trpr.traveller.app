import { useMutation } from "@tanstack/react-query";
import { tripService } from "@/services/trips";
import { useTripDraftStore } from "@/store/tripCreation";

export function useUploadImage() {
  const setImageUploaded = useTripDraftStore((s) => s.setImageUploaded);

  return useMutation({
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
    onSuccess: ({ localUri, filenames }) => {
      const serverFilename = filenames[0];
      if (serverFilename) {
        setImageUploaded(localUri, serverFilename);
      }
    },
  });
}
