"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function isSelectDropdownEvent(event) {
  const target = event?.detail?.originalEvent?.target || event?.target;
  return target instanceof Element && Boolean(target.closest("[data-select-dropdown]"));
}

export function Modal({ isOpen, onClose, title, description, children, className }) {
  const keepSelectOpen = (event) => {
    if (isSelectDropdownEvent(event)) event.preventDefault();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent
        onPointerDownOutside={keepSelectOpen}
        onInteractOutside={keepSelectOpen}
        onFocusOutside={keepSelectOpen}
        className={cn(
          "max-w-md w-[calc(100%-2rem)] rounded-2xl bg-white p-5 sm:p-6 shadow-xl border border-slate-200 gap-3",
          className
        )}
      >
        {(title || description) && (
          <DialogHeader className="text-left space-y-1 pr-6">
            {title && (
              <DialogTitle className="text-lg font-bold text-slate-900 leading-6 font-sans">
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription className="text-xs text-slate-500">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}
        <div className="w-full min-w-0">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
