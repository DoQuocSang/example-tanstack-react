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
import { type Status } from "./QueryStatusIndicator.component";
import QueryStatusIndicator from "./QueryStatusIndicator.component";

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
      select: (data) => data.todos,
    });
  }

  // Queries
  const { data, error, status, isFetching } = useQuery(groupOptions());

  // Mutations
  const mutation = useMutation({
    mutationFn: (data: Partial<ITodo>) => apiPost("/todos/add", data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <>
      <QueryStatusIndicator
        error={error}
        isFetching={isFetching}
        status={status as Status}
      />
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
    </>
  );
}
