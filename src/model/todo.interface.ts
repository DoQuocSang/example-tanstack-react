export const DEFAULT_TODO: ITodo = {
  id: 0,
  todo: "",
  completed: false,
  userId: 0,
};

export const DEFAULT_TODOS_RESPONSE: ITodosResponse = {
  todos: [],
  total: 0,
  skip: 0,
  limit: 10,
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
