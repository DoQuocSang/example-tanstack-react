import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePaginationStore } from "../../stores/pagination.store";

export default function Pagination() {
  const currentPage = usePaginationStore((state) => state.currentPage);
  const totalPage = usePaginationStore((state) => state.totalPage);
  const isPlaceholderData = usePaginationStore(
    (state) => state.isPlaceholderData
  );
  const setCurrentPage = usePaginationStore((state) => state.setCurrentPage);

  const visiblePages = 4;

  const half = Math.floor(visiblePages / 2);
  let startPage = currentPage - half + 1;

  if (startPage < 1) startPage = 1;
  if (startPage + visiblePages - 1 > totalPage) {
    startPage = Math.max(1, totalPage - visiblePages + 1);
  }

  const pages = Array.from(
    { length: Math.min(visiblePages, totalPage) },
    (_, i) => startPage + i
  );

  return (
    <div className="flex items-center gap-4 p-4 my-4">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
        className="h-10 w-10 flex justify-center items-center rounded-lg shadow-md text-slate-700 bg-white disabled:bg-gray-300 disabled:hover:text-slate-700 hover:bg-teal-500 hover:text-white transition ease-in-out duration-150"
      >
        <ChevronLeft size={20} />
      </button>
      {pages.map((page) => {
        return (
          <button
            key={page}
            onClick={() => {
              if (!isPlaceholderData) {
                setCurrentPage(page);
              }
            }}
            disabled={isPlaceholderData}
            className={
              "h-10 w-10 flex justify-center items-center rounded-lg shadow-md hover:bg-teal-500 hover:text-white disabled:bg-gray-300 disabled:hover:text-slate-700 disabled:hover:bg-white transition ease-in-out duration-150 " +
              (page === currentPage
                ? "bg-teal-500 text-white"
                : "bg-white text-slate-700")
            }
          >
            {page}
          </button>
        );
      })}
      <button
        disabled={isPlaceholderData || currentPage === totalPage}
        onClick={() => {
          if (!isPlaceholderData) {
            setCurrentPage(currentPage + 1);
          }
        }}
        className="h-10 w-10 flex justify-center items-center rounded-lg shadow-md text-slate-700 bg-white disabled:bg-gray-300 disabled:hover:text-slate-700 hover:bg-teal-500 hover:text-white transition ease-in-out duration-150"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
