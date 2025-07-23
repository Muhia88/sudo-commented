// src/pages/ChoosePath.jsx

// Import necessary React components and icons.
import React from 'react';
import { Link } from 'react-router-dom'; // For navigation between pages.
import { FaBook, FaHeadphones, FaSignOutAlt } from 'react-icons/fa'; // Icons from react-icons.

/**
 * ChoosePath component provides users with a choice to navigate to either
 * the "Read" section or the "Listen" section of the application.
 * It also includes a sign-out button.
 * @param {object} props - The properties passed to the component.
 * @param {Function} props.onSignOut - The function to call when the user clicks the sign-out button.
 * @returns {JSX.Element} - A JSX element representing the path selection page.
 */
const ChoosePath = ({ onSignOut }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Sign-out button positioned at the top-left of the page. */}
      <div className="absolute top-4 left-4">
        <button
          onClick={onSignOut}
          className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-colors"
        >
          <FaSignOutAlt className="mr-2" />
          Sign Out
        </button>
      </div>

      {/* Page title and subtitle. */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Choose Your Journey</h1>
        <p className="text-lg text-gray-600 mt-2">How would you like to explore today?</p>
      </div>

      {/* Container for the choice cards. */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Card for the "Read" path. */}
        <Link to="/" className="group">
          <div className="w-72 h-80 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center text-center transform hover:-translate-y-2 transition-transform duration-300">
            <FaBook className="w-24 h-24 text-blue-500 mb-6 group-hover:text-blue-600 transition-colors" />
            <h2 className="text-3xl font-bold text-gray-800">Read</h2>
            <p className="text-gray-500 mt-2">Dive into the pages of classic literature.</p>
          </div>
        </Link>

        {/* Card for the "Listen" path. */}
        <Link to="/listen" className="group">
          <div className="w-72 h-80 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center text-center transform hover:-translate-y-2 transition-transform duration-300">
            <FaHeadphones className="w-24 h-24 text-purple-500 mb-6 group-hover:text-purple-600 transition-colors" />
            <h2 className="text-3xl font-bold text-gray-800">Listen</h2>
            <p className="text-gray-500 mt-2">Enjoy a vast collection of free audiobooks.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ChoosePath;