import { LoaderIcon } from "lucide-react";

export default function LoadingMessage() {
  return (
    <div className="flex items-center gap-4 text-slate-700 font-medium text-lg animate-pulse">
      <LoaderIcon size={20} className="animate-spin" />
      <span>Loading...</span>
    </div>
  );
}
