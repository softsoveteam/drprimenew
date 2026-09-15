"use client";

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { Select } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  short_description: z.string().min(1, 'Short description is required').max(1000),
  content: z.string().min(1, 'Content is required'),
  seo_title: z.string().max(255).optional(),
  seo_description: z.string().max(500).optional(),
  focus_keyword: z.string().max(255).optional(),
  status: z.enum(['draft', 'scheduled', 'published']).default('draft'),
  scheduled_at: z.string().optional().nullable(),
});

export function ArticleForm({ initialData, onSubmit, isLoading }) {
  const router = useRouter();

  const { register, handleSubmit, control, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: '',
      short_description: '',
      content: '',
      seo_title: '',
      seo_description: '',
      focus_keyword: '',
      status: 'draft',
      scheduled_at: '',
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || '',
        short_description: initialData.short_description || '',
        content: initialData.content || '',
        seo_title: initialData.seo_title || '',
        seo_description: initialData.seo_description || '',
        focus_keyword: initialData.focus_keyword || '',
        status: initialData.status || 'draft',
        scheduled_at: initialData.scheduled_at ? new Date(initialData.scheduled_at).toISOString().slice(0, 16) : '',
      });
    }
  }, [initialData, reset]);

  const currentStatus = watch('status');

  return (
    <form id="article-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-4">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                {...register('title')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="Enter article title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description <span className="text-red-500">*</span></label>
              <textarea 
                {...register('short_description')}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="Brief summary of the article"
              ></textarea>
              {errors.short_description && <p className="text-red-500 text-sm mt-1">{errors.short_description.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content <span className="text-red-500">*</span></label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <RichTextEditor 
                    value={field.value} 
                    onChange={field.onChange} 
                    placeholder="Write your article content here..."
                  />
                )}
              />
              {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
            </div>
          </div>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-4">Publishing</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select {...register('status')}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </Select>
            </div>

            {currentStatus === 'scheduled' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Date & Time</label>
                <input 
                  type="datetime-local" 
                  {...register('scheduled_at')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-4">SEO Settings</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
              <input 
                type="text" 
                {...register('seo_title')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="SEO optimized title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Focus Keyword</label>
              <input 
                type="text" 
                {...register('focus_keyword')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="e.g. healthcare 2026"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
              <textarea 
                {...register('seo_description')}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="Meta description for search engines"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
