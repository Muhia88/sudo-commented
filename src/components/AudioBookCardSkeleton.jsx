// src/components/AudioBookCardSkeleton.jsx
// Imports the React library.
import React from 'react';

// Defines the AudioBookCardSkeleton functional component. This component doesn't take any props.
const AudioBookCardSkeleton = () => {
  // Returns the JSX for the skeleton loader.
  return (
    // The main container for the skeleton card, with styling that mimics the real card's layout.
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* // A placeholder for the cover image, with a pulsing animation to indicate a loading state. */}
      <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
      {/* // A container for the text content placeholders. */}
      <div className="p-4">
        {/* // A placeholder for the book title. */}
        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
        {/* // A placeholder for the author's name. */}
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

// Exports the AudioBookCardSkeleton component as the default export.
export default AudioBookCardSkeleton;