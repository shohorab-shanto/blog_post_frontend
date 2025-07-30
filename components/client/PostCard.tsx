import React from 'react';
import { Post } from './Content';

interface BlogPostCardProps {
  post: Post;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {post.title}
        </h2>
        <p className="text-sm text-gray-500 mb-4">{post.date}</p>
        <p className="text-gray-700 mb-4">{post.excerpt}</p>
        <details className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
          <summary>Read More</summary>
          <div
            className="mt-4 text-gray-800 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
            suppressHydrationWarning={true}
          ></div>
        </details>
      </div>
    </div>
  );
}
