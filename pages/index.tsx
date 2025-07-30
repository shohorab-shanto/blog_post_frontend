    import React, { useEffect } from 'react';
    import dynamic from 'next/dynamic';

    const BlogContent = dynamic(() => import('../components/client/Content'), { ssr: false });

    export default function App() {
      useEffect(() => {
        document.title = 'My React Blog';
      }, []);

      return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-0 px-0 sm:px-0 lg:px-0">
          <BlogContent />

          <footer className="w-full max-w-4xl text-center mt-12 py-6 border-t border-gray-300 text-gray-600 mx-auto">
            &copy; {new Date().getFullYear()} My React Blog. All rights reserved.
          </footer>
        </div>
      );
    }
    