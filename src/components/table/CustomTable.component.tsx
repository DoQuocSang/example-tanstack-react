import {
  flexRender,
  type ColumnOrderState,
  type Row,
  type Table,
} from "@tanstack/react-table";
import type { IProduct } from "../../model/product.interface";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import DraggableHeader from "./DraggableHeader.component";
import DragAlongCell from "./DragAlongCell.component";
import type { TableType } from "../../model/table.model";
import { memo } from "react";

interface TableProps {
  table: Table<IProduct>;
  columnOrder: ColumnOrderState;
  isSplit: boolean;
  isPinBtnVisible: boolean;
  isOrderBtnVisible: boolean;
  tableType: TableType;
  columnSizeVars: { [key: string]: number };
  totalTableWidth: number;
  enableMemo?: boolean;
}

function getTailwindClassForHeader(
  headersLength: number,
  headerDepth: number,
  headerIndex: number
) {
  const isFirstHeader = headerIndex === 0;
  const isLastHeader = headersLength - 1;
  if (headerDepth === 1) {
    if (isFirstHeader) {
      return "border-l-0 border-t-0";
    }
    if (isLastHeader) {
      return "border-r-0 border-t-0";
    }
  } else {
    if (isFirstHeader) {
      return "border-l-0";
    }
    if (isLastHeader) {
      return "border-r-0";
    }
  }
}

function getHeaderGroup(
  tableType: TableType,
  table: Table<IProduct>,
  isSplit: boolean
) {
  switch (tableType) {
    case "left":
      return table.getLeftHeaderGroups();
    case "right":
      return table.getRightHeaderGroups();
    case "center":
      if (isSplit) {
        return table.getCenterHeaderGroups();
      } else {
        return table.getHeaderGroups();
      }
    default:
      return table.getHeaderGroups();
  }
}

function getCells(row: Row<IProduct>, tableType: TableType, isSplit: boolean) {
  switch (tableType) {
    case "left":
      return row.getLeftVisibleCells();
    case "right":
      return row.getRightVisibleCells();
    case "center":
      if (isSplit) {
        return row.getCenterVisibleCells();
      } else {
        return row.getVisibleCells();
      }
    default:
      return row.getVisibleCells();
  }
}

function getFooterGroup(
  table: Table<IProduct>,
  tableType: TableType,
  isSplit: boolean
) {
  switch (tableType) {
    case "left":
      return table.getLeftFooterGroups();
    case "right":
      return table.getRightFooterGroups();
    case "center":
      if (isSplit) {
        return table.getCenterFooterGroups();
      } else {
        return table.getFooterGroups();
      }
    default:
      return table.getFooterGroups();
  }
}

function checkTableData(tableType: TableType, table: Table<IProduct>) {
  if (tableType === "center") {
    return true;
  }
  if (tableType === "left") {
    return table.getLeftLeafColumns().length > 0;
  }
  if (tableType === "right") {
    return table.getRightLeafColumns().length > 0;
  }
  return false;
}

const MemoizedTanStackTable = memo(
  TanStackTable,
  (prev, next) => prev.table.options.data === next.table.options.data
) as typeof TanStackTable;

function TanStackTable({
  table,
  columnOrder,
  isSplit,
  isPinBtnVisible,
  isOrderBtnVisible,
  tableType = "center",
  columnSizeVars,
  totalTableWidth,
}: TableProps) {
  return (
    <div className="bg-white w-full shadow-md rounded-lg overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table
          style={{
            ...columnSizeVars,
            width: totalTableWidth,
          }}
          className="table-auto w-full rounded-lg overflow-hidden"
        >
          <thead>
            {getHeaderGroup(tableType, table, isSplit).map((headerGroup) => (
              <tr key={headerGroup.id} className="text-slate-700">
                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  {headerGroup.headers.map((header, index) => (
                    <DraggableHeader
                      key={header.id}
                      header={header}
                      isPinBtnVisible={isPinBtnVisible}
                      isOrderBtnVisible={isOrderBtnVisible}
                      tailwindClass={getTailwindClassForHeader(
                        headerGroup.headers.length,
                        header.depth,
                        index
                      )}
                    />
                  ))}
                </SortableContext>
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="text-slate-700 hover:bg-slate-100">
                {getCells(row, tableType, isSplit).map((cell) => (
                  <DragAlongCell key={cell.id} cell={cell} />
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {getFooterGroup(table, tableType, isSplit).map((footerGroup) => (
              <tr key={footerGroup.id} className="bg-gray-100 text-gray-700">
                {footerGroup.headers.map((footer, index) => (
                  <th
                    key={footer.id}
                    colSpan={footer.colSpan}
                    className={
                      "py-2 px-4 capitalize rounded bg-gray-200 text-slate-500 border-2 border-white " +
                      getTailwindClassForHeader(
                        footerGroup.headers.length,
                        footer.depth,
                        index
                      )
                    }
                    style={{
                      width: `calc(var(--header-${footer?.id}-size) * 1px)`,
                    }}
                  >
                    {footer.isPlaceholder
                      ? null
                      : flexRender(
                          footer.column.columnDef.footer,
                          footer.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default function CustomTable({
  table,
  columnOrder,
  isSplit,
  isPinBtnVisible,
  isOrderBtnVisible,
  tableType = "center",
  columnSizeVars,
  totalTableWidth,
  enableMemo,
}: TableProps) {
  return (
    <>
      {checkTableData(tableType, table) ? (
        table.getState().columnSizingInfo.isResizingColumn && enableMemo ? (
          <MemoizedTanStackTable
            table={table}
            columnOrder={columnOrder}
            isSplit={isSplit}
            isPinBtnVisible={isPinBtnVisible}
            isOrderBtnVisible={isOrderBtnVisible}
            tableType={tableType}
            columnSizeVars={columnSizeVars}
            totalTableWidth={totalTableWidth}
          />
        ) : (
          <TanStackTable
            table={table}
            columnOrder={columnOrder}
            isSplit={isSplit}
            isPinBtnVisible={isPinBtnVisible}
            isOrderBtnVisible={isOrderBtnVisible}
            tableType={tableType}
            columnSizeVars={columnSizeVars}
            totalTableWidth={totalTableWidth}
          />
        )
      ) : null}
    </>
  );
}
