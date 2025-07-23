// src/components/BookCardSkeleton.jsx
// Imports the React library.
import React from 'react';

// Defines the BookCardSkeleton functional component.
const BookCardSkeleton = () => {
  // Returns the JSX for the skeleton loader, which mimics the structure of the BookCard.
  return (
    // The main container for the skeleton card.
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* // A placeholder for the cover image with a pulsing animation. */}
      <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
      {/* // A container for the text placeholders. */}
      <div className="p-4">
        {/* // A placeholder for the book title. */}
        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
        {/* // A placeholder for the author's name. */}
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

// Exports the BookCardSkeleton component.
export default BookCardSkeleton;