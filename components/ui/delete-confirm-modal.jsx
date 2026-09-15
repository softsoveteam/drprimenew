"use client";

import React from "react";
import { Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName = "",
  isDeleting = false,
  isLoading = false,
  confirmText = "Yes, Delete",
}) {
  const loading = isDeleting || isLoading;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !loading && !open && onClose()}>
      <DialogContent className="max-w-sm p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
        {/* Red gradient header strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-red-500 to-rose-600" />

        {/* Content */}
        <div className="p-3">
          {/* Icon + Title */}
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 border border-rose-200">
              <Trash2 className="w-5 h-5 text-rose-600" />
            </div>
            <div className="min-w-0 pt-0.5">
              <DialogTitle className="text-base font-bold text-slate-900 leading-snug">
                {title}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-1 leading-relaxed">
                {description}
              </DialogDescription>
            </div>
          </div>



          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="py-2 px-4 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="py-2 px-4 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  {confirmText}
                </>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
