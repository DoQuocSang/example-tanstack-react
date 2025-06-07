import { create } from "zustand";

interface State {
  currentPage: number;
  totalPage: number;
  setCurrentPage: (targetPage: number) => void;
  setTotalPage: (targetPage: number) => void;
}

export const usePaginationStore = create<State>((set) => ({
  currentPage: 1,
  totalPage: 1,
  setCurrentPage: (targetPage) => set(() => ({ currentPage: targetPage })),
  setTotalPage: (targetPage) => set(() => ({ totalPage: targetPage })),
}));
