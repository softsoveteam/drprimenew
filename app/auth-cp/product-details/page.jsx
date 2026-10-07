"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  getAdminProductDetails,
  updateAdminProductDetails,
} from "@/services/product-details.service";
import { PRODUCT_DETAILS_QUERY_KEY } from "@/hooks/useProductDetails";
import { badgeText, discountPercent, resolveProductOffer } from "@/lib/product-details";

const priceField = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || (Number.isFinite(Number(value)) && Number(value) >= 0),
    "Enter a price of 0 or more"
  );

const productDetailsSchema = z
  .object({
    custom_text: z.string().max(120, "Max 120 characters"),
    original_price: priceField,
    discounted_price: priceField,
    in_stock: z.boolean(),
  })
  .superRefine((values, ctx) => {
    const original = values.original_price === "" ? null : Number(values.original_price);
    const discounted = values.discounted_price === "" ? null : Number(values.discounted_price);
    if (original != null && discounted != null && discounted > original) {
      ctx.addIssue({
        code: "custom",
        path: ["discounted_price"],
        message: "Discounted price cannot be higher than the original price.",
      });
    }
  });

function parsePrice(value) {
  if (value == null || String(value).trim() === "") return null;
  return Number(value);
}

function toInput(value) {
  if (value === null || value === undefined) return "";
  return String(value);
}

export default function ProductDetailsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-product-details"],
    queryFn: getAdminProductDetails,
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productDetailsSchema),
    defaultValues: {
      custom_text: "",
      original_price: "",
      discounted_price: "",
      in_stock: true,
    },
    values: data
      ? {
          custom_text: badgeText(data.custom_text),
          original_price: toInput(data.original_price),
          discounted_price: toInput(data.discounted_price),
          in_stock: data.in_stock !== false,
        }
      : undefined,
    resetOptions: { keepDirtyValues: true },
  });

  const customText = watch("custom_text");
  const originalPrice = watch("original_price");
  const discountedPrice = watch("discounted_price");
  const inStock = watch("in_stock");
  const percent = discountPercent(originalPrice, discountedPrice);
  const preview = resolveProductOffer({
    custom_text: customText,
    original_price: parsePrice(originalPrice),
    discounted_price: parsePrice(discountedPrice),
    in_stock: inStock,
  });

  const saveMutation = useMutation({
    mutationFn: updateAdminProductDetails,
    onSuccess: (body) => {
      const saved = body?.data ?? body;
      queryClient.setQueryData(["admin-product-details"], saved);
      queryClient.setQueryData(PRODUCT_DETAILS_QUERY_KEY, saved);
      toast.success(body?.message || "Product details saved.");
    },
    onError: (saveError) => {
      toast.error(saveError?.message || "Could not save product details");
    },
  });

  const onSubmit = (values) => {
    saveMutation.mutate({
      custom_text: values.custom_text?.trim() ? values.custom_text.trim() : null,
      original_price: parsePrice(values.original_price),
      discounted_price: parsePrice(values.discounted_price),
      in_stock: values.in_stock,
    });
  };

  const saving = isSubmitting || saveMutation.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Product Details</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Update the PrimeHeal price, description, and stock status shown on the home page and product page.
        </p>
      </div>

      {isError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-center justify-between gap-3">
          <span>{error?.message || "Could not load product details."}</span>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-xs font-semibold text-rose-700 underline"
          >
            Try again
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start"
      >
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="custom_text">Text</Label>
                <Input
                  id="custom_text"
                  placeholder="Lowest price in 30 days"
                  {...register("custom_text")}
                />
                <p className="text-[11px] text-slate-500">
                  Shown in the red label on the product page.
                </p>
                {errors.custom_text && (
                  <p className="text-xs text-rose-600">{errors.custom_text.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="original_price">Original price</Label>
                  <Input
                    id="original_price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="49.99"
                    {...register("original_price")}
                  />
                  <p className="text-[11px] text-slate-500">Shown as the typical price.</p>
                  {errors.original_price && (
                    <p className="text-xs text-rose-600">{errors.original_price.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="discounted_price">Discounted price</Label>
                  <Input
                    id="discounted_price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="39.99"
                    {...register("discounted_price")}
                  />
                  <p className="text-[11px] text-slate-500">Shown as the current price.</p>
                  {errors.discounted_price && (
                    <p className="text-xs text-rose-600">{errors.discounted_price.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="discount_percentage">Discount percentage</Label>
                <Input
                  id="discount_percentage"
                  value={percent == null ? "" : `${percent}%`}
                  readOnly
                  placeholder="Calculated from the two prices"
                />
                <p className="text-[11px] text-slate-500">
                  Calculated from the original price and the discounted price.
                </p>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <Controller
                  name="in_stock"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="in_stock"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                    />
                  )}
                />
                <div>
                  <Label htmlFor="in_stock" className="cursor-pointer">
                    In stock
                  </Label>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Uncheck to mark the product out of stock. Buy Now switches to Out of Stock.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={saving || isLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-xs text-xs font-semibold cursor-pointer disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Save details
                </button>
              </div>
            </>
          )}
        </div>

        <aside className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 text-slate-900">
            <Tag className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold">Storefront preview</h2>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2">
            {preview.badge ? (
              <span className="inline-block rounded bg-[#e10600] px-2.5 py-1 text-[11px] font-bold text-white">
                {preview.badge}
              </span>
            ) : null}
            <div className="flex items-baseline gap-2">
              {preview.percent != null ? (
                <span className="text-lg font-semibold text-[#e10600]">-{preview.percent}%</span>
              ) : null}
              <span className="text-2xl font-extrabold text-slate-900">
                {preview.priceLabel || "—"}
              </span>
            </div>
            {preview.typicalLabel ? (
              <p className="text-sm text-slate-500">Typical price: {preview.typicalLabel}</p>
            ) : null}
            <p className={`text-sm font-semibold ${preview.inStock ? "text-emerald-700" : "text-rose-600"}`}>
              {preview.inStock ? "In stock" : "Out of stock"}
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
