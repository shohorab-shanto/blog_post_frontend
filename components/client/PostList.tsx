import React from 'react';
import BlogPostCard from './PostCard';
import { Post } from './Content';

interface BlogPostListProps {
  posts: Post[];
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  error: string | null;
}

export default function BlogPostList({ posts, searchTerm, onSearchChange, loading, error }: BlogPostListProps) {
  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        <p className="text-xl">{error}</p>
        <p className="text-lg mt-2">Please ensure your Laravel API is running and accessible.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-gray-700">Loading posts...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-gray-700">No posts found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Latest Blog Posts</h2>
        <input
          type="text"
          placeholder="Search blog posts..."
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: Post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}
