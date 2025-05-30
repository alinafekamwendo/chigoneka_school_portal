// components/Tables/MyDataTable.tsx
"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowUpward,
  ArrowDownward,
  Edit,
  Visibility,
  Delete,
  Search,
  FilterList,
  Cancel,
} from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface Column<T extends object> {
  key: keyof T;
  label: string;
  isSortable?: boolean;
  isFilterable?: boolean;
  format?: (value: any, item?: T) => React.ReactNode | string;
  filterType?: "text" | "select";
  filterOptions?: string[];
}

interface DataTableProps<T extends object> {
  data?: T[];
  columns: Column<T>[];
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  itemsPerPageOptions?: number[];
  className?: string;
  renderActions?: (item: T) => React.ReactNode;
}

const MyDataTable = <T extends object>({
  data: initialDataProp = [],
  columns,
  onDelete,
  onView,
  onEdit,
  itemsPerPageOptions = [5, 10, 20, 50],
  className,
  renderActions,
}: DataTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null,
  );
  const [filters, setFilters] = useState<{ [key in keyof T]?: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
  const [localData, setLocalData] = useState<T[]>(initialDataProp);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLocalData(initialDataProp);
  }, [initialDataProp]);

  const filteredData = useMemo(() => {
    return localData.filter((item: T) => {
      const matchesSearch = searchTerm
        ? columns.some((column) => {
            const value = String(item[column.key] ?? "").toLowerCase();
            return value.includes(searchTerm.toLowerCase());
          })
        : true;

      const matchesFilters = Object.entries(filters).every(
        ([key, filterValue]) => {
          const itemValue = String(item[key as keyof T] ?? "").toLowerCase();
          return itemValue.includes(String(filterValue).toLowerCase());
        },
      );

      return matchesSearch && matchesFilters;
    });
  }, [localData, columns, searchTerm, filters]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (columnKey: keyof T) => {
    if (sortColumn === columnKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const handleFilterChange = (columnKey: keyof T, value: string) => {
    setFilters((prev) => ({ ...prev, [columnKey]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({});
    setSearchTerm("");
    setCurrentPage(1);
    setShowFilters(false);
  };

  const renderSortIcon = (columnKey: keyof T) => {
    if (sortColumn !== columnKey) return null;
    return sortDirection === "asc" ? (
      <ArrowUpward className="ml-1 h-4 w-4" />
    ) : (
      <ArrowDownward className="ml-1 h-4 w-4" />
    );
  };

  const renderCellValue = (item: T, column: Column<T>) => {
    const value = item[column.key];
    return column.format ? column.format(value, item) : String(value);
  };

  const showActions = renderActions || onView || onEdit || onDelete;

  return (
    <div
      className={cn("rounded-lg border border-gray-200 shadow-md", className)}
    >
      {/* Search and Filters */}
      <div className="flex flex-col items-start justify-between gap-4 p-4 sm:flex-row sm:items-center">
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-64"
          />
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <FilterList className="h-4 w-4" />
            {Object.keys(filters).length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {Object.keys(filters).length}
              </span>
            )}
          </Button>
          <Button
            onClick={resetFilters}
            variant="ghost"
            className="text-gray-700 hover:text-gray-900"
          >
            <Cancel className="h-4 w-4" />
          </Button>
        </div>

        {/* Items per page */}
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <span className="text-sm font-medium text-gray-700">
            Items per page:
          </span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent>
              {itemsPerPageOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter Dropdown */}
      {showFilters && (
        <div className="grid grid-cols-1 gap-4 rounded-md border-t border-gray-200 bg-gray-50 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {columns
            .filter((col) => col.isFilterable)
            .map((column) => (
              <div key={`filter-${String(column.key)}`}>
                <label className="block text-sm font-medium text-gray-700">
                  {column.label}
                </label>
                {column.filterType === "select" && column.filterOptions ? (
                  <Select
                    value={filters[column.key] || ""}
                    onValueChange={(value) =>
                      handleFilterChange(column.key, value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`Select ${column.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {column.filterOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type="text"
                    placeholder={`Filter ${column.label}`}
                    value={filters[column.key] || ""}
                    onChange={(e) =>
                      handleFilterChange(column.key, e.target.value)
                    }
                    className="mt-1"
                  />
                )}
              </div>
            ))}
        </div>
      )}

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  scope="col"
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500",
                    column.isSortable && "cursor-pointer hover:bg-gray-100",
                  )}
                  onClick={
                    column.isSortable ? () => handleSort(column.key) : undefined
                  }
                >
                  <div className="flex items-center">
                    {column.label}
                    {column.isSortable && renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
              {showActions && (
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500"
                  colSpan={columns.length + (showActions ? 1 : 0)}
                >
                  No data found.
                </td>
              </tr>
            ) : (
              paginatedData.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td
                      className="whitespace-nowrap px-6 py-4 text-sm text-gray-800"
                      key={`${item.id}-${String(column.key)}`}
                    >
                      {renderCellValue(item, column)}
                    </td>
                  ))}
                  {showActions && (
                    <td className="flex justify-end gap-2 whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      {renderActions ? (
                        renderActions(item)
                      ) : (
                        <>
                          {onView && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onView(item)}
                            >
                              <Visibility className="h-5 w-5 text-green hover:text-indigo-600" />
                            </Button>
                          )}
                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(item)}
                            >
                              <Edit className="h-5 w-5 text-blue hover:text-green-600" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDelete(item)}
                            >
                              <Delete className="h-5 w-5 text-red-600 hover:text-gray-5" />
                            </Button>
                          )}
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="mr-2"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(endIndex, sortedData.length)}
                </span>{" "}
                of <span className="font-medium">{sortedData.length}</span>{" "}
                results
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ),
              )}
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDataTable;
