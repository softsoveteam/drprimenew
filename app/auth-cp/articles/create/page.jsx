"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createArticle } from '@/services/article.service';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { ArrowLeft, Loader2 } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/auth-cp/articles" className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Article</h1>
            <p className="text-sm text-gray-500 mt-1">Publish a new article to the blog.</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="article-form"
            disabled={createMutation.isPending}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm flex items-center gap-2 disabled:opacity-70"
          >
            {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Create
          </button>
        </div>
      </div>

      <ArticleForm 
        onSubmit={handleSubmit} 
        isLoading={createMutation.isPending} 
      />
    </div>
  );
}
