import React, { useState, useEffect } from 'react';

interface Post {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  slug?: string;
  published_at?: string;
}

interface PostForm {
  title: string;
  published_at?: string;
  content: string;
  slug?: string;
}

interface PaginationLink {
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
  const [form, setForm] = useState<PostForm>({ title: '', published_at: '', content: '', slug: '' });

  const [apiCurrentPage, setApiCurrentPage] = useState<number>(1);
  const [apiLastPage, setApiLastPage] = useState<number>(1);
  const [apiLinks, setApiLinks] = useState<PaginationLink[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // base API URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  };

  // Function to fetch posts from the API with a specific page number and optional search term
  const fetchPosts = async (page: number, search: string = '') => {
    setLoading(true);
    setError(null); // Clear previous errors
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
      const apiResponse = await response.json(); // Get the full API response object

      if (!apiResponse || !Array.isArray(apiResponse.data)) {
        throw new Error("API response did not contain a 'data' array of posts.");
      }

      // Transform the API data to match the frontend's Post interface
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
  };

  // Fetch posts on component mount or when apiCurrentPage/searchTerm changes
  useEffect(() => {
    fetchPosts(apiCurrentPage, searchTerm);
  }, [apiCurrentPage, searchTerm]); // Trigger re-fetch when page or search term changes

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle adding a new post or updating an existing one
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

      const result = await response.json();
       (editingPost ? 'Post updated successfully!' : 'Post created successfully!');
      setForm({ title: '', published_at: '', content: '', slug: '' });
      setEditingPost(null);
      fetchPosts(apiCurrentPage, searchTerm); // Refresh the list, staying on current page
    } catch (e: any) {
      console.error("Failed to save post:", e);
      setMessage(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Set form for editing
  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      // Format the API's ISO string to 'YYYY-MM-DDTHH:MM' for datetime-local input
      published_at: post.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : '',
      content: post.content,
      slug: post.slug || ''
    });
    setMessage('');
  };

  // Handle deleting a post
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

  // Handle pagination
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
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-800 text-white p-6 flex flex-col shadow-lg">
        <div className="text-2xl font-bold mb-8 text-center md:text-left">Admin Dashboard</div>
        <nav className="flex-1">
          <ul>
            <li className="mb-4">
              <a href="#" className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 font-medium">
                <span className="mr-3">📊</span> Dashboard
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center p-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md">
                <span className="mr-3">📝</span> Manage Posts
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 font-medium">
                <span className="mr-3">⚙️</span> Settings
              </a>
            </li>
          </ul>
        </nav>
        <div className="mt-auto text-center md:text-left">
          <a href="/" className="inline-block px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300">
            Back to Blog
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          {message && (
            <div className={`p-4 mb-6 rounded-lg ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}

          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Manage Blog Posts</h1>

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
                <button type="button" onClick={() => { setEditingPost(null); setForm({ title: '', published_at: '', content: '', slug: '' }); setMessage(''); }} className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Cancel Edit</button>
              )}
              <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                {editingPost ? 'Update Post' : 'Add Post'}
              </button>
            </div>
          </form>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">Existing Posts</h2>
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search admin posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                <div key={post.id} className="bg-gray-50 p-6 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">Published: {post.date}</p>
                    <p className="text-gray-700">{post.excerpt}</p>
                  </div>
                  <div className="flex space-x-3 mt-4 sm:mt-0">
                    <button onClick={() => handleEdit(post)} className="px-4 py-2 bg-yellow-500 text-white font-medium rounded-md shadow-sm hover:bg-yellow-600 transition-colors duration-300">Edit</button>
                    <button onClick={() => handleDelete(post.id)} className="px-4 py-2 bg-red-600 text-white font-medium rounded-md shadow-sm hover:bg-red-700 transition-colors duration-300">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {apiLinks.length > 3 && (
            <div className="flex justify-center items-center space-x-2 mt-12">
              {apiLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (link.url) {
                      const urlParams = new URLSearchParams(new URL(link.url).search);
                      const pageNum = urlParams.get('page');
                      if (pageNum) {
                        paginateAdmin(parseInt(pageNum));
                      } else if (link.label.includes('Previous') && apiCurrentPage > 1) {
                        paginateAdmin(apiCurrentPage - 1);
                      } else if (link.label.includes('Next') && apiCurrentPage < apiLastPage) {
                        paginateAdmin(apiCurrentPage + 1);
                      }
                    }
                  }}
                  disabled={link.url === null || link.active}
                  className={`px-4 py-2 rounded-lg shadow-sm transition-colors duration-200
                    ${link.active
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                    ${link.url === null ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
