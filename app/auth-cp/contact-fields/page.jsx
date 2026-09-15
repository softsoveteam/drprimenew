"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Plus, Trash2, Settings2, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";

import { getContactFields, getFieldTypes, createContactField, updateContactField, deleteContactField } from "@/services/contact-field.service";

import { DataTable } from "@/components/admin/DataTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Modal } from "@/components/ui/modal";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { Button } from "@/components/ui/button";

const fieldSchema = z.object({
  label: z.string().min(1, "Label is required").max(255, "Label is too long"),
  field_key: z.string().regex(/^[a-z0-9_]*$/, "Only lowercase letters, numbers, and underscores").optional(),
  field_type: z.string().min(1, "Field type is required"),
  options: z.string().optional(),
  placeholder: z.string().max(255).optional(),
  is_required: z.boolean().default(false),
  sort_order: z.preprocess((val) => Number(val) || 0, z.number().min(0)),
  is_active: z.boolean().default(true),
});

export default function ContactFieldsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [deletingField, setDeletingField] = useState(null);

  const queryClient = useQueryClient();

  // Queries
  const { data: fieldsData, isLoading: isLoadingFields } = useQuery({
    queryKey: ["contact-fields"],
    queryFn: () => getContactFields(),
  });

  const { data: typesData } = useQuery({
    queryKey: ["contact-field-types"],
    queryFn: () => getFieldTypes(),
  });

  // Extract arrays
  const fields = Array.isArray(fieldsData?.fields) ? fieldsData.fields : [];
  const fieldTypes = Array.isArray(typesData?.types) ? typesData.types : [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: createContactField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-fields"] });
      toast.success("Field created successfully");
      closeModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create field");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateContactField(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-fields"] });
      toast.success("Field updated successfully");
      closeModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update field");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContactField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-fields"] });
      toast.success("Field deleted successfully");
      setDeletingField(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete field");
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      label: "",
      field_key: "",
      field_type: "",
      options: "",
      placeholder: "",
      is_required: false,
      sort_order: 0,
      is_active: true,
    },
  });

  const watchFieldType = watch("field_type");
  const isSelectType = watchFieldType === "select";

  const openModal = (field = null) => {
    if (field) {
      setEditingField(field);
      reset({
        label: field.label || "",
        field_key: field.field_key || "",
        field_type: field.field_type || "",
        options: Array.isArray(field.options) ? field.options.join(", ") : (field.options || ""),
        placeholder: field.placeholder || "",
        is_required: field.is_required || false,
        sort_order: field.sort_order || 0,
        is_active: field.is_active !== undefined ? field.is_active : true,
      });
    } else {
      setEditingField(null);
      reset({
        label: "",
        field_key: "",
        field_type: "",
        options: "",
        placeholder: "",
        is_required: false,
        sort_order: 0,
        is_active: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingField(null);
    reset();
  };

  const onSubmit = (data) => {
    const payload = { ...data };
    
    // Process options if it's a select field
    if (payload.field_type === "select" && payload.options) {
      payload.options = payload.options.split(",").map(opt => opt.trim()).filter(Boolean);
    } else {
      payload.options = []; // Clear options for non-select fields
    }

    // Don't send empty strings for optional key
    if (!payload.field_key) delete payload.field_key;
    if (!payload.placeholder) delete payload.placeholder;

    if (editingField) {
      updateMutation.mutate({ id: editingField.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const columns = [
    {
      id: "label",
      header: "Label",
      accessorKey: "label",
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.label}</div>
          <div className="text-xs text-slate-500 font-mono mt-0.5">{row.field_key}</div>
        </div>
      ),
    },
    {
      id: "field_type",
      header: "Type",
      accessorKey: "field_type",
      render: (row) => (
        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium border border-indigo-100 uppercase tracking-wide">
          {row.field_type}
        </span>
      ),
    },
    {
      id: "sort_order",
      header: "Sort",
      accessorKey: "sort_order",
    },
    {
      id: "is_required",
      header: "Required",
      render: (row) => (
        row.is_required ? (
          <span className="text-rose-600 font-medium text-xs">Required</span>
        ) : (
          <span className="text-slate-400 text-xs">Optional</span>
        )
      ),
    },
    {
      id: "is_active",
      header: "Status",
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${row.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
          {row.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cellClassName: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => openModal(row)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            title="Edit Field"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeletingField(row)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Field"
          >
            <Trash2 className="h-4 w-4" />
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
          <h1 className="text-2xl font-bold text-slate-900">Contact Form Fields</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage dynamic fields for your contact form.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <DataTable
          columns={columns}
          data={fields}
          isLoading={isLoadingFields}
          searchPlaceholder="Search fields..."
          searchAccessor="label"
          actions={
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm font-medium cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Field
            </button>
          }
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingField ? "Edit Field" : "Create Field"}
        description={editingField ? "Update the details of this form field." : "Add a new field to your contact form."}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <Label>Field Label <span className="text-rose-500">*</span></Label>
              <Input
                {...register("label")}
                placeholder="e.g. Full Name"
                className={errors.label ? "border-rose-300 focus:border-rose-500" : ""}
              />
              {errors.label && <p className="text-xs text-rose-500">{errors.label.message}</p>}
            </div>

            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <Label className="flex items-center gap-1">
                Field Key
                <div className="group relative">
                  <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    Used in API. Auto-generated from label if left blank. Only lowercase & underscores.
                  </div>
                </div>
              </Label>
              <Input
                {...register("field_key")}
                placeholder="e.g. full_name"
                className={errors.field_key ? "border-rose-300 focus:border-rose-500" : ""}
              />
              {errors.field_key && <p className="text-xs text-rose-500">{errors.field_key.message}</p>}
            </div>

            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <Label>Field Type <span className="text-rose-500">*</span></Label>
              <Controller
                control={control}
                name="field_type"
                render={({ field }) => (
                  <Select 
                    value={field.value} 
                    onChange={(e) => field.onChange(e.target.value)}
                    className={errors.field_type ? "border-rose-300" : ""}
                  >
                    <option value="" disabled>Select type</option>
                    {fieldTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.toUpperCase()}
                      </option>
                    ))}
                  </Select>
                )}
              />
              {errors.field_type && <p className="text-xs text-rose-500">{errors.field_type.message}</p>}
            </div>

            {isSelectType && (
              <div className="space-y-1.5 col-span-2">
                <Label>Options <span className="text-rose-500">*</span></Label>
                <Input
                  {...register("options")}
                  placeholder="e.g. General Inquiry, Support, Sales"
                />
                <p className="text-[10px] text-slate-500">Provide a comma-separated list of options for the select dropdown.</p>
              </div>
            )}

            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <Label>Placeholder</Label>
              <Input
                {...register("placeholder")}
                placeholder="e.g. Enter your details..."
              />
            </div>

            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <Label>Sort Order</Label>
              <Input
                type="number"
                {...register("sort_order")}
              />
            </div>
          </div>

          <div className="flex gap-6 py-4 px-2">
            <Controller
              control={control}
              name="is_required"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="is_required" 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                  <Label htmlFor="is_required" className="cursor-pointer font-medium text-slate-700">Required Field</Label>
                </div>
              )}
            />

            <Controller
              control={control}
              name="is_active"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="is_active" 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                  <Label htmlFor="is_active" className="cursor-pointer font-medium text-slate-700">Active</Label>
                </div>
              )}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {(createMutation.isPending || updateMutation.isPending) ? "Saving..." : "Save Field"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={!!deletingField}
        onClose={() => setDeletingField(null)}
        onConfirm={() => deleteMutation.mutate(deletingField?.id)}
        title="Delete Field"
        description={`Are you sure you want to delete the field "${deletingField?.label}"? This action cannot be undone.`}
        isDeleting={deleteMutation.isPending || deleteMutation.isLoading}
      />
    </div>
  );
}
