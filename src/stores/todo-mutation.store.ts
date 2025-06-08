import { create } from "zustand";
import { DEFAULT_TODO, type ITodo } from "../model/todo.interface";
import type { Status } from "../model/status.model";

interface State {
  todo: ITodo;
  status: Status;
  completed: boolean;
  setTodo: (value: ITodo) => void;
  setStatus: (value: Status) => void;
  setCompleted: (value: boolean) => void;
}

export const useTodoMutationStore = create<State>((set) => ({
  todo: DEFAULT_TODO,
  status: "idle",
  completed: false,
  setTodo: (value) => set(() => ({ todo: value })),
  setStatus: (value) => set(() => ({ status: value })),
  setCompleted: (value) => set(() => ({ completed: value ?? false })),
}));
