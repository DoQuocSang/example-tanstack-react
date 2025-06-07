import { LoaderIcon } from "lucide-react";

export type Status = "pending" | "error";

interface QueryStatusIndicatorProps {
  status: Status;
  error: Error | null;
  isFetching: boolean;
}

export default function QueryStatusIndicator({
  status,
  error,
  isFetching,
}: QueryStatusIndicatorProps) {
  if (status === "pending") {
    return (
      <div className="flex items-center gap-4 text-slate-700 font-medium text-lg animate-pulse">
        <LoaderIcon size={20} className="animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }
  if (status === "error" && error) {
    <span className="text-lg font-medium text-red-500">
      Error: {error.message}
    </span>;
  }

  if (isFetching) {
    return (
      <div className="text-slate-700 font-medium text-lg animate-pulse">
        Refreshing data...
      </div>
    );
  }

  return null;
}
