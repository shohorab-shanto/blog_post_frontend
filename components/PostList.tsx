// components/PostList.tsx
import React from 'react';
import PostListItem from './PostListItem';
import { Post } from '../pages/admin'; // Import Post type from main component

interface PostListProps {
  posts: Post[];
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
}

export default function PostList({ posts, searchTerm, onSearchChange, onEdit, onDelete }: PostListProps) {
  return (
    <>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search admin posts..."
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
        />
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-700">No posts available.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post: Post) => (
            <PostListItem
              key={post.id}
              post={post}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}
