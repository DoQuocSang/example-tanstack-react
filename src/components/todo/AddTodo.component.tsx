import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { apiPost } from "../../api/http.api";
import type { ITodo, ITodoCreatedResponse } from "../../model/todo.interface";
import { generateNumericId } from "../../helper/autoGenerateId.helper";
import MutationStatusIndicator from "../common/MutationStatusIndicator.component";
import type { Status } from "../../model/status.model";
import type { IMessage } from "../../model/message.interface";

export default function AddTodo() {
  const userId = 2;

  const [todo, setTodo] = useState("");
  // const queryClient = useQueryClient();

  // Mutations
  const mutation = useMutation<ITodoCreatedResponse, Error, Partial<ITodo>>({
    mutationFn: (data) => apiPost("/todos/add", data),
    onSuccess: () => {
      // Invalidate and refetch
      // queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const onCreateTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTodo: ITodo = {
      id: generateNumericId(),
      todo: todo,
      completed: false,
      userId: userId,
    };
    mutation.mutate(newTodo);
  };

  const messages: IMessage = {
    loading: "Adding todo...",
    error: mutation.error ? mutation.error.message : "",
    success: "Todo added!",
    created: "Todo has been created but has not been added to Server",
  };

  return (
    <>
      <MutationStatusIndicator
        status={mutation.status as Status}
        completed={mutation.data?.completed ?? false}
        messages={messages}
      />
      <form onSubmit={onCreateTodo} className="flex items-center rounded-lg">
        <input
          type="text"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          placeholder="Create todo item"
          className="w-full focus:outline-none bg-white rounded-l-lg py-2 px-4"
        />
        <button
          type="submit"
          className="px-4 py-2 text-white font-medium bg-teal-500 rounded-r-lg"
        >
          Add
        </button>
      </form>
    </>
  );
}
