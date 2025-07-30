// components/AdminSidebar.tsx
import React from 'react';

export default function AdminSidebar() {
  return (
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
  );
}
