import {
  useQuery,
  queryOptions,
} from "@tanstack/react-query";
import { apiGet } from "../../api/http.api";
import { type ITodosResponse } from "../../model/todo.interface";
import TodoItem from "./TodoItem.component";
import QueryStatusIndicator from "../common/QueryStatusIndicator.component";
import AddTodo from "./AddTodo.component";
import type { Status } from "../../model/status.model";

export default function TodoList() {
  const limit = 10;
  const skip = 5;
  const userId = 2;
  const isGetByUser = false;
  const userIdPath = isGetByUser ? `/user/${userId}` : "";

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

  // const states = useMutationState({
  //   filters: { mutationKey: ["addTodo"] },
  //   select: (mutation) => mutation.state,
  // });

  // const mutationData = useMutationState<ITodo>({
  //   filters: { mutationKey: ["addTodo"], status: "pending" },
  //   select: (mutation) => mutation.state.variables as ITodo,
  // });

  // const isAnyPending = states.some((s) => s.status === "pending");

  // const latestPendingTodo = mutationData[mutationData.length - 1];

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
            {/* {isAnyPending && (
              <TodoItem
                key={generateNumericId()}
                todo={latestPendingTodo}
                isMutationTodo={true}
              />
            )} */}
          </ul>
        </div>
      )}
    </>
  );
}
