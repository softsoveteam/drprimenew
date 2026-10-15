"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createArticle } from '@/services/article.service';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { ArrowLeft, Loader2, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function CreateArticlePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      router.push('/auth-cp/articles');
    }
  });

  const handleSubmit = (data) => {
    // Format scheduled_at if needed
    if (data.status !== 'scheduled') {
      data.scheduled_at = null; // or omit
    } else if (data.scheduled_at) {
      // Ensure proper formatting for API if necessary
      data.scheduled_at = new Date(data.scheduled_at).toISOString().slice(0, 19).replace('T', ' ');
    }
    
    createMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-slate-100/60 to-transparent pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/auth-cp/articles"
              className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors shadow-xs"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white shadow-sm shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Create New Article
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Draft content, configure SEO metadata, and schedule blog releases.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
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
              disabled={createMutation.isPending}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all font-semibold text-xs shadow-sm shadow-indigo-600/20 flex items-center gap-2 disabled:opacity-70 cursor-pointer active:scale-[0.98]"
            >
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Publish Article
            </button>
          </div>
        </div>
      </div>

      <ArticleForm 
        onSubmit={handleSubmit} 
        isLoading={createMutation.isPending} 
      />
    </div>
  );
}
