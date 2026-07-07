import { create } from "zustand";

export type ImageItem = {
  localUri: string;
  uploading: boolean;
  filename?: string;
};

export type DayDraft = {
  duration: number;
  placeIds: number[];
  dayDate: string | null;
};

export type TripVisibility = "Public" | "Private";
export type PublishMode = "DirectPublish" | "Bidding";

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
  endDate: string | null;
  images: ImageItem[];
  visibility: TripVisibility;
  autoApprove: boolean;
  publishMode: PublishMode;
  maxParticipants: number;
  governorateId: number | null;
  governorateName: string | null;
  mapLocation: MapLocation | null;
  days: DayDraft[];
  placeNames: Record<number, string>;

  setTheme: (id: number) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setStartDate: (date: string | null) => void;
  setEndDate: (date: string | null) => void;
  setVisibility: (v: TripVisibility) => void;
  setAutoApprove: (v: boolean) => void;
  setPublishMode: (v: PublishMode) => void;
  setMaxParticipants: (n: number) => void;
  setGovernorate: (id: number, name: string) => void;
  setMapLocation: (loc: MapLocation) => void;
  setDayCount: (n: number) => void;
  addPlacesToDay: (dayIndex: number, placeIds: number[]) => void;
  setDayPlaces: (dayIndex: number, placeIds: number[]) => void;
  removePlaceFromDay: (dayIndex: number, placeId: number) => void;
  setDayDuration: (dayIndex: number, hours: number) => void;
  setDayDate: (dayIndex: number, date: string | null) => void;
  addImage: (localUri: string) => void;
  setImageUploaded: (localUri: string, filename: string) => void;
  removeImage: (localUri: string) => void;
  removeDay: (dayIndex: number) => void;
  reorderDayPlace: (dayIndex: number, fromIndex: number, toIndex: number) => void;
  setPlaceName: (id: number, name: string) => void;
  reset: () => void;
}

const initialState = {
  themeId: null as number | null,
  title: "",
  description: "",
  startDate: null as string | null,
  endDate: null as string | null,
  images: [] as ImageItem[],
  visibility: "Public" as TripVisibility,
  autoApprove: true,
  publishMode: "DirectPublish" as PublishMode,
  maxParticipants: 1,
  governorateId: null as number | null,
  governorateName: null as string | null,
  mapLocation: null as MapLocation | null,
  days: [{ duration: 12, placeIds: [] as number[], dayDate: null }],
  placeNames: {} as Record<number, string>,
};

export const useTripDraftStore = create<TripDraftState>()((set, get) => ({
  ...initialState,

  setTheme: (id) => set({ themeId: id }),

  setTitle: (title) => set({ title }),

  setDescription: (description) => set({ description }),

  setStartDate: (date) => set({ startDate: date }),

  setEndDate: (date) => set({ endDate: date }),

  setVisibility: (v) => set({ visibility: v }),

  setAutoApprove: (v) => set({ autoApprove: v }),

  setPublishMode: (v) => set({ publishMode: v }),

  setMaxParticipants: (n) => set({ maxParticipants: n }),

  setGovernorate: (id, name) =>
    set({ governorateId: id, governorateName: name, mapLocation: null }),

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
        dayDate: null as string | null,
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

  setDayPlaces: (dayIndex, placeIds) => {
    const { days } = get();
    if (dayIndex < 0 || dayIndex >= days.length) return;
    const updated = days.map((d, i) =>
      i !== dayIndex ? d : { ...d, placeIds },
    );
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

  setDayDate: (dayIndex, date) => {
    const { days } = get();
    if (dayIndex < 0 || dayIndex >= days.length) return;
    const updated = days.map((d, i) => {
      if (i !== dayIndex) return d;
      return { ...d, dayDate: date };
    });
    set({ days: updated });
  },

  addImage: (localUri) => {
    const { images } = get();
    if (images.some((img) => img.localUri === localUri)) return;
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

  removeDay: (dayIndex) => {
    const { days } = get();
    if (dayIndex < 0 || dayIndex >= days.length) return;
    set({ days: days.filter((_, i) => i !== dayIndex) });
  },

  reorderDayPlace: (dayIndex, fromIndex, toIndex) => {
    const { days } = get();
    if (dayIndex < 0 || dayIndex >= days.length) return;
    const day = days[dayIndex];
    if (fromIndex < 0 || fromIndex >= day.placeIds.length) return;
    if (toIndex < 0 || toIndex >= day.placeIds.length) return;
    const placeIds = [...day.placeIds];
    const [moved] = placeIds.splice(fromIndex, 1);
    placeIds.splice(toIndex, 0, moved);
    const updated = days.map((d, i) => (i !== dayIndex ? d : { ...d, placeIds }));
    set({ days: updated });
  },

  setPlaceName: (id, name) => {
    const { placeNames } = get();
    set({ placeNames: { ...placeNames, [id]: name } });
  },

  reset: () => set({ ...initialState }),
}));
