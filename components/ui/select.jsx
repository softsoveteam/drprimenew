"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";
import { createPortal } from "react-dom";

const Select = React.forwardRef(({ className, children, value, onChange, defaultValue, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  
  // Extract options from children safely
  const options = React.Children.toArray(children)
    .filter(child => child?.props?.value !== undefined || child?.type === "option")
    .map(child => ({
      value: child.props.value,
      label: child.props.children,
    }));

  // State for the currently selected value — allow empty string (e.g. "All")
  const [internalValue, setInternalValue] = useState(
    value !== undefined && value !== null
      ? value
      : defaultValue !== undefined && defaultValue !== null
      ? defaultValue
      : (options[0]?.value ?? "")
  );

  // Ref for the hidden native select
  const nativeSelectRef = useRef(null);
  
  // Ref for the dropdown container to handle outside clicks
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Sync internal value if prop value changes (controlled component)
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  // Combine refs so react-hook-form gets the native select element
  const combinedRef = (node) => {
    nativeSelectRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const updateCoords = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  }, []);

  const handleSelect = (val) => {
    setInternalValue(val);
    setIsOpen(false);
    
    // Dispatch change event to the native select for react-hook-form or native listeners
    if (nativeSelectRef.current) {
      nativeSelectRef.current.value = val;
      const event = new Event("change", { bubbles: true });
      nativeSelectRef.current.dispatchEvent(event);
    }
    
    // Call custom onChange if provided (for controlled usage)
    if (onChange) {
      onChange({ target: { value: val, name: props.name } });
    }
  };

  // Close dropdown on outside click or touch
  useEffect(() => {
    if (!isOpen) return;

    updateCoords();

    const handleClickOutside = (event) => {
      if (
        containerRef.current && !containerRef.current.contains(event.target) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      updateCoords();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, updateCoords]);

  // Loose equality check so numbers and strings match seamlessly
  const selectedOption = options.find(opt => String(opt.value) === String(internalValue)) || options[0];

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Hidden native select for form submission and react-hook-form integration */}
      <select
        ref={combinedRef}
        value={internalValue}
        onChange={(e) => {
          setInternalValue(e.target.value);
          if (onChange) onChange(e);
        }}
        className="hidden"
        {...props}
      >
        {children}
      </select>

      {/* Custom UI Button */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          if (!props.disabled) {
            updateCoords();
            setIsOpen(!isOpen);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!props.disabled) {
              updateCoords();
              setIsOpen(!isOpen);
            }
          }
        }}
        className={cn(
          "w-full flex items-center justify-between px-3.5 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white cursor-pointer select-none",
          isOpen ? "ring-2 ring-indigo-500 border-indigo-500" : "hover:border-gray-400",
          props.disabled ? "cursor-not-allowed opacity-50" : "",
          "transition-all duration-200 text-xs sm:text-sm",
          className
        )}
      >
        <span className="truncate mr-1 font-medium">{selectedOption?.label || "Select..."}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200", isOpen && "rotate-180")} />
      </div>

      {/* Dropdown Portal */}
      {isOpen && typeof document !== "undefined" && createPortal(
        <div
          ref={dropdownRef}
          data-select-dropdown=""
          className="fixed z-[80] bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto py-1 pointer-events-auto animate-in fade-in zoom-in-95 duration-100"
          style={{
            top: coords.top,
            left: coords.left,
            width: coords.width > 0 ? coords.width : "auto",
            minWidth: Math.max(coords.width || 0, 160),
          }}
        >
          {options.length === 0 ? (
            <div className="px-4 py-3 text-xs text-gray-500 text-center">No options available</div>
          ) : (
            options.map((opt, i) => {
              const isSelected = String(opt.value) === String(internalValue);
              return (
                <div
                  key={opt.value ?? i}
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handleSelect(opt.value);
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleSelect(opt.value);
                  }}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2 text-xs sm:text-sm cursor-pointer mx-1 rounded-lg transition-colors select-none",
                    isSelected 
                      ? "bg-indigo-50 text-indigo-700 font-semibold" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <span className="truncate mr-2">{opt.label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-indigo-600" />}
                </div>
              );
            })
          )}
        </div>,
        document.body
      )}
    </div>
  );
});

Select.displayName = "Select";

export { Select };
