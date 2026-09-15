"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";
import { createPortal } from "react-dom";

const Select = React.forwardRef(({ className, children, value, onChange, defaultValue, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Extract options from children
  const options = React.Children.toArray(children)
    .filter(child => child.type === 'option')
    .map(child => ({
      value: child.props.value,
      label: child.props.children,
    }));

  // State for the currently selected value
  const [internalValue, setInternalValue] = useState(value || defaultValue || (options[0]?.value ?? ""));

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
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const handleSelect = (val) => {
    setInternalValue(val);
    setIsOpen(false);
    
    // Dispatch change event to the native select for react-hook-form or native listeners
    if (nativeSelectRef.current) {
      nativeSelectRef.current.value = val;
      const event = new Event('change', { bubbles: true });
      nativeSelectRef.current.dispatchEvent(event);
    }
    
    // Call custom onChange if provided (for controlled usage)
    if (onChange) {
      // Create a synthetic event-like object for compatibility
      onChange({ target: { value: val, name: props.name } });
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === internalValue) || options[0];

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
        onClick={() => !props.disabled && setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white cursor-pointer select-none",
          isOpen ? "ring-2 ring-indigo-500 border-indigo-500" : "hover:border-gray-400",
          props.disabled ? "cursor-not-allowed opacity-50" : "",
          "transition-all duration-200",
          className
        )}
      >
        <span className="truncate">{selectedOption?.label || "Select..."}</span>
        <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform duration-200", isOpen && "rotate-180")} />
      </div>

      {/* Dropdown Portal */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto py-1 animate-in fade-in zoom-in-95 duration-100"
          style={{
            top: containerRef.current ? containerRef.current.getBoundingClientRect().bottom + window.scrollY : 0,
            left: containerRef.current ? containerRef.current.getBoundingClientRect().left + window.scrollX : 0,
            width: containerRef.current ? containerRef.current.getBoundingClientRect().width : 'auto',
          }}
        >
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">No options available</div>
          ) : (
            options.map((opt, i) => {
              const isSelected = opt.value === internalValue;
              return (
                <div
                  key={i}
                  onClick={() => handleSelect(opt.value)}
                  className={cn(
                    "flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer mx-1 rounded-md transition-colors",
                    isSelected 
                      ? "bg-indigo-50 text-indigo-700 font-medium" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="h-4 w-4 text-indigo-600" />}
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
