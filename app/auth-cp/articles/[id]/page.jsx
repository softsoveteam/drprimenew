"use client";

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getArticle, updateArticle } from '@/services/article.service';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { ArrowLeft, Loader2, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id;
  const queryClient = useQueryClient();

  const { data, isLoading: isLoadingArticle, isError } = useQuery({
    queryKey: ['admin-article', articleId],
    queryFn: () => getArticle(articleId),
    enabled: !!articleId,
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateArticle(articleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      queryClient.invalidateQueries({ queryKey: ['admin-article', articleId] });
      router.push('/auth-cp/articles');
    }
  });

  const handleSubmit = (formData) => {
    // Format scheduled_at if needed
    if (formData.status !== 'scheduled') {
      formData.scheduled_at = null; 
    } else if (formData.scheduled_at) {
      formData.scheduled_at = new Date(formData.scheduled_at).toISOString().slice(0, 19).replace('T', ' ');
    }
    
    updateMutation.mutate(formData);
  };

  const articleData = data?.data?.article || data?.article || data?.data;

  if (isLoadingArticle) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isError || !articleData || !articleData.id) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">Article not found</h2>
        <p className="text-slate-500 mt-2 text-sm">The article you are looking for does not exist or has been deleted.</p>
        <Link href="/auth-cp/articles" className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-xs font-semibold">
          Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-slate-100/60 to-transparent pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              href="/auth-cp/articles"
              className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors shadow-xs shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white shadow-sm shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
                {articleData?.title ? `Edit: ${articleData.title}` : 'Edit Article'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Update article contents, modify SEO tags, or change publishing status.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center shrink-0">
            <button 
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 bg-white rounded-xl hover:bg-slate-50 transition-colors font-medium text-xs shadow-xs cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              form="article-form"
              disabled={updateMutation.isPending}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all font-semibold text-xs shadow-sm shadow-indigo-600/20 flex items-center gap-2 disabled:opacity-70 cursor-pointer active:scale-[0.98]"
            >
              {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <ArticleForm 
        initialData={articleData}
        onSubmit={handleSubmit} 
        isLoading={updateMutation.isPending} 
      />
    </div>
  );
}
