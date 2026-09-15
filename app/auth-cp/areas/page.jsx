"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAreas, createArea, updateArea, deleteArea } from "@/services/area.service";
import { DataTable } from "@/components/admin/DataTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AsyncSelect } from "@/components/ui/async-select";
import { Modal } from "@/components/ui/modal";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { Plus, Edit, Trash2, MapPin, ChevronRight, CornerDownRight, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const areaSchema = z.object({
  name: z.string().min(1, "Area name is required").max(255),
  parent_id: z.any().optional().nullable(),
});

export default function AreasPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [deletingArea, setDeletingArea] = useState(null);
  const [apiError, setApiError] = useState("");

  const queryClient = useQueryClient();

  // Fetch areas query
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-areas", { page, limit, search }],
    queryFn: () => getAreas({ page, per_page: limit, search }),
    keepPreviousData: true,
  });

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(areaSchema),
    defaultValues: {
      name: "",
      parent_id: "",
    },
  });

  // AsyncSelect options loader with pagination and search
  const loadParentAreas = React.useCallback(
    async ({ page: pageNum, page_size, search: searchQuery }) => {
      const res = await getAreas({
        page: pageNum,
        per_page: page_size || 20,
        search: searchQuery,
      });

      const rawItems = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.data)
          ? res.data.data
          : [];

      // Filter out the area currently being edited to prevent setting itself as parent
      const filtered = rawItems.filter(
        (item) => !item.parent_id && String(item.id) !== String(editingArea?.id)
      );

      return {
        data: filtered,
        meta: {
          pagination: {
            totalPages: res?.last_page || res?.data?.last_page || 1,
          },
        },
      };
    },
    [editingArea]
  );

  // Open modal for creating or editing
  const handleOpenModal = (area = null, parentArea = null) => {
    setEditingArea(area);
    setApiError("");

    if (area) {
      const selectedParent = area.parent
        ? area.parent
        : area.parent_id
          ? { id: area.parent_id, name: area.parentName || `Parent #${area.parent_id}` }
          : null;

      reset({
        name: area.name || "",
        parent_id: selectedParent,
      });
    } else if (parentArea) {
      reset({
        name: "",
        parent_id: { id: parentArea.id, name: parentArea.name },
      });
    } else {
      reset({
        name: "",
        parent_id: null,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingArea(null);
    setApiError("");
    reset();
  };

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-areas"] });
      handleCloseModal();
    },
    onError: (err) => {
      setApiError(err.message || "Failed to create area.");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateArea(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-areas"] });
      handleCloseModal();
    },
    onError: (err) => {
      setApiError(err.message || "Failed to update area.");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-areas"] });
      setDeletingArea(null);
    },
  });

  const confirmDelete = () => {
    if (deletingArea?.id) {
      deleteMutation.mutate(deletingArea.id);
    }
  };

  const onSubmit = (formData) => {
    setApiError("");
    const parentIdVal = formData.parent_id
      ? typeof formData.parent_id === "object"
        ? formData.parent_id.id
        : formData.parent_id
      : null;

    const payload = {
      name: formData.name,
      parent_id: parentIdVal ? Number(parentIdVal) : null,
    };

    if (editingArea) {
      updateMutation.mutate({ id: editingArea.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  // Safely extract raw array and total count
  const rawList = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.data?.data)
      ? data.data.data
      : [];

  const totalItems = data?.total ?? data?.data?.total ?? 0;

  // Flatten nested parent & children for structured display inside table
  const tableRows = React.useMemo(() => {
    const rows = [];
    rawList.forEach((parent) => {
      rows.push({
        ...parent,
        isParentRow: true,
      });
      if (Array.isArray(parent.children) && parent.children.length > 0) {
        parent.children.forEach((child) => {
          rows.push({
            ...child,
            isParentRow: false,
            parentName: parent.name,
          });
        });
      }
    });
    return rows;
  }, [rawList]);

  // Extract all available parent areas for dropdown option selection
  const parentOptions = React.useMemo(() => {
    return rawList
      .filter((item) => !item.parent_id)
      .map((item) => ({
        id: String(item.id),
        name: item.name,
      }));
  }, [rawList]);

  const columns = [
    {
      header: "Area Name",
      accessorKey: "name",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.isParentRow ? (
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <MapPin className="w-4 h-4 text-[#1d1c50]" />
              <span>{row.name}</span>
              {row.children_count > 0 && (
                <span className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded-full font-medium border border-slate-200">
                  {row.children_count} subareas
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-6 text-slate-700 font-medium">
              <CornerDownRight className="w-3.5 h-3.5 text-slate-400" />
              <span>{row.name}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Type",
      id: "type",
      render: (row) => (
        <span
          className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${row.isParentRow
              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
              : "bg-slate-100 text-slate-600 border-slate-200"
            }`}
        >
          {row.isParentRow ? "Main Area" : "Subarea"}
        </span>
      ),
    },
    {
      header: "Parent Area",
      id: "parent",
      render: (row) => (
        <div className="text-slate-500 text-xs">
          {row.isParentRow ? (
            <span className="text-slate-400 italic">—</span>
          ) : (
            <span className="font-medium text-slate-700">{row.parentName || "Parent"}</span>
          )}
        </div>
      ),
    },
    {
      header: "Actions",
      id: "actions",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          {row.isParentRow && (
            <button
              onClick={() => handleOpenModal(null, row)}
              className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              title="Add subarea under this parent"
            >
              <Plus className="w-3 h-3" />
              <span>Add Subarea</span>
            </button>
          )}

          <button
            onClick={() => handleOpenModal(row)}
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Edit area"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            onClick={() => setDeletingArea(row)}
            disabled={deleteMutation.isPending}
            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            title="Delete area"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Areas Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage main regions, cities, and nested subareas.
          </p>
        </div>
      </div>

      {/* Table section */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <DataTable
          columns={columns}
          data={tableRows}
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
          placeholderText="Search areas or subareas..."
          actions={
            <button
              onClick={() => handleOpenModal(null)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-xs text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New Area
            </button>
          }
        />
      </div>

      {/* Add / Edit Area Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingArea ? `Edit Area: ${editingArea.name}` : "Create New Area"}
        description={
          editingArea
            ? "Modify the name or parent area settings."
            : "Create a main region or add a subarea to an existing parent area."
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {apiError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
              {apiError}
            </div>
          )}

          <div>
            <Label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Area Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g. Madrid or Sol Centro"
              {...register("name")}
              className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="parent_id" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Parent Area (Optional)
            </Label>
            <Controller
              name="parent_id"
              control={control}
              render={({ field }) => (
                <AsyncSelect
                  value={field.value}
                  onChange={field.onChange}
                  loadOptions={loadParentAreas}
                  placeholder="Search and select parent area..."
                  labelKey="name"
                  idKey="id"
                />
              )}
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Search and select a parent area to make this a subarea, or leave empty for a main area.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {editingArea ? "Save Changes" : "Create Area"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingArea}
        onClose={() => setDeletingArea(null)}
        onConfirm={confirmDelete}
        title="Delete Area"
        description={
          !deletingArea?.parent_id && deletingArea?.children_count > 0
            ? `Deleting "${deletingArea?.name}" will also cascade delete all its ${deletingArea?.children_count} subareas. Are you sure?`
            : "Are you sure you want to delete this area? This action cannot be undone."
        }
        itemName={deletingArea?.name}
        isLoading={deleteMutation.isPending || deleteMutation.isLoading}
      />
    </div>
  );
}
