import { CheckCircle, LoaderIcon, XCircle } from "lucide-react";
import type { IMessage } from "../../model/message.interface";
import { useTodoMutationStore } from "../../stores/todo-mutation.store";

interface MutationStatusIndicatorProps {
  messages: IMessage;
}

export default function MutationStatusIndicator({
  messages,
}: MutationStatusIndicatorProps) {
  const status = useTodoMutationStore((state) => state.status);
  const completed = useTodoMutationStore((state) => state.completed);

  if (status === "pending") {
    return (
      <div className="flex items-center gap-4 bg-white rounded-md px-4 py-2 w-full text-slate-700 font-medium text-md animate-pulse">
        <LoaderIcon size={20} className="animate-spin" />
        <span>{messages.loading}</span>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex items-center gap-4 text-md font-medium bg-red-100 rounded-md p-4 w-full text-red-500">
        <XCircle size={20} />
        <span> Error: {messages.error}</span>
      </div>
    );
  }
  if (status === "success") {
    return (
      <>
        {completed ? (
          <div className="flex items-center gap-4 bg-emerald-100 rounded-md p-4 w-full text-emerald-500 font-medium text-md">
            <CheckCircle size={20} />
            <span>{messages.success}</span>
          </div>
        ) : (
          <div className="flex items-center gap-4 bg-amber-100 rounded-md p-4 w-full text-amber-500 font-medium text-md">
            <CheckCircle size={20} />
            <span>{messages.created}</span>
          </div>
        )}
      </>
    );
  }

  return null;
}
