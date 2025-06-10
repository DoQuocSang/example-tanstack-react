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

export default function ProductTable() {
  const { productsGroupOptions } = useCustomQuery();
  const { data } = useQuery(productsGroupOptions());

  const columnHelper = createColumnHelper<IProduct>();

  const columns = [
    columnHelper.accessor("title", {
      header: () => "title",
      cell: (info) => info.renderValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("images", {
      header: () => "images",
      cell: (info) => {
        const images = info.getValue();
        if (images.length > 0) {
          return (
            <img src={images[0]} className="w-16 h-auto" alt="product-image" />
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
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("description", {
      header: () => "description",
      cell: (info) => <p className="line-clamp-5">{info.renderValue()}</p>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("tags", {
      header: () => "tags",
      cell: (info) => {
        return info.getValue().map((tag, index) => (
          <div key={index} className="flex flex-wrap gap-2">
            <span className="px-2 py-1 my-1 rounded-md bg-emerald-100 text-emerald-500 text-xs line-clamp-1">
              {tag}
            </span>
          </div>
        ));
      },
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("category", {
      header: () => "category",
      cell: (info) => info.renderValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("brand", {
      header: () => "brand",
      cell: (info) => info.renderValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("weight", {
      header: () => "weight (g)",
      cell: (info) => info.renderValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("price", {
      header: () => "price ($)",
      cell: (info) => info.renderValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("discountPercentage", {
      header: () => "discount (%)",
      cell: (info) => info.renderValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("stock", {
      header: () => "stock",
      cell: (info) => info.renderValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("availabilityStatus", {
      header: () => "status",
      cell: (info) => info.renderValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("rating", {
      header: () => "rating",
      cell: (info) => info.renderValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("warrantyInformation", {
      header: () => "warranty",
      cell: (info) => info.renderValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("shippingInformation", {
      header: () => "shipping",
      cell: (info) => info.renderValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("returnPolicy", {
      header: () => "return policy",
      cell: (info) => info.renderValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("minimumOrderQuantity", {
      header: () => "minimum order quantity",
      cell: (info) => info.renderValue(),
      footer: (info) => info.column.id,
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
      footer: (info) => info.column.id,
    }),
  ];

  const table = useReactTable({
    columns,
    data: data ?? [],
    getCoreRowModel: getCoreRowModel(),
    getRowId: () => uuidv4(),
  });
  return (
    <div className="flex flex-col w-full items-center justify-center mx-6">
      <div className="bg-white w-full shadow rounded-lg overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="table-auto min-w-max">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-blue-100 text-blue-500">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="py-2 px-4 capitalize">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={
                    "border-y-2 border-slate-100 text-slate-700 " +
                    (index % 2 !== 0 ? "bg-slate-100" : "")
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="py-2 px-4 max-w-[200px] text-pretty "
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {table.getFooterGroups().map((footerGroup) => (
                <tr key={footerGroup.id} className="bg-gray-300 text-gray-700">
                  {footerGroup.headers.map((footer) => (
                    <th key={footer.id} className="py-2 px-4">
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
    </div>
  );
}
