import React from 'react';
import { PaginationLink } from './Content';

interface BlogPaginationProps {
  apiLinks: PaginationLink[];
  apiCurrentPage: number;
  apiLastPage: number;
  onPaginate: (pageNumber: number) => void;
}

export default function BlogPagination({ apiLinks, apiCurrentPage, apiLastPage, onPaginate }: BlogPaginationProps) {
  return (
    <div className="flex justify-center items-center space-x-2 mt-12">
      {apiLinks.map((link, index) => (
        <button
          key={index}
          onClick={() => {
            // Logic to determine the page number from the link label or URL
            if (link.url) {
              const urlParams = new URLSearchParams(new URL(link.url).search);
              const pageNum = urlParams.get('page');
              if (pageNum) {
                onPaginate(parseInt(pageNum));
              } else if (link.label.includes('Previous') && apiCurrentPage > 1) {
                onPaginate(apiCurrentPage - 1);
              } else if (link.label.includes('Next') && apiCurrentPage < apiLastPage) {
                onPaginate(apiCurrentPage + 1);
              }
            }
          }}
          // Disable buttons if no URL
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
  );
}
