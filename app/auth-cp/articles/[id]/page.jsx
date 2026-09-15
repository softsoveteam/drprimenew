"use client";

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getArticle, updateArticle } from '@/services/article.service';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { ArrowLeft, Loader2 } from 'lucide-react';
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
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Article not found</h2>
        <p className="text-gray-500 mt-2">The article you are looking for does not exist or has been deleted.</p>
        <Link href="/auth-cp/articles" className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/auth-cp/articles" className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {articleData?.title ? `Edit: ${articleData.title}` : 'Edit Article'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Update existing article content and settings.</p>
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
            disabled={updateMutation.isPending}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm flex items-center gap-2 disabled:opacity-70"
          >
            {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Update
          </button>
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
