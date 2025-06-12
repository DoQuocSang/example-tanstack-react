import { useQuery } from "@tanstack/react-query";
import useCustomQuery from "../../hooks/useCustomQuery.hook";
import type { IProduct } from "../../model/product.interface";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { v4 as uuidv4 } from "uuid";
import { Image, XIcon } from "lucide-react";
import DraggableHeader from "../table/DraggableHeader.component";
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
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import DragAlongCell from "../table/DragAlongCell.component";

export default function ProductTable() {
  const { productsGroupOptions } = useCustomQuery();
  const { data } = useQuery(productsGroupOptions());

  const columnHelper = createColumnHelper<IProduct>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const groupColumns = [
    columnHelper.group({
      id: "general info",
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
        }),
        columnHelper.accessor("title", {
          header: () => "title",
          cell: (info) => info.renderValue(),
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor("description", {
          header: () => "description",
          cell: (info) => <p className="line-clamp-5">{info.renderValue()}</p>,
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor("category", {
          header: () => "category",
          cell: (info) => info.renderValue(),
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor("brand", {
          header: () => "brand",
          cell: (info) => info.renderValue(),
          footer: (props) => props.column.id,
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
        }),
        columnHelper.accessor("discountPercentage", {
          header: () => "discount (%)",
          cell: (info) => info.renderValue(),
          footer: (props) => props.column.id,
        }),
      ],
      footer: (props) => props.column.id,
    }),
    columnHelper.group({
      id: " Inventory & Shipping",
      header: () => " Inventory & Shipping",
      columns: [
        columnHelper.accessor("weight", {
          header: () => "weight (g)",
          cell: (info) => info.renderValue(),
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor("stock", {
          header: () => "stock",
          cell: (info) => info.renderValue(),
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor("availabilityStatus", {
          header: () => "status",
          cell: (info) => info.renderValue(),
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor("shippingInformation", {
          header: () => "shipping",
          cell: (info) => info.renderValue(),
          footer: (props) => props.column.id,
        }),
      ],
      footer: (props) => props.column.id,
    }),
    columnHelper.group({
      id: "additional details",
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
        }),
        columnHelper.accessor("rating", {
          header: () => "rating",
          cell: (info) => info.renderValue(),
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor("warrantyInformation", {
          header: () => "warranty",
          cell: (info) => info.renderValue(),
          footer: (props) => props.column.id,
        }),

        columnHelper.accessor("returnPolicy", {
          header: () => "return policy",
          cell: (info) => info.renderValue(),
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor("minimumOrderQuantity", {
          header: () => "minimum order quantity",
          cell: (info) => info.renderValue(),
          footer: (props) => props.column.id,
        }),
      ],
      footer: (props) => props.column.id,
    }),
  ];

  const flatColumns = [
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
    }),
    columnHelper.accessor("title", {
      header: () => "title",
      cell: (info) => info.renderValue(),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("description", {
      header: () => "description",
      cell: (info) => <p className="line-clamp-5">{info.renderValue()}</p>,
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("category", {
      header: () => "category",
      cell: (info) => info.renderValue(),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("brand", {
      header: () => "brand",
      cell: (info) => info.renderValue(),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("price", {
      header: () => "price ($)",
      cell: (info) => info.renderValue(),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("discountPercentage", {
      header: () => "discount (%)",
      cell: (info) => info.renderValue(),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("weight", {
      header: () => "weight (g)",
      cell: (info) => info.renderValue(),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("stock", {
      header: () => "stock",
      cell: (info) => info.renderValue(),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("availabilityStatus", {
      header: () => "status",
      cell: (info) => info.renderValue(),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("shippingInformation", {
      header: () => "shipping",
      cell: (info) => info.renderValue(),
      footer: (props) => props.column.id,
    }),
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
    }),
    columnHelper.accessor("rating", {
      header: () => "rating",
      cell: (info) => info.renderValue(),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("warrantyInformation", {
      header: () => "warranty",
      cell: (info) => info.renderValue(),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("returnPolicy", {
      header: () => "return policy",
      cell: (info) => info.renderValue(),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("minimumOrderQuantity", {
      header: () => "minimum order quantity",
      cell: (info) => info.renderValue(),
      footer: (props) => props.column.id,
    }),
  ];

  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    flatColumns.map((c) => c.id!)
  );

  const table = useReactTable({
    columns: flatColumns,
    data: data ?? [],
    getCoreRowModel: getCoreRowModel(),
    getRowId: () => uuidv4(),
    state: {
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
  });

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

  return (
    <div className="flex flex-col w-full items-center justify-center mx-6">
      <div className="bg-white w-full shadow-md rounded-lg overflow-hidden">
        <div className="w-full overflow-x-auto">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <table className="table-auto min-w-max rounded-lg overflow-hidden">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="text-slate-700">
                    <SortableContext
                      items={columnOrder}
                      strategy={horizontalListSortingStrategy}
                    >
                      {headerGroup.headers.map((header, index) => (
                        <DraggableHeader
                          key={header.id}
                          header={header}
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
                  <tr
                    key={row.id}
                    className="text-slate-700 hover:bg-slate-100"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <DragAlongCell key={cell.id} cell={cell} />
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {table.getFooterGroups().map((footerGroup) => (
                  <tr
                    key={footerGroup.id}
                    className="bg-gray-100 text-gray-700"
                  >
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
          </DndContext>
        </div>
      </div>
    </div>
  );
}
