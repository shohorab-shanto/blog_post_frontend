// components/PostForm.tsx
import React from 'react';
import { Post, PostFormState } from '../pages/admin'; // Import types from main component

interface PostFormProps {
  form: PostFormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  editingPost: Post | null;
  onCancelEdit: () => void;
}

export default function PostForm({ form, handleChange, handleSubmit, editingPost, onCancelEdit }: PostFormProps) {
  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        {editingPost ? 'Edit Post' : 'Create New Post'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6 mb-12">
        <div>
          <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">Title</label>
          <input type="text" id="title" name="title" value={form.title} onChange={handleChange} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg" />
        </div>
        <div>
          <label htmlFor="slug" className="block text-lg font-medium text-gray-700 mb-2">Slug (Optional, auto-generated if empty)</label>
          <input type="text" id="slug" name="slug" value={form.slug || ''} onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg" />
        </div>
        <div>
          <label htmlFor="published_at" className="block text-lg font-medium text-gray-700 mb-2">Published At</label>
          <input
            type="datetime-local"
            id="published_at"
            name="published_at"
            value={form.published_at || ''}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-lg font-medium text-gray-700 mb-2">Content (HTML allowed)</label>
          <textarea id="content" name="content" value={form.content} onChange={handleChange} rows={10} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"></textarea>
        </div>
        <div className="flex justify-end space-x-4">
          {editingPost && (
            <button type="button" onClick={onCancelEdit} className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Cancel Edit</button>
          )}
          <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            {editingPost ? 'Update Post' : 'Add Post'}
          </button>
        </div>
      </form>
    </>
  );
}
