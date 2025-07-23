// src/components/ProgressBar.jsx

// Import React library to create the component.
import React from 'react';

/**
 * ProgressBar component displays a visual progress bar.
 * @param {object} props - The properties passed to the component.
 * @param {number} props.progress - The progress percentage to display (0-100).
 * @returns {JSX.Element} - A JSX element representing the progress bar.
 */
const ProgressBar = ({ progress }) => {
  return (
    <div>
      {/* Container for the progress bar labels */}
      <div className="flex justify-between items-center mb-2">
        {/* Label for the progress bar */}
        <span className="text-gray-700 font-medium">Reading Progress</span>
        {/* Display the progress percentage */}
        <span className="text-blue-600 font-bold">{progress}%</span>
      </div>
      {/* The background of the progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-4">
        {/* The foreground of the progress bar, representing the actual progress */}
        <div
          className="bg-blue-600 h-4 rounded-full"
          style={{ width: `${progress}%` }} // The width is set dynamically based on the progress prop.
        ></div>
      </div>
    </div>
  );
};

// Export the ProgressBar component for use in other parts of the application.
export default ProgressBar;