// components/BlogNavbar.tsx
import React from 'react';

export default function BlogNavbar() {
  return (
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
  );
}
