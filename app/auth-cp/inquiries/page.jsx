"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSubmissions, getSubmissionById, deleteSubmission } from "@/services/submission.service";
import { DataTable } from "@/components/admin/DataTable";
import { Modal } from "@/components/ui/modal";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { Eye, Trash2, Calendar, Globe, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function SubmissionsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [deletingSubmission, setDeletingSubmission] = useState(null);

  const queryClient = useQueryClient();

  // Fetch list of submissions
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-submissions", { page, limit }],
    queryFn: () => getSubmissions({ page, per_page: limit }),
    keepPreviousData: true,
  });

  // Fetch single submission details via GET /admin/contact-form/submissions/{id}
  const { data: detailData, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["admin-submission-detail", selectedSubmissionId],
    queryFn: () => getSubmissionById(selectedSubmissionId),
    enabled: !!selectedSubmissionId,
  });

  const singleSubmission = detailData?.submission || detailData?.data?.submission || detailData?.data || null;

  // Extract pagination & array standardly
  const submissionsList = Array.isArray(data?.data) ? data.data : Array.isArray(data?.data?.data) ? data.data.data : [];
  const totalItems = data?.total || data?.data?.total || submissionsList.length;

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteSubmission(id),
    onSuccess: () => {
      toast.success("Submission deleted successfully");
      queryClient.invalidateQueries(["admin-submissions"]);
      setDeletingSubmission(null);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete submission");
    },
  });

  // Columns definition matching DataTable's expected prop names
  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      render: (row) => <span className="font-mono text-xs text-slate-500">#{row.id}</span>,
    },
    {
      header: "Sender / Details",
      id: "sender_details",
      render: (row) => {
        const formData = row.data || {};
        const name = formData.full_name || formData.name || row.user?.name || "Anonymous";
        const email = formData.email || row.user?.email || "N/A";

        return (
          <div className="flex flex-col">
            <span className="font-medium text-slate-900 text-xs">{name}</span>
            <span className="text-[11px] text-slate-500">{email}</span>
          </div>
        );
      },
    },
    {
      header: "IP Address",
      accessorKey: "ip_address",
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-mono">
          <Globe className="w-3 h-3 text-slate-400" />
          {row.ip_address || "N/A"}
        </span>
      ),
    },
    {
      header: "Submitted At",
      accessorKey: "created_at",
      render: (row) => (
        <span className="text-xs text-slate-500">
          {row.created_at ? new Date(row.created_at).toLocaleString() : "N/A"}
        </span>
      ),
    },
    {
      header: "Actions",
      id: "actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedSubmissionId(row.id)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingSubmission(row)}
            className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete Submission"
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
          <h1 className="text-2xl font-bold text-slate-900">Contact Submissions</h1>
          <p className="text-xs text-slate-500 mt-1">
            View and manage messages received through the public contact form.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <DataTable
          columns={columns}
          data={submissionsList}
          totalItems={totalItems}
          isLoading={isLoading}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          onRefetch={refetch}
          placeholderText="Search records..."
          emptyStateText="No submissions found"
        />
      </div>

      {/* Details View Modal */}
      <Modal
        isOpen={!!selectedSubmissionId}
        onClose={() => setSelectedSubmissionId(null)}
        title={`Submission #${selectedSubmissionId || ""}`}
        description="Detailed information submitted via contact form."
      >
        {isLoadingDetail ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            <span className="text-xs text-slate-500">Loading submission details...</span>
          </div>
        ) : singleSubmission ? (
          <div className="space-y-4 pt-2">
            {/* Metadata badges */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">
                  {singleSubmission.created_at
                    ? new Date(singleSubmission.created_at).toLocaleString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-mono">{singleSubmission.ip_address || "N/A"}</span>
              </div>
            </div>

            {/* Form Fields Data */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Submitted Fields
              </h4>

              {singleSubmission.data &&
              typeof singleSubmission.data === "object" &&
              Object.keys(singleSubmission.data).length > 0 ? (
                <div className="space-y-2.5">
                  {Object.entries(singleSubmission.data).map(([key, value]) => (
                    <div
                      key={key}
                      className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1"
                    >
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">
                        {key.replace(/_/g, " ")}
                      </span>
                      <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-medium">
                        {String(value || "N/A")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No field data recorded.</p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedSubmissionId(null)}
                className="py-2 px-4 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-6 text-center">Unable to load submission details.</p>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingSubmission}
        onClose={() => setDeletingSubmission(null)}
        onConfirm={() => deleteMutation.mutate(deletingSubmission?.id)}
        title="Delete Submission"
        description="Are you sure you want to delete this contact submission?"
        isDeleting={deleteMutation.isPending || deleteMutation.isLoading}
      />
    </div>
  );
}

