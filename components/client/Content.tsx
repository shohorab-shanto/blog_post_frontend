import React, { useState, useEffect, useCallback } from 'react';
import BlogNavbar from './Navbar';
import BlogPostList from './PostList';
import BlogPagination from './Pagination';

export interface Post {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  slug?: string;
  published_at?: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export default function BlogContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [apiCurrentPage, setApiCurrentPage] = useState<number>(1);
  const [apiLastPage, setApiLastPage] = useState<number>(1);
  const [apiLinks, setApiLinks] = useState<PaginationLink[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchBlogPosts = useCallback(async (page: number, search: string = '') => {
    setLoading(true);
    setError(null);
    try {
      if (!API_BASE_URL) {
        throw new Error("API_BASE_URL is not defined in environment variables. Please check your .env.local file.");
      }
      const url = new URL(`${API_BASE_URL}/blogs`);
      url.searchParams.append('page', page.toString());
      if (search) {
        url.searchParams.append('search', search);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiResponse = await response.json();

      if (!apiResponse || !Array.isArray(apiResponse.data)) {
        throw new Error("API response did not contain a 'data' array of posts.");
      }

      const transformedPosts: Post[] = apiResponse.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        date: item.published_at ? new Date(item.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A',
        excerpt: item.content ? item.content.substring(0, 150) + '...' : '',
        content: item.content,
        slug: item.slug,
      }));

      setPosts(transformedPosts);
      setApiCurrentPage(apiResponse.current_page);
      setApiLastPage(apiResponse.last_page);
      setApiLinks(apiResponse.links);

      console.log("Fetched Blog API Response (Current Page Data):", apiResponse);

    } catch (e: any) {
      console.error("Failed to fetch blog posts:", e);
      setError(`Failed to load posts: ${e.message}. Please ensure your Laravel API is running and accessible at ${API_BASE_URL}.`);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchBlogPosts(apiCurrentPage, searchTerm);
  }, [apiCurrentPage, searchTerm, fetchBlogPosts]);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= apiLastPage) {
      setApiCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <BlogNavbar />

      <main className="w-full max-w-4xl mx-auto">
        <BlogPostList
          posts={posts}
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          loading={loading}
          error={error}
        />

        {apiLinks.length > 3 && (
          <BlogPagination
            apiLinks={apiLinks}
            apiCurrentPage={apiCurrentPage}
            apiLastPage={apiLastPage}
            onPaginate={paginate}
          />
        )}
      </main>
    </>
  );
}
