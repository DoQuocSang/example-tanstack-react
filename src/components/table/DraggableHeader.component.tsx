import { flexRender, type Header } from "@tanstack/react-table";
import type { IProduct } from "../../model/product.interface";
import type { CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronLeftCircle,
  ChevronRightCircle,
  GripVertical,
  XCircle,
} from "lucide-react";

interface DraggableHeaderPops {
  header: Header<IProduct, unknown>;
  tailwindClass: string | undefined;
  isPinBtnVisible: boolean;
  isOrderBtnVisible: boolean;
}

export default function DraggableHeader({
  header,
  tailwindClass,
  isPinBtnVisible,
  isOrderBtnVisible,
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
      style={style}
      className={
        "py-2 px-4 capitalize rounded bg-blue-100 text-blue-500 border-2 border-white " +
        tailwindClass
      }
    >
      <div className="flex items-center justify-center">
        <div className="flex flex-col justify-center items-center gap-2">
          <div className="flex items-center gap-1">
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}
            {isOrderBtnVisible && (
              <div className="cursor-grab" {...attributes} {...listeners}>
                <GripVertical size={20} className="text-teal-500" />
              </div>
            )}
          </div>
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
