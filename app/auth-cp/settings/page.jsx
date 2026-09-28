"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSettings,
  createSetting,
  updateSetting,
  deleteSetting,
} from "@/services/setting.service";
import { DataTable } from "@/components/admin/DataTable";
import { Modal } from "@/components/ui/modal";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, KeyRound, Loader2, Eye, EyeOff } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const settingSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Max 100 characters")
    .regex(
      /^[a-z0-9_-]+$/,
      "Use lowercase letters, numbers, underscore, or hyphen only"
    ),
  api_key: z.string().max(5000, "Max 5000 characters").optional().or(z.literal("")),
  secret_key: z.string().max(5000, "Max 5000 characters").optional().or(z.literal("")),
  webhook: z.string().max(5000, "Max 5000 characters").optional().or(z.literal("")),
  is_active: z.boolean().default(true),
});

function maskSecret(value) {
  if (!value) return "—";
  if (value.length <= 10) return "••••••••";
  return `${value.slice(0, 7)}…${value.slice(-4)}`;
}

export default function SettingsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState(null);
  const [deletingSetting, setDeletingSetting] = useState(null);
  const [showSecrets, setShowSecrets] = useState({
    api_key: false,
    secret_key: false,
    webhook: false,
  });

  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-settings", { page, limit, search }],
    queryFn: () => getSettings({ page, per_page: limit, search }),
    keepPreviousData: true,
  });

  const settingsList = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.data?.data)
    ? data.data.data
    : [];
  const totalItems = data?.total || data?.data?.total || settingsList.length;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      name: "",
      api_key: "",
      secret_key: "",
      webhook: "",
      is_active: true,
    },
  });

  const handleOpenModal = (setting = null) => {
    setEditingSetting(setting);
    setShowSecrets({ api_key: false, secret_key: false, webhook: false });
    if (setting) {
      reset({
        name: setting.name || "",
        api_key: setting.api_key || "",
        secret_key: setting.secret_key || "",
        webhook: setting.webhook || "",
        is_active: Boolean(setting.is_active),
      });
    } else {
      reset({
        name: "",
        api_key: "",
        secret_key: "",
        webhook: "",
        is_active: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSetting(null);
    reset();
  };

  const createMutation = useMutation({
    mutationFn: (formData) => createSetting(formData),
    onSuccess: () => {
      toast.success("Setting created successfully");
      queryClient.invalidateQueries(["admin-settings"]);
      closeModal();
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to create setting");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (formData) => updateSetting(editingSetting.id, formData),
    onSuccess: () => {
      toast.success("Setting updated successfully");
      queryClient.invalidateQueries(["admin-settings"]);
      closeModal();
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update setting");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteSetting(id),
    onSuccess: () => {
      toast.success("Setting deleted successfully");
      queryClient.invalidateQueries(["admin-settings"]);
      setDeletingSetting(null);
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to delete setting");
    },
  });

  const onSubmit = (formData) => {
    const payload = {
      ...formData,
      name: formData.name.toLowerCase().trim(),
      api_key: formData.api_key || "",
      secret_key: formData.secret_key || "",
      webhook: formData.webhook || "",
    };
    if (editingSetting) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const columns = [
    {
      header: "Provider",
      id: "name",
      render: (row) => (
        <div className="flex items-center gap-2">
          <KeyRound className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="font-mono text-xs font-semibold text-slate-900">{row.name}</span>
        </div>
      ),
    },
    {
      header: "API Key",
      id: "api_key",
      render: (row) => (
        <span className="font-mono text-[11px] text-slate-500">{maskSecret(row.api_key)}</span>
      ),
    },
    {
      header: "Secret Key",
      id: "secret_key",
      render: (row) => (
        <span className="font-mono text-[11px] text-slate-500">{maskSecret(row.secret_key)}</span>
      ),
    },
    {
      header: "Webhook",
      id: "webhook",
      render: (row) => (
        <span className="font-mono text-[11px] text-slate-500">{maskSecret(row.webhook)}</span>
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
            title="Edit setting"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingSetting(row)}
            className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete setting"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const secretFields = [
    {
      name: "api_key",
      label: "API Key (Publishable)",
      placeholder: "pk_test_... or pk_live_...",
      hint: "For Stripe: publishable key",
    },
    {
      name: "secret_key",
      label: "Secret Key",
      placeholder: "sk_test_... or sk_live_...",
      hint: "For Stripe: secret key",
    },
    {
      name: "webhook",
      label: "Webhook Signing Secret",
      placeholder: "whsec_...",
      hint: "For Stripe: webhook signing secret (not a URL)",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-xs text-slate-500 mt-1">
            Store third-party credentials (one row per provider). Checkout uses the active{" "}
            <span className="font-mono text-slate-700">stripe</span> row, or falls back to{" "}
            <span className="font-mono text-slate-700">.env</span>.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <DataTable
          columns={columns}
          data={settingsList}
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
          placeholderText="Search by provider name..."
          emptyStateText="No settings found"
          actions={
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-xs text-xs font-semibold cursor-pointer whitespace-nowrap active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Add Setting
            </button>
          }
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingSetting ? "Edit Setting" : "Create Setting"}
        description={
          editingSetting
            ? "Update provider credentials. Send the full record."
            : "Add a provider (e.g. stripe). Name is a unique lowercase slug."
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">
              Name (slug) <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="stripe"
              disabled={!!editingSetting}
              {...register("name")}
              className={errors.name ? "border-rose-300 focus-visible:ring-rose-200" : ""}
            />
            {errors.name && (
              <p className="text-[11px] text-rose-500 font-medium">{errors.name.message}</p>
            )}
            <p className="text-[10px] text-slate-400">
              Lowercase letters, numbers, _ and - only. Example: stripe, paypal, razorpay.
            </p>
          </div>

          {secretFields.map((field) => (
            <div key={field.name} className="space-y-1.5">
              <Label htmlFor={field.name}>{field.label}</Label>
              <div className="relative">
                <Input
                  id={field.name}
                  type={showSecrets[field.name] ? "text" : "password"}
                  placeholder={field.placeholder}
                  autoComplete="off"
                  {...register(field.name)}
                  className={`pr-10 ${
                    errors[field.name] ? "border-rose-300 focus-visible:ring-rose-200" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowSecrets((prev) => ({
                      ...prev,
                      [field.name]: !prev[field.name],
                    }))
                  }
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex={-1}
                >
                  {showSecrets[field.name] ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors[field.name] && (
                <p className="text-[11px] text-rose-500 font-medium">
                  {errors[field.name].message}
                </p>
              )}
              <p className="text-[10px] text-slate-400">{field.hint}</p>
            </div>
          ))}

          <div className="flex items-center space-x-2 pt-1">
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
              Active (inactive stripe row is ignored; checkout uses .env)
            </Label>
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
              ) : editingSetting ? (
                "Save Changes"
              ) : (
                "Create Setting"
              )}
            </button>
          </div>
        </form>
      </Modal>

      <DeleteConfirmModal
        isOpen={!!deletingSetting}
        onClose={() => setDeletingSetting(null)}
        onConfirm={() => deleteMutation.mutate(deletingSetting?.id)}
        title="Delete Setting"
        description="Are you sure you want to delete this provider setting? Checkout may fall back to .env if no active stripe row remains."
        itemName={deletingSetting?.name}
        isLoading={deleteMutation.isPending || deleteMutation.isLoading}
      />
    </div>
  );
}
