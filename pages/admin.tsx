import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';
import PaginationControls from '../components/PaginationControls';

export interface Post {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  slug?: string;
  published_at?: string;
}

export interface PostFormState {
  title: string;
  published_at?: string;
  content: string;
  slug?: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export default function AdminContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [form, setForm] = useState<PostFormState>({ title: '', published_at: '', content: '', slug: '' });

  const [apiCurrentPage, setApiCurrentPage] = useState<number>(1);
  const [apiLastPage, setApiLastPage] = useState<number>(1);
  const [apiLinks, setApiLinks] = useState<PaginationLink[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  };

  const fetchPosts = useCallback(async (page: number, search: string = '') => {
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
        published_at: item.published_at,
      }));

      setPosts(transformedPosts);
      setApiCurrentPage(apiResponse.current_page);
      setApiLastPage(apiResponse.last_page);
      setApiLinks(apiResponse.links);

      console.log("Fetched Admin API Response (Current Page Data):", apiResponse);

    } catch (e: any) {
      console.error("Failed to fetch admin posts:", e);
      setError(`Failed to load posts: ${e.message}. Please ensure your Laravel API is running and accessible at ${API_BASE_URL}.`);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchPosts(apiCurrentPage, searchTerm);
  }, [apiCurrentPage, searchTerm, fetchPosts]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const method = editingPost ? 'PUT' : 'POST';
      const url = editingPost ? `${API_BASE_URL}/blogs/${editingPost.id}` : `${API_BASE_URL}/blogs`;

      const finalSlug = form.slug || generateSlug(form.title);

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          slug: finalSlug,
          published_at: form.published_at || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setMessage(editingPost ? 'Post updated successfully!' : 'Post created successfully!');
      setForm({ title: '', published_at: '', content: '', slug: '' });
      setEditingPost(null);
      fetchPosts(apiCurrentPage, searchTerm);
    } catch (e: any) {
      console.error("Failed to save post:", e);
      setMessage(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      published_at: post.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : '',
      content: post.content,
      slug: post.slug || ''
    });
    setMessage('');
  };

  const handleDelete = async (id: number) => {
    setMessage('');
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setMessage('Post deleted successfully!');
      const newCurrentPage = posts.length === 1 && apiCurrentPage > 1 ? apiCurrentPage - 1 : apiCurrentPage;
      fetchPosts(newCurrentPage, searchTerm);
      if (newCurrentPage !== apiCurrentPage) {
        setApiCurrentPage(newCurrentPage);
      }
    } catch (e: any) {
      console.error("Failed to delete post:", e);
      setMessage(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const paginateAdmin = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= apiLastPage) {
      setApiCurrentPage(pageNumber);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 items-center justify-center">
        <p className="text-xl text-gray-700">Loading admin data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
        <p className="text-lg mt-2 text-gray-700">Please ensure your Laravel API is running and accessible.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          {message && (
            <div className={`p-4 mb-6 rounded-lg ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}

          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Manage Blog Posts</h1>

          <PostForm
            form={form}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            editingPost={editingPost}
            onCancelEdit={() => { setEditingPost(null); setForm({ title: '', published_at: '', content: '', slug: '' }); setMessage(''); }}
          />

          <h2 className="text-3xl font-bold text-gray-800 mb-6">Existing Posts</h2>
          
          <PostList
            posts={posts}
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {apiLinks.length > 3 && (
            <PaginationControls
              apiLinks={apiLinks}
              apiCurrentPage={apiCurrentPage}
              apiLastPage={apiLastPage}
              onPaginate={paginateAdmin}
            />
          )}
        </div>
      </main>
    </div>
  );
}
