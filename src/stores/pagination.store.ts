import { create } from "zustand";

interface State {
  currentPage: number;
  totalPage: number;
  isPlaceholderData: boolean;
  setCurrentPage: (page: number) => void;
  setTotalPage: (page: number) => void;
  setIsPlaceholderData: (value: boolean) => void;
}

export const usePaginationStore = create<State>((set) => ({
  currentPage: 1,
  totalPage: 1,
  isPlaceholderData: false,
  setCurrentPage: (page) => set(() => ({ currentPage: page })),
  setTotalPage: (page) => set(() => ({ totalPage: page })),
  setIsPlaceholderData: (value) => set(() => ({ isPlaceholderData: value })),
}));
