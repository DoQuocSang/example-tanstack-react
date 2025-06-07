import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "../api/http.api";
import type { ITodo, ITodosResponse } from "../model/todo.interface";
import { generateNumericId } from "../helper/autoGenerateId.helper";
import TodoItem from "./TodoItem.component";
import { useEffect } from "react";

export default function TodoList() {
  const queryClient = useQueryClient();

  const limit = 10;
  const newTodo: ITodo = {
    id: generateNumericId(),
    todo: "Test item from SDQ",
    completed: false,
    userId: 26,
  };

  // Queries
  const query = useQuery<ITodosResponse>({
    queryKey: ["todos"],
    queryFn: () => apiGet(`/todos?limit=${limit}`),
  });

  // Mutations
  const mutation = useMutation({
    mutationFn: (data: Partial<ITodo>) => apiPost("/todos/add", data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  useEffect(() => {
    console.log("query:", query);
  }, [query]);

  return (
    <div className="flex flex-col gap-2 max-w-xl">
      <ul className=" bg-white p-6 rounded-lg shadow">
        {query.data?.todos?.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>

      <button
        onClick={() => {
          mutation.mutate(newTodo);
        }}
        className="px-4 py-2 font-medium text-white bg-teal-500 rounded-md"
      >
        Add Todo
      </button>
    </div>
  );
}
