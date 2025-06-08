import { useQuery, queryOptions } from "@tanstack/react-query";
import { apiGet } from "../../api/http.api";
import type { ITodosResponse } from "../../model/todo.interface";
import TodoItem from "./TodoItem.component";
import QueryStatusIndicator from "../common/QueryStatusIndicator.component";
import AddTodo from "./AddTodo.component";
import type { Status } from "../../model/status.model";
import { useTodoMutationStore } from "../../stores/todo-mutation.store";
import { generateNumericId } from "../../helper/autoGenerateId.helper";

export default function TodoList() {
  const limit = 10;
  const skip = 5;
  const userId = 2;
  const isGetByUser = false;
  const userIdPath = isGetByUser ? `/user/${userId}` : "";

  const mutationStatus = useTodoMutationStore((state) => state.status);
  const mutationCompleted = useTodoMutationStore((state) => state.completed);
  const mutationTodo = useTodoMutationStore((state) => state.todo);

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

  return (
    <>
      <QueryStatusIndicator
        error={error}
        isFetching={isFetching}
        status={status as Status}
      />
      {!isFetching && (
        <div className="flex flex-col gap-4 max-w-xl">
          <AddTodo />
          <ul className=" bg-white p-6 rounded-lg shadow">
            {data?.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
            {(mutationStatus === "pending" ||
              (mutationStatus === "success" && !mutationCompleted)) && (
              <TodoItem
                key={generateNumericId()}
                todo={mutationTodo}
                isMutationTodo={true}
              />
            )}
          </ul>
        </div>
      )}
    </>
  );
}
