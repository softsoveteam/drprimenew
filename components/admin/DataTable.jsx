"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Search, RefreshCw, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Common DataTable Component for Admin Portal
 *
 * @param {Array} columns - Column definition objects: { header, id, accessorKey, render, className }
 * @param {Array} data - Array of row data objects
 * @param {boolean} isLoading - Loading state
 * @param {number} totalItems - Total count of entries across all pages
 * @param {number} page - Current active page (1-based)
 * @param {number} limit - Items per page
 * @param {function} onPageChange - Callback when page changes: (page) => void
 * @param {function} onLimitChange - Optional callback when page size changes: (limit) => void
 * @param {string} searchQuery - Current search filter string
 * @param {function} onSearchChange - Callback when search input changes: (search) => void
 * @param {function} onRefetch - Callback to trigger manual refetch
 * @param {number} refetchIntervalSeconds - Cooldown time for manual refetch (default: 10s)
 * @param {string} placeholderText - Search placeholder text
 * @param {string} emptyStateText - Text to display when table is empty
 * @param {React.ReactNode} emptyStateIcon - Icon to display when table is empty
 * @param {boolean} hidePagination - Flag to hide pagination bar
 * @param {function} onRowClick - Optional row click handler: (row) => void
 * @param {boolean} showSerialNumber - Show automatically calculated serial number column (default: true)
 * @param {React.ReactNode} actions - Optional actions / buttons to place beside the search bar
 */
export function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  totalItems = 0,
  page = 1,
  limit = 10,
  onPageChange,
  onLimitChange,
  searchQuery = "",
  onSearchChange,
  onRefetch,
  refetchIntervalSeconds = 10,
  placeholderText = "Search records...",
  emptyStateText = "No records found",
  emptyStateIcon = null,
  hidePagination = false,
  onRowClick,
  showSerialNumber = true,
  actions = null,
  className = "",
}) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [countdown, setCountdown] = useState(0);
  const debounceTimerRef = useRef(null);

  // Sync external search query
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Cooldown countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Debounced search handler
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setLocalSearch(val);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onSearchChange?.(val);
      onPageChange?.(1);
    }, 400);
  };

  const handleManualRefetch = () => {
    if (onRefetch && countdown === 0 && !isLoading) {
      onRefetch();
      setCountdown(refetchIntervalSeconds);
    }
  };

  const totalPages = Math.max(1, Math.ceil((totalItems || 0) / (limit || 10)));
  const serialOffset = Math.max(0, (Math.max(page, 1) - 1) * Math.max(limit, 1));

  // Build display columns with optional serial number column
  const displayColumns = useMemo(() => {
    if (!showSerialNumber) return columns;
    const srColumn = {
      id: "__sr_no",
      header: "Sr. No.",
      className: "w-16 text-center",
      render: (_row, rowIndex = 0) => (
        <span className="text-xs font-semibold text-muted-foreground tabular-nums">
          {serialOffset + rowIndex + 1}
        </span>
      ),
    };
    return [srColumn, ...columns];
  }, [columns, showSerialNumber, serialOffset]);

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col",
        className
      )}
    >
      {/* Top Action & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3.5 p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60">
        <div className="flex-1 max-w-md">
          <div className="flex items-center gap-2.5 border border-slate-200 rounded-xl px-3.5 h-10 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all shadow-xs">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none border-none min-w-0"
              placeholder={placeholderText}
              value={localSearch}
              onChange={handleSearchChange}
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch("");
                  onSearchChange?.("");
                  onPageChange?.(1);
                }}
                className="text-slate-400 hover:text-slate-600 text-xs p-1 rounded-md"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 justify-end">
          {actions}

          {onRefetch && (
            <button
              onClick={handleManualRefetch}
              disabled={isLoading || countdown > 0}
              className="inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-3.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xs cursor-pointer"
              title={countdown > 0 ? `Refetch cooldown (${countdown}s)` : "Refresh data"}
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin text-indigo-600")} />
              <span>{countdown > 0 ? `Refresh (${countdown}s)` : "Refresh"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Content Area */}
      <div className="overflow-x-auto flex-1 scrollbar-thin">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b border-slate-200/80">
              {displayColumns.map((col, idx) => (
                <TableHead
                  key={col.id || idx.toString()}
                  className={cn(
                    "text-[11px] font-bold text-slate-500 uppercase tracking-wider py-3.5 px-4",
                    col.className
                  )}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={displayColumns.length}
                  className="text-center py-20 text-slate-500"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">Loading records...</span>
                    <span className="text-[11px] text-slate-400">Fetching latest database snapshot</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={displayColumns.length}
                  className="text-center py-20 text-slate-500"
                >
                  <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                    {emptyStateIcon || (
                      <div className="h-14 w-14 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-center text-indigo-500 shadow-sm">
                        <Inbox className="w-7 h-7" />
                      </div>
                    )}
                    <span className="text-sm font-bold text-slate-800">{emptyStateText}</span>
                    <p className="text-xs text-slate-400">
                      Try adjusting your search query or filters to find what you're looking for.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIdx) => (
                <TableRow
                  key={row.id || rowIdx}
                  className={cn(
                    "hover:bg-slate-50/80 border-b border-slate-100 transition-colors group",
                    onRowClick && "cursor-pointer hover:bg-indigo-50/20"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {displayColumns.map((col, colIdx) => {
                    const cellKey = col.id || colIdx.toString();
                    return (
                      <TableCell
                        key={cellKey}
                        className={cn("py-3.5 px-4 text-xs text-slate-800", col.className)}
                      >
                        {col.render
                          ? col.render(row, rowIdx)
                          : col.accessorKey
                          ? row[col.accessorKey]
                          : null}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {!hidePagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-slate-100 bg-slate-50/40 gap-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-3.5">
            <div>
              Showing <span className="font-semibold text-slate-900">{data.length}</span> of{" "}
              <span className="font-semibold text-slate-900">{totalItems}</span> entries
            </div>

            {onLimitChange && (
              <div className="flex items-center gap-1.5 min-w-[120px]">
                <span className="text-slate-500 whitespace-nowrap">Per page:</span>
                <div className="w-20">
                  <Select
                    value={String(limit)}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onLimitChange(val);
                      onPageChange?.(1);
                    }}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </Select>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onPageChange && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Go to:</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={page}
                  onChange={(e) => {
                    const val = Math.min(totalPages, Math.max(1, parseInt(e.target.value) || 1));
                    onPageChange(val);
                  }}
                  className="w-12 px-1.5 py-1 text-center rounded-lg border border-slate-200 bg-white text-slate-800 outline-none focus:border-indigo-500 shadow-2xs font-semibold"
                />
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onPageChange?.(page - 1)}
                disabled={page <= 1 || isLoading}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs cursor-pointer transition-all"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="px-2.5 py-1 font-medium text-slate-600 select-none text-xs">
                Page <span className="font-semibold text-slate-900">{page}</span> of{" "}
                <span className="font-semibold text-slate-900">{totalPages}</span>
              </div>

              <button
                onClick={() => onPageChange?.(page + 1)}
                disabled={page >= totalPages || isLoading}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs cursor-pointer transition-all"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default DataTable;
