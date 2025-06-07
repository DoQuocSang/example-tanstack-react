import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from "@tanstack/react-query";
import { apiGet, apiPost } from "../api/http.api";
import type { ITodo, ITodosResponse } from "../model/todo.interface";
import { generateNumericId } from "../helper/autoGenerateId.helper";
import TodoItem from "./TodoItem.component";
import { LoaderIcon } from "lucide-react";

export default function TodoList() {
  const limit = 10;
  const skip = 5;
  const userId = 2;
  const isGetByUser = false;
  const userIdPath = isGetByUser ? `/user/${userId}` : "";

  const newTodo: ITodo = {
    id: generateNumericId(),
    todo: "Test item from SDQ",
    completed: false,
    userId: userId,
  };

  const queryClient = useQueryClient();

  function groupOptions() {
    return queryOptions({
      queryKey: ["todos"],
      queryFn: () =>
        apiGet<ITodosResponse>(
          `/todos${userIdPath}?limit=${limit}&skip=${skip}`
        ),
      staleTime: 5 * 1000,
      select: (data) => data.todos
    });
  }

  // Queries
  const { data, error, isPending, isError } = useQuery(groupOptions());

  // Mutations
  const mutation = useMutation({
    mutationFn: (data: Partial<ITodo>) => apiPost("/todos/add", data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  if (isPending) {
    return (
      <div className="flex items-center gap-4 text-slate-700 font-medium text-lg animate-pulse">
        <LoaderIcon size={20} className="animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <span className="text-lg font-medium text-red-500">
        Error: {error.message}
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-2 max-w-xl">
      <ul className=" bg-white p-6 rounded-lg shadow">
        {data?.map((todo) => (
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
