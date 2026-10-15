"use strict";
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getArticles, deleteArticle } from '@/services/article.service';
import { DataTable } from '@/components/admin/DataTable';
import { Select } from '@/components/ui/select';
import { DeleteConfirmModal } from '@/components/ui/delete-confirm-modal';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function ArticlesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [deletingArticle, setDeletingArticle] = useState(null);

  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-articles', { page, limit, search, status }],
    queryFn: () => getArticles({ page, per_page: limit, search, status }),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      setDeletingArticle(null);
    }
  });

  const confirmDelete = () => {
    if (deletingArticle?.id) {
      deleteMutation.mutate(deletingArticle.id);
    }
  };

  const columns = [
    {
      header: 'Title',
      accessorKey: 'title',
      render: (row) => (
        <div className="font-medium text-gray-900">{row.title}</div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      render: (row) => {
        const colors = {
          published: 'bg-green-100 text-green-800',
          draft: 'bg-gray-100 text-gray-800',
          scheduled: 'bg-blue-100 text-blue-800',
        };
        const color = colors[row.status] || 'bg-gray-100 text-gray-800';
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${color}`}>
            {row.status}
          </span>
        );
      }
    },
    {
      header: 'Author',
      accessorKey: 'author',
      render: (row) => (
        <div className="text-sm text-gray-500">{row.author?.name || 'Unknown'}</div>
      )
    },
    {
      header: 'Published At',
      accessorKey: 'published_at',
      render: (row) => (
        <div className="text-sm text-gray-500">
          {row.published_at ? format(new Date(row.published_at), 'PP p') : '-'}
        </div>
      )
    },
    {
      header: 'Actions',
      id: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link href={`/auth-cp/articles/${row.id}`} className="p-2 text-gray-500 hover:text-indigo-600 transition-colors">
            <Edit className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setDeletingArticle(row)}
            disabled={deleteMutation.isLoading}
            className="p-2 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50 cursor-pointer"
            title="Delete Article"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-slate-100/60 to-transparent pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white shadow-sm shrink-0">
              <Edit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Articles & Blog Posts
                </h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                  {data?.total ?? data?.data?.total ?? 0} Published
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Publish and manage sleep health guides, blog stories, and educational articles.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
            <div className="w-full sm:w-44 shrink-0">
              <Select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </Select>
            </div>

            <Link
              href="/auth-cp/articles/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-indigo-600/20 transition-all cursor-pointer whitespace-nowrap active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Create Article</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <DataTable
          columns={columns}
          data={Array.isArray(data?.data) ? data.data : (Array.isArray(data?.data?.data) ? data.data.data : [])}
          totalItems={data?.total ?? data?.data?.total ?? 0}
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
          placeholderText="Search articles by title..."
          actions={
            <Link
              href="/auth-cp/articles/create"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              New Article
            </Link>
          }
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingArticle}
        onClose={() => setDeletingArticle(null)}
        onConfirm={confirmDelete}
        title="Delete Article"
        description="Are you sure you want to delete this article? This action cannot be undone."
        itemName={deletingArticle?.title}
        isLoading={deleteMutation.isLoading || deleteMutation.isPending}
      />
    </div>
  );
}
