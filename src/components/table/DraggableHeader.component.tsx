import { flexRender, type Header, type Table } from "@tanstack/react-table";
import type { IProduct } from "../../model/product.interface";
import type { CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  ChevronLeftCircle,
  ChevronRightCircle,
  GripVertical,
  XCircle,
} from "lucide-react";
import type { ResizeMode } from "../../model/table.model";
import Filter from "./Filter.component";

interface DraggableHeaderPops {
  header: Header<IProduct, unknown>;
  tailwindClass: string | undefined;
  isPinBtnVisible: boolean;
  isOrderBtnVisible: boolean;
  isFilterInputVisible: boolean;
  table: Table<IProduct>;
  columnResizeMode: ResizeMode;
}

export default function DraggableHeader({
  header,
  tailwindClass,
  isPinBtnVisible,
  isOrderBtnVisible,
  isFilterInputVisible,
  table,
  columnResizeMode,
}: DraggableHeaderPops) {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: "width transform 0.2s ease-in-out",
    whiteSpace: "nowrap",
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };
  return (
    <th
      colSpan={header.colSpan}
      ref={setNodeRef}
      style={{
        ...style,
        width: `calc(var(--header-${header?.id}-size) * 1px)`,
      }}
      className={
        "py-2 px-4 capitalize select-none rounded bg-blue-100 text-blue-500 border-2 border-white " +
        tailwindClass
      }
    >
      <div className="flex items-center justify-center">
        <div className="flex flex-col justify-center items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1">
              <div
                className={
                  "flex items-center gap-1 " +
                  (header.column.getCanSort() ? "cursor-pointer" : "")
                }
                onClick={header.column.getToggleSortingHandler()}
                title={
                  header.column.getCanSort()
                    ? header.column.getNextSortingOrder() === "asc"
                      ? "Sort ascending"
                      : header.column.getNextSortingOrder() === "desc"
                      ? "Sort descending"
                      : "Clear sort"
                    : undefined
                }
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                {{
                  asc: <ArrowUpNarrowWide size={20} />,
                  desc: <ArrowDownWideNarrow size={20} />,
                }[header.column.getIsSorted() as string] ?? null}
              </div>

              {isOrderBtnVisible && (
                <div className="cursor-grab" {...attributes} {...listeners}>
                  <GripVertical size={20} className="text-teal-500" />
                </div>
              )}
            </div>

            {header.column.getCanFilter() && isFilterInputVisible ? (
              <div>
                <Filter column={header.column} />
              </div>
            ) : null}
          </div>
          <div
            {...{
              onDoubleClick: () => header.column.resetSize(),
              onMouseDown: header.getResizeHandler(),
              onTouchStart: header.getResizeHandler(),
              className: `resizer ${
                header.column.getIsResizing() ? "isResizing" : ""
              }`,
              style: {
                transform:
                  columnResizeMode === "onEnd" && header.column.getIsResizing()
                    ? `translateX(${
                        table.getState().columnSizingInfo.deltaOffset ?? 0
                      }px)`
                    : "",
              },
            }}
          />
          {!header.isPlaceholder &&
            header.column.getCanPin() &&
            isPinBtnVisible && (
              <div className="flex gap-1 justify-center items-center">
                {header.column.getIsPinned() !== "left" ? (
                  <button
                    onClick={() => {
                      header.column.pin("left");
                    }}
                    className="text-emerald-500"
                  >
                    <ChevronLeftCircle size={20} />
                  </button>
                ) : null}
                {header.column.getIsPinned() ? (
                  <button
                    onClick={() => {
                      header.column.pin(false);
                    }}
                    className="text-red-500"
                  >
                    <XCircle size={20} />
                  </button>
                ) : null}
                {header.column.getIsPinned() !== "right" ? (
                  <button
                    onClick={() => {
                      header.column.pin("right");
                    }}
                    className="text-emerald-500"
                  >
                    <ChevronRightCircle size={20} />
                  </button>
                ) : null}
              </div>
            )}
        </div>
      </div>
    </th>
  );
}
