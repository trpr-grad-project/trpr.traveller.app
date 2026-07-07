import { create } from "zustand";

interface PendingJoinsState {
  ids: string[];
  add: (tripId: string) => void;
  remove: (tripId: string) => void;
}

export const usePendingJoins = create<PendingJoinsState>()((set) => ({
  ids: [],
  add: (tripId) => set((s) => ({ ids: s.ids.includes(tripId) ? s.ids : [...s.ids, tripId] })),
  remove: (tripId) => set((s) => ({ ids: s.ids.filter((id) => id !== tripId) })),
}));
