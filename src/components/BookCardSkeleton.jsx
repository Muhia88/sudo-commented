// src/components/BookCardSkeleton.jsx
// Imports the React library.
import React from 'react';

// Defines the BookCardSkeleton functional component.
//The BookCardSkeleton is a placeholder component. 
// Its job is to visually mimic the layout of the real BookCard while the actual data is loading. 
// This is a crucial part of creating a good User Experience (UX).
// The animate-pulse class is a Tailwind CSS utility that creates a gentle pulsing effect. 
// This visual cue tells the user, "Content is being loaded here, please wait."
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