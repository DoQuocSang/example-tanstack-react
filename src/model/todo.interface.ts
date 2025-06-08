export const DEFAULT_TODO: ITodo = {
  id: 0,
  todo: "",
  completed: false,
  userId: 0,
};

export interface ITodo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface ITodosResponse {
  todos: ITodo[];
  total: number;
  skip: number;
  limit: number;
}

export interface ITodoCreatedResponse {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}
