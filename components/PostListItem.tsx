// components/PostListItem.tsx
import React from 'react';
import { Post } from '../pages/admin'; // Import Post type from main component

interface PostListItemProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
}

export default function PostListItem({ post, onEdit, onDelete }: PostListItemProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
        <p className="text-sm text-gray-500 mb-2">Published: {post.date}</p>
        <p className="text-gray-700">{post.excerpt}</p>
      </div>
      <div className="flex space-x-3 mt-4 sm:mt-0">
        <button onClick={() => onEdit(post)} className="px-4 py-2 bg-yellow-500 text-white font-medium rounded-md shadow-sm hover:bg-yellow-600 transition-colors duration-300">Edit</button>
        <button onClick={() => onDelete(post.id)} className="px-4 py-2 bg-red-600 text-white font-medium rounded-md shadow-sm hover:bg-red-700 transition-colors duration-300">Delete</button>
      </div>
    </div>
  );
}
