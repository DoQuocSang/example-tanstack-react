import { flexRender, type Cell } from "@tanstack/react-table";
import type { IProduct } from "../../model/product.interface";
import { useSortable } from "@dnd-kit/sortable";
import type { CSSProperties } from "react";
import { CSS } from "@dnd-kit/utilities";

interface DragAlongCellProps {
  cell: Cell<IProduct, unknown>;
}

export default function DragAlongCell({ cell }: DragAlongCellProps) {
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id,
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: "width transform 0.2s ease-in-out",
    width: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <td
      style={{
        ...style,
        width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
      }}
      ref={setNodeRef}
      className="py-2 px-4 text-pretty border-2 border-slate-100"
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  );
}
