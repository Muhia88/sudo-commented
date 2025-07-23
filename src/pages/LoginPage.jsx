// src/pages/LoginPage.jsx

// Import necessary React components and icons.
import React from 'react';
import { FaBookOpen } from 'react-icons/fa'; // Icon from react-icons.
import { FcGoogle } from 'react-icons/fc';   // Google icon from react-icons.

/**
 * LoginPage component provides a user interface for signing in with Google.
 * It displays the application name, a brief description, and a sign-in button.
 * @param {object} props - The properties passed to the component.
 * @param {Function} props.onSignIn - The function to call when the user clicks the sign-in button.
 * @returns {JSX.Element} - A JSX element representing the login page.
 */
const LoginPage = ({ onSignIn }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 text-white p-4">
      <div className="text-center space-y-6 animate-fade-in-up">
        {/* Application icon */}
        <FaBookOpen className="w-24 h-24 mx-auto text-white opacity-90" />

        {/* Application title */}
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          Welcome to ShelfScope
        </h1>

        {/* Application tagline/description */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-blue-100">
          Your personal gateway to a universe of free books. Dive into timeless classics, track your reading progress, and discover your next great read.
        </p>

        {/* Sign-in button container */}
        <div className="pt-4">
          <button
            onClick={onSignIn}
            className="flex items-center justify-center px-6 py-3 mx-auto bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-transform transform hover:scale-105"
          >
            <FcGoogle className="w-6 h-6 mr-3" />
            Sign in with Google to Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;