// src/components/BookReader.jsx
// Imports the React library.
import React from 'react';

// Defines the BookReader component, which receives props for managing book pages.
const BookReader = ({ pages, currentPage, onPageChange, totalPages, isLoading }) => {
  // Function to navigate to the next page, ensuring it doesn't go past the total number of pages.
  const goToNextPage = () => {
    onPageChange(Math.min(currentPage + 1, totalPages));
  };

  // Function to navigate to the previous page, ensuring it doesn't go below page 1.
  const goToPreviousPage = () => {
    onPageChange(Math.max(currentPage - 1, 1));
  };
  
  // If the book content is still loading, it displays a loading indicator.
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-inner flex flex-col items-center justify-center h-[32rem]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading book content...</p>
      </div>
    );
  }

  // Returns the JSX for the reader interface.
  return (
    <div className="bg-white p-6 rounded-lg shadow-inner">
      <h2 className="text-2xl font-bold mb-4">Read the Book</h2>
      
      {/* // Displays the current page number out of the total pages. */}
      <div className="mb-4 text-center">
        <p className="text-gray-600">Page {currentPage} of {totalPages}</p>
      </div>

      {/* // The main content area where the text of the current page is displayed. */}
      <div className="h-96 overflow-y-auto p-4 border rounded whitespace-pre-wrap font-serif leading-relaxed">
        {/* Accesses the content for the current page from the 'pages' array. */}
        {pages[currentPage - 1]}
      </div>

      {/* // A container for the navigation buttons. */}
      <div className="flex justify-between items-center mt-4">
        {/* // The "Previous" button, which is disabled if on the first page. */}
        <button
          onClick={goToPreviousPage}
          disabled={currentPage <= 1}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          &larr; Previous
        </button>
        {/* // The "Next" button, which is disabled if on the last page. */}
        <button
          onClick={goToNextPage}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
};

// Exports the BookReader component.
export default BookReader;