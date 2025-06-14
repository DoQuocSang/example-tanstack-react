import type { Column } from "@tanstack/react-table";
import DebouncedInput from "./DebounceInput.component";
import { useMemo } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};

  const sortedUniqueValues = useMemo(
    () =>
      filterVariant === "range"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys())
            .sort()
            .slice(0, 5000),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [column.getFacetedUniqueValues(), filterVariant]
  );

  return filterVariant === "range" ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={
            column.getFacetedMinMaxValues()?.[0] !== undefined
              ? `${column.getFacetedMinMaxValues()?.[0]}`
              : "Min"
          }
          className="w-20 px-2 py-1 text-xs border border-blue-400 rounded-md"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={
            column.getFacetedMinMaxValues()?.[1]
              ? `${column.getFacetedMinMaxValues()?.[1]}`
              : "Max"
          }
          className="w-20 px-2 py-1 text-xs border border-blue-400 rounded-md"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === "select" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
      className="px-2 py-1 text-xs border border-blue-400 rounded-md"
    >
      <option value="">All</option>
      {sortedUniqueValues.map((value) => (
        <option value={value} key={value}>
          {value}
        </option>
      ))}
    </select>
  ) : (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.map((value) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        className="w-28 px-2 py-1 text-xs border border-blue-400 rounded-md"
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search`}
        type="text"
        value={(columnFilterValue ?? "") as string}
        list={column.id + "list"}
      />
    </>
  );
}
