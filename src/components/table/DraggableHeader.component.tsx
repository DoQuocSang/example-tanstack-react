import { flexRender, type Header } from "@tanstack/react-table";
import type { IProduct } from "../../model/product.interface";
import type { CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DraggableHeaderPops {
  header: Header<IProduct, unknown>;
  tailwindClass: string | undefined;
}

export default function DraggableHeader({
  header,
  tailwindClass,
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
        "py-2 px-4 cursor-grab capitalize rounded bg-blue-100 text-blue-500 border-2 border-white " +
        tailwindClass
      }
      {...attributes}
      {...listeners}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
    </th>
  );
}
