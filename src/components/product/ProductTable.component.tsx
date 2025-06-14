import { useQuery } from "@tanstack/react-query";
import useCustomQuery from "../../hooks/useCustomQuery.hook";
import type { IProduct } from "../../model/product.interface";
import {
  createColumnHelper,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  sortingFns,
  useReactTable,
  type ColumnFiltersState,
  type ColumnOrderState,
  type ColumnResizeMode,
  type FilterFn,
  type PaginationState,
  type RowData,
  type SortingFn,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { v4 as uuidv4 } from "uuid";
import { Image, Search, Settings, X, XIcon } from "lucide-react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useMemo, useState } from "react";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import CustomTable from "../table/CustomTable.component";
import {
  type RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";
import DebouncedInput from "../table/DebounceInput.component";

declare module "@tanstack/react-table" {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select";
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank,
      rowB.columnFiltersMeta[columnId]?.itemRank
    );
  }
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

export default function ProductTable() {
  const { productsGroupOptions } = useCustomQuery();
  const { data } = useQuery(productsGroupOptions());

  const columnHelper = createColumnHelper<IProduct>();

  const groupColumns = [
    columnHelper.group({
      id: "generalInfo",
      header: () => "general info",
      columns: [
        columnHelper.accessor("images", {
          header: () => "product",
          cell: (info) => {
            const images = info.getValue();
            if (images.length > 0) {
              return (
                <img
                  src={images[0]}
                  className="w-16 h-auto mx-auto"
                  alt="product-image"
                />
              );
            } else {
              return (
                <div className="h-16 w-16 flex flex-col gap-1 items-center text-gray-500">
                  <Image size={20} />
                  <p className="text-center text-xs">No image</p>
                </div>
              );
            }
          },
          footer: (props) => props.column.id,
          enableSorting: false,
          enableColumnFilter: false,
        }),
        columnHelper.accessor("title", {
          header: () => "title",
          cell: (info) => info.renderValue(),
          footer: (props) => props.column.id,
          filterFn: "includesString",
        }),
        columnHelper.accessor("description", {
          header: () => "description",
          cell: (info) => <p className="line-clamp-5">{info.renderValue()}</p>,
          footer: (props) => props.column.id,
          filterFn: "fuzzy",
          sortingFn: fuzzySort,
        }),
        columnHelper.accessor("category", {
          header: () => "category",
          cell: (info) => info.renderValue(),
          footer: (props) => props.column.id,
          filterFn: "includesString",
        }),
        columnHelper.accessor("brand", {
          header: () => "brand",
          cell: (info) => info.renderValue(),
          footer: (props) => props.column.id,
          filterFn: "includesString",
        }),
      ],
      footer: (props) => props.column.id,
    }),
    columnHelper.group({
      id: "Price",
      header: () => "Price",
      columns: [
        columnHelper.accessor("price", {
          header: () => "price ($)",
          cell: (info) => info.renderValue(),
          footer: (props) => props.column.id,
          filterFn: "inNumberRange",
          meta: {
            filterVariant: "range",
          },
        }),
        columnHelper.accessor("discountPercentage", {
          header: () => "discount (%)",
          cell: (info) => info.renderValue(),
          footer: (props) => props.column.id,
          filterFn: "inNumberRange",
          meta: {
            filterVariant: "range",
          },
        }),
      ],
      footer: (props) => props.column.id,
    }),
    columnHelper.group({
      id: "inventoryAndShipping",
      header: () => " Inventory & Shipping",
      columns: [
        columnHelper.accessor("weight", {
          header: () => "weight (g)",
          cell: (info) => info.renderValue(),
          footer: (props) => props.column.id,
          filterFn: "inNumberRange",
          meta: {
            filterVariant: "range",
          },
        }),
        columnHelper.accessor("stock", {
          header: () => "stock",
          cell: (info) => info.renderValue(),
          footer: (props) => props.column.id,
          filterFn: "inNumberRange",
          meta: {
            filterVariant: "range",
          },
        }),
        columnHelper.accessor("availabilityStatus", {
          header: () => "status",
          cell: (info) => info.renderValue(),
          footer: (props) => props.column.id,
          filterFn: "includesString",
          meta: {
            filterVariant: "select",
          },
        }),
        columnHelper.accessor("shippingInformation", {
          header: () => "shipping",
          cell: (info) => info.renderValue(),
          footer: (props) => props.column.id,
          filterFn: "includesString",
        }),
      ],
      footer: (props) => props.column.id,
    }),
    columnHelper.group({
      id: "additionalDetails",
      header: () => "additional details",
      columns: [
        columnHelper.accessor("dimensions", {
          header: () => "dimensions",
          cell: (info) => {
            const dimension = info.getValue();
            return (
              <div className="flex flex-wrap items-center gap-1 text-xs">
                <p className="bg-teal-100 text-teal-500 p-1 rounded my-1">
                  {dimension.width}
                </p>
                <p className="text-slate-700 my-1">
                  <XIcon size={10} />
                </p>
                <p className="bg-amber-100 text-amber-600 p-1 rounded my-1">
                  {dimension.height}
                </p>
                <p className="text-slate-700my-1">
                  <XIcon size={10} />
                </p>
                <p className="bg-red-100 text-red-500 p-1 rounded my-1">
                  {dimension.depth}
                </p>
              </div>
            );
          },
          footer: (props) => props.column.id,
          enableSorting: false,
          enableColumnFilter: false,
        }),
        columnHelper.accessor("tags", {
          header: () => "tags",
          cell: (info) => {
            return info.getValue().map((tag: string, index: number) => (
              <div key={index} className="flex flex-wrap gap-2">
                <span className="px-2 py-1 my-1 rounded-md bg-blue-100 text-blue-500 text-xs line-clamp-1">
                  {tag}
                </span>
              </div>
            ));
          },
          footer: (props) => props.column.id,
          enableSorting: false,
          enableColumnFilter: false,
        }),
        columnHelper.accessor("rating", {
          header: () => "rating",
          cell: (info) => info.renderValue(),
          footer: (props) => props.column.id,
          filterFn: "inNumberRange",
          meta: {
            filterVariant: "range",
          },
        }),
        columnHelper.accessor("warrantyInformation", {
          header: () => "warranty",
          cell: (info) => info.renderValue(),
          footer: (props) => props.column.id,
          filterFn: "includesString",
        }),

        columnHelper.accessor("returnPolicy", {
          header: () => "return policy",
          cell: (info) => info.renderValue(),
          footer: (props) => props.column.id,
          filterFn: "includesString",
        }),
        columnHelper.accessor("minimumOrderQuantity", {
          header: () => "minimum order quantity",
          cell: (info) => info.renderValue(),
          footer: (props) => props.column.id,
          filterFn: "inNumberRange",
          meta: {
            filterVariant: "range",
          },
        }),
      ],
      footer: (props) => props.column.id,
    }),
  ];

  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isPinBtnVisible, setIsPinBtnVisible] = useState(false);
  const [isOrderBtnVisible, setIsOrderBtnVisible] = useState(false);
  const [isFilterInputVisible, setIsFilterInputVisible] = useState(false);
  const [columnPinning, setColumnPinning] = useState({});
  const [isSplit, setIsSplit] = useState(false);
  const [enableMemo, setEnableMemo] = useState(false);
  const [enableResizeDebug, setEnableResizeDebug] = useState(false);
  const [columnResizeMode, setColumnResizeMode] =
    useState<ColumnResizeMode>("onChange");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    columns: groupColumns,
    data: data ?? [],
    defaultColumn: {
      minSize: 50,
      maxSize: 800,
    },
    columnResizeMode: columnResizeMode,
    enableColumnResizing: true,
    autoResetPageIndex: false,
    globalFilterFn: "fuzzy",
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getRowId: () => uuidv4(),
    state: {
      columnVisibility,
      columnOrder,
      columnPinning,
      pagination,
      sorting,
      columnFilters,
      globalFilter,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
  });

  // reorder columns after drag & drop
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
      });
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: number } = {};
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!;
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getState().columnSizingInfo, table.getState().columnSizing, table]);

  useEffect(() => {
    if (table.getState().columnFilters.some((f) => f.id === "description")) {
      if (table.getState().sorting.some((s) => s.id === "description")) {
        table.setSorting([{ id: "description", desc: false }]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getState().columnFilters]);

  return (
    <div className="flex flex-col gap-4 w-full items-center justify-center mx-6">
      <div className="fixed bottom-6 right-6 z-50">
        {showColumnSettings ? (
          <div className="bg-white/50 backdrop-blur-sm max-h-[66vh] overflow-y-auto rounded-md shadow-lg">
            <div className="flex flex-col gap-2">
              <div className="sticky top-0 font-bold flex items-center justify-between bg-teal-500 px-4 py-2 text-white">
                <h3>Settings</h3>
                <button onClick={() => setShowColumnSettings(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="text-slate-700 p-6 pt-2 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-teal-500 p-2 border-2 border-dashed border-teal-500">
                    Debug
                  </p>
                  <label>
                    <input
                      type="checkbox"
                      checked={enableResizeDebug}
                      onChange={(e) => setEnableResizeDebug(e.target.checked)}
                    />{" "}
                    Resize
                  </label>
                  <select
                    value={columnResizeMode}
                    onChange={(e) =>
                      setColumnResizeMode(e.target.value as ColumnResizeMode)
                    }
                    className="border p-2 border-black rounded"
                  >
                    <option value="onEnd">onEnd</option>
                    <option value="onChange">onChange</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-teal-500 p-2 border-2 border-dashed border-teal-500">
                    Table mode
                  </p>
                  <label>
                    <input
                      type="checkbox"
                      checked={isSplit}
                      onChange={(e) => setIsSplit(e.target.checked)}
                    />{" "}
                    Split Mode
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={isPinBtnVisible}
                      onChange={(e) => setIsPinBtnVisible(e.target.checked)}
                    />{" "}
                    Show pin button
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={isOrderBtnVisible}
                      onChange={(e) => setIsOrderBtnVisible(e.target.checked)}
                    />{" "}
                    Show order grab button
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={isFilterInputVisible}
                      onChange={(e) =>
                        setIsFilterInputVisible(e.target.checked)
                      }
                    />{" "}
                    Show fliter input
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={enableMemo}
                      onChange={(e) => setEnableMemo(e.target.checked)}
                    />{" "}
                    Memoize Table body
                  </label>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-teal-500 p-2 border-2 border-dashed border-teal-500">
                    Column Visible
                  </p>
                  <label className="flex items-center gap-2">
                    <input
                      {...{
                        type: "checkbox",
                        checked: table.getIsAllColumnsVisible(),
                        onChange: table.getToggleAllColumnsVisibilityHandler(),
                      }}
                    />
                    Toggle All
                  </label>

                  {table.getAllLeafColumns().map((column) => {
                    return (
                      <div key={column.id}>
                        <label className="flex items-center gap-2">
                          <input
                            {...{
                              type: "checkbox",
                              checked: column.getIsVisible(),
                              onChange: column.getToggleVisibilityHandler(),
                            }}
                          />{" "}
                          {column.id}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowColumnSettings(true)}
            className="rounded-md px-4 py-2 font-medium text-white bg-teal-500/75 hover:bg-teal-500"
          >
            <div className="flex items-center justify-between gap-2">
              <Settings size={20} />
              <p>Open setting</p>
            </div>
          </button>
        )}
      </div>
      {enableResizeDebug && (
        <div className="fixed bottom-6 left-6 z-50 max-h-2/3 overflow-y-auto">
          <div className="flex flex-col gap-2 bg-slate-900 rounded-md shadow-md overflow-hidden">
            <div className="sticky top-0 font-bold flex items-center justify-between bg-teal-500 px-4 py-2 text-white">
              <h3>Debug JSON</h3>
              <button onClick={() => setEnableResizeDebug(false)}>
                <X size={20} />
              </button>
            </div>
            <pre className="text-sm  p-6 py-2 text-white">
              {JSON.stringify(
                {
                  columnSizing: table.getState().columnSizing,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}

      <div className="flex w-full flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-col gap-2 text-slate-700">
          <h1 className="font-medium text-2xl">Product Table</h1>
          <p className="text-sm text-slate-500">
            This data is fetching from DummyJSON
          </p>
        </div>

        <div className="flex items-center overflow-hidden bg-white border border-slate-100 rounded-lg shadow-md">
          <span className="p-4 pr-0 text-slate-500">
            <Search size={20} />
          </span>
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="px-4 py-2 focus:outline-none"
            placeholder="Search all columns..."
          />
          <button className="bg-slate-300 text-slate-500 px-4 py-2 m-2 rounded-lg font-medium text-sm">
            Global Search
          </button>
        </div>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <div className="flex items-start gap-4 w-full">
          {isSplit && (
            <CustomTable
              table={table}
              columnOrder={columnOrder}
              isSplit={isSplit}
              isPinBtnVisible={isPinBtnVisible}
              isOrderBtnVisible={isOrderBtnVisible}
              isFilterInputVisible={isFilterInputVisible}
              tableType={"left"}
              columnSizeVars={columnSizeVars}
              totalTableWidth={table.getTotalSize()}
              enableMemo={enableMemo}
              columnResizeMode={columnResizeMode}
            />
          )}
          <CustomTable
            table={table}
            columnOrder={columnOrder}
            isSplit={isSplit}
            isPinBtnVisible={isPinBtnVisible}
            isOrderBtnVisible={isOrderBtnVisible}
            isFilterInputVisible={isFilterInputVisible}
            tableType={"center"}
            columnSizeVars={columnSizeVars}
            totalTableWidth={table.getTotalSize()}
            enableMemo={enableMemo}
            columnResizeMode={columnResizeMode}
          />
          {isSplit && (
            <CustomTable
              table={table}
              columnOrder={columnOrder}
              isSplit={isSplit}
              isPinBtnVisible={isPinBtnVisible}
              isOrderBtnVisible={isOrderBtnVisible}
              isFilterInputVisible={isFilterInputVisible}
              tableType={"right"}
              columnSizeVars={columnSizeVars}
              totalTableWidth={table.getTotalSize()}
              enableMemo={enableMemo}
              columnResizeMode={columnResizeMode}
            />
          )}
        </div>
      </DndContext>
    </div>
  );
}
