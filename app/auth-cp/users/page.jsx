"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminUsers,
  getAdminUserById,
  deleteAdminUser,
} from "@/services/admin-user.service";
import { extractPaginated } from "@/lib/axios";
import { DataTable } from "@/components/admin/DataTable";
import { Modal } from "@/components/ui/modal";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { Select } from "@/components/ui/select";
import { Eye, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [search, setSearch] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-users", { page, limit, search, isActiveFilter }],
    queryFn: () => {
      const params = {
        page,
        per_page: limit,
        role: "user",
      };
      if (search) params.search = search;
      // Send as string so Laravel filter binding is reliable
      if (isActiveFilter === "true" || isActiveFilter === "false") {
        params.is_active = isActiveFilter;
      }
      return getAdminUsers(params);
    },
  });

  const { list: usersList, total: totalItems } = extractPaginated(data);

  const { data: detailData, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["admin-user-detail", selectedUserId],
    queryFn: () => getAdminUserById(selectedUserId),
    enabled: !!selectedUserId,
  });

  const userDetail =
    detailData?.user || detailData?.data?.user || detailData?.data || null;

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteAdminUser(id),
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setDeletingUser(null);
      if (selectedUserId === deletingUser?.id) setSelectedUserId(null);
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to delete user");
    },
  });

  const columns = [
    {
      header: "Customer",
      id: "customer",
      className: "min-w-[220px]",
      render: (row) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[11px] font-bold shrink-0 leading-none">
            {(row.name || "?").slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex flex-col gap-0.5">
            <span className="font-semibold text-slate-900 text-xs leading-tight truncate block">
              {row.name}
            </span>
            <span className="text-[11px] text-slate-500 leading-tight truncate block">
              {row.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Orders",
      id: "orders_count",
      render: (row) => (
        <span className="font-mono text-xs text-slate-700">{row.orders_count ?? 0}</span>
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
      header: "Joined",
      id: "created_at",
      render: (row) => (
        <span className="text-xs text-slate-500">
          {row.created_at ? new Date(row.created_at).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      header: "Actions",
      id: "actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedUserId(row.id)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
            title="View user"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingUser(row)}
            className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete user"
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
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-xs text-slate-500 mt-1">
            Shop customers only. Deleting a user also removes their cart and orders.
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
          {error.message || "Failed to load users"}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <DataTable
          columns={columns}
          data={usersList}
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
          placeholderText="Search name or email..."
          emptyStateText="No users found"
        />
      </div>

      <Modal
        isOpen={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
        title="User details"
        description="Customer account information"
      >
        {isLoadingDetail ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : !userDetail ? (
          <span className="text-sm text-slate-500 py-6 text-center block">User not found</span>
        ) : (
          <div className="space-y-5 w-full">
            <div className="flex items-center gap-3 w-full min-w-0">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 text-sm font-bold leading-none">
                {(userDetail.name || "?")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="min-w-0 flex flex-col gap-0.5">
                <span className="font-bold text-slate-900 text-sm leading-tight truncate">
                  {userDetail.name}
                </span>
                <span className="text-xs text-slate-500 leading-tight truncate">
                  {userDetail.email}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 w-full">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide block">
                  Status
                </span>
                <span
                  className={`mt-1.5 inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-full border ${
                    userDetail.is_active
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}
                >
                  {userDetail.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide block">
                  Orders
                </span>
                <span className="mt-1.5 font-semibold text-slate-900 text-sm block leading-tight">
                  {userDetail.orders_count ?? 0}
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide block">
                  Joined
                </span>
                <span className="mt-1.5 font-semibold text-slate-900 text-sm block leading-tight">
                  {userDetail.created_at
                    ? new Date(userDetail.created_at).toLocaleDateString()
                    : "—"}
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide block">
                  Email verified
                </span>
                <span
                  className={`mt-1.5 inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-full border ${
                    userDetail.email_verified_at
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {userDetail.email_verified_at ? "Verified" : "Not verified"}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <DeleteConfirmModal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={() => deleteMutation.mutate(deletingUser?.id)}
        title="Delete User"
        description="Deletes this customer and cascades their cart and orders."
        itemName={deletingUser?.email || deletingUser?.name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
