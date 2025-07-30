import React, { useState, useEffect } from 'react';

// Define a type for your Post objects
interface Post {
  id: number;
  title: string;
  date: string; // published_at
  excerpt: string;
  content: string;
  slug?: string;
}

// Define a type for the API's pagination link objects
interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export default function BlogContent() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [apiCurrentPage, setApiCurrentPage] = useState<number>(1);
  const [apiLastPage, setApiLastPage] = useState<number>(1);
  const [apiLinks, setApiLinks] = useState<PaginationLink[]>([]);

  // Get the base API URL from environment variables
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Function to fetch posts
  const fetchBlogPosts = async (page: number) => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      if (!API_BASE_URL) {
        throw new Error("API_BASE_URL is not defined in environment variables. Please check your .env.local file.");
      }
      const response = await fetch(`${API_BASE_URL}/blogs?page=${page}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiResponse = await response.json();

      // Check if 'data' array exists in the API response
      if (!apiResponse || !Array.isArray(apiResponse.data)) {
        throw new Error("API response did not contain a 'data' array of posts.");
      }

      // Transform the API data to match the frontend's Post interface
      const transformedPosts: Post[] = apiResponse.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        date: item.published_at ? new Date(item.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A',
        excerpt: item.content ? item.content.substring(0, 150) + '...' : '', // Take first 150 chars
        content: item.content,
        slug: item.slug,
      }));

      setPosts(transformedPosts);
      setApiCurrentPage(apiResponse.current_page);
      setApiLastPage(apiResponse.last_page);
      setApiLinks(apiResponse.links);

      console.log("Fetched API Response (Current Page Data):", apiResponse); // Log the full API response for debugging

    } catch (e: any) {
      console.error("Failed to fetch blog posts:", e);
      setError(`Failed to load posts: ${e.message}. Please ensure your Laravel API is running and accessible at ${API_BASE_URL}.`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch posts when component mounts or currentPage changes
  useEffect(() => {
    fetchBlogPosts(currentPage);
  }, [currentPage]); // Dependency array includes currentPage to trigger re-fetch

  // Handle pagination clicks
  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= apiLastPage) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle search filtering
  useEffect(() => {
    if (searchTerm === '') {
      return;
    }
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setPosts(filtered); // Update 'posts' state to show filtered results
  }, [searchTerm]); // Only re-filter when search term changes

  return (
    <>
      {/* Navbar */}
      <nav className="w-full bg-gray-900 text-white p-4 shadow-md mb-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-bold hover:text-blue-300 transition-colors duration-200">My Blog</a>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-blue-300 transition-colors duration-200">Home</a>
            <a href="#" className="hover:text-blue-300 transition-colors duration-200">About</a>
            <a href="#" className="hover:text-blue-300 transition-colors duration-200">Contact</a>
            <a href="/admin" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300">
              Admin Panel
            </a>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Latest Blog Posts</h2>
          <input
            type="text"
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
          />
        </div>

        {error ? (
          <div className="text-center py-10 text-red-600">
            <p className="text-xl">{error}</p>
            <p className="text-lg mt-2">Please ensure your Laravel API is running and accessible.</p>
          </div>
        ) : loading ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-700">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-700">No posts found.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: Post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">{post.date}</p>
                  <p className="text-gray-700 mb-4">{post.excerpt}</p>
                  <details className="text-blue-600 hover:text-blue-800 font-medium">
                    <summary>Read More</summary>
                    <div
                      className="mt-4 text-gray-800 prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                      suppressHydrationWarning={true}
                    ></div>
                  </details>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Server-Side Pagination */}
        {apiLinks.length > 3 && ( // Only show pagination if there are more than just prev/next/current page links
          <div className="flex justify-center items-center space-x-2 mt-12">
            {apiLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => link.url && paginate(parseInt(link.label))}
                disabled={link.url === null || link.active || isNaN(parseInt(link.label))}
                className={`px-4 py-2 rounded-lg shadow-sm transition-colors duration-200
                  ${link.active
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                  ${link.url === null || isNaN(parseInt(link.label)) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
