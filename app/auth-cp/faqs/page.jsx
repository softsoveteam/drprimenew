"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFaqs, createFaq, updateFaq, deleteFaq } from "@/services/faq.service";
import { DataTable } from "@/components/admin/DataTable";
import { Modal } from "@/components/ui/modal";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, HelpCircle, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const faqSchema = z.object({
  question: z.string().min(1, "Question is required").max(500, "Max 500 characters"),
  answer: z.string().min(1, "Answer is required").max(5000, "Max 5000 characters"),
  sort_order: z.coerce.number().min(0, "Sort order must be 0 or greater").default(0),
  is_active: z.boolean().default(true),
});

export default function FaqsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [deletingFaq, setDeletingFaq] = useState(null);

  const queryClient = useQueryClient();

  // Fetch FAQs list
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-faqs", { page, limit, search }],
    queryFn: () => getFaqs({ page, per_page: limit, search }),
    keepPreviousData: true,
  });

  const faqsList = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.data?.data)
    ? data.data.data
    : [];
  const totalItems = data?.total || data?.data?.total || faqsList.length;

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: "",
      answer: "",
      sort_order: 0,
      is_active: true,
    },
  });

  // Open modal for Create or Edit
  const handleOpenModal = (faq = null) => {
    setEditingFaq(faq);
    if (faq) {
      reset({
        question: faq.question || "",
        answer: faq.answer || "",
        sort_order: faq.sort_order ?? 0,
        is_active: Boolean(faq.is_active),
      });
    } else {
      reset({
        question: "",
        answer: "",
        sort_order: 0,
        is_active: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFaq(null);
    reset();
  };

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (formData) => createFaq(formData),
    onSuccess: () => {
      toast.success("FAQ created successfully");
      queryClient.invalidateQueries(["admin-faqs"]);
      closeModal();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create FAQ");
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: (formData) => updateFaq(editingFaq.id, formData),
    onSuccess: () => {
      toast.success("FAQ updated successfully");
      queryClient.invalidateQueries(["admin-faqs"]);
      closeModal();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update FAQ");
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteFaq(id),
    onSuccess: () => {
      toast.success("FAQ deleted successfully");
      queryClient.invalidateQueries(["admin-faqs"]);
      setDeletingFaq(null);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete FAQ");
    },
  });

  const onSubmit = (formData) => {
    if (editingFaq) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Table columns
  const columns = [
    {
      header: "Question & Answer",
      id: "question_answer",
      render: (row) => (
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>{row.question}</span>
          </div>
          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed pl-5">
            {row.answer}
          </p>
        </div>
      ),
    },
    {
      header: "Sort Order",
      accessorKey: "sort_order",
      render: (row) => (
        <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
          {row.sort_order ?? 0}
        </span>
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
            title="Edit FAQ"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingFaq(row)}
            className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete FAQ"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">FAQs Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, update, and organize frequently asked questions displayed on the website.
          </p>
        </div>
      </div>

      {/* DataTable */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <DataTable
          columns={columns}
          data={faqsList}
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
          placeholderText="Search questions or answers..."
          emptyStateText="No FAQs found"
          actions={
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-xs text-xs font-semibold cursor-pointer whitespace-nowrap active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Add FAQ
            </button>
          }
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingFaq ? "Edit FAQ" : "Create FAQ"}
        description={editingFaq ? "Update the details of this FAQ entry." : "Add a new FAQ entry to your store."}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Question */}
          <div className="space-y-1.5">
            <Label htmlFor="question">Question <span className="text-rose-500">*</span></Label>
            <Input
              id="question"
              placeholder="e.g. How do I book an appointment?"
              {...register("question")}
              className={errors.question ? "border-rose-300 focus-visible:ring-rose-200" : ""}
            />
            {errors.question && (
              <p className="text-[11px] text-rose-500 font-medium">{errors.question.message}</p>
            )}
          </div>

          {/* Answer */}
          <div className="space-y-1.5">
            <Label htmlFor="answer">Answer <span className="text-rose-500">*</span></Label>
            <Textarea
              id="answer"
              rows={4}
              placeholder="Enter full answer explanation..."
              {...register("answer")}
              className={errors.answer ? "border-rose-300 focus-visible:ring-rose-200" : ""}
            />
            {errors.answer && (
              <p className="text-[11px] text-rose-500 font-medium">{errors.answer.message}</p>
            )}
          </div>

          {/* Sort Order & Active */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                type="number"
                min="0"
                placeholder="0"
                {...register("sort_order")}
                className={errors.sort_order ? "border-rose-300 focus-visible:ring-rose-200" : ""}
              />
              {errors.sort_order && (
                <p className="text-[11px] text-rose-500 font-medium">{errors.sort_order.message}</p>
              )}
            </div>

            <div className="space-y-1.5 flex flex-col justify-end pb-2">
              <div className="flex items-center space-x-2">
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
                <Label htmlFor="is_active" className="cursor-pointer font-medium text-xs">
                  Active / Published
                </Label>
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
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
              ) : editingFaq ? (
                "Save Changes"
              ) : (
                "Create FAQ"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingFaq}
        onClose={() => setDeletingFaq(null)}
        onConfirm={() => deleteMutation.mutate(deletingFaq?.id)}
        title="Delete FAQ"
        description="Are you sure you want to delete this FAQ? This action cannot be undone."
        itemName={deletingFaq?.question}
        isLoading={deleteMutation.isPending || deleteMutation.isLoading}
      />
    </div>
  );
}
