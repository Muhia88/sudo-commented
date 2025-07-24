// src/pages/ErrorPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

/**
 * ErrorPage component is displayed when a user navigates to a URL
 * that does not match any of the defined routes.
 * @returns {JSX.Element} - A JSX element for the 404 Not Found page.
 */
const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <FaExclamationTriangle className="w-16 h-16 text-yellow-500 mb-4" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
      >
        Go Back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;