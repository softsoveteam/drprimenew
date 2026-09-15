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

export function Modal({ isOpen, onClose, title, description, children, className }) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent className={cn("max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200", className)}>
        {(title || description) && (
          <DialogHeader className="text-left space-y-1">
            {title && (
              <DialogTitle className="text-lg font-bold text-slate-900 leading-6">
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
        <div className="pt-2">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
