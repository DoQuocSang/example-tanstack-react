import { CircleCheck, CircleX } from "lucide-react";
import type { ITodo } from "../../model/todo.interface";

interface TodoItemProp {
  todo: ITodo;
  isMutationTodo?: boolean;
}

export default function TodoItem({
  todo,
  isMutationTodo = false,
}: TodoItemProp) {
  return (
    <div
      className={
        "flex items-center gap-4 bg-slate-50 my-4 p-4 rounded-md shadow" + (isMutationTodo ? "animate-pulse" : "")
      }
    >
      {todo.completed ? (
        <button>
          <CircleCheck size={20} className="text-emerald-500" />
        </button>
      ) : (
        <button>
          <CircleX size={20} className="text-red-500" />
        </button>
      )}
      <p className="text-slate-700">{todo.todo}</p>
    </div>
  );
}
