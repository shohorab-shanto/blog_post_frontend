// components/PaginationControls.tsx
import React from 'react';
import { PaginationLink } from '../pages/admin'; // Import PaginationLink type from main component

interface PaginationControlsProps {
  apiLinks: PaginationLink[];
  apiCurrentPage: number;
  apiLastPage: number;
  onPaginate: (pageNumber: number) => void;
}

export default function PaginationControls({ apiLinks, apiCurrentPage, apiLastPage, onPaginate }: PaginationControlsProps) {
  return (
    <div className="flex justify-center items-center space-x-2 mt-12">
      {apiLinks.map((link, index) => (
        <button
          key={index}
          onClick={() => {
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
