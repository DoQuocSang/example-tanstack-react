import { CheckCircle, LoaderIcon, XCircle } from "lucide-react";
import type { IMessage } from "../../model/message.interface";
import { useMutationState } from "@tanstack/react-query";

interface MutationStatusIndicatorProps {
  messages: IMessage;
}

export default function MutationStatusIndicator({
  messages,
}: MutationStatusIndicatorProps) {
  const status = useMutationState({
    filters: { mutationKey: ["addTodo"] },
    select: (mutation) => mutation.state.status,
  });

  if (status[0] === "pending") {
    return (
      <div className="flex items-center gap-4 bg-white rounded-md px-4 py-2 w-full text-slate-700 font-medium text-md animate-pulse">
        <LoaderIcon size={20} className="animate-spin" />
        <span>{messages.loading}</span>
      </div>
    );
  }
  if (status[0] === "error") {
    return (
      <div className="flex items-center gap-4 text-md font-medium bg-red-100 rounded-md p-4 w-full text-red-500">
        <XCircle size={20} />
        <span> Error: {messages.error}</span>
      </div>
    );
  }
  if (status[0] === "success") {
    return (
      <div className="flex items-center gap-4 bg-emerald-100 rounded-md p-4 w-full text-emerald-500 font-medium text-md">
        <CheckCircle size={20} />
        <span>{messages.success}</span>
      </div>
    );
  }

  return null;
}
