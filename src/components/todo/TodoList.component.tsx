import { useQuery } from "@tanstack/react-query";
import TodoItem from "./TodoItem.component";
import QueryStatusIndicator from "../common/QueryStatusIndicator.component";
import AddTodo from "./AddTodo.component";
import type { Status } from "../../model/status.model";
import { useEffect, useState } from "react";
import useCustomQuery from "../../hooks/useCustomQuery.hook";

export default function TodoList() {
  const [showCancel, setShowCancel] = useState(false);

  const { queryClient, todosGroupOptions } = useCustomQuery();

  const { data, error, status, isFetching } = useQuery(todosGroupOptions());

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
