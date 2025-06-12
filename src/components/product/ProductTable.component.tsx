import { useQuery } from "@tanstack/react-query";
import useCustomQuery from "../../hooks/useCustomQuery.hook";
import type { IProduct } from "../../model/product.interface";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  type ColumnOrderState,
  type VisibilityState,
} from "@tanstack/react-table";
import { v4 as uuidv4 } from "uuid";
import { Image, Settings, X, XIcon } from "lucide-react";
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
import { useState } from "react";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import CustomTable from "../table/CustomTable.component";

export default function ProductTable() {
  const { productsGroupOptions } = useCustomQuery();
  const { data } = useQuery(productsGroupOptions());

  const columnHelper = createColumnHelper<IProduct>();

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sortedFlatColumns = [
    "availabilityStatus",
    "brand",
    "category",
    "description",
    "dimensions",
    "discountPercentage",
    "images",
    "minimumOrderQuantity",
    "price",
    "rating",
    "returnPolicy",
    "shippingInformation",
    "stock",
    "tags",
    "title",
    "warrantyInformation",
    "weight",
  ];

  const [showColumnSettings, setShowColumnSettings] = useState(false);

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [isPinBtnVisible, setIsPinBtnVisible] = useState(false);

  const [isOrderBtnVisible, setIsOrderBtnVisible] = useState(false);

  const [columnPinning, setColumnPinning] = useState({});

  const [isSplit, setIsSplit] = useState(false);

  const table = useReactTable({
    columns: groupColumns,
    data: data ?? [],
    getCoreRowModel: getCoreRowModel(),
    getRowId: () => uuidv4(),
    state: {
      columnVisibility,
      columnOrder,
      columnPinning,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
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

  return (
    <div className="flex flex-col w-full items-center justify-center mx-6">
      <div className="fixed bottom-6 right-6 z-50 h-screen flex flex-col justify-end">
        {showColumnSettings ? (
          <div className="bg-white/50 backdrop-blur-sm rounded-md shadow-lg overflow-hidden max-h-2/3 overflow-y-auto">
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
              tableType={"left"}
            />
          )}
          <CustomTable
            table={table}
            columnOrder={columnOrder}
            isSplit={isSplit}
            isPinBtnVisible={isPinBtnVisible}
            isOrderBtnVisible={isOrderBtnVisible}
            tableType={"center"}
          />
          {isSplit && (
            <CustomTable
              table={table}
              columnOrder={columnOrder}
              isSplit={isSplit}
              isPinBtnVisible={isPinBtnVisible}
              isOrderBtnVisible={isOrderBtnVisible}
              tableType={"right"}
            />
          )}
        </div>
      </DndContext>
    </div>
  );
}
