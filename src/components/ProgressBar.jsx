// src/components/ProgressBar.jsx
// Imports the React library.
import React from 'react';
// Defines the ProgressBar functional component, which takes a 'progress' prop (a number from 0 to 100).
const ProgressBar = ({ progress }) => {
  // Returns the JSX for the progress bar component.
  return (
    // The main container for the progress bar.
    <div>
       {/* //A flex container for the label and the percentage text. */}
      <div className="flex justify-between items-center mb-2">
        {/* // The label for the progress bar. */}
        <span className="text-gray-700 font-medium">Reading Progress</span>
        // The text displaying the current progress percentage.
        <span className="text-blue-600 font-bold">{progress}%</span>
      </div>
      {/* // The background of the progress bar. */}
      <div className="w-full bg-gray-200 rounded-full h-4">
        {/* // The filled portion of the progress bar. */}
        <div
          className="bg-blue-600 h-4 rounded-full"
          // The width of this div is set dynamically based on the 'progress' prop, creating the fill effect.
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};
// Exports the ProgressBar component as the default export.
export default ProgressBar;