"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBotQuestions,
  createBotQuestion,
  updateBotQuestion,
  deleteBotQuestion,
} from "@/services/bot-question.service";
import { DataTable } from "@/components/admin/DataTable";
import { Modal } from "@/components/ui/modal";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, MessageCircle, Loader2, CornerDownRight } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

function QuestionBranch({ item, depth, onEdit, onDelete, onAddChild }) {
  const children = Array.isArray(item.children) ? item.children : [];
  const isMain = depth === 0;

  return (
    <div className={isMain ? "group/branch" : "mt-2 border-l border-slate-200 pl-3"}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs">
            {isMain ? (
              <MessageCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            ) : (
              <CornerDownRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span>{item.question}</span>
            <span
              className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                item.is_active
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-slate-100 text-slate-500 border-slate-200"
              }`}
            >
              {item.is_active ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed pl-5">
            {item.answer}
          </p>
          {isMain && children.length > 0 && (
            <p className="pl-5 text-[10px] font-medium text-indigo-500 group-hover/branch:hidden">
              {children.length} follow-up{children.length === 1 ? "" : "s"}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onAddChild(item)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
            title="Add sub-question"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
            title="Edit question"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete question"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {children.length > 0 && (
        <div className={isMain ? "hidden group-hover/branch:block" : ""}>
          {children.map((child) => (
            <QuestionBranch
              key={child.id}
              item={child}
              depth={depth + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const botQuestionSchema = z.object({
  question: z.string().min(1, "Question is required").max(500, "Max 500 characters"),
  answer: z.string().min(1, "Answer is required").max(5000, "Max 5000 characters"),
  sort_order: z.coerce.number().min(0, "Sort order must be 0 or greater").default(0),
  is_active: z.boolean().default(true),
});

export default function BotQuestionsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [parentItem, setParentItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-bot-questions", { page, limit, search }],
    queryFn: () => getBotQuestions({ page, per_page: limit, search }),
    keepPreviousData: true,
  });

  const rows = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.data?.data)
    ? data.data.data
    : [];
  const totalItems = data?.total || data?.data?.total || rows.length;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(botQuestionSchema),
    defaultValues: {
      question: "",
      answer: "",
      sort_order: 0,
      is_active: true,
    },
  });

  const handleOpenModal = (item = null, parent = null) => {
    setEditingItem(item);
    setParentItem(item ? null : parent);
    if (item) {
      reset({
        question: item.question || "",
        answer: item.answer || "",
        sort_order: item.sort_order ?? 0,
        is_active: Boolean(item.is_active),
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
    setEditingItem(null);
    setParentItem(null);
    reset();
  };

  const createMutation = useMutation({
    mutationFn: (formData) => createBotQuestion(formData),
    onSuccess: () => {
      toast.success("Bot question created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-bot-questions"] });
      queryClient.invalidateQueries({ queryKey: ["public-bot-questions"] });
      closeModal();
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to create bot question");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (formData) => updateBotQuestion(editingItem.id, formData),
    onSuccess: () => {
      toast.success("Bot question updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-bot-questions"] });
      queryClient.invalidateQueries({ queryKey: ["public-bot-questions"] });
      closeModal();
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update bot question");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteBotQuestion(id),
    onSuccess: () => {
      toast.success("Bot question deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-bot-questions"] });
      queryClient.invalidateQueries({ queryKey: ["public-bot-questions"] });
      setDeletingItem(null);
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to delete bot question");
    },
  });

  const onSubmit = (formData) => {
    if (editingItem) {
      updateMutation.mutate(formData);
      return;
    }

    createMutation.mutate(
      parentItem ? { ...formData, parent_id: parentItem.id } : formData
    );
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const columns = [
    {
      header: "Question & Answer",
      id: "question_answer",
      render: (row) => (
        <QuestionBranch
          item={row}
          depth={0}
          onEdit={(item) => handleOpenModal(item)}
          onDelete={setDeletingItem}
          onAddChild={(item) => handleOpenModal(null, item)}
        />
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Chat Bot Questions</h1>
          <p className="text-xs text-slate-500 mt-1">
            Top-level questions open the chat. Use the plus icon to add a follow-up under any question.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <DataTable
          columns={columns}
          data={rows}
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
          emptyStateText="No bot questions found"
          actions={
            <button
              onClick={() => handleOpenModal(null, null)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-xs text-xs font-semibold cursor-pointer whitespace-nowrap active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
          }
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          editingItem
            ? "Edit Bot Question"
            : parentItem
            ? "Add Sub-question"
            : "Create Bot Question"
        }
        description={
          editingItem
            ? "Update this question and the reply the assistant shows."
            : parentItem
            ? `This follow-up appears after “${parentItem.question}”.`
            : "Add a top-level question. Follow-ups can be added after it is saved."
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="question">
              Question <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="question"
              placeholder="e.g. How can I contact support?"
              {...register("question")}
              className={errors.question ? "border-rose-300 focus-visible:ring-rose-200" : ""}
            />
            {errors.question && (
              <p className="text-[11px] text-rose-500 font-medium">{errors.question.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="answer">
              Answer <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              id="answer"
              rows={4}
              placeholder="This text is shown as the assistant reply."
              {...register("answer")}
              className={errors.answer ? "border-rose-300 focus-visible:ring-rose-200" : ""}
            />
            {errors.answer && (
              <p className="text-[11px] text-rose-500 font-medium">{errors.answer.message}</p>
            )}
          </div>

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
              ) : editingItem ? (
                "Save Changes"
              ) : parentItem ? (
                "Add Sub-question"
              ) : (
                "Create Question"
              )}
            </button>
          </div>
        </form>
      </Modal>

      <DeleteConfirmModal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={() => deleteMutation.mutate(deletingItem?.id)}
        title="Delete Bot Question"
        description="This deletes the question and every follow-up inside it. This action cannot be undone."
        itemName={deletingItem?.question}
        isLoading={deleteMutation.isPending || deleteMutation.isLoading}
      />
    </div>
  );
}
