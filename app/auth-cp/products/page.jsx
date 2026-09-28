"use client";

import React, { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminProducts,
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  buildProductFormData,
} from "@/services/admin-product.service";
import { extractPaginated } from "@/lib/axios";
import { DataTable } from "@/components/admin/DataTable";
import { Modal } from "@/components/ui/modal";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { Plus, Edit, Trash2, Package, Loader2, ExternalLink, ImagePlus, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import RichTextEditor from "@/components/ui/rich-text-editor";

const productSchema = z.object({
  sku: z.string().min(1, "SKU is required").max(100, "Max 100 characters"),
  amazon_sku: z.string().max(100).optional().or(z.literal("")),
  asin: z.string().max(64).optional().or(z.literal("")),
  title: z.string().min(1, "Title is required").max(255, "Max 255 characters"),
  description: z.string().optional().or(z.literal("")),
  price: z.coerce.number().min(0, "Price must be 0 or greater"),
  currency: z.string().min(1).max(10).default("USD"),
  stock_quantity: z.coerce.number().int().min(0, "Stock must be 0 or greater"),
  image_url: z.string().max(2048).optional().or(z.literal("")),
  amazon_url: z.string().max(2048).optional().or(z.literal("")),
  is_active: z.boolean().default(true),
});

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGES = 12;

/** Avoid ring-offset; scroll parents clip outer focus rings (cut top/bottom). */
const fieldInputClass =
  "focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:ring-offset-0 focus-visible:border-indigo-500";

function formatPrice(price, currency = "USD") {
  const amount = Number(price);
  if (Number.isNaN(amount)) return String(price ?? "—");
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

const emptyForm = {
  sku: "",
  amazon_sku: "",
  asin: "",
  title: "",
  description: "",
  price: 0,
  currency: "USD",
  stock_quantity: 0,
  image_url: "",
  amazon_url: "",
  is_active: true,
};

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [search, setSearch] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  /** @type {[File[], Function]} */
  const [imageFiles, setImageFiles] = useState([]);
  /** @type {[string[], Function]} blob URLs for newly selected files */
  const [newPreviews, setNewPreviews] = useState([]);
  /** @type {[{id:number,url:string}[], Function]} */
  const [existingImages, setExistingImages] = useState([]);
  /** @type {[number[], Function]} */
  const [removeImageIds, setRemoveImageIds] = useState([]);
  const [removeAllImages, setRemoveAllImages] = useState(false);
  const fileInputRef = useRef(null);

  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-products", { page, limit, search, isActiveFilter }],
    queryFn: () => {
      const params = { page, per_page: limit };
      if (search) params.search = search;
      if (isActiveFilter === "true" || isActiveFilter === "false") {
        params.is_active = isActiveFilter;
      }
      return getAdminProducts(params);
    },
  });

  const { list: productsList, total: totalItems } = extractPaginated(data);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: emptyForm,
  });

  const revokePreviews = (urls) => {
    (urls || []).forEach((u) => {
      try {
        URL.revokeObjectURL(u);
      } catch {
        /* ignore */
      }
    });
  };

  const normalizeExistingImages = (product) => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
      return product.images
        .map((img) => ({
          id: img.id,
          url: img.url || img.image_url || "",
        }))
        .filter((img) => img.url);
    }
    if (product?.image_url) {
      return [{ id: null, url: product.image_url }];
    }
    return [];
  };

  const handleOpenModal = async (product = null) => {
    revokePreviews(newPreviews);
    setImageFiles([]);
    setNewPreviews([]);
    setRemoveImageIds([]);
    setRemoveAllImages(false);

    if (product) {
      setEditingProduct(product);
      reset({
        sku: product.sku || "",
        amazon_sku: product.amazon_sku || "",
        asin: product.asin || "",
        title: product.title || "",
        description: product.description || "",
        price: Number(product.price) || 0,
        currency: product.currency || "USD",
        stock_quantity: Number(product.stock_quantity) || 0,
        image_url: "",
        amazon_url: product.amazon_url || "",
        is_active: Boolean(product.is_active),
      });
      setExistingImages(normalizeExistingImages(product));
      setIsModalOpen(true);

      try {
        const detail = await getAdminProductById(product.id);
        const full = detail?.product || detail?.data?.product || detail?.data || detail;
        if (full?.id) {
          setEditingProduct(full);
          reset({
            sku: full.sku || "",
            amazon_sku: full.amazon_sku || "",
            asin: full.asin || "",
            title: full.title || "",
            description: full.description || "",
            price: Number(full.price) || 0,
            currency: full.currency || "USD",
            stock_quantity: Number(full.stock_quantity) || 0,
            image_url: "",
            amazon_url: full.amazon_url || "",
            is_active: Boolean(full.is_active),
          });
          setExistingImages(normalizeExistingImages(full));
        }
      } catch {
        /* list row data is enough as fallback */
      }
    } else {
      setEditingProduct(null);
      reset(emptyForm);
      setExistingImages([]);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    revokePreviews(newPreviews);
    setImageFiles([]);
    setNewPreviews([]);
    setExistingImages([]);
    setRemoveImageIds([]);
    setRemoveAllImages(false);
    reset(emptyForm);
  };

  const visibleExisting = removeAllImages
    ? []
    : existingImages.filter((img) => !removeImageIds.includes(img.id));

  const slotsLeft = Math.max(0, MAX_IMAGES - visibleExisting.length - imageFiles.length);

  const handleImageChange = (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = "";
    if (!picked.length) return;

    const accepted = [];
    for (const file of picked) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error(`${file.name}: use jpg, png, webp, or gif`);
        continue;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        toast.error(`${file.name}: must be 5 MB or smaller`);
        continue;
      }
      accepted.push(file);
    }
    if (!accepted.length) return;

    const room = Math.max(0, MAX_IMAGES - visibleExisting.length - imageFiles.length);
    const nextFiles = accepted.slice(0, room);
    if (accepted.length > room) {
      toast.error(`Max ${MAX_IMAGES} images total`);
    }
    if (!nextFiles.length) return;

    setRemoveAllImages(false);
    setImageFiles((prev) => [...prev, ...nextFiles]);
    setNewPreviews((prev) => [...prev, ...nextFiles.map((f) => URL.createObjectURL(f))]);
  };

  const removeNewFileAt = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => {
      const url = prev[index];
      if (url) {
        try {
          URL.revokeObjectURL(url);
        } catch {
          /* ignore */
        }
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const markRemoveExistingImage = (img) => {
    if (img.id == null) {
      setRemoveAllImages(true);
      setExistingImages([]);
      return;
    }
    setRemoveImageIds((prev) => (prev.includes(img.id) ? prev : [...prev, img.id]));
  };

  const clearAllImages = () => {
    revokePreviews(newPreviews);
    setImageFiles([]);
    setNewPreviews([]);
    setRemoveImageIds(existingImages.map((i) => i.id).filter((id) => id != null));
    setRemoveAllImages(true);
  };

  const createMutation = useMutation({
    mutationFn: (formData) => createAdminProduct(formData),
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries(["admin-products"]);
      closeModal();
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to create product");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (formData) => updateAdminProduct(editingProduct.id, formData),
    onSuccess: () => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries(["admin-products"]);
      closeModal();
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update product");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteAdminProduct(id),
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries(["admin-products"]);
      setDeletingProduct(null);
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to delete product");
    },
  });

  const onSubmit = (formData) => {
    const payload = buildProductFormData(formData, {
      imageFiles,
      removeImageIds: editingProduct ? removeImageIds : [],
      removeAllImages: Boolean(editingProduct && removeAllImages && imageFiles.length === 0),
    });

    if (editingProduct) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const columns = [
    {
      header: "Product",
      id: "product",
      render: (row) => (
        <div className="flex items-center gap-3 max-w-sm">
          <div className="h-10 w-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
            {row.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={row.image_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <Package className="w-4 h-4 text-slate-400" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex flex-col gap-0.5">
            <span className="font-semibold text-slate-900 text-xs truncate leading-tight block">
              {row.title}
            </span>
            <span className="font-mono text-[10px] text-slate-500 leading-tight block">
              {row.sku}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Price",
      id: "price",
      render: (row) => (
        <span className="text-xs font-semibold text-slate-800">
          {formatPrice(row.price, row.currency)}
        </span>
      ),
    },
    {
      header: "Stock",
      id: "stock",
      render: (row) => (
        <span
          className={`font-mono text-xs px-2 py-0.5 rounded-md border ${
            Number(row.stock_quantity) > 0
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-rose-50 text-rose-600 border-rose-200"
          }`}
        >
          {row.stock_quantity ?? 0}
        </span>
      ),
    },
    {
      header: "Amazon",
      id: "amazon",
      render: (row) =>
        row.asin || row.amazon_sku ? (
          <div className="text-[11px] text-slate-500 space-y-0.5">
            {row.asin && <span className="font-mono block">ASIN {row.asin}</span>}
            {row.amazon_url && (
              <a
                href={row.amazon_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Link <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ) : (
          <span className="text-slate-400 text-xs">—</span>
        ),
    },
    {
      header: "Status",
      id: "is_active",
      render: (row) => (
        <span
          className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${
            row.is_active
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-slate-100 text-slate-500 border-slate-200"
          }`}
        >
          {row.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      id: "actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenModal(row)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
            title="Edit product"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingProduct(row)}
            className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-xs text-slate-500 mt-1">
            Admin catalog. Public shop only shows active products. Cart and checkout use these prices and stock.
          </p>
        </div>
        <div className="w-full sm:w-44">
          <Select
            value={isActiveFilter}
            onChange={(e) => {
              setIsActiveFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error.message || "Failed to load products"}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <DataTable
          columns={columns}
          data={productsList}
          totalItems={totalItems}
          isLoading={isLoading}
          page={page}
          limit={limit}
          searchQuery={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          onRefetch={refetch}
          placeholderText="Search title, SKU, ASIN..."
          emptyStateText="No products found"
          actions={
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-xs text-xs font-semibold cursor-pointer whitespace-nowrap active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          }
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        className="max-w-lg sm:max-w-2xl"
        title={editingProduct ? "Edit Product" : "Create Product"}
        description={
          editingProduct
            ? "Update catalog details. Send the full record."
            : "Add a product to the shop catalog."
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col pt-1 min-h-0">
          <div className="space-y-3 max-h-[min(68vh,640px)] overflow-y-auto overscroll-contain px-1 py-1 -mx-1">
            <div className="space-y-1">
              <Label htmlFor="title" className="text-xs">
                Title <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Doctor Prime Supplement"
                className={fieldInputClass}
                {...register("title")}
              />
              {errors.title && (
                <p className="!mb-0 text-[11px] text-rose-500 font-medium">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Product description (HTML)…"
                    height={260}
                  />
                )}
              />
              <p className="!mb-0 text-[10px] text-slate-400">
                Rich text is saved as HTML and shown on the product page.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1 min-w-0">
                <Label htmlFor="sku" className="text-xs">
                  SKU <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="sku"
                  placeholder="DP-SUPP-001"
                  className={fieldInputClass}
                  {...register("sku")}
                />
                {errors.sku && (
                  <p className="!mb-0 text-[11px] text-rose-500 font-medium">{errors.sku.message}</p>
                )}
              </div>
              <div className="space-y-1 min-w-0">
                <Label htmlFor="amazon_sku" className="text-xs">Amazon SKU</Label>
                <Input
                  id="amazon_sku"
                  placeholder="AMZ-SUPP-001"
                  className={fieldInputClass}
                  {...register("amazon_sku")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1 min-w-0">
                <Label htmlFor="asin" className="text-xs">ASIN</Label>
                <Input
                  id="asin"
                  placeholder="B0EXAMPLE123"
                  className={fieldInputClass}
                  {...register("asin")}
                />
              </div>
              <div className="space-y-1 min-w-0">
                <Label htmlFor="currency" className="text-xs">Currency</Label>
                <Input
                  id="currency"
                  placeholder="USD"
                  className={fieldInputClass}
                  {...register("currency")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1 min-w-0">
                <Label htmlFor="price" className="text-xs">
                  Price <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  className={fieldInputClass}
                  {...register("price")}
                />
                {errors.price && (
                  <p className="!mb-0 text-[11px] text-rose-500 font-medium">{errors.price.message}</p>
                )}
              </div>
              <div className="space-y-1 min-w-0">
                <Label htmlFor="stock_quantity" className="text-xs">
                  Stock <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  min="0"
                  step="1"
                  className={fieldInputClass}
                  {...register("stock_quantity")}
                />
                {errors.stock_quantity && (
                  <p className="!mb-0 text-[11px] text-rose-500 font-medium">
                    {errors.stock_quantity.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-xs">Product images</Label>
                <span className="text-[10px] text-slate-400 tabular-nums">
                  {visibleExisting.length + imageFiles.length}/{MAX_IMAGES}
                  {(visibleExisting.length > 0 || newPreviews.length > 0) && (
                    <>
                      {" · "}
                      <button
                        type="button"
                        onClick={clearAllImages}
                        className="font-semibold text-rose-600 hover:underline"
                      >
                        Remove all
                      </button>
                    </>
                  )}
                </span>
              </div>

              <input
                ref={fileInputRef}
                id="product_images"
                name="images[]"
                type="file"
                multiple
                disabled={slotsLeft <= 0}
                accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                className="sr-only"
              />

              <div className="grid grid-cols-4 gap-2">
                {visibleExisting.map((img) => (
                  <div
                    key={img.id ?? img.url}
                    className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => markRemoveExistingImage(img)}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-white/95 border border-slate-200 text-slate-600 flex items-center justify-center hover:text-rose-600 shadow-sm"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {newPreviews.map((url, index) => (
                  <div
                    key={`new-${index}`}
                    className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 border border-indigo-200 ring-1 ring-indigo-100"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewFileAt(index)}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-white/95 border border-slate-200 text-slate-600 flex items-center justify-center hover:text-rose-600 shadow-sm"
                      title="Remove selected file"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {slotsLeft > 0 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-lg border border-dashed border-slate-300 bg-slate-50 hover:bg-indigo-50/60 hover:border-indigo-300 text-slate-400 hover:text-indigo-600 transition-colors flex flex-col items-center justify-center gap-1"
                  >
                    <ImagePlus className="w-5 h-5" />
                    <span className="text-[9px] font-semibold uppercase tracking-wide">Add</span>
                  </button>
                )}
              </div>
              <p className="!mb-0 text-[10px] text-slate-400">
                jpg, png, webp, gif · max 5 MB · first image is the thumbnail
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="image_url" className="text-xs">Image URL (optional)</Label>
              <Input
                id="image_url"
                placeholder="https://… if no files uploaded"
                className={fieldInputClass}
                {...register("image_url")}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="amazon_url" className="text-xs">Amazon URL</Label>
              <Input
                id="amazon_url"
                placeholder="https://www.amazon.com/dp/..."
                className={fieldInputClass}
                {...register("amazon_url")}
              />
            </div>

            <div className="flex items-center gap-2 pb-1">
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="is_active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="is_active" className="cursor-pointer font-medium text-xs !mb-0">
                Active (visible in public shop)
              </Label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 mt-2 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={closeModal}
              disabled={isSubmitting}
              className="py-2 px-4 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : editingProduct ? (
                "Save Changes"
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </Modal>

      <DeleteConfirmModal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={() => deleteMutation.mutate(deletingProduct?.id)}
        title="Delete Product"
        description="Cart rows for this product will be removed. Past order lines keep price snapshots."
        itemName={deletingProduct?.title}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
