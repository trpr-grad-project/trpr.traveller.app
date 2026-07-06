import { create } from "zustand";

export interface PlaceDraftState {
  title: string;
  description: string;
  governorateId: number | null;
  governorateName: string;
  categoryId: number | null;
  categoryName: string;
  tagIds: number[];
  latitude: number | null;
  longitude: number | null;

  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setGovernorate: (id: number, name: string) => void;
  setCategory: (id: number, name: string) => void;
  setTagIds: (ids: number[]) => void;
  setLocation: (lat: number, lng: number) => void;
  reset: () => void;
}

const initialState = {
  title: "",
  description: "",
  governorateId: null as number | null,
  governorateName: "",
  categoryId: null as number | null,
  categoryName: "",
  tagIds: [] as number[],
  latitude: null as number | null,
  longitude: null as number | null,
};

export const usePlaceDraftStore = create<PlaceDraftState>()((set) => ({
  ...initialState,

  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  setGovernorate: (id, name) => set({ governorateId: id, governorateName: name }),
  setCategory: (id, name) => set({ categoryId: id, categoryName: name }),
  setTagIds: (ids) => set({ tagIds: ids }),
  setLocation: (lat, lng) => set({ latitude: lat, longitude: lng }),
  reset: () => set({ ...initialState }),
}));
