import type { Table } from "@tanstack/react-table";
import type { IProduct } from "../../model/product.interface";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface TablePaginationProps {
  table: Table<IProduct>;
}
export default function TablePagination({ table }: TablePaginationProps) {
  return (
    <>
      <div className="flex items-center justify-between p-4 text-slate-500 text-sm">
        <div>
          Showing {table.getRowModel().rows.length.toLocaleString()} of{" "}
          {table.getRowCount().toLocaleString()} Rows
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount().toLocaleString()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              min="1"
              max={table.getPageCount()}
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border border-slate-300 p-1 rounded w-12"
            />
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="border border-slate-300 rounded-md p-1 transition ease-in-out hover:bg-teal-500 hover:text-white hover:border-teal-500"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft size={20} />
          </button>
          <button
            className="border border-slate-300 rounded-md p-1 transition ease-in-out hover:bg-teal-500 hover:text-white hover:border-teal-500"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="border border-slate-300 rounded-md p-1 transition ease-in-out hover:bg-teal-500 hover:text-white hover:border-teal-500"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight size={20} />
          </button>
          <button
            className="border border-slate-300 rounded-md p-1 transition ease-in-out hover:bg-teal-500 hover:text-white hover:border-teal-500"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight size={20} />
          </button>
        </div>
      </div>
    </>
  );
}
