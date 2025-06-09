import { useQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { apiGet } from "../../api/http.api";
import { type ITodosResponse } from "../../model/todo.interface";
import TodoItem from "./TodoItem.component";
import QueryStatusIndicator from "../common/QueryStatusIndicator.component";
import AddTodo from "./AddTodo.component";
import type { Status } from "../../model/status.model";
import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function TodoList() {
  const limit = 10;
  const skip = 5;
  const userId = 2;
  const isGetByUser = false;
  const userIdPath = isGetByUser ? `/user/${userId}` : "";

  const queryClient = useQueryClient();
  const [showCancel, setShowCancel] = useState(false);

  function groupOptions() {
    return queryOptions({
      queryKey: ["todos"],
      queryFn: async ({ signal }) => {
        // await delay(5000);
        const todoResponse = await apiGet<ITodosResponse>(
          `/todos${userIdPath}?limit=${limit}&skip=${skip}`,
          signal
        );
        return todoResponse;
      },
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

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (isFetching) {
      timeoutId = setTimeout(() => {
        setShowCancel(true);
      }, 3000);
    } else {
      setShowCancel(false);
      clearTimeout(timeoutId);
    }

    return () => clearTimeout(timeoutId);
  }, [isFetching]);

  return (
    <>
      <QueryStatusIndicator
        error={error}
        isFetching={isFetching}
        status={status as Status}
      />
      {showCancel && (
        <button
          onClick={(e) => {
            e.preventDefault();
            queryClient.cancelQueries({ queryKey: ["todos"] });
          }}
          className="font-medium px-4 py-2 rounded-md bg-red-100 text-red-500"
        >
          Cancel API
        </button>
      )}
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
