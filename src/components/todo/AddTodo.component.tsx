import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { apiPost } from "../../api/http.api";
import type { ITodo } from "../../model/todo.interface";
import { generateNumericId } from "../../helper/autoGenerateId.helper";
import MutationStatusIndicator from "../common/MutationStatusIndicator.component";
import type { IMessage } from "../../model/message.interface";

export default function AddTodo() {
  const userId = 2;

  const [input, setInput] = useState("");
  // const queryClient = useQueryClient();

  // Mutations
  const { error, mutate } = useMutation<ITodo, Error, ITodo>({
    mutationFn: (data) => apiPost("/todos/add", data),
    onSuccess: () => {
      // Invalidate and refetch
      // queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    mutationKey: ["addTodo"],
  });

  const onCreateTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTodo: ITodo = {
      id: generateNumericId(),
      todo: input,
      completed: false,
      userId: userId,
    };
    setInput("");
    mutate(newTodo);
  };

  const messages: IMessage = {
    loading: "Adding todo...",
    error: error ? error.message : "",
    success: "Todo added!",
    created: "Todo has been created but has not been added to Server",
  };

  return (
    <>
      <MutationStatusIndicator messages={messages} />
      <form onSubmit={onCreateTodo} className="flex items-center rounded-lg">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
