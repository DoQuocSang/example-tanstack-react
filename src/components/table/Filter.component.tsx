import type { Column } from "@tanstack/react-table";
import DebouncedInput from "./DebounceInput.component";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};

  return filterVariant === "range" ? (
    <div>
      <div className="flex space-x-2">
        {/* See faceted column filters example for min max values functionality */}
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min`}
          className="w-16 px-2 py-1 text-sm border border-blue-400 rounded-md"
        />
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max`}
          className="w-16 px-2 py-1 text-sm border border-blue-400 rounded-md"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === "select" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
      className="px-2 py-1 text-sm border border-blue-400 rounded-md"
    >
      {/* See faceted column filters example for dynamic select options */}
      <option value="">All</option>
      <option value="in stock">In stock</option>
      <option value="low stock">Low stock</option>
      <option value="out of stock">Out of stock</option>
    </select>
  ) : (
    <DebouncedInput
      className="w-24 px-2 py-1 text-sm border border-blue-400 rounded-md"
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search`}
      type="text"
      value={(columnFilterValue ?? "") as string}
    />
    // See faceted column filters example for datalist search suggestions
  );
}
