import { create } from "zustand";

export type ImageItem = {
  localUri: string;
  uploading: boolean;
  filename?: string;
};

export type DayDraft = {
  duration: number;
  placeIds: number[];
};

export type TripVisibility = "Public" | "Private";

export type MapLocation = {
  lat: number;
  lng: number;
  radius: number;
};

export interface TripDraftState {
  themeId: number | null;
  title: string;
  description: string;
  startDate: string | null;
  images: ImageItem[];
  visibility: TripVisibility;
  maxParticipants: number;
  governorateId: number | null;
  mapLocation: MapLocation | null;
  days: DayDraft[];

  setTheme: (id: number) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setStartDate: (date: string | null) => void;
  setVisibility: (v: TripVisibility) => void;
  setMaxParticipants: (n: number) => void;
  setGovernorate: (id: number) => void;
  setMapLocation: (loc: MapLocation) => void;
  setDayCount: (n: number) => void;
  addPlacesToDay: (dayIndex: number, placeIds: number[]) => void;
  removePlaceFromDay: (dayIndex: number, placeId: number) => void;
  setDayDuration: (dayIndex: number, hours: number) => void;
  addImage: (localUri: string) => void;
  setImageUploaded: (localUri: string, filename: string) => void;
  removeImage: (localUri: string) => void;
  reset: () => void;
}

const initialState = {
  themeId: null as number | null,
  title: "",
  description: "",
  startDate: null as string | null,
  images: [] as ImageItem[],
  visibility: "Public" as TripVisibility,
  maxParticipants: 1,
  governorateId: null as number | null,
  mapLocation: null as MapLocation | null,
  days: [{ duration: 12, placeIds: [] as number[] }],
};

export const useTripDraftStore = create<TripDraftState>()((set, get) => ({
  ...initialState,

  setTheme: (id) => set({ themeId: id }),

  setTitle: (title) => set({ title }),

  setDescription: (description) => set({ description }),

  setStartDate: (date) => set({ startDate: date }),

  setVisibility: (v) => set({ visibility: v }),

  setMaxParticipants: (n) => set({ maxParticipants: n }),

  setGovernorate: (id) =>
    set({ governorateId: id, mapLocation: null }),

  setMapLocation: (loc) =>
    set({ mapLocation: loc, governorateId: null }),

  setDayCount: (n) => {
    const { days } = get();
    if (n < 1) return;
    if (n === days.length) return;
    if (n > days.length) {
      const added = Array.from({ length: n - days.length }, () => ({
        duration: 12,
        placeIds: [] as number[],
      }));
      set({ days: [...days, ...added] });
    } else {
      set({ days: days.slice(0, n) });
    }
  },

  addPlacesToDay: (dayIndex, placeIds) => {
    const { days } = get();
    if (dayIndex < 0 || dayIndex >= days.length) return;
    const updated = days.map((d, i) => {
      if (i !== dayIndex) return d;
      const existing = new Set(d.placeIds);
      const newIds = placeIds.filter((id) => !existing.has(id));
      return { ...d, placeIds: [...d.placeIds, ...newIds] };
    });
    set({ days: updated });
  },

  removePlaceFromDay: (dayIndex, placeId) => {
    const { days } = get();
    if (dayIndex < 0 || dayIndex >= days.length) return;
    const updated = days.map((d, i) => {
      if (i !== dayIndex) return d;
      return { ...d, placeIds: d.placeIds.filter((id) => id !== placeId) };
    });
    set({ days: updated });
  },

  setDayDuration: (dayIndex, hours) => {
    const { days } = get();
    if (dayIndex < 0 || dayIndex >= days.length) return;
    const updated = days.map((d, i) => {
      if (i !== dayIndex) return d;
      return { ...d, duration: hours };
    });
    set({ days: updated });
  },

  addImage: (localUri) => {
    const { images } = get();
    set({ images: [...images, { localUri, uploading: true }] });
  },

  setImageUploaded: (localUri, filename) => {
    const { images } = get();
    const updated = images.map((img) =>
      img.localUri === localUri ? { ...img, uploading: false, filename } : img,
    );
    set({ images: updated });
  },

  removeImage: (localUri) => {
    const { images } = get();
    set({ images: images.filter((img) => img.localUri !== localUri) });
  },

  reset: () => set({ ...initialState }),
}));
