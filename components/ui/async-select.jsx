"use client";

import React, { useEffect, useRef, useState, useId, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check, X, Search, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

/**
 * Common AsyncSelect Component for Dynamic API-driven Dropdowns
 *
 * @param {Object|Array|null} value - Currently selected item or array of items (multi mode)
 * @param {function} onChange - Callback when selection changes: (val) => void
 * @param {function} loadOptions - Async function returning { data: Array, meta?: { pagination?: { totalPages: number } } }
 * @param {boolean} multi - Enable multiple item selection mode (chips)
 * @param {boolean} searchable - Show search input inside dropdown (default: true)
 * @param {number} pageSize - Number of items to fetch per page (default: 20)
 * @param {string} placeholder - Placeholder text when no item is selected
 * @param {boolean} creatable - Allow creating new items on the fly
 * @param {string} idKey - Identifier key in item objects (default: "id" or "_id")
 * @param {string} labelKey - Label display key in item objects (default: "name" or "label")
 * @param {boolean} disabled - Disable interaction
 */
export function AsyncSelect({
  value,
  onChange,
  loadOptions,
  multi = false,
  searchable = true,
  pageSize = 20,
  placeholder = "Select option...",
  creatable = false,
  className = "",
  idKey = "id",
  labelKey = "name",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const debouncedSearch = useDebounce(q, 350);

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectingAll, setSelectingAll] = useState(false);

  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const listEndRef = useRef(null);
  const [menuPos, setMenuPos] = useState(null);

  const optionId = useCallback(
    (opt) => {
      if (!opt) return "";
      return String(opt[idKey] ?? opt.id ?? opt._id ?? opt.value ?? "");
    },
    [idKey]
  );

  const optionLabel = useCallback(
    (opt) => {
      if (!opt) return "";
      return String(opt[labelKey] ?? opt.name ?? opt.label ?? opt.title ?? "");
    },
    [labelKey]
  );

  // Position calculation for portal
  const updateMenuPos = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const menuHeight = 320;

    let top = rect.bottom + 6;
    if (spaceBelow < menuHeight && rect.top > menuHeight) {
      top = rect.top - menuHeight - 6;
    }

    setMenuPos({
      top: Math.max(8, top),
      left: Math.max(8, rect.left),
      width: rect.width,
    });
  }, []);

  // Fetch options handler
  const fetchOptions = useCallback(
    async (pageNum, searchQuery, isReset = false) => {
      if (!loadOptions || isLoading) return;
      setIsLoading(true);

      try {
        const res = await loadOptions({
          page: pageNum,
          page_size: pageSize,
          search: searchQuery.trim() || undefined,
        });

        const rawData = res?.data?.data || res?.data || res || [];
        const fetchedItems = Array.isArray(rawData) ? rawData : [];

        setItems((prev) => (isReset ? fetchedItems : [...prev, ...fetchedItems]));

        const totalPages =
          res?.meta?.pagination?.totalPages ||
          res?.meta?.last_page ||
          res?.pagination?.totalPages ||
          (fetchedItems.length < pageSize ? pageNum : pageNum + 1);

        setHasMore(pageNum < totalPages && fetchedItems.length >= pageSize);
      } catch (err) {
        console.error("AsyncSelect fetchOptions error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [loadOptions, pageSize, isLoading]
  );

  // When search query changes or dropdown opens, reload from page 1
  useEffect(() => {
    if (open) {
      setPage(1);
      fetchOptions(1, debouncedSearch, true);
    }
  }, [open, debouncedSearch]);

  // Click outside and resize handlers
  useEffect(() => {
    if (!open) return;

    updateMenuPos();

    const handleScrollOrResize = () => updateMenuPos();
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, updateMenuPos]);

  // Infinite scroll intersection observer
  useEffect(() => {
    if (!open || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchOptions(nextPage, debouncedSearch, false);
        }
      },
      { root: menuRef.current, threshold: 0.2 }
    );

    if (listEndRef.current) {
      observer.observe(listEndRef.current);
    }

    return () => observer.disconnect();
  }, [open, hasMore, isLoading, page, debouncedSearch, fetchOptions]);

  const isSelected = (opt) => {
    const targetId = optionId(opt);
    if (!targetId) return false;

    if (multi) {
      const arr = Array.isArray(value) ? value : [];
      return arr.some((item) => optionId(item) === targetId);
    }
    return value && optionId(value) === targetId;
  };

  const handleSelect = (opt) => {
    if (multi) {
      const arr = Array.isArray(value) ? [...value] : [];
      const targetId = optionId(opt);
      const existsIndex = arr.findIndex((item) => optionId(item) === targetId);

      if (existsIndex >= 0) {
        arr.splice(existsIndex, 1);
      } else {
        arr.push(opt);
      }
      onChange?.(arr);
    } else {
      onChange?.(opt);
      setOpen(false);
    }
  };

  const handleRemoveChip = (e, opt) => {
    e.stopPropagation();
    if (!multi) return;
    const arr = Array.isArray(value) ? [...value] : [];
    const filtered = arr.filter((item) => optionId(item) !== optionId(opt));
    onChange?.(filtered);
  };

  const handleCreateNew = () => {
    if (!creatable || !q.trim()) return;
    const newOpt = {
      [idKey]: `custom_${Date.now()}`,
      [labelKey]: q.trim(),
    };
    setItems((prev) => [newOpt, ...prev]);

    if (multi) {
      const arr = Array.isArray(value) ? [...value, newOpt] : [newOpt];
      onChange?.(arr);
    } else {
      onChange?.(newOpt);
      setOpen(false);
    }
    setQ("");
  };

  const handleSelectAll = async () => {
    if (!multi || selectingAll) return;
    setSelectingAll(true);
    try {
      const collected = [...items];
      onChange?.(collected);
    } finally {
      setSelectingAll(false);
    }
  };

  const handleClearAll = () => {
    if (!multi) return;
    onChange?.([]);
  };

  const selectedItems = multi && Array.isArray(value) ? value : [];

  return (
    <div className={cn("relative w-full min-w-0", className)} ref={containerRef}>
      {/* Trigger Button */}
      <div
        onClick={() => {
          if (!disabled) {
            setOpen((prev) => !prev);
          }
        }}
        className={cn(
          "flex w-full justify-between rounded-xl border border-slate-200 bg-white px-3.5 text-sm transition-all outline-none cursor-pointer select-none",
          multi
            ? "min-h-11 h-auto max-h-28 items-start overflow-y-auto py-2"
            : "h-11 items-center overflow-hidden",
          open && "border-[#1d1c50] ring-2 ring-[#1d1c50]/10",
          disabled && "opacity-50 cursor-not-allowed bg-slate-50"
        )}
      >
        <div className={cn("min-w-0 flex-1 text-left", !multi && "truncate")}>
          {multi ? (
            selectedItems.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {selectedItems.map((item) => (
                  <span
                    key={optionId(item)}
                    className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-[#1d1c50] border border-indigo-100"
                  >
                    <span className="truncate">{optionLabel(item)}</span>
                    <button
                      type="button"
                      onClick={(e) => handleRemoveChip(e, item)}
                      className="shrink-0 p-0.5 rounded-md hover:bg-indigo-200/60 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-slate-400">{placeholder}</span>
            )
          ) : (
            <span className={cn("truncate block", !value && "text-slate-400")}>
              {value ? optionLabel(value) : placeholder}
            </span>
          )}
        </div>

        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 ml-2 text-slate-400 transition-transform duration-200",
            open && "transform rotate-180 text-slate-700"
          )}
        />
      </div>

      {/* Floating Dropdown via Portal */}
      {open && menuPos && typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              top: menuPos.top,
              left: menuPos.left,
              width: menuPos.width,
            }}
            className="fixed z-[9999] rounded-2xl border border-slate-200 bg-white shadow-xl text-slate-900 outline-none animate-in fade-in-0 zoom-in-95 overflow-hidden flex flex-col"
          >
            {/* Search Box */}
            {searchable && (
              <div className="flex items-center border-b border-slate-100 px-3 py-2 bg-slate-50/50">
                <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none"
                />
                {q && (
                  <button
                    type="button"
                    onClick={() => setQ("")}
                    className="text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Multi-mode Bulk Bar */}
            {multi && (
              <div className="flex items-center justify-between border-b border-slate-100 px-3.5 py-1.5 bg-slate-50/40 text-xs">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  disabled={selectingAll || items.length === 0}
                  className="font-semibold text-[#1d1c50] hover:underline disabled:opacity-40 cursor-pointer"
                >
                  {selectingAll ? "Selecting..." : "Select all in list"}
                </button>
                <div className="flex items-center gap-2">
                  {selectedItems.length > 0 && (
                    <span className="text-[11px] text-slate-500 font-medium">
                      {selectedItems.length} selected
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleClearAll}
                    disabled={selectedItems.length === 0}
                    className="font-medium text-slate-500 hover:text-red-600 hover:underline disabled:opacity-40 cursor-pointer"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5">
              {items.map((opt) => {
                const selected = isSelected(opt);
                return (
                  <div
                    key={optionId(opt)}
                    onClick={() => handleSelect(opt)}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors",
                      selected
                        ? "bg-indigo-50/80 text-[#1d1c50] font-semibold"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <span className="truncate pr-4">{optionLabel(opt)}</span>
                    {selected && <Check className="h-4 w-4 shrink-0 text-[#1d1c50]" />}
                  </div>
                );
              })}

              {/* Creatable option prompt */}
              {creatable &&
                q.trim() &&
                !items.some(
                  (i) => optionLabel(i).toLowerCase() === q.trim().toLowerCase()
                ) && (
                  <div
                    onClick={handleCreateNew}
                    className="flex items-center gap-2 cursor-pointer select-none rounded-xl px-3 py-2 text-xs font-semibold text-[#1d1c50] hover:bg-indigo-50 transition-colors border-t border-slate-100 mt-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Create "{q.trim()}"</span>
                  </div>
                )}

              {/* Loading & Empty Indicators */}
              <div ref={listEndRef} className="h-1" />
              {isLoading && (
                <div className="flex items-center justify-center gap-2 py-3 text-xs text-slate-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#1d1c50]" />
                  <span>Loading options...</span>
                </div>
              )}
              {!isLoading && items.length === 0 && (
                <div className="py-5 text-center text-xs text-slate-400 font-medium">
                  No matching options found.
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
export default AsyncSelect;
